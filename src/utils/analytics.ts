/**
 * Checkout OS Analytics Engine (V2 - Production Monitoring)
 * Purpose: Track core user behavior, funnel conversion, and critical safety signals.
 */
import { createClient } from "@/utils/supabase/client";

export type EventType = 
  | 'USER_SIGNUP'
  | 'USER_VERIFIED'
  | 'ONBOARDING_COMPLETED'
  | 'REQUIREMENT_CREATED'
  | 'CONNECTION_SENT'
  | 'SESSION_START'
  | 'SCREEN_VIEW'
  | 'AUTH_TIMEOUT'
  | 'PROFILE_FETCH_FAILURE'
  | 'ROUTING_FALLBACK'
  | 'LOW_ACTIVITY_PROMPT';

interface EventData {
  userId?: string;
  timestamp: number;
  metadata?: any;
}

class AnalyticsEngine {
  private static instance: AnalyticsEngine;
  private startTime: number = typeof window !== 'undefined' ? Date.now() : 0;
  private firstActionTaken: boolean = false;
  private sessionEvents: EventType[] = [];

  private constructor() {}

  public static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine();
    }
    return AnalyticsEngine.instance;
  }

  public async track(event: EventType, userId?: string, metadata: any = {}) {
    if (typeof window === 'undefined') return;

    const timestamp = Date.now();
    const eventData: EventData = {
      userId,
      timestamp,
      metadata: {
        ...metadata,
        timeSinceStart: timestamp - this.startTime,
      }
    };

    this.sessionEvents.push(event);

    // STRUCTURED LOGGING
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[ANALYTICS] ${event}`, 'color: #E53935; font-weight: bold;', eventData);
    } else {
      // PRODUCTION MONITORING LOG
      console.log(`[MONITORING] ${event} | User: ${userId || 'anonymous'}`);
    }
    
    // PERSIST TO SUPABASE
    try {
      const supabase = createClient();
      await supabase.from('analytics_events').insert([{
        user_id: userId || null,
        event_type: event,
        metadata: eventData.metadata
      }]);
    } catch (err) {
      // Don't crash on analytics failure
      if (process.env.NODE_ENV === 'development') {
        console.error('[ANALYTICS] Persistence failed:', err);
      }
    }
  }

  public trackScreen(screenName: string, userId?: string) {
    this.track('SCREEN_VIEW', userId, { screenName });
  }

  public getSessionEvents(): EventType[] {
    return this.sessionEvents;
  }

  public hasAction(events: EventType[]): boolean {
    return this.sessionEvents.some(e => events.includes(e));
  }
}

export const analytics = AnalyticsEngine.getInstance();
