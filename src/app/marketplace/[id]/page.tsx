"use client";

export const runtime = "edge";

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
  const [connectStatus, setConnectStatus] = useState<"Idle" | "Sending" | "Sent">("Idle");

  const listingId = params.id as string;
  const listing = MOCK_LISTINGS.find(m => m.id === listingId) || MOCK_LISTINGS[0];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 1. HERO AREA (DARK) */}
      <header className="bg-[#292828] py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#E53935]/10 opacity-60" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426')] bg-cover bg-center mix-blend-overlay opacity-10 grayscale" />
         
         <div className="w-[94%] mx-auto px-6 relative z-10">
           <button 
             onClick={() => router.push('/marketplace')}
             className="flex items-center gap-3 text-white/40 font-black uppercase text-[10px]  mb-12 hover:text-[#E53935] transition-all group"
           >
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
           </button>

           <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12">
             <div className="flex-1 max-w-4xl">
               <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="px-5 py-2 bg-[#E53935] text-white text-[10px] font-black uppercase rounded-lg shadow-2xl  flex items-center gap-2">
                     <Zap size={14} /> High Impact Listing
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-white uppercase">
                     <Sparkles size={14} className="text-[#E53935]" /> {listing.matchScore}% Match Score
                  </div>
               </div>
               <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase  leading-[0.8] mb-10">{listing.title}</h1>
               <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                        <img src={listing.provider.avatar} className="h-full w-full object-cover" alt="" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-white/40 uppercase  mb-1">Provider</p>
                        <span className="text-xl font-bold text-white uppercase ">{listing.provider.name}</span>
                     </div>
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden sm:block" />
                  <div>
                     <p className="text-[10px] font-black text-white/40 uppercase  mb-1">Location</p>
                     <p className="text-xl font-bold text-white uppercase ">{listing.location}</p>
                  </div>
               </div>
             </div>

             <div className="flex flex-col gap-4 w-full sm:w-auto">
               <ConnectButton 
                  userId={listing.id} 
                  userName={listing.provider.name} 
                  label="Connect" 
                  className="!h-24 !px-16 !bg-white !text-[#292828] !rounded-lg !font-black !text-xs !uppercase ! !shadow-4xl hover:!bg-[#E53935] hover:!text-white transition-all active:scale-95" 
               />
               <p className="text-center text-[10px] font-black text-white/20 uppercase ">Connection required</p>
             </div>
           </div>
         </div>
      </header>

      {/* 2. STRATEGIC CONTEXT AREA */}
      <div className="w-[94%] mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20">
          
          {/* PRIMARY COLUMN */}
          <div className="space-y-20">
            {/* DESCRIPTION */}
            <section>
              <h3 className="text-[10px] font-black uppercase  text-[#E53935] mb-10 flex items-center gap-3">
                 <Info size={18} /> Description
              </h3>
              <p className="text-3xl lg:text-4xl font-bold text-[#292828] leading-[1.4] italic">
                 "{listing.description}"
              </p>
            </section>

            {/* STRUCTURAL GAP MAPPING */}
            <section className="pt-16 border-t border-slate-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                     <h4 className="text-[11px] font-black uppercase text-[#292828]/40  mb-10">Tags</h4>
                     <div className="flex flex-wrap gap-3">
                        {listing.tags.map(tag => (
                          <span key={tag} className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-black uppercase text-[#292828] shadow-sm hover:bg-[#292828] hover:text-white transition-all cursor-default">{tag}</span>
                        ))}
                     </div>
                  </div>
                  <div>
                     <h4 className="text-[11px] font-black uppercase text-[#292828]/40  mb-10">Impact</h4>
                     <div className="space-y-6">
                        {[
                           "Quick connection",
                           "Get help directly",
                           "Connect with locals",
                           "Secure messaging"
                        ].map((impact, i) => (
                           <div key={i} className="flex items-center gap-5 text-[#292828] font-bold text-sm">
                              <CheckCircle2 size={20} className="text-emerald-500 shrink-0" /> {impact}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

            {/* USE CASES AREA */}
            <section className="bg-[#292828] rounded-lg p-12 lg:p-20 text-white relative overflow-hidden group">
               <Target size={300} className="absolute -right-20 -bottom-20 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[10s]" />
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-16">
                     <h3 className="text-[11px] font-black uppercase  text-[#E53935]">Use Cases</h3>
                     <div className="h-px w-32 bg-white/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     {listing.useCases.map((uc, i) => (
                       <div key={i} className="flex items-start gap-6 group/item">
                          <div className="h-12 w-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center shrink-0 group-hover/item:bg-[#E53935] transition-all">
                             <TrendingUp size={24} className="text-[#E53935] group-hover/item:text-white transition-all" />
                          </div>
                          <div>
                             <p className="text-xl font-black uppercase  leading-tight mb-2">{uc}</p>
                             <p className="text-[10px] font-medium text-white/30 uppercase ">Verified</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>
          </div>

          {/* SECONDARY SIDEBAR */}
          <aside className="space-y-12">
             <div className="bg-white p-12 rounded-lg border border-slate-100 shadow-premium relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-[11px] font-black uppercase text-[#292828]  mb-12 flex items-center gap-3">
                   <Target size={18} className="text-[#E53935]" /> Matching
                </h3>
                <div className="space-y-10">
                   {[
                      { label: "Goal Alignment", val: 96 },
                      { label: "Regional Proximity", val: 88 },
                      { label: "Reliability", val: 100 }
                   ].map((it, i) => (
                      <div key={i} className="space-y-3">
                         <div className="flex items-end justify-between">
                            <p className="text-[10px] font-black uppercase text-slate-300 ">{it.label}</p>
                            <p className="text-2xl font-black text-[#292828]">{it.val}%</p>
                         </div>
                         <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div 
                               className="h-full bg-[#E53935] rounded-full transition-all duration-1000" 
                               style={{ width: `${it.val}%` }}
                            />
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="p-12 bg-slate-50 border border-slate-100 rounded-lg shadow-sm">
                <h3 className="text-[11px] font-black uppercase text-[#292828]  mb-10 flex items-center gap-3">
                   <Lock size={18} className="text-[#E53935]" /> Rules
                </h3>
                <ul className="space-y-6">
                   {[
                      "No direct sales initializations.",
                      "Connect before chat.",
                      "All interactions are secure.",
                      "Verified members only."
                   ].map((rule, i) => (
                      <li key={i} className="text-[11px] font-bold text-slate-200 uppercase leading-relaxed flex items-start gap-4">
                         <div className="h-2 w-2 rounded-full bg-[#E53935] mt-1 shrink-0 shadow-[0_0_8px_rgba(229,57,53,0.4)]" />
                         {rule}
                      </li>
                   ))}
                </ul>
             </div>

             <div className="p-10 text-center">
                <p className="text-[10px] font-black text-slate-200 uppercase ">Checkout OS V.7</p>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
