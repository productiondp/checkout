"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Star, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Award,
  Plus,
  MessageSquare,
  ArrowRight,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Advisor } from "@/types/advisors";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { ConnectButton } from "@/components/connection/ConnectButton";
import { analytics } from "@/utils/analytics";

export default function AdvisorsPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("Best Match");
  const router = useRouter();

  useEffect(() => {
    async function loadAdvisors() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, headline, city, experience_years, skills, expertise, avatar_url, matchScore, bio')
          .eq('role', 'ADVISOR')
          .limit(20);

        if (error) throw error;

        if (data) {
          const mapped: Advisor[] = data.map(p => ({
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
            highlights: [],
            focus: [],
            availability: "On Demand"
          }));
          setAdvisors(mapped);
        }
      } catch (err) {
        console.error("Advisor Fetch Failure:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdvisors();
    analytics.trackScreen('ADVISORS');
  }, []);

  const filteredAdvisors = advisors.filter(advisor => 
    advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    advisor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center gap-6">
        <div className="h-12 w-12 border-4 border-[#292828]/5 border-t-[#E53935] rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#292828]/20">Loading Advisors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 pt-12 pb-10 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#292828] tracking-tight mb-3 uppercase">Advisors</h1>
            <p className="text-slate-400 font-bold text-base sm:text-lg uppercase tracking-tight">Access the network of experts.</p>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-2xl overflow-x-auto no-scrollbar w-full md:w-auto">
            {["Best Match", "Most Experienced", "Recently Active"].map(sort => (
              <button 
                key={sort}
                onClick={() => setActiveSort(sort)}
                className={cn(
                  "px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeSort === sort ? "bg-white text-[#292828] shadow-sm" : "text-slate-400 hover:text-[#292828]"
                )}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CONTROLS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Filter by industry or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 bg-white border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold text-[#292828] focus:border-[#E53935] outline-none transition-all shadow-sm"
            />
          </div>
          <button className="h-16 px-6 bg-white border border-slate-100 text-[#292828] rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredAdvisors.length === 0 && !loading && (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-20 text-center py-24 bg-white rounded-[4rem] border border-dashed border-slate-200">
           <Zap size={64} className="mx-auto text-slate-100 mb-8" />
           <h3 className="text-2xl font-black text-[#292828] uppercase mb-4 tracking-tight">No advisors available</h3>
           <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.4em] mb-12">Try a different search or category.</p>
           <button 
             onClick={() => setSearchQuery("")}
             className="h-16 px-12 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#E53935] transition-all shadow-4xl"
           >
             Expand your search
           </button>
        </div>
      )}

      {/* FEATURED ADVISORS */}
      {filteredAdvisors.some(a => a.matchScore > 90) && (
        <section className="mt-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
            <div className="flex items-center gap-3 text-[#E53935]">
              <Sparkles size={20} fill="currentColor" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Top Matches</h2>
            </div>
          </div>
          
          <div className="flex overflow-x-auto no-scrollbar gap-6 px-6 lg:px-10 pb-10 max-w-7xl mx-auto">
            {filteredAdvisors.filter(a => a.matchScore > 90).map((advisor) => (
              <div 
                key={advisor.id}
                onClick={() => router.push(`/advisors/${advisor.id}`)}
                className="min-w-[320px] sm:min-w-[400px] bg-white rounded-[1.25rem] sm:rounded-[1.5rem] p-8 sm:p-10 border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-start justify-between mb-8">
                    <div className="h-24 w-24 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-lg">
                        <img src={advisor.avatar || DEFAULT_AVATAR} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                        <circle 
                          cx="50" cy="50" r="45" fill="none" stroke="#E53935" strokeWidth="8" 
                          strokeDasharray={2 * Math.PI * 45} 
                          strokeDashoffset={(2 * Math.PI * 45) * (1 - advisor.matchScore / 100)}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute text-[12px] font-black text-[#292828]">{advisor.matchScore}%</span>
                    </div>
                </div>

                <h3 className="text-3xl font-black text-[#292828] uppercase tracking-tight mb-2 group-hover:text-[#E53935] transition-colors">{advisor.name}</h3>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-6">{advisor.role} @ {advisor.industry}</p>
                
                <div className="space-y-6 flex-1">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Best For</p>
                      <p className="text-xs font-bold text-[#292828] leading-relaxed italic line-clamp-2">"{advisor.bestFor}"</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {advisor.expertise.slice(0, 3).map(tag => (
                        <span key={tag} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase text-[#292828]/40">{tag}</span>
                      ))}
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-[#292828] uppercase">{advisor.experience} Exp</span>
                    </div>
                    <ConnectButton userId={advisor.id} userName={advisor.name} label="Connect" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ADVISOR LIST */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredAdvisors.map((advisor) => (
          <AdvisorCard key={advisor.id} advisor={advisor} />
        ))}
      </main>
    </div>
  );
}

function AdvisorCard({ advisor }: { advisor: Advisor }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/advisors/${advisor.id}`)}
      className="bg-white rounded-[1.25rem] sm:rounded-[1.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col md:flex-row items-center gap-6 sm:gap-10"
    >
      <div className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-md group-hover:rotate-3 transition-all duration-500">
        <img src={advisor.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#E53935]/5 text-[#E53935] rounded-lg text-[9px] font-black uppercase">
             <Target size={12} /> {advisor.matchScore}% Match
          </div>
          <span className="text-[10px] font-bold text-slate-300 uppercase">{advisor.experience} Experience</span>
        </div>
        <h3 className="text-3xl font-black text-[#292828] uppercase tracking-tight mb-1 group-hover:text-[#E53935] transition-colors">{advisor.name}</h3>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{advisor.role} @ {advisor.industry}</p>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
           {advisor.expertise.slice(0, 3).map(tag => (
             <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase">{tag}</span>
           ))}
        </div>
      </div>

      <div className="shrink-0">
        <ConnectButton userId={advisor.id} userName={advisor.name} label="Connect" />
      </div>
    </div>
  );
}
