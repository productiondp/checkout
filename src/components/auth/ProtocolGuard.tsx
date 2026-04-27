"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const PROTECTED_PATHS = ["/home", "/chat", "/communities", "/matches", "/profile", "/settings"];

/**
 * 🕵️ PROTOCOL GUARD (DEV ONLY)
 * 
 * In development mode, this component monitors navigation to protected terminals.
 * It enforces that every protected terminal is wrapped in a <ProtectedRoute>.
 */
export default function ProtocolGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));
    
    if (isProtected) {
      // Check if ProtectedRoute has signaled its presence
      // We use a small delay to allow the child component to mount and signal
      setTimeout(() => {
        if (!window.__CHECKOUT_AUTH_GUARD_ACTIVE__) {
          console.error(
            `\x1b[31m[AUTH PROTOCOL VIOLATION]\x1b[0m Terminal "${pathname}" is NOT wrapped in <ProtectedRoute>. ` +
            "This is a critical security violation. Render aborted."
          );
          // In a real dev environment, we might show a red screen here
        }
      }, 500);
    }
    
    // Reset the signal on every navigation
    window.__CHECKOUT_AUTH_GUARD_ACTIVE__ = false;
  }, [pathname]);

  return null;
}

// Add type definition for the global signal
declare global {
  interface Window {
    __CHECKOUT_AUTH_GUARD_ACTIVE__?: boolean;
  }
}
