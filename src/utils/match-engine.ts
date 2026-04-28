import { SignalGuard } from "./signal-guard";

/**
 * MATCH ENGINE V1.90 (SUCCESS PROBABILITY)
 */

export type IntentMode = 'SMART' | 'REQUIREMENT' | 'PARTNER' | 'MEETUP';

export interface MatchProfile {
  id: string;
  industry?: string;
  base_tag?: string;
  skills?: string[];
  role?: string;
  intents?: string[];
  location?: string;
  metadata?: {
    focus_areas?: string[];
    intent?: string;
    experience_level?: string;
    specializations?: string[];
  };
  metrics?: {
    replies: number;
    meaningful_replies: number;
    connections: number;
  };
  author_profile?: {
    response_rate?: number;
    activity_level?: number;
    advisor_score?: number;
  };
}

export interface MatchPost {
  id: string;
  title: string;
  content: string;
  industry?: string;
  base_tag?: string;
  skills_required?: string[];
  type: string;
  created_at?: string;
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
  metadata?: {
    focus_areas?: string[];
    intent?: string;
    experience_level?: string;
    specializations?: string[];
  };
}

const URGENCY_KEYWORDS = ["urgent", "asap", "deadline", "today", "immediately", "quick"];

export const calculateMatchScore = (user: any, post: any, index: number = 0, mode: IntentMode = 'BALANCED') => {
  const signals: string[] = [];
  
  // 1. BASE RELEVANCE
  const postText = `${post.title} ${post.content}`.toLowerCase();
  const userSkills = user.skills || [];
  const skillMatches = userSkills.filter((skill: string) => postText.includes(skill.toLowerCase()));
  const baseScore = skillMatches.length > 0 ? Math.min(0.8, skillMatches.length * 0.2) : 0.1;

  // 2. TRUST & PERFORMANCE
  const advisorScore = post.author_profile?.advisor_score || 0;
  const trustBoost = advisorScore / 5;
  
  const responseProb = post.author_profile?.response_rate || 0.5;
  const activityLevel = post.author_profile?.activity_level || 0.5;
  
  const now = new Date();
  const postDate = post.created_at ? new Date(post.created_at) : now;
  const ageHrs = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
  
  const hasUrgency = URGENCY_KEYWORDS.some(k => postText.includes(k));
  
  // 🚀 SUCCESS PROBABILITY LAYER (V1.90)
  const completionRate = user.metrics?.meaningful_replies ? (user.metrics.meaningful_replies / (user.metrics.replies || 1)) : 0.7;
  const responseRate = user.author_profile?.response_rate || 0.8;
  const repeatRate = (user.metrics?.connections || 0) > 5 ? 0.9 : 0.6;
  
  const performanceScore = (completionRate * 0.4) + (responseRate * 0.3) + (repeatRate * 0.3);
  
  const successProbability = (performanceScore * 0.5) + (trustBoost * 0.3) + (activityLevel * 0.2);
  const successLabel = successProbability > 0.85 ? "High chance of success" : 
                       successProbability > 0.75 ? "Strong match for this project" : null;

  // 🏛️ STRUCTURED TAXONOMY BOOST (V2.0 - KERALA OPTIMIZED)
  let taxonomyBoost = 0;
  if (user.industry && post.industry === user.industry) {
    taxonomyBoost += 0.40; // Same Industry
    signals.push("Same Industry");
    
    const userFocus = user.metadata?.focus_areas || [];
    const postFocus = post.metadata?.focus_areas || [];
    const focusOverlap = userFocus.filter((f: string) => postFocus.includes(f));
    if (focusOverlap.length > 0) {
      taxonomyBoost += 0.30; // Same Focus
      signals.push(`${focusOverlap.length} Focus Match`);
    }
  }

  // 📍 LOCAL RELEVANCE BOOST (+15%)
  if (user.location && post.location && user.location.toLowerCase() === post.location.toLowerCase()) {
    taxonomyBoost += 0.15;
    signals.push("Local Relevance");
  }

  if (user.metadata?.experience_level && post.metadata?.experience_level === user.metadata?.experience_level) {
    taxonomyBoost += 0.15;
    signals.push("Experience Match");
  }

  // Final Score Logic
  let actionScore = (taxonomyBoost * 0.45) + (trustBoost * 0.25) + (performanceScore * 0.15) + (successProbability * 0.15);
  
  // Apply Mode Multipliers (V2.0)
  if (mode === 'REQUIREMENT' && post.type === 'REQUIREMENT') actionScore *= 1.3;
  if (mode === 'PARTNER' && post.type === 'PARTNER') actionScore *= 1.3;
  if (mode === 'MEETUP' && post.type === 'MEETUP') actionScore *= 1.3;
  if (mode === 'SMART') actionScore *= 1.1; 

  if (successLabel) signals.push(successLabel);

  // TIERING
  const tier = actionScore > 0.8 ? 1 : actionScore > 0.5 ? 2 : 3;
  const label = actionScore > 0.8 ? "Best opportunity" : actionScore > 0.5 ? "Also useful for you" : null;

  return {
    score: Math.round(actionScore * 100),
    actionScore,
    label,
    tier,
    signals: signals.slice(0, 3),
    successProbability: Math.round(successProbability * 100),
    ctaHint: successProbability > 0.85 ? "Strategic Match" : null,
    nudge: successLabel
  };
};

export const getRelevanceLabel = (score: number) => {
  if (score > 80) return "Best opportunity";
  if (score > 50) return "Also useful for you";
  return null;
};

export const detectBaseTag = (content: string, skills: string[]): string => {
  const text = content.toLowerCase();
  if (text.includes("video") || text.includes("reels") || skills.includes("Video Editing")) return "video";
  if (text.includes("logo") || text.includes("design") || skills.includes("Graphic Design")) return "design";
  if (text.includes("web") || text.includes("app") || skills.includes("Web Development")) return "tech";
  return "general";
};
