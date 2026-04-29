/**
 * SUPABASE ADAPTER (LOCAL / DEVELOPMENT)
 * 
 * Implements the ChatDBAdapter interface using Supabase.
 */

import { createClient } from "@/utils/supabase/client";
import { ChatDBAdapter, ChatMessage, ChatConversation } from "./index";

export class SupabaseChatAdapter implements ChatDBAdapter {
  private supabase = createClient();

  async sendMessage(conversationId: string, senderId: string, text: string, recipientId?: string, mediaUrl?: string) {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        connection_id: conversationId,
        sender_id: senderId,
        receiver_id: recipientId,
        content: text,
        media_url: mediaUrl,
        type: 'TEXT'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, messageId: data.id };
  }

  async getMessages(conversationId: string, cursor?: string) {
    let query = this.supabase
      .from('messages')
      .select('*')
      .eq('connection_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;
    if (error) throw error;

    const messages: ChatMessage[] = data.map(m => ({
      messageId: m.id,
      senderId: m.sender_id,
      text: m.content,
      mediaUrl: m.media_url,
      createdAt: new Date(m.created_at).getTime(),
      status: m.is_read ? 'SEEN' : 'SENT'
    }));

    return {
      messages,
      nextCursor: data.length === 20 ? data[data.length - 1].created_at : null
    };
  }

  async getConversations(userId: string) {
    const { data, error } = await this.supabase
      .from('connections')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(c => ({
      conversationId: c.id,
      type: "direct",
      participants: [c.sender_id, c.receiver_id],
      lastMessage: c.last_message || "",
      lastMessageAt: new Date(c.updated_at).getTime(),
      unreadCount: 0 // Logic for this can be added later
    }));
  }

  async createConversation(participants: string[], type: "direct" | "group") {
    const { data, error } = await this.supabase
      .from('connections')
      .insert({
        sender_id: participants[0],
        receiver_id: participants[1],
        status: 'ACCEPTED'
      })
      .select()
      .single();

    if (error) throw error;
    return { conversationId: data.id };
  }

  async updateSeen(conversationId: string, userId: string) {
    await this.supabase
      .from('messages')
      .update({ is_read: true })
      .eq('connection_id', conversationId)
      .eq('receiver_id', userId);
  }
}
