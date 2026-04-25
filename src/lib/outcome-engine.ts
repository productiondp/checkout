import { createClient } from "@/utils/supabase/client";

/**
 * Checkout Quality & Sustainability Engine (V7)
 * Ensures meaningful interactions and prevents system inflation.
 */

export type PostHealth = 'NEW' | 'ACTIVE' | 'AT_RISK' | 'BOOSTED' | 'SUCCESSFUL' | 'FULFILLED' | 'SOLVED';

export interface GrowthEvent {
  type: 'OUTCOME_VIRAL' | 'RE_ENGAGEMENT' | 'NETWORK_BRIDGE';
  title: string;
  content: string;
  cta: string;
}

export class OutcomeEngine {
  private static supabase = createClient();

  /**
   * Identify growth opportunities based on post success
   */
  static getGrowthOpportunity(post: any, user: any): GrowthEvent | null {
    const { health } = this.getPostStatus(post);
    
    // 1. Outcome-Based Viral Loop
    if (health === 'FULFILLED' || health === 'SUCCESSFUL') {
       if (post.type === 'REQUIREMENT') {
          return {
             type: 'OUTCOME_VIRAL',
             title: "Requirement Solved",
             content: "Success! Invite others who might need this problem solved.",
             cta: "Share Success"
          };
       }
       if (post.type === 'PARTNERSHIP') {
          return {
             type: 'OUTCOME_VIRAL',
             title: "Partnership Formed",
             content: "Strategic connection made. Bring your team to scale this collaboration.",
             cta: "Add Team"
          };
       }
    }

    // 2. Re-engagement Loop
    const ageHours = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
    if (ageHours > 72 && post.response_count === 0 && (post.author_id === user.id)) {
       return {
          type: 'RE_ENGAGEMENT',
          title: "Missed Opportunities?",
          content: "Your post is expiring. Refine your requirement to attract new experts.",
          cta: "Refine Post"
       };
    }

    return null;
  }

  /**
   * Determine the health and required boost for a post (V9 Network Aligned)
   */
  static getPostStatus(post: any): { health: PostHealth; boostFactor: number; statusText: string | null } {
    const metadata = post.metadata || {};
    const metrics = {
      responses: post.response_count || 0,
      connections: post.connection_count || 0,
      joins: post.joined_count || 0,
      avgQuality: metadata.avg_interaction_quality || 50,
      boostCount: metadata.boost_count || 0,
      lastBoostTime: metadata.last_boost_time,
      isFulfilled: metadata.is_fulfilled || false,
      isSolved: metadata.is_solved || false
    };

    const now = Date.now();
    const ageHours = (now - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
    
    let health: PostHealth = 'ACTIVE';
    let boostFactor = 1.0;
    let statusText: string | null = null;

    // 1. SOLVED STATE (V9)
    if (metrics.isSolved) {
       return { health: 'SOLVED', boostFactor: 0.4, statusText: "Solved" };
    }

    // 2. QUALITY-WEIGHTED SUCCESS CONDITIONS
    const hasHighQualityLead = metrics.avgQuality > 70 && metrics.responses > 0;
    const isSuccessful = 
      (post.type === 'REQUIREMENT' && (hasHighQualityLead || metrics.responses >= 5)) ||
      (post.type === 'PARTNERSHIP' && metrics.connections >= 1 && metrics.avgQuality > 60) ||
      (post.type === 'MEETUP' && metrics.joins >= (post.max_slots || 8) * 0.9);

    if (isSuccessful || metrics.isFulfilled) {
      return { health: 'FULFILLED', boostFactor: 0.5, statusText: "Goal Reached" };
    }

    // 2. BOOST NORMALIZATION (Cap & Decay)
    const MAX_BOOSTS = 3;
    const effectiveBoostCount = Math.min(metrics.boostCount, MAX_BOOSTS);
    const decayMultiplier = Math.max(0.2, 1 - (effectiveBoostCount * 0.25));

    // 3. RISK DETECTION
    if (post.type === 'REQUIREMENT' && metrics.responses === 0) {
      if (ageHours > 2 && ageHours < 48) {
        health = 'AT_RISK';
        boostFactor = 1.3 * decayMultiplier;
        statusText = "Needs Response";
      } else if (ageHours >= 48) {
        // Natural priority decay for old unresponded posts
        health = 'ACTIVE';
        boostFactor = 0.7;
      }
    }

    // 4. ACTIVE CONVERSATION SIGNAL
    if (metrics.responses > 0 && metrics.avgQuality > 60) {
       statusText = "Active Conversation";
    } else if (metrics.responses > 0) {
       statusText = "Getting Attention";
    }

    return { health, boostFactor, statusText };
  }

  /**
   * Supply-Demand Balancer with Responder Load Balancing
   */
  static getResponderPriority(user: any): number {
    const metadata = user.metadata || {};
    const dailyResponses = metadata.daily_responses || 0;
    const MAX_LOAD = 10;

    // Responder Burnout Protection
    if (dailyResponses > MAX_LOAD) {
       return 0.5; // Reduce priority for over-active users
    }
    
    // Quality Reward
    const qualityScore = metadata.avg_quality_given || 70;
    if (qualityScore > 85) return 1.2;
    
    return 1.0;
  }
}
