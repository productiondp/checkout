import { useState, useEffect } from 'react';
import { AuthMetrics } from '@/lib/auth-monitor';

export function useLiveMetrics() {
  const [metrics, setMetrics] = useState<AuthMetrics | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const monitor = (window as any).__AUTH_MONITOR__;
      if (monitor) {
        setMetrics({ ...monitor.metrics });
        setHistory(monitor.getHistory());
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return { metrics, history };
}
