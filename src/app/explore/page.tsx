"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  LayoutGrid,
  List,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_BUSINESSES = [
    { id: 1, name: "Pixel Perfect", cat: "Design", loc: "Trivandrum", rating: 4.9, reviews: 124, tag: "Agency", verified: true },
    { id: 2, name: "Green Leaf", cat: "Food & Drinks", loc: "Indiranagar", rating: 4.8, reviews: 89, tag: "Wholesale", verified: true },
    { id: 3, name: "Swift Logi", cat: "Delivery", loc: "HSR Layout", rating: 4.5, reviews: 210, tag: "Delivery", verified: true },
    { id: 4, name: "Tech Wave", cat: "Software", loc: "Whitefield", rating: 4.7, reviews: 67, tag: "Tech", verified: true },
    { id: 5, name: "Cloud Nine", cat: "Web Services", loc: "JP Nagar", rating: 4.6, reviews: 45, tag: "Cloud", verified: true },
    { id: 6, name: "Apex Legal", cat: "Law Services", loc: "MG Road", rating: 4.8, reviews: 32, tag: "Corporate", verified: true },
];

const CATEGORIES = ["All", "Tech", "Design", "Food", "Marketing", "Law", "Delivery"];

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

  const toggleConnect = (id: number, name: string) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(connectedIds.filter(cid => cid !== id));
      alert(`Message canceled for ${name}`);
    } else {
      setConnectedIds([...connectedIds, id]);
      alert(`Connecting to ${name}... Type your message now.`);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-white">
      
      {/* Main List Section */}
      <div className="flex-1 p-8 border-r border-slate-50">
           <div className="flex flex-col gap-8 mb-10">
              <div className="flex items-center justify-between px-2">
                 <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Search <span className="text-[#E53935]">Places</span></h2>
                    <p className="text-[13px] text-slate-500 font-medium mt-1">Find real, verified businesses near you</p>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl gap-1">
                       <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white text-[#E53935] shadow-sm" : "text-slate-400 hover:text-slate-600")}>
                          <LayoutGrid size={18} />
                       </button>
                       <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white text-[#E53935] shadow-sm" : "text-slate-400 hover:text-slate-600")}>
                          <List size={18} />
                       </button>
                    </div>

                    <div className="relative group">
                       <button className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-bold text-slate-500 hover:text-[#E53935] transition-all">
                          <ArrowUpDown size={16} />
                          <span className="capitalize">Sort: {sortBy}</span>
                       </button>
                       <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-50 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                          {(["rating", "reviews", "name"] as const).map(option => (
                            <button key={option} onClick={() => setSortBy(option)} className="w-full text-left px-5 py-3 text-[12px] font-bold hover:bg-slate-50 border-b border-slate-50 last:border-0">
                               Sort by {option}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex-1 relative">
                 <input 
                   type="text" 
                   placeholder="Search for a business, service or group..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-slate-50 rounded-2xl px-12 py-3.5 text-[14px] outline-none border border-transparent focus:border-[#E53935]/20 transition-all font-medium"
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                 {CATEGORIES.map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setActiveCat(cat)}
                     className={cn(
                       "px-6 py-2 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap",
                       activeCat === cat ? "bg-[#E53935] text-white shadow-lg shadow-red-500/10" : "bg-white border border-slate-100 text-slate-500"
                     )}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>

           {filteredBusinesses.length > 0 ? (
             <div className={cn("gap-6", viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col")}>
                {filteredBusinesses.map((biz) => (
                  <div key={biz.id} className={cn("bg-white rounded-[2rem] border border-slate-100 p-8 hover:shadow-xl transition-all group", viewMode === "list" ? "flex items-center gap-8" : "flex flex-col")}>
                     <div className={cn("flex items-center gap-4", viewMode === "list" ? "w-[260px]" : "mb-6")}>
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
                           <img src={`https://images.unsplash.com/photo-${1500000000000 + biz.id * 1000000}?q=80&w=128&auto=format&fit=crop`} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="text-[16px] font-bold text-slate-900 group-hover:text-[#E53935] transition-colors">{biz.name}</h3>
                              {biz.verified && <ShieldCheck size={14} className="text-[#E53935]" />}
                           </div>
                           <p className="text-[11px] font-bold text-[#E53935] uppercase tracking-normal">{biz.cat}</p>
                        </div>
                     </div>

                     <div className="flex-1 space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-slate-500">
                           <MapPin size={16} />
                           <span className="text-[13px] font-medium">{biz.loc}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-50 rounded-lg">
                              <Star size={14} className="text-yellow-500 fill-yellow-500" />
                              <span className="text-[12px] font-bold text-slate-900">{biz.rating}</span>
                           </div>
                           <span className="text-[12px] font-medium text-slate-400">{biz.reviews} Reviews</span>
                        </div>
                     </div>

                     <button 
                        onClick={() => toggleConnect(biz.id, biz.name)}
                        className={cn(
                          "flex items-center gap-2 text-[12px] font-bold px-8 py-3 rounded-xl transition-all",
                          connectedIds.includes(biz.id) ? "bg-green-100 text-green-600" : "bg-slate-900 text-white hover:bg-[#E53935]"
                        )}
                     >
                        {connectedIds.includes(biz.id) ? "Connected" : "Message"}
                     </button>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-20 flex flex-col items-center text-slate-300">
                <Search size={48} className="mb-4 opacity-10" />
                <p className="text-base font-bold uppercase">No results found</p>
             </div>
           )}
      </div>

      {/* Side Info Panel */}
      <div className="w-full xl:w-[360px] p-8 space-y-10 bg-slate-50/50">
         <div className="space-y-6">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-normal">Group by Type</h4>
            <div className="grid grid-cols-2 gap-3">
               {["Agency", "Small Shop", "Verified", "Expert", "Local"].map(tag => (
                 <button key={tag} onClick={() => setSearchQuery(tag)} className="px-4 py-3 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 text-left hover:border-[#E53935] hover:text-[#E53935] transition-all">
                   {tag}
                 </button>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
               <div className="flex items-center gap-2 text-[#E53935] mb-6">
                  <TrendingUp size={18} />
                  <span className="text-[11px] font-bold uppercase tracking-normal">Local Update</span>
               </div>
               <p className="text-lg font-bold leading-tight mb-8">
                  The <span className="text-[#E53935]">Food & Delivery</span> business is growing fast near you!
               </p>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E53935]" style={{ width: '75%' }}></div>
               </div>
               <p className="text-[10px] text-slate-500 mt-4 uppercase font-medium">Updated 2m ago</p>
            </div>
         </div>
         
         <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h5 className="text-lg font-bold text-slate-900 mb-2">Grow your business</h5>
            <p className="text-[12px] text-slate-500 mb-6 leading-relaxed">Join the network to get noticed by more people in your area.</p>
            <button className="w-full py-3 bg-slate-50 text-slate-900 border border-slate-900 rounded-xl font-bold text-xs uppercase hover:bg-slate-900 hover:text-white transition-all">Join Network Now</button>
         </div>
      </div>
    </div>
  );
}
