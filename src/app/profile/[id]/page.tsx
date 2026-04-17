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
      <div className="relative h-[440px] w-full overflow-hidden bg-[#292828] shadow-[0_40px_100px_rgba(41,40,40,0.3)]">
         {/* Premium Backdrop */}
         <div className="absolute inset-0 bg-gradient-to-br from-[#292828] via-[#292828] to-[#E53935]/20 opacity-80" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale" />
         
         {/* Identity Container */}
         <div className="max-w-[1240px] mx-auto px-6 h-full flex flex-col justify-end pb-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
               {/* Avatar Hub */}
               <div className="relative shrink-0">
                  <div className="h-48 w-48 rounded-[3.5rem] bg-white p-3 shadow-4xl relative z-10 overflow-hidden border border-white/20">
                     <img src={profile.avatar} className="w-full h-full object-cover rounded-[2.8rem]" alt="Profile" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 h-14 w-14 bg-[#E53935] border-4 border-white rounded-2xl flex items-center justify-center text-white shadow-2xl z-20">
                     <CheckCircle2 size={28} />
                  </div>
                  {/* Presence Status Dot */}
                  <div className={cn(
                     "absolute bottom-2 right-12 h-5 w-5 rounded-full border-4 border-white shadow-lg z-30",
                     profile.id % 3 === 0 ? "bg-green-500" : profile.id % 3 === 1 ? "bg-amber-500" : "bg-[#292828]"
                  )} />
               </div>

               <div className="text-center md:text-left flex-1 pb-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                     <h1 className="text-5xl font-bold text-white leading-none no-italic uppercase">{profile.name}</h1>
                     <div className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold uppercase text-white">
                        Verified Member
                     </div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/60 text-[13px] font-bold uppercase tracking-normal">
                     <span className="flex items-center gap-2"><Building size={16} className="text-[#E53935]" /> {profile.role}, {profile.company}</span>
                     <span className="flex items-center gap-2"><MapPin size={16} className="text-[#E53935]" /> {profile.city} Region, Kerala</span>
                  </div>
               </div>

               <div className="flex items-center gap-4 pb-2">
                  <button className="h-16 px-10 bg-[#E53935] text-white rounded-2xl font-bold text-xs uppercase shadow-xl hover:bg-[#292828] transition-all active:scale-95">Send Message</button>
                  <button className="h-16 w-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-[#292828] transition-all">
                     <Plus size={22} />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* MAIN CONTENT ARCHITECTURE */}
      <div className="max-w-[1240px] mx-auto px-6 -mt-10 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* CONTENT SIDEBAR (LEFT) */}
            <div className="lg:col-span-4 space-y-8">
               
               {/* BUSINESS BIO CARD */}
               <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(41,40,40,0.08)] border border-slate-50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-6 flex items-center gap-2">
                     <div className="h-1 w-4 bg-[#E53935] rounded-full" />
                     Professional Summary
                  </h3>
                  <p className="text-[17px] text-[#292828] font-bold leading-[1.8] no-italic uppercase">
                     Experienced leader in supply chain management at {profile.company}. Focused on improving local business distribution 
                     through partnerships and new digital tools in South India.
                  </p>
                  
                  <div className="mt-10 pt-10 border-t border-slate-50 space-y-6">
                     {contactInfo.map((info, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer">
                           <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#E53935] group-hover:text-white transition-all shadow-sm">
                              <info.icon size={18} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">{info.label}</p>
                              <p className={cn(
                                 "text-[14px] font-bold uppercase truncate",
                                 info.link ? "text-[#E53935]" : "text-black"
                              )}>{info.value}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* BUSINESS RANK & TIER ACHIEVEMENT */}
               <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(41,40,40,0.08)] border border-[#292828]/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-[#292828] opacity-10 group-hover:opacity-20 transition-opacity">
                     <Award size={180} />
                  </div>
                  
                  <div className="relative z-10">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 bg-gradient-to-br from-[#E53935] to-[#292828] rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-all">
                           <Award size={28} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-400 uppercase">Current Status</p>
                           <h4 className="text-xl font-bold text-black uppercase">Verified Member</h4>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Global Rank</p>
                           <p className="text-xl font-bold text-black">#{100 + profile.id}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <p className="text-xs font-bold text-slate-400 uppercase mb-1">State Rank</p>
                           <p className="text-xl font-bold text-black">#{profile.id % 20 + 1}</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <p className="text-xs font-bold text-black uppercase flex items-center gap-2">
                           <TrendingUp size={14} className="text-[#E53935]" /> Growth Goals
                        </p>
                        {[
                           { label: "Total Completed Projects", val: `${30 + (profile.id % 20)}/50`, progress: 60 + (profile.id % 40) },
                           { label: "Network Growth Velocity", val: "High", progress: 92 },
                           { label: "Successful Match Rate", val: `${profile.match}%`, progress: profile.match },
                        ].map((param, i) => (
                           <div key={i} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                                 <span>{param.label}</span>
                                 <span className="text-black">{param.val}</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                 <div className="h-full bg-[#E53935] rounded-full transition-all" style={{ width: `${param.progress}%` }} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

            </div>

            {/* MAIN DATA FEED (RIGHT) */}
            <div className="lg:col-span-8 space-y-8">
               
               {/* NAVIGATION TABS */}
               <div className="flex items-center gap-10 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
                  {["Overview", "Performance", "Connections", "Account"].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-4 text-xs font-bold uppercase transition-all relative whitespace-nowrap",
                        activeTab === tab ? "text-[#E53935]" : "text-slate-400 hover:text-black"
                      )}
                    >
                      {tab}
                      {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E53935] rounded-full" />}
                    </button>
                  ))}
               </div>

                {/* SCORE GRID */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {performanceMetrics.map((met, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-[0_20px_50px_rgba(41,40,40,0.06)] group hover:border-[#E53935]/20 transition-all duration-500">
                       <div className="flex items-center justify-between mb-8">
                          <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#E53935] group-hover:bg-[#E53935] group-hover:text-white transition-all duration-500 shadow-sm">
                             <met.icon size={22} />
                          </div>
                          <span className="text-3xl font-bold text-black">{met.value}%</span>
                       </div>
                       <p className="text-xs font-bold text-slate-400 uppercase mb-4">{met.label}</p>
                       <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                          <div 
                             className={cn("h-full rounded-full transition-all duration-1000", met.color)} 
                             style={{ width: `${met.value}%` }} 
                          />
                       </div>
                    </div>
                  ))}
               </div>

               {/* RECENT BUSINESS ACTIVITY */}
               <div className="bg-white rounded-[2.5rem] p-10 border border-[#292828]/10 shadow-[0_20px_50px_rgba(41,40,40,0.06)]">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xs font-bold uppercase text-black flex items-center gap-2">
                        <Activity size={16} className="text-[#E53935]" /> Recent Activity
                     </h3>
                     <button className="text-xs font-bold text-[#292828] uppercase hover:text-[#E53935] transition-colors">See Archive</button>
                  </div>
                  
                  <div className="space-y-10">
                     {[
                        { title: `Successfully completed strategic project regarding ${profile.company} node.`, time: "2 hours ago", node: "Logistics Hub" },
                        { title: "Financial Verification Complete: Tier 1 Elite", time: "1 day ago", node: "Financial Hub" },
                        { title: "Network Integrity Update Successful", time: "3 days ago", node: "System" },
                     ].map((item, i) => (
                        <div key={i} className="flex gap-6 relative group">
                           {i !== 2 && <div className="absolute left-1.5 top-8 bottom-[-24px] w-0.5 bg-neutral-100" />}
                           <div className="h-3 w-3 rounded-full bg-[#E53935] shadow-[0_0_10px_rgba(229,57,53,0.4)] mt-1.5 ring-4 ring-white relative z-10" />
                           <div className="flex-1">
                              <p className="text-[15px] font-bold text-black leading-tight group-hover:text-[#E53935] transition-colors uppercase">{item.title}</p>
                              <div className="flex items-center gap-4 mt-2">
                                 <span className="text-xs font-bold text-[#292828] uppercase">{item.time}</span>
                                 <span className="h-1 w-1 bg-neutral-200 rounded-full" />
                                 <span className="text-xs font-bold text-[#292828] uppercase">{item.node}</span>
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
