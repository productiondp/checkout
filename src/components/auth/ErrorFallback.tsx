"use client";

import React from "react";
import { AlertCircle, LogOut, RefreshCcw } from "lucide-react";

interface ErrorFallbackProps {
  onRetry: () => void;
  onLogout: () => void;
  error?: string;
}

export default function ErrorFallback({ onRetry, onLogout, error }: ErrorFallbackProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#292828] z-[99999] px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#292828] via-[#1a1a1a] to-[#E53935]/5" />
      
      <div className="relative w-full max-w-md bg-white rounded-[3rem] p-12 shadow-4xl border border-white/10 text-center space-y-10 animate-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center text-[#E53935]">
            <AlertCircle size={40} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-black text-[#292828] uppercase tracking-tighter italic">Authentication Error</h2>
          <p className="text-[13px] font-bold text-slate-400 uppercase leading-relaxed tracking-wide">
            {error || "The platform was unable to verify your account. This may be due to high network latency or session expiration."}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onRetry}
            className="w-full h-18 bg-[#292828] text-white rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-xl active:scale-95"
          >
            <RefreshCcw size={16} /> Retry
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full h-16 border-2 border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-[#292828] transition-all active:scale-95"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <span className="text-[9px] font-black text-slate-200 uppercase tracking-[0.4em]">System Error Protection</span>
        </div>
      </div>
    </div>
  );
}
