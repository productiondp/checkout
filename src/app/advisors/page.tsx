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
  Circle,
  ChevronRight,
  Sparkles,
  Shield,
  Target,
  Maximize2,
  X
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Authentication required for revenue-locked mandates.");
      setIsProcessing(false);
      return;
    }
    const simulatedPaymentId = `pay_${Math.random().toString(36).substring(7)}`;
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        advisor_id: selectedExpert.id,
        client_id: user.id,
        scheduled_at: new Date(bookingData.date).toISOString(),
        payment_intent_id: simulatedPaymentId,
        status: 'PENDING'
      }]);

    if (bookingError) {
      alert("Ledger synchronization failed: " + bookingError.message);
    } else {
      await supabase.from('notifications').insert([{
         user_id: selectedExpert.id,
         title: 'Verified Mandate Received',
         message: `${user.full_name || user.email} has initialized a tactical session. Payment Verified: ${simulatedPaymentId}`,
         type: 'BOOKING',
         link: '/home'
      }]);
      alert(`Transaction Successful. Mandate synchronized with Ledger: ${simulatedPaymentId}`);
      setIsBookingModalOpen(false);
    }
    setIsProcessing(false);
  };

  const filteredAdvisors = advisors.filter(a => 
    a.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-40 selection:bg-[#E53935]/10">
      
      {/* 1. PRISTINE EXPERT HERO - WHITE AESTHETIC */}
      <section className="bg-white border-b border-slate-100 pt-32 pb-44 px-6 lg:px-10 relative overflow-hidden">
         {/* Background Subtle Accents */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E53935]/[0.02] rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         <div className="absolute top-1/4 left-0 w-2 h-24 bg-[#E53935] rounded-full opacity-10" />
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
               <div className="max-w-3xl">
                  <div className="flex items-center gap-4 mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
                     <div className="h-0.5 w-16 bg-[#E53935]" />
                     <p className="text-[12px] font-black uppercase tracking-[0.5em] text-[#292828]/40">Expert Advisory Network</p>
                  </div>
                  <h1 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-[#292828] mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                     Strategic <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#292828] to-[#292828]/40">Advisors</span>
                  </h1>
                  <p className="text-xl lg:text-2xl font-medium text-[#292828]/50 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
                     Authorize high-authority mandates with verified regional domain specialists. Solve bottlenecks, scale operations, and validate tactical intelligence.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4 lg:gap-6 animate-in fade-in slide-in-from-right-8 duration-1000">
                  <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-premium flex flex-col items-center justify-center text-center">
                     <p className="text-4xl font-black text-[#292828] tabular-nums">1%</p>
                     <p className="text-[10px] font-black uppercase text-[#292828]/20 tracking-widest mt-2">Verified Tier</p>
                  </div>
                  <div className="p-8 bg-[#292828] border border-[#292828] rounded-[2.5rem] shadow-4xl flex flex-col items-center justify-center text-center text-white">
                     <p className="text-4xl font-black tabular-nums">24/7</p>
                     <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mt-2">Availability</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 2. DISCOVERY HUB - FLOATING WHITE DOCK */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 lg:-mt-28 relative z-20">
         
         <div className="bg-white/80 backdrop-blur-2xl p-6 rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col lg:flex-row items-center gap-6 transition-all hover:shadow-[0_64px_128px_-16px_rgba(0,0,0,0.12)] group/dock">
            <div className="w-full relative">
               <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/dock:text-[#E53935] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search by expertise (e.g. Scaling, Strategy, Mandates)..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-20 bg-slate-50 border border-transparent rounded-[2rem] pl-20 pr-10 text-lg font-black text-[#292828] focus:bg-white focus:border-[#E53935] outline-none transition-all placeholder:text-[#292828]/10"
               />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 w-full lg:w-auto px-4">
               {['All', 'Strategy', 'Tech', 'Scaling', 'Marketing'].map(cat => (
                 <button key={cat} className="h-14 px-8 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#292828]/40 hover:text-white hover:bg-[#292828] hover:border-[#292828] transition-all whitespace-nowrap active:scale-95">{cat}</button>
               ))}
            </div>
         </div>

         {/* EXPERT GRID */}
         <div className="mt-20">
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[1,2,3,4].map(i => <div key={i} className="h-[460px] bg-white border border-slate-50 rounded-[4rem] animate-pulse" />)}
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-20 duration-1000">
                  {filteredAdvisors.map((advisor) => (
                     <div key={advisor.id} className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-xl hover:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.06)] hover:-translate-y-4 transition-all duration-700 group relative overflow-hidden h-full flex flex-col">
                        
                        {/* Advisor Identity Hub */}
                        <div className="flex flex-col lg:flex-row gap-10 items-start relative z-10 mb-12 flex-1">
                           <div className="relative shrink-0 mx-auto lg:mx-0">
                              <div className="h-44 w-44 rounded-[3.5rem] overflow-hidden border-[6px] border-slate-50 group-hover:scale-105 group-hover:rotate-3 transition-all duration-700 shadow-2xl relative">
                                 <img src={advisor.avatar_url || `https://i.pravatar.cc/200?u=${advisor.id}`} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" alt="" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-[#292828]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="absolute -bottom-4 -right-4 h-14 w-14 bg-[#292828] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl border-4 border-white group-hover:bg-[#E53935] transition-all duration-700 group-hover:rotate-12">
                                 <ShieldCheck size={24} />
                              </div>
                           </div>

                           <div className="flex-1 text-center lg:text-left">
                              <div className="flex items-center justify-center lg:justify-between mb-4 gap-4">
                                 <div className="px-4 py-1.5 bg-[#292828]/5 border border-[#292828]/5 text-[#292828]/40 text-[9px] font-black uppercase rounded-xl tracking-[0.2em]">Verified Expert Node</div>
                                 <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-[#E53935] animate-pulse" />
                                    <span className="text-3xl font-black text-[#292828] tracking-tighter">{advisor.match_score || 98}%</span>
                                 </div>
                              </div>
                              <h3 className="text-4xl lg:text-5xl font-black text-[#292828] uppercase tracking-tighter leading-[0.9] mb-6 group-hover:text-[#E53935] transition-colors duration-500">{advisor.full_name}</h3>
                              <p className="text-[15px] font-semibold text-[#292828]/40 leading-relaxed mb-8">
                                 {advisor.bio || "High-authority specialist focusing on regional operational scaling and tactical business intelligence mandates."}
                              </p>
                              
                              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                 {['Scaling', 'Strategy', 'Intelligence'].map(tag => (
                                   <span key={tag} className="px-4 py-2 bg-slate-50/80 border border-slate-100 rounded-2xl text-[11px] font-black uppercase text-[#292828]/30 tracking-tight transition-all hover:bg-[#292828]/5 hover:text-[#292828] cursor-default">{tag}</span>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Advisor Action Terminal */}
                        <div className="mt-auto pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
                           <div className="flex items-center gap-6">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5 leading-none">Session Value</span>
                                 <span className="text-3xl font-black text-[#292828]">₹2,500 <span className="text-[12px] text-slate-300">/ HR</span></span>
                              </div>
                              <div className="h-12 w-px bg-slate-100" />
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5 leading-none">Authority</span>
                                 <div className="flex items-center gap-1.5">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={10} className={cn("fill-current", i <= 5 ? "text-[#E53935]" : "text-slate-100")} />)}
                                 </div>
                              </div>
                           </div>
                           <button 
                             onClick={() => handleBooking(advisor)}
                             className="h-16 w-full sm:w-auto px-10 bg-[#292828] text-white rounded-[1.75rem] flex items-center justify-center gap-4 font-black text-[13px] uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] active:scale-95 group/btn overflow-hidden relative"
                           >
                              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                              <span className="relative z-10">Hire Expert</span> <Calendar size={20} className="relative z-10" />
                           </button>
                        </div>

                        {/* Backdrop Decal Accent */}
                        <div className="absolute -bottom-20 -right-20 text-[#292828]/[0.02] group-hover:text-[#E53935]/[0.04] transition-all duration-1000 -rotate-12 group-hover:rotate-6 pointer-events-none">
                           <Award size={320} strokeWidth={1} />
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>

      {/* 3. TACTICAL BOOKING TERMINAL - LIGHT GLASSMORPHISM */}
      {isBookingModalOpen && selectedExpert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#292828]/40 backdrop-blur-md animate-in fade-in duration-500">
           {/* Backdrop Overlay */}
           <div className="absolute inset-0" onClick={() => setIsBookingModalOpen(false)} />
           
           <div className="w-full max-w-2xl bg-white rounded-[4rem] p-12 lg:p-16 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto no-scrollbar relative z-10 border border-white">
              
              <button 
                onClick={() => setIsBookingModalOpen(false)} 
                className="absolute top-10 right-10 h-14 w-14 bg-slate-50 hover:bg-red-50 hover:text-[#E53935] rounded-3xl flex items-center justify-center text-slate-300 transition-all group active:scale-90"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>

              <div className="mb-14">
                 <h2 className="text-[12px] font-black text-[#E53935] uppercase tracking-[0.4em] mb-4">Tactical Initialization</h2>
                 <h3 className="text-4xl font-black text-[#292828] uppercase tracking-tighter leading-none">Booking <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#292828] to-[#292828]/40">Mandate</span></h3>
              </div>
              
              <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-[3rem] flex items-center gap-8 mb-12 shadow-inner">
                 <div className="h-24 w-24 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white shrink-0">
                    <img src={selectedExpert.avatar_url || `https://i.pravatar.cc/200?u=${selectedExpert.id}`} className="w-full h-full object-cover grayscale" alt="" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-[#292828] leading-tight mb-2 uppercase tracking-tight">{selectedExpert.full_name}</h3>
                    <div className="flex items-center gap-3">
                       <span className="px-3 py-1 bg-[#292828] text-white text-[9px] font-black uppercase rounded-lg">Advisor Tier</span>
                       <span className="text-[11px] font-bold text-slate-400">1 HR Direct Consultation</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <label className="text-[10px] font-black uppercase text-[#292828]/30 mb-3 block tracking-widest px-2">Deployment Date</label>
                       <input 
                         type="date" 
                         value={bookingData.date}
                         onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                         className="w-full h-16 px-8 bg-slate-50 border border-transparent rounded-[1.5rem] font-black text-[#292828] outline-none focus:bg-white focus:border-[#E53935] transition-all shadow-sm" 
                       />
                    </div>
                    <div className="flex flex-col justify-end">
                       <div className="h-16 px-8 bg-slate-50 border border-dashed border-slate-200 rounded-[1.5rem] flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase text-slate-300">Authority Lock</span>
                          <ShieldCheck size={20} className="text-[#E53935]" />
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black uppercase text-[#292828]/30 mb-3 block tracking-widest px-2">Session Context / Mandate Goals</label>
                    <textarea 
                      rows={3} 
                      placeholder="Define the operational bottlenecks we are targeting..." 
                      value={bookingData.context}
                      onChange={(e) => setBookingData({...bookingData, context: e.target.value})}
                      className="w-full p-8 bg-slate-50 border border-transparent rounded-[2rem] font-bold text-[#292828] outline-none focus:bg-white focus:border-[#E53935] transition-all shadow-sm placeholder:text-slate-300" 
                    />
                 </div>
                 
                 <div className="p-10 bg-[#111111] rounded-[3.5rem] text-white shadow-4xl relative overflow-hidden group/pay">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#E53935]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="space-y-4 mb-10 relative z-10">
                       <div className="flex justify-between items-center">
                          <span className="text-[12px] font-black uppercase text-white/30 tracking-widest">Consultation Fee</span>
                          <span className="text-2xl font-black tabular-nums">₹2,500</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[12px] font-black uppercase text-white/30 tracking-widest">Platform Authority Tax</span>
                          <span className="text-2xl font-black tabular-nums">₹250</span>
                       </div>
                       <div className="h-px bg-white/10 my-6" />
                       <div className="flex justify-between items-center">
                          <span className="text-[14px] font-black uppercase tracking-widest">Final Ledger Mandate</span>
                          <span className="text-4xl font-black text-[#E53935] tabular-nums">₹2,750</span>
                       </div>
                    </div>

                    <button 
                      onClick={confirmBooking}
                      disabled={isProcessing}
                      className="w-full h-20 bg-[#E53935] text-white rounded-[1.75rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-[#ff4d4d] active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden group/final"
                    >
                       <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/final:translate-x-[100%] transition-transform duration-[2s]" />
                       <span className="relative z-10">{isProcessing ? "Synchronizing Ledger..." : "Authorize Payment Terminal"}</span>
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
                       <Lock size={10} className="text-white/20" />
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Secured by Checkout Neural Ledger v7.0</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
