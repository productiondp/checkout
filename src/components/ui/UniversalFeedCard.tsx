"use client";

import React from "react";
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
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface UniversalFeedCardProps {
  post: any;
  currentUserId?: string;
  isExpanded?: boolean;
  onExpand?: () => void;
  onAction?: () => void;
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
    accentColor: "#E53935",
    gradient: "from-[#E53935] to-[#FF5252]",
    bgColor: "bg-red-50/50",
    chipBg: "bg-red-500/10",
    chipText: "text-[#E53935]",
    ctaLabel: "Respond",
    ctaBg: "bg-gradient-to-r from-[#E53935] to-[#FF5252] hover:shadow-[0_0_20px_rgba(229,57,51,0.4)]",
    glowColor: "rgba(229, 57, 51, 0.15)",
  },
  PARTNERSHIP: {
    icon: Sparkles,
    label: "Partnership",
    accentColor: "#292828",
    gradient: "from-[#292828] to-[#4a4a4a]",
    bgColor: "bg-slate-50/50",
    chipBg: "bg-slate-500/10",
    chipText: "text-[#292828]",
    ctaLabel: "Connect",
    ctaBg: "bg-gradient-to-r from-[#292828] to-[#4a4a4a] hover:shadow-[0_0_20px_rgba(41,40,40,0.3)]",
    glowColor: "rgba(41, 40, 40, 0.1)",
  },
  MEETUP: {
    icon: Users,
    label: "Meetup",
    accentColor: "#059669",
    gradient: "from-[#059669] to-[#10B981]",
    bgColor: "bg-emerald-50/50",
    chipBg: "bg-emerald-500/10",
    chipText: "text-emerald-700",
    ctaLabel: "Join Event",
    ctaBg: "bg-gradient-to-r from-[#059669] to-[#10B981] hover:shadow-[0_0_20px_rgba(5,150,105,0.4)]",
    glowColor: "rgba(5, 150, 105, 0.15)",
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
    PARTNER: "PARTNERSHIP",
    PARTNERSHIP: "PARTNERSHIP",
    MEETUP: "MEETUP",
    REQUIREMENT: "REQUIREMENT",
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
  const menuRef = React.useRef<HTMLDivElement>(null);

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

  const { type, title, author, avatar, time, location, matchScore, badge, rank, context } = post;
  const nType = normalizeType(type);
  const cfg = TYPE_CONFIG[nType];
  const ContextIcon = CONTEXT_ICONS[context?.toUpperCase()] || User;
  const score = matchScore || 50;
  const isOwner = currentUserId === post.user_id || currentUserId === post.author_id;
  const circumference = 2 * Math.PI * 18;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative rounded-[8px] border overflow-hidden transition-all duration-500 tracking-[0px]",
        isOwner 
          ? "bg-slate-50/20 border-slate-200 shadow-none grayscale-[0.5] opacity-[0.85] hover:opacity-100 transition-opacity" 
          : "bg-white border-slate-100 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] hover:border-slate-200",
        isExpanded && "ring-2 ring-offset-4 ring-[#E53935]/20"
      )}
    >
      {/* MONOCHROME GRID & ANNOTATIONS - Faded */}
      {isOwner && (
        <>
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#94A3B812_1px,transparent_1px),linear-gradient(to_bottom,#94A3B812_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="absolute top-0 right-0 px-3 py-1 bg-slate-200 text-slate-500 text-[8px] font-black uppercase z-20 rounded-bl-[6px] flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
             Your Post
          </div>
        </>
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
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar with Ring */}
            <div className="relative shrink-0">
              <div className={cn(
                "h-12 w-12 rounded-[8px] p-0.5 transition-all duration-500 group-hover:rotate-6",
                "bg-gradient-to-tr", cfg.gradient
              )}>
                <div className="h-full w-full rounded-[8px] overflow-hidden bg-white">
                  {avatar
                    ? <img src={avatar} className="h-full w-full object-cover" alt="" />
                    : <div className="h-full w-full bg-slate-50 flex items-center justify-center"><User size={20} className="text-slate-300" /></div>
                  }
                </div>
              </div>
              {/* Verified badge */}
              {post.author_profile?.metadata?.subscription_tier && post.author_profile.metadata.subscription_tier !== "FREE" && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={10} strokeWidth={3} className="text-white" />
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-[16px] font-black truncate leading-none", isOwner ? "text-slate-400" : "text-[#292828]")}>{author}</span>
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase shrink-0",
                  isOwner ? "bg-slate-50 text-slate-300 border-slate-100" : "bg-slate-50 text-slate-400 border border-slate-100"
                )}>
                  <ContextIcon size={10} />
                  {context || "Professional"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {badge && (
                  <span className={cn(
                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                    badge === "Master Partner" ? "bg-amber-500/10 text-amber-600" :
                    badge === "Expert Contributor" ? "bg-emerald-500/10 text-emerald-600" :
                    "bg-slate-50 text-slate-400"
                  )}>
                    {badge}
                  </span>
                )}
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 italic">
                  <Clock size={11} />
                  {time}
                </span>
              </div>
            </div>
          </div>

          {/* Type Pill - Simple English */}
          <div className={cn(
            "shrink-0 flex items-center gap-2 px-4 py-2 rounded-[8px] text-[11px] font-black uppercase ml-3 border backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:scale-105",
            cfg.chipBg, cfg.chipText, "border-white/50"
          )}>
            <cfg.icon size={13} className="animate-pulse" />
            {cfg.label}
          </div>
        </div>

        {/* ── ROW 2: TITLE + DESCRIPTION ── */}
        <div className="mb-8">
          <h3 className={cn(
            "text-[22px] font-black leading-[1.1] mb-2.5 transition-colors duration-300 uppercase",
            isOwner ? "text-slate-400" : "text-[#292828] group-hover:text-[#E53935]"
          )}>
            {title}
          </h3>
          {post.content && (
            <p className={cn(
              "text-[14px] font-medium leading-relaxed line-clamp-2 italic text-slate-300"
            )}>
              "{post.content}"
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
          {nType === "PARTNERSHIP" && <>
            {post.partnershipType && <MetaChip icon={Sparkles} label={post.partnershipType} gradient={cfg.gradient} />}
            {post.industry && <MetaChip icon={Briefcase} label={post.industry} />}
            {post.commitmentLevel && <MetaChip icon={Zap} label={post.commitmentLevel} />}
            {location && <MetaChip icon={MapPin} label={location} />}
          </>}
          {nType === "MEETUP" && <>
            {post.mode && <MetaChip icon={Users} label={post.mode} gradient={cfg.gradient} />}
            {post.dateTime && <MetaChip icon={Calendar} label={post.dateTime} />}
            {post.payment_type && <MetaChip icon={IndianRupee} label={post.payment_type} />}
            {post.max_slots && <MetaChip icon={Tag} label={`${post.max_slots} Slots`} />}
            
            {/* ADVISOR SPOTLIGHT FOR MEETUPS */}
            {(context?.toUpperCase() === 'ADVISOR' || post.author_profile?.role?.toUpperCase() === 'ADVISOR') && (
              <div className="w-full mt-4 p-4 bg-slate-50 border border-slate-100 rounded-[8px] flex items-center justify-between group/advisor transition-all hover:bg-white hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#E53935]/10 flex items-center justify-center text-[#E53935]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-[#E53935] tracking-widest leading-none mb-1">Meetup Advisor</p>
                    <h4 className="text-[13px] font-black text-[#292828] uppercase leading-none tracking-tight">{author}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{rank || "Strategic Advisor"}</p>
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-[#292828]">{score}% Score</span>
                  </div>
                </div>
              </div>
            )}
          </>}
        </div>

        {/* ── ROW 4: ACTIONS ── */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">

          {/* LEFT: Owner menu */}
          <div className="flex items-center gap-2">
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className={cn(
                    "h-10 w-10 rounded-[1rem] border flex items-center justify-center transition-all",
                    showMenu ? "bg-[#475569] text-white border-[#475569]" : "text-slate-400 border-slate-100 hover:text-[#475569] hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <MoreHorizontal size={18} />
                </motion.button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-3 w-48 bg-white rounded-[8px] border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.1)] overflow-hidden z-50 p-1"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit?.(post); setShowMenu(false); }}
                        className="w-full h-11 px-4 flex items-center gap-3 text-[12px] font-black uppercase text-[#475569] hover:bg-slate-50 rounded-[8px] transition-colors"
                      >
                        <Pencil size={14} className="text-slate-400" /> Edit Post
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete?.(post); setShowMenu(false); }}
                        className="w-full h-11 px-4 flex items-center gap-3 text-[12px] font-black uppercase text-red-500 hover:bg-red-50 rounded-[8px] transition-colors"
                      >
                        <Trash2 size={14} /> Delete Post
                      </button>
                      <div className="h-px bg-slate-50 my-1 bg-slate-100" />
                      <button className="w-full h-10 px-4 text-left text-[11px] font-black uppercase text-slate-400 hover:text-[#475569] hover:bg-slate-50 rounded transition-colors">Archive</button>
                      <button className="w-full h-10 px-4 text-left text-[11px] font-black uppercase text-slate-400 hover:text-[#475569] hover:bg-slate-50 rounded transition-colors">Promote</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* RIGHT: Match score + bookmark + CTA */}
          <div className="flex items-center gap-4">

            {/* Match Score - Redesigned Glowing Ring */}
            <div className="hidden md:flex items-center gap-4 pr-4 border-r border-slate-100">
              <div className="relative h-12 w-12 shrink-0 group/score">
                <div className="absolute inset-0 rounded-full bg-slate-50 border border-slate-100" />
                <svg className="h-12 w-12 -rotate-90 relative z-10" viewBox="0 0 44 44">
                  <circle
                    cx="22" cy="22" r="18"
                    fill="none" stroke="transparent" strokeWidth="4"
                  />
                  <motion.circle
                    cx="22" cy="22" r="18"
                    fill="none"
                    stroke={
                      score >= 75 ? "#22c55e" : 
                      score >= 50 ? "#f59e0b" : 
                      score >= 25 ? "#ef4444" : "#94a3b8"
                    }
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-[11px] font-black text-[#292828] tabular-nums">
                    {score}%
                  </span>
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full blur-[8px] opacity-0 group-hover/score:opacity-30 transition-opacity duration-500" 
                     style={{ 
                       backgroundColor: 
                         score >= 75 ? "#22c55e" : 
                         score >= 50 ? "#f59e0b" : 
                         score >= 25 ? "#ef4444" : "#94a3b8" 
                     }} 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Match Rating</span>
                <span className={cn(
                  "text-[12px] font-black uppercase leading-none",
                  score >= 75 ? "text-emerald-600" : 
                  score >= 50 ? "text-amber-600" : 
                  score >= 25 ? "text-red-600" : "text-slate-400"
                )}>{rank || "Emerging"}</span>
              </div>
            </div>

            {/* Bookmark */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
              className={cn(
                "h-11 w-11 rounded-[8px] border flex items-center justify-center transition-all duration-300",
                bookmarked
                  ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "border-slate-100 text-slate-300 hover:text-amber-500 hover:border-amber-200 hover:bg-slate-50"
              )}
            >
              <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
            </motion.button>

            {/* Primary CTA - Hidden for Owner */}
            {!isOwner ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                className={cn(
                  "h-12 px-7 rounded-[8px] text-[13px] font-black uppercase text-white flex items-center gap-2.5 transition-all shadow-xl active:shadow-inner",
                  cfg.ctaBg
                )}
              >
                {cfg.ctaLabel}
                <ArrowUpRight size={16} strokeWidth={3} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            ) : (
              <div className="flex items-center gap-3" />
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
