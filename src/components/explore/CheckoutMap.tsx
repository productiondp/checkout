"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { 
  Search, 
  Zap, 
  MapPin, 
  Users, 
  Target, 
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  TrendingUp,
  X,
  Compass,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

// FOCUS TYPES
type FocusType = "All" | "Meetups" | "Needs" | "Partners" | "Experts";

const FOCUS_CHIPS: { label: string; value: FocusType; color: string }[] = [
  { label: "All", value: "All", color: "bg-black" },
  { label: "Meetups", value: "Meetups", color: "bg-[#E53935]" },
  { label: "Needs", value: "Needs", color: "bg-[#FFC107]" },
  { label: "Partners", value: "Partners", color: "bg-[#9C27B0]" },
  { label: "Experts", value: "Experts", color: "bg-[#2196F3]" },
];

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function CheckoutMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [activeFocus, setActiveFocus] = useState<FocusType>("All");
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [entities, setEntities] = useState<any[]>([]);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  // 1. INITIALIZE MAP
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', // Sleek Black & Grey Dark Mode
      center: [76.9487, 8.5241], // Trivandrum, Kerala
      zoom: 13,
      antialias: true
    });

    map.current.on('load', () => {
      console.log("Black & Grey Discovery Engine Active - Trivandrum Hub");
      
      // STEP 4: ADD TEST MARKER
      new maplibregl.Marker({ color: "#E53935" })
        .setLngLat([76.9487, 8.5241])
        .setPopup(new maplibregl.Popup().setHTML("<h3 class='text-xs font-black uppercase p-2'>Trivandrum Hub Active</h3>"))
        .addTo(map.current!);

      fetchNearbyData();
    });

    // 2. AUTO-FETCH ON MOVE (DEBOUNCED)
    let moveTimeout: any;
    map.current.on('moveend', () => {
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        fetchNearbyData();
      }, 300);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // 3. DATA FETCHING
  const fetchNearbyData = async () => {
    if (!map.current) return;
    const bounds = map.current.getBounds();
    
    // In a real app, we'd query Supabase with bounds
    // For this demo, we'll fetch a sample and map them to the visible area
    try {
      const [profilesRes, postsRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, avatar_url, role, metadata').limit(30),
        supabase.from('posts').select('*, author:profiles(id, full_name, avatar_url, role)').limit(30)
      ]);

      const unified: any[] = [];

      if (profilesRes.data) {
        profilesRes.data.forEach((p, i) => {
          unified.push({
            id: p.id,
            name: p.full_name || "Expert",
            type: "Advisor",
            role: p.role || "Professional",
            description: "Top-tier domain expert in your area.",
            trustScore: 98,
            lng: bounds.getWest() + (Math.random() * (bounds.getEast() - bounds.getWest())),
            lat: bounds.getSouth() + (Math.random() * (bounds.getNorth() - bounds.getSouth())),
            avatar: p.avatar_url,
            cta: "Start Conversation"
          });
        });
      }

      if (postsRes.data) {
        postsRes.data.forEach((p, i) => {
          let type: FocusType = "Needs";
          let color = "#FFC107";
          let cta = "Respond";
          
          if (p.type === 'MEETUP') {
            type = "Meetups";
            color = "#E53935";
            cta = "Join Meetup";
          } else if (p.type === 'PARTNER') {
            type = "Partners";
            color = "#9C27B0";
            cta = "Start Building";
          }

          unified.push({
            id: p.id,
            name: p.title,
            type,
            color,
            description: p.content,
            trustScore: p.match_score || 92,
            lng: bounds.getWest() + (Math.random() * (bounds.getEast() - bounds.getWest())),
            lat: bounds.getSouth() + (Math.random() * (bounds.getNorth() - bounds.getSouth())),
            cta,
            author_id: p.author_id
          });
        });
      }

      console.log(`API check: Found ${unified.length} items nearby.`);
      setEntities(unified);
    } catch (err) {
      console.error("Map Data Fetch Error:", err);
    }
  };

  // 4. SYNC MARKERS TO MAP
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers that aren't in current entities
    const currentIds = new Set(entities.map(e => e.id));
    Object.keys(markersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    entities.forEach(entity => {
      if (activeFocus !== "All" && entity.type !== activeFocus) {
        if (markersRef.current[entity.id]) {
          markersRef.current[entity.id].remove();
          delete markersRef.current[entity.id];
        }
        return;
      }

      if (markersRef.current[entity.id]) return;

      const el = document.createElement('div');
      el.className = 'custom-marker';
      
      // Marker HTML based on type
      const color = entity.type === 'Meetups' ? '#E53935' : 
                   entity.type === 'Needs' ? '#FFC107' :
                   entity.type === 'Partners' ? '#9C27B0' : '#2196F3';

      el.innerHTML = `
        <div class="relative group cursor-pointer transition-all duration-300 hover:scale-150">
          ${entity.type === 'Meetups' ? '<div class="absolute inset-0 bg-[#E53935] rounded-full animate-ping opacity-40"></div>' : ''}
          <div class="h-4 w-4 rounded-full border-2 border-white shadow-xl" style="background-color: ${color}"></div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedEntity(entity);
        map.current?.easeTo({
          center: [entity.lng, entity.lat],
          offset: [0, -100],
          duration: 1000
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([entity.lng, entity.lat])
        .addTo(map.current!);

      markersRef.current[entity.id] = marker;
    });
  }, [entities, activeFocus]);

  return (
    <div className="relative w-full h-screen-safe bg-[#111111] overflow-hidden">
      {/* 1. FULL SCREEN MAP ENGINE */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* 2. TOP SEARCH OVERLAY */}
      <div className="absolute top-8 inset-x-8 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-xl pointer-events-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E53935] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search area or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-bold text-white outline-none focus:bg-black/60 focus:border-[#E53935]/40 transition-all shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* 3. RIGHT FOCUS CHIPS */}
      <div className="absolute right-8 top-32 flex flex-col gap-3">
        {FOCUS_CHIPS.map(chip => (
          <button
            key={chip.value}
            onClick={() => setActiveFocus(chip.value)}
            className={cn(
              "px-5 h-11 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shadow-2xl",
              activeFocus === chip.value 
                ? "bg-white text-black border-white scale-110" 
                : "bg-black/40 backdrop-blur-xl text-white/40 border-white/5 hover:border-white/20"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* 4. MAP CONTROLS */}
      <div className="absolute left-8 bottom-32 flex flex-col gap-3">
         <button 
           onClick={() => map.current?.zoomIn()}
           className="h-12 w-12 bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl flex items-center justify-center text-white hover:bg-black hover:border-[#E53935]/40 transition-all"
         >
           <Target size={20} />
         </button>
         <button 
           onClick={() => map.current?.zoomOut()}
           className="h-12 w-12 bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl flex items-center justify-center text-white hover:bg-black hover:border-[#E53935]/40 transition-all"
         >
           <Compass size={20} />
         </button>
      </div>

      {/* 5. BOTTOM PREVIEW CARD */}
      <AnimatePresence>
        {selectedEntity && (
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.98 }}
            className="absolute inset-x-4 sm:inset-x-8 bottom-6 sm:bottom-10 flex justify-center z-50 pointer-events-none"
          >
            <div className="w-full max-w-4xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-[2.5rem] sm:rounded-[4rem] p-5 sm:p-10 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-12 pointer-events-auto relative overflow-hidden group selection:bg-[#E53935]/10">
               
               {/* 🧬 NEURAL DECORATION */}
               <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden opacity-20 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M0,0 L100,100 M100,0 L0,100" stroke="currentColor" strokeWidth="0.1" className="text-black/10" />
                     <circle cx="20" cy="30" r="1" className="fill-[#E53935]" />
                     <circle cx="80" cy="70" r="1" className="fill-[#E53935]" />
                  </svg>
               </div>

               <button 
                 onClick={() => setSelectedEntity(null)}
                 className="absolute top-6 right-6 sm:top-10 sm:right-10 h-10 w-10 bg-black/[0.03] hover:bg-black text-black/20 hover:text-white rounded-full flex items-center justify-center transition-all z-20"
               >
                 <X size={18} />
               </button>

               {/* LEFT: IDENTITY / ICON */}
               <div className="relative shrink-0 flex items-center justify-center">
                  <div className="h-20 w-20 sm:h-32 sm:w-32 rounded-[2rem] sm:rounded-[3rem] bg-[#0A0A0A] flex items-center justify-center overflow-hidden border border-black/[0.03] shadow-3xl transition-transform group-hover:scale-105 duration-700">
                     {selectedEntity.avatar ? (
                       <img src={selectedEntity.avatar} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" alt="" />
                     ) : (
                       <div className={cn("h-full w-full flex items-center justify-center text-white", selectedEntity.type === 'Meetups' ? 'bg-[#E53935]' : 'bg-black')}>
                          {selectedEntity.type === 'Meetups' ? <Zap size={40} strokeWidth={2.5} /> : <Users size={40} strokeWidth={2.5} />}
                       </div>
                     )}
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-white rounded-2xl border-4 border-[#FDFDFF] flex items-center justify-center shadow-lg">
                     <div className="h-2 w-2 bg-[#34C759] rounded-full animate-pulse" />
                  </div>
               </div>

               {/* CENTER: INTELLIGENCE BRIEF */}
               <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center flex-wrap gap-3 mb-3">
                     <span className={cn(
                       "px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.25em]",
                       selectedEntity.type === 'Meetups' ? 'bg-[#E53935] text-white' : 'bg-black text-white'
                     )}>
                        {selectedEntity.type}
                     </span>
                     <div className="flex items-center gap-2 text-[#34C759] font-black uppercase text-[10px] tracking-tighter">
                        <Activity size={14} />
                        <span>{selectedEntity.trustScore}% Neural Match</span>
                     </div>
                     <div className="h-1 w-1 rounded-full bg-black/10 hidden sm:block" />
                     <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest hidden sm:inline flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#E53935]" /> 2.4km Away
                     </span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-4xl font-black text-[#1D1D1F] uppercase font-outfit mb-2 sm:mb-4 leading-[0.9] tracking-tight line-clamp-2">
                    {selectedEntity.name}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                     <p className="text-[14px] sm:text-[16px] font-medium text-black/50 leading-relaxed line-clamp-1 italic max-w-md">
                        "{selectedEntity.description}"
                     </p>
                     
                     {/* Social Proof Avatars */}
                     <div className="flex items-center -space-x-3 opacity-60">
                        {[1,2,3].map(i => (
                           <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shrink-0 shadow-sm">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="" />
                           </div>
                        ))}
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-black flex items-center justify-center text-[8px] font-black text-white z-10 shadow-sm">
                           +12
                        </div>
                     </div>
                  </div>
               </div>

               {/* RIGHT: CONNECTIVITY */}
               <div className="shrink-0 flex items-center">
                  <button 
                    onClick={async () => {
                      if (!selectedEntity.id) return;
                      
                      if (selectedEntity.type === 'Meetups') {
                        // 1. Join Meetup Flow
                        try {
                           const { MeetupService } = await import("@/services/meetup-service");
                           if (!user) {
                              router.push('/auth');
                              return;
                           }
                           
                           const { roomId } = await MeetupService.joinMeetup(selectedEntity.id, user.id);
                           if (roomId) {
                              router.push(`/chat?room=${roomId}`);
                           } else {
                              // If room not found, try to get it from the post
                              const { data: meetup } = await supabase.from('posts').select('room_id').eq('id', selectedEntity.id).single();
                              if (meetup?.room_id) router.push(`/chat?room=${meetup.room_id}`);
                              else alert("This meetup's chat is being prepared. Check back in a moment!");
                           }
                        } catch (err: any) {
                           console.error("Map Join Error:", err);
                           if (err.message === "MEETUP_FULL") alert("This meetup is full!");
                           else alert("Failed to join meetup. Please try again.");
                        }
                      } else {
                         // 2. Standard Chat / Connect Flow
                         router.push(`/chat?user=${selectedEntity.author_id || selectedEntity.id}`);
                      }
                    }}
                    className="h-16 sm:h-24 w-full sm:w-auto px-10 sm:px-16 bg-[#0A0A0A] text-white rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-[12px] sm:text-[15px] uppercase tracking-[0.25em] hover:bg-[#E53935] shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:shadow-[#E53935]/40 transition-all flex items-center justify-center gap-6 active:scale-95 group/btn overflow-hidden relative"
                  >
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                     <span className="relative z-10">{selectedEntity.cta}</span>
                     <ArrowRight size={20} strokeWidth={4} className="relative z-10 transition-transform group-hover/btn:translate-x-2" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. LIVE CITY LAYER (GLOW) */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#E53935]/5 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#2196F3]/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* 7. EMPTY STATE NUDGE */}
      {entities.length === 0 && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="p-8 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/5 text-center space-y-4">
              <Sparkles className="mx-auto text-white/20 animate-bounce" size={32} />
              <p className="text-[11px] font-black uppercase text-white/40 tracking-[0.2em]">No activity here. Try moving the map</p>
           </div>
        </div>
      )}
    </div>
  );
}

