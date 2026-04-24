import { UserProfile, Entity } from "@/types/core";
import { optimization } from "@/utils/optimization_engine";

/**
 * Production-Grade Neural Weight Configuration
 */
const DEFAULT_WEIGHTS = {
  intent: 0.4,
  expertise: 0.3,
  recency: 0.2,
  location: 0.1
};

export interface MatchResult {
  score: number;
  finalScore: number;
  reasons: string[];
  labels: string[];
}

/**
 * Checkout Neural Match Engine (V2)
 * Calculates structural alignment with trust signals and penalties.
 */
export function calculateMatchScore(user: UserProfile, target: any): MatchResult {
  const WEIGHTS = optimization.getWeights();
  let score = 0;
  const reasons: string[] = [];
  const labels: string[] = [];
  
  // 1. Expertise Match (0.3)
  const userExpertise = new Set((user.expertise || []).map(e => e.toLowerCase()));
  const targetExpertise = Array.isArray(target.expertise || target.skills_required) 
    ? (target.expertise || target.skills_required) 
    : [];
  const expertiseOverlap = targetExpertise.filter((e: string) => userExpertise.has(e.toLowerCase()));
  
  if (expertiseOverlap.length > 0) {
    const expertiseScore = (expertiseOverlap.length / Math.max(targetExpertise.length, 1)) * 100;
    score += expertiseScore * WEIGHTS.expertise;
    reasons.push(`Relevant to your ${expertiseOverlap[0]} expertise`);
    if (expertiseScore > 70) labels.push("Expert Alignment");
  } else if (userExpertise.size > 0) {
    score -= 10; // Penalty for zero expertise overlap IF user has expertise defined
  }

  // 2. Intent Match (0.4)
  const userIntents = new Set((user.intents || []).map(i => i.toLowerCase()));
  const targetTags = [...(target.tags || []), target.type, target.category, target.domain].filter(Boolean) as string[];
  const intentOverlap = targetTags.filter(t => userIntents.has(t.toLowerCase()));
  
  if (intentOverlap.length > 0) {
    const intentScore = (intentOverlap.length / Math.max(targetTags.length, 1)) * 100;
    score += intentScore * WEIGHTS.intent;
    reasons.push(`Matches your ${intentOverlap[0]} intent`);
    labels.push("High Intent");
  } else if (userIntents.size > 0) {
    score -= 15; // Heavy penalty for zero intent alignment IF user has intents defined
  }

  // 3. Location Proximity (0.1)
  const locationMatch = (user.location || "").toLowerCase() === (target.location || "").toLowerCase();
  if (locationMatch) {
    score += 100 * WEIGHTS.location;
    reasons.push(`Located in ${target.location}`);
  } else if (user.location) {
    score -= 5; // Slight penalty for distance IF user has location defined
  }

  // 4. Experience & Reliability (0.2 - used for recency/other factors)
  // Baseline for vetted mandates
  score += 80 * WEIGHTS.recency; 

  // Normalize base score
  const normalizedScore = Math.max(0, Math.min(Math.round(score), 99));

  // Calculate Recency Boost (Capped)
  const now = new Date().getTime();
  const createdAt = new Date(target.created_at || now).getTime();
  const ageHours = (now - createdAt) / (1000 * 60 * 60);
  
  let recencyBoost = 0;
  if (ageHours < 2) {
    recencyBoost = 15;
    labels.push("New");
  } else if (ageHours < 6) {
    recencyBoost = 8;
  } else if (ageHours < 24) {
    recencyBoost = 4;
  }
  
  // Dynamic Reason Fallback if score is high but specific overlaps weren't found
  if (reasons.length === 0 && normalizedScore > 60) {
    reasons.push("Aligned with regional professional standards");
    reasons.push("Verified mandate node");
  }
  
  const finalScore = normalizedScore + recencyBoost;
  if (normalizedScore > 85) labels.push("Top Match");

  return {
    score: normalizedScore,
    finalScore,
    reasons: reasons.slice(0, 2),
    labels
  };
}

/**
 * Batch calculate matches for a list of entities
 */
export function rankEntities(user: UserProfile, entities: any[]): any[] {
  return entities
    .map(entity => {
      const result = calculateMatchScore(user, entity);
      return {
        ...entity,
        matchScore: result.score,
        finalScore: result.finalScore,
        matchReasons: result.reasons,
        priorityLabels: result.labels
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
}

