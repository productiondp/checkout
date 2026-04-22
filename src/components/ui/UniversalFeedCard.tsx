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
  Medal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UniversalFeedCardProps {
  post: any;
  isExpanded?: boolean;
  onExpand?: () => void;
  onAction?: () => void;
}

export default function UniversalFeedCard({ 
  post, 
  isExpanded, 
  onExpand,
  onAction 
}: UniversalFeedCardProps) {
  const { type, title, author, avatar, time, location, matchScore, badge, rank, domain } = post;

  const isUpdate = type === "Update";
  const isLead = type === "Lead";
  const isHiring = type === "Hiring";
  const isPartner = type === "Partner";
  const isMeetup = type === "Meetup";

  const typeConfig: any = {
    Lead: { icon: Target, label: "BUSINESS LEAD", color: "bg-[#E53935]", light: "bg-red-50 text-red-600" },
    Hiring: { icon: Briefcase, label: "OPEN MANDATE", color: "bg-emerald-600", light: "bg-emerald-50 text-emerald-600" },
    Partner: { icon: Sparkles, label: "PARTNERSHIP", color: "bg-[#E53935]", light: "bg-red-50 text-red-600" },
    Meetup: { icon: LayoutGrid, label: "EXPERT SESSION", color: "bg-emerald-600", light: "bg-emerald-50 text-emerald-600" },
    Update: { icon: Zap, label: "CHECKOUT NOW", color: "bg-slate-600", light: "bg-slate-50 text-slate-600" }
  };

  const badgeConfig: any = {
    Bronze: "border-orange-200 text-orange-600",
    Silver: "border-slate-200 text-slate-400",
    Gold: "border-yellow-300 text-yellow-600",
    Elite: "border-[#292828] text-white bg-[#292828] px-3"
  };

  const config = typeConfig[type] || typeConfig.Update;

  return (
    <div className={cn(
      "group relative bg-white border border-[#292828]/10 rounded-[28px] overflow-hidden transition-all duration-500",
      isExpanded && "ring-2 ring-[#292828]/5",
      (isLead || isPartner) && "border-[#E53935]/40 shadow-xl shadow-red-500/5",
      (isHiring || isMeetup) && "border-emerald-600/40 shadow-xl shadow-emerald-500/5"
    )}>
      {/* VERTICAL TACTICAL STRIP */}
      {(isLead || isPartner || isHiring || isMeetup) && (
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 z-20 transition-all group-hover:w-2",
          (isLead || isPartner) ? "bg-[#E53935]" : "bg-emerald-600"
        )} />
      )}

      {/* ROTATED TACTICAL LABEL */}
      {(isLead || isPartner) && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-180 [writing-mode:vertical-lr] text-[8px] font-bold text-[#E53935]/20 uppercase tracking-[0.4em] select-none pointer-events-none">
           PRIORITY MANDATE
        </div>
      )}
      {(isHiring || isMeetup) && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-180 [writing-mode:vertical-lr] text-[8px] font-bold text-emerald-600/20 uppercase tracking-[0.4em] select-none pointer-events-none">
           CORE SESSION
        </div>
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
                    <h4 className="text-[13px] font-bold text-[#292828] leading-none mb-1">{author}</h4>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#292828]/30 uppercase">
                       <Clock size={10} /> {time}
                    </div>
                 </div>
              </div>

              {/* TACTICAL METRICS */}
              <div className="space-y-3 pt-4 border-t border-[#292828]/5">
                 <div className="flex flex-wrap items-center gap-1.5">
                    <div className={cn("h-6 flex items-center px-2.5 rounded-md border text-[8px] font-bold uppercase", badgeConfig[badge])}>
                       {badge}
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#292828]">
                       <Medal size={16} />
                    </div>
                    <div>
                       <p className="text-[8px] font-bold text-[#292828]/40 uppercase leading-none mb-0.5">Positional rank</p>
                       <p className="text-[10px] font-bold text-[#E53935] uppercase">{rank}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* DATA BLOCK */}
           <div className="space-y-6">
              <div className="space-y-3">
                 {/* INTEGRATED TYPE HUB */}
                 <div className={cn(
                   "h-6 inline-flex items-center px-3 rounded-md text-[8px] font-bold tracking-widest text-white shadow-sm mb-1",
                   config.color
                 )}>
                    <config.icon size={10} className="mr-1.5" />
                    {config.label}
                 </div>
                 
                 <h3 className={cn(
                   "text-xl lg:text-2xl font-bold leading-tight tracking-tighter transition-colors duration-500",
                   (isLead || isPartner) ? "text-[#E53935]" : (isHiring || isMeetup) ? "text-emerald-600" : "text-[#292828] hover:text-[#E53935]"
                 )}>
                    {title}
                 </h3>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 p-6 bg-[#F8FAFC] border border-[#292828]/5 rounded-[20px] relative">
                  {isMeetup && (
                     <div className="absolute top-4 right-6 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-[#292828] uppercase">{post.joined}/{post.maxSlots} Joined</span>
                     </div>
                  )}
                  {isLead && (
                     <>
                        <DataField label="Requirement" value={post.content} highlight />
                        <DataField label="Budget range" value={post.budget} color="text-blue-600" />
                        <DataField label="Mandated deadline" value={post.dueDate} color="text-[#E53935]" />
                        <DataField label="Verified hub" value={location} icon={<MapPin size={12} />} />
                     </>
                  )}
                  {isMeetup && (
                     <>
                        <DataField label="Selected expert" value={post.advisor} color="text-emerald-600" highlight />
                        <DataField label="Expert rank" value={`Local ranking`} />
                        <DataField label="Pay type" value={post.payment || "Shared cost"} color="text-emerald-600" />
                        <DataField label="Field" value={domain} />
                     </>
                  )}
                 {isHiring && (
                    <>
                       <DataField label="Core mandate" value={post.skills} highlight />
                       <DataField label="Work structure" value={post.workType} />
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
           {/* LEFT HUB: Metadata Signals */}
           <div className="flex items-center gap-2">
              <div className="flex flex-col items-start selection:bg-none">
                 <p className="text-[8px] font-bold text-[#292828]/30 uppercase leading-none mb-1 tracking-widest text-left">
                    Match
                 </p>
                 <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "text-2xl font-bold tabular-nums leading-none tracking-tighter",
                      isMeetup ? "text-emerald-600" : "text-[#292828]"
                    )}>
                       {matchScore}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold",
                      isMeetup ? "text-emerald-600/30" : "text-[#292828]/30"
                    )}>%</span>
                 </div>
              </div>
           </div>

           {/* RIGHT HUB: Action Hub */}
           <div className="flex items-center gap-2 shrink-0">
              {isMeetup ? (
                 <div className="flex items-center gap-2">
                    <button className="h-12 px-6 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
                       Join Group <ArrowUpRight size={14} />
                    </button>
                    <button className="h-12 px-6 bg-white border border-slate-200 text-[#292828] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
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
       <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-normal">{label}</span>
       <div className={cn(
         "text-[14px] font-bold uppercase flex items-center gap-2 truncate",
         highlight ? "text-[#292828]" : "text-slate-500",
         color
       )}>
          {icon}
          {value}
       </div>
    </div>
  );
}

