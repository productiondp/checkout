"use client";

import React, { useState, useMemo } from "react";
import { Search, ShoppingBag, Tag, MapPin, ArrowRight, TrendingUp, Filter, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

const MARKET_ITEMS = [
  { id: 1, name: "Espresso Coffee Machine", price: "$1,200", category: "Equipment", loc: "Trivandrum", condition: "Like New", image: "/images/hero-event.jpg" },
  { id: 2, name: "Office Desk and Chairs", price: "$450", category: "Furniture", loc: "Technopark", condition: "Used", image: "/images/community-bg.jpg" },
  { id: 3, name: "Creative Agency Website", price: "$12,000", category: "Digital", loc: "Remote", condition: "Active", image: "/images/deal-1.jpg" },
  { id: 4, name: "Laptop Apple M2", price: "$2,100", category: "Electronics", loc: "Kochi", condition: "Used", image: "/images/hero-event.jpg" },
];

export default function Marketplace() {
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [requestedIds, setRequestedIds] = useState<number[]>([]);

  const filteredItems = useMemo(() => {
    return MARKET_ITEMS.filter(item => {
      const matchesCat = activeCat === "All" || item.category === activeCat;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCat, searchQuery]);

  return (
    <div className="flex flex-col xl:flex-row min-h-full">
      
      {/* Primary Market Engine */}
      <div className="flex-1 p-8 border-r border-[#F1F3F4]">
         <div className="flex items-center justify-between px-2 mb-10">
            <div>
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Buy and Sell</h2>
               <p className="text-[13px] text-[#5F6368] font-medium mt-1">Founders selling items and businesses</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-slate-400")}>
                    <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-slate-400")}>
                    <List size={18} />
                  </button>
               </div>
            </div>
         </div>

         {/* Search & Topic Filters */}
         <div className="space-y-8 mb-10">
            <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search for items, office space or tools..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-[#F2F5F7] rounded-2xl px-12 py-4 text-[14px] outline-none border-2 border-transparent focus:border-primary/20 transition-all font-medium"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
               {["All", "Equipment", "Furniture", "Digital", "Electronics"].map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setActiveCat(cat)}
                   className={cn(
                     "px-6 py-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap border",
                     activeCat === cat 
                       ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                       : "bg-white border-[#F2F5F7] text-[#5F6368] hover:text-slate-900"
                   )}
                 >
                   {cat}
                 </button>
               ))}
            </div>
         </div>

         {/* Items Stream */}
         <div className={cn(
           "gap-6",
           viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
         )}>
            {filteredItems.map(item => (
              <div key={item.id} className={cn(
                "bg-white rounded-[1.5rem] border border-[#F1F3F4] overflow-hidden hover:shadow-2xl transition-all duration-500 group",
                viewMode === "list" ? "flex items-center gap-8 pr-10" : "flex flex-col"
              )}>
                 {/* Visual HUD */}
                 <div className={cn(
                   "relative overflow-hidden bg-slate-100",
                   viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "h-56"
                 )}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                       <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold shadow-sm">
                          {item.category}
                       </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                       <div className="px-4 py-1.5 bg-primary text-white rounded-lg text-[13px] font-bold shadow-lg">
                          {item.price}
                       </div>
                    </div>
                 </div>

                 {/* Item Details */}
                 <div className="p-8 flex-1">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-[17px] font-bold text-slate-900 group-hover:text-primary transition-colors">{item.name}</h3>
                       <Tag size={16} className="text-slate-300" />
                    </div>
                    
                    <div className="space-y-3 mb-8">
                       <div className="flex items-center gap-3 text-[#5F6368]">
                          <MapPin size={16} />
                          <span className="text-[13px] font-medium">{item.loc}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                             Condition: {item.condition}
                          </span>
                       </div>
                    </div>

                    <button 
                      onClick={() => setRequestedIds(prev => [...prev, item.id])}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold text-[11px] uppercase transition-all flex items-center justify-center gap-2",
                        requestedIds.includes(item.id)
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-900 text-white hover:bg-primary shadow-xl"
                      )}
                    >
                       {requestedIds.includes(item.id) ? "Interested" : "View Details"} <ArrowRight size={16} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Market Info Rail */}
      <div className="w-full xl:w-[400px] p-10 space-y-10 bg-[#FAFAFA]/50">
         <div className="bg-white rounded-[2rem] p-8 border border-[#F1F3F4] text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
               <ShoppingBag size={32} />
            </div>
            <h4 className="text-[13px] font-bold text-slate-400 uppercase mb-2">Sell an Item</h4>
            <h5 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">Post your own items<br />for sale</h5>
            <button className="w-full py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl font-bold text-[11px] uppercase transition-all">
               Place an Ad
            </button>
         </div>

         <div className="bg-slate-900 rounded-[2rem] p-10 text-white">
            <div className="flex items-center gap-3 text-primary mb-10">
               <TrendingUp size={20} />
               <span className="text-[12px] font-bold uppercase tracking-widest">Market Update</span>
            </div>
            <p className="text-2xl font-bold leading-tight mb-8">
               Notice: <span className="text-primary italic">Office Furniture</span> is high in demand this week!
            </p>
         </div>
      </div>
    </div>
  );
}
