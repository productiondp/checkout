"use client";

export const runtime = "edge";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Search, 
  Zap, 
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Clock,
  UserPlus,
  Info,
  CheckCircle2,
  Ticket,
  Sparkles
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_EVENTS } from "@/data/events";
import TerminalLayout from "@/components/layout/TerminalLayout";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Opportunities" | "Attendees" | "About">("Opportunities");
  const [isJoined, setIsJoined] = useState(false);

  const eventId = params.id as string;
  const event = MOCK_EVENTS.find(e => e.id === eventId) || MOCK_EVENTS[0];

  return (
    <TerminalLayout
      topbarChildren={
         <div className="flex items-center gap-6">
            <button 
               onClick={() => router.push('/events')}
               className="h-10 px-4 bg-[#F5F5F7] text-black/40 rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-black transition-all"
            >
               <ArrowLeft size={14} /> Back
            </button>
            <div className="flex p-1 bg-[#F5F5F7] rounded-[10px] border border-black/[0.03]">
               {(["Opportunities", "Attendees", "About"] as const).map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                     "px-6 h-9 rounded-[8px] text-[10px] font-black uppercase tracking-widest transition-all relative",
                     activeTab === tab ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
                   )}
                 >
                   {tab}
                 </button>
               ))}
            </div>
         </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* HERO AREA */}
        <div className="bg-white rounded-[20px] overflow-hidden border border-black/[0.03] shadow-sm relative">
           <div className="h-[300px] w-full relative">
              <img src={event.banner} className="w-full h-full object-cover grayscale" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                 <div>
                    <div className="flex items-center gap-3 mb-4">
                       <div className="px-3 py-1 bg-[#E53935] text-white text-[8px] font-black uppercase tracking-widest rounded-full">Live Meetup</div>
                       <div className="flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                          <TrendingUp size={14} /> {event.matchScore}% Match
                       </div>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-white uppercase font-outfit leading-none mb-6">{event.name}</h1>
                    <div className="flex flex-wrap items-center gap-8 text-white/60">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Calendar size={16} />{event.date}</div>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Clock size={16} />{event.time}</div>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><MapPin size={16} />{event.location}</div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-3 min-w-[200px]">
                    <button 
                      onClick={() => setIsJoined(!isJoined)}
                      className={cn(
                        "h-16 px-10 rounded-[10px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95",
                        isJoined ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-[#E53935] hover:text-white"
                      )}
                    >
                      {isJoined ? <><CheckCircle2 size={20} /> RSVP'd</> : <><Ticket size={20} /> Join</>}
                    </button>
                    <p className="text-[8px] font-black text-white/20 text-center uppercase tracking-widest">{event.attendeeCount.toLocaleString()} Attending</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-12">
              {activeTab === "Opportunities" && (
                <>
                  <div className="flex items-center justify-between">
                     <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20">Live Board</h2>
                     <button className="h-10 px-6 bg-black text-white rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all"><Plus size={14} /> Add Post</button>
                  </div>
                  <div className="py-20 text-center bg-[#F5F5F7] rounded-[10px] border border-black/[0.02]">
                     <Zap size={40} className="mx-auto text-black/5 mb-4" />
                     <p className="text-black/20 text-[10px] font-black uppercase tracking-widest">No live posts found.</p>
                  </div>
                </>
              )}

              {activeTab === "About" && (
                <div className="space-y-12 bg-white p-12 rounded-[10px] border border-black/[0.03]">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#E53935] mb-6">Overview</h3>
                    <p className="text-2xl font-black text-black uppercase font-outfit leading-relaxed italic">"{event.description}"</p>
                  </div>
                  {event.agenda && (
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#E53935] mb-6">Agenda</h3>
                      <div className="space-y-6">
                        {event.agenda.map((item, i) => (
                          <div key={i} className="flex items-start gap-6 group">
                            <div className="h-10 w-10 bg-[#F5F5F7] rounded-[8px] flex items-center justify-center text-[10px] font-black text-black shrink-0">{i+1}</div>
                            <div className="pt-2"><p className="text-[14px] font-black text-black uppercase mb-1">{item}</p><p className="text-[9px] font-black text-black/20 uppercase tracking-widest">Primary Node • Live</p></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
           </div>
           <aside className="space-y-10">
              <div className="bg-black p-10 rounded-[20px] text-white relative overflow-hidden group shadow-2xl">
                 <Zap size={180} className="absolute -right-16 -bottom-16 text-white/[0.03] group-hover:-rotate-12 transition-transform duration-[5s]" />
                 <div className="relative z-10">
                    <h3 className="text-[9px] font-black uppercase text-[#E53935] mb-6 tracking-widest">Network Optimization</h3>
                    <p className="text-[11px] font-bold text-white/40 uppercase leading-relaxed mb-10">We've identified 12 high-authority nodes attending this meetup that match your current business requirements.</p>
                    <button className="w-full h-12 bg-[#E53935] rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">Get Itinerary</button>
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </TerminalLayout>
  );
}
