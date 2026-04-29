/**
 * DYNAMODB ADAPTER (PRODUCTION)
 * 
 * Implements the ChatDBAdapter interface using the AWS Serverless Chat API.
 */

import { ChatDBAdapter, ChatMessage, ChatConversation } from "./index";

const AWS_CHAT_API_URL = process.env.NEXT_PUBLIC_AWS_CHAT_API_URL || "";

export class DynamoDBChatAdapter implements ChatDBAdapter {
  async sendMessage(conversationId: string, senderId: string, text: string, recipientId?: string, mediaUrl?: string) {
    const response = await fetch(`${AWS_CHAT_API_URL}/chat/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, senderId, text, recipientId, mediaUrl }),
    });
    const data = await response.json();
    return { success: true, messageId: data.messageId };
  }

  async getMessages(conversationId: string, cursor?: string) {
    const url = new URL(`${AWS_CHAT_API_URL}/chat/messages`);
    url.searchParams.append('conversationId', conversationId);
    if (cursor) url.searchParams.append('cursor', cursor);

    const response = await fetch(url.toString());
    const data = await response.json();

    return {
      messages: data.messages as ChatMessage[],
      nextCursor: data.nextCursor
    };
  }

  async getConversations(userId: string) {
    const response = await fetch(`${AWS_CHAT_API_URL}/chat/conversations?userId=${userId}`);
    const data = await response.json();
    return data as ChatConversation[];
  }

  async createConversation(participants: string[], type: "direct" | "group") {
    const response = await fetch(`${AWS_CHAT_API_URL}/chat/createConversation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participants, type }),
    });
    const data = await response.json();
    return { conversationId: data.conversationId };
  }

  async updateSeen(conversationId: string, userId: string) {
    await fetch(`${AWS_CHAT_API_URL}/chat/updateSeen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, userId }),
    });
  }
}
