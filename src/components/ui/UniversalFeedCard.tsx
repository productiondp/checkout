"use client";

import React from "react";
import { 
  Zap, 
  Target, 
  Briefcase, 
  Users, 
  Sparkles, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  Bookmark,
  ChevronUp,
  Maximize2,
  LayoutGrid,
  Medal,
  BrainCircuit,
  Pencil,
  Trash2,
  MoreVertical
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

  // Safety check for post data
  if (!post) return null;

  const { type, title, author, avatar, time, location, matchScore, badge, rank, domain } = post;

  const isUpdate = type?.toUpperCase() === "UPDATE";
  const isLead = type?.toUpperCase() === "LEAD";
  const isHiring = type?.toUpperCase() === "HIRING";
  const isPartner = type?.toUpperCase() === "PARTNER";
  const isMeetup = type?.toUpperCase() === "MEETUP";

  const typeConfig: any = {
    LEAD: { icon: Target, label: "BUSINESS LEAD", color: "bg-[#E53935]", light: "bg-red-50 text-red-600" },
    HIRING: { icon: Briefcase, label: "OPEN MANDATE", color: "bg-emerald-600", light: "bg-emerald-50 text-emerald-600" },
    PARTNER: { icon: Sparkles, label: "PARTNERSHIP", color: "bg-[#E53935]", light: "bg-red-50 text-red-600" },
    MEETUP: { icon: LayoutGrid, label: "EXPERT SESSION", color: "bg-emerald-600", light: "bg-emerald-50 text-emerald-600" },
    UPDATE: { icon: Zap, label: "CHECKOUT NOW", color: "bg-slate-600", light: "bg-slate-50 text-slate-600" }
  };

  const badgeConfig: any = {
    Bronze: "border-orange-200 text-orange-600",
    Silver: "border-slate-200 text-slate-400",
    Gold: "border-yellow-300 text-yellow-600",
    Elite: "border-[#292828] text-white bg-[#292828] px-3"
  };

  const config = typeConfig[type?.toUpperCase()] || typeConfig.UPDATE;

  return (
    <div className={cn(
      "group relative bg-white border border-[#292828]/10 rounded-[28px] transition-all duration-500",
      isExpanded && "ring-2 ring-[#292828]/5",
      (isLead || isPartner) && "border-[#E53935]/40 shadow-xl shadow-red-500/5",
      (isHiring || isMeetup) && "border-emerald-600/40 shadow-xl shadow-emerald-500/5"
    )}>
      {/* VERTICAL TACTICAL STRIP */}
      {(isLead || isPartner || isHiring || isMeetup) && (
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 z-20 transition-all group-hover:w-2 rounded-l-[28px]",
          (isLead || isPartner) ? "bg-[#E53935]" : "bg-emerald-600"
        )} />
      )}

      <div className={cn("p-6 lg:p-8 relative z-10", (isLead || isMeetup) && "pl-10 lg:pl-12")}>
        
        {/* 1. CORE CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">
           
           {/* IDENTITY HUB */}
           <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 border border-[#292828]/10 overflow-hidden shadow-sm">
                       <img src={avatar} className="h-full w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                 </div>
                 <div>
                    <h4>{author}</h4>
                    <div className="subheading-editorial !mb-0 flex items-center gap-1.5 !text-[11px]">
                       <Clock size={10} /> {time}
                    </div>
                 </div>
              </div>

              {/* TACTICAL METRICS */}
              <div className="space-y-3 pt-4 border-t border-[#292828]/5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {badge && (
                      <div className={cn("h-6 flex items-center px-2.5 rounded-md border text-[8px] font-bold uppercase", badgeConfig[badge] || badgeConfig.Silver)}>
                        {badge}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#292828]">
                        <Medal size={16} />
                     </div>
                     <div>
                        <p className="text-[8px] font-bold text-[#666666] uppercase leading-none mb-0.5">Positional rank</p>
                        <p className="text-[10px] font-bold text-[#E53935] uppercase">{rank}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* DATA BLOCK */}
            <div className="space-y-6">
               <div className="space-y-3">
                  <div className={cn(
                    "h-6 inline-flex items-center px-3 rounded-md text-[8px] font-bold tracking-widest text-white shadow-sm mb-1",
                    config.color
                  )}>
                     <config.icon size={10} className="mr-1.5" />
                     {config.label}
                  </div>
                  
                  <h3 className={cn(
                    "transition-colors duration-500",
                    (isLead || isPartner) ? "text-[#E53935]" : (isHiring || isMeetup) ? "text-emerald-600" : "text-[#111111] hover:text-[#E53935]"
                  )}>
                     {title}
                  </h3>
               </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 p-6 bg-[#F8FAFC] border border-[#292828]/5 rounded-[20px] relative">
                  {isMeetup && (
                     <div className="absolute top-4 right-6 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-[#111111] uppercase">{post.joined}/{post.maxSlots} Joined</span>
                     </div>
                  )}
                  {isLead && (
                     <>
                        <DataField label="Requirement" value={post.content} highlight />
                        <DataField label="Budget range" value={post.budget} color="text-blue-600" />
                        <DataField label="Mandated deadline" value={post.due_date} color="text-[#E53935]" />
                        <DataField label="Verified hub" value={location} icon={<MapPin size={12} />} />
                     </>
                  )}
                  {isMeetup && (
                     <>
                        <DataField label="Selected expert" value={post.advisor || "Awaiting Expert"} color="text-emerald-600" highlight />
                        <DataField label="Expert rank" value={`Local ranking`} />
                        <DataField label="Pay type" value={post.payment_type || "Shared cost"} color="text-emerald-600" />
                        <DataField label="Field" value={domain} />
                     </>
                  )}
                  {isHiring && (
                     <>
                        <DataField label="Core mandate" value={post.skills_required?.join(', ') || 'General Help'} highlight />
                        <DataField label="Work structure" value={post.work_type} />
                        <DataField label="Project duration" value={post.duration} />
                        <DataField label="Hub location" value={location} />
                     </>
                  )}
                  {isPartner && (
                     <>
                        <DataField label="B2B offer" value={post.offer} highlight />
                        <DataField label="Resource need" value={post.need} highlight />
                        <DataField label="Partnership term" value={post.timeline} />
                        <DataField label="Local hub" value={location} />
                     </>
                  )}
                  {isUpdate && (
                     <>
                        <DataField label="Current status" value={post.content} highlight />
                        <DataField label="Operational goal" value={post.need} />
                        <DataField label="City hub" value={location} />
                        <DataField label="Intel source" value="Verified update" />
                     </>
                  )}
               </div>
            </div>
         </div>

         {/* 3. TACTICAL FOOTER */}
         <div className="mt-8 pt-6 border-t border-[#292828]/5 flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                  <div className="flex flex-col items-start selection:bg-none relative group/ai">
                     <div className="flex items-center gap-1.5 mb-1.5 opacity-0 group-hover/ai:opacity-100 transition-opacity">
                        <Sparkles size={8} className="text-[#E53935] animate-pulse" />
                        <span className="text-[7px] font-black text-[#E53935] uppercase tracking-widest">Partner Score</span>
                     </div>
                     <p className="subheading-editorial !text-[#666666] !mb-1">
                        Alignment
                     </p>
                     <div className="flex items-baseline gap-1">
                        <span className={cn(
                          "text-2xl font-bold tabular-nums leading-none tracking-tighter",
                          isMeetup ? "text-emerald-600" : "text-[#111111]"
                        )}>
                          {matchScore}
                        </span>
                        <span className={cn(
                          "text-[10px] font-bold",
                          isMeetup ? "text-emerald-600/30" : "text-[#666666]/30"
                        )}>%</span>
                     </div>
                     
                     {/* AI Insight Tooltip/Bubble */}
                     <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-48 bg-[#292828] text-white p-3 rounded-xl text-[9px] font-medium leading-relaxed opacity-0 group-hover/ai:opacity-100 transition-all pointer-events-none z-50 shadow-2xl translate-x-2 group-hover/ai:translate-x-0">
                        <div className="flex items-center gap-2 mb-1.5 text-[#E53935]">
                           <BrainCircuit size={10} />
                           <span className="font-black uppercase tracking-widest text-[8px]">Partner Insight</span>
                        </div>
                        "This {type} aligns with your {domain || 'core'} expertise. High probability of strategic fit."
                     </div>
                  </div>
               </div>

            <div className="flex items-center gap-2 shrink-0">
               {isMeetup ? (
                  <div className="flex items-center gap-2">
                     <button className="h-12 px-6 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
                        Join Group <ArrowUpRight size={14} />
                     </button>
                     <button className="h-12 px-6 bg-white border border-slate-200 text-[#111111] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Details
                     </button>
                  </div>
               ) : (
                  <button 
                    onClick={onAction}
                    className={cn(
                      "h-12 px-8 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                      "bg-[#292828] text-white hover:bg-[#E53935]"
                    )}
                  >
                     {isLead ? "View More" : isHiring ? "Apply" : "Connect"}
                     <ArrowUpRight size={16} strokeWidth={3} />
                  </button>
               )}
               
               <button className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#E53935] hover:border-[#E53935] transition-all shrink-0">
                  <Bookmark size={18} />
               </button>
               
               {/* Only show edit/delete for the post owner */}
               {(currentUserId === post.user_id || currentUserId === post.author_id) && (
                 <div className="relative">
                    <button 
                      onClick={() => setShowMenu(!showMenu)}
                      className={cn(
                        "h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#292828] hover:border-[#292828] transition-all shrink-0",
                        showMenu && "bg-[#292828] text-white border-[#292828]"
                      )}
                    >
                       <MoreVertical size={18} />
                    </button>

                    {showMenu && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#292828]/10 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
                         <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                            <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Feed Actions</p>
                         </div>
                         <div className="p-1.5">
                            <button 
                              onClick={() => { onEdit?.(post); setShowMenu(false); }}
                              className="w-full h-11 px-4 flex items-center gap-3 text-[#292828] hover:bg-slate-50 rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider"
                            >
                               <div className="h-7 w-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-[#292828]">
                                  <Pencil size={12} />
                               </div>
                               Edit Mandate
                            </button>
                            <button 
                              onClick={() => { onDelete?.(post); setShowMenu(false); }}
                              className="w-full h-11 px-4 flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider"
                            >
                               <div className="h-7 w-7 bg-red-100/50 rounded-lg flex items-center justify-center text-red-500">
                                  <Trash2 size={12} />
                               </div>
                               Delete Node
                            </button>
                         </div>
                      </div>
                    )}
                 </div>
               )}
               
               <button 
                 onClick={onExpand}
                 className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all shrink-0"
               >
                  {isExpanded ? <ChevronUp size={18} /> : <Maximize2 size={18} />}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function DataField({ label, value, highlight, color, icon }: any) {
  return (
    <div className="space-y-1.5">
       <span className="subheading-editorial !text-[9px] !mb-0">{label}</span>
       <div className={cn(
         "text-[14px] font-bold uppercase flex items-center gap-2 truncate",
         highlight ? "text-[#111111]" : "text-[#666666]",
         color
       )}>
          {icon}
          {value}
       </div>
    </div>
  );
}
