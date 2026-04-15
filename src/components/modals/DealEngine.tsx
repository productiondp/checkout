"use client";

import React, { useState } from "react";
import { X, Zap, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealEngineProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
}

export default function DealEngine({ isOpen, onClose, deal }: DealEngineProps) {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !deal) return null;

  const handleConfirm = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setStep(1);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[600px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                 <Zap size={24} />
              </div>
              <div>
                 <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Neural_Sync_Engine</h3>
                 <p className="text-[11px] font-bold text-[#5F6368]">Protocol Alpha_v4.2</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900">
              <X size={20} />
           </button>
        </div>

        {/* Modal Content */}
        <div className="p-10">
           {success ? (
             <div className="py-10 flex flex-col items-center justify-center text-center animate-in fade-in scale-in-95 duration-500">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                   <Check size={40} strokeWidth={3} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Sync_Established</h4>
                <p className="text-[14px] text-[#5F6368] font-medium max-w-xs">
                   The handshake was successful. A direct encrypted channel has been opened with <strong>{deal.name}</strong>.
                </p>
             </div>
           ) : (
             <div className="space-y-8">
                {/* Entity Info */}
                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <div className="w-20 h-20 rounded-[1.5rem] bg-white border-2 border-white shadow-sm overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${deal.seed}`} alt="Sync Entity" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-slate-900 mb-1">{deal.name}</h4>
                      <p className="text-[12px] font-bold text-primary uppercase tracking-widest mb-2">{deal.role}</p>
                      <div className="flex items-center gap-2">
                         <ShieldCheck size={14} className="text-primary" />
                         <span className="text-[11px] font-bold text-[#5F6368] uppercase">Identity_Verified_Node</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment_Summary</h5>
                   <div className="p-6 bg-white border border-slate-100 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center text-[13px]">
                         <span className="font-bold text-[#5F6368]">Match Probability</span>
                         <span className="font-black text-primary italic">{deal.match}%</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                         <span className="font-bold text-[#5F6368]">Project Segment</span>
                         <span className="font-black text-slate-900 uppercase">Strategic Expansion</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                         <span className="font-bold text-[#5F6368]">Response Expected</span>
                         <span className="font-black text-slate-900 uppercase">Within 2h</span>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleConfirm}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-black transition-all"
                >
                   Execute_Handshake <ArrowRight size={18} strokeWidth={3} />
                </button>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50">
           <p className="text-[10px] text-center font-bold text-[#8E9196] uppercase tracking-[0.3em]">Neural_Sync_Alpha_Terminal</p>
        </div>
      </div>
    </div>
  );
}
