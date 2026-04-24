"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Search, 
  Zap, 
  MessageSquare,
  TrendingUp,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Clock,
  UserPlus,
  Info,
  ArrowUpRight,
  CheckCircle2,
  Ticket,
  Sparkles
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_EVENTS } from "@/data/events";
const MOCK_POSTS: any[] = [];
const MOCK_MEMBERS: any[] = [];

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Opportunities" | "Attendees" | "About">("Opportunities");
  const [isJoined, setIsJoined] = useState(false);

  const eventId = params.id as string;
  const event = MOCK_EVENTS.find(e => e.id === eventId) || MOCK_EVENTS[0];

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* TOP BANNER */}
      <div className="bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="h-[400px] w-full relative">
           <img src={event.banner} className="w-full h-full object-cover" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#292828] via-[#292828]/60 to-transparent" />
           <button 
             onClick={() => router.push('/events')}
             className="absolute top-10 left-10 h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/40 transition-all"
           >
             <ArrowLeft size={20} />
           </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-32 relative z-10 pb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="px-4 py-1.5 bg-[#E53935] text-white text-[10px] font-black uppercase rounded-lg shadow-2xl tracking-widest">Live Summit</div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-white border border-white/20 text-[10px] font-bold uppercase">
                   <TrendingUp size={14} className="text-emerald-400" />
                   {event.matchScore}% Structure Match
                </div>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-8">{event.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-white/80">
                 <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-[#E53935]" />
                    <span className="text-sm font-black uppercase tracking-tight">{event.date}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Clock size={20} className="text-[#E53935]" />
                    <span className="text-sm font-black uppercase tracking-tight">{event.time}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-[#E53935]" />
                    <span className="text-sm font-black uppercase tracking-tight">{event.location}</span>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsJoined(!isJoined)}
                className={cn(
                  "h-16 sm:h-20 px-8 sm:px-12 rounded-2xl flex items-center justify-center gap-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all shadow-4xl active:scale-95 overflow-hidden relative",
                  isJoined ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-white text-[#292828] hover:bg-[#E53935] hover:text-white"
                )}
              >
                {isJoined ? (
                  <><CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> RSVP Confirmed</>
                ) : (
                  <><Ticket className="w-5 h-5 sm:w-6 sm:h-6" /> Join Event</>
                )}
              </button>
              <div className="flex items-center justify-center gap-3 text-white/40">
                 <Users size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{event.attendeeCount.toLocaleString()} Nodes Attending</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-8 lg:gap-12 w-max sm:w-auto">
            {(["Opportunities", "Attendees", "About"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "h-16 relative text-xs font-black uppercase tracking-[0.3em] transition-all",
                  activeTab === tab ? "text-[#E53935]" : "text-slate-400 hover:text-[#292828]"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E53935] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2">
            {activeTab === "Opportunities" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-xl font-black text-[#292828] uppercase tracking-tight">Live Opportunity Feed</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time mandates from attendees</p>
                  </div>
                  <button className="h-12 px-8 bg-[#292828] text-white rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-xl active:scale-95">
                    <Plus size={16} /> Post Intent
                  </button>
                </div>
                
                {MOCK_POSTS.map(post => (
                  <OpportunityCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {activeTab === "Attendees" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 mb-10 flex items-center gap-4 shadow-sm">
                  <Search size={20} className="text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Search attendees by mandate, role or company..." 
                    className="flex-1 bg-transparent outline-none text-sm font-bold text-[#292828]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_MEMBERS.map(member => (
                    <AttendeeCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "About" && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-6">Summit Overview</h3>
                  <p className="text-2xl font-bold text-[#292828] leading-relaxed italic">
                    "{event.description}"
                  </p>
                </div>

                {event.agenda && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-6">Execution Agenda</h3>
                    <div className="space-y-6">
                      {event.agenda.map((item, i) => (
                        <div key={i} className="flex items-start gap-6 group">
                          <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-[10px] font-black text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all shrink-0">
                             {i+1}
                          </div>
                          <div className="pt-2">
                             <p className="text-sm font-black text-[#292828] uppercase tracking-tight mb-1">{item}</p>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Hall • 10:00 AM</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#292828]">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Host</p>
                      <h4 className="text-sm font-black text-[#292828] uppercase tracking-tight">{event.organizer}</h4>
                    </div>
                  </div>
                  <button className="h-12 px-6 bg-[#292828]/5 text-[#292828] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#292828] hover:text-white transition-all">Download Info Kit</button>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-10">
            {/* SMART MATCHES */}
            <div className="bg-[#292828] p-10 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
              <Zap size={180} className="absolute -right-16 -bottom-16 text-white/[0.03] group-hover:-rotate-12 transition-transform duration-[5s]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <Sparkles size={18} className="text-[#E53935]" />
                   <h3 className="text-[11px] font-black uppercase tracking-widest">Pre-Event Matching</h3>
                </div>
                <p className="text-[11px] font-medium text-white/50 uppercase leading-relaxed mb-10">
                  Based on your business intent, we've identified 12 strategic nodes you must connect with at this summit.
                </p>
                <div className="space-y-4 mb-10">
                   {MOCK_MEMBERS.slice(0, 2).map(m => (
                     <div key={m.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <img src={m.avatar} className="h-10 w-10 rounded-xl" alt="" />
                        <div>
                           <p className="text-[11px] font-black text-white uppercase leading-none mb-1">{m.name}</p>
                           <p className="text-[9px] font-bold text-emerald-400 uppercase">{m.matchScore}% Structural Match</p>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="w-full h-12 bg-[#E53935] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#292828] transition-all">Optimize Itinerary</button>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#292828]">Trending Mandates</h3>
              <div className="space-y-4">
                {MOCK_POSTS.slice(0, 3).map(post => (
                  <div key={post.id} className="p-6 bg-white border border-slate-100 rounded-3xl group cursor-pointer hover:border-[#E53935]/20 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-red-50 text-[#E53935] rounded-lg">{post.type}</span>
                      <span className="text-[10px] font-bold text-slate-300">{post.timestamp}</span>
                    </div>
                    <p className="text-sm font-bold text-[#292828] leading-snug line-clamp-2 mb-4">"{post.description}"</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#E53935] group-hover:translate-x-2 transition-transform">
                      View Mandate <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ post }: { post: any }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 sm:p-8 text-right">
        <p className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1 sm:mb-2">Structural Match</p>
        <p className="text-xl sm:text-3xl font-black text-[#292828] tracking-tighter tabular-nums group-hover:text-[#E53935] transition-colors">{post.matchScore}%</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className={cn(
          "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider",
          post.type === "Hiring" ? "bg-blue-50 text-blue-600" :
          post.type === "Leads" ? "bg-emerald-50 text-emerald-600" :
          post.type === "Partnership" ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"
        )}>
          {post.type}
        </span>
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{post.timestamp}</span>
      </div>

      <h3 className="text-2xl font-bold text-[#292828] leading-relaxed mb-10 pr-24 line-clamp-3">
        "{post.description}"
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-slate-50">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
             <img src={`https://i.pravatar.cc/150?u=${post.author}`} alt="" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Author</p>
            <h4 className="text-sm font-black text-[#292828] uppercase tracking-tight">{post.author}</h4>
          </div>
        </div>

        <button className="h-12 px-8 bg-[#292828] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-lg active:scale-95">
           Connect & Execute
        </button>
      </div>
    </div>
  );
}

function AttendeeCard({ member }: { member: any }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-md border-2 border-white relative shrink-0">
          <img src={member.avatar} className="w-full h-full object-cover" alt="" />
          <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div>
          <h4 className="text-lg font-black text-[#292828] group-hover:text-[#E53935] transition-colors uppercase tracking-tight leading-tight mb-1">{member.name}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
            <Briefcase size={12} /> {member.role} @ {member.company}
          </p>
          <div className="flex items-center gap-2 mt-3">
             <TrendingUp size={12} className="text-emerald-500" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{member.matchScore}% Structural Match</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button className="h-10 w-10 bg-slate-50 text-[#292828] rounded-xl flex items-center justify-center hover:bg-[#292828] hover:text-white transition-all shadow-sm">
          <UserPlus size={18} />
        </button>
        <button className="h-10 w-10 bg-slate-50 text-[#292828] rounded-xl flex items-center justify-center hover:bg-[#E53935] hover:text-white transition-all shadow-sm">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
