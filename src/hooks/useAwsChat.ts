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

  // Load Conversations
  const loadConversations = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const data = await AwsChatService.getConversations(userId);
    setConversations(data);
    setIsLoading(false);
  }, [userId]);

  // Load Messages
  const loadMessages = useCallback(async (conversationId: string, clear = true) => {
    setIsLoading(true);
    const data = await AwsChatService.getMessages(conversationId);
    if (clear) {
      setMessages(data.messages);
    } else {
      setMessages(prev => [...prev, ...data.messages]);
    }
    setNextCursor(data.nextCursor);
    setIsLoading(false);
  }, []);

  // Send Message (Optimistic)
  const sendMessage = useCallback(async (text: string, mediaUrl?: string) => {
    if (!activeConversation || !userId) return;

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
      await AwsChatService.sendMessage(activeConversation.conversationId, userId, text, mediaUrl);
    } catch (error) {
      // Rollback on failure
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
