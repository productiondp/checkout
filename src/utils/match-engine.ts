/**
 * CHECKOUT OS MATCH ENGINE (Proactive Assistant V14)
 * 
 * Evolution: From Feed to Intelligent Assistant.
 * Logic: Confidence-based Action Suggestions + Daily Priorities + Nudge System.
 * Goal: A system that proactively guides you toward the best professional outcomes.
 */

import { analytics } from "./analytics";

export type IntentMode = 'URGENT' | 'LONG_TERM' | 'PARTNERSHIP' | 'BALANCED';

export interface MatchProfile {
  id: string;
  role: string;
  industry?: string;
  base_tag?: string;
  intents?: string[];
  skills?: string[];
}

export interface MatchPost {
  id: string;
  title: string;
  content: string;
  base_tag?: string;
  skills_required?: string[];
  type: string;
  created_at?: string;
  impressions?: number;
  metrics?: {
    clicks: number;
    connections: number;
    replies: number;
    meaningful_replies?: number;
  };
  author_profile?: {
    response_rate?: number;
    quality_score?: number;
    activity_level?: number;
    last_active?: string;
    advisor_score?: number;
  };
}

export const BASE_TAG_MAP: Record<string, string[]> = {
  "design": ["designer", "ui/ux", "branding", "ui", "ux", "graphic", "visual", "logo", "illustrator", "sketch", "photoshop", "figma", "canva", "creative"],
  "video": ["video", "editor", "reels", "editing", "motion", "vfx", "cinematographer", "colorist", "youtube", "content creator", "filmmaker", "camera"],
  "finance": ["ca", "accountant", "tax", "audit", "finance", "chartered accountant", "bookkeeping", "gst", "accounting", "ledger", "tally", "cfo", "investment"],
  "tech": ["developer", "app", "ui", "backend", "coding", "software", "frontend", "programming", "dev", "engineer", "fullstack", "react", "nextjs", "python", "javascript", "cloud", "aws"],
  "marketing": ["marketing", "social media", "ads", "growth", "seo", "sem", "copywriter", "content strategy", "brand manager", "campaign", "digital marketing", "influencer", "pr"],
  "sales": ["sales", "leads", "closing", "bdr", "sdr", "business development", "outreach", "client acquisition", "deal", "revenue"],
  "strategy": ["founder", "ceo", "management", "operations", "strategy", "advisor", "consultant", "business model", "startup", "planning"]
};

const STATIC_DEPENDENCY_MAP: Record<string, string[]> = {
  "video": ["design", "marketing"],
  "design": ["marketing"],
  "tech": ["design", "marketing"],
  "finance": ["strategy"],
  "marketing": ["design", "video"],
  "sales": ["marketing", "strategy"],
  "strategy": ["finance", "tech", "marketing"]
};

const URGENCY_KEYWORDS = ["urgent", "today", "asap", "emergency", "fast", "immediately"];

export const calculateMatchScore = (
  user: MatchProfile, 
  post: MatchPost, 
  index: number = 0,
  mode: IntentMode = 'BALANCED'
): { 
  score: number; 
  label?: string; 
  signals: string[]; 
  baseTags: string[]; 
  tier: number;
  actionScore: number;
  ctaHint?: string;
  nudge?: string; // STEP 1: ACTION SUGGESTIONS
} => {
  const userBase = user.base_tag || detectBaseTag("", user.skills || user.intents);
  const postBase = post.base_tag || detectBaseTag(`${post.title} ${post.content}`, post.skills_required);

  if (!userBase || !postBase) {
     return { score: 0.0, signals: [], baseTags: postBase ? [postBase] : [], tier: 0, actionScore: 0 };
  }

  const signals: string[] = [];
  let baseScore = 0;
  let tier = 0;
  let label = undefined;
  let ctaHint = undefined;
  let nudge = undefined;

  // 1. TIER ALLOCATION
  const isSameBase = userBase === postBase;
  const userStaticDeps = STATIC_DEPENDENCY_MAP[userBase] || [];
  const isStaticDependency = userStaticDeps.includes(postBase);
  const dynamicSynergy = analytics.getDynamicSynergy(userBase);
  const behaviorData = dynamicSynergy[postBase] || { score: 0, hasHighIntent: false };

  if (isSameBase) {
    tier = 1;
    baseScore = 0.8;
    label = "Best opportunity";
  } else if (isStaticDependency) {
    tier = 2;
    baseScore = 0.5;
    label = "Also useful for you";
  } else if (behaviorData.hasHighIntent && behaviorData.score >= 0.5) {
    tier = 3;
    baseScore = 0.3;
    label = "Based on your activity";
  }

  if (tier === 0) return { score: 0, signals: [], baseTags: [postBase], tier: 0, actionScore: 0 };

  // 2. RESPONSE PROBABILITY & ACTIVITY
  const responseRate = post.author_profile?.response_rate || 0.5;
  const activityLevel = post.author_profile?.activity_level || 0.5;
  const responseProb = (responseRate * 0.7) + (activityLevel * 0.3);

  // STEP 3: BEST TIME SIGNAL
  const isAuthorActive = activityLevel > 0.8;
  if (isAuthorActive) {
    signals.push("Best time to connect");
  }

  // STEP 1: ACTION SUGGESTIONS (High Confidence)
  if (isSameBase && responseProb > 0.8 && isAuthorActive) {
    nudge = "You should connect with this now";
  } else if (responseProb > 0.9) {
    nudge = "High chance of reply — act now";
  }

  // Freshness & Urgency
  const ageHrs = post.created_at ? (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60) : 100;
  const hasUrgency = URGENCY_KEYWORDS.some(k => `${post.title} ${post.content}`.toLowerCase().includes(k));
  const urgencyScore = hasUrgency ? 0.8 : (ageHrs <= 12 ? 0.6 : 0);
  
  // 🛡️ TRUST ENGINE BOOST
  const advisorScore = post.author_profile?.advisor_score || 0;
  const trustBoost = advisorScore / 5; // Normalized boost

  // ── V1.10 SIGNAL GUARDRAIL ──
  const { SignalGuard } = require("./signal-guard");
  
  const isHighMatch = baseScore >= 0.8;
  const isHighActivity = activityLevel > 0.7;
  const actionScoreFinal = (baseScore * 0.4) + (responseProb * 0.2) + (urgencyScore * 0.2) + (trustBoost * 0.2);

  const potentialSignals = [];
  const secondarySignals: string[] = [];
  
  // 1. CTA CANDIDATES
  if (post.type === 'MEETUP' && isSameBase && isHighMatch) {
    potentialSignals.push(SignalGuard.validateCTA("You should join this", { 
      trust: advisorScore, 
      match: baseScore, 
      active: isHighActivity 
    }));
  }

  // 2. PRIORITY CANDIDATES
  if (actionScoreFinal > 0.85) potentialSignals.push("Top opportunity");
  if (isSameBase && tier === 1 && baseScore >= 0.8) potentialSignals.push("Best match for you");
  if (post.type === 'MEETUP' && advisorScore === 0) potentialSignals.push("New advisor");

  const primarySignal = SignalGuard.resolveSignal(potentialSignals);

  // 3. SECONDARY SIGNALS (Step 3)
  if (isAuthorActive) secondarySignals.push("Best time to connect");
  if (responseProb > 0.9) secondarySignals.push("High chance of reply");
  if (hasUrgency) secondarySignals.push("Urgent");
  
  // Add some personality-based secondary signals
  if (post.author_profile?.quality_score > 0.8) secondarySignals.push("High success rate");

  return {
    score: Math.min(1.0, baseScore),
    label: primarySignal,
    signals: secondarySignals,
    baseTags: [postBase],
    tier,
    actionScore: actionScoreFinal,
    ctaHint: primarySignal === "You should join this" ? primarySignal : undefined,
    nudge: primarySignal
  };
};

export const detectBaseTag = (text: string = "", tags: string[] = []): string => {
  const combined = [text, ...tags].join(" ").toLowerCase();
  for (const [base, keywords] of Object.entries(BASE_TAG_MAP)) {
    if (keywords.some(k => combined.includes(k))) return base;
  }
  return "general";
};

export const getRelevanceLabel = (score: number, customLabel?: string, signals: string[] = []): { label: string; color: string; signals: string[] } | null => {
  if (!customLabel) return null;
  const colorMap: Record<string, string> = {
    "Top opportunity": "emerald",
    "Best opportunity": "emerald",
    "Also useful for you": "blue",
    "Based on your activity": "slate"
  };
  return { label: customLabel, color: colorMap[customLabel] || "slate", signals };
};
