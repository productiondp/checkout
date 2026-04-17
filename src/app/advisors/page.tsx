"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  LayoutGrid, 
  List, 
  Search, 
  DollarSign, 
  Clock, 
  Zap,
  CheckCircle2,
  Award,
  Globe,
  Briefcase,
  MessageSquare,
  Calendar,
  Video,
  ChevronRight,
  TrendingUp,
  Target,
  Rocket,
  Plus,
  X,
  FileText,
  UserCheck,
  MapPin,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADVISORS = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  name: [
    "Dr. Aruna Nair", "Vikas Menon", "Sana Maryam", "Rahul Sethi", "Deepika R.", "Karan Johar",
    "Anita Das", "Zayan F.", "Meera V.", "Aditya P.", "Sneha K.", "Rohan S.",
    "Priya M.", "Arjun V.", "Ishaan B.", "Ananya G.", "Sanya S.", "Kabir D.",
    "Zara H.", "Ayan K.", "Riya S.", "Noah J.", "Mila K.", "Liam P."
  ][i],
  firm: ["FinStrat Global", "LegalNode Kerala", "Growth Capital", "InnoTech Advisors", "Alpha Ops"][i % 5],
  specialty: ["Trade Finance", "Corporate Law", "Scale-up Advice", "Regional Logistics", "HR & Payroll"][i % 5],
  cost: Math.floor(Math.random() * 5000) + 2500,
  rating: (4.7 + Math.random() * 0.3).toFixed(1),
  reviews: Math.floor(Math.random() * 150) + 30,
  avatar: `https://i.pravatar.cc/200?u=adv${i + 1}`,
  rank: ["Elite Partner", "Top Rated", "Verified Expert"][i % 3],
  highlights: ["Former Technopark CEO", "Led 12 MSME Mergers", "Startup Fund Lead"][i % 3],
  available: i % 3 === 0,
  matchScore: Math.floor(Math.random() * 20) + 80
}));

const CATEGORIES = [
  { name: "Finance", icon: DollarSign, color: "bg-green-50 text-green-600" },
  { name: "Legal", icon: ShieldCheck, color: "bg-blue-50 text-blue-600" },
  { name: "Scaling", icon: Rocket, color: "bg-red-50 text-[#E53935]" },
  { name: "Business Help", icon: Target, color: "bg-purple-50 text-purple-600" },
  { name: "Tech", icon: Zap, color: "bg-orange-50 text-orange-600" }
];

export default function EliteAdvisorsPortal() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState("Scaling");
  const [search, setSearch] = useState("");
  const [selectedAdv, setSelectedAdv] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success">("idle");

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

  const filteredAdvisors = ADVISORS.filter(a => 
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.specialty.toLowerCase().includes(search.toLowerCase())) &&
    (a.specialty.includes(activeCategory) || activeCategory === "All")
  );

  return (
    <div className="flex flex-col min-h-screen bg-white lg:bg-[#FDFDFF] font-sans selection:bg-[#E53935]/10 overscroll-none">
      
      <div className="px-6 lg:px-12 pt-12">
         <div className="mb-8">
            <h1 className="text-4xl font-black text-[#292828] mb-2 leading-tight uppercase">Expert <span className="text-[#E53935]">Help</span>.</h1>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2 block">Get help from verified experts in your city.</p>
         </div>
         
         <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button 
               key={cat.name}
               onClick={() => setActiveCategory(cat.name)}
               className={cn(
                 "px-5 h-12 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 border",
                 activeCategory === cat.name ? "bg-[#E53935] border-[#E53935] text-white shadow-xl shadow-red-500/10" : "bg-white border-[#292828]/10 text-[#292828] hover:bg-slate-50"
               )}
              >
                 <cat.icon size={12} /> {cat.name}
              </button>
            ))}
         </div>
      </div>

      {/* 2. EXPLORATION HUB */}
      <div className="px-6 lg:px-12 py-12">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div className="relative w-full md:max-w-xl">
               <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#292828]/40" />
               <input 
                 type="text" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search for help..." 
                 className="w-full h-20 bg-white border border-[#292828]/10 rounded-[2rem] pl-16 pr-8 text-[16px] font-bold text-[#292828] outline-none focus:border-[#E53935]/20 focus:ring-8 focus:ring-red-500/5 shadow-2xl shadow-slate-200/20 transition-all"
               />
            </div>

            <div className="flex bg-[#292828]/10/50 p-1.5 rounded-2xl border border-[#292828]/10">
               <button onClick={() => setView("grid")} className={cn("h-12 px-6 flex items-center gap-2 rounded-xl transition-all font-black text-[10px] uppercase", view === "grid" ? "bg-white text-[#292828] shadow-md" : "text-[#292828] hover:text-[#292828]")}>
                  <LayoutGrid size={16} /> Grid
               </button>
               <button onClick={() => setView("list")} className={cn("h-12 px-6 flex items-center gap-2 rounded-xl transition-all font-black text-[10px] uppercase", view === "list" ? "bg-white text-[#292828] shadow-md" : "text-[#292828] hover:text-[#292828]")}>
                  <List size={16} /> List
               </button>
            </div>
         </div>

         {/* ADVISOR GRID (3 IN A ROW ON DESKTOP) */}
         <div className={cn(
           "grid gap-6 lg:gap-8 mb-40",
           view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
         )}>
           {filteredAdvisors.map(adv => (
             <div key={adv.id} className="group/adv relative">
                <div className={cn(
                   "bg-white border-[#F2F4F7] overflow-hidden transition-all duration-500 shadow-2xl shadow-slate-200/10 hover:border-[#E53935]/20",
                   view === "grid" ? "rounded-[2rem] border-2 flex flex-col p-1" : "rounded-[2rem] border flex items-center p-6"
                )}>
                   
                   {/* Visual Section */}
                   <Link href={`/profile/${adv.id}`} className={cn(
                      "relative overflow-hidden block",
                      view === "grid" ? "h-60 rounded-[1.75rem]" : "h-24 w-24 rounded-2xl shrink-0"
                   )}>
                      <img src={adv.avatar} className="w-full h-full object-cover grayscale transition-all duration-[2s] group-hover/adv:grayscale-0 group-hover/adv:scale-110" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover/adv:opacity-100 transition-opacity" />
                      
                      {adv.available && (
                        <div className="absolute top-5 left-5 px-3 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg flex items-center gap-1.5 border border-white/20">
                           <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" /> Online
                        </div>
                      )}

                      <div className="absolute top-5 right-5 h-10 w-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center text-[#E53935] shadow-xl opacity-0 group-hover/adv:opacity-100 transform translate-y-2 group-hover/adv:translate-y-0 transition-all">
                         <Star size={18} fill="currentColor" />
                      </div>
                   </Link>

                   {/* Content Section (Home Feed Style) */}
                   <div className={cn("flex-1", view === "grid" ? "p-6" : "pl-10 flex items-center justify-between")}>
                      <div className={view === "list" ? "flex items-center gap-12" : ""}>
                         <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-1.5">
                                  <h3 className="text-xl font-black text-[#292828] uppercase group-hover/adv:text-[#E53935] transition-colors">{adv.name}</h3>
                                  <CheckCircle2 size={18} className="text-[#E53935]" />
                               </div>
                               <div className="px-2 py-0.5 bg-green-50 text-green-600 rounded-lg text-[8px] font-black uppercase border border-green-100 shadow-sm">
                                  {adv.matchScore}% Match
                               </div>
                            </div>
                            
                            <p className="text-[11px] font-bold text-[#292828] capitalize flex items-center gap-2 mb-6">
                               <MapPin size={12} className="text-[#E53935]" /> {adv.firm} • {adv.firm.includes('Kerala') ? 'Kerala' : 'Main City'}
                            </p>

                            <div className="flex flex-wrap gap-2">
                               <span className="px-3 py-1 bg-[#292828]/5 text-[#292828] rounded-lg text-[9px] font-black uppercase border border-[#292828]/10">{adv.specialty}</span>
                               <span className="px-3 py-1 bg-[#E53935]/5 text-[#E53935] rounded-lg text-[9px] font-black uppercase border border-[#E53935]/10">{adv.rank}</span>
                            </div>
                         </div>

                         {/* Excellence Highlight Panel */}
                         <div className="p-4 bg-[#292828]/5 rounded-2xl border border-[#292828]/10 flex items-center gap-4 mb-8 group-hover/adv:bg-white transition-colors">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#292828]/40 group-hover/adv:text-[#E53935] transition-colors shadow-sm">
                               <Award size={20} />
                            </div>
                            <div>
                               <p className="text-[11px] font-black text-[#292828] leading-none mb-1">{adv.rating} Excellence Score</p>
                               <p className="text-[10px] font-bold text-[#292828] capitalize">{adv.highlights}</p>
                            </div>
                         </div>
                      </div>

                      {/* Footer Actions (Home Feed Style) */}
                      <div className={cn(
                        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#292828]/5",
                        view === "list" ? "gap-10 border-t-0 pt-0" : ""
                      )}>
                         <div>
                            <p className="text-[9px] font-black text-[#292828]/40 uppercase leading-none mb-1">Price</p>
                            <p className="text-2xl font-black text-[#292828] leading-none">₹{adv.cost}<span className="text-sm font-bold text-[#292828] not-italic">/hr</span></p>
                         </div>
                         <button 
                           onClick={() => setSelectedAdv(adv)}
                           className="w-full sm:w-auto px-8 h-14 bg-[#292828] text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-[#E53935] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn"
                         >
                            Book Now <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           ))}
         </div>
      </div>

      {/* 3. BOOKING ENGINE MODAL (UNCHANGED LOGIC, POLISHED UI) */}
      {selectedAdv && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#292828]/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="relative w-full max-w-4xl bg-white rounded-[4rem] overflow-hidden shadow-4xl animate-in zoom-in-95 duration-500 flex flex-col lg:flex-row h-[80vh]">
              
              {/* Profile Bar */}
              <div className="w-full lg:w-[320px] bg-[#292828]/5 p-12 flex flex-col items-center text-center">
                 <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 border-4 border-white">
                    <img src={selectedAdv.avatar} className="w-full h-full object-cover" alt="" />
                 </div>
                 <h2 className="text-2xl font-black text-[#292828] mb-1 uppercase">{selectedAdv.name}</h2>
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
                    <h3 className="text-3xl font-black text-[#292828] uppercase">Choose a <span className="text-[#E53935]">Time</span></h3>
                    <button onClick={() => setSelectedAdv(null)} className="h-12 w-12 bg-[#292828]/5 rounded-2xl flex items-center justify-center text-[#292828] hover:text-[#292828] transition-all"><X size={24} /></button>
                 </div>

                 <div className="space-y-12 flex-1">
                    <div>
                       <p className="text-[10px] font-black text-[#292828]/40 uppercase mb-6">Available Dates</p>
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
                               <p className={cn("text-[10px] font-bold", selectedDate === day ? "text-white/80" : "text-[#292828]/60")}>OCT</p>
                               <p className="text-xl font-black">{day}</p>
                            </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <p className="text-[10px] font-black text-[#292828]/40 uppercase mb-6">Available Slots</p>
                       <div className="flex flex-wrap gap-3">
                          {["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"].map(time => (
                            <button 
                              key={time} 
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                "px-6 py-4 border rounded-xl text-[12px] font-black transition-all",
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
                       <p className="text-[24px] font-black text-[#292828]">₹{selectedAdv.cost}</p>
                       <p className="text-[10px] font-bold text-[#292828] uppercase ">Total for 1 hour</p>
                    </div>
                    <button 
                       onClick={handleBooking}
                       disabled={!selectedDate || !selectedTime || bookingStatus !== "idle"}
                       className={cn(
                         "px-12 h-16 rounded-[1.5rem] font-black text-[12px] uppercase shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3",
                         bookingStatus === "success" ? "bg-green-500 text-white" : "bg-[#E53935] text-white"
                       )}
                     >
                        {bookingStatus === "loading" && <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {bookingStatus === "idle" && "Book Now"}
                        {bookingStatus === "loading" && "Processing..."}
                        {bookingStatus === "success" && <><CheckCircle2 size={18} /> Booking Confirmed</>}
                     </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
