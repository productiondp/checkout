/**
 * Checkout OS Decision Memory
 * Purpose: Record interventions and their outcomes to build a long-term strategic memory.
 */
import { HealthSnapshot } from "@/utils/health_monitor";

export interface DecisionEntry {
  id: string;
  timestamp: number;
  variable: string;
  prevValue: any;
  newValue: any;
  reason: string;
  expectedOutcome: string;
  duration: number;
  metricsBefore: HealthSnapshot | null;
  metricsAfter: HealthSnapshot | null;
  classification: 'success' | 'neutral' | 'negative' | 'pending';
}

class DecisionMemory {
  private static instance: DecisionMemory;
  private history: DecisionEntry[] = [];
  private readonly STORAGE_KEY = 'checkout_decision_history';

  private constructor() {
    this.loadHistory();
  }

  public static getInstance(): DecisionMemory {
    if (!DecisionMemory.instance) {
      DecisionMemory.instance = new DecisionMemory();
    }
    return DecisionMemory.instance;
  }

  private loadHistory() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.history = JSON.parse(saved);
      } catch (err) {
        console.error('Failed to load decision history', err);
      }
    }
  }

  private saveHistory() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
  }

  public recordDecision(entry: Omit<DecisionEntry, 'classification' | 'metricsAfter' | 'metricsBefore'>, currentMetrics: HealthSnapshot | null) {
    const newEntry: DecisionEntry = {
      ...entry,
      metricsBefore: currentMetrics,
      metricsAfter: null,
      classification: 'pending'
    };
    this.history.push(newEntry);
    this.saveHistory();
  }

  public async evaluatePendingOutcomes(currentMetrics: HealthSnapshot) {
    let changed = false;
    this.history.forEach(entry => {
      if (entry.classification === 'pending' && (Date.now() > entry.timestamp + (entry.duration * 60 * 60 * 1000))) {
        entry.metricsAfter = currentMetrics;
        entry.classification = this.classify(entry.metricsBefore, entry.metricsAfter);
        changed = true;
        console.log(`[DECISION MEMORY] Evaluated override from ${new Date(entry.timestamp).toLocaleDateString()}: ${entry.classification.toUpperCase()}`);
      }
    });
    if (changed) this.saveHistory();
  }

  private classify(before: HealthSnapshot | null, after: HealthSnapshot | null): 'success' | 'neutral' | 'negative' {
    if (!before || !after) return 'neutral';
    
    // Check key metrics
    const ctrGain = (after.feed_ctr - before.feed_ctr) / before.feed_ctr;
    const connGain = (after.connection_success_rate - before.connection_success_rate) / before.connection_success_rate;
    const ttfaGain = (before.avg_ttfa - after.avg_ttfa) / before.avg_ttfa; // positive if ttfa decreased

    const totalGain = ctrGain + connGain + ttfaGain;
    
    if (totalGain > 0.05) return 'success';
    if (totalGain < -0.05) return 'negative';
    return 'neutral';
  }

  public getHistory() {
    return this.history;
  }

  public getRecommendation(variable: string, newValue: number): { warning: string | null } {
    const similar = this.history.filter(h => h.variable === variable && h.classification === 'negative');
    if (similar.length > 0) {
      return { 
        warning: `Caution: ${similar.length} previous attempt(s) to modify '${variable}' resulted in performance degradation.`
      };
    }
    return { warning: null };
  }

  public getPatterns() {
    const patterns: string[] = [];
    const successes = this.history.filter(h => h.classification === 'success');
    
    if (successes.length > 0) {
      const bestVar = this.mode(successes.map(s => s.variable));
      patterns.push(`Consistency: Increasing '${bestVar}' frequently improves system performance.`);
    }

    return patterns;
  }

  private mode(arr: any[]) {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
  }
}

export const decisionMemory = DecisionMemory.getInstance();
