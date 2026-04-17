"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Globe, 
  CreditCard, 
  ChevronRight, 
  LogOut, 
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Settings,
  Briefcase,
  Target,
  Zap,
  Activity,
  Award,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_PROFILES } from "@/lib/dummyData";

export default function DynamicProfilePage() {
  const params = useParams();
  const profileId = parseInt(params.id as string);
  
  // Find the profile based on ID
  const profile = useMemo(() => {
    return DUMMY_PROFILES.find(p => p.id === profileId) || DUMMY_PROFILES[0];
  }, [profileId]);

  const [activeTab, setActiveTab] = useState("Overview");

  const performanceMetrics = [
    { label: "Trust Score", value: profile.match + 2, color: "bg-green-500", icon: ShieldCheck },
    { label: "Networking Score", value: profile.match, color: "bg-[#E53935]", icon: Target },
    { label: "Credit Score", value: 92, color: "bg-[#292828]", icon: CreditCard },
    { label: "Response Time", value: 76, color: "bg-red-600", icon: Zap },
  ];

  const contactInfo = [
    { label: "Email", value: `${profile.name.toLowerCase().replace(" ", ".")}@${profile.company.toLowerCase().replace(" ", "")}.com`, icon: Mail },
    { label: "Phone", value: "+91 9XX XXXXXXX", icon: Phone },
    { label: "Website", value: `${profile.company.toLowerCase().replace(" ", "")}.io`, icon: Globe, link: true },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#E53935]/10 overscroll-none pb-40">
      
      {/* EXECUTIVE HEADER */}
      <div className="relative h-[480px] w-full overflow-hidden bg-[#292828] shadow-2xl">
         {/* Premium Backdrop */}
         <div className="absolute inset-0 bg-gradient-to-br from-[#292828] via-[#292828] to-[#E53935]/20 opacity-80" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale" />
         
         {/* Identity Container */}
         <div className="max-w-[1240px] mx-auto px-6 h-full flex items-center relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 w-full pt-10">
               {/* Avatar Hub */}
               <div className="relative shrink-0">
                  <div className="h-44 w-44 lg:h-52 lg:w-52 rounded-[3rem] bg-white p-3 shadow-4xl relative z-10 overflow-hidden border border-white/20">
                     <img src={profile.avatar} className="w-full h-full object-cover rounded-[2.5rem]" alt="Profile" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-[#E53935] border-4 border-white rounded-2xl flex items-center justify-center text-white shadow-2xl z-20">
                     <CheckCircle2 size={24} />
                  </div>
               </div>

               <div className="text-center md:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-5">
                     <h1 className="text-4xl lg:text-6xl font-black text-white leading-none uppercase">{profile.name}</h1>
                     <div className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase text-white tracking-widest">
                        Verified
                     </div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-8 text-white/60 text-[11px] font-black uppercase tracking-widest">
                     <span className="flex items-center gap-2 decoration-[#E53935] underline-offset-4 underline decoration-2"><Building size={14} className="text-[#E53935]" /> {profile.role}</span>
                     <span className="flex items-center gap-2"><Globe size={14} className="text-[#E53935]" /> {profile.company}</span>
                     <span className="flex items-center gap-2"><MapPin size={14} className="text-[#E53935]" /> {profile.city}</span>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <button className="h-16 px-10 bg-[#E53935] text-white rounded-2xl font-black text-[11px] uppercase shadow-2xl shadow-red-500/20 hover:scale-105 transition-all active:scale-95">Chat</button>
                  <button className="h-16 w-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-[#292828] transition-all">
                     <Plus size={24} />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* MAIN CONTENT ARCHITECTURE */}
      <div className="max-w-[1240px] mx-auto px-6 py-12 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* CONTENT SIDEBAR (LEFT) */}
            <div className="lg:col-span-4 space-y-10">
               
               {/* ABOUT CARD */}
               <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-50">
                  <h3 className="text-[10px] font-black text-[#292828]/30 uppercase mb-8 tracking-[0.2em] flex items-center gap-2">
                     <div className="h-1 w-4 bg-[#E53935] rounded-full" />
                     About
                  </h3>
                  <p className="text-lg text-[#292828] font-bold leading-relaxed uppercase">
                     Experienced leader at {profile.company}. Focused on improving local distribution 
                     through partnerships and digital tools in Kerala.
                  </p>
                  
                  <div className="mt-10 pt-10 border-t border-[#292828]/5 space-y-8">
                     {contactInfo.map((info, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer">
                           <div className="h-12 w-12 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828]/40 group-hover:bg-[#E53935] group-hover:text-white transition-all shadow-sm">
                              <info.icon size={18} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-black text-[#292828]/30 uppercase leading-none mb-2">{info.label}</p>
                              <p className={cn(
                                 "text-[14px] font-bold uppercase truncate",
                                 info.link ? "text-[#E53935]" : "text-[#292828]"
                               )}>{info.value}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* CHECKOUT RANK CARD */}
               <div className="bg-[#292828] rounded-[2.5rem] p-10 shadow-4xl relative overflow-hidden group border border-white/10">
                  <div className="absolute -bottom-10 -right-10 p-8 text-white opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                     <TrendingUp size={240} />
                  </div>
                  
                  <div className="relative z-10">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="h-14 w-14 bg-[#E53935] rounded-2xl flex items-center justify-center text-white shadow-xl">
                           <Zap size={28} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Authority Status</p>
                           <h4 className="text-xl font-black text-white uppercase tracking-tighter">Checkout Rank</h4>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-10 text-center">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                           <p className="text-[9px] font-black text-white/30 uppercase mb-2">Global</p>
                           <p className="text-2xl font-black text-white tracking-tighter">#{100 + profile.id}</p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                           <p className="text-[9px] font-black text-white/30 uppercase mb-2">State</p>
                           <p className="text-2xl font-black text-[#E53935] tracking-tighter">#{profile.id % 20 + 1}</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <p className="text-[10px] font-black text-white uppercase flex items-center gap-2 mb-2">
                           Targets
                        </p>
                        {[
                           { label: "Completed Projects", val: `${30 + (profile.id % 20)}/50`, progress: 60 + (profile.id % 40) },
                           { label: "Match Rate", val: `${profile.match}%`, progress: profile.match },
                        ].map((param, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between text-[9px] font-black text-white/30 uppercase">
                                 <span>{param.label}</span>
                                 <span className="text-white">{param.val}</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                 <div className="h-full bg-[#E53935] rounded-full transition-all" style={{ width: `${param.progress}%` }} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

            </div>

            {/* MAIN DATA FEED (RIGHT) */}
            <div className="lg:col-span-8 space-y-10">
               
               {/* NAVIGATION TABS */}
               <div className="flex items-center gap-12 border-b border-[#292828]/5 pb-1 overflow-x-auto no-scrollbar">
                  {["Overview", "History", "Work", "Reviews"].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-4 text-[10px] font-black uppercase transition-all relative tracking-[0.2em]",
                        activeTab === tab ? "text-[#E53935]" : "text-[#292828]/30 hover:text-[#292828]"
                      )}
                    >
                      {tab}
                      {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E53935] rounded-full" />}
                    </button>
                  ))}
               </div>

                {/* SCORE GRID */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {performanceMetrics.map((met, i) => (
                    <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-[#292828]/5 shadow-xl group hover:border-[#E53935]/20 transition-all duration-500">
                       <div className="flex items-center justify-between mb-10">
                          <div className="h-16 w-16 bg-[#292828]/5 rounded-2xl flex items-center justify-center text-[#E53935] group-hover:bg-[#E53935] group-hover:text-white transition-all duration-500 shadow-sm">
                             <met.icon size={24} />
                          </div>
                          <span className="text-4xl font-black text-[#292828] tracking-tighter">{met.value}%</span>
                       </div>
                       <p className="text-[10px] font-black text-[#292828]/30 uppercase mb-5 tracking-widest">{met.label}</p>
                       <div className="h-2 w-full bg-[#292828]/5 rounded-full overflow-hidden border border-[#292828]/5 p-0.5">
                          <div 
                             className={cn("h-full rounded-full transition-all duration-1000", met.color)} 
                             style={{ width: `${met.value}%` }} 
                          />
                       </div>
                    </div>
                  ))}
               </div>

               {/* RECENT BUSINESS HISTORY */}
               <div className="bg-white rounded-[2.5rem] p-10 border border-[#292828]/10 shadow-2xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-12">
                     <h3 className="text-[10px] font-black uppercase text-[#292828] flex items-center gap-2 tracking-[0.2em]">
                        <Activity size={18} className="text-[#E53935]" /> History
                     </h3>
                     <button className="text-[10px] font-black text-[#292828]/40 uppercase hover:text-[#E53935] transition-colors">See All</button>
                  </div>
                  
                  <div className="space-y-12">
                     {[
                        { title: `Successfully completed project with ${profile.company}.`, time: "2 hours ago", node: "Logistics Hub" },
                        { title: "Verification Update: Tier 1 Authority", time: "1 day ago", node: "Core Hub" },
                        { title: "Network Match Successful", time: "3 days ago", node: "Matching Engine" },
                     ].map((item, i) => (
                        <div key={i} className="flex gap-8 relative group">
                           {i !== 2 && <div className="absolute left-2 top-8 bottom-[-32px] w-px bg-neutral-100" />}
                           <div className="h-4 w-4 rounded-full bg-[#E53935] shadow-[0_0_15px_rgba(229,57,53,0.4)] mt-1 relative z-10 border-4 border-white" />
                           <div className="flex-1">
                              <p className="text-[16px] font-bold text-[#292828] leading-tight group-hover:text-[#E53935] transition-colors uppercase">{item.title}</p>
                              <div className="flex items-center gap-4 mt-3">
                                 <span className="text-[10px] font-black text-[#292828]/30 uppercase">{item.time}</span>
                                 <span className="h-1 w-1 bg-neutral-200 rounded-full" />
                                 <span className="text-[10px] font-black text-[#E53935] uppercase">{item.node}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>

         </div>
      </div>
    </div>
  );
}
