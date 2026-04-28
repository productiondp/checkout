"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ConnectionState = "PENDING" | "CONNECTED" | "NONE" | "ACCEPT_IGNORE" | "MESSAGE";

interface ConnectionContextType {
  connectionMap: Record<string, ConnectionState>;
  refreshConnections: () => Promise<void>;
  getConnectionState: (userId: string) => ConnectionState;
  sendRequest: (targetId: string) => Promise<void>;
  isLoading: boolean;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [connectionMap, setConnectionMap] = useState<Record<string, ConnectionStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchConnections = useCallback(async () => {
    if (!user?.id) {
      setConnectionMap({});
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('connections')
        .select('sender_id, receiver_id, status')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) throw error;

      const map: Record<string, ConnectionState> = {};
      data?.forEach(conn => {
        const otherId = conn.sender_id === user.id ? conn.receiver_id : conn.sender_id;
        if (conn.status === 'ACCEPTED') map[otherId] = "CONNECTED";
        else if (conn.status === 'PENDING') map[otherId] = "PENDING";
        else map[otherId] = "NONE";
      });

      setConnectionMap(map);
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, supabase]);

  const sendRequest = useCallback(async (targetId: string) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase.from('connections').insert({
        sender_id: user.id,
        receiver_id: targetId,
        status: 'PENDING'
      });
      if (error) throw error;
      fetchConnections();
    } catch (err) {
      console.error("Send request failed:", err);
    }
  }, [user?.id, fetchConnections, supabase]);

  useEffect(() => {
    fetchConnections();

    // ── REALTIME SYNC ──
    if (!user?.id) return;

    const channel = supabase
      .channel('connections_sync')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections'
      }, () => {
        fetchConnections();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, fetchConnections, supabase]);

  const getConnectionState = useCallback((targetId: string): ConnectionState => {
    return connectionMap[targetId] || "NONE";
  }, [connectionMap]);

  const value = useMemo(() => ({
    connectionMap,
    refreshConnections: fetchConnections,
    getConnectionState,
    sendRequest,
    isLoading
  }), [connectionMap, fetchConnections, getConnectionState, sendRequest, isLoading]);

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnections must be used within a ConnectionProvider");
  }
  return context;
}
