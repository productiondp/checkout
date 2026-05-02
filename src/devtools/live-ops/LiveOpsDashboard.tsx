"use client";

import React, { useState } from 'react';
import { useLiveMetrics } from './useLiveMetrics';
import { AuthStateGraph } from './components/AuthStateGraph';
import { MetricsPanel } from './components/MetricsPanel';
import { EventStream } from './components/EventStream';
import { CacheStats } from './components/CacheStats';
import { useAuth } from '@/hooks/useAuth';
import { X, Activity, Maximize2, Minimize2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveOpsDashboard() {
  const { metrics, history } = useLiveMetrics();
  const { state } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (process.env.NODE_ENV !== 'development' && typeof window !== 'undefined' && !localStorage.getItem('debug')) {
    return null;
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl z-[9999] hover:scale-110 transition-transform active:scale-95"
      >
        <Activity size={20} />
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 bg-[#0A0A0B] border border-white/10 rounded-xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] z-[9999] overflow-hidden flex flex-col transition-all duration-300",
      isMinimized ? "w-80 h-14" : "w-[600px] h-[500px]"
    )}>
      {/* Header */}
      <div className="h-14 px-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-white/90">Live Ops Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-white/40 hover:text-white transition-colors">
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4">
          <div className="grid grid-cols-2 gap-4 h-48">
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
               <h3 className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">
                 <Activity size={10} /> Auth State Engine
               </h3>
               <AuthStateGraph state={state} transitions={metrics?.transitions || 0} />
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
               <h3 className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-4">System Health</h3>
               <MetricsPanel metrics={metrics} />
            </div>
          </div>

          <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden flex flex-col">
             <h3 className="text-[10px] font-black uppercase tracking-wider text-white/40 p-4 border-b border-white/5 flex items-center gap-2">
               <Terminal size={10} /> Live Event Stream
             </h3>
             <EventStream history={history} />
          </div>

          <div className="grid grid-cols-2 gap-4 h-24 shrink-0">
             <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-2">Cache Performance</h3>
                <CacheStats metrics={metrics} />
             </div>
             <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 flex flex-col justify-center">
                <div className={cn(
                  "px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-center",
                  (metrics?.invariantViolations || 0) > 0 ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                )}>
                  {(metrics?.invariantViolations || 0) > 0 ? `${metrics?.invariantViolations} Violations Detected` : "System Healthy"}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
