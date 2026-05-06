import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const ChatService = {
  // 1. CONVERSATION MANAGEMENT
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversation_members')
      .select(`
        conversation:conversations (
          *,
          last_message_content,
          last_message_sender_id,
          members:conversation_members (
            user_id,
            last_read_at,
            profile:profiles (id, full_name, avatar_url)
          )
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    
    return (data || []).map(d => {
      const conv = d.conversation as any;
      if (conv.type === 'DM') {
        const partner = conv.members?.find((m: any) => m.user_id !== userId)?.profile;
        conv.title = partner?.full_name || "Account";
        conv.avatar_url = partner?.avatar_url;
      }
      return conv;
    }).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
  },

  /**
   * LEGACY BRIDGE: Ensures old connections appear in the new system
   */
  async syncLegacyConnections(userId: string) {
    console.log(`[ChatSync] Starting sync for user: ${userId}`);
    const { data: connections, error: cErr } = await supabase
      .from('connections')
      .select('id, sender_id, receiver_id')
      .eq('status', 'ACCEPTED')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (cErr) {
      console.error("[ChatSync] Connection fetch failed:", cErr);
      return;
    }

    console.log(`[ChatSync] Found ${connections?.length || 0} legacy connections to check.`);

    if (!connections) return;

    for (const conn of connections) {
      try {
        const partnerId = conn.sender_id === userId ? conn.receiver_id : conn.sender_id;
        await this.ensureDirectConversation(userId, partnerId);
      } catch (e) {
        console.warn(`[ChatSync] Failed to sync connection ${conn.id}:`, e);
      }
    }
  },

  async ensureDirectConversation(userId: string, partnerId: string) {
    // 1. Robust Search
    const { data: convs } = await supabase
      .from('conversations')
      .select('*, members:conversation_members(user_id)')
      .eq('type', 'DM');

    // Find a conversation where BOTH are members
    const existing = convs?.find(c => {
      const uids = (c.members || []).map((m: any) => m.user_id);
      return uids.includes(userId) && uids.includes(partnerId);
    });

    if (existing) return existing;
    
    // 2. Create if absolutely not found
    console.log(`[ChatService] Creating new DM for ${userId} and ${partnerId}`);
    const { data: conv, error: cErr } = await supabase
      .from('conversations')
      .insert({ type: 'DM', created_by: userId })
      .select()
      .single();

    if (cErr) throw cErr;

    // Add members
    await supabase.from('conversation_members').insert([
      { conversation_id: conv.id, user_id: userId },
      { conversation_id: conv.id, user_id: partnerId }
    ]);

    return conv;
  },

  // 2. MESSAGING
  async sendMessage(convId: string, senderId: string, content: string, type: 'TEXT' | 'MEDIA' | 'VOICE' = 'TEXT', metadata: any = {}) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: convId,
        sender_id: senderId,
        content,
        type,
        metadata
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation heartbeat
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', convId);

    return data;
  },

  async getMessages(convId: string, limit = 50, offset = 0) {
    // 1. Primary Fetch (Official Schema)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // 2. Recovery Fetch (Orphaned Messages)
    // If we have few messages, check if there are legacy ones for this conversation's participants
    if ((data || []).length < 5) {
      const { data: conv } = await supabase.from('conversations').select('*, members:conversation_members(user_id)').eq('id', convId).single();
      if (conv && conv.type === 'DM') {
        const uids = conv.members.map((m: any) => m.user_id);
        const { data: legacy } = await supabase
          .from('messages')
          .select('*')
          .is('conversation_id', null)
          .in('sender_id', uids)
          .in('receiver_id', uids)
          .order('created_at', { ascending: false });

        if (legacy && legacy.length > 0) {
          // AUTO-HEAL: Update legacy messages to the new conversation_id
          await supabase.from('messages').update({ conversation_id: convId }).is('conversation_id', null).in('sender_id', uids).in('receiver_id', uids);
          return [...(data || []), ...legacy].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        }
      }
    }

    return (data || []).reverse();
  },

  // 3. TYPING & PRESENCE
  async setTypingStatus(convId: string, userId: string, isTyping: boolean) {
    if (isTyping) {
      await supabase
        .from('typing_status')
        .upsert({ conversation_id: convId, user_id: userId, updated_at: new Date().toISOString() });
    } else {
      await supabase
        .from('typing_status')
        .delete()
        .match({ conversation_id: convId, user_id: userId });
    }
  },

  // 4. READ RECEIPTS
  async markAsRead(convId: string, userId: string) {
    await supabase
      .from('conversation_members')
      .update({ last_read_at: new Date().toISOString() })
      .match({ conversation_id: convId, user_id: userId });
  }
};
