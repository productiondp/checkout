/**
 * CONVERSION LEARNING ENGINE (V1.12)
 * 
 * Purpose: Track micro-signal performance and adapt priority to maximize joins.
 * Persistence: LocalStorage (Privacy-first adaptive learning)
 */

export type MicroSignalType = 'SEAT_URGENCY' | 'SOCIAL_PROOF' | 'TIME_SENSITIVITY';

interface SignalMetric {
  impressions: number;
  conversions: number;
  cvr: number;
}

const STORAGE_KEY = 'checkout_conversion_learning';

class ConversionLearning {
  private static instance: ConversionLearning;
  private currentSessionExposures: Record<string, MicroSignalType[]> = {};

  public static getInstance() {
    if (!ConversionLearning.instance) ConversionLearning.instance = new ConversionLearning();
    return ConversionLearning.instance;
  }

  private getStats(): Record<MicroSignalType, SignalMetric> {
    if (typeof window === 'undefined') return this.getDefaultStats();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : this.getDefaultStats();
  }

  private getDefaultStats(): Record<MicroSignalType, SignalMetric> {
    return {
      SEAT_URGENCY: { impressions: 0, conversions: 0, cvr: 0.05 },
      SOCIAL_PROOF: { impressions: 0, conversions: 0, cvr: 0.05 },
      TIME_SENSITIVITY: { impressions: 0, conversions: 0, cvr: 0.05 }
    };
  }

  public trackImpression(meetupId: string, signals: MicroSignalType[]) {
    if (typeof window === 'undefined') return;
    this.currentSessionExposures[meetupId] = signals;
    
    const stats = this.getStats();
    signals.forEach(sig => {
      stats[sig].impressions += 1;
      // Update CVR estimate (smoothed)
      stats[sig].cvr = stats[sig].conversions / Math.max(1, stats[sig].impressions);
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }

  public trackConversion(meetupId: string) {
    if (typeof window === 'undefined') return;
    const signals = this.currentSessionExposures[meetupId];
    if (!signals) return;

    const stats = this.getStats();
    signals.forEach(sig => {
      stats[sig].conversions += 1;
      stats[sig].cvr = stats[sig].conversions / stats[sig].impressions;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    console.log(`%c[LEARNING] Conversion tracked for signals: ${signals.join(', ')}`, 'color: #34C759; font-weight: bold;');
  }

  public getSignalPriority(): MicroSignalType[] {
    const stats = this.getStats();
    return (Object.keys(stats) as MicroSignalType[]).sort((a, b) => stats[b].cvr - stats[a].cvr);
  }

  /**
   * Selection logic: Pick top 2 available signals based on performance.
   */
  public selectSignals(available: { type: MicroSignalType; active: boolean }[]): MicroSignalType[] {
    const priority = this.getSignalPriority();
    const active = available.filter(a => a.active).map(a => a.type);
    
    return priority
      .filter(type => active.includes(type))
      .slice(0, 2); // Hard limit of 2 signals
  }
}

export const conversionLearning = ConversionLearning.getInstance();
