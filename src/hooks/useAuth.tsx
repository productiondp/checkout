"use client";

/**
 * DETERMINISTIC AUTHENTICATION PROVIDER (V16.5)
 * 
 * Features:
 * 1. UNIVERSAL TRIGGER: Every auth event triggers a terminal state resolution.
 * 2. PRODUCTION FAILSAFE: 6-second watchdog prevents any infinite loading.
 * 3. HARD REDIRECTS: Guarantees navigation even if the router encounters an internal hang.
 * 4. SURGICAL MUTEX: Serialization ensures atomic state updates.
 */

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useMemo } from "react";
import { clearCache } from "@/lib/cache";
import { UserProfile } from "@/types/core";
import { createClient, runAuthSafe } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { Session, User } from "@supabase/supabase-js";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { AuthState, AuthEvent } from "@/lib/auth-fsm";
import { monitoredTransition, metrics } from "@/lib/auth-monitor";
import { LiveOpsDashboard } from "@/devtools/live-ops/LiveOpsDashboard";

interface AuthContextType {
  state: AuthState;
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isAuthResolved: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  initAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const supabase = createClient();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('[AUTH HOOK MOUNTED]');

  const [state, setState] = useState<AuthState>({ tag: 'initializing' });
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const sessionAuthorityRef = useRef<string | null>(null);

  const dispatch = (event: AuthEvent) => {
    setState(prev => {
      const next = monitoredTransition(prev, event);
      return next;
    });
  };

  /**
   * 1. AUTH INITIALIZATION & EVENT LISTENER
   */
  useEffect(() => {
    let mounted = true;

    const startSystem = async () => {
      try {
        await runAuthSafe(async () => {
          try {
            // [SEC] INITIAL SESSION TIMEOUT (V16.11)
            const sessionWithTimeout = Promise.race([
              supabase.auth.getSession(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('SESSION_FETCH_TIMEOUT')), 3000))
            ]) as Promise<{ data: { session: Session | null } }>;

            const { data: { session: initialSession } } = await sessionWithTimeout;
            
            if (!mounted) return;
            console.log('[AUTH EVENT] INITIAL_BOOT', !!initialSession);
            await resolveSession(initialSession);
          } catch (e) {
            console.error("[AUTH] Internal Resolve Failure:", e);
            dispatch({ type: 'NO_SESSION' });
            setIsAuthResolved(true);
          }
        }, { label: 'INITIAL_BOOT' });
      } catch (mutexError) {
        console.error("[AUTH] Mutex Timeout during Boot:", mutexError);
        setIsAuthResolved(true);
      }
    };

    startSystem();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      console.log('[AUTH EVENT]', event, !!currentSession);

      try {
        await runAuthSafe(async () => {
          try {
            // [SEC] UNIVERSAL RESOLUTION TRIGGER
            await resolveSession(currentSession);
          } finally {
            console.log(`[AUTH EVENT: ${event}] Processed`);
          }
        }, { label: 'AUTH_CHANGE' });
      } catch (mutexError) {
        console.error("[AUTH] Mutex Timeout during AuthChange:", mutexError);
        setIsAuthResolved(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * [DEBUG] STUCK-STATE WATCHDOG (V16.25)
   * Monitors for genuine initialization hangs.
   */
  useEffect(() => {
    if (state.tag !== 'initializing') return;

    const debugTimer = setTimeout(() => {
      if (state.tag === 'initializing') {
        console.warn('[AUTH DEBUG] System stuck in initializing after 6s. Mutex depth:', metrics.mutexQueueLength);
      }
    }, 6000);

    return () => clearTimeout(debugTimer);
  }, [state.tag]);

  /**
   * [SEC] AUTH FAILSAFE (PRODUCTION GUARD)
   * 
   * Ensures that the system NEVER remains stuck in 'initializing'.
   */
  useEffect(() => {
    if (isAuthResolved) return;

    const failsafe = setTimeout(() => {
      if (!isAuthResolved) {
        console.error('[AUTH FAILSAFE] System took too long to resolve. Forcing fallback.');
        dispatch({ type: 'NO_SESSION' });
        setIsAuthResolved(true);
      }
    }, 8000);

    return () => clearTimeout(failsafe);
  }, [isAuthResolved]);

  /**
   * 2. SESSION RESOLUTION (AUTHORITATIVE)
   */
  const resolveSession = async (currentSession: Session | null) => {
    const timestamp = () => new Date().toISOString();
    console.log('[RESOLVE START]', timestamp());

    if (!currentSession) {
      console.warn('[RESOLVE] 1. No session found → Treating as guest', timestamp());
      sessionAuthorityRef.current = 'GUEST';
      
      if (state.tag !== 'unauthenticated') {
        dispatch({ type: 'NO_SESSION' });
      } else {
        console.log('[RESOLVE] 1a. Already guest. Skipping dispatch.', timestamp());
      }
      
      setIsAuthResolved(true);
      return;
    }

    sessionAuthorityRef.current = currentSession.access_token;

    try {
      setSession(currentSession);
      setUser(currentSession.user);

      console.log('[RESOLVE] 2. Initiating Profile Fetch...', timestamp());

      // [SEC] ACCELERATED FETCH TIMEOUT (V16.7)
      console.log('[RESOLVE] 2a. Accelerated timeout active (2s)', timestamp());
      const profileWithTimeout = Promise.race([
        supabase.from('profiles').select('*').eq('id', currentSession.user.id).maybeSingle(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('PROFILE_FETCH_TIMEOUT')), 2000)
        )
      ]) as Promise<{ data: any; error: any }>;

      const { data, error } = await profileWithTimeout;
      if (error) throw error;

      // 🛡️ STALE PROTECTION
      const isCurrent = sessionAuthorityRef.current === currentSession.access_token;
      if (!isCurrent) {
        console.warn('[RESOLVE] 2b. Authority changed during fetch. Aborting.', timestamp());
        return;
      }

      setProfile(data);
      console.log(`[RESOLVE] 3. Profile synced. Target: ${data ? 'authenticated' : 'onboarding'}`, timestamp());
      dispatch({ type: 'SESSION_FOUND', hasProfile: !!data });
      
    } catch (e: any) {
      console.error('[RESOLVE] Critical Error:', e.message || e, timestamp());
      dispatch({ type: 'SESSION_FOUND', hasProfile: false });
    } finally {
      setIsAuthResolved(true);
      console.log('[RESOLVE COMPLETE]', timestamp());
    }
  };

  const logout = async () => {
    await runAuthSafe(async () => {
      try {
        console.log('[LOGOUT] 1. Instant local state reset...');
        setIsAuthResolved(false);
        
        // [UI-FIRST] RESET (V16.19)
        // Clear all identity state immediately to unmount protected components
        setUser(null);
        setProfile(null);
        setSession(null);
        sessionAuthorityRef.current = 'GUEST';
        
        console.log('[LOGOUT] 2. Submitting SignOut to Supabase...');
        // 🛡️ SIGNOUT TIMEOUT (V16.15)
        try {
          await Promise.race([
            supabase.auth.signOut(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('SIGNOUT_TIMEOUT')), 3000))
          ]);
          console.log('[LOGOUT] 2a. Supabase SignOut Complete.');
        } catch (signOutError) {
          console.warn('[LOGOUT] 2b. SignOut network hang, continuing with local reset.', signOutError);
        }

        clearCache();
        dispatch({ type: 'LOGOUT' });
        setIsAuthResolved(true);
        console.log('[LOGOUT] 3. Cleanup complete.');
      } catch (e) {
        console.error("[LOGOUT] Critical Failure:", e);
        setIsAuthResolved(true);
      }
    }, { priority: 'high', label: 'LOGOUT' });
  };

  const login = async (email: string, password: string) => {
    const timestamp = () => new Date().toISOString();
    console.log('[LOGIN] Initiating high-priority task...', timestamp());
    await runAuthSafe(async () => {
      console.log('[LOGIN] 1. Submitting credentials to Supabase...', timestamp());
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('[LOGIN] Supabase Error:', error.message, timestamp());
        throw error;
      }
      
      if (data.session) {
        console.log('[LOGIN] 2. Success. Transitioning to resolution...', timestamp());
        await resolveSession(data.session);
        console.log('[LOGIN] 3. Terminal state achieved.', timestamp());
      } else {
        console.warn('[LOGIN] No session returned from Supabase.', timestamp());
      }
    }, { priority: 'high', label: 'LOGIN' });
  };

  /**
   * 🛡️ RESTORED: HARD-SYNC PROFILE (c9cb87d)
   */
  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = prev ? { ...prev, ...data } : { ...data } as UserProfile;
      if (data.onboarding_completed) {
        dispatch({ type: 'SESSION_FOUND', hasProfile: true });
      }
      return updated;
    });
  };

  /**
   * 🛡️ RESTORED: MANUAL INIT (c9cb87d)
   */
  const initAuth = async () => {
    await runAuthSafe(async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      await resolveSession(s);
    }, { label: 'MANUAL_INIT' });
  };

  const value = useMemo(() => ({
    state, session, user, profile, isAuthResolved, logout, login, updateProfile, initAuth
  }), [session, user, profile, state, isAuthResolved]);

  if (state.tag === "initializing" || !isAuthResolved) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LiveOpsDashboard />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

/**
 * 🛡️ DETERMINISTIC ROUTE GUARD HOOK
 */
export function useAuthGuard(required: 'authenticated' | 'unauthenticated' | 'onboarding') {
  const { state, isAuthResolved } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    hasRedirectedRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!isAuthResolved || state.tag === 'initializing') return;
    if (hasRedirectedRef.current) return;

    // Guest trying to access protected route
    if (required === 'authenticated' && state.tag === 'unauthenticated') {
      console.log('[GUARD] Unauthenticated user on protected route. Redirecting to /');
      hasRedirectedRef.current = true;
      router.replace('/');

      // 🛡️ HARD REDIRECT FALLBACK
      setTimeout(() => {
        if (window.location.pathname !== '/') window.location.href = '/';
      }, 2000);
      return;
    }

    // Authenticated user trying to access landing/guest page
    if (required === 'unauthenticated' && state.tag === 'authenticated') {
      console.log('[GUARD] Authenticated user on guest route. Redirecting to /home');
      hasRedirectedRef.current = true;
      router.replace('/home');

      // 🛡️ HARD REDIRECT FALLBACK
      setTimeout(() => {
        if (window.location.pathname !== '/home') window.location.href = '/home';
      }, 2000);
      return;
    }

    // New user needs onboarding
    if (state.tag === 'onboarding' && required !== 'onboarding') {
      console.log('[GUARD] User needs onboarding. Redirecting to /onboarding');
      hasRedirectedRef.current = true;
      router.replace('/onboarding');

      // 🛡️ HARD REDIRECT FALLBACK
      setTimeout(() => {
        if (window.location.pathname !== '/onboarding') window.location.href = '/onboarding';
      }, 2000);
      return;
    }
  }, [state.tag, isAuthResolved, required, router]);

  return { loading: state.tag === 'initializing' || !isAuthResolved, state };
}

export function useRequiredUser() {
  const { user, state, isAuthResolved } = useAuth();
  if (state.tag === 'initializing' || !isAuthResolved) return { user: null, loading: true };
  if (!user || state.tag !== 'authenticated') throw new Error('User not authenticated');
  return { user, loading: false };
}
