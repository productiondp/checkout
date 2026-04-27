import { createClient } from "@/utils/supabase/server";

/**
 * REAL-TIME COORDINATOR (V1.20)
 * 
 * Purpose: Aggregates raw DB changes into clean, high-level broadcast events.
 * Context: Server-side (API Routes / Edge Functions)
 */

export type CleanEvent = 
  | 'ADVISOR_UPDATED' 
  | 'MEETUP_UPDATED' 
  | 'PARTICIPANT_JOINED' 
  | 'TRUST_SCORE_CHANGED';

export async function broadcastCleanEvent(advisorId: string, type: CleanEvent, metadata: any = {}) {
  const supabase = createClient();
  
  // Use Supabase Broadcast to send a simplified message to all clients
  const channel = supabase.channel(`advisor_events:${advisorId}`);
  
  await channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.send({
        type: 'broadcast',
        event: 'sync',
        payload: {
          type,
          advisorId,
          timestamp: Date.now(),
          ...metadata
        }
      });
      // Unsubscribe after sending (stateless server broadcast)
      await channel.unsubscribe();
    }
  });
}

/**
 * SERVER-SIDE EVENT AGGREGATOR
 * 
 * Decides if a change is important enough to broadcast.
 */
export function shouldBroadcast(oldData: any, newData: any, table: 'profiles' | 'posts'): CleanEvent | null {
  if (table === 'profiles') {
    if (newData.advisor_score !== oldData.advisor_score) return 'TRUST_SCORE_CHANGED';
    if (newData.full_name !== oldData.full_name || newData.bio !== oldData.bio) return 'ADVISOR_UPDATED';
  }
  
  if (table === 'posts') {
    if (newData.participant_count !== oldData.participant_count) return 'PARTICIPANT_JOINED';
    if (newData.status !== oldData.status || newData.title !== oldData.title) return 'MEETUP_UPDATED';
  }

  return null;
}
