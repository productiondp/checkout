"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Calendar, 
  Clock,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Award,
  ChevronRight,
  Sparkles,
  Target,
  X,
  Lock,
  CheckCircle2,
  MessageSquare,
  Info
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_ADVISORS } from "@/data/advisors";

export default function AdvisorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"Idle" | "Sending" | "Sent">("Idle");
  const [requestData, setRequestData] = useState({ topic: "", description: "" });

  const advisorId = params.id as string;
  const advisor = MOCK_ADVISORS.find(a => a.id === advisorId) || MOCK_ADVISORS[0];

  const handleSendRequest = () => {
    setRequestStatus("Sending");
    setTimeout(() => {
      setRequestStatus("Sent");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-100 pt-10 pb-20 px-6 lg:px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E53935]/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => router.push('/advisors')}
            className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-12 hover:text-[#E53935] transition-all"
          >
            <ArrowLeft size={16} /> Back to Directory
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-10 lg:gap-20">
            <div className="h-48 w-48 sm:h-64 sm:w-64 rounded-[3rem] sm:rounded-[4rem] overflow-hidden border-[6px] sm:border-[8px] border-slate-50 shadow-4xl shrink-0 rotate-3 transition-transform hover:rotate-0 duration-700">
               <img src={advisor.avatar} className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0" alt="" />
            </div>

            <div className="flex-1">
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="px-5 py-2 bg-[#E53935] text-white text-[10px] font-black uppercase rounded-xl shadow-2xl tracking-[0.2em] flex items-center gap-2">
                     <ShieldCheck size={14} /> Verified Advisor
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-[#292828] uppercase">
                     <Sparkles size={14} className="text-[#E53935]" /> {advisor.matchScore}% Match
                  </div>
               </div>
               <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#292828] uppercase tracking-tighter leading-[0.85] mb-8">{advisor.name}</h1>
               <p className="text-lg sm:text-xl font-bold text-slate-400 uppercase tracking-widest">{advisor.role} @ {advisor.industry}</p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsRequestModalOpen(true)}
                className="h-20 px-12 bg-[#292828] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-4xl hover:bg-[#E53935] transition-all active:scale-95"
              >
                 Request Advice
              </button>
              <div className="flex items-center justify-center gap-3 text-slate-300">
                 <Clock size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{advisor.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-8 flex items-center gap-3">
                 <BrainCircuit size={18} /> Professional Intel
              </h3>
              <p className="text-2xl lg:text-3xl font-bold text-[#292828] leading-relaxed italic">
                 "{advisor.bio}"
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
               <div>
                  <h4 className="text-[11px] font-black uppercase text-[#292828]/40 tracking-widest mb-8">Expertise Domains</h4>
                  <div className="flex flex-wrap gap-3">
                     {advisor.expertise.map(tag => (
                       <span key={tag} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase text-[#292828] shadow-sm">{tag}</span>
                     ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-[11px] font-black uppercase text-[#292828]/40 tracking-widest mb-8">Experience Highlights</h4>
                  <div className="space-y-4">
                     {advisor.highlights.map((h, i) => (
                       <div key={i} className="flex items-center gap-4 text-[#292828] font-bold text-sm">
                          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {h}
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            <section className="bg-[#292828] rounded-[3.5rem] p-12 lg:p-16 text-white relative overflow-hidden group">
               <Zap size={200} className="absolute -right-20 -bottom-20 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[5s]" />
               <div className="relative z-10">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E53935] mb-10">Advisory Focus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     {advisor.focus.map((f, i) => (
                       <div key={i} className="flex items-start gap-5">
                          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                             <Award size={20} className="text-[#E53935]" />
                          </div>
                          <div>
                             <p className="text-lg font-black uppercase tracking-tight leading-tight mb-2">{f}</p>
                             <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Structural Mandate</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-10">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-[11px] font-black uppercase text-[#292828] tracking-widest mb-8 flex items-center gap-2">
                   <TrendingUp size={16} className="text-[#E53935]" /> Tactical Scoring
                </h3>
                <div className="space-y-8">
                   <div className="flex items-end justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Industry Relevance</p>
                      <p className="text-2xl font-black text-[#292828]">98%</p>
                   </div>
                   <div className="flex items-end justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Intent Match</p>
                      <p className="text-2xl font-black text-[#292828]">94%</p>
                   </div>
                   <div className="flex items-end justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Execution Velocity</p>
                      <p className="text-2xl font-black text-emerald-500">100%</p>
                   </div>
                </div>
                <div className="mt-12 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <div className="flex items-center gap-3 mb-3">
                      <Info size={14} className="text-[#292828]/20" />
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Match Protocol</p>
                   </div>
                   <p className="text-[11px] font-bold text-[#292828]/40 uppercase leading-relaxed">This advisor is a high-authority match for your current operational scaling mandates.</p>
                </div>
             </div>

             <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                <h3 className="text-[11px] font-black uppercase text-[#292828] tracking-widest mb-8 flex items-center gap-2">
                   <MessageSquare size={16} className="text-[#E53935]" /> Advisory Protocol
                </h3>
                <ul className="space-y-4">
                   <li className="text-xs font-bold text-slate-400 uppercase leading-relaxed flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#E53935] mt-1 shrink-0" />
                      Connections required before messaging.
                   </li>
                   <li className="text-xs font-bold text-slate-400 uppercase leading-relaxed flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#E53935] mt-1 shrink-0" />
                      Requests are outcome-driven only.
                   </li>
                   <li className="text-xs font-bold text-slate-400 uppercase leading-relaxed flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#E53935] mt-1 shrink-0" />
                      Zero noise tolerance policy.
                   </li>
                </ul>
             </div>
          </aside>
        </div>
      </div>

      {/* REQUEST ADVICE MODAL */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsRequestModalOpen(false)} />
           
           <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 lg:p-16 shadow-premium animate-in zoom-in-95 duration-500">
              <button onClick={() => setIsRequestModalOpen(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 text-slate-300 hover:text-[#292828] transition-all hover:rotate-90"><X size={28} /></button>
              
              <div className="mb-12">
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-4">Tactical Initialization</h2>
                 <h3 className="text-4xl font-black text-[#292828] uppercase tracking-tighter leading-none">Request <br /> <span className="text-slate-300">Guidance</span></h3>
              </div>

              {requestStatus === "Sent" ? (
                <div className="py-20 text-center animate-in zoom-in-95 duration-700">
                   <div className="h-24 w-24 bg-emerald-50 rounded-[2.5rem] mx-auto flex items-center justify-center text-emerald-500 mb-8 shadow-inner shadow-emerald-500/20">
                      <CheckCircle2 size={48} strokeWidth={3} />
                   </div>
                   <h4 className="text-2xl font-black text-[#292828] uppercase tracking-tight mb-3">Request Synchronized</h4>
                   <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest leading-relaxed px-12">
                      Your mandate has been broadcasted to {advisor.name}. You will be notified once the protocol is accepted.
                   </p>
                   <button 
                     onClick={() => setIsRequestModalOpen(false)}
                     className="mt-12 h-14 px-12 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                   >
                      Back to Profile
                   </button>
                </div>
              ) : (
                <div className="space-y-10">
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 block px-4">Subject Topic</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Scaling regional logistics nodes" 
                        value={requestData.topic}
                        onChange={e => setRequestData({...requestData, topic: e.target.value})}
                        className="w-full h-16 bg-slate-50 border border-transparent rounded-[1.5rem] px-8 text-sm font-bold text-[#292828] outline-none focus:bg-white focus:border-[#E53935] transition-all shadow-inner"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 block px-4">Mandate Description</label>
                      <textarea 
                        rows={4}
                        placeholder="Describe the structural challenges and expected outcomes..." 
                        value={requestData.description}
                        onChange={e => setRequestData({...requestData, description: e.target.value})}
                        className="w-full p-8 bg-slate-50 border border-transparent rounded-[2rem] text-sm font-bold text-[#292828] outline-none focus:bg-white focus:border-[#E53935] transition-all shadow-inner"
                      />
                   </div>

                   <button 
                     onClick={handleSendRequest}
                     disabled={requestStatus === "Sending"}
                     className="w-full h-20 bg-[#292828] text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-[#E53935] transition-all disabled:opacity-50 relative overflow-hidden group"
                   >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2s]" />
                      <span className="relative z-10">{requestStatus === "Sending" ? "Broadcasting Mandate..." : "Initialize Request"}</span>
                   </button>
                   
                   <div className="flex items-center justify-center gap-2 text-slate-300">
                      <Lock size={12} />
                      <p className="text-[9px] font-black uppercase tracking-widest">Secured by Advisory Ledger v7.0</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
