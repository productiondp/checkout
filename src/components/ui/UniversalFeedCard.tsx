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
  DollarSign,
  AlertCircle,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  bgColor: string;
  chipBg: string;
  chipText: string;
  ctaLabel: string;
  ctaBg: string;
}> = {
  REQUIREMENT: {
    icon: Target,
    label: "Requirement",
    accentColor: "#E53935",
    bgColor: "bg-red-50",
    chipBg: "bg-red-50",
    chipText: "text-[#E53935]",
    ctaLabel: "Send Offer",
    ctaBg: "bg-[#E53935] hover:bg-red-700",
  },
  PARTNERSHIP: {
    icon: Sparkles,
    label: "Partnership",
    accentColor: "#292828",
    bgColor: "bg-slate-50",
    chipBg: "bg-slate-100",
    chipText: "text-[#292828]",
    ctaLabel: "Connect",
    ctaBg: "bg-[#292828] hover:bg-black",
  },
  MEETUP: {
    icon: Users,
    label: "Meetup",
    accentColor: "#059669",
    bgColor: "bg-emerald-50",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    ctaLabel: "Join",
    ctaBg: "bg-emerald-600 hover:bg-emerald-700",
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
  const circumference = 2 * Math.PI * 16; // r=16

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300",
        "hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] hover:border-slate-200",
        isExpanded && "ring-2 ring-offset-2 ring-[#E53935]/20"
      )}
    >
      {/* LEFT ACCENT BAR */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 group-hover:w-1.5"
        style={{ backgroundColor: cfg.accentColor }}
      />

      <div className="pl-5 pr-5 pt-5 pb-4">

        {/* ── ROW 1: AUTHOR + TYPE BADGE ── */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-11 w-11 rounded-xl overflow-hidden border-2 border-white shadow-md">
                {avatar
                  ? <img src={avatar} className="h-full w-full object-cover" alt="" />
                  : <div className="h-full w-full bg-slate-100 flex items-center justify-center"><User size={18} className="text-slate-300" /></div>
                }
              </div>
              {/* Verified dot */}
              {post.author_profile?.metadata?.subscription_tier && post.author_profile.metadata.subscription_tier !== "FREE" && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={9} strokeWidth={3} className="text-white" />
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[15px] font-bold text-[#292828] truncate leading-none">{author}</span>
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0",
                  "bg-slate-100 text-slate-500"
                )}>
                  <ContextIcon size={9} />
                  {context || "Professional"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {badge && (
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    badge === "Master Partner" ? "bg-amber-50 text-amber-600" :
                    badge === "Expert Contributor" ? "bg-emerald-50 text-emerald-600" :
                    "bg-slate-50 text-slate-400"
                  )}>
                    {badge}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} />
                  {time}
                </span>
              </div>
            </div>
          </div>

          {/* Type pill */}
          <div className={cn(
            "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ml-3",
            cfg.chipBg, cfg.chipText
          )}>
            <cfg.icon size={12} />
            {cfg.label}
          </div>
        </div>

        {/* ── ROW 2: TITLE + DESCRIPTION ── */}
        <div className="mb-4">
          <h3 className={cn(
            "text-[20px] font-black text-[#292828] leading-tight mb-1.5 transition-colors duration-200",
            "group-hover:text-[#E53935]"
          )} style={{ letterSpacing: "-0.02em" }}>
            {title}
          </h3>
          {post.content && (
            <p className="text-[14px] text-slate-500 leading-relaxed line-clamp-2">
              {post.content}
            </p>
          )}
        </div>

        {/* ── ROW 3: METADATA CHIPS ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {nType === "REQUIREMENT" && <>
            {post.budget && <MetaChip icon={DollarSign} label={post.budget} accent={cfg.accentColor} />}
            {post.urgency && <MetaChip icon={AlertCircle} label={post.urgency} accent={cfg.accentColor} />}
            {location && <MetaChip icon={MapPin} label={location} />}
            {post.skills_required?.slice(0, 2).map((s: string) => (
              <MetaChip key={s} icon={Tag} label={s} />
            ))}
          </>}
          {nType === "PARTNERSHIP" && <>
            {post.partnershipType && <MetaChip icon={Sparkles} label={post.partnershipType} accent={cfg.accentColor} />}
            {post.industry && <MetaChip icon={Briefcase} label={post.industry} />}
            {post.commitmentLevel && <MetaChip icon={Zap} label={post.commitmentLevel} />}
            {location && <MetaChip icon={MapPin} label={location} />}
          </>}
          {nType === "MEETUP" && <>
            {post.mode && <MetaChip icon={Users} label={post.mode} accent={cfg.accentColor} />}
            {post.dateTime && <MetaChip icon={Calendar} label={post.dateTime} />}
            {post.payment_type && <MetaChip icon={DollarSign} label={post.payment_type} />}
            {post.max_slots && <MetaChip icon={Tag} label={`${post.max_slots} Slots`} />}
          </>}
        </div>

        {/* ── ROW 4: ACTIONS ── */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">

          {/* LEFT: Owner menu OR empty */}
          {isOwner ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={cn(
                  "h-9 w-9 rounded-xl border border-slate-100 flex items-center justify-center transition-all",
                  showMenu ? "bg-[#292828] text-white border-[#292828]" : "text-slate-400 hover:text-[#292828] hover:border-slate-300"
                )}
              >
                <MoreHorizontal size={16} />
              </button>
              {showMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-44 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-1 duration-150">
                  <button
                    onClick={() => { onEdit?.(post); setShowMenu(false); }}
                    className="w-full h-11 px-4 flex items-center gap-3 text-[13px] font-medium text-[#292828] hover:bg-slate-50 transition-colors"
                  >
                    <Pencil size={14} className="text-slate-400" /> Edit Post
                  </button>
                  <div className="h-px bg-slate-50" />
                  <button
                    onClick={() => { onDelete?.(post); setShowMenu(false); }}
                    className="w-full h-11 px-4 flex items-center gap-3 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ) : <div />}

          {/* RIGHT: Match score + bookmark + CTA */}
          <div className="flex items-center gap-3">

            {/* Match Score Ring */}
            <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-slate-100">
              <div className="relative h-10 w-10 shrink-0">
                <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
                  <circle
                    cx="20" cy="20" r="16"
                    fill="none" stroke="#f1f5f9" strokeWidth="3"
                  />
                  <circle
                    cx="20" cy="20" r="16"
                    fill="none"
                    stroke={score >= 80 ? "#059669" : score >= 50 ? cfg.accentColor : "#cbd5e1"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * score) / 100}
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#292828]">
                  {score}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none">Match</span>
                <span className="text-[11px] font-bold text-[#292828] leading-none">{rank || "Emerging"}</span>
              </div>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={cn(
                "h-9 w-9 rounded-xl border flex items-center justify-center transition-all",
                bookmarked
                  ? "bg-amber-50 border-amber-200 text-amber-500"
                  : "border-slate-100 text-slate-300 hover:text-amber-500 hover:border-amber-200"
              )}
            >
              <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
            </button>

            {/* Primary CTA */}
            <button
              onClick={onAction}
              className={cn(
                "h-9 px-5 rounded-xl text-[13px] font-bold text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-sm",
                cfg.ctaBg
              )}
            >
              {cfg.ctaLabel}
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MICRO COMPONENT: MetaChip ──
function MetaChip({ icon: Icon, label, accent }: { icon: any; label: string; accent?: string }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[12px] font-medium transition-colors"
      style={accent
        ? { borderColor: `${accent}30`, backgroundColor: `${accent}08`, color: accent }
        : { borderColor: "#f1f5f9", backgroundColor: "#f8fafc", color: "#64748b" }
      }
    >
      <Icon size={11} />
      {label}
    </div>
  );
}
