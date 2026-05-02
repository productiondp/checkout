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

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState<"Partners" | "Businesses" | "Events">("Partners");
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<maplibregl.Map | null>(null);

  React.useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [76.9467, 8.5241], // Trivandrum
      zoom: 12,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl({
      showCompass: false
    }), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <TerminalLayout>
      <div className="h-[calc(100vh-64px)] flex flex-col bg-[#0A0A0B] overflow-hidden selection:bg-[#E53935]/10">
        
        {/* HEADER / FILTERS */}
        <div className="p-6 border-b border-white/[0.03] bg-black/40 backdrop-blur-3xl z-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">Area <span className="text-[#E53935]">Discovery</span></h1>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Live Node: Trivandrum</p>
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
          {/* LIVE MAP CONTAINER */}
          <div ref={mapContainer} className="absolute inset-0 z-0" />
          
          {/* SIMULATED GRID TEXTURE (Overlay) */}
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#E53935_2px,transparent_2px)] [background-size:48px_48px] z-10 pointer-events-none" />
          
          {/* MAP OVERLAYS (Floating UI) */}
          <div className="absolute inset-0 pointer-events-none z-20">
             {/* Center Marker Placeholder (Since we don't have markers logic yet) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-4 w-4 bg-[#E53935] rounded-full shadow-[0_0_20px_rgba(229,57,53,0.8)] border-2 border-white/20 animate-pulse" />
             </div>
          </div>

          {/* STATUS OVERLAY */}
          <div className="absolute bottom-8 left-8 p-8 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] shadow-4xl flex items-center gap-8 max-w-md z-30 group/status overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/5 to-transparent opacity-0 group-hover/status:opacity-100 transition-opacity" />
             <div className="h-16 w-16 bg-[#E53935] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#E53935]/20 animate-pulse relative z-10">
                <Sparkles size={32} className="text-white" />
             </div>
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-[#E53935] tracking-widest leading-none mb-2.5">Neural Insights v4.1</p>
                <p className="text-[15px] font-medium text-white leading-tight tracking-tight">"Interactive Map API Active. High-density network activity identified across <span className="text-[#E53935] font-bold">Trivandrum</span>."</p>
             </div>
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
}
