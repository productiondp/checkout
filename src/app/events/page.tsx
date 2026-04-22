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
  Ticket,
  ArrowUpRight,
  ListTodo,
  CheckCircle2,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import PostModal from "@/components/modals/PostModal";

const EXPOS: any[] = [
  {
    id: 1,
    title: "Global Supply Chain \nOmni-Logistics Summit 2026",
    category: "Logistics & Trade",
    date: "June 24-26, 2026",
    city: "Mumbai",
    loc: "Jio World Convention Centre, BKC",
    exhibitors: 450,
    banner: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000",
    description: "The definitive gathering for logistics masters, freight forwarders, and supply chain innovators. This year's summit focuses on AI-driven delivery nodes and cross-border trade optimization.",
    features: ["Autonomous Hubs", "Tax Compliance Nodes", "Maritime Routing AI", "Cold Chain Masterclass"]
  },
  {
    id: 2,
    title: "D2C Brand Velocity Expo",
    category: "Consumer Tech",
    date: "July 12-14, 2026",
    city: "Bangalore",
    loc: "BIEC, Tumkur Road",
    exhibitors: 280,
    banner: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=2000",
    description: "Connect with India's fastest scaling digital-first brands. Discover the latest in retail automation, performance marketing, and customer retention systems.",
    features: ["Scale Playbooks", "VC Networking", "Influencer Hubs", "Hyper-Personalization"]
  },
  {
    id: 3,
    title: "Venture Capital & Seed Summit",
    category: "Finance",
    date: "August 05-07, 2026",
    city: "Delhi NCR",
    loc: "India Expo Mart, Noida",
    exhibitors: 120,
    banner: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2000",
    description: "Where founders meet capital. A closed-door summit for Series A+ ready startups and global venture partners.",
    features: ["Pitch Arenas", "Equity Structuring", "Secondary Markets", "Global LP Access"]
  }
];

export default function BusinessExposPage() {
  const [selectedExpo, setSelectedExpo] = useState<any>(null);
  const [registeredList, setRegisteredList] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "businesses" | "map">("upcoming");
  const [isPosting, setIsPosting] = useState(false);

  const [showOracle, setShowOracle] = useState(false);
  const [oracleQuery, setOracleQuery] = useState("");
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);

  const handlePostSuccess = (post: any) => {
    console.log("Events Page Post Success:", post);
    setIsPosting(false);
  };

  const askOracle = () => {
    if (!oracleQuery.trim()) return;
    setOracleResponse("Analyzing venue nodes and exhibitor databases...");
    setTimeout(() => {
       setOracleResponse(`Oracle Suggestion: Based on your interest in "${oracleQuery}", you should prioritize Booth 402 (LogiAI) and attend the "Cross-Border Tax Logic" keynote at 2:00 PM. I've noted 3 strategic matching exhibitors for you.`);
    }, 1500);
  };

  const toggleRegister = (id: number) => {
    if (registeredList.includes(id)) {
      setRegisteredList(registeredList.filter(i => i !== id));
    } else {
      setRegisteredList([...registeredList, id]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      
      {/* 1. EXPO HUB (LEFT) */}
      <div className="flex-1 flex flex-col min-h-screen lg:border-r border-[#292828]/10 pb-40 lg:pb-12">
        
        {/* Header Section */}
        <div className="p-6 lg:p-10 border-b border-[#292828]/5 sticky top-0 bg-white/95 backdrop-blur-xl z-30">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E53935]/10 border border-[#E53935]/20 text-[#E53935] text-[9px] font-black uppercase tracking-widest mb-3">
                    Business Discovery
                 </div>
                 <h2 className="text-4xl font-black text-[#292828] tracking-tighter uppercase leading-none font-outfit">Events Hub</h2>
                 <p className="text-[12px] font-bold text-[#292828]/40 uppercase tracking-wide mt-3">Find strategic expos and trade summits.</p>
              </div>
              <button 
                onClick={() => alert("Hosting system is coming soon.")}
                className="px-10 h-16 bg-[#E53935] text-white rounded-2xl font-black text-[11px] uppercase shadow-[0_20px_40px_rgba(229,57,53,0.2)] hover:bg-[#292828] transition-all flex items-center justify-center gap-3 group"
              >
                 <Plus size={18} strokeWidth={3} /> Host an Event
              </button>
           </div>

           <div className="flex gap-8">
              {(["upcoming", "businesses", "map"] as const).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-5 text-[10px] font-black uppercase tracking-widest transition-all relative",
                    activeTab === tab ? "text-[#E53935]" : "text-[#292828]/30 hover:text-[#292828]"
                  )}
                >
                   {tab === "upcoming" ? "Upcoming Summits" : tab === "businesses" ? "Exhibitor List" : "Floor Plans"}
                   {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E53935] rounded-full shadow-[0_0_10px_rgba(229,57,53,0.4)]" />}
                </button>
              ))}
           </div>
        </div>

        {/* Expo Grid */}
        <div className="p-6 lg:p-10">
           {activeTab === "upcoming" && (
             <div className="space-y-12">
               {EXPOS.length > 0 ? (
                 <>
                   {/* MAIN FEATURED EXPO */}
                   <div 
                     onClick={() => setSelectedExpo(EXPOS[0])}
                     className="group/main relative bg-white rounded-[2.5rem] overflow-hidden border border-[#292828]/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] transition-all duration-700 hover:-translate-y-2"
                   >
                      <div className="h-[450px] relative overflow-hidden">
                         <img src={EXPOS[0].banner} className="w-full h-full object-cover group-hover/main:scale-105 transition-transform duration-[4s]" alt="" />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#292828] via-[#292828]/40 to-transparent" />
                         
                         <div className="absolute top-10 left-10">
                            <div className="px-5 py-2 bg-[#E53935] text-white text-[10px] font-black rounded-xl uppercase shadow-2xl flex items-center gap-3 group-hover/main:animate-pulse">
                               <Zap size={14} fill="white" /> Featured Event
                            </div>
                         </div>

                         <div className="absolute bottom-12 left-12 right-12">
                            <div className="flex items-center gap-3 mb-4">
                               <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-white text-[10px] font-black uppercase border border-white/20 whitespace-nowrap">{EXPOS[0].category}</span>
                               <span className="h-1 w-1 bg-white/30 rounded-full" />
                               <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{EXPOS[0].city} HUB</span>
                            </div>
                            <h3 className="text-white mb-6 leading-[0.9] whitespace-pre-line">{EXPOS[0].title}</h3>
                            <div className="flex flex-wrap items-center gap-8 text-white/80">
                               <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-tight"><MapPin size={20} className="text-[#E53935]" /> {EXPOS[0].loc}</div>
                               <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-tight"><Users size={20} className="text-[#E53935]" /> {EXPOS[0].exhibitors} Active Exhibitors</div>
                               <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-tight"><Calendar size={20} className="text-[#E53935]" /> {EXPOS[0].date}</div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* OTHER EXPOS GRID */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {EXPOS.slice(1).map(expo => (
                        <div 
                          key={expo.id} 
                          onClick={() => setSelectedExpo(expo)}
                          className="group bg-white rounded-[2rem] border border-[#292828]/10 overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] hover:border-[#E53935]/20 transition-all duration-500 cursor-pointer flex flex-col"
                        >
                           <div className="h-60 relative overflow-hidden">
                              <img src={expo.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#292828]/60 to-transparent" />
                              <div className="absolute top-6 right-6 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[9px] font-black uppercase text-[#E53935] shadow-xl border border-white/10 tracking-widest">{expo.category}</div>
                           </div>
                           <div className="p-8 flex-1 flex flex-col">
                              <h4 className="mb-4 leading-tight group-hover:text-[#E53935] transition-colors">{expo.title}</h4>
                              <div className="flex items-center justify-between pt-6 mt-auto border-t border-[#292828]/5">
                                 <div className="flex flex-col gap-1">
                                    <p className="text-[9px] font-black text-[#292828]/30 uppercase tracking-widest leading-none mb-1">Schedule</p>
                                    <div className="flex items-center gap-2 text-[12px] font-black text-[#292828] uppercase tracking-tight">
                                       <Calendar size={14} className="text-[#E53935]" /> {expo.date.split(',')[0]}
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2 px-6 h-12 bg-[#292828] text-white rounded-xl text-[10px] font-black uppercase transition-all hover:bg-[#E53935] shadow-xl shadow-slate-200">
                                    Enrole <ArrowUpRight size={16} />
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                 </>
               ) : (
                 <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-[#292828]/10 rounded-[3rem] text-[#292828]/20">
                    <Calendar size={64} strokeWidth={1} className="mb-6 opacity-20" />
                    <p className="text-[14px] font-black uppercase tracking-[0.2em]">Zero Live Summits Found</p>
                    <p className="text-[11px] font-bold mt-2 uppercase">Your city hub currently has no active expos.</p>
                 </div>
               )}
             </div>
           )}

           {activeTab === "businesses" && (
             <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                   <h3>Global Exhibitors (280)</h3>
                   <div className="flex items-center gap-2">
                       <input type="text" placeholder="Search Exhibitors..." className="h-10 px-4 bg-[#292828]/5 border border-transparent rounded-lg text-xs font-bold focus:border-[#E53935] outline-none transition-all w-64" />
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {[
                     { name: "LogiAI Systems", booth: "B-402", type: "Automation", logo: "https://logo.clearbit.com/fedex.com" },
                     { name: "SteelNode Corp", booth: "A-110", type: "Raw Materials", logo: "https://logo.clearbit.com/tata.com" },
                     { name: "FreightFlow", booth: "C-092", type: "Freight", logo: "https://logo.clearbit.com/maersk.com" },
                     { name: "OmniShip", booth: "D-201", type: "Last Mile", logo: "https://logo.clearbit.com/dhl.com" },
                     { name: "CustomsBot", booth: "B-305", type: "Legal Tech", logo: "https://logo.clearbit.com/stc.com" },
                     { name: "MarketScale", booth: "E-112", type: "D2C Scaling", logo: "https://logo.clearbit.com/shopify.com" }
                   ].map((biz, i) => (
                     <div key={i} className="p-6 bg-white border border-[#292828]/10 rounded-3xl hover:border-[#E53935]/30 hover:shadow-xl transition-all group cursor-pointer">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="h-12 w-12 bg-slate-50 rounded-xl overflow-hidden border border-[#292828]/5 p-2">
                              <img src={biz.logo} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" alt="" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-[#292828] uppercase line-clamp-1">{biz.name}</p>
                              <p className="text-[10px] font-bold text-[#E53935] uppercase">{biz.type}</p>
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-[#292828]/5">
                           <span className="text-[10px] font-black text-[#292828]/40 uppercase tracking-widest">Booth: {biz.booth}</span>
                           <button className="text-[10px] font-black text-[#292828] uppercase hover:text-[#E53935] transition-colors">Book Meeting</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === "map" && (
              <div className="space-y-12 animate-in fade-in duration-700">
                 <div className="aspect-[21/9] bg-slate-100 rounded-[3rem] border border-[#292828]/5 relative overflow-hidden group">
                    {/* Simulated Heatmap */}
                    <div className="absolute inset-0 bg-white p-12 flex items-center justify-center">
                       <div className="w-full h-full border-4 border-dashed border-[#292828]/5 rounded-[2rem] relative">
                          {/* Heatmap Nodes */}
                          <div className="absolute top-1/4 left-1/3 h-32 w-32 bg-[#E53935]/20 blur-3xl animate-pulse" />
                          <div className="absolute bottom-1/3 right-1/4 h-24 w-24 bg-[#E53935]/10 blur-3xl animate-pulse delay-700" />
                          
                          {/* Grid Overlay */}
                          <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 opacity-[0.03]">
                             {[...Array(32)].map((_, i) => (
                               <div key={i} className="border border-[#292828]" />
                             ))}
                          </div>

                          {/* Node Markers */}
                          <div className="absolute top-20 left-40 h-3 w-3 bg-[#E53935] rounded-full shadow-[0_0_10px_#E53935]">
                             <div className="absolute -top-10 -left-1/2 bg-[#292828] text-white px-2 py-1 rounded text-[8px] font-black uppercase whitespace-nowrap">Main Hall A (High Density)</div>
                          </div>
                       </div>
                    </div>
                    <div className="absolute top-8 left-8 flex items-center gap-2">
                       <div className="px-4 py-2 bg-white/90 backdrop-blur shadow-xl rounded-xl text-[9px] font-black uppercase text-[#292828] border border-[#292828]/5 flex items-center gap-2">
                          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Live Floor Plan
                       </div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { area: "Zone A", label: "Founders Lounge", density: "Heavy" },
                      { area: "Zone B", label: "Logistics Hub", density: "Medium" },
                      { area: "Zone C", label: "Pitch Arena", density: "Live Now" },
                      { area: "Zone D", label: "Networking Courtyard", density: "Quiet" }
                    ].map((zone, i) => (
                      <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-xl transition-all">
                         <p className="text-[10px] font-black text-[#292828]/30 uppercase mb-1">{zone.area}</p>
                         <h5 className="mb-4">{zone.label}</h5>
                         <div className="flex items-center justify-between">
                            <span className={cn(
                              "text-[9px] font-black uppercase px-2 py-1 rounded",
                              zone.density === "Heavy" ? "bg-red-50 text-red-600" : 
                              zone.density === "Live Now" ? "bg-emerald-50 text-emerald-600" :
                              "bg-[#292828]/5 text-[#292828]/40"
                            )}>{zone.density}</span>
                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* EVENTS CONTEXT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[380px] xl:w-[420px] h-screen sticky top-0 bg-white p-8 gap-10 overflow-y-auto no-scrollbar selection:bg-[#E53935]/10">
         <div className="flex items-center justify-between">
            <p className="subheading-editorial !text-slate-400">Summit Pulse</p>
            <button className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828] hover:bg-[#E53935] hover:text-white transition-all">
               <Bell size={18} />
            </button>
         </div>

         {/* 1. YOUR ITINERARY */}
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h4>Confirmed RSVPs</h4>
               <span className="px-2 py-1 bg-[#E53935]/5 text-[#E53935] text-[9px] font-black rounded-lg uppercase">{registeredList.length} Events</span>
            </div>
            {registeredList.length > 0 ? (
               <div className="space-y-3">
                  {registeredList.map(rid => {
                    const expo = EXPOS.find(e => e.id === rid) || { title: "Strategic Summit", date: "June 24-26" };
                    return (
                      <div key={rid} className="group p-5 bg-[#292828]/5 rounded-3xl hover:bg-white hover:shadow-xl hover:ring-1 hover:ring-[#E53935]/10 transition-all cursor-pointer">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 bg-[#292828] text-white rounded-xl flex items-center justify-center group-hover:bg-[#E53935] transition-colors">
                               <Ticket size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-[14px] font-black text-[#292828] truncate uppercase">{expo.title}</p>
                               <p className="text-[10px] font-bold text-[#292828]/40 uppercase">{expo.date.split(',')[0]}</p>
                            </div>
                         </div>
                         <button className="w-full py-2 border border-[#292828]/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#292828] hover:text-white transition-all">Digital Badge</button>
                      </div>
                    );
                  })}
               </div>
            ) : (
               <div className="p-10 border-2 border-dashed border-[#292828]/10 rounded-3xl text-center">
                  <Calendar size={32} className="mx-auto mb-4 text-[#292828]/10" />
                  <p className="text-[11px] font-bold text-[#292828]/40 uppercase leading-relaxed">No upcoming summits detected in your itinerary.</p>
               </div>
            )}
         </div>

         {/* 2. NETWORKING GOALS */}
         <div className="p-8 bg-[#292828] rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/30 blur-3xl" />
            <ListTodo size={150} className="absolute -right-10 -bottom-10 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[4s]" />
            
            <div className="relative z-10">
               <p className="subheading-editorial !text-red-500 mb-6">Execution Goals</p>
               <div className="space-y-4 mb-8">
                  {[
                    { label: "Meet 5 Tech Founders", done: true },
                    { label: "Collect 12 Vendor Kits", done: false },
                    { label: "Pitch Supply Chain Hub", done: false }
                  ].map((goal, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className={cn(
                         "h-5 w-5 rounded-md flex items-center justify-center border transition-all",
                         goal.done ? "bg-emerald-500 border-emerald-500" : "bg-white/5 border-white/20"
                       )}>
                          {goal.done && <Check size={12} strokeWidth={4} />}
                       </div>
                       <span className={cn("text-[11px] font-bold uppercase", goal.done ? "text-white/40 line-through" : "text-white")}>{goal.label}</span>
                    </div>
                  ))}
               </div>
               <button className="w-full h-12 bg-white text-[#292828] rounded-xl text-[10px] font-black uppercase shadow-xl hover:bg-[#E53935] hover:text-white transition-all">Add Goal +</button>
            </div>
         </div>

         {/* 3. AI NETWORKING MATCHES */}
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h4>AI Matchmaker</h4>
               <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-black uppercase">
                  <Star size={10} fill="currentColor" /> Premium
               </div>
            </div>
            <div className="space-y-3">
               {[
                 { name: "Rahul Varma", role: "Logistics Expert", match: "98% Structure Match", avatar: "https://i.pravatar.cc/150?u=rahul" },
                 { name: "Sofia Chen", role: "Customs Advisor", match: "91% Skill Overlay", avatar: "https://i.pravatar.cc/150?u=sofia" }
               ].map((match, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-white border border-[#292828]/5 rounded-2xl hover:border-[#E53935]/30 transition-all cursor-pointer shadow-sm group">
                    <img src={match.avatar} className="h-10 w-10 rounded-xl grayscale group-hover:grayscale-0 transition-all" alt="" />
                    <div className="flex-1">
                       <p className="text-[12px] font-black text-[#292828] uppercase leading-none mb-1">{match.name}</p>
                       <p className="text-[9px] font-bold text-[#E53935] uppercase">{match.match}</p>
                    </div>
                    <ArrowRight size={14} className="text-[#292828]/20 group-hover:text-[#E53935]" />
                 </div>
               ))}
            </div>
         </div>

         {/* 4. SUMMIT INTELLIGENCE */}
         <div className="space-y-6">
            <h4>Venue Insights</h4>
            <div className="p-6 bg-gradient-to-br from-[#E53935] to-[#B71C1C] rounded-[2rem] text-white relative overflow-hidden group">
               <TrendingUp size={100} className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-125 transition-transform duration-[4s]" />
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                        <CheckCircle2 size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-white/50 uppercase leading-none mb-1.5">Live Occupancy</p>
                        <h5 className="text-white">Main Hall Hub</h5>
                     </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                     <div className="h-full w-[72%] bg-white shadow-[0_0_10px_white]" />
                  </div>
                  <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest text-right">72% Capacity Reached</p>
               </div>
            </div>
         </div>
         
         <button className="w-full h-16 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-[#E53935] transition-all flex items-center justify-center gap-3 active:scale-95">
            Download Global Calendar <ArrowUpRight size={16} />
         </button>
      </aside>


      {/* EXPO DETAILS MODAL */}
      {selectedExpo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedExpo(null)} />
           
           <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-[3rem] overflow-hidden shadow-[0_0_150px_-30px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row animate-in zoom-in-95 duration-500">
              
              {/* IMAGE SIDE */}
              <div className="w-full lg:w-[40%] h-80 lg:h-full relative overflow-hidden shrink-0">
                 <img src={selectedExpo.banner} className="w-full h-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#292828] via-[#292828]/20 to-transparent" />
                 <button 
                   onClick={() => setSelectedExpo(null)}
                   className="absolute top-10 left-10 h-14 w-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white lg:hidden border border-white/20 active:scale-95 transition-all"
                 >
                    <ChevronLeft size={28} />
                 </button>
                 
                 <div className="absolute bottom-12 left-12 right-12">
                    <div className="px-4 py-1.5 bg-[#E53935] text-white text-[9px] font-black uppercase rounded-lg shadow-2xl mb-4 inline-block tracking-[0.2em]">Verified Hub</div>
                    <h3 className="text-5xl font-black text-white leading-none tracking-tighter uppercase mb-6">{selectedExpo.category} Summit</h3>
                    <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Region Node: {selectedExpo.city}</p>
                 </div>
              </div>

              {/* CONTENT SIDE */}
              <div className="flex-1 flex flex-col h-full bg-white relative">
                 <header className="p-12 lg:p-16 pb-8 border-b border-[#292828]/5 flex justify-between items-start">
                    <div className="space-y-6">
                       <h2 className="leading-[0.9]">{selectedExpo.title}</h2>
                       <div className="flex flex-wrap gap-10">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 bg-[#E53935]/10 rounded-xl flex items-center justify-center text-[#E53935]"><Calendar size={20} /></div>
                             <p className="text-[13px] font-black text-[#292828] uppercase tracking-tighter">{selectedExpo.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828]"><MapPin size={20} /></div>
                             <p className="text-[13px] font-black text-[#292828] uppercase tracking-tighter">{selectedExpo.loc}</p>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedExpo(null)}
                      className="hidden lg:flex h-16 w-16 bg-[#292828]/5 text-[#292828] rounded-2xl items-center justify-center hover:bg-[#E53935] hover:text-white transition-all transform hover:rotate-90 active:scale-95"
                    >
                       <X size={32} />
                    </button>
                 </header>

                 <div className="p-12 lg:p-16 space-y-16 overflow-y-auto no-scrollbar flex-1">
                    <section>
                       <p className="subheading-editorial !text-slate-400 mb-6">Summit Intelligence</p>
                       <p className="text-2xl lg:text-3xl font-bold text-[#292828]/80 leading-relaxed uppercase tracking-tight">{selectedExpo.description}</p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {selectedExpo.features.map((feat: string, i: number) => (
                         <div key={i} className="group/feat p-8 bg-[#292828]/5 rounded-[2rem] border border-transparent hover:border-[#E53935]/20 hover:bg-white transition-all duration-500 hover:shadow-2xl">
                            <div className="h-14 w-14 bg-white rounded-2xl mb-6 flex items-center justify-center text-[#E53935] shadow-xl border border-[#292828]/5 group-hover/feat:bg-[#E53935] group-hover/feat:text-white transition-all">
                               <CheckCircle2 size={24} />
                            </div>
                            <p className="text-[14px] font-black text-[#292828] uppercase tracking-tight leading-tight">{feat}</p>
                         </div>
                       ))}
                    </section>
                 </div>

                 <footer className="p-12 lg:p-16 pt-8 bg-[#FDFDFF] border-t border-[#292828]/5 mt-auto">
                    <div className="flex gap-6">
                       <button 
                         onClick={() => { toggleRegister(selectedExpo.id); setSelectedExpo(null); }}
                         className={cn(
                           "flex-1 h-20 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl active:scale-95 group",
                           registeredList.includes(selectedExpo.id) 
                             ? "bg-emerald-500 text-white shadow-emerald-500/30" 
                             : "bg-[#292828] text-white hover:bg-[#E53935] shadow-[0_20px_40px_rgba(229,57,53,0.3)]"
                         )}
                       >
                          {registeredList.includes(selectedExpo.id) ? (
                            <div className="flex items-center justify-center gap-3">
                               <Check size={20} strokeWidth={4} /> RSVP Confirmed
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-3">
                               Enrole Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          )}
                       </button>
                       <button className="h-20 px-12 border-2 border-[#292828]/10 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-[#292828]/5 transition-all">Download Kit</button>
                    </div>
                 </footer>
              </div>
           </div>
        </div>
      )}

       {isPosting && (
         <PostModal 
           isOpen={isPosting} 
           onClose={() => setIsPosting(false)} 
           onPostSuccess={handlePostSuccess}
         />
       )}

       {/* EXPO ORACLE AI ASSISTANT */}
       <div className="fixed bottom-10 right-10 z-[300]">
          {!showOracle ? (
             <button 
               onClick={() => setShowOracle(true)}
               className="h-20 w-20 bg-[#E53935] text-white rounded-full shadow-[0_20px_50px_rgba(229,57,53,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
             >
                <Zap size={32} fill="white" className="group-hover:animate-pulse" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-[#292828] text-white text-[8px] font-black rounded-full flex items-center justify-center border-4 border-white">AI</div>
             </button>
          ) : (
             <div className="w-[380px] bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] border border-[#292828]/10 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                <div className="p-6 bg-[#292828] text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#E53935] rounded-lg flex items-center justify-center">
                         <Zap size={16} fill="white" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Expo Oracle <span className="text-[#E53935]">v2.1</span></p>
                   </div>
                   <button onClick={() => setShowOracle(false)} className="text-white/40 hover:text-white transition-colors">
                      <X size={20} />
                   </button>
                </div>
                
                <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
                   <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-[#E53935] uppercase mb-2">System Initialized</p>
                      <p className="text-xs font-medium text-[#292828]/60 leading-relaxed">
                         Welcome to the Summit Intelligence Core. Ask me anything about exhibitors, venue routing, or networking matches.
                      </p>
                   </div>
                   
                   {oracleResponse && (
                      <div className="bg-[#E53935]/5 p-5 rounded-2xl border border-[#E53935]/10 animate-in fade-in slide-in-from-left-4">
                         <p className="text-[11px] font-black text-[#E53935] uppercase mb-2">Strategic Insight</p>
                         <p className="text-xs font-bold text-[#292828] leading-relaxed">
                            {oracleResponse}
                         </p>
                      </div>
                   )}
                </div>

                <div className="p-6 border-t border-[#292828]/5 bg-white">
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={oracleQuery}
                        onChange={e => setOracleQuery(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && askOracle()}
                        placeholder="e.g. Find strategic steel vendors" 
                        className="flex-1 h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all"
                      />
                      <button 
                        onClick={askOracle}
                        className="h-12 w-12 bg-[#292828] text-white rounded-xl flex items-center justify-center hover:bg-[#E53935] transition-all active:scale-95 shadow-lg"
                      >
                         <ArrowRight size={18} />
                      </button>
                   </div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
}
