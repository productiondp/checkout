import { useState, useCallback, useEffect, useRef } from 'react';
import { AwsChatService, AwsMessage, AwsConversation } from '@/services/aws-chat-service';
import { AwsWebSocketClient } from '@/utils/ws-client';

export function useAwsChat(userId: string | undefined) {
  const [conversations, setConversations] = useState<AwsConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<AwsConversation | null>(null);
  const [messages, setMessages] = useState<AwsMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isTabActive, setIsTabActive] = useState(true);
  const [isWsConnected, setIsWsConnected] = useState(false);
  
  const wsClientRef = useRef<AwsWebSocketClient | null>(null);

  // 🛡️ VISIBILITY WATCHDOG
  useEffect(() => {
    const handleVisibility = () => setIsTabActive(document.visibilityState === 'visible');
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 📡 WEBSOCKET INITIALIZATION
  useEffect(() => {
    if (!userId) return;

    if (!wsClientRef.current) {
      wsClientRef.current = new AwsWebSocketClient(userId);
    }

    const ws = wsClientRef.current;
    ws.connect();

    const unsubscribe = ws.subscribe((payload) => {
      if (payload.type === 'NEW_MESSAGE') {
        const { conversationId, message } = payload;
        
        // 1. Inject into message list if it's the active conversation
        if (activeConversation?.conversationId === conversationId) {
          setMessages(prev => {
            // Check for duplicates (optimistic UI might have already added it)
            if (prev.some(m => m.messageId === message.messageId)) return prev;
            return [message, ...prev];
          });
        }

        // 2. Update conversation list preview
        setConversations(prev => prev.map(c => 
          c.conversationId === conversationId 
            ? { ...c, lastMessage: message.text, lastMessageAt: message.createdAt, unreadCount: (c.unreadCount || 0) + 1 } 
            : c
        ));
      }
    });

    const checkStatus = setInterval(() => setIsWsConnected(ws.isConnected), 5000);

    return () => {
      unsubscribe();
      clearInterval(checkStatus);
    };
  }, [userId, activeConversation?.conversationId]);

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
    if (clear && typeof window !== 'undefined') {
       const cached = localStorage.getItem(`aws_cache_${conversationId}`);
       if (cached) setMessages(JSON.parse(cached));
    }

    const data = await AwsChatService.getMessages(conversationId);
    if (clear) {
      setMessages(data.messages);
      localStorage.setItem(`aws_cache_${conversationId}`, JSON.stringify(data.messages.slice(0, 50)));
    } else {
      setMessages(prev => [...prev, ...data.messages]);
    }
    
    setNextCursor(data.nextCursor);
    setIsLoading(false);
  }, [isTabActive]);

  // 🛡️ SMART HYBRID REFRESH (WebSocket + 25s Polling Fallback)
  useEffect(() => {
    if (!userId || !isTabActive) return;
    
    // Polling only acts as a fallback or a slower background sync
    const interval = setInterval(() => {
      if (!isWsConnected) {
        console.log("[HYBRID] WebSocket disconnected. Running polling fallback.");
        loadConversations();
        if (activeConversation) loadMessages(activeConversation.conversationId, true);
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [userId, isTabActive, activeConversation, isWsConnected, loadConversations, loadMessages]);

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
