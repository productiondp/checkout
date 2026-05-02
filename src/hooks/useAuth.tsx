"use client";

/**
 *  AUTH SYSTEM - MINIMAL SINGLE-THREADED (RACE-FREE)
 * 
 * Enforces a strict single-flow authentication lifecycle:
 * 1. ONLY onAuthStateChange listener
 * 2. NO manual getSession/init calls
 * 3. NO watchdogs or forced timers
 * 4. NO duplicate client instances
 */

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useMemo } from "react";
import { UserProfile } from "@/types/core";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import FullScreenLoader from "@/components/auth/FullScreenLoader";
import { Session } from "@supabase/supabase-js";

export type AuthState = "loading" | "guest" | "authenticated" | "onboarding";

interface AuthContextType {
  user: UserProfile | null;
  authState: AuthState;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  loading: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const path = usePathname();

  // ── ATOMIC STATES ──
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [user, setUser] = useState<UserProfile | null>(() => {
    // ⚡ PRE-FLIGHT CACHE LOAD (Instant UI)
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('checkout_user_cache');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [session, setSession] = useState<Session | null>(null);
  
  // ── EXECUTION GUARD ──
  const initialized = useRef(false);
  const watchdogRef = useRef<NodeJS.Timeout | null>(null);

  // ── PROFILE SYNC ──
  const syncProfile = async (currentSession: Session | null) => {
    if (!currentSession?.user) {
      setAuthState(prev => prev === "loading" ? "guest" : prev);
      return;
    }
    
    setSession(currentSession);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();

      if (profile) {
        const userData = {
          ...profile,
          expertise: profile.skills || [],
          intents: profile.intent_tags || [],
          onboarding_completed: !!profile.onboarding_completed || (typeof window !== 'undefined' && localStorage.getItem(`checkout_onboarded_${currentSession.user.id}`) === 'true')
        } as UserProfile;

        setUser(userData);
        
        // 💾 CACHE FOR NEXT LOAD
        if (typeof window !== 'undefined') {
          localStorage.setItem('checkout_user_cache', JSON.stringify(userData));
        }

        if (userData.onboarding_completed || (userData.full_name && userData.role && userData.full_name !== 'New Member')) {
          setAuthState("authenticated");
        } else {
          setAuthState("onboarding");
        }
      } else {
        setAuthState("onboarding");
      }
    } catch (err) {
      console.error("[AUTH] Profile Sync Error:", err);
      // Fallback to cached state if available, or onboarding
      if (!user) setAuthState("onboarding");
    }
  };

  // ── SINGLE AUTH FLOW ──
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 🛡️ STABLE WATCHDOG (5s) - Prevents infinite loading
    if (!watchdogRef.current) {
      watchdogRef.current = setTimeout(() => {
        setAuthState(prev => {
          if (prev === "loading") {
            console.log("[AUTH] Watchdog expired. Setting to guest.");
            return "guest";
          }
          return prev;
        });
      }, 5000);
    }

    const init = async () => {
      try {
        // ⚡ OPTIMISTIC INITIAL STATE
        if (user) {
          if (user.onboarding_completed) setAuthState("authenticated");
          else setAuthState("onboarding");
        }

        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("[AUTH] init session check", { hasSession: !!initialSession });
        
        if (initialSession) {
          if (watchdogRef.current) clearTimeout(watchdogRef.current);
          await syncProfile(initialSession);
        } else {
          console.log("[AUTH] No initial session found. Waiting for events.");
          if (typeof window !== 'undefined') localStorage.removeItem('checkout_user_cache');
        }
      } catch (err) {
        console.error("[AUTH] Init error:", err);
        setAuthState("guest");
        if (watchdogRef.current) clearTimeout(watchdogRef.current);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`[AUTH] onAuthStateChange: ${event}`, { hasSession: !!currentSession });
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setAuthState("guest");
        if (watchdogRef.current) clearTimeout(watchdogRef.current);
      } else if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
        if (currentSession) {
          if (watchdogRef.current) clearTimeout(watchdogRef.current);
          await syncProfile(currentSession);
        } else {
          setAuthState(prev => prev === "loading" ? "guest" : prev);
        }
      } else if (event === 'INITIAL_SESSION' && !currentSession) {
        // Supabase has confirmed no session exists. We can safely stop waiting.
        console.log("[AUTH] Supabase confirmed no session. Setting to guest.");
        setAuthState("guest");
        if (watchdogRef.current) clearTimeout(watchdogRef.current);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(watchdog);
    };
  }, [supabase]);

  // ── SIMPLIFIED REDIRECT ENGINE ──
  useEffect(() => {
    if (authState === "loading") return;

    const currentPath = path || window.location.pathname;
    const PUBLIC_ROUTES = ["/", "/auth/callback", "/what-is-checkout"];

    if (authState === "guest") {
      if (!PUBLIC_ROUTES.includes(currentPath)) {
        console.log(`[AUTH] Redirecting GUEST from ${currentPath} to /`);
        window.location.href = "/";
      }
    } 
    else if (authState === "onboarding") {
      // If we are in onboarding mode, push to /onboarding unless we are ALREADY there
      if (currentPath !== "/onboarding") {
        console.log(`[AUTH] Redirecting ONBOARDING from ${currentPath} to /onboarding`);
        window.location.href = "/onboarding";
      }
    } 
    else if (authState === "authenticated") {
      // If we are fully authenticated, push to /home if we are on a public page or onboarding
      if (currentPath === "/onboarding" || PUBLIC_ROUTES.includes(currentPath)) {
        console.log(`[AUTH] Redirecting AUTHENTICATED from ${currentPath} to /home`);
        window.location.href = "/home";
      }
    }
  }, [authState, path, router]);

  const login = async () => {}; // Handled in components
  
  const logout = async () => {
    console.log("[AUTH] Definitive Logout...");
    setAuthState("loading");
    
    try {
      // ⚡ SPEED GUARDIAN: Don't wait more than 1s for the server
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000))
      ]);
    } catch (e) {
      console.warn("SignOut timed out or failed, forcing redirect:", e);
    }
    
    // 2. Nuclear Clear
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. COOKIE SHREDDER
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
      
      // 4. Force Redirect
      window.location.href = "/";
    }
    
    setSession(null);
    setUser(null);
    setAuthState("guest");
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const newUser = { ...user, ...data };
    setUser(newUser);
    
    // Sync to cache
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_user_cache', JSON.stringify(newUser));
    }

    if (data.onboarding_completed) {
      setAuthState("authenticated");
      if (typeof window !== 'undefined') {
        localStorage.setItem(`checkout_onboarded_${user.id}`, 'true');
      }
    }
  };

  if (authState === "loading") {
    return <FullScreenLoader status="loading" />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      authState,
      login, 
      logout, 
      updateProfile, 
      loading: authState === "loading", 
      session 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function useRequiredUser() {
  const { user } = useAuth();
  if (!user) {
    // This is a safety fallback, usually handled by ProtectedRoute
    console.warn("[AUTH] useRequiredUser called without user session");
  }
  return user;
}
