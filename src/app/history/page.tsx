"use client";
export const runtime = 'edge';

import React from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Calendar, User, Briefcase, TrendingUp } from "lucide-react";

export default function HistoryPage() {
  const activities: any[] = [];

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-[#E53935]/10 pb-40 lg:pb-0">
      <div className="max-w-[800px] mx-auto px-6 pt-16 lg:pt-24 pb-32">
        <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-[#292828]/40 hover:text-[#E53935] transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Profile
        </Link>
        
        <div className="flex items-center gap-6 mb-16">
           <div className="h-16 w-16 bg-[#292828] text-white rounded-[1.3rem] flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
              <Zap size={32} />
           </div>
           <div>
              <h1 className="text-4xl lg:text-5xl font-black text-[#292828] uppercase">My History</h1>
              <p className="text-[12px] font-black text-[#E53935] uppercase mt-2">Personal Business Activity</p>
           </div>
        </div>

        <div className="space-y-6">
           {activities.map((a, i) => (
             <div key={i} className="bg-white border border-[#292828]/5 rounded-[1.625rem] p-8 flex items-center justify-between group hover:border-[#E53935]/10 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-200/20">
                <div className="flex items-center gap-6">
                   <div className={`h-14 w-14 rounded-lg flex items-center justify-center ${a.bg} ${a.color} transition-transform group-hover:rotate-6`}>
                      <a.icon size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-[#292828] uppercase">{a.label}</h3>
                      <div className="flex items-center gap-3 mt-1.5 font-bold uppercase text-[10px]">
                         <span className="text-slate-200">{a.time}</span>
                         <span className="h-1 w-1 bg-slate-200 rounded-full" />
                         <span className="text-[#E53935]">{a.type}</span>
                      </div>
                   </div>
                </div>
                <div className="text-right hidden sm:block">
                   <p className="text-xl font-black text-[#292828] uppercase leading-none">{a.value}</p>
                   <p className="text-[10px] font-black text-slate-200 uppercase mt-1">Status</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}


