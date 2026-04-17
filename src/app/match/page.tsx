"use client";

import React, { useState } from "react";
import { 
  Users, 
  Star, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  MessageSquare, 
  Zap, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  Target,
  Rocket,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_PROFILES } from "@/lib/dummyData";

export default function PremiumPartnersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = DUMMY_PROFILES.slice(0, 40).filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-white lg:bg-[#FDFDFF] selection:bg-[#E53935]/10 overscroll-none">
      
      {/* 1. CINEMATIC HERO */}
      <div className="bg-slate-950 px-6 lg:px-12 py-12 lg:py-20 relative overflow-hidden">
         <div className="max-w-4xl relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <span className="h-[1px] w-12 bg-[#E53935]" />
               <span className="text-[11px] font-black text-[#E53935] uppercase tracking-[0.3em]">Find Partners</span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-white leading-tight mb-8 uppercase">Top <span className="text-[#E53935]">Matches</span>.</h1>
            <p className="text-white/50 text-xl font-medium max-w-2xl leading-relaxed mb-12">
               Connect with business leaders near you that match your needs.
            </p>
         </div>
         <Rocket size={400} className="absolute -right-20 -bottom-20 text-white/[0.03] rotate-12" />
      </div>

      {/* 2. EXPLORATION HUB */}
      <div className="px-6 lg:px-12 py-10">
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
               {["All", "Founders", "Logistics", "MSME", "Tech Leads"].map(tab => (
                 <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[11px] font-black uppercase  transition-all whitespace-nowrap border",
                    activeTab === tab ? "bg-[#E53935] border-[#E53935] text-white shadow-xl shadow-red-500/20" : "bg-white border-slate-100 text-slate-400 hover:text-slate-900"
                  )}
                 >
                    {tab}
                 </button>
               ))}
            </div>

            <div className="relative w-full lg:max-w-md">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
               <input 
                 type="text" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search partners by firm or name..." 
                 className="w-full h-16 bg-white border border-slate-100 rounded-2xl pl-16 pr-6 text-[15px] font-bold outline-none focus:border-[#E53935]/20 focus:ring-8 focus:ring-red-500/5 shadow-2xl shadow-slate-200/20 transition-all" 
               />
            </div>
         </div>

         {/* PARTNERS GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-40">
            {filtered.map(p => (
              <div key={p.id} className="group bg-white border border-slate-100 rounded-[3.5rem] p-1.5 transition-all hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:border-[#E53935]/10 overflow-hidden">
                 <div className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-8">
                       <div className="h-20 w-20 rounded-[1.5rem] overflow-hidden border-4 border-slate-50 shadow-xl group-hover:scale-105 transition-transform">
                          <img src={p.avatar} alt="" className="w-full h-full object-cover" />
                       </div>
                       <div className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[11px] font-black uppercase  flex items-center gap-2 shadow-sm">
                          <TrendingUp size={14} /> {p.match}% Match
                       </div>
                    </div>

                    <div className="mb-8">
                       <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-2xl font-black text-slate-900 uppercase group-hover:text-[#E53935] transition-colors">{p.name}</h3>
                          <ShieldCheck size={18} className="text-blue-500" />
                       </div>
                       <p className="text-[11px] font-black text-slate-300 uppercase  leading-none mb-6">{p.role} @ {p.company}</p>
                       
                       <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
                          <MapPin size={14} className="text-[#E53935]" /> {p.city} • Active Now
                       </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-50 mb-8 group-hover:bg-white transition-colors">
                       <p className="text-[10px] font-black text-slate-300 uppercase  mb-3">About</p>
                       <p className="text-[15px] font-medium text-slate-700 leading-relaxed">
                          Interested in regional logistics and high-scale business partnerships in {p.city}.
                       </p>
                    </div>

                    <div className="flex gap-3">
                       <button className="flex-1 py-5 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase  shadow-2xl hover:bg-[#E53935] active:scale-95 transition-all">Connect Now</button>
                       <button className="h-14 w-14 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-900 hover:bg-slate-100 transition-all"><MessageSquare size={20} /></button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* 3. PROMOTION FOOTER */}
      <div className="mt-20 p-12 bg-[#E53935] rounded-[4rem] text-white relative overflow-hidden group mx-6 lg:mx-12 mb-20 shadow-2xl shadow-red-500/20">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-xl">
               <h3 className="text-3xl lg:text-5xl font-black mb-6 leading-tight uppercase">Scale your <span className="text-white/40">Connections</span>.</h3>
               <p className="text-white/80 text-xl font-medium leading-relaxed">Let our algorithmic engine find your next high-capacity business partner across the global node.</p>
            </div>
            <button className="px-12 py-6 bg-white text-[#E53935] rounded-[2rem] font-black text-[12px] uppercase shadow-4xl hover:bg-slate-900 hover:text-white transition-all transform hover:-translate-y-2">Optimize Profile</button>
         </div>
         <Zap size={300} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-[4s]" />
      </div>

    </div>
  );
}
