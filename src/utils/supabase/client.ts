import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[SUPABASE] CRITICAL: Environment variables missing!");
}

export const createClient = () => {
  console.log("[SUPABASE] Creating Client...");
  return createBrowserClient(
    supabaseUrl || "",
    supabaseKey || "",
  );
};
