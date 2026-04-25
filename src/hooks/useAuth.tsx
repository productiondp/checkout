"use client";

// 🔒 STABLE: Do not modify without full regression testing

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef, useMemo } from "react";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  // 🛡️ INITIALIZE SUPABASE LAZILY TO PREVENT CIRCULAR INITIALIZATION ISSUES
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<UserProfile | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(undefined);
  const [error, setError] = useState<string | null>(null);

  // 🛡️ REFS FOR STABILITY (STEP 1, 2, 4)
  const didTimeout = useRef(false);
  const lastSyncRef = useRef(0);
  const loaderStart = useRef(Date.now());
  const initialized = useRef(false);
  const hasRouted = useRef(false);

  const router = useRouter();
  const pathname = usePathname();

  // 🛡️ STEP 2: DEBUG LOGGING (DEV ONLY)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[AUTH]", {
        loading,
        session: !!session,
        user: !!user,
        onboarding: user?.onboarding_completed,
        pathname
      });
    }
  }, [loading, session, user, pathname]);

  const isAuthReady = !loading && (
    (session && user !== undefined) || 
    (session === null)
  );
  
  // 🛡️ STEP 4: ANTI-FLICKER RESOLVE
  const resolveLoading = useCallback((force = false) => {
    const elapsed = Date.now() - loaderStart.current;
    const minDisplay = 200; // 200ms minimum

    if (elapsed < minDisplay && !force) {
      setTimeout(() => setLoading(false), minDisplay - elapsed);
    } else {
      setLoading(false);
    }
  }, []);

  // 🛡️ STEP 5: SINGLE GLOBAL SAFETY GUARD
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn("[AUTH] Safety Gate Triggered - Forcing reset");
        analytics.track('AUTH_TIMEOUT');
        didTimeout.current = true;
        setSession(null);
        setUser(null);
        resolveLoading(true);
      }
    }, 5000);
    return () => clearTimeout(safetyTimer);
  }, [loading, resolveLoading]);


  const syncProfile = useCallback(async (currentSession: any) => {
    // 🛡️ STEP 1: PREVENT DOUBLE SYNC
    if (Date.now() - lastSyncRef.current < 1500) return;
    
    if (!currentSession?.user) {
      setSession(null);
      setUser(null);
      resolveLoading();
      return;
    }
    
    try {
      setSession(currentSession);
      
      // 🛡️ STEP 2: PROFILE AUTO-RECOVERY (V11)
      let { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();
      
      if (fetchError && fetchError.code === 'PGRST116') {
         // Profile missing -> Auto-create to prevent crash
         console.info("[AUTH] Profile missing. Initiating auto-creation...");
         const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
               id: currentSession.user.id,
               full_name: currentSession.user.user_metadata?.full_name || "New Partner",
               role: 'PROFESSIONAL',
               onboarding_completed: false,
               metadata: { verification_skipped: true }
            })
            .select()
            .single();
         
         if (createError) throw createError;
         profile = newProfile;
      } else if (fetchError) {
         throw fetchError;
      }
      
      if (profile) {
        lastSyncRef.current = Date.now();
        const userData = {
          ...profile,
          expertise: profile.skills || [],
          intents: profile.intent_tags || profile.domains || [],
          onboarding_completed: !!profile.onboarding_completed,
          created_at: profile.created_at,
          full_name: profile.full_name || currentSession.user_metadata?.full_name || "New Partner",
          avatar_url: profile.avatar_url || currentSession.user_metadata?.avatar_url || DEFAULT_AVATAR
        } as UserProfile;

        // 🧠 V11: CONDITIONAL EMAIL VERIFICATION
        const REQUIRE_EMAIL_VERIFICATION = false;

        if (REQUIRE_EMAIL_VERIFICATION && !currentSession.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setError("Verification required. Please check your inbox.");
          resolveLoading();
          return;
        }

        // V13 Hardened Trust Integration
        if (!currentSession.user.email_confirmed_at && !userData.metadata?.trust_score) {
           const email = currentSession.user.email || "";
           const isProfessionalDomain = !['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'].some(d => email.endsWith(d));
           const initialTrust = 15 + (isProfessionalDomain ? 2 : 0);

           userData.metadata = {
              ...userData.metadata,
              verification_skipped: true,
              trust_score: initialTrust,
              trust_confidence: 0.5,
              meaningful_action_count: 0,
              unique_action_types: [],
              initial_trust_score: initialTrust
           };
        }

        setUser(userData);
        setError(null);
      }
    } catch (err: any) {
      console.error("[AUTH] Stabilization Failure:", err);
      // Do not show hard error immediately, attempt one silent retry in initAuth
    } finally {
      resolveLoading();
    }
  }, [resolveLoading, supabase]);

  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      loaderStart.current = Date.now();

      // 🛡️ STEP 3: REFRESH SESSION FOR HYDRATION (V11)
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;

      if (currentSession) {
        await syncProfile(currentSession);
      } else {
        setSession(null);
        setUser(null);
        resolveLoading();
      }
    } catch (err: any) {
      console.error("[AUTH] Handshake Failure:", err);
      setError("Authentication failed. Please retry.");
      setSession(null);
      setUser(null);
      resolveLoading();
    }
  }, [syncProfile, resolveLoading, supabase]);

  const handleRetry = useCallback(async () => {
     setError(null);
     setLoading(true);
     const { data: { session } } = await supabase.auth.getSession();
     if (session) {
        window.location.reload();
     } else {
        router.replace('/login');
     }
  }, [supabase, router]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`[AUTH_EVENT] ${event}`);

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        resolveLoading();
        window.location.href = '/';
        return;
      }

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        if (currentSession) {
          await syncProfile(currentSession);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [initAuth, syncProfile, resolveLoading, supabase]);

  // 🛡️ ROUTING SYNC
  useEffect(() => {
    if (typeof window === "undefined" || !isAuthReady || hasRouted.current) return;
    if (didTimeout.current && session) return;

    const current = window.location.pathname;
    let target = '/login';

    if (session && user) {
      target = user.onboarding_completed ? '/home' : '/onboarding';
    } else if (session && user === null) {
      // Profile sync in progress or failed
      return;
    }

    if (current === target || (session && ['/login', '/signup', '/'].includes(current) && target !== current)) {
       if (target !== current) {
          hasRouted.current = true;
          router.replace(target);
       }
       return;
    }

    // Public routes allow
    if (!session && !['/login', '/signup', '/'].includes(current)) {
       hasRouted.current = true;
       router.replace('/login');
    }
  }, [isAuthReady, session, user, router]);

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      router.replace('/');
    } catch (err) {
      window.location.href = '/';
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) setUser({ ...user, ...data });
  };

  // 🛡️ STEP 8: RECOVERABLE ERROR UI
  if (error) {
    return (
      <ErrorFallback 
        onRetry={handleRetry} 
        onLogout={logout} 
        error={error} 
      />
    );
  }

  return (
    <AuthContext.Provider value={{ user, login: async () => {}, logout, updateProfile, loading, session, initAuth }}>
      {loading ? <FullScreenLoader /> : children}
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

export function AuthGate({ children }: { children: ReactNode }) {
  const { loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  return <>{children}</>;
}
