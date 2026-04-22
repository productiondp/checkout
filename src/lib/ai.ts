/**
 * CHECKOUT AI ENGINE (Logic Only - No UI impact)
 * This module handles internal matching, intent categorization, and feed optimization.
 */

export interface UserIntent {
  action: 'hiring' | 'collaborating' | 'learning' | 'selling' | 'general';
  domains: string[];
}

export const CATEGORIES_MAP = {
  FMCG: ["packaging", "snacks", "distribution", "retail"],
  Engineering: ["manufacturing", "logistics", "automation", "steel"],
  Marketing: ["branding", "digital", "strategy", "growth"],
  Design: ["ui", "ux", "figma", "branding"],
  Food: ["kitchen", "delivery", "fmcg"],
  Finance: ["fundraising", "planning", "fintech"]
};

/**
 * Calculates a logical match score between a user and a post/opportunity.
 * This is used to drive the "matchScore" visible in the UI.
 */
export function calculateMatchScore(user: { role: string; bio: string; domains?: string[] }, post: any): number {
  if (!post) return 0;
  let score = 70; // Baseline score
  
  const userDomain = (user.role || "").toLowerCase();
  const postDomain = (post.domain || "").toLowerCase();
  
  // 1. Domain Alignment
  if (userDomain && postDomain && userDomain === postDomain) {
    score += 15;
  }
  
  // 2. Keyword Matching (Deep Logic)
  const title = (post.title || "").toLowerCase();
  const content = (post.content || "").toLowerCase();
  const keywords = title + " " + content;
  const userContext = (user.bio || "").toLowerCase();
  
  const commonKeywords = ["expert", "scale", "launch", "strategy", "digital", "growth"];
  commonKeywords.forEach(word => {
    if (keywords.includes(word) && userContext.includes(word)) {
      score += 3;
    }
  });

  // 3. Intent Check (Self-correcting logic)
  if (post.type === "Lead" && userDomain === "strategy") score += 5;
  if (post.type === "Hiring" && userDomain === "design") score += 5;
  
  return Math.min(score, 100);
}

/**
 * Calculates a match score for an advisor based on user needs.
 */
export function calculateAdvisorMatch(user: any, advisor: any): number {
  if (!user || !advisor) return 0;
  let score = 80;
  const userRole = (user.role || "").toLowerCase();
  const advisorRole = (advisor.role || "").toLowerCase();
  
  if (userRole && advisorRole && userRole === advisorRole) score += 10;
  if (advisor.checkoutScore > 90) score += 5;
  return Math.min(score, 100);
}

/**
 * Determines a user's primary intent based on their metadata.
 */
export function getInternalIntent(user: any): UserIntent {
  const bio = (user.bio || "").toLowerCase();
  const requirements = user.requirements || [];
  
  let action: UserIntent['action'] = 'general';
  if (bio.includes("scaling") || bio.includes("growth")) action = 'collaborating';
  if (bio.includes("expert") || bio.includes("advisor")) action = 'selling';
  if (requirements.length > 0) action = 'hiring';
  
  return {
    action,
    domains: [user.role]
  };
}

/**
 * Optimizes the feed ordering based on user relevance.
 */
export function optimizeFeedOrder(posts: any[], user: any): any[] {
  return [...posts].sort((a, b) => {
    const scoreA = calculateMatchScore(user, a);
    const scoreB = calculateMatchScore(user, b);
    return scoreB - scoreA; // Priority to higher matches
  });
}

/**
 * Generates an internal AI insight for why one should connect with a specific user.
 */
export function getChatInsight(user: any, partner: any): string {
  if (user.role.toLowerCase() === partner.role.toLowerCase()) {
    return `Peer matching detected. Strategic collaboration on ${user.role} possible.`;
  }
  return `Complementary expertise detected. High potential for ${partner.role} - ${user.role} synergy.`;
}
