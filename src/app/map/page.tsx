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
        // Fetch Meetups (Events) with Geo metadata
        const { data: posts } = await supabase
          .from('posts')
          .select(`*, author:profiles(*)`)
          .eq('type', 'MEETUP')
          .not('metadata->geo', 'is', null);

        // Fetch Profiles (Partners/Businesses)
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .limit(50);

        const nodes: any[] = [];

        // Map Meetups
        (posts || []).forEach(p => {
          if (p.metadata?.geo) {
            nodes.push({
              id: p.id,
              type: 'Events',
              lat: p.metadata.geo.lat,
              lng: p.metadata.geo.lng,
              title: p.title,
              content: p.content,
              author: p.author?.full_name || "Member"
            });
          }
        });

        // Map Profiles (Simulate Trivandrum spread if no precise geo yet)
        (profiles || []).forEach((p, idx) => {
          const isBusiness = p.role === 'BUSINESS';
          // Basic spread around Trivandrum center for demo if no geo
          const spread = 0.02;
          const lat = 8.5241 + (Math.random() - 0.5) * spread;
          const lng = 76.9467 + (Math.random() - 0.5) * spread;

          nodes.push({
            id: p.id,
            type: isBusiness ? 'Businesses' : 'Partners',
            lat,
            lng,
            title: p.full_name,
            content: p.bio,
            avatar: p.avatar_url
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
      el.innerHTML = `
        <div class="relative group cursor-pointer">
          <div class="h-3 w-3 bg-${activeLayer === 'Events' ? '[#E53935]' : activeLayer === 'Businesses' ? 'indigo-500' : 'emerald-500'} rounded-full shadow-[0_0_15px_rgba(229,57,53,0.5)] border-2 border-white/20 transition-all group-hover:scale-150"></div>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
            <div class="bg-black/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap">
              <p class="text-[9px] font-black uppercase text-white">${node.title}</p>
            </div>
          </div>
        </div>
      `;

      new maplibregl.Marker(el)
        .setLngLat([node.lng, node.lat])
        .addTo(map.current!);
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
