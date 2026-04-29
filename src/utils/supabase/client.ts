import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  if (typeof window !== 'undefined') {
    console.error("[SUPABASE] CRITICAL: Environment variables missing!");
  }
}

let supabaseInstance: any = null;

export const createClient = () => {
  // On the server, always create a new client
  if (typeof window === 'undefined') {
    return createBrowserClient(
      supabaseUrl || "",
      supabaseKey || ""
    );
  }

  // On the client, use a singleton to prevent infinite initialization loops
  if (!supabaseInstance) {
    console.log("[SUPABASE] Initializing Singleton Client...");
    supabaseInstance = createBrowserClient(
      supabaseUrl || "",
      supabaseKey || ""
    );
  }
  
  return supabaseInstance;
};
