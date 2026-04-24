"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0A] z-[99999] selection:bg-[#E53935]/20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#E53935]/5" />
      
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center animate-in zoom-in duration-700">
            <Loader2 className="animate-spin text-[#E53935]" size={32} strokeWidth={3} />
          </div>
          <div className="absolute -inset-4 bg-[#E53935]/10 rounded-[2.5rem] blur-2xl animate-pulse -z-10" />
        </div>

        <div className="space-y-3 text-center">
          <div className="text-[10px] font-black text-white uppercase tracking-[0.7em] animate-in slide-in-from-bottom-2 duration-1000">
            Identifying...
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-[#E53935] animate-ping" />
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] italic">
              Loading profile...
            </p>
          </div>
        </div>
      </div>

      {/* SECURE LAYER DECORATION */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-20">
        <div className="h-[1px] w-8 bg-white/30" />
        <span className="text-[8px] font-black text-white uppercase tracking-widest">Secure Login</span>
        <div className="h-[1px] w-8 bg-white/30" />
      </div>
    </div>
  );
}
