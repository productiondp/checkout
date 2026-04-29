/**
 * AWS SERVERLESS CHAT SERVICE (ULTRA-EFFICIENT)
 * 
 * This service interacts with the AWS Lambda/API Gateway backend.
 * Designed for low cost, high scalability, and zero regression.
 */

import { analytics } from "@/utils/analytics";

const AWS_CHAT_API_URL = process.env.NEXT_PUBLIC_AWS_CHAT_API_URL || "";

export interface AwsMessage {
  messageId: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  createdAt: number;
}

export interface AwsConversation {
  conversationId: string;
  type: "direct" | "group";
  participants: string[];
  lastMessage: string;
  lastMessageAt: number;
  unreadCount?: number;
  lastSeenAt?: number;
}

export class AwsChatService {
  /**
   * 🛡️ DETERMINISTIC ID GENERATION
   */
  static getDeterministicId(participants: string[]): string {
    return participants.sort().join("_");
  }

  /**
   * 📨 Send a new message (Hardened)
   */
  static async sendMessage(conversationId: string, senderId: string, text: string, recipientId?: string, mediaUrl?: string) {
    try {
      const response = await fetch(`${AWS_CHAT_API_URL}/chat/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, senderId, text, recipientId, mediaUrl }),
      });
      
      const data = await response.json();
      analytics.track('AWS_CHAT_MESSAGE_SENT', senderId);
      return data;
    } catch (error) {
      console.error("[AWS CHAT] Send Message Failed:", error);
      throw error;
    }
  }

  /**
   * 📖 Fetch paginated messages
   */
  static async getMessages(conversationId: string, cursor?: string) {
    try {
      const url = new URL(`${AWS_CHAT_API_URL}/chat/messages`);
      url.searchParams.append('conversationId', conversationId);
      if (cursor) url.searchParams.append('cursor', cursor);

      const response = await fetch(url.toString());
      return await response.json();
    } catch (error) {
      console.error("[AWS CHAT] Get Messages Failed:", error);
      return { messages: [], nextCursor: null };
    }
  }

  /**
   * 📬 Get all user conversations
   */
  static async getConversations(userId: string) {
    try {
      const response = await fetch(`${AWS_CHAT_API_URL}/chat/conversations?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error("[AWS CHAT] Get Conversations Failed:", error);
      return [];
    }
  }

  /**
   * 🤝 Initialize or retrieve a conversation
   */
  static async createConversation(participants: string[], type: "direct" | "group" = "direct") {
    try {
      const response = await fetch(`${AWS_CHAT_API_URL}/chat/createConversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants, type }),
      });
      return await response.json();
    } catch (error) {
      console.error("[AWS CHAT] Create Conversation Failed:", error);
    }
  }

  /**
   * 👀 Update Seen Status
   */
  static async updateSeen(conversationId: string, userId: string) {
    try {
      await fetch(`${AWS_CHAT_API_URL}/chat/updateSeen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, userId }),
      });
    } catch (error) {
      console.error("[AWS CHAT] Update Seen Failed:", error);
    }
  }

  /**
   * 📡 Send WebSocket Message (Typing, etc.)
   */
  static sendWebSocketEvent(socket: WebSocket | null, type: string, conversationId: string, participants: string[]) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({
      action: "message", // API Gateway route
      type,
      conversationId,
      participants
    }));
  }
}
