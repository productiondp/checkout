/**
 * SIGNAL GUARDRAIL SYSTEM (V1.10)
 * 
 * Enforces stability, priority, and rarity across the feed.
 * Goal: Prevent signal drift and maintain high-trust clarity.
 */

export const ALLOWED_PRIMARY_SIGNALS = [
  "Top opportunity",
  "You should join this",
  "Best match for you",
  "New advisor",
  "Good match for you"
] as const;

export type PrimarySignal = typeof ALLOWED_PRIMARY_SIGNALS[number];

export const SIGNAL_PRIORITY: PrimarySignal[] = [
  "Top opportunity",
  "You should join this",
  "Best match for you",
  "New advisor",
  "Good match for you"
];

interface GuardrailOptions {
  maxTopOpportunities?: number;
  neutralRatio?: number; // 0.3 - 0.4
}

export class SignalGuard {
  /**
   * RESOLVE: Ensures only the highest priority signal is selected.
   */
  static resolveSignal(candidates: string[]): PrimarySignal | undefined {
    for (const priority of SIGNAL_PRIORITY) {
      if (candidates.includes(priority)) return priority;
    }
    return undefined;
  }

  /**
   * FEED GUARDRAIL: Processes a list of posts to enforce density and neutrality.
   */
  static applyFeedGuardrails(posts: any[], options: GuardrailOptions = {}) {
    const { maxTopOpportunities = 3, neutralRatio = 0.35 } = options;
    
    let topOpportunityCount = 0;
    let lastSignal: string | null = null;
    const advisorAppearanceCount: Record<string, number> = {};

    const totalPosts = posts.length;
    const neutralTarget = Math.floor(totalPosts * neutralRatio);
    let currentNeutralCount = 0;

    return posts.map((post, index) => {
      let signal = post.relevanceLabel;
      const advisorId = post.author_id;

      // 1. SIGNAL DECAY (Anti-Spam)
      advisorAppearanceCount[advisorId] = (advisorAppearanceCount[advisorId] || 0) + 1;
      if (advisorAppearanceCount[advisorId] > 2 && signal) {
        // Downgrade or remove signal if advisor appears too much
        if (signal === "Top opportunity") signal = "Best match for you";
        else if (index % 2 === 0) signal = undefined;
      }

      // 2. DENSITY MONITOR (Top Opportunities)
      if (signal === "Top opportunity") {
        topOpportunityCount++;
        if (topOpportunityCount > maxTopOpportunities) {
          signal = "Best match for you"; // Downgrade
        }
      }

      // 3. BACK-TO-BACK REPEAT PREVENTION
      if (signal === lastSignal && signal) {
        signal = undefined; 
      }

      // 4. NEUTRAL PRESERVATION
      // If we haven't hit our neutral target and this is a lower priority signal, consider removing it
      if (currentNeutralCount < neutralTarget && signal && !["Top opportunity", "You should join this"].includes(signal)) {
        if (index % 3 === 0) {
          signal = undefined;
          currentNeutralCount++;
        }
      } else if (!signal) {
        currentNeutralCount++;
      }

      if (signal) lastSignal = signal;
      
      return {
        ...post,
        relevanceLabel: signal
      };
    });
  }

  /**
   * CTA INTEGRITY: Double checks high-confidence signals.
   */
  static validateCTA(signal: string, metrics: { trust: number; match: number; active: boolean }): string {
    if (signal === "You should join this") {
      if (metrics.trust < 4.0 || metrics.match < 0.8 || !metrics.active) {
        return "Good match for you";
      }
    }
    return signal;
  }
}
