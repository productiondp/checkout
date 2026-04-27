import { UserProfile } from "@/types/core";
import { dependencyEngine } from "@/utils/dependency_engine";

/**
 * 🧠 SIGNAL PROTECTION & ANOMALY DEFENSE (V34)
 * 
 * Secures outcome-driven learning against manipulation and spam.
 * Principles: Integrity-First, Unique-Weighted, Spam-Resistant.
 */

export interface SessionInteraction {
  impressions: Record<string, number>;
  clicks: Record<string, number>;
  connects: Record<string, number>;
  replies: Record<string, number>;
  last_interaction_time: number;
}

export interface NetworkStats {
  // Computed via SecurityGraph: sum(action * user_reputation)
  category_quality: Record<string, number>; // Normalized 0-1 (Smoothed rolling avg)
  
  // Validated via SecurityGraph: Requires >=15 unique users, avg rep >= 0.5, no sybil flag
  trending_categories: string[];
  
  peer_group_focus: Record<string, number>;
  
  // V34/V35 Additions
  unique_users_per_category: Record<string, number>;
  anomaly_flags: Record<string, boolean>; // True if sudden spike lacks diversity or Sybil cluster detected
}

export interface SessionContext {
  last_clicked_category?: string;
  last_connected_type?: string;
  recent_actions: {
    type: 'POST' | 'CONNECT' | 'VIEW' | 'CLICK' | 'REPLY';
    timestamp: number;
    category?: string;
  }[];
  interactions: SessionInteraction;
  network_stats?: NetworkStats;
  user_trust_weight?: number; // 0.0 - 1.0, based on connect/reply ratio
}

const WEIGHTS = {
  INTENT: 0.40,
  SKILL: 0.25,
  RECENCY: 0.20,
  PROXIMITY: 0.10,
  ACTIVITY: 0.05
};

export function calculatePersonalizedScore(
  user: UserProfile, 
  item: any, 
  context: SessionContext
): { score: number; label?: string; confidence: number } {
  let score = 0;
  const itemType = item.type?.toUpperCase() || "UNKNOWN";
  
  // 1. Base Intent Scoring (40%)
  const explicitNeeds = user.intents || [];
  const inferredNeeds = dependencyEngine.inferNeeds(user.role || "", user.industry || "");
  const itemTags = item.intents || item.tags || item.intent_tags || item.skills_required || [];
  
  let intentScore = 0;
  
  if (itemTags.length > 0) {
     let totalWeight = 0;
     let matchedWeight = 0;
     
     // Evaluate Explicit Needs (Weight 1.0)
     explicitNeeds.forEach(need => {
        totalWeight += 1.0;
        if (itemTags.includes(need)) matchedWeight += 1.0;
     });
     
     // Evaluate Inferred Needs (Weight 0.4)
     inferredNeeds.forEach(inf => {
        // Prevent double counting if inferred is also explicit
        if (!explicitNeeds.includes(inf.tag)) {
           totalWeight += 0.4;
           if (itemTags.includes(inf.tag)) matchedWeight += 0.4;
        }
     });
     
     if (totalWeight > 0) {
        let overlap = matchedWeight / totalWeight;
        intentScore = overlap * 100;
        if (overlap > 0.5) intentScore *= 1.2; 
     }
     
     score += Math.min(100, intentScore) * WEIGHTS.INTENT;
  }

  // 2. Skill/Domain Match (25%)
  const userSkills = user.expertise || (user as any).skills || [];
  const requiredSkills = item.skills_required || item.skills || [];
  if (userSkills.length > 0 && requiredSkills.length > 0) {
    const common = userSkills.filter(s => requiredSkills.includes(s));
    const skillScore = (common.length / requiredSkills.length) * 100;
    score += Math.min(100, skillScore) * WEIGHTS.SKILL;
  }

  // 3. Recency Decay (20%)
  const now = Date.now();
  const createdAt = new Date(item.created_at || now).getTime();
  const ageHours = (now - createdAt) / (1000 * 60 * 60);
  
  let recencyScore = 0;
  if (ageHours <= 6) recencyScore = 100;
  else if (ageHours <= 24) recencyScore = 60;
  else recencyScore = 20;
  score += recencyScore * WEIGHTS.RECENCY;

  // 4. Proximity (10%)
  if (user.location && item.location && user.location === item.location) {
    score += 100 * WEIGHTS.PROXIMITY;
  }

  // 5. Activity/Reputation (5%)
  const reputation = item.author_profile?.metadata?.checkout_score || 50;
  score += reputation * WEIGHTS.ACTIVITY;

  // 🛡️ STEP 5: TRUST ENGINE BOOST (NEW)
  const trustScore = item.author_profile?.advisor_score || 0;
  // Boost by up to 20 points for high trust (normalized to weight if needed, but here we add as a tactical boost)
  const trustBoost = Math.min(20, trustScore * 4); 
  score += trustBoost;

  // 🛡️ STEP 1 & 5: PROTECTED GLOBAL QUALITY BOOST (V34)
  let networkBoost = 0;
  const stats = context.network_stats;
  let isNetworkConfident = false;

  if (stats) {
    // Check anomaly flags (sudden spike, low diversity)
    const isAnomaly = stats.anomaly_flags[itemType];
    const uniqueUsers = stats.unique_users_per_category[itemType] || 0;
    
    // Only trust global signal if enough unique users and no anomaly
    if (!isAnomaly && uniqueUsers >= 10) {
       isNetworkConfident = true;
       // Signal Smoothing: category_quality is assumed to be a rolling average
       const globalQuality = stats.category_quality[itemType] || 0;
       const trendingBoost = stats.trending_categories.includes(itemType) ? 0.05 : 0;
       const peerBoost = stats.peer_group_focus[itemType] || 0;
       
       networkBoost = Math.min(0.1, (globalQuality * 0.2) + trendingBoost + (peerBoost * 0.5));
    } else {
       // Trust Decay: penalize slightly or ignore if data is stale/anomalous
       networkBoost = 0;
    }
  }

  // 🛡️ STEP 3: APPLY PERSONAL + GLOBAL BALANCE
  score *= (1 + networkBoost);

  // 🛡️ ADAPTIVE FEEDBACK (V32 Protocol) + SPAM FILTER (V34)
  const { interactions } = context;
  const imps = interactions.impressions[itemType] || 0;
  const clicks = interactions.clicks[itemType] || 0;
  const connects = interactions.connects[itemType] || 0;
  const totalInteractions = clicks + connects;

  let qualityBoost = 0;
  let confidence = Math.min(1, imps / 10);

  // 🛡️ STEP 3: LOW-QUALITY USER FILTER (Apply user trust weight)
  const userTrustWeight = context.user_trust_weight ?? 1.0;

  if (imps >= 5 && totalInteractions >= 3) {
    const clickRate = clicks / imps;
    const connectRate = connects / imps;
    let qualitySignal = (clickRate * 0.4) + (connectRate * 0.6);
    
    // Apply user trust weight to prevent spammer influence
    qualitySignal *= userTrustWeight;
    
    qualityBoost = Math.min(0.2, qualitySignal * 0.5) * confidence;
  }

  const idleTime = now - interactions.last_interaction_time;
  let behavioralMultiplier = idleTime < 10 * 60 * 1000 ? 1.0 : idleTime < 30 * 60 * 1000 ? 0.7 : 0.4;
  score *= (1 + (qualityBoost * behavioralMultiplier));

  // 🛡️ STEP 9: STRICT TRUST SIGNAL LABELS
  let label = undefined;
  if (confidence > 0.5 && qualityBoost > 0.05 && itemType === context.last_clicked_category && userTrustWeight > 0.5) {
    label = "Based on your recent activity";
  } else if (networkBoost > 0.05 && isNetworkConfident) {
    label = "Popular in your network";
  } else if (score > 85) {
    label = "Relevant to your activity";
  }

  return {
    score: Math.min(100, Math.round(score)),
    label,
    confidence
  };
}

export function rankEntities(user: UserProfile, entities: any[], context: SessionContext): any[] {
  const scored = entities.map(entity => {
    const { score, label, confidence } = calculatePersonalizedScore(user, entity, context);
    return { ...entity, matchScore: score, personalizationLabel: label, scoreConfidence: confidence };
  });

  const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);

  const ranked: any[] = [];
  const pool = [...sorted];
  const typeCounts: Record<string, number> = {};
  const totalSlots = entities.length;
  const categoryCap = Math.max(2, Math.floor(totalSlots * 0.5));

  let consecutiveTypeCount = 0;
  let lastType = "";

  while (pool.length > 0) {
    let pickIndex = -1;
    for (let i = 0; i < pool.length; i++) {
      const itemType = pool[i].type || "UNKNOWN";
      if (ranked.length > 0 && ranked.length % 5 === 0) {
        if (pool[i].scoreConfidence < 0.5) { pickIndex = i; break; }
        continue;
      }
      if ((typeCounts[itemType] || 0) >= categoryCap) continue;
      if (itemType === lastType && consecutiveTypeCount >= 2) continue;
      pickIndex = i;
      break;
    }
    if (pickIndex === -1) pickIndex = 0;

    const pick = pool.splice(pickIndex, 1)[0];
    const currentType = pick.type || "UNKNOWN";
    typeCounts[currentType] = (typeCounts[currentType] || 0) + 1;
    if (currentType === lastType) consecutiveTypeCount++;
    else { consecutiveTypeCount = 1; lastType = currentType; }
    ranked.push(pick);
  }

  return ranked;
}
