/**
 * Checkout Monetization & Success Acceleration (V8)
 * Enhances outcome speed without compromising feed integrity.
 */

export type SubscriptionTier = 'FREE' | 'PRO' | 'ELITE';

export interface TierFeatures {
  routingSpeed: 'NORMAL' | 'FAST' | 'PRIORITY';
  matchPrecision: number; // 1.0 = base, 1.2 = pro, 1.5 = elite
  insightsEnabled: boolean;
  verifiedBadge: boolean;
  advancedMomentum: boolean;
}

export const TIER_CONFIG: Record<SubscriptionTier, TierFeatures> = {
  FREE: {
    routingSpeed: 'NORMAL',
    matchPrecision: 1.0,
    insightsEnabled: false,
    verifiedBadge: false,
    advancedMomentum: false
  },
  PRO: {
    routingSpeed: 'FAST',
    matchPrecision: 1.2,
    insightsEnabled: true,
    verifiedBadge: true,
    advancedMomentum: true
  },
  ELITE: {
    routingSpeed: 'PRIORITY',
    matchPrecision: 1.5,
    insightsEnabled: true,
    verifiedBadge: true,
    advancedMomentum: true
  }
};

export class MonetizationService {
  /**
   * Get features for a specific user based on their tier
   */
  static getFeatures(user: any): TierFeatures {
    const tier = (user.metadata?.subscription_tier || 'FREE') as SubscriptionTier;
    return TIER_CONFIG[tier];
  }

  /**
   * Determine if a user should see a premium upsell based on post health
   */
  static shouldSuggestUpsell(postHealth: string, userTier: string): boolean {
    if (userTier !== 'FREE') return false;
    return postHealth === 'AT_RISK' || postHealth === 'BOOSTED';
  }
}
