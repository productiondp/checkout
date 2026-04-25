"use client";

import React from "react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0A] z-[99999] selection:bg-[#E53935]/20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#E53935]/5" />
      
      <div className="relative flex flex-col items-center">
        {/* LOGO */}
        <div className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">
          CHECKOUT
        </div>

        {/* TEXT */}
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-black text-[#E53935] uppercase tracking-[0.5em] animate-pulse">
            Neural Handshake Active
          </p>
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] italic">
            Setting things up...
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-64 h-[2px] bg-white/5 mt-8 overflow-hidden rounded-full border border-white/5">
          <div className="h-full bg-gradient-to-r from-[#E53935] to-[#ff5252] animate-progress shadow-[0_0_15px_#E53935]" />
        </div>
      </div>

      {/* SECURE LAYER DECORATION */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-white/20" />
          <span className="text-[9px] font-black text-white uppercase tracking-[0.5em]">Secure Initialization</span>
          <div className="h-[1px] w-8 bg-white/20" />
        </div>
        <p className="text-[7px] font-bold text-white/20 uppercase tracking-widest">v 2.0.4 • Platform Stable</p>
      </div>
    </div>
  );
}
