const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { conversationId, senderId, text } = body;
    const timestamp = Date.now();

    const item = {
      PK: `CONVO#${conversationId}`,
      SK: `MSG#${timestamp}`,
      messageId: timestamp.toString(),
      senderId,
      text,
      createdAt: timestamp,
    };

    await dynamo.put({
      TableName: process.env.TABLE_NAME,
      Item: item,
    }).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({ success: true, messageId: item.messageId }),
    };
  } catch (error) {
    console.error("Lambda Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
