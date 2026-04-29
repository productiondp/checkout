/**
 * HOOK: useAwsChat
 * 
 * Manages chat state for the AWS Serverless Chat system.
 * Implements optimistic UI updates and efficient pagination.
 */

import { useState, useCallback, useEffect } from 'react';
import { AwsChatService, AwsMessage, AwsConversation } from '@/services/aws-chat-service';

export function useAwsChat(userId: string | undefined) {
  const [conversations, setConversations] = useState<AwsConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<AwsConversation | null>(null);
  const [messages, setMessages] = useState<AwsMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isTabActive, setIsTabActive] = useState(true);

  // 🛡️ VISIBILITY WATCHDOG
  useEffect(() => {
    const handleVisibility = () => setIsTabActive(document.visibilityState === 'visible');
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 🛡️ LOCAL CACHE SYNC
  const cacheKey = activeConversation ? `aws_cache_${activeConversation.conversationId}` : null;

  // Load Conversations
  const loadConversations = useCallback(async () => {
    if (!userId || !isTabActive) return;
    const data = await AwsChatService.getConversations(userId);
    setConversations(data);
  }, [userId, isTabActive]);

  // Load Messages (Hardened with Caching)
  const loadMessages = useCallback(async (conversationId: string, clear = true) => {
    if (!isTabActive && !clear) return;
    
    setIsLoading(true);
    
    // 🛡️ Initial Load from Cache
    if (clear && typeof window !== 'undefined') {
       const cached = localStorage.getItem(`aws_cache_${conversationId}`);
       if (cached) setMessages(JSON.parse(cached));
    }

    const data = await AwsChatService.getMessages(conversationId);
    
    if (clear) {
      setMessages(data.messages);
      // 🛡️ Update Cache
      localStorage.setItem(`aws_cache_${conversationId}`, JSON.stringify(data.messages.slice(0, 50)));
    } else {
      setMessages(prev => [...prev, ...data.messages]);
    }
    
    setNextCursor(data.nextCursor);
    setIsLoading(false);
  }, [isTabActive]);

  // 🛡️ SMART BACKGROUND REFRESH (25s)
  useEffect(() => {
    if (!userId || !isTabActive) return;
    const interval = setInterval(() => {
      loadConversations();
      if (activeConversation) loadMessages(activeConversation.conversationId, true);
    }, 25000);
    return () => clearInterval(interval);
  }, [userId, isTabActive, activeConversation, loadConversations, loadMessages]);

  // Send Message (Hardened Optimistic)
  const sendMessage = useCallback(async (text: string, mediaUrl?: string) => {
    if (!activeConversation || !userId) return;

    const recipientId = activeConversation.participants.find(p => p !== userId);
    const tempId = `temp_${Date.now()}`;
    const newMessage: AwsMessage = {
      messageId: tempId,
      senderId: userId,
      text,
      mediaUrl,
      createdAt: Date.now(),
    };

    // Optimistic Update
    setMessages(prev => [newMessage, ...prev]);

    try {
      await AwsChatService.sendMessage(activeConversation.conversationId, userId, text, recipientId, mediaUrl);
    } catch (error) {
      setMessages(prev => prev.filter(m => m.messageId !== tempId));
      throw error;
    }
  }, [activeConversation, userId]);

  useEffect(() => {
    if (userId) loadConversations();
  }, [userId, loadConversations]);

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    isLoading,
    loadMessages,
    sendMessage,
    hasMore: !!nextCursor,
    loadMore: () => activeConversation && nextCursor && loadMessages(activeConversation.conversationId, false),
  };
}
