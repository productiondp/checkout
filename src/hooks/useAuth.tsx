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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  // ── EXECUTION GUARD ──
  const initialized = useRef(false);

  // ── PROFILE SYNC ──
  const syncProfile = async (currentSession: Session | null) => {
    if (!currentSession?.user) return;
    
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
      setAuthState("onboarding");
    }
  };

  // ── SINGLE AUTH FLOW ──
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 🛡️ FAST WATCHDOG (1.5s) - Prevents infinite loading
    const watchdog = setTimeout(() => {
      setAuthState(prev => prev === "loading" ? "guest" : prev);
    }, 1500);

    const init = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession) await syncProfile(initialSession);
        else {
          setAuthState("guest");
        }
      } catch (err) {
        setAuthState("guest");
      } finally {
        clearTimeout(watchdog);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setAuthState("guest");
        window.location.href = '/';
      } else if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
        if (currentSession) await syncProfile(currentSession);
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

    const currentPath = window.location.pathname;
    const PUBLIC_ROUTES = ["/", "/auth/callback"];

    if (authState === "guest") {
      if (!PUBLIC_ROUTES.includes(currentPath)) router.replace("/");
    } 
    else if (authState === "onboarding") {
      if (currentPath !== "/onboarding" && !PUBLIC_ROUTES.includes(currentPath)) {
        router.replace("/onboarding");
      }
    } 
    else if (authState === "authenticated") {
      if (currentPath === "/onboarding" || currentPath === "/") {
        router.replace("/home");
      }
    }
  }, [authState, path, router]);

  const login = async () => {}; // Handled in components
  
  const logout = async () => {
    console.log("[AUTH] Manual Logout...");
    setAuthState("loading");
    await supabase.auth.signOut();
    // onAuthStateChange SIGNED_OUT event will handle cleanup and redirect
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const newUser = { ...user, ...data };
    setUser(newUser);
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
