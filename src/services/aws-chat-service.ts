/**
 * AWS SERVERLESS CHAT SERVICE (ULTRA-EFFICIENT)
 * 
 * This service interacts with the AWS Lambda/API Gateway backend.
 * Designed for low cost, high scalability, and zero regression.
 */

import { db } from "@/lib/db/provider";
import { analytics } from "@/utils/analytics";

// --- AWS CHAT SAFE SWITCH ---
const USE_AWS_CHAT = false;
const AWS_API = "https://pzpl7spjjf.execute-api.ap-south-1.amazonaws.com";
// ----------------------------

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

export class ChatService {
  /**
   * 🛡️ DETERMINISTIC ID GENERATION
   */
  static getDeterministicId(participants: string[]): string {
    return participants.sort().join("_");
  }

  /**
   * 📨 Send a new message
   */
  static async sendMessage(conversationId: string, senderId: string, text: string, recipientId?: string, mediaUrl?: string) {
    if (USE_AWS_CHAT) {
      return fetch(`${AWS_API}/chat/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          conversationId,
          senderId,
          text,
          recipientId,
          mediaUrl
        })
      });
    } else {
      analytics.track('CHAT_MESSAGE_SENT', senderId);
      return await db.sendMessage(conversationId, senderId, text, recipientId, mediaUrl);
    }
  }

  /**
   * 📖 Fetch paginated messages
   */
  static async getMessages(conversationId: string, cursor?: string) {
    if (USE_AWS_CHAT) {
      const res = await fetch(
        `${AWS_API}/chat/messages?conversationId=${conversationId}${cursor ? `&cursor=${cursor}` : ''}`
      );
      return res.json();
    } else {
      return await db.getMessages(conversationId, cursor);
    }
  }

  /**
   * 📬 Get all user conversations
   */
  static async getConversations(userId: string) {
    return await db.getConversations(userId);
  }

  /**
   * 🤝 Initialize or retrieve a conversation
   */
  static async createConversation(participants: string[], type: "direct" | "group" = "direct") {
    return await db.createConversation(participants, type);
  }

  /**
   * 👀 Update Seen Status
   */
  static async updateSeen(conversationId: string, userId: string) {
    return await db.updateSeen(conversationId, userId);
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

// Export as AwsChatService for backward compatibility if needed, but the app should use ChatService
export const AwsChatService = ChatService;
