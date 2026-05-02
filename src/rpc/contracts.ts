import { z } from 'zod';

/**
 * 🧬 RPC CONTRACT DEFINITIONS
 * 
 * The single source of truth for all client-server communications.
 * Every method defines its input and output schema for mandatory
 * runtime validation and absolute type safety.
 */
export const rpcContracts = {
  updateProfile: {
    input: z.object({
      name: z.string().min(1, "Name is required").max(100),
      avatar_url: z.string().url().optional().nullable(),
      skills: z.array(z.string()).optional().nullable(),
      intent_tags: z.array(z.string()).optional().nullable(),
      onboarding_completed: z.boolean().optional(),
    }),
    output: z.object({
      id: z.string().uuid(),
      name: z.string().nullable(),
      avatar_url: z.string().nullable(),
      onboarding_completed: z.boolean(),
      expertise: z.array(z.string()),
      intents: z.array(z.string()),
    }),
  },
  
  getProfile: {
    input: z.object({
      userId: z.string().uuid(),
    }),
    output: z.object({
      id: z.string().uuid(),
      name: z.string().nullable(),
      avatar_url: z.string().nullable(),
      onboarding_completed: z.boolean(),
      expertise: z.array(z.string()),
      intents: z.array(z.string()),
    }),
  }
};

export type RPCContracts = typeof rpcContracts;
