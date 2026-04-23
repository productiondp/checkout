"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Zap, 
  Globe, 
  MapPin, 
  Plus, 
  Minus, 
  Target, 
  Navigation,
  ChevronRight,
  ArrowRight,
  UserPlus,
  TrendingUp,
  Clock,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_COMMUNITIES, MOCK_POSTS, MOCK_MAP_PEOPLE } from "@/data/communities";

export default function CheckoutMap({ searchQuery }: { searchQuery: string }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [showActiveZones, setShowActiveZones] = useState(true);

  // Combine entities for the map
  const entities = [
    ...MOCK_MAP_PEOPLE.map(p => ({ ...p, type: 'Person' })),
    ...MOCK_COMMUNITIES.map(c => ({ ...c, type: 'Community' })),
    ...MOCK_POSTS.map((p, i) => ({ ...p, type: 'Post', x: 20 + (i * 15), y: 25 + (i * 10) }))
  ].filter(e => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (e.name?.toLowerCase().includes(search)) ||
      (e.description?.toLowerCase().includes(search)) ||
      (e.author?.toLowerCase().includes(search)) ||
      (e.type?.toLowerCase().includes(search))
    );
  });

  const handleZoom = (delta: number) => setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const onMouseUp = () => setIsDragging(false);

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-[#F8FAFB] cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* MAP CANVAS */}
      <div 
        className="absolute inset-0 transition-transform duration-100 ease-out flex items-center justify-center"
        style={{ transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)` }}
      >
        <div className="relative w-[2000px] h-[2000px] pointer-events-none">
          {/* Schematic SVG Layer */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03] text-[#292828]" viewBox="0 0 1000 1000">
            <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
            <circle cx="500" cy="500" r="250" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
            <line x1="0" y1="500" x2="1000" y2="500" stroke="currentColor" strokeWidth="1" />
            <line x1="500" y1="0" x2="500" y2="1000" stroke="currentColor" strokeWidth="1" />
            {/* Hex Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Active Zones */}
          {showActiveZones && (
            <div className="absolute top-[35%] left-[45%] w-96 h-96 bg-[#E53935]/5 rounded-full blur-[80px] animate-pulse" />
          )}

          {/* Markers */}
          {entities.map((entity: any) => (
            <MapMarker 
              key={`${entity.type}-${entity.id}`} 
              entity={entity} 
              onClick={() => setSelectedEntity(entity)}
              isSelected={selectedEntity?.id === entity.id}
            />
          ))}
        </div>
      </div>

      {/* MAP CONTROLS (ZOOM/TARGET) */}
      <div className="absolute right-10 bottom-10 flex flex-col gap-4 z-50">
        <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
           <button onClick={() => handleZoom(0.2)} className="h-12 w-12 flex items-center justify-center hover:bg-slate-50 transition-all text-[#292828]"><Plus size={20} /></button>
           <div className="h-[1px] w-full bg-slate-50" />
           <button onClick={() => handleZoom(-0.2)} className="h-12 w-12 flex items-center justify-center hover:bg-slate-50 transition-all text-[#292828]"><Minus size={20} /></button>
        </div>
        <button 
          onClick={() => { setZoom(1); setOffset({x:0, y:0}); }}
          className="h-14 w-14 bg-white text-[#E53935] rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 hover:scale-110 active:scale-95 transition-all"
        >
          <Target size={24} />
        </button>
      </div>

      {/* BOTTOM SHEET */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 z-[110] transition-all duration-700 ease-in-out transform",
        selectedEntity ? "translate-y-0" : "translate-y-[calc(100%-80px)]"
      )}>
        <BottomSheet entity={selectedEntity} onClose={() => setSelectedEntity(null)} />
      </div>
    </div>
  );
}

function MapMarker({ entity, onClick, isSelected }: { entity: any, onClick: () => void, isSelected: boolean }) {
  const getColors = () => {
    switch (entity.type) {
      case 'Person': return 'bg-[#E53935]';
      case 'Community': return 'bg-[#292828]';
      case 'Post': return 'bg-[#3B82F6]';
      default: return 'bg-slate-400';
    }
  };

  const getIcon = () => {
    switch (entity.type) {
      case 'Person': return <Users size={16} />;
      case 'Community': return <Globe size={16} />;
      case 'Post': return <Zap size={16} />;
      default: return null;
    }
  };

  // Size logic based on match score
  const score = entity.matchScore || 80;
  const size = 32 + (score - 50) * 0.4;

  return (
    <div 
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
      style={{ left: `${entity.x}%`, top: `${entity.y}%` }}
      onClick={onClick}
    >
      {/* Ripple Effect */}
      <div className={cn(
        "absolute inset-0 rounded-full animate-ping opacity-20",
        getColors()
      )} style={{ padding: `${size / 2}px` }} />

      <div 
        className={cn(
          "relative flex items-center justify-center rounded-full text-white shadow-2xl transition-all duration-500 border-4 border-white group-hover:scale-125",
          getColors(),
          isSelected && "ring-4 ring-[#E53935]/30 scale-125"
        )}
        style={{ width: size, height: size }}
      >
        {getIcon()}
      </div>

      {/* Mini Label */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
         <div className="bg-[#292828] text-white text-[9px] font-black uppercase px-3 py-1 rounded-lg whitespace-nowrap shadow-xl">
            {entity.name || entity.author || "Mandate"}
         </div>
      </div>
    </div>
  );
}

function BottomSheet({ entity, onClose }: { entity: any, onClose: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (entity) setIsExpanded(true);
  }, [entity]);

  if (!entity) {
    return (
      <div className="bg-white/80 backdrop-blur-2xl rounded-t-[3rem] shadow-premium p-6 flex flex-col items-center">
         <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-6" />
         <div className="flex items-center gap-2 text-slate-300">
            <Sparkles size={16} />
            <p className="text-xs font-black uppercase tracking-widest">Select a node to view intelligence</p>
         </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-t-[4rem] shadow-premium p-10 lg:p-14 transition-all duration-700",
      isExpanded ? "max-h-[80vh] overflow-y-auto" : "max-h-40"
    )}>
      <div className="flex flex-col items-center mb-12">
        <button onClick={onClose} className="w-20 h-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all mb-4" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          <div className="flex items-start gap-8">
            <div className={cn(
              "h-24 w-24 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shrink-0",
              entity.type === 'Person' ? 'bg-[#E53935]' : entity.type === 'Community' ? 'bg-[#292828]' : 'bg-[#3B82F6]'
            )}>
              {entity.type === 'Person' ? <Users size={40} /> : entity.type === 'Community' ? <Globe size={40} /> : <Zap size={40} />}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                  entity.type === 'Person' ? 'bg-red-50 text-[#E53935]' : 'bg-slate-50 text-[#292828]'
                )}>
                  {entity.type}
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="text-xs font-black text-[#292828] uppercase">{entity.matchScore}% Match Score</span>
                </div>
              </div>
              <h2 className="text-4xl font-black text-[#292828] tracking-tight mb-2">{entity.name || entity.title || entity.author}</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {entity.role || entity.category || entity.type}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
             <button className="h-16 px-10 bg-[#292828] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-xl active:scale-95">
                {entity.type === 'Person' ? 'Connect' : entity.type === 'Community' ? 'Join Syndicate' : 'Apply'}
             </button>
             <button className="h-16 px-10 bg-white border border-slate-100 text-[#292828] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                View Profile
             </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
           <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935]">Intel Overview</h3>
              <p className="text-xl font-bold text-[#292828] leading-relaxed italic">
                 "{entity.description || "Synthesizing regional operational intelligence and high-authority business relationships."}"
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                {(entity.tags || ["Strategy", "Network", "Growth"]).map((tag: string) => (
                  <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase">{tag}</span>
                ))}
              </div>
           </div>

           <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
              <div className="flex items-center justify-between">
                 <h4 className="text-[11px] font-black uppercase text-[#292828]/40 tracking-widest">Mandate Protocol</h4>
                 <ShieldCheck size={18} className="text-emerald-500" />
              </div>
              <div className="space-y-4">
                 {[
                   { label: "Distance", value: "1.2km", icon: MapPin },
                   { label: "Active Since", value: "2h ago", icon: Clock },
                   { label: "Verification", value: "Executive", icon: ShieldCheck }
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-slate-400">
                         <stat.icon size={14} />
                         <span className="text-[10px] font-bold uppercase">{stat.label}</span>
                      </div>
                      <span className="text-xs font-black text-[#292828] uppercase">{stat.value}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#292828] hover:text-white transition-all shadow-sm">
                 Execute Mandate <ArrowRight size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
