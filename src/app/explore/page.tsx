"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  UserPlus, 
  Check,
  LayoutGrid,
  List,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_BUSINESSES = [
    { id: 1, name: "Pixel Perfect", cat: "Design & Creative", loc: "Trivandrum", rating: 4.9, reviews: 124, tag: "Agency", verified: true },
    { id: 2, name: "Green Leaf", cat: "Food & Beverage", loc: "Indiranagar", rating: 4.8, reviews: 89, tag: "Wholesale", verified: true },
    { id: 3, name: "Swift Logi", cat: "Logistics", loc: "HSR Layout", rating: 4.5, reviews: 210, tag: "Delivery", verified: true },
    { id: 4, name: "Tech Wave", cat: "Software Dev", loc: "Whitefield", rating: 4.7, reviews: 67, tag: "Tech", verified: true },
    { id: 5, name: "Cloud Nine", cat: "Web Services", loc: "JP Nagar", rating: 4.6, reviews: 45, tag: "Cloud", verified: true },
    { id: 6, name: "Apex Legal", cat: "Legal Services", loc: "MG Road", rating: 4.8, reviews: 32, tag: "Corporate", verified: true },
];

const CATEGORIES = ["All", "Tech", "Design", "Food", "Marketing", "Legal", "Logistics"];

export default function Directory() {
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedIds, setConnectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "name">("rating");

  const filteredBusinesses = useMemo(() => {
    let result = INITIAL_BUSINESSES.filter(biz => {
      const matchesCat = activeCat === "All" || biz.cat.includes(activeCat);
      const matchesSearch = biz.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           biz.cat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return a.name.localeCompare(b.name);
    });
  }, [activeCat, searchQuery, sortBy]);

  const toggleConnect = (id: number) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(connectedIds.filter(cid => cid !== id));
    } else {
      setConnectedIds([...connectedIds, id]);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-full">
      
      {/* Center Store: Results Grid */}
      <div className="flex-1 p-8 border-r border-[#F1F3F4]">
           <div className="flex flex-col gap-8 mb-10">
              <div className="flex items-center justify-between px-2">
                 <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Directory</h2>
                    <p className="text-[13px] text-[#5F6368] font-medium mt-1">Search through verified businesses</p>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    {/* View Switcher */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                       <button 
                         onClick={() => setViewMode("grid")}
                         className={cn(
                           "p-2 rounded-lg transition-all",
                           viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                         )}
                       >
                          <LayoutGrid size={18} />
                       </button>
                       <button 
                         onClick={() => setViewMode("list")}
                         className={cn(
                           "p-2 rounded-lg transition-all",
                           viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                         )}
                       >
                          <List size={18} />
                       </button>
                    </div>

                    {/* Sort Selector */}
                    <div className="relative group">
                       <button className="flex items-center gap-3 px-4 py-2.5 bg-white border border-[#F2F5F7] rounded-xl text-[12px] font-bold text-[#5F6368] hover:text-primary transition-all">
                          <ArrowUpDown size={16} />
                          <span>Sort by {sortBy}</span>
                       </button>
                       <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#F2F5F7] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                          {(["rating", "reviews", "name"] as const).map(option => (
                            <button 
                              key={option}
                              onClick={() => setSortBy(option)}
                              className="w-full text-left px-5 py-3 text-[12px] font-bold hover:bg-slate-50 border-b border-slate-50 last:border-0"
                            >
                              Top {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Search for a business or service..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#F2F5F7] rounded-2xl px-12 py-3.5 text-[14px] outline-none border-2 border-transparent focus:border-primary/20 transition-all font-medium"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                 {CATEGORIES.map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setActiveCat(cat)}
                     className={cn(
                       "px-6 py-2.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap",
                       activeCat === cat 
                         ? "bg-primary text-white shadow-lg shadow-primary/20" 
                         : "bg-white border border-[#F1F3F4] text-[#5F6368] hover:text-slate-900"
                     )}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>

           {filteredBusinesses.length > 0 ? (
             <div className={cn(
               "gap-6",
               viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
             )}>
                {filteredBusinesses.map((biz) => (
                  <div key={biz.id} className={cn(
                    "bg-white rounded-[1.5rem] border border-[#F1F3F4] p-6 hover:shadow-sm transition-all group",
                    viewMode === "list" ? "flex items-center gap-8" : "flex flex-col"
                  )}>
                     <div className={cn(
                       "flex items-center gap-4",
                       viewMode === "list" ? "w-[300px]" : "mb-6"
                     )}>
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary transition-transform">
                           {biz.name[0]}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="text-[16px] font-bold text-[#202124] group-hover:text-primary transition-colors">{biz.name}</h3>
                              {biz.verified && <ShieldCheck size={14} className="text-primary" />}
                           </div>
                           <p className="text-[11px] font-bold text-primary uppercase tracking-wider">{biz.cat}</p>
                        </div>
                     </div>

                     <div className="flex-1 space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-[#5F6368]">
                           <MapPin size={16} />
                           <span className="text-[13px] font-medium">{biz.loc}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#5F6368]">
                           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-50 rounded-lg">
                              <Star size={14} className="text-yellow-500 fill-yellow-500" />
                              <span className="text-[12px] font-bold text-[#202124]">{biz.rating}</span>
                           </div>
                           <span className="text-[12px] font-medium text-[#5F6368]">{biz.reviews} Reviews</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-6 border-t border-[#F1F3F4]">
                        <button 
                          onClick={() => toggleConnect(biz.id)}
                          className={cn(
                            "flex items-center gap-2 text-[12px] font-bold px-6 py-2.5 rounded-xl transition-all w-full md:w-auto justify-center",
                            connectedIds.includes(biz.id) 
                              ? "bg-green-100 text-green-600" 
                              : "bg-primary text-white shadow-lg shadow-primary/10 hover:bg-black"
                          )}
                        >
                          {connectedIds.includes(biz.id) ? "Connected" : "Message"}
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-40 flex flex-col items-center justify-center text-slate-400">
                <Search size={64} className="mb-6 opacity-10" />
                <p className="text-[16px] font-bold italic uppercase tracking-widest">No results found</p>
             </div>
           )}
      </div>

      {/* Area Context Rail */}
      <div className="w-full xl:w-[400px] p-8 space-y-8 bg-[#FAFAFA]/50 overflow-y-auto no-scrollbar">
         <div className="space-y-6">
            <h4 className="text-[12px] font-bold text-[#5F6368] uppercase tracking-widest">Browse by Type</h4>
            <div className="grid grid-cols-2 gap-3">
               {["Agency", "Small Biz", "Verified", "Incubator", "Local"].map(tag => (
                 <button key={tag} className="px-4 py-3 bg-white border border-[#F1F3F4] rounded-2xl text-[11px] font-bold text-[#5F6368] text-left hover:border-primary hover:text-primary transition-all">
                   {tag}
                 </button>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
               <div className="flex items-center gap-3 text-primary mb-6">
                  <TrendingUp size={20} />
                  <span className="text-[13px] font-bold uppercase tracking-widest">Market Update</span>
               </div>
               <p className="text-[18px] font-bold leading-tight mb-8">
                  The <span className="text-primary italic">Education</span> sector is growing fast in your area!
               </p>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '70%' }}></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
