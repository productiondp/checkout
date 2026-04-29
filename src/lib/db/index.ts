/**
 * DATABASE INTERFACE — UNIFIED ADAPTER
 * 
 * Defines the standard contract for all chat operations.
 * Allows the app to be database-agnostic.
 */

export interface ChatMessage {
  messageId: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  createdAt: number;
  status?: 'SENDING' | 'SENT' | 'DELIVERED' | 'SEEN';
}

export interface ChatConversation {
  conversationId: string;
  type: "direct" | "group";
  participants: string[];
  lastMessage: string;
  lastMessageAt: number;
  unreadCount?: number;
  lastSeenAt?: number;
}

export interface ChatDBAdapter {
  sendMessage(conversationId: string, senderId: string, text: string, recipientId?: string, mediaUrl?: string): Promise<{ success: boolean; messageId: string }>;
  getMessages(conversationId: string, cursor?: string): Promise<{ messages: ChatMessage[]; nextCursor: string | null }>;
  getConversations(userId: string): Promise<ChatConversation[]>;
  createConversation(participants: string[], type: "direct" | "group"): Promise<{ conversationId: string }>;
  updateSeen(conversationId: string, userId: string): Promise<void>;
}
