"use client";
import React, { useState, useMemo } from "react";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Plus, 
  Clock, 
  LayoutGrid, 
  List,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  BrainCircuit,
  Maximize2,
  Filter,
  Check,
  ChevronRight,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import TerminalLayout from "@/components/layout/TerminalLayout";

const TOPICS = ["All", "Networking", "Investment", "Community", "Strategy", "Tech", "Logistics"];

const MeetupCard = ({ meetup, isJoined, onJoin, viewMode }: { meetup: any; isJoined: boolean; onJoin: () => void; viewMode: string }) => {
  return (
    <div className="group relative">
      <div className={cn(
          "bg-white rounded-[2rem] border border-black/[0.05] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] hover:border-[#E53935]/20 hover:-translate-y-2",
          isJoined && "border-emerald-500/30 ring-4 ring-emerald-500/5 shadow-2xl shadow-emerald-500/10"
      )}>
          <div className="absolute top-6 right-6 z-10">
            <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-lg border border-black/[0.05] flex items-center gap-2 shadow-lg">
                <Sparkles size={14} className="text-[#E53935] animate-pulse" />
                <span className="text-[10px] font-black text-black tracking-widest">{meetup.matchPotential}% Match</span>
            </div>
          </div>

          <div className="p-8 lg:p-10 space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl overflow-hidden border border-black/[0.05] shadow-sm relative group-hover:rotate-3 transition-transform">
                  <img src={meetup.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  <div className="absolute inset-0 bg-[#E53935]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <Link href={`/p/${meetup.author_id}`} className="hover:opacity-80 transition-opacity">
                  <h4 className="text-[14px] font-bold text-[#E53935] leading-none mb-1.5">{meetup.authorName}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-black/30 tracking-widest">{meetup.category} • {meetup.timeAgo}</p>
                    <div className="h-1 w-1 bg-black/10 rounded-full" />
                    <div className="flex items-center gap-1">
                      <Target size={10} className="text-emerald-500" />
                      <span className="text-[9px] font-bold text-emerald-600 tracking-widest">{meetup.trustScore}% Trust</span>
                    </div>
                  </div>
                </Link>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-black tracking-tight group-hover:text-[#E53935] transition-colors">{meetup.title}</h3>
                <p className="text-[14px] font-medium text-black/60 leading-relaxed italic line-clamp-2">"{meetup.content}"</p>
            </div>

            <div className="flex flex-col gap-3">
                <div 
                  onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meetup.location || "Trivandrum")}`, '_blank'); }}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-black/[0.03] group-hover:bg-white group-hover:border-black/[0.1] transition-all cursor-pointer"
                >
                  <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg group-hover:bg-[#E53935]">
                      <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                      <p className="text-[9px] font-bold text-black/30 tracking-widest leading-none mb-1.5">Venue</p>
                      <p className="text-[12px] font-bold text-black truncate">{meetup.location || "Online"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-black/[0.03] group-hover:bg-white group-hover:border-black/[0.1] transition-all">
                  <div className="h-10 w-10 bg-[#E53935]/10 rounded-lg flex items-center justify-center text-[#E53935] shrink-0 border border-[#E53935]/20">
                      <Clock size={18} />
                  </div>
                  <div>
                      <p className="text-[9px] font-bold text-[#E53935] tracking-widest leading-none mb-1.5">Time</p>
                      <p className="text-[12px] font-bold text-black">{meetup.dateTime || "Today, 18:30"}</p>
                  </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-black/[0.05] mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                          <img src={`https://i.pravatar.cc/150?u=${meetup.id + i}`} alt="" className="grayscale" />
                        </div>
                      ))}
                  </div>
                  <span className="text-[11px] font-bold text-black/40">{meetup.attendees}/{meetup.maxAttendees} Occupied</span>
                </div>

                <button 
                  onClick={onJoin}
                  disabled={!isJoined && meetup.attendees >= meetup.maxAttendees}
                  className={cn(
                    "h-14 px-8 rounded-xl font-black text-[11px] tracking-widest transition-all duration-500 shadow-xl flex items-center gap-3 active:scale-95",
                    isJoined 
                    ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                    : meetup.attendees >= meetup.maxAttendees ? "bg-black/10 text-black/20 cursor-not-allowed" : "bg-black text-white hover:bg-[#E53935] shadow-black/10"
                  )}
                >
                  {isJoined ? (
                    <><CheckCircle2 size={18} strokeWidth={3} /> You're in</>
                  ) : meetup.attendees >= meetup.maxAttendees ? (
                    "Full"
                  ) : (
                    <><Plus size={18} strokeWidth={3} /> Join</>
                  )}
                </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default function MeetupPage() {
  const { profile: authUser } = useAuth();
  const router = useRouter();
  const [meetups, setMeetups] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAiArchitect, setShowAiArchitect] = useState(false);
  const [hostStep, setHostStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState("All");
  const [showHostModal, setShowHostModal] = useState(false);
  
  const [meetupType, setMeetupType] = useState<"Open" | "Advisor">("Open");
  const [selectedAdvisor, setSelectedAdvisor] = useState<any | null>(null);
  const [suggestedAdvisors, setSuggestedAdvisors] = useState<any[]>([]);
  const [sortMode, setSortMode] = useState<"NEARBY" | "RELEVANT" | "UPCOMING">("RELEVANT");
  const [userParticipants, setUserParticipants] = useState<string[]>([]);

  const supabase = createClient();

  const initMeetup = async () => {
    if (!authUser) return;
    setIsLoading(true);
    try {
      const { data: meetupData, error: meetupError } = await supabase
        .from('posts')
        .select(`*, author:profiles(id, full_name, avatar_url, match_score)`)
        .eq('type', 'MEETUP')
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      if (meetupError) throw meetupError;

      const { data: participantData } = await supabase
        .from('meetup_participants')
        .select('meetup_id')
        .eq('user_id', authUser.id);
      
      setUserParticipants(participantData?.map(p => p.meetup_id) || []);

      const mapped = (meetupData || []).map(m => {
        const isAdvisorMeetup = m.metadata?.is_advisor_led || false;
        const advisorAccepted = m.metadata?.advisor_accepted !== false;
        const visibility = m.metadata?.visibility || 'open';
        const invitedUsers = m.metadata?.invited_users || [];
        
        let isVisible = true;
        if (isAdvisorMeetup && !advisorAccepted) isVisible = false;
        if (visibility === 'closed' && !invitedUsers.includes(authUser.id) && m.author_id !== authUser.id) isVisible = false;

        return {
          ...m,
          isVisible,
          authorName: m.author?.full_name || "Member",
          avatar: m.author?.avatar_url || `https://i.pravatar.cc/150?u=${m.id}`,
          timeAgo: m.dateTime || "Upcoming",
          matchPotential: m.match_score || 0,
          attendees: m.participant_count || 0,
          maxAttendees: m.max_slots || 8,
          category: m.domain || "Networking",
          isPremium: isAdvisorMeetup,
          advisor: m.author,
          trustScore: m.author?.match_score || 85
        };
      }).filter(m => m.isVisible);

      setMeetups(mapped);
    } catch (err) {
      console.error("Meetup Load Error:", err);
      setMeetups([]); 
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    initMeetup();
  }, [authUser]);

  const filteredMeetups = useMemo(() => {
    let list = meetups.filter(m => activeTopic === "All" || m.category === activeTopic);
    if (sortMode === "NEARBY") {
      list = [...list].sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (sortMode === "RELEVANT") {
      list = [...list].sort((a, b) => b.matchPotential - a.matchPotential);
    } else if (sortMode === "UPCOMING") {
      list = [...list].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }
    return list;
  }, [meetups, activeTopic, sortMode]);

  const topMeetups = useMemo(() => filteredMeetups.filter(m => m.isPremium || m.matchPotential > 90).slice(0, 2), [filteredMeetups]);
  const allMeetups = useMemo(() => filteredMeetups.slice(topMeetups.length), [filteredMeetups, topMeetups]);

  const handleJoin = async (id: string) => {
    if (!authUser) { router.push('/'); return; }
    const isJoined = userParticipants.includes(id);
    if (isJoined) {
      const { data: meetup } = await supabase.from('posts').select('room_id').eq('id', id).single();
      if (meetup?.room_id) router.push(`/chat?room=${meetup.room_id}`);
      else alert("Preparing chat room...");
    } else {
      try {
        const { MeetupService } = await import("@/services/meetup-service");
        const { roomId } = await MeetupService.joinMeetup(id, authUser.id);
        setUserParticipants(prev => [...prev, id]);
        setMeetups(prev => prev.map(m => m.id === id ? { ...m, attendees: m.attendees + 1 } : m));
        if (roomId) router.push(`/chat?room=${roomId}`);
      } catch (err: any) {
        if (err.message === "MEETUP_FULL") alert("Session full");
        else alert("Failed to join session");
      }
    }
  };

  const strategicRecommendations = useMemo(() => {
    if (topMeetups.length > 0) {
      return topMeetups.map(m => ({ title: m.title, time: m.timeAgo, type: m.mode || "Offline", score: m.matchPotential }));
    }
    return [
      { title: "Growth Sync", time: "Tomorrow, 10:00", type: "Virtual", score: 99 },
      { title: "Market Analysis", time: "Friday, 14:30", type: "Local Hub", score: 92 }
    ];
  }, [topMeetups]);

  return (
    <TerminalLayout
      topbarChildren={
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {TOPICS.map(t => (
            <button 
              key={t}
              onClick={() => setActiveTopic(t)}
              className={cn(
                "px-5 h-10 rounded-full text-[11px] font-bold tracking-wide transition-all border shrink-0",
                activeTopic === t ? "bg-black text-white border-black" : "bg-white text-black/40 border-black/[0.05] hover:border-black/10"
              )}
            >
               {t}
            </button>
          ))}
        </div>
      }
      rightSidebar={
        <aside className="w-[420px] p-10 flex flex-col gap-10">
           <section className="space-y-6">
              <div className="flex items-center justify-between">
                 <p className="text-[12px] font-black tracking-widest text-black/20">Strategy Planner</p>
                 <div className="flex items-center gap-2 text-emerald-600">
                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-bold tracking-widest">Live</span>
                 </div>
              </div>
              <div className="p-8 bg-black rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/20 blur-[60px] pointer-events-none" />
                 <BrainCircuit size={160} className="absolute -bottom-16 -right-16 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[4s]" />
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="h-12 w-12 bg-[#E53935] rounded-xl flex items-center justify-center text-white shadow-xl">
                          <Sparkles size={24} />
                       </div>
                       <div>
                          <p className="text-[13px] font-black tracking-tight">AI Insights</p>
                          <p className="text-[9px] font-bold text-white/40 tracking-widest mt-0.5">Contextual mode</p>
                       </div>
                    </div>
                    <p className="text-[14px] font-medium text-white/70 leading-relaxed mb-8">"Select a category to see high-probability match opportunities in your current location."</p>
                    <button onClick={() => setShowAiArchitect(true)} className="w-full h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-[10px] font-black tracking-widest hover:bg-white hover:text-black transition-all">Open AI Toolbox</button>
                 </div>
              </div>
           </section>
           <section className="space-y-6">
              <p className="text-[12px] font-black tracking-widest text-black/20">Discovery Map</p>
              <div className="h-64 bg-white border border-black/[0.05] shadow-sm rounded-[2.5rem] relative overflow-hidden group cursor-crosshair">
                 <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                 <div className="absolute bottom-6 inset-x-6 flex items-center justify-between bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-black/[0.05] shadow-xl">
                    <div>
                       <p className="text-[13px] font-black text-black tracking-tight leading-none mb-1.5">Network Nodes</p>
                       <p className="text-[9px] font-bold text-emerald-600 tracking-widest">{meetups.length} Active sessions</p>
                    </div>
                    <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center text-white hover:bg-[#E53935] transition-colors"><Maximize2 size={16} /></div>
                 </div>
              </div>
           </section>
           <section className="mt-auto space-y-6">
              <p className="text-[12px] font-black tracking-widest text-black/20">Recommendations</p>
              <div className="space-y-4">
                 {strategicRecommendations.map((block, i) => (
                    <div key={i} className="p-5 bg-white border border-black/[0.05] rounded-3xl hover:border-[#E53935]/20 hover:shadow-xl transition-all cursor-pointer group/block">
                       <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 bg-slate-50 border border-black/[0.03] rounded-lg text-[9px] font-bold tracking-widest text-black/40">{block.type}</span>
                          <div className="flex items-center gap-1.5 text-[#E53935]"><Zap size={14} fill="currentColor" /><span className="text-[11px] font-black">{block.score}%</span></div>
                       </div>
                       <h4 className="text-[14px] font-black text-black tracking-tight leading-tight group-hover/block:text-[#E53935] transition-colors">{block.title}</h4>
                       <p className="text-[10px] font-bold text-black/20 tracking-widest mt-1.5">{block.time}</p>
                    </div>
                 ))}
              </div>
            </section>
        </aside>
      }
    >
      <div className="p-8 lg:p-12 space-y-12">
           <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
              <div>
                 <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-lg mb-4">
                    <Target size={12} className="text-emerald-500" /> 
                    <span className="text-[10px] font-bold tracking-widest text-emerald-700">Area Discovery active</span>
                 </div>
                 <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-black">Meetups<span className="text-[#E53935]">.</span></h1>
                 <p className="text-[15px] font-medium text-black/40 mt-2">Connect with partners in your immediate industry node.</p>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setShowAiArchitect(true)} className="h-14 px-8 rounded-2xl bg-black text-white flex items-center gap-4 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all group">
                    <div className="h-10 w-10 bg-[#E53935] rounded-xl flex items-center justify-center text-white shadow-xl animate-pulse"><BrainCircuit size={20} /></div>
                    <div className="text-left">
                       <p className="text-[9px] font-black text-white/50 tracking-widest leading-none mb-1">AI Agent</p>
                       <p className="text-[11px] font-black tracking-widest">Plan Meeting</p>
                    </div>
                 </button>
                 <button onClick={() => { setShowHostModal(true); setHostStep(1); }} className="h-14 px-8 bg-[#E53935] text-white rounded-2xl flex items-center gap-3 text-[11px] font-black tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20 active:scale-95 transition-all"><Plus size={18} /> Host Meetup</button>
              </div>
           </div>

           <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-black/[0.05]">
                {(['NEARBY', 'RELEVANT', 'UPCOMING'] as const).map((mode) => (
                  <button key={mode} onClick={() => setSortMode(mode)} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all", sortMode === mode ? "bg-black text-white shadow-sm" : "text-black/20 hover:text-black/40")}>{mode.charAt(0) + mode.slice(1).toLowerCase()}</button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-black/[0.05]">
                 <button onClick={() => setViewMode("grid")} className={cn("h-10 px-5 rounded-xl flex items-center justify-center transition-all", viewMode === "grid" ? "bg-black text-white shadow-sm" : "text-black/20")}><LayoutGrid size={18} /></button>
                 <button onClick={() => setViewMode("list")} className={cn("h-10 px-5 rounded-xl flex items-center justify-center transition-all", viewMode === "list" ? "bg-black text-white shadow-sm" : "text-black/20")}><List size={18} /></button>
              </div>
           </div>

           <div className="space-y-16">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <div className="h-12 w-12 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-black tracking-widest text-black/20">Syncing node data...</p>
                </div>
              ) : meetups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-slate-50/50 rounded-[3rem] border border-dashed border-black/10">
                   <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-black/5"><Calendar size={40} className="text-black/10" /></div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight">No meetups found nearby</h3>
                      <p className="text-slate-400 max-w-sm mx-auto text-[15px] font-medium leading-relaxed">Expand your search or be the first to host a session in your current industry node.</p>
                   </div>
                   <button onClick={() => { setShowHostModal(true); setHostStep(1); }} className="h-14 px-10 bg-black text-white rounded-2xl text-[11px] font-black tracking-widest hover:bg-[#E53935] transition-all shadow-2xl">Create Meetup</button>
                </div>
              ) : (
                <>
                  {topMeetups.length > 0 && (
                    <div className="space-y-8">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-red-50 text-[#E53935] rounded-xl flex items-center justify-center"><Sparkles size={20} /></div>
                          <h2 className="text-2xl font-black tracking-tight text-black">Top Picks</h2>
                       </div>
                       <div className={cn("grid gap-10", viewMode === "grid" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1")}>
                          {topMeetups.map(m => <MeetupCard key={m.id} meetup={m} isJoined={userParticipants.includes(m.id)} onJoin={() => handleJoin(m.id)} viewMode={viewMode} />)}
                       </div>
                    </div>
                  )}
                  {allMeetups.length > 0 && (
                    <div className="space-y-8">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-black/5 text-black rounded-xl flex items-center justify-center"><List size={20} /></div>
                          <h2 className="text-2xl font-black tracking-tight text-black">Active Stream</h2>
                       </div>
                       <div className={cn("grid gap-10", viewMode === "grid" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1")}>
                          {allMeetups.map(m => <MeetupCard key={m.id} meetup={m} isJoined={userParticipants.includes(m.id)} onJoin={() => handleJoin(m.id)} viewMode={viewMode} />)}
                       </div>
                    </div>
                  )}
                </>
              )}
           </div>
        </div>

      {/* AI PLANNER DRAWER */}
      {showAiArchitect && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowAiArchitect(false)} />
           <aside className="relative w-full max-w-xl bg-white h-full shadow-[-40px_0_100px_rgba(0,0,0,0.1)] flex flex-col p-12 overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <div className="label-premium">Meeting OS v3.0</div>
                    <h2 className="text-3xl font-black">AI <span className="text-[#E53935]">Planner</span></h2>
                 </div>
                 <button onClick={() => setShowAiArchitect(false)} className="h-14 w-14 bg-slate-50 text-black rounded-xl flex items-center justify-center hover:bg-[#E53935] hover:text-white transition-all active:scale-95">
                    <Check size={28} />
                 </button>
              </div>

              <div className="space-y-12">
                 <section className="space-y-6">
                    <p className="text-[12px] font-black tracking-widest text-black/20">Active objectives</p>
                    <div className="space-y-3">
                       {["Schedule series A sync", "Find logistics provider", "Arrange venue for Friday"].map((ob, i) => (
                         <div key={i} className="flex items-center justify-between p-6 bg-white border border-black/[0.05] rounded-2xl group hover:border-[#E53935] transition-all cursor-pointer">
                            <span className="text-[14px] font-bold text-black">{ob}</span>
                            <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-black/20 group-hover:text-[#E53935] transition-colors">
                               <ChevronRight size={18} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>

                 <section className="p-8 bg-[#E53935] rounded-[2.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl shadow-red-500/20">
                    <Sparkles size={120} className="absolute -top-12 -right-12 text-white/10 rotate-12" />
                    <p className="text-[10px] font-bold tracking-widest text-white/40 mb-6">Smart Suggestion</p>
                    <p className="text-[17px] font-bold leading-relaxed relative z-10">
                       "Based on your {filteredMeetups[0]?.matchPotential}% score with local hubs, I recommend joining the <span className="underline decoration-white/30 underline-offset-4">{filteredMeetups[0]?.title}</span> today."
                     </p>
                    <button className="w-full h-16 bg-white text-[#E53935] rounded-xl font-black text-[11px] tracking-widest shadow-2xl relative z-10 hover:scale-[1.02] active:scale-95 transition-all">
                       Auto-Plan Meeting
                    </button>
                 </section>
              </div>
           </aside>
        </div>
      )}

      {/* HOST WIZARD */}
      <AnimatePresence>
        {showHostModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={() => setShowHostModal(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-4xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                   <motion.div initial={{ width: "33%" }} animate={{ width: `${(hostStep / 3) * 100}%` }} className="h-full bg-[#E53935]" />
                </div>
                <div className="p-12 md:p-16">
                   <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 bg-red-50 text-[#E53935] rounded-xl flex items-center justify-center font-black text-sm">0{hostStep}</div>
                         <p className="text-[10px] font-black tracking-widest text-black/30">Step {hostStep} of 4</p>
                      </div>
                      <button onClick={() => setShowHostModal(false)} className="text-black/20 hover:text-black transition-colors"><X size={24} /></button>
                   </div>
                   <AnimatePresence mode="wait">
                      {hostStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                           <div className="space-y-4">
                              <h2 className="text-4xl font-black">Select <span className="text-[#E53935]">System</span></h2>
                              <p className="text-[13px] font-bold text-black/30 tracking-widest">Choose how your meetup is organized.</p>
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              <button onClick={() => setMeetupType("Open")} className={cn("p-8 rounded-3xl border-2 text-left transition-all", meetupType === "Open" ? "border-[#E53935] bg-red-50 shadow-xl" : "border-slate-100 hover:border-[#E53935]/20")}>
                                 <h4 className="text-xl font-black mb-1">Open Meetup</h4>
                                 <p className="text-[11px] font-bold text-black/40">Visible to all relevant industry nodes.</p>
                              </button>
                              <button onClick={() => setMeetupType("Advisor")} className={cn("p-8 rounded-3xl border-2 text-left transition-all", meetupType === "Advisor" ? "border-[#E53935] bg-red-50 shadow-xl" : "border-slate-100 hover:border-[#E53935]/20")}>
                                 <h4 className="text-xl font-black mb-1">Advisor Session <span className="ml-2 text-[10px] bg-[#E53935] text-white px-2 py-0.5 rounded">PREMIUM</span></h4>
                                 <p className="text-[11px] font-bold text-black/40">High signal session led by experts.</p>
                              </button>
                           </div>
                        </motion.div>
                      )}
                      {hostStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                           <div className="space-y-4">
                              <h2 className="text-4xl font-black">The <span className="text-[#E53935]">Agenda</span></h2>
                              <p className="text-[13px] font-bold text-black/30 tracking-widest">What are we building/solving?</p>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-black/20 tracking-widest ml-4">Topic title</label>
                                 <input type="text" placeholder="e.g. Series A Logistics Sync" className="w-full h-18 bg-slate-50 rounded-2xl px-8 text-lg font-bold outline-none border-2 border-transparent focus:border-[#E53935]/20 focus:bg-white transition-all shadow-inner" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 {TOPICS.filter(t => t !== "All").map(t => (
                                   <button key={t} className="h-16 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-[#E53935]/40 hover:bg-white transition-all flex items-center justify-center text-[11px] font-black">{t}</button>
                                 ))}
                              </div>
                           </div>
                        </motion.div>
                      )}
                      {hostStep === 3 && meetupType === "Advisor" && (
                        <motion.div key="step3-advisor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                           <div className="space-y-4">
                              <h2 className="text-4xl font-black">Match <span className="text-[#E53935]">Expert</span></h2>
                              <p className="text-[13px] font-bold text-black/30 tracking-widest">Select an advisor to lead this session.</p>
                           </div>
                           <div className="space-y-4">
                              {suggestedAdvisors.map(adv => (
                                <button key={adv.id} onClick={() => setSelectedAdvisor(adv)} className={cn("w-full p-6 rounded-3xl border-2 flex items-center gap-6 transition-all", selectedAdvisor?.id === adv.id ? "border-[#E53935] bg-red-50 shadow-xl" : "border-slate-100 hover:border-[#E53935]/20")}>
                                   <div className="h-16 w-16 bg-slate-200 rounded-xl overflow-hidden shrink-0"><img src={adv.avatar_url || `https://i.pravatar.cc/150?u=${adv.id}`} className="w-full h-full object-cover" alt="" /></div>
                                   <div className="text-left">
                                      <h4 className="text-lg font-black leading-none mb-1">{adv.full_name}</h4>
                                      <p className="text-[10px] font-bold text-black/30 tracking-widest">{adv.role} • 98% Match</p>
                                   </div>
                                </button>
                              ))}
                           </div>
                        </motion.div>
                      )}
                      {(hostStep === 3 && meetupType === "Open" || hostStep === 4) && (
                        <motion.div key="step-logistics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                           <div className="space-y-4">
                              <h2 className="text-4xl font-black">Final <span className="text-[#E53935]">Step</span></h2>
                              <p className="text-[13px] font-bold text-black/30 tracking-widest">Location, Time & Capacity.</p>
                           </div>
                           <div className="space-y-6">
                              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                 <Users size={24} className="text-emerald-500" />
                                 <p className="text-[11px] font-bold text-emerald-700">Limit: <span className="font-black">8 Participants</span> for high-quality sync.</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between"><p className="text-[11px] font-black">Today</p><Calendar size={18} className="text-black/20" /></div>
                                 <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between"><p className="text-[11px] font-black">18:30</p><Clock size={18} className="text-black/20" /></div>
                              </div>
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                   <div className="mt-16 flex items-center gap-4">
                      {hostStep > 1 && (
                        <button onClick={() => setHostStep(hostStep - 1)} className="h-18 px-8 rounded-2xl bg-slate-50 text-black font-black text-[11px] tracking-widest hover:bg-black hover:text-white transition-all">Back</button>
                      )}
                      <button onClick={() => { const totalSteps = meetupType === "Advisor" ? 4 : 3; if (hostStep < totalSteps) setHostStep(hostStep + 1); else setShowHostModal(false); }} className="flex-1 h-18 bg-black text-white rounded-2xl font-black text-[12px] tracking-widest shadow-2xl hover:bg-[#E53935] transition-all flex items-center justify-center gap-4">
                         {hostStep === (meetupType === "Advisor" ? 4 : 3) ? "Launch session" : "Continue"}
                         <ChevronRight size={18} />
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </TerminalLayout>
  );
}
