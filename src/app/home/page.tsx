"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Target, 
  MapPin, 
  Sparkles, 
  LayoutGrid, 
  Briefcase, 
  Users, 
  Zap, 
  TrendingUp, 
  ArrowUpRight,
  Maximize2,
  Bookmark,
  ChevronUp,
  Search,
  Filter,
  Plus,
  Globe,
  BrainCircuit,
  Award,
  Shield,
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  User,
  ChevronDown,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import { calculateMatchScore, rankEntities } from "@/lib/match-engine";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";
import ConnectionSentinel from "@/components/home/ConnectionSentinel";
import UnifiedSearch from "@/components/search/UnifiedSearch";
import ActivitySentinel from "@/components/home/ActivitySentinel";
import { optimization } from "@/utils/optimization_engine";

const UniversalFeedCard = dynamic(() => import("@/components/ui/UniversalFeedCard"), { ssr: false });
const DealEngine = dynamic(() => import("@/components/modals/DealEngine"), { ssr: false });
const PostModal = dynamic(() => import("@/components/modals/PostModal"), { ssr: false });
const Feed = dynamic(() => import("@/components/home/HomeFeed"), { ssr: false });

const SMART_FILTERS = [
  { id: 'All', label: 'Everything', icon: LayoutGrid },
  { id: 'LEAD', label: 'Leads', icon: Target },
  { id: 'HIRING', label: 'Jobs', icon: Briefcase },
  { id: 'PARTNER', label: 'Partnerships', icon: Sparkles },
  { id: 'Meetup', label: 'Meetups', icon: Users },
];

export default function CheckoutHomeFeed() {
  const { user: authUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [formType, setFormType] = useState<"Update" | "Lead" | "Hiring" | "Partner" | "Meetup">("Lead");
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);
  const [isPostActionLoop, setIsPostActionLoop] = useState(false);
  const [newConnectionAccepted, setNewConnectionAccepted] = useState(false);

  // RETENTION STATES
  const [returnStatus, setReturnStatus] = useState<{ type: 'NEW_ACTIVITY' | 'NEW_MATCHES' | 'CONTINUE' | 'STREAK' | null }>({ type: null });
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const profileStrength = useMemo(() => {
    if (!authUser) return "Low";
    let score = 0;
    if (authUser?.full_name) score += 20;
    if (authUser?.bio) score += 20;
    if (authUser?.avatar_url) score += 20;
    if (authUser?.expertise?.length) score += 20;
    if (authUser?.intents?.length) score += 20;
    
    if (score >= 100) return "High";
    if (score >= 60) return "Medium";
    return "Low";
  }, [authUser]);

  const profileWeak = profileStrength === "Low";
  const isReady = !!authUser;

  const actionCount = useMemo(() => {
     if (!authUser) return 0;
     const events = ['FIRST_MANDATE_CREATED', 'CONNECT_REQUEST_SENT', 'MESSAGE_INITIATED'];
     return events.filter(e => analytics.hasAction([e])).length;
  }, [authUser]);
  
  const hasTakenAction = actionCount > 0;
  const showActivationCard = actionCount < 3;

  const [activationState, setActivationState] = useState<'NEW' | 'EXPLORING' | 'RETURNING' | 'MOMENTUM'>('NEW');
  const hasInitialized = React.useRef(false);

  useEffect(() => {
    // 1. Initial State Selection (Priority Order)
    const visits = parseInt(localStorage.getItem('checkout_visit_count') || '1');
    const actions = actionCount;
    
    let initialState: 'NEW' | 'EXPLORING' | 'RETURNING' | 'MOMENTUM' = 'NEW';
    if (actions === 1) initialState = 'MOMENTUM';
    else if (visits > 1) initialState = 'RETURNING';
    else initialState = 'NEW';

    // 2. Lock / Session Check
    const sessionState = sessionStorage.getItem('activation_state') as any;
    if (sessionState && sessionState !== 'EXPLORING' && actionCount === 0) {
       setActivationState(sessionState);
    } else {
       setActivationState(initialState);
       sessionStorage.setItem('activation_state', initialState);
    }

    // 3. Delayed "Exploring" State (Only for NEW users)
    if (initialState === 'NEW' && !sessionState) {
       const timer = setTimeout(() => {
          setActivationState('EXPLORING');
          sessionStorage.setItem('activation_state', 'EXPLORING');
       }, 8000); // Stable 8s delay
       return () => clearTimeout(timer);
    }
  }, [actionCount]); // Allow major milestone (action) to break lock

  const supabase = createClient();

  const initHome = async () => {
    setIsLoading(true);
    if (!authUser) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. PRIMARY DATA FETCH (High Match)
      const { data: postsData, error: primaryError } = await supabase
        .from('posts')
        .select(`
          id, created_at, type, title, content, location, match_score, 
          budget, due_date, skills_required, work_type, duration, 
          offer, need, timeline, domain,
          author:profiles(id, full_name, avatar_url, role, location, skills)
        `)
        .order('created_at', { ascending: false })
        .limit(30);

      if (primaryError) throw primaryError;

      let processedPosts = postsData || [];

      // 2. FALLBACK: If no matches, explore regional opportunities
      if (processedPosts.length < 5) {
        const { data: fallbackData } = await supabase
          .from('posts')
          .select(`
            id, created_at, type, title, content, location, match_score, 
            budget, due_date, skills_required, work_type, duration, 
            offer, need, timeline, domain,
            author:profiles(id, full_name, avatar_url, role, location, skills)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (fallbackData) {
          // Merge and deduplicate
          const existingIds = new Set(processedPosts.map(p => p.id));
          const uniqueFallbacks = fallbackData.filter(p => !existingIds.has(p.id));
          processedPosts = [...processedPosts, ...uniqueFallbacks];
        }
      }

      const mapped = processedPosts.map(p => {
        const author = Array.isArray(p.author) ? p.author[0] : p.author;
        return {
          ...p,
          author_id: author?.id,
          user_id: author?.id,
          author: author?.full_name || "Partner",
          avatar: author?.avatar_url || DEFAULT_AVATAR,
          time: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rank: author?.role || "Professional",
          author_profile: author 
        };
      });

      const ranked = rankEntities(authUser, mapped);
      setPosts(ranked);
    } catch (err) {
      console.error("Feed Loading Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authUser) {
       hasInitialized.current = false;
       setIsLoading(false);
       return;
    }

    if (hasInitialized.current) return;
    hasInitialized.current = true;

    console.log("[HOME] Profile Identified - Loading Page...");
    initHome();
    analytics.trackScreen('HOME', authUser?.id);
    
    if (authUser) {
       // RETENTION LOGIC
       const lastVisit = localStorage.getItem('checkout_last_visit');
       const lastAction = localStorage.getItem('checkout_last_action');
       const lastActionTime = localStorage.getItem('checkout_last_action_time');
       const now = Date.now();

       if (lastVisit) {
          const timeDiff = now - parseInt(lastVisit);
          if (timeDiff > 3600000) { // More than 1 hour
             if (lastAction === 'POST') setReturnStatus({ type: 'NEW_MATCHES' });
             else if (lastAction === 'CONNECT') setReturnStatus({ type: 'NEW_ACTIVITY' });
             else setReturnStatus({ type: 'CONTINUE' });
          }
          
          // Streak Logic
          if (lastActionTime) {
             const actionDate = new Date(parseInt(lastActionTime)).toDateString();
             const yesterday = new Date(now - 86400000).toDateString();
             if (actionDate === yesterday) setReturnStatus({ type: 'STREAK' });
          }
       }

       // Check for pending outgoing requests
       supabase.from('connections')
         .select('id')
         .eq('sender_id', authUser.id)
         .eq('status', 'PENDING')
         .limit(1)
         .then(({ data }) => {
            if (data && data.length > 0) setHasPendingRequest(true);
         });

       localStorage.setItem('checkout_last_visit', now.toString());

       // Subscribe to connection acceptance
       const sub = supabase
         .channel('accepted_connections')
         .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'connections',
            filter: `sender_id=eq.${authUser.id}`
         }, (payload: any) => {
            if (payload.new.status === 'ACCEPTED') {
               setNewConnectionAccepted(true);
            }
         })
         .subscribe();
         
       return () => { supabase.removeChannel(sub); };
    }
  }, [authUser]);


  const activationCardContent = useMemo(() => {
    switch (activationState) {
      case 'MOMENTUM':
        return {
          title: "Keep going",
          subtext: "Take your next step to grow",
          ctaPrimary: "Create Requirement",
          ctaSecondary: "See people →"
        };
      case 'RETURNING':
        return {
          title: "Network growing",
          subtext: "People nearby are active now",
          ctaPrimary: "Create Requirement",
          ctaSecondary: "See people →"
        };
      case 'EXPLORING':
        return {
          title: "Finding something?",
          subtext: "Post a requirement to get matches",
          ctaPrimary: "Create Requirement",
          ctaSecondary: "See people →"
        };
      default:
        return {
          title: "Start here",
          subtext: "Create your first requirement or connect with people",
          ctaPrimary: "Create Requirement",
          ctaSecondary: "See people →"
        };
    }
  }, [activationState]);

  const hasEarlySuccess = useMemo(() => {
     if (!authUser) return false;
     return analytics.hasAction(['FIRST_MANDATE_CREATED', 'CONNECT_REQUEST_SENT']);
  }, [authUser]);

  const matchCount = useMemo(() => {
     return posts.filter(p => (p.matchScore || 0) > 80).length;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const config = optimization.getConfig();
    const hasAction = analytics.hasAction(['FIRST_MANDATE_CREATED', 'CONNECT_REQUEST_SENT', 'MESSAGE_INITIATED']);
    
    let base = posts.filter(p => activeFilter === 'All' || p.type.toUpperCase() === activeFilter.toUpperCase());
    
    // Priority Mode Logic
    if (config.override.mode === 'growth') return base;
    if (config.override.mode === 'precision') {
      return base.filter(p => (p.matchScore || 0) > 80);
    }
    
    if (!hasAction) {
       // Adaptive Filtering for passive users: High match focus, smaller list
       return base
         .filter(p => (p.matchScore || 0) > 60)
         .slice(0, config.feedConfig.maxItemsPassive);
    }
    
    return base;
  }, [activeFilter, posts]);

  return (
    <div className="w-[94%] mx-auto py-12 selection:bg-[#E53935]/10 font-sans">
      <div className="flex flex-col items-center gap-16">
        
        {/* CENTER FEED */}
        <div className="w-full max-w-4xl space-y-12">
          
          <div className="px-2">
             <h1 className="text-4xl sm:text-5xl font-black text-[#292828] tracking-tight mb-3 uppercase">Feed</h1>
             <p className="text-slate-400 font-bold text-base sm:text-lg uppercase tracking-tight">Stay updated with your business directory.</p>
          </div>
          
          {/* RETENTION & CONTINUITY BANNERS */}
          {returnStatus.type && (
            <div className="mx-2 p-6 bg-[#292828] text-white rounded-[2rem] flex items-center justify-between shadow-4xl animate-in slide-in-from-top-4 duration-700">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#E53935] rounded-2xl flex items-center justify-center shadow-lg">
                     {returnStatus.type === 'STREAK' ? <TrendingUp size={20} /> : <Zap size={20} />}
                  </div>
                  <div>
                     <p className="text-[11px] font-black uppercase tracking-wider">
                        {returnStatus.type === 'NEW_MATCHES' && "New matches for your requirement"}
                        {returnStatus.type === 'NEW_ACTIVITY' && "New network activity found"}
                        {returnStatus.type === 'CONTINUE' && "Keep growing your network"}
                        {returnStatus.type === 'STREAK' && "Active yesterday • Profile growing"}
                     </p>
                     <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">
                        {returnStatus.type === 'STREAK' ? "Keep active to grow your network." : "Don't miss new opportunities nearby."}
                     </p>
                  </div>
               </div>
               <button onClick={() => setReturnStatus({ type: null })} className="h-12 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Dismiss</button>
            </div>
          )}

          {hasPendingRequest && !hasTakenAction && (
            <div className="mx-2 p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between animate-in fade-in duration-500">
               <div className="flex items-center gap-3">
                  <Clock size={16} className="text-blue-600" />
                  <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Your request is still active</p>
               </div>
               <button onClick={() => window.location.href = '/matches'} className="text-[9px] font-black text-blue-600 uppercase border-b border-blue-200">Explore more matches</button>
            </div>
          )}

          {/* NETWORK SCALE & HUMAN TOUCH */}
          <div className="flex items-center justify-between px-2">
             <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black text-[#292828] uppercase tracking-[0.2em]">120+ People in your network</span>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network growing nearby • 3 active now</p>
             </div>
             <div className="text-right">
                <p className="text-[8px] font-black text-[#E53935] uppercase tracking-widest">People like you are connecting here</p>
             </div>
          </div>

          {/* ACTIVITY SIGNAL */}
          <div className="mx-2 p-4 bg-[#E53935]/5 border border-[#E53935]/10 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-700">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-[#E53935] text-white rounded-lg flex items-center justify-center animate-pulse">
                   <Zap size={16} fill="currentColor" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-[#E53935] uppercase tracking-widest">Activity</p>
                   <p className="text-[9px] font-bold text-[#E53935]/60 uppercase tracking-widest">New activity found nearby</p>
                </div>
             </div>
             <button onClick={() => window.location.href = '/history'} className="h-8 px-4 bg-[#E53935] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#292828] transition-all">View</button>
          </div>

          {/* CONNECTION SIGNAL */}
          {newConnectionAccepted && (
            <div className="mx-2 p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center justify-between shadow-xl animate-in zoom-in-95 duration-500">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                     <Users size={20} />
                  </div>
                  <div>
                     <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">Connected</p>
                     <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest mt-1">You can now message your connection.</p>
                  </div>
               </div>
               <button onClick={() => window.location.href = '/chat'} className="h-12 px-6 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#292828] transition-all flex items-center gap-2">
                  Open Chat <ArrowRight size={14} />
               </button>
            </div>
          )}
          
          {/* PROFILE STRENGTH & FIRST ACTION PROMPT */}
          <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-[#E53935]" />
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Profile Status</span>
                </div>
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Profile Strength:</span>
                      <span className={cn(
                         "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                         profileStrength === "High" ? "bg-emerald-50 text-emerald-600" : 
                         profileStrength === "Medium" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600 animate-pulse"
                      )}>{profileStrength}</span>
                   </div>
                   {profileStrength === "Low" && (
                      <p className="text-[8px] font-bold text-[#E53935] uppercase tracking-tighter">Improve profile for better matches</p>
                   )}
                </div>
             </div>

             {/* EARLY SUCCESS LOOP */}
             {hasEarlySuccess && !isPostActionLoop && (
               <div className="mx-2 mb-8 p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-[#292828] text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-[#E53935] transition-all">
                        <TrendingUp size={20} />
                     </div>
                     <div>
                        <p className="text-[11px] font-black text-[#292828] uppercase tracking-wider">Network active</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Keep going. New people are joining.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                           <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                              <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="" />
                           </div>
                        ))}
                     </div>
                     <ArrowRight size={16} className="text-slate-300 group-hover:text-[#E53935] transition-colors" />
                   </div>
                </div>
              )}

              {showActivationCard && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-8 animate-in fade-in slide-in-from-top-2 duration-500 relative group hover:border-[#292828]/10 transition-colors">
                   <div className="absolute top-4 right-4 bg-[#E53935]/10 text-[#E53935] text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {actionCount === 1 ? "Momentum" : "New"}
                   </div>
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <div className="h-11 w-11 bg-red-50 rounded-xl flex items-center justify-center text-[#E53935] shrink-0">
                            <Sparkles size={20} />
                         </div>
                         <div>
                            <h3 className="text-[14px] font-black text-[#292828] uppercase tracking-tight">{activationCardContent.title}</h3>
                            <div className="space-y-0.5">
                               <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{activationCardContent.subtext}</p>
                               {!hasTakenAction && (
                                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">People nearby are already active</p>
                               )}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-5">
                         <button 
                           onClick={() => { setEditPost(null); setFormType("Lead"); setIsPosting(true); }} 
                           className="h-9 px-5 bg-[#292828] text-white rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-[#E53935] transition-all active:scale-95"
                         >
                            {activationCardContent.ctaPrimary}
                         </button>
                         <button 
                           onClick={() => window.location.href = '/matches'} 
                           className="text-[9px] font-black text-[#292828]/40 uppercase tracking-widest hover:text-[#292828] transition-colors flex items-center gap-1.5 group/btn"
                         >
                            {activationCardContent.ctaSecondary} <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
              )}


             {isPostActionLoop && (
               <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] relative overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between mb-6">
                     <div className="h-12 w-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <CheckCircle2 size={24} />
                     </div>
                     <div className="bg-white/50 px-4 py-2 rounded-xl border border-emerald-200">
                        <p className="text-[14px] font-black text-emerald-700 leading-none">{matchCount}</p>
                        <p className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Matches Found</p>
                     </div>
                     <button onClick={() => setIsPostActionLoop(false)} className="text-emerald-600/40 hover:text-emerald-600 transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  <h3 className="text-xl font-black text-[#292828] uppercase mb-2">Requirement is live</h3>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-8">Requirement visible to others. {matchCount} matches found nearby.</p>
                  <button onClick={() => { setIsPostActionLoop(false); window.scrollTo({ top: 1000, behavior: 'smooth' }); }} className="h-14 px-8 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#292828] transition-all shadow-xl flex items-center justify-center gap-2">
                     View Matches <ArrowRight size={14} />
                  </button>
               </div>
             )}
          </div>

          {/* COMPOSER */}
          <section className="bg-white rounded-[1.5rem] p-3 border border-slate-100 shadow-premium group transition-all hover:border-slate-200">
             <div className="flex items-center gap-4 p-5">
                <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                   <img src={authUser?.avatar_url || DEFAULT_AVATAR} className="h-full w-full object-cover" alt="" />
                </div>
                <button 
                  onClick={() => { setEditPost(null); setFormType("Lead"); setIsPosting(true); }}
                  className="flex-1 h-14 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl px-6 text-left text-xs font-bold uppercase transition-all flex items-center justify-between"
                >
                   <div>
                      <span className="block">Create a requirement...</span>
                      <span className="text-[8px] font-bold text-slate-300 normal-case lowercase italic">Requirement = what you need (hiring, leads, etc.)</span>
                   </div>
                   <Zap size={20} className="text-[#E53935]" />
                </button>
             </div>
             {profileWeak && (
               <div className="mx-5 mb-4 p-4 bg-[#E53935]/5 border border-[#E53935]/10 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <BrainCircuit size={16} className="text-[#E53935]" />
                     <div>
                        <p className="text-[10px] font-black text-[#E53935] uppercase tracking-wider">Update your profile</p>
                        <p className="text-[9px] font-bold text-[#E53935]/60 uppercase">Add a bio to get better matches</p>
                     </div>
                  </div>
                  <button onClick={() => window.location.href = '/settings'} className="h-10 px-6 bg-[#E53935] text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/10">Add Now</button>
               </div>
             )}
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-2 pb-2">
                {[
                   { id: 'Lead', icon: Target, label: "Requirement" },
                   { id: 'Hiring', icon: Briefcase, label: "Hiring" },
                   { id: 'Partner', icon: Sparkles, label: "Partner" },
                   { id: 'Meetup', icon: Users, label: "Meetup" }
                ].map((btn) => (
                   <button 
                     key={btn.id}
                     onClick={() => { setEditPost(null); setFormType(btn.id as any); setIsPosting(true); }}
                     className="flex items-center justify-center gap-3 py-4 rounded-2xl hover:bg-slate-50 transition-all group/btn"
                   >
                      <btn.icon size={18} className="text-slate-300 group-hover/btn:text-[#E53935] transition-colors" />
                      <span className="text-[10px] font-black text-slate-400 group-hover/btn:text-slate-900 uppercase tracking-widest">
                         {btn.label}
                      </span>
                   </button>
                ))}
             </div>
          </section>

          {/* COMPACT FILTERS DROPDOWN */}
          <div className="flex items-center justify-between">
             <div className="relative">
                <button 
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="h-10 px-6 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-sm hover:border-[#E53935]/30 group"
                >
                   {(() => {
                      const active = SMART_FILTERS.find(f => f.id === activeFilter);
                      return (
                         <>
                            <active.icon size={14} className="text-[#E53935]" />
                            <span className="text-slate-900">{active.label}</span>
                            <ChevronDown size={12} className={cn("text-slate-300 transition-transform", isFilterDropdownOpen && "rotate-180")} />
                         </>
                      );
                   })()}
                </button>

                {isFilterDropdownOpen && (
                   <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#292828]/10 rounded-2xl shadow-4xl p-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
                      {SMART_FILTERS.map(f => (
                         <button 
                           key={f.id}
                           onClick={() => { setActiveFilter(f.id); setIsFilterDropdownOpen(false); }}
                           className={cn(
                              "w-full h-11 px-4 flex items-center gap-3 rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider",
                              activeFilter === f.id ? "bg-[#292828] text-white" : "text-slate-500 hover:bg-slate-50 hover:text-[#292828]"
                           )}
                         >
                            <f.icon size={14} />
                            {f.label}
                         </button>
                      ))}
                   </div>
                )}
             </div>
             
             <button className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#E53935] hover:border-[#E53935] transition-all shadow-sm">
                <Filter size={16} />
             </button>
          </div>

          {/* FEED AREA */}
          {!isReady ? (
            <div className="py-20 text-center animate-pulse bg-white rounded-[3rem] border border-slate-50">
               <BrainCircuit size={48} className="mx-auto text-slate-100 mb-6" />
               <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">Loading your network...</p>
            </div>
          ) : (
            <Feed 
              posts={filteredPosts} 
              isLoading={isLoading} 
              currentUserId={authUser?.id}
              onAction={(post) => { setSelectedDeal(post); setIsModalOpen(true); }}
              onEdit={(p) => { setEditPost(p); setFormType(p.type as any); setIsPosting(true); }}
              onDelete={async (p) => {
                 if(confirm("Delete this requirement?")) {
                    await supabase.from('posts').delete().eq('id', p.id);
                    initHome();
                 }
              }}
            />
          )}
        </div>

        {/* BOTTOM SIDEBAR (CENTERED) */}
        <aside className="w-full max-w-4xl space-y-10">
           <ConnectionSentinel />
        </aside>
        
        <ActivitySentinel />
      </div>

      {/* MODALS */}
      {isPosting && (
        <PostModal 
          isOpen={isPosting} 
          onClose={() => setIsPosting(false)} 
          onPostSuccess={(newPost) => {
             // Map the new post to include author info for immediate UI update
             const mappedPost = {
               ...newPost,
               author: authUser?.full_name || "Partner",
               avatar: authUser?.avatar_url || DEFAULT_AVATAR,
               rank: authUser?.role || "Professional",
               time: "Just now",
               matchScore: 99,
               location: newPost.location || authUser?.location || "Trivandrum"
             };
             setPosts(prev => [mappedPost, ...prev]);
             setIsPosting(false);
             setIsPostActionLoop(true);
             
             // STORE LAST ACTION
             localStorage.setItem('checkout_last_action', 'POST');
             localStorage.setItem('checkout_last_action_time', Date.now().toString());

             analytics.track('FIRST_MANDATE_CREATED', authUser?.id, { type: newPost.type });
          }} 
          initialFormType={formType}
          editPost={editPost}
        />
      )}
      {selectedDeal && (
        <DealEngine isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} deal={selectedDeal} />
      )}
    </div>
  );
}
