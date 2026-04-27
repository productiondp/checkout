"use client";

import React, { useState } from "react";

import ConnectButton from "@/components/ui/ConnectButton";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";
import { useConnections } from "@/hooks/useConnections";
import { createClient } from "@/utils/supabase/client";
import { 
  Zap, 
  Target, 
  Users, 
  Sparkles, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  Bookmark,
  Pencil,
  Trash2,
  MoreHorizontal,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  User,
  Calendar,
  IndianRupee,
  AlertCircle,
  Tag,
  MessageSquare,
  Activity
} from "lucide-react";
import { TrustBadge } from "@/components/trust/TrustBadge";
import { TrustInsights } from "@/components/trust/TrustInsights";
import { OutcomeSelector } from "@/components/trust/OutcomeSelector";
import { MeetupFeedback } from "@/components/trust/MeetupFeedback";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface UniversalFeedCardProps {
  post: any;
  currentUserId?: string;
  isExpanded?: boolean;
  onExpand?: () => void;
  onAction?: (post: any) => void;
  onEdit?: (post: any) => void;
  onDelete?: (post: any) => void;
}

const TYPE_CONFIG: Record<string, {
  icon: any;
  label: string;
  accentColor: string;
  gradient: string;
  bgColor: string;
  chipBg: string;
  chipText: string;
  ctaLabel: string;
  ctaBg: string;
  glowColor: string;
}> = {
  REQUIREMENT: {
    icon: Target,
    label: "Requirement",
    accentColor: "#F59E0B",
    gradient: "from-[#F59E0B] to-[#D97706]",
    bgColor: "bg-amber-50/50",
    chipBg: "bg-[#F5F5F7]",
    chipText: "text-amber-600",
    ctaLabel: "Reply",
    ctaBg: "bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20",
    glowColor: "rgba(245, 158, 11, 0.1)",
  },
  PARTNER: {
    icon: Sparkles,
    label: "Partner",
    accentColor: "#4F46E5",
    gradient: "from-[#4F46E5] to-[#4338CA]",
    bgColor: "bg-indigo-50/50",
    chipBg: "bg-[#F5F5F7]",
    chipText: "text-indigo-600",
    ctaLabel: "Connect",
    ctaBg: "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20",
    glowColor: "rgba(79, 70, 229, 0.1)",
  },
  MEETUP: {
    icon: Users,
    label: "Meetup",
    accentColor: "#E53935",
    gradient: "from-[#E53935] to-[#C62828]",
    bgColor: "bg-red-50/50",
    chipBg: "bg-[#F5F5F7]",
    chipText: "text-[#E53935]",
    ctaLabel: "Join Meetup",
    ctaBg: "bg-black hover:bg-zinc-800 shadow-xl",
    glowColor: "rgba(229, 57, 53, 0.1)",
  },
};

const CONTEXT_ICONS: Record<string, any> = {
  BUSINESS: Briefcase,
  PROFESSIONAL: User,
  STUDENT: GraduationCap,
  ADVISOR: ShieldCheck,
};

function normalizeType(type: string): keyof typeof TYPE_CONFIG {
  const map: Record<string, string> = {
    LEAD: "REQUIREMENT",
    HIRING: "REQUIREMENT",
    NEED: "REQUIREMENT",
    PARTNER: "PARTNER",
    PARTNERSHIP: "PARTNER",
    COLLAB: "PARTNER",
    MEETUP: "MEETUP",
    REQUIREMENT: "REQUIREMENT",
    meetup: "MEETUP"
  };
  return (map[type?.toUpperCase()] || "REQUIREMENT") as keyof typeof TYPE_CONFIG;
}

export default function UniversalFeedCard({
  post,
  currentUserId,
  isExpanded,
  onExpand,
  onAction,
  onEdit,
  onDelete,
}: UniversalFeedCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  if (!post) return null;

  const { 
    type, title, authorName, author, avatar, time, location, matchScore, 
    badge, rank, context, relevanceLabel, relevanceSignals 
  } = post;
  
  const nType = normalizeType(type);
  const isOwner = currentUserId === (author?.id || post.author_id);
  const cfg = TYPE_CONFIG[nType];
  const ContextIcon = CONTEXT_ICONS[context?.toUpperCase()] || User;
  
  const relevanceColor = 
    relevanceLabel === "Best opportunity" ? "emerald" :
    relevanceLabel === "Also useful for you" ? "red" : "slate";

  const score = matchScore || 50;
  const circumference = 2 * Math.PI * 18;

  const { user: authUser } = useAuth();
   const [participantCount, setParticipantCount] = React.useState(0);
   const [maxSlots, setMaxSlots] = React.useState(post.max_slots || 0);
   const [joinStatus, setJoinStatus] = React.useState<'IDLE' | 'JOINED' | 'FULL'>('IDLE');
   const [isJoining, setIsJoining] = React.useState(false);
   const [activeSignals, setActiveSignals] = React.useState<any[]>([]);
 
   React.useEffect(() => {
     if (nType === 'MEETUP' && post.id && authUser) {
       const fetchMeetupData = async () => {
         const { MeetupService } = await import("@/services/meetup-service");
         const { conversionLearning } = await import("@/utils/conversion-learning");
         
         const status = await MeetupService.getMeetupStatus(post.id, authUser.id);
         setParticipantCount(status.count);
         setMaxSlots(status.maxSlots);
         setJoinStatus(status.status as any);

         // 🧠 V1.12 ADAPTIVE SIGNAL SELECTION
         const available = [
           { type: 'SEAT_URGENCY', active: status.maxSlots > 0 && (status.count / status.maxSlots) >= 0.6 },
           { type: 'SOCIAL_PROOF', active: status.count >= 3 },
           { type: 'TIME_SENSITIVITY', active: post.metadata?.timeline === 'Today' }
         ];
         
         const selected = conversionLearning.selectSignals(available as any);
         setActiveSignals(selected);
         
         // TRACK IMPRESSION
         conversionLearning.trackImpression(post.id, selected);
       };
       fetchMeetupData();
     }
   }, [post.id, authUser?.id, nType]);
  
  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!authUser || isJoining || joinStatus === 'JOINED' || joinStatus === 'FULL') return;

    setIsJoining(true);
    try {
      const { MeetupService } = await import("@/services/meetup-service");
      const { conversionLearning } = await import("@/utils/conversion-learning");
      
      const { roomId } = await MeetupService.joinMeetup(post.id, authUser.id);
      setJoinStatus('JOINED');
      setParticipantCount(prev => prev + 1);
      
      // 🧠 V1.12 TRACK CONVERSION
      conversionLearning.trackConversion(post.id);

      // Open the group chat
      if (roomId) {
        router.push(`/chat?room=${roomId}`);
      }
    } catch (err: any) {
      if (err.message === "MEETUP_FULL") setJoinStatus('FULL');
      console.error("Join failed:", err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (authUser?.base_tag && post.base_tag) {
      analytics.trackInteraction(authUser.base_tag, post.base_tag, 'CLICK');
    }
    
    if (nType === 'MEETUP') {
      // For meetups, we might want a different primary action or just the Join button
      onAction?.(post);
    } else {
      onAction?.(post);
    }
  };

  const isTopPriority = post.tier === 1 && post.actionScore > 0.8;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={handleInteraction}
      className={cn(
        "group relative rounded-3xl border overflow-hidden transition-all duration-500 ",
        isOwner 
          ? "bg-[#F5F5F7]/50 border-black/[0.05] shadow-none opacity-[0.9] hover:opacity-100 transition-opacity" 
          : isTopPriority
            ? "bg-white border-[#E53935]/20 shadow-[0_20px_50px_rgba(229,57,53,0.08)] scale-[1.01]"
            : "bg-white border-black/[0.05] hover:shadow-2xl hover:shadow-black/[0.05] hover:border-black/[0.1]",
        isExpanded && "ring-4 ring-[#E53935]/10"
      )}
    >
      {post.ctaHint && !isOwner && (
         <div className="absolute top-24 left-8 z-20 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-full shadow-lg shadow-emerald-500/20">
            {post.ctaHint}
         </div>
      )}
      {/* MONOCHROME GRID & ANNOTATIONS - Faded */}
      {/* ── STEP 1: RESPONSE SIGNALING ── */}
      {isOwner && post.hasNewActivity && (
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#E53935] text-white text-[10px] font-bold z-20 rounded-bl-2xl flex items-center gap-2 animate-pulse">
           <div className="h-1.5 w-1.5 rounded-full bg-white" />
           New Activity
        </div>
      )}

      {isOwner && !post.hasNewActivity && (
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#F5F5F7] text-[#86868B] text-[10px] font-bold z-20 rounded-bl-2xl flex items-center gap-2 border-l border-b border-black/[0.03]">
           <div className="h-1.5 w-1.5 rounded-full bg-[#86868B]/40" />
           Your Post
        </div>
      )}

      {/* 🛡️ SIGNAL PRIORITY LAYER (V1.9) */}
      {((relevanceLabel || (relevanceSignals && relevanceSignals.length > 0)) || post.successProbability > 85) && !isOwner && (
        <div className="absolute top-4 left-8 z-20">
          <div className="flex flex-col gap-1.5">
            {/* Primary Signal (Badge) */}
            {relevanceLabel && (
              <div className={cn(
                "w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border",
                relevanceLabel === 'Top opportunity' || relevanceLabel === 'Best opportunity' || relevanceLabel === 'You should join this'
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-[#0A0A0A] text-white border-white/10"
              )}>
                {(relevanceLabel === 'Top opportunity' || relevanceLabel === 'Best opportunity' || relevanceLabel === 'You should join this') 
                  ? <Zap size={10} strokeWidth={3} /> 
                  : <Target size={10} strokeWidth={3} />}
                {relevanceLabel}
              </div>
            )}

            {/* Success Probability Signal (V1.9) */}
            {post.successProbability > 85 && (
              <div className="w-fit px-3 py-1 bg-emerald-600 text-white text-[8px] font-black uppercase rounded-lg shadow-lg flex items-center gap-2">
                 <Sparkles size={10} />
                 High Chance of Success ({post.successProbability}%)
              </div>
            )}

            {/* Secondary Signals (Subtle Text) */}
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {relevanceSignals?.map((sig: string) => (
                <span key={sig} className="text-[9px] font-bold text-[#86868B] uppercase tracking-widest opacity-60">
                  + {sig}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SHINE EFFECT */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </div>

      {/* LEFT ACCENT BAR - Animated */}
      <motion.div
        className={cn("absolute left-0 top-0 bottom-0 w-1 transition-all duration-500", isOwner ? "bg-slate-200" : cn("bg-gradient-to-b", cfg.gradient))}
        whileHover={{ width: 4 }}
      />

      <div className="pl-8 pr-8 pt-8 pb-7">

        {/* ── ROW 1: AUTHOR + TYPE BADGE ── */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar with Ring */}
            <div className="relative shrink-0">
              <div className="h-14 w-14 rounded-2xl p-0.5 transition-all duration-500 group-hover:scale-105 bg-[#F5F5F7] border border-black/[0.03]">
                <div className="h-full w-full rounded-[14px] overflow-hidden bg-white">
                  {avatar
                    ? <img src={avatar} className="h-full w-full object-cover" alt="" />
                    : <div className="h-full w-full bg-[#F5F5F7] flex items-center justify-center"><User size={24} className="text-[#86868B]" /></div>
                  }
                </div>
              </div>
              {/* Verified badge */}
              {post.author_profile?.metadata?.subscription_tier && post.author_profile?.metadata?.subscription_tier !== "FREE" && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-[#E53935] rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={12} strokeWidth={3} className="text-white" />
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-[17px] font-bold truncate leading-none", isOwner ? "text-[#86868B]" : "text-[#1D1D1F]")}>{author}</span>
                <div className="h-1 w-1 rounded-full bg-[#86868B]/20" />
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold shrink-0",
                  "bg-[#F5F5F7] text-[#86868B] border border-black/[0.03]"
                )}>
                  <ContextIcon size={12} />
                  {context || "Member"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#86868B]" />
                <span className="text-[12px] font-bold text-[#86868B]">{post.due_date || post.context}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-medium text-[#86868B] flex items-center gap-1.5">
                  <Clock size={12} />
                  {time}
                </span>
              </div>
            </div>
          </div>

          {/* Type Pill - Simple English */}
          <div className={cn(
            "shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold ml-3 border backdrop-blur-sm transition-all duration-300 group-hover:bg-[#F5F5F7]",
            cfg.chipBg, cfg.chipText, "border-black/[0.03]"
          )}>
            <cfg.icon size={14} />
            {cfg.label}
          </div>
        </div>

        {/* ── ROW 2: TITLE + DESCRIPTION ── */}
        <div className="mb-8">
          <h3 className={cn(
            "text-[24px] font-bold leading-tight mb-3 transition-colors duration-300",
            isOwner ? "text-[#86868B]" : "text-[#1D1D1F] group-hover:text-[#E53935]"
          )}>
            {title}
          </h3>
          {post.content && (
            <p className={cn(
              "text-[15px] font-medium leading-relaxed text-[#86868B] line-clamp-2"
            )}>
              {post.content}
            </p>
          )}
        </div>

        {/* ── ROW 3: METADATA CHIPS ── */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {nType === "REQUIREMENT" && <>
            {post.budget && <MetaChip icon={IndianRupee} label={post.budget} gradient={cfg.gradient} />}
            {post.urgency && <MetaChip icon={AlertCircle} label={post.urgency} gradient={cfg.gradient} />}
            {location && <MetaChip icon={MapPin} label={location} />}
            {post.skills_required?.slice(0, 3).map((s: string) => (
              <MetaChip key={s} icon={Tag} label={s} />
            ))}
          </>}
          {nType === "PARTNER" && <>
            {post.partnershipType && <MetaChip icon={Sparkles} label={post.partnershipType} gradient={cfg.gradient} />}
            {post.industry && <MetaChip icon={Briefcase} label={post.industry} />}
            {post.commitmentLevel && <MetaChip icon={Zap} label={post.commitmentLevel} />}
            {location && <MetaChip icon={MapPin} label={location} />}
          </>}
          {nType === "MEETUP" && <>
            {post.mode && <MetaChip icon={Users} label={post.mode} gradient={cfg.gradient} />}
            {post.dateTime && <MetaChip icon={Calendar} label={post.dateTime} />}
            {post.payment_type && <MetaChip icon={IndianRupee} label={post.payment_type} />}
            {maxSlots > 0 && <MetaChip icon={Tag} label={`${participantCount}/${maxSlots} Joined`} gradient={cfg.gradient} />}
            
            {/* ADVISOR SPOTLIGHT FOR MEETUPS */}
            {(context?.toUpperCase() === 'ADVISOR' || post.author_profile?.role?.toUpperCase() === 'ADVISOR') && (
              <div className="w-full mt-4 p-4 bg-slate-50 border border-slate-100 rounded-[8px] flex items-center justify-between group/advisor transition-all hover:bg-white hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#E53935]/10 flex items-center justify-center text-[#E53935]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-[#E53935]  leading-none mb-1">Meetup Advisor</p>
                    <h4 className="text-[13px] font-black text-[#292828] uppercase leading-none">{authorName}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{rank || "Strategic Advisor"}</p>
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-[#292828]">{score}% Score</span>
                    {post.author_profile?.advisor_score > 0 && (
                      <TrustBadge score={post.author_profile.advisor_score} showLabel={false} />
                    )}
                  </div>
                </div>
                
                {/* V1.7 EXPLAINABILITY LAYER */}
                <div className="w-full mt-4">
                  <TrustInsights advisorId={post.author_id} />
                </div>
              </div>
            )}
            {/* TRUST ENGINE: FEEDBACK & OUTCOMES */}
            {nType === 'MEETUP' && post.status === 'completed' && (
              <div className="w-full mt-6 space-y-4 pt-6 border-t border-slate-100">
                {isOwner ? (
                  !post.outcome_data ? (
                    <OutcomeSelector 
                      meetupId={post.id} 
                      advisorId={currentUserId || ''} 
                      onProcessed={() => router.refresh()} 
                    />
                  ) : (
                    <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                      <p className="text-[10px] font-black uppercase text-emerald-600">Outcome Recorded: {post.outcome_data.type}</p>
                    </div>
                  )
                ) : (
                  joinStatus === 'JOINED' && (
                    <MeetupFeedback 
                      meetupId={post.id} 
                      userId={currentUserId || ''} 
                    />
                  )
                )}
              </div>
            )}
          </>}
        </div>

        {/* ── ROW 4: ACTIONS ── */}
        <div className="flex items-center justify-between pt-8 border-t border-black/[0.03]">

          {/* LEFT: Owner menu */}
          <div className="flex items-center gap-2">
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className={cn(
                    "h-12 w-12 rounded-lg border flex items-center justify-center transition-all",
                    showMenu ? "bg-[#1D1D1F] text-white border-[#1D1D1F]" : "text-[#86868B] border-black/[0.05] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]"
                  )}
                >
                  <MoreHorizontal size={20} />
                </motion.button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute bottom-full left-0 mb-3 w-48 bg-white border border-black/[0.05] rounded-lg shadow-2xl overflow-hidden z-[100]"
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit?.(post); setShowMenu(false); }}
                        className="w-full h-12 px-5 flex items-center gap-3 text-[13px] font-bold text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
                      >
                        <Pencil size={16} className="text-[#86868B]" />
                        Edit Post
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(true); setShowMenu(false); }}
                        className="w-full h-12 px-5 flex items-center gap-3 text-[13px] font-bold text-[#E53935] hover:bg-red-50 transition-all border-t border-black/[0.03]"
                      >
                        <Trash2 size={16} />
                        Delete Post
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <AnimatePresence>
            {showConfirmDelete && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[200] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                  <Trash2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-[#1D1D1F] mb-2">Delete this post permanently?</h4>
                <p className="text-sm font-medium text-[#86868B] mb-8">This cannot be undone.</p>
                <div className="flex items-center gap-3 w-full max-w-xs">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(false); }}
                    className="flex-1 h-12 bg-slate-100 text-slate-500 rounded-xl text-[12px] font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(post); setShowConfirmDelete(false); }}
                    className="flex-1 h-12 bg-[#E53935] text-white rounded-xl text-[12px] font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT: Actions */}
          <div className="flex flex-col items-end gap-2">
            {!isOwner && (
              <>
                {/* 1. PRIMARY ACTION (Join for Meetups, Reply for Others) */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nType === 'MEETUP' ? handleJoin : (e) => { e.stopPropagation(); onAction?.(post); }}
                    disabled={isJoining || (nType === 'MEETUP' && joinStatus === 'FULL')}
                    className={cn(
                      "h-14 px-8 rounded-2xl text-[14px] font-bold text-white flex items-center justify-center gap-3 transition-all",
                      nType === 'MEETUP' 
                        ? (joinStatus === 'JOINED' ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20" : joinStatus === 'FULL' ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-black hover:bg-zinc-800 shadow-xl")
                        : cfg.ctaBg
                    )}
                  >
                    {isJoining ? (
                      <Zap className="animate-spin" size={20} />
                    ) : nType === 'MEETUP' ? (
                      joinStatus === 'JOINED' ? <CheckCircle2 size={20} /> : <Users size={20} strokeWidth={2.5} />
                    ) : (
                      <MessageSquare size={20} strokeWidth={2.5} />
                    )}
                    <span className="hidden sm:block">
                      {nType === 'MEETUP' 
                        ? (joinStatus === 'JOINED' 
                            ? "You're in" 
                            : joinStatus === 'FULL' 
                              ? 'Full' 
                              : (relevanceLabel === 'Top opportunity' || relevanceLabel === 'You should join this' 
                                  ? 'Join Meetup' 
                                  : relevanceLabel === 'Best match for you' || relevanceLabel === 'Good match for you'
                                    ? 'Good match — Join'
                                    : 'View details')) 
                        : cfg.ctaLabel}
                    </span>
                  </motion.button>

                  {/* 2. MESSAGE HOST (Optional for Meetups) */}
                  {nType === 'MEETUP' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => { e.stopPropagation(); onAction?.(post); }}
                      className="h-14 w-14 rounded-2xl border border-black/[0.05] text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] flex items-center justify-center transition-all"
                      title="Message Host"
                    >
                      <MessageSquare size={20} />
                    </motion.button>
                  )}

                  {/* 3. CONNECT BUTTON (Single Responsibility: Relationship) */}
                  {nType !== 'MEETUP' && (
                    <ConnectButton 
                      initialStatus={post.connectionStatus} 
                      userId={currentUserId} 
                      targetId={post.author?.id || post.author_id}
                      post={post}
                    />
                  )}

                  {/* Bookmark */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
                    className={cn(
                      "h-14 w-14 rounded-2xl border flex items-center justify-center transition-all duration-300",
                      bookmarked
                        ? "bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-500/10"
                        : "border-black/[0.05] text-[#86868B] hover:text-amber-500 hover:bg-[#F5F5F7]"
                    )}
                  >
                    <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
                  </motion.button>
                </div>

                {/* V1.12 ADAPTIVE MICRO-SIGNALS ROW */}
                {nType === 'MEETUP' && !isOwner && (
                  <div className="flex items-center gap-4 px-2">
                    {joinStatus === 'JOINED' ? (
                      <p className="text-[10px] font-black uppercase text-emerald-600 animate-pulse">Chat is open • Say hi</p>
                    ) : (
                      <>
                        {activeSignals.map(sigType => (
                          <React.Fragment key={sigType}>
                            {sigType === 'SEAT_URGENCY' && (
                               <p className="text-[10px] font-black uppercase text-[#E53935]">
                                 {maxSlots - participantCount === 1 ? "Last seat left" : `${maxSlots - participantCount} seats left`}
                               </p>
                            )}
                            {sigType === 'SOCIAL_PROOF' && (
                               <p className="text-[10px] font-bold text-[#86868B] uppercase">
                                 {participantCount} people joined
                               </p>
                            )}
                            {sigType === 'TIME_SENSITIVITY' && (
                               <p className="text-[10px] font-black uppercase text-amber-600">Starting Today</p>
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── MICRO COMPONENT: MetaChip ──
function MetaChip({ icon: Icon, label, gradient }: { icon: any; label: string; gradient?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] border text-[11px] font-black uppercase transition-all duration-300 hover:bg-white hover:shadow-md",
        gradient 
          ? "border-transparent bg-slate-50 text-slate-600" 
          : "border-slate-100 bg-white text-slate-400"
      )}
      style={gradient ? { 
        backgroundImage: `linear-gradient(white, white), linear-gradient(to right, ${gradient.split('from-')[1].split(' ')[0]}, ${gradient.split('to-')[1]})`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      } : {}}
    >
      <Icon size={12} className={cn("shrink-0", gradient && "text-slate-900")} />
      {label}
    </div>
  );
}
