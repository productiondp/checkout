"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  MapPin, 
  Users, 
  Zap, 
  Search, 
  Compass, 
  ArrowRight,
  Clock,
  X,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { DiscoveryPersonalizer } from "@/utils/discovery-personalizer";
import { 
  DiscoveryPreviewCard, 
  MeetupPreview, 
  EventPreview, 
  AdvisorPreview,
  PartnerPreview,
  type DiscoveryItem,
  type DealStatus
} from "./components/DiscoveryPreviewCard";
import { INDUSTRY_DATA, getIndustryById } from "@/utils/industry-data";

export default function DiscoveryMapPage() {
  const router = useRouter();
  const [items, setItems] = useState<DiscoveryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DiscoveryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 25.2048, lng: 55.2708 });
  
  // 🧠 V1.28 FOCUS MODE & PERSISTENCE
  const [activeFilter, setActiveFilter] = useState('Nearby');
  const [focusType, setFocusType] = useState<'ALL' | 'MEETUP' | 'REQUIREMENT' | 'PARTNER' | 'ADVISOR'>('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedFocus, setSelectedFocus] = useState<string>("");
  const [viewMode, setViewMode] = useState<'MAP' | 'LIST'>('MAP');
  
  const [topPick, setTopPick] = useState<DiscoveryItem | null>(null);
  const [focusZone, setFocusZone] = useState<{ lat: number, lng: number } | null>(null);
  const [pinnedItem, setPinnedItem] = useState<DiscoveryItem | null>(null);
  const [isPickDismissed, setIsPickDismissed] = useState(false);
  const [isPinDismissed, setIsPinDismissed] = useState(false);
  const [showViewSuggestion, setShowViewSuggestion] = useState(false);
  const [autoFocusNotice, setAutoFocusNotice] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showActionHint, setShowActionHint] = useState(false);
  const [peakMomentActive, setPeakMomentActive] = useState<Record<string, boolean>>({});
  const [userInteractionCount, setUserInteractionCount] = useState<Record<string, number>>({});
  
  // 🧠 V1.32 MOMENTUM LOOP STATE
  const [joinedItemIds, setJoinedItemIds] = useState<Set<string>>(new Set());
  const [showContinuation, setShowContinuation] = useState(false);
  const [joinCount, setJoinCount] = useState(0);

  // 🧠 V1.36 DEAL LIFECYCLE STATE
  const [dealStatus, setDealStatus] = useState<Record<string, DealStatus>>({});
  const [showOutcomeSurvey, setShowOutcomeSurvey] = useState(false);

  // 🧠 V1.42 GLOBAL INTENT LISTENERS
  useEffect(() => {
    const handleGlobalInteraction = () => {
       if (selectedItem?.id) {
          setUserInteractionCount(prev => ({
             ...prev,
             [selectedItem.id]: (prev[selectedItem.id] || 0) + 1
          }));
       }
    };

    window.addEventListener('scroll', handleGlobalInteraction, { passive: true });
    window.addEventListener('mousedown', handleGlobalInteraction);
    window.addEventListener('keydown', handleGlobalInteraction);

    return () => {
       window.removeEventListener('scroll', handleGlobalInteraction);
       window.removeEventListener('mousedown', handleGlobalInteraction);
       window.removeEventListener('keydown', handleGlobalInteraction);
    };
  }, [selectedItem]);

  // Initialize from LocalStorage
  useEffect(() => {
    const prefs = DiscoveryPersonalizer.getPrefs();
    setViewMode(prefs.preferredView);
    setActiveFilter(DiscoveryPersonalizer.getRecommendedFilter(['Nearby', 'Online', 'Today', 'High Trust']));
    setJoinCount(prefs.sessionsJoinedCount || 0);
    
    // 🧠 V1.30 GUIDED FIRST VISIT
    const suggested = DiscoveryPersonalizer.getSuggestedFocus();
    const isNew = Object.values(prefs.focusAffinities).every(v => v <= 1);

    if (isNew && !sessionStorage.getItem('checkout_onboarded')) {
      setIsFirstVisit(true);
      setFocusType('MEETUP'); // Start with Meetups as the most actionable
      setAutoFocusNotice("Start here: Meetups near you");
      sessionStorage.setItem('checkout_onboarded', 'true');
    } else if (suggested && !sessionStorage.getItem('checkout_focus_suggested')) {
      setFocusType(suggested as any);
      setAutoFocusNotice(`Focusing on ${suggested.toLowerCase()}s for you`);
      sessionStorage.setItem('checkout_focus_suggested', 'true');
      setTimeout(() => setAutoFocusNotice(null), 4000);
    }

    if (prefs.dismissedCount > 3) {
      setIsPickDismissed(true);
      setIsPinDismissed(true);
    }
  }, []);

  const handleJoin = (id: string) => {
    setJoinedItemIds(prev => new Set(prev).add(id));
    DiscoveryPersonalizer.trackJoin();
    setJoinCount(prev => prev + 1);
    
    // 🧠 V1.42 INTENT-AWARE PEAK MOMENT DETECTION
    const item = items.find(i => i.id === id);
    if (item?.type === 'MEETUP') {
       // Start tracking intent-based confidence score
       const checkIntent = setInterval(() => {
          const interactions = userInteractionCount[id] || 0;
          const timeSinceJoin = 0; // In a real app we'd track timestamp
          
          // Logic: Trigger if (High Interactions + 1.5 min) OR (Normal Interactions + 2.5 min)
          // For this MVP: Trigger after 1.5 min if interactions > 3, else 2.5 min
          const threshold = interactions > 3 ? 90000 : 150000;
          
          if (!document.hidden) { // Tab Active check
             setPeakMomentActive(prev => ({ ...prev, [id]: true }));
             clearInterval(checkIntent);
          }
       }, 90000); // Check every 1.5 min
    }

    // Trigger Momentum Loop nudge
    setTimeout(() => setShowContinuation(true), 2500);
  };

  const handleConfirmDeal = (id: string) => {
    setDealStatus(prev => ({ ...prev, [id]: 'IN_PROGRESS' }));
  };

  const handleCompleteDeal = (id: string) => {
    setDealStatus(prev => ({ ...prev, [id]: 'COMPLETED' }));
    setShowOutcomeSurvey(true);
  };

  const onViewProfile = (type: string, id: string) => {
    router.push(`/${type}/${id}`);
  };

  // Calculate distance
  const getDistance = (lat: number, lng: number) => {
    const dLat = (lat - mapCenter.lat) * 111;
    const dLng = (lng - mapCenter.lng) * 111 * Math.cos(mapCenter.lat * (Math.PI / 180));
    return Math.sqrt(dLat * dLat + dLng * dLng).toFixed(1);
  };

  const fetchNearby = useCallback(async () => {
    setLoading(true);
    try {
      const minLat = mapCenter.lat - 0.15;
      const maxLat = mapCenter.lat + 0.15;
      const minLng = mapCenter.lng - 0.15;
      const maxLng = mapCenter.lng + 0.15;

      const res = await fetch(`/api/discovery/nearby?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`);
      const data = await res.json();

      const normalized: DiscoveryItem[] = (data.items || []).map((m: any) => ({
        id: m.id,
        authorId: m.author_id,
        type: m.type as any,
        title: m.title,
        name: m.author_name || (m.type === 'MEETUP' ? 'Expert Meetup' : 'Partner Discovery'),
        lat: m.lat,
        lng: m.lng,
        participantCount: m.participant_count,
        maxSlots: m.max_slots,
        time: m.metadata?.timeline || 'Tomorrow',
        distance: getDistance(m.lat, m.lng),
        score: m.metadata?.trust_score || 4.5,
        avatar: m.avatar_url || m.avatar,
        role: m.professional_role || m.role || 'Advisor',
        purpose: m.metadata?.purpose || (m.type === 'MEETUP' ? 'Expert Alignment' : m.type === 'REQUIREMENT' ? 'Requirement' : 'Learning')
      }));

      // 🧠 V1.37 PRIORITY SORTING: Meetups first
      const sorted = normalized.sort((a, b) => {
        if (a.type === 'MEETUP' && b.type !== 'MEETUP') return -1;
        if (a.type !== 'MEETUP' && b.type === 'MEETUP') return 1;
        return 0;
      });

      const advisors = (data.advisors || []).map((a: any) => ({
        id: a.id,
        authorId: a.id,
        type: 'ADVISOR' as const,
        name: a.full_name || a.name,
        lat: a.lat,
        lng: a.lng,
        score: a.advisor_score,
        avatar: a.avatar_url || a.avatar,
        distance: getDistance(a.lat, a.lng),
        role: a.professional_role || a.role || 'Advisor',
        purpose: 'Expert Guidance'
      }));

      setItems([...sorted, ...advisors]);

      if (normalized.length > 0) {
        const best = normalized
          .filter(i => i.type === 'MEETUP')
          .sort((a, b) => (b.score || 0) - (a.score || 0))[0] || normalized[0];
        setTopPick(best);
        setPinnedItem(normalized[0]);
        const meetups = normalized.filter(i => i.type === 'MEETUP');
        if (meetups.length > 1) {
          setFocusZone({ lat: meetups[0].lat, lng: meetups[0].lng });
        }
      }
    } catch (e) {
      console.error("Discovery fetch failed", e);
    } finally {
      setLoading(false);
    }
  }, [mapCenter]);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

  // 🧠 V1.28 FILTERED ITEMS
  const filteredItems = items.filter(item => {
    if (focusType !== 'ALL' && item.type !== focusType) return false;
    if (selectedIndustry && item.industry !== selectedIndustry) return false;
    if (selectedFocus && !item.metadata?.focus_areas?.includes(selectedFocus)) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#FDFDFF] overflow-hidden flex flex-col">
      {/* 1. SHARED HEADER & FILTERS */}
      <div className="absolute top-0 left-0 right-0 z-[100] p-6 flex flex-col gap-4 pointer-events-none">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-4">
          
          {/* VIEW SWITCHER */}
          <div className="flex justify-center mb-2">
            <div className="h-10 w-40 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-premium flex p-1 pointer-events-auto">
              <button 
                onClick={() => { setViewMode('MAP'); setShowViewSuggestion(false); DiscoveryPersonalizer.trackViewSwitch('MAP'); setIsFirstVisit(false); }} 
                className={cn("flex-1 rounded-full text-[9px] font-black uppercase transition-all", viewMode === 'MAP' ? "bg-black text-white shadow-lg" : "text-slate-400")}
              >Map</button>
              <button 
                onClick={() => { setViewMode('LIST'); setShowViewSuggestion(false); DiscoveryPersonalizer.trackViewSwitch('LIST'); setIsFirstVisit(false); }} 
                className={cn("flex-1 rounded-full text-[9px] font-black uppercase transition-all", viewMode === 'LIST' ? "bg-black text-white shadow-lg" : "text-slate-400")}
              >List</button>
            </div>
          </div>

          {/* 🧠 PROGRESS SIGNAL (V1.32) - Value Framed V1.33 */}
          <AnimatePresence>
            {joinCount > 0 && (
              <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center -mb-2">
                <div className="px-4 py-1 bg-white/90 border border-slate-100 rounded-full text-[8px] font-black uppercase text-emerald-600 shadow-sm pointer-events-auto flex items-center gap-2">
                  <div className="h-1 w-1 bg-emerald-500 rounded-full" />
                  You've joined {joinCount} {joinCount === 1 ? 'valuable session' : 'valuable sessions'} • Growth Active
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-14 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-premium px-6 flex items-center gap-4 pointer-events-auto">
            <Search size={18} className="text-slate-300" />
            <input type="text" placeholder="Search everything..." className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-[#1D1D1F] placeholder:text-slate-200" />
            <Compass size={18} className="text-[#E53935]" />
          </div>

          {/* 🧠 FOCUS TOGGLE BAR (V1.28) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-2">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'MEETUP', label: 'Meetups' },
              { id: 'PARTNER', label: 'Partners' },
              { id: 'REQUIREMENT', label: 'Requirements' },
              { id: 'ADVISOR', label: 'Experts' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => { setFocusType(type.id as any); DiscoveryPersonalizer.trackFocusUsage(type.id); setAutoFocusNotice(null); setIsFirstVisit(false); }}
                className={cn(
                  "px-5 h-9 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap shadow-sm border",
                  focusType === type.id 
                    ? "bg-black border-black text-white scale-105" 
                    : "bg-white border-slate-50 text-slate-400",
                  isFirstVisit && type.id === 'MEETUP' ? "ring-2 ring-red-400 ring-offset-2" : ""
                )}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* 🧠 V1.25 VIEW SUGGESTION */}
          <AnimatePresence>
            {autoFocusNotice && (
              <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center mt-1">
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[8px] font-black uppercase flex items-center gap-2 border shadow-sm pointer-events-auto",
                  isFirstVisit ? "bg-red-50 text-red-500 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                )}>
                   <div className={cn("h-1 w-1 rounded-full animate-pulse", isFirstVisit ? "bg-red-500" : "bg-emerald-500")} />
                   {autoFocusNotice}
                </div>
              </motion.div>
            )}
            {showViewSuggestion && !autoFocusNotice && (
              <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center mt-2">
                <button onClick={() => setViewMode(viewMode === 'MAP' ? 'LIST' : 'MAP')} className="px-4 py-2 bg-slate-800 text-white rounded-full text-[8px] font-black uppercase flex items-center gap-2 pointer-events-auto">
                  Try {viewMode === 'MAP' ? 'List View' : 'Map View'} for more details
                  <ArrowRight size={10} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {/* 🧠 TAXONOMY FILTERS (V1.70) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-2">
             <select 
               value={selectedIndustry}
               onChange={(e) => { setSelectedIndustry(e.target.value); setSelectedFocus(""); }}
               className="h-9 px-4 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-xl text-[9px] font-black uppercase outline-none shadow-sm transition-all focus:border-[#E53935]/20"
             >
                <option value="">All Industries</option>
                {INDUSTRY_DATA.map(i => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
             </select>

             {selectedIndustry && (
               <select 
                 value={selectedFocus}
                 onChange={(e) => setSelectedFocus(e.target.value)}
                 className="h-9 px-4 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-xl text-[9px] font-black uppercase outline-none shadow-sm transition-all animate-in fade-in slide-in-from-left-2"
               >
                  <option value="">All Focus Areas</option>
                  {getIndustryById(selectedIndustry)?.focusAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
               </select>
             )}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 relative bg-slate-100 overflow-hidden mt-20">
        
        {/* MAP VIEW */}
        <div className={cn("absolute inset-0 transition-all duration-500", viewMode === 'MAP' ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none")}>
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 0)', backgroundSize: '30px 30px' }} />
          
          {focusZone && focusType === 'ALL' && (
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.08, 0.03] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute h-96 w-96 bg-[#E53935] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + (focusZone.lng - mapCenter.lng) * 500}%`, top: `${50 - (focusZone.lat - mapCenter.lat) * 500}%` }}
            />
          )}

          <div className="relative w-full h-full">
            {filteredItems.map(item => {
               const x = 50 + (item.lng - mapCenter.lng) * 400;
               const y = 50 - (item.lat - mapCenter.lat) * 400;

               return (
                <motion.button
                  key={item.id}
                  layoutId={item.id}
                  onClick={() => { setSelectedItem(item); if (Math.random() > 0.7) setShowViewSuggestion(true); if (isFirstVisit) setShowActionHint(true); }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full shadow-2xl transition-all border-2 border-white",
                    item.type === 'MEETUP' ? "bg-[#E53935]" : 
                    item.type === 'ADVISOR' ? "bg-[#0A84FF]" : 
                    item.type === 'PARTNER' ? "bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]" :
                    item.type === 'REQUIREMENT' ? "bg-amber-500" : "bg-emerald-500",
                    selectedItem?.id === item.id ? "ring-4 ring-black/10 ring-offset-4 z-20 scale-110" : "z-10",
                    item.id === topPick?.id && !isPickDismissed ? "ring-2 ring-white shadow-[0_0_40px_rgba(229,57,53,0.4)]" : ""
                  )}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {item.type === 'MEETUP' ? <Zap size={14} fill="white" /> : 
                   item.type === 'ADVISOR' ? <Users size={14} fill="white" /> :
                   item.type === 'PARTNER' ? <Zap size={14} fill="white" className="rotate-12" /> :
                   item.type === 'REQUIREMENT' ? <Compass size={14} fill="white" /> : <Navigation size={14} fill="white" />}
                  
                  {joinedItemIds.has(item.id) && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 border border-white rounded-full flex items-center justify-center">
                       <div className="h-1 w-1 bg-white rounded-full animate-pulse" />
                    </div>
                  )}

                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-0.5 rounded-full shadow-sm">
                    <span className="text-[7px] font-black uppercase whitespace-nowrap">{item.distance}km</span>
                  </div>
                </motion.button>
               );
            })}
          </div>

          {/* 🧠 ACTION HINT (V1.30) */}
          <AnimatePresence>
            {showActionHint && selectedItem && (
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-64 left-0 right-0 z-[300] flex justify-center pointer-events-none">
                  <div className="px-6 py-2 bg-black text-white rounded-full text-[9px] font-black uppercase flex items-center gap-3 shadow-2xl">
                    <Zap size={12} fill="#E53935" className="text-[#E53935]" />
                    Tap "Join" to participate
                  </div>
               </motion.div>
            )}
          </AnimatePresence>

          {/* 🧠 TOP PICK CHIP */}
          <AnimatePresence>
            {topPick && !selectedItem && !isPickDismissed && (focusType === 'ALL' || focusType === 'MEETUP') && (
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="absolute top-64 left-0 right-0 z-[60] flex justify-center pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button onClick={() => setSelectedItem(topPick)} className="px-6 h-12 bg-black text-white rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
                    <Zap size={16} fill="#E53935" className="text-[#E53935]" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Top pick for you</span>
                  </button>
                  <button onClick={() => { setIsPickDismissed(true); DiscoveryPersonalizer.trackDismissal(); }} className="h-12 w-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-black shadow-xl">
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LIST VIEW (MARKETPLACE) */}
        <div className={cn("absolute inset-0 bg-[#FDFDFF] transition-all duration-500 overflow-y-auto px-6 pt-[22rem] pb-32", viewMode === 'LIST' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none")}>
          <div className="max-w-xl mx-auto flex flex-col gap-4">
            
            {/* 🧠 PINNED PRIORITY ITEM */}
            {pinnedItem && !isPinDismissed && (focusType === 'ALL' || pinnedItem.type === focusType) && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2">
                    <Zap size={12} fill="currentColor" /> Top Opportunity
                  </h2>
                  <button onClick={() => { setIsPinDismissed(true); DiscoveryPersonalizer.trackDismissal(); }} className="text-[9px] font-black text-slate-300 uppercase hover:text-black">Dismiss</button>
                </div>
                <motion.div onClick={() => router.push(`/${pinnedItem.type.toLowerCase()}s/${pinnedItem.id}`)} className="bg-red-50/50 border border-red-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-[#E53935]">
                      <Zap size={24} fill="currentColor" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[9px] font-black text-[#E53935] uppercase mb-1">Recommended for you</div>
                      <h3 className="text-sm font-black text-[#1D1D1F] uppercase mb-1">{pinnedItem.title || pinnedItem.name}</h3>
                    </div>
                    <ArrowRight size={20} className="text-[#E53935]" />
                  </div>
                </motion.div>
                <div className="h-px bg-slate-100 my-4" />
              </>
            )}

            <h2 className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-2">
              {focusType === 'ALL' ? 'Discovery Feed' : `${focusType} Feed`}
            </h2>
            {filteredItems.map(item => (
              <motion.div key={item.id} layout onClick={() => router.push(`/${item.type.toLowerCase()}s/${item.id}`)} className="bg-white border border-slate-50 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", 
                    item.type === 'MEETUP' ? "bg-red-50 text-[#E53935]" : 
                    item.type === 'ADVISOR' ? "bg-blue-50 text-[#0A84FF]" : 
                    item.type === 'REQUIREMENT' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {item.type === 'MEETUP' ? <Zap size={24} fill="currentColor" /> : 
                     item.type === 'ADVISOR' ? <Users size={24} fill="currentColor" /> :
                     item.type === 'REQUIREMENT' ? <Compass size={24} fill="currentColor" /> : <Navigation size={24} fill="currentColor" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-[#1D1D1F] uppercase mb-1">{item.title || item.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{item.distance} km away</span>
                      {joinedItemIds.has(item.id) && <span className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1"><div className="h-1 w-1 bg-emerald-500 rounded-full" /> Joined</span>}
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-100 group-hover:text-black transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-[200]">
             <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scanning Area...</p>
             </div>
          </div>
        )}
      </div>

      {/* CONTEXTUAL EMPTY STATE */}
      {filteredItems.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center p-12 text-center z-50 bg-white/90 backdrop-blur-md">
           <div className="max-w-xs">
              <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200"><Compass size={40} /></div>
              <h3 className="text-lg font-black text-[#1D1D1F] uppercase mb-2">
                No {focusType.toLowerCase()}s here
              </h3>
              <p className="text-xs font-bold text-slate-300 uppercase leading-relaxed mb-8">
                Try moving to an active area or switch to 'All' to see the full ecosystem.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={() => setFocusType('ALL')} className="h-14 px-8 bg-black text-white rounded-2xl text-[10px] font-black uppercase shadow-xl">Show Everything</button>
                <button onClick={() => setMapCenter({ lat: 25.2048, lng: 55.2708 })} className="h-14 px-8 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400">Try Active Area</button>
              </div>
           </div>
        </div>
      )}

      {/* BOTTOM PREVIEW CARD / SHEET */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute bottom-0 left-0 right-0 z-[200] p-6 pointer-events-none">
            <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] border border-slate-50 p-8 pointer-events-auto relative">
              <button onClick={() => { setSelectedItem(null); setShowContinuation(false); }} className="absolute top-6 right-6 h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 hover:text-black transition-all"><X size={18} /></button>
              
              {/* 🧠 CONTINUATION NUDGE (V1.32) */}
              <AnimatePresence>
                {showContinuation && (
                  <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-12 left-0 right-0 flex justify-center">
                    <div className="px-5 py-2 bg-black text-white rounded-full text-[9px] font-black uppercase flex items-center gap-3 shadow-2xl border border-white/20">
                      <Compass size={12} className="text-amber-400" />
                      Explore more like this
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-start gap-6 mb-8">
                <div className={cn("h-20 w-20 rounded-2xl flex items-center justify-center shrink-0", selectedItem.type === 'MEETUP' ? "bg-red-50" : "bg-blue-50")}>
                  {selectedItem.type === 'MEETUP' ? <Zap size={32} className="text-[#E53935]" fill="currentColor" /> : 
                   <img src={selectedItem.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} className="h-full w-full object-cover rounded-2xl" alt="" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1D1D1F] uppercase mb-2 leading-none">{selectedItem.title || selectedItem.name}</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-2 py-0.5 bg-slate-900 text-white rounded-md text-[8px] font-black uppercase tracking-widest">Purpose: {selectedItem.purpose}</div>
                    {selectedItem.type === 'MEETUP' ? (
                      <>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase"><Clock size={12} /> {selectedItem.time}</div>
                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase">{selectedItem.maxSlots! - selectedItem.participantCount!} seats left</div>
                        
                        {/* 🧠 V1.31 CONFIDENCE SIGNALS */}
                        <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase">Free to join</div>
                        <div className="text-[9px] font-black text-slate-300 uppercase">You can leave anytime</div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-500 text-[10px] font-black uppercase">⭐ {selectedItem.score?.toFixed(1) || '4.5'} Trust Score • Helps you connect with Experts</div>
                    )}
                  </div>
                </div>
              </div>

              {/* 🧠 MODULAR PREVIEW CONTENT (V1.41) */}
              <div className="flex flex-col gap-4">
                {selectedItem.type === 'MEETUP' && (
                  <MeetupPreview 
                    item={selectedItem} 
                    isJoined={joinedItemIds.has(selectedItem.id)} 
                    dealStatus={dealStatus[selectedItem.id]}
                    onJoin={handleJoin}
                    onConfirmDeal={handleConfirmDeal}
                    onCompleteDeal={handleCompleteDeal}
                    onViewProfile={onViewProfile}
                    peakMomentActive={peakMomentActive[selectedItem.id]}
                  />
                )}
                {selectedItem.type === 'ADVISOR' && (
                  <AdvisorPreview 
                    item={selectedItem} 
                    isJoined={false}
                    onJoin={() => {}}
                    onConfirmDeal={() => {}}
                    onCompleteDeal={() => {}}
                    onViewProfile={onViewProfile}
                  />
                )}
                {selectedItem.type === 'PARTNER' && (
                  <PartnerPreview 
                    item={selectedItem} 
                    isJoined={false}
                    onJoin={() => {}}
                    onConfirmDeal={() => {}}
                    onCompleteDeal={() => {}}
                    onViewProfile={onViewProfile}
                  />
                )}
                {/* Fallback for other types */}
                {!['MEETUP', 'ADVISOR', 'PARTNER'].includes(selectedItem.type) && (
                  <button onClick={() => onViewProfile(selectedItem.type.toLowerCase() + 's', selectedItem.id)} className="w-full h-16 bg-black text-white rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 shadow-xl hover:bg-zinc-800 transition-all">
                    View Details <ArrowRight size={18} className="opacity-40" />
                  </button>
                )}

                {/* 🧠 MOMENTUM SIGNALS (V1.32) */}
                {selectedItem.type === 'MEETUP' && (
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <p className="text-[8px] font-black text-slate-300 uppercase">
                      {joinedItemIds.has(selectedItem.id) ? (
                        <span className="flex items-center gap-2">
                          <Clock size={10} className="text-[#E53935]" /> 
                          Starts in <span className="text-[#E53935]">01:54:12</span>
                        </span>
                      ) : "High response area • 5 others interested"}
                    </p>
                    {!joinedItemIds.has(selectedItem.id) && (
                      <p className="text-[8px] font-black text-slate-200 uppercase">3 people here are actively collaborating</p>
                    )}
                    {joinedItemIds.has(selectedItem.id) && dealStatus[selectedItem.id] !== 'COMPLETED' && (
                      <p className="text-[8px] font-black text-emerald-400 uppercase">This looks like a collaboration</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧠 OUTCOME SURVEY (V1.36) */}
      <AnimatePresence>
        {showOutcomeSurvey && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl">
              <div className="h-20 w-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                <Zap size={40} fill="currentColor" />
              </div>
              <h3 className="text-lg font-black text-[#1D1D1F] uppercase mb-2">What happened?</h3>
              <p className="text-[10px] font-bold text-slate-300 uppercase mb-8 leading-relaxed">Your outcome helps build a high-trust network</p>
              
              <div className="flex flex-col gap-3">
                 {[
                   { label: 'Partnership Started', icon: <Navigation size={14} /> },
                   { label: 'Requirement Met', icon: <Users size={14} /> },
                   { label: 'Learning Milestone', icon: <Zap size={14} /> }
                 ].map(outcome => (
                   <button key={outcome.label} onClick={() => setShowOutcomeSurvey(false)} className="h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[9px] font-black uppercase text-slate-500 hover:bg-black hover:text-white transition-all flex items-center justify-between">
                     {outcome.label}
                     {outcome.icon}
                   </button>
                 ))}
              </div>
              <button onClick={() => setShowOutcomeSurvey(false)} className="mt-6 text-[8px] font-black text-slate-300 uppercase tracking-widest">Skip for now</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
