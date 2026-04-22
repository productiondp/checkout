"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
 MapPin, 
 Zap, 
 TrendingUp, 
 ChevronRight, 
 ShieldCheck,
 Target,
 Sparkles,
 ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const RECENT_ACTIVITY: any[] = [
 { name: "Rahul S", role: "CEO, Zigma", avatar: "https://i.pravatar.cc/150?u=rahul" },
 { name: "Sanya K", role: "Investor", avatar: "https://i.pravatar.cc/150?u=sanya" },
 { name: "Kevin P", role: "Logistics", avatar: "https://i.pravatar.cc/150?u=kevin" },
];

const MATCH_LOGS = [
 { id: 1, type: "Lead", title: "Warehouse Tech", score: 98 },
 { id: 2, type: "Expert", title: "Sarah Chen", score: 99 },
 { id: 3, type: "Partner", title: "FastTrack", score: 94 },
];

export default function RightSocialRail() {
 const router = useRouter();

 return (
 <aside className="w-[320px] hidden xl:flex flex-col bg-white border-l border-[#292828]/5 h-full sticky top-0 overflow-y-auto no-scrollbar selection:bg-[#E53935]/10">
 
 {/* 2. MINI CITY MAP */}
 <section className="p-6 border-b border-[#292828]/5">
 <div className="flex items-center justify-between mb-6">
 <h4 className="text-[10px] font-bold text-[#292828]/30 uppercase ">City Distribution</h4>
 <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-500 uppercase">
 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
 12 New Leads
 </div>
 </div>

 <div 
 onClick={() => router.push("/explore")}
 className="h-48 w-full bg-slate-50 rounded-[24px] border border-[#292828]/10 relative overflow-hidden group cursor-pointer shadow-inner"
 >
 {/* Mock Map Visual */}
 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#292828_1px,transparent_1px)] [background-size:20px_20px]" />
 <svg className="absolute inset-0 w-full h-full text-[#292828] opacity-10" viewBox="0 0 100 100">
 <path d="M20,20 Q40,10 60,30 T100,20 V80 Q80,90 60,70 T20,80 Z" fill="currentColor" />
 <path d="M0,50 L100,50 M50,0 L50,100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
 </svg>

 {/* Pulsing Nodes */}
 <div className="absolute top-1/4 left-1/3 h-2 w-2 bg-[#E53935] rounded-full shadow-[0_0_15px_#E53935] animate-ping" />
 <div className="absolute top-1/2 left-2/3 h-2 w-2 bg-blue-500 rounded-full shadow-[0_0_15px_blue] animate-pulse" />
 <div className="absolute top-2/3 left-1/4 h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_15px_emerald] animate-pulse" />

 <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent flex items-bottom justify-center p-4">
 <div className="mt-auto flex items-center gap-2 bg-[#292828] text-white px-4 py-2 rounded-full text-[9px] font-bold uppercase shadow-2xl group-hover:bg-[#E53935] transition-all">
 Open Live Map <ArrowUpRight size={10} />
 </div>
 </div>
 </div>
 </section>

 {/* 3. ACTIVE NETWORK */}
 <section className="p-6 space-y-6">
 <h4 className="text-[10px] font-bold text-[#292828]/30 uppercase ">Active Hub</h4>
 <div className="space-y-5">
 {RECENT_ACTIVITY.map((p, i) => (
 <div key={p.name} className="flex items-center gap-4 group cursor-pointer">
 <div className="h-10 w-10 rounded-xl overflow-hidden border border-[#292828]/10 shadow-sm transition-transform group-hover:scale-105 group-hover:rotate-3">
 <img src={p.avatar} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
 </div>
 <div className="flex-1">
 <p className="text-[12px] font-bold text-[#292828] uppercase leading-none mb-1 group-hover:text-[#E53935] transition-colors">{p.name}</p>
 <p className="text-[9px] font-bold text-[#292828]/40 uppercase ">{p.role}</p>
 </div>
 <ChevronRight size={14} className="text-[#292828]/20 group-hover:text-[#E53935] transition-all -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
 </div>
 ))}
 </div>

 <div className="bg-[#292828] rounded-[24px] p-6 text-center shadow-2xl shadow-black/20 relative overflow-hidden">
 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
 <p className="text-[10px] font-bold text-white/40 uppercase mb-4 relative z-10">Elite Network</p>
 <div className="flex -space-x-3 justify-center mb-6 relative z-10">
 {[1,2,3,4,5].map(i => (
 <div key={i} className="w-8 h-8 rounded-full border-2 border-[#292828] bg-slate-200 overflow-hidden shadow-lg">
 <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="U" className="grayscale" />
 </div>
 ))}
 </div>
 <button className="w-full h-11 bg-[#E53935] text-white rounded-xl text-[10px] font-bold uppercase shadow-xl shadow-red-500/20 active:scale-95 transition-all relative z-10">
 Broadcast Invite
 </button>
 </div>
 </section>

 </aside>
 );
}
