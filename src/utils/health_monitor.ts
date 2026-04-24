/**
 * Checkout OS Health Monitor
 * Purpose: Continuously monitor system performance and protect against degradation.
 */
import { insights, InsightReport } from "@/utils/insights_engine";
import { optimization } from "@/utils/optimization_engine";

export interface HealthSnapshot {
  timestamp: number;
  activation_rate: number;
  avg_ttfa: number;
  connection_success_rate: number;
  feed_ctr: number;
}

export interface HealthReport {
  status: "healthy" | "warning" | "critical";
  degraded_metrics: string[];
  recommendation: string;
  trends: any;
}

class HealthMonitor {
  private static instance: HealthMonitor;
  private snapshots: HealthSnapshot[] = [];
  private readonly STORAGE_KEY = 'checkout_health_history';
  private readonly MAX_HISTORY = 30; // 30 days

  private constructor() {
    this.loadHistory();
  }

  public static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  private loadHistory() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.snapshots = JSON.parse(saved);
      } catch (err) {
        console.error('Failed to load health history', err);
      }
    }
  }

  private saveHistory() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.snapshots));
  }

  public async runCheck(): Promise<HealthReport | null> {
    const report = await insights.generateReport();
    if (!report) return null;

    const current: HealthSnapshot = {
      timestamp: Date.now(),
      activation_rate: parseFloat(report.activation_rate),
      avg_ttfa: parseFloat(report.avg_ttfa),
      connection_success_rate: parseFloat(report.connection_success),
      feed_ctr: parseFloat(report.feed_ctr)
    };

    const health = this.analyzeTrends(current);
    
    // Save snapshot once per day (approx)
    const lastSnapshot = this.snapshots[this.snapshots.length - 1];
    if (!lastSnapshot || (current.timestamp - lastSnapshot.timestamp > 24 * 60 * 60 * 1000)) {
      this.snapshots.push(current);
      if (this.snapshots.length > this.MAX_HISTORY) this.snapshots.shift();
      this.saveHistory();
    }

    if (health.status === 'critical') {
      this.handleCriticalDegradation(health);
    }

    return health;
  }

  private analyzeTrends(current: HealthSnapshot): HealthReport {
    const degraded_metrics: string[] = [];
    const trends: any = {};
    
    if (this.snapshots.length === 0) {
      return { status: "healthy", degraded_metrics: [], recommendation: "Collecting baseline data...", trends: {} };
    }

    const yesterday = this.snapshots[this.snapshots.length - 1];
    const last7Days = this.snapshots.slice(-7);
    const avg7Days = {
      activation: last7Days.reduce((a, b) => a + b.activation_rate, 0) / last7Days.length,
      ttfa: last7Days.reduce((a, b) => a + b.avg_ttfa, 0) / last7Days.length,
      conn: last7Days.reduce((a, b) => a + b.connection_success_rate, 0) / last7Days.length,
      ctr: last7Days.reduce((a, b) => a + b.feed_ctr, 0) / last7Days.length,
    };

    // 1. Activation Drop (>10%)
    if (current.activation_rate < avg7Days.activation * 0.9) {
      degraded_metrics.push('activation_rate');
      this.logWarning('activation_rate', current.activation_rate, avg7Days.activation);
    }

    // 2. TTFA Increase (>20%)
    if (current.avg_ttfa > avg7Days.ttfa * 1.2) {
      degraded_metrics.push('avg_ttfa');
      this.logWarning('avg_ttfa', current.avg_ttfa, avg7Days.ttfa);
    }

    // 3. Connection Success Drop (>10%)
    if (current.connection_success_rate < avg7Days.conn * 0.9) {
      degraded_metrics.push('connection_success_rate');
      this.logWarning('connection_success_rate', current.connection_success_rate, avg7Days.conn);
    }

    // 4. Feed CTR Drop (>10%)
    if (current.feed_ctr < avg7Days.ctr * 0.9) {
      degraded_metrics.push('feed_ctr');
      this.logWarning('feed_ctr', current.feed_ctr, avg7Days.ctr);
    }

    let status: "healthy" | "warning" | "critical" = "healthy";
    if (degraded_metrics.length >= 2) status = "critical";
    else if (degraded_metrics.length === 1) status = "warning";

    return {
      status,
      degraded_metrics,
      recommendation: this.getRecommendation(status, degraded_metrics),
      trends: { yesterday, avg7Days }
    };
  }

  private logWarning(metric: string, current: number, baseline: number) {
    const change = ((current - baseline) / baseline * 100).toFixed(1);
    console.warn(`%c[HEALTH WARNING] %c${metric}: ${change}%`, "color: #E53935; font-weight: bold;", "color: inherit;");
  }

  private getRecommendation(status: string, metrics: string[]): string {
    if (status === 'healthy') return "System performance is stable. Optimization active.";
    if (status === 'critical') return "Multiple performance drops detected. Reverting to baseline and pausing optimization.";
    return `Minor degradation in ${metrics[0]}. Monitoring for persistence.`;
  }

  private handleCriticalDegradation(health: HealthReport) {
    console.error('%c[CRITICAL HEALTH FAILURE] %cSafe fallback triggered.', "color: #E53935; font-weight: bold; font-size: 14px;", "color: inherit;");
    // revert weights and pause (handled via flag in local storage or singleton)
    localStorage.setItem('checkout_opt_paused', 'true');
    // OptimizationEngine should check this flag
  }

  public async getHealthReport() {
    return await this.runCheck();
  }
}

export const healthMonitor = HealthMonitor.getInstance();
