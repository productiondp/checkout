"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  UserPlus,
  MessageSquare,
  Zap,
  TrendingUp,
  Award,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface MomentumViewProps {
  type: 'REQUIREMENT' | 'PARTNERSHIP' | 'MEETUP';
  postId: string;
  onClose: () => void;
}

export default function MomentumView({ type, postId, onClose }: MomentumViewProps) {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestSent, setRequestSent] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchMatches() {
      setIsLoading(true);
      try {
        const { data: people } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user?.id)
          .limit(12);
        
        const enriched = (people || []).map(p => ({
          ...p,
          reputation: p.metadata?.checkout_score || 50,
          compatibility: Math.round(85 + (Math.random() * 10)),
          skills: p.skills || ["Strategy", "Growth", "Product"]
        }));

        setMatches(enriched);
      } catch (err) {
        console.error("Momentum Match Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMatches();
  }, [postId]);

  const handleConnect = (personId: string) => {
    setRequestSent(personId);
  };

  return (
    <div className="bg-[#FDFDFF] rounded-[2rem] sm:rounded-[3rem] p-5 md:p-8 lg:p-10 text-[#292828] shadow-4xl border border-slate-100 relative overflow-hidden max-w-5xl mx-[5%] md:mx-auto w-[90%] md:w-full">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#E53935] to-transparent opacity-30" />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#E53935]/5 blur-[100px] rounded-full" />
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 h-12 w-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-black hover:bg-white transition-all z-[60] group shadow-lg border border-black/[0.03]"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform" />
      </button>

      <div className="flex flex-col gap-8 lg:gap-10 relative z-10">
        {/* 1. SUCCESS BANNER (TOP HERO) */}
        <div className="flex flex-col items-center text-center space-y-4 py-1">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="h-14 w-14 md:h-16 md:w-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative"
           >
              <CheckCircle2 size={28} strokeWidth={3} />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-[#E53935] rounded-lg flex items-center justify-center text-white shadow-lg">
                 <Zap size={12} fill="white" />
              </div>
           </motion.div>
           
           <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight font-outfit leading-none">
                 Post <span className="text-emerald-500 italic">Published</span>
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
                 Our matching engine is scanning the network
              </p>
           </div>
        </div>

        {/* 2. DISCOVERY BOARD HEADER */}
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-100 pb-5 gap-4">
              <div className="space-y-2 text-left">
                 <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#292828]">Strategic Matches</h4>
                 </div>
                 <p className="text-[10px] font-medium text-slate-400 uppercase leading-relaxed max-w-lg">
                    Recommended connections identified based on your profile and industry.
                 </p>
              </div>
              
              <button 
                onClick={() => router.push('/matches')}
                className="flex items-center gap-3 group px-6 py-3.5 bg-[#292828] text-white rounded-xl hover:bg-[#E53935] transition-all shadow-xl active:scale-95 whitespace-nowrap"
              >
                 <span className="text-[9px] font-black uppercase tracking-widest">Full Network</span>
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>

           {/* 3. THE MATCH GALLERY (PREMIUM GRID) */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
              {isLoading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-50 rounded-2xl animate-pulse" />)
              ) : matches.slice(0, 4).map((person) => (
                <div key={person.id} className="p-4 md:p-6 bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] flex flex-col sm:flex-row items-center justify-between group hover:border-[#E53935] hover:shadow-xl transition-all duration-300 relative">
                   
                   <div className="flex items-center gap-5 w-full sm:w-auto relative z-10 mb-4 sm:mb-0">
                      <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-slate-100 overflow-hidden shadow-sm shrink-0 border-2 border-white">
                         <img src={person.avatar_url || DEFAULT_AVATAR} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                      </div>
                      <div className="text-left space-y-1">
                         <h5 className="text-[14px] md:text-[16px] font-black uppercase tracking-tight leading-none group-hover:text-[#E53935] transition-colors">{person.full_name}</h5>
                         <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-emerald-500 uppercase">{person.compatibility}% Match</span>
                            <span className="text-[8px] font-bold text-slate-300 uppercase">{person.role || "Expert"}</span>
                         </div>
                         <div className="flex gap-1 pt-1">
                            {(person.skills?.slice(0, 2) || ["Domain", "Pro"]).map((s: string) => (
                               <span key={s} className="px-1.5 py-0.5 bg-slate-50 rounded text-[8px] font-black uppercase text-slate-400">{s}</span>
                            ))}
                         </div>
                      </div>
                   </div>

                   <AnimatePresence mode="wait">
                      {requestSent === person.id ? (
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }} 
                          className="flex flex-col items-center sm:items-end gap-0.5 px-3"
                        >
                           <div className="h-8 w-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                              <CheckCircle2 size={20} />
                           </div>
                           <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                        </motion.div>
                      ) : (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleConnect(person.id)}
                          className="w-full sm:w-auto h-12 px-6 bg-slate-50 text-[#292828] rounded-xl flex items-center justify-center gap-3 hover:bg-[#292828] hover:text-white transition-all group/btn shadow-sm"
                        >
                           <span className="text-[9px] font-black uppercase tracking-widest">Connect</span>
                           <UserPlus size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>
                      )}
                   </AnimatePresence>
                </div>
              ))}
           </div>

           {/* 4. MOMENTUM FOOTER (NUDGE) */}
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-6 bg-gradient-to-br from-white to-slate-50/50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center gap-6 shadow-sm"
           >
              <div className="h-14 w-14 bg-[#292828] text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[#E53935] opacity-0 group-hover:opacity-100 transition-opacity" />
                 <TrendingUp size={24} className="relative z-10" />
              </div>
              <div className="text-center md:text-left space-y-1">
                 <p className="text-[15px] font-black text-[#292828] uppercase tracking-tight">Grow Your Network</p>
                 <p className="text-[10px] font-medium text-slate-400 uppercase leading-relaxed max-w-xl italic">
                    The best collaborations start with meaningful connections. Keep exploring to find the perfect partners.
                 </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full md:w-auto h-12 px-8 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#E53935] hover:text-[#E53935] transition-all shadow-sm active:scale-95 whitespace-nowrap ml-auto"
              >
                 Done
              </button>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
