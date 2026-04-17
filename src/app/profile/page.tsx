"use client";

import React, { useState } from "react";
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

export default function PremiumProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");

  const performanceMetrics = [
    { label: "Network Trust", value: 98, color: "bg-green-500", icon: ShieldCheck },
    { label: "Business Affinity", value: 84, color: "bg-[#E53935]", icon: Target },
    { label: "Financial Credit", value: 92, color: "bg-blue-600", icon: CreditCard },
    { label: "Operational Speed", value: 76, color: "bg-violet-600", icon: Zap },
  ];

  const contactInfo = [
    { label: "Email", value: "ahmad@zenithtech.com", icon: Mail },
    { label: "Phone", value: "+91 9XX XXXXXXX", icon: Phone },
    { label: "Website", value: "zenithtech.io", icon: Globe, link: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#E53935]/10 overscroll-none pb-40">
      
      {/* EXECUTIVE HEADER */}
      <div className="relative h-[440px] w-full overflow-hidden bg-[#292828] shadow-2xl">
         {/* Premium Backdrop */}
         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#E53935]/20 opacity-80" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale" />
         
         {/* Identity Container */}
         <div className="max-w-[1240px] mx-auto px-6 h-full flex flex-col justify-end pb-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
               {/* Avatar Hub */}
               <div className="relative shrink-0">
                  <div className="h-48 w-48 rounded-[3.5rem] bg-white p-3 shadow-4xl relative z-10 overflow-hidden border border-white/20">
                     <img src="https://i.pravatar.cc/300?u=me" className="w-full h-full object-cover rounded-[2.8rem]" alt="Profile" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 h-14 w-14 bg-[#E53935] border-4 border-[#0F172A] rounded-2xl flex items-center justify-center text-white shadow-2xl z-20">
                     <CheckCircle2 size={28} />
                  </div>
               </div>

               <div className="text-center md:text-left flex-1 pb-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                     <h1 className="text-5xl font-black text-white leading-none no-italic">Ahmad Nur F</h1>
                     <div className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase text-white tracking-widest">
                        Elite Partner
                     </div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/60 text-[13px] font-bold uppercase tracking-normal">
                     <span className="flex items-center gap-2"><Building size={16} className="text-[#E53935]" /> CEO, Zenith Tech Solutions</span>
                     <span className="flex items-center gap-2"><MapPin size={16} className="text-[#E53935]" /> Trivandrum Node, Kerala</span>
                  </div>
               </div>

               <div className="flex items-center gap-4 pb-2">
                  <button className="h-16 px-10 bg-[#E53935] text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-white hover:text-[#E53935] transition-all active:scale-95">Edit Profile</button>
                  <button className="h-16 w-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-[#292828] transition-all">
                     <Settings size={22} />
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
               <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-[#292828]/10">
                  <h3 className="text-[11px] font-black text-[#292828]/40 uppercase mb-6 flex items-center gap-2">
                     <div className="h-1 w-4 bg-[#E53935] rounded-full" />
                     Professional Summary
                  </h3>
                  <p className="text-[17px] text-[#292828] font-medium leading-[1.8] no-italic">
                     Leading executive in regional supply chain optimization. Transforming MSME logistics through 
                     high-affinity partner coordination and innovative digital infrastructure in South India.
                  </p>
                  
                  <div className="mt-10 pt-10 border-t border-[#292828]/5 space-y-6">
                     {contactInfo.map((info, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer">
                           <div className="h-12 w-12 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all shadow-sm">
                              <info.icon size={18} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-black text-[#292828] uppercase leading-none mb-1">{info.label}</p>
                              <p className={cn(
                                 "text-[14px] font-bold truncate",
                                 info.link ? "text-[#E53935]" : "text-[#292828]"
                              )}>{info.value}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* BUSINESS RANK & TIER ACHIEVEMENT */}
               <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-[#292828]/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Award size={180} />
                  </div>
                  
                  <div className="relative z-10">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                           <Award size={28} />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-[#292828] uppercase">Current Status</p>
                           <h4 className="text-xl font-black text-[#292828] uppercase">Platinum Merchant</h4>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#292828]/5 p-4 rounded-2xl border border-[#292828]/10">
                           <p className="text-[9px] font-black text-[#292828] uppercase mb-1">Global Rank</p>
                           <p className="text-xl font-black text-[#292828]">#124</p>
                        </div>
                        <div className="bg-[#292828]/5 p-4 rounded-2xl border border-[#292828]/10">
                           <p className="text-[9px] font-black text-[#292828] uppercase mb-1">State Rank</p>
                           <p className="text-xl font-black text-[#292828]">#08</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <p className="text-[11px] font-black text-[#292828] uppercase flex items-center gap-2">
                           <TrendingUp size={14} className="text-[#E53935]" /> Promotion Parameters
                        </p>
                        {[
                           { label: "Total Completed Projects", val: "42/50", progress: 84 },
                           { label: "Network Growth Velocity", val: "High", progress: 92 },
                           { label: "Successful Match Rate", val: "96%", progress: 96 },
                        ].map((param, i) => (
                           <div key={i} className="space-y-1.5">
                              <div className="flex justify-between text-[10px] font-bold text-[#292828] uppercase">
                                 <span>{param.label}</span>
                                 <span className="text-[#292828]">{param.val}</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#292828]/5 rounded-full overflow-hidden border border-[#292828]/10">
                                 <div className="h-full bg-[#E53935] rounded-full transition-all" style={{ width: `${param.progress}%` }} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* QUICK ACTIONS DOCK */}
               <div className="bg-[#292828] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                     <Plus size={160} strokeWidth={1} />
                  </div>
                  <div className="relative z-10">
                     <h3 className="text-[11px] font-black uppercase text-white/40 mb-8">Executive Controls</h3>
                     <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group/btn">
                           <span className="text-[12px] font-bold">Launch Connection Request</span>
                           <ChevronRight size={16} className="text-white/20 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group/btn">
                           <span className="text-[12px] font-bold">Review Financial Nodes</span>
                           <ChevronRight size={16} className="text-white/20 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full mt-8 py-5 bg-[#E53935] rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-white hover:text-[#E53935] transition-all">
                           Terminate Session
                        </button>
                     </div>
                  </div>
               </div>

            </div>

            {/* MAIN DATA FEED (RIGHT) */}
            <div className="lg:col-span-8 space-y-8">
               
               {/* NAVIGATION TABS */}
               <div className="flex items-center gap-10 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
                  {["Overview", "Performance", "Connections", "Account"].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-4 text-[12px] font-black uppercase transition-all relative whitespace-nowrap",
                        activeTab === tab ? "text-[#E53935]" : "text-[#292828] hover:text-[#292828]"
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
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-[#292828]/10 shadow-xl shadow-slate-200/20 group hover:border-[#E53935]/20 transition-all duration-500">
                       <div className="flex items-center justify-between mb-8">
                          <div className="h-14 w-14 bg-[#292828]/5 rounded-2xl flex items-center justify-center text-[#E53935] group-hover:bg-[#E53935] group-hover:text-white transition-all duration-500 shadow-sm">
                             <met.icon size={22} />
                          </div>
                          <span className="text-3xl font-black text-[#292828]">{met.value}%</span>
                       </div>
                       <p className="text-[11px] font-black text-[#292828] uppercase mb-4">{met.label}</p>
                       <div className="h-2 w-full bg-[#292828]/5 rounded-full overflow-hidden border border-[#292828]/10 p-0.5">
                          <div 
                             className={cn("h-full rounded-full transition-all duration-1000", met.color)} 
                             style={{ width: `${met.value}%` }} 
                          />
                       </div>
                    </div>
                  ))}
               </div>

               {/* RECENT BUSINESS ACTIVITY */}
               <div className="bg-white rounded-[2.5rem] p-10 border border-[#292828]/10 shadow-xl shadow-slate-200/20">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xs font-black uppercase text-[#292828] flex items-center gap-2">
                        <Activity size={16} className="text-[#E53935]" /> Recent Internal Records
                     </h3>
                     <button className="text-[11px] font-black text-[#292828] uppercase hover:text-[#E53935] transition-colors">See Archive</button>
                  </div>
                  
                  <div className="space-y-10">
                     {[
                        { title: "Secured Strategic Partnership with Kerala Transit", time: "2 hours ago", node: "Logistics Node" },
                        { title: "Financial Verification Complete: Tier 1 Elite", time: "1 day ago", node: "Financial Hub" },
                        { title: "Profile Integrity Update Successful", time: "3 days ago", node: "System" },
                     ].map((item, i) => (
                        <div key={i} className="flex gap-6 relative group">
                           {i !== 2 && <div className="absolute left-1.5 top-8 bottom-[-24px] w-0.5 bg-[#292828]/10" />}
                           <div className="h-3 w-3 rounded-full bg-[#E53935] shadow-[0_0_10px_rgba(229,57,53,0.4)] mt-1.5 ring-4 ring-white relative z-10" />
                           <div className="flex-1">
                              <p className="text-[15px] font-bold text-[#292828] leading-tight group-hover:text-[#E53935] transition-colors">{item.title}</p>
                              <div className="flex items-center gap-4 mt-2">
                                 <span className="text-[10px] font-black text-[#292828] uppercase tracking-wider">{item.time}</span>
                                 <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                 <span className="text-[10px] font-black text-[#292828] uppercase tracking-wider">{item.node}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* EXECUTIVE FOOTNOTE */}
               <div className="p-10 bg-red-50/50 border border-red-100/50 rounded-[2.5rem] flex items-center justify-between">
                  <div className="flex items-center gap-5">
                     <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#E53935] shadow-sm shadow-red-500/10">
                        <Award size={24} />
                     </div>
                     <div>
                        <p className="text-[11px] font-black text-[#292828] uppercase">Top 12% Business Rank</p>
                        <p className="text-[13px] font-medium text-[#292828] no-italic">Your profile is currently in the elite high-performance bracket.</p>
                     </div>
                  </div>
                  <TrendingUp className="text-[#E53935] hidden md:block" size={32} />
               </div>

            </div>

         </div>
      </div>
    </div>
  );
}
