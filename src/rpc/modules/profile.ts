/**
 *  OPTIMIZED PROFILE RPC MODULE
 * 
 * Performance Optimizations:
 * 1. Selective Field Selection: Minimizes DB payload and bandwidth.
 * 2. Instant Invalidation: Purges Edge caches on write.
 * 3. Cache-Control Hints: Enables global CDN caching for reads.
 */

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { rpcContracts } from '../contracts';
import { invalidate } from '@/lib/cache';

export const profileRPC = {
  /**
   * NODE RUNTIME: Stable for auth-sensitive writes.
   */
  updateProfile: async (input: unknown) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const parsed = rpcContracts.updateProfile.input.parse(input);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    //  OPTIMIZED UPDATE: Only return necessary fields
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: parsed.name,
        avatar_url: parsed.avatar_url,
        skills: parsed.skills,
        intent_tags: parsed.intent_tags,
        onboarding_completed: parsed.onboarding_completed
      })
      .eq('id', user.id)
      .select('id, name, avatar_url, onboarding_completed, skills, intent_tags')
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Profile update failed");

    //  INSTANT INVALIDATION: Purge Edge cache for this user
    invalidate([`profile-${user.id}`]);

    const response = {
      id: data.id,
      name: data.name,
      avatar_url: data.avatar_url,
      onboarding_completed: !!data.onboarding_completed,
      expertise: data.skills || [],
      intents: data.intent_tags || [],
    };

    return rpcContracts.updateProfile.output.parse(response);
  },

  /**
   * EDGE READY: Optimized for high-concurrency reads.
   */
  getProfile: async (input: unknown) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const parsed = rpcContracts.getProfile.input.parse(input);

    //  OPTIMIZED READ: Selective fields + Indexed query
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, onboarding_completed, skills, intent_tags')
      .eq('id', parsed.userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Profile not found");

    const response = {
      id: data.id,
      name: data.name,
      avatar_url: data.avatar_url,
      onboarding_completed: !!data.onboarding_completed,
      expertise: data.skills || [],
      intents: data.intent_tags || [],
    };

    //  PERFORMANCE TIP: The executor will handle Cache-Control headers
    return rpcContracts.getProfile.output.parse(response);
  }
};
