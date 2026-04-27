"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  Zap,
  Ticket,
  Clock,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_EVENTS } from "@/data/events";
import { Event, EventTab } from "@/types/events";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = event.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const featuredEvents = MOCK_EVENTS.filter(e => e.isFeatured);

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 pt-12 pb-10 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#292828]  mb-3">Meetups</h1>
            <p className="text-slate-200 font-bold text-base sm:text-lg uppercase ">Where opportunities happen in real time</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="h-14 px-8 bg-[#292828] text-white rounded-lg flex items-center gap-3 text-xs font-black uppercase  hover:bg-[#E53935] transition-all shadow-xl active:scale-95 shrink-0">
              <Plus size={18} /> Host Meetup
            </button>
          </div>
        </div>
      </header>

      {/* CONTROLS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Search events, industry, or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 bg-white border border-slate-100 rounded-lg pl-16 pr-6 text-sm font-bold text-[#292828] focus:border-[#E53935] outline-none transition-all shadow-sm"
            />
          </div>
          <button className="h-16 px-6 bg-white border border-slate-100 text-[#292828] rounded-lg flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* FEATURED MEETUPS */}
      <section className="mt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
          <div className="flex items-center gap-3 text-[#E53935]">
            <Zap size={20} fill="currentColor" />
            <h2 className="text-xs font-black uppercase ">Featured Meetups</h2>
          </div>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-6 px-6 lg:px-10 pb-10 max-w-7xl mx-auto">
          {featuredEvents.map((event) => (
            <div 
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="min-w-[300px] sm:min-w-[360px] md:min-w-[480px] bg-white rounded-lg sm:rounded-lg overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
            >
              <div className="h-56 relative overflow-hidden">
                <img src={event.banner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#292828]/60 to-transparent" />
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-[#E53935] shadow-xl ">Featured</div>
                </div>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-slate-50 text-slate-200 rounded-lg text-[9px] font-black uppercase">{event.tags[0]}</span>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-[#292828] uppercase">{event.matchScore}% Match</span>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-[#292828] mb-6 group-hover:text-[#E53935] transition-colors leading-tight">{event.name}</h3>
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-slate-200">
                      <Calendar size={16} />
                      <span className="text-xs font-bold uppercase ">{event.date}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-200">
                      <MapPin size={16} />
                      <span className="text-xs font-bold uppercase  line-clamp-1">{event.location}</span>
                   </div>
                </div>
                <div className="flex items-center justify-between mt-10 pt-8 border-t border-slate-50">
                   <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-300" />
                      <span className="text-xs font-black text-[#292828] uppercase">{event.attendeeCount.toLocaleString()} People</span>
                   </div>
                   <button className="h-12 px-8 bg-[#292828] text-white rounded-lg text-[10px] font-black uppercase  group-hover:bg-[#E53935] transition-all">Join Meetup</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EVENT LIST */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 mt-12">
        <div className="flex items-center gap-4 mb-12 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {(["Upcoming", "Ongoing", "Past"] as EventTab[]).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "h-14 px-8 text-[11px] font-black uppercase  transition-all relative shrink-0",
                activeTab === tab ? "text-[#E53935]" : "text-slate-200 hover:text-[#292828]"
              )}
            >
              {tab} Meetups
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E53935] rounded-t-full" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-32 text-center bg-white rounded-lg border border-slate-50 shadow-sm">
            <div className="h-24 w-24 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-200 mb-8">
              <Calendar size={48} />
            </div>
            <h3 className="text-2xl font-black text-[#292828] uppercase ">No Meetups Found</h3>
            <p className="text-slate-200 font-bold mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/events/${event.id}`)}
      className="bg-white rounded-lg overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="h-48 relative overflow-hidden">
        <img src={event.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#292828]/40 to-transparent" />
        <div className="absolute top-4 right-4">
           <div className="h-10 w-10 bg-white/95 backdrop-blur-md rounded-lg flex items-center justify-center text-[#E53935] shadow-lg border border-white/10">
              <TrendingUp size={18} />
           </div>
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
           <span className="text-[10px] font-black text-[#E53935] uppercase ">{event.matchScore}% Match</span>
           <span className="h-1 w-1 bg-slate-200 rounded-full" />
           <span className="text-[10px] font-bold text-slate-200 uppercase ">{event.tags[0]}</span>
        </div>
        <h3 className="text-2xl font-black text-[#292828] mb-6 group-hover:text-[#E53935] transition-colors leading-tight line-clamp-2">{event.name}</h3>
        
        <div className="space-y-3 mt-auto">
           <div className="flex items-center gap-3 text-slate-200">
              <Calendar size={14} />
              <span className="text-[11px] font-bold uppercase ">{event.date}</span>
           </div>
           <div className="flex items-center gap-3 text-slate-200">
              <MapPin size={14} />
              <span className="text-[11px] font-bold uppercase  line-clamp-1">{event.location}</span>
           </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
           <div className="flex items-center gap-2">
              <Users size={14} className="text-slate-300" />
              <span className="text-[11px] font-black text-[#292828] uppercase">{event.attendeeCount.toLocaleString()}</span>
           </div>
           <button className="h-10 px-6 bg-white border border-slate-200 text-[#292828] rounded-lg text-[10px] font-black uppercase  hover:bg-[#292828] hover:text-white hover:border-[#292828] transition-all">Join</button>
        </div>
      </div>
    </div>
  );
}
