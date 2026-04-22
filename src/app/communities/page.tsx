"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  Plus, 
  MessageSquare,
  Search,
  Activity,
  Zap,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Filter,
  Shield,
  Compass,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [myMemberships, setMyMemberships] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const supabase = createClient();

  useEffect(() => {
    async function initCommunities() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: members } = await supabase.from('community_members').select('community_id').eq('user_id', user.id);
        if (members) setMyMemberships(members.map(m => m.community_id));
      }
      const { data: allComms } = await supabase.from('communities').select('*, community_members(count)').order('name');
      if (allComms) setCommunities(allComms);
      setIsLoading(false);
    }
    initCommunities();
  }, []);

  const handleJoin = async (commId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Executive Identity Required. Please login.");
      return;
    }
    const isMember = myMemberships.includes(commId);
    if (isMember) {
      await supabase.from('community_members').delete().eq('community_id', commId).eq('user_id', user.id);
      setMyMemberships(prev => prev.filter(id => id !== commId));
    } else {
      await supabase.from('community_members').insert([{ community_id: commId, user_id: user.id, role: 'MEMBER' }]);
      setMyMemberships(prev => [...prev, commId]);
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-40 selection:bg-[#E53935]/10">
      
      {/* 1. IMMERSIVE HERO - NEURAL SCROLLING */}
      <div className="bg-[#111111] text-white pt-28 pb-48 px-6 lg:px-10 relative overflow-hidden">
         {/* Background Grid Accent */}
         <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100px_100px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#111111_100%)]" />
         </div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E53935]/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
         
         <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
               <div className="h-0.5 w-16 bg-[#E53935]" />
               <p className="text-[12px] font-black uppercase tracking-[0.5em] text-[#E53935]">Syndicate Network</p>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
               Network <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Expansion</span>
            </h1>
            <p className="text-xl lg:text-2xl font-medium text-white/40 max-w-3xl leading-relaxed mb-16 mx-auto lg:mx-0">
               Sync with high-authority regional business nodes. <br className="hidden lg:block" /> Access exclusive mandates and shared situational intelligence.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="flex items-center gap-5 translate-y-2">
                   <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-[#E53935] shadow-2xl backdrop-blur-3xl"><Activity size={28} /></div>
                   <div className="text-left">
                      <p className="text-3xl font-black leading-none">{communities.length}</p>
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mt-1">Operational Hubs</p>
                   </div>
                </div>
                <div className="h-12 w-[1px] bg-white/10 hidden lg:block" />
                <div className="flex items-center gap-5 translate-y-2">
                   <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-2xl backdrop-blur-3xl"><Zap size={28} /></div>
                   <div className="text-left">
                      <p className="text-3xl font-black leading-none">99.8%</p>
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mt-1">Network Density</p>
                   </div>
                </div>
            </div>
         </div>
      </div>

      {/* 2. FLOATING DISCOVERY HUB */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 lg:-mt-28 relative z-20">
         
         {/* SEARCH DOCK */}
         <div className="bg-white/95 backdrop-blur-2xl p-5 rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] border border-[#292828]/5 flex flex-col lg:flex-row items-center gap-5 transition-all hover:shadow-[0_64px_128px_-16px_rgba(0,0,0,0.15)] group/dock">
            <div className="w-full relative">
               <Search size={22} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/dock:text-[#E53935] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search by syndicate name or regional node..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-20 bg-[#292828]/5 border border-transparent rounded-[1.75rem] pl-20 pr-10 text-lg font-black text-[#292828] focus:bg-white focus:border-[#E53935] outline-none transition-all placeholder:text-[#292828]/20"
               />
            </div>
            <button className="h-20 w-full lg:w-auto px-10 bg-[#292828] text-white rounded-[1.75rem] flex items-center justify-center gap-4 hover:bg-[#E53935] transition-all group/f shadow-xl shrink-0 active:scale-95">
               <Filter size={20} className="group-hover/f:rotate-180 transition-transform duration-700" />
               <span className="text-[13px] font-black uppercase tracking-widest">Filter Hub</span>
            </button>
         </div>

         {/* SYNDICATE GRID */}
         <div className="mt-20">
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-[440px] bg-slate-100 rounded-[3.5rem] animate-pulse" />
                  ))}
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-20 duration-1000">
                  {filteredCommunities.map((comm) => {
                    const isMember = myMemberships.includes(comm.id);
                    return (
                      <div key={comm.id} className="bg-white rounded-[3.5rem] p-12 border border-[#292828]/5 shadow-xl hover:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] hover:-translate-y-4 transition-all duration-700 overflow-hidden relative group h-full flex flex-col">
                         
                         {/* Card Architecture - Identity Hub */}
                         <div className="flex items-start justify-between mb-12 relative z-10 w-full">
                            <div className="h-20 w-20 bg-[#292828]/5 rounded-3xl flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all duration-700 shadow-premium">
                               <Compass size={36} />
                            </div>
                            <div className="flex flex-col items-end">
                               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none mb-2">Authority Score</p>
                               <div className="flex items-center gap-1.5">
                                  <TrendingUp size={16} className="text-[#E53935]" />
                                  <p className="text-3xl font-black text-[#292828]">{comm.community_members?.[0]?.count ? Math.min(comm.community_members[0].count * 7 + 60, 99) : 65}%</p>
                               </div>
                            </div>
                         </div>

                         <div className="mb-10 relative z-10 flex-1">
                            <h3 className="text-3xl font-black text-[#292828] tracking-tight leading-[1.1] mb-5 group-hover:text-[#E53935] transition-colors">{comm.name}</h3>
                            <div className="flex items-center gap-3 mb-6">
                               <div className="px-3 h-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5"><CheckCircle2 size={10} /> Verified Node</div>
                               <div className="px-3 h-6 bg-[#292828]/5 border border-[#292828]/10 text-[#292828]/40 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 truncate max-w-[120px]"><Users size={10} /> {comm.community_members?.[0]?.count || 0} Partners</div>
                            </div>
                            <p className="text-[14px] font-semibold text-slate-400 leading-relaxed">
                               {comm.description || "Synthesizing high-authority business relationships and regional situational awareness within this syndicate node."}
                            </p>
                         </div>

                         <div className="space-y-4 pt-8 border-t border-slate-50 relative z-10 mt-auto">
                            <button 
                              onClick={() => handleJoin(comm.id)}
                              className={cn(
                                "w-full h-16 rounded-[1.5rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 group/btn overflow-hidden",
                                isMember 
                                  ? "bg-slate-100 text-slate-400 hover:text-[#E53935] hover:bg-red-50" 
                                  : "bg-[#292828] text-white hover:bg-[#E53935]"
                              )}
                            >
                               {isMember ? (
                                 <><Shield size={18} /> Authorized</>
                               ) : (
                                 <><Plus size={18} /> Join Hub</>
                               )}
                            </button>

                            {isMember && comm.room_id && (
                              <button 
                                onClick={() => router.push(`/chat?room=${comm.room_id}`)}
                                className="w-full h-14 bg-white border-2 border-[#292828] text-[#292828] rounded-[1.25rem] flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest hover:bg-[#292828] hover:text-white transition-all shadow-lg group/chat"
                              >
                                 Broadcast Command <MessageSquare size={16} className="group-hover/chat:animate-bounce" />
                              </button>
                            )}
                         </div>

                         {/* Backdrop Decal */}
                         <div className="absolute -bottom-16 -right-16 text-[#292828]/[0.02] group-hover:text-[#E53935]/[0.04] transition-all duration-1000 -rotate-12 group-hover:rotate-6 pointer-events-none">
                            <Globe size={240} strokeWidth={1} />
                         </div>
                      </div>
                    );
                  })}

                  {/* FOUND A NEW NODE - CAROUSEL STYLE ENTRANCE */}
                  <div 
                    className="bg-[#292828] rounded-[3.5rem] p-12 text-white flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-[#E53935] transition-all duration-1000 shadow-4xl relative overflow-hidden h-full min-h-[440px]"
                    onClick={() => router.push('/profile')} // Link to where communities are created if possible
                  >
                     <div className="h-24 w-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-90 transition-all duration-700 shadow-inner">
                        <Plus size={48} className="text-[#E53935] group-hover:text-white" />
                     </div>
                     <h3 className="text-3xl font-black uppercase tracking-tight mb-5">Found a Node</h3>
                     <p className="text-[14px] font-bold text-white/30 leading-relaxed mb-10 max-w-[240px]">
                        Architect a new syndicate node for your industry or regional operational hub.
                     </p>
                     <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-[#E53935] group-hover:text-white transition-all">
                        Initiate Protocol <ArrowRight size={16} />
                     </div>
                     
                     {/* Patterns */}
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                     <div className="absolute bottom-0 right-0 w-full h-2/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
               </div>
            )}

            {filteredCommunities.length === 0 && !isLoading && (
               <div className="py-60 text-center bg-white rounded-[4rem] border border-[#292828]/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                  <div className="h-32 w-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-[#292828]/10 group-hover:scale-110 group-hover:text-[#E53935]/20 transition-all duration-700">
                     <Globe size={64} strokeWidth={1} />
                  </div>
                  <h3 className="text-4xl font-black text-[#292828] uppercase tracking-tighter">Zero Nodes Detected</h3>
                  <p className="max-w-md mx-auto text-slate-400 font-bold mt-6 text-lg">Your situational scan returned no matching syndicates. Adjust your discovery parameters or initiate a new node founding protocol.</p>
               </div>
            )}
         </div>

         {/* TERMINAL FOOTER AUDIT */}
         <div className="mt-40 text-center pb-20">
            <p className="text-[11px] font-black text-[#292828]/10 uppercase tracking-[0.5em] mb-4">Checkout Operating System V.7</p>
            <div className="flex items-center justify-center gap-8">
               <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black text-[#292828]/40 uppercase tracking-widest">Network Live</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-[9px] font-black text-[#292828]/40 uppercase tracking-widest">Discovery Synced</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
