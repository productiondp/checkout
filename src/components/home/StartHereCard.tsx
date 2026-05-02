"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  Users, 
  X,
  Plus,
  Zap,
  Globe,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface StartHereCardProps {
  onAction: () => void;
  onExplore: () => void;
}

export default function StartHereCard({ onAction, onExplore }: StartHereCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show only if not dismissed
    const dismissed = localStorage.getItem("dismissed_start_here");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("dismissed_start_here", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-10 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* CARD 1: POST REQUIREMENT */}
      <motion.div 
        whileHover={{ y: -5 }}
        onClick={onAction}
        className="relative bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-black/[0.03] cursor-pointer group overflow-hidden h-full flex flex-col justify-between"
      >
        <div className="space-y-8">
           <div className="h-16 w-16 bg-[#E53935] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(229,57,51,0.3)] group-hover:scale-110 transition-transform duration-500">
              <Target size={32} className="text-white fill-white/20" strokeWidth={2.5} />
           </div>
           
           <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black italic tracking-tighter text-[#1D1D1F] uppercase leading-none">
                 Post<br />Requirement
              </h2>
              <p className="text-[12px] font-black text-[#86868B] uppercase tracking-wider leading-relaxed max-w-[240px]">
                 Share what you need and get matched with experts instantly.
              </p>
           </div>
        </div>

        <div className="pt-8 flex items-center gap-2 text-[#E53935] font-black uppercase tracking-widest text-[11px] group-hover:gap-4 transition-all">
           Broadcast Now <Plus size={16} strokeWidth={4} />
        </div>
      </motion.div>

      {/* CARD 2: FIND PARTNER */}
      <motion.div 
        whileHover={{ y: -5 }}
        onClick={onExplore}
        className="relative bg-[#0A0A0A] rounded-[2.5rem] p-8 lg:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-white/5 cursor-pointer group overflow-hidden h-full flex flex-col justify-between"
      >
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
           <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#E53935]/20 blur-[80px] rounded-full" />
        </div>

        <div className="space-y-8 relative z-10">
           <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-all duration-500">
              <Users size={32} className="text-white" strokeWidth={2} />
           </div>
           
           <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                 Find<br />Partner
              </h2>
              <p className="text-[12px] font-black text-white/30 uppercase tracking-wider leading-relaxed max-w-[240px]">
                 Explore the network and find the right partners to build with.
              </p>
           </div>
        </div>

        <div className="pt-8 flex items-center justify-between relative z-10">
           <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-[11px]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#34C759] animate-pulse shadow-[0_0_8px_#34C759]" />
              Start Discovery
           </div>
           <ArrowRight size={20} className="text-white/40 group-hover:text-white group-hover:translate-x-2 transition-all" strokeWidth={3} />
        </div>
      </motion.div>

      <button 
        onClick={dismiss}
        className="absolute -top-3 -right-3 h-8 w-8 bg-white border border-black/[0.05] shadow-lg rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all z-20"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
