"use client";

import React, { useState } from "react";
import { Calendar, MapPin, ArrowRight, Star, Clock, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Events() {
  const [requested, setRequested] = useState(false);
  const [rsvped, setRsvped] = useState<number[]>([]);

  const upcomingEvents = [
    {
      id: 1,
      title: "Trivandrum Tech Mixer",
      date: "Oct 24, 2023",
      time: "6:00 PM",
      location: "Technopark Phase III",
      attendees: "120+",
      icon: "⚡",
      category: "Networking",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Creator Economy Workshop",
      date: "Nov 02, 2023",
      time: "10:30 AM",
      location: "B-Hub, Trivandrum",
      attendees: "45",
      icon: "📸",
      category: "Skills",
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="flex flex-col xl:flex-row min-h-full">
      <div className="flex-1 p-8 border-r border-[#F1F3F4] max-w-[800px] mx-auto xl:mx-0">
           <div className="flex items-center justify-between px-2 mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Events</h2>
              <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                 <Plus size={20} />
              </button>
           </div>

           <div className="bg-white rounded-2xl overflow-hidden border border-[#F1F3F4] group mb-8">
              <div className="h-64 relative overflow-hidden">
                 <img 
                    src="/images/hero-event.jpg" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt="Event Hero" 
                 />
                 <div className="absolute inset-0 bg-black/40"></div>
                 <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <Star size={12} className="text-white fill-white" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Spotlight</span>
                 </div>
              </div>
              <div className="p-8">
                 <h3 className="text-2xl font-black text-[#202124] mb-3 group-hover:text-primary transition-colors italic uppercase">Checkout Founders Night</h3>
                 <p className="text-[#5F6368] text-[14px] leading-relaxed mb-8 max-w-xl font-medium">
                    Connect with 50+ local founders in an intimate setting at Vizhinjam.
                 </p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 text-[#202124] bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <Calendar size={18} className="text-primary" />
                       <span className="text-[13px] font-bold">Oct 28 • 19:00</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#202124] bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <MapPin size={18} className="text-primary" />
                       <span className="text-[13px] font-bold">Trivandrum Yacht Club</span>
                    </div>
                 </div>

                 <button 
                   onClick={() => setRequested(!requested)}
                   className={cn(
                     "w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2",
                     requested 
                       ? "bg-green-100 text-green-600 shadow-none border border-green-200" 
                       : "bg-primary text-white hover:bg-black shadow-primary/20"
                   )}
                 >
                    {requested ? <><Check size={18} /> Request Received</> : "Request Access Pass"}
                 </button>
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-[#5F6368] uppercase tracking-[0.2em] mb-4 ml-2">Next Events</h4>
              {upcomingEvents.map((event, i) => (
                <div 
                  key={i} 
                  onClick={() => setRsvped(prev => prev.includes(event.id) ? prev.filter(id => id !== event.id) : [...prev, event.id])}
                  className="bg-white p-5 rounded-2xl border border-[#F1F3F4] flex items-center gap-5 hover:shadow-sm transition-all cursor-pointer group"
                >
                   <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:scale-105 text-white", event.color)}>
                      {event.icon}
                   </div>
                   <div className="flex-1">
                      <p className="text-[11px] font-bold text-primary mb-1 uppercase tracking-wider">{event.category}</p>
                      <h4 className="font-bold text-[#202124] text-[16px] leading-tight mb-1">{event.title}</h4>
                      <p className="text-[12px] text-[#5F6368] font-medium flex items-center gap-2">
                         <Clock size={12} /> {event.date} • {event.time}
                      </p>
                   </div>
                   <div className={cn(
                     "w-10 h-10 flex items-center justify-center rounded-full transition-all",
                     rsvped.includes(event.id) ? "bg-green-100 text-green-600" : "bg-slate-50 group-hover:bg-blue-50 group-hover:text-primary"
                   )}>
                      {rsvped.includes(event.id) ? <Check size={18} /> : <ArrowRight size={18} />}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="w-full xl:w-[360px] p-8 space-y-8 bg-[#FAFAFA]/50">
           <div className="bg-white rounded-2xl p-8 border border-[#F1F3F4] shadow-sm">
              <h4 className="text-[12px] font-black text-[#5F6368] uppercase tracking-widest mb-8">My Calendar</h4>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                       <span className="text-[10px] font-bold text-[#5F6368] uppercase">OCT</span>
                       <span className="text-lg font-black text-[#202124]">22</span>
                    </div>
                    <div className="flex-1 pt-0.5">
                       <p className="text-[13px] font-bold text-[#202124] leading-none mb-1">Weekly Hub Sync</p>
                       <p className="text-[11px] text-[#5F6368]">Join remote</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
    </div>
  );
}
