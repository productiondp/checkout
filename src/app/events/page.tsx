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
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import PostModal from "@/components/modals/PostModal";

const EXPOS: any[] = [];

export default function BusinessExposPage() {
  const [selectedExpo, setSelectedExpo] = useState<any>(null);
  const [registeredList, setRegisteredList] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "businesses" | "map">("upcoming");
  const [isPosting, setIsPosting] = useState(false);

  const handlePostSuccess = (post: any) => {
    console.log("Events Page Post Success:", post);
    setIsPosting(false);
  };

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
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E53935]/10 border border-[#E53935]/20 text-[#E53935] text-[9px] font-black uppercase tracking-widest mb-3">
                    Business Discovery
                 </div>
                 <h2 className="text-4xl font-black text-[#292828] tracking-tighter uppercase leading-none">Events Hub</h2>
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
                            <h3 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-[0.9] tracking-tighter uppercase whitespace-pre-line">{EXPOS[0].title}</h3>
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
                              <h4 className="text-2xl font-black text-[#292828] mb-4 leading-tight group-hover:text-[#E53935] transition-colors uppercase tracking-tighter">{expo.title}</h4>
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
             <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-[#292828]/10 rounded-[3rem] text-[#292828]/20 w-full overflow-hidden">
                <Building2 size={64} strokeWidth={1} className="mb-6 opacity-20" />
                <p className="text-[14px] font-black uppercase tracking-[0.2em]">Zero Live Businesses Found</p>
                <p className="text-[11px] font-bold mt-2 uppercase">Connect to a hub to see exhibitor lists.</p>
             </div>
           )}

           {activeTab === "map" && (
              <div className="py-40 border-2 border-dashed border-[#292828]/10 rounded-[3rem] text-center">
                 <div className="h-24 w-24 bg-[#292828]/5 rounded-3xl mx-auto mb-8 flex items-center justify-center text-[#292828]/20">
                    <LayoutGrid size={48} strokeWidth={1} />
                 </div>
                 <h4 className="text-2xl font-black text-[#292828] mb-4 uppercase tracking-tighter">Venue Intelligence</h4>
                 <p className="text-[13px] font-medium text-[#292828]/40 max-w-sm mx-auto uppercase tracking-wide leading-relaxed">Interactive node mapping and real-time exhibitor movement tracking is currently in sync phase.</p>
              </div>
           )}
        </div>
      </div>

      {/* 2. REGIONAL PULSE (RIGHT) */}
      <aside className="hidden xl:flex flex-col w-[380px] xl:w-[400px] 2xl:w-[450px] h-screen sticky top-0 bg-slate-50/50 p-6 xl:p-8 gap-10 overflow-y-auto no-scrollbar border-l border-[#292828]/10 shrink-0">
         {/* POST ENTRY POINT */}
         <div className="px-2">
            <button 
              onClick={() => setIsPosting(true)}
              className="w-full h-20 bg-[#292828] text-white rounded-[1.8rem] flex items-center justify-between px-8 group hover:bg-[#E53935] transition-all shadow-[0_20px_50px_rgba(41,40,40,0.2)] active:scale-95"
            >
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#E53935] transition-all">
                     <Plus size={20} strokeWidth={3} />
                  </div>
                  <div className="text-left">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 leading-none mb-1">Execution Node</p>
                     <p className="text-base font-black uppercase tracking-tight">Post Opportunity</p>
                  </div>
               </div>
               <ArrowUpRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </button>
         </div>

         <div className="group/hub">
            <h3 className="text-xl font-bold text-[#292828] uppercase tracking-tight">Regional Pulse</h3>
            <div className="relative h-64 bg-[#292828] rounded-[2rem] overflow-hidden group">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E53935_1px,transparent_1px)] [background-size:20px_20px]" />
               
               {/* Map Activity Nodes */}
               <div className="absolute inset-0">
                  {[1,2,3,4,5].map(i => (
                     <div 
                        key={i}
                        className="absolute h-1.5 w-1.5 rounded-full animate-ping opacity-60"
                        style={{ 
                           left: `${30 + (i * 13)%50}%`, 
                           top: `${35 + (i * 9)%40}%`,
                           backgroundColor: i % 3 === 0 ? '#10B984' : i % 3 === 1 ? '#3B82F6' : '#E53935',
                           animationDelay: `${i * 0.4}s`
                        }} 
                     />
                  ))}
               </div>

               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                     <p className="text-5xl font-black text-white">08</p>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Upcoming Events</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="p-10 bg-[#292828] rounded-[2.5rem] shadow-[0_40px_100px_rgba(41,40,40,0.3)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#E53935]/20 blur-[80px] pointer-events-none" />
            <TrendingUp size={200} className="absolute -right-10 -bottom-10 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[4s]" />
            <div className="relative z-10">
               <div className="h-14 w-14 bg-[#E53935] rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                  <Award size={28} />
               </div>
               <h4 className="text-[10px] font-black text-[#E53935] uppercase tracking-[0.2em] mb-4">Elite Intelligence</h4>
               <p className="text-3xl font-black text-white leading-[1.1] tracking-tighter mb-8 uppercase">
                  Summit interactions yield <span className="text-[#E53935]">500% more</span> verified leads than digital ads.
               </p>
               <button className="w-full h-16 bg-white text-[#292828] rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-[#E53935] hover:text-white transition-all transform hover:-translate-y-1">Upgrade your Signal</button>
            </div>
         </div>

         <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-[11px] font-black text-[#292828]/30 uppercase tracking-widest">Confirmed Itinerary</h4>
               <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase border border-emerald-100">{registeredList.length} Active</span>
            </div>
            
            {registeredList.length > 0 ? (
              <div className="space-y-4">
                 {registeredList.map(rid => {
                   const expo = EXPOS.find(e => e.id === rid);
                   return (
                     <div key={rid} className="group/item flex items-center gap-5 p-6 bg-white border border-[#292828]/10 rounded-[1.5rem] hover:shadow-2xl hover:border-[#E53935]/20 transition-all cursor-pointer">
                        <div className="h-16 w-16 bg-[#292828] rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-xl group-hover/item:bg-[#E53935] transition-colors">
                           <Ticket size={24} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[14px] font-black text-[#292828] uppercase truncate tracking-tight">{expo?.title}</p>
                           <p className="text-[10px] font-bold text-[#292828]/30 uppercase tracking-widest mt-1">{expo?.date.split(',')[0]}</p>
                        </div>
                        <div className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828]/30 group-hover/item:bg-[#E53935]/10 group-hover/item:text-[#E53935] transition-all">
                           <ArrowUpRight size={18} />
                        </div>
                     </div>
                   );
                 })}
              </div>
            ) : (
              <div className="p-12 bg-white border border-dashed border-[#292828]/10 rounded-[2rem] text-center">
                 <div className="h-14 w-14 bg-[#292828]/5 rounded-2xl mx-auto mb-6 flex items-center justify-center text-[#292828]/20">
                    <Check size={28} />
                 </div>
                 <p className="text-[11px] font-black text-[#292828]/30 uppercase tracking-widest leading-relaxed">No confirmation signals detected. Enrole in summits now.</p>
              </div>
            )}
         </div>
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
                       <h2 className="text-5xl lg:text-6xl font-black text-[#292828] leading-[0.9] tracking-tighter uppercase">{selectedExpo.title}</h2>
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
                       <h4 className="text-[11px] font-black text-[#292828]/30 uppercase tracking-widest mb-6">Summit Intelligence</h4>
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
    </div>
  );
}
