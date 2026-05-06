"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useChatStore } from '@/stores/chatStore';
import { ChatService } from '@/services/chatService';

const supabase = createClient();

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addMessage, setConversations, setTyping, activeId } = useChatStore();

  // 1. Initial Load
  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        // Sync existing connections to the new system
        await ChatService.syncLegacyConnections(user.id);
        
        const convs = await ChatService.getConversations(user.id);
        setConversations(convs);
      } catch (err) {
        console.error("Chat Init Error:", err);
      }
    };

    loadData();
  }, [user?.id, setConversations]);

  // 2. Realtime Subscriptions
  useEffect(() => {
    if (!user?.id) return;

    // Listen for NEW MESSAGES in ALL conversations the user is part of
    const messageSub = supabase
      .channel(`chat_messages_${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const msg = payload.new as any;
        addMessage(msg.conversation_id, msg);
        
        // Auto-refresh conversations to update last_message_at
        ChatService.getConversations(user.id).then(setConversations);
      })
      .subscribe();

    // Listen for TYPING STATUS
    const typingSub = supabase
      .channel(`chat_typing_${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'typing_status'
      }, (payload) => {
        // Refresh typing list for active convo (simplification for v2.0)
        if (activeId) {
          supabase
            .from('typing_status')
            .select('user_id')
            .eq('conversation_id', activeId)
            .neq('user_id', user.id)
            .then(({ data }) => {
              setTyping(activeId, (data || []).map(d => d.user_id));
            });
        }
      })
      .subscribe();

    // Listen for NEW CONVERSATIONS (when YOU are added as a member)
    const membershipSub = supabase
      .channel('chat_memberships')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'conversation_members',
        filter: `user_id=eq.${user.id}`
      }, () => {
        ChatService.getConversations(user.id).then(setConversations);
      })
      .subscribe();

    // Listen for READ RECEIPTS
    const readSub = supabase
      .channel('chat_read_receipts')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversation_members'
      }, () => {
        ChatService.getConversations(user.id).then(setConversations);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSub);
      supabase.removeChannel(typingSub);
      supabase.removeChannel(readSub);
      supabase.removeChannel(membershipSub);
    };
  }, [user?.id, addMessage, setConversations, activeId, setTyping]);

  return <>{children}</>;
}
