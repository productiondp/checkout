import { useEffect } from 'react';
import { useQuery } from './useQuery';
import { createClient } from '@/utils/supabase/client';
import { clearCache } from '@/lib/cache';
import { getFlags } from '@/lib/flags';
import { rpc } from '@/rpc/client';

const supabase = createClient();

/**
 * 🛡️ OPTIMIZED DOMAIN RPC HOOK (V6.0)
 * 
 * Features:
 * 1. Domain-Split RPC: Uses rpc.profile namespace for better splitting.
 * 2. Lazy Execution: Server handlers are loaded only when called.
 * 3. Type-Safe Proxy: Full IntelliSense with zero client-side server code.
 */
export function useProfile(userId: string | undefined) {
  const scopedKey = userId ? { type: 'profile' as const, userId } : null;

  // 📡 OPTIMIZED RPC FETCH
  const query = useQuery(scopedKey, async () => {
    if (!userId) throw new Error("UserId required");
    return rpc.profile.getProfile({ userId });
  }, { priority: 'high' });

  // 🔒 OPTIMIZED RPC MUTATION
  const updateProfile = async (input: Parameters<typeof rpc.profile.updateProfile>[0]) => {
    if (!userId || !scopedKey) return;

    try {
      const updated = await rpc.profile.updateProfile(input);
      
      clearCache(scopedKey);
      query.refetch(true);
      
      return updated;
    } catch (error) {
      console.error("[PROFILE RPC] Update Failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!userId || !scopedKey) return;
    if (!getFlags().realtime.enabled) return;

    const channel = supabase
      .channel(`profile-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      }, () => {
        console.log(`[REALTIME] Profile updated. Syncing via Lazy RPC.`);
        clearCache(scopedKey);
        query.refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, scopedKey, query.refetch]);

  return {
    ...query,
    updateProfile
  };
}
