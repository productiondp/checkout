"use client";

import React, { useState } from "react";
import TerminalLayout from "@/components/layout/TerminalLayout";
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Users,
  Building2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState<"Partners" | "Businesses" | "Events">("Partners");

  return (
    <TerminalLayout>
      <div className="h-[calc(100vh-64px)] flex flex-col bg-white overflow-hidden selection:bg-[#E53935]/10">
        
        {/* HEADER / FILTERS */}
        <div className="p-6 border-b border-[#292828]/5 bg-white/80 backdrop-blur-xl z-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">Area <span className="text-[#E53935]">Discovery</span></h1>
              <p className="text-[10px] font-bold text-[#292828]/40 uppercase tracking-widest mt-1">Visualize your network node</p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-black/[0.05]">
              {(["Partners", "Businesses", "Events"] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={cn(
                    "px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    activeLayer === layer 
                      ? "bg-white text-black shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {layer}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                <input 
                  type="text" 
                  placeholder="Search Location..." 
                  className="h-11 pl-10 pr-6 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold outline-none focus:bg-white focus:border-[#E53935]/20 transition-all w-[240px]"
                />
              </div>
              <button className="h-11 w-11 bg-black text-white rounded-lg flex items-center justify-center hover:bg-[#E53935] transition-all">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* MAP VIEWPORT (SIMULATED) */}
        <div className="flex-1 relative bg-[#FBFBFD] overflow-hidden group">
          {/* SIMULATED GRID / MAP TEXTURE */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#292828_2px,transparent_2px)] [background-size:32px_32px]" />
          
          {/* MAP ELEMENTS */}
          <div className="absolute inset-0 p-20 flex items-center justify-center">
             {/* Center Point */}
             <div className="relative">
                <div className="h-32 w-32 rounded-full bg-[#E53935]/5 border-2 border-[#E53935]/20 animate-pulse flex items-center justify-center">
                   <div className="h-4 w-4 bg-[#E53935] rounded-full shadow-[0_0_20px_rgba(229,57,53,0.5)]" />
                </div>
                <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 whitespace-nowrap">
                   <p className="text-[10px] font-black uppercase text-black">Your Current Node</p>
                   <p className="text-[14px] font-bold text-[#E53935]">Trivandrum, Kerala</p>
                </div>
             </div>

             {/* Cluster 1 */}
             <div className="absolute top-1/4 left-1/3 group/pin cursor-pointer">
                <div className="h-12 w-12 bg-white rounded-xl shadow-2xl border border-black/5 flex items-center justify-center hover:scale-110 transition-transform">
                   <Users size={20} className="text-emerald-500" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/pin:opacity-100 transition-opacity bg-black text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase whitespace-nowrap pointer-events-none">
                   12 Partners Online
                </div>
             </div>

             {/* Cluster 2 */}
             <div className="absolute bottom-1/3 right-1/4 group/pin cursor-pointer">
                <div className="h-12 w-12 bg-white rounded-xl shadow-2xl border border-black/5 flex items-center justify-center hover:scale-110 transition-transform">
                   <Building2 size={20} className="text-blue-500" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/pin:opacity-100 transition-opacity bg-black text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase whitespace-nowrap pointer-events-none">
                   Technopark Hub
                </div>
             </div>
          </div>

          {/* MAP CONTROLS */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
             {[ZoomIn, ZoomOut, Navigation, Layers, Maximize2].map((Icon, i) => (
               <button key={i} className="h-11 w-11 bg-white border border-black/5 rounded-lg shadow-xl flex items-center justify-center text-black/40 hover:text-black hover:border-[#E53935]/20 transition-all">
                 <Icon size={18} />
               </button>
             ))}
          </div>

          {/* STATUS OVERLAY */}
          <div className="absolute bottom-8 left-8 p-6 bg-black text-white rounded-2xl shadow-2xl flex items-center gap-6 max-w-sm">
             <div className="h-12 w-12 bg-[#E53935] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <Sparkles size={24} />
             </div>
             <div>
                <p className="text-[9px] font-black uppercase text-white/40 leading-none mb-1.5">AI Insights</p>
                <p className="text-[12px] font-bold leading-tight">"3 high-potential logistics partners identified in your immediate 5km radius."</p>
             </div>
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
}
