"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Star, 
  Clock, 
  Plus, 
  Check, 
  Zap, 
  Camera, 
  Briefcase, 
  Users, 
  LayoutGrid,
  TrendingUp,
  Award,
  X,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building2,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";

const EXPOS = [
  {
    id: 1,
    title: "Kerala Trade Expo 2026",
    date: "Dec 15, 2026",
    time: "9:00 AM - 6:00 PM",
    loc: "Convention Center",
    city: "Trivandrum",
    exhibitors: 250,
    attendees: "15k+",
    banner: "/images/expo-kerala.png",
    category: "Trade Show",
    description: "The largest gathering of MSMEs and industrial units in Kerala. Explore high-capacity manufacturing and local trade synergies.",
    features: ["B2B Networking", "New Launches", "Govt. Support Desk"],
    gallery: [
      "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?q=80&w=400",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=400",
      "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=400"
    ]
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    date: "Jan 12, 2027",
    time: "10:00 AM - 4:00 PM",
    loc: "Technopark Phase III",
    city: "Trivandrum",
    exhibitors: 45,
    attendees: "2k+",
    banner: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200",
    category: "Tech Expo",
    description: "Discover the future of local tech nodes. Focused on AI implementation for logistics and manufacturing hubs.",
    features: ["Startup Demo Day", "Investor Meet", "AI Workshop"]
  },
  {
    id: 3,
    title: "Retail Global Fair",
    date: "Feb 05, 2027",
    time: "11:00 AM - 8:00 PM",
    loc: "Lulu Mall Atrium",
    city: "Kochi",
    exhibitors: 120,
    attendees: "50k+",
    banner: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=1200",
    category: "Retail Expo",
    description: "A premium showcase for consumer brands and retail technology providers in the Kochi node.",
    features: ["Product Showcase", "Bulk Deal Day", "Retail Strategy Talk"]
  },
  {
    id: 4,
    title: "Manufacturing Matrix",
    date: "Mar 20, 2027",
    time: "9:30 AM - 5:30 PM",
    loc: "Industrial Estate Hub",
    city: "Palakkad",
    exhibitors: 85,
    attendees: "3k+",
    banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200",
    category: "Industrial Expo",
    description: "Connect with raw material suppliers and heavy machinery manufacturers in the industrial heart of Kerala.",
    features: ["Material Sourcing", "Machine Demo", "Logistics Panel"]
  },
  {
    id: 5,
    title: "Startup Synergy Day",
    date: "Apr 10, 2027",
    time: "10:00 AM - 6:00 PM",
    loc: "Coworking Node",
    city: "Bangalore",
    exhibitors: 60,
    attendees: "5k+",
    banner: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200",
    category: "Networking Expo",
    description: "Closing the gap between founders and early-stage investors across regional business nodes.",
    features: ["Speed Networking", "Equity Lab", "Growth Hacking"]
  }
];

export default function BusinessExposPage() {
  const [selectedExpo, setSelectedExpo] = useState<any>(null);
  const [registeredList, setRegisteredList] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "businesses" | "map">("upcoming");

  const toggleRegister = (id: number) => {
    if (registeredList.includes(id)) {
      setRegisteredList(registeredList.filter(i => i !== id));
    } else {
      setRegisteredList([...registeredList, id]);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-white">
      
      {/* 1. EXPO HUB (LEFT) */}
      <div className="flex-1 flex flex-col min-h-screen border-r border-[#292828]/10 pb-40 lg:pb-12">
        
        {/* Header Section */}
        <div className="p-6 lg:p-10 border-b border-[#292828]/5 sticky top-0 bg-white/95 backdrop-blur-xl z-30">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                 <h2 className="text-3xl font-black text-[#292828]">Events</h2>
                 <p className="text-[12px] font-medium text-[#292828] mt-1">Find events in your city and meet new people.</p>
              </div>
              <button 
                onClick={() => alert("Hosting system is coming soon.")}
                className="px-8 py-4 bg-[#E53935] text-white rounded-2xl font-bold text-[11px] uppercase shadow-xl shadow-red-500/10 hover:bg-[#292828] transition-all flex items-center justify-center gap-2"
              >
                 <Plus size={18} /> Host an Event
              </button>
           </div>

           <div className="flex gap-8">
              {(["upcoming", "businesses", "map"] as const).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-4 text-[11px] font-bold uppercase transition-all relative",
                    activeTab === tab ? "text-[#292828]" : "text-[#292828] hover:text-[#292828]"
                  )}
                >
                   {tab === "upcoming" ? "Upcoming" : tab === "businesses" ? "Businesses" : "Map"}
                   {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E53935] rounded-full" />}
                </button>
              ))}
           </div>
        </div>

        {/* Expo Grid */}
        <div className="p-6 lg:p-10 space-y-12">
           {activeTab === "upcoming" && (
             <>
               {/* MAIN FEATURED EXPO */}
               <div 
                 onClick={() => setSelectedExpo(EXPOS[0])}
                 className="group bg-white rounded-[1.95rem] overflow-hidden border border-[#292828]/10 shadow-2xl shadow-slate-200/20 cursor-pointer"
               >
                  <div className="h-80 relative overflow-hidden">
                     <img src={EXPOS[0].banner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                     <div className="absolute top-8 left-8">
                        <span className="px-4 py-1.5 bg-[#E53935] text-white text-[10px] font-bold rounded-xl uppercase shadow-lg no-italic">Popular Event</span>
                     </div>
                     <div className="absolute bottom-10 left-10">
                        <h3 className="text-4xl font-black text-white mb-2 leading-tight uppercase no-italic">{EXPOS[0].title}</h3>
                        <div className="flex items-center gap-6 text-white/80">
                           <div className="flex items-center gap-2 text-[14px] font-bold no-italic"><MapPin size={16} /> {EXPOS[0].loc}, {EXPOS[0].city}</div>
                           <div className="flex items-center gap-2 text-[14px] font-bold no-italic"><Users size={16} /> {EXPOS[0].exhibitors} Companies</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* OTHER EXPOS GRID */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {EXPOS.slice(1).map(expo => (
                    <div 
                      key={expo.id} 
                      onClick={() => setSelectedExpo(expo)}
                      className="group bg-white border border-[#292828]/10 rounded-[1.625rem] overflow-hidden hover:shadow-2xl hover:border-[#E53935]/10 transition-all cursor-pointer"
                    >
                       <div className="h-48 relative overflow-hidden">
                          <img src={expo.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                          <div className="absolute top-6 right-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-[#E53935] no-italic">{expo.category}</div>
                       </div>
                       <div className="p-8">
                          <h4 className="text-xl font-bold text-[#292828] mb-2 leading-tight group-hover:text-[#E53935] transition-colors no-italic">{expo.title}</h4>
                          <div className="flex items-center justify-between pt-6 border-t border-[#292828]/5">
                             <div className="flex items-center gap-2 text-[12px] font-bold text-[#292828] capitalize no-italic">
                                <Calendar size={14} className="text-[#292828]/40" /> {expo.date}
                             </div>
                             <div className="flex items-center gap-2 px-4 py-2 bg-[#292828]/5 text-[#292828] rounded-xl text-[10px] font-bold uppercase transition-all hover:bg-[#292828] hover:text-white no-italic">
                                View <ChevronRight size={14} />
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             </>
           )}

           {activeTab === "businesses" && (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="p-8 bg-white border border-[#292828]/10 rounded-[1.625rem] text-center hover:border-[#E53935]/20 hover:shadow-2xl transition-all group">
                     <div className="h-20 w-20 bg-[#292828]/5 rounded-[0.975rem] mx-auto mb-6 flex items-center justify-center text-[#292828]/40 group-hover:text-[#E53935] transition-colors border border-[#292828]/10">
                        <Building2 size={32} />
                     </div>
                     <h5 className="text-[15px] font-bold text-[#292828] mb-1 leading-tight">Elite Business Hub {i + 1}</h5>
                     <p className="text-[10px] font-bold text-[#292828] uppercase mb-6">Manufacturing Node</p>
                     <button className="text-[11px] font-bold text-[#292828] hover:text-[#E53935] transition-all flex items-center justify-center gap-2 mx-auto">
                        View Booth <ArrowRight size={14} />
                     </button>
                  </div>
                ))}
             </div>
           )}

           {activeTab === "map" && (
              <div className="p-20 bg-[#292828]/5 rounded-[1.95rem] border-2 border-dashed border-[#292828]/10 text-center">
                 <LayoutGrid size={48} className="mx-auto mb-6 text-[#292828]/20" />
                 <h4 className="text-xl font-bold text-[#292828] mb-2">Venue Floor Plans</h4>
                 <p className="text-[13px] font-medium text-[#292828] max-w-xs mx-auto">Interactive maps for the Convention Center and Technopark are launching next week.</p>
              </div>
           )}
        </div>
      </div>

      {/* 2. ANALYTICS (RIGHT) */}
      <aside className="hidden xl:flex flex-col w-[400px] h-screen sticky top-0 bg-[#292828]/5/50 p-10 gap-10 overflow-y-auto no-scrollbar">
         <div className="p-10 bg-white border border-[#292828]/10 rounded-[1.95rem] shadow-xl shadow-slate-200/10">
            <h4 className="text-[10px] font-black text-[#292828]/40 uppercase mb-8">My Registrations</h4>
            {registeredList.length > 0 ? (
              <div className="space-y-6">
                 {registeredList.map(rid => {
                   const expo = EXPOS.find(e => e.id === rid);
                   return (
                     <div key={rid} className="flex gap-4 p-4 bg-[#292828]/5 rounded-2xl border border-[#292828]/10">
                        <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#E53935] shadow-sm"><Ticket size={24} /></div>
                        <div>
                           <p className="text-[13px] font-bold text-[#292828] truncate">{expo?.title}</p>
                           <p className="text-[10px] font-bold text-[#292828] uppercase">{expo?.date}</p>
                        </div>
                     </div>
                   );
                 })}
              </div>
            ) : (
              <p className="text-[13px] font-medium text-[#292828] text-center italic">No confirmed registrations yet.</p>
            )}
         </div>

         <div className="p-10 bg-[#292828] rounded-[1.95rem] text-white relative overflow-hidden group">
            <TrendingUp size={120} className="absolute -right-5 -bottom-5 text-white/[0.03] group-hover:scale-110 transition-transform" />
            <h4 className="text-[10px] font-black text-[#E53935] uppercase mb-6">For Businesses</h4>
            <p className="text-2xl font-black leading-tight mb-8">
               Meeting people at events helps you find <span className="text-[#E53935]">4x more</span> partners.
            </p>
            <button className="w-full py-5 bg-white text-[#292828] rounded-[1.3rem] font-bold text-[11px] uppercase shadow-2xl hover:bg-[#E53935] hover:text-white transition-all">Download Guide</button>
         </div>
      </aside>

      {/* EXPO DETAILS MODAL */}
      {selectedExpo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#292828]/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[2.6rem] flex flex-col lg:flex-row overflow-hidden shadow-4xl animate-in zoom-in-95 duration-500">
              
              {/* IMAGE SIDE */}
              <div className="w-full lg:w-[45%] h-64 lg:h-full relative overflow-hidden">
                 <img src={selectedExpo.banner} className="w-full h-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:hidden" />
                 <button 
                   onClick={() => setSelectedExpo(null)}
                   className="absolute top-8 left-8 h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white lg:hidden"
                 >
                    <ChevronLeft size={24} />
                 </button>
              </div>

              {/* CONTENT SIDE */}
              <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto no-scrollbar">
                 <header className="p-10 lg:p-14 pb-4 flex justify-between items-start">
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-4">
                          <span className="px-4 py-1.5 bg-red-50 text-[#E53935] text-[10px] font-black uppercase rounded-lg">{selectedExpo.category}</span>
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-4 py-1.5 rounded-lg"><ShieldCheck size={14} /> Verified Venue</span>
                       </div>
                       <h2 className="text-4xl lg:text-5xl font-black text-[#292828] leading-tight mb-4 uppercase">{selectedExpo.title}</h2>
                       <div className="flex flex-wrap gap-8">
                          <div className="flex items-center gap-3 text-[14px] font-bold text-[#292828] capitalize"><Calendar size={18} className="text-[#E53935]" /> {selectedExpo.date}</div>
                          <div className="flex items-center gap-3 text-[14px] font-bold text-[#292828] capitalize"><MapPin size={18} className="text-[#E53935]" /> {selectedExpo.loc}, {selectedExpo.city}</div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedExpo(null)}
                      className="hidden lg:flex h-14 w-14 bg-[#292828]/5 text-[#292828] rounded-[0.975rem] items-center justify-center hover:bg-[#292828]/10 hover:text-[#292828] transition-all"
                    >
                       <X size={24} />
                    </button>
                 </header>

                 <div className="px-10 lg:p-14 pt-8 space-y-12 flex-1">
                    <section>
                       <h4 className="text-[11px] font-black text-[#292828]/40 uppercase mb-4">Expo Description</h4>
                       <p className="text-lg lg:text-xl font-medium text-[#292828] leading-relaxed max-w-2xl">{selectedExpo.description}</p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {selectedExpo.features.map((feat: string, i: number) => (
                         <div key={i} className="p-6 bg-[#292828]/5 rounded-[1.3rem] border border-[#292828]/10 text-center group">
                            <div className="h-12 w-12 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center text-[#E53935] shadow-sm animate-pulse-slow">
                               <Check size={20} />
                            </div>
                            <p className="text-[13px] font-bold text-[#292828]">{feat}</p>
                         </div>
                       ))}
                    </section>
                 </div>

                 <footer className="p-10 lg:p-14 pt-0 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-md">
                    <div className="flex gap-4">
                       <button 
                         onClick={() => { toggleRegister(selectedExpo.id); setSelectedExpo(null); }}
                         className={cn(
                           "flex-1 h-16 rounded-[1.3rem] font-black text-[11px] uppercase transition-all shadow-4xl active:scale-95",
                           registeredList.includes(selectedExpo.id) ? "bg-green-50 text-green-600" : "bg-[#E53935] text-white hover:bg-[#292828] shadow-red-500/10"
                         )}
                       >
                          {registeredList.includes(selectedExpo.id) ? "You're Going!" : "Join Event"}
                       </button>
                       <button className="h-16 px-10 border border-[#292828]/10 rounded-[1.3rem] font-bold text-[11px] uppercase hover:bg-[#292828]/5">Share</button>
                    </div>
                 </footer>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
