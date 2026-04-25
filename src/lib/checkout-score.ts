import { createClient } from "@/utils/supabase/client";
import { analytics } from "@/utils/analytics";

/**
 * Checkout Score Stability System (V2)
 * Separated Reputation logic from Match Relevance.
 */

export type ScoreAction = 
  | 'CREATE_REQUIREMENT' 
  | 'RECEIVE_RESPONSE' 
  | 'RESPOND_TO_REQUIREMENT' 
  | 'SUCCESSFUL_CONNECTION' 
  | 'JOIN_MEETUP' 
  | 'HOST_MEETUP';

const ACTION_VALUES: Record<ScoreAction, number> = {
  CREATE_REQUIREMENT: 10,
  RECEIVE_RESPONSE: 15,
  RESPOND_TO_REQUIREMENT: 12,
  SUCCESSFUL_CONNECTION: 20,
  JOIN_MEETUP: 8,
  HOST_MEETUP: 25
};

// Anti-Gaming Limits
const MAX_SCORE_PER_DAY = 100;
const MAX_SCORE_PER_HOUR = 40;

export class CheckoutScoreService {
  private static supabase = createClient();

  /**
   * Add score with diminishing returns and anti-gaming protection
   */
  static async addScore(userId: string, action: ScoreAction, metadata: any = {}) {
    try {
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('metadata, match_score')
        .eq('id', userId)
        .single();

      if (!profile) return null;

      const profileMetadata = profile.metadata || {};
      const currentCheckoutScore = profileMetadata.checkout_score || 50;
      const lastActionTime = profileMetadata.last_score_action_time || 0;
      const dailyPoints = profileMetadata.daily_points_earned || 0;
      const hourlyPoints = profileMetadata.hourly_points_earned || 0;
      
      const now = Date.now();
      const isNewDay = now - (profileMetadata.last_reset_day || 0) > 86400000;
      const isNewHour = now - (profileMetadata.last_reset_hour || 0) > 3600000;

      // 1. Reset counters if needed
      let updatedDailyPoints = isNewDay ? 0 : dailyPoints;
      let updatedHourlyPoints = isNewHour ? 0 : hourlyPoints;

      // 2. Anti-Gaming Check
      if (updatedDailyPoints >= MAX_SCORE_PER_DAY || updatedHourlyPoints >= MAX_SCORE_PER_HOUR) {
        console.warn("[SCORE] Anti-gaming limit hit for user:", userId);
        return currentCheckoutScore;
      }

      // 3. Diminishing Returns Logic
      const actionCountToday = (profileMetadata.daily_actions || {})[action] || 0;
      let multiplier = 1.0;
      if (actionCountToday >= 2) multiplier = 0.5;
      if (actionCountToday >= 5) multiplier = 0.1;

      // 4. Anti-Collusion Check (V7)
      const recentInteractors = profileMetadata.recent_interactors || [];
      const isRepeatInteraction = recentInteractors.includes(metadata.targetUserId);
      if (isRepeatInteraction) multiplier *= 0.4; // Heavy penalty for repeat-user farming

      let basePoints = ACTION_VALUES[action];
      let finalPoints = Math.round(basePoints * multiplier);

      // 5. Quality Reward (V7)
      if (metadata.contentLength > 100) finalPoints += 5;
      if (metadata.hasFollowUp) finalPoints += 10;

      // 6. Update State
      const newScore = Math.min(100, currentCheckoutScore + finalPoints);
      
      // Rotate recent interactors list
      const updatedInteractors = [metadata.targetUserId, ...recentInteractors.filter((id: string) => id !== metadata.targetUserId)].slice(0, 5);

      // 7. Trust Evolution & Hardened Parity (V13)
      let updatedTrustScore = profileMetadata.trust_score || profileMetadata.initial_trust_score || 15;
      let actionCount = (profileMetadata.meaningful_action_count || 0) + 1;
      let trustConfidence = profileMetadata.trust_confidence || 0.5;
      
      if (profileMetadata.verification_skipped) {
         const uniqueTypes = new Set(profileMetadata.unique_action_types || []);
         uniqueTypes.add(action);
         
         const lastActionTime = profileMetadata.last_score_action_time || 0;
         const timeSinceLastAction = now - lastActionTime;
         const isNaturalSpread = timeSinceLastAction > 1800000; // 30 minutes

         // Only gain trust if actions are spread out or represent a new type
         if (isNaturalSpread || uniqueTypes.size > (profileMetadata.unique_action_types?.length || 0)) {
            if (actionCount === 1) updatedTrustScore += 15;
            else if (actionCount >= 3 && uniqueTypes.size >= 2) updatedTrustScore = 50; // Hardened Parity
            else if (actionCount > 3) updatedTrustScore = Math.min(100, updatedTrustScore + (isRepeatInteraction ? 2 : 5));
            
            // Confidence grows with every valid action
            trustConfidence = Math.min(1.0, trustConfidence + 0.1);
         }

         profileMetadata.unique_action_types = Array.from(uniqueTypes);
      }

      const newMetadata = {
        ...profileMetadata,
        checkout_score: newScore,
        trust_score: updatedTrustScore,
        trust_confidence: trustConfidence,
        meaningful_action_count: actionCount,
        last_score_action_time: now,
        daily_points_earned: updatedDailyPoints + finalPoints,
        hourly_points_earned: updatedHourlyPoints + finalPoints,
        recent_interactors: updatedInteractors,
        last_reset_day: isNewDay ? now : (profileMetadata.last_reset_day || now),
        last_reset_hour: isNewHour ? now : (profileMetadata.last_reset_hour || now),
        daily_actions: {
          ...(profileMetadata.daily_actions || {}),
          [action]: actionCountToday + 1
        }
      };

      await this.supabase
        .from('profiles')
        .update({ metadata: newMetadata })
        .eq('id', userId);

      analytics.track('CHECKOUT_SCORE_STABILIZED', userId, { action, finalPoints, newScore });
      
      return newScore;
    } catch (err) {
      console.error("[SCORE_SERVICE] Failure:", err);
      return null;
    }
  }

  static getRank(score: number) {
    if (score >= 90) return "Master Partner";
    if (score >= 75) return "Expert Contributor";
    if (score >= 50) return "Verified Professional";
    return "Associate";
  }
}
