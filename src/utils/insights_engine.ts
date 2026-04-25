/**
 * Checkout OS Insights Engine
 * Purpose: Transform raw analytics_events into actionable product metrics and safety signals.
 */
import { createClient } from "@/utils/supabase/client";

export interface FunnelMetrics {
  signupToVerified: number;
  verifiedToOnboarding: number;
  onboardingToAction: number;
  retentionRate: number;
}

export interface SystemHealth {
  activeUsers1h: number;
  requirements24h: number;
  connections24h: number;
  criticalErrors: {
    type: string;
    count: number;
    implication: string;
  }[];
}

class InsightsEngine {
  private static instance: InsightsEngine;

  private constructor() {}

  public static getInstance(): InsightsEngine {
    if (!InsightsEngine.instance) {
      InsightsEngine.instance = new InsightsEngine();
    }
    return InsightsEngine.instance;
  }

  /**
   * Calculates the conversion funnel from raw events
   */
  public async getFunnelMetrics(): Promise<FunnelMetrics> {
    const supabase = createClient();
    
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_type, user_id');

    if (!events || events.length === 0) {
      return { signupToVerified: 0, verifiedToOnboarding: 0, onboardingToAction: 0, retentionRate: 0 };
    }

    const counts = {
      signup: new Set(events.filter(e => e.event_type === 'USER_SIGNUP').map(e => e.user_id)).size,
      verified: new Set(events.filter(e => e.event_type === 'USER_VERIFIED').map(e => e.user_id)).size,
      onboarding: new Set(events.filter(e => e.event_type === 'ONBOARDING_COMPLETED').map(e => e.user_id)).size,
      action: new Set(events.filter(e => ['REQUIREMENT_CREATED', 'CONNECTION_SENT'].includes(e.event_type)).map(e => e.user_id)).size,
    };

    return {
      signupToVerified: counts.signup > 0 ? (counts.verified / counts.signup) * 100 : 0,
      verifiedToOnboarding: counts.verified > 0 ? (counts.onboarding / counts.verified) * 100 : 0,
      onboardingToAction: counts.onboarding > 0 ? (counts.action / counts.onboarding) * 100 : 0,
      retentionRate: 0 // Placeholder for session-based retention
    };
  }

  /**
   * Interprets system logs into product implications
   */
  public async getSystemHealth(): Promise<SystemHealth> {
    const supabase = createClient();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const [active, reqs, conns, errors] = await Promise.all([
      supabase.from('analytics_events').select('user_id', { count: 'exact' }).gt('created_at', oneHourAgo),
      supabase.from('analytics_events').select('id', { count: 'exact' }).eq('event_type', 'REQUIREMENT_CREATED').gt('created_at', twentyFourHoursAgo),
      supabase.from('analytics_events').select('id', { count: 'exact' }).eq('event_type', 'CONNECTION_SENT').gt('created_at', twentyFourHoursAgo),
      supabase.from('analytics_events').select('event_type').in('event_type', ['AUTH_TIMEOUT', 'PROFILE_FETCH_FAILURE', 'ROUTING_FALLBACK'])
    ]);

    const errorCounts = (errors.data || []).reduce((acc: any, curr: any) => {
      acc[curr.event_type] = (acc[curr.event_type] || 0) + 1;
      return acc;
    }, {});

    const implications: Record<string, string> = {
      'AUTH_TIMEOUT': 'Onboarding Friction / Network Issues',
      'PROFILE_FETCH_FAILURE': 'Critical Backend/DB Inconsistency',
      'ROUTING_FALLBACK': 'Auth State Instability'
    };

    return {
      activeUsers1h: active.count || 0,
      requirements24h: reqs.count || 0,
      connections24h: conns.count || 0,
      criticalErrors: Object.entries(errorCounts).map(([type, count]) => ({
        type,
        count: count as number,
        implication: implications[type] || 'Unknown Issue'
      }))
    };
  }

  /**
   * Diagnostic summary based on thresholds
   */
  public async getDiagnostic(): Promise<{ status: 'PASS' | 'FAIL', dropOffPoint: string, focus: string }> {
    const funnel = await this.getFunnelMetrics();
    
    if (funnel.signupToVerified < 60) {
      return { status: 'FAIL', dropOffPoint: 'Signup -> Verified', focus: 'Email verification UX / SMTP deliverability' };
    }
    
    if (funnel.onboardingToAction < 40) {
      return { status: 'FAIL', dropOffPoint: 'Onboarding -> First Action', focus: 'UX Clarity (Users don\'t know what to do next)' };
    }

    if (funnel.verifiedToOnboarding < 70) {
      return { status: 'FAIL', dropOffPoint: 'Verified -> Onboarding', focus: 'Onboarding length/friction' };
    }

    return { status: 'PASS', dropOffPoint: 'None', focus: 'Scaling acquisition' };
  }
}

export const insights = InsightsEngine.getInstance();
