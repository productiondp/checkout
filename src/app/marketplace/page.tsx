"use client";

import React, { useState, useMemo } from "react";
import { Search, ShoppingBag, Tag, MapPin, ArrowRight, TrendingUp, Filter, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

const MARKET_ITEMS = [
  { id: 1, name: "Coffee Machine", price: "₹85,000", category: "Shop Gear", loc: "Trivandrum", condition: "Like New", image: "https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "Office Desk & Chair", price: "₹12,400", category: "Furniture", loc: "Technopark", condition: "Used", image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "Web Agency Website", price: "₹2,50,000", category: "Digital", loc: "Remote", condition: "Active", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Laptop Apple Pro", price: "₹1,45,000", category: "Electronics", loc: "Kochi", condition: "Used", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop" },
];

export default function Marketplace() {
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showPostForm, setShowPostForm] = useState(false);
  const [requestedIds, setRequestedIds] = useState<number[]>([]);

  const filteredItems = useMemo(() => {
    return MARKET_ITEMS.filter(item => {
      const matchesCat = activeCat === "All" || item.category === activeCat;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCat, searchQuery]);

  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-white">
      <div className="flex-1 p-8 border-r border-slate-50">
         {showPostForm && (
           <div className="mb-10 p-8 bg-slate-900 text-white rounded-[2.5rem] animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                 <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center text-[#E53935] shrink-0">
                    <ShoppingBag size={40} />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-xl font-bold uppercase mb-2">Create New Ad</h3>
                    <p className="text-[12px] font-medium text-slate-400 mb-6 uppercase tracking-normal leading-relaxed">Sell your office gear or business assets to other people in the network.</p>
                    <div className="flex gap-3">
                       <button onClick={() => { setShowPostForm(false); alert("Listing features coming soon!"); }} className="px-6 py-3 bg-[#E53935] text-white rounded-xl font-bold text-[11px] uppercase tracking-normal shadow-lg transition-all">Publish Ad</button>
                       <button onClick={() => setShowPostForm(false)} className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold text-[11px] uppercase tracking-normal transition-all">Cancel</button>
                    </div>
                 </div>
              </div>
           </div>
         )}
         <div className="flex items-center justify-between px-2 mb-10">
            <div>
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Buy and <span className="text-[#E53935]">Sell</span></h2>
               <p className="text-[13px] text-slate-500 font-medium mt-1">Founders selling business items and tools</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center bg-slate-50 p-1 rounded-xl">
                  <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white shadow-sm text-[#E53935]" : "text-slate-400")}>
                    <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white shadow-sm text-[#E53935]" : "text-slate-400")}>
                    <List size={18} />
                  </button>
               </div>
            </div>
         </div>

         {/* Filters */}
         <div className="space-y-8 mb-10">
            <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search for tools, furniture or gear..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-slate-50 rounded-2xl px-12 py-4 text-[14px] outline-none border border-transparent focus:border-[#E53935]/20 transition-all font-medium"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
               {["All", "Shop Gear", "Furniture", "Digital", "Electronics"].map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setActiveCat(cat)}
                   className={cn(
                     "px-6 py-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap",
                     activeCat === cat 
                       ? "bg-[#E53935] text-white shadow-lg shadow-red-500/10" 
                       : "bg-white border border-slate-100 text-slate-500"
                   )}
                 >
                   {cat}
                 </button>
               ))}
            </div>
         </div>

         {/* Items List */}
         <div className={cn("gap-6", viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col")}>
            {filteredItems.map(item => (
              <div key={item.id} className={cn("bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group", viewMode === "list" ? "flex items-center gap-8 pr-10" : "flex flex-col")}>
                 <div className={cn("relative overflow-hidden bg-slate-100", viewMode === "list" ? "w-40 h-40 flex-shrink-0 rounded-2xl m-4" : "h-56")}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                       <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold shadow-sm">
                          {item.category}
                       </div>
                    </div>
                 </div>

                 <div className="p-8 flex-1">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-[17px] font-bold text-slate-900 group-hover:text-[#E53935] transition-colors">{item.name}</h3>
                       <p className="text-lg font-bold text-[#E53935]">{item.price}</p>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                       <div className="flex items-center gap-3 text-slate-500">
                          <MapPin size={16} />
                          <span className="text-[13px] font-medium">{item.loc}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-400">
                             {item.condition}
                          </span>
                       </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (requestedIds.includes(item.id)) {
                           setRequestedIds(requestedIds.filter(id => id !== item.id));
                           alert("Interest removed.");
                        } else {
                           setRequestedIds([...requestedIds, item.id]);
                           alert(`Request sent for ${item.name}! The owner will get back to you.`);
                        }
                      }}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold text-[11px] uppercase transition-all flex items-center justify-center gap-2",
                        requestedIds.includes(item.id)
                          ? "bg-green-100 text-green-600 shadow-none"
                          : "bg-slate-900 text-white hover:bg-[#E53935] shadow-lg shadow-slate-900/10"
                      )}
                    >
                       {requestedIds.includes(item.id) ? "Request Sent" : "Send Interest"} <ArrowRight size={16} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Market Panel */}
      <div className="w-full xl:w-[400px] p-10 space-y-10 bg-slate-50/50">
         <div className="bg-white rounded-[2rem] p-8 border border-slate-100 text-center shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-[#E53935] rounded-3xl flex items-center justify-center mx-auto mb-6">
               <ShoppingBag size={32} />
            </div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Have a listing?</h4>
            <h5 className="text-xl font-bold text-slate-900 mb-6 leading-tight">Post your own business tools for sale</h5>
            <button 
              onClick={() => setShowPostForm(true)}
              className="w-full py-4 border border-[#E53935] text-[#E53935] hover:bg-[#E53935] hover:text-white rounded-2xl font-bold text-[11px] uppercase transition-all"
            >
               Place An Ad Now
            </button>
         </div>

         <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 text-[#E53935] mb-8">
               <TrendingUp size={20} />
               <span className="text-[11px] font-bold uppercase tracking-normal">What's Selling</span>
            </div>
            <p className="text-2xl font-bold leading-tight mb-8">
               Notice: <span className="text-[#E53935]">Office Desks</span> are selling fast this week!
            </p>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-[#E53935]" style={{ width: '80%' }}></div>
            </div>
         </div>
      </div>
    </div>
  );
}
