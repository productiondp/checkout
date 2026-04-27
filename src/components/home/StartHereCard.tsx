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
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="relative mb-12 overflow-hidden"
    >
      <div className="bg-white rounded-[2.5rem] p-10 lg:p-14 text-[#1D1D1F] shadow-2xl shadow-black/[0.03] border border-black/[0.05] relative group">
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E53935]/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <button 
          onClick={dismiss}
          className="absolute top-8 right-8 h-10 w-10 bg-[#F5F5F7] rounded-full flex items-center justify-center hover:bg-[#E8E8ED] transition-all text-[#86868B] z-50"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
           <div className="space-y-6 max-w-xl text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#F5F5F7] border border-black/[0.03] rounded-full"
              >
                 <Sparkles size={14} className="text-[#E53935]" />
                 <span className="text-[10px] font-bold text-[#86868B]">Setup Complete</span>
              </motion.div>
              
              <div className="space-y-4">
                 <h2 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                    Find the right <br/>
                    <span className="text-[#E53935]">people to work with.</span>
                 </h2>
                 <p className="text-lg font-medium text-[#86868B] max-w-md mx-auto lg:mx-0">
                    Your account is ready. Post what you're looking for or explore current projects.
                 </p>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAction}
                className="h-16 px-10 bg-[#1D1D1F] text-white rounded-2xl text-[14px] font-bold hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                 <Plus size={20} strokeWidth={2.5} />
                 <span>Post a Need</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExplore}
                className="h-16 px-10 bg-white border border-black/[0.1] text-[#1D1D1F] rounded-2xl text-[14px] font-bold hover:bg-[#F5F5F7] transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                 <span>Find People</span>
                 <ArrowRight size={20} />
              </motion.button>
           </div>
        </div>

        <div className="mt-14 pt-10 border-t border-black/[0.05] flex flex-wrap gap-10 justify-center lg:justify-start relative z-10">
           {[
              { icon: Globe, label: "Global Scope", desc: "Access 8K+ Nodes", color: "text-red-500" },
              { icon: Zap, label: "Smart Match", desc: "Contextual Synergy", color: "text-amber-500" },
              { icon: Rocket, label: "Fast Track", desc: "Start in 60s", color: "text-emerald-500" }
           ].map((item, i) => (
             <div 
               key={item.label}
               className="flex items-center gap-4"
             >
                <div className="h-12 w-12 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-[#86868B] border border-black/[0.03]">
                   <item.icon size={20} className={item.color} />
                </div>
                <div>
                   <p className="text-[11px] font-bold text-[#1D1D1F] leading-tight mb-0.5">{item.label}</p>
                   <p className="text-[10px] font-medium text-[#86868B]">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}
