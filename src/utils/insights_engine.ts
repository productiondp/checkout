/**
 * Checkout OS Insights Engine
 * Purpose: Transform raw analytics events into actionable product intelligence.
 */
import { createClient } from "@/utils/supabase/client";

export interface InsightReport {
  activation_rate: string;
  avg_ttfa: string;
  connection_success: string;
  feed_ctr: string;
  biggest_drop_off: string;
  top_performing_module: string;
  top_entry_path: string;
  top_performing_node: string;
  recommendation: string;
  segmentation: {
    active: number;
    passive: number;
    dropped: number;
  };
  flags: string[];
}

export class InsightsEngine {
  private static instance: InsightsEngine;
  private supabase = createClient();

  private constructor() {}

  public static getInstance(): InsightsEngine {
    if (!InsightsEngine.instance) {
      InsightsEngine.instance = new InsightsEngine();
    }
    return InsightsEngine.instance;
  }

  public async generateReport(): Promise<InsightReport | null> {
    try {
      const { data: events, error } = await this.supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: true });

      if (error || !events) throw error;

      // 1. Group events by user
      const userEvents: Record<string, any[]> = {};
      events.forEach(e => {
        if (!e.user_id) return;
        if (!userEvents[e.user_id]) userEvents[e.user_id] = [];
        userEvents[e.user_id].push(e);
      });

      const totalUsers = Object.keys(userEvents).length;
      if (totalUsers === 0) return null;

      // 2. Compute Core Metrics
      const signups = events.filter(e => e.event_type === 'SIGNUP_COMPLETED').length;
      const onboardings = events.filter(e => e.event_type === 'ONBOARDING_COMPLETED').length;
      const connectRequests = events.filter(e => e.event_type === 'CONNECT_REQUEST_SENT').length;
      const connectAccepts = events.filter(e => e.event_type === 'CONNECT_ACCEPTED').length;
      const feedClicks = events.filter(e => e.event_type === 'FEED_CLICK').length;
      const homeViews = events.filter(e => e.event_type === 'SCREEN_VIEW' && e.metadata?.screenName === 'HOME').length;

      const activationRate = signups > 0 ? (onboardings / signups) * 100 : 0;
      const connectionSuccess = connectRequests > 0 ? (connectAccepts / connectRequests) * 100 : 0;
      const feedCtr = homeViews > 0 ? (feedClicks / homeViews) * 100 : 0;

      // 3. TTFA (Time to First Action)
      const ttfaValues: number[] = [];
      Object.values(userEvents).forEach(uEvents => {
        const onboardingEvent = uEvents.find(e => e.event_type === 'ONBOARDING_COMPLETED');
        const firstAction = uEvents.find(e => 
          ['FIRST_MANDATE_CREATED', 'CONNECT_REQUEST_SENT', 'MESSAGE_INITIATED'].includes(e.event_type) &&
          (!onboardingEvent || new Date(e.created_at) > new Date(onboardingEvent.created_at))
        );

        if (onboardingEvent && firstAction) {
          const diff = new Date(firstAction.created_at).getTime() - new Date(onboardingEvent.created_at).getTime();
          ttfaValues.push(diff / 1000); // seconds
        }
      });
      const avgTtfa = ttfaValues.length > 0 ? ttfaValues.reduce((a, b) => a + b, 0) / ttfaValues.length : 0;

      // 4. Funnel Analysis
      const funnel = {
        signup: signups,
        onboarding: onboardings,
        firstAction: events.filter(e => ['FIRST_MANDATE_CREATED', 'CONNECT_REQUEST_SENT'].includes(e.event_type)).length,
        connection: connectAccepts,
        message: events.filter(e => e.event_type === 'MESSAGE_INITIATED').length
      };

      const dropOffs = [
        { step: 'Signup -> Onboarding', rate: signups > 0 ? (onboardings / signups) : 1 },
        { step: 'Onboarding -> First Action', rate: onboardings > 0 ? (funnel.firstAction / onboardings) : 1 },
        { step: 'First Action -> Connection', rate: funnel.firstAction > 0 ? (funnel.connection / funnel.firstAction) : 1 },
        { step: 'Connection -> Message', rate: funnel.connection > 0 ? (funnel.message / funnel.connection) : 1 }
      ];
      const biggestDropOff = dropOffs.sort((a, b) => a.rate - b.rate)[0]?.step || "None";

      // 5. Segmentation
      const segments = { active: 0, passive: 0, dropped: 0 };
      Object.values(userEvents).forEach(uEvents => {
        const hasAction = uEvents.some(e => ['FIRST_MANDATE_CREATED', 'CONNECT_REQUEST_SENT', 'MESSAGE_INITIATED'].includes(e.event_type));
        const hasOnboarding = uEvents.some(e => e.event_type === 'ONBOARDING_COMPLETED');
        
        if (hasAction) segments.active++;
        else if (hasOnboarding) segments.dropped++;
        else segments.passive++;
      });

      // 6. Flags & Recommendations
      const flags: string[] = [];
      if (avgTtfa > 60) flags.push('TTFA > 60s');
      if (activationRate < 40) flags.push('Activation Rate < 40%');
      if (connectionSuccess < 25) flags.push('Connection Success < 25%');
      if (feedCtr < 10) flags.push('Feed CTR < 10%');

      let recommendation = "All systems operational. Continue monitoring growth.";
      if (avgTtfa > 60) recommendation = "Critical latency in value discovery. Improve onboarding clarity and simplify first-action triggers.";
      else if (activationRate < 40) recommendation = "High drop-off in registration funnel. Reduce onboarding friction and re-verify role selection UI.";
      else if (connectionSuccess < 25) recommendation = "Low network trust. Improve match scoring algorithm and provide more profile context in connect requests.";
      else if (feedCtr < 10) recommendation = "Feed irrelevance detected. Adjust neural ranking logic to prioritize recent city-specific mandates.";

      // 7. Top Performing Signals
      const postTypes = events.filter(e => e.event_type === 'FIRST_MANDATE_CREATED').map(e => e.metadata?.type);
      const topPostType = postTypes.length > 0 ? this.mode(postTypes) : "None";

      // 8. Conversion Analysis
      const entryPaths = events.filter(e => e.event_type === 'SCREEN_VIEW').map(e => e.metadata?.screenName);
      const topEntryPath = entryPaths.length > 0 ? this.mode(entryPaths) : "None";

      // 9. Profile Conversion (Who gets most accepts)
      const acceptMetadata = events.filter(e => e.event_type === 'CONNECT_ACCEPTED').map(e => e.metadata?.partnerId);
      const topPerformer = acceptMetadata.length > 0 ? this.mode(acceptMetadata) : "None";

      return {
        activation_rate: `${activationRate.toFixed(1)}%`,
        avg_ttfa: `${avgTtfa.toFixed(1)}s`,
        connection_success: `${connectionSuccess.toFixed(1)}%`,
        feed_ctr: `${feedCtr.toFixed(1)}%`,
        biggest_drop_off: biggestDropOff,
        top_performing_module: topPostType,
        top_entry_path: topEntryPath,
        top_performing_node: topPerformer,
        recommendation,
        segmentation: segments,
        flags
      };
    } catch (err) {
      console.error('[INSIGHTS] Report generation failed:', err);
      return null;
    }
  }

  private mode(arr: any[]) {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
  }
}

export const insights = InsightsEngine.getInstance();
