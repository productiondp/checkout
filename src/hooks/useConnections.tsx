"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "NONE";

interface ConnectionContextType {
  connectionMap: Record<string, ConnectionStatus>;
  refreshConnections: () => Promise<void>;
  getConnectionStatus: (userId: string) => ConnectionStatus;
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

      const map: Record<string, ConnectionStatus> = {};
      data?.forEach(conn => {
        const otherId = conn.sender_id === user.id ? conn.receiver_id : conn.sender_id;
        map[otherId] = conn.status as ConnectionStatus;
      });

      setConnectionMap(map);
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, supabase]);

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

  const getConnectionStatus = useCallback((targetId: string): ConnectionStatus => {
    return connectionMap[targetId] || "NONE";
  }, [connectionMap]);

  const value = useMemo(() => ({
    connectionMap,
    refreshConnections: fetchConnections,
    getConnectionStatus,
    isLoading
  }), [connectionMap, fetchConnections, getConnectionStatus, isLoading]);

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
