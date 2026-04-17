"use client";
import React from "react";
import { Users, Search, MessageSquare, Globe, ArrowRight, Zap } from "lucide-react";
import { DUMMY_PROFILES } from "@/lib/dummyData";
import { cn } from "@/lib/utils";
export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white px-6 py-12 pb-40 lg:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
           <h1 className="text-4xl font-black text-slate-900 mb-2">Network Groups</h1>
           <p className="text-slate-500 font-medium text-lg">Collaborate in high-intensity industry clusters.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { name: "Technopark Logistics Node", members: "1.2k", topic: "Last-mile optimization", color: "bg-blue-500" },
          { name: "MSME Scale Hub", members: "4.8k", topic: "Growth capital & tenders", color: "bg-orange-500" },
          { name: "Manufacturing Matrix", members: "842", topic: "Raw material bulk buy", color: "bg-[#E53935]" },
          { name: "Creative Industries Cluster", members: "2.1k", topic: "UI/UX & Branding", color: "bg-purple-500" }
        ].map(group => (
          <div key={group.name} className="p-10 bg-white border border-slate-100 rounded-[3rem] hover:shadow-3xl hover:border-[#E53935]/10 transition-all group">
             <div className="flex items-center gap-6 mb-8">
                <div className={cn("h-20 w-20 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-slate-200", group.color)}>
                   <Users size={32} />
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-1">{group.name}</h3>
                   <p className="text-[12px] font-bold text-slate-400 capitalize">{group.members} Members • Active Now</p>
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl mb-8">
                <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Live discussion</p>
                <p className="text-[15px] font-bold text-slate-800 leading-relaxed italic">"How are we handling the new interstate shipping tariffs in the {group.topic} sector?"</p>
             </div>
             <button className="w-full py-5 bg-slate-950 text-white rounded-[1.5rem] font-bold text-[11px] uppercase group-hover:bg-[#E53935] transition-all flex items-center justify-center gap-2">Join Discussion <ArrowRight size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
