"use client";

import React, { useState, useMemo } from "react";
import { 
  MapPin, 
  Coffee, 
  Zap, 
  UserPlus, 
  Search, 
  Compass, 
  Target, 
  ArrowRight, 
  Check, 
  Plus, 
  Users, 
  Clock,
  X,
  Navigation,
  LayoutGrid,
  List,
  Filter,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_PROS = [
  { id: 1, name: "Arjun Dev", role: "Designer", dist: "400m", status: "Open for Coffee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" },
  { id: 2, name: "Kiran Raj", role: "Tech Manager", dist: "1.2km", status: "In a meeting", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" },
  { id: 3, name: "Sana Maryam", role: "Business Owner", dist: "800m", status: "Available", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" },
];

const ADVISORS = [
  { id: 501, name: "Dr. Arun K.", skill: "Tax & Legal", rating: 4.9, session: "Available Now", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" },
  { id: 502, name: "Meera Nair", skill: "Growth Marketing", rating: 4.8, session: "Today, 4PM", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=100" },
  { id: 503, name: "John Doe", skill: "Cloud Architecture", rating: 5.0, session: "Online", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100" },
];

const INITIAL_MEETUPS = [
  { id: 101, title: "Coffee Chat", topic: "Work", count: 4, time: "Active Now", loc: "Technopark Ph-III", joined: false },
  { id: 102, title: "Design Feedback", topic: "Design", count: 2, time: "Starts in 20m", loc: "Kazhakkoottam", joined: false },
  { id: 103, title: "Owner Meetup", topic: "Business", count: 12, time: "Active Now", loc: "Pattom", joined: false },
];

const TOPICS = ["All", "Work", "Design", "Business", "Tech", "Other"];

export default function Meetup() {
  const [pros, setPros] = useState(INITIAL_PROS);
  const [meetups, setMeetups] = useState(INITIAL_MEETUPS);
  const [invitedIds, setInvitedIds] = useState<number[]>([]);
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostData, setHostData] = useState({ title: "", loc: "", topic: "Work" });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTopic, setActiveTopic] = useState("All");

  const filteredMeetups = useMemo(() => {
    return meetups.filter(m => activeTopic === "All" || m.topic === activeTopic);
  }, [meetups, activeTopic]);

  const toggleInvite = (id: number) => {
    setInvitedIds(prev => prev.includes(id) ? prev.filter(iid => iid !== id) : [...prev, id]);
  };

  const handleHostSync = () => {
    if (!hostData.title || !hostData.loc) return;
    const newMeetup = {
      id: Date.now(),
      title: hostData.title,
      topic: hostData.topic,
      count: 1,
      time: "Active Now",
      loc: hostData.loc,
      joined: true
    };
    setMeetups([newMeetup, ...meetups]);
    setHostData({ title: "", loc: "", topic: "Work" });
    setShowHostModal(false);
  };

  const handleJoinHub = (id: number) => {
    setMeetups(meetups.map(m => {
      if (m.id === id) {
        return { ...m, joined: !m.joined, count: m.joined ? m.count - 1 : m.count + 1 };
      }
      return m;
    }));
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-full">
      
      {/* Column 1: Advisor Rail (NEW) */}
      <div className="w-full xl:w-[320px] p-8 border-r border-[#F1F3F4] bg-[#FAFAFA]/30 overflow-y-auto no-scrollbar">
         <div className="mb-10">
            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-6">Expert Advisors</h4>
            <div className="space-y-6">
               {ADVISORS.map(advisor => (
                 <div key={advisor.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                          <img src={advisor.avatar} alt="Advisor" className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <h5 className="text-[14px] font-bold text-slate-900 group-hover:text-primary transition-colors">{advisor.name}</h5>
                             <ShieldCheck size={14} className="text-primary" />
                          </div>
                          <p className="text-[10px] font-black uppercase text-primary tracking-tighter">{advisor.skill}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] mb-4">
                       <div className="flex items-center gap-1 font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md">
                          <Star size={10} className="fill-current" /> {advisor.rating}
                       </div>
                       <span className="text-slate-400 font-medium">{advisor.session}</span>
                    </div>

                    <button className="w-full py-2.5 bg-slate-50 text-slate-900 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                       <MessageCircle size={14} /> Ask Doubt
                    </button>
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[11px] font-bold uppercase hover:border-primary hover:text-primary transition-all">
               Join as Advisor
            </button>
         </div>

         <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <GraduationCap size={28} className="text-primary mb-6" />
            <h5 className="text-[18px] font-black leading-tight mb-4">Knowledge<br />Exchange</h5>
            <p className="text-[12px] text-slate-400 font-medium mb-0">Help others grow while expanding your own local influence.</p>
         </div>
      </div>

      {/* Main Context: Feed & Map */}
      <div className="flex-1 p-8 border-r border-[#F1F3F4] flex flex-col h-full overflow-hidden">
         <div className="flex flex-col gap-6 mb-8 px-2">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Who's Nearby</h2>
                  <p className="text-[13px] text-[#5F6368] font-medium mt-1">People and meetings in <span className="text-primary font-bold">Trivandrum</span></p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                     <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>
                       <LayoutGrid size={18} />
                     </button>
                     <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>
                       <List size={18} />
                     </button>
                  </div>
                  <button onClick={() => setShowHostModal(true)} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-[12px] shadow-lg shadow-primary/20 hover:bg-black transition-all">
                     Start a Meeting
                  </button>
               </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
               {TOPICS.map(topic => (
                 <button key={topic} onClick={() => setActiveTopic(topic)} className={cn("px-6 py-2 rounded-xl text-[11px] font-bold border transition-all whitespace-nowrap", activeTopic === topic ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 shadow-sm")}>
                   {topic}
                 </button>
               ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto pr-4 no-scrollbar pb-10">
            <div className={cn("gap-6", viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col")}>
               {filteredMeetups.map(meetup => (
                 <div key={meetup.id} className={cn("bg-white rounded-[1.5rem] border-2 transition-all group overflow-hidden", meetup.joined ? "border-primary shadow-xl" : "border-slate-50 shadow-sm", viewMode === "list" ? "flex items-center gap-8 pr-8" : "flex flex-col")}>
                    <div className={cn("bg-slate-50 relative flex items-center justify-center", viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "h-40")}>
                       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", meetup.joined ? "bg-primary text-white" : "bg-white text-primary shadow-md")}>
                          <Coffee size={24} />
                       </div>
                       <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-bold">{meetup.topic}</span>
                       </div>
                    </div>
                    <div className="p-8 flex-1">
                       <h3 className="text-[17px] font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{meetup.title}</h3>
                       <div className="flex items-center gap-3 text-[12px] text-slate-500 mb-6 font-medium">
                          <MapPin size={14} className="text-primary" />
                          <span>{meetup.loc}</span>
                       </div>
                       <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                          <div className="flex items-center gap-3">
                             <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                     <img src={`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=32&auto=format&fit=crop`} alt="User" />
                                  </div>
                                ))}
                             </div>
                             <span className="text-[11px] font-bold text-slate-400">+{meetup.count} joining</span>
                          </div>
                          <button onClick={() => handleJoinHub(meetup.id)} className={cn("px-6 py-2.5 rounded-xl text-[11px] font-bold transition-all", meetup.joined ? "bg-slate-100 text-slate-400" : "bg-primary text-white shadow-xl shadow-primary/10")}>
                             {meetup.joined ? "Attending" : "I'm interested"}
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Column 3: Area Map */}
      <div className="w-full xl:w-[450px] bg-slate-50 flex flex-col relative h-full">
         <div className="p-8 pb-4">
            <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-widest mb-4">Area Map</h4>
            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                     <Navigation size={24} />
                  </div>
                  <div>
                     <p className="text-[14px] font-bold text-slate-900">Ahmad Nur Fawaid</p>
                     <p className="text-[11px] font-medium text-slate-500">Active in <span className="font-bold text-primary">Kazhakkoottam</span></p>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex-1 m-8 mt-4 bg-white rounded-[2rem] border-4 border-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 grayscale opacity-30 brightness-110">
               <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Map" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <div className="w-12 h-12 bg-primary rounded-2xl border-4 border-white shadow-2xl relative z-10 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=64&auto=format&fit=crop" className="w-full h-full rounded-xl object-cover" alt="User" />
               </div>
            </div>
            <div className="absolute bottom-10 left-10 right-10">
               <div className="bg-white rounded-[1.5rem] px-6 py-4 flex items-center justify-between text-slate-900 border border-slate-100 shadow-2xl">
                  <div className="flex items-center gap-3">
                     <Target size={18} className="text-primary" />
                     <span className="text-[12px] font-black uppercase tracking-widest">Trivandrum Hub</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
               </div>
            </div>
         </div>
      </div>

      {showHostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowHostModal(false)} />
           <div className="relative w-full max-w-sm bg-white rounded-[2rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-bold mb-10">Start a Meeting</h3>
              <div className="space-y-4">
                 <input type="text" value={hostData.title} onChange={(e) => setHostData({ ...hostData, title: e.target.value })} placeholder="Meeting Topic" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-[14px] font-bold outline-none" />
                 <select value={hostData.loc} onChange={(e) => setHostData({ ...hostData, loc: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-[14px] font-bold outline-none appearance-none">
                    <option value="">Select Location...</option>
                    <option value="Technopark">Technopark</option>
                    <option value="Kazhakkoottam">Kazhakkoottam</option>
                    <option value="Pattom">Pattom</option>
                 </select>
                 <button onClick={handleHostSync} disabled={!hostData.title || !hostData.loc} className="w-full py-5 bg-primary disabled:opacity-50 text-white rounded-2xl font-bold text-[12px] uppercase shadow-2xl hover:bg-black transition-all">Set Meeting Location</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
