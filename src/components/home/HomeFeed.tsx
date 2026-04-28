"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Plus, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Target, 
  Users, 
  TrendingUp, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  X,
  Calendar,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import UniversalFeedCard from "@/components/ui/UniversalFeedCard";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { calculateMatchScore, getRelevanceLabel, IntentMode } from "@/utils/match-engine";
import { useUserSuccess } from "@/hooks/useUserSuccess";
import { SignalGuard } from "@/utils/signal-guard";

interface HomeFeedProps {
  posts: any[];
  isLoading: boolean;
  currentUserId?: string;
  onAction?: (post: any) => void;
  onEdit?: (post: any) => void;
  onDelete?: (post: any) => void;
  onCreate?: () => void;
}

export default function HomeFeed({ 
  posts, 
  isLoading, 
  currentUserId,
  onAction,
  onEdit,
  onDelete,
  onCreate
}: HomeFeedProps) {
  const router = useRouter();
  const { user } = useAuth();
  const insights = useUserSuccess(user?.id);
  
  // 🛡️ ACTION & CONTEXT TRACKING
  const [sessionActions, setSessionActions] = useState<string[]>([]);
  const [newlyCreatedPostId, setNewlyCreatedPostId] = useState<string | null>(null);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [showPassiveMatch, setShowPassiveMatch] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);
  
  const actionCount = sessionActions.length;
  const myPosts = posts.filter(p => p.author_id === currentUserId);
  const hasPosted = sessionActions.includes('post_created') || myPosts.length > 0;
  const hasConnected = sessionActions.includes('connect_sent');

  const registerAction = (id: string) => {
    setSessionActions(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const [intentMode, setIntentMode] = useState<IntentMode>('BALANCED');
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // ── STEP 3: PASSIVE MATCH EXPANSION ──
  useEffect(() => {
    if (hasPosted && !hasConnected) {
      const timer = setTimeout(() => setShowPassiveMatch(true), 15000); // 15s delay
      return () => clearTimeout(timer);
    }
  }, [hasPosted, hasConnected]);

  // ── STEP 6: LIGHT NOTIFICATION SYSTEM ──
  useEffect(() => {
    // Simulate a high-value event (e.g. connection accepted) after 30s
    if (hasConnected) {
      const timer = setTimeout(() => {
        setNotification({ message: "Connection accepted by Rahul S.", type: "SUCCESS" });
        setTimeout(() => setNotification(null), 6000);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [hasConnected]);

  // ── STEP 1: POST VISIBILITY LOCK ──
  useEffect(() => {
    const lastPost = JSON.parse(localStorage.getItem('checkout_last_post') || '{}');
    if (lastPost.time && Date.now() - lastPost.time < 5000) {
      const match = posts.find(p => p.title === lastPost.title && p.author_id === currentUserId);
      if (match && newlyCreatedPostId !== match.id) {
        setNewlyCreatedPostId(match.id);
        registerAction('post_created');
        
        setTimeout(() => {
          const el = document.getElementById(`post-${match.id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);

        setTimeout(() => setNewlyCreatedPostId(null), 5000);
      }
    }
  }, [posts, currentUserId, newlyCreatedPostId]);

  // --- STEP 5: MATCH ENGINE & SCORING ---
  const processedPosts = React.useMemo(() => {
    if (!user) return posts;

    const userProfile = {
      id: user.id,
      role: user.role || 'PROFESSIONAL',
      industry: user.industry,
      intents: user.intents || [],
      skills: user.skills || [],
      location: user.location
    };

    const processed = posts.map((post, i) => {
      const { score, label: customLabel, tier, signals, actionScore, ctaHint, nudge, successProbability } = calculateMatchScore(userProfile, post, i, intentMode);
      
      return {
        ...post,
        authorName: post.author?.full_name || "Member",
        relevanceScore: score,
        relevanceLabel: customLabel || null,
        relevanceSignals: signals,
        actionScore,
        ctaHint,
        nudge,
        tier,
        successProbability
      };
    });

    // ── V1.10 FEED GUARDRAILS ──
    const guarded = SignalGuard.applyFeedGuardrails(processed, {
      maxTopOpportunities: 3,
      neutralRatio: 0.35
    });

    return guarded
      .filter((post: any) => {
        const authorId = post.author_id || post.author?.id;
        if (authorId === user.id) return true;
        
        // STRICT FILTERING FOR NON-SMART MODES
        if (intentMode !== 'SMART' && post.type !== intentMode) return false;
        
        return post.relevanceScore > 0;
      })
      .sort((a: any, b: any) => {
        if (a.tier !== b.tier) return a.tier - b.tier;
        return (b.actionScore || 0) - (a.actionScore || 0);
      });
  }, [posts, user, intentMode]);

  const dailyPriorities = processedPosts
    .filter(p => p.tier === 1 && p.actionScore > 0.6 && p.author_id !== currentUserId)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-white border border-slate-100 rounded-lg p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-50 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-50 rounded" />
                <div className="h-3 w-20 bg-slate-50 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-slate-50 rounded" />
            <div className="h-12 w-full bg-slate-50 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      
      {/* --- STEP 6: LIGHT NOTIFICATION (High Value Only) --- */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-[#292828] text-white rounded-full shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl"
          >
             <CheckCircle2 size={16} className="text-emerald-500" />
             <span className="text-[10px] font-black uppercase ">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
           {/* ACTION CARD 1: POST */}
           <motion.div 
             whileHover={{ y: -5 }}
             className="flex-1 group relative overflow-hidden bg-white border border-black/[0.05] rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-black/[0.02] cursor-pointer"
             onClick={() => onCreate?.()}
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 rounded-full blur-[40px] group-hover:bg-[#E53935]/10 transition-all" />
              <div className="relative z-10 space-y-6">
                 <div className="h-14 w-14 bg-[#E53935] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#E53935]/20 group-hover:scale-110 transition-transform">
                    <Target size={28} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase italic tracking-tight text-[#1D1D1F]">
                       {hasPosted ? "Update Requirement" : "Post Requirement"}
                    </h3>
                    <p className="text-[#86868B] text-[12px] font-bold uppercase leading-tight max-w-[200px]">
                       Share what you need and get matched with experts instantly.
                    </p>
                 </div>
                 <div className="flex items-center gap-3 text-[#E53935] text-[10px] font-black uppercase tracking-widest pt-4 border-t border-black/[0.03]">
                    <span>Broadcast Now</span>
                    <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                 </div>
              </div>
           </motion.div>

           {/* ACTION CARD 2: FIND PARTNER (NEW DESIGN) */}
           <motion.div 
             whileHover={{ y: -5 }}
             className="flex-1 group relative overflow-hidden bg-[#1D1D1F] rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-black/10 cursor-pointer"
             onClick={() => { registerAction('see_people'); router.push('/matches'); }}
           >
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all" />
              <div className="relative z-10 space-y-6">
                 <div className="h-14 w-14 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:bg-white group-hover:text-black transition-all">
                    <Users size={28} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">
                       {hasConnected ? "Network Active" : "Find Partner"}
                    </h3>
                    <p className="text-white/40 text-[12px] font-bold uppercase leading-tight max-w-[200px]">
                       Explore the network and find the right partners to build with.
                    </p>
                 </div>
                 <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span>{hasConnected ? "Explore Deeply" : "Start Discovery"}</span>
                    </div>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform ml-auto" />
                 </div>
              </div>
           </motion.div>
        </div>

        {/* STRATEGIC INSIGHTS STRIP */}
        <div className="flex flex-wrap items-center gap-4 px-2">
           {insights.map((insight, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-3 shadow-sm"
              >
                 <Sparkles size={12} className="text-emerald-600" />
                 <span className="text-[10px] font-black uppercase text-emerald-700">{insight}</span>
              </motion.div>
           ))}
        </div>


            {/* --- STEP 1: INTENT MODES & INSIGHTS --- */}
            <div className="flex items-center gap-3 bg-[#F5F5F7] p-1.5 rounded-2xl w-fit border border-black/[0.03]">
               {(['SMART', 'REQUIREMENT', 'PARTNER', 'MEETUP'] as IntentMode[]).map((mode) => (
                  <button
                     key={mode}
                     onClick={() => setIntentMode(mode)}
                     className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        intentMode === mode 
                           ? "bg-[#0A0A0A] text-white shadow-xl shadow-black/10" 
                           : "text-[#0A0A0A]/40 hover:text-[#0A0A0A]/80"
                     )}
                  >
                     {mode === 'SMART' ? 'Smart' : mode.charAt(0) + mode.slice(1).toLowerCase() + 's'}
                  </button>
               ))}
            </div>

            {/* ── STEP 4: DAILY PRIORITY LIST ── */}
            {dailyPriorities.length > 0 && (
              <div className="bg-[#0A0A0A] rounded-[2.5rem] p-10 text-white relative overflow-hidden border border-white/5 shadow-2xl">
                 <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <Zap size={20} className="text-white fill-white" />
                       </div>
                       <div>
                          <h2 className="text-xl font-black uppercase italic tracking-tight">Your Daily Priorities</h2>
                          <p className="text-xs text-white/40 font-bold uppercase tracking-widest">3 high-probability actions for today</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {dailyPriorities.map((post) => (
                          <div 
                            key={post.id}
                            onClick={() => {
                               const el = document.getElementById(`post-${post.id}`);
                               if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group"
                          >
                             <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2">{post.nudge || "Strategic Match"}</p>
                             <h3 className="text-sm font-bold mb-4 line-clamp-1">{post.title}</h3>
                             <div className="flex items-center justify-between">
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Act now</span>
                                <ArrowRight size={14} className="text-white/40 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}


         <div className="absolute bottom-8 right-12 flex items-center gap-3 opacity-60">
            <div className="h-1.5 w-16 bg-[#F5F5F7] rounded-full overflow-hidden">
               <div className="h-full bg-[#34C759] w-2/3" />
            </div>
            <span className="text-[10px] font-bold text-[#86868B]">Profile progress</span>
         </div>
      </motion.div>

      {/* --- STEP 3: PASSIVE MATCH EXPANSION SIGNAL --- */}
      <AnimatePresence>
        {showPassiveMatch && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between gap-6"
          >
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                   <Sparkles size={24} />
                </div>
                <div className="space-y-0.5">
                   <h4 className="text-[11px] font-black uppercase text-emerald-700 ">More relevant profiles found</h4>
                   <p className="text-[9px] font-bold text-emerald-600/60 uppercase">System identified new matches for your post</p>
                </div>
             </div>
             <button 
               onClick={() => { router.push('/matches'); setShowPassiveMatch(false); }}
               className="h-12 px-8 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase  hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
             >
                View Matches
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- STEP 3: INSTANT VALUE SIGNAL --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
         <div className="flex flex-wrap gap-3">
            <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-full flex items-center gap-3 shadow-sm">
               <Target size={12} className="text-[#E53935]" />
               <span className="text-[10px] font-black uppercase  text-[#292828]/60">People matching your needs</span>
            </div>
            <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-full flex items-center gap-3 shadow-sm">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase  text-[#292828]/60">Active now</span>
            </div>
         </div>
      </div>

      {posts.length === 0 ? (
        <div className="py-32 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="h-24 w-24 bg-slate-50 rounded-lg flex items-center justify-center mx-auto border-2 border-dashed border-slate-100">
              <Sparkles size={32} className="text-slate-200" />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black uppercase  text-[#292828]">Your network is empty</h3>
              <p className="text-[13px] font-bold text-slate-400 uppercase ">Share what you need to discover relevant partners.</p>
           </div>
           <button 
             onClick={onCreate}
             className="px-10 py-5 bg-[#292828] text-white rounded-lg text-[11px] font-black uppercase  hover:bg-[#E53935] transition-all shadow-2xl"
           >
              Post First Requirement
           </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-8"
          >
            {processedPosts.map((post) => {
              const isNew = newlyCreatedPostId === post.id;
              
              return (
                <div key={post.id} className="space-y-6">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    id={`post-${post.id}`}
                    className={cn(
                      "transition-all duration-700",
                      isNew && "ring-8 ring-[#E53935]/5 rounded-lg bg-[#E53935]/5"
                    )}
                  >
                    <UniversalFeedCard 
                      post={post} 
                      currentUserId={currentUserId}
                      onAction={() => onAction?.(post)}
                      onDelete={() => onDelete?.(post)}
                    />
                  </motion.div>

                  {isNew && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <div className="bg-[#1D1D1F] rounded-[24px] p-10 lg:p-14 overflow-hidden shadow-3xl shadow-black/20 group/success border border-white/5">
                        
                        {/* THE NEURAL SYNC BACKGROUND */}
                        <div className="absolute inset-0 pointer-events-none">
                           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E53935]/10 rounded-full blur-[120px] -mr-64 -mt-64" />
                           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#34C759]/5 rounded-full blur-[100px] -ml-48 -mb-48" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col xl:flex-row gap-12 xl:items-center">
                           
                           {/* LEFT: STATUS HERO */}
                           <div className="flex-1 space-y-10">
                              <div className="space-y-6">
                                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#34C759]/10 border border-[#34C759]/20 rounded-full text-[#34C759] text-[10px] font-black uppercase tracking-widest">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#34C759] animate-pulse" />
                                    Post Live & Indexed
                                 </div>
                                 <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.85] uppercase tracking-tighter italic">
                                    Network <br /> 
                                    <span className="text-[#E53935]">Activated</span>
                                 </h1>
                                 <p className="text-white/40 font-bold text-lg lg:text-xl max-w-md leading-tight">
                                    Your requirement is now visible across the network. Matches identified via Neural Distribution.
                                 </p>
                              </div>

                              <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                                 <div>
                                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2">Sync Status</p>
                                    <p className="text-xl font-bold text-white uppercase tracking-tight">100% Verified</p>
                                 </div>
                                 <div className="h-10 w-[1px] bg-white/5" />
                                 <div>
                                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2">Visibility</p>
                                    <p className="text-xl font-bold text-white uppercase tracking-tight italic text-[#34C759]">Priority</p>
                                 </div>
                              </div>
                           </div>

                           {/* RIGHT: INTELLIGENT MATCHES */}
                           <div className="w-full xl:w-[480px] space-y-6">
                              <div className="flex items-center justify-between">
                                 <h3 className="text-[11px] font-black uppercase text-white/40 tracking-[0.2em]">Neural Intelligence Matches</h3>
                                 <div className="h-2 w-2 rounded-full bg-[#34C759]" />
                              </div>

                              <div className="space-y-3">
                                 {[
                                   { name: "Rahul S.", role: "Tech Lead", score: 93, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
                                   { name: "Anita K.", role: "Product Expert", score: 94, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita" },
                                   { name: "Vikram R.", role: "Strategic Partner", score: 89, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" }
                                 ].map((profile, i) => (
                                   <motion.div 
                                     key={profile.name}
                                     initial={{ opacity: 0, x: 20 }}
                                     animate={{ opacity: 1, x: 0 }}
                                     transition={{ delay: 0.4 + (i * 0.1) }}
                                     className="group/item flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-[20px] hover:bg-white/10 transition-all hover:border-white/10"
                                   >
                                     <div className="flex items-center gap-4 min-w-0">
                                       <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 p-1">
                                          <img src={profile.avatar} className="w-full h-full object-cover rounded-xl grayscale group-hover/item:grayscale-0 transition-all" alt="" />
                                       </div>
                                       <div className="min-w-0">
                                          <p className="text-[15px] font-black text-white uppercase truncate mb-0.5">{profile.name}</p>
                                          <p className="text-[10px] font-bold text-[#E53935] uppercase tracking-widest">{profile.score}% Neural Synergy</p>
                                       </div>
                                     </div>
                                     <button 
                                       onClick={() => {
                                         setConnectedIds(prev => [...prev, profile.name]);
                                         registerAction('connect_sent');
                                       }}
                                       className={cn(
                                          "h-11 px-5 rounded-xl text-[10px] font-black uppercase transition-all shrink-0 border",
                                          connectedIds.includes(profile.name)
                                            ? "bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]"
                                            : "bg-white text-black hover:bg-amber-500 hover:text-white hover:border-amber-500"
                                       )}
                                     >
                                        {connectedIds.includes(profile.name) ? "Request Sent" : "Link Partner"}
                                     </button>
                                   </motion.div>
                                 ))}
                              </div>

                              <button 
                                onClick={() => router.push('/matches')}
                                className="w-full h-16 bg-white/5 border border-white/5 rounded-[20px] text-[11px] font-black uppercase text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 mt-4"
                              >
                                Access Full Talent Intelligence <ArrowRight size={16} />
                              </button>
                           </div>

                        </div>

                        {/* CLOSE TRIGGER */}
                        <button 
                          onClick={() => setNewlyCreatedPostId(null)}
                          className="absolute top-10 right-10 h-12 w-12 bg-white/5 text-white/40 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/5"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
