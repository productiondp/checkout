"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Zap, 
  ChevronRight,
  Sparkles,
  Award,
  Target,
  LayoutGrid,
  List
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Advisor } from "@/types/advisors";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { ConnectButton } from "@/components/connection/ConnectButton";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";
import TerminalLayout from "@/components/layout/TerminalLayout";

export default function AdvisorsPage() {
  const { user: authUser } = useAuth();
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("Best Match");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const router = useRouter();

  useEffect(() => {
    async function loadAdvisors() {
      if (!authUser) return;
      const supabase = createClient();
      try {
        const { data } = await supabase.from('profiles').select('*').eq('role', 'ADVISOR').neq('id', authUser.id).limit(20);
        const { data: connections } = await supabase.from('connections').select('sender_id, receiver_id, status').or(`sender_id.eq.${authUser.id},receiver_id.eq.${authUser.id}`);
        if (data) {
          const mapped = data.filter(p => {
            const conn = (connections || []).find(c => (c.sender_id === authUser.id && c.receiver_id === p.id) || (c.receiver_id === authUser.id && c.sender_id === p.id));
            return conn?.status !== 'BLOCKED';
          }).map(p => ({
            id: p.id,
            name: p.full_name || "Elite Advisor",
            role: p.headline || "Professional Advisor",
            industry: p.city || "National Network",
            experience: p.experience_years ? `${p.experience_years}+ Years` : "10+ Years",
            expertise: p.skills || p.expertise || ["Strategy", "Growth", "Scale"],
            avatar: p.avatar_url || DEFAULT_AVATAR,
            matchScore: p.matchScore || Math.floor(Math.random() * 10) + 88,
            bestFor: p.bio?.substring(0, 100) || "Strategic scaling and growth.",
            bio: p.bio || "",
            connectionStatus: 'none'
          }));
          setAdvisors(mapped);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadAdvisors();
    analytics.trackScreen('ADVISORS');
  }, [authUser]);

  const filteredAdvisors = advisors.filter(advisor => 
    advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    advisor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <TerminalLayout>
      <div className="bg-[#FDFDFF] min-h-screen">
        {/* SECOND ROW: STICKY FILTERS & SWITCHER */}
        <div className="bg-white border-b border-black/[0.03] px-8 py-3 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-black/20 tracking-widest mr-2">Sort by:</span>
                <div className="flex p-1 bg-[#F5F5F7] rounded-xl border border-black/[0.03]">
                  {["Match", "Exp", "Active"].map(sort => (
                    <button 
                      key={sort}
                      onClick={() => setActiveSort(sort)}
                      className={cn(
                        "px-4 h-8 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        activeSort.startsWith(sort) ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
                      )}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
             </div>

             <div className="flex items-center gap-1 p-1 bg-[#F5F5F7] rounded-xl border border-black/[0.03]">
                <button 
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                    viewMode === "list" ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
                  )}
                >
                   <List size={16} />
                </button>
                <button 
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                    viewMode === "grid" ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
                  )}
                >
                   <LayoutGrid size={16} />
                </button>
             </div>
          </div>
        </div>

      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* SEARCH SECTION */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-[#E53935] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search experts, mentors, or advisors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 bg-white border border-black/[0.03] rounded-[10px] pl-16 pr-6 text-sm font-bold text-[#1D1D1F] outline-none focus:bg-white focus:border-[#E53935]/20 transition-all shadow-sm" 
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 4].map(i => <div key={i} className="h-64 bg-[#F5F5F7] rounded-[10px] animate-pulse" />)}
          </div>
        ) : filteredAdvisors.length > 0 ? (
          <>
            {/* TOP MATCHES */}
            <section>
              <div className="flex items-center gap-3 text-[#E53935] mb-8">
                <Sparkles size={20} fill="currentColor" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20">Elite Advisors</h2>
              </div>
              <div className="flex overflow-x-auto no-scrollbar gap-6 pb-6">
                {filteredAdvisors.filter(a => a.matchScore > 90).map((advisor) => (
                  <div key={advisor.id} onClick={() => router.push(`/advisors/${advisor.id}`)} className="min-w-[400px] bg-white rounded-[10px] p-10 border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full">
                    <div className="flex items-start justify-between mb-8">
                      <div className="h-24 w-24 rounded-[10px] overflow-hidden border-4 border-[#F5F5F7] shadow-lg"><img src={advisor.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" /></div>
                      <div className="relative h-16 w-16 flex items-center justify-center"><svg className="w-full h-full" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#F5F5F7" strokeWidth="8" /><circle cx="50" cy="50" r="45" fill="none" stroke="#E53935" strokeWidth="8" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={(2 * Math.PI * 45) * (1 - advisor.matchScore / 100)} strokeLinecap="round" /></svg><span className="absolute text-[12px] font-black text-black font-outfit">{advisor.matchScore}%</span></div>
                    </div>
                    <h3 className="text-2xl font-black text-[#1D1D1F] uppercase font-outfit mb-2 group-hover:text-[#E53935] transition-colors">{advisor.name}</h3>
                    <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-6">{advisor.role} • {advisor.industry}</p>
                    <div className="p-6 bg-[#F5F5F7] rounded-[10px] border border-black/[0.02] mb-8"><p className="text-xs font-bold text-black/60 leading-relaxed italic uppercase">"{advisor.bestFor}"</p></div>
                    <div className="mt-auto pt-6 border-t border-black/[0.03] flex items-center justify-between"><div className="flex items-center gap-2"><Award size={16} className="text-emerald-500" /><span className="text-[10px] font-black text-black uppercase tracking-widest">{advisor.experience} Exp</span></div><ConnectButton userId={advisor.id} userName={advisor.name} label="Start Conversation" /></div>
                  </div>
                ))}
              </div>
            </section>

            {/* FULL LIST / GRID */}
            <main className={cn(
              "transition-all duration-500",
              viewMode === "list" ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            )}>
              {filteredAdvisors.map((advisor) => (
                <AdvisorCard key={advisor.id} advisor={advisor} viewMode={viewMode} />
              ))}
            </main>
          </>
        ) : (
          <div className="py-40 text-center space-y-6">
            <div className="h-20 w-20 bg-[#F5F5F7] rounded-[10px] mx-auto flex items-center justify-center text-black/10"><Zap size={32} /></div>
            <h3 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit">No experts found</h3>
            <p className="text-black/20 text-[11px] font-black uppercase tracking-widest">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  </TerminalLayout>
  );
}

function AdvisorCard({ advisor, viewMode }: { advisor: Advisor; viewMode: "list" | "grid" }) {
  const router = useRouter();
  
  if (viewMode === "list") {
    return (
      <div onClick={() => router.push(`/advisors/${advisor.id}`)} className="bg-white rounded-[2rem] p-8 border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex items-center gap-8">
        <div className="h-28 w-28 shrink-0 rounded-2xl overflow-hidden border-4 border-[#F5F5F7] shadow-md group-hover:rotate-3 transition-all duration-500">
          <img src={advisor.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 bg-[#E53935]/5 text-[#E53935] rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
               <Target size={12} /> {advisor.matchScore}% Match
            </div>
            <span className="text-[9px] font-black text-black/20 uppercase tracking-widest">{advisor.experience}</span>
          </div>
          <h3 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit mb-1 group-hover:text-[#E53935] transition-colors">{advisor.name}</h3>
          <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-4">{advisor.role} • {advisor.industry}</p>
          <div className="flex flex-wrap gap-2">
            {advisor.expertise.slice(0, 4).map(tag => (
              <span key={tag} className="px-3 py-1 bg-[#F5F5F7] text-black/40 rounded-lg text-[8px] font-black uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <ConnectButton userId={advisor.id} userName={advisor.name} label="Start Conversation" />
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => router.push(`/advisors/${advisor.id}`)} className="bg-white rounded-[2rem] p-8 border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
        <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 border-[#F5F5F7] shadow-md group-hover:scale-105 transition-all duration-500">
          <img src={advisor.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="px-2.5 py-1 bg-[#E53935]/5 text-[#E53935] rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Target size={10} /> {advisor.matchScore}%
           </div>
           <span className="text-[8px] font-black text-black/20 uppercase tracking-widest">{advisor.experience}</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-2 mb-6">
        <h3 className="text-lg font-black text-[#1D1D1F] uppercase font-outfit group-hover:text-[#E53935] transition-colors leading-none">{advisor.name}</h3>
        <p className="text-[9px] font-black text-black/20 uppercase tracking-widest line-clamp-1">{advisor.role}</p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {advisor.expertise.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-[#F5F5F7] text-black/40 rounded-md text-[7px] font-black uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-black/[0.03]">
         <ConnectButton userId={advisor.id} userName={advisor.name} label="Start Conversation" className="w-full" />
      </div>
    </div>
  );
}


export const runtime = "edge";
