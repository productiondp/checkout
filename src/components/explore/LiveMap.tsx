"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Minus,
  MapPin, 
  Search, 
  Filter, 
  Users, 
  Briefcase, 
  Zap, 
  MessageSquare,
  Navigation,
  Globe,
  X,
  ArrowUpRight,
  User,
  Compass,
  BrainCircuit,
  Shield,
  TrendingUp as TrendingIcon,
  Award,
  CheckCircle2 as CheckIcon,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  ChevronRight,
  Maximize2
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import ReviewModal from "@/components/modals/ReviewModal";

type MarkerType = "LEAD" | "HIRING" | "MEETUP" | "UPDATE" | "PARTNER";

interface Marker {
  id: string;
  x: number;
  y: number;
  type: MarkerType;
  title: string;
  author: string;
  distance: string;
  details: string;
  matchScore: number;
}

export default function LiveMap({ posts: propPosts }: { posts?: any[] }) {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isJoinedToSyndicate, setIsJoinedToSyndicate] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);

  const supabase = createClient();

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*, advisor:profiles!bookings_advisor_id_fkey(full_name), client:profiles!bookings_client_id_fkey(full_name)')
      .or(`advisor_id.eq.${user.id},client_id.eq.${user.id}`)
      .order('scheduled_at', { ascending: true })
      .limit(3);
    
    if (bookingsData) setBookings(bookingsData);
  };

  const handleBookingStatus = async (bookingId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);
    
    if (!error) {
      fetchBookings();
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setUserProfile(profile);
        const { data: communityJoin } = await supabase.from('community_members').select('*').eq('user_id', user.id).single();
        setIsJoinedToSyndicate(!!communityJoin);
        fetchBookings();
      }
      const { data: postsData } = await supabase.from('posts').select('*, author:profiles(full_name)');
      if (postsData) setDbPosts(postsData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => { 
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset"; 
    };
  }, []);

  const handleZoom = (delta: number) => setZoom(prev => Math.min(Math.max(prev + delta, 0.4), 4));
  const handleWheel = (e: React.WheelEvent) => handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const activePosts = propPosts || dbPosts;
  const markers = activePosts.map((post, i) => ({
    id: post.id.toString(),
    type: post.type as MarkerType,
    title: post.title || "Activity",
    author: post.author?.full_name || post.author || "Community",
    details: post.content,
    distance: `${(i * 1.2).toFixed(1)}km`,
    matchScore: Math.round(70 + (i * 7) % 30),
    x: 25 + (i * 14.5) % 60,
    y: 35 + (i * 11.2) % 45
  }));

  const filteredMarkers = filter === "All" 
    ? markers 
    : markers.filter(m => m.type?.toUpperCase() === filter.toUpperCase());

  return (
    <div 
      className="relative w-full h-[100dvh] overflow-hidden font-sans select-none bg-[#111111] flex text-white selection:bg-[#E53935]/20"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 0. TACTICAL SIDEBAR - CHROME DARK MODE */}
      <aside className="hidden lg:flex w-[340px] h-full bg-[#1a1a1a]/80 backdrop-blur-3xl border-r border-white/5 z-[70] flex-col overflow-y-auto no-scrollbar shadow-4xl animate-in slide-in-from-left-10 duration-700">
        <div className="p-8 pb-4 border-b border-white/5 bg-[#1a1a1a]/40 sticky top-0 z-10 backdrop-blur-md">
          <Link href="/home" className="flex items-center gap-4 group mb-6">
            <div className="h-12 w-12 bg-[#292828] border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/20 group-hover:bg-[#E53935] transition-all">
              <Compass size={24} className="animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight uppercase text-white block">Command</span>
              <span className="text-[10px] font-black uppercase text-[#E53935] tracking-widest">Regional Hub</span>
            </div>
          </Link>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="h-10 w-10 border-2 border-[#E53935] rounded-full overflow-hidden p-0.5">
              <img src={userProfile?.avatar_url || `https://i.pravatar.cc/100?u=${userProfile?.id}`} alt="" className="h-full w-full object-cover rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black uppercase tracking-tight truncate">{userProfile?.full_name || "Profile Status"}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-bold text-white/40 uppercase">Pilot Authorized</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* TACTICAL METRICS */}
          <div className="grid grid-cols-2 gap-3">
             {[
               { label: "Authority", value: 98, icon: Shield, color: "bg-[#E53935]" },
               { label: "Trust Score", value: 84, icon: TrendingIcon, color: "bg-emerald-600" }
             ].map((met, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                   <div className="flex items-center justify-between mb-3">
                      <div className="h-8 w-8 bg-white/5 rounded-lg flex items-center justify-center text-white group-hover:text-[#E53935]"><met.icon size={14} /></div>
                      <span className="text-sm font-black">{met.value}%</span>
                   </div>
                   <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">{met.label}</p>
                </div>
             ))}
          </div>

          {/* BOARD SCHEDULE - SITUATIONAL AWARENESS */}
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Board Schedule</h3>
               <Calendar size={14} className="text-[#E53935]" />
             </div>
             
             <div className="space-y-3">
                {bookings.length > 0 ? bookings.map((b) => (
                  <div key={b.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-[#E53935]/40 transition-all">
                     <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[7px] font-black uppercase text-white shadow-sm",
                          b.status === 'PENDING' ? "bg-amber-500/80" : b.status === 'CONFIRMED' ? "bg-emerald-600/80" : "bg-white/20"
                        )}>
                           {b.status}
                        </span>
                        <div className="flex items-center gap-1.5 text-[7px] font-black text-white/30 uppercase">
                          <Clock size={10} /> {new Date(b.scheduled_at).toLocaleDateString()}
                        </div>
                     </div>
                     <p className="text-[12px] font-black text-white mb-3">
                        {userProfile?.id === b.advisor_id ? `${b.client?.full_name}` : `${b.advisor?.full_name}`}
                     </p>

                     {/* ADVISOR ACTIONS */}
                     {userProfile?.id === b.advisor_id && b.status === 'PENDING' && (
                        <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => handleBookingStatus(b.id, 'CONFIRMED')} className="h-8 bg-white text-black rounded-xl text-[8px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all shadow-xl">Authorize</button>
                           <button onClick={() => handleBookingStatus(b.id, 'CANCELLED')} className="h-8 bg-white/10 text-white/40 rounded-xl text-[8px] font-black uppercase hover:text-red-500 transition-all">Reject</button>
                        </div>
                     )}

                     {/* CLIENT ACTIONS */}
                     {userProfile?.id === b.client_id && b.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => { setSelectedBookingForReview(b); setIsReviewModalOpen(true); }}
                          className="w-full h-9 bg-white text-black rounded-xl text-[8px] font-black uppercase flex items-center justify-center gap-2 hover:bg-[#E53935] hover:text-white transition-all shadow-xl"
                        >
                           Finalize Mandate <ArrowRight size={12} />
                        </button>
                     )}
                  </div>
                )) : (
                  <div className="py-10 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">No active sessions</p>
                  </div>
                )}
             </div>
          </div>

          {/* STRATEGIC NODES */}
          <div className="bg-[#292828] rounded-3xl p-6 border border-white/5 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="flex items-center justify-between mb-5">
               <h3 className="text-[10px] font-black text-white/60 uppercase flex items-center gap-2 tracking-widest">
                  <BrainCircuit size={14} className="text-[#E53935]" /> Strategic Hub
               </h3>
               <Link href="/settings" className="p-2 hover:bg-white/10 rounded-lg transition-all"><Plus size={12} className="text-white/40" /></Link>
             </div>
             <div className="flex flex-wrap gap-2">
                {["Regional Growth", "Neural Scaling", "Mandate Pilot"].map((node) => (
                  <span key={node} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-tighter hover:bg-[#E53935] hover:border-[#E53935] transition-all cursor-default">{node}</span>
                ))}
             </div>
          </div>
        </div>

        {/* NETWORK FOOTER */}
        <div className="mt-auto p-8 border-t border-white/5 bg-[#1a1a1a]/40">
           {!isJoinedToSyndicate ? (
             <Link 
               href="/communities"
               className="flex items-center justify-between px-6 h-12 bg-white text-black rounded-2xl font-black text-[10px] uppercase hover:bg-[#E53935] hover:text-white transition-all shadow-2xl group"
             >
                Join Syndicate <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </Link>
           ) : (
             <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-emerald-500">Syndicate Verified</span>
                <CheckIcon size={16} className="text-emerald-500" />
             </div>
           )}
        </div>
      </aside>
      
      {/* 1. MAP VISUALIZATION LAYER - NEURAL DESIGN */}
      <div 
        className="flex-1 relative transition-transform duration-300 ease-out flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ 
          transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div className="relative w-[1400px] h-[1400px] pointer-events-auto">
          {/* Background Neural Grid */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:60px_60px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(17,17,17,0.8)_100%)]" />
          </div>

          {/* TRIVANDRUM SCHEMATIC */}
          <svg className="absolute inset-0 w-full h-full text-white/5 group-hover:text-[#E53935]/10 transition-colors duration-1000" viewBox="0 0 1000 1000" fill="none">
            <path d="M0,0 L300,0 C320,100 280,300 350,500 C400,700 320,850 300,1000 L0,1000 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M300,0 C320,100 280,300 350,500 C400,700 320,850 300,1000" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" strokeDasharray="15 10" />
            <circle cx="500" cy="500" r="400" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" fill="none" />
            <circle cx="500" cy="500" r="250" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" fill="none" />
            <circle cx="500" cy="500" r="100" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" fill="none" />
            <line x1="500" y1="0" x2="500" y2="1000" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
            <line x1="0" y1="500" x2="1000" y2="500" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
          </svg>

          {/* 2. ACTIVITY NODES - HIGH INTENSITY */}
          {filteredMarkers.map((marker) => (
            <div 
              key={marker.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
              <div className={cn(
                "absolute inset-0 -m-8 rounded-full animate-ping opacity-20 duration-[4s]",
                marker.type === "HIRING" ? "bg-emerald-500" : "bg-[#E53935]"
              )} />
              <div className={cn(
                "absolute inset-0 -m-4 rounded-full animate-pulse opacity-40 duration-[2s]",
                marker.type === "HIRING" ? "bg-emerald-500" : "bg-[#E53935]"
              )} />
              
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedMarker(marker); }}
                className={cn(
                  "relative z-10 h-10 w-10 lg:h-12 lg:w-12 rounded-2xl rotate-45 border-4 border-[#111111] shadow-4xl flex items-center justify-center transition-all hover:scale-125 hover:rotate-0 group/node",
                  marker.type === "HIRING" ? "bg-emerald-600" : "bg-[#E53935]"
                )}
              >
                <div className="-rotate-45 group-hover/node:rotate-0 transition-transform">
                   {marker.type === "HIRING" ? <Briefcase size={20} className="text-white" /> : <Zap size={20} className="text-white" />}
                </div>
              </button>

              <div className="hidden lg:flex absolute left-full ml-6 top-1/2 -translate-y-1/2 flex-col items-start font-black">
                 <span className="text-[14px] bg-[#111111] border border-white/10 px-3 py-1 rounded-lg shadow-2xl whitespace-nowrap backdrop-blur-md">
                    {marker.author}
                 </span>
                 <div className="flex items-center gap-2 mt-1.5">
                    <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-[#E53935]" style={{ width: `${marker.matchScore}%` }} />
                    </div>
                    <span className="text-[8px] uppercase tracking-widest text-white/40">Partner Strength</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. RESPONSIVE FLOATING HUD */}
      <div className="absolute top-10 right-10 flex flex-col gap-4 z-[80]">
         <div className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-premium flex flex-col gap-1">
            <button onClick={() => handleZoom(0.25)} className="h-12 w-12 flex items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all"><Plus size={20} /></button>
            <button onClick={() => handleZoom(-0.25)} className="h-12 w-12 flex items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all"><Minus size={20} /></button>
         </div>
         <button 
           onClick={() => { setZoom(1); setOffset({x:0, y:0}); }}
           className="h-16 w-16 bg-[#E53935] text-white rounded-2xl flex items-center justify-center shadow-4xl hover:scale-110 active:scale-95 transition-all shadow-red-500/20"
         >
           <Target size={28} className="animate-pulse" />
         </button>
      </div>

      {/* Search & Intelligence Terminal (Bottom) */}
      <div className="absolute bottom-10 left-10 right-10 lg:left-[380px] lg:right-10 flex flex-col gap-6 z-[60] pointer-events-none">
        <div className="flex flex-col lg:flex-row items-end gap-5 pointer-events-auto">
          <div className="relative group w-full lg:w-[480px]">
            <div className="absolute left-6 inset-y-0 flex items-center text-white/20 group-focus-within:text-[#E53935] transition-colors">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              placeholder="Find Strategic Alliances..."
              className="w-full bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-lg font-black text-white outline-none focus:border-[#E53935]/50 focus:ring-4 focus:ring-[#E53935]/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] transition-all placeholder:text-white/10"
            />
          </div>
          
          <div className="flex bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 rounded-[1.75rem] p-2 shadow-4xl overflow-x-auto no-scrollbar">
            {["All", "Lead", "Hiring", "Partner", "Meetup"].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-8 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  (filter === cat || (filter === "All" && cat === "All"))
                    ? "bg-[#E53935] text-white shadow-xl shadow-red-500/20" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. INTEL REPORT SHEET (Detail Overlay) */}
      {selectedMarker && (
        <div className="absolute inset-x-6 bottom-10 lg:bottom-auto lg:top-10 lg:right-10 lg:w-[440px] z-[90] animate-in slide-in-from-bottom-10 lg:slide-in-from-top-10 duration-700">
          <div className="bg-[#1a1a1a]/95 border border-white/10 rounded-[2.5rem] p-10 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-3xl group/intel">
            
            {/* Ambient Background Glow */}
            <div className={cn(
              "absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-20 transition-colors duration-1000",
              selectedMarker.type === "HIRING" ? "bg-emerald-500" : "bg-[#E53935]"
            )} />

            <button onClick={() => setSelectedMarker(null)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-all hover:rotate-90"><X size={24} /></button>
            
            <div className="flex items-start gap-8 mb-10 relative z-10">
              <div className={cn(
                "h-20 w-20 min-w-[80px] rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-12 group-hover/intel:rotate-0 transition-all duration-700",
                selectedMarker.type === "HIRING" ? "bg-emerald-600 shadow-emerald-500/20" : "bg-[#E53935] shadow-red-500/20"
              )}>
                {selectedMarker.type === "HIRING" ? <Briefcase size={32} /> : <Zap size={32} />}
              </div>
              <div className="pr-4">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] mb-2 block",
                  selectedMarker.type === "HIRING" ? "text-emerald-500" : "text-[#E53935]"
                )}>
                  {selectedMarker.type}
                </span>
                <h3 className="text-2xl lg:text-3xl font-black text-white leading-tight uppercase tracking-tight">{selectedMarker.title}</h3>
                <div className="flex items-center gap-3 mt-3">
                  <div className="h-6 w-6 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?u=${selectedMarker.id}`} className="w-full h-full object-cover" alt="" />
                  </div>
                  <p className="text-white/60 font-bold text-[13px]">{selectedMarker.author}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-10 relative z-10">
               <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                  <p className="text-white/80 font-bold text-[15px] leading-relaxed uppercase tracking-tight italic">
                    "{selectedMarker.details || "Strategizing high-authority node expansions within the regional command hub and broadcasting mandates."}"
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-[8px] font-black text-white/30 uppercase mb-1 tracking-widest">Partner Score</p>
                     <p className="text-xl font-black text-white tabular-nums">{selectedMarker.matchScore}%</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-[8px] font-black text-white/30 uppercase mb-1 tracking-widest">Distance</p>
                     <p className="text-xl font-black text-white tabular-nums">{selectedMarker.distance}</p>
                  </div>
               </div>
            </div>
            
            <div className="flex gap-4 relative z-10">
              <button className={cn(
                "flex-[2] py-5 rounded-2xl font-black text-[13px] uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 group/action overflow-hidden relative",
                selectedMarker.type === "HIRING" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-[#E53935] hover:bg-[#ff4d4d]"
              )}>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/action:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">Execute Mandate</span>
              </button>
              <Link href="/profile" className="flex-1">
                <button className="w-full py-5 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all">
                  Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        booking={selectedBookingForReview}
        onSuccess={fetchBookings}
      />
    </div>
  );
}
