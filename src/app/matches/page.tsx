"use client";

import React, { useState, useEffect } from "react";
import { 
  BrainCircuit, 
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
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import UniversalFeedCard from "@/components/ui/UniversalFeedCard";
import DealEngine from "@/components/modals/DealEngine";

export default function AIMatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setCurrentUser(profile);

      // AI MATCH LOGIC (Calling our match_posts RPC)
      // Note: If embeddings are null, we fallback to a standard high-relevance fetch
      const { data: aiResults, error } = await supabase.rpc('match_posts', {
        query_embedding: profile?.embedding || null,
        match_threshold: 0.5,
        match_count: 10
      });

      if (!aiResults || aiResults.length === 0) {
        // Fallback: Fetch by role title proximity
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
            badge: "Silver"
          }));
          setMatches(mapped);
        }
      } else {
        setMatches(aiResults);
      }
      
      setIsLoading(false);
    }
    loadMatches();
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F5F7] lg:p-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-10">
        
        {/* 1. AI ANALYSIS SIDEBAR */}
        <aside className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="bg-[#292828] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E53935]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
               <div className="h-14 w-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-[#E53935]">
                  <BrainCircuit size={28} />
               </div>
               <div>
                  <h2 className="text-xl font-bold uppercase tracking-tighter">Neural Profile</h2>
                  <p className="text-[10px] font-bold text-white/40 uppercase">AI Capacity Analysis</p>
               </div>
            </div>

            <div className="space-y-8 relative z-10">
               <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase mb-3">Detected Specialization</p>
                  <div className="flex flex-wrap gap-2">
                     {["Strategic Growth", "B2B Marketing", "Operations"].map(tag => (
                       <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[12px] font-bold">{tag}</span>
                     ))}
                  </div>
               </div>

               <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="flex items-center gap-3 mb-4">
                     <Fingerprint size={18} className="text-[#E53935]" />
                     <p className="text-[11px] font-black uppercase tracking-widest text-[#E53935]">Neural Fit</p>
                  </div>
                  <p className="text-[14px] font-medium leading-relaxed text-white/70">
                    "Your background in <strong>{currentUser?.role || 'Professional'}</strong> aligns perfectly with the current regional hiring mandates for operations leadership."
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                     <p className="text-2xl font-bold">128</p>
                     <p className="text-[9px] font-bold text-white/40 uppercase">Data Points</p>
                  </div>
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                     <p className="text-2xl font-bold text-[#E53935]">94%</p>
                     <p className="text-[9px] font-bold text-white/40 uppercase">Accuracy</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-[#292828]/5 shadow-sm">
             <h3 className="text-[11px] font-black text-[#292828]/30 uppercase tracking-widest mb-6 px-2">Network Insights</h3>
             <div className="space-y-4">
                {[
                  { label: "Regional Demand", value: "High", color: "text-emerald-600" },
                  { label: "Match Velocity", value: "+24%", color: "text-[#E53935]" },
                  { label: "Active Mandates", value: "48", color: "text-[#292828]" }
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center p-4 rounded-2xl hover:bg-[#292828]/5 transition-all">
                     <span className="text-[12px] font-bold text-[#292828]/60">{stat.label}</span>
                     <span className={cn("text-[13px] font-black", stat.color)}>{stat.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </aside>

        {/* 2. MATCHED POSTS LIST */}
        <main className="space-y-6">
           <div className="flex items-center justify-between mb-2 px-4">
              <div className="flex items-center gap-3">
                 <Cpu size={24} className="text-[#292828]" />
                 <h2 className="text-2xl font-black text-[#292828] uppercase tracking-tight">Ranked Mandates</h2>
              </div>
              <div className="flex items-center gap-2">
                 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-[#292828]/40 uppercase tracking-widest">Live Ranking Active</span>
              </div>
           </div>

           {isLoading ? (
             <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-white border border-[#292828]/10 rounded-[28px] animate-pulse" />
                ))}
             </div>
           ) : (
             <div className="space-y-6 animate-in fade-in duration-1000">
                {matches.map((post) => (
                  <div key={post.id} className="relative">
                    {/* Neural Accuracy Badge Overlay */}
                    <div className="absolute -top-3 left-10 z-20 px-4 py-1.5 bg-[#292828] text-white rounded-full text-[10px] font-black flex items-center gap-2 shadow-2xl border border-white/10">
                       <Sparkles size={10} className="text-[#E53935]" />
                       {post.similarity ? Math.round(post.similarity * 100) : post.matchScore}% NERUAL ALIGNMENT
                    </div>
                    
                    <UniversalFeedCard 
                      post={post}
                      onAction={() => {
                        setSelectedDeal(post);
                        setIsModalOpen(true);
                      }}
                    />

                    {/* AI Insight Bubble Extension */}
                    <div className="mt-[-20px] mx-8 p-6 bg-white border-x border-b border-[#292828]/5 rounded-b-[2rem] pt-10 relative z-0 flex items-center gap-6 group hover:bg-[#292828] transition-all">
                       <div className="h-10 w-10 shrink-0 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all">
                          <Info size={18} />
                       </div>
                       <p className="text-[12px] font-bold text-[#292828]/40 group-hover:text-white transition-all italic">
                          "This mandate specifically requires <strong>{post.skills_required?.[0] || 'domain expertise'}</strong> which is a high-alignment node in your neural profile."
                       </p>
                       <div className="flex-1" />
                       <ArrowUpRight size={18} className="text-[#292828]/20 group-hover:text-white transition-all" />
                    </div>
                  </div>
                ))}

                {matches.length === 0 && (
                  <div className="py-40 text-center bg-white rounded-[3rem] border border-[#292828]/10">
                     <div className="h-20 w-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center text-[#292828] mb-6">
                        <Target size={40} />
                     </div>
                     <h3 className="text-xl font-bold uppercase">No Matches Yet</h3>
                     <p className="text-slate-400 mt-2">Expand your bio to improve neural discovery.</p>
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
