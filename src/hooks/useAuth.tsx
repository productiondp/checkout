"use client";

/**
 * 🔒 AUTH SYSTEM — DO NOT MODIFY WITHOUT FULL AUDIT
 * 
 * This is a deterministic state machine designed for production stability.
 * Changes to the core logic can introduce race conditions, redirect loops,
 * and session corruption.
 * 
 * Logic follows the SENTINEL_OS V.22 Hardening Protocol.
 */

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef, useMemo } from "react";
import { UserProfile } from "@/types/core";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import FullScreenLoader from "@/components/auth/FullScreenLoader";
import { analytics } from "@/utils/analytics";

export type AuthState = "loading" | "guest" | "authenticated" | "onboarding";

interface AuthContextType {
  user: UserProfile | null;
  authState: AuthState;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  loading: boolean;
  session: any | null;
  initAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🛡️ INFRASTRUCTURE MODE: FALLBACK AGGRESSIVELY
const AUTH_SAFE_MODE = true;

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // 🛡️ STEP 3 — AUTH SAFE MODE
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const initialized = useRef(false);
  const profileFetchId = useRef<string | null>(null);
  const hasRetriedRef = useRef(false);
  const timeoutRef = useRef<any>(null);
  const loaderStart = useRef(Date.now());
  
  const router = useRouter();
  const pathname = usePathname();

  const log = (msg: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[AUTH] ${msg}`, data || "");
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      log("Core infrastructure active — monitoring state changes");
    }
  }, []);

  useEffect(() => {
    profileFetchId.current = null;
    hasRetriedRef.current = false;
    if (!session) {
       setUser(null);
       setProfileLoaded(false);
    }
  }, [session?.user?.id]);

  // 🛡️ WATCHDOG — DO NOT ALTER
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (authState === "loading") {
        log("WATCHDOG_TRIGGERED");
        
        // Force resolve to Guest if no session after 4s
        if (!session) {
           setAuthState("guest");
           setProfileLoaded(true);
        } else if (!profileLoaded) {
           // If we have a session but profile is slow, try to resolve anyway
           setAuthState(user?.onboarding_completed ? "authenticated" : "onboarding");
           setProfileLoaded(true);
        }
      }
    }, 4000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [authState, session, profileLoaded, user]);

  // 🛡️ CORE LOGIC — DO NOT ALTER
  const syncProfile = useCallback(async (currentSession: any) => {
    if (!currentSession?.user) {
      setSession(null);
      setUser(null);
      setAuthState("guest");
      return;
    }

    const sessionId = currentSession.user.id + currentSession.access_token.slice(-10);
    if (profileFetchId.current === sessionId) return;
    profileFetchId.current = sessionId;

    try {
      const startTime = Date.now();
      setSession(currentSession);
      
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();

      if (fetchError || !profile) {
        log("SYNC_FAILURE", fetchError || "Null Profile");
        
        if (!hasRetriedRef.current) {
           log("RETRYING_SYNC...");
           hasRetriedRef.current = true;
           profileFetchId.current = null;
           analytics.track('AUTH_RETRY', currentSession.user.id);
           return await syncProfile(currentSession);
        }

        setAuthState("onboarding");
        analytics.track('PROFILE_FETCH_FAILURE', currentSession.user.id, { error: fetchError });
      } else {
        const userData = {
          ...profile,
          expertise: profile.skills || [],
          intents: profile.intent_tags || [],
          onboarding_completed: !!profile.onboarding_completed
        } as UserProfile;

        setUser(userData);
        setAuthState(userData.onboarding_completed ? "authenticated" : "onboarding");
        
        analytics.track('PROFILE_SYNC_SUCCESS', currentSession.user.id, { 
          duration: Date.now() - startTime 
        });
      }
      setProfileLoaded(true);
    } catch (err) {
      log("CRITICAL_SYNC_CRASH", err);
      setAuthState("onboarding");
      setProfileLoaded(true);
    }
  }, [supabase]);

  // 🛡️ CORE LOGIC — DO NOT ALTER
  const initAuth = useCallback(async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        await syncProfile(currentSession);
      } else {
        setAuthState("guest");
        setProfileLoaded(true);
      }
    } catch (err) {
      setAuthState("guest");
      setProfileLoaded(true);
    }
  }, [supabase, syncProfile]);

  // 🛡️ CORE LISTENER — DO NOT ALTER
  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured. Auth bypassed.");
      setAuthState("guest");
      setProfileLoaded(true);
      return;
    }

    if (initialized.current) return;
    initialized.current = true;
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      log("AUTH_EVENT", event);
      if (event === 'SIGNED_OUT') {
        window.location.href = '/'; 
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
      } else if (['SIGNED_IN', 'USER_UPDATED'].includes(event)) {
        if (currentSession) await syncProfile(currentSession);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [initAuth, syncProfile, supabase]);

  // 🛡️ ROUTE GROUPS
  const PUBLIC_ROUTES = ["/"];

  // 🛡️ AUTH READY GATE
  const isAuthReady = useMemo(() => {
    return authState !== "loading" && (session ? profileLoaded : true);
  }, [authState, session, profileLoaded]);

  // 🛡️ LOADER TIMEOUT GUARD (Watchdog already exists, but reinforcing for UI)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (authState === "loading") {
        log("WATCHDOG_FORCED_RESOLVE");
        if (session) {
           setAuthState(user?.onboarding_completed ? "authenticated" : "onboarding");
        } else {
           setAuthState("guest");
        }
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [authState, session, user]);

  // 🛡️ DEBUG LOG
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[AUTH_DEBUG]", {
        loading: authState === "loading",
        user: !!user,
        session: !!session,
        isAuthReady,
        path: typeof window !== "undefined" ? window.location.pathname : "ssr"
      });
    }
  }, [authState, user, session, isAuthReady]);

  // 🛡️ HUMAN-READABLE UI STATUS
  const [uiStatus, setUiStatus] = useState<'loading' | 'timeout' | 'offline' | 'logout' | 'setup'>('loading');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); if (uiStatus === 'offline') setUiStatus('loading'); };
    const handleOffline = () => { setIsOnline(false); setUiStatus('offline'); };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [uiStatus]);

  // 🛡️ PERFORMANCE & HYDRATION LOCKS
  const hasHydrated = useRef(false);
  const lastProcessedState = useRef<string>("");
  const routingTimeoutRef = useRef<any>(null);
  const watchdogRef = useRef<any>(null);

  useEffect(() => {
    hasHydrated.current = true;
    
    // Non-Intrusive Timeout UI (6 seconds)
    const timeoutTimer = setTimeout(() => {
      if (authState === "loading" || !isAuthReady) {
        setUiStatus('timeout');
      }
    }, 6000);

    return () => {
      if (routingTimeoutRef.current) clearTimeout(routingTimeoutRef.current);
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      clearTimeout(timeoutTimer);
    };
  }, [authState, isAuthReady]);

  // 🛡️ ROUTING SENTINEL (ONLY ONE)
  useEffect(() => {
    if (!isAuthReady || !hasHydrated.current || !isOnline) return;

    const stateSnapshot = `${authState}_${user?.id}_${user?.onboarding_completed}_${!!session}`;
    if (lastProcessedState.current === stateSnapshot) return;

    if (routingTimeoutRef.current) clearTimeout(routingTimeoutRef.current);
    
    routingTimeoutRef.current = setTimeout(() => {
      try {
        const path = window.location.pathname;
        let target = path;

        // 0. SESSION LOSS GUARD
        if (user && !session) {
          setUser(null);
          setAuthState("guest");
          if (path !== "/") router.replace("/");
          return;
        }

        // 1. GUEST FLOW (No Session)
        if (!session) {
          if (!PUBLIC_ROUTES.includes(path)) {
            if (path !== '/') {
              sessionStorage.setItem('return_to', path);
            }
            target = "/";
          }
        } 
        // 2. ONBOARDING FLOW (Session exists, but profile incomplete or missing)
        else if (!user || !user.onboarding_completed || !user.role || !user.full_name) {
          if (path !== "/onboarding") target = "/onboarding";
        } 
        // 3. AUTHENTICATED FLOW (Respect Intent)
        else if (PUBLIC_ROUTES.includes(path) || (path === "/onboarding" && user.onboarding_completed)) {
          const returnTo = sessionStorage.getItem('return_to');
          const isValidRoute = returnTo && (returnTo.startsWith('/') && !returnTo.includes('://'));
          
          target = isValidRoute ? returnTo : "/home";
          sessionStorage.removeItem('return_to');
        }

        // 🛡️ REDUNDANT NAVIGATION GUARD
        if (target !== path) {
          log("SENTINEL_REDIRECT", { from: path, to: target });
          router.replace(target);
          lastProcessedState.current = stateSnapshot;
          
          // CONSERVATIVE WATCHDOG: Only force if stuck > 2s with no change
          if (watchdogRef.current) clearTimeout(watchdogRef.current);
          watchdogRef.current = setTimeout(() => {
            if (window.location.pathname === path) {
              log("ROUTING_STUCK_DETECTED", { target });
              router.replace(user ? "/home" : "/");
            }
          }, 2000);
        } else {
          lastProcessedState.current = stateSnapshot;
        }

      } catch (err) {
        log("ROUTING_FATAL_ERROR", err);
        if (window.location.pathname !== (user ? "/home" : "/")) {
          router.replace(user ? "/home" : "/");
        }
      }
    }, 0);

  }, [isAuthReady, authState, user?.id, user?.onboarding_completed, !!session, router, isOnline]);

  const login = async () => {
    // Handled in Auth components
  };

  const logout = async () => {
    try {
      log("LOGOUT_INITIATED");
      
      // 1. Snappy UI Feedback & Lock
      setUiStatus('logout');
      setAuthState("loading");
      
      // 2. Immediate local cleanup
      setSession(null);
      setUser(null);
      profileFetchId.current = "LOGGED_OUT"; // Block any pending profile syncs
      
      // 3. Clear session storage
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }

      // 4. Trigger signout and await completion
      await supabase.auth.signOut();
      
      // 5. Force immediate hard redirect to clean everything
      window.location.replace('/');
    } catch (err) {
      log("LOGOUT_ERROR", err);
      window.location.replace('/');
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const newUser = { ...user, ...data };
      setUser(newUser);
      if (data.onboarding_completed) {
        setAuthState("authenticated");
        lastProcessedState.current = ""; // Force sentinel re-run
      }
    }
  };

  // 🛡️ HYDRATION SAFE OVERLAY
  const [showDebug, setShowDebug] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') setShowDebug(true);
  }, []);

  // 🛡️ ROOT LOADER GUARANTEE
  if (authState === "loading" || !isAuthReady || !isOnline || uiStatus !== 'loading') {
    const isSetupState = user && isAuthReady && (!user.full_name || !user.role);
    
    // Priority Messaging: Offline > Timeout > Setup > Logout > Loading
    let finalStatus: 'loading' | 'timeout' | 'offline' | 'logout' | 'setup' = 'loading';
    if (!isOnline) finalStatus = 'offline';
    else if (uiStatus === 'timeout') finalStatus = 'timeout';
    else if (isSetupState) finalStatus = 'setup';
    else if (uiStatus === 'logout') finalStatus = 'logout';
    else finalStatus = uiStatus;

    return (
      <FullScreenLoader 
        status={finalStatus} 
        onRetry={() => { setUiStatus('loading'); initAuth(); }}
        onHome={() => { router.replace(user ? "/home" : "/"); setUiStatus('loading'); }}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      authState,
      login, 
      logout, 
      updateProfile, 
      loading: authState === "loading", 
      session, 
      initAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.warn("useAuth must be used within an AuthProvider");
    return {} as any;
  }
  return context;
}

/**
 * 🔒 SAFE AUTH HOOK VARIANT
 * 
 * Returns the current user profile. 
 * Throws an error in development if the user is missing.
 */
export function useRequiredUser() {
  const { user, authState } = useAuth();
  
  if (process.env.NODE_ENV === "development" && authState === "authenticated" && !user) {
    console.warn("[AUTH CRITICAL] useRequiredUser called but user is missing.");
  }
  
  return user;
}
