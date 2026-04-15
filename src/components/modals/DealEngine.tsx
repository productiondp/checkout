"use client";

import React, { useState } from "react";
import { X, Zap, ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealEngineProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
}

export default function DealEngine({ isOpen, onClose, deal }: DealEngineProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !deal) return null;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                 <Zap size={20} />
              </div>
              <div>
                 <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Connect</h3>
                 <p className="text-[10px] font-bold text-[#5F6368] uppercase">Secure Channel</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <X size={20} className="text-slate-400" />
           </button>
        </div>

        {/* Content */}
        <div className="p-10">
           {success ? (
             <div className="py-6 flex flex-col items-center text-center animate-in fade-in scale-in-95 duration-500">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                   <Check size={32} strokeWidth={3} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3 uppercase">Success!</h4>
                <p className="text-[14px] text-[#5F6368] font-medium max-w-xs">
                   You are now connected with <strong>{deal.name}</strong>.
                </p>
                <button onClick={onClose} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[12px] uppercase tracking-widest">Done</button>
             </div>
           ) : (
             <div className="space-y-8">
                <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm overflow-hidden border-2 border-white">
                       <img src={deal.avatar || `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop`} alt="User" className="w-full h-full object-cover" />
                    </div>
                   <div>
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">{deal.name}</h4>
                      <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">{deal.role}</p>
                      <div className="flex items-center gap-1.5">
                         <ShieldCheck size={12} className="text-primary" />
                         <span className="text-[10px] font-bold text-[#5F6368] uppercase">Verified Business</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-[12px]">
                         <span className="font-bold text-[#5F6368]">Match Score</span>
                         <span className="font-black text-primary">{deal.match}%</span>
                      </div>
                      <div className="flex justify-between items-center text-[12px]">
                         <span className="font-bold text-[#5F6368]">Estimated Response</span>
                         <span className="font-black text-slate-900">2 Hours</span>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleConfirm}
                  disabled={loading}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-[13px] uppercase tracking-widest shadow-2xl shadow-primary/20 hover:bg-black transition-all flex items-center justify-center gap-3"
                >
                   {loading ? (
                     <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Connecting...
                     </>
                   ) : "Send Request"}
                </button>
             </div>
           )}
        </div>

        <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50 text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-normal">Checkout Professional Network</p>
        </div>
      </div>
    </div>
  );
}
