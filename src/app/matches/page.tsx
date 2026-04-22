"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Sparkles, 
  Zap, 
  Target, 
  Briefcase, 
  ArrowUpRight, 
  ShieldCheck, 
  Info,
  Maximize2,
  Bookmark,
  ChevronRight,
  Fingerprint,
  Cpu,
  BrainCircuit,
  Shield,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import UniversalFeedCard from "@/components/ui/UniversalFeedCard";
import DealEngine from "@/components/modals/DealEngine";

export default function PartnerHubPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadPartners() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setCurrentUser(profile);

      // PARTNER DISCOVERY LOGIC
      const { data: results, error } = await supabase.rpc('match_posts', {
        query_embedding: profile?.embedding || null,
        match_threshold: 0.5,
        match_count: 10
      });

      if (!results || results.length === 0) {
        // Fallback discovery
        const { data: fallbackPosts } = await supabase
          .from('posts')
          .select('*, author:profiles(full_name, avatar_url, match_score, role)')
          .limit(10)
          .order('created_at', { ascending: false });
        
        if (fallbackPosts) {
          const mapped = fallbackPosts.map(p => ({
            ...p,
            author: p.author?.full_name || "Community Partner",
            avatar: p.author?.avatar_url || `https://i.pravatar.cc/150?u=${p.author_id}`,
            matchScore: p.author?.match_score || 85,
            badge: "Verified"
          }));
          setMatches(mapped);
        }
      } else {
        setMatches(results);
      }
      
      setIsLoading(false);
    }
    loadPartners();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] lg:p-10 selection:bg-[#E53935]/10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-12">
        
        {/* 1. PARTNER CAPACITY SIDEBAR */}
        <aside className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="bg-[#292828] p-10 rounded-[3rem] text-white shadow-4xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E53935]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#E53935]/20 transition-all duration-1000" />
            
            <div className="flex items-center gap-5 mb-12 relative z-10">
               <div className="h-16 w-16 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-2xl flex items-center justify-center text-[#E53935] shadow-2xl">
                  <Fingerprint size={32} />
               </div>
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Partner Hub</h2>
                  <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">Strategic Capacity Analysis</p>
               </div>
            </div>

            <div className="space-y-10 relative z-10">
               <div>
                  <p className="text-[10px] font-black text-white/20 uppercase mb-4 tracking-widest">Network Specialization</p>
                  <div className="flex flex-wrap gap-2">
                     {["Regional Scaling", "Capital Deployment", "Operational Intelligence"].map(tag => (
                       <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-tight hover:bg-[#E53935] hover:border-[#E53935] transition-all cursor-default">{tag}</span>
                     ))}
                  </div>
               </div>

               <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl relative overflow-hidden group/intel">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#E53935] group-hover/intel:w-full transition-all duration-700 opacity-20" />
                  <div className="flex items-center gap-3 mb-5 relative z-10">
                     <ShieldCheck size={20} className="text-[#E53935]" />
                     <p className="text-[11px] font-black uppercase tracking-widest text-white">Strategic Sync</p>
                  </div>
                  <p className="text-[15px] font-medium leading-relaxed text-white/60 relative z-10 italic">
                    "Your mandate authority in <strong>{currentUser?.role || 'Business Logistics'}</strong> aligns with the current partnership demand for regional scaling partners."
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center hover:bg-white/10 transition-all">
                     <p className="text-2xl font-black tabular-nums">1.2K</p>
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Data Nodes</p>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center hover:bg-white/10 transition-all">
                     <p className="text-2xl font-black text-[#E53935] tabular-nums">98%</p>
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Precision</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] border border-[#292828]/5 shadow-sm overflow-hidden relative group">
             <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Users size={180} />
             </div>
             <h3 className="text-[11px] font-black text-[#292828]/20 uppercase tracking-[0.3em] mb-8">Regional Insights</h3>
             <div className="space-y-3">
                {[
                  { label: "Market Demand", value: "Saturated", color: "text-emerald-600" },
                  { label: "Partner Velocity", value: "+38.4%", color: "text-[#E53935]" },
                  { label: "Global Mandates", value: "114", color: "#292828" }
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center p-5 rounded-2xl border border-transparent hover:border-[#292828]/5 hover:bg-slate-50 transition-all group/item">
                     <span className="text-[13px] font-bold text-[#292828]/40 group-hover/item:text-[#292828] transition-colors">{stat.label}</span>
                     <span className={cn("text-[14px] font-black tracking-tight", stat.color)}>{stat.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </aside>

        {/* 2. RANKED PARTNER DISCOVERY */}
        <main className="space-y-8 pb-32">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2 px-4 gap-6">
              <div className="flex items-center gap-5">
                 <div className="h-14 w-14 bg-[#292828] rounded-2xl flex items-center justify-center text-[#E53935] shadow-xl">
                    <Sparkles size={28} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-[#292828] uppercase tracking-tighter">Ranked Partners</h2>
                    <p className="text-[12px] font-bold text-slate-400 mt-1">High-alignment discovery based on current mandates.</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 px-6 h-12 bg-white border border-[#292828]/5 rounded-full shadow-sm">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-[#292828] uppercase tracking-widest">Autonomous Sync Active</span>
              </div>
           </div>

           {isLoading ? (
             <div className="space-y-8 px-2">
                {[1, 2, 3].map(i => (
                   <div key={i} className="h-72 bg-white border border-[#292828]/5 rounded-[3rem] animate-pulse" />
                ))}
             </div>
           ) : (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 px-2 lg:px-0">
                {matches.map((post) => (
                  <div key={post.id} className="relative group/partner">
                    {/* Partner Authority Badge Overlay */}
                    <div className="absolute -top-4 left-10 lg:left-16 z-30 px-6 py-2.5 bg-[#292828] text-white rounded-[1.25rem] text-[11px] font-black flex items-center gap-3 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] border border-white/5 group-hover/partner:bg-[#E53935] transition-all duration-700">
                       <CheckCircle2 size={14} className="text-[#E53935] group-hover:text-white" />
                       <span className="tracking-widest uppercase">{post.similarity ? Math.round(post.similarity * 100) : post.matchScore}% PARTNER ALIGNMENT</span>
                    </div>
                    
                    <UniversalFeedCard 
                      post={post}
                      onAction={() => {
                        setSelectedDeal(post);
                        setIsModalOpen(true);
                      }}
                    />

                    {/* Partner Insight Expansion */}
                    <div className="mt-[-30px] mx-10 lg:mx-20 p-10 bg-white border border-[#292828]/5 rounded-b-[3.5rem] pt-16 relative z-0 flex flex-col lg:flex-row lg:items-center gap-8 shadow-2xl transition-all duration-700 hover:bg-[#292828] group/insight">
                       <div className="h-14 w-14 shrink-0 bg-[#292828]/5 rounded-2xl flex items-center justify-center text-[#292828] group-hover/insight:bg-[#E53935] group-hover/insight:text-white group-hover/insight:rotate-12 transition-all duration-700">
                          <BrainCircuit size={24} />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-[10px] font-black uppercase text-[#E53935] tracking-widest mb-2">Strategy Insight</h4>
                          <p className="text-[15px] font-bold text-[#292828]/40 group-hover/insight:text-white transition-all leading-relaxed">
                            "This mandate aligns with your <strong>Strategic Hub</strong> expertise in regional deployment. High synergistic potential detected."
                          </p>
                       </div>
                       <button className="h-12 px-6 border border-[#292828]/10 group-hover/insight:border-white/20 text-[#292828]/40 group-hover/insight:text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-[#E53935] hover:border-[#E53935] transition-all">
                          Verify <ArrowUpRight size={14} />
                       </button>
                    </div>
                  </div>
                ))}

                {matches.length === 0 && (
                  <div className="py-60 text-center bg-white rounded-[4rem] border border-[#292828]/5 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                     <div className="h-32 w-32 bg-[#292828]/5 rounded-full mx-auto flex items-center justify-center text-[#292828]/20 mb-10 group-hover:scale-110 transition-transform duration-700">
                        <Users size={64} strokeWidth={1} />
                     </div>
                     <h2 className="text-3xl font-black uppercase text-[#292828] tracking-tighter">No Active Alliances</h2>
                     <p className="text-slate-400 font-bold mt-4 max-w-md mx-auto text-lg leading-relaxed">Your neural scan found no mandates matching your current authority level. Expand your strategic profile to initialize discovery.</p>
                  </div>
                )}
             </div>
           )}
        </main>
      </div>

      <DealEngine 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deal={selectedDeal}
      />
    </div>
  );
}
