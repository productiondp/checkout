/**
 * CHECKOUT NEURAL MATCH ENGINE v1.0
 * Pure-heuristic engine for high-relevance intent distribution.
 */

export interface MatchProfile {
  id?: string;
  role: string;
  industry: string;
  expertise_tags: string[];
  intent_tags: string[];
  experience_years: number;
  location: string;
}

export interface MatchPost {
  id?: string;
  type: string;
  location: string;
  author_role: string;
  author_id?: string;
  industry?: string;
  skills_required?: string[];
  metadata?: {
    explicit_focus?: string[];
    inferred_focus?: string[];
    classification_confidence?: number;
  };
}

export interface MatchResult {
  score: number;
  reasons: string[];
}

export function calculateMatchScore(user: MatchProfile, post: MatchPost): MatchResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Dual Signal Expertise Match (40 pts max)
  const explicitTags = post.metadata?.explicit_focus || post.skills_required || [];
  const inferredTags = post.metadata?.inferred_focus || [];
  const confidence = post.metadata?.classification_confidence || 0;

  let tagScore = 0;
  const userExpertise = (user.expertise_tags || []).map(t => t.toLowerCase());

  // Step 2 & 7: Explicit Focus (Weight 1.0)
  explicitTags.forEach(tag => {
    if (userExpertise.includes(tag.toLowerCase())) {
      tagScore += 20; // 20 pts per explicit match
    }
  });

  // Step 2 & 3: Inferred Focus (Weight 0.4, only if confidence > 0.6)
  if (confidence > 0.6) {
    inferredTags.forEach(tag => {
      if (userExpertise.includes(tag.toLowerCase())) {
        tagScore += 8; // 8 pts per inferred match (40% of 20)
      }
    });
  }

  if (tagScore > 0) reasons.push("Matches your skills");

  // 2. Industry Signal Boost (20 pts) - Step 9
  if (user.industry && post.industry && user.industry.toLowerCase() === post.industry.toLowerCase()) {
    score += 20;
    reasons.push("In your industry");
  }

  // 3. Post Type Relevance (20 pts)
  const roleRelevanceMap: Record<string, string[]> = {
    "BUSINESS": ["REQUIREMENT", "PARTNERSHIP", "MEETUP"],
    "PROFESSIONAL": ["REQUIREMENT", "MEETUP", "PARTNERSHIP"],
    "STUDENT": ["REQUIREMENT", "MEETUP", "PARTNERSHIP"],
    "ADVISOR": ["PARTNERSHIP", "REQUIREMENT", "MEETUP"]
  };
  if (roleRelevanceMap[user.role?.toUpperCase()]?.includes(post.type?.toUpperCase())) {
    score += 20;
    reasons.push("Fits your profile");
  }

  // 4. Location Match (20 pts)
  if (user.location && post.location && user.location.toLowerCase() === post.location.toLowerCase()) {
    score += 20;
    reasons.push(`Nearby (${user.location})`);
  }

  // 5. General Fallback
  if (score === 0 && (post.skills_required?.includes("General") || post.type === "MEETUP")) {
    score = 15;
    reasons.push("Worth a look");
  }

  return { 
    score: Math.min(score, 100), 
    reasons: reasons.slice(0, 2)
  };
}
