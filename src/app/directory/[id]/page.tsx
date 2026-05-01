"use client";
import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Globe, 
  ShieldCheck, 
  Target,
  Zap,
  Info
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import TerminalLayout from "@/components/layout/TerminalLayout";

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;

  // Since MOCK_BUSINESSES was empty, we'll use a placeholder logic or fetch logic if it were real
  const business = {
    id: businessId,
    name: "Enterprise Solutions",
    logo: `https://api.dicebear.com/7.x/initials/svg?seed=${businessId}`,
    category: "Professional Services",
    location: "Global Hub",
    matchScore: 92,
    description: "Leading professional services with a focus on strategic growth and digital transformation.",
    services: ["Strategic Consulting", "Digital Scale", "Team Building", "Operations"],
    expertise: ["Growth", "Scale", "Efficiency"]
  };

  return (
    <TerminalLayout
      topbarChildren={
         <div className="flex items-center gap-6">
            <button 
               onClick={() => router.push('/directory')}
               className="h-10 px-4 bg-[#F5F5F7] text-black/40 rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-black transition-all"
            >
               <ArrowLeft size={14} /> Back
            </button>
         </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto space-y-12">
         {/* HERO */}
         <div className="bg-white rounded-[20px] p-10 border border-black/[0.03] shadow-sm relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 relative z-10">
               <div className="h-40 w-40 rounded-[10px] overflow-hidden border-4 border-[#F5F5F7] shadow-xl shrink-0 bg-black flex items-center justify-center p-4">
                  <img src={business.logo} className="w-full h-full object-cover grayscale" alt="" />
               </div>
               <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                     <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm"><CheckCircle2 size={12} /> Verified</div>
                     <div className="flex items-center gap-2 px-3 py-1 bg-[#F5F5F7] rounded-full text-[9px] font-black text-black/20 uppercase tracking-widest"><Sparkles size={12} className="text-[#E53935]" /> {business.matchScore}% Match</div>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black text-[#1D1D1F] uppercase font-outfit leading-none mb-6">{business.name}</h1>
                  <div className="flex items-center justify-center lg:justify-start gap-4 text-black/20 uppercase text-[10px] font-black tracking-widest">
                     <p>{business.category}</p>
                     <span className="h-1 w-1 bg-black/5 rounded-full" />
                     <div className="flex items-center gap-2 text-[#1D1D1F]"><MapPin size={14} className="text-[#E53935]" />{business.location}</div>
                  </div>
               </div>
               <div className="flex flex-col gap-3 min-w-[200px]">
                  <button className="h-14 px-10 bg-black text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#E53935] transition-all">Link Partner</button>
                  <button className="h-12 px-8 border border-black/[0.08] rounded-[10px] font-black text-[9px] uppercase tracking-widest hover:bg-[#F5F5F7] transition-all flex items-center justify-center gap-2">View Map <ArrowUpRight size={14} /></button>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
               <section>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20 mb-8 flex items-center gap-2"><Info size={16} /> Identity</h3>
                  <p className="text-2xl font-black text-black uppercase font-outfit leading-relaxed italic">"{business.description}"</p>
               </section>
               <section className="bg-[#F5F5F7] rounded-[20px] p-10 border border-black/[0.02]">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-8">Specialized Solutions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {business.services.map((service, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-[10px] border border-black/[0.03] group hover:border-[#E53935]/20 transition-all">
                           <div className="h-10 w-10 bg-[#F5F5F7] rounded-[8px] flex items-center justify-center text-black group-hover:bg-[#E53935] group-hover:text-white transition-all shrink-0"><Zap size={16} /></div>
                           <p className="text-[11px] font-black uppercase text-black">{service}</p>
                        </div>
                     ))}
                  </div>
               </section>
            </div>
            <aside className="space-y-10">
               <div className="bg-black p-10 rounded-[20px] text-white relative overflow-hidden group shadow-2xl">
                  <ShieldCheck size={200} className="absolute -right-20 -bottom-20 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[5s]" />
                  <div className="relative z-10">
                     <h3 className="text-[9px] font-black uppercase text-[#E53935] mb-8 tracking-widest">Verification Status</h3>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4"><div className="h-10 w-10 bg-white/10 rounded-[8px] flex items-center justify-center text-emerald-400"><CheckCircle2 size={20} /></div><div><p className="text-[11px] font-black uppercase">KYC Verified</p><p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Auth: Profile Level 2</p></div></div>
                        <div className="flex items-center gap-4"><div className="h-10 w-10 bg-white/10 rounded-[8px] flex items-center justify-center text-emerald-400"><CheckCircle2 size={20} /></div><div><p className="text-[11px] font-black uppercase">Active Entity</p><p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Regional Node Active</p></div></div>
                     </div>
                     <button className="w-full mt-10 h-12 bg-white text-black rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] hover:text-white transition-all shadow-xl">Download Profile</button>
                  </div>
               </div>
               <div className="p-8 bg-white border border-black/[0.03] rounded-[20px] shadow-sm"><h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20 mb-8 flex items-center gap-2"><Globe size={16} /> Online Node</h3><div className="space-y-3"><button className="w-full h-12 flex items-center justify-between px-5 bg-[#F5F5F7] rounded-[10px] group hover:bg-black hover:text-white transition-all"><span className="text-[10px] font-black uppercase tracking-widest">Corporate Site</span><ArrowUpRight size={14} /></button><button className="w-full h-12 flex items-center justify-between px-5 bg-[#F5F5F7] rounded-[10px] group hover:bg-black hover:text-white transition-all"><span className="text-[10px] font-black uppercase tracking-widest">LinkedIn Node</span><ArrowUpRight size={14} /></button></div></div>
            </aside>
         </div>
      </div>
    </TerminalLayout>
  );
}
