"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Sparkles, 
  Zap, 
  Target, 
  Briefcase, 
  ArrowUpRight, 
  ShieldCheck, 
  Search, 
  Filter, 
  ChevronDown, 
  X, 
  CheckCircle2, 
  MessageSquare,
  MapPin,
  TrendingUp,
  Award,
  Layers,
  BrainCircuit,
  Fingerprint,
  MoreVertical,
  Clock,
  ChevronRight,
  Loader2,
  Lock,
  User,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
type MatchProfile = {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  location: string;
  skills: string[];
  metadata?: {
    match_score?: number;
    industry?: string;
    stage?: string;
    experience?: string;
    intents?: string[];
    checkoutScore?: number;
  };
  connection_status?: "NONE" | "PENDING" | "ACCEPTED";
};

// --- CORE UTILS ---
const calculateProfileMatch = (me: any, target: any) => {
  let score = 65; // Base score
  const reasons: string[] = [];

  // 1. Skill Overlap
  const mySkills = me?.skills || [];
  const targetSkills = target?.skills || [];
  const overlap = targetSkills.filter((s: string) => mySkills.includes(s));
  if (overlap.length > 0) {
    score += 15;
    reasons.push(`${overlap[0]} expertise match`);
  } else {
    reasons.push("Complementary partners found");
  }

  // 2. Intent Alignment
  const myIntents = me?.metadata?.intents || [];
  const targetIntents = target?.metadata?.intents || [];
  const intentOverlap = targetIntents.filter((i: string) => myIntents.includes(i));
  if (intentOverlap.length > 0) {
    score += 10;
    reasons.push("Shared business intent");
  }

  // 3. Regional Priority
  if (me?.location === target?.location) {
    score += 5;
    reasons.push("Regional proximity");
  }

  return { score: Math.min(score, 98), reasons: reasons.slice(0, 2) };
};

import { useAuth } from "@/hooks/useAuth";

export default function PremiumPartnersPage() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"DISCOVER" | "REQUESTS">("DISCOVER");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [partners, setPartners] = useState<MatchProfile[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [connectModal, setConnectModal] = useState<{ isOpen: boolean; user: MatchProfile | null }>({ isOpen: false, user: null });
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  // --- DATA HYDRATION ---
  const initPartners = async () => {
    if (!authUser) return;
    setIsLoading(true);

    // 1. Fetch Profile
    const myProfile = authUser;

    // 2. Fetch Profiles + Connections Status
    const [profilesRes, connectionsRes] = await Promise.all([
      supabase.from('profiles').select('*').neq('id', authUser.id),
      supabase.from('connections').select('*').or(`sender_id.eq.${authUser.id},receiver_id.eq.${authUser.id}`)
    ]);

    if (profilesRes.data) {
      const connections = connectionsRes.data || [];
      const mapped = profilesRes.data.map(p => {
        const conn = connections.find(c => c.sender_id === p.id || c.receiver_id === p.id);
        const matchData = calculateProfileMatch(myProfile, p);
        return {
          ...p,
          connection_status: conn ? (conn.status === 'PENDING' ? 'PENDING' : 'ACCEPTED') : 'NONE',
          metadata: { ...p.metadata, match_score: matchData.score, reasons: matchData.reasons }
        };
      });
      setPartners(mapped.sort((a,b) => (b.metadata?.match_score || 0) - (a.metadata?.match_score || 0)));
    }

    // 3. Fetch Pending Requests
    const { data: pendingReqs } = await supabase
      .from('connections')
      .select(`id, created_at, message, sender:profiles!connections_sender_id_fkey(*)`)
      .eq('receiver_id', authUser.id)
      .eq('status', 'PENDING');
    
    if (pendingReqs) setRequests(pendingReqs);

    setIsLoading(false);
  };

  useEffect(() => { initPartners(); }, []);

  const handleConnect = async () => {
    if (!connectModal.user || !authUser) return;
    setIsSending(true);
    const { error } = await supabase.from('connections').insert({
      sender_id: authUser.id, receiver_id: connectModal.user.id, message: message, status: 'PENDING'
    });
    if (!error) {
      setPartners(prev => prev.map(p => p.id === connectModal.user?.id ? { ...p, connection_status: 'PENDING' } : p));
      setConnectModal({ isOpen: false, user: null }); setMessage("");
    }
    setIsSending(false);
  };

  const handleRequestAction = async (id: string, status: 'ACCEPTED' | 'REJECTED', partnerId?: string) => {
    const { error } = await supabase.from('connections').update({ status }).eq('id', id);
    if (!error) {
      if (status === 'ACCEPTED' && partnerId) {
        router.push(`/chat?user=${partnerId}`);
      } else {
        initPartners();
      }
    }
  };

  const filteredPartners = useMemo(() => {
    return partners.filter(p => 
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [partners, searchQuery]);

  const bestMatches = filteredPartners.slice(0, 6);
  const complimentary = filteredPartners.filter(p => !p.skills.some(s => authUser?.skills?.includes(s))).slice(0, 6);
  const regional = filteredPartners.filter(p => p.location === authUser?.location).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-[#E53935]/10 pb-40">
      
      {/* PARTNER DISCOVERY HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-[60] px-6 py-4 lg:px-10 lg:py-6">
         <div className="max-w-none mx-auto flex flex-col xl:flex-row items-center justify-between gap-6">
            
            {/* LEADING: PARTNER IDENTITY */}
            <div className="flex items-center gap-8 w-full xl:w-auto">
               <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                     <div className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
                     <h1 className="text-xl lg:text-2xl font-black text-[#292828] uppercase tracking-[-0.04em] leading-none font-outfit">Neural Match Engine</h1>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] pl-5">Business Directory v.7</p>
               </div>
               
               <div className="hidden sm:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
                  <button 
                    onClick={() => setViewMode("GRID")}
                    className={cn("h-8 px-4 rounded-lg flex items-center justify-center transition-all", viewMode === "GRID" ? "bg-white text-[#E53935] shadow-sm border border-slate-200" : "text-slate-300 hover:text-[#292828]")}
                  >
                     <Layers size={14} />
                  </button>
                  <button 
                    onClick={() => setViewMode("LIST")}
                    className={cn("h-8 px-4 rounded-lg flex items-center justify-center transition-all", viewMode === "LIST" ? "bg-white text-[#E53935] shadow-sm border border-slate-200" : "text-slate-300 hover:text-[#292828]")}
                  >
                     <MoreHorizontal size={14} />
                  </button>
               </div>
            </div>

            {/* CENTER/TRAILING: INSTRUCTION DOCK & SEARCH */}
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full xl:w-auto flex-1 xl:justify-end">
               <div className="relative w-full lg:max-w-xl group">
                  <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E53935] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search for profiles..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 text-[12px] font-bold text-[#292828] outline-none focus:bg-white focus:border-[#E53935]/20 focus:ring-4 focus:ring-[#E53935]/5 transition-all placeholder:text-slate-300 placeholder:italic"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
                     <kbd className="h-6 px-2 bg-white border border-slate-200 rounded-md text-[9px] font-black text-slate-300 flex items-center">CMD</kbd>
                     <kbd className="h-6 px-2 bg-white border border-slate-200 rounded-md text-[9px] font-black text-slate-300 flex items-center">K</kbd>
                  </div>
               </div>

               <div className="flex items-center gap-3 w-full lg:w-auto">
                  <button onClick={() => setIsFilterOpen(true)} className="h-12 w-full lg:w-auto px-6 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#292828] hover:bg-slate-50 hover:border-[#292828]/20 transition-all shadow-sm active:scale-95 group/f">
                     <Filter size={14} className="group-hover/f:rotate-180 transition-transform duration-500" /> Filters
                  </button>
                  
                  <div className="h-8 w-px bg-slate-200 hidden xl:block mx-1" />
                  
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/50 w-full lg:w-auto">
                     <button 
                       onClick={() => setActiveTab("DISCOVER")}
                       className={cn("flex-1 lg:px-6 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === "DISCOVER" ? "bg-[#292828] text-white shadow-xl shadow-black/10" : "text-slate-400 hover:text-[#292828]")}
                     >
                        Discover
                     </button>
                     <button 
                       onClick={() => setActiveTab("REQUESTS")}
                       className={cn("flex-1 lg:px-6 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative", activeTab === "REQUESTS" ? "bg-[#292828] text-white shadow-xl shadow-black/10" : "text-slate-400 hover:text-[#292828]")}
                     >
                        Requests
                        {requests.length > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#E53935] rounded-full ring-2 ring-white animate-pulse" />}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </header>

      <main className="max-w-none mx-auto px-6 lg:px-10 pt-10 lg:pt-16">
         
         <AnimatePresence mode="wait">
            {activeTab === "DISCOVER" ? (
              <motion.div 
                key="discover" 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-20 lg:space-y-32"
              >
                 {/* SECTION: BEST MATCHES */}
                 <section className="space-y-12">
                    <h2 className="text-[10px] lg:text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] lg:tracking-[0.4em] flex items-center gap-4">
                       <Zap size={14} className="text-[#E53935]" /> Best Matches
                    </h2>
                    <div className={cn(
                      viewMode === "GRID" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
                    )}>
                       {bestMatches.map((p) => (
                         viewMode === "GRID" 
                          ? <PartnerCard key={p.id} partner={p} onConnect={() => setConnectModal({ isOpen: true, user: p })} />
                          : <PartnerListRow key={p.id} partner={p} onConnect={() => setConnectModal({ isOpen: true, user: p })} />
                       ))}
                    </div>
                 </section>

                 {/* SECTION: SKILLS */}
                 <section className="space-y-12">
                    <h2 className="text-[10px] lg:text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] lg:tracking-[0.4em] flex items-center gap-4">
                       <BrainCircuit size={14} className="text-emerald-600" /> New Opportunities
                    </h2>
                    <div className={cn(
                      viewMode === "GRID" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
                    )}>
                       {complimentary.map((p) => (
                         viewMode === "GRID" 
                          ? <PartnerCard key={p.id} partner={p} onConnect={() => setConnectModal({ isOpen: true, user: p })} />
                          : <PartnerListRow key={p.id} partner={p} onConnect={() => setConnectModal({ isOpen: true, user: p })} />
                       ))}
                    </div>
                 </section>

                 {/* SECTION: REGIONAL */}
                 <section className="space-y-12">
                    <h2 className="text-[10px] lg:text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] lg:tracking-[0.4em] flex items-center gap-4">
                       <MapPin size={14} className="text-blue-500" /> People Nearby
                    </h2>
                    <div className={cn(
                      viewMode === "GRID" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
                    )}>
                       {regional.map((p) => (
                         viewMode === "GRID" 
                          ? <PartnerCard key={p.id} partner={p} onConnect={() => setConnectModal({ isOpen: true, user: p })} />
                          : <PartnerListRow key={p.id} partner={p} onConnect={() => setConnectModal({ isOpen: true, user: p })} />
                       ))}
                    </div>
                 </section>
              </motion.div>
            ) : (
              // ... requests section remains similar
<motion.div 
                key="requests" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[1000px] mx-auto space-y-6"
              >
                 <div className="flex items-center justify-between mb-10">
                    <h2 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Incoming Requests</h2>
                    <span className="text-[10px] font-black text-slate-400">{requests.length} Profiles Waiting</span>
                 </div>

                 {requests.length > 0 ? requests.map((req) => (
                   <RequestCard key={req.id} request={req} onAction={(id, status) => handleRequestAction(id, status, req.sender?.id)} />
                 )) : (
                   <div className="py-40 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[3rem]">
                      <Users size={40} className="mx-auto text-slate-200 mb-6" />
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No incoming requests</p>
                   </div>
                 )}
              </motion.div>
            )}
         </AnimatePresence>

      </main>

      {/* FILTER PANEL */}
      <AnimatePresence>
         {isFilterOpen && (
           <div className="fixed inset-0 z-[100] flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#292828]/40 backdrop-blur-md" 
                onClick={() => setIsFilterOpen(false)} 
              />
              <motion.aside 
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="relative w-full max-w-[480px] bg-white h-full shadow-4xl p-12 overflow-y-auto"
              >
                 <div className="flex items-center justify-between mb-16">
                    <h2 className="text-2xl font-black text-[#292828] uppercase tracking-tighter">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center"><X size={20} /></button>
                 </div>

                 <div className="space-y-12">
                     <FilterSection label="Role" options={["Student", "MSME", "Professional", "Entrepreneur"]} />
                     <FilterSection label="Industry" options={["Technology", "Logistics", "Retail", "Manufacturing", "Finance"]} />
                     <FilterSection label="Goals" options={["Hiring", "Funding", "Scale", "Networking", "Learning"]} />
                     <FilterSection label="Experience" options={["Founder", "Manager", "Expert", "Junior"]} />
                 </div>

                 <div className="mt-20 pt-10 border-t border-slate-100">
                    <button className="w-full h-16 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all">Apply Filters</button>
                 </div>
              </motion.aside>
           </div>
         )}
      </AnimatePresence>

      {/* CONNECT MODAL */}
      <AnimatePresence>
         {connectModal.isOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#292828]/60 backdrop-blur-md" onClick={() => setConnectModal({ isOpen: false, user: null })} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-[540px] bg-white rounded-[3rem] p-12 shadow-4xl">
                 <div className="flex items-center gap-6 mb-10">
                    <div className="h-20 w-20 rounded-[1.75rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-2xl flex items-center justify-center bg-[#292828]/5">
                       {connectModal.user?.avatar_url ? <img src={connectModal.user.avatar_url} className="w-full h-full object-cover" /> : <User size={30} className="text-[#292828]/20" />}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-[#292828] uppercase tracking-tight">Connect with {connectModal.user?.full_name}</h3>
                       <p className="text-[11px] font-black text-[#E53935] uppercase tracking-widest">{connectModal.user?.role}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-1">Message (Optional)</label>
                       <textarea 
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         placeholder="Why do you want to connect? " 
                         className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-[13px] font-bold outline-none focus:bg-white focus:border-[#E53935]/20 transition-all resize-none"
                       />
                    </div>
                    <div className="p-5 bg-emerald-50 rounded-2xl flex gap-4">
                       <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                       <p className="text-[10px] font-bold text-emerald-600 uppercase leading-relaxed">Connecting creates a secure connection. Chat will be enabled upon acceptance.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-10">
                    <button onClick={() => setConnectModal({ isOpen: false, user: null })} className="h-16 bg-slate-50 text-slate-400 rounded-2xl font-black text-[11px] uppercase hover:bg-slate-100 transition-all">Cancel</button>
                    <button 
                      onClick={handleConnect}
                      disabled={isSending}
                      className="h-16 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                       {isSending ? <Loader2 className="animate-spin" size={18} /> : <>Send Request <Zap size={18} /></>}
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function PartnerCard({ partner, onConnect }: { partner: MatchProfile; onConnect: () => void }) {
  const router = useRouter();
  const score = partner.metadata?.match_score || 0;
  const reasons = (partner as any).metadata?.reasons || [];

  return (
    <div className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-[0_40px_60px_-15px_rgba(15,23,42,0.08)] hover:border-slate-200 transition-all duration-700 relative overflow-hidden">
       {/* Ambient Backdrop */}
       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_top_right,rgba(229,57,53,0.03),transparent_70%)]" />

       <div className="flex flex-col h-full relative z-10">
          <div className="flex items-start justify-between mb-8">
             <div className="relative">
                <div className="h-20 w-20 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-700 flex items-center justify-center bg-[#292828]/5">
                   {partner.avatar_url ? <img src={partner.avatar_url} className="w-full h-full object-cover" /> : <User size={30} className="text-[#292828]/20" />}
                </div>
                {partner.connection_status === 'ACCEPTED' && (
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                     <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                )}
             </div>

             {/* Match Visualizer */}
             <div className="flex flex-col items-end">
                <div className="h-14 w-14 rounded-full border-4 border-slate-50 flex items-center justify-center relative group/score">
                   <svg className="absolute inset-0 -rotate-90">
                      <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-50" />
                      <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="150" strokeDashoffset={150 - (150 * score) / 100} className="text-[#E53935]" />
                   </svg>
                   <span className="text-[12px] font-black text-[#292828] tabular-nums">{score}%</span>
                </div>
             </div>
          </div>

          <div className="space-y-1 mb-6">
             <h3 className="text-xl font-black text-[#292828] uppercase tracking-tight group-hover:text-[#E53935] transition-colors">{partner.full_name}</h3>
             <p className="text-[10px] font-black text-[#E53935] uppercase tracking-[0.2em]">{partner.role}</p>
          </div>

          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-50 mb-8 space-y-3">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Reason for Match</p>
             <div className="space-y-2">
                {reasons.map((r: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="h-1 w-1 rounded-full bg-[#E53935]" />
                     <span className="text-[11px] font-bold text-[#292828]/70 leading-tight">{r}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
             {partner.skills?.slice(0, 3).map(s => (
               <span key={s} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-400 group-hover:text-slate-900 group-hover:border-slate-200 transition-all">{s}</span>
             ))}
          </div>

          <div className="mt-auto grid grid-cols-1 gap-2">
             {partner.connection_status === 'ACCEPTED' ? (
                <button 
                  onClick={() => router.push(`/chat?user=${partner.id}`)}
                  className="w-full h-14 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
                >
                   Message Profile <MessageSquare size={16} />
                </button>
             ) : partner.connection_status === 'PENDING' ? (
                <button className="w-full h-14 bg-slate-100 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 cursor-default">
                   Pending <Clock size={16} />
                </button>
             ) : (
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={onConnect} className="h-14 bg-[#E53935] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-red-500/10">
                      Connect <Zap size={14} />
                   </button>
                   <button onClick={() => router.push(`/profile/${partner.id}`)} className="h-14 bg-slate-50 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 hover:text-[#292828] transition-all">
                      Profile
                   </button>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

function RequestCard({ request, onAction }: { request: any; onAction: (id: string, s: any) => void }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-xl transition-all group relative overflow-hidden">
       <div className="flex items-center gap-8">
          <div className="h-20 w-20 rounded-[1.75rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-xl flex items-center justify-center bg-[#292828]/5">
             {request.sender?.avatar_url ? <img src={request.sender.avatar_url} className="w-full h-full object-cover" /> : <User size={30} className="text-[#292828]/20" />}
          </div>
          
          <div className="flex-1">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-[#292828] uppercase tracking-tight">{request.sender?.full_name}</h3>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(request.created_at).toLocaleDateString()}</span>
             </div>
             <p className="text-[10px] font-black text-[#E53935] uppercase tracking-widest mb-4">{request.sender?.role} • {request.sender?.location}</p>
             {request.message && (
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[12px] font-medium text-[#292828]/70 italic leading-tight">"{request.message}"</p>
               </div>
             )}
          </div>

          <div className="flex gap-4">
             <button onClick={() => onAction(request.id, 'ACCEPTED')} className="h-14 px-8 bg-[#292828] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl">Accept Request</button>
             <button onClick={() => onAction(request.id, 'REJECTED')} className="h-14 px-8 bg-slate-50 text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-red-500 hover:border hover:border-red-100 transition-all">Ignore</button>
          </div>
       </div>
    </div>
  );
}

function FilterSection({ label, options }: { label: string; options: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (opt: string) => setSelected(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);

  return (
    <div className="space-y-6">
       <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">{label}</h4>
       <div className="flex flex-wrap gap-2">
          {options.map(opt => (
            <button 
              key={opt} 
              onClick={() => toggle(opt)}
              className={cn(
                "px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all border-2",
                selected.includes(opt) ? "bg-[#292828] border-black text-white shadow-lg" : "bg-white border-slate-50 text-slate-400 hover:border-slate-200"
              )}
            >
               {opt}
            </button>
          ))}
       </div>
    </div>
  );
}

function PartnerListRow({ partner, onConnect }: { partner: MatchProfile; onConnect: () => void }) {
  const router = useRouter();
  const score = partner.metadata?.match_score || 0;

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all flex items-center gap-8">
       <div className="h-16 w-16 rounded-xl bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center bg-[#292828]/5 border border-slate-100">
          {partner.avatar_url ? <img src={partner.avatar_url} className="w-full h-full object-cover" /> : <User size={24} className="text-[#292828]/20" />}
       </div>
       
       <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
             <h3 className="text-base font-black text-[#292828] uppercase truncate">{partner.full_name}</h3>
             <span className="px-2 py-0.5 bg-red-50 text-[#E53935] rounded-md text-[8px] font-black uppercase tracking-widest">{partner.role}</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{partner.location} • {partner.skills.slice(0, 3).join(', ')}</p>
       </div>

       <div className="flex items-center gap-8 px-8 border-x border-slate-100">
          <div className="text-center">
             <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Alignment</p>
             <p className="text-lg font-black text-[#292828]">{score}%</p>
          </div>
       </div>

       <div className="flex gap-2">
          {partner.connection_status === 'ACCEPTED' ? (
             <button onClick={() => router.push(`/chat?user=${partner.id}`)} className="h-12 px-6 bg-[#292828] text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all">Message</button>
          ) : partner.connection_status === 'PENDING' ? (
             <button className="h-12 px-6 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase cursor-default">Pending</button>
          ) : (
             <button onClick={onConnect} className="h-12 px-6 bg-[#E53935] text-white rounded-xl text-[10px] font-black uppercase hover:bg-red-600 transition-all shadow-lg shadow-red-500/10">Connect</button>
          )}
          <button onClick={() => router.push(`/profile/${partner.id}`)} className="h-12 w-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100"><ArrowUpRight size={16} /></button>
       </div>
    </div>
  );
}
