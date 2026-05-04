"use client";

import React from "react";
import { Loader2 } from "lucide-react";

/**
 *  PREMIUM LOADING SCREEN
 * 
 * Provides a high-fidelity wait experience during auth initialization
 * and routing resolution. Features smooth micro-animations and
 * editorial-grade aesthetics.
 */
export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6" style={{ opacity: 1 }}>
        <div className="relative">
          <div
            className="text-[#E53935]"
          >
            <Loader2 size={40} strokeWidth={1.5} className="animate-spin" />
          </div>
          
          <div
            className="absolute inset-0 bg-[#E53935] blur-2xl rounded-full"
            style={{ opacity: 0.1 }}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold tracking-tighter text-gray-900">
            Checkout<span className="text-[#E53935]">.</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">
            Initializing Secure Session
          </p>
        </div>
        </div>

      {/* SUBTLE BACKGROUND ACCENT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-50/30 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
