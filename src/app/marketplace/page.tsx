"use client";

import React, { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Tag, 
  ArrowRight, 
  Zap, 
  Target, 
  Plus, 
  CheckCircle2, 
  Filter, 
  LayoutGrid, 
  TrendingUp, 
  BadgeCheck,
  Package,
  Truck,
  Building2,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_MARKET } from "@/lib/dummyData";

export default function PremiumMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredItems = DUMMY_MARKET.filter(item => 
    (activeCategory === "All" || item.category === activeCategory) &&
    (item.item.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-white lg:bg-[#FDFDFF] selection:bg-[#E53935]/10 overscroll-none">
      
      {/* 1. CINEMATIC HEADER */}
      <div className="bg-slate-950 px-6 lg:px-12 py-12 lg:py-20 relative overflow-hidden">
         <div className="max-w-4xl relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <span className="h-[1px] w-12 bg-[#E53935]" />
               <span className="text-[11px] font-black text-[#E53935] uppercase tracking-[0.3em]">Wholesale Asset Hub</span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-white leading-tight mb-8 uppercase italic">Buy & <span className="text-[#E53935]">Sell</span> Units.</h1>
            <p className="text-white/50 text-xl font-medium max-w-2xl leading-relaxed mb-12">
               Direct procurement of raw materials, excess logistics capacity, and industrial assets across regional nodes.
            </p>
         </div>
         <ShoppingBag size={400} className="absolute -right-20 -bottom-20 text-white/[0.03] rotate-12" />
      </div>

      {/* 2. EXPLORATION HUB */}
      <div className="px-6 lg:px-12 py-10">
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
               {["All", "Industrial", "Logistics", "Tech", "Supply"].map(cat => (
                 <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                    activeCategory === cat ? "bg-[#E53935] border-[#E53935] text-white shadow-xl shadow-red-500/20" : "bg-white border-slate-100 text-slate-400 hover:text-slate-900"
                  )}
                 >
                    {cat}
                 </button>
               ))}
            </div>

            <div className="relative w-full lg:max-w-md">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
               <input 
                 type="text" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search wholesale assets..." 
                 className="w-full h-16 bg-white border border-slate-100 rounded-2xl pl-16 pr-6 text-[15px] font-bold outline-none focus:border-[#E53935]/20 focus:ring-8 focus:ring-red-500/5 shadow-2xl shadow-slate-200/20 transition-all" 
               />
            </div>
         </div>

         {/* WHOLESALE GRID */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-40">
            {filteredItems.map(item => (
              <div key={item.id} className="group bg-white border border-slate-100 rounded-[3.5rem] p-1.5 transition-all hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:border-[#E53935]/10 overflow-hidden">
                 <div className="h-64 relative rounded-[3rem] overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="" />
                    <div className="absolute top-6 right-6 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black uppercase text-[#E53935] shadow-lg border border-slate-100">{item.category}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                       <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-[#E53935] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">Fast Procurement</button>
                    </div>
                 </div>

                 <div className="p-8 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                       <Building2 size={14} className="text-slate-300" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Industrial Hub</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight uppercase italic mb-1 group-hover:text-[#E53935] transition-colors">{item.item}</h3>
                    <p className="text-[14px] font-bold text-slate-500 mb-6 flex items-center gap-2 italic">
                       Min Order: <span className="text-slate-900 not-italic uppercase">{item.cap} Units</span>
                    </p>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group-hover:bg-white transition-colors">
                       <div>
                          <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1 text-left">Unit Price</p>
                          <p className="text-[24px] font-black text-slate-900 leading-none">{item.price}</p>
                       </div>
                       <button className="h-12 w-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center hover:bg-[#E53935] transition-all shadow-xl active:scale-95">
                          <Plus size={24} />
                       </button>
                    </div>
                 </div>

                 <div className="px-8 pb-8 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <Truck size={14} className="text-[#E53935]" />
                       <span className="text-[10px] font-black text-slate-400 uppercase">Hub Delivery</span>
                    </div>
                    <div className="h-1 w-1 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-2">
                       <BadgeCheck size={14} className="text-blue-500" />
                       <span className="text-[10px] font-black text-slate-400 uppercase">Certified</span>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* 3. PROMOTION FOOTER */}
      <div className="mt-20 p-12 bg-slate-950 rounded-[4rem] text-white relative overflow-hidden group mx-6 lg:mx-12 mb-20">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-xl">
               <h3 className="text-3xl lg:text-5xl font-black mb-6 leading-tight uppercase italic">List your <span className="text-[#E53935]">Excess</span> Inventory.</h3>
               <p className="text-white/50 text-xl font-medium leading-relaxed">Turn your idle machinery or raw material stock into immediate liquidity across the node.</p>
            </div>
            <button className="px-12 py-6 bg-[#E53935] text-white rounded-[2rem] font-black text-[12px] uppercase shadow-4xl animate-pulse hover:animate-none active:scale-95 transition-all">Start Selling Now</button>
         </div>
         <Zap size={300} className="absolute -right-20 -bottom-20 text-white/[0.03] rotate-12 group-hover:scale-110 transition-transform duration-[4s]" />
      </div>

    </div>
  );
}
