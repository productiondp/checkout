/**
 * AWS LAMBDA — WEBSOCKET HANDLERS
 * 
 * Manages connection lifecycle and real-time message broadcasting.
 */

import { DynamoDB, ApiGatewayManagementApi } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || 'app_data';

export const handler = async (event: any) => {
    const { routeKey, connectionId } = event.requestContext;
    const body = event.body ? JSON.parse(event.body) : null;

    try {
        // 1. $connect — Store connection mapping
        if (routeKey === '$connect') {
            const userId = event.queryStringParameters?.userId;
            if (!userId) return { statusCode: 400, body: "UserId required" };

            // A. Store connection metadata
            await docClient.put({
                TableName: TABLE_NAME,
                Item: {
                    PK: `WS#CONNECTION#${connectionId}`,
                    SK: 'META',
                    userId,
                    connectedAt: Date.now()
                }
            }).promise();

            // B. Create User-to-Connection mapping (for broadcasting)
            await docClient.put({
                TableName: TABLE_NAME,
                Item: {
                    PK: `USER#${userId}`,
                    SK: `WS#${connectionId}`,
                    connectedAt: Date.now()
                }
            }).promise();

            return { statusCode: 200, body: 'Connected' };
        }

        // 2. $disconnect — Remove connection mapping
        if (routeKey === '$disconnect') {
            const { Item: connection } = await docClient.get({
                TableName: TABLE_NAME,
                Key: { PK: `WS#CONNECTION#${connectionId}`, SK: 'META' }
            }).promise();

            if (connection) {
                await docClient.delete({
                    TableName: TABLE_NAME,
                    Key: { PK: `USER#${connection.userId}`, SK: `WS#${connectionId}` }
                }).promise();
            }

            await docClient.delete({
                TableName: TABLE_NAME,
                Key: { PK: `WS#CONNECTION#${connectionId}`, SK: 'META' }
            }).promise();

            return { statusCode: 200, body: 'Disconnected' };
        }

        // 3. MESSAGE ROUTING (FOR TYPING INDICATORS)
        if (routeKey === 'message') {
            const { type, conversationId, participants } = body;
            
            if (type === 'TYPING_START' || type === 'TYPING_STOP') {
                const apigw = new ApiGatewayManagementApi({ endpoint: process.env.WS_ENDPOINT });
                
                for (const userId of participants) {
                    // Don't send back to the sender
                    const { Item: connection } = await docClient.get({
                        TableName: TABLE_NAME,
                        Key: { PK: `WS#CONNECTION#${connectionId}`, SK: 'META' }
                    }).promise();
                    if (connection?.userId === userId) continue;

                    const connections = await docClient.query({
                        TableName: TABLE_NAME,
                        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
                        ExpressionAttributeValues: { ':pk': `USER#${userId}`, ':sk': 'WS#' }
                    }).promise();

                    if (connections.Items) {
                        for (const conn of connections.Items) {
                            const cid = conn.SK.split('#')[1];
                            try {
                                await apigw.postToConnection({
                                    ConnectionId: cid,
                                    Data: JSON.stringify({ type, conversationId, userId: connection?.userId })
                                }).promise();
                            } catch (err: any) {
                                if (err.statusCode === 410) {
                                    await docClient.delete({ TableName: TABLE_NAME, Key: { PK: `USER#${userId}`, SK: `WS#${cid}` } }).promise();
                                }
                            }
                        }
                    }
                }
            }
            return { statusCode: 200, body: 'OK' };
        }

        // 4. BROADCAST TRIGGER (Existing)
        if (event.source === 'internal.broadcast') {
            const { conversationId, participants, message } = event.detail;

            const apigw = new ApiGatewayManagementApi({
                endpoint: process.env.WS_ENDPOINT
            });

            for (const userId of participants) {
                // Fetch all active connections for this user
                const connections = await docClient.query({
                    TableName: TABLE_NAME,
                    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
                    ExpressionAttributeValues: {
                        ':pk': `USER#${userId}`,
                        ':sk': 'WS#'
                    }
                }).promise();

                if (connections.Items) {
                    for (const conn of connections.Items) {
                        const cid = conn.SK.split('#')[1];
                        try {
                            await apigw.postToConnection({
                                ConnectionId: cid,
                                Data: JSON.stringify({
                                    type: "NEW_MESSAGE",
                                    conversationId,
                                    message
                                })
                            }).promise();
                        } catch (err: any) {
                            if (err.statusCode === 410) {
                                // Cleanup stale connection
                                await docClient.delete({ TableName: TABLE_NAME, Key: { PK: `USER#${userId}`, SK: `WS#${cid}` } }).promise();
                            }
                        }
                    }
                }
            }
        }

        return { statusCode: 200, body: 'OK' };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};
