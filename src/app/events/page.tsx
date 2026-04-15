"use client";

import React, { useState } from "react";
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
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BusinessExpos() {
  const [registered, setRegistered] = useState<number[]>([]);
  const [showHostModal, setShowHostModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "exhibitors" | "booths">("upcoming");

  const upcomingExpos = [
    {
      id: 1,
      title: "Kerala Trade Expo 2024",
      date: "Oct 24, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Convention Center, Trivandrum",
      exhibitors: "250+",
      attendees: "5k+",
      image: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?q=80&w=1200&auto=format&fit=crop",
      category: "Trade Show",
      color: "bg-red-500"
    },
    {
      id: 2,
      title: "Tech Innovation Summit",
      date: "Nov 12, 2024",
      time: "10:00 AM",
      location: "Technopark Phase III",
      exhibitors: "45",
      attendees: "1k+",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop",
      category: "Tech Expo",
      color: "bg-blue-500"
    }
  ];

  const exhibitorSpotlight = [
    { name: "EcoBuild Systems", specialty: "Green Tech", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100" },
    { name: "PureBite Foods", specialty: "Organic Agri", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=100" },
    { name: "SecureNode AI", specialty: "Cybersecurity", logo: "https://images.unsplash.com/photo-1554629947-334ff61d85dc?q=80&w=100" },
  ];

  const toggleRegister = (id: number) => {
    if (registered.includes(id)) {
      setRegistered(registered.filter(i => i !== id));
      alert("Registration cancelled.");
    } else {
      setRegistered([...registered, id]);
      alert("Successfully registered for the Expo!");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-white">
      <div className="flex-1 p-8 border-r border-slate-50 max-w-[900px] mx-auto xl:mx-0">
           
           {/* Header Area */}
           <div className="flex items-center justify-between px-2 mb-10">
              <div>
                 <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Business <span className="text-[#E53935]">Expos</span></h2>
                 <p className="text-[13px] text-slate-500 font-medium mt-1">Discover trade shows and showcase your products</p>
              </div>
              <button 
                onClick={() => setShowHostModal(!showHostModal)}
                className="px-6 py-3 bg-[#E53935] text-white rounded-xl font-bold text-[11px] uppercase flex items-center gap-2 shadow-lg shadow-red-500/10 hover:bg-slate-900 transition-all"
              >
                 <Plus size={16} /> Host An Expo
              </button>
           </div>

           {showHostModal && (
             <div className="mb-10 p-8 bg-slate-900 text-white rounded-[2.5rem] animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden group">
                <div className="relative z-10">
                   <h3 className="text-xl font-bold uppercase mb-2">Book Expo Venue</h3>
                   <p className="text-[12px] font-bold text-slate-400 mb-6 uppercase tracking-normal">List your trade show or book exhibitor space in leading expos.</p>
                   <div className="flex gap-3">
                      <button onClick={() => { setShowHostModal(false); alert("Facility booking system coming soon!"); }} className="px-6 py-3 bg-[#E53935] text-white rounded-xl font-bold text-[11px] uppercase transition-all">Request Booth</button>
                      <button onClick={() => setShowHostModal(false)} className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold text-[11px] uppercase transition-all">Cancel</button>
                   </div>
                </div>
                <Users size={120} className="absolute -right-5 -bottom-5 text-white/5 rotate-12" />
             </div>
           )}

           {/* Navigation Tabs */}
           <div className="flex gap-8 border-b border-slate-50 mb-10 px-2">
              <button onClick={() => setActiveTab("upcoming")} className={cn("pb-4 text-[11px] font-bold uppercase tracking-normal transition-all relative", activeTab === "upcoming" ? "text-slate-900" : "text-slate-400 hover:text-slate-600")}>
                 Upcoming Expos
                 {activeTab === "upcoming" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E53935]" />}
              </button>
              <button onClick={() => setActiveTab("exhibitors")} className={cn("pb-4 text-[11px] font-bold uppercase tracking-normal transition-all relative", activeTab === "exhibitors" ? "text-slate-900" : "text-slate-400 hover:text-slate-600")}>
                 Who's Showing (Exhibitors)
                 {activeTab === "exhibitors" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E53935]" />}
              </button>
              <button onClick={() => setActiveTab("booths")} className={cn("pb-4 text-[11px] font-bold uppercase tracking-normal transition-all relative", activeTab === "booths" ? "text-slate-900" : "text-slate-400 hover:text-slate-600")}>
                 Booth Plans
                 {activeTab === "booths" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E53935]" />}
              </button>
           </div>

           {activeTab === "upcoming" && (
             <div className="space-y-10">
                {/* Featured Expo */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 group shadow-xl shadow-slate-200/20">
                   <div className="h-72 relative overflow-hidden">
                      <img src={upcomingExpos[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Expo" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute top-6 left-6 block">
                         <span className="px-3 py-1 bg-[#E53935] text-white text-[10px] font-bold rounded-lg uppercase tracking-normal">Big Expo</span>
                      </div>
                   </div>
                   <div className="p-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                         <div>
                            <h3 className="text-3xl font-bold text-slate-900 tracking-tight uppercase mb-2">{upcomingExpos[0].title}</h3>
                            <div className="flex items-center gap-4 text-slate-500">
                               <div className="flex items-center gap-2"><MapPin size={14} className="text-[#E53935]" /> <span className="text-[13px] font-medium">{upcomingExpos[0].location}</span></div>
                               <div className="flex items-center gap-2"><Briefcase size={14} className="text-[#E53935]" /> <span className="text-[13px] font-medium">{upcomingExpos[0].exhibitors} Exhibitors</span></div>
                            </div>
                         </div>
                         <button 
                           onClick={() => toggleRegister(upcomingExpos[0].id)}
                           className={cn(
                             "px-8 py-4 rounded-xl font-bold text-[12px] uppercase transition-all shadow-lg",
                             registered.includes(upcomingExpos[0].id)
                               ? "bg-green-100 text-green-600"
                               : "bg-slate-900 text-white hover:bg-[#E53935] shadow-slate-900/10"
                           )}
                         >
                            {registered.includes(upcomingExpos[0].id) ? "Registered" : "Get Free Entry"}
                         </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <TrendingUp size={18} className="mx-auto mb-2 text-[#E53935]" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Growth Focus</p>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <Users size={18} className="mx-auto mb-2 text-[#E53935]" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Networking</p>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <Award size={18} className="mx-auto mb-2 text-[#E53935]" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase">New Launch</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Sub Expos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                   {upcomingExpos.slice(1).map(expo => (
                     <div key={expo.id} className="p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#E53935] mb-6 border border-slate-100">
                           <LayoutGrid size={28} />
                        </div>
                        <p className="text-[10px] font-bold text-[#E53935] uppercase mb-2">{expo.category}</p>
                        <h4 className="text-xl font-bold text-slate-900 mb-2 leading-tight uppercase group-hover:text-[#E53935] transition-colors">{expo.title}</h4>
                        <p className="text-[12px] text-slate-500 font-medium mb-8"><Calendar size={12} className="inline mr-1" /> {expo.date}</p>
                        <button 
                          onClick={() => toggleRegister(expo.id)}
                          className={cn(
                            "w-full py-4 rounded-xl font-bold text-[11px] uppercase transition-all",
                            registered.includes(expo.id)
                              ? "bg-green-50 text-green-600"
                              : "bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white"
                          )}
                        >
                           {registered.includes(expo.id) ? "Registered" : "Register Now"}
                        </button>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === "exhibitors" && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-normal ml-2">Showcasing Businesses</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {exhibitorSpotlight.map(ex => (
                     <div key={ex.name} className="p-6 bg-white border border-slate-100 rounded-[2rem] text-center hover:border-red-100 hover:shadow-lg transition-all">
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 overflow-hidden shadow-md">
                           <img src={ex.logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm mb-1">{ex.name}</h5>
                        <p className="text-[10px] font-bold text-[#E53935] uppercase">{ex.specialty}</p>
                        <button onClick={() => alert(`Showing details for ${ex.name}`)} className="mt-4 text-[11px] font-bold text-slate-400 hover:text-slate-900">View Booth →</button>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === "booths" && (
              <div className="p-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center animate-in fade-in scale-in-95 duration-500">
                 <LayoutGrid size={48} className="mx-auto mb-6 text-slate-300" />
                 <h4 className="text-xl font-bold text-slate-900 mb-2">Interactive Floor Plans</h4>
                 <p className="text-[13px] text-slate-500 font-medium max-w-sm mx-auto">Clickable maps to find businesses and navigate expo venues across Kerala.</p>
                 <button className="mt-8 px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-[11px] uppercase text-slate-400 cursor-not-allowed">Coming Next Week</button>
              </div>
           )}
      </div>

      <div className="w-full xl:w-96 p-10 space-y-10 bg-slate-50/50">
         <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-normal mb-8">Exhibitor News</h4>
            <div className="space-y-8">
               <div className="flex gap-4 group cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-[#E53935] mt-1 shrink-0" />
                  <div>
                     <p className="text-[13px] font-bold text-slate-900 mb-1 group-hover:text-[#E53935] transition-colors">50 Booths Available</p>
                     <p className="text-[11px] text-slate-400 font-medium">Technopark Innovation Summit is still accepting exhibitors.</p>
                  </div>
               </div>
               <div className="flex gap-4 group cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <div>
                     <p className="text-[13px] font-bold text-slate-900 mb-1 group-hover:text-blue-500 transition-colors">Govt. Support Expo</p>
                     <p className="text-[11px] text-slate-400 font-medium">New MSME support desk launching at Convention Center.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden group">
            <TrendingUp size={100} className="absolute -right-5 -bottom-5 text-white/[0.03] group-hover:scale-110 transition-transform" />
            <h4 className="text-[11px] font-bold text-[#E53935] uppercase mb-6">Exhibition Facts</h4>
            <p className="text-2xl font-bold leading-tight mb-8">
               Companies that exhibit at trade shows reach <span className="text-[#E53935]">4x more</span> retail buyers.
            </p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-[11px] uppercase transition-all">Download Guide</button>
         </div>
      </div>
    </div>
  );
}
