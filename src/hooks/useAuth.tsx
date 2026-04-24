"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from "react";
import { UserProfile } from "@/types/core";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import FullScreenLoader from "@/components/auth/FullScreenLoader";
import ErrorFallback from "@/components/auth/ErrorFallback";
import { analytics } from "@/utils/analytics";

interface AuthContextType {
  user: UserProfile | null | undefined;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  loading: boolean;
  session: any | undefined;
  initAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(undefined);
  const [error, setError] = useState<string | null>(null);

  const isAuthReady = !loading && (
    (session && user !== undefined) || 
    (session === null)
  );
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);
  const routingHandled = useRef(false);
  const hasRouted = useRef(false);

  const handleRouting = useCallback(async (currentSession: any, profile: any, currentPath: string) => {
    try {
      if (routingHandled.current) return;
      routingHandled.current = true;

      const publicRoutes = ['/', '/login', '/onboarding'];

      // 🧠 DEBUG SENTINEL (STRICT REQUIREMENT)
      console.log({
        path: window.location.pathname,
        session: !!currentSession,
        onboarding: profile?.onboarding_completed,
        loading
      });

      // 1. NO SESSION
      if (!currentSession) {
        setUser(null);
        if (!publicRoutes.includes(currentPath)) {
          router.replace('/login');
        }
        return;
      }

      // 2. SESSION BUT NO PROFILE
      if (!profile) {
        if (currentPath !== '/onboarding') {
          router.replace('/onboarding');
        }
        return;
      }

      // 3. SESSION + INCOMPLETE ONBOARDING
      if (!profile.onboarding_completed) {
        if (currentPath !== '/onboarding') {
          router.replace('/onboarding');
        }
        return;
      }

      // 4. SESSION + COMPLETE
      if (['/', '/login', '/onboarding'].includes(currentPath)) {
        router.replace('/home');
      }
    } catch (err) {
      console.error("[AUTH CRITICAL] Routing Crash:", err);
    }
  }, [router, loading]);

  const syncProfile = useCallback(async (currentSession: any) => {
    if (!currentSession?.user) {
      setLoading(false);
      return;
    }
    
    try {
      setSession(currentSession);
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();
      
      if (fetchError) {
        console.error("[AUTH] Profile sync failure:", fetchError.message);
      }
      
      if (profile) {
        const userData = {
          ...profile,
          expertise: profile.skills || [],
          intents: profile.intent_tags || profile.domains || [],
          onboarding_completed: !!profile.onboarding_completed,
          full_name: profile.full_name || currentSession.user_metadata?.full_name || "New Partner",
          avatar_url: profile.avatar_url || currentSession.user_metadata?.avatar_url || DEFAULT_AVATAR
        } as UserProfile;

        // 🧠 PRODUCTION SECURITY: Verify Confirmation
        if (!currentSession.user.email_confirmed_at) {
          console.warn("[AUTH] Unverified access blocked. Terminating session.");
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setLoading(false);
          setError("Identification verification required. Please confirm your email link.");

          return;
        }

        setUser(userData);

        analytics.track('SESSION_START', profile.id, { 
          role: profile.role,
          hasExpertise: !!profile.skills?.length,
          onboardingCompleted: !!profile.onboarding_completed
        });
      }
      

    } catch (err) {
      console.error("[AUTH] Identity Sync Crash:", err);
      setError("Failed to synchronize professional ledger.");
    } finally {
      setLoading(false);
    }
  }, [handleRouting]);

  const initAuth = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const timeout = new Promise((resolve) =>
        setTimeout(() => resolve('TIMEOUT'), 30000)
      );

      const initCore = async () => {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession) {
            await syncProfile(currentSession);
          } else {
            setUser(null);
            setSession(null);

          }
          return 'SUCCESS';
        } catch (e) {
          throw e;
        }
      };

      const result = await Promise.race([initCore(), timeout]);
      
      if (result === 'TIMEOUT') {
        console.warn("[AUTH] Identification Timeout - Fallback Mode Active");
        // Safe Fallback: Stop loading but don't trigger hard error
        setLoading(false);
      }
    } catch (err: any) {
      console.error("[AUTH] Handshake Failure:", err);
      // Only trigger hard error for actual failures, not timeouts
      setUser(null);
      setSession(null);
      setError(err.message || "Identification Handshake Failed");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [syncProfile, handleRouting]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 🛡️ GLOBAL SAFETY GUARD: Force loading to resolve after 5s
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // 🧠 PRODUCTION AUTH SENTINEL
      console.log(`[AUTH_EVENT] ${event}`);

      if (event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
        return;
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setLoading(false);
        routingHandled.current = false;
        
        // Tab Sync: Ensure all tabs reflect logout
        if (window.location.pathname !== '/') {
          window.location.href = '/'; // Hard redirect for clean state sync
        }
        return;
      }

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (currentSession) {
          routingHandled.current = false;
          await syncProfile(currentSession);
        }
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [initAuth, syncProfile]);

  // 🧠 CENTRALIZED REACTIVE ROUTING SENTINEL
  useEffect(() => {
    if (!session) {
       hasRouted.current = false;
    }

    if (!isAuthReady || hasRouted.current) return;

    const publicRoutes = ['/', '/login', '/auth', '/onboarding'];
    const currentPath = window.location.pathname;

    hasRouted.current = true;

    // 1. GUEST LOGIC
    if (!session) {
       if (!publicRoutes.includes(currentPath)) {
          router.replace('/login');
       }
       return;
    }

    // 2. AUTHENTICATED LOGIC
    if (session && user !== undefined) {
       if (!user?.onboarding_completed && currentPath !== '/onboarding') {
          router.replace('/onboarding');
       } else if (user?.onboarding_completed && publicRoutes.includes(currentPath)) {
          router.replace('/home');
       }
    }
  }, [isAuthReady, session, user, router]);

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      
      // 🧠 FORCE LOGOUT BEHAVIOR (STRICT REQUIREMENT)
      setUser(null);
      setSession(null);
      routingHandled.current = false;
      router.replace('/');
    } catch (err) {
      console.error("[AUTH] Logout Error:", err);
      setLoading(false);
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  // FAILSAFE RECOVERY GATE
  if (error || (session && !user && !loading && !['/', '/login', '/onboarding'].includes(pathname))) {
    return (
      <ErrorFallback 
        onRetry={initAuth} 
        onLogout={logout} 
        error={error || "Profile synchronization failed. Your identification ledger could not be retrieved."} 
      />
    );
  }

  return (
    <AuthContext.Provider value={{ user, login: async () => {}, logout, updateProfile, loading, session, initAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// 🧠 THE GLOBAL AUTH GATE (ROOT LEVEL)
export function AuthGate({ children }: { children: ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}
