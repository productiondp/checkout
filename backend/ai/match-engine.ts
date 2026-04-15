import OpenAI from "openai";
import { User, Opportunity } from "@/lib/ai-engine";

/**
 * CHECKOUT AI ENGINE (Production Backend Implementation)
 * This logic is designed to run on the server/edge with access to OpenAI and Supabase.
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate high-dimensional vector for business context
 */
export async function generateEmbedding(text: string) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return res.data[0].embedding;
}

/**
 * PRODUCTION MATCHING ALGORITHM (SQL Optimized)
 * In production, the embedding score will be calculated in Postgres using:
 * 1 - (embedding <=> target_embedding) AS similarity
 */
export function calculateHybridScore(
  user: User, 
  opp: Opportunity, 
  vectorSimilarity: number
): number {
  let score = 0;

  // 1. Vector Similarity (40%) - Semantic "Vibes"
  score += 0.4 * vectorSimilarity;

  // 2. Exact Skill Overlap (35%) - Capabilities
  const skillMatch = getSkillOverlap(user.skills, opp.skills_required);
  if (skillMatch < 0.3 && opp.skills_required.length > 0) return 0; // Hard filter
  score += 0.35 * skillMatch;

  // 3. Location & Meta (25%)
  score += 0.15 * (user.location === opp.location ? 1 : 0.2);
  score += 0.05 * (user.intent.includes("looking for clients") ? 1 : 0.5);
  
  return Math.min(Math.round(score * 100), 100);
}

function getSkillOverlap(userSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 1;
  const overlap = userSkills.filter(skill => 
    requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()))
  );
  return overlap.length / requiredSkills.length;
}
