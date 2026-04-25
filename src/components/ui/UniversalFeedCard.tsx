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
  ChevronUp,
  Maximize2,
  Medal,
  Pencil,
  Trash2,
  MoreVertical,
  Star,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/utils/analytics";

interface UniversalFeedCardProps {
  post: any;
  currentUserId?: string;
  isExpanded?: boolean;
  onExpand?: () => void;
  onAction?: () => void;
  onEdit?: (post: any) => void;
  onDelete?: (post: any) => void;
}

export default function UniversalFeedCard({ 
  post, 
  currentUserId,
  isExpanded, 
  onExpand,
  onAction,
  onEdit,
  onDelete
}: UniversalFeedCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  if (!post) return null;

  const { type, title, author, avatar, time, location, matchScore, badge, rank, context } = post;

  const typeMap: Record<string, string> = {
    LEAD: "REQUIREMENT",
    HIRING: "REQUIREMENT",
    PARTNER: "PARTNERSHIP",
    PARTNERSHIP: "PARTNERSHIP",
    MEETUP: "MEETUP"
  };

  const normalizedType = typeMap[type?.toUpperCase()] || "REQUIREMENT";
  
  const typeConfig: any = {
    REQUIREMENT: { 
      icon: Target, 
      label: "Need", 
      color: "bg-[#E53935]", 
      cta: "Send Offer"
    },
    PARTNERSHIP: { 
      icon: Sparkles, 
      label: "Partner", 
      color: "bg-[#292828]", 
      cta: "Start Chat"
    },
    MEETUP: { 
      icon: Users, 
      label: "Meetup", 
      color: "bg-emerald-600", 
      cta: "Join"
    }
  };

  const contextIcons: any = {
    BUSINESS: Briefcase,
    PROFESSIONAL: User,
    STUDENT: GraduationCap,
    ADVISOR: ShieldCheck
  };

  const config = typeConfig[normalizedType];
  const ContextIcon = contextIcons[context?.toUpperCase()] || User;

  return (
    <div className={cn(
      "group relative bg-white border border-[#292828]/5 rounded-2xl transition-all duration-500 hover:border-[#292828]/20 hover:shadow-2xl hover:shadow-black/5",
      isExpanded && "ring-2 ring-[#292828]/5"
    )}>
      <div className="p-5 lg:p-6 relative z-10">
        
        {/* 1. HEADER: AUTHOR & CONTEXT (LEFT) & POST TYPE (RIGHT) */}
        <div className="flex items-center justify-between mb-5">
           <div className="flex items-center gap-3">
              <div className="relative group">
                 <div className={cn(
                   "h-10 w-10 rounded-xl overflow-hidden border-2 relative z-10 transition-transform active:scale-95",
                   badge === "Master Partner" ? "border-amber-400 shadow-lg shadow-amber-500/10" : "border-white shadow-sm"
                 )}>
                    <img src={avatar} className="h-full w-full object-cover grayscale contrast-125" alt="" />
                 </div>
                 <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-lg bg-white border border-slate-100 shadow-xl flex items-center justify-center z-20">
                    <span className="text-[7px] font-black text-[#292828]">{(post.author_profile?.match_score ?? 50)}</span>
                 </div>
              </div>

              <div className="text-left">
                 <div className="flex items-center justify-start gap-1.5 mb-0.5">
                    <p className="text-sm font-black text-[#292828] leading-none">{author}</p>
                    {post.author_profile?.metadata?.subscription_tier && post.author_profile.metadata.subscription_tier !== 'FREE' && (
                       <div className="h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm ring-1 ring-white">
                          <CheckCircle2 size={10} strokeWidth={4} />
                       </div>
                    )}
                    <div className="h-4 px-1.5 rounded-md border border-slate-100 flex items-center gap-1 text-[7px] font-black uppercase text-slate-400 ml-1">
                       <ContextIcon size={8} />
                       {context || "PROFESSIONAL"}
                    </div>
                 </div>
                 <div className="flex items-center justify-start gap-1.5">
                    <span className={cn(
                       "text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full border transition-all",
                       badge === "Master Partner" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                       badge === "Expert Contributor" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                       "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                       {badge}
                    </span>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">{time}</p>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-2">
              <div className={cn(
                "h-7 px-3 rounded-full flex items-center gap-2 text-[9px] font-black uppercase text-white shadow-lg",
                config.color
              )}>
                 <config.icon size={11} />
                 {config.label}
              </div>
           </div>
        </div>

        {/* 2. CORE CONTENT */}
        <div className="space-y-4">
           <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#292828] leading-tight group-hover:text-[#E53935] transition-colors tracking-tight">
                 {title}
              </h3>
              <p className="text-[15px] font-medium text-slate-500 leading-relaxed line-clamp-3">
                 {post.content}
              </p>
           </div>

            {/* 3. HIGH-DENSITY INFO BAR */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-3 px-1 border-y border-slate-50">
               {normalizedType === "REQUIREMENT" && (
                 <>
                    <DataField label="Budget" value={post.budget || "TBD"} />
                    <DataField label="Urgency" value={post.urgency || "Normal"} color="text-[#E53935]" />
                    <DataField label="Location" value={location} />
                    <DataField label="Skills" value={post.skills_required?.slice(0,2).join(", ") || "General"} />
                 </>
               )}
               {normalizedType === "PARTNERSHIP" && (
                 <>
                    <DataField label="Type" value={post.partnershipType || "Agency"} />
                    <DataField label="Industry" value={post.industry || "General"} />
                    <DataField label="Commitment" value={post.commitmentLevel || "High"} />
                    <DataField label="Location" value={location} />
                 </>
               )}
               {normalizedType === "MEETUP" && (
                 <>
                    <DataField label="Mode" value={post.mode || "Offline"} />
                    <DataField label="Date" value={post.dateTime || "TBD"} />
                    <DataField label="Price" value={post.payment_type || "Free"} />
                    <DataField label="Slots" value={post.max_slots ? `${post.max_slots} Slots` : "Open"} />
                 </>
               )}
            </div>

           {/* 4. ACTIONS */}
           <div className="flex items-center justify-between pt-2">
              {(currentUserId === post.user_id || currentUserId === post.author_id) ? (
                <div className="relative">
                   <button 
                     onClick={() => setShowMenu(!showMenu)}
                     className={cn(
                       "h-10 w-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:text-[#292828] transition-all",
                       showMenu && "bg-[#292828] text-white"
                     )}
                   >
                      <MoreVertical size={16} />
                   </button>
                   {showMenu && (
                     <div 
                       ref={menuRef}
                       className="absolute bottom-full left-0 mb-3 w-48 bg-white border border-[#292828]/10 rounded-xl shadow-4xl overflow-hidden z-[60] animate-in fade-in slide-in-from-bottom-2 duration-300"
                     >
                        <button 
                          onClick={() => { onEdit?.(post); setShowMenu(false); }}
                          className="w-full h-10 px-4 flex items-center gap-3 text-[#292828] hover:bg-slate-50 text-[10px] font-bold uppercase"
                        >
                           <Pencil size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => { onDelete?.(post); setShowMenu(false); }}
                          className="w-full h-10 px-4 flex items-center gap-3 text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase"
                        >
                           <Trash2 size={14} /> Delete
                        </button>
                     </div>
                   )}
                </div>
              ) : <div />}

              <div className="flex items-center gap-3">
                 {/* 4.1 TRUST HIGHLIGHT (UPGRADED TO PROGRESS BAR) */}
                 <div className="hidden sm:flex flex-col gap-1.5 pr-4 border-r border-slate-100">
                    <div className="flex items-center justify-between w-32">
                       <p className="text-[7px] font-black text-slate-300 uppercase leading-none">Match Score</p>
                       <span className={cn(
                         "text-[9px] font-black",
                         (matchScore || 50) >= 80 ? "text-emerald-600" : 
                         (matchScore || 50) >= 50 ? "text-[#292828]" : "text-slate-400"
                       )}>
                         {matchScore || 50}%
                       </span>
                    </div>
                    <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden relative">
                       <div 
                         className={cn(
                           "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out",
                           (matchScore || 50) >= 80 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : 
                           (matchScore || 50) >= 50 ? "bg-[#292828]" : "bg-slate-300"
                         )}
                         style={{ width: `${matchScore || 50}%` }}
                       />
                    </div>
                    <p className="text-[7px] font-bold text-[#292828]/40 uppercase tracking-tighter">{rank || "Emerging"}</p>
                 </div>

                 <button className="h-10 w-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:text-[#E53935] transition-all">
                    <Bookmark size={16} />
                 </button>
                 <button 
                   onClick={onAction}
                   className={cn(
                    "h-10 px-6 bg-[#292828] text-white rounded-lg text-[10px] font-black uppercase hover:bg-[#E53935] transition-all flex items-center gap-2 shadow-lg",
                    config.color === "bg-[#292828]" ? "bg-[#292828]" : config.color
                   )}
                 >
                    {config.cta} <ArrowUpRight size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function DataField({ label, value, highlight, color }: any) {
  return (
    <div className="flex flex-col gap-1">
       <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">{label}</span>
       <div className={cn(
          "text-[13px] font-black flex items-center gap-2",
          highlight ? "text-[#292828]" : "text-[#292828]/80",
          color
       )}>
          <div className={cn("h-1.5 w-1.5 rounded-full", color ? "bg-current" : "bg-[#292828]/20")} />
          {value}
       </div>
    </div>
  );
}
