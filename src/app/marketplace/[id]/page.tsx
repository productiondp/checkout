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
  Award,
  ChevronRight,
  Sparkles,
  Target,
  X,
  Lock,
  CheckCircle2,
  MessageSquare,
  Info,
  Users,
  Briefcase
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_LISTINGS } from "@/data/marketplace";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectStatus, setConnectStatus] = useState<"Idle" | "Sending" | "Sent">("Idle");

  const listingId = params.id as string;
  const listing = MOCK_LISTINGS.find(m => m.id === listingId) || MOCK_LISTINGS[0];

  const handleConnect = () => {
    setConnectStatus("Sending");
    setTimeout(() => {
      setConnectStatus("Sent");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-100 pt-10 pb-20 px-6 lg:px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E53935]/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => router.push('/marketplace')}
            className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-12 hover:text-[#E53935] transition-all"
          >
            <ArrowLeft size={16} /> Back to Marketplace
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-12 lg:gap-20">
            <div className="h-48 w-48 sm:h-64 sm:w-64 rounded-[3rem] sm:rounded-[4rem] overflow-hidden border-[6px] sm:border-[8px] border-slate-50 shadow-4xl shrink-0 rotate-3 transition-transform hover:rotate-0 duration-700 bg-slate-50 flex items-center justify-center text-[#E53935]">
               <Briefcase size={80} strokeWidth={1} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                 <div className="px-5 py-2 bg-[#E53935] text-white text-[10px] font-black uppercase rounded-xl shadow-2xl tracking-[0.2em] flex items-center gap-2">
                    <Zap size={14} /> High Impact Listing
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-[#292828] uppercase">
                    <Sparkles size={14} className="text-[#E53935]" /> {listing.matchScore}% Match
                 </div>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#292828] uppercase tracking-tighter leading-[0.9] mb-8">{listing.title}</h1>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                 <div className="flex items-center gap-3">
                    <img src={listing.provider.avatar} className="h-10 w-10 rounded-xl shadow-sm" alt="" />
                    <span className="text-lg font-bold text-[#292828] uppercase tracking-tight">{listing.provider.name}</span>
                 </div>
                 <span className="hidden sm:block h-1 w-1 bg-slate-200 rounded-full" />
                 <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">{listing.category}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsConnectModalOpen(true)}
                className="h-20 px-12 bg-[#292828] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-4xl hover:bg-[#E53935] transition-all active:scale-95"
              >
                 Connect to Discuss
              </button>
              <div className="flex items-center justify-center gap-3 text-slate-300">
                 <MapPin size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{listing.location}</span>
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
                 <Info size={18} /> Description
              </h3>
              <p className="text-2xl lg:text-3xl font-bold text-[#292828] leading-relaxed italic">
                 "{listing.description}"
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
               <div>
                  <h4 className="text-[11px] font-black uppercase text-[#292828]/40 tracking-widest mb-8">Tags</h4>
                  <div className="flex flex-wrap gap-3">
                     {listing.tags.map(tag => (
                       <span key={tag} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase text-[#292828] shadow-sm">{tag}</span>
                     ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-[11px] font-black uppercase text-[#292828]/40 tracking-widest mb-8">Structural Impact</h4>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 text-[#292828] font-bold text-sm">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Intent-based discovery
                     </div>
                     <div className="flex items-center gap-4 text-[#292828] font-bold text-sm">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Regional node optimization
                     </div>
                     <div className="flex items-center gap-4 text-[#292828] font-bold text-sm">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Zero-friction execution
                     </div>
                  </div>
               </div>
            </section>

            <section className="bg-[#292828] rounded-[3.5rem] p-12 lg:p-16 text-white relative overflow-hidden group">
               <Target size={200} className="absolute -right-20 -bottom-20 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[5s]" />
               <div className="relative z-10">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E53935] mb-10">Use Cases</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     {listing.useCases.map((uc, i) => (
                       <div key={i} className="flex items-start gap-5">
                          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                             <TrendingUp size={20} className="text-[#E53935]" />
                          </div>
                          <div>
                             <p className="text-lg font-black uppercase tracking-tight leading-tight mb-2">{uc}</p>
                             <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Business Mandate</p>
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
                   <Target size={16} className="text-[#E53935]" /> Relevance Matrix
                </h3>
                <div className="space-y-8">
                   <div className="flex items-end justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Skill Gap Match</p>
                      <p className="text-2xl font-black text-[#292828]">96%</p>
                   </div>
                   <div className="flex items-end justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Location Proximity</p>
                      <p className="text-2xl font-black text-[#292828]">88%</p>
                   </div>
                   <div className="flex items-end justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Trust Velocity</p>
                      <p className="text-2xl font-black text-emerald-500">100%</p>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                <h3 className="text-[11px] font-black uppercase text-[#292828] tracking-widest mb-8 flex items-center gap-2">
                   <MessageSquare size={16} className="text-[#E53935]" /> Interaction Rule
                </h3>
                <ul className="space-y-4">
                   <li className="text-xs font-bold text-slate-400 uppercase leading-relaxed flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#E53935] mt-1 shrink-0" />
                      No direct purchase available.
                   </li>
                   <li className="text-xs font-bold text-slate-400 uppercase leading-relaxed flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#E53935] mt-1 shrink-0" />
                      Must connect before initialization.
                   </li>
                   <li className="text-xs font-bold text-slate-400 uppercase leading-relaxed flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#E53935] mt-1 shrink-0" />
                      Intent-driven discussions only.
                   </li>
                </ul>
             </div>
          </aside>
        </div>
      </div>

      {/* CONNECT MODAL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsConnectModalOpen(false)} />
           
           <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 lg:p-16 shadow-premium animate-in zoom-in-95 duration-500">
              <button onClick={() => setIsConnectModalOpen(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 text-slate-300 hover:text-[#292828] transition-all hover:rotate-90"><X size={28} /></button>
              
              <div className="mb-12">
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-4">Connection Initialization</h2>
                 <h3 className="text-4xl font-black text-[#292828] uppercase tracking-tighter leading-none">Initialize <br /> <span className="text-slate-300">Mandate</span></h3>
              </div>

              {connectStatus === "Sent" ? (
                <div className="py-20 text-center animate-in zoom-in-95 duration-700">
                   <div className="h-24 w-24 bg-emerald-50 rounded-[2.5rem] mx-auto flex items-center justify-center text-emerald-500 mb-8">
                      <CheckCircle2 size={48} strokeWidth={3} />
                   </div>
                   <h4 className="text-2xl font-black text-[#292828] uppercase tracking-tight mb-3">Connection Initialized</h4>
                   <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest leading-relaxed px-12">
                      Your interest has been broadcasted to {listing.provider.name}. You will be notified once the protocol is accepted.
                   </p>
                   <button 
                     onClick={() => setIsConnectModalOpen(false)}
                     className="mt-12 h-14 px-12 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                   >
                      Back to Listing
                   </button>
                </div>
              ) : (
                <div className="space-y-10">
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 block px-4">Subject Mandate</label>
                      <input 
                        type="text" 
                        placeholder={`Discussing ${listing.title}...`} 
                        className="w-full h-16 bg-slate-50 border border-transparent rounded-[1.5rem] px-8 text-sm font-bold text-[#292828] outline-none focus:bg-white focus:border-[#E53935] transition-all"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 block px-4">Intent Description</label>
                      <textarea 
                        rows={4}
                        placeholder="Briefly describe your requirements or the opportunity..." 
                        className="w-full p-8 bg-slate-50 border border-transparent rounded-[2rem] text-sm font-bold text-[#292828] outline-none focus:bg-white focus:border-[#E53935] transition-all resize-none"
                      />
                   </div>

                   <button 
                     onClick={handleConnect}
                     disabled={connectStatus === "Sending"}
                     className="w-full h-20 bg-[#292828] text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-[#E53935] transition-all disabled:opacity-50"
                   >
                      {connectStatus === "Sending" ? "Initializing..." : "Send Connection Request"}
                   </button>
                   
                   <div className="flex items-center justify-center gap-2 text-slate-300">
                      <Lock size={12} />
                      <p className="text-[9px] font-black uppercase tracking-widest">Secured by Connection Ledger v7.0</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
