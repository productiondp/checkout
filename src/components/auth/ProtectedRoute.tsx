"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth, useAuthGuard } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

/**
 *  HARDENED PROTECTED ROUTE GATE (V13.2)
 * 
 * Enforces strict authentication and onboarding requirements using 
 * decentralized guard hooks.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { state, isAuthResolved } = useAuth();
  
  // 🛡️ PROTOCOL SIGNAL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__CHECKOUT_AUTH_GUARD_ACTIVE__ = true;
    }
  }, []);

  // 🛡️ DECENTRALIZED AUTH GUARD
  useAuthGuard('authenticated');

  // 🛡️ INITIALIZING BLOCK
  if (state.tag === 'initializing' || !isAuthResolved) {
    return <LoadingScreen />;
  }

  // 🛡️ STATE-SPECIFIC RENDERING BLOCKS (Wait for useAuthGuard to redirect)
  if (state.tag === 'unauthenticated' || state.tag === 'onboarding') {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
