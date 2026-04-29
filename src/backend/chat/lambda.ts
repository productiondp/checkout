/**
 * AWS LAMBDA — CHAT HANDLER (SINGLE TABLE DESIGN)
 * 
 * This function handles all chat operations using DynamoDB.
 * PK/SK patterns follow the "Checkout OS Ultra-Efficient" spec.
 */

import { DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || 'app_data';

export const handler = async (event: any) => {
    const { path, httpMethod, body, queryStringParameters } = event;
    const data = body ? JSON.parse(body) : null;

    try {
        // 1. SEND MESSAGE
        if (path === '/chat/sendMessage' && httpMethod === 'POST') {
            const { conversationId, senderId, text, mediaUrl } = data;
            const timestamp = Date.now();

            // A. Insert Message
            await docClient.put({
                TableName: TABLE_NAME,
                Item: {
                    PK: `CONVO#${conversationId}`,
                    SK: `MSG#${timestamp}`,
                    messageId: `msg_${timestamp}_${senderId}`,
                    senderId,
                    text,
                    mediaUrl,
                    createdAt: timestamp
                }
            }).promise();

            // B. Update Conversation Meta
            await docClient.update({
                TableName: TABLE_NAME,
                Key: { PK: `CONVO#${conversationId}`, SK: 'META' },
                UpdateExpression: 'set lastMessage = :m, lastMessageAt = :t',
                ExpressionAttributeValues: {
                    ':m': text.slice(0, 50),
                    ':t': timestamp
                }
            }).promise();

            // C. Update Inbox Mapping for all participants (Simplified for Lambda demo)
            // In a real scenario, you'd loop through participants or use a BatchWrite
            return { statusCode: 200, body: JSON.stringify({ success: true, timestamp }) };
        }

        // 2. GET MESSAGES (PAGINATED)
        if (path === '/chat/messages' && httpMethod === 'GET') {
            const { conversationId, cursor } = queryStringParameters || {};
            
            const params: any = {
                TableName: TABLE_NAME,
                KeyConditionExpression: 'PK = :pk AND SK begins_with(:sk)',
                ExpressionAttributeValues: {
                    ':pk': `CONVO#${conversationId}`,
                    ':sk': 'MSG#'
                },
                Limit: 20,
                ScanIndexForward: false // Newest first
            };

            if (cursor) params.ExclusiveStartKey = JSON.parse(Buffer.from(cursor, 'base64').toString());

            const result = await docClient.query(params).promise();
            const nextCursor = result.LastEvaluatedKey 
                ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64') 
                : null;

            return { statusCode: 200, body: JSON.stringify({ messages: result.Items, nextCursor }) };
        }

        // 3. GET CONVERSATIONS
        if (path === '/chat/conversations' && httpMethod === 'GET') {
            const { userId } = queryStringParameters || {};

            const result = await docClient.query({
                TableName: TABLE_NAME,
                KeyConditionExpression: 'PK = :pk AND SK begins_with(:sk)',
                ExpressionAttributeValues: {
                    ':pk': `USER#${userId}`,
                    ':sk': 'CONVO#'
                }
            }).promise();

            return { statusCode: 200, body: JSON.stringify(result.Items) };
        }

        return { statusCode: 404, body: JSON.stringify({ message: "Not Found" }) };

    } catch (error: any) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
