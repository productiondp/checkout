"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Star, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  MessageSquare, 
  Zap, 
  Search, 
  SlidersHorizontal,
  Target,
  LayoutGrid,
  List,
  MoreHorizontal,
  Flag,
  UserX,
  UserMinus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_PROFILES } from "@/lib/dummyData";

const PartnerCard = ({ p, viewMode }: { p: any, viewMode?: "grid" | "list" }) => {
  const [isBlocked, setIsBlocked] = useState(false);

  if (isBlocked) {
    return (
      <div className={cn(
        "bg-slate-50 border border-slate-200 p-8 opacity-50 grayscale select-none flex items-center justify-center transition-all",
        viewMode === "list" ? "rounded-[1.95rem] h-full min-h-[160px]" : "rounded-[2.6rem] h-full min-h-[400px] flex-col"
      )}>
        <div className="flex flex-col items-center text-center gap-3">
            <UserX size={32} className="text-slate-400" />
            <div>
               <h3 className="text-xl font-black text-slate-500 uppercase">{p.name}</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Profile Blocked</p>
            </div>
            <button onClick={() => setIsBlocked(false)} className="px-6 py-2 bg-slate-200 text-slate-600 rounded-full font-bold text-[10px] uppercase hover:bg-slate-300 transition-colors mt-2">Unblock</button>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="group bg-white border border-[#292828]/10 rounded-[1.95rem] p-8 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center justify-between gap-10 relative">
         <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#E53935] opacity-0 group-hover:opacity-100 transition-opacity rounded-l-[1.95rem]" />
         <div className="flex items-center gap-10 flex-1 min-w-0">
            <div className="h-24 w-24 rounded-3xl overflow-hidden border-2 border-[#292828]/5 shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
               <img src={p.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
               <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-2xl font-black text-[#292828] uppercase truncate group-hover:text-[#E53935] transition-colors">{p.name}</h3>
                  <div className={cn(
                     "px-3 py-1 rounded-lg text-[9px] font-black uppercase",
                     p.id % 3 === 0 ? "bg-slate-900 text-white" : 
                     p.id % 3 === 1 ? "bg-amber-400 text-amber-950" : 
                     "bg-slate-100 text-slate-600"
                  )}>
                     {p.id % 3 === 0 ? "Diamond" : p.id % 3 === 1 ? "Gold" : "Silver"} Member
                  </div>
                  <ShieldCheck size={22} className="text-blue-500 shrink-0" />
                  <div className="px-5 py-2 bg-green-50 text-green-600 border border-green-100 rounded-2xl text-[14px] font-black uppercase shrink-0 shadow-sm">{p.match}% Match</div>
               </div>
               <p className="text-[13px] font-black text-[#292828]/40 uppercase mb-6 truncate">{p.role} @ {p.company}</p>
               <div className="flex items-center gap-6 text-[14px] font-bold text-[#292828]">
                  <span className="flex items-center gap-2.5 px-4 py-2 bg-[#292828]/5 rounded-xl"><MapPin size={16} className="text-[#E53935]" /> {p.city}</span>
                  <span className="flex items-center gap-2.5 px-4 py-2 bg-green-50 text-green-700 rounded-xl"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Connected</span>
               </div>
            </div>
         </div>
         <div className="flex gap-3 shrink-0 items-center">
            <Link href={`/profile/${p.id}`} className="px-8 h-12 md:h-16 flex items-center justify-center bg-[#292828] text-white rounded-[0.975rem] font-black text-[12px] uppercase shadow-2xl hover:bg-[#E53935] active:scale-95 transition-all">View Profile</Link>
            <Link href={`/chat?user=${p.id}`} className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center bg-[#292828]/5 rounded-[0.975rem] text-[#292828] hover:bg-[#292828]/10 hover:shadow-xl transition-all"><MessageSquare size={24} /></Link>
            <div className="relative group/menu">
               <button className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center text-[#292828]/40 hover:text-[#292828] hover:bg-slate-50 rounded-[0.975rem] transition-all">
                  <MoreHorizontal size={24} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 overflow-hidden translate-y-2 group-hover/menu:translate-y-0 text-[13px] font-bold text-[#292828]">
                  <button className="w-full text-left px-5 py-3.5 hover:bg-slate-50 flex items-center gap-3"><UserMinus size={16} className="text-slate-400" /> Disconnect</button>
                  <button className="w-full text-left px-5 py-3.5 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3"><Flag size={16} className="text-orange-400" /> Report Profile</button>
                  <div className="h-px bg-slate-100 w-full" />
                  <button onClick={() => setIsBlocked(true)} className="w-full text-left px-5 py-3.5 hover:bg-red-50 hover:text-red-600 flex items-center gap-3"><UserX size={16} className="text-red-500" /> Block User</button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border border-[#292828]/10 rounded-[2.6rem] transition-all duration-700 hover:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.2)] hover:border-[#E53935]/30 flex flex-col h-full">
       <div className="absolute inset-0 rounded-[2.6rem] overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-red-50 transition-colors duration-700" />
       </div>
       
       <div className="p-8 relative z-10 flex flex-col h-full">
          <div className="absolute top-6 right-6 z-20">
             <div className="relative group/menu">
                <button className="h-10 w-10 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full shadow-sm border border-slate-100 text-[#292828]/40 hover:text-[#292828] hover:bg-white transition-all">
                   <MoreHorizontal size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 overflow-hidden translate-y-2 group-hover/menu:translate-y-0 text-[13px] font-bold text-[#292828]">
                   <button className="w-full text-left px-5 py-3.5 hover:bg-slate-50 flex items-center gap-3"><UserMinus size={16} className="text-slate-400" /> Disconnect</button>
                   <button className="w-full text-left px-5 py-3.5 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3"><Flag size={16} className="text-orange-400" /> Report</button>
                   <div className="h-px bg-slate-100 w-full" />
                   <button onClick={() => setIsBlocked(true)} className="w-full text-left px-5 py-3.5 hover:bg-red-50 hover:text-red-600 flex items-center gap-3"><UserX size={16} className="text-red-500" /> Block</button>
                </div>
             </div>
          </div>
          <div className="flex justify-between items-start mb-6">
             <div className="relative">
                <div className="h-28 w-28 rounded-[1.625rem] overflow-hidden p-1 bg-white border border-[#292828]/5 shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                   <img src={p.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-[#292828]/5 group-hover:scale-110 transition-transform">
                   <div className={cn(
                     "h-3 w-3 rounded-full",
                     p.id % 2 === 0 ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" : "bg-slate-300"
                   )} />
                </div>
             </div>
             <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2 px-6 py-2 bg-[#292828] text-white rounded-full text-[15px] font-black group-hover:bg-[#E53935] transition-all">
                   <TrendingUp size={16} /> {p.match}%
                </div>
                <div className={cn(
                   "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border shadow-sm",
                   p.id % 3 === 0 ? "bg-slate-900 border-white/20 text-white shadow-blue-500/20" : 
                   p.id % 3 === 1 ? "bg-amber-400 border-amber-500 text-amber-950 shadow-amber-500/20" : 
                   "bg-slate-100 border-slate-200 text-slate-600"
                )}>
                   {p.id % 3 === 0 ? "Diamond" : p.id % 3 === 1 ? "Gold" : "Silver"} Member
                </div>
             </div>
          </div>

          <div className="mb-6">
             <div className="flex items-center gap-3 mb-1">
               <h3 className="text-xl font-black text-[#292828] uppercase group-hover:text-[#E53935] transition-colors leading-tight truncate">{p.name}</h3>
               <ShieldCheck size={18} className="text-blue-500 shrink-0" />
             </div>
             <p className="text-[11px] font-black text-[#292828]/40 uppercase mb-4">{p.role} @ {p.company}</p>
             
             <div className="flex flex-wrap gap-2">
                <div className="h-9 px-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-[12px] font-bold text-[#292828]">
                   <MapPin size={12} className="text-[#E53935]" /> {p.city}
                </div>
                <div className="h-9 px-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-[12px] font-bold text-green-700">
                   <Zap size={12} /> Verified
                </div>
             </div>
          </div>

          <div className="p-6 bg-slate-50/50 rounded-[1.3rem] border border-[#292828]/5 mb-8 group-hover:bg-white transition-all duration-500 relative overflow-hidden flex-1">
             <div className="absolute top-0 right-0 w-1 bg-[#E53935] h-0 group-hover:h-full transition-all duration-700" />
             <p className="text-[9px] font-black text-[#292828]/30 uppercase mb-3">About</p>
             <p className="text-[14px] font-medium text-slate-600 leading-relaxed line-clamp-2">
               Looking to grow my business and build meaningful connections with other professionals.
             </p>
          </div>

          <div className="flex gap-3">
             <Link href={`/profile/${p.id}`} className="flex-1 h-14 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-[#E53935] active:scale-95 transition-all flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(41,40,40,0.3)]">
                Connect <ArrowRight size={16} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link href={`/chat?user=${p.id}`} className="h-14 w-14 flex items-center justify-center bg-slate-50 rounded-2xl text-[#292828] border border-[#292828]/5 hover:bg-white hover:shadow-xl hover:text-[#E53935] transition-all">
                <MessageSquare size={20} />
             </Link>
          </div>
       </div>
    </div>
  );
};

const CompactSuggestedCard = ({ p }: { p: any }) => (
  <div className="min-w-[85vw] md:min-w-[400px] lg:min-w-[calc(33.333%-1.5rem)] bg-white border border-[#292828]/10 rounded-[1.625rem] p-6 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-[#E53935]/30 snap-start flex gap-6 items-center group relative overflow-hidden cursor-pointer">
     <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#E53935] opacity-0 group-hover:opacity-100 transition-opacity rounded-l-[1.625rem]" />
     <div className="h-20 w-20 rounded-3xl overflow-hidden border-2 border-[#292828]/5 shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
        <img src={p.avatar} alt="" className="w-full h-full object-cover" />
     </div>
     <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
           <h3 className="text-lg font-black text-[#292828] uppercase truncate group-hover:text-[#E53935] transition-colors">{p.name}</h3>
           <div className="flex items-center gap-1.5 px-3 py-1 bg-[#292828] text-white rounded-lg text-[11px] font-black group-hover:bg-[#E53935] transition-all shrink-0">
              <TrendingUp size={12} /> {p.match}%
           </div>
        </div>
        <p className="text-[11px] font-black text-[#292828]/40 uppercase mb-4 truncate">{p.role}</p>
        <div className="flex items-center gap-2">
           <div className={cn(
              "px-3 py-1 rounded-lg text-[9px] font-black uppercase border shadow-sm",
              p.id % 3 === 0 ? "bg-slate-900 border-white/20 text-white" : 
              p.id % 3 === 1 ? "bg-amber-400 border-amber-500 text-amber-950" : 
              "bg-slate-100 border-slate-200 text-slate-600"
           )}>
              {p.id % 3 === 0 ? "Diamond" : p.id % 3 === 1 ? "Gold" : "Silver"}
           </div>
           <span className="px-3 py-1 bg-[#292828]/5 text-[#292828] rounded-lg text-[9px] font-black uppercase truncate max-w-[120px]">
              {p.city}
           </span>
        </div>
     </div>
     <button className="h-12 w-12 flex items-center justify-center bg-[#292828]/5 rounded-full text-[#292828] group-hover:bg-[#292828] group-hover:text-white transition-all shrink-0">
        <ArrowRight size={18} className="group-hover:-rotate-45 transition-transform" />
     </button>
  </div>
);

export default function BusinessNetworkPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Best Match");
  const [displayCount, setDisplayCount] = useState(12);

  const filtered = DUMMY_PROFILES.slice(0, 40).filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] relative overflow-x-hidden selection:bg-[#E53935]/10">
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#292828]/5 rounded-full blur-[120px]" />
      </div>

      {/* PAGE HEADER */}
      <div className="relative z-20 px-6 lg:px-12 pt-16 pb-8">
         <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-[#292828]/5 pb-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-2xl">
                             <img src={`https://i.pravatar.cc/150?u=${i+30}`} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                     </div>
                     <span className="text-[10px] font-black text-[#E53935] uppercase animate-pulse">420+ Members Online</span>
                  </div>
                  <h1 className="text-4xl lg:text-7xl font-black text-[#292828] uppercase flex items-center gap-4">
                     Find 
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#292828] via-[#E53935] to-[#292828]">People</span>
                  </h1>
               </div>

            </div>
         </div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
         
         {/* SUGGESTED FOR YOU */}
         <div className="mb-20">
            <div className="flex items-center gap-5 mb-12">
               <div className="h-16 w-16 bg-gradient-to-br from-[#E53935] to-[#C62828] text-white rounded-[1.3rem] flex items-center justify-center shadow-[0_25px_50px_-12px_rgba(229,57,53,0.4)]">
                  <Target size={32} />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-[#292828] uppercase">People you should meet</h3>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="h-1 w-8 bg-[#E53935] rounded-full" />
                     <p className="text-[11px] font-black text-[#E53935] uppercase">Top picks for you</p>
                  </div>
               </div>
            </div>

            <div className="flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory pb-10 no-scrollbar">
               {DUMMY_PROFILES.slice(5, 11).map((p) => (
                 <CompactSuggestedCard key={p.id} p={p} />
               ))}
               
               {/* View All */}
               <div className="min-w-[200px] flex items-center justify-center snap-start pl-4 pr-12">
                  <button className="h-24 w-24 rounded-full bg-white border border-[#292828]/10 flex flex-col items-center justify-center gap-2 hover:bg-[#E53935] hover:border-transparent hover:text-white transition-all text-[#292828]/40 group shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(229,57,53,0.3)]">
                     <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                     <span className="text-[10px] font-black uppercase">See All</span>
                  </button>
               </div>
            </div>
         </div>

         {/* BROWSE EVERYONE */}
         <div id="discovery-hub" className="mb-24">
            {/* FILTER BAR */}
            <div className="sticky top-6 z-40 mb-12 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-[0.975rem] p-3 shadow-sm flex items-center gap-4 transition-all overflow-x-auto no-scrollbar">
               <div className="flex items-center gap-1 px-1">
                  {["All", "My Network", "Founders", "Investors", "Logistics", "MSME"].map(tab => (
                    <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab)}
                     className={cn(
                       "h-12 px-6 rounded-[0.65rem] text-[12px] font-bold uppercase transition-all whitespace-nowrap",
                       activeTab === tab ? "bg-[#292828] text-white shadow-md" : "text-[#292828]/60 hover:text-[#292828] hover:bg-slate-100"
                     )}
                    >
                       {tab}
                    </button>
                  ))}
               </div>
            </div>

            {/* VIEW CONTROLS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 mt-4">
               <h3 className="text-2xl font-black text-[#292828] uppercase shrink-0">Search for anyone</h3>
               
               <div className="flex flex-wrap items-center justify-end gap-4 w-full">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[200px] md:max-w-[300px]">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#292828]/40" size={16} />
                     <input 
                       type="text" 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       placeholder="Type a name..." 
                       className="w-full h-12 bg-white border border-slate-200/60 rounded-xl pl-10 pr-4 text-[13px] font-bold outline-none focus:border-[#E53935] focus:shadow-sm transition-all text-[#292828]" 
                     />
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-white border border-slate-200/60 rounded-xl shadow-sm">
                     <button 
                       onClick={() => setViewMode("grid")}
                       className={cn(
                         "h-10 px-4 rounded-lg flex items-center gap-2 text-[11px] font-black uppercase transition-all",
                         viewMode === "grid" ? "bg-[#292828] text-white shadow-md" : "text-[#292828]/40 hover:text-[#292828]"
                       )}
                     >
                        <LayoutGrid size={14} /> Grid
                     </button>
                     <button 
                       onClick={() => setViewMode("list")}
                       className={cn(
                         "h-10 px-4 rounded-lg flex items-center gap-2 text-[11px] font-black uppercase transition-all",
                         viewMode === "list" ? "bg-[#292828] text-white shadow-md" : "text-[#292828]/40 hover:text-[#292828]"
                       )}
                     >
                        <List size={14} /> List
                     </button>
                  </div>

                  {/* Sort */}
                  <div className="relative h-12 bg-white border border-slate-200/60 rounded-xl px-6 flex items-center gap-3 min-w-[200px] shadow-sm hover:border-[#E53935]/40 transition-all">
                     <span className="text-[10px] font-black text-[#292828]/40 uppercase leading-none mt-0.5">Sort:</span>
                     <select 
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value)}
                       className="bg-transparent text-[11px] font-black uppercase outline-none cursor-pointer text-[#292828] flex-1 appearance-none pt-0.5"
                     >
                        <option>Best Match</option>
                        <option>Name (A–Z)</option>
                        <option>Recent Activity</option>
                     </select>
                     <SlidersHorizontal size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#292828]/40 pointer-events-none" />
                  </div>
               </div>
            </div>

            {/* PEOPLE GRID */}
            <div className={cn(
               "transition-all duration-1000",
               viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12" : "space-y-10"
            )}>
               {(activeTab === "All" || activeTab === "My Network") && DUMMY_PROFILES.slice(10, 16).map(p => (
                 <PartnerCard key={`own-${p.id}`} p={{...p, match: 100}} viewMode={viewMode} />
               ))}

               {activeTab !== "My Network" && filtered.slice(0, displayCount).map(p => (
                 <PartnerCard key={`global-${p.id}`} p={p} viewMode={viewMode} />
               ))}
            </div>

            {/* LOAD MORE */}
            {activeTab !== "My Network" && displayCount < filtered.length && (
               <div className="mt-20 flex flex-col items-center gap-10">
                  <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#292828]/10 to-transparent" />
                  <button 
                     onClick={() => setDisplayCount(prev => prev + 12)}
                     className="group relative px-16 py-8 bg-white border border-[#292828]/5 rounded-[1.625rem] overflow-hidden transition-all hover:border-[#E53935] hover:shadow-[0_40px_80px_-20px_rgba(229,57,53,0.15)] active:scale-95"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-[#E53935]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <span className="relative z-10 text-[12px] font-black text-[#292828] uppercase">See More</span>
                  </button>
               </div>
            )}
         </div>
      </div>

      {/* FOOTER BANNER */}
      <div className="px-6 lg:px-12 mb-16 relative z-10">
         <div className="max-w-[1600px] mx-auto bg-gradient-to-br from-[#292828] to-[#121212] rounded-[3.25rem] p-12 lg:p-32 relative overflow-hidden group shadow-[0_80px_160px_-40px_rgba(41,40,40,0.5)] border border-white/5">
            <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-24">
               <div className="max-w-2xl text-center lg:text-left space-y-10">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                     <div className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
                     <span className="text-[10px] font-black text-[#E53935] uppercase">Grow Your Network</span>
                  </div>
                  <h3 className="text-4xl lg:text-7xl font-black text-white uppercase leading-[0.9]">
                     Expand your <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E53935] to-[#f87171]">Connections</span>.
                  </h3>
                  <p className="text-white/50 text-xl lg:text-2xl font-medium leading-relaxed">
                     Complete your profile to get better matches and connect with the right people faster.
                  </p>
                  <Link 
                    href="/profile" 
                    className="inline-flex items-center gap-6 px-16 py-8 bg-[#E53935] text-white rounded-[1.625rem] font-black text-[13px] uppercase shadow-[0_30px_60px_-15px_rgba(229,57,53,0.5)] hover:bg-white hover:text-[#292828] transition-all transform hover:-translate-y-2 active:scale-95"
                  >
                    Complete Your Profile <ArrowRight size={20} />
                  </Link>
               </div>
               
               <div className="relative h-64 w-64 lg:h-[450px] lg:w-[450px] flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#E53935]/20 rounded-full blur-[100px] animate-pulse" />
                  <div className="relative z-10 p-12 bg-white/5 backdrop-blur-3xl rounded-[2.6rem] border border-white/5 shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                     <Users size={140} className="text-[#E53935] drop-shadow-[0_0_30px_rgba(229,57,53,0.5)]" />
                  </div>
               </div>
            </div>
            
            <Star size={500} className="absolute -left-32 -bottom-32 text-white/[0.02] rotate-12 group-hover:rotate-45 transition-all duration-[20s]" />
         </div>
      </div>

    </div>
  );
}
