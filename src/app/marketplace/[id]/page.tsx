"use client";
export const runtime = 'edge';



import React, { useState } from "react";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Target,
  Lock,
  CheckCircle2,
  Info
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_LISTINGS } from "@/data/marketplace";
import TerminalLayout from "@/components/layout/TerminalLayout";
import { ConnectButton } from "@/components/connection/ConnectButton";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  const listing = MOCK_LISTINGS.find(m => m.id === listingId) || MOCK_LISTINGS[0];

  return (
    <TerminalLayout
      topbarChildren={
         <div className="flex items-center gap-6">
            <button 
               onClick={() => router.push('/marketplace')}
               className="h-10 px-4 bg-[#F5F5F7] text-black/40 rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-black transition-all"
            >
               <ArrowLeft size={14} /> Back
            </button>
         </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* HERO */}
        <div className="bg-black rounded-[20px] p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#E53935]/10 opacity-60" />
           <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div className="flex-1 space-y-10">
                 <div className="flex flex-wrap items-center gap-4">
                    <div className="px-4 py-1.5 bg-[#E53935] text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-2"><Zap size={14} /> High Impact</div>
                    <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-2"><Sparkles size={14} className="text-[#E53935]" /> {listing.matchScore}% Match</div>
                 </div>
                 <h1 className="text-5xl lg:text-8xl font-black uppercase font-outfit leading-[0.8] tracking-tighter">{listing.title}</h1>
                 <div className="flex flex-wrap items-center gap-10">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-[10px] overflow-hidden border border-white/10 shrink-0"><img src={listing.provider.avatar} className="h-full w-full object-cover grayscale" alt="" /></div>
                       <div><p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Provider</p><p className="text-xl font-black uppercase font-outfit">{listing.provider.name}</p></div>
                    </div>
                    <div className="h-10 w-px bg-white/10 hidden sm:block" />
                    <div><p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Node Location</p><p className="text-xl font-black uppercase font-outfit">{listing.location}</p></div>
                 </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[240px]">
                 <ConnectButton 
                    userId={listing.provider.id} 
                    userName={listing.provider.name}
                    label="Start Building"
                    className="!h-20 !rounded-[10px] !bg-white !text-black !font-black !text-xs !uppercase !tracking-widest !shadow-xl hover:!bg-[#E53935] hover:!text-white transition-all" 
                 />
                 <p className="text-center text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">High Authority Connection Required</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
           <div className="space-y-12">
              <section>
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20 mb-8 flex items-center gap-2"><Info size={16} /> Proposition</h3>
                 <p className="text-3xl font-black text-black uppercase font-outfit leading-relaxed italic">"{listing.description}"</p>
              </section>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-black/[0.03]">
                 <div><h4 className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-8">Structural Tags</h4><div className="flex flex-wrap gap-2">{listing.tags.map(tag => <span key={tag} className="px-4 py-2 bg-[#F5F5F7] text-black/40 rounded-[10px] text-[10px] font-black uppercase tracking-widest">{tag}</span>)}</div></div>
                 <div><h4 className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-8">Strategic Impact</h4><div className="space-y-4">{["Direct help", "Secure network", "Verified data"].map((impact, i) => <div key={i} className="flex items-center gap-3 text-black/40 font-black uppercase text-[10px] tracking-widest"><CheckCircle2 size={16} className="text-emerald-500" /> {impact}</div>)}</div></div>
              </section>
           </div>
           <aside className="space-y-10">
              <div className="bg-white p-10 rounded-[20px] border border-black/[0.03] shadow-sm"><h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20 mb-10 flex items-center gap-2"><Target size={16} className="text-[#E53935]" /> Core Mapping</h3><div className="space-y-8">{[{ label: "Alignment", val: 96 }, { label: "Proximity", val: 88 }].map((it, i) => <div key={i} className="space-y-3"><div className="flex items-end justify-between"><p className="text-[9px] font-black uppercase text-black/20 tracking-widest">{it.label}</p><p className="text-2xl font-black font-outfit">{it.val}%</p></div><div className="h-1 w-full bg-[#F5F5F7] rounded-full overflow-hidden"><div className="h-full bg-[#E53935] rounded-full" style={{ width: `${it.val}%` }} /></div></div>)}</div></div>
              <div className="p-10 bg-[#F5F5F7] rounded-[20px]"><h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20 mb-8 flex items-center gap-2"><Lock size={16} className="text-[#E53935]" /> Protocols</h3><ul className="space-y-5">{["Connect before chat", "Verified only", "Zero noise policy"].map((rule, i) => <li key={i} className="text-[9px] font-black text-black/20 uppercase tracking-widest flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-[#E53935] shadow-[0_0_8px_rgba(229,57,53,0.4)]" /> {rule}</li>)}</ul></div>
           </aside>
        </div>
      </div>
    </TerminalLayout>
  );
}
