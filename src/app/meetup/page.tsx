"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Calendar, ArrowRight, Star, Shield, Plus, MessageSquare, Clock, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_MEETUPS = Array.from({ length: 25 }).map((_, i) => ({
  id: 101 + i,
  title: [
    "SaaS Business Coffee", "UI Design Workshop", "SME Growth Talk", "Startup Hub Meet", "Technopark Mixer",
    "Digital Marketing Sync", "Founder Mastermind", "Tech Lead Circle", "MSME Strategy Hub", "Kerala Trade Coffee",
    "Investor Pitch Prep", "Product Management Chat", "E-commerce Logistics", "Security Node Sync", "Financial Hub Talk",
    "Women in Tech Mixer", "Regional Sales Meet", "Brand Identity Session", "Cloud Infra Group", "App Dev Meetup",
    "Business Scaling Forum", "HR Tech Discussion", "Supply Chain Hub", "Cyber Security Talk", "Future Founders Meet"
  ][i],
  topic: ["Business", "Design", "Tech", "Startup", "Work"][i % 5],
  count: Math.floor(Math.random() * 20) + 5,
  time: i % 3 === 0 ? "Live now" : `Starting in ${i * 5}m`,
  loc: ["Technopark", "Pattom", "Kazhakkoottam", "Vellayambalam", "Palayam"][i % 5],
  address: ["Park Centre", "The Hub", "Brew & Bytes", "Sector 7", "Central Plaza"][i % 5],
  joined: false,
  advice: [
    "Finding local partners is key to scaling fast in Kerala.",
    "Dark mode interfaces are seeing higher retention in current apps.",
    "Technopark Ph-III is becoming the focal point for B2B growth.",
    "Focus on supply chain transparency to build trust with MSMEs.",
    "Networking with regional leads can unlock hidden tender opportunities."
  ][i % 5]
}));

const TOPICS = ["All", "Business", "Design", "Tech", "Startup", "Work"];

export default function MeetupPage() {
  const [meetups, setMeetups] = useState(INITIAL_MEETUPS);
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostData, setHostData] = useState({ title: "", loc: "", topic: "Business" });
  const [activeTopic, setActiveTopic] = useState("All");

  const filteredMeetups = useMemo(() => {
    return meetups.filter(m => activeTopic === "All" || m.topic === activeTopic);
  }, [meetups, activeTopic]);

  const handleJoin = (id: number) => {
    setMeetups(meetups.map(m => {
      if (m.id === id) {
        return { ...m, joined: !m.joined, count: m.joined ? m.count - 1 : m.count + 1 };
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
      address: "Your Location",
      joined: true,
      advice: "Welcome to the network! Start by introducing your business."
    };
    setMeetups([newMeetup, ...meetups]);
    setShowHostModal(false);
    setHostData({ title: "", loc: "", topic: "Business" });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      
      {/* 1. MEETING FEED (LEFT) */}
      <div className="flex-1 flex flex-col min-h-screen border-r border-[#292828]/10 pb-40 lg:pb-12">
        
        {/* Header Section */}
        <div className="p-6 lg:p-10 border-b border-[#292828]/5 sticky top-0 bg-white/95 backdrop-blur-xl z-30">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                 <h1 className="text-3xl font-black text-[#292828] leading-tight">Live Meetings</h1>
                 <p className="text-[12px] font-medium text-[#292828] mt-1">Connecting with business people near you</p>
              </div>
              <button 
                onClick={() => setShowHostModal(true)}
                className="px-8 py-4 bg-[#292828] text-white rounded-2xl font-bold text-[11px] uppercase shadow-xl hover:bg-[#E53935] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                 <Plus size={18} /> Start a Meeting
              </button>
           </div>

           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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
        </div>

        {/* Meeting Grid */}
        <div className="p-6 lg:p-10 space-y-8">
           
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {filteredMeetups.map(m => (
                <div key={m.id} className={cn(
                  "bg-white rounded-[2.5rem] border transition-all overflow-hidden flex flex-col group",
                  m.joined ? "border-[#E53935] shadow-2xl shadow-red-500/5 scale-[1.02]" : "border-[#292828]/10 shadow-sm hover:border-[#E53935]/20 hover:shadow-xl"
                )}>
                   <div className="p-8 pb-4">
                      <div className="flex justify-between items-center mb-6">
                         <div className="flex items-center gap-2">
                            <span className={cn("h-2 w-2 rounded-full", m.time === "Live now" ? "bg-green-500 animate-pulse" : "bg-slate-300")} />
                            <span className="text-[10px] font-bold text-[#292828] uppercase tracking-widest">{m.topic}</span>
                         </div>
                         <span className="text-[10px] font-bold text-[#E53935] uppercase tracking-widest">{m.time}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#292828] mb-2 leading-tight group-hover:text-[#E53935] transition-colors">{m.title}</h3>
                      <div className="flex items-center gap-2 text-[12px] font-medium text-[#292828] mb-6">
                         <MapPin size={14} className="text-[#292828]/40" />
                         <span>{m.loc} • <span className="text-[#292828]">{m.address}</span></span>
                      </div>

                      <div className="bg-[#292828]/5 rounded-2xl p-4 flex gap-4 items-center">
                         <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-[#292828]/10 text-xl">💡</div>
                         <p className="text-[13px] font-medium text-[#292828] leading-snug">{m.advice}</p>
                      </div>
                   </div>

                   <div className="p-8 pt-4 mt-auto flex items-center justify-between border-t border-[#292828]/5">
                      <div className="flex items-center gap-3">
                         <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <img key={i} src={`https://i.pravatar.cc/150?u=meet${m.id}${i}`} className="h-8 w-8 rounded-full border-2 border-white shadow-sm" alt="" />
                            ))}
                         </div>
                         <span className="text-[11px] font-bold text-[#292828]">{m.count}+ People Joining</span>
                      </div>
                      <button 
                        onClick={() => handleJoin(m.id)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-[11px] font-bold uppercase transition-all shadow-lg active:scale-95",
                          m.joined ? "bg-[#292828]/10 text-[#292828]" : "bg-[#292828] text-white hover:bg-[#E53935]"
                        )}
                      >
                         {m.joined ? "Joined" : "Join Now"}
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 2. AREA ANALYTICS (RIGHT) */}
      <aside className="hidden xl:flex flex-col w-[400px] h-screen sticky top-0 bg-white border-l border-[#292828]/10 p-10 gap-10">
         <div>
            <p className="text-[10px] font-bold text-[#292828]/40 uppercase tracking-widest mb-6">Local Traffic</p>
            <div className="p-8 bg-[#292828] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 flex items-center gap-5">
                  <div className="h-14 w-14 bg-[#E53935] rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10">📡</div>
                  <div>
                     <p className="text-lg font-bold text-white">Hub Scanner</p>
                     <p className="text-[11px] font-bold text-[#E53935] uppercase">Radius: 2.5km Citywide</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex-1 bg-[#292828]/5 rounded-[3rem] border-4 border-white shadow-2xl relative overflow-hidden group">
            <Image src="/images/trivandrum-map.png" alt="" fill className="object-cover opacity-50 grayscale transition-all duration-[20s] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            
            <div className="absolute top-[40%] left-[30%]">
               <div className="h-12 w-12 bg-[#E53935] rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-white animate-bounce-subtle">
                  🏢
               </div>
            </div>

            <Link href="/explore" className="absolute bottom-8 left-8 right-8">
               <div className="bg-white p-6 rounded-[2rem] border border-[#292828]/10 shadow-3xl hover:border-[#E53935]/20 flex items-center justify-between group/link transition-all translate-y-0 hover:-translate-y-2">
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
           <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-4xl animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-black text-[#292828] mb-2 leading-tight">Start a <span className="text-[#E53935]">Meeting</span></h2>
              <p className="text-[#292828] font-medium mb-10">Broadcast your location to nearby business partners.</p>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-[#292828]/40 uppercase tracking-widest ml-1 mb-2 block">Meeting Name</label>
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
                       <label className="text-[10px] font-bold text-[#292828]/40 uppercase tracking-widest ml-1 mb-2 block">Location</label>
                       <select 
                         value={hostData.loc}
                         onChange={(e) => setHostData({ ...hostData, loc: e.target.value })}
                         className="w-full h-14 bg-[#292828]/5 border border-[#292828]/10 rounded-2xl px-6 text-[14px] font-medium outline-none appearance-none cursor-pointer"
                       >
                          <option value="">Select...</option>
                          <option value="Technopark">Technopark</option>
                          <option value="Pattom">Pattom</option>
                          <option value="Kazhakkoottam">Kazhakk.</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-[#292828]/40 uppercase tracking-widest ml-1 mb-2 block">Category</label>
                       <select 
                         value={hostData.topic}
                         onChange={(e) => setHostData({ ...hostData, topic: e.target.value })}
                         className="w-full h-14 bg-[#292828]/5 border border-[#292828]/10 rounded-2xl px-6 text-[14px] font-medium outline-none appearance-none cursor-pointer"
                       >
                          {TOPICS.slice(1).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 <button 
                   onClick={handleStartMeeting}
                   disabled={!hostData.title || !hostData.loc}
                   className="w-full h-16 bg-[#292828] text-white rounded-[1.5rem] font-bold text-[11px] uppercase shadow-2xl hover:bg-[#E53935] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                 >
                    Launch Meeting Now <ArrowRight size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
