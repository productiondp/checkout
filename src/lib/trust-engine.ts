import { createClient } from "@/utils/supabase/client";

export type OutcomeType = 'COLLABORATION' | 'TALENT_FOUND' | 'KNOWLEDGE_GAINED' | 'NONE';

export const OUTCOME_SCORES: Record<OutcomeType, number> = {
  COLLABORATION: 5,
  TALENT_FOUND: 4,
  KNOWLEDGE_GAINED: 2,
  NONE: 0
};

export class TrustEngine {
  private static supabase = createClient();

  /**
   * Assign score to a meetup based on outcome (Step 1)
   */
  static async processMeetupOutcome(meetupId: string, advisorId: string, outcome: OutcomeType) {
    const points = OUTCOME_SCORES[outcome];
    
    // Update meetup outcome_data
    const { error } = await this.supabase
      .from('posts')
      .update({ 
        outcome_data: { 
          type: outcome, 
          points, 
          processed_at: new Date().toISOString() 
        } 
      })
      .eq('id', meetupId);

    if (error) {
      console.error("[TRUST_ENGINE] Outcome update failed:", error);
      return;
    }

    // Recalculate Advisor Trust Score (Step 2)
    await this.recalculateAdvisorScore(advisorId);
  }

  /**
   * Record a participant vote (Step 3)
   */
  static async submitVote(meetupId: string, userId: string, helpful: boolean) {
    // Prevent duplicate votes (Database UNIQUE constraint handles this, but let's be safe)
    const { error } = await this.supabase
      .from('meetup_votes')
      .upsert({ 
        meetup_id: meetupId, 
        user_id: userId, 
        helpful 
      });

    if (error) {
      console.error("[TRUST_ENGINE] Vote submission failed:", error);
      throw error;
    }

    // Get advisor ID to update score
    const { data: meetup } = await this.supabase
      .from('posts')
      .select('author_id')
      .eq('id', meetupId)
      .single();

    if (meetup) {
      await this.recalculateAdvisorScore(meetup.author_id);
    }
  }

  /**
   * Formula V1.6: 
   * Score = [(70% Votes + 30% Outcomes) * TimeDecay] / ConfidenceFactor
   */
  static async recalculateAdvisorScore(advisorId: string) {
    const { data: meetups } = await this.supabase
      .from('posts')
      .select('id, outcome_data, live_at, completed_at, joined_count')
      .eq('author_id', advisorId)
      .eq('type', 'MEETUP')
      .eq('status', 'completed');

    if (!meetups || meetups.length === 0) {
      await this.supabase.from('profiles').update({ advisor_score: 0 }).eq('id', advisorId);
      return;
    }

    let totalWeightedScore = 0;
    let totalTimeWeight = 0;
    let validMeetupsCount = 0;
    const now = Date.now();

    for (const m of meetups) {
      // 🛡️ ANTI-GAMING FILTERS
      const participants = m.joined_count || 0;
      const durationMs = (m.live_at && m.completed_at) 
        ? new Date(m.completed_at).getTime() - new Date(m.live_at).getTime() 
        : 0;
      const durationMins = durationMs / (1000 * 60);

      if (participants < 2 || durationMins < 10) continue;

      validMeetupsCount++;

      // 1. HOST OUTCOME SCORE (30%) - Normalized 0 to 1
      const outcome = m.outcome_data as any;
      const outcomePoints = outcome?.points || 0;
      const hostScore = Math.min(1, outcomePoints / 5);

      // 2. PARTICIPANT VOTE SCORE (70%) - Normalized 0 to 1
      const { data: votes } = await this.supabase
        .from('meetup_votes')
        .select('helpful')
        .eq('meetup_id', m.id);

      let voteScore = 0.5; // Default neutral if no votes
      if (votes && votes.length > 0) {
        const helpful = votes.filter(v => v.helpful).length;
        voteScore = helpful / votes.length;
      }

      // 3. TIME DECAY (Halves weight every 30 days)
      const ageDays = (now - new Date(m.completed_at || now).getTime()) / (1000 * 60 * 60 * 24);
      const timeWeight = Math.exp(-0.023 * ageDays); // exp(-ln(2)/30 * age)

      // 4. COMBINED WEIGHTED SCORE
      const meetupScore = (voteScore * 0.7) + (hostScore * 0.3);
      totalWeightedScore += (meetupScore * timeWeight);
      totalTimeWeight += timeWeight;
    }

    if (validMeetupsCount === 0 || totalTimeWeight === 0) {
      await this.supabase.from('profiles').update({ advisor_score: 0 }).eq('id', advisorId);
      return;
    }

    // 5. CONFIDENCE STABILIZATION (Requires 5 meetups for full score potential)
    const rawScore = (totalWeightedScore / totalTimeWeight) * 5; // Scale to 0-5
    const confidence = Math.min(1, validMeetupsCount / 5);
    const finalScore = rawScore * confidence;

    // 6. Update Profile
    await this.supabase
      .from('profiles')
      .update({ advisor_score: Math.round(finalScore * 10) / 10 })
      .eq('id', advisorId);
  }

  /**
   * Get Trust Badge based on score (Step 4)
   */
  static getTrustBadge(score: number): { label: string; color: string; icon: string } | null {
    if (score >= 4) return { label: "Trusted Advisor", color: "#F59E0B", icon: "Award" };
    if (score >= 2) return { label: "Good Sessions", color: "#3B82F6", icon: "CheckCircle" };
    return null;
  }

  /**
   * V1.7: Explainability Layer
   * Returns metadata about WHY the score is what it is.
   */
  static async getAdvisorInsights(advisorId: string) {
    const { data: meetups } = await this.supabase
      .from('posts')
      .select('id, outcome_data, completed_at, joined_count')
      .eq('author_id', advisorId)
      .eq('type', 'MEETUP')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (!meetups || meetups.length === 0) return null;

    const totalSessions = meetups.length;
    const outcomes = meetups.filter(m => m.outcome_data && (m.outcome_data as any).type !== 'NONE').length;
    
    // Last Session Result
    const lastSession = meetups[0];
    const lastOutcome = (lastSession.outcome_data as any)?.type || 'None';

    // Helpful %
    const { data: votes } = await this.supabase
      .from('meetup_votes')
      .select('helpful')
      .in('meetup_id', meetups.map(m => m.id));
    
    let helpfulPercent = 100;
    if (votes && votes.length > 0) {
      const helpful = votes.filter(v => v.helpful).length;
      helpfulPercent = Math.round((helpful / votes.length) * 100);
    }

    // Active this week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const activeThisWeek = meetups.some(m => new Date(m.completed_at) > lastWeek);

    // Tags
    const tags = [];
    if (helpfulPercent >= 90 && totalSessions >= 3) tags.push("High success rate");
    if (activeThisWeek) tags.push("Active this week");

    return {
      totalSessions,
      outcomes,
      helpfulPercent,
      lastOutcome,
      activeThisWeek,
      tags
    };
  }
}
