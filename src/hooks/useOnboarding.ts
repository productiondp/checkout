import { useEffect } from 'react';
import { useQuery } from './useQuery';
import { createClient } from '@/utils/supabase/client';
import { getScopedKey, clearCache } from '@/lib/cache';

const supabase = createClient();

export interface OnboardingState {
  user_id: string;
  completed: boolean;
  step: string;
  updated_at: string;
}

/**
 * Tracks onboarding progress with instant cache resolution
 * Features:
 * 1. Scoped caching
 * 2. Realtime sync
 */
export function useOnboarding(userId: string | undefined) {
  const scopedKey = userId ? getScopedKey('onboarding', userId) : null;

  const query = useQuery<OnboardingState | null>(scopedKey, async () => {
    if (!userId) return null;

    const { data } = await supabase
      .from('onboarding_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return data as OnboardingState;
  }, { priority: 'high' });

  // 🔄 REALTIME SYNC
  useEffect(() => {
    if (!userId || !scopedKey) return;

    const channel = supabase
      .channel(`onboarding-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'onboarding_state',
        filter: `user_id=eq.${userId}`
      }, () => {
        console.log(`[REALTIME] Onboarding state updated for ${userId}. Invalidating cache.`);
        clearCache(scopedKey);
        query.refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, scopedKey, query.refetch]);

  return query;
}
