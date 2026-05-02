import React from 'react';
import { AuthState } from '@/lib/auth-fsm';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function AuthStateGraph({ state, transitions }: { state: AuthState, transitions: number }) {
  const nodes = [
    { id: 'initializing', label: 'INIT' },
    { id: 'unauthenticated', label: 'GUEST' },
    { id: 'onboarding', label: 'ONBD' },
    { id: 'authenticated', label: 'AUTH' }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-1">
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all",
              state.tag === node.id 
                ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                : "bg-white/5 text-white/40 border-white/5"
            )}>
              {node.label}
            </div>
            {i < nodes.length - 1 && <ArrowRight size={10} className="text-white/10" />}
          </React.Fragment>
        ))}
      </div>
      <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest text-center mt-2">
        {transitions} total transitions
      </div>
    </div>
  );
}
