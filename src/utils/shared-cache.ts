/**
 * SHARED CACHE ENGINE (V1.16)
 * 
 * Purpose: Lightweight in-memory caching for high-frequency data (Advisors, Meetups).
 * Strategy: Stale-While-Revalidate (SWR) for instant UI feedback.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SharedCache {
  private static instance: SharedCache;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 60000; // 60 seconds

  public static getInstance() {
    if (!SharedCache.instance) SharedCache.instance = new SharedCache();
    return SharedCache.instance;
  }

  public set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.DEFAULT_TTL;
    return isExpired ? null : entry.data;
  }

  /**
   * Returns data even if expired, but marks it for revalidation.
   */
  public getStale<T>(key: string): { data: T | null; isStale: boolean } {
    const entry = this.cache.get(key);
    if (!entry) return { data: null, isStale: false };

    const isStale = Date.now() - entry.timestamp > this.DEFAULT_TTL;
    return { data: entry.data, isStale };
  }

  public clear(key?: string) {
    if (key) this.cache.delete(key);
    else this.cache.clear();
  }
}

export const sharedCache = SharedCache.getInstance();
