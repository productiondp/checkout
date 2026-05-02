import { z } from 'zod';
import { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type DbProfile = Tables['profiles']['Row'];

/**
 *  PROFILE UPDATE CONTRACT
 * Enforces runtime validation for profile modifications.
 */
export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  avatar_url: z.string().url().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  intent_tags: z.array(z.string()).optional().nullable(),
  onboarding_completed: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

/**
 *  PROFILE RESPONSE CONTRACT
 * Shared data structure between server and client.
 */
export const ProfileResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  onboarding_completed: z.boolean(),
  expertise: z.array(z.string()),
  intents: z.array(z.string()),
});

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

/**
 * Helper to map DB row to Contract Response
 */
export function mapToProfileResponse(row: DbProfile): ProfileResponse {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatar_url: row.avatar_url,
    onboarding_completed: !!row.onboarding_completed,
    expertise: row.skills || [],
    intents: row.intent_tags || [],
  };
}
