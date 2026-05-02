"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  X, Zap, Target, Users, Sparkles, 
  ArrowRight, CheckCircle2, Activity,
  MapPin, Calendar, IndianRupee, Tag as TagIcon,
  Plus, Check, Clock, Briefcase, Globe,
  AlertCircle, ChevronRight, ChevronLeft, Info,
  Navigation, Search as SearchIcon, Video, Lock, Unlock,
  ShieldCheck, Star, Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { analytics } from "@/utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { detectBaseTag } from "@/utils/match-engine";
import { ClarityTextarea } from "@/components/ui/ClarityTextarea";
import { INDUSTRY_DATA, getIndustryById, detectTaxonomy, EXPERIENCE_LEVELS } from "@/utils/industry-data";
import { DEFAULT_AVATAR } from "@/utils/constants";
import PostSubmissionStatus, { SubmissionState } from "./PostSubmissionStatus";

import 'maplibre-gl/dist/maplibre-gl.css';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSuccess?: (post: any) => void;
  editPost?: any;
  initialFormType?: 'REQUIREMENT' | 'PARTNERSHIP' | 'MEETUP';
}

const TYPE_CONFIG = {
  REQUIREMENT: {
    label: "Requirement",
    icon: Target,
    color: "bg-[#1D1D1F]",
    shadow: "shadow-black/10",
    steps: 6,
    cta: "Post Requirement"
  },
  PARTNERSHIP: {
    label: "Partner",
    icon: Sparkles,
    color: "bg-[#34C759]",
    shadow: "shadow-emerald-500/20",
    steps: 7,
    cta: "Post Partner Opportunity"
  },
  MEETUP: {
    label: "Meetup",
    icon: Users,
    color: "bg-[#E53935]",
    shadow: "shadow-red-600/20",
    steps: 9,
    cta: "Host Meetup"
  }
};

export default function PostModal({ isOpen, onClose, onPostSuccess, editPost, initialFormType = 'REQUIREMENT' }: PostModalProps) {
  const { user: authUser } = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  
  // CORE STATE
  const [type, setType] = useState<'REQUIREMENT' | 'PARTNERSHIP' | 'MEETUP'>(
    initialFormType === 'MEETUP' ? 'MEETUP' : (initialFormType === 'PARTNERSHIP' ? 'PARTNERSHIP' : 'REQUIREMENT')
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [content, setContent] = useState("");
  const [industry, setIndustry] = useState<string>("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  
  // AUX STATE
  const [experienceLevel, setExperienceLevel] = useState<string>("Intermediate");
  const [commitment, setCommitment] = useState<string>("Active");
  const [stage, setStage] = useState<string>("Idea");
  const [timeline, setTimeline] = useState<string>("Flexible");
  const [budget, setBudget] = useState<string>("Open");
  const [budgetType, setBudgetType] = useState<string>("Fixed");
  const [location, setLocation] = useState<string>("Remote");
  const [workType, setWorkType] = useState<string>("Part-time");
  const [weeklyHours, setWeeklyHours] = useState<string>("10-20 hours");
  
  // MEETUP SPECIFIC
  const [meetupSubtype, setMeetupSubtype] = useState<'OPEN' | 'ADVISOR'>('OPEN');
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [meetupGeo, setMeetupGeo] = useState<{ lat: number, lng: number, address: string }>({
    lat: 9.9312,
    lng: 76.2673,
    address: "Kochi, Kerala"
  });
  const [meetupCapacity, setMeetupCapacity] = useState<string>("8");
  const [meetupPrice, setMeetupPrice] = useState<string>("Free");
  const [meetupFormat, setMeetupFormat] = useState<string>("In-person");
  const [meetupAccess, setMeetupAccess] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [meetupTime, setMeetupTime] = useState<string>("18:00");
  const [meetupDate, setMeetupDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [meetupDuration, setMeetupDuration] = useState<string>("1 hour");
  const [meetupPlatform, setMeetupPlatform] = useState<string>("Zoom");
  const [meetupAgenda, setMeetupAgenda] = useState<string>("");
  const [meetupTarget, setMeetupTarget] = useState<string>("");
  
  // SMART FEATURES STATE
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [suggestedIndustry, setSuggestedIndustry] = useState<any>(null);
  const [isImproving, setIsImproving] = useState(false);

  const [suggestion, setSuggestion] = useState<{ industry: string, focus: string } | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // RESET LOGIC
  useEffect(() => {
    if (isOpen) {
      setSubmissionState(null);
      if (editPost) {
        setContent(editPost.content || "");
        setType(editPost.type);
        setIndustry(editPost.industry || "");
        setFocusAreas(editPost.skills_required || []);
        if (editPost.type === 'MEETUP') {
          setMeetupDate(editPost.dateTime?.split(' ')[0] || "");
          setMeetupTime(editPost.dateTime?.split(' ')[1] || "");
          setMeetupPrice(editPost.payment_type || "Free");
        }
      } else {
        setContent("");
        setIndustry("");
        setFocusAreas([]);
        setCurrentStep(1);
      }
    }
  }, [isOpen, editPost]);

  // SMART: INDUSTRY AUTO-DETECTION
  useEffect(() => {
    if (content.length > 5 && !industry) {
      const detected = detectTaxonomy(content);
      if (detected) setSuggestedIndustry(detected);
      else setSuggestedIndustry(null);
    } else {
      setSuggestedIndustry(null);
    }
  }, [content, industry]);

  // SMART: LOCATION SEARCH (PHOTON API)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (locationQuery.length > 1) {
        setIsSearchingLocation(true);
        try {
          // Add bias if we have current lat/lng
          const bias = meetupGeo.lat ? `&lat=${meetupGeo.lat}&lon=${meetupGeo.lng}` : "";
          const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(locationQuery)}&limit=5${bias}`);
          const data = await res.json();
          setLocationSuggestions(data.features || []);
        } catch (err) {
          console.error("Location search failed", err);
        } finally {
          setIsSearchingLocation(false);
        }
      } else {
        setLocationSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [locationQuery]);

  // FETCH ADVISORS
  useEffect(() => {
    if (type === 'MEETUP' && currentStep === 4 && meetupSubtype === 'ADVISOR') {
      async function fetchAdvisors() {
        const { data } = await supabase.from('profiles').select('*').limit(5);
        setAdvisors(data || []);
      }
      fetchAdvisors();
    }
  }, [currentStep, type, meetupSubtype]);

  // MAP INITIALIZATION
  useEffect(() => {
    if (type === 'MEETUP' && currentStep === 5 && meetupFormat === 'In-person' && mapContainerRef.current) {
      const initMap = async () => {
        const maplibregl = (await import('maplibre-gl')).default;
        if (mapRef.current) mapRef.current.remove();
        mapRef.current = new maplibregl.Map({
          container: mapContainerRef.current!,
          style: 'https://demotiles.maplibre.org/style.json',
          center: [meetupGeo.lng, meetupGeo.lat],
          zoom: 12
        });
        const marker = new maplibregl.Marker({ draggable: true })
          .setLngLat([meetupGeo.lng, meetupGeo.lat])
          .addTo(mapRef.current);
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          setMeetupGeo(prev => ({ ...prev, lat: lngLat.lat, lng: lngLat.lng }));
        });
      };
      initMap();
    }
  }, [currentStep, type, meetupFormat]);

  const improveMessage = () => {
    // Rely on Clarity Assistant for refinement
    if (inputRef.current) {
      // Trigger refinement via the ClarityTextarea internal logic if possible
      // or just use the local simple expansion as a fallback
      setIsImproving(true);
      setTimeout(() => {
        let improved = content;
        if (content.toLowerCase().includes("need dev")) improved = content.replace(/need dev/i, "Looking for a skilled developer to build an MVP");
        else if (content.toLowerCase().includes("startup meetup")) improved = "Hosting a networking session for startup founders and early employees in Kochi";
        else if (content.length < 30) improved = `I'm looking to connect with people about ${content}. Specifically interested in finding partners for collaboration.`;
        
        setContent(improved);
        setIsImproving(false);
      }, 600);
    }
  };

  const handlePost = async () => {
    if (!authUser?.id) return;
    if (!content.trim() || !industry || focusAreas.length === 0) {
      setError("Please complete all required fields");
      return;
    }

    setSubmissionState('PREPARING');
    setError(null);

    // Confidence delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSubmissionState('POSTING');
    const idempotencyKey = `${authUser.id}-${Date.now()}`;
    
    const payload = {
      author_id: authUser.id,
      industry,
      type,
      title: content.split('\n')[0].substring(0, 60) || "New Post",
      content,
      location: type === 'MEETUP' ? (meetupFormat === 'Online' ? meetupPlatform : meetupGeo.address) : location,
      budget: type === 'REQUIREMENT' ? (budget === 'Open' ? 'Open' : `${budget} (${budgetType})`) : (type === 'MEETUP' ? meetupPrice : null),
      due_date: timeline === "ASAP" ? new Date().toISOString() : null,
      skills_required: focusAreas,
      partnershipType: type === 'PARTNERSHIP' ? focusAreas[0] : null,
      commitmentLevel: type === 'PARTNERSHIP' ? commitment.toUpperCase() : null,
      max_slots: type === 'MEETUP' ? parseInt(meetupCapacity) || 8 : 1,
      payment_type: type === 'MEETUP' ? meetupPrice : 'Free',
      context: idempotencyKey,
      dateTime: type === 'MEETUP' ? `${meetupDate} ${meetupTime}` : null,
      metadata: {
        focus_areas: focusAreas,
        experience_level: experienceLevel,
        stage: stage.toLowerCase(),
        commitment: commitment,
        duration: type === 'MEETUP' ? meetupDuration : null,
        meetup_type: type === 'MEETUP' ? meetupSubtype : null,
        advisor_id: selectedAdvisor?.id,
        geo: type === 'MEETUP' ? { lat: meetupGeo.lat, lng: meetupGeo.lng } : null,
        access: type === 'MEETUP' ? meetupAccess : 'OPEN',
        agenda: type === 'MEETUP' ? meetupAgenda : null,
        target_audience: type === 'MEETUP' ? meetupTarget : null,
        is_visible: type === 'MEETUP' && meetupSubtype === 'ADVISOR' ? false : true
      }
    };

    try {
      const { data, error: postErr } = editPost 
        ? await supabase.from('posts').update(payload).eq('id', editPost.id).select().single()
        : await supabase.from('posts').insert([payload]).select().single();
      if (postErr) throw postErr;
      
      setSubmissionState('SUCCESS');
      
      // Register for auto-scroll and highlight in Feed
      localStorage.setItem('checkout_last_post', JSON.stringify({
        title: payload.title,
        time: Date.now()
      }));

      // Show success for 2 seconds before closing
      setTimeout(() => {
        onPostSuccess?.(data);
        onClose();
        setSubmissionState(null);
      }, 2000);

    } catch (err: any) {
      console.error("[COMPOSER_FATAL_ERROR] Database rejected the payload:", err);
      if (err.details) console.error("Error Details:", err.details);
      if (err.hint) console.error("Error Hint:", err.hint);
      setSubmissionState('FAILED');
      setError(err.message || "Failed to post. Please try again.");
    }
  };

  const config = TYPE_CONFIG[type];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-safe">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 1 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, y: 100 }}
        className="relative w-full sm:w-[90%] sm:max-w-xl bg-white rounded-t-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[92vh] sm:h-auto max-h-[92vh] sm:max-h-[95vh]"
      >
        {/* EDITORIAL HEADER */}
        <div className="flex items-center justify-between shrink-0 p-8 md:p-10 pb-6 border-b border-black/[0.03] relative overflow-hidden">
           {/* Subtle background glow */}
           <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-16 -mt-16 rounded-full transition-colors duration-700", config.color)} />
           
           <div className="flex items-center gap-4 relative z-10">
              <div className={cn("h-14 w-14 text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:scale-110", config.color, config.shadow)}>
                 <config.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="space-y-0.5">
                 <h2 className="text-2xl font-black italic tracking-tighter text-[#1D1D1F] uppercase leading-none">
                    Launch <span className={cn("transition-colors duration-700", type === 'MEETUP' ? "text-[#E53935]" : type === 'PARTNERSHIP' ? "text-[#34C759]" : "text-black")}>{config.label}</span>
                 </h2>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Step {currentStep} of {config.steps} • Mission Control</p>
              </div>
           </div>
           <button onClick={onClose} className="h-12 w-12 bg-slate-50 border border-black/[0.03] rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all relative z-10">
             <X size={20} strokeWidth={3} />
           </button>
        </div>

        {/* PREMIUM MODE SELECTOR */}
        {currentStep === 1 && (
           <div className="px-8 md:px-10 py-4 bg-white border-b border-black/[0.03]">
              <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-2xl">
                 {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                   <button
                     key={key}
                     onClick={() => { setType(key as any); setCurrentStep(1); }}
                     className={cn(
                       "flex-1 h-12 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                       type === key ? "bg-white text-black shadow-lg shadow-black/5 scale-[1.02]" : "text-slate-400 hover:text-slate-600"
                     )}
                   >
                     <cfg.icon size={14} strokeWidth={type === key ? 3 : 2} className={cn("transition-colors", type === key ? "text-[#E53935]" : "text-slate-400")} />
                     {cfg.label}
                   </button>
                 ))}
              </div>
           </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 lg:p-10 pt-4">
          <AnimatePresence mode="wait">
             <motion.div
               key={`${type}-${currentStep}`}
               initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
               className="space-y-6 pb-2"
             >                {/* STEP 1: WHAT */}
                {currentStep === 1 && (
                   <div className="space-y-8">
                      <div className="space-y-3">
                        <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none text-[#1D1D1F] uppercase">
                           {type === 'MEETUP' ? "Meetup Vision" : 
                            type === 'PARTNERSHIP' ? "Project Vision" : 
                            "Mission Brief"}
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Define the core objective of your broadcast</p>
                      </div>
                      
                      <div className="relative group">
                        <div className="absolute -top-4 -right-4 z-20">
                           <motion.div 
                             initial={{ scale: 0, rotate: -20 }}
                             animate={{ scale: 1, rotate: 0 }}
                             className="bg-white border border-[#E53935]/20 shadow-2xl rounded-2xl p-4 max-w-[200px] relative"
                           >
                              <div className="flex items-center gap-2 mb-2">
                                 <Sparkles size={14} className="text-[#E53935]" />
                                 <span className="text-[9px] font-black uppercase text-[#E53935]">AI Intelligence</span>
                              </div>
                              <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                                 {content.length < 10 ? "Start typing to see match potential..." : 
                                  content.length < 50 ? "Be more specific about your industry for 2x better matches." :
                                  "Great detail! This will likely match with 12+ experts."}
                              </p>
                              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-[#E53935]/10 rotate-45" />
                           </motion.div>
                        </div>

                        <ClarityTextarea
                          ref={inputRef}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder={
                            type === 'MEETUP' ? "E.g. Coffee & Code at Kochi Marina..." : 
                            type === 'PARTNERSHIP' ? "E.g. Building a fintech startup for Kerala..." : 
                            "E.g. Need a senior dev for a 2-week sprint..."
                          }
                          type={type}
                          className="min-h-[240px] text-xl p-8 bg-[#FDFDFF] border-2 border-black/[0.03] rounded-[2.5rem] focus:border-[#E53935]/20 focus:ring-0 transition-all placeholder:text-slate-300 font-bold italic"
                        />
                      </div>

                      {(suggestedIndustry || content.length > 20) && (
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-5 bg-[#F5F5F7] rounded-[2rem] border border-black/[0.03] shadow-sm">
                            {suggestedIndustry?.confidence >= 70 ? (
                               <>
                                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#E53935] shadow-sm"><Sparkles size={20} /></div>
                                  <div className="flex-1">
                                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Auto-Detection</p>
                                     <p className="text-[12px] font-black uppercase text-slate-800 tracking-tighter italic">{getIndustryById(suggestedIndustry.industry)?.label} • {suggestedIndustry.focus}</p>
                                  </div>
                                  <button 
                                    onClick={() => { setIndustry(suggestedIndustry.industry); setFocusAreas([suggestedIndustry.focus]); setSuggestedIndustry(null); }}
                                    className="h-10 px-5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all"
                                  >Deploy</button>
                               <>
                            ) : (
                               <>
                                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-slate-400"><TagIcon size={20} /></div>
                                  <div className="flex-1">
                                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Intelligence Scan</p>
                                     <p className="text-[11px] font-black uppercase text-slate-700">{content.length < 30 ? "Keep describing your mission..." : "Almost ready. Select category manually."}</p>
                                  </div>
                               </>
                            )}
                         </motion.div>
                      )}
                   </div>
                )}


                {/* STEP 2: CATEGORY */}
                {currentStep === 2 && (
                   <div className="space-y-6">
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight">Pick a category</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {INDUSTRY_DATA.slice(0, 8).map(i => (
                           <button
                             key={i.id}
                             onClick={() => { setIndustry(i.id); setFocusAreas([]); }}
                             className={cn("h-14 rounded-2xl text-[10px] font-black uppercase transition-all border", industry === i.id ? "bg-black text-white border-black shadow-xl" : "bg-white text-slate-400 border-black/[0.05] hover:border-black/[0.15]")}
                           >{i.label}</button>
                        ))}
                      </div>
                      {industry && (
                        <div className="flex flex-wrap gap-2 pt-2">
                           {getIndustryById(industry)?.focusAreas.map(area => (
                             <button
                               key={area}
                               onClick={() => {
                                 if (focusAreas.includes(area)) setFocusAreas(prev => prev.filter(a => a !== area));
                                 else if (focusAreas.length < 3) setFocusAreas(prev => [...prev, area]);
                               }}
                               className={cn("px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all border", focusAreas.includes(area) ? "bg-black text-white border-black" : "bg-white text-slate-400 border-black/[0.05]")}
                             >{area}</button>
                           ))}
                        </div>
                      )}
                   </div>
                )}

                {/* --- MEETUP SPECIFIC --- */}
                {type === 'MEETUP' && (
                  <>
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">Choose Format</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <button onClick={() => setMeetupSubtype('OPEN')} className={cn("p-6 rounded-[2rem] border text-left transition-all", meetupSubtype === 'OPEN' ? "border-[#E53935] bg-[#E53935]/5 shadow-lg" : "border-slate-100")}>
                            <div className="flex items-center gap-4">
                              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", meetupSubtype === 'OPEN' ? "bg-[#E53935] text-white" : "bg-slate-50 text-slate-400")}><Users size={24} /></div>
                              <div><p className="text-[14px] font-black uppercase text-[#1D1D1F]">Open Meetup</p><p className="text-[10px] font-bold text-slate-400 uppercase">Visible to everyone relevant</p></div>
                              {meetupSubtype === 'OPEN' && <CheckCircle2 className="ml-auto text-[#E53935]" size={20} />}
                            </div>
                          </button>
                          <button onClick={() => setMeetupSubtype('ADVISOR')} className={cn("p-6 rounded-[2rem] border text-left transition-all", meetupSubtype === 'ADVISOR' ? "border-[#E53935] bg-[#E53935]/5 shadow-lg" : "border-slate-100")}>
                            <div className="flex items-center gap-4">
                              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", meetupSubtype === 'ADVISOR' ? "bg-[#E53935] text-white" : "bg-slate-50 text-slate-400")}><ShieldCheck size={24} /></div>
                              <div><p className="text-[14px] font-black uppercase text-[#1D1D1F]">Advisor Meetup</p><p className="text-[10px] font-bold text-slate-400 uppercase">Requires advisor approval</p></div>
                              {meetupSubtype === 'ADVISOR' && <CheckCircle2 className="ml-auto text-[#E53935]" size={20} />}
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        {meetupSubtype === 'ADVISOR' ? (
                          <>
                            <h3 className="text-2xl font-black tracking-tight">Select Advisor</h3>
                            <div className="space-y-3">
                              {advisors.map(adv => (
                                <button key={adv.id} onClick={() => setSelectedAdvisor(adv)} className={cn("w-full p-4 rounded-2xl border flex items-center gap-4 transition-all text-left", selectedAdvisor?.id === adv.id ? "border-[#E53935] bg-[#E53935]/5" : "border-slate-100")}>
                                  <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm"><img src={adv.avatar_url || DEFAULT_AVATAR} className="w-full h-full object-cover" /></div>
                                  <div className="flex-1"><p className="text-[12px] font-black uppercase text-[#1D1D1F]">{adv.full_name}</p><p className="text-[9px] font-bold text-slate-400 uppercase">Expert Advisor</p></div>
                                  {selectedAdvisor?.id === adv.id && <CheckCircle2 className="text-[#E53935]" size={18} />}
                                </button>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="py-10 text-center space-y-4">
                            <div className="h-16 w-16 bg-slate-50 text-[#E53935] rounded-full flex items-center justify-center mx-auto"><Users size={32} /></div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Standard Meetup</h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase max-w-[250px] mx-auto leading-relaxed">Directly host a session for anyone relevant in the network.</p>
                          </div>
                        )}
                      </div>
                    )}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">Where?</h3>
                        <div className="flex p-1 bg-slate-50 rounded-xl border border-black/[0.03]">
                           {['In-person', 'Online'].map(f => (
                             <button key={f} onClick={() => setMeetupFormat(f)} className={cn("flex-1 h-12 rounded-lg text-[10px] font-black uppercase transition-all", meetupFormat === f ? "bg-white text-black shadow-sm" : "text-slate-400")}>{f}</button>
                           ))}
                        </div>
                        {meetupFormat === 'In-person' ? (
                           <div className="space-y-4">
                              <div className="relative">
                                 <input 
                                   value={locationQuery} 
                                   onChange={(e) => setLocationQuery(e.target.value)} 
                                   placeholder="Search city, area or building..." 
                                   className="w-full h-14 pl-12 pr-6 bg-slate-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" 
                                 />
                                 <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                 
                                 {locationSuggestions.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                                       {locationSuggestions.map((s, idx) => (
                                          <button 
                                            key={idx}
                                            onClick={() => {
                                               const [lng, lat] = s.geometry.coordinates;
                                               const addr = s.properties.name + (s.properties.city ? `, ${s.properties.city}` : "") + (s.properties.state ? `, ${s.properties.state}` : "");
                                               setMeetupGeo({ lat, lng, address: addr });
                                               setLocationQuery("");
                                               setLocationSuggestions([]);
                                               if (mapRef.current) mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
                                            }}
                                            className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 text-left transition-all border-b border-slate-50 last:border-none"
                                          >
                                             <MapPin size={16} className="text-slate-300" />
                                             <div>
                                                <p className="text-[12px] font-bold text-slate-800">{s.properties.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">{s.properties.city || s.properties.state || s.properties.country}</p>
                                             </div>
                                          </button>
                                       ))}
                                    </motion.div>
                                 )}
                              </div>

                              <div className="h-[200px] w-full rounded-2xl bg-slate-50 border relative overflow-hidden" ref={mapContainerRef}>
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"><MapPin size={32} className="text-[#E53935] -mt-8" /></div>
                                 <button 
                                   onClick={() => {
                                      navigator.geolocation.getCurrentPosition((pos) => {
                                         const { latitude, longitude } = pos.coords;
                                         setMeetupGeo(prev => ({ ...prev, lat: latitude, lng: longitude }));
                                         if (mapRef.current) mapRef.current.flyTo({ center: [longitude, latitude], zoom: 14 });
                                      });
                                   }}
                                   className="absolute bottom-4 right-4 h-10 w-10 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-600 hover:text-black z-20"
                                 >
                                    <Navigation size={18} />
                                 </button>
                              </div>
                              <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest"> {meetupGeo.address || "Kochi, Kerala"}</p>
                           </div>
                        ) : (
                           <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                 {['Zoom', 'Google Meet', 'Teams', 'Other'].map(p => (
                                   <button key={p} onClick={() => setMeetupPlatform(p)} className={cn("h-16 rounded-xl border flex items-center justify-center gap-3", meetupPlatform === p ? "border-black bg-black text-white" : "border-slate-100 text-slate-400")}><Video size={16} /><span className="text-[10px] font-black uppercase">{p}</span></button>
                                 ))}
                              </div>
                              <input placeholder="Meeting link (optional)" className="w-full h-14 px-6 bg-slate-50 rounded-xl font-bold border-none" />
                           </div>
                        )}
                      </div>
                    )}
                    {currentStep === 6 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">Timing</h3>
                        <div className="space-y-4">
                           <input type="date" value={meetupDate} onChange={(e) => setMeetupDate(e.target.value)} className="w-full h-16 bg-slate-50 rounded-xl px-6 font-bold" />
                           <div className="grid grid-cols-2 gap-4">
                              <input type="time" value={meetupTime} onChange={(e) => setMeetupTime(e.target.value)} className="w-full h-16 bg-slate-50 rounded-xl px-6 font-bold" />
                              <select value={meetupDuration} onChange={(e) => setMeetupDuration(e.target.value)} className="w-full h-16 bg-slate-50 rounded-xl px-6 font-bold outline-none"><option>45 mins</option><option>1 hour</option><option>1.5 hours</option><option>2 hours</option></select>
                           </div>
                        </div>
                      </div>
                    )}
                    {currentStep === 7 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">Access & Cost</h3>
                        <div className="flex p-1 bg-slate-50 rounded-xl border border-black/[0.03]">
                           {['Free', 'Paid'].map(c => (
                             <button key={c} onClick={() => setMeetupPrice(c)} className={cn("flex-1 h-12 rounded-lg text-[10px] font-black uppercase transition-all", meetupPrice === c || (meetupPrice !== 'Free' && c === 'Paid') ? "bg-white text-black shadow-sm" : "text-slate-400")}>{c}</button>
                           ))}
                        </div>
                        {meetupPrice !== 'Free' && <input type="text" value={meetupPrice === 'Paid' ? "" : meetupPrice} onChange={(e) => setMeetupPrice(e.target.value)} placeholder="Amount" className="w-full h-16 bg-slate-50 rounded-xl px-6 font-black text-lg" />}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                           <button onClick={() => setMeetupAccess('OPEN')} className={cn("h-20 rounded-2xl border flex flex-col items-center justify-center gap-1", meetupAccess === 'OPEN' ? "border-black bg-black text-white" : "border-slate-100 text-slate-400")}><Unlock size={18} /><span className="text-[9px] font-black uppercase">Anyone</span></button>
                           <button onClick={() => setMeetupAccess('CLOSED')} className={cn("h-20 rounded-2xl border flex flex-col items-center justify-center gap-1", meetupAccess === 'CLOSED' ? "border-black bg-black text-white" : "border-slate-100 text-slate-400")}><Lock size={18} /><span className="text-[9px] font-black uppercase">Approval</span></button>
                        </div>
                      </div>
                    )}
                    {currentStep === 8 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">Details</h3>
                        <div className="space-y-4">
                           <textarea value={meetupAgenda} onChange={(e) => setMeetupAgenda(e.target.value)} placeholder="What will happen?" className="w-full h-32 p-6 bg-slate-50 rounded-2xl font-medium text-sm" />
                           <textarea value={meetupTarget} onChange={(e) => setMeetupTarget(e.target.value)} placeholder="Who should join?" className="w-full h-32 p-6 bg-slate-50 rounded-2xl font-medium text-sm" />
                        </div>
                      </div>
                    )}
                    {currentStep === 9 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Review Session</h3>
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-black/[0.03] space-y-6">
                           <div className="flex items-center gap-4 border-b pb-4">
                              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><Users className="text-[#E53935]" size={24} /></div>
                              <div><p className="text-[10px] font-black uppercase text-slate-300">Topic</p><p className="text-[14px] font-black text-[#1D1D1F] line-clamp-1">{content.split('\n')[0]}</p></div>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div><p className="text-[9px] font-black uppercase text-slate-300">When</p><p className="text-[11px] font-black uppercase text-[#1D1D1F]">{new Date(meetupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}  {meetupTime}</p></div>
                              <div><p className="text-[9px] font-black uppercase text-slate-300">Where</p><p className="text-[11px] font-black uppercase text-[#1D1D1F] truncate">{meetupFormat === 'Online' ? meetupPlatform : meetupGeo.address}</p></div>
                              <div><p className="text-[9px] font-black uppercase text-slate-300">Cost</p><p className="text-[11px] font-black uppercase text-[#1D1D1F]">{meetupPrice}</p></div>
                              <div><p className="text-[9px] font-black uppercase text-slate-300">Seats</p><p className="text-[11px] font-black uppercase text-[#1D1D1F]">{meetupCapacity} Seats</p></div>
                           </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* --- REQUIREMENT SPECIFIC --- */}
                {type === 'REQUIREMENT' && (
                  <>
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Skills Needed</h3>
                        <div className="flex flex-wrap gap-2">
                           {focusAreas.map(f => (<div key={f} className="px-5 py-3 bg-slate-50 border rounded-xl text-[10px] font-black uppercase">{f}</div>))}
                        </div>
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Timeline</h3>
                        <div className="grid grid-cols-1 gap-3">
                           {['ASAP', 'Within 7 Days', 'Flexible'].map(t => (
                             <button key={t} onClick={() => setTimeline(t)} className={cn("h-16 px-8 rounded-xl flex items-center justify-between border transition-all", timeline === t ? "bg-black text-white" : "bg-white text-slate-400")}><span className="text-[12px] font-black uppercase tracking-widest">{t}</span>{timeline === t && <CheckCircle2 size={20} />}</button>
                           ))}
                        </div>
                      </div>
                    )}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Budget</h3>
                        <div className="flex p-1 bg-slate-50 rounded-xl border">
                           {['Fixed', 'Hourly', 'Open'].map(b => (
                             <button key={b} onClick={() => setBudgetType(b)} className={cn("flex-1 h-12 rounded-lg text-[10px] font-black uppercase transition-all", budgetType === b ? "bg-white text-black shadow-sm" : "text-slate-400")}>{b}</button>
                           ))}
                        </div>
                        <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Amount" className="w-full h-16 bg-slate-50 rounded-xl px-6 font-black text-lg" />
                      </div>
                    )}
                    {currentStep === 6 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Review</h3>
                        <div className="p-6 bg-slate-50 rounded-[2rem] border space-y-4">
                           <p className="text-sm font-bold text-slate-800 italic">"{content}"</p>
                           <div className="grid grid-cols-2 gap-4">
                              <div><p className="text-[9px] font-black uppercase text-slate-300">Budget</p><p className="text-[11px] font-black uppercase">{budget}</p></div>
                              <div><p className="text-[9px] font-black uppercase text-slate-300">Timeline</p><p className="text-[11px] font-black uppercase">{timeline}</p></div>
                           </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* --- PARTNERSHIP SPECIFIC --- */}
                {type === 'PARTNERSHIP' && (
                  <>
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Expertise</h3>
                        <div className="flex gap-2">
                           {EXPERIENCE_LEVELS.map(level => (
                             <button key={level} onClick={() => setExperienceLevel(level)} className={cn("flex-1 h-14 rounded-xl text-[10px] font-black uppercase transition-all border", experienceLevel === level ? "bg-black text-white" : "bg-white text-slate-400")}>{level}</button>
                           ))}
                        </div>
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Commitment</h3>
                        <div className="grid grid-cols-1 gap-3">
                           {['Casual', 'Active', 'Serious'].map(c => (
                             <button key={c} onClick={() => setCommitment(c)} className={cn("h-16 px-8 rounded-xl flex items-center justify-between border transition-all", commitment === c ? "bg-[#34C759] text-white" : "bg-white text-slate-400")}><span className="text-[12px] font-black uppercase tracking-widest">{c}</span>{commitment === c && <CheckCircle2 size={20} />}</button>
                           ))}
                        </div>
                      </div>
                    )}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Project Stage</h3>
                        <div className="grid grid-cols-1 gap-3">
                           {['Idea', 'MVP Built', 'Growth'].map(s => (
                             <button key={s} onClick={() => setStage(s)} className={cn("h-16 px-8 rounded-xl flex items-center justify-between border transition-all", stage === s ? "bg-[#34C759] text-white" : "bg-white text-slate-400")}><span className="text-[12px] font-black uppercase tracking-widest">{s}</span>{stage === s && <CheckCircle2 size={20} />}</button>
                           ))}
                        </div>
                      </div>
                    )}
                    {currentStep === 6 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Expectations</h3>
                        <div className="grid grid-cols-2 gap-3">
                           {['Part-time', 'Full-time'].map(w => (
                             <button key={w} onClick={() => setWorkType(w)} className={cn("h-16 rounded-xl flex items-center justify-center border transition-all", workType === w ? "bg-black text-white" : "bg-white text-slate-400")}><span className="text-[10px] font-black uppercase">{w}</span></button>
                           ))}
                        </div>
                        <input value={weeklyHours} onChange={(e) => setWeeklyHours(e.target.value)} placeholder="Weekly Hours (e.g. 10-15)" className="w-full h-16 bg-slate-50 rounded-xl px-6 font-bold" />
                      </div>
                    )}
                    {currentStep === 7 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Review</h3>
                        <div className="p-6 bg-slate-50 rounded-[2rem] border space-y-4">
                           <p className="text-sm font-bold text-slate-800 italic">"{content}"</p>
                           <div className="grid grid-cols-2 gap-4">
                              <div><p className="text-[9px] font-black uppercase text-slate-300">Stage</p><p className="text-[11px] font-black uppercase">{stage}</p></div>
                              <div><p className="text-[9px] font-black uppercase text-slate-300">Hours</p><p className="text-[11px] font-black uppercase">{weeklyHours || 'Flexible'}</p></div>
                           </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* NAVIGATION */}
                <div className="pt-4 flex flex-col gap-4">
                   {error && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                         <AlertCircle className="text-[#E53935]" size={16} /><p className="text-[10px] font-black uppercase text-[#E53935]">{error}</p>
                      </motion.div>
                   )}
                   <div className="flex gap-3">
                      {currentStep > 1 && (
                        <button onClick={() => setCurrentStep(prev => prev - 1)} className="h-16 px-6 bg-white border border-black/[0.05] text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all"><ChevronLeft size={24} /></button>
                      )}
                      {currentStep < config.steps ? (
                        <button onClick={() => {
                          if (currentStep === 1 && !content.trim()) { setError("Tell us what this is about first"); return; }
                          if (currentStep === 2 && !industry) { setError("Please pick a category"); return; }
                          setError(null); setCurrentStep(prev => prev + 1);
                        }} className={cn("flex-1 h-16 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3", config.color)}>Next<ArrowRight size={18} /></button>
                      ) : (
                        <button onClick={handlePost} disabled={submissionState !== null} className={cn("flex-1 h-16 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 group", config.color)}>{submissionState ? <Activity className="animate-spin" size={18} /> : <Zap size={18} />}{config.cta}</button>
                      )}
                   </div>
                </div>
             </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {submissionState && (
            <PostSubmissionStatus 
              state={submissionState} 
              onRetry={() => {
                setSubmissionState('RETRYING');
                setTimeout(handlePost, 1000);
              }}
              onCancel={() => {
                setSubmissionState(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
