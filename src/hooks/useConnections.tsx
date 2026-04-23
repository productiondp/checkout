"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ConnectionState = "CONNECT" | "PENDING" | "ACCEPT_IGNORE" | "CONNECTED" | "MESSAGE";

interface ConnectionContextType {
  connections: Record<string, ConnectionState>;
  sendRequest: (userId: string) => void;
  acceptRequest: (userId: string) => void;
  ignoreRequest: (userId: string) => void;
  getConnectionState: (userId: string) => ConnectionState;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  // Store connection states keyed by user/entity ID
  const [connections, setConnections] = useState<Record<string, ConnectionState>>({
    "a1": "CONNECTED", // Mock advisor connected
    "m1": "PENDING",   // Mock marketplace request sent
  });

  const sendRequest = (id: string) => {
    setConnections(prev => ({ ...prev, [id]: "PENDING" }));
  };

  const acceptRequest = (id: string) => {
    setConnections(prev => ({ ...prev, [id]: "CONNECTED" }));
  };

  const ignoreRequest = (id: string) => {
    setConnections(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const getConnectionState = (id: string): ConnectionState => {
    return connections[id] || "CONNECT";
  };

  return (
    <ConnectionContext.Provider value={{ connections, sendRequest, acceptRequest, ignoreRequest, getConnectionState }}>
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
