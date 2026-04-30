"use client";

import React, { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import FullScreenLoader from "./FullScreenLoader";

/**
 *  HARDENED PROTECTED ROUTE GATE
 * 
 * Enforces strict authentication and onboarding requirements.
 * This component acts as a final render block, ensuring that no 
 * internal UI is exposed before the useAuth state machine has 
 * fully resolved and verified the user's status.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authState, loading, user } = useAuth();

  //  SIGNAL PROTOCOL GUARD (Dev Only)
  if (typeof window !== "undefined") {
    window.__CHECKOUT_AUTH_GUARD_ACTIVE__ = true;
  }

  //  STEP 1: RESOLVE LOADING STATE
  if (loading || authState === "loading") {
    return <FullScreenLoader />;
  }

  //  STEP 2: BLOCK GUESTS (Redirection handled by useAuth)
  if (authState === "guest") {
    return <FullScreenLoader />; 
  }

  //  STEP 3: BLOCK PARTIAL PROFILES (Redirection handled by useAuth)
  if (authState === "onboarding") {
    return <FullScreenLoader />;
  }

  //  STEP 4: VERIFY USER OBJECT INTEGRITY
  if (authState === "authenticated" && !user) {
    return null;
  }

  return <>{children}</>;
}
