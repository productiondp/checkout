import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";
import { metrics } from "@/lib/auth-monitor";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;
let isProcessing = false;
const queue: Array<{ 
  fn: () => Promise<any>, 
  resolve: (v: any) => void, 
  reject: (e: any) => void,
  queuedAt: number,
  label: string,
  priority: 'high' | 'low'
}> = [];

/**
 * [AUTH MUTEX] (V16.6)
 * 
 * Ensures all Supabase auth operations are serialized.
 * Uses a strict FIFO queue with Priority Support and 5s watchdog.
 */
export async function runAuthSafe<T>(
  fn: () => Promise<T>, 
  options: { priority?: 'high' | 'low', label?: string } = {}
): Promise<T | void> {
  return new Promise((resolve, reject) => {
    const priority = options.priority || 'low';
    const label = options.label || 'unlabeled';
    metrics.mutexQueueLength++;
    
    const task = { fn, resolve, reject, queuedAt: Date.now(), label, priority };
    
    if (priority === 'high') {
      queue.unshift(task);
    } else {
      queue.push(task);
    }
    
    processQueue();
  });
}

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  const { fn, resolve, reject, queuedAt, label } = queue.shift()!;
  const waitTime = Date.now() - queuedAt;
  
  if (waitTime > 2000) {
    console.warn(`[AUTH MUTEX] High wait time for ${label}: ${waitTime}ms`);
  }

  const watchdog = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`AUTH_MUTEX_TIMEOUT [${label}] after 5000ms`)), 5000)
  );

  try {
    const result = await Promise.race([fn(), watchdog]) as any;
    resolve(result);
  } catch (e) {
    console.error('[AUTH MUTEX] Task Failed:', e);
    reject(e);
  } finally {
    metrics.mutexQueueLength--;
    isProcessing = false;
    setTimeout(processQueue, 0);
  }
}

// [DEBUG] STUCK-LOCK STROBE (V16.23)
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (isProcessing && queue.length > 0) {
      const oldestTask = queue[0];
      const wait = Date.now() - oldestTask.queuedAt;
      if (wait > 10000) {
        console.error(`[AUTH MUTEX] FORCE RECOVERY: Task stuck for ${wait}ms. Resetting lock.`);
        isProcessing = false;
        processQueue();
      }
    }
  }, 5000);
}

/**
 * SUPABASE BROWSER CLIENT (PRODUCTION SINGLETON)
 */
export function createClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  if (!url || !key) {
    const errorMsg = "[SUPABASE] Fatal: Missing environment variables. Please check your .env files for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";
    console.error(errorMsg);
    // In dev, throw to make it obvious
    if (process.env.NODE_ENV === 'development') {
      throw new Error(errorMsg);
    }
  }

  client = createBrowserClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    }
  });

  console.log('[SUPABASE CLIENT] Singleton initialized successfully.');
  return client;
}
