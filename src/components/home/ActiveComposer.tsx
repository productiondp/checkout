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
    <div className="w-full bg-white border border-[#292828]/5 rounded-2xl p-4 mb-5 shadow-sm animate-in slide-in-from-top-4 duration-700">
      
      {/* 1. TOP ROW: AVATAR + COMPOSER INPUT */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl overflow-hidden border border-[#292828]/5 shadow-sm shrink-0">
          <img 
            src={user?.avatar_url || DEFAULT_AVATAR} 
            className="w-full h-full object-cover" 
            alt="User" 
          />
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onPost('REQUIREMENT')}
          className="flex-1 h-14 bg-[#F4F7FA]/70 rounded-xl px-4 flex items-center justify-between cursor-pointer group hover:bg-[#F4F7FA] transition-all"
        >
          <div>
            <h3 className="text-[12px] font-black text-[#292828]/60 uppercase group-hover:text-[#292828] transition-colors">
              Create a requirement...
            </h3>
            <p className="text-[9px] font-medium text-[#292828]/25 italic">
              Requirement = what you need (hiring, leads, etc.)
            </p>
          </div>
          <Zap size={16} className="text-[#E53935] opacity-40 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>

      {/* 2. BOTTOM ROW: ACTION TABS */}
      <div className="flex items-center justify-start gap-1 border-t border-[#292828]/5 pt-3">
        {[
          { id: 'REQUIREMENT', label: 'POST A NEED', icon: Target },
          { id: 'PARTNERSHIP', label: 'FIND A PARTNER', icon: Sparkles },
          { id: 'MEETUP', label: 'MEET UP', icon: Users },
        ].map(item => (
          <motion.button 
            key={item.id}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.02)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPost(item.id as any)}
            className="flex items-center gap-2 group px-4 py-2 rounded-xl transition-all"
          >
            <div className="text-slate-300 group-hover:text-[#292828] transition-all">
              <item.icon size={16} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-[#292828] transition-colors">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

    </div>
  );
}
