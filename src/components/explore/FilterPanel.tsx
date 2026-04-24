"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FilterPanel({ onClose }: { onClose: () => void }) {
  const [activeFilters, setActiveFilters] = useState<string[]>(["Profiles", "Requirements", "Communities"]);

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => 
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const sections = [
    {
      title: "Content Type",
      options: ["Profiles", "Requirements", "Communities"]
    },
    {
      title: "Intent",
      options: ["Hiring", "Requirements", "Collaboration", "Events"]
    },
    {
      title: "Match Threshold",
      options: ["> 90%", "> 75%", "> 50%", "All"]
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-end p-6 pointer-events-none">
       <div className="absolute inset-0 bg-[#292828]/20 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
       
       <div className="relative w-full max-w-md h-full bg-white rounded-[3rem] shadow-4xl pointer-events-auto flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-500">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
             <h2 className="text-2xl font-black text-[#292828] uppercase tracking-tighter">Discovery Filter</h2>
             <button onClick={onClose} className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center hover:rotate-90 transition-all"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
             {sections.map((section, idx) => (
               <div key={idx} className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{section.title}</h3>
                  <div className="flex flex-wrap gap-3">
                     {section.options.map(opt => {
                        const isActive = activeFilters.includes(opt);
                        return (
                          <button 
                            key={opt}
                            onClick={() => toggleFilter(opt)}
                            className={cn(
                              "px-6 h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border",
                              isActive 
                                ? "bg-[#292828] border-[#292828] text-white shadow-xl" 
                                : "bg-white border-slate-100 text-slate-400 hover:border-[#292828]/20 hover:text-[#292828]"
                            )}
                          >
                            {opt}
                            {isActive && <Check size={14} />}
                          </button>
                        );
                     })}
                  </div>
               </div>
             ))}

             <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Distance Radius</h3>
                <input 
                  type="range" 
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#E53935]" 
                  min="1" 
                  max="50" 
                />
                <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase">
                   <span>1km</span>
                   <span>50km</span>
                </div>
             </div>
          </div>

          <div className="p-10 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-4">
             <button className="h-16 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-[#292828] transition-all">Reset</button>
             <button onClick={onClose} className="h-16 bg-[#E53935] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all">Apply Filter</button>
          </div>
       </div>
    </div>
  );
}
