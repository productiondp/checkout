"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
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
  UserMinus,
  ArrowUpRight,
  Plus,
  Bell,
  Check,
  X as XIcon,
  Activity,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import PostModal from "@/components/modals/PostModal";
import { calculateAdvisorMatch } from "@/lib/ai";

const MOCK_CURRENT_USER = {
  role: "Strategy",
  bio: "Expert in scaling brands and regional growth.",
  domains: ["Strategy", "Marketing"]
};

const ConnectionCard = ({ p, viewMode }: { p: any, viewMode?: "grid" | "list" }) => {
  const [isBlocked, setIsBlocked] = useState(false);

  if (isBlocked) {
    return (
      <div className={cn(
        "bg-slate-50 border border-slate-200 p-8 opacity-50 grayscale flex items-center justify-center transition-all",
        viewMode === "list" ? "rounded-[24px] min-h-[160px]" : "rounded-[24px] h-full min-h-[400px] flex-col"
      )}>
        <div className="flex flex-col items-center text-center gap-3">
            <UserX size={32} className="text-slate-400" />
            <div>
               <h3 className="text-xl mb-0 uppercase">{p.name}</h3>
               <p className="subheading-editorial !text-slate-400 mt-1">Profile Blocked</p>
            </div>
            <button onClick={() => setIsBlocked(false)} className="px-6 h-10 bg-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase hover:bg-slate-300 transition-colors mt-2">Unblock</button>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="group bg-white border border-[#292828]/10 rounded-[24px] p-8 transition-all hover:shadow-premium flex flex-col md:flex-row items-center justify-between gap-10 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-[#E53935] opacity-0 group-hover:opacity-100 transition-all rounded-r-full" />
         <div className="flex items-center gap-10 flex-1 min-w-0">
            <div className="h-24 w-24 rounded-2xl overflow-hidden border border-[#292828]/5 shrink-0 shadow-lg group-hover:rotate-3 transition-transform">
               <img src={p.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="min-w-0">
               <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-2xl mb-0 uppercase truncate group-hover:text-[#E53935] transition-colors">{p.name}</h3>
                  <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500">
                     {p.badge} Member
                  </div>
                  <ShieldCheck size={20} className="text-blue-500 shrink-0" />
                  <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[12px] font-black uppercase shrink-0">{p.match}% Match</div>
               </div>
               <p className="subheading-editorial !text-slate-400 mb-6 truncate">{p.role} @ {p.company}</p>
               <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold"><MapPin size={12} className="text-[#E53935]" /> {p.city}</span>
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-bold"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Node</span>
               </div>
            </div>
         </div>
         <div className="flex gap-3 shrink-0 items-center">
            <Link href={`/profile/${p.id}`} className="px-8 h-14 flex items-center justify-center bg-[#292828] text-white rounded-xl font-black text-[11px] uppercase shadow-xl hover:bg-[#E53935] active:scale-95 transition-all">View Profile</Link>
            <Link href={`/chat?user=${p.id}`} className="h-14 w-14 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-[#292828] hover:bg-white hover:shadow-premium transition-all"><MessageSquare size={20} /></Link>
            <div className="relative group/menu">
               <button className="h-14 w-14 flex items-center justify-center text-[#292828]/30 hover:text-[#292828] hover:bg-slate-50 rounded-xl transition-all">
                  <MoreHorizontal size={20} />
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border border-[#292828]/10 rounded-[24px] transition-all duration-500 hover:shadow-premium hover:border-[#E53935]/30 flex flex-col h-full overflow-hidden">
       <div className="p-8 relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-8">
             <div className="relative">
                <div className="h-28 w-28 rounded-2xl overflow-hidden p-1 bg-white border border-[#292828]/5 shadow-xl group-hover:rotate-3 transition-transform duration-500">
                   <img src={p.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-xl shadow-xl flex items-center justify-center border border-[#292828]/5 group-hover:scale-110 transition-transform">
                   <div className={cn(
                     "h-3 w-3 rounded-full",
                     p.id % 2 === 0 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-slate-300"
                   )} />
                </div>
             </div>
             <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2 px-5 py-2 bg-[#292828] text-white rounded-full text-[13px] font-black group-hover:bg-[#E53935] transition-all shadow-lg">
                   <TrendingUp size={14} /> {p.match}%
                </div>
                <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-400">
                   {p.badge} Member
                </div>
             </div>
          </div>

          <div className="mb-8">
             <div className="flex items-center gap-2 mb-1">
               <h3 className="text-2xl mb-0 uppercase group-hover:text-[#E53935] transition-colors leading-tight truncate">{p.name}</h3>
               <ShieldCheck size={18} className="text-blue-500 shrink-0" />
             </div>
             <p className="subheading-editorial !text-slate-400 mb-6">{p.role} @ {p.company}</p>
             
             <div className="flex flex-wrap gap-2">
                <div className="h-9 px-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-[11px] font-bold text-[#292828]">
                   <MapPin size={12} className="text-[#E53935]" /> {p.city}
                </div>
                <div className="h-9 px-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-[11px] font-bold text-emerald-700">
                   <Zap size={12} /> Verified Node
                </div>
             </div>
          </div>

          <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 mb-8 group-hover:bg-white transition-all duration-500 flex-1">
             <p className="text-[9px] font-black text-slate-300 uppercase mb-3 tracking-widest">About Node</p>
             <p className="text-[14px] font-medium text-slate-500 leading-relaxed line-clamp-2">
               {p.bio || "Looking to grow my business and build meaningful connections with other professionals."}
             </p>
          </div>

          <div className="flex gap-3">
             <Link href={`/profile/${p.id}`} className="flex-1 h-14 bg-[#292828] text-white rounded-xl font-black text-[11px] uppercase shadow-xl hover:bg-[#E53935] active:scale-95 transition-all flex items-center justify-center gap-2">
                Connect <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link href={`/chat?user=${p.id}`} className="h-14 w-14 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-[#292828] hover:bg-white hover:shadow-premium transition-all">
                <MessageSquare size={20} />
             </Link>
          </div>
       </div>
    </div>
  );
};

export default function BusinessNetworkPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Best Match");
  const [displayCount, setDisplayCount] = useState(12);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  React.useEffect(() => {
    async function fetchProfiles() {
      setIsLoading(true);
      const { data } = await supabase.from('profiles').select('*');
      if (data && data.length > 0) {
        const mapped = data.map(p => ({
          ...p,
          name: p.full_name || "Professional",
          avatar: p.avatar_url || `https://i.pravatar.cc/150?u=${p.id}`,
          role: p.role,
          company: p.location || "Global Node",
          city: p.location || "Virtual Hub",
          badge: p.role === 'BUSINESS' ? 'Elite' : 'Gold',
          match: p.match_score || 85
        }));
        setProfiles(mapped);
      }
      setIsLoading(false);
    }
    fetchProfiles();
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    const list = profiles.filter(p => {
      const name = (p.name || "").toLowerCase();
      const company = (p.company || "").toLowerCase();
      return name.includes(query) || company.includes(query);
    });

    return [...list].sort((a, b) => {
      if (sortBy === "Best Quality") {
        return (b.match || 0) - (a.match || 0);
      }
      if (sortBy === "Name (A–Z)") {
        return a.name.localeCompare(b.name);
      }
      return (b.match || 0) - (a.match || 0);
    });
  }, [search, sortBy, activeTab, profiles]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#E53935]/10 font-sans">
      
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20 space-y-20">
        
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <header className="space-y-12">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-[#292828]/5 pb-12">
              <div className="space-y-6">
                 <div className="label-premium">
                    <Sparkles size={10} className="animate-pulse" /> Neural Network Active
                 </div>
                 <h1 className="text-xl md:text-2xl lg:text-3xl mb-0 tracking-tight font-black uppercase">Partners<span className="text-[#E53935]">.</span></h1>
                 <p className="text-slate-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                    Connect with thousands of verified professional nodes in your local hub and industry cluster.
                 </p>
              </div>

              <div className="flex items-center gap-4">
                 <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-xl">
                         <img src={`https://i.pravatar.cc/150?u=${i+10}`} className="grayscale" alt="" />
                      </div>
                    ))}
                    <div className="h-12 w-12 rounded-full border-4 border-white bg-[#292828] text-white flex items-center justify-center text-[10px] font-black shadow-xl">
                       +12K
                    </div>
                 </div>
              </div>
           </div>

           {/* SEARCH & CONTROLS */}
           <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E53935] transition-colors" size={20} />
                 <input 
                    type="text" 
                    placeholder="Search professional registry..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-8 text-[15px] font-bold outline-none focus:bg-white focus:border-[#292828]/10 transition-all shadow-sm"
                 />
              </div>

              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                 <button onClick={() => setViewMode("grid")} className={cn("p-3 rounded-xl transition-all", viewMode === "grid" ? "bg-white shadow-sm text-[#292828]" : "text-slate-300")}><LayoutGrid size={20} /></button>
                 <button onClick={() => setViewMode("list")} className={cn("p-3 rounded-xl transition-all", viewMode === "list" ? "bg-white shadow-sm text-[#292828]" : "text-slate-300")}><List size={20} /></button>
              </div>

              <div className="relative h-16 bg-white border border-slate-100 rounded-2xl px-6 flex items-center gap-4 min-w-[200px] shadow-sm">
                 <span className="subheading-editorial !mb-0 !text-slate-300">Sort:</span>
                 <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[11px] font-black uppercase outline-none cursor-pointer text-[#292828] flex-1 appearance-none pt-0.5"
                 >
                    <option>Best Match</option>
                    <option>Name (A–Z)</option>
                    <option>Rank</option>
                 </select>
                 <SlidersHorizontal size={16} className="text-slate-300" />
              </div>
           </div>
        </header>

        {/* ── FEED ───────────────────────────────────────────────────── */}
        <div className={cn(
           "grid gap-8",
           viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col max-w-4xl"
        )}>
           {filtered.slice(0, displayCount).map(p => (
             <ConnectionCard key={p.id} p={p} viewMode={viewMode} />
           ))}
        </div>

        {/* LOAD MORE */}
        {displayCount < filtered.length && (
           <div className="flex justify-center pt-20">
              <button 
                onClick={() => setDisplayCount(prev => prev + 12)}
                className="h-16 px-12 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-[#E53935] hover:text-[#E53935] transition-all shadow-sm"
              >
                 Load More Nodes
              </button>
           </div>
        )}

        {/* CALL TO ACTION */}
        <section className="bg-[#292828] rounded-[32px] p-12 lg:p-20 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#E53935]/10 blur-[100px] pointer-events-none" />
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="space-y-8 max-w-2xl text-center lg:text-left">
                 <h2 className="text-5xl lg:text-7xl font-black mb-0 leading-[0.9]">Expand Your <span className="text-[#E53935]">Circle.</span></h2>
                 <p className="text-white/50 text-lg md:text-xl font-medium leading-relaxed">
                    Complete your profile intelligence to get matched with the most relevant professional peers in your regional hub.
                 </p>
                 <button className="px-12 h-16 bg-[#E53935] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                    Update My Profile
                 </button>
              </div>
              <div className="h-64 w-64 bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 flex items-center justify-center shadow-4xl rotate-6 group-hover:rotate-0 transition-transform duration-700">
                 <Users size={120} className="text-[#E53935]" />
              </div>
           </div>
        </section>

      </main>

    </div>
  );
}
