import { useState, useCallback, useEffect, useRef } from 'react';
import { AwsChatService, AwsMessage, AwsConversation } from '@/services/aws-chat-service';
import { AwsWebSocketClient } from '@/utils/ws-client';

export interface AwsMessage {
  messageId: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  createdAt: number;
  status?: 'SENDING' | 'SENT' | 'DELIVERED' | 'SEEN';
}

export function useAwsChat(userId: string | undefined) {
  const [conversations, setConversations] = useState<AwsConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<AwsConversation | null>(null);
  const [messages, setMessages] = useState<AwsMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isTabActive, setIsTabActive] = useState(true);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  
  const wsClientRef = useRef<AwsWebSocketClient | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  // 🛡️ VISIBILITY WATCHDOG
  useEffect(() => {
    const handleVisibility = () => setIsTabActive(document.visibilityState === 'visible');
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 📡 WEBSOCKET INITIALIZATION (UX ENHANCED)
  useEffect(() => {
    if (!userId) return;

    if (!wsClientRef.current) wsClientRef.current = new AwsWebSocketClient(userId);
    const ws = wsClientRef.current;
    ws.connect();

    const unsubscribe = ws.subscribe((payload) => {
      const { type, conversationId, message, userId: eventUserId } = payload;

      // A. Real-time Messages
      if (type === 'NEW_MESSAGE') {
        if (activeConversation?.conversationId === conversationId) {
          setMessages(prev => {
            if (prev.some(m => m.messageId === message.messageId)) return prev;
            return [{ ...message, status: 'DELIVERED' }, ...prev].sort((a,b) => b.createdAt - a.createdAt);
          });
          // Update seen on open conversation
          AwsChatService.updateSeen(conversationId, userId);
        }
        setConversations(prev => prev.map(c => c.conversationId === conversationId ? { ...c, lastMessage: message.text, lastMessageAt: message.createdAt } : c));
      }

      // B. Typing Indicators
      if (type === 'TYPING_START' && conversationId === activeConversation?.conversationId) {
        setTypingUsers(prev => ({ ...prev, [eventUserId]: true }));
        setTimeout(() => setTypingUsers(prev => ({ ...prev, [eventUserId]: false })), 3000);
      }
      if (type === 'TYPING_STOP' && conversationId === activeConversation?.conversationId) {
        setTypingUsers(prev => ({ ...prev, [eventUserId]: false }));
      }
    });

    const checkStatus = setInterval(() => {
      const connected = ws.isConnected;
      if (connected && !isWsConnected) {
        // RECONNECT RECOVERY: Fetch messages after last known
        const lastMsg = messages[0];
        if (lastMsg && activeConversation) loadMessages(activeConversation.conversationId, false);
      }
      setIsWsConnected(connected);
    }, 5000);

    return () => { unsubscribe(); clearInterval(checkStatus); };
  }, [userId, activeConversation?.conversationId, isWsConnected]);

  // 👀 UPDATE SEEN ON OPEN
  useEffect(() => {
    if (activeConversation && userId) {
      AwsChatService.updateSeen(activeConversation.conversationId, userId);
      setConversations(prev => prev.map(c => c.conversationId === activeConversation.conversationId ? { ...c, unreadCount: 0 } : c));
    }
  }, [activeConversation?.conversationId, userId]);

  // ⌨️ TYPING TRIGGER
  const handleTyping = useCallback(() => {
    if (!activeConversation || !wsClientRef.current || !userId) return;
    AwsChatService.sendWebSocketEvent(wsClientRef.current.getSocket(), 'TYPING_START', activeConversation.conversationId, activeConversation.participants);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      AwsChatService.sendWebSocketEvent(wsClientRef.current?.getSocket() || null, 'TYPING_STOP', activeConversation.conversationId, activeConversation.participants);
    }, 2000);
  }, [activeConversation, userId]);

  // Load Conversations
  const loadConversations = useCallback(async () => {
    if (!userId || !isTabActive) return;
    const data = await AwsChatService.getConversations(userId);
    setConversations(data);
  }, [userId, isTabActive]);

  // Load Messages (with status calc)
  const loadMessages = useCallback(async (conversationId: string, clear = true) => {
    if (!isTabActive && !clear) return;
    setIsLoading(true);
    
    if (clear && typeof window !== 'undefined') {
       const cached = localStorage.getItem(`aws_cache_${conversationId}`);
       if (cached) setMessages(JSON.parse(cached));
    }

    const data = await AwsChatService.getMessages(conversationId);
    
    // Calculate status based on lastSeenAt (simplified for demo)
    const convo = conversations.find(c => c.conversationId === conversationId);
    const lastSeen = convo?.lastSeenAt || 0;

    const enrichedMessages = data.messages.map((m: any) => ({
      ...m,
      status: m.createdAt <= lastSeen ? 'SEEN' : 'DELIVERED'
    }));

    if (clear) {
      setMessages(enrichedMessages);
      localStorage.setItem(`aws_cache_${conversationId}`, JSON.stringify(enrichedMessages.slice(0, 50)));
    } else {
      setMessages(prev => {
        const combined = [...prev, ...enrichedMessages];
        const unique = Array.from(new Set(combined.map(m => m.messageId)))
          .map(id => combined.find(m => m.messageId === id)!);
        return unique.sort((a,b) => b.createdAt - a.createdAt);
      });
    }
    
    setNextCursor(data.nextCursor);
    setIsLoading(false);
  }, [isTabActive, conversations]);

  // 🛡️ HYBRID REFRESH
  useEffect(() => {
    if (!userId || !isTabActive) return;
    const interval = setInterval(() => {
      if (!isWsConnected) {
        loadConversations();
        if (activeConversation) loadMessages(activeConversation.conversationId, true);
      }
    }, 25000);
    return () => clearInterval(interval);
  }, [userId, isTabActive, activeConversation, isWsConnected, loadConversations, loadMessages]);

  // Send Message (Full Status Lifecycle)
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
      status: 'SENDING'
    };

    setMessages(prev => [newMessage, ...prev]);

    try {
      const res = await AwsChatService.sendMessage(activeConversation.conversationId, userId, text, recipientId, mediaUrl);
      setMessages(prev => prev.map(m => m.messageId === tempId ? { ...m, messageId: res.messageId, status: 'SENT' } : m));
    } catch (error) {
      setMessages(prev => prev.filter(m => m.messageId !== tempId));
      throw error;
    }
  }, [activeConversation, userId]);

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    isLoading,
    loadMessages,
    sendMessage,
    handleTyping,
    typingUsers,
    isWsConnected,
    hasMore: !!nextCursor,
    loadMore: () => activeConversation && nextCursor && loadMessages(activeConversation.conversationId, false),
  };
}
