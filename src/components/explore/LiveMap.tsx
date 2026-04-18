"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Minus,
  MapPin, 
  Search, 
  Filter, 
  Users, 
  Briefcase, 
  Zap, 
  MessageSquare,
  Navigation,
  Globe,
  TrendingUp,
  X,
  ArrowUpRight,
  User,
  Compass
} from "lucide-react";

type MarkerType = "Meeting" | "Hiring" | "Business Leads" | "Partnership" | "Expo" | "Update";

interface Marker {
  id: string;
  x: number;
  y: number;
  type: MarkerType;
  title: string;
  author: string;
  distance: string;
  details: string;
}

const TRIVANDRUM_MARKERS: Marker[] = [];

export default function LiveMap({ posts }: { posts?: any[] }) {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [filter, setFilter] = useState<MarkerType | "All">("All");
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    // Hard lock scroll
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => { 
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset"; 
    };
  }, []);

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.4), 4));
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const markers = posts ? posts.map((post, i) => ({
    id: post.id.toString(),
    type: post.type as MarkerType,
    title: post.type === 'Business Leads' ? 'Project Prospect' : 
           post.type === 'Hiring' ? 'Open Mandate' : post.content.substring(0, 20) + "...",
    author: post.author,
    details: post.content,
    distance: `${(i * 1.2).toFixed(1)}km`,
    x: 25 + (i * 14.5) % 60,
    y: 30 + (i * 11.2) % 50
  })) : TRIVANDRUM_MARKERS;

  const filteredMarkers = filter === "All" 
    ? markers 
    : (markers as Marker[]).filter(m => m.type === filter);

  return (
    <div 
      className="relative w-full h-[100dvh] overflow-hidden font-sans select-none bg-[#F8FAFC]"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      
      {/* 1. MAP VISUALIZATION LAYER */}
      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out flex items-center justify-center pointer-events-none"
        style={{ 
          transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div className="relative w-[1200px] h-[1200px] pointer-events-auto">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[radial-gradient(#292828_1.5px,transparent_1.5px)] [background-size:40px_40px]" />
          </div>

          {/* TRIVANDRUM SVG MAP */}
          <svg className="absolute inset-0 w-full h-full text-[#292828] group-hover:text-blue-500 transition-colors duration-1000" viewBox="0 0 1000 1000" fill="none">
             <path d="M0,0 L300,0 C320,100 280,300 350,500 C400,700 320,850 300,1000 L0,1000 Z" fill="#E2E8F0" fillOpacity="0.6" />
             <path d="M300,0 C320,100 280,300 350,500 C400,700 320,850 300,1000" stroke="currentColor" strokeWidth="4" strokeOpacity="0.4" strokeDasharray="10 5" />
             <path d="M350,200 L900,200 M350,400 L900,400 M350,600 L900,600 M350,800 L900,800" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
             <path d="M500,0 L500,1000 M700,0 L700,1000" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
          </svg>

          {/* 2. ACTIVITY NODES */}
          {filteredMarkers.map((marker) => (
            <div 
              key={marker.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
              <div className={`absolute inset-0 -m-6 rounded-full animate-ping opacity-20 duration-[3s] ${
                marker.type === "Jobs" ? "bg-blue-500" : 
                marker.type === "Business Leads" ? "bg-red-500" :
                marker.type === "Meets" ? "bg-green-500" : "bg-amber-500"
              }`} />
              
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedMarker(marker); }}
                className={`relative z-10 w-6 h-6 rounded-full border-4 border-white shadow-2xl transition-all hover:scale-125 active:scale-90 ${
                  marker.type === "Jobs" ? "bg-blue-600" : 
                  marker.type === "Business Leads" ? "bg-red-600" :
                  marker.type === "Meets" ? "bg-green-600" : "bg-amber-600"
                }`}
              >
                 <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse" />
              </button>

              <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase whitespace-nowrap shadow-xl text-[#292828]">
                {marker.author}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. RESPONSIVE FLOATING UI */}
      
      {/* Search & Filter Hub (Bottom) */}
      <div className="absolute bottom-4 lg:bottom-10 left-4 right-4 lg:left-10 lg:right-10 flex flex-col gap-3 lg:gap-5 z-50 pointer-events-none">
         <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto pointer-events-auto">
            <div className="relative group w-full lg:w-96 shadow-2xl">
               <div className="absolute left-6 inset-y-0 flex items-center gap-3 pointer-events-none">
                  <Search className="text-[#292828]/40" size={18} />
                  <div className="h-4 w-[1px] bg-slate-200" />
               </div>
               <input 
                 type="text" 
                 placeholder="Find people or business leads..."
                 className="w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl lg:rounded-[0.975rem] py-3 lg:py-5 pl-12 lg:pl-16 pr-6 lg:pr-8 text-[13px] lg:text-[15px] font-bold text-[#292828] outline-none ring-0 focus:border-[#E53935] transition-all"
               />
            </div>
            
            <div className="flex bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl lg:rounded-[0.975rem] p-1.5 shadow-2xl overflow-x-auto scrollbar-hide no-scrollbar">
               {["All", "Meeting", "Hiring", "Business Leads", "Partnership", "Expo"].map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setFilter(cat as any)}
                   className={`px-6 h-12 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                     filter === cat ? "bg-[#E53935] text-white shadow-xl shadow-red-500/20" : "bg-white border border-[#292828]/10 text-[#292828] hover:bg-slate-50"
                   }`}
                 >
                    {cat}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Navigation Controls (Side/Bottom) */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-50 items-end">
         <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-2 rounded-2xl shadow-2xl flex flex-col gap-1">
           <button onClick={() => handleZoom(0.25)} className="h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center rounded-xl text-[#292828] hover:bg-[#292828] hover:text-white transition-all"><Plus size={20} /></button>
           <button onClick={() => handleZoom(-0.25)} className="h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center rounded-xl text-[#292828] hover:bg-[#292828] hover:text-white transition-all"><Minus size={20} /></button>
         </div>
         <button 
           onClick={() => { setZoom(1); setOffset({x:0, y:0}); }}
           className="h-12 w-12 lg:h-16 lg:w-16 bg-[#E53935] text-white rounded-2xl lg:rounded-[0.975rem] flex items-center justify-center shadow-4xl hover:scale-105 active:scale-95 transition-all"
         >
           <Navigation size={24} fill="currentColor" className="rotate-45" />
         </button>
      </div>

      {/* 4. DETAIL OVERLAY / BOTTOM SHEET */}
      {selectedMarker && (
         <div className="absolute inset-x-4 bottom-4 lg:inset-x-auto lg:bottom-10 lg:right-10 lg:w-[440px] z-[60] animate-in slide-in-from-bottom-5 lg:slide-in-from-right-10 duration-500">
            <div className="bg-white/95 border-2 border-[#292828]/10 rounded-[1.3rem] lg:rounded-[1.95rem] p-6 lg:p-10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.15)] relative overflow-hidden backdrop-blur-2xl">
               <button onClick={() => setSelectedMarker(null)} className="absolute top-6 lg:top-10 right-6 lg:right-10 text-[#292828] hover:text-[#E53935]"><X className="w-5 h-5 lg:w-6 lg:h-6" /></button>
               
               <div className="flex items-start gap-5 lg:gap-8 mb-6 lg:mb-10">
                  <div className={`h-14 w-14 lg:h-20 lg:w-20 min-w-[56px] lg:min-w-[80px] rounded-2xl lg:rounded-3xl flex items-center justify-center text-white shadow-xl ${
                    selectedMarker.type === "Jobs" ? "bg-blue-600" : 
                    selectedMarker.type === "Business Leads" ? "bg-red-600" :
                    selectedMarker.type === "Meets" ? "bg-green-600" : "bg-amber-600"
                  }`}>
                    {selectedMarker.type === "Jobs" && <Briefcase className="w-6 h-6 lg:w-8 lg:h-8" />}
                    {selectedMarker.type === "Business Leads" && <Zap className="w-6 h-6 lg:w-8 lg:h-8" />}
                    {selectedMarker.type === "Meets" && <MessageSquare className="w-6 h-6 lg:w-8 lg:h-8" />}
                    {selectedMarker.type === "Social" && <User className="w-6 h-6 lg:w-8 lg:h-8" />}
                  </div>
                  <div className="pr-8">
                    <span className="text-[9px] lg:text-[10px] font-black uppercase text-[#E53935]">{selectedMarker.type}</span>
                    <h3 className="text-xl lg:text-3xl font-black text-[#292828] leading-tight mt-1">{selectedMarker.title}</h3>
                    <p className="text-[#292828] font-bold text-xs lg:text-sm mt-1">{selectedMarker.author}</p>
                  </div>
               </div>
               
               <p className="text-xs lg:text-base font-medium leading-relaxed text-[#292828] mb-6 lg:mb-10 line-clamp-2 lg:line-clamp-none">{selectedMarker.details}</p>
               
               <div className="flex gap-2 lg:gap-4">
                  <button className="flex-1 py-4 lg:py-5 bg-[#292828] text-white rounded-xl lg:rounded-[0.975rem] font-black text-[11px] lg:text-[13px] uppercase hover:bg-[#E53935] transition-all">Connect</button>
                  <Link href={`/profile/${parseInt(selectedMarker.id) + 1}`} className="flex-1">
                     <button className="w-full px-5 lg:px-8 py-4 lg:py-5 bg-white border border-slate-200 text-[#292828] rounded-xl lg:rounded-[0.975rem] font-black text-[11px] lg:text-[13px] uppercase hover:bg-[#292828]/5 transition-all">View Profile</button>
                  </Link>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}
