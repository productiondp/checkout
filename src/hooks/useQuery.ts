import { useState, useEffect, useCallback, useRef } from 'react';
import { getCache, setCache, fetchWithDedupe, getVersion, isOnline, CacheKey } from '@/lib/cache';
import { log, metrics } from '@/lib/logger';
import { getFlags, killRollout, isFeatureEnabled } from '@/lib/flags';

/**
 * PRODUCTION-GRADE RESILIENT FETCH HOOK (V3.0)
 * 
 * Features:
 * 1. Type-Safe Cache Keys: Prevents key collisions and leaks.
 * 2. Strict Query Contract: Enforced loading/error/data states.
 * 3. Offline Resilience: Serves cache when disconnected.
 * 4. Request Deduplication: Reuses active promises.
 */

export interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: (isSilent?: boolean) => Promise<void>;
}

interface QueryOptions {
  priority?: 'high' | 'low';
  enabled?: boolean;
}

export function useQuery<T>(
  key: CacheKey | null,
  fetcher: () => Promise<T>,
  options: QueryOptions = {}
): QueryResult<T> {
  const { enabled: isEnabled = true } = options;
  const [data, setData] = useState<T | null>(() => key ? getCache<T>(key) : null);
  const [loading, setLoading] = useState(() => {
    if (!key || !isEnabled) return false;
    const cached = getCache<T>(key);
    return !cached && isOnline();
  });
  const [error, setError] = useState<Error | null>(null);
  const lastVersion = useRef(key ? getVersion(key) : 0);

  const executeFetch = useCallback(async (isSilent = false) => {
    if (!key || !isEnabled) return;
    const flags = getFlags();
    
    // Determine userId for canary check from key if possible
    const userId = 'userId' in key ? (key as any).userId : undefined;
    const isNewDataLayerActive = isFeatureEnabled('newDataLayer', userId);

    // 📴 OFFLINE CHECK
    if (!isOnline()) {
      const cached = getCache<T>(key);
      if (cached) setData(cached);
      setLoading(false);
      return;
    }

    if (!isSilent) setLoading(true);
    const startTime = performance.now();

    try {
      // ⚡ Conditional Deduplication & Rollout Logic
      const freshData = (isNewDataLayerActive && flags.newDataLayer.enabled)
        ? await fetchWithDedupe(key, fetcher)
        : await fetcher();
      
      const duration = performance.now() - startTime;

      // 🚨 BLAST RADIUS CONTROL: High Latency
      if (duration > 3000 && isNewDataLayerActive) {
        killRollout('newDataLayer');
      }

      setCache(key, freshData);
      setData(freshData);
      setError(null);
      lastVersion.current = getVersion(key);
    } catch (err: any) {
      // 🚨 AUTOMATIC KILL-SWITCH: Error Threshold
      if (metrics.errors > 5 && isNewDataLayerActive) {
        killRollout('newDataLayer');
      }

      setError(err instanceof Error ? err : new Error(String(err)));
      
      // 🛡️ ERROR FALLBACK: If fetch fails, try to serve stale cache
      const cached = getCache<T>(key);
      if (cached) setData(cached);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [key, fetcher, isEnabled]);

  useEffect(() => {
    if (!key || !isEnabled) return;

    const interval = options.priority === 'high' ? 30000 : 300000; // 30s or 5m
    const timer = setInterval(() => executeFetch(true), interval);
    
    // Initial fetch if no data
    if (!data) executeFetch();

    return () => clearInterval(timer);
  }, [key, isEnabled, executeFetch, data, options.priority]);

  // Sync state if cache updated externally (e.g. other tab)
  useEffect(() => {
    if (!key) return;
    
    const sync = () => {
      const currentV = getVersion(key);
      if (currentV > lastVersion.current) {
        setData(getCache<T>(key));
        lastVersion.current = currentV;
      }
    };

    const interval = setInterval(sync, 1000);
    return () => clearInterval(interval);
  }, [key]);

  return { data, loading, error, refetch: executeFetch };
}
