//  TRUST GRAPH ENGINE (V1.51)
// Manages network-level trust propagation and intelligent ranking boosts.

export type TrustOutcome = 'COLLAB' | 'PAID' | 'LEARNED';

interface TrustLink {
  fromUserId: string;
  toUserId: string;
  weight: number; // 0.0 to 1.0
  outcome: TrustOutcome;
  timestamp: number;
}

class TrustGraphEngine {
  private static instance: TrustGraphEngine;
  private links: TrustLink[] = [];

  private constructor() {}

  public static getInstance(): TrustGraphEngine {
    if (!TrustGraphEngine.instance) {
      TrustGraphEngine.instance = new TrustGraphEngine();
    }
    return TrustGraphEngine.instance;
  }

  /**
   *  Create or update a trust link between two users after verification.
   */
  public recordVerifiedCollab(userA: string, userB: string, outcome: TrustOutcome) {
    const weightMap: Record<TrustOutcome, number> = {
      'PAID': 1.0,
      'COLLAB': 0.7,
      'LEARNED': 0.4
    };

    const weight = weightMap[outcome];
    const timestamp = Date.now();

    // Bi-directional trust link
    this.addLink(userA, userB, weight, outcome, timestamp);
    this.addLink(userB, userA, weight, outcome, timestamp);
  }

  private addLink(from: string, to: string, weight: number, outcome: TrustOutcome, timestamp: number) {
    const existingIndex = this.links.findIndex(l => l.fromUserId === from && l.toUserId === to);
    if (existingIndex > -1) {
      // Repetition increases weight (compound trust)
      this.links[existingIndex].weight = Math.min(1.0, this.links[existingIndex].weight + (weight * 0.2));
      this.links[existingIndex].timestamp = timestamp;
    } else {
      this.links.push({ fromUserId: from, toUserId: to, weight, outcome, timestamp });
    }
  }

  /**
   *  Calculate network trust propagation (A -> B -> C)
   */
  public getNetworkTrustScore(currentUserId: string, targetUserId: string): number {
    // 1. Direct Trust
    const directLink = this.links.find(l => l.fromUserId === currentUserId && l.toUserId === targetUserId);
    if (directLink) return this.applyDecay(directLink.weight, directLink.timestamp);

    // 2. Second-degree Trust (A -> B -> C)
    const intermediaries = this.links.filter(l => l.fromUserId === currentUserId);
    let maxPropagatedTrust = 0;

    for (const linkA of intermediaries) {
      const linkB = this.links.find(l => l.fromUserId === linkA.toUserId && l.toUserId === targetUserId);
      if (linkB) {
        const propTrust = (linkA.weight * linkB.weight) * 0.5; // 50% propagation dampening
        maxPropagatedTrust = Math.max(maxPropagatedTrust, this.applyDecay(propTrust, linkB.timestamp));
      }
    }

    return maxPropagatedTrust;
  }

  /**
   *  Recency Decay: Older trust is less valuable.
   */
  private applyDecay(weight: number, timestamp: number): number {
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const age = Date.now() - timestamp;
    const decayFactor = Math.max(0.5, 1 - (age / (thirtyDaysMs * 6))); // Decays to 50% over 6 months
    return weight * decayFactor;
  }

  /**
   *  Intelligent Ranking Boost
   */
  public getRankingBoost(userId: string, targetId: string): number {
    const score = this.getNetworkTrustScore(userId, targetId);
    if (score > 0.8) return 1.5; // 50% boost for high trust
    if (score > 0.4) return 1.2; // 20% boost for second-degree trust
    return 1.0;
  }

  /**
   *  Opportunity Routing: Find if a project is a "Top Match" for a user.
   */
  public getRoutingContext(userId: string, projectMetadata: any) {
    const networkScore = this.getNetworkTrustScore(userId, projectMetadata.creatorId || '');
    const domainMatch = projectMetadata.domain === 'startup' ? 1.0 : 0.6; // Simplified for demo
    
    const finalScore = (networkScore * 0.6) + (domainMatch * 0.4);
    
    return {
      score: finalScore,
      isTopPick: finalScore > 0.75,
      reason: networkScore > 0.5 ? "Worked with similar partners" : "Strong domain alignment"
    };
  }
}

export const trustGraph = TrustGraphEngine.getInstance();
