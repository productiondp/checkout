import React from 'react';
import { AuthMetrics } from '@/lib/auth-monitor';

export function CacheStats({ metrics }: { metrics: AuthMetrics | null }) {
  if (!metrics) return null;

  const total = metrics.cacheHits + metrics.cacheMisses;
  const rate = total > 0 ? (metrics.cacheHits / total) * 100 : 0;

  return (
    <div className="flex items-center gap-6 h-full">
      <div className="flex flex-col">
        <span className="text-[18px] font-black text-white font-mono">{rate.toFixed(1)}%</span>
        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Hit Rate</span>
      </div>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-emerald-500 transition-all duration-1000" 
          style={{ width: `${rate}%` }} 
        />
      </div>
      <div className="flex flex-col text-right">
        <span className="text-[10px] font-bold text-white/40">{metrics.cacheHits} Hits</span>
        <span className="text-[10px] font-bold text-white/20">{metrics.cacheMisses} Misses</span>
      </div>
    </div>
  );
}
