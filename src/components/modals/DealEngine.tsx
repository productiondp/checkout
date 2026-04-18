"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Zap, ShieldCheck, Check, MessageSquare, ArrowRight, Shield, BadgeCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealEngineProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
}

export default function DealEngine({ isOpen, onClose, deal }: DealEngineProps) {
  const router = useRouter();
  const [step, setStep] = useState<"OVERVIEW" | "PROPOSAL" | "TRANSMITTING" | "SUCCESS">("OVERVIEW");
  const [proposal, setProposal] = useState("");

  if (!isOpen || !deal) return null;

  const handleOpenChats = () => {
    onClose();
    router.push("/chat");
  };

  const handleSubmitProposal = () => {
    setStep("TRANSMITTING");
    setTimeout(() => {
      setStep("SUCCESS");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[540px] bg-white rounded-[2.6rem] shadow-4xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
         
         {/* HEADER */}
         <div className="px-10 py-8 border-b border-[#292828]/5 flex items-center justify-between bg-white relative z-10 shrink-0">
            <div className="flex items-center gap-5">
               <div className="h-14 w-14 bg-red-50 text-[#E53935] rounded-2xl flex items-center justify-center shadow-inner">
                  <Zap size={26} className="animate-pulse-slow" />
               </div>
               <div>
                  <h3 className="text-[11px] font-black text-[#E53935] uppercase tracking-widest mb-1.5">Project Terminal</h3>
                  <div className="flex items-center gap-2">
                     <Lock size={12} className="text-[#292828]/40" />
                     <h2 className="text-xl font-black text-[#292828] uppercase leading-none">Security Node Active</h2>
                  </div>
               </div>
            </div>
            <button onClick={onClose} className="h-12 w-12 bg-[#292828]/5 text-[#292828] rounded-2xl flex items-center justify-center hover:bg-[#292828] hover:text-white transition-all shadow-sm">
               <X size={24} />
            </button>
         </div>

         {/* BODY */}
         <div className="flex-1 overflow-y-auto no-scrollbar">
            {step === "OVERVIEW" && (
               <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-[#292828] text-white text-[9px] font-black uppercase rounded-lg">Opportunity Entry</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">REF: {deal.id || 'N/A'}88</span>
                     </div>
                     <h1 className="text-3xl font-black text-[#292828] uppercase leading-none">{deal.title || "Business Opportunity"}</h1>
                     <p className="text-base text-[#292828]/70 leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        "{deal.content}"
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 rounded-3xl bg-[#292828] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 blur-2xl" />
                        <p className="text-[10px] font-black text-white/40 uppercase mb-4">Target Budget</p>
                        <p className="text-2xl font-black text-[#E53935] mb-2">{deal.budget || 'TBD'}</p>
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={14} className="text-green-500" />
                           <span className="text-[8px] font-bold uppercase text-white/40">Verified Value</span>
                        </div>
                     </div>
                     <div className="p-6 rounded-3xl border-2 border-[#292828]/5 hover:border-[#292828]/10 transition-all flex flex-col justify-between">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Match Analysis</p>
                           <p className="text-2xl font-black text-[#292828]">{deal.matchScore || 100}%</p>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-[#292828] rounded-full" style={{ width: `${deal.matchScore || 100}%` }} />
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-lg shrink-0">
                        <img src={deal.avatar} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Author / Founder</p>
                        <h4 className="text-[15px] font-black text-[#292828] uppercase leading-none">{deal.author}</h4>
                     </div>
                     <BadgeCheck size={20} className="text-blue-500" />
                  </div>

                  <button 
                    onClick={() => setStep("PROPOSAL")}
                    className="w-full h-20 bg-[#292828] text-white rounded-[1.3rem] font-black text-sm uppercase shadow-2xl hover:bg-[#E53935] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4"
                  >
                     Initiate Proposal Engine <ArrowRight size={20} />
                  </button>
               </div>
            )}

            {step === "PROPOSAL" && (
               <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
                  <div className="space-y-4">
                     <h3 className="text-2xl font-black text-[#292828] uppercase leading-none">Submit Offer</h3>
                     <p className="text-[13px] text-slate-400 font-medium">Outline your strategic contribution or proposal for this business opportunity.</p>
                  </div>

                  <textarea 
                    autoFocus
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Describe your capabilities or message to the author..."
                    className="w-full h-64 bg-slate-50 p-8 rounded-[1.95rem] border-2 border-transparent focus:border-[#292828]/10 text-base font-bold text-[#292828] outline-none resize-none transition-all placeholder:text-slate-200"
                  />

                  <div className="flex items-center gap-3 p-5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900">
                     <Shield size={18} className="shrink-0" />
                     <p className="text-[10px] font-bold uppercase">Transmission will be secured via P2P encryption protocol</p>
                  </div>

                  <div className="flex gap-4">
                     <button 
                       onClick={() => setStep("OVERVIEW")}
                       className="h-16 px-8 rounded-2xl border-2 border-slate-100 text-[#292828] font-black text-[11px] uppercase hover:bg-slate-50 transition-all"
                     >
                        Back
                     </button>
                     <button 
                       onClick={handleSubmitProposal}
                       disabled={!proposal.trim()}
                       className="flex-1 h-16 bg-[#E53935] text-white rounded-2xl font-black text-[12px] uppercase shadow-2xl hover:bg-[#292828] transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                     >
                        Secure Transmission <Zap size={18} fill="white" />
                     </button>
                  </div>
               </div>
            )}

            {step === "TRANSMITTING" && (
               <div className="p-20 flex flex-col items-center justify-center text-center space-y-10 animate-pulse">
                  <div className="relative">
                     <div className="h-32 w-32 border-4 border-slate-100 border-t-[#E53935] rounded-full animate-spin" />
                     <Zap size={40} className="absolute inset-0 m-auto text-[#E53935]" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-[#292828] uppercase">Transmitting Offer</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Establishing secure node connection...</p>
                  </div>
               </div>
            )}

            {step === "SUCCESS" && (
               <div className="p-10 py-20 flex flex-col items-center text-center animate-in zoom-in-95 duration-700">
                  <div className="h-24 w-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(34,197,94,0.3)]">
                     <Check size={48} strokeWidth={4} />
                  </div>
                  <div className="space-y-4 mb-12">
                     <h2 className="text-4xl font-black text-[#292828] uppercase leading-none">Transmission Complete</h2>
                     <p className="text-base text-slate-500 font-medium max-w-sm mx-auto">
                        Your proposal has been securely delivered to <strong>{deal.author}</strong>. They will be notified immediately.
                     </p>
                  </div>
                  <button 
                    onClick={handleOpenChats} 
                    className="w-full h-20 bg-[#292828] text-white rounded-[1.3rem] font-black text-base uppercase shadow-2xl hover:bg-[#E53935] hover:scale-105 transition-all active:scale-95"
                  >
                     Open Communication Node
                  </button>
               </div>
            )}
         </div>

         {/* FOOTER */}
         <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 text-center shrink-0">
            <div className="flex items-center justify-center gap-6 opacity-30">
               <span className="text-[9px] font-black uppercase tracking-tighter text-[#292828]">Auth V.5</span>
               <div className="h-1 w-1 bg-[#292828] rounded-full" />
               <span className="text-[9px] font-black uppercase tracking-tighter text-[#292828]">Neural Precision</span>
               <div className="h-1 w-1 bg-[#292828] rounded-full" />
               <span className="text-[9px] font-black uppercase tracking-tighter text-[#292828]">P2P standard</span>
            </div>
         </div>
      </div>
    </div>
  );
}
