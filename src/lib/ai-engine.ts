/**
 * CHECKOUT AI MATCHING ENGINE (V2 - Robust Defensive Version)
 * Logic: (0.4 * Embedding) + (0.35 * Skill) + (0.15 * Location) + (0.05 * Recency) + (0.05 * Intent)
 */

export interface Reputation {
  rating: number;
  projectsCompleted: number;
  reliabilityScore: number; // 0-100
  badges: string[]; // "Fast Responder", "Top Creator", "Verified"
  aiInsight?: string; // "High-quality delivery", "Hospitality expert"
}

export interface User {
  id: string;
  name: string;
  title: string;
  skills: string[];
  industries: string[];
  location: string;
  intent: string[];
  isPremium?: boolean;
  reputation?: Reputation;
}

export interface Opportunity {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  skills_required: string[];
  industry: string;
  location: string;
  budget: string;
  urgency: "high" | "normal";
  created_at: Date;
  requires_physical_presence?: boolean;
  type?: "hiring" | "freelance" | "collaboration" | "investment" | "partnership";
}

/**
 * HARD SKILL FILTER (Scenario 1)
 */
function getSkillOverlap(userSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 1;
  const overlap = userSkills.filter(skill => 
    requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()))
  );
  return overlap.length / requiredSkills.length;
}

/**
 * AGGRESSIVE RECENCY DECAY (Scenario 4)
 */
function getRecencyScore(createdAt: Date): number {
  const diffDays = Math.floor((new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 2) return 1;
  if (diffDays < 7) return 0.6;
  if (diffDays < 14) return 0.3;
  return 0.1;
}

/**
 * SKILL CLUSTERING PENALTY (Scenario 2)
 */
function getCategoryMismatchPenalty(user: User, opp: Opportunity): number {
    const categories: Record<string, string> = {
        "video editing": "media",
        "video shooting": "media",
        "reels": "media",
        "branding": "design",
        "logo design": "design",
        "social media": "marketing",
        "ads": "marketing"
    };

    const userCat = categories[user.skills[0].toLowerCase()] || "other";
    const oppCat = categories[opp.skills_required[0]?.toLowerCase()] || "other";

    return userCat !== oppCat ? 0.2 : 0;
}

export function calculateMatchScore(user: User, opp: Opportunity): number {
  // --- HARD FILTERS ---
  
  // 1. Skill Threshold (Scenario 1)
  const skillMatch = getSkillOverlap(user.skills, opp.skills_required);
  if (skillMatch < 0.3 && opp.skills_required.length > 0) return 0;

  // 2. Physical Presence (Scenario 3)
  if (opp.requires_physical_presence && user.location !== opp.location) return 0;

  let score = 0;

  // --- WEIGHTED SCORING (V2) ---
  
  // 1. Embedding Similarity (40%) - Vibes
  const userText = `${user.title} ${user.skills.join(" ")}`.toLowerCase();
  const oppText = `${opp.title} ${opp.description}`.toLowerCase();
  const sim = userText.split(" ").filter(w => oppText.includes(w)).length / 5;
  score += 0.4 * Math.min(sim, 1);

  // 2. Skill Overlap (35%) - Capabilities
  score += 0.35 * skillMatch;

  // 3. Location Match (15%) - Proximity
  score += 0.15 * (user.location === opp.location ? 1 : 0.3);

  // 4. Recency (5%)
  score += 0.05 * getRecencyScore(opp.created_at);

  // 5. Intent (5%)
  score += 0.05 * (user.intent.includes("looking for clients") ? 1 : 0.5);

  // --- PENALTIES ---
  score -= getCategoryMismatchPenalty(user, opp);

  const finalScore = Math.min(Math.round(score * 100), 100);
  
  // Threshold Filter (Scenario 6)
  return finalScore < 40 ? 0 : finalScore; 
}

/**
 * EXPLAINABILITY LAYER (Scenario Master Fix)
 */
export function explainMatch(user: User, opp: Opportunity): string {
    const skillMatch = getSkillOverlap(user.skills, opp.skills_required);
    
    if (skillMatch > 0.7) return `Perfect match for your ${user.skills[0]} skills.`;
    if (user.location === opp.location) return `Hyperlocal match in ${user.location}.`;
    if (user.industries.includes(opp.industry)) return `Both active in the ${opp.industry} industry.`;
    
    return "Relevant based on your creative profile.";
}

/**
 * SIMULATION DATA
 */
/**
 * SIMULATION DATA - EXPANDED (100+ Entries)
 */
export const SIM_USERS: User[] = [
  {
    id: "arjun",
    name: "Arjun Dev",
    title: "Commercial Video Editor",
    skills: ["video editing", "reels", "ads", "color grading"],
    industries: ["hospitality", "startups", "media"],
    location: "Trivandrum",
    intent: ["looking for clients"],
    reputation: {
      rating: 4.9,
      projectsCompleted: 24,
      reliabilityScore: 98,
      badges: ["Fast Responder", "Top Creator", "Verified"],
      aiInsight: "Best for high-conversion reels"
    }
  },
  {
    id: "meera",
    name: "Meera Nair",
    title: "Brand Strategist",
    skills: ["social media", "ads", "branding", "copywriting"],
    industries: ["D2C", "cafes", "fashion"],
    location: "Trivandrum",
    intent: ["freelance work"],
    reputation: {
      rating: 4.7,
      projectsCompleted: 15,
      reliabilityScore: 92,
      badges: ["Verified", "Growth Expert"],
      aiInsight: "Retail brand specialist"
    }
  },
  {
     id: "rahul",
     name: "Rahul Krishnan",
     title: "Restaurant Owner",
     skills: ["business", "operations", "menu design"],
     industries: ["hospitality", "f&b"],
     location: "Trivandrum",
     intent: ["hiring", "partnerships"],
     reputation: {
       rating: 4.5,
       projectsCompleted: 8,
       reliabilityScore: 100,
       badges: ["Premium Business", "Verified"],
       aiInsight: "Series-A hospitality mentor"
     }
  },
  // Adding batches of users...
  ...Array.from({ length: 45 }).map((_, i) => ({
    id: `user_${i}`,
    name: ["Anish", "Sana", "Vikram", "Priya", "Jithin", "Leela", "Kiran", "Divya"][i % 8] + " " + (i + 10),
    title: ["UX Designer", "Content Writer", "Web Dev", "Marketing Lead", "Photographer", "Sales Expert"][i % 6],
    skills: [["Figma", "Design"], ["SEO", "Content"], ["React", "Custom Code"], ["Ads", "Strategy"], ["Lenses", "Lighting"]][i % 5],
    industries: ["startups", "media", "real estate", "education"][i % 4],
    location: "Trivandrum",
    intent: ["collaboration", "client work"],
    reputation: {
       rating: 4.0 + (i % 10) / 10,
       projectsCompleted: i + 2,
       reliabilityScore: 80 + (i % 20),
       badges: i % 3 === 0 ? ["Verified"] : [],
       aiInsight: "Strong community contributor"
    }
  })) as User[]
];

export const SIM_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp_cafe_1",
    ownerId: "rahul",
    title: "Bistro Launch Content",
    description: "Looking for a specialist to handle our opening day reels and food photography.",
    skills_required: ["video editing", "reels"],
    industry: "hospitality",
    location: "Trivandrum",
    budget: "₹18,000",
    urgency: "high",
    created_at: new Date(),
    requires_physical_presence: true
  },
  {
    id: "opp_d2c_1",
    ownerId: "user_2",
    title: "Skincare Ad Campaign",
    description: "Need a creator for a 30-day social media ad set for a local skincare brand.",
    skills_required: ["social media", "ads"],
    industry: "D2C",
    location: "Trivandrum",
    budget: "₹35,000",
    urgency: "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  // Batches of 50+ opportunities...
  ...Array.from({ length: 55 }).map((_, i) => ({
    id: `opp_gen_${i}`,
    ownerId: `user_${i % 40}`,
    title: ["App UI Design", "Wedding Edit", "SEO Audit", "Model Shoot", "Sales Pitch", "Legal Draft"][i % 6] + ` #${i + 101}`,
    description: `Professional requirement for ${["startup logo", "cinematic edit", "keyword research", "lifestyle photography"][i % 4]} in Trivandrum area. Weekly deliverables expected.`,
    skills_required: [["design", "figma"], ["video editing"], ["seo"], ["photography"], ["sales"], ["branding"]][i % 6],
    industry: ["tech", "media", "marketing", "real estate", "events", "hospitality"][i % 6],
    location: "Trivandrum",
    budget: `₹${(i + 5) * 2000}`,
    urgency: i % 4 === 0 ? "high" : "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * i),
    requires_physical_presence: i % 10 === 0
  })) as Opportunity[]
];

export interface DealSuggestion {
  priceRange: string;
  scope: string[];
  deliverables: string[];
  timeline: string;
}

export function generateDealSuggestions(opp: Opportunity): DealSuggestion {
  const defaults: Record<string, DealSuggestion> = {
    "hospitality": {
      priceRange: "₹8K - ₹15K",
      scope: ["5 Reels", "1 Studio Shoot", "Color Grading"],
      deliverables: ["4K High-Res Reels", "Raw Footage"],
      timeline: "3-5 Days"
    },
    "D2C": {
      priceRange: "₹20K - ₹35K",
      scope: ["Ad Campaign Setup", "3 Creative Sets", "A/B Testing"],
      deliverables: ["Performance Report", "3 Ad Creatives"],
      timeline: "7 Days"
    },
    "startups": {
       priceRange: "₹40K - ₹60K",
       scope: ["Logo Design", "Brand Guidelines", "Social Assets"],
       deliverables: ["Vector Logo Kit", "PDF Guideline"],
       timeline: "10 Days"
    }
  };

  return defaults[opp.industry] || {
    priceRange: "₹10K - ₹20K",
    scope: ["Custom Project Scope"],
    deliverables: ["Project Files"],
    timeline: "TBD"
  };
}

export function rankOpportunities(user: User, opportunities: Opportunity[]): (Opportunity & { score: number })[] {
  return opportunities
    .map(opp => ({ ...opp, score: calculateMatchScore(user, opp) }))
    .filter(opp => opp.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function rankUsers(opportunity: Opportunity, users: User[]): (User & { score: number })[] {
  return users
    .map(user => ({ ...user, score: calculateMatchScore(user, opportunity) }))
    .filter(user => user.score > 0)
    .sort((a, b) => b.score - a.score);
}
