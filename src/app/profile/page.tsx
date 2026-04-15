"use client";

import React, { useState } from "react";
import { 
  UserCircle, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  MessageSquare, 
  ThumbsUp,
  Zap,
  Briefcase,
  Share2,
  ChevronRight,
  Target,
  AlertCircle,
  BookOpen,
  BaggageClaim,
  FolderKanban,
  Flag
} from "lucide-react";
import { cn } from "@/lib/utils";

const ENDORSEMENTS = [
  { skill: "Reliable", count: 42, color: "bg-blue-50 text-blue-600" },
  { skill: "Expert Fixer", count: 28, color: "bg-green-50 text-green-600" },
  { skill: "Fast Delivery", count: 19, color: "bg-orange-50 text-orange-600" },
  { skill: "Strategy Lead", count: 12, color: "bg-purple-50 text-purple-600" },
];

const REVIEWS = [
  { id: 1, author: "Rahul Sethi", role: "Design Lead", text: "Ahmad is exceptionally reliable. Helped me fix a major UI bottleneck in 2 hours.", rating: 5, date: "2 days ago" },
  { id: 2, author: "Sana Maryam", role: "Business Owner", text: "Great communication and very clinical in his approach to problems.", rating: 5, date: "1 week ago" },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="flex flex-col xl:flex-row min-h-full bg-[#F8FAFB]">
      
      {/* Column 1: Identity & Professional Scoreboard */}
      <div className="w-full xl:w-[420px] p-10 border-r border-[#EBEFF1] bg-white flex flex-col h-full overflow-y-auto no-scrollbar">
         <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
               <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-2xl overflow-hidden mx-auto">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                  <ShieldCheck size={20} />
               </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-none mb-2">Ahmad Nur Fawaid</h2>
            <p className="text-[13px] font-bold text-primary uppercase tracking-widest mb-4">Fullstack Architect</p>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-[12px] font-medium">
               <MapPin size={14} />
               <span>Trivandrum, Kerala</span>
            </div>
         </div>

         <div className="space-y-6">
            {/* Trust & Knowledge HUD */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
               <div className="relative z-10">
                  <div className="flex justify-between items-end mb-8">
                     <div>
                        <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Expertise Score</p>
                        <p className="text-5xl font-black italic">95<span className="text-primary text-2xl">%</span></p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Level</p>
                        <p className="text-lg font-black text-white italic">Elite</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                     <div>
                        <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Projects Handled</p>
                        <p className="text-xl font-black">48 <span className="text-[10px] text-green-500">+4</span></p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Red Flags</p>
                        <p className="text-xl font-black text-red-500">0</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Experience Pulse */}
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Experience Meter</h4>
                  <span className="text-[10px] font-black text-primary uppercase">98th Percentile</span>
               </div>
               <div className="space-y-4">
                  <div>
                     <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5 uppercase">
                        <span>Project Success</span>
                        <span>100%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5 uppercase">
                        <span>Communication</span>
                        <span>94%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '94%' }}></div>
                     </div>
                  </div>
               </div>
            </div>

            <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[12px] uppercase shadow-lg hover:shadow-primary/20 transition-all">
               Update Expertise Profile
            </button>
         </div>
      </div>

      {/* Column 2: Content Rails */}
      <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
         
         <div className="flex gap-10 border-b border-slate-100 mb-10 px-4">
            {["Overview", "Reviews", "Endorsements", "Projects"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={cn("pb-4 text-[13px] font-black uppercase tracking-widest transition-all relative", activeTab === tab ? "text-primary" : "text-slate-400 hover:text-slate-700")}>
                 {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                 {tab}
              </button>
            ))}
         </div>

         {activeTab === 'Overview' && (
           <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* Profile Endorsements */}
              <div className="space-y-6">
                 <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Community Endorsements</h4>
                 <div className="flex flex-wrap gap-4">
                    {ENDORSEMENTS.map(end => (
                      <div key={end.skill} className={cn("px-6 py-4 rounded-2xl flex items-center gap-4 transition-transform hover:scale-105 cursor-default", end.color)}>
                         <ThumbsUp size={18} />
                         <div>
                            <p className="text-[13px] font-black leading-none mb-1">{end.skill}</p>
                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{end.count} people</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Red Flag Disclaimer (Safe) */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex items-center gap-6">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green-500 shadow-sm border border-slate-100">
                    <CheckCircle2 size={28} />
                 </div>
                 <div>
                    <h5 className="text-[15px] font-black text-slate-900 uppercase italic">Integrity Shield Active</h5>
                    <p className="text-[13px] text-slate-500 font-medium leading-tight mt-1">
                       Ahmad has <span className="text-green-600 font-bold underline">Zero Red Flags</span> reported. He is a high-trust member of the Trivandrum business community.
                    </p>
                 </div>
              </div>

              {/* Recent Reviews Summary */}
              <div className="space-y-6">
                 <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Verified Reviews</h4>
                 <div className="space-y-6">
                    {REVIEWS.map(rev => (
                      <div key={rev.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8">
                            <div className="flex gap-1 text-yellow-400">
                               {Array(rev.rating).fill(0).map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                            </div>
                         </div>
                         <div className="flex items-start gap-6 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                               <img src={`https://images.unsplash.com/photo-${rev.id % 2 === 0 ? '1438761681033-6461ffad8d80' : '1507003211169-0a1dd7228f2d'}?q=80&w=64`} alt="Reviewer" />
                            </div>
                            <div>
                               <h5 className="text-[16px] font-bold text-slate-900">{rev.author}</h5>
                               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{rev.role}</p>
                            </div>
                         </div>
                         <p className="text-[15px] text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6 italic">
                            "{rev.text}"
                         </p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
         )}
      </div>

      {/* Column 3: Professional Metadata Rail */}
      <div className="w-full xl:w-[400px] p-10 space-y-10 bg-[#FAFAFA]/50 overflow-y-auto no-scrollbar border-l border-[#EBEFF1]">
         <div className="space-y-8">
            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Performance Badges</h4>
            <div className="space-y-4">
               {[
                 { label: "Elite Architect", desc: "Top 95% Expertise", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
                 { label: "Clean Record", desc: "No red flags in 12 months", icon: Flag, color: "text-green-500", bg: "bg-green-50" },
                 { label: "Project Leader", desc: "Handled 40+ local units", icon: FolderKanban, color: "text-orange-500", bg: "bg-orange-50" },
               ].map(badge => (
                 <div key={badge.label} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-5 group shadow-sm">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", badge.bg, badge.color)}>
                       <badge.icon size={24} />
                    </div>
                    <div>
                       <p className="text-[13px] font-bold text-slate-900 leading-tight">{badge.label}</p>
                       <p className="text-[10px] text-slate-400 font-medium">{badge.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Ranking Context */}
         <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 text-center shadow-inner relative overflow-hidden">
            <TrendingUp size={32} className="text-primary mx-auto mb-6" />
            <h5 className="text-[18px] font-black text-slate-900 uppercase italic mb-8 tracking-tighter">City Ranking Progress</h5>
            <div className="w-44 h-44 border-8 border-slate-50 rounded-full mx-auto relative flex items-center justify-center">
               <div className="text-center">
                  <p className="text-5xl font-black text-primary italic leading-none">#14</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">In TVM Tech</p>
               </div>
               <div className="absolute inset-0 border-8 border-primary rounded-full border-t-transparent border-r-transparent -rotate-[120deg]"></div>
            </div>
            <p className="text-[11px] text-slate-400 font-bold mt-8 uppercase tracking-widest">Global Top 5%</p>
         </div>
      </div>
    </div>
  );
}
