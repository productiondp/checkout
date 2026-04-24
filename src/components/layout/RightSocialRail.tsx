"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Zap, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck,
  Target,
  Sparkles,
  ArrowUpRight,
  BrainCircuit,
  Activity,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

import { createClient } from "@/utils/supabase/client";

const RECENT_ACTIVITY: any[] = [];

export default function RightSocialRail() {
  const router = useRouter();
  const [insightIndex, setInsightIndex] = useState(0);
  const [nodes, setNodes] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([
    "Scanning Global Profiles...",
    "3 New Logistics Requirements matched",
    "Profile directory expanded by 12%"
  ]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchNodes() {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5);
      if (data && data.length > 0) {
        setNodes(data);
        const insights = data.map(n => `Active profile: ${n.full_name}`);
        setAiInsights(prev => [...insights, ...prev]);
      }
    }
    fetchNodes();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % aiInsights.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [aiInsights]);

  return (
    <aside className="w-[340px] hidden xl:flex flex-col bg-[#FDFDFF] border-l border-[#292828]/5 h-full sticky top-0 overflow-y-auto no-scrollbar selection:bg-[#E53935]/10 p-6 gap-8">
      
      {/* 1. MARKET INSIGHTS */}
      <section className="space-y-4">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-[#292828]/20 uppercase tracking-[0.2em] flex items-center gap-2">
               <BrainCircuit size={12} className="text-[#E53935]" /> Market Insights
            </h4>
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
               <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-bold text-emerald-600 uppercase">Live</span>
            </div>
         </div>

         <div 
           onClick={() => router.push("/explore")}
           className="relative h-56 w-full bg-white rounded-[2.5rem] border border-[#292828]/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden group cursor-pointer hover:border-[#E53935]/20 transition-all duration-700"
         >
            {/* Dynamic Background */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#292828_2px,transparent_2px)] [background-size:24px_24px] group-hover:scale-110 transition-transform duration-[10s]" />
            
            {/* SVG Grid Map */}
            <svg className="absolute inset-0 w-full h-full text-[#292828] opacity-[0.02]" viewBox="0 0 100 100">
               <path d="M10,10 L90,10 M10,30 L90,30 M10,50 L90,50 M10,70 L90,70 M10,90 L90,90 M10,10 L10,90 M30,10 L30,90 M50,10 L50,90 M70,10 L70,90 M90,10 L90,90" stroke="currentColor" strokeWidth="0.1" />
               <circle cx="45" cy="40" r="15" fill="currentColor" className="animate-pulse" />
            </svg>

            {/* Network */}
            <div className="absolute top-[35%] left-[40%] h-2.5 w-2.5 bg-[#E53935] rounded-full shadow-[0_0_20px_rgba(229,57,53,0.6)] animate-ping" />
            <div className="absolute top-[55%] left-[65%] h-2 w-2 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <div className="absolute top-[70%] left-[25%] h-1.5 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

            {/* AI Floating Insight */}
            <div className="absolute bottom-6 inset-x-6">
               <div className="bg-white/90 backdrop-blur-md border border-[#292828]/5 p-4 rounded-2xl shadow-xl transform group-hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                     <Sparkles size={12} className="text-[#E53935]" />
                     <p className="text-[9px] font-black text-[#292828]/30 uppercase tracking-widest">Opportunity</p>
                  </div>
                  <p className="text-[11px] font-bold text-[#292828] uppercase leading-tight animate-in fade-in slide-in-from-bottom-1 duration-500" key={insightIndex}>
                     {aiInsights[insightIndex]}
                  </p>
               </div>
            </div>

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#292828]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <div className="bg-[#292828] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                  Map View <ArrowUpRight size={14} />
               </div>
            </div>
         </div>
      </section>

      {/* 2. ACTIVE HUB (Activity Feed) */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-[#292828]/20 uppercase tracking-[0.2em] flex items-center gap-2">
               <Activity size={12} /> Active Directory
            </h4>
         </div>

         <div className="space-y-4">
            {RECENT_ACTIVITY.map((p, i) => (
               <div key={p.name} className="flex items-center gap-4 group cursor-pointer p-2 -m-2 rounded-2xl hover:bg-slate-50 transition-all">
                  <div className="relative">
                     <div className="h-11 w-11 rounded-2xl overflow-hidden border border-[#292828]/10 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3 bg-white">
                        <img src={p.avatar} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                     </div>
                     <div className={cn(
                       "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                       p.color === 'emerald' ? 'bg-emerald-500' : p.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
                     )} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[13px] font-bold text-[#292828] uppercase leading-none mb-1.5 group-hover:text-[#E53935] transition-colors truncate">{p.name}</p>
                     <p className="text-[9px] font-bold text-[#292828]/40 uppercase tracking-tight">{p.role} • {p.action}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#292828]/10 group-hover:text-[#E53935] transition-all transform group-hover:translate-x-1" />
               </div>
            ))}
         </div>
      </section>



    </aside>
  );
}
