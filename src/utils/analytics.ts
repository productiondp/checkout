/**
 * Checkout OS Analytics Engine (V2)
 * Purpose: Track core user behavior, funnel conversion, and first-value signals.
 */
import { createClient } from "@/utils/supabase/client";

type EventType = 
  | 'SIGNUP_COMPLETED'
  | 'ONBOARDING_COMPLETED'
  | 'FIRST_MANDATE_CREATED'
  | 'CONNECT_REQUEST_SENT'
  | 'CONNECT_ACCEPTED'
  | 'MESSAGE_INITIATED'
  | 'SCREEN_VIEW'
  | 'FEED_CLICK'
  | 'SESSION_START'
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

  private constructor() {
    if (typeof window !== 'undefined') {
      this.track('SESSION_START');
    }
  }

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
        ttfa: !this.firstActionTaken && !['SESSION_START', 'SCREEN_VIEW'].includes(event) ? timestamp - this.startTime : undefined
      }
    };

    this.sessionEvents.push(event);

    if (!this.firstActionTaken && !['SESSION_START', 'SCREEN_VIEW'].includes(event)) {
       this.firstActionTaken = true;
       console.log(`[ANALYTICS] TTFA Detected: ${eventData.metadata.ttfa}ms`);
    }

    // PRODUCTION LOGGING
    console.log(`%c[ANALYTICS] ${event}`, 'color: #E53935; font-weight: bold;', eventData);
    
    // PERSIST TO SUPABASE if userId is available
    if (userId) {
      try {
        const supabase = createClient();
        await supabase.from('analytics_events').insert([{
          user_id: userId,
          event_type: event,
          metadata: eventData.metadata
        }]);
      } catch (err) {
        console.error('[ANALYTICS] Failed to persist event:', err);
      }
    }
  }

  public trackScreen(screenName: string, userId?: string) {
    this.track('SCREEN_VIEW', userId, { screenName });
  }

  public getSessionEvents(): EventType[] {
    return this.sessionEvents;
  }

  public getTTFA(): number | null {
    return this.firstActionTaken ? Date.now() - this.startTime : null;
  }

  public hasAction(events: EventType[]): boolean {
    return this.sessionEvents.some(e => events.includes(e));
  }
}

export const analytics = AnalyticsEngine.getInstance();
