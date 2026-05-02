'use server';

/**
 * 🔒 TYPED PROFILE ACTIONS
 * 
 * Enforces runtime validation and absolute type safety for all profile mutations.
 */

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { UpdateProfileSchema, UpdateProfileInput, ProfileResponse, mapToProfileResponse } from '@/contracts/profile';

export async function updateProfile(input: unknown): Promise<ProfileResponse> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Runtime Validation
  const parsed = UpdateProfileSchema.parse(input);

  // 2. Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 3. Database Mutation
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
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Update failed");

  // 4. Return Typed Response
  return mapToProfileResponse(data);
}
