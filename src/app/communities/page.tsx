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
  CheckCircle2,
  Sparkles,
  Command,
  Maximize2
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
      
      {/* 1. PRISTINE SYNDICATE HERO - WHITE AESTHETIC */}
      <section className="bg-white border-b border-slate-100 pt-32 pb-44 px-6 lg:px-10 relative overflow-hidden">
         {/* Background Subtle Neural Patterns */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E53935]/[0.02] rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#292828_1px,transparent_1px)] [background-size:40px_40px]" />
         </div>

         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
               <div className="max-w-4xl">
                  <div className="flex items-center gap-4 mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
                     <div className="h-0.5 w-16 bg-[#E53935]" />
                     <p className="text-[12px] font-black uppercase tracking-[0.5em] text-[#292828]/40">Regional Syndicate Expansion</p>
                  </div>
                  <h1 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-[#292828] mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                     Strategic <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#292828] to-[#292828]/40">Alliances</span>
                  </h1>
                  <p className="text-xl lg:text-2xl font-medium text-[#292828]/50 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-16 duration-1000">
                     Sync with high-authority regional business nodes. <br className="hidden lg:block" /> Gain absolute situational awareness through shared domain intelligence.
                  </p>
               </div>

               <div className="flex flex-col lg:items-end gap-6 animate-in fade-in slide-in-from-right-12 duration-1000">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-[#E53935] shadow-2xl backdrop-blur-3xl"><Activity size={28} /></div>
                        <div className="text-left">
                           <p className="text-3xl font-black text-[#292828] leading-none">{communities.length}</p>
                           <p className="text-[10px] font-black uppercase text-[#292828]/20 tracking-widest mt-1">Operational Hubs</p>
                        </div>
                     </div>
                     <div className="h-12 w-[1px] bg-slate-100" />
                     <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-emerald-500 shadow-2xl backdrop-blur-3xl"><Zap size={28} /></div>
                        <div className="text-left">
                           <p className="text-3xl font-black text-[#292828] leading-none">High</p>
                           <p className="text-[10px] font-black uppercase text-[#292828]/20 tracking-widest mt-1">Network Density</p>
                        </div>
                     </div>
                  </div>
                  <button onClick={() => router.push('/profile')} className="h-16 px-10 bg-[#292828] text-white rounded-[1.75rem] font-black text-xs uppercase tracking-widest hover:bg-[#E53935] shadow-4xl transition-all active:scale-95 flex items-center gap-4">
                     Found a Syndicate <Plus size={18} />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* 2. SYNDICATE DISCOVERY HUB - WHITE GLASSMORPHISM */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 lg:-mt-28 relative z-20">
         
         {/* FLOATING SEARCH HUD */}
         <div className="bg-white/90 backdrop-blur-3xl p-6 rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col lg:flex-row items-center gap-6 transition-all hover:shadow-[0_64px_128px_-16px_rgba(0,0,0,0.14)] group/dock">
            <div className="w-full relative">
               <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/dock:text-[#E53935] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search by syndicate name or regional expertise..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-20 bg-slate-50 border border-transparent rounded-[2rem] pl-20 pr-10 text-lg font-black text-[#292828] focus:bg-white focus:border-[#E53935] outline-none transition-all placeholder:text-[#292828]/10"
               />
            </div>
            <button className="h-20 w-full lg:w-auto px-10 bg-white border border-slate-100 text-[#292828] rounded-[2rem] flex items-center justify-center gap-4 hover:bg-[#292828] hover:text-white transition-all group/f shadow-sm shrink-0 active:scale-95">
               <Filter size={20} className="group-hover/f:rotate-180 transition-transform duration-700" />
               <span className="text-[13px] font-black uppercase tracking-widest">Network Filter</span>
            </button>
         </div>

         {/* SYNDICATE NODES GRID */}
         <div className="mt-20">
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-[480px] bg-white border border-slate-50 rounded-[4.5rem] animate-pulse" />
                  ))}
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-24 duration-1200">
                  {filteredCommunities.map((comm) => {
                    const isMember = myMemberships.includes(comm.id);
                    return (
                      <div key={comm.id} className="bg-white rounded-[4.5rem] p-12 lg:p-14 border border-slate-100 shadow-xl hover:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.06)] hover:-translate-y-5 transition-all duration-700 overflow-hidden relative group h-full flex flex-col">
                         
                         {/* Syndicate Identity */}
                         <div className="flex items-start justify-between mb-14 relative z-10 w-full">
                            <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all duration-700 shadow-2xl border-4 border-white">
                               <Globe size={44} />
                            </div>
                            <div className="flex flex-col items-end">
                               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none mb-3">Authority</p>
                               <div className="flex items-center gap-2">
                                  <TrendingUp size={18} className="text-[#E53935] animate-pulse" />
                                  <p className="text-4xl font-black text-[#292828] tracking-tighter tabular-nums">{comm.community_members?.[0]?.count ? Math.min(comm.community_members[0].count * 8 + 55, 99) : 60}%</p>
                               </div>
                            </div>
                         </div>

                         <div className="mb-12 relative z-10 flex-1">
                            <h3 className="text-4xl font-black text-[#292828] tracking-tighter leading-[0.95] mb-6 group-hover:text-[#E53935] transition-colors duration-500">{comm.name}</h3>
                            <div className="flex flex-wrap gap-2 mb-8">
                               <div className="h-7 px-4 bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-black uppercase flex items-center gap-2 shadow-sm"><ShieldCheck size={12} /> Regional Hub</div>
                               <div className="h-7 px-4 bg-[#292828]/5 border border-[#292828]/5 text-[#292828]/30 rounded-full text-[9px] font-black uppercase flex items-center gap-2"><Users size={12} /> {comm.community_members?.[0]?.count || 0} Partners</div>
                            </div>
                            <p className="text-[15px] font-semibold text-slate-400 leading-relaxed italic">
                               "{comm.description || "Synthesizing regional operational intelligence and high-authority business relationships within this syndicate hub."}"
                            </p>
                         </div>

                         <div className="space-y-4 pt-10 border-t border-slate-50 relative z-10 mt-auto">
                            <button 
                              onClick={() => handleJoin(comm.id)}
                              className={cn(
                                "w-full h-16 rounded-[1.75rem] flex items-center justify-center gap-5 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] active:scale-95 group/btn overflow-hidden relative",
                                isMember 
                                  ? "bg-slate-100 text-slate-400 group-hover:bg-red-50 group-hover:text-[#E53935]" 
                                  : "bg-[#292828] text-white hover:bg-[#E53935]"
                              )}
                            >
                               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                               {isMember ? (
                                 <><CheckCircle2 size={20} className="relative z-10" /> Authorized Member</>
                               ) : (
                                 <><Plus size={20} className="relative z-10" /> Join Syndicate</>
                               )}
                            </button>

                            {isMember && comm.room_id && (
                              <button 
                                onClick={() => router.push(`/chat?room=${comm.room_id}`)}
                                className="w-full h-14 bg-white border-2 border-[#292828] text-[#292828] rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest hover:bg-[#292828] hover:text-white transition-all shadow-xl group/chat"
                              >
                                 Broadcast Command <MessageSquare size={18} className="group-hover/chat:scale-110 transition-transform" />
                              </button>
                            )}
                         </div>

                         {/* Backdrop Decal Decal */}
                         <div className="absolute -bottom-24 -right-24 text-[#292828]/[0.01] group-hover:text-[#E53935]/[0.03] transition-all duration-1500 -rotate-12 group-hover:rotate-12 pointer-events-none">
                            <Users size={340} strokeWidth={1} />
                         </div>
                      </div>
                    );
                  })}

                  {/* FOUND A NEW NODE - WHITE CTX */}
                  <div 
                    className="bg-white rounded-[4.5rem] p-14 border border-dashed border-[#292828]/20 flex flex-col justify-center items-center text-center group cursor-pointer hover:border-[#E53935] hover:bg-[#E53935]/5 transition-all duration-1000 shadow-sm h-full min-h-[480px] relative overflow-hidden"
                    onClick={() => router.push('/profile')}
                  >
                     <div className="h-28 w-28 bg-white shadow-4xl rounded-[2.75rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-90 transition-all duration-700 border border-slate-50">
                        <Plus size={54} className="text-[#E53935]" />
                     </div>
                     <h3 className="text-4xl font-black text-[#292828] uppercase tracking-tighter mb-6 underline decoration-[#E53935]/10 underline-offset-8 group-hover:decoration-[#E53935]/40 transition-all">Found a Node</h3>
                     <p className="text-[16px] font-bold text-slate-400 leading-relaxed mb-12 max-w-[280px]">
                        Architect a new syndicate node for your industry or regional operational hub.
                     </p>
                     <div className="flex items-center gap-4 text-[13px] font-black uppercase tracking-[0.3em] text-[#292828] group-hover:text-[#E53935] transition-all">
                        Initiate Protocol <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                     </div>
                     
                     <div className="absolute inset-x-0 bottom-0 h-2 bg-slate-50 group-hover:bg-[#E53935] transition-all duration-1000" />
                  </div>
               </div>
            )}

            {filteredCommunities.length === 0 && !isLoading && (
               <div className="py-64 text-center bg-white rounded-[5rem] border border-slate-50 shadow-3xl relative overflow-hidden group">
                  <div className="h-40 w-40 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-[#292828]/5 group-hover:scale-110 group-hover:text-[#E53935]/10 transition-all duration-1000">
                     <Globe size={96} strokeWidth={1} />
                  </div>
                  <h3 className="text-5xl font-black text-[#292828] uppercase tracking-tighter mt-12">Zero Alliances Found</h3>
                  <p className="max-w-md mx-auto text-slate-300 font-bold mt-6 text-xl leading-relaxed italic">Your situational scan returned no matching syndicate nodes. Adjust your discovery parameters or initiate a new node founding protocol.</p>
               </div>
            )}
         </div>

         {/* TERMINAL FOOTER - OS V.7 */}
         <div className="mt-48 text-center pb-24 border-t border-slate-50 pt-16">
            <p className="text-[12px] font-black text-slate-200 uppercase tracking-[0.5em] mb-6">Checkout Operating System V.7</p>
            <div className="flex items-center justify-center gap-10">
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-[11px] font-black text-[#292828]/20 uppercase tracking-widest">Network Verified</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                  <span className="text-[11px] font-black text-[#292828]/20 uppercase tracking-widest">Global Sync</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
