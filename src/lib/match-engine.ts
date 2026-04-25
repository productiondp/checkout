import { UserProfile, Entity } from "@/types/core";
import { analytics } from "@/utils/analytics";
import { OutcomeEngine } from "./outcome-engine";
import { MonetizationService } from "./monetization-service";
import { SystemOS } from "./system-os";

/**
 * Adaptive Weight Configuration (V10 System OS Aligned)
 */
interface MatchWeights {
  context: number;
  intent: number;
  location: number;
  activity: number;
  recency: number;
  discovery: number;
  outcome: number;
  precision: number;
}

/**
 * Get dynamic weights based on user profile and system health
 */
export function getAdaptiveWeights(user: UserProfile): MatchWeights {
  const premium = MonetizationService.getFeatures(user);
  const correction = SystemOS.getCorrection();
  const experiment = SystemOS.getExperiment(user.id || "guest");
  
  const baseWeights = {
    context: 0.20,
    intent: 0.20,
    location: 0.15,
    activity: 0.15,
    recency: 0.10,
    discovery: 0.05 * (correction.discoveryMultiplier || 1.0) * (experiment.discoveryMultiplier || 1.0),
    outcome: 0.15,
    precision: premium.matchPrecision
  };

  // 1. Cold Start
  const isNew = user.created_at && (Date.now() - new Date(user.created_at).getTime() < 172800000);
  if (!user.onboarding_completed || isNew) {
    return { ...baseWeights, recency: 0.25, discovery: 0.20, outcome: 0.10 };
  }

  // 2. High Probability Responders
  const reputation = user.metadata?.checkout_score || user.matchScore || 80;
  if (reputation > 85) {
     return { ...baseWeights, outcome: 0.30, intent: 0.25, activity: 0.20 };
  }

  return baseWeights;
}

/**
 * Checkout Adaptive Match Engine (V10) - System Aware
 */
export function calculateMatchScore(user: UserProfile, target: any, weights?: MatchWeights): MatchResult {
  const WEIGHTS = weights || getAdaptiveWeights(user);
  const correction = SystemOS.getCorrection();
  const experiment = SystemOS.getExperiment(user.id || "guest");
  
  let score = 0;
  const reasons: string[] = [];
  const labels: string[] = [];
  
  // 1. Context & Intent (Adaptive + Precision)
  const userRole = (user.role || "").toUpperCase();
  const targetContext = (target.context || target.author_role || "").toUpperCase();
  if (userRole === targetContext) {
    score += 100 * WEIGHTS.context * WEIGHTS.precision;
    reasons.push(`${user.role} ecosystem`);
  }

  // 2. Skill Overlap
  const userSkills = new Set((user.expertise || []).map(e => e.toLowerCase()));
  const targetSkills = Array.isArray(target.skills_required || target.expertise) ? (target.skills_required || target.expertise) : [];
  const skillOverlap = targetSkills.filter((s: string) => userSkills.has(s.toLowerCase()));
  if (skillOverlap.length > 0) {
    score += 100 * WEIGHTS.intent * WEIGHTS.precision;
    reasons.push(`Matches your ${skillOverlap[0]} skill`);
  }

  // 3. Location Relevance (Local Density V9)
  const locationMatch = (user.location || "").toLowerCase() === (target.location || "").toLowerCase();
  if (locationMatch) {
    const locWeight = target.type === 'MEETUP' ? WEIGHTS.location * 1.5 : WEIGHTS.location;
    score += 100 * locWeight;
  }

  // 4. Reputation & Quality (Sustainability V7 + OS V10)
  const authorRep = target.author_profile?.metadata?.checkout_score || 50;
  const authorQuality = (target.author_profile?.metadata?.avg_quality_given || 70) / 100;
  const qualityWeight = (correction.qualityWeight || 1.0) * (experiment.qualityWeight || 1.0);
  
  score += authorRep * WEIGHTS.activity * (0.8 + (authorQuality * 0.4 * qualityWeight)); 

  // 5. Outcome, Monetization & OS Correction (V10)
  const { health, boostFactor, statusText } = OutcomeEngine.getPostStatus(target);
  
  const now = Date.now();
  const createdAt = new Date(target.created_at || now).getTime();
  const ageHours = (now - createdAt) / (1000 * 60 * 60);
  const ageDays = ageHours / 24;
  const decayFactor = Math.max(0.1, 1 - (ageDays * 0.15));

  const targetPremium = MonetizationService.getFeatures(target.author_profile);
  const routingMultiplier = targetPremium.routingSpeed === 'PRIORITY' ? 1.25 : targetPremium.routingSpeed === 'FAST' ? 1.15 : 1.0;

  // OS Boost Elasticity (Prevents addiction to boosting)
  const effectiveBoost = boostFactor * (correction.boostElasticity || 1.0);

  if (health === 'AT_RISK' || health === 'BOOSTED') {
     score += 100 * WEIGHTS.outcome * effectiveBoost * decayFactor * routingMultiplier;
  } else if (health === 'FULFILLED' || health === 'SUCCESSFUL' || health === 'SOLVED') {
     score -= 40; 
  }

  // 5c. Responder Load Balancing & Routing Spread (V10)
  const responderLoad = OutcomeEngine.getResponderPriority(user);
  const routingSpread = correction.routingSpread || 1.0;
  if (responderLoad < 1.0 && target.type === 'REQUIREMENT') {
     score *= (0.8 / routingSpread); // Spread opportunities wider if imbalanced
  }

  // 6. Recency
  let recencyValue = Math.max(0, 100 - (ageHours * 2)); 
  score += recencyValue * WEIGHTS.recency;

  // 7. Anti-Fatigue (V6)
  const authorPostCount = target.author_profile?.metadata?.daily_post_count || 0;
  if (authorPostCount > 2) score -= (authorPostCount - 2) * 10;

  // 8. Adaptive Trust & Confidence Visibility (V13)
  const authorMeta = target.author_profile?.metadata || {};
  const isVerified = !authorMeta.verification_skipped;
  
  const trustScore = isVerified ? 100 : (authorMeta.trust_score || 15);
  const trustConfidence = isVerified ? 1.0 : (authorMeta.trust_confidence || 0.5);
  
  // Effective Trust = Base Trust adjusted by system confidence
  const effectiveTrust = trustScore * trustConfidence;
  
  // Penalty ranges from -20 (low trust/conf) to 0 (high trust/conf)
  const trustPenalty = Math.min(0, Math.max(-20, (effectiveTrust - 50) * 0.4));
  score += trustPenalty;

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  if (finalScore > 90) labels.push("Top Match");

  return {
    score: finalScore,
    reasons: reasons.slice(0, 2),
    labels,
    outcomeStatus: statusText
  };
}

/**
 * Intelligent Ranking with Outcome Diversification
 */
export function rankEntities(user: UserProfile, entities: any[]): any[] {
  const weights = getAdaptiveWeights(user);
  
  // 1. Calculate base scores with outcome and monetization intelligence
  const scored = entities.map(entity => {
    const result = calculateMatchScore(user, entity, weights);
    return { 
      ...entity, 
      matchScore: result.score, 
      matchReasons: result.reasons, 
      priorityLabels: result.labels,
      outcomeStatus: result.outcomeStatus,
      isDiscovery: result.labels.includes("Discovery")
    };
  });

  // 2. Separate into buckets for mix
  const highRelevance = scored.filter(p => p.matchScore > 75).sort((a,b) => b.matchScore - a.matchScore);
  const outcomeBoosted = scored.filter(p => p.outcomeStatus === "Needs Response" || p.outcomeStatus === "Urgent").sort((a,b) => b.matchScore - a.matchScore);
  const rest = scored.filter(p => !highRelevance.includes(p) && !outcomeBoosted.includes(p)).sort((a,b) => b.matchScore - a.matchScore);

  const ranked: any[] = [];
  
  // 3. Growth & Lifecycle Prompt Injection (V9)
  const userPosts = scored.filter(p => (p.author_id === user.id || p.user_id === user.id));
  
  // A. Check for success/growth events
  for (const post of userPosts) {
     const growthOp = OutcomeEngine.getGrowthOpportunity(post, user);
     if (growthOp) {
        ranked.push({
           id: `growth-${post.id}`,
           type: 'SYSTEM_PROMPT',
           subtype: growthOp.type,
           title: growthOp.title,
           content: growthOp.content,
           cta: growthOp.cta,
           targetPostId: post.id,
           labels: ["Growth"]
        });
        break; // Only one growth prompt per session to avoid clutter
     }
  }

  // B. Fallback to health-based nudge if no success event
  if (ranked.length === 0) {
     const atRisk = userPosts.find(p => p.outcomeStatus === "Needs Response");
     if (atRisk) {
        ranked.push({
           id: 'lifecycle-prompt',
           type: 'SYSTEM_PROMPT',
           title: `Boost your ${atRisk.type.toLowerCase()}?`,
           content: `Your post hasn't received a response yet. Invite some experts to get better results.`,
           targetPostId: atRisk.id,
           labels: ["Momentum"]
        });
     }
  }

  const totalSlots = scored.length;
  for (let i = 0; i < totalSlots; i++) {
    let pick = null;
    const mod = i % 4;

    if (mod === 0 && highRelevance.length > 0) pick = highRelevance.shift();
    else if (mod === 1 && outcomeBoosted.length > 0) pick = outcomeBoosted.shift();
    else if (rest.length > 0) pick = rest.shift();
    
    if (!pick) {
      pick = highRelevance.shift() || outcomeBoosted.shift() || rest.shift();
    }

    if (pick) ranked.push(pick);
  }

  return ranked;
}

