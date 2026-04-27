/**
 * 🧠 SECURITY GRAPH & REPUTATION LAYER (V35)
 * 
 * Server-side simulation for computing user reputation, sybil cluster detection,
 * and slow-burn spam filtering.
 * Principles: Outcome-Driven, Graph-Based, Privacy-Preserving.
 */

export interface UserReputation {
  userId: string;
  reputationScore: number; // 0.0 - 1.0
  isSybilFlagged: boolean;
  isSlowBurnFlagged: boolean;
  rollingInteractions: number;
}

export interface CoActivityEdge {
  userA: string;
  userB: string;
  targetCategory: string;
  weight: number;
  lastActive: number;
}

/**
 * MOCK SERVER SERVICE
 * In production, this runs asynchronously via Edge Functions or background workers,
 * analyzing the append-only event log.
 */
export class SecurityGraphService {
  
  /**
   * Computes a user's 7-day rolling reputation score.
   */
  static calculateReputation(
    replyRate: number, 
    connectAcceptRate: number, 
    uniqueInteractionsRatio: number
  ): number {
    let rep = (replyRate * 0.5) + (connectAcceptRate * 0.3) + (uniqueInteractionsRatio * 0.2);
    return Math.max(0, Math.min(1, rep)); // Clamp 0-1
  }

  /**
   * Detects Sybil Clusters based on co-activity graphs.
   * If >=5 users heavily act on the same target with low diversity, they are flagged.
   */
  static detectSybilClusters(edges: CoActivityEdge[], targetCategory: string): boolean {
    const clusterUsers = new Set<string>();
    let totalWeight = 0;
    
    // Simple clustering logic mock
    for (const edge of edges) {
      if (edge.targetCategory === targetCategory) {
        clusterUsers.add(edge.userA);
        clusterUsers.add(edge.userB);
        totalWeight += edge.weight;
      }
    }

    // Flag if cluster size >= 5 and mutual activity is abnormally high
    if (clusterUsers.size >= 5 && totalWeight > clusterUsers.size * 3) {
      return true; // Sybil cluster detected
    }
    return false;
  }

  /**
   * Detects Slow-Burn bots.
   * Flagged if a user has consistent long-term actions but extremely low replies/accepts.
   */
  static detectSlowBurn(actionCount: number, replyCount: number, daysActive: number): boolean {
    if (daysActive > 7 && actionCount > 50 && replyCount === 0) {
      return true;
    }
    return false;
  }

  /**
   * Applies the reputation constraints to calculate the final global weight for a user's action.
   */
  static getActionWeight(userRep: UserReputation): number {
    if (userRep.isSybilFlagged) return 0.3; // Severely penalize cluster activity
    if (userRep.isSlowBurnFlagged) return 0.5; // Gradually decay slow-burn bots
    if (userRep.reputationScore < 0.3) return 0.5; // Penalize low-quality
    return 1.0; // Normal weight for healthy users
  }

  /**
   * Validates if a category should be marked as "Trending".
   */
  static validateTrend(
    category: string,
    uniqueUsers: number,
    avgReputation: number,
    isSybilFlagged: boolean
  ): boolean {
    // 🛡️ STEP 7: TREND VALIDATION
    if (uniqueUsers >= 15 && avgReputation >= 0.5 && !isSybilFlagged) {
      return true;
    }
    return false;
  }
}
