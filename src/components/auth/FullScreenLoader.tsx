"use client";

import React from "react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0A] z-[99999] selection:bg-[#E53935]/20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#E53935]/5" />
      
      <div className="relative flex flex-col items-center">
        {/* LOGO */}
        <div className="text-xl font-bold tracking-wide text-white mb-4">
          CHECKOUT
        </div>

        {/* TEXT */}
        <div className="space-y-1 text-center">
          <div className="text-[10px] font-black text-white uppercase tracking-[0.7em]">
            Checkout
          </div>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.4em] italic">
            Setting things up...
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-40 h-[2px] bg-white/10 mt-4 overflow-hidden">
          <div className="h-full bg-[#E53935] animate-progress" />
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
