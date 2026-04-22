import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are missing! Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
    // Return a dummy object to prevent the entire app from crashing on boot, 
    // though subsequent database calls will still fail gracefully.
    return {
      from: () => ({
        select: () => ({ order: () => ({ data: [], error: null }) }),
        delete: () => ({ eq: () => ({ error: "Config Missing" }) }),
        insert: () => ({ select: () => ({ data: [], error: "Config Missing" }) }),
        update: () => ({ eq: () => ({ data: [], error: "Config Missing" }) }),
      }),
      auth: { getSession: async () => ({ data: { session: null }, error: null }) },
      channel: () => ({ subscribe: () => ({}) })
    } as any;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};
