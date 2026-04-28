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
  Compass
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

export default function CheckoutMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [activeFocus, setActiveFocus] = useState<FocusType>("All");
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [entities, setEntities] = useState<any[]>([]);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

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
            cta: "Connect"
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
            cta = "Start building";
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
            cta
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
    <div className="relative w-full h-screen bg-[#111111] overflow-hidden">
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
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute inset-x-8 bottom-8 flex justify-center z-50 pointer-events-none"
          >
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex items-center gap-8 pointer-events-auto relative overflow-hidden group">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 blur-[40px] pointer-events-none" />
               
               <button 
                 onClick={() => setSelectedEntity(null)}
                 className="absolute top-6 right-6 text-black/10 hover:text-black transition-colors"
               >
                 <X size={20} />
               </button>

               <div className="h-24 w-24 rounded-2xl bg-[#F5F5F7] flex items-center justify-center overflow-hidden shrink-0 border border-black/[0.03]">
                  {selectedEntity.avatar ? (
                    <img src={selectedEntity.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className={cn("h-full w-full flex items-center justify-center text-white", selectedEntity.type === 'Meetups' ? 'bg-[#E53935]' : 'bg-black')}>
                       {selectedEntity.type === 'Meetups' ? <Zap size={32} /> : <Users size={32} />}
                    </div>
                  )}
               </div>

               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                     <span className={cn(
                       "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                       selectedEntity.type === 'Meetups' ? 'bg-[#E53935]/5 text-[#E53935]' : 'bg-black/5 text-black'
                     )}>
                        {selectedEntity.type}
                     </span>
                     <div className="flex items-center gap-1.5 text-emerald-600">
                        <TrendingUp size={12} />
                        <span className="text-[10px] font-black uppercase">{selectedEntity.trustScore}% Match</span>
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit mb-1 line-clamp-1">{selectedEntity.name}</h3>
                  <p className="text-[13px] font-bold text-black/40 line-clamp-1 italic">"{selectedEntity.description}"</p>
               </div>

               <div className="shrink-0">
                  <button className="h-16 px-10 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#E53935] shadow-2xl transition-all flex items-center gap-3 active:scale-95">
                     {selectedEntity.cta}
                     <ArrowRight size={16} strokeWidth={3} />
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

// STYLES FOR MARKER
const isLoading = false; // dummy for build
