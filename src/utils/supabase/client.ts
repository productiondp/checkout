import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  if (typeof window !== 'undefined') {
    console.error("[SUPABASE] CRITICAL: Environment variables missing!");
  }
}

let supabaseInstance: any = null;

export const createClient = () => {
  const isServer = typeof window === 'undefined';
  const isValidConfig = supabaseUrl && supabaseUrl.startsWith('http');

  if (isServer) {
    return createBrowserClient(
      isValidConfig ? supabaseUrl : "https://placeholder.supabase.co",
      supabaseKey || ""
    );
  }

  if (!supabaseInstance) {
    try {
      console.log("[SUPABASE] Initializing Singleton Client...");
      if (!isValidConfig) {
        console.warn("[SUPABASE] Using placeholder URL due to missing environment variables.");
      }
      supabaseInstance = createBrowserClient(
        isValidConfig ? supabaseUrl : "https://placeholder.supabase.co",
        supabaseKey || ""
      );
    } catch (err) {
      console.error("[SUPABASE] Critical initialization error:", err);
      // Create a minimal fallback to prevent total application crash
      return { auth: {}, from: () => ({ select: () => ({ order: () => ({ limit: () => ({}) }) }) }) } as any;
    }
  }
  
  return supabaseInstance;
};
