"use client";

import React from "react";
import Link from "next/link";
import { Settings, User, Bell, Shield, Smartphone, Globe, ArrowLeft, ChevronRight } from "lucide-react";

export default function SettingsHub() {
  const sections = [
    { icon: User, label: "Account Privacy", desc: "Manage who sees your node data" },
    { icon: Bell, label: "Simple Notifications", desc: "Control how you hear from people" },
    { icon: Shield, label: "Security & Safety", desc: "Two-factor and trusted devices" },
    { icon: Smartphone, label: "Mobile Experience", desc: "Refined dock and gesture settings" },
    { icon: Globe, label: "Regional Settings", desc: "Set your default business hub" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-[#E53935]/10 pb-40 lg:pb-0">
      <div className="max-w-[800px] mx-auto px-6 pt-16 lg:pt-24 pb-32">
        <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-[#292828]/40 hover:text-[#E53935] transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Profile
        </Link>
        
        <div className="flex items-center gap-6 mb-16">
           <div className="h-16 w-16 bg-[#292828] text-white rounded-[1.3rem] flex items-center justify-center shadow-2xl transition-transform hover:rotate-12">
              <Settings size={32} />
           </div>
           <div>
              <h1 className="text-4xl lg:text-5xl font-black text-[#292828] uppercase">Settings Hub</h1>
              <p className="text-[12px] font-black text-[#E53935] uppercase mt-2">Personalize Your Platform</p>
           </div>
        </div>

        <div className="space-y-4">
           {sections.map(s => (
             <button key={s.label} className="w-full bg-white border border-[#292828]/5 rounded-[1.625rem] p-8 flex items-center justify-between group hover:border-[#E53935]/20 hover:shadow-xl hover:shadow-slate-200/20 transition-all text-left">
                <div className="flex items-center gap-6">
                   <div className="h-14 w-14 bg-[#292828]/5 rounded-2xl flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all">
                      <s.icon size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-[#292828] uppercase">{s.label}</h3>
                      <p className="text-sm font-medium text-slate-400 mt-1">{s.desc}</p>
                   </div>
                </div>
                <ChevronRight size={20} className="text-[#292828]/20 group-hover:text-[#E53935] group-hover:translate-x-1 transition-all" />
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
