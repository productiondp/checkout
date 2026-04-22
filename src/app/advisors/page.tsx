"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Calendar, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  Award,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export default function AdvisorDirectoryPage() {
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState({ date: "", context: "" });

  const supabase = createClient();

  useEffect(() => {
    async function loadAdvisors() {
      setIsLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'ADVISOR')
        .order('match_score', { ascending: false });
      
      if (data) setAdvisors(data);
      setIsLoading(false);
    }
    loadAdvisors();
  }, []);

  const handleBooking = async (expert: any) => {
    setSelectedExpert(expert);
    setBookingData({ date: "", context: "" });
    setIsBookingModalOpen(true);
  };

  const confirmBooking = async () => {
    if (!bookingData.date || !bookingData.context) {
      alert("Please define session context and date.");
      return;
    }

    setIsProcessing(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Authentication required for tactical bookings.");
      setIsProcessing(false);
      return;
    }

    // 1. Create Booking
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        advisor_id: selectedExpert.id,
        client_id: user.id,
        scheduled_at: new Date(bookingData.date).toISOString(),
        status: 'PENDING'
      }]);

    if (bookingError) {
      alert("Booking failed: " + bookingError.message);
    } else {
      // 2. Notify Advisor
      await supabase.from('notifications').insert([{
         user_id: selectedExpert.id,
         title: 'New Session Request',
         message: `${user.email || 'A client'} requested a tactical session on ${bookingData.date}.`,
         type: 'BOOKING',
         link: '/home'
      }]);

      alert("Booking Request Synchronized. Awaiting Advisor Confirmation.");
      setIsBookingModalOpen(false);
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40">
      
      {/* 1. ELITE SEARCH HEADER */}
      <section className="bg-[#292828] pt-24 pb-32 px-10 relative overflow-hidden text-white">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E53935]/15 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3" />
         
         <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="h-1px w-12 bg-[#E53935]" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E53935]">Elite Expert Network</p>
            </div>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-8">
               Tactical <br /> Advisors
            </h1>
            <p className="text-xl font-medium text-white/50 max-w-2xl leading-relaxed mb-12">
               Connect with verified domain specialists to solve bottlenecks, scale operations, or validate strategic mandates in your region.
            </p>

            <div className="max-w-3xl relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E53935] transition-colors" size={24} />
               <input 
                 type="text" 
                 placeholder="Search by expertise (e.g. FMCG Growth, UI/UX, Legal)..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl pl-20 pr-8 text-lg font-bold outline-none focus:bg-white/10 focus:border-[#E53935] transition-all placeholder:text-white/20"
               />
            </div>
         </div>
      </section>

      {/* 2. ADVISOR GRID */}
      <div className="max-w-6xl mx-auto px-6 -mt-16">
         <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-[#292828]/5 mb-12 flex items-center justify-between px-8">
            <div className="flex items-center gap-8">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-[#292828]/30 tracking-widest leading-none mb-1">Active Now</span>
                  <span className="text-xl font-black text-[#292828]">248 Experts</span>
               </div>
               <div className="h-10 w-px bg-slate-100" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-[#292828]/30 tracking-widest leading-none mb-1">Verified Base</span>
                  <span className="text-xl font-black text-[#E53935]">Top 1%</span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               {['Strategy', 'Tech', 'Design', 'Marketing'].map(cat => (
                 <button key={cat} className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold uppercase transition-all hover:bg-[#292828] hover:text-white">{cat}</button>
               ))}
            </div>
         </div>

         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[1,2,3,4].map(i => <div key={i} className="h-80 bg-slate-100 rounded-[2.5rem] animate-pulse" />)}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
               {advisors.map((advisor) => (
                  <div key={advisor.id} className="bg-white rounded-[2.5rem] p-10 border border-[#292828]/5 shadow-xl hover:shadow-4xl transition-all duration-500 group relative overflow-hidden">
                     
                     <div className="flex gap-8 items-start relative z-10">
                        <div className="relative shrink-0">
                           <div className="h-32 w-32 rounded-[2rem] overflow-hidden border-4 border-slate-50 group-hover:scale-105 transition-transform duration-700">
                              <img src={advisor.avatar_url || `https://i.pravatar.cc/150?u=${advisor.id}`} className="w-full h-full object-cover grayscale brightness-110" alt="" />
                           </div>
                           <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white">
                              <ShieldCheck size={20} />
                           </div>
                        </div>

                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-2">
                              <div className="px-3 py-1 bg-[#292828] text-white text-[8px] font-black uppercase rounded-lg tracking-widest">
                                 Verified Advisor
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <Zap size={14} className="text-[#E53935] fill-[#E53935]" />
                                 <span className="text-2xl font-black text-[#292828]">{advisor.match_score}%</span>
                              </div>
                           </div>
                           <h3 className="text-3xl font-black text-[#292828] uppercase tracking-tighter leading-none mb-4 group-hover:text-[#E53935] transition-colors">{advisor.full_name}</h3>
                           <p className="text-[13px] font-medium text-[#292828]/60 line-clamp-2 leading-relaxed mb-6">
                              {advisor.bio || "Specialist in strategic business development and high-authority operational scaling."}
                           </p>
                           
                           <div className="flex flex-wrap gap-2">
                              {['Scaling', 'Strategy', 'UI/UX'].map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black uppercase text-[#292828]/40 border border-slate-100">{tag}</span>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Session Cost</span>
                              <span className="text-xl font-black text-[#292828]">₹2,500 <span className="text-[9px] opacity-30">/ HR</span></span>
                           </div>
                           <div className="h-8 w-px bg-slate-100" />
                           <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Availability</span>
                              <span className="text-[12px] font-bold text-emerald-600">Immediate</span>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleBooking(advisor)}
                          className="h-14 px-8 bg-[#292828] text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-xl active:scale-95"
                        >
                           Book Session <Calendar size={18} />
                        </button>
                     </div>

                     {/* Cinematic Backdrop Accent */}
                     <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                        <Award size={200} strokeWidth={1} />
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* BOOKING MODAL */}
      {isBookingModalOpen && selectedExpert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-12 shadow-4xl animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-2xl font-black text-[#292828] uppercase">Tactical <span className="text-[#E53935]">Booking</span></h2>
                 <button onClick={() => setIsBookingModalOpen(false)} className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><Circle size={20} /></button>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6 mb-10">
                 <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                    <img src={selectedExpert.avatar_url || `https://i.pravatar.cc/150?u=${selectedExpert.id}`} className="w-full h-full object-cover grayscale" alt="" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-[#292828] leading-tight mb-1">{selectedExpert.full_name}</h3>
                    <p className="text-[10px] font-black text-[#E53935] uppercase tracking-widest">{selectedExpert.role} • 1 HR Session</p>
                 </div>
              </div>

              <div className="space-y-8">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Select Date</label>
                    <input 
                      type="date" 
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-[#292828] outline-none focus:border-[#E53935]" 
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Session Context</label>
                    <textarea 
                      rows={3} 
                      placeholder="What operational bottleneck are we solving?" 
                      value={bookingData.context}
                      onChange={(e) => setBookingData({...bookingData, context: e.target.value})}
                      className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-[#292828] outline-none focus:border-[#E53935]" 
                    />
                 </div>
                 
                 <div className="p-6 bg-[#292828] rounded-[2rem] text-white">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Service Fee</span>
                       <span className="text-xl font-black">₹2,500</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Platform Tax</span>
                       <span className="text-xl font-black">₹250</span>
                    </div>
                    <div className="h-px bg-white/10 mb-6" />
                    <button 
                      onClick={confirmBooking}
                      disabled={isProcessing}
                      className="w-full h-16 bg-[#E53935] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                       {isProcessing ? "Synchronizing..." : "Initialize Payment Terminal"}
                    </button>
                    <p className="text-center text-[8px] font-black text-white/20 uppercase mt-4 tracking-widest">Secured by Checkout Neural Ledger</p>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
