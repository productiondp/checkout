"use client";

import React from "react";
import { Search, Filter, Map as MapIcon, List, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapControlsProps {
  viewMode: "map" | "list";
  setViewMode: (mode: "map" | "list") => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function MapControls({ 
  viewMode, 
  setViewMode, 
  isFilterOpen, 
  setIsFilterOpen,
  searchQuery,
  setSearchQuery
}: MapControlsProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row items-center gap-4 pointer-events-auto">
      <div className="relative w-full max-w-2xl group">
        <div className="absolute left-6 inset-y-0 flex items-center text-slate-300 group-focus-within:text-[#E53935] transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search people, skills, opportunities..."
          className="w-full h-16 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2rem] pl-16 pr-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] shadow-2xl transition-all"
        />
      </div>

      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl p-2 rounded-[2rem] border border-slate-100 shadow-2xl">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center transition-all",
            isFilterOpen ? "bg-[#E53935] text-white" : "text-[#292828] hover:bg-slate-50"
          )}
        >
          {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
        </button>
        <div className="h-6 w-[1px] bg-slate-100" />
        <div className="flex bg-slate-50 rounded-full p-1">
          <button 
            onClick={() => setViewMode("map")}
            className={cn(
              "h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              viewMode === "map" ? "bg-white text-[#292828] shadow-sm" : "text-slate-400 hover:text-[#292828]"
            )}
          >
            <MapIcon size={14} /> Map
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={cn(
              "h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              viewMode === "list" ? "bg-white text-[#292828] shadow-sm" : "text-slate-400 hover:text-[#292828]"
            )}
          >
            <List size={14} /> List
          </button>
        </div>
      </div>
    </div>
  );
}
