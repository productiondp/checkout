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
  SK?: string;
}

// 🛡️ ABSOLUTE DEDUPLICATION + SORT (ASCENDING)
function dedupeAndSort(messages: AwsMessage[]): AwsMessage[] {
  const map = new Map();
  messages.forEach(msg => {
    const key = msg.SK || msg.messageId;
    map.set(key, msg);
  });
  
  const cleaned = Array.from(map.values()).sort((a, b) => a.createdAt - b.createdAt);
  console.log("CHRONO_SYNC:", { raw: messages.length, clean: cleaned.length });
  return cleaned;
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
  const lastSentIdRef = useRef<string | null>(null);

  // 🛡️ VISIBILITY WATCHDOG
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibility = () => setIsTabActive(document.visibilityState === 'visible');
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 📡 WEBSOCKET INITIALIZATION (UX ENHANCED)
  useEffect(() => {
    if (!userId || typeof window === 'undefined') return;

    if (!wsClientRef.current) wsClientRef.current = new AwsWebSocketClient(userId);
    const ws = wsClientRef.current;
    ws.connect();

    const unsubscribe = ws.subscribe((payload) => {
      const { type, conversationId, message, userId: eventUserId } = payload;

      // A. Real-time Messages
      if (type === 'NEW_MESSAGE') {
        if (activeConversation?.conversationId === conversationId) {
          // 🛡️ SINGLE WRITER RULE: ONLY loadMessages can update state
          loadMessages(conversationId, false);
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
    if (isLoading) return; // 🛡️ PREVENT OVERLAP
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

    const cleaned = dedupeAndSort(enrichedMessages);
    
    // 🛡️ DEBUG: MONITOR STATE WRITER
    console.log("SET MESSAGES CALLED", { count: cleaned.length });

    if (clear) {
      setMessages(cleaned);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`aws_cache_${conversationId}`, JSON.stringify(cleaned.slice(-50)));
      }
    } else {
      setMessages(prev => {
        const combined = [...prev, ...cleaned];
        return dedupeAndSort(combined);
      });
    }
    
    setNextCursor(data.nextCursor);
    setIsLoading(false);
  }, [isTabActive, conversations]);

  // 🛡️ HYBRID REFRESH
  useEffect(() => {
    if (!userId || !isTabActive) return;
    const interval = setInterval(() => {
      loadConversations();
      if (activeConversation) loadMessages(activeConversation.conversationId, true);
    }, 2000);
    return () => clearInterval(interval);
  }, [userId, isTabActive, activeConversation, isWsConnected, loadConversations, loadMessages]);

  // Send Message (Backend Single Source of Truth)
  const sendMessage = useCallback(async (text: string, mediaUrl?: string) => {
    if (!activeConversation || !userId) return;

    const recipientId = activeConversation.participants.find(p => p !== userId);

    try {
      // 🚀 ONLY SEND DATA - DO NOT UPDATE UI MANUALLY
      await AwsChatService.sendMessage(activeConversation.conversationId, userId, text, recipientId, mediaUrl);
      
      // 🔄 SYNC IMMEDIATELY FROM BACKEND
      await loadMessages(activeConversation.conversationId, true);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }, [activeConversation, userId, loadMessages]);

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
    // 📈 GROWTH ENGINE: CONVERSION TRACKING
    messageCount: messages.filter(m => m.senderId !== userId).length,
  };
}
