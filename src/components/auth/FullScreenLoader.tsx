"use client";

import React from "react";
import { AlertCircle, WifiOff, Loader2, ArrowRight, RefreshCcw } from "lucide-react";

const MESSAGES = [
  "Loading your workspace...",
  "Syncing connections...",
  "Fetching your opportunities...",
  "Almost there...",
];

interface FullScreenLoaderProps {
  status?: 'loading' | 'timeout' | 'offline' | 'logout' | 'setup';
  onRetry?: () => void;
  onHome?: () => void;
}

export default function FullScreenLoader({ status = 'loading', onRetry, onHome }: FullScreenLoaderProps) {
  const [msgIdx, setMsgIdx] = React.useState(0);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (status !== 'loading') return;
    
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
  }, [status]);

  const progress = Math.min(tick * 8, 90);

  return (
    <div className="fixed inset-0 bg-[#FDFDFF] z-[99999] flex flex-col items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #292828 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[320px] px-8 text-center">
        {/* State Icon */}
        <div className="relative">
          <div className={`h-20 w-20 rounded-lg flex items-center justify-center shadow-2xl transition-all duration-500 ${
            status === 'timeout' || status === 'offline' ? "bg-red-50" : "bg-[#292828]"
          }`}>
            {status === 'loading' && (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L4.09 12.96a.5.5 0 00.41.79H11L11 22l8.91-10.96A.5.5 0 0019.5 10.25H13V2z" fill="#E53935" />
              </svg>
            )}
            {status === 'timeout' && <AlertCircle className="text-[#E53935]" size={32} />}
            {status === 'offline' && <WifiOff className="text-[#E53935]" size={32} />}
            {status === 'logout' && <Loader2 className="text-[#E53935] animate-spin" size={32} />}
            {status === 'setup' && <Loader2 className="text-[#E53935] animate-spin" size={32} />}
          </div>
          {status === 'loading' && <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-[#E53935] rounded-lg border-2 border-[#FDFDFF]" />}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-[#292828] text-base font-black uppercase ">
              {status === 'logout' ? "Logging Out" : "Checkout"}
            </h2>
            <p className="text-slate-400 text-[13px] font-bold uppercase  min-h-[20px]">
              {status === 'loading' && MESSAGES[msgIdx]}
              {status === 'timeout' && "Something is taking longer than expected"}
              {status === 'offline' && "No internet connection detected"}
              {status === 'logout' && "Terminating session..."}
              {status === 'setup' && "Finalizing your workspace profile..."}
            </p>
          </div>

          {(status === 'timeout' || status === 'offline') && (
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={onRetry}
                className="w-full py-4 bg-[#292828] text-white rounded-lg text-[10px] font-black uppercase  flex items-center justify-center gap-3 hover:bg-black transition-all"
              >
                <RefreshCcw size={14} /> Retry Connection
              </button>
              <button 
                onClick={onHome}
                className="w-full py-4 bg-white border border-slate-100 text-[#292828] rounded-lg text-[10px] font-black uppercase  flex items-center justify-center gap-3 hover:border-slate-200 transition-all"
              >
                Go to Home <ArrowRight size={14} />
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="w-full space-y-2 pt-4">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E53935] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between opacity-40">
                <p className="text-[9px] text-slate-500 font-black uppercase ">Secure handshake</p>
                <p className="text-[9px] text-slate-500 font-black ">{progress}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
