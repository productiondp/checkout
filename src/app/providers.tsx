"use client";

import React from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ProtocolGuard from "@/components/auth/ProtocolGuard";
import ClientLayout from "@/components/layout/ClientLayout";

/**
 *  CLIENT PROVIDERS WRAPPER
 * 
 * This component acts as the client-side boundary for all global providers.
 * It ensures that the Auth and Notification contexts are persistent and stable
 * across route transitions while keeping the RootLayout as a Server Component.
 */
import { ChatProvider } from "@/providers/ChatProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
            <ErrorBoundary>
              <ClientLayout>
                {children}
              </ClientLayout>
            </ErrorBoundary>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
