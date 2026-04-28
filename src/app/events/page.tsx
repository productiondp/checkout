"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  TrendingUp,
  Zap,
  Clock,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { MOCK_EVENTS } from "@/data/events";
import { Event, EventTab } from "@/types/events";
import TerminalLayout from "@/components/layout/TerminalLayout";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = event.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const featuredEvents = MOCK_EVENTS.filter(e => e.isFeatured);

  return (
    <TerminalLayout
      topbarChildren={
         <div className="flex items-center gap-6">
            <div className="flex p-1 bg-[#F5F5F7] rounded-[10px] border border-black/[0.03]">
               {(["Upcoming", "Ongoing", "Past"] as EventTab[]).map(tab => (
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
            <button className="h-10 px-6 bg-black text-white rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] shadow-lg active:scale-95">
              <Plus size={14} /> Host
            </button>
         </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* SEARCH SECTION */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-[#E53935] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search meetups, venues, or topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 bg-white border border-black/[0.03] rounded-[10px] pl-16 pr-6 text-sm font-bold text-[#1D1D1F] outline-none focus:bg-white focus:border-[#E53935]/20 transition-all shadow-sm"
          />
        </div>

        {/* FEATURED SECTION */}
        <section>
          <div className="flex items-center gap-3 text-[#E53935] mb-8">
            <Zap size={20} fill="currentColor" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20">Elite Meetups</h2>
          </div>
          
          <div className="flex overflow-x-auto no-scrollbar gap-6 pb-6">
            {featuredEvents.map((event) => (
              <div key={event.id} onClick={() => router.push(`/events/${event.id}`)} className="min-w-[480px] bg-white rounded-[10px] overflow-hidden border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="h-56 relative overflow-hidden">
                  <img src={event.banner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-6 left-6"><div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-[8px] text-[8px] font-black uppercase text-[#E53935] tracking-widest">Featured</div></div>
                </div>
                <div className="p-10">
                  <div className="flex items-center gap-4 mb-4"><span className="px-3 py-1 bg-[#F5F5F7] text-black/20 rounded-[8px] text-[8px] font-black uppercase tracking-widest">{event.tags[0]}</span><div className="flex items-center gap-1.5"><TrendingUp size={12} className="text-emerald-500" /><span className="text-[10px] font-black text-black uppercase tracking-widest">{event.matchScore}% Match</span></div></div>
                  <h3 className="text-2xl font-black text-[#1D1D1F] mb-6 group-hover:text-[#E53935] transition-colors leading-tight uppercase font-outfit">{event.name}</h3>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-black/20 font-black uppercase text-[10px] tracking-widest"><Calendar size={16} />{event.date}</div>
                     <div className="flex items-center gap-3 text-black/20 font-black uppercase text-[10px] tracking-widest"><MapPin size={16} />{event.location}</div>
                  </div>
                  <div className="flex items-center justify-between mt-10 pt-8 border-t border-black/[0.03]">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-black/10" />
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">{event.attendeeCount.toLocaleString()} People</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Joining ${event.name}...`);
                        router.push('/chat');
                      }}
                      className="h-12 px-8 bg-black text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest group-hover:bg-[#E53935] transition-all"
                    >
                      Join Meetup
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN LIST */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="py-32 text-center bg-white rounded-[10px] border border-black/[0.03]">
              <div className="h-20 w-20 bg-[#F5F5F7] rounded-[10px] mx-auto flex items-center justify-center text-black/10 mb-8"><Calendar size={32} /></div>
              <h3 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit">No Meetups Found</h3>
              <p className="text-black/20 text-[11px] font-black uppercase tracking-widest mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </section>
      </div>
    </TerminalLayout>
  );
}

function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsJoining(true);
    try {
      if (!user) {
        router.push('/auth');
        return;
      }

      // Since these are MOCK events, we simulate a join
      // In a real scenario, we would use event.id to join via MeetupService
      alert(`Joining ${event.name}...`);
      setTimeout(() => {
        router.push('/chat');
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div onClick={() => router.push(`/events/${event.id}`)} className="bg-white rounded-[10px] overflow-hidden border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full">
      <div className="h-48 relative overflow-hidden">
        <img src={event.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4"><span className="text-[9px] font-black text-[#E53935] uppercase tracking-widest">{event.matchScore}% Match</span><span className="h-1 w-1 bg-black/5 rounded-full" /><span className="text-[9px] font-black text-black/20 uppercase tracking-widest">{event.tags[0]}</span></div>
        <h3 className="text-xl font-black text-[#1D1D1F] mb-6 group-hover:text-[#E53935] transition-colors leading-tight line-clamp-2 uppercase font-outfit">{event.name}</h3>
        <div className="space-y-3 mt-auto">
           <div className="flex items-center gap-3 text-black/20 font-black uppercase text-[10px] tracking-widest"><Calendar size={14} />{event.date}</div>
           <div className="flex items-center gap-3 text-black/20 font-black uppercase text-[10px] tracking-widest"><MapPin size={14} />{event.location}</div>
        </div>
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/[0.03]"><div className="flex items-center gap-2"><Users size={14} className="text-black/10" /><span className="text-[10px] font-black text-[#1D1D1F] uppercase">{event.attendeeCount.toLocaleString()}</span></div><button onClick={handleJoin} disabled={isJoining} className="h-10 px-6 bg-white border border-black/[0.08] text-black rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">{isJoining ? 'Joining...' : 'Join'}</button></div>
      </div>
    </div>
  );
}
