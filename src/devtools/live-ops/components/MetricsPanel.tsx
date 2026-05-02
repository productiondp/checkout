import React from 'react';
import { AuthMetrics } from '@/lib/auth-monitor';
import { cn } from '@/lib/utils';

export function MetricsPanel({ metrics }: { metrics: AuthMetrics | null }) {
  if (!metrics) return null;

  const items = [
    { label: 'Avg Latency', value: `${metrics.avgLatency.toFixed(1)}ms`, color: metrics.avgLatency > 50 ? 'text-orange-400' : 'text-emerald-400' },
    { label: 'Mutex Queue', value: metrics.mutexQueueLength, color: metrics.mutexQueueLength > 1 ? 'text-red-400' : 'text-emerald-400' },
    { label: 'Anomalies', value: metrics.anomalies, color: metrics.anomalies > 0 ? 'text-red-400' : 'text-white/60' },
    { label: 'Mismatches', value: metrics.routeMismatches, color: metrics.routeMismatches > 0 ? 'text-orange-400' : 'text-white/60' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(item => (
        <div key={item.label} className="flex flex-col gap-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{item.label}</span>
          <span className={cn("text-lg font-black font-mono", item.color)}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
