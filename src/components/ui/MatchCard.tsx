"use client";

import React from "react";
import { Sparkles, Star, MapPin, Zap, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  title: string;
  subtitle: string;
  score: number;
  reason: string;
  tags: string[];
  reputation?: any;
  avatar?: string;
  onConnect: () => void;
}

export default function MatchCard({
  title,
  subtitle,
  score,
  reason,
  tags,
  reputation,
  avatar,
  onConnect,
}: MatchCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-soft border border-white/60 hover:shadow-premium transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#292828]/5 border border-[#292828]/10 flex items-center justify-center text-3xl font-bold text-primary shadow-sm overflow-hidden">
            {avatar ? avatar : title[0]}
          </div>
          <div>
             <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[20px] font-bold text-text-main group-hover:text-primary transition-colors leading-none">{title}</h3>
                {reputation?.badges?.includes("Verified") && (
                   <ShieldCheck size={16} className="text-primary" />
                )}
             </div>
             <p className="text-[14px] font-medium text-text-muted">{subtitle}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <div className="bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 flex items-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-primary fill-primary" />
              <span className="text-[12px] font-bold text-primary">{score}% Match</span>
           </div>
            {reputation && (
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-[11px] font-bold text-text-main">{reputation.rating}</span>
              <span className="text-[10px] text-text-muted">({reputation.projectsCompleted} deals)</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#292828]/5/50 rounded-2xl p-5 mb-8 border border-[#292828]/5">
        <p className="text-[14px] text-text-main leading-relaxed italic">
          "{reason}"
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-text-muted hover:border-primary hover:text-primary transition-all cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={onConnect}
        className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-[14px] shadow-lg shadow-primary/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        <Zap size={18} fill="white" />
        Initiate Deal Engine
      </button>
    </div>
  );
}
