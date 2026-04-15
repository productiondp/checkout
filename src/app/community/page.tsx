"use client";

import React, { useState } from "react";
import { MessageSquare, Users, TrendingUp, Sparkles, Plus, MoreHorizontal, Check, Briefcase, Cpu, Palette } from "lucide-react";

const INITIAL_GROUPS = [
  { name: "Talk about Business", members: "1.2k", active: 42, icon: Briefcase, color: "bg-red-500" },
  { name: "Software Help", members: "840", active: 12, icon: Cpu, color: "bg-blue-500" },
  { name: "Trivandrum Workers", members: "2.4k", active: 156, icon: Palette, color: "bg-pink-500" },
];

const INITIAL_POSTS = [
  { author: "Kiran R.", topic: "Best way to get paid for startups in Kerala?", replies: 24, likes: 12, category: "Money" },
  { author: "Sana M.", topic: "Looking for video feedback on my cafe ad.", replies: 8, likes: 45, category: "Creative" },
];

export default function Community() {
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"Feed" | "Groups">("Feed");

  const toggleGroup = (name: string) => {
    if (joinedGroups.includes(name)) {
      setJoinedGroups(joinedGroups.filter(g => g !== name));
      alert(`Left the group: ${name}`);
    } else {
      setJoinedGroups([...joinedGroups, name]);
      alert(`Welcome to ${name}!`);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-white">
      {/* Mobile-Only Tabs */}
      <div className="lg:hidden flex border-b border-slate-50 sticky top-14 left-0 right-0 bg-white/90 backdrop-blur-md z-40">
        {(["Feed", "Groups"] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveMobileTab(tab)}
            className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-tighter transition-all ${activeMobileTab === tab ? "text-[#E53935] border-b-2 border-[#E53935]" : "text-slate-400"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={`flex-1 p-5 lg:p-8 border-r border-slate-50 max-w-[800px] mx-auto xl:mx-0 ${activeMobileTab === "Groups" ? "hidden lg:block" : "block"}`}>
           <div className="flex items-center justify-between px-2 mb-8 hidden lg:flex">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our <span className="text-[#E53935]">Groups</span></h2>
              <button 
                onClick={() => setShowCreate(!showCreate)}
                className="w-10 h-10 bg-[#E53935] text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-500/10 hover:bg-slate-900 active:scale-95 transition-all"
              >
                 <Plus size={20} className={`transition-transform ${showCreate ? "rotate-45" : ""}`} />
              </button>
           </div>

           {showCreate && (
             <div className="mb-10 p-8 bg-slate-900 text-white rounded-[2rem] animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden group">
                <div className="relative z-10">
                   <h3 className="text-xl font-bold uppercase mb-2">Create new group</h3>
                   <p className="text-[12px] font-bold text-slate-400 mb-6 uppercase tracking-normal">Start a private or public group for your people.</p>
                   <div className="flex gap-3">
                      <button onClick={() => { setShowCreate(false); alert("Group creation coming soon!"); }} className="px-6 py-3 bg-[#E53935] text-white rounded-xl font-bold text-[11px] uppercase tracking-normal shadow-lg transition-all">Start Group</button>
                      <button onClick={() => setShowCreate(false)} className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold text-[11px] uppercase tracking-normal transition-all">Discard</button>
                   </div>
                </div>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INITIAL_POSTS.map((post, i) => (
                <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl transition-all cursor-pointer group">
                   <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-normal text-[#E53935] px-3 py-1 bg-red-50 rounded-full">{post.category}</span>
                      <MoreHorizontal size={18} className="text-slate-300" />
                   </div>
                   <h4 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-[#E53935] transition-colors leading-tight">{post.topic}</h4>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-white shadow-sm">
                            <img src={`https://images.unsplash.com/photo-${1500648767791 + i * 100000}?q=80&w=64&auto=format&fit=crop`} alt="User" className="w-full h-full object-cover" />
                         </div>
                         <span className="text-xs font-bold text-slate-600">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400">
                         <div className="flex items-center gap-1.5"><MessageSquare size={14} /> <span className="text-[11px] font-bold">{post.replies}</span></div>
                         <div className="flex items-center gap-1.5"><Sparkles size={14} /> <span className="text-[11px] font-bold">{post.likes}</span></div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
      </div>

      <div className={`w-full xl:w-80 p-8 space-y-10 bg-slate-50/30 ${activeMobileTab === "Feed" ? "hidden xl:block" : "block"}`}>
          <div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-normal mb-6">Find Groups</h3>
               <div className="space-y-6">
                 {INITIAL_GROUPS.map(group => (
                    <div key={group.name} className="flex items-center justify-between group cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 text-white ${group.color}`}>
                             <group.icon size={18} />
                          </div>
                          <div>
                             <p className="text-[13px] font-bold text-slate-900 leading-none mb-1">{group.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-normal">{group.members} People</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => toggleGroup(group.name)}
                         className={`px-4 py-1.5 text-[11px] font-bold rounded-full transition-all flex items-center gap-1 ${
                           joinedGroups.includes(group.name) 
                             ? "bg-green-100 text-green-600 hover:bg-red-50 hover:text-red-500" 
                             : "bg-red-50 text-[#E53935] hover:bg-[#E53935] hover:text-white"
                         }`}
                       >
                          {joinedGroups.includes(group.name) ? <Check size={12} /> : <Plus size={12} />}
                          {joinedGroups.includes(group.name) ? "Joined" : "Join"}
                       </button>
                    </div>
                 ))}
              </div>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                 <TrendingUp size={16} className="text-[#E53935]" />
                 <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-normal">Active Members</h4>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6">People who talk most in the community get better matches.</p>
              <button onClick={() => alert("Opening Member List...")} className="w-full py-3 border border-slate-200 rounded-xl text-[11px] font-bold uppercase text-slate-400 hover:border-[#E53935] hover:text-[#E53935] transition-all">See Member List</button>
          </div>
      </div>
    </div>
  );
}
