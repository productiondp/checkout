"use client";

import React from "react";
import { 
  Users, 
  Globe, 
  Zap, 
  TrendingUp, 
  ChevronRight, 
  MapPin, 
  UserPlus, 
  ShieldCheck,
  ArrowRight,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_COMMUNITIES, MOCK_POSTS, MOCK_MAP_PEOPLE } from "@/data/communities";

export default function MapListView({ searchQuery }: { searchQuery: string }) {
  // Combine and rank entities
  const entities = [
    ...MOCK_MAP_PEOPLE.map(p => ({ ...p, type: 'Person' })),
    ...MOCK_COMMUNITIES.map(c => ({ ...c, type: 'Community' })),
    ...MOCK_POSTS.map(p => ({ ...p, type: 'Post' }))
  ].filter(e => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      (e.name?.toLowerCase().includes(search)) ||
      (e.description?.toLowerCase().includes(search)) ||
      (e.author?.toLowerCase().includes(search)) ||
      (e.type?.toLowerCase().includes(search))
    );
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-40 space-y-8 overflow-y-auto h-full no-scrollbar">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-[#292828] uppercase tracking-tight">Ranked Node Intelligence</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Discovery prioritized by high structural match scores</p>
        </div>
        <div className="h-14 px-6 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase text-[#292828] shadow-sm">
           <span className="text-emerald-500 flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           {entities.length} Nodes Found
        </div>
      </div>

      {entities.map((entity: any) => (
        <ListViewCard key={`${entity.type}-${entity.id}`} entity={entity} />
      ))}

      {entities.length === 0 && (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
          <Search size={48} className="mx-auto text-slate-100 mb-6" />
          <p className="text-slate-400 font-bold uppercase tracking-widest">No matching nodes found in regional hub.</p>
        </div>
      )}
    </div>
  );
}

function ListViewCard({ entity }: { entity: any }) {
  const getIcon = () => {
    switch (entity.type) {
      case 'Person': return <Users size={24} />;
      case 'Community': return <Globe size={24} />;
      case 'Post': return <Zap size={24} />;
      default: return null;
    }
  };

  const getColors = () => {
    switch (entity.type) {
      case 'Person': return 'bg-red-50 text-[#E53935]';
      case 'Community': return 'bg-slate-50 text-[#292828]';
      case 'Post': return 'bg-blue-50 text-blue-600';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col md:flex-row items-start md:items-center gap-8">
      <div className={cn(
        "h-20 w-20 rounded-3xl flex items-center justify-center shadow-lg shrink-0",
        getColors()
      )}>
        {getIcon()}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className={cn(
            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
            getColors()
          )}>
            {entity.type}
          </span>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-[#292828] uppercase">{entity.matchScore}% Match</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-100 mx-1" />
          <div className="flex items-center gap-1.5 text-slate-300">
             <MapPin size={12} />
             <span className="text-[10px] font-bold uppercase">1.2km</span>
          </div>
        </div>

        <h3 className="text-2xl font-black text-[#292828] tracking-tight group-hover:text-[#E53935] transition-colors">
          {entity.name || entity.title || entity.author}
        </h3>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
          {entity.role || entity.category || "Professional Mandate"}
        </p>

        <p className="mt-6 text-[15px] font-semibold text-slate-400 leading-relaxed italic line-clamp-2">
           "{entity.description || "Active regional business expansion mandate focused on high-authority node creation."}"
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
        <button className="h-14 px-8 bg-[#292828] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
           {entity.type === 'Person' ? 'Connect' : entity.type === 'Community' ? 'Join' : 'Apply'}
           <ChevronRight size={14} />
        </button>
        <button className="h-14 px-8 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:border-slate-200 transition-all">
           Profile
        </button>
      </div>
    </div>
  );
}
