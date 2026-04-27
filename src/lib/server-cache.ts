/**
 * SERVER-SIDE CACHE ENGINE (V1.17)
 * 
 * Purpose: Minimize database load for high-traffic read operations.
 * Context: Server-only (API Routes / Server Actions)
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// Global cache instance (persists across hot-reloads in dev and concurrent requests in prod)
const globalCache = new Map<string, CacheEntry<any>>();

/**
 * Executes a fetcher function and caches the result.
 * Implements a simple Stale-While-Revalidate pattern on the server.
 */
export async function nextSafeCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  const now = Date.now();
  const entry = globalCache.get(key);

  // 1. Return fresh cache if available
  if (entry && entry.expiry > now) {
    return entry.data;
  }

  // 2. If stale or missing, fetch from source
  const data = await fetcher();
  
  // 3. Store in cache
  globalCache.set(key, {
    data,
    expiry: now + (ttlSeconds * 1000)
  });

  return data;
}

export function invalidateServerCache(key: string) {
  globalCache.delete(key);
}
