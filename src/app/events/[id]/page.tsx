"use client";

export const runtime = "edge";

import React, { useState, useEffect } from "react";
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
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_AVATAR } from "@/utils/constants";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Opportunities" | "Attendees" | "About">("About");
  const [isJoined, setIsJoined] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const eventId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    async function fetchEvent() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (data) {
        setEvent({
          ...data,
          matchScore: 98,
          attendeeCount: data.attendee_count || 0,
          banner: data.banner_url || 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?q=80&w=2000'
        });
      }
      setIsLoading(false);
    }
    if (eventId) fetchEvent();
  }, [eventId]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center gap-6">
      <div className="h-12 w-12 border-4 border-white/5 border-t-[#E53935] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Event Details...</p>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center gap-6">
      <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Event Not Found</h2>
      <button onClick={() => router.push('/events')} className="text-[#E53935] text-[10px] font-black uppercase tracking-widest border-b border-[#E53935]">Back to Events</button>
    </div>
  );

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
                <div className="px-4 py-1.5 bg-[#E53935] text-white text-[10px] font-black uppercase rounded-lg shadow-2xl tracking-widest">Live Event</div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-white border border-white/20 text-[10px] font-bold uppercase">
                   <TrendingUp size={14} className="text-emerald-400" />
                   {event.matchScore}% Match
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
                    <span className="text-sm font-black uppercase tracking-tight">{event.time || '10:00 AM'}</span>
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
                 <span className="text-[10px] font-black uppercase tracking-widest">{event.attendeeCount.toLocaleString()} People Attending</span>
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
            {activeTab === "About" && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-6">Event Overview</h3>
                  <p className="text-2xl font-bold text-[#292828] leading-relaxed italic">
                    "{event.description}"
                  </p>
                </div>

                <div>
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-6">Ecosystem Impact</h3>
                   <div className="space-y-6">
                      {[
                        "High-authority networking with verified founders.",
                        "Direct access to strategic local opportunities.",
                        "Neural match prioritization for all attendees.",
                        "Outcome-driven session architecture."
                      ].map((rule, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="h-6 w-6 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-black text-[#292828] shrink-0">{i+1}</div>
                          <p className="text-sm font-bold text-slate-500 uppercase leading-relaxed">{rule}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#292828]">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Organizer</p>
                      <h4 className="text-sm font-black text-[#292828] uppercase tracking-tight">{event.organizer || 'Checkout Verified'}</h4>
                    </div>
                  </div>
                  <button className="h-12 px-6 bg-[#292828]/5 text-[#292828] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#292828] hover:text-white transition-all">Download Info Kit</button>
                </div>
              </div>
            )}

            {(activeTab === "Opportunities" || activeTab === "Attendees") && (
              <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Live data sync for {activeTab} is currently being established...</p>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-10">
            <div className="bg-[#292828] p-10 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
              <Zap size={180} className="absolute -right-16 -bottom-16 text-white/[0.03] group-hover:-rotate-12 transition-transform duration-[5s]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <Sparkles size={18} className="text-[#E53935]" />
                   <h3 className="text-[11px] font-black uppercase tracking-widest">Neural Matching</h3>
                </div>
                <p className="text-[11px] font-medium text-white/50 uppercase leading-relaxed mb-10">
                  We've mapped your structural gaps against the attendee list for optimal networking priority.
                </p>
                <button className="w-full h-12 bg-[#E53935] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#292828] transition-all">View Matches</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
