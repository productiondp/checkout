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
      <div className="h-[calc(100vh-64px)] flex flex-col bg-[#0A0A0B] overflow-hidden selection:bg-[#E53935]/10">
        
        {/* HEADER / FILTERS */}
        <div className="p-6 border-b border-white/[0.03] bg-black/40 backdrop-blur-3xl z-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">Area <span className="text-[#E53935]">Discovery</span></h1>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Real-time Node: Trivandrum</p>
            </div>

            <div className="flex items-center gap-4 bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.05]">
              {(["Partners", "Businesses", "Events"] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={cn(
                    "px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    activeLayer === layer 
                      ? "bg-white text-black shadow-xl" 
                      : "text-white/30 hover:text-white"
                  )}
                >
                  {layer}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Search Location..." 
                  className="h-11 pl-10 pr-6 bg-white/[0.03] border border-transparent rounded-lg text-[11px] font-bold outline-none focus:bg-white/[0.08] focus:border-[#E53935]/20 text-white transition-all w-[240px]"
                />
              </div>
              <button className="h-11 w-11 bg-[#E53935] text-white rounded-lg flex items-center justify-center hover:bg-[#D32F2F] transition-all shadow-xl shadow-[#E53935]/10">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* MAP VIEWPORT */}
        <div className="flex-1 relative bg-black overflow-hidden group">
          {/* DARK MAP IMAGE BACKGROUND */}
          <div className="absolute inset-0 z-0">
             <img 
               src="/images/dark-map.png" 
               className="w-full h-full object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-[10s]" 
               alt="Dark Trivandrum Map" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
          </div>

          {/* SIMULATED GRID TEXTURE */}
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#E53935_2px,transparent_2px)] [background-size:48px_48px] z-1" />
          
          {/* MAP ELEMENTS */}
          <div className="absolute inset-0 p-20 flex items-center justify-center z-10">
             {/* Center Point */}
             <div className="relative">
                <div className="h-40 w-40 rounded-full bg-[#E53935]/10 border border-[#E53935]/30 animate-pulse flex items-center justify-center">
                   <div className="h-6 w-6 bg-[#E53935] rounded-full shadow-[0_0_40px_rgba(229,57,53,0.8)] border-2 border-white/20" />
                </div>
                <div className="absolute top-1/2 left-full ml-6 -translate-y-1/2 whitespace-nowrap">
                   <p className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none mb-2">Live Node Alpha</p>
                   <p className="text-[20px] font-bold text-white tracking-tighter">Trivandrum City</p>
                </div>
             </div>

             {/* Cluster 1 */}
             <div className="absolute top-1/4 left-1/3 group/pin cursor-pointer">
                <div className="h-14 w-14 bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex items-center justify-center hover:scale-110 hover:border-[#E53935]/40 transition-all duration-500">
                   <Users size={24} className="text-[#E53935]" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover/pin:opacity-100 transition-all duration-500 bg-white text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap pointer-events-none shadow-2xl">
                   12 Active Partners
                </div>
             </div>

             {/* Cluster 2 */}
             <div className="absolute bottom-1/3 right-1/4 group/pin cursor-pointer">
                <div className="h-14 w-14 bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex items-center justify-center hover:scale-110 hover:border-[#E53935]/40 transition-all duration-500">
                   <Building2 size={24} className="text-[#E53935]" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover/pin:opacity-100 transition-all duration-500 bg-white text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap pointer-events-none shadow-2xl">
                   Technopark Campus
                </div>
             </div>
          </div>

          {/* MAP CONTROLS */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
             {[ZoomIn, ZoomOut, Navigation, Layers, Maximize2].map((Icon, i) => (
               <button key={i} className="h-12 w-12 bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl shadow-2xl flex items-center justify-center text-white/40 hover:text-white hover:border-[#E53935]/40 transition-all">
                 <Icon size={20} />
               </button>
             ))}
          </div>

          {/* STATUS OVERLAY */}
          <div className="absolute bottom-8 left-8 p-8 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] shadow-4xl flex items-center gap-8 max-w-md z-30 group/status overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/5 to-transparent opacity-0 group-hover/status:opacity-100 transition-opacity" />
             <div className="h-16 w-16 bg-[#E53935] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#E53935]/20 animate-pulse relative z-10">
                <Sparkles size={32} className="text-white" />
             </div>
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-[#E53935] tracking-widest leading-none mb-2.5">Neural Insights v4.0</p>
                <p className="text-[15px] font-medium text-white leading-tight tracking-tight">"High-density network activity detected in <span className="text-[#E53935] font-bold">Kazhakkootam</span>. 4 new match potentials identified."</p>
             </div>
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
}
