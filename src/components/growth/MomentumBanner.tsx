"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MomentumBannerProps {
  unreadCount: number;
  pendingRequests: number;
}

export function MomentumBanner({ unreadCount, pendingRequests }: MomentumBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const total = unreadCount + pendingRequests;

  useEffect(() => {
    if (total > 0) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [total]);

  if (!isVisible || total === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mb-8 p-6 bg-black rounded-[24px] shadow-2xl shadow-black/20 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#E53935]/20 to-transparent opacity-50" />
        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
           <TrendingUp size={120} className="text-white" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="h-12 w-12 bg-[#E53935] text-white rounded-[15px] flex items-center justify-center shadow-lg shadow-[#E53935]/40">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                 <h2 className="text-white text-[16px] font-black uppercase font-outfit tracking-tight">Growth Momentum 🔥</h2>
                 <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">You have {total} new interactions waiting for your action</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="h-8 w-8 rounded-full border-2 border-black bg-slate-800 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=user${i}`} alt="" />
                   </div>
                 ))}
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="h-10 px-6 bg-white rounded-[12px] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
              >
                View Activity
              </button>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
