"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Star, 
  CheckCircle2, 
  MapPin, 
  MessageSquare, 
  UserPlus, 
  ChevronRight,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  Globe,
  Briefcase,
  LayoutGrid,
  List,
  ArrowUpRight,
  GraduationCap,
  X,
  Video,
  FileText,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_PROFILES } from "@/lib/dummyData";

const CATEGORIES = ["All", "Strategy", "Tech", "Growth", "Logistics", "Sales", "Fintech"];

export default function BusinessAdvisorsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [connectedIds, setConnectedIds] = useState<number[]>([]);
  const [selectedAdv, setSelectedAdv] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success">("idle");

  const filteredAdvisors = useMemo(() => {
    return DUMMY_PROFILES.filter(profile => {
      const matchesCategory = activeCategory === "All" || (profile.tags && profile.tags.includes(activeCategory));
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            profile.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            profile.company.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleConnect = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (connectedIds.includes(id)) {
      setConnectedIds(connectedIds.filter(i => i !== id));
    } else {
      setConnectedIds([...connectedIds, id]);
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    setBookingStatus("loading");
    setTimeout(() => {
      setBookingStatus("success");
      setTimeout(() => {
        setSelectedAdv(null);
        setBookingStatus("idle");
        setSelectedDate(null);
        setSelectedTime(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white selection:bg-[#E53935]/10">
      
      {/* 1. ADVISORS FEED (LEFT) */}
      <div className="flex-1 flex flex-col min-h-screen border-r border-[#292828]/10 pb-40 lg:pb-12">
        
        {/* Header Section */}
        <div className="p-6 lg:p-10 border-b border-[#292828]/5 sticky top-0 bg-white/95 backdrop-blur-xl z-40">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E53935]/10 border border-[#E53935]/20 text-[#E53935] text-[9px] font-black uppercase tracking-widest mb-3">
                    Verified Networks
                 </div>
                 <h1 className="text-4xl font-black text-[#292828] leading-tight tracking-tighter uppercase">Advisors</h1>
                 <p className="text-[12px] font-bold text-[#292828]/40 uppercase tracking-wide mt-1">Connect with the top 1% of regional builders.</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Search experts..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-14 w-full md:w-72 bg-[#292828]/5 border border-transparent rounded-xl pl-12 pr-4 text-[13px] font-medium text-[#292828] outline-none focus:bg-white focus:border-[#E53935]/30 transition-all placeholder:text-[#292828]/30 shadow-inner" 
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#292828]/30 group-focus-within:text-[#E53935] transition-colors" />
                 </div>
                 <button className="h-14 w-14 bg-[#292828] text-white rounded-xl flex items-center justify-center hover:bg-[#E53935] transition-all shadow-xl active:scale-95">
                    <Filter size={20} />
                 </button>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                 {CATEGORIES.map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => setActiveCategory(cat)}
                     className={cn(
                       "px-6 h-11 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap border-2",
                       activeCategory === cat ? "bg-[#292828] text-white border-[#292828] shadow-xl" : "bg-white text-[#292828]/40 border-transparent hover:border-[#292828]/10 hover:text-[#292828]"
                     )}
                   >
                      {cat}
                   </button>
                 ))}
              </div>

              <div className="flex items-center gap-1 p-1.5 bg-[#292828]/5 rounded-2xl self-start sm:self-auto shrink-0">
                 <button 
                   onClick={() => setViewMode("grid")}
                   className={cn(
                     "h-10 px-5 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase transition-all",
                     viewMode === "grid" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/30 hover:text-[#292828]"
                   )}
                 >
                    <LayoutGrid size={14} /> Grid
                 </button>
                 <button 
                   onClick={() => setViewMode("list")}
                   className={cn(
                     "h-10 px-5 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase transition-all",
                     viewMode === "list" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/30 hover:text-[#292828]"
                   )}
                 >
                    <List size={14} /> List
                 </button>
              </div>
           </div>
        </div>

        {/* Advisors Display */}
        <div className="p-6 lg:p-10">
           
           <div className={cn(
               "transition-all duration-500",
               viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8" : "flex flex-col gap-6"
           )}>
               {filteredAdvisors.length > 0 ? (
                 filteredAdvisors.map(profile => (
                    <div key={profile.id} className="group/advisor-card relative">
                       <div 
                         onClick={() => setSelectedAdv({ ...profile, cost: 2500, rank: "National Authority" })}
                         className={cn(
                           "bg-white rounded-[2rem] border border-[#292828]/10 overflow-hidden transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(41,40,40,0.15)] hover:border-[#E53935]/20 hover:-translate-y-1 relative cursor-pointer",
                           viewMode === "list" ? "flex flex-row items-center p-6 gap-8" : "flex flex-col p-8"
                         )}
                       >
                          
                          {/* Profile Avatar & Match */}
                          <div className={cn(
                             "relative shrink-0",
                             viewMode === "list" ? "h-24 w-24" : "h-32 w-32 mb-8 mx-auto"
                          )}>
                             <div className="h-full w-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative">
                                <img src={profile.avatar} className="w-full h-full object-cover grayscale group-hover/advisor-card:grayscale-0 transition-all duration-700" alt="" />
                                {profile.online && (
                                  <div className="absolute top-2 right-2 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                                )}
                             </div>
                             {/* Match Score Badge */}
                             <div className="absolute -bottom-3 -right-3 h-12 w-12 bg-white rounded-2xl flex flex-col items-center justify-center shadow-xl border border-[#292828]/5 group-hover/advisor-card:scale-110 transition-transform">
                                <span className="text-[7px] font-black text-[#292828]/30 uppercase leading-none">Match</span>
                                <span className="text-sm font-black text-[#E53935] leading-none">{profile.match}%</span>
                             </div>
                          </div>

                          {/* Profile Body */}
                          <div className={cn(
                            "flex-1",
                            viewMode === "list" ? "text-left" : "text-center"
                          )}>
                             <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
                                <h3 className="text-xl font-black text-[#292828] leading-tight tracking-tighter uppercase group-hover/advisor-card:text-[#E53935] transition-colors">{profile.name}</h3>
                                <CheckCircle2 size={16} className="text-[#E53935]" />
                             </div>
                             <p className="text-[10px] font-black text-[#292828]/40 uppercase tracking-widest mb-4">{profile.role} @ {profile.company}</p>
                             
                             <div className={cn(
                               "flex flex-wrap gap-2 mb-6",
                               viewMode === "list" ? "justify-start" : "justify-center md:justify-start"
                             )}>
                                {profile.tags.map(tag => (
                                  <span key={tag} className="px-3 py-1 bg-[#292828]/5 text-[#292828]/60 text-[8px] font-black uppercase rounded-lg border border-[#292828]/5">{tag}</span>
                                ))}
                             </div>

                             {/* Location */}
                             <div className={cn(
                               "flex items-center gap-2 text-[10px] font-bold text-[#292828]/30 uppercase mb-8",
                               viewMode === "list" ? "justify-start" : "justify-center md:justify-start"
                             )}>
                                <MapPin size={12} className="text-[#E53935]" /> {profile.city} Node
                             </div>

                             {/* Action Footer */}
                             <div className="flex gap-3">
                                <button 
                                   onClick={(e) => toggleConnect(e, profile.id as number)}
                                   className={cn(
                                     "flex-1 h-14 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 active:scale-95 flex items-center justify-center gap-2 shadow-xl",
                                     connectedIds.includes(profile.id as number)
                                       ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                       : "bg-[#292828] text-white hover:bg-[#E53935] shadow-slate-200"
                                   )}
                                >
                                   {connectedIds.includes(profile.id as number) ? (
                                      <><ShieldCheck size={16} /> Connected</>
                                   ) : (
                                      <><UserPlus size={16} /> Connect</>
                                   )}
                                </button>
                                <button className="h-14 w-14 bg-[#292828]/5 text-[#292828] rounded-xl flex items-center justify-center hover:bg-[#292828]/10 transition-all active:scale-95">
                                   <MessageSquare size={18} />
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="col-span-full flex flex-col items-center justify-center py-40 bg-[#292828]/5 rounded-[2.6rem] border-2 border-dashed border-[#292828]/10 text-[#292828]/20">
                    <GraduationCap size={64} strokeWidth={1} className="mb-6 opacity-20" />
                    <p className="text-[14px] font-black uppercase tracking-[0.2em]">Zero Talent Signal Detected</p>
                    <p className="text-[11px] font-bold mt-2 uppercase">Broaden your search parameters or location radius.</p>
                 </div>
               )}
           </div>
        </div>
      </div>

      {/* 2. ANALYTICS (RIGHT) */}
      <aside className="hidden xl:flex flex-col w-[450px] h-screen sticky top-0 bg-[#FDFDFF] p-12 gap-12 overflow-y-auto no-scrollbar border-l border-[#292828]/10">
         
         <div className="p-10 bg-white border border-[#292828]/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(41,40,40,0.05)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 rounded-full blur-[60px] pointer-events-none" />
            <h4 className="text-[10px] font-black text-[#292828]/30 uppercase tracking-[0.2em] mb-8">Node Reputation</h4>
            <div className="flex items-center gap-8 mb-10">
               <div className="h-20 w-20 bg-[#292828] rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl">🏆</div>
               <div>
                  <p className="text-3xl font-black text-[#292828] uppercase tracking-tighter leading-none mb-2">98.2</p>
                  <p className="text-[11px] font-bold text-[#E53935] uppercase tracking-widest">Global Authority Score</p>
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <p className="text-[11px] font-black text-[#292828] uppercase">Network Reach</p>
                  <span className="text-[11px] font-black text-[#E53935] uppercase">+12%</span>
               </div>
               <div className="h-2 w-full bg-[#292828]/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#292828] rounded-full w-[85%]" />
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-[11px] font-black text-[#292828]/30 uppercase tracking-widest">Trending Nodes</h4>
               <span className="px-2 py-1 bg-[#E53935]/10 text-[#E53935] text-[9px] font-black rounded-lg uppercase border border-[#E53935]/10">Live Intel</span>
            </div>

            <div className="space-y-4">
               {DUMMY_PROFILES.slice(10, 14).map(p => (
                 <div key={p.id} className="group/trend p-5 bg-white border border-[#292828]/10 rounded-2xl hover:shadow-2xl hover:border-[#E53935]/20 transition-all cursor-pointer flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden grayscale group-hover/trend:grayscale-0 transition-all shadow-lg border border-white">
                       <img src={p.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-[13px] font-black text-[#292828] uppercase truncate leading-none mb-1">{p.name}</p>
                       <p className="text-[9px] font-bold text-[#E53935] uppercase truncate tracking-tight">{p.role}</p>
                    </div>
                    <ArrowUpRight size={16} className="text-[#292828]/20 group-hover/trend:text-[#E53935] transition-colors" />
                 </div>
               ))}
            </div>
         </div>

         <div className="mt-auto p-10 bg-[#292828] rounded-[2.5rem] shadow-[0_40px_100px_rgba(41,40,40,0.3)] relative overflow-hidden text-white group">
            <Globe size={200} className="absolute -right-20 -bottom-20 text-white/[0.04] group-hover:rotate-12 transition-transform duration-[10s]" />
            <div className="relative z-10">
               <div className="h-14 w-14 bg-[#E53935] rounded-2xl flex items-center justify-center mb-8 shadow-2xl border border-white/10">
                  <Zap size={28} fill="currentColor" />
               </div>
               <p className="text-2xl font-black leading-tight tracking-tighter uppercase mb-6">Upgrade to <span className="text-[#E53935]">Elite Signal</span> for direct priority access.</p>
               <button className="w-full h-16 bg-white text-[#292828] rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-[#E53935] hover:text-white transition-all">View Plans</button>
            </div>
         </div>
      </aside>

      {/* BOOKING ENGINE MODAL */}
      {selectedAdv && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0a0a]/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="relative w-full max-w-4xl bg-white rounded-[2.6rem] overflow-hidden shadow-4xl animate-in zoom-in-95 duration-500 flex flex-col lg:flex-row h-[80vh]">
              
              {/* Profile Bar */}
              <div className="w-full lg:w-[320px] bg-[#292828]/5 p-12 flex flex-col items-center text-center">
                 <div className="h-32 w-32 rounded-[1.625rem] overflow-hidden shadow-2xl mb-8 border-4 border-white">
                    <img src={selectedAdv.avatar} className="w-full h-full object-cover" alt="" />
                 </div>
                 <h2 className="text-2xl font-black text-[#292828] mb-1 uppercase leading-tight tracking-tighter">{selectedAdv.name}</h2>
                 <p className="text-[11px] font-black text-[#E53935] uppercase ">{selectedAdv.rank}</p>
                 <div className="mt-12 space-y-6 w-full text-left">
                    <div className="flex gap-4">
                       <Video size={20} className="text-[#292828]/40" />
                       <p className="text-[13px] font-bold text-[#292828]">Video Call Session</p>
                    </div>
                    <div className="flex gap-4">
                       <FileText size={20} className="text-[#292828]/40" />
                       <p className="text-[13px] font-bold text-[#292828]">Follow-up Strategy Report</p>
                    </div>
                    <div className="flex gap-4">
                       <UserCheck size={20} className="text-[#292828]/40" />
                       <p className="text-[13px] font-bold text-[#292828]">Verified Expert</p>
                    </div>
                 </div>
              </div>

              {/* Booking Engine */}
              <div className="flex-1 p-12 lg:p-16 flex flex-col bg-white overflow-y-auto no-scrollbar">
                 <div className="flex items-center justify-between mb-12">
                    <h3 className="text-3xl font-black text-[#292828] uppercase tracking-tighter leading-none">Choose a <span className="text-[#E53935]">Time</span></h3>
                    <button onClick={() => setSelectedAdv(null)} className="h-12 w-12 bg-[#292828]/5 rounded-2xl flex items-center justify-center text-[#292828] hover:bg-[#E53935] hover:text-white transition-all"><X size={24} /></button>
                 </div>

                 <div className="space-y-12 flex-1">
                    <div>
                       <p className="text-[10px] font-black text-[#292828]/40 uppercase mb-6 tracking-widest">Available Dates</p>
                       <div className="grid grid-cols-4 gap-3">
                          {[18, 19, 20, 21, 22, 23, 24, 25].map(day => (
                            <button 
                              key={day} 
                              onClick={() => setSelectedDate(day)}
                              className={cn(
                                "h-20 border rounded-2xl flex flex-col items-center justify-center gap-1 transition-all",
                                selectedDate === day ? "bg-[#E53935] border-[#E53935] text-white shadow-xl shadow-red-500/20" : "bg-[#292828]/5 border-[#292828]/10 text-[#292828] hover:border-[#E53935]/50"
                              )}
                            >
                               <p className={cn("text-[10px] font-bold", selectedDate === day ? "text-white/80" : "text-[#292828]/60")}>MAY</p>
                               <p className="text-xl font-black">{day}</p>
                            </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <p className="text-[10px] font-black text-[#292828]/40 uppercase mb-6 tracking-widest">Available Slots</p>
                       <div className="flex flex-wrap gap-3">
                          {["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"].map(time => (
                            <button 
                              key={time} 
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                "px-6 py-4 border rounded-xl text-[12px] font-black transition-all uppercase",
                                selectedTime === time ? "bg-[#292828] border-[#292828] text-white" : "bg-[#292828]/5 border-[#292828]/10 text-[#292828] hover:border-[#E53935]"
                              )}
                            >
                               {time}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="mt-auto pt-10 border-t border-[#292828]/10 flex items-center justify-between">
                    <div>
                       <p className="text-[24px] font-black text-[#292828] leading-none mb-1">₹{selectedAdv.cost}</p>
                       <p className="text-[10px] font-bold text-[#292828]/30 uppercase tracking-widest">Total for 1 hour</p>
                    </div>
                    <button 
                       onClick={handleBooking}
                       disabled={!selectedDate || !selectedTime || bookingStatus !== "idle"}
                       className={cn(
                         "px-12 h-16 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3",
                         bookingStatus === "success" ? "bg-emerald-500 text-white" : "bg-[#E53935] text-white"
                       )}
                     >
                        {bookingStatus === "loading" && <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {bookingStatus === "idle" && "Confirm Booking"}
                        {bookingStatus === "loading" && "Processing..."}
                        {bookingStatus === "success" && <><CheckCircle2 size={18} /> Done</>}
                     </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
