"use client";

import React from "react";
import { Activity, Plus, Sparkles, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import UniversalFeedCard from "@/components/ui/UniversalFeedCard";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface HomeFeedProps {
  posts: any[];
  isLoading: boolean;
  currentUserId?: string;
  onAction?: (post: any) => void;
  onEdit?: (post: any) => void;
  onDelete?: (post: any) => void;
  onCreate?: () => void;
}

export default function HomeFeed({ 
  posts, 
  isLoading, 
  currentUserId,
  onAction,
  onEdit,
  onDelete,
  onCreate
}: HomeFeedProps) {
  const router = useRouter();
  
  const [isFabExpanded, setIsFabExpanded] = React.useState(true);
  const [isTyping, setIsTyping] = React.useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current + 10) {
        setIsFabExpanded(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setIsFabExpanded(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const handleFocus = (e: any) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        setIsTyping(true);
      }
    };

    const handleBlur = (e: any) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        setIsTyping(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="relative h-20 w-20 flex items-center justify-center mb-8">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 rounded-[8px] border-4 border-[#E53935]/10 border-t-[#E53935]" 
           />
           <Activity size={32} className="text-[#E53935] animate-pulse" />
        </div>
        <p className="text-[12px] font-black text-[#292828] uppercase tracking-[0.5em] animate-pulse">Syncing Network...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-24 text-center bg-white rounded-[8px] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 h-40 w-40 bg-[#E53935]/5 blur-[60px] rounded-full" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-blue-500/5 blur-[60px] rounded-full" />
        
        <div className="relative z-10">
          <div className="h-24 w-24 bg-slate-50 rounded-[8px] mx-auto mb-10 flex items-center justify-center text-[#E53935] shadow-inner">
             <Sparkles size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-3xl font-black text-[#292828] uppercase mb-4 tracking-tighter leading-none">The Feed is Waiting.</h3>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-12 max-w-sm mx-auto leading-relaxed">
            Be the catalyst. Post a requirement or discover connections to populate your network.
          </p>
          
          <div className="max-w-xs mx-auto px-6">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={onCreate} 
               className="w-full h-20 bg-gradient-to-r from-[#292828] to-black text-white rounded-[8px] font-black text-[12px] uppercase tracking-[0.4em] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-4 group"
             >
                Initialize <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
             </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence mode="popLayout">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="space-y-8"
        >
          {posts.map((post) => {
            if (post.type === 'SYSTEM_PROMPT') {
              return (
                <motion.div 
                  key={post.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="p-8 bg-white border border-[#292828]/5 rounded-[8px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 h-full w-1/3 bg-slate-50 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-1000" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 bg-red-50 text-[#E53935] rounded-[8px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Activity size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#292828] uppercase tracking-tighter mb-1.5 leading-none">{post.title}</h3>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{post.content}</p>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(229,57,51,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAction?.(post)}
                    className="h-12 px-8 bg-gradient-to-r from-[#292828] to-black text-white rounded-[8px] text-[11px] font-black uppercase tracking-widest transition-all shadow-xl relative z-10 group/btn overflow-hidden shrink-0"
                  >
                    <div className="absolute inset-0 bg-[#E53935] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                       {post.cta || "Boost Reach"}
                       <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </motion.div>
              );
            }
            return (
              <motion.div
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <UniversalFeedCard 
                  post={post} 
                  currentUserId={currentUserId}
                  onAction={() => onAction?.(post)}
                  onEdit={() => onEdit?.(post)}
                  onDelete={() => onDelete?.(post)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
