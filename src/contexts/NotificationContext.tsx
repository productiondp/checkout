"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface NotificationContextType {
  unreadMessagesCount: number;
  pendingRequestsCount: number;
  refreshCounts: () => Promise<void>;
  setActiveChatId: (id: string | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // Refs for stable access in listeners
  const unreadRef = useRef(0);
  const pendingRef = useRef(0);
  
  const supabase = createClient();
  const processedIds = useRef<Set<string>>(new Set());
  const lastMessagePerConnection = useRef<Record<string, string>>({});
  const lastSyncRef = useRef<number>(Date.now());
  const syncChannel = useRef<BroadcastChannel | null>(null);

  // Keep refs in sync
  useEffect(() => { unreadRef.current = unreadMessagesCount; }, [unreadMessagesCount]);
  useEffect(() => { pendingRef.current = pendingRequestsCount; }, [pendingRequestsCount]);

  // ── TAB SYNC (BroadcastChannel) ──
  useEffect(() => {
    syncChannel.current = new BroadcastChannel("checkout_notifications_sync");
    syncChannel.current.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === "UPDATE_COUNTS") {
        setUnreadMessagesCount(data.unreadMessagesCount);
        setPendingRequestsCount(data.pendingRequestsCount);
      }
    };
    return () => syncChannel.current?.close();
  }, []);

  const broadcastCounts = useCallback((unread: number, pending: number) => {
    try {
      if (syncChannel.current) {
        syncChannel.current.postMessage({
          type: "UPDATE_COUNTS",
          data: { unreadMessagesCount: unread, pendingRequestsCount: pending }
        });
      }
    } catch (err) {
      // Ignore "Channel is closed" errors during unmount
      if (!(err instanceof Error && err.name === 'InvalidStateError')) {
        console.warn("Broadcast Error:", err);
      }
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    if (!user?.id) {
      setUnreadMessagesCount(0);
      setPendingRequestsCount(0);
      return;
    }

    try {
      // 1. Unread Messages Count (Strict receiver check)
      const { count: mCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      
      const unread = mCount || 0;
      setUnreadMessagesCount(unread);

      // 2. Pending Requests Count
      const { count: reqCount } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('status', 'PENDING');
      
      const pending = reqCount || 0;
      setPendingRequestsCount(pending);

      broadcastCounts(unread, pending);
      lastSyncRef.current = Date.now();
    } catch (err) {
      console.error("Notification Sync Error:", err);
    }
  }, [user?.id, supabase, broadcastCounts]);

  // ── TAB FOCUS REFRESH ──
  useEffect(() => {
    const handleFocus = () => {
      fetchCounts();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchCounts]);

  useEffect(() => {
    if (!user?.id) {
      setUnreadMessagesCount(0);
      setPendingRequestsCount(0);
      processedIds.current.clear();
      lastMessagePerConnection.current = {};
      return;
    }

    fetchCounts();

    // ── REALTIME HARDENING ──
    
    // 1. Messages Listener (Timestamp Guard + receiver check + active chat skip + ID Guard)
    const msgChannel = supabase
      .channel(`notifications_msg_${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        const msg = payload.new;
        
        // A. Idempotency check
        if (processedIds.current.has(msg.id)) return;
        processedIds.current.add(msg.id);

        // B. Message ID Guard
        const lastId = lastMessagePerConnection.current[msg.connection_id];
        if (lastId && msg.id <= lastId) return; 
        lastMessagePerConnection.current[msg.connection_id] = msg.id;

        // C. Timestamp Guard
        if (new Date(msg.created_at).getTime() < lastSyncRef.current - 5000) return;

        // D. Active Chat Skip
        if (activeChatId && msg.connection_id === activeChatId) return;

        // E. Increment
        setUnreadMessagesCount(prev => {
          const next = prev + 1;
          broadcastCounts(next, pendingRef.current);
          return next;
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        if (payload.new.is_read && !payload.old.is_read) {
          fetchCounts();
        }
      })
      .subscribe();

    // 2. Connections Listener
    const connChannel = supabase
      .channel(`notifications_conn_${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'connections',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        if (processedIds.current.has(payload.new.id)) return;
        processedIds.current.add(payload.new.id);

        if (payload.new.status === 'PENDING') {
          setPendingRequestsCount(prev => {
            const next = prev + 1;
            broadcastCounts(unreadRef.current, next);
            return next;
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'connections'
      }, (payload) => {
        // Handle ACCEPTED / REJECTED
        if (payload.new.receiver_id === user.id || payload.new.sender_id === user.id) {
          fetchCounts();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(connChannel);
    };
  }, [user?.id, fetchCounts, supabase, activeChatId, broadcastCounts]);

  return (
    <NotificationContext.Provider value={{ 
      unreadMessagesCount, 
      pendingRequestsCount, 
      refreshCounts: fetchCounts,
      setActiveChatId
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
