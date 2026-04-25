"use client";

import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const MESSAGES = [
  "Loading your workspace...",
  "Syncing connections...",
  "Fetching your opportunities...",
  "Almost there...",
];

export default function FullScreenLoader() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, 1200);

    const progTimer = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 18, 92));
    }, 400);

    return () => {
      clearInterval(msgTimer);
      clearInterval(progTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#FDFDFF] z-[99999] flex flex-col items-center justify-center">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #29282808 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-xs px-8">
        {/* Logo mark */}
        <div className="relative">
          <div className="h-16 w-16 bg-[#292828] rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-black/10">
            <Zap size={28} className="text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-[#E53935] rounded-lg border-2 border-[#FDFDFF]" />
        </div>

        {/* Brand name */}
        <div className="text-center space-y-1">
          <p className="text-[#292828] text-lg font-black uppercase tracking-[0.2em]">Checkout</p>
          <p className="text-slate-400 text-[13px] font-medium transition-all duration-500 min-h-[20px]">
            {MESSAGES[msgIdx]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E53935] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-slate-300 font-medium">Secure handshake</p>
            <p className="text-[11px] text-slate-300 font-medium">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
