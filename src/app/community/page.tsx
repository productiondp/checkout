"use client";
import React, { useState, useRef } from "react";
import { Users, MessageSquare, ArrowRight, ArrowLeft, Send, Sparkles, Building, Briefcase, List as ListIcon, LayoutGrid, Plus } from "lucide-react";
import { DUMMY_PROFILES } from "@/lib/dummyData";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NETWORK_GROUPS = [
   { 
     id: 1, name: "Technopark Logistics Node", members: "1.2k", topic: "Last-mile optimization", color: "bg-blue-500", 
     threadTitle: "How are we handling the new interstate shipping tariffs in the logistics sector?", 
     tags: ["Supply Chain", "Tax", "Trivandrum"],
     replies: [
        { id: 101, user: DUMMY_PROFILES[0], text: "We're routing via the new MSME corridor to avoid the 4% hike.", time: "2h ago" },
        { id: 102, user: DUMMY_PROFILES[3], text: "Has anyone tried consolidating freights with other local hubs? Might save up to 15%.", time: "1h ago" }
     ],
     suggestions: DUMMY_PROFILES.slice(10, 14)
   },
   { 
     id: 2, name: "MSME Scale Hub", members: "4.8k", topic: "Growth capital & tenders", color: "bg-orange-500", 
     threadTitle: "Are the new government backing scheme limits for 2026 realistic?", 
     tags: ["Funding", "Policy", "Scaling"],
     replies: [
        { id: 201, user: DUMMY_PROFILES[5], text: "The capital cap is fine, but the audit requirements are extremely aggressive for seed-stage.", time: "5h ago" }
     ],
     suggestions: DUMMY_PROFILES.slice(20, 24)
   },
   { 
     id: 3, name: "Manufacturing Matrix", members: "842", topic: "Raw material bulk buy", color: "bg-[#E53935]", 
     threadTitle: "Supplier fallback plan for Q3 aluminum shortage?", 
     tags: ["Manufacturing", "Procurement"],
     replies: [],
     suggestions: DUMMY_PROFILES.slice(30, 34)
   },
   { 
     id: 4, name: "Creative Industries Cluster", members: "2.1k", topic: "UI/UX & Branding", color: "bg-purple-500", 
     threadTitle: "Integrating native 3D objects in standard Next.js marketing pages.", 
     tags: ["Engineering", "Design", "Tech"],
     replies: [
        { id: 401, user: DUMMY_PROFILES[8], text: "Three.js with React Three Fiber is the only stable way right now. Don't use raw WebGL.", time: "10m ago" }
     ],
     suggestions: DUMMY_PROFILES.slice(40, 44)
   }
];

export default function CommunityPage() {
  const [activeGroup, setActiveGroup] = useState<typeof NETWORK_GROUPS[0] | null>(null);
  const [replyText, setReplyText] = useState("");
  const [groups, setGroups] = useState(NETWORK_GROUPS);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreating, setIsCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", topic: "", tags: "" });
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);

  const handleCreateGroup = () => {
      if (!newGroup.name.trim() || !newGroup.topic.trim()) return;
      const created = {
          id: Date.now(),
          name: newGroup.name,
          members: "1",
          topic: newGroup.topic,
          color: "bg-slate-900",
          threadTitle: "Welcome, introduce your objectives here...",
          tags: newGroup.tags.split(',').map(t => t.trim()).filter(Boolean),
          replies: [],
          suggestions: DUMMY_PROFILES.slice(1, 5)
      };
      setGroups([created, ...groups]);
      setIsCreating(false);
      setNewGroup({ name: "", topic: "", tags: "" });
  };

  const handleReply = () => {
     if (!replyText.trim() || !activeGroup) return;
     
     const updatedGroups = groups.map(g => {
        if (g.id === activeGroup.id) {
           const newReply: any = {
              id: Date.now(),
              user: { ...DUMMY_PROFILES[99], name: "You" },
              text: replyText,
              time: "Just now",
              subReplies: []
           };

           if (replyToId) {
              const updatedReplies = g.replies.map((r: any) => {
                 if (r.id === replyToId) {
                    return { ...r, subReplies: [...(r.subReplies || []), newReply] };
                 }
                 return r;
              });
              return { ...g, replies: updatedReplies };
           } else {
              return { ...g, replies: [...g.replies, newReply] };
           }
        }
        return g;
     });
     
     setGroups(updatedGroups);
     setActiveGroup(updatedGroups.find(g => g.id === activeGroup.id) || null);
     setReplyText("");
     setReplyToId(null);
  };

  if (activeGroup) {
     return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFF]">
           {/* THREAD VIEW MAIN */}
           <div className="flex-1 lg:max-w-4xl border-r border-[#292828]/10 bg-white min-h-screen pb-20 lg:pb-6">
              <div className="p-4 lg:p-6 border-b border-[#292828]/5 sticky top-0 bg-white/95 backdrop-blur-xl z-30">
                 <button onClick={() => setActiveGroup(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#292828]/40 hover:text-[#E53935] transition-colors mb-4">
                    <ArrowLeft size={14} /> Back
                 </button>
                 <div className="flex items-center gap-4 mb-4">
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 shrink-0", activeGroup.color)}>
                       <Users size={24} />
                    </div>
                    <div>
                       <h1 className="text-3xl font-black text-[#292828] leading-tight">{activeGroup.name}</h1>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-[#E53935] uppercase tracking-widest">{activeGroup.members} Live Capacity</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeGroup.topic}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* OP POST */}
              <div className="p-4 lg:p-6 border-b-2 border-[#292828]/5">
                 <div className="flex gap-2 mb-3">
                    {activeGroup.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase tracking-widest">{tag}</span>
                    ))}
                 </div>
                 <h2 className="text-2xl font-black text-[#292828] leading-tight mb-6">"{activeGroup.threadTitle}"</h2>
                 
                 <div className="bg-[#292828]/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center">
                    <div className="flex-1 w-full relative">
                       {replyToId && (
                          <div className="absolute -top-10 left-0 bg-[#E53935] text-white px-3 py-1 rounded-t-lg text-[9px] font-black uppercase flex items-center gap-2">
                             Replying to comment <button onClick={() => setReplyToId(null)} className="hover:underline">Cancel</button>
                          </div>
                       )}
                       <input 
                         ref={replyInputRef}
                         type="text" 
                         value={replyText}
                         onChange={(e) => setReplyText(e.target.value)}
                         placeholder={replyToId ? "Write a reply..." : "Reply to this post..."} 
                         className={cn(
                           "w-full bg-white h-12 rounded-xl px-5 text-sm font-bold text-[#292828] outline-none shadow-sm transition-all border border-transparent",
                           replyToId ? "rounded-tl-none border-[#E53935] ring-4 ring-[#E53935]/5" : "focus:border-[#E53935]/50"
                         )}
                       />
                    </div>
                    <button 
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className="h-12 px-8 w-full sm:w-auto bg-[#E53935] text-white rounded-xl text-xs font-black uppercase shadow-xl hover:bg-[#292828] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                       {replyToId ? "Reply" : "Post"} <Send size={16} />
                    </button>
                 </div>
              </div>

              {/* REPLIES */}
              <div className="p-4 lg:p-6 space-y-4">
                 <h3 className="text-xs font-black uppercase tracking-widest text-[#292828]/40 mb-4">{activeGroup.replies.length} Responses</h3>
                  {activeGroup.replies.map((reply: any) => (
                    <div key={reply.id} className="space-y-4">
                       <div className="flex gap-4 relative group">
                          <div className="absolute left-6 top-14 bottom-[-32px] w-0.5 bg-[#292828]/5 group-last:hidden" />
                          <Link href={`/profile/${reply.user.id}`} className="h-12 w-12 rounded-xl overflow-hidden shrink-0 shadow-md border-2 border-transparent hover:border-[#E53935] transition-all relative z-10 bg-white">
                             <img src={reply.user.avatar} className="w-full h-full object-cover" alt="" />
                          </Link>
                          <div className="flex-1 bg-white p-4 rounded-2xl border border-[#292828]/10 shadow-sm hover:border-[#E53935]/20 transition-all">
                             <div className="flex items-center justify-between mb-2">
                                <div>
                                   <Link href={`/profile/${reply.user.id}`} className="text-base font-black text-[#292828] hover:text-[#E53935] transition-colors">{reply.user.name}</Link>
                                   <p className="text-xs font-bold text-slate-500 uppercase">{reply.user.role} • {reply.user.company}</p>
                                </div>
                                <span className="text-xs font-bold text-[#292828]/30 uppercase">{reply.time}</span>
                             </div>
                             <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">{reply.text}</p>
                             <button 
                                onClick={(e) => {
                                   e.stopPropagation();
                                   setReplyToId(reply.id);
                                   window.scrollTo({ top: 0, behavior: 'smooth' });
                                   setTimeout(() => replyInputRef.current?.focus(), 500);
                                }}
                                className="text-[10px] font-black uppercase text-[#E53935] hover:underline flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg"
                             >
                                <MessageSquare size={12} /> Reply to this
                             </button>
                          </div>
                       </div>
                       
                       {/* Sub Replies */}
                       {reply.subReplies?.map((sub: any) => (
                          <div key={sub.id} className="ml-16 flex gap-3 relative group">
                             <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-slate-100" />
                             <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                <img src={sub.user.avatar} className="w-full h-full object-cover" alt="" />
                             </div>
                             <div className="flex-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center justify-between mb-1">
                                   <p className="text-xs font-black text-[#292828]">{sub.user.name}</p>
                                   <span className="text-[10px] font-bold text-slate-400 capitalize">{sub.time}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">{sub.text}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                  ))}
                 
                 {activeGroup.replies.length === 0 && (
                    <div className="py-20 text-center">
                       <MessageSquare size={32} className="mx-auto text-slate-300 mb-4" />
                       <p className="text-sm font-bold text-slate-400">No responses yet. Be the first to advise.</p>
                    </div>
                 )}
              </div>
           </div>

           {/* SMART RECS RIGHT RAIL */}
           <aside className="hidden lg:block w-[380px] p-8 border-l border-[#292828]/10 bg-slate-50/50">
              <div className="sticky top-8">
                 <div className="flex items-center gap-2 mb-6 text-[#E53935]">
                    <Sparkles size={18} />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-[#292828]">People to meet</h3>
                 </div>
                 <p className="text-xs font-medium text-slate-500 mb-8">Profiles structurally matched to this thread's domain logic.</p>
                 
                 <div className="space-y-4">
                    {activeGroup.suggestions.map(prof => (
                       <div key={prof.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-[#E53935]/30 transition-all hover:shadow-xl">
                          <div className="flex items-center gap-4">
                             <Link href={`/profile/${prof.id}`} className="h-10 w-10 rounded-xl overflow-hidden shadow-sm shrink-0">
                                <img src={prof.avatar} className="w-full h-full object-cover" alt="" />
                             </Link>
                             <div>
                                <Link href={`/profile/${prof.id}`} className="text-xs font-black text-[#292828] group-hover:text-[#E53935] transition-colors line-clamp-1">{prof.name}</Link>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-slate-400 mt-0.5">
                                   <Briefcase size={10} /> {prof.company}
                                </div>
                             </div>
                          </div>
                          <div className="h-8 w-8 bg-[#292828]/5 rounded-lg flex items-center justify-center text-[#E53935] opacity-0 group-hover:opacity-100 transition-opacity">
                             <ArrowRight size={14} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </aside>
        </div>
     );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 py-6 pb-20 lg:pb-6 lg:px-10 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
           <h1 className="text-4xl font-black text-[#292828] mb-2 leading-tight">Groups</h1>
           <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2 block">Join groups and talk to people in your industry.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
           <button onClick={() => setIsCreating(true)} className="h-12 px-6 bg-[#E53935] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase shadow-xl hover:bg-[#292828] active:scale-95 transition-all">
              New Group <Plus size={16} />
           </button>
           <div className="flex items-center gap-1 bg-[#292828]/5 p-1 rounded-xl">
              <button onClick={() => setViewMode("list")} className={cn("h-10 px-4 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase transition-all", viewMode === "list" ? "bg-white text-[#292828] shadow-sm tracking-widest" : "text-[#292828]/40 hover:text-[#292828] tracking-widest")}>
                 <ListIcon size={14} /> List
              </button>
              <button onClick={() => setViewMode("grid")} className={cn("h-10 px-4 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase transition-all", viewMode === "grid" ? "bg-white text-[#292828] shadow-sm tracking-widest" : "text-[#292828]/40 hover:text-[#292828] tracking-widest")}>
                 <LayoutGrid size={14} /> Grid
              </button>
           </div>
        </div>
      </div>
      
      {isCreating ? (
         <div className="max-w-2xl bg-white border border-[#292828]/10 rounded-[3rem] p-10 shadow-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setIsCreating(false)} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#292828]/40 hover:text-[#E53935] transition-colors mb-8">
               <ArrowLeft size={14} /> Cancel Creation
            </button>
            <h2 className="text-3xl font-black text-[#292828] uppercase mb-8">Create a <span className="text-[#E53935]">Group</span>.</h2>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Cluster Name</label>
                  <input type="text" value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} placeholder="e.g. Export Logistics Strategy" className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Primary Topic</label>
                  <input type="text" value={newGroup.topic} onChange={e => setNewGroup({...newGroup, topic: e.target.value})} placeholder="e.g. International Shipping Frameworks" className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Tags (Comma Separated)</label>
                  <input type="text" value={newGroup.tags} onChange={e => setNewGroup({...newGroup, tags: e.target.value})} placeholder="e.g. Scaling, Taxes, Supply Chain" className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all" />
               </div>
               
               <button onClick={handleCreateGroup} disabled={!newGroup.name || !newGroup.topic} className="w-full h-16 mt-4 bg-[#292828] text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-[#E53935] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  Create Group <ArrowRight size={18} />
               </button>
            </div>
         </div>
      ) : (
        <div className={cn(
         "transition-all duration-500",
         viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4" : "flex flex-col gap-4"
      )}>
        {groups.map(group => (
          <div key={group.id} className={cn(
             "p-5 lg:p-6 bg-white border border-[#292828]/10 hover:shadow-3xl hover:border-[#E53935]/30 transition-all duration-500 group cursor-pointer",
             viewMode === "grid" ? "rounded-[2.5rem] flex flex-col h-full" : "rounded-[2rem] flex flex-col lg:flex-row items-center gap-4 lg:gap-6 justify-between"
          )} onClick={() => setActiveGroup(group)}>
             
             <div className={cn("flex items-center gap-5", viewMode === "list" && "w-full lg:w-1/4 shrink-0")}>
                   <div className={cn("h-16 w-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-slate-200 shrink-0", group.color)}>
                      <Users size={24} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold text-[#292828] mb-1 group-hover:text-[#E53935] transition-colors">{group.name}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{group.members} Capacity • Regional</p>
                   </div>
                </div>
             <div className={cn("p-4 lg:p-5 bg-[#292828]/5 rounded-2xl border border-transparent group-hover:bg-[#E53935]/5 group-hover:border-[#E53935]/10 transition-all relative overflow-hidden", viewMode === "grid" ? "mb-4 flex-1 mt-4" : "flex-1 w-full")}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <MessageSquare size={60} className="text-[#292828] -translate-y-2 translate-x-2 rotate-12" />
                </div>
                <div className="flex items-center gap-2 mb-2 lg:mb-2 relative z-10">
                   <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                   <p className="text-xs font-black text-[#292828] uppercase tracking-widest">Active Thread</p>
                </div>
                <p className={cn("font-black text-[#292828] leading-snug relative z-10", viewMode === "grid" ? "text-lg" : "text-xl line-clamp-2")}>"{group.threadTitle}"</p>
             </div>
             
             <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 w-full", viewMode === "list" && "lg:w-1/4 shrink-0")}>
                <div className={cn("flex items-center gap-2", viewMode === "list" && "hidden lg:flex")}>
                   <div className="flex -space-x-2">
                      <img src={DUMMY_PROFILES[0].avatar} className="h-8 w-8 rounded-full border-2 border-white" alt=""/>
                      <img src={DUMMY_PROFILES[1].avatar} className="h-8 w-8 rounded-full border-2 border-white" alt=""/>
                   </div>
                   <span className="text-xs font-bold text-slate-500 uppercase">{group.replies.length} Replies</span>
                </div>
                <button className="w-full h-12 bg-[#292828] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest group-hover:bg-[#E53935] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 px-6">
                   Open <ArrowRight size={14} className={cn("transition-transform group-hover:translate-x-1", viewMode === "list" && "hidden lg:block")} />
                </button>
             </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
