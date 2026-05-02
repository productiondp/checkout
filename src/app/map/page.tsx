"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import TerminalLayout from "@/components/layout/TerminalLayout";
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Users,
  Building2,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

function MapContent() {
  const searchParams = useSearchParams();
  const [activeLayer, setActiveLayer] = useState<"Partners" | "Businesses" | "Events">("Partners");
  const [mapError, setMapError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const supabase = createClient();

  // Parse target location from URL
  const targetLat = searchParams.get('lat');
  const targetLng = searchParams.get('lng');
  const searchName = searchParams.get('search');

  useEffect(() => {
    if (map.current && targetLat && targetLng) {
      map.current.flyTo({
        center: [parseFloat(targetLng), parseFloat(targetLat)],
        zoom: 15,
        essential: true
      });
    } else if (map.current && searchName) {
      // Simple geocoding for search name
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchName)}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data.features?.length > 0) {
            const [lng, lat] = data.features[0].geometry.coordinates;
            map.current?.flyTo({ center: [lng, lat], zoom: 14, essential: true });
          }
        });
    }
  }, [targetLat, targetLng, searchName]);

  // Load Real Data
  useEffect(() => {
    async function loadNetworkNodes() {
      try {
        // Fetch All Posts (Prioritize Marketplace Content)
        const { data: posts } = await supabase
          .from('posts')
          .select(`*, author:profiles(*)`)
          .order('created_at', { ascending: false });

        // Fetch Profiles (Partners/Businesses)
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .limit(100);

        const nodes: any[] = [];
        const HUB_LAT = 8.5241;
        const HUB_LNG = 76.9467;

        // Map All Posts
        (posts || []).forEach((p, idx) => {
          // Normalize type for map layers
          let nodeType: "Partners" | "Businesses" | "Events" = "Partners";
          if (p.type === 'MEETUP') nodeType = "Events";
          else if (p.type === 'REQUIREMENT') nodeType = "Partners";
          else if (p.type === 'PARTNER' || p.type === 'PARTNERSHIP') nodeType = "Partners";

          // Use real geo if exists, otherwise simulate proximity to hub
          const lat = p.metadata?.geo?.lat || (HUB_LAT + (Math.random() - 0.5) * 0.05);
          const lng = p.metadata?.geo?.lng || (HUB_LNG + (Math.random() - 0.5) * 0.05);

          nodes.push({
            id: p.id,
            type: nodeType,
            subType: p.type,
            lat,
            lng,
            title: p.title || "Opportunity",
            content: p.content,
            author: p.author?.full_name || "Member",
            avatar: p.author?.avatar_url,
            isRealGeo: !!p.metadata?.geo
          });
        });

        // Map Profiles
        (profiles || []).forEach((p, idx) => {
          const isBusiness = p.role === 'BUSINESS';
          const lat = HUB_LAT + (Math.random() - 0.5) * 0.08;
          const lng = HUB_LNG + (Math.random() - 0.5) * 0.08;

          nodes.push({
            id: p.id,
            type: isBusiness ? 'Businesses' : 'Partners',
            subType: isBusiness ? 'BUSINESS' : 'PARTNER',
            lat,
            lng,
            title: p.full_name,
            content: p.bio,
            avatar: p.avatar_url,
            isProfile: true
          });
        });

        setMarkers(nodes);
      } catch (err) {
        console.error('[MAP_DATA_ERROR]', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadNetworkNodes();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    console.log('[MAP] Initializing...');

    try {
      if (map.current) {
        map.current.remove();
      }
      
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [76.9467, 8.5241], // Trivandrum
        zoom: 12.5,
        attributionControl: false,
        failIfMajorPerformanceCaveat: false
      });

      map.current.on('load', () => {
        console.log('[MAP] Live tiles loaded successfully');
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl({
        showCompass: false
      }), 'top-right');

    } catch (err: any) {
      console.error('[MAP] Initialization failed:', err);
      setMapError(err.message || 'Failed to initialize map engine');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const [mapSearchQuery, setMapSearchQuery] = useState("");

  const filteredMarkers = useMemo(() => {
    if (!mapSearchQuery) return markers.filter(m => m.type === activeLayer);
    return markers.filter(m => 
      m.type === activeLayer && 
      (m.title.toLowerCase().includes(mapSearchQuery.toLowerCase()) || 
       m.content.toLowerCase().includes(mapSearchQuery.toLowerCase()))
    );
  }, [markers, activeLayer, mapSearchQuery]);

  // Update Markers based on Layer and Data
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    const currentMarkers = document.querySelectorAll('.mapboxgl-marker');
    currentMarkers.forEach(m => m.remove());

    filteredMarkers.forEach(node => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      
      // Use avatar if available, otherwise type-based icon
      const iconHtml = node.avatar 
        ? `<img src="${node.avatar}" class="h-full w-full object-cover rounded-full border-2 border-white/20 shadow-xl" />`
        : `<div class="h-full w-full rounded-full flex items-center justify-center bg-${activeLayer === 'Events' ? '[#E53935]' : activeLayer === 'Businesses' ? 'indigo-500' : 'emerald-500'} text-white shadow-xl">
            ${activeLayer === 'Events' ? '🔥' : activeLayer === 'Businesses' ? '🏢' : '👤'}
           </div>`;

      el.innerHTML = `
        <div class="relative group cursor-pointer h-10 w-10 transition-all hover:scale-125 z-10">
          <div class="h-full w-full rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_20px_rgba(229,57,53,0.3)]">
            ${iconHtml}
          </div>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
            <div class="bg-black/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl whitespace-nowrap shadow-2xl">
              <p class="text-[10px] font-black uppercase text-white tracking-widest">${node.title}</p>
              <p class="text-[8px] font-bold text-white/40 uppercase mt-0.5">${node.author || node.type}</p>
            </div>
          </div>
        </div>
      `;

      // Create Popup
      const popupContent = document.createElement('div');
      popupContent.className = 'map-popup-container';
      popupContent.innerHTML = `
        <div class="p-5 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-64 shadow-4xl text-white space-y-6">
           <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                 <img src="${node.avatar || `https://i.pravatar.cc/150?u=${node.id}`}" class="h-full w-full object-cover" />
              </div>
              <div class="min-w-0">
                 <p class="text-[10px] font-black text-[#E53935] uppercase tracking-[0.2em] leading-none mb-1.5">${activeLayer}</p>
                 <p class="text-[14px] font-black uppercase truncate leading-tight">${node.title}</p>
              </div>
           </div>
           
           <p class="text-[11px] font-medium text-white/50 leading-relaxed line-clamp-2 uppercase tracking-tight italic">
              "${node.content || "Connecting real-world opportunities across the network."}"
           </p>

           <div class="grid grid-cols-2 gap-3">
              <button class="h-11 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-[#E53935] hover:text-white transition-all active:scale-95 btn-connect">
                 Connect
              </button>
              <button class="h-11 rounded-xl bg-white/10 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95 btn-response">
                 Response
              </button>
           </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ 
        offset: 25, 
        closeButton: false,
        maxWidth: 'none',
        className: 'custom-map-popup'
      }).setDOMContent(popupContent);

      const marker = new maplibregl.Marker(el)
        .setLngLat([node.lng, node.lat])
        .addTo(map.current!);

      // Click to open popup
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.setLngLat([node.lng, node.lat]).addTo(map.current!);
        
        // Add listeners to popup buttons after it's added to DOM
        setTimeout(() => {
          const connectBtn = document.querySelector('.btn-connect');
          const responseBtn = document.querySelector('.btn-response');
          
          connectBtn?.addEventListener('click', () => {
             alert(`Connection request sent to ${node.title}`);
             popup.remove();
          });
          
          responseBtn?.addEventListener('click', () => {
             alert(`Response recorded for ${node.title}`);
             popup.remove();
          });
        }, 100);
      });
    });
  }, [filteredMarkers, activeLayer]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#0A0A0B] overflow-hidden selection:bg-[#E53935]/10">
      
      {/* HEADER / FILTERS */}
      <div className="p-6 border-b border-white/[0.03] bg-black/40 backdrop-blur-3xl z-30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Area <span className="text-[#E53935]">Discovery</span></h1>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Live Node: Trivandrum</p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.05]">
            {(["Partners", "Businesses", "Events"] as const).map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={cn(
                  "px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                  activeLayer === layer 
                    ? "bg-white text-black shadow-xl" 
                    : "text-white/30 hover:text-white"
                )}
              >
                {layer}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                type="text" 
                placeholder="Search Location..." 
                value={mapSearchQuery}
                onChange={(e) => setMapSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-6 bg-white/[0.03] border border-transparent rounded-lg text-[11px] font-bold outline-none focus:bg-white/[0.08] focus:border-[#E53935]/20 text-white transition-all w-[240px]"
              />
            </div>
            <button className="h-11 w-11 bg-[#E53935] text-white rounded-lg flex items-center justify-center hover:bg-[#D32F2F] transition-all shadow-xl shadow-[#E53935]/10">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* MAP VIEWPORT */}
      <div className="flex-1 relative bg-[#0A0A0B] overflow-hidden group">
        {/* LIVE MAP CONTAINER */}
        <div 
          ref={mapContainer} 
          className="absolute inset-0 z-10 w-full h-full" 
          style={{ background: '#0A0A0B' }}
        />

        {mapError && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="text-center space-y-4 p-8">
              <AlertCircle className="text-[#E53935] mx-auto" size={48} />
              <p className="text-white font-bold text-lg">Map Initialization Error</p>
              <p className="text-white/40 text-xs uppercase tracking-widest">{mapError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-[#E53935] text-white text-[10px] font-black uppercase rounded-xl"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}
        
        {/* MAP OVERLAYS (Floating UI) */}
        <div className="absolute inset-0 pointer-events-none z-20">
           {/* Center Marker Placeholder */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-4 w-4 bg-[#E53935] rounded-full shadow-[0_0_20px_rgba(229,57,53,0.8)] border-2 border-white/20 animate-pulse" />
           </div>
        </div>

        {/* STATUS OVERLAY */}
        <div className="absolute bottom-8 left-8 p-8 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] shadow-4xl flex items-center gap-8 max-w-md z-40 group/status overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/5 to-transparent opacity-0 group-hover/status:opacity-100 transition-opacity" />
           <div className="h-16 w-16 bg-[#E53935] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#E53935]/20 animate-pulse relative z-10">
              <Sparkles size={32} className="text-white" />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase text-[#E53935] tracking-widest leading-none mb-2.5">Neural Insights v4.2</p>
              <p className="text-[15px] font-medium text-white leading-tight tracking-tight">"Interactive Map API Active. High-density network activity identified across <span className="text-[#E53935] font-bold">Trivandrum</span>."</p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <TerminalLayout>
      <Suspense fallback={
        <div className="h-[calc(100vh-64px)] bg-[#0A0A0B] flex items-center justify-center">
          <div className="h-16 w-16 bg-[#E53935] rounded-2xl animate-pulse shadow-2xl shadow-[#E53935]/20" />
        </div>
      }>
        <MapContent />
      </Suspense>
    </TerminalLayout>
  );
}
