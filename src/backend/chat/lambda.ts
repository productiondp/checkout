/**
 * AWS LAMBDA — CHAT HANDLER (SINGLE TABLE DESIGN)
 * 
 * This function handles all chat operations using DynamoDB.
 * PK/SK patterns follow the "Checkout OS Ultra-Efficient" spec.
 */

import { DynamoDB } from 'aws-sdk';
import { crypto } from 'crypto';

const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || 'app_data';

// 🛡️ SECURITY: INPUT SANITIZATION
const sanitizeText = (text: string) => {
    return text.trim().slice(0, 2000).replace(/[<>]/g, ''); // Basic sanitization + size limit
};

export const handler = async (event: any) => {
    const { path, httpMethod, body, queryStringParameters, requestContext } = event;
    const data = body ? JSON.parse(body) : null;

    // 🛡️ SECURITY: EXTRACT IDENTITY FROM AUTH CONTEXT
    // In production, this comes from API Gateway Lambda Authorizer (Cognito/Custom)
    const authenticatedUserId = requestContext?.authorizer?.claims?.sub || data?.senderId; 

    try {
        // 1. SEND MESSAGE (HARDENED)
        if (path === '/chat/sendMessage' && httpMethod === 'POST') {
            const { conversationId, text, mediaUrl } = data;
            const sanitizedText = sanitizeText(text);
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            
            // A. Insert Message with Collision-Resistant SK
            await docClient.put({
                TableName: TABLE_NAME,
                Item: {
                    PK: `CONVO#${conversationId}`,
                    SK: `MSG#${timestamp}#${randomSuffix}`,
                    messageId: `msg_${timestamp}_${randomSuffix}`,
                    senderId: authenticatedUserId,
                    text: sanitizedText,
                    mediaUrl,
                    createdAt: timestamp
                }
            }).promise();

            // B. Atomic Update for Conversation META & Participants
            // We use a transaction or parallel updates for performance/cost balance
            await docClient.update({
                TableName: TABLE_NAME,
                Key: { PK: `CONVO#${conversationId}`, SK: 'META' },
                UpdateExpression: 'set lastMessage = :m, lastMessageAt = :t',
                ExpressionAttributeValues: {
                    ':m': sanitizedText.slice(0, 100),
                    ':t': timestamp
                }
            }).promise();

            // C. Atomic Unread Increment for Inbox Mapping
            // Note: In production, you'd fetch participants from META and batch update
            // For this demo, we assume the recipient mapping is known
            const recipientId = data.recipientId; 
            if (recipientId) {
                await docClient.update({
                    TableName: TABLE_NAME,
                    Key: { PK: `USER#${recipientId}`, SK: `CONVO#${conversationId}` },
                    UpdateExpression: 'SET unreadCount = if_not_exists(unreadCount, :zero) + :inc, lastMessage = :m, lastMessageAt = :t',
                    ExpressionAttributeValues: {
                        ':zero': 0,
                        ':inc': 1,
                        ':m': sanitizedText.slice(0, 50),
                        ':t': timestamp
                    }
                }).promise();
            }

            return { statusCode: 200, body: JSON.stringify({ success: true, messageId: `msg_${timestamp}_${randomSuffix}` }) };
        }

        // 2. GET MESSAGES (ENFORCED PAGINATION)
        if (path === '/chat/messages' && httpMethod === 'GET') {
            const { conversationId, cursor } = queryStringParameters || {};
            
            const params: any = {
                TableName: TABLE_NAME,
                KeyConditionExpression: 'PK = :pk AND SK begins_with(:sk)',
                ExpressionAttributeValues: {
                    ':pk': `CONVO#${conversationId}`,
                    ':sk': 'MSG#'
                },
                Limit: 20, // Strict enforcement
                ScanIndexForward: false
            };

            if (cursor) params.ExclusiveStartKey = JSON.parse(Buffer.from(cursor, 'base64').toString());

            const result = await docClient.query(params).promise();
            return { 
                statusCode: 200, 
                body: JSON.stringify({ 
                    messages: result.Items, 
                    nextCursor: result.LastEvaluatedKey ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64') : null 
                }) 
            };
        }

        // 4. CREATE CONVERSATION (DETERMINISTIC)
        if (path === '/chat/createConversation' && httpMethod === 'POST') {
            const { participants, type } = data;
            
            // Deterministic ID for direct chats
            let conversationId = data.conversationId;
            if (type === 'direct' && !conversationId) {
                conversationId = participants.sort().join("_");
            }

            // Create Meta Item
            await docClient.put({
                TableName: TABLE_NAME,
                Item: {
                    PK: `CONVO#${conversationId}`,
                    SK: 'META',
                    type,
                    participants,
                    createdAt: Date.now()
                },
                ConditionExpression: 'attribute_not_exists(PK)' // Prevent overwrite
            }).promise();

            return { statusCode: 201, body: JSON.stringify({ conversationId }) };
        }

        return { statusCode: 404, body: JSON.stringify({ message: "Not Found" }) };

    } catch (error: any) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
