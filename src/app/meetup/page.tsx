"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Users, 
  Calendar, 
  ArrowRight, 
  Star, 
  Shield, 
  Plus, 
  MessageSquare, 
  Clock, 
  LayoutGrid, 
  List,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_POSTS } from "@/lib/dummyData";

// Extract Meetings from DUMMY_POSTS
const INITIAL_MEETUPS: any[] = [];

const TOPICS = ["All", "Networking", "Investment", "Community", "Strategy", "Tech", "Logistics"];

export default function MeetupPage() {
  const [meetups, setMeetups] = useState(INITIAL_MEETUPS);
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostData, setHostData] = useState({ title: "", loc: "", category: "Networking", type: "In-Person", requireApproval: true });
  const [activeTopic, setActiveTopic] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredMeetups = useMemo(() => {
    return meetups.filter(m => activeTopic === "All" || m.category === activeTopic);
  }, [meetups, activeTopic]);

  const handleJoin = (id: string | number) => {
    setMeetups(meetups.map(m => {
      if (m.id === id) {
        if (m.status === "none") {
           return { ...m, status: "joined" };
        } else {
           return { ...m, status: "none" };
        }
      }
      return m;
    }));
  };

  const handleStartMeeting = () => {
    if (!hostData.title || !hostData.loc) return;
    const newMeetup = {
      id: `custom-${Date.now()}`,
      title: hostData.title,
      category: hostData.category,
      likes: 1,
      timeAgo: "Just now",
      loc: hostData.loc,
      location: hostData.loc,
      meetingType: hostData.type,
      author: "User",
      avatar: "/placeholder-user.jpg",
      status: "joined",
      meetingTime: new Date().toISOString(),
      x: 50, y: 50,
      advice: "Welcome to the network! Start by introducing your business."
    };
    // @ts-ignore
    setMeetups([newMeetup, ...meetups]);
    setShowHostModal(false);
    setHostData({ title: "", loc: "", category: "Networking", type: "In-Person", requireApproval: true });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white selection:bg-[#E53935]/10">
      
      {/* 1. MEETING FEED (LEFT) */}
      <div className="flex-1 flex flex-col min-h-screen border-r border-[#292828]/10 pb-40 lg:pb-12">
        
        {/* Header Section */}
        <div className="p-6 lg:p-10 border-b border-[#292828]/5 sticky top-0 bg-white/95 backdrop-blur-xl z-30">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E53935]/10 border border-[#E53935]/20 text-[#E53935] text-[9px] font-black uppercase tracking-widest mb-3">
                    Hyperlocal Discovery
                 </div>
                 <h1 className="text-4xl font-black text-[#292828] leading-tight tracking-tighter uppercase">Meetups</h1>
                 <p className="text-[12px] font-bold text-[#292828]/40 uppercase tracking-wide mt-1">Connect with builders in your proximity.</p>
              </div>
              <button 
                onClick={() => setShowHostModal(true)}
                className="px-10 h-16 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase shadow-[0_20px_40px_rgba(41,40,40,0.2)] hover:bg-[#E53935] active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                 <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> Host a Meeting
              </button>
           </div>

           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                 {TOPICS.map(t => (
                   <button 
                     key={t} 
                     onClick={() => setActiveTopic(t)}
                     className={cn(
                       "px-6 h-11 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap border-2",
                       activeTopic === t ? "bg-[#292828] text-white border-[#292828] shadow-xl" : "bg-white text-[#292828]/40 border-transparent hover:border-[#292828]/10 hover:text-[#292828]"
                     )}
                   >
                      {t}
                   </button>
                 ))}
              </div>

              <div className="flex items-center gap-1 p-1.5 bg-[#292828]/5 rounded-2xl self-start sm:self-auto shrink-0">
                 <button 
                   onClick={() => setViewMode("grid")}
                   className={cn(
                     "h-10 px-5 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase transition-all",
                     viewMode === "grid" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/30 hover:text-[#292828]"
                   )}
                 >
                    <LayoutGrid size={14} /> Grid
                 </button>
                 <button 
                   onClick={() => setViewMode("list")}
                   className={cn(
                     "h-10 px-5 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase transition-all",
                     viewMode === "list" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/30 hover:text-[#292828]"
                   )}
                 >
                    <List size={14} /> List
                 </button>
              </div>
           </div>
        </div>

        {/* Meeting Grid */}
        <div className="p-6 lg:p-10">
           
           <div className={cn(
               "transition-all duration-500",
               viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-8" : "flex flex-col gap-8"
           )}>
               {filteredMeetups.length > 0 ? (
                 filteredMeetups.map(m => (
                    <div key={m.id} className="group/meeting-card relative">
                       <div className={cn(
                         "bg-white rounded-[1.625rem] border border-[#292828]/10 overflow-hidden transition-all duration-500 hover:shadow-[0_32px_80px_-20px_rgba(41,40,40,0.15)] hover:border-[#E53935]/20 hover:-translate-y-1 relative",
                         m.status === "joined" && "border-emerald-500/30 ring-1 ring-emerald-500/10"
                       )}>
                          {/* Premium Accent Bar */}
                          <div className={cn(
                             "h-1.5 w-full bg-gradient-to-r",
                             m.status === "joined" ? "from-emerald-500 via-teal-400 to-emerald-500" : "from-[#E53935] via-[#FF6B35] to-[#E53935]"
                          )} />

                          <div className="p-6 lg:p-8 flex flex-col gap-6">
                             {/* Row 1: Badges & Author */}
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                   <div className="h-10 w-10 rounded-xl overflow-hidden border border-[#292828]/10 shadow-sm">
                                      <img src={m.avatar} className="w-full h-full object-cover grayscale group-hover/meeting-card:grayscale-0 transition-all duration-500" alt="" />
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black text-[#292828] uppercase leading-none mb-1">{m.author}</p>
                                      <p className="text-[9px] font-bold text-[#292828]/30 uppercase tracking-tighter">{m.timeAgo}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <span className={cn(
                                     "px-3 py-1 rounded-full text-[9px] font-black uppercase border",
                                     m.meetingType === 'Physical'
                                       ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                       : "bg-blue-50 text-blue-700 border-blue-100"
                                   )}>
                                      {m.meetingType === 'Physical' ? 'In-Person' : 'Online'}
                                   </span>
                                   <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase bg-[#292828]/5 text-[#292828]/60 border border-[#292828]/5">
                                      {m.category}
                                   </span>
                                </div>
                             </div>

                             {/* Row 2: Title & Content */}
                             <div className="space-y-2">
                                <h3 className="text-2xl font-black text-[#292828] leading-tight tracking-tighter group-hover/meeting-card:text-[#E53935] transition-colors uppercase">
                                   {m.title}
                                </h3>
                                <p className="text-[13px] text-[#292828]/60 font-medium leading-relaxed italic line-clamp-2">
                                   "{m.content}"
                                </p>
                             </div>

                             {/* Row 3: Meta Info Chips */}
                             <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-3 bg-[#E53935]/5 border border-[#E53935]/10 rounded-2xl px-4 py-2.5">
                                   <div className="h-9 w-9 bg-[#E53935] rounded-xl flex flex-col items-center justify-center shrink-0 shadow-lg">
                                      <span className="text-[7px] font-black uppercase text-white/70 leading-none">MAY</span>
                                      <span className="text-base font-black text-white leading-none">{(m.id as string).split('-').pop() || '15'}</span>
                                   </div>
                                   <div>
                                      <p className="text-[8px] font-black text-[#292828]/30 uppercase leading-none mb-1">Schedule</p>
                                      <p className="text-[11px] font-black text-[#292828] uppercase leading-none">WED, 02:30 PM</p>
                                   </div>
                                </div>

                                <div className="flex items-center gap-3 bg-[#292828]/5 border border-[#292828]/5 rounded-2xl px-4 py-2.5 min-w-0 flex-1">
                                   <div className="h-9 w-9 bg-[#292828] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                                      <MapPin size={16} className="text-white" />
                                   </div>
                                   <div className="min-w-0">
                                      <p className="text-[8px] font-black text-[#292828]/30 uppercase leading-none mb-1">Venue Hub</p>
                                      <p className="text-[11px] font-black text-[#292828] uppercase leading-none truncate">{m.location}</p>
                                   </div>
                                </div>
                             </div>

                             {/* Row 4: Action Footer */}
                             <div className="flex items-center justify-between pt-4 border-t border-[#292828]/5">
                                <div className="flex items-center gap-3">
                                   <div className="flex -space-x-2.5">
                                       {[1, 2, 3, 4].map(i => (
                                         <div key={i} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center">
                                            <Users size={14} className="text-[#292828]/20" />
                                         </div>
                                       ))}
                                   </div>
                                   <span className="text-[10px] font-black text-[#292828]/30 uppercase">{m.likes}+ Builders Joining</span>
                                </div>
                                
                                <button 
                                   onClick={() => handleJoin(m.id)}
                                   className={cn(
                                     "h-12 px-8 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 active:scale-95 flex items-center gap-2",
                                     m.status === "joined" 
                                       ? "bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:bg-emerald-600" 
                                       : "bg-[#292828] text-white hover:bg-[#E53935] shadow-xl"
                                   )}
                                >
                                   {m.status === "joined" ? (
                                      <><CheckCircle2 size={16} strokeWidth={3} /> RSVP&apos;ed</>
                                   ) : (
                                      <><Calendar size={16} strokeWidth={3} /> RSVP Now</>
                                   )}
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="col-span-full flex flex-col items-center justify-center py-40 bg-[#292828]/5 rounded-[2.6rem] border-2 border-dashed border-[#292828]/10 text-[#292828]/20">
                    <Users size={64} strokeWidth={1} className="mb-6 opacity-20" />
                    <p className="text-[14px] font-black uppercase tracking-[0.2em]">Zero Live Nodes Found</p>
                    <p className="text-[11px] font-bold mt-2 uppercase">Start a meeting to activate your city hub.</p>
                 </div>
               )}
           </div>
        </div>
      </div>

      {/* 2. AREA ANALYTICS (RIGHT) - Premium Map & Data */}
      <aside className="hidden xl:flex flex-col w-[450px] h-screen sticky top-0 bg-[#FDFDFF] border-l border-[#292828]/10 p-10 gap-10">
         <div>
            <div className="flex items-center justify-between mb-8">
               <p className="text-[10px] font-black text-[#292828]/30 uppercase tracking-widest">Local Signal</p>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-black uppercase text-emerald-600">Active Now</span>
               </div>
            </div>
            
            <div className="p-8 bg-[#292828] rounded-[2rem] shadow-[0_40px_100px_rgba(41,40,40,0.3)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/15 blur-[60px] pointer-events-none" />
               <div className="relative z-10 flex items-center gap-6">
                  <div className="h-16 w-16 bg-[#E53935] rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-white/10 group-hover:scale-110 transition-transform">🛰️</div>
                  <div>
                     <p className="text-xl font-black text-white uppercase tracking-tighter">Proximity Scan</p>
                     <p className="text-[11px] font-bold text-[#E53935] uppercase mt-1">Found 12+ Active Hubs</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Interactive Map Section */}
         <div className="flex-1 bg-white rounded-[2.5rem] border-4 border-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-100 opacity-50">
               {/* This would be the real map image */}
               <div className="absolute inset-0 bg-[#292828]/5 grayscale opacity-40 mix-blend-multiply" />
            </div>
            
            {/* Map Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 pointer-events-none" />
            
            {/* Interactive Pins */}
            {filteredMeetups.slice(0, 8).map(m => (
               <div 
                 key={`map-pin-${m.id}`} 
                 className="absolute group/pin cursor-pointer transition-all hover:z-50" 
                 style={{ top: `${m.y}%`, left: `${m.x}%` }}
               >
                  <div className={cn(
                    "h-12 w-12 rounded-2xl border-4 shadow-2xl flex items-center justify-center text-xl transition-all duration-300 group-hover/pin:scale-110 group-hover/pin:rotate-12",
                    m.status === "joined" ? "bg-emerald-500 border-white" : "bg-[#292828] border-white group-hover/pin:bg-[#E53935]"
                  )}>
                     {m.category === 'Tech' ? '💻' : m.category === 'Investment' ? '🏦' : m.category === 'Networking' ? '🏢' : '🤝'}
                  </div>
                  
                  {/* Tooltip Overlay */}
                  <div className="absolute bottom-[calc(100%+1rem)] left-1/2 -translate-x-1/2 w-[240px] bg-white border border-[#292828]/10 p-6 rounded-[1.5rem] opacity-0 invisible group-hover/pin:opacity-100 group-hover/pin:visible transition-all pointer-events-none shadow-[0_30px_60px_-10px_rgba(0,0,0,0.25)] z-50 translate-y-3 group-hover/pin:translate-y-0">
                     <div className="mb-3 flex justify-between items-center">
                        <span className="px-2 py-0.5 bg-[#E53935]/10 text-[#E53935] text-[7px] font-black uppercase rounded-md tracking-widest">{m.category}</span>
                        <span className="text-[8px] font-black text-[#292828]/20 uppercase">Local Node</span>
                     </div>
                     <p className="text-[13px] font-black text-[#292828] leading-tight uppercase mb-3 line-clamp-2">{m.title}</p>
                     <div className="flex items-center gap-2 text-[#292828]/40 font-bold text-[10px] uppercase border-t border-[#292828]/5 pt-3">
                        <MapPin size={12} className="text-[#E53935]" /> {m.location.split(',')[0]}
                     </div>
                  </div>
               </div>
            ))}

            {/* Map Action Button */}
            <div className="absolute bottom-8 inset-x-8">
               <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-[#292828]/5 shadow-4xl group/link transition-all hover:-translate-y-2">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-xl">🏙️</div>
                        <div>
                           <p className="text-[13px] font-black text-[#292828] uppercase">Explore Nodes</p>
                           <p className="text-[10px] font-bold text-[#292828]/30 uppercase mt-0.5 tracking-tight">V3 Signal Processing</p>
                        </div>
                     </div>
                     <div className="h-10 w-10 bg-[#292828] text-white rounded-xl flex items-center justify-center group-hover/link:bg-[#E53935] transition-colors">
                        <ArrowUpRight size={18} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </aside>

      {/* START MEETING MODAL */}
      {showHostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowHostModal(false)} />
           
           <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_-20px_rgba(229,57,53,0.3)] overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#E53935]/10 rounded-full blur-[100px]" />
              
              <div className="p-10 lg:p-12 space-y-8 relative z-10">
                 <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E53935]/10 border border-[#E53935]/20 text-[#E53935] text-[9px] font-black uppercase tracking-widest mb-4">
                       Create Node
                    </div>
                    <h2 className="text-4xl font-black text-[#292828] tracking-tighter uppercase leading-none">Post <span className="text-[#E53935]">Meetup</span></h2>
                    <p className="text-[12px] font-bold text-[#292828]/40 uppercase tracking-wide mt-3">Activate your local business signal.</p>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-[#292828]/30 uppercase ml-2 mb-2 block tracking-widest">Meeting Name</label>
                       <input 
                         type="text" 
                         value={hostData.title}
                         onChange={(e) => setHostData({ ...hostData, title: e.target.value })}
                         placeholder="e.g. Founder Coffee Talk" 
                         className="w-full h-16 bg-[#292828]/5 border border-transparent rounded-[1.3rem] px-8 text-[15px] font-black text-[#292828] outline-none focus:bg-white focus:border-[#E53935]/30 transition-all placeholder:text-[#292828]/20 shadow-inner" 
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-[#292828]/30 uppercase ml-2 mb-2 block tracking-widest">Type</label>
                          <select 
                            value={hostData.type}
                            onChange={(e) => setHostData({ ...hostData, type: e.target.value })}
                            className="w-full h-16 bg-[#292828]/5 border border-transparent rounded-[1.3rem] px-8 text-[12px] font-black text-[#292828] uppercase outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#E53935]/30 transition-all shadow-inner"
                          >
                             <option value="In-Person">In-Person</option>
                             <option value="Virtual">Virtual Session</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-[#292828]/30 uppercase ml-2 mb-2 block tracking-widest">Sector</label>
                          <select 
                            value={hostData.loc}
                            onChange={(e) => setHostData({ ...hostData, loc: e.target.value })}
                            className="w-full h-16 bg-[#292828]/5 border border-transparent rounded-[1.3rem] px-8 text-[12px] font-black text-[#292828] uppercase outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#E53935]/30 transition-all shadow-inner"
                          >
                             <option value="">Select Hub...</option>
                             <option value="Technopark, Trivandrum">Technopark</option>
                             <option value="Infopark, Kochi">Infopark</option>
                             <option value="Cyberpark, Kozhikode">Cyberpark</option>
                             <option value="Bangalore Central Hub">Bangalore</option>
                          </select>
                       </div>
                    </div>

                    <button 
                      onClick={handleStartMeeting}
                      disabled={!hostData.title || !hostData.loc}
                      className="w-full h-20 bg-[#292828] text-white rounded-[1.3rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-[#E53935] disabled:opacity-30 transition-all flex items-center justify-center gap-4 mt-4 active:scale-95 group"
                    >
                       Broadcast Signal <Zap size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                    </button>

                    <button 
                       onClick={() => setShowHostModal(false)}
                       className="w-full text-[10px] font-black uppercase text-[#292828]/30 hover:text-[#E53935] transition-colors tracking-widest"
                    >
                       Cancel / Return
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
