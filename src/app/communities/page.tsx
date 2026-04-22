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
  Filter
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
      
      // 1. Fetch Memberships
      if (user) {
        const { data: members } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', user.id);
        if (members) setMyMemberships(members.map(m => m.community_id));
      }

      // 2. Fetch All Communities
      const { data: allComms } = await supabase
        .from('communities')
        .select('*, community_members(count)')
        .order('name');
      
      if (allComms) setCommunities(allComms);
      setIsLoading(false);
    }
    initCommunities();
  }, []);

  const handleJoin = async (commId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Authentic Identity Required. Please login.");
      return;
    }

    const isMember = myMemberships.includes(commId);

    if (isMember) {
      // Leave
      await supabase
        .from('community_members')
        .delete()
        .eq('community_id', commId)
        .eq('user_id', user.id);
      setMyMemberships(prev => prev.filter(id => id !== commId));
    } else {
      // Join
      await supabase
        .from('community_members')
        .insert([{ community_id: commId, user_id: user.id, role: 'MEMBER' }]);
      setMyMemberships(prev => [...prev, commId]);
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40">
      
      {/* 1. HERO / ONBOARDING HEADER */}
      <div className="bg-[#292828] text-white pt-24 pb-32 px-10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E53935]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
         
         <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="h-1px w-12 bg-[#E53935]" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E53935]">Network Expansion</p>
            </div>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-8 -ml-1">
               Strategic <br /> Communities
            </h1>
            <p className="text-xl font-medium text-white/50 max-w-2xl leading-relaxed">
               Sync with regional business nodes. Access exclusive mandates, shared capital, and domain-specific intelligence.
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
               <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4 hover:bg-white/10 transition-all cursor-default">
                  <Activity size={24} className="text-[#E53935]" />
                  <div>
                     <p className="text-2xl font-black leading-none">{communities.length}</p>
                     <p className="text-[9px] font-black uppercase text-white/30">Active Hubs</p>
                  </div>
               </div>
               <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4 hover:bg-white/10 transition-all cursor-default">
                  <Zap size={24} className="text-emerald-500" />
                  <div>
                     <p className="text-2xl font-black leading-none">High</p>
                     <p className="text-[9px] font-black uppercase text-white/30">Network Density</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 2. DISCOVERY TERMINAL */}
      <div className="max-w-6xl mx-auto px-6 -mt-16">
         
         {/* SEARCH & FILTERS DOCK */}
         <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-[#292828]/5 flex flex-col md:flex-row items-center gap-4 mb-12">
            <div className="w-full relative group">
               <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E53935] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search by community name or domain expertise..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-6 text-sm font-bold focus:bg-white focus:border-[#E53935] outline-none transition-all"
               />
            </div>
            <button className="h-16 px-8 bg-[#292828] text-white rounded-3xl flex items-center gap-3 hover:bg-[#E53935] transition-all group">
               <Filter size={18} />
               <span className="text-xs font-black uppercase">Filters</span>
            </button>
         </div>

         {/* COMMUNITIES GRID */}
         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-[400px] bg-slate-100 rounded-[3rem] animate-pulse" />
               ))}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
               {filteredCommunities.map((comm) => {
                 const isMember = myMemberships.includes(comm.id);
                 return (
                   <div key={comm.id} className="bg-white rounded-[3rem] p-10 border border-[#292828]/5 shadow-xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
                      
                      {/* Identity Hub */}
                      <div className="flex items-center justify-between mb-10 relative z-10">
                         <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#E53935] group-hover:scale-110 transition-transform shadow-sm">
                            <Users size={32} />
                         </div>
                         <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Members</p>
                            <p className="text-2xl font-black text-[#292828]">{comm.community_members?.[0]?.count || 0}</p>
                         </div>
                      </div>

                      <div className="mb-10 relative z-10">
                         <h3 className="text-2xl font-black text-[#292828] leading-tight mb-3 group-hover:text-[#E53935] transition-colors">{comm.name}</h3>
                         <p className="text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-3">
                            {comm.description || "A strategic node for focused business high-authority networking and shared regional mandates."}
                         </p>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-slate-50 relative z-10 mb-10">
                         <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase">
                            <MapPin size={14} className="text-[#E53935]" /> Regional Node / Trivandrum
                         </div>
                         <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase">
                            <ShieldCheck size={14} className="text-emerald-500" /> Verified Syndicate
                         </div>
                      </div>

                      <button 
                        onClick={() => handleJoin(comm.id)}
                        className={cn(
                          "w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-xl relative z-10 overflow-hidden mb-3",
                          isMember 
                            ? "bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-[#E53935]" 
                            : "bg-[#292828] text-white hover:bg-[#E53935] shadow-slate-200"
                        )}
                      >
                         {isMember ? (
                           <>Member Check <ShieldCheck size={18} /></>
                         ) : (
                           <>Join Syndicate <ArrowUpRight size={18} /></>
                         )}
                      </button>

                      {isMember && comm.room_id && (
                        <button 
                          onClick={() => router.push(`/chat?room=${comm.room_id}`)}
                          className="w-full h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg relative z-10"
                        >
                           Enter Inner Circle <MessageSquare size={16} />
                        </button>
                      )}

                      {/* Backdrop Accent */}
                      <div className="absolute -bottom-10 -right-10 text-slate-50 group-hover:text-[#E53935]/5 transition-colors duration-700 -rotate-12 group-hover:rotate-0">
                         <Users size={180} strokeWidth={1} />
                      </div>
                   </div>
                 );
               })}

               {/* CREATE COMMUNITY PROMPT */}
               <div className="bg-[#292828] rounded-[3rem] p-10 text-white flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-[#E53935] transition-all duration-700 shadow-2xl relative overflow-hidden">
                  <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-125 transition-transform">
                     <Plus size={40} className="text-[#E53935] group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3">Found a Node</h3>
                  <p className="text-[12px] font-medium text-white/50 leading-relaxed mb-8">
                     Start a new community guild for your specific industry or region.
                  </p>
                  <div className="h-1 w-12 bg-white/20 rounded-full group-hover:w-24 transition-all duration-700" />
                  
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
               </div>
            </div>
         )}

         {filteredCommunities.length === 0 && !isLoading && (
            <div className="py-40 text-center bg-white rounded-[3rem] border border-[#292828]/10 shadow-sm">
               <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-[#E53935]">
                  <Globe size={48} />
               </div>
               <h3 className="text-3xl font-black text-[#292828] uppercase">No Hubs Detected</h3>
               <p className="max-w-md mx-auto text-slate-400 font-medium mt-4">We couldn't find any communities matching your search criteria. Try a broader search term or start your own Syndicate.</p>
            </div>
         )}
      </div>

    </div>
  );
}
