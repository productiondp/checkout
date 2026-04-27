import { createClient } from "./supabase/client";

export type LogEvent = 
  | 'post_created'
  | 'duplicate_blocked'
  | 'first_response_time'
  | 'boost_triggered'
  | 'trust_adjustment'
  | 'auth_success'
  | 'auth_failure'
  | 'fallback_injected'
  | 'escalation_triggered'
  | 'zero_match_detected'
  | 'flow_trace'
  | 'override_excessive';

export const logger = {
  async track(event: LogEvent, userId: string, metadata: any = {}) {
    const criticalEvents: LogEvent[] = [
      'post_created', 
      'duplicate_blocked', 
      'first_response_time', 
      'escalation_triggered',
      'zero_match_detected',
      'override_excessive'
    ];
    
    if (!criticalEvents.includes(event) && Math.random() > 0.2) {
      return;
    }

    const supabase = createClient();
    
    try {
      const { error } = await supabase.from('system_logs').insert([{
        event_type: event,
        user_id: userId,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          is_sampled: !criticalEvents.includes(event),
          trace_id: metadata.trace_id || `tr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        }
      }]);
      
      if (error) console.warn("Log failed:", error.message);
    } catch (err) {
      // Fail silently
    }
  },

  async traceFlow(userId: string, stage: 'created' | 'matched' | 'responded' | 'outcome', data: any) {
    await this.track('flow_trace', userId, { stage, ...data });
  },

  error(message: string, error: any, userId?: string) {
    console.error(`[LOGGER ERROR] ${message}:`, error);
    if (userId) {
      this.track('flow_trace', userId, { stage: 'outcome', status: 'error', message, error: error?.message || String(error) });
    }
  }
};
