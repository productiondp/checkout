"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Calendar, ArrowRight, Star, Shield, Plus, MessageSquare, Clock, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_MEETUPS: any[] = [];

const TOPICS = ["All", "Business", "Design", "Tech", "Startup", "Work"];

export default function MeetupPage() {
  const [meetups, setMeetups] = useState(INITIAL_MEETUPS);
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostData, setHostData] = useState({ title: "", loc: "", topic: "Business", type: "In-Person", requireApproval: true });
  const [activeTopic, setActiveTopic] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredMeetups = useMemo(() => {
    return meetups.filter(m => activeTopic === "All" || m.topic === activeTopic);
  }, [meetups, activeTopic]);

  const handleJoin = (id: number) => {
    setMeetups(meetups.map(m => {
      if (m.id === id) {
        if (m.status === "none") {
           if (m.count >= 12) return m;
           return { ...m, status: m.requireApproval ? "pending" : "joined", count: m.requireApproval ? m.count : m.count + 1 };
        } else if (m.status === "joined") {
           return { ...m, status: "none", count: m.count - 1 };
        } else if (m.status === "pending") {
           return { ...m, status: "none" };
        }
      }
      return m;
    }));
  };

  const handleStartMeeting = () => {
    if (!hostData.title || !hostData.loc) return;
    const newMeetup = {
      id: Date.now(),
      title: hostData.title,
      topic: hostData.topic,
      count: 1,
      time: "Live Now",
      loc: hostData.loc,
      address: "Hosted by You",
      type: hostData.type,
      price: "Free",
      score: 99,
      advisor: "You (Host)",
      participants: ["https://i.pravatar.cc/150?u=host"],
      requireApproval: hostData.requireApproval,
      status: "joined",
      x: 50, y: 50,
      advice: "Welcome to the network! Start by introducing your business."
    };
    setMeetups([newMeetup, ...meetups]);
    setShowHostModal(false);
    setHostData({ title: "", loc: "", topic: "Business", type: "In-Person", requireApproval: true });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      
      {/* 1. MEETING FEED (LEFT) */}
      <div className="flex-1 flex flex-col min-h-screen border-r border-[#292828]/10 pb-40 lg:pb-12">
        
        {/* Header Section */}
        <div className="p-6 lg:p-10 border-b border-[#292828]/5 sticky top-0 bg-white/95 backdrop-blur-xl z-30">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                 <h1 className="text-3xl font-black text-[#292828] leading-tight">Meetups</h1>
                 <p className="text-[12px] font-medium text-[#292828] mt-1">Meet business people near you.</p>
              </div>
              <button 
                onClick={() => setShowHostModal(true)}
                className="px-8 py-4 bg-[#292828] text-white rounded-2xl font-bold text-[11px] uppercase shadow-xl hover:bg-[#E53935] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                 <Plus size={18} /> Post a Meetup
              </button>
           </div>

           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                 {TOPICS.map(t => (
                   <button 
                     key={t} 
                     onClick={() => setActiveTopic(t)}
                     className={cn(
                       "px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase transition-all whitespace-nowrap border",
                       activeTopic === t ? "bg-[#E53935] text-white border-[#E53935] shadow-lg shadow-red-500/10" : "bg-[#292828]/5 text-[#292828] border-transparent hover:bg-[#292828]/10"
                     )}
                   >
                      {t}
                   </button>
                 ))}
              </div>

              <div className="flex items-center gap-1 p-1 bg-[#292828]/5 rounded-xl self-start sm:self-auto shrink-0">
                 <button 
                   onClick={() => setViewMode("grid")}
                   className={cn(
                     "h-10 px-4 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase transition-all",
                     viewMode === "grid" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/40 hover:text-[#292828]"
                   )}
                 >
                    <LayoutGrid size={14} /> Grid
                 </button>
                 <button 
                   onClick={() => setViewMode("list")}
                   className={cn(
                     "h-10 px-4 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase transition-all",
                     viewMode === "list" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/40 hover:text-[#292828]"
                   )}
                 >
                    <List size={14} /> List
                 </button>
              </div>
           </div>
        </div>

        {/* Meeting Grid */}
        <div className="p-6 lg:p-10 space-y-8">
           
           <div className={cn(
               "transition-all duration-500",
               viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-8" : "flex flex-col gap-6"
           )}>
               {filteredMeetups.length > 0 ? (
                 filteredMeetups.map(m => (
                    <div key={m.id} className={cn(
                      "bg-white border transition-all overflow-hidden group",
                      viewMode === "list" ? "rounded-[1.3rem] flex flex-col xl:flex-row items-stretch" : "rounded-[1.625rem] flex flex-col",
                      m.status === "joined" ? "border-green-500 shadow-2xl shadow-green-500/5 scale-[1.02]" : "border-[#292828]/10 shadow-sm hover:border-[#E53935]/20 hover:shadow-xl"
                    )}>
                       <div className={cn(
                           "p-8",
                           viewMode === "list" ? "flex-1 pb-8 flex flex-col" : "pb-4"
                       )}>
                         <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                               <span className={cn("px-3 py-1 text-[9px] font-black uppercase rounded-lg border", m.type === "Virtual" ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-emerald-50 text-emerald-700 border-emerald-100")}>{m.type}</span>
                               <span className={cn("px-3 py-1 text-[9px] font-black uppercase rounded-lg border", m.price === "Free" ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-amber-50 text-amber-700 border-amber-100")}>{m.price}</span>
                            </div>
                            <span className="text-[10px] font-bold text-[#E53935] uppercase flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />{m.time}</span>
                         </div>

                         <h3 className="text-xl font-bold text-[#292828] mb-4 leading-tight group-hover:text-[#E53935] transition-colors">{m.title}</h3>
                         
                         <div className="flex flex-col gap-2 mb-6">
                            <div className="flex items-center gap-2 text-[12px] font-medium text-[#292828] bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                               <MapPin size={14} className="text-[#E53935]" />
                               <span>{m.type === "Virtual" ? "Online Link Available on Join" : `${m.loc} • ${m.address}`}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                               <div className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#292828] px-3 py-1.5 rounded-xl shadow-md">
                                  <Star size={12} className="text-amber-400" /> Relevant: {m.score}%
                               </div>
                               <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
                                  <Shield size={12} className="text-blue-500" /> Host: {m.advisor}
                               </div>
                            </div>
                         </div>

                          <div className={cn(
                             "bg-[#292828]/5 rounded-2xl p-4 flex gap-4 items-center mt-auto",
                             viewMode === "list" ? "max-w-2xl" : ""
                          )}>
                             <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-[#292828]/10 text-xl shrink-0">💡</div>
                             <p className="text-[12px] font-medium text-[#292828] leading-snug">{m.advice}</p>
                          </div>
                       </div>

                       <div className={cn(
                          "p-8 flex flex-col gap-5 border-[#292828]/5",
                          viewMode === "list" 
                             ? "border-t xl:border-t-0 xl:border-l bg-slate-50/50 xl:w-[320px] shrink-0 justify-center" 
                             : "pt-4 mt-auto border-t"
                       )}>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="flex -space-x-2">
                                  {m.participants.map((avatar: string, i: number) => (
                                    <img key={i} src={avatar} className="h-8 w-8 rounded-full border-2 border-white shadow-sm object-cover" alt="" />
                                  ))}
                               </div>
                               <span className="text-[11px] font-bold text-[#292828] uppercase">{m.count}/12 Local Members</span>
                            </div>
                         </div>
                     <button 
                       onClick={() => handleJoin(m.id)}
                       disabled={m.status === "none" && m.count >= 12}
                       className={cn(
                         "w-full px-6 py-4 rounded-xl text-[11px] font-black uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2",
                         m.status === "joined" ? "bg-green-500 text-white shadow-green-500/20 hover:bg-green-600" : 
                         m.status === "pending" ? "bg-amber-400 text-amber-950 shadow-amber-400/20 hover:bg-amber-500" :
                         m.count >= 12 ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none active:scale-100" :
                         "bg-[#292828] text-white hover:bg-[#E53935]"
                       )}
                     >
                        {m.status === "joined" ? "✓ You're In!" : 
                         m.status === "pending" ? "⏳ Waiting for host" : 
                         m.count >= 12 ? "Full (12/12)" :
                         (m.requireApproval ? "Ask to Join" : "Join Now")}
                     </button>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="col-span-full flex flex-col items-center justify-center py-40 bg-[#292828]/5 rounded-[2.6rem] border-2 border-dashed border-[#292828]/10 italic text-[#292828]/40">
                    <Users size={48} className="mb-4 opacity-20" />
                    <p className="text-[14px] font-black uppercase tracking-widest">No Meetups Found</p>
                    <p className="text-[11px] font-medium mt-2">Start a meeting to connect with local builders.</p>
                 </div>
               )}
           </div>
        </div>
      </div>

      {/* 2. AREA ANALYTICS (RIGHT) */}
      <aside className="hidden xl:flex flex-col w-[400px] h-screen sticky top-0 bg-white border-l border-[#292828]/10 p-10 gap-10">
         <div>
            <p className="text-[10px] font-bold text-[#292828]/40 uppercase mb-6">Local Traffic</p>
            <div className="p-8 bg-[#292828] rounded-[1.625rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 flex items-center gap-5">
                  <div className="h-14 w-14 bg-[#E53935] rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10">📡</div>
                  <div>
                     <p className="text-lg font-bold text-white">Nearby</p>
                     <p className="text-[11px] font-bold text-[#E53935] uppercase">Radius: 2.5km</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex-1 bg-[#292828]/5 rounded-[1.95rem] border-4 border-white shadow-2xl relative overflow-hidden group">
            <Image src="/images/trivandrum-map.png" alt="" fill className="object-cover opacity-50 grayscale transition-all duration-[20s] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            
            {filteredMeetups.slice(0, 6).map(m => (
               <div key={`map-pin-${m.id}`} className="absolute group/pin cursor-pointer transition-all hover:z-50" style={{ top: `${m.y}%`, left: `${m.x}%` }}>
                  <div className={cn(
                    "h-12 w-12 rounded-2xl border-2 shadow-2xl flex items-center justify-center text-white transition-transform group-hover/pin:scale-110 duration-300",
                    m.status === "joined" ? "bg-green-500 border-white" : m.status === "pending" ? "bg-amber-400 border-white" : "bg-[#E53935] border-white/80"
                  )}>
                     {m.topic === 'Tech' ? '💻' : m.topic === 'Business' ? '🏢' : m.topic === 'Startup' ? '🚀' : m.topic === 'Design' ? '🎨' : '🤝'}
                  </div>
                  {/* Tooltip Overlay */}
                  <div className="absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-[220px] bg-white border border-[#292828]/10 p-5 rounded-3xl opacity-0 invisible group-hover/pin:opacity-100 group-hover/pin:visible transition-all pointer-events-none shadow-[0_20px_40px_-5px_rgba(0,0,0,0.2)] z-50 translate-y-2 group-hover/pin:translate-y-0 text-center">
                     <p className="text-[13px] font-black text-[#292828] leading-tight line-clamp-2 mb-2">{m.title}</p>
                     <div className="flex items-center justify-center gap-1.5 text-[#E53935] font-black text-[9px] uppercase">
                        <MapPin size={10} /> {m.loc}
                     </div>
                  </div>
               </div>
            ))}

            <Link href="/explore" className="absolute bottom-8 left-8 right-8">
               <div className="bg-white p-6 rounded-[1.3rem] border border-[#292828]/10 shadow-3xl hover:border-[#E53935]/20 flex items-center justify-between group/link transition-all translate-y-0 hover:-translate-y-2">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-[#292828]/5 rounded-xl flex items-center justify-center text-xl">🏙️</div>
                     <div>
                        <p className="text-[13px] font-bold text-[#292828]">Explore Hubs</p>
                        <p className="text-[10px] font-bold text-[#292828] uppercase">View nearby nodes</p>
                     </div>
                  </div>
                  <ArrowRight size={20} className="text-[#292828]/40 group-hover/link:text-[#E53935] transition-colors" />
               </div>
            </Link>
         </div>
      </aside>

      {/* START MEETING MODAL */}
      {showHostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#292828]/40 backdrop-blur-sm" onClick={() => setShowHostModal(false)} />
           <div className="relative w-full max-w-lg bg-white rounded-[1.95rem] p-12 shadow-4xl animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-black text-[#292828] mb-2 leading-tight">Post a <span className="text-[#E53935]">Meetup</span></h2>
              <p className="text-[#292828] font-medium mb-10">Tell local business people where you are.</p>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-[#292828]/40 uppercase ml-1 mb-2 block">Meeting Name</label>
                    <input 
                      type="text" 
                      value={hostData.title}
                      onChange={(e) => setHostData({ ...hostData, title: e.target.value })}
                      placeholder="e.g. Real Estate Coffee Talk" 
                      className="w-full h-14 bg-[#292828]/5 border border-[#292828]/10 rounded-2xl px-6 text-[14px] font-medium outline-none focus:bg-white focus:border-[#E53935]/20 transition-all" 
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-[#292828]/40 uppercase ml-1 mb-2 block">Format</label>
                       <select 
                         value={hostData.type}
                         onChange={(e) => setHostData({ ...hostData, type: e.target.value })}
                         className="w-full h-14 bg-[#292828]/5 border border-[#292828]/10 rounded-2xl px-6 text-[14px] font-medium outline-none appearance-none cursor-pointer"
                       >
                          <option value="In-Person">Physical Meetup</option>
                          <option value="Virtual">Virtual Session</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-[#292828]/40 uppercase ml-1 mb-2 block">Location Sector</label>
                       <select 
                         value={hostData.loc}
                         onChange={(e) => setHostData({ ...hostData, loc: e.target.value })}
                         className="w-full h-14 bg-[#292828]/5 border border-[#292828]/10 rounded-2xl px-6 text-[14px] font-medium outline-none appearance-none cursor-pointer"
                       >
                          <option value="">Select Region...</option>
                          <option value="Technopark">Technopark</option>
                          <option value="Pattom">Pattom</option>
                          <option value="Kazhakkoottam">Kazhakk.</option>
                       </select>
                    </div>
                 </div>

                 <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                       type="checkbox" 
                       checked={hostData.requireApproval}
                       onChange={(e) => setHostData({ ...hostData, requireApproval: e.target.checked })}
                       className="w-5 h-5 rounded-md border-slate-300 text-[#E53935] focus:ring-[#E53935] flex-shrink-0"
                    />
                    <div>
                       <p className="text-[13px] font-bold text-[#292828]">Require Host Approval</p>
                       <p className="text-[10px] font-semibold text-[#292828]/50 uppercase mt-0.5">Manually admit participants into this session.</p>
                    </div>
                 </label>

                 <button 
                   onClick={handleStartMeeting}
                   disabled={!hostData.title || !hostData.loc}
                   className="w-full h-16 bg-[#292828] text-white rounded-[0.975rem] font-bold text-[11px] uppercase shadow-2xl hover:bg-[#E53935] disabled:opacity-40 transition-all flex items-center justify-center gap-2 mt-4"
                 >
                    Start Meetup Now <ArrowRight size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
