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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !deal) return null;

  const handleOpenChats = () => {
    onClose();
    router.push("/chat");
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#292828]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] bg-white rounded-[2.275rem] shadow-4xl overflow-hidden animate-in zoom-in-95 duration-500">
         
         {/* HEADER */}
         <div className="p-8 border-b border-[#292828]/5 flex items-center justify-between bg-white relative">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-red-50 text-[#E53935] rounded-2xl flex items-center justify-center shadow-sm">
                  <Zap size={22} className="animate-pulse-slow" />
               </div>
               <div>
                  <h3 className="text-[14px] font-black text-[#292828] uppercase  leading-none mb-1">Secure Move</h3>
                  <div className="flex items-center gap-1.5">
                     <Lock size={10} className="text-[#292828]/40" />
                     <p className="text-[9px] font-black text-[#292828] uppercase ">P2P Encryption Active</p>
                  </div>
               </div>
            </div>
            <button onClick={onClose} className="h-10 w-10 bg-[#292828]/5 text-[#292828] rounded-xl flex items-center justify-center hover:bg-[#292828]/10 hover:text-[#292828] transition-all">
               <X size={20} />
            </button>
         </div>

         {/* BODY */}
         <div className="p-10">
            {success ? (
              <div className="py-10 flex flex-col items-center text-center animate-in fade-in scale-in-95 duration-500">
                 <div className="h-20 w-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/20">
                    <Check size={40} strokeWidth={3} />
                 </div>
                 <h2 className="text-3xl font-black text-[#292828] mb-2 uppercase leading-none">Connect Success</h2>
                 <p className="text-[15px] text-[#292828] font-medium max-w-sm mb-10 leading-relaxed">
                    You are now connected with <strong>{deal.author || deal.name}</strong>. Check your Messages to start.
                 </p>
                 <button onClick={handleOpenChats} className="w-full h-16 bg-[#292828] text-white rounded-[0.975rem] font-black text-[12px] uppercase shadow-2xl hover:bg-[#E53935] transition-all">Open Chats</button>
              </div>
            ) : (
              <div className="space-y-10">
                 <div className="relative">
                    <div className="p-8 bg-[#292828]/5 rounded-[1.625rem] border border-[#292828]/10 relative z-10">
                       <div className="flex items-center gap-5 mb-8">
                          <div className="h-16 w-16 rounded-2xl border-4 border-white shadow-xl overflow-hidden ring-2 ring-slate-50">
                             <img src={deal.avatar} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                             <h4 className="text-xl font-black text-[#292828] uppercase leading-none mb-1">{deal.author || deal.name}</h4>
                             <p className="text-[10px] font-black text-[#E53935] uppercase ">{deal.type || "Verified Node Partner"}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="flex justify-between items-center px-2">
                             <span className="text-[12px] font-black text-[#292828]/40 uppercase ">Match Score</span>
                             <span className="text-[18px] font-black text-[#292828]">{deal.matchScore || 100}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                             <div className="h-full bg-[#E53935] rounded-full" style={{ width: `${deal.matchScore || 100}%` }} />
                          </div>
                          <div className="flex items-center gap-2 px-2 pt-2">
                             <ShieldCheck size={14} className="text-blue-500" />
                             <span className="text-[11px] font-bold text-[#292828] uppercase">Vetted Hub Identity</span>
                          </div>
                       </div>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-tr from-[#E53935]/20 to-transparent blur-2xl opacity-50" />
                 </div>

                 <div className="flex gap-4">
                    <button 
                      onClick={handleConfirm}
                      disabled={loading}
                      className={cn(
                        "flex-1 h-18 py-5 bg-[#E53935] text-white rounded-[0.975rem] font-black text-[12px] uppercase shadow-4xl shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-3",
                        loading && "bg-[#292828] opacity-90"
                      )}
                    >
                       {loading ? (
                         <>
                            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Sending...
                         </>
                       ) : (
                         <>Connect Now <ArrowRight size={18} /></>
                       )}
                    </button>
                 </div>
              </div>
            )}
         </div>

         {/* FOOTER */}
         <div className="px-10 py-6 bg-[#292828]/5/50 border-t border-[#292828]/5 text-center">
            <p className="text-[10px] font-black text-[#292828]/40 uppercase ">Business Network Security Standards</p>
         </div>
      </div>
    </div>
  );
}
