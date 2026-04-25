"use client";

import React from "react";

const MESSAGES = [
  "Loading your workspace...",
  "Syncing connections...",
  "Fetching your opportunities...",
  "Almost there...",
];

export default function FullScreenLoader() {
  const [msgIdx, setMsgIdx] = React.useState(0);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, 1400);

    const tickTimer = setInterval(() => {
      setTick((t) => t + 1);
    }, 350);

    return () => {
      clearInterval(msgTimer);
      clearInterval(tickTimer);
    };
  }, []);

  // Deterministic progress from tick count — no Math.random() to avoid hydration mismatch
  const progress = Math.min(tick * 8, 90);

  return (
    <div className="fixed inset-0 bg-[#FDFDFF] z-[99999] flex flex-col items-center justify-center">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #292828 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[280px] px-8">
        {/* Logo mark */}
        <div className="relative">
          <div className="h-16 w-16 bg-[#292828] rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-black/10">
            {/* Simple SVG bolt icon — no external import needed */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4.09 12.96a.5.5 0 00.41.79H11L11 22l8.91-10.96A.5.5 0 0019.5 10.25H13V2z"
                fill="#E53935" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#E53935] rounded-lg border-2 border-[#FDFDFF]" />
        </div>

        {/* Brand + status text */}
        <div className="text-center space-y-2">
          <p className="text-[#292828] text-base font-black uppercase tracking-[0.25em]">Checkout</p>
          <p className="text-slate-400 text-[13px] font-medium min-h-[20px] transition-all duration-500">
            {MESSAGES[msgIdx]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E53935] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-300 font-medium">Secure handshake</p>
            <p className="text-[11px] text-slate-300 font-medium">{progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
