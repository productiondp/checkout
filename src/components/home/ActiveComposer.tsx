"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Sparkles, 
  Users, 
  Zap, 
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/utils/constants";

interface ActiveComposerProps {
  user: any;
  onPost: (type: 'REQUIREMENT' | 'PARTNERSHIP' | 'MEETUP') => void;
}

export default function ActiveComposer({ user, onPost }: ActiveComposerProps) {
  return (
    <div className="w-full bg-white border border-black/[0.05] rounded-3xl p-6 mb-8 shadow-2xl shadow-black/[0.02] animate-in slide-in-from-top-4 duration-700">
      
      {/* 1. TOP ROW: AVATAR + COMPOSER INPUT */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl overflow-hidden border border-black/[0.05] shadow-sm shrink-0">
          <img 
            src={user?.avatar_url || DEFAULT_AVATAR} 
            className="w-full h-full object-cover" 
            alt="User" 
          />
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          onClick={() => onPost('REQUIREMENT')}
          className="flex-1 h-16 bg-[#F5F5F7] rounded-2xl px-6 flex items-center justify-between cursor-pointer group hover:bg-[#E8E8ED] transition-all"
        >
          <div>
            <h3 className="text-[15px] font-black italic uppercase tracking-tighter text-[#1D1D1F]/60 group-hover:text-[#1D1D1F] transition-colors leading-none mb-1">
              I need help with...
            </h3>
            <p className="text-[9px] font-black uppercase text-[#86868B] tracking-widest">
              Launch a new requirement
            </p>
          </div>
          <div className="h-10 w-10 bg-[#E53935] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
            <Plus size={20} className="text-white" strokeWidth={3} />
          </div>
        </motion.div>
      </div>

      {/* 2. ACTION TABS */}
      <div className="flex flex-wrap items-center justify-start gap-2 mt-6 pt-5 border-t border-black/[0.03]">
        {[
          { id: 'REQUIREMENT', label: 'Broadcast', icon: Target },
          { id: 'PARTNERSHIP', label: 'Connect', icon: Sparkles },
          { id: 'MEETUP', label: 'Meetup', icon: Users },
        ].map(item => (
          <motion.button 
            key={item.id}
            whileHover={{ y: -2, backgroundColor: "#F5F5F7" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPost(item.id as any)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all border border-black/[0.03] bg-white hover:border-black/[0.08] shadow-sm"
          >
            <item.icon size={16} className="text-[#E53935]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F]/40 hover:text-[#1D1D1F]">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

    </div>
  );
}
