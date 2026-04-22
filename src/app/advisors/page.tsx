"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  MapPin, 
  ChevronDown,
  LayoutGrid,
  List,
  ArrowUpRight,
  X,
  Video,
  FileText,
  Plus,
  Zap,
  Sparkles,
  Award,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import PostModal from "@/components/modals/PostModal";

const CATEGORIES = ["All", "Strategy", "Tech", "Growth", "Logistics", "Sales", "Fintech", "AI", "Legal"];

export default function BusinessAdvisorsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAdv, setSelectedAdv] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isPosting, setIsPosting] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  React.useEffect(() => {
    async function fetchAdvisors() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'ADVISOR');

      if (data && data.length > 0) {
        const mapped = data.map(p => ({
          ...p,
          name: p.full_name || "Expert",
          avatar: p.avatar_url || `https://i.pravatar.cc/150?u=${p.id}`,
          role: p.bio?.split('.')[0] || "Advisor", // Use first sentence of bio as role if role is generic
          company: p.location || "Global Hub",
          tags: p.domains || ["Expert"],
          match: p.match_score || 90,
          city: p.location || "Virtual"
        }));
        setAdvisors(mapped);
      } else {
        setAdvisors(DUMMY_PROFILES);
      }
      setIsLoading(false);
    }
    fetchAdvisors();
  }, []);

  const filteredAdvisors = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = advisors.filter(profile => {
      const matchesCategory = activeCategory === "All" || (profile.tags && profile.tags.includes(activeCategory));
      const matchesSearch = !query || 
                            profile.name.toLowerCase().includes(query) || 
                            profile.role.toLowerCase().includes(query) ||
                            (profile.company && profile.company.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
    return filtered.sort((a, b) => (b.match || 0) - (a.match || 0));
  }, [activeCategory, searchQuery, advisors]);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    setBookingStatus("loading");
    setTimeout(() => {
      setBookingStatus("success");
      setTimeout(() => {
        setSelectedAdv(null);
        setBookingStatus("idle");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-[#292828] selection:bg-[#E53935]/10 font-sans p-6 lg:p-12">
      
      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <header className="max-w-7xl mx-auto mb-16 space-y-10">
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#292828]/5 pb-12">
            <div className="space-y-4">
               <div className="label-premium">
                  <Sparkles size={10} className="animate-pulse" /> Expert Marketplace
               </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl mb-0 tracking-tight font-black uppercase">
                   Advisors<span className="text-[#E53935]">.</span>
                </h1>
               <p className="text-slate-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                  The world's most capable strategic and technical talent, vetted for performance and ready to scale your network.
               </p>
            </div>

            <div className="flex items-center gap-4">
               <button 
                  onClick={() => setIsPosting(true)}
                  className="h-16 px-10 bg-[#E53935] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
               >
                  Host Expert Node
               </button>
            </div>
         </div>

         {/* FILTERS & SEARCH (Unified Logical Strip) */}
         <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
            <div className="relative flex-1 w-full group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E53935] transition-colors" size={20} />
               <input 
                  type="text" 
                  placeholder="Search expert registry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-8 text-[15px] font-bold outline-none focus:bg-white focus:border-[#292828]/10 transition-all shadow-sm"
               />
            </div>

            <div className="relative">
               <button 
                  onClick={() => setIsDomainOpen(!isDomainOpen)}
                  className="h-16 px-8 bg-white border border-slate-100 rounded-2xl flex items-center gap-6 text-[11px] font-black uppercase shadow-sm hover:border-[#292828]/10 transition-all"
               >
                  <span className="text-slate-400">Domain:</span>
                  <span>{activeCategory}</span>
                  <ChevronDown size={16} className={cn("transition-transform", isDomainOpen && "rotate-180")} />
               </button>
               {isDomainOpen && (
                 <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => { setActiveCategory(cat); setIsDomainOpen(false); }}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center justify-between group",
                          activeCategory === cat ? "bg-[#292828] text-white" : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                         {cat}
                         {activeCategory === cat && <ChevronRight size={14} />}
                      </button>
                    ))}
                 </div>
               )}
            </div>

            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
               <button onClick={() => setViewMode("grid")} className={cn("p-3 rounded-xl transition-all", viewMode === "grid" ? "bg-white shadow-sm text-[#292828]" : "text-slate-300")}><LayoutGrid size={20} /></button>
               <button onClick={() => setViewMode("list")} className={cn("p-3 rounded-xl transition-all", viewMode === "list" ? "bg-white shadow-sm text-[#292828]" : "text-slate-300")}><List size={20} /></button>
            </div>
         </div>
      </header>

      {/* ── GRID ──────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto pb-40">
         <div className={cn(
            "grid gap-8",
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col max-w-4xl"
         )}>
            {filteredAdvisors.map(profile => (
              <div 
                key={profile.id}
                onClick={() => setSelectedAdv({ ...profile, cost: 2500, rank: "National Authority" })}
                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-[#E53935]/20 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="flex flex-col gap-8">
                   <div className="flex items-start justify-between">
                      <div className="h-24 w-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl relative group-hover:scale-105 transition-transform duration-500">
                         <img src={profile.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                      </div>
                      <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-xl border border-emerald-100">
                        {profile.match}% Match
                      </div>
                   </div>

                   <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-3xl mb-0 leading-none">{profile.name}</h3>
                        <CheckCircle2 size={20} className="text-[#E53935]" />
                      </div>
                      <p className="subheading-editorial !text-slate-400 mb-6">{profile.role} @ {profile.company}</p>
                      
                    <div className="flex flex-wrap gap-2 mb-10">
                      {profile.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[9px] font-black uppercase rounded-lg border border-slate-100">{tag}</span>
                      ))}
                    </div>

                      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-300">
                            <MapPin size={14} className="text-[#E53935]" /> {profile.city}
                         </div>
                         <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#292828] group-hover:text-white transition-all">
                            <ArrowUpRight size={22} />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </main>

      {/* ── BOOKING MODAL ──────────────────────────────────────────────── */}
      {selectedAdv && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedAdv(null)} />
           <div className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-4xl animate-in zoom-in-95 duration-700 flex flex-col lg:flex-row h-[85vh]">
              
              <div className="w-full lg:w-[350px] bg-slate-50 p-12 flex flex-col items-center border-r border-slate-100">
                 <div className="h-40 w-40 rounded-[3rem] overflow-hidden shadow-2xl mb-8 border-4 border-white">
                    <img src={selectedAdv.avatar} className="w-full h-full object-cover" alt="" />
                 </div>
                 <h2 className="text-3xl mb-1">{selectedAdv.name}</h2>
                 <p className="subheading-editorial !text-[#E53935] mb-12">{selectedAdv.rank}</p>
                 
                 <div className="space-y-4 w-full">
                    {[
                      { icon: <Video />, label: "Session", val: "Secure Video" },
                      { icon: <FileText />, label: "Output", val: "Strategy PDF" }
                    ].map((it, i) => (
                      <div key={i} className="p-5 bg-white rounded-2xl flex items-center gap-4 border border-slate-100">
                         <div className="h-10 w-10 bg-[#292828] text-white rounded-xl flex items-center justify-center">{it.icon}</div>
                         <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">{it.label}</p>
                            <p className="text-[13px] font-bold">{it.val}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="flex-1 p-12 lg:p-20 flex flex-col relative overflow-y-auto no-scrollbar">
                 <button onClick={() => setSelectedAdv(null)} className="absolute top-12 right-12 h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-[#E53935] hover:text-white transition-all"><X size={28} /></button>
                 
                 <div className="mb-16">
                    <p className="subheading-editorial !text-[#E53935] mb-2">Step 01: Availability</p>
                    <h2 className="text-5xl lg:text-7xl font-black mb-0 tracking-tighter">Reserve Slot<span className="text-slate-200">.</span></h2>
                 </div>

                 <div className="space-y-12 flex-1">
                    <div>
                       <p className="text-[10px] font-black text-slate-300 uppercase mb-8 tracking-widest">Select Date</p>
                       <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                          {[18, 19, 20, 21, 22, 23, 24].map(day => (
                            <button 
                              key={day} 
                              onClick={() => setSelectedDate(day)}
                              className={cn(
                                "h-20 rounded-2xl border transition-all flex flex-col items-center justify-center",
                                selectedDate === day 
                                  ? "bg-[#292828] border-[#292828] text-white shadow-xl scale-105" 
                                  : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200"
                              )}
                            >
                               <p className="text-[8px] font-black uppercase opacity-40">MAY</p>
                               <p className="text-xl font-black">{day}</p>
                            </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <p className="text-[10px] font-black text-slate-300 uppercase mb-8 tracking-widest">Select Time</p>
                       <div className="flex flex-wrap gap-3">
                          {["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"].map(time => (
                            <button 
                              key={time} 
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                "px-8 py-5 rounded-2xl border text-[11px] font-black transition-all uppercase",
                                selectedTime === time 
                                  ? "bg-[#E53935] border-[#E53935] text-white shadow-xl" 
                                  : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200"
                              )}
                            >
                               {time}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 pt-10 border-t border-slate-50 flex items-center justify-between">
                    <div>
                       <p className="text-4xl font-black leading-none mb-2">₹{selectedAdv.cost}</p>
                       <p className="subheading-editorial !mb-0 !text-slate-300">Professional Fee</p>
                    </div>
                    <button 
                       onClick={handleBooking}
                       disabled={!selectedDate || !selectedTime || bookingStatus !== "idle"}
                       className={cn(
                         "h-24 px-16 rounded-[2rem] font-black text-[12px] uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-4 shadow-xl shadow-red-500/10",
                         bookingStatus === "success" 
                           ? "bg-emerald-500 text-white" 
                           : "bg-[#292828] text-white hover:bg-[#E53935]"
                       )}
                    >
                       {bookingStatus === "loading" ? "Processing..." : bookingStatus === "success" ? "Success" : <><Zap size={20} fill="currentColor" /> Confirm Session</>}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {isPosting && (
        <PostModal isOpen={isPosting} onClose={() => setIsPosting(false)} onPostSuccess={() => setIsPosting(false)} />
      )}
    </div>
  );
}
