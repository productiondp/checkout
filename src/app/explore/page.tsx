"use client";
import React from "react";
import { Search, MapPin, Globe, ArrowRight, TrendingUp } from "lucide-react";
export default function ExplorePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white px-6 py-12 pb-40">
       <h1 className="text-4xl font-black text-slate-900 mb-2">Explore</h1>
       <p className="text-slate-500 font-medium mb-12">Discover MSMEs and business hubs across the network.</p>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {["Trivandrum City", "Kochi Node", "Bangalore Matrix"].map(node => (
             <div key={node} className="p-10 border border-slate-100 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:shadow-2xl transition-all group">
                <MapPin size={32} className="text-[#E53935] mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{node}</h3>
                <p className="text-slate-500 font-medium mb-8 uppercase text-[10px] tracking-widest">Active Market Node</p>
                <button className="w-full py-4 bg-slate-950 text-white rounded-2xl font-bold text-[11px] uppercase group-hover:bg-[#E53935] transition-all flex items-center justify-center gap-2">View Node <ArrowRight size={16} /></button>
             </div>
          ))}
       </div>
    </div>
  );
}
