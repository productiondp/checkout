import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function EventStream({ history }: { history: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 font-mono scrollbar-hide">
      {history.length === 0 && (
        <div className="text-[10px] text-white/10 uppercase font-black text-center py-8">Waiting for events...</div>
      )}
      {history.map((item, i) => (
        <div key={i} className="flex items-start gap-3 text-[10px] animate-in fade-in slide-in-from-left-2">
          <span className="text-white/20 shrink-0">[{new Date(item.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
          <span className="text-emerald-500 font-black shrink-0">{item.type}</span>
          <span className="text-white/40 truncate italic">from {item.from}</span>
        </div>
      ))}
    </div>
  );
}
