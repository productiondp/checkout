"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

const INITIAL_MEETUPS = [
  { 
    id: 101, 
    title: "SaaS Business Coffee", 
    topic: "Work", 
    count: 14, 
    time: "Live now", 
    loc: "Technopark Ph-III", 
    address: "Park Centre Lounge",
    joined: false,
    aiSpeaker: { name: "GrowthBot AI", advice: "Idea: Helping local businesses online" }
  },
  { 
    id: 102, 
    title: "Website Design Feedback", 
    topic: "Design", 
    count: 8, 
    time: "Starting in 15m", 
    loc: "Kazhakkoottam", 
    address: "Brew & Bytes Coffee",
    joined: false,
    aiSpeaker: { name: "Design AI", advice: "Idea: Using dark colors for better looks" }
  },
  { 
    id: 103, 
    title: "General Business Talk", 
    topic: "Business", 
    count: 24, 
    time: "Active Now", 
    loc: "Pattom", 
    address: "The Hub Coworking",
    joined: false,
    aiSpeaker: { name: "Strategy AI", advice: "Idea: Finding big investors in Kerala" }
  },
];

const TOPICS = ["All", "Work", "Design", "Business", "Tech", "Startup"];

export default function Meetup() {
  const [meetups, setMeetups] = useState(INITIAL_MEETUPS);
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostData, setHostData] = useState({ title: "", loc: "", topic: "Work" });
  const [activeTopic, setActiveTopic] = useState("All");

  const filteredMeetups = useMemo(() => {
    return meetups.filter(m => activeTopic === "All" || m.topic === activeTopic);
  }, [meetups, activeTopic]);

  const handleJoinHub = (id: number) => {
    setMeetups(meetups.map(m => {
      if (m.id === id) {
        if (!m.joined) {
           alert(`You have successfully joined the "${m.title}" meeting!`);
        }
        return { ...m, joined: !m.joined, count: m.joined ? m.count - 1 : m.count + 1 };
      }
      return m;
    }));
  };

  const handleHostSync = () => {
    if (!hostData.title || !hostData.loc) return;
    const newMeetup = {
      id: Date.now(),
      title: hostData.title,
      topic: hostData.topic,
      count: 1,
      time: "Live Now",
      loc: hostData.loc,
      address: "At your current place",
      joined: true,
      aiSpeaker: { name: "Local AI", advice: "Idea: Working together today" }
    };
    setMeetups([newMeetup, ...meetups]);
    setShowHostModal(false);
    alert(`Your meeting "${hostData.title}" is now live for everyone!`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden">
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-8 pb-4 bg-white/80 backdrop-blur-md z-30 space-y-6 sticky top-0 border-b border-slate-50">
           <div className="flex justify-between items-center">
              <div>
                 <h2 className="text-3xl font-bold text-slate-900 tracking-normal leading-tight mb-1">Live <span className="text-[#E53935]">Meetings</span></h2>
                 <p className="text-[12px] font-normal text-slate-500 tracking-normal">Connecting 142 nearby business people</p>
              </div>
              <button 
                onClick={() => setShowHostModal(true)}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold text-[13px] tracking-normal shadow-lg hover:bg-[#E53935] active:scale-95 transition-all"
              >
                 + Start a Meeting
              </button>
           </div>

           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {TOPICS.map(topic => (
                <button 
                  key={topic} 
                  onClick={() => setActiveTopic(topic)}
                  className={`px-5 py-2 rounded-lg text-xs font-medium tracking-normal border transition-all whitespace-nowrap ${
                    activeTopic === topic ? "bg-[#E53935] text-white border-[#E53935]" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {topic}
                </button>
              ))}
           </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/10">
           
           {/* Advisor Invite */}
           <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mb-10 border border-slate-800 shadow-xl">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white p-1 shrink-0 overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop" className="w-full h-full rounded-xl object-cover" />
                    </div>
                    <div>
                       <p className="text-[11px] font-medium text-[#E53935] mb-1">Direct Invite</p>
                       <h4 className="text-xl font-bold text-white leading-tight">Dr. Sarah Chen</h4>
                       <p className="text-[13px] text-slate-400 font-normal">Wants to talk about business growth in Kerala</p>
                    </div>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => alert("Connecting with Sarah...")} className="flex-1 md:flex-none px-6 py-3 bg-[#E53935] text-white rounded-xl font-semibold text-xs tracking-normal transition-all">Accept</button>
                    <button onClick={() => alert("Invitation hidden")} className="flex-1 md:flex-none px-6 py-3 bg-white/5 text-slate-400 rounded-xl font-semibold text-xs tracking-normal transition-all">Skip</button>
                 </div>
              </div>
           </div>

           {/* Cards Grid */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {filteredMeetups.map(meetup => (
                <div key={meetup.id} className={`bg-white rounded-3xl border transition-all relative overflow-hidden flex flex-col ${
                  meetup.joined ? "border-[#E53935] shadow-lg" : "border-slate-100 shadow-sm"
                }`}>
                   <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-5">
                         <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-[11px] font-normal text-slate-400 tracking-normal">{meetup.topic}</span>
                         </div>
                         <span className="text-[11px] font-medium text-[#E53935] tracking-normal">{meetup.time}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-snug tracking-normal">{meetup.title}</h3>
                      <div className="flex items-center gap-2 text-xs font-normal text-slate-500 mb-6">
                         <span>📍</span>
                         <span>{meetup.loc} • <span className="text-slate-400">{meetup.address}</span></span>
                      </div>

                      {/* AI Helped Insight */}
                      <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden mb-6 border border-slate-800 shadow-lg">
                         <div className="relative z-10 flex items-center gap-4">
                            <div className="w-11 h-11 bg-[#E53935] rounded-xl flex items-center justify-center text-xl shrink-0">
                               🤖
                            </div>
                            <div className="flex-1">
                               <p className="text-[10px] font-medium text-[#E53935] mb-1">AI Help</p>
                               <p className="text-[13px] font-semibold text-white leading-tight tracking-normal">{meetup.aiSpeaker.advice}</p>
                            </div>
                         </div>
                      </div>

                      {/* Bottom Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-50 mt-auto">
                         <div className="flex items-center gap-3 shrink-0">
                            <div className="flex -space-x-2">
                               {[1, 2, 3].map(i => (
                                 <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                                    <img src={`https://images.unsplash.com/photo-${1500000000000 + (meetup.id*i)%1000}?q=80&w=64&auto=format&fit=crop`} alt="Member" />
                                 </div>
                               ))}
                            </div>
                            <span className="text-[11px] font-normal text-slate-500">{meetup.count} People joining</span>
                         </div>
                         <button 
                           onClick={() => handleJoinHub(meetup.id)}
                           className={`flex-1 sm:flex-none px-6 py-3 rounded-lg text-xs font-semibold tracking-normal transition-all whitespace-nowrap ${
                             meetup.joined ? "bg-slate-50 text-slate-400 cursor-default" : "bg-slate-900 text-white shadow-md hover:bg-[#E53935]"
                           }`}
                         >
                            {meetup.joined ? "You are going" : "Join Meeting"}
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* RIGHT AREA */}
      <div className="w-full lg:w-[400px] flex flex-col bg-white h-full relative z-20 border-l border-slate-100">
         <div className="p-8 pb-4">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-normal mb-6">Nearby People</h4>
            <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-lg border border-slate-800">
               <div className="flex items-center gap-5 relative z-10">
                  <div className="w-12 h-12 bg-[#E53935] rounded-xl flex items-center justify-center text-2xl shadow-lg border border-white/10">
                     📡
                  </div>
                  <div>
                     <p className="text-[14px] font-bold text-white leading-none mb-1">Your Hub Online</p>
                     <p className="text-[11px] font-normal text-[#E53935]">Radius: 2.4km</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex-1 m-8 mt-2 bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 grayscale opacity-30 brightness-110">
               <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200" className="w-full h-full object-cover" />
            </div>

            <div className="absolute top-[45%] left-[40%]">
               <div className="w-10 h-10 bg-[#E53935] rounded-xl border-[3px] border-white shadow-lg flex items-center justify-center text-white">🏢</div>
            </div>

            <Link href="/explore" className="absolute bottom-6 left-6 right-6">
               <div className="bg-slate-900 p-6 rounded-2xl flex items-center justify-between text-white shadow-xl border border-white/5 hover:border-[#E53935]/40 transition-all">
                  <div className="flex items-center gap-4">
                     <span className="text-xl">🏙️</span>
                     <div>
                        <p className="text-xs font-bold">See all businesses</p>
                        <p className="text-[10px] text-slate-500">512 places available</p>
                     </div>
                  </div>
                  <span className="text-slate-500">→</span>
               </div>
            </Link>
         </div>
      </div>

      {/* CREATE MEETING MODAL */}
      {showHostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHostModal(false)} />
           <div className="relative w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
              <h3 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">Start a local <span className="text-[#E53935]">Meeting</span></h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase mb-2 block ml-1">Meeting Name</label>
                    <input 
                      type="text" 
                      value={hostData.title} 
                      onChange={(e) => setHostData({ ...hostData, title: e.target.value })} 
                      placeholder="e.g. Kerala Business Coffee" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium outline-none transition-all placeholder:text-slate-300 shadow-sm" 
                    />
                 </div>
                 <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase mb-2 block ml-1">City Area</label>
                    <select 
                      value={hostData.loc} 
                      onChange={(e) => setHostData({ ...hostData, loc: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-medium outline-none appearance-none cursor-pointer"
                    >
                       <option value="">Select Area...</option>
                       <option value="Technopark">Technopark</option>
                       <option value="Kazhakkoottam">Kazhakkoottam</option>
                       <option value="Pattom">Pattom</option>
                    </select>
                 </div>
                 <button 
                   onClick={handleHostSync} 
                   disabled={!hostData.title || !hostData.loc} 
                   className="w-full py-4 bg-slate-900 disabled:opacity-50 text-white rounded-xl font-bold text-sm tracking-normal shadow-lg hover:bg-[#E53935] transition-all"
                 >
                    Start Now
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
