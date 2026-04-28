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
import { calculateMatchScore } from "@/lib/ai";


const TOPICS = ["All", "Networking", "Investment", "Community", "Strategy", "Tech", "Logistics"];

import { useAuth } from "@/hooks/useAuth";

export default function MeetupPage() {
  const { user: authUser } = useAuth();
  const [meetups, setMeetups] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAiArchitect, setShowAiArchitect] = useState(false);
  const [hostStep, setHostStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState("All");
  const [showHostModal, setShowHostModal] = useState(false);
  
  // NEW SYSTEM STATE
  const [meetupType, setMeetupType] = useState<"Open" | "Advisor">("Open");
  const [selectedAdvisor, setSelectedAdvisor] = useState<any | null>(null);
  const [suggestedAdvisors, setSuggestedAdvisors] = useState<any[]>([]);

  const supabase = createClient();

  React.useEffect(() => {
    async function initMeetup() {
      setIsLoading(true);

      const { data } = await supabase
        .from('posts')
        .select('*, author:profiles(full_name, avatar_url)')
        .eq('type', 'MEETUP')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const mapped = data.map(m => ({
          ...m,
          author: m.author?.full_name || "Community Member",
          avatar: m.author?.avatar_url || `https://i.pravatar.cc/150?u=${m.id}`,
          timeAgo: "Live in 2h",
          matchPotential: m.match_score || 95,
          attendees: m.participant_count || Math.floor(Math.random() * 5) + 1,
          maxAttendees: 8,
          category: m.domain || "Tech",
          typeLabel: m.metadata?.is_advisor_led ? "Advisor-Led" : "Open Meetup",
          isPremium: m.metadata?.is_advisor_led || false,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        }));
        setMeetups(mapped);
      } else {
        setMeetups([]);
      }
      
      // Load advisors for suggestion
      const { data: advisors } = await supabase.from('profiles').select('*').limit(5);
      setSuggestedAdvisors(advisors || []);
      setIsLoading(false);
    }
    initMeetup();
  }, []);

  const filteredMeetups = useMemo(() => {
    const list = meetups.filter(m => activeTopic === "All" || m.category === activeTopic);
    if (!authUser) return list;

    const userContext = {
      role: authUser.role || "Professional",
      bio: authUser.bio || "",
      domains: authUser.skills || []
    };
    
    // AI Intelligence: Dynamically calculate match and sort by relevance + proximity
    return list.map(m => ({
      ...m,
      matchPotential: calculateMatchScore(userContext, { ...m, type: "Meetup", domain: m.category })
    })).sort((a, b) => b.matchPotential - a.matchPotential || a.id.localeCompare(b.id));
  }, [meetups, activeTopic, authUser]);

  const strategicRecommendations = useMemo(() => {
    const role = authUser?.role || "Business";
    return [
      { title: `${role} Growth Sync`, time: "Tomorrow, 10:00", type: "Virtual", score: 99 },
      { title: "Supply Chain Sync", time: "Friday, 14:30", type: "Technopark", score: 92 }
    ];
  }, [authUser]);

  const handleJoin = (id: string) => {
    setMeetups(meetups.map(m => m.id === id ? { ...m, status: m.status === "none" ? "joined" : "none" } : m));
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden selection:bg-[#E53935]/10">
      
      {/* 1. DISCOVERY HUB (LEFT) */}
      <main className="flex-1 overflow-y-auto no-scrollbar border-r border-[#292828]/5 pb-32 lg:pb-0 scroll-smooth">
         
         {/* HEADER */}
         <div className="p-8 lg:p-12 bg-white/50 backdrop-blur-xl border-b border-[#292828]/5 sticky top-0 z-40">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-10">
               <div>
                  <div className="label-premium">
                     <Target size={12} className="text-[#E53935]" /> Area Discovery Active
                  </div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl mb-0  font-black uppercase">
                     Meetups<span className="text-[#E53935]">.</span>
                  </h1>
                  <p className="subheading-editorial mt-2">Connect with people in your area.</p>
               </div>
               
               <div className="flex items-center gap-4">
                   <button 
                     onClick={() => setShowAiArchitect(true)}
                     className="h-16 px-8 rounded-lg bg-gradient-to-br from-[#292828] to-[#1a1a1a] text-white flex items-center gap-4 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all group"
                   >
                      <div className="h-10 w-10 bg-[#E53935] rounded-lg flex items-center justify-center text-white shadow-xl animate-pulse">
                         <BrainCircuit size={20} />
                      </div>
                      <div className="text-left">
                         <p className="text-[9px] font-black text-white/50 uppercase leading-none mb-1">AI Assistant</p>
                         <p className="text-[11px] font-bold uppercase">Plan Meeting</p>
                      </div>
                   </button>
                </div>
            </div>

             <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto">
                   {TOPICS.map(t => (
                     <button 
                       key={t}
                       onClick={() => setActiveTopic(t)}
                       className={cn(
                         "px-6 h-11 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border-2",
                         activeTopic === t ? "bg-[#292828] text-white border-[#292828] shadow-lg" : "bg-white text-[#292828]/40 border-transparent hover:border-[#292828]/10"
                       )}
                     >
                        {t}
                     </button>
                   ))}
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                   <button 
                     onClick={() => { setShowHostModal(true); setHostStep(1); }}
                     className="h-11 px-6 bg-black text-white rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] shadow-lg active:scale-95 transition-all"
                   >
                      <Plus size={14} /> Host Meetup
                   </button>

                   <div className="flex items-center gap-1 bg-[#292828]/5 p-1 rounded-lg">
                      <button onClick={() => setViewMode("grid")} className={cn("h-9 px-4 rounded-lg flex items-center gap-2 text-[9px] font-bold uppercase", viewMode === "grid" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/30")}>
                         <LayoutGrid size={14} />
                      </button>
                      <button onClick={() => setViewMode("list")} className={cn("h-9 px-4 rounded-lg flex items-center gap-2 text-[9px] font-bold uppercase", viewMode === "list" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/30")}>
                         <List size={14} />
                      </button>
                   </div>
                </div>
             </div>
          </div>

         {/* CONTENT GRID */}
         <div className="p-8 lg:p-12">
            <div className={cn(
               "grid gap-10",
               viewMode === "grid" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
            )}>
               {filteredMeetups.map(m => (
                 <div key={m.id} className="group relative">
                    <div className={cn(
                       "bg-white rounded-lg border border-[#292828]/10 overflow-hidden transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] hover:border-[#E53935]/20 hover:-translate-y-2",
                       m.status === "joined" && "border-emerald-500/30 ring-4 ring-emerald-500/5 shadow-2xl shadow-emerald-500/10"
                    )}>
                       {/* AI Alignment Indicator */}
                       <div className="absolute top-6 right-6 z-10">
                          <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-lg border border-[#292828]/10 flex items-center gap-2 shadow-lg">
                             <Sparkles size={14} className="text-[#E53935] animate-pulse" />
                             <span className="text-[10px] font-black text-[#292828] uppercase">{m.matchPotential}% Score</span>
                          </div>
                       </div>

                       {/* Card Content */}
                       <div className="p-8 lg:p-10 space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="h-14 w-14 rounded-lg overflow-hidden border border-[#292828]/10 shadow-sm relative group-hover:rotate-3 transition-transform">
                                <img src={m.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                                <div className="absolute inset-0 bg-[#E53935]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </div>
                             <div>
                                <h4 className="text-[14px] font-bold text-[#E53935] uppercase leading-none mb-1.5 ">{m.author}</h4>
                                <p className="text-[10px] font-bold text-[#292828]/30 uppercase ">{m.category} • {m.timeAgo}</p>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <h3 className="group-hover:text-[#E53935] transition-colors">{m.title}</h3>
                             <p className="text-[14px] font-medium text-[#292828]/60 leading-relaxed italic line-clamp-2">"{m.content}"</p>
                          </div>

                          <div className="flex flex-col gap-3">
                             <div className="flex items-center gap-4 p-4 bg-[#292828]/5 rounded-lg border border-[#292828]/5 group-hover:bg-white group-hover:border-[#292828]/10 transition-all">
                                <div className="h-10 w-10 bg-[#292828] rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg group-hover:bg-[#E53935]">
                                   <MapPin size={18} />
                                </div>
                                <div className="min-w-0">
                                   <p className="text-[9px] font-bold text-[#292828]/30 uppercase leading-none mb-1.5">Venue</p>
                                   <p className="text-[12px] font-bold text-[#292828] uppercase truncate">{m.location}</p>
                                </div>
                             </div>

                             <div className="flex items-center gap-4 p-4 bg-[#292828]/5 rounded-lg border border-[#292828]/5 group-hover:bg-white group-hover:border-[#292828]/10 transition-all">
                                <div className="h-10 w-10 bg-[#E53935]/10 rounded-lg flex items-center justify-center text-[#E53935] shrink-0 border border-[#E53935]/20">
                                   <Clock size={18} />
                                </div>
                                <div>
                                   <p className="text-[9px] font-bold text-[#E53935] uppercase leading-none mb-1.5">Time</p>
                                   <p className="text-[12px] font-bold text-[#292828] uppercase">TODAY, 18:30</p>
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-8 border-t border-[#292828]/5 mt-4">
                             <div className="flex items-center gap-3">
                                <div className="flex -space-x-2.5">
                                   {[1,2,3].map(i => (
                                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                                        <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="" className="grayscale" />
                                     </div>
                                   ))}
                                </div>
                                <span className="text-[11px] font-bold text-[#292828]/40 uppercase ">{m.attendees}/8 Occupied</span>
                             </div>

                             <button 
                               onClick={() => handleJoin(m.id)}
                               disabled={m.attendees >= 8}
                               className={cn(
                                 "h-14 px-8 rounded-lg font-bold text-[11px] uppercase  transition-all duration-500 shadow-xl flex items-center gap-3 active:scale-95",
                                 m.status === "joined" 
                                  ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                                  : m.attendees >= 8 ? "bg-black/10 text-black/20 cursor-not-allowed" : "bg-[#292828] text-white hover:bg-[#E53935] shadow-black/10"
                               )}
                             >
                                {m.status === "joined" ? <><CheckCircle2 size={18} strokeWidth={3} /> You're In</> : m.attendees >= 8 ? "Full" : <><Plus size={18} strokeWidth={3} /> Join Meetup</>}
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
       </main>

      {/* 2. ANALYTICS SIDEBAR (RIGHT) */}
      <aside className="hidden xl:flex flex-col w-[420px] bg-[#FDFDFF] border-l border-[#292828]/10 p-10 gap-10 overflow-y-auto no-scrollbar">
         
         {/* AI PLANNER STATUS */}
         <section className="space-y-6">
            <div className="flex items-center justify-between">
               <p className="subheading-editorial !text-slate-200">Meeting Planner</p>
               <div className="flex items-center gap-2 text-emerald-600">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-bold uppercase  font-outfit">Active</span>
               </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-[#292828] to-black rounded-lg text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/20 blur-[60px] pointer-events-none" />
               <BrainCircuit size={160} className="absolute -bottom-16 -right-16 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[4s]" />
               
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="h-12 w-12 bg-[#E53935] rounded-lg flex items-center justify-center text-white shadow-xl">
                        <Sparkles size={24} />
                     </div>
                     <div>
                        <p className="text-[13px] font-bold uppercase ">AI Strategy Insight</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase  mt-0.5 leading-none">Contextual Analysis</p>
                     </div>
                  </div>
                  
                  <p className="text-[14px] font-medium text-white/70 leading-relaxed mb-8 uppercase ">
                     "Found 3 optimal slots for a logistics sync in <span className="text-[#E53935]">Indiranagar</span> today. Participation potential is at peak capacity."
                  </p>
                  
                  <button onClick={() => setShowAiArchitect(true)} className="w-full h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-[10px] font-bold uppercase  hover:bg-white hover:text-[#292828] transition-all">
                     Open Suggestion Box
                  </button>
               </div>
            </div>
         </section>

         {/* NEARBY HEATMAP */}
         <section className="space-y-6">
            <p className="subheading-editorial !text-slate-200">Meetup Activity Map</p>
            <div className="h-64 bg-slate-50 border-4 border-white shadow-xl rounded-lg relative overflow-hidden group cursor-crosshair">
               <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#292828_2px,transparent_2px)] [background-size:24px_24px]" />
               
               {/* Map Pins */}
               {meetups.map(m => (
                 <div key={`pin-${m.id}`} className="absolute transition-all duration-700" style={{ top: `${m.y}%`, left: `${m.x}%` }}>
                    <div className={cn(
                      "h-10 w-10 rounded-lg border-4 border-white shadow-2xl flex items-center justify-center text-lg transition-transform hover:scale-125 hover:z-10",
                      m.status === "joined" ? "bg-emerald-500 scale-110" : "bg-[#292828] text-white hover:bg-[#E53935]"
                    )}>
                       {m.category === "Tech" ? "💻" : m.category === "Logistics" ? "📦" : "🏢"}
                    </div>
                 </div>
               ))}

               <div className="absolute bottom-6 inset-x-6 flex items-center justify-between bg-white/90 backdrop-blur-md p-5 rounded-lg border border-[#292828]/5 shadow-xl">
                  <div>
                     <p className="text-[13px] font-bold text-[#292828] uppercase leading-none mb-1.5">Trivandrum Hub</p>
                     <p className="text-[9px] font-bold text-emerald-600 uppercase ">8 Active Sessions</p>
                  </div>
                  <div className="h-10 w-10 bg-[#292828] rounded-lg flex items-center justify-center text-white hover:bg-[#E53935] transition-colors">
                     <Maximize2 size={16} />
                  </div>
               </div>
            </div>
         </section>

          <section className="mt-auto space-y-6">
            <p className="subheading-editorial !text-slate-200">Upcoming Sessions</p>
            <div className="space-y-4">
               {strategicRecommendations.map((block, i) => (
                 <div key={i} className="p-5 bg-white border border-[#292828]/5 rounded-lg hover:border-[#E53935]/20 hover:shadow-xl transition-all cursor-pointer group/block">
                    <div className="flex items-center justify-between mb-4">
                       <span className="px-3 py-1 bg-white border border-[#292828]/10 rounded-lg text-[8px] font-bold uppercase ">{block.type}</span>
                       <div className="flex items-center gap-1.5 text-[#E53935]">
                          <Zap size={14} fill="currentColor" />
                          <span className="text-[11px] font-bold">{block.score}%</span>
                       </div>
                    </div>
                    <h4 className="text-[14px] font-bold text-[#292828] uppercase leading-tight group-hover/block:text-[#E53935] transition-colors">{block.title}</h4>
                    <p className="text-[10px] font-bold text-[#292828]/30 uppercase mt-1.5">{block.time}</p>
                 </div>
               ))}
            </div>
          </section>
      </aside>

      {/* AI PLANNER DRAWER */}
      {showAiArchitect && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <div className="absolute inset-0 bg-[#292828]/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowAiArchitect(false)} />
           <aside className="relative w-full max-w-xl bg-white h-full shadow-[-40px_0_100px_rgba(0,0,0,0.1)] flex flex-col p-12 overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <div className="label-premium">
                       Meeting OS v3.0
                    </div>
                    <h2>AI <span className="text-[#E53935] italic">Planner</span></h2>
                 </div>
                 <button onClick={() => setShowAiArchitect(false)} className="h-14 w-14 bg-[#292828]/5 text-[#292828] rounded-lg flex items-center justify-center hover:bg-[#E53935] hover:text-white transition-all active:scale-95">
                    <Check size={28} />
                 </button>
              </div>

              <div className="space-y-12">
                 <section className="space-y-6">
                    <p className="subheading-editorial !text-slate-200">Active Objectives</p>
                    <div className="space-y-3">
                       {["Schedule series A sync", "Find logistics provider", "Arrange venue for Friday"].map((ob, i) => (
                         <div key={i} className="flex items-center justify-between p-5 bg-white border border-[#292828]/10 rounded-lg group hover:border-[#E53935] transition-all cursor-pointer">
                            <span className="text-[14px] font-medium text-[#292828] uppercase">{ob}</span>
                            <div className="h-8 w-8 bg-[#292828]/5 rounded-lg flex items-center justify-center text-[#292828]/30 group-hover:text-[#E53935] transition-colors">
                               <ChevronRight size={18} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>

                 <section className="p-8 bg-[#E53935] rounded-lg text-white space-y-6 relative overflow-hidden">
                    <Sparkles size={120} className="absolute -top-12 -right-12 text-white/10 rotate-12" />
                    <p className="subheading-editorial !text-white/40 mb-6">Smart Suggestion</p>
                    <p className="text-[17px] font-bold leading-relaxed relative z-10">
                       "Based on your {filteredMeetups[0]?.matchPotential}% score with local hubs, I recommend joining the <span className="underline decoration-white/30 underline-offset-4">{filteredMeetups[0]?.title}</span> today."
                     </p>
                    <button className="w-full h-16 bg-white text-[#E53935] rounded-lg font-black text-[11px] uppercase  shadow-2xl relative z-10 hover:scale-[1.02] active:scale-95 transition-all">
                       Auto-Plan Meeting
                    </button>
                 </section>

                 <section className="space-y-6">
                    <p className="subheading-editorial !text-slate-200">Contextual Data</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg">
                          <p className="text-[9px] font-bold text-[#292828]/40 uppercase mb-2">Venue Match</p>
                          <p className="text-2xl font-bold text-[#292828]">94<span className="text-[12px] opacity-30">%</span></p>
                       </div>
                       <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg">
                          <p className="text-[9px] font-bold text-[#292828]/40 uppercase mb-2">Network Reach</p>
                          <p className="text-2xl font-bold text-[#292828]">12.4<span className="text-[12px] opacity-30">k</span></p>
                       </div>
                    </div>
                 </section>
              </div>
           </aside>
        </div>      {/* HOST WIZARD */}
      <AnimatePresence>
        {showHostModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-[#292828]/80 backdrop-blur-2xl" 
               onClick={() => setShowHostModal(false)} 
             />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-4xl"
             >
                {/* PROGRESS BAR */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[#F5F5F7]">
                   <motion.div 
                     initial={{ width: "33%" }}
                     animate={{ width: `${(hostStep / 3) * 100}%` }}
                     className="h-full bg-[#E53935]"
                   />
                              <div className="p-12 md:p-16">
                   <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 bg-[#E53935]/5 text-[#E53935] rounded-xl flex items-center justify-center font-black text-sm">
                            0{hostStep}
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Step {hostStep} of 4</p>
                      </div>
                      <button onClick={() => setShowHostModal(false)} className="text-black/20 hover:text-black transition-colors">
                         <X size={24} />
                      </button>
                   </div>

                   <AnimatePresence mode="wait">
                      {hostStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                           <div className="space-y-4">
                              <h2 className="text-4xl font-black uppercase font-outfit">Select <span className="text-[#E53935] italic">System</span></h2>
                              <p className="text-[13px] font-bold text-black/30 uppercase tracking-widest">Choose how your meetup is organized.</p>
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              <button onClick={() => setMeetupType("Open")} className={cn("p-8 rounded-2xl border-2 text-left transition-all", meetupType === "Open" ? "border-[#E53935] bg-[#E53935]/5 shadow-xl" : "border-[#F5F5F7] hover:border-[#E53935]/20")}>
                                 <h4 className="text-xl font-black uppercase mb-1">Open Meetup</h4>
                                 <p className="text-[11px] font-bold text-black/40 uppercase">Visible to all relevant industry nodes.</p>
                              </button>
                              <button onClick={() => setMeetupType("Advisor")} className={cn("p-8 rounded-2xl border-2 text-left transition-all", meetupType === "Advisor" ? "border-[#E53935] bg-[#E53935]/5 shadow-xl" : "border-[#F5F5F7] hover:border-[#E53935]/20")}>
                                 <h4 className="text-xl font-black uppercase mb-1">Advisor Meetup <span className="ml-2 text-[10px] bg-[#E53935] text-white px-2 py-0.5 rounded">PREMIUM</span></h4>
                                 <p className="text-[11px] font-bold text-black/40 uppercase">Requires domain expert approval. High Signal.</p>
                              </button>
                           </div>
                        </motion.div>
                      )}

                      {hostStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                           <div className="space-y-4">
                              <h2 className="text-4xl font-black uppercase font-outfit">The <span className="text-[#E53935] italic">Agenda</span></h2>
                              <p className="text-[13px] font-bold text-black/30 uppercase tracking-widest">What are we building/solving?</p>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-black/20 uppercase ml-4">Title</label>
                                 <input type="text" placeholder="e.g. Series A Logistics Sync" className="w-full h-18 bg-[#F5F5F7] rounded-2xl px-8 text-lg font-bold outline-none border-2 border-transparent focus:border-[#E53935]/20 focus:bg-white transition-all shadow-inner" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 {TOPICS.filter(t => t !== "All").map(t => (
                                   <button key={t} className="h-16 bg-[#F5F5F7] rounded-2xl border-2 border-transparent hover:border-[#E53935]/40 hover:bg-white transition-all flex items-center justify-center text-[10px] font-black uppercase">{t}</button>
                                 ))}
                              </div>
                           </div>
                        </motion.div>
                      )}

                      {hostStep === 3 && meetupType === "Advisor" && (
                        <motion.div key="step3-advisor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                           <div className="space-y-4">
                              <h2 className="text-4xl font-black uppercase font-outfit">Match <span className="text-[#E53935] italic">Expert</span></h2>
                              <p className="text-[13px] font-bold text-black/30 uppercase tracking-widest">Select an advisor to lead this session.</p>
                           </div>
                           <div className="space-y-4">
                              {suggestedAdvisors.map(adv => (
                                <button key={adv.id} onClick={() => setSelectedAdvisor(adv)} className={cn("w-full p-6 rounded-2xl border-2 flex items-center gap-6 transition-all", selectedAdvisor?.id === adv.id ? "border-[#E53935] bg-[#E53935]/5 shadow-xl" : "border-[#F5F5F7] hover:border-[#E53935]/20")}>
                                   <div className="h-16 w-16 bg-slate-200 rounded-xl overflow-hidden shrink-0"><img src={adv.avatar_url || `https://i.pravatar.cc/150?u=${adv.id}`} className="w-full h-full object-cover" alt="" /></div>
                                   <div className="text-left">
                                      <h4 className="text-lg font-black uppercase leading-none mb-1">{adv.full_name}</h4>
                                      <p className="text-[10px] font-bold text-black/30 uppercase">{adv.role} • 98% Match</p>
                                   </div>
                                </button>
                              ))}
                           </div>
                        </motion.div>
                      )}

                      {(hostStep === 3 && meetupType === "Open" || hostStep === 4) && (
                        <motion.div key="step-logistics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                           <div className="space-y-4">
                              <h2 className="text-4xl font-black uppercase font-outfit">Final <span className="text-[#E53935] italic">Step</span></h2>
                              <p className="text-[13px] font-bold text-black/30 uppercase tracking-widest">Location, Time & Capacity (Max 8).</p>
                           </div>
                           <div className="space-y-6">
                              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                 <Users size={24} className="text-emerald-500" />
                                 <p className="text-[11px] font-bold text-emerald-700 uppercase">Limit: <span className="font-black">8 Participants</span> for high-quality sync.</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="p-6 bg-[#F5F5F7] rounded-2xl flex items-center justify-between"><p className="text-[11px] font-black uppercase">Today</p><Calendar size={18} className="text-black/20" /></div>
                                 <div className="p-6 bg-[#F5F5F7] rounded-2xl flex items-center justify-between"><p className="text-[11px] font-black uppercase">18:30</p><Clock size={18} className="text-black/20" /></div>
                              </div>
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>

                   <div className="mt-16 flex items-center gap-4">
                      {hostStep > 1 && (
                        <button onClick={() => setHostStep(hostStep - 1)} className="h-18 px-8 rounded-2xl bg-[#F5F5F7] text-black font-black text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">Back</button>
                      )}
                      <button 
                        onClick={() => {
                          const totalSteps = meetupType === "Advisor" ? 4 : 3;
                          if (hostStep < totalSteps) setHostStep(hostStep + 1);
                          else setShowHostModal(false);
                        }}
                        className="flex-1 h-18 bg-[#292828] text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl hover:bg-[#E53935] transition-all flex items-center justify-center gap-4"
                      >
                         {hostStep === (meetupType === "Advisor" ? 4 : 3) ? "Launch Meetup" : "Continue"}
                         <ChevronRight size={18} />
                      </button>
                   </div>
                </div>     </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>v>
      )}

    </div>
  );
}
