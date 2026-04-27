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
            <h3 className="text-[14px] font-bold text-[#1D1D1F]/60 group-hover:text-[#1D1D1F] transition-colors">
              I need help with...
            </h3>
            <p className="text-[11px] font-medium text-[#86868B]">
              Share what you're working on
            </p>
          </div>
          <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Plus size={18} className="text-[#E53935]" />
          </div>
        </motion.div>
      </div>

      {/* 2. ACTION TABS */}
      <div className="flex items-center justify-start gap-2 mt-6 pt-5 border-t border-black/[0.03]">
        {[
          { id: 'REQUIREMENT', label: 'Post a Need', icon: Target },
          { id: 'PARTNERSHIP', label: 'Collab', icon: Sparkles },
          { id: 'MEETUP', label: 'Event', icon: Users },
        ].map(item => (
          <motion.button 
            key={item.id}
            whileHover={{ y: -2, backgroundColor: "#F5F5F7" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPost(item.id as any)}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all border border-transparent hover:border-black/[0.05]"
          >
            <item.icon size={16} className="text-[#86868B]" />
            <span className="text-[12px] font-bold text-[#86868B] group-hover:text-[#1D1D1F]">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

    </div>
  );
}
