/**
 * CHECKOUT NEURAL MATCH ENGINE v1.0
 * Pure-heuristic engine for high-relevance intent distribution.
 */

export interface MatchProfile {
  role: string;
  industry: string;
  expertise_tags: string[];
  intent_tags: string[];
  experience_years: number;
  location: string;
}

export interface MatchPost {
  type: string;
  required_expertise: string[];
  target_intent: string;
  location: string;
  author_role: string;
}

export interface MatchResult {
  score: number;
  reasons: string[];
}

export function calculateMatchScore(user: MatchProfile, post: MatchPost): MatchResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Intent Match (40 pts)
  const hasIntentMatch = (user.intent_tags || []).some(i => 
    post.type?.toLowerCase().includes(i.toLowerCase()) || 
    post.target_intent?.toLowerCase().includes(i.toLowerCase())
  );
  if (hasIntentMatch) {
    score += 40;
    reasons.push("Matches your primary intent");
  }

  // 2. Post Type Relevance (20 pts)
  const roleRelevanceMap: Record<string, string[]> = {
    "BUSINESS": ["HIRING", "PARTNER", "LEAD"],
    "PROFESSIONAL": ["LEAD", "MEETUP", "PARTNER"],
    "STUDENT": ["LEAD", "MEETUP", "HIRING"],
    "ADVISOR": ["PARTNER", "LEAD", "MEETUP"]
  };
  if (roleRelevanceMap[user.role || ""]?.includes(post.type?.toUpperCase() || "")) {
    score += 20;
    reasons.push("High archetype relevance");
  }

  // 3. Expertise Overlap (20 pts)
  const overlappingExpertise = (user.expertise_tags || []).filter(t => 
    post.required_expertise?.some(req => req.toLowerCase() === t.toLowerCase())
  );
  if (overlappingExpertise.length > 0) {
    score += 20;
    reasons.push(`Expertise match (${overlappingExpertise[0]})`);
  }

  // 4. Experience Match (10 pts)
  if ((user.experience_years || 0) > 0) {
    score += 10;
  }

  // 5. Location Match (10 pts)
  if ((user.location || "").toLowerCase() === (post.location || "").toLowerCase()) {
    score += 10;
    reasons.push(`Regional priority (${user.location || "Local"})`);
  }

  return { 
    score: Math.min(score, 100), 
    reasons: reasons.slice(0, 2)
  };
}
