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
    <div className="bg-[#111111] rounded-[2rem] sm:rounded-[3rem] p-6 md:p-10 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden max-w-5xl mx-[5%] md:mx-auto w-[90%] md:w-full font-outfit">
      {/* Cinematic Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-[#E53935]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-emerald-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      </div>
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 h-12 w-12 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-[60] group border border-white/10 shadow-2xl"
      >
        <X size={22} className="group-hover:rotate-90 transition-transform" />
      </button>

      <div className="flex flex-col gap-10 lg:gap-14 relative z-10">
        {/* 1. SUCCESS HERO */}
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
           <motion.div 
             initial={{ scale: 0, rotate: -45 }}
             animate={{ scale: 1, rotate: 0 }}
             transition={{ type: "spring", damping: 15 }}
             className="h-20 w-20 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] relative"
           >
              <CheckCircle2 size={36} strokeWidth={2.5} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-400 blur-2xl -z-10 rounded-full" 
              />
           </motion.div>
           
           <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                 <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Momentum Active
                 </span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">
                 {type} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">LIVE</span>
              </h3>
              <p className="text-[11px] md:text-[12px] font-bold text-white/40 uppercase tracking-[0.4em] max-w-md mx-auto leading-relaxed">
                 Our neural engine is surfacing potential matches
              </p>
           </div>
        </div>

        {/* 2. MATCH DISCOVERY */}
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-6">
              <div className="text-center md:text-left space-y-2">
                 <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/20">Discovery Pipeline</h4>
                 <p className="text-[16px] md:text-[18px] font-black uppercase italic tracking-tight text-white/80">
                    High-Probability <span className="text-[#E53935]">Collaborators</span>
                 </p>
              </div>
              
              <button 
                onClick={() => router.push('/matches')}
                className="flex items-center gap-4 group px-8 h-14 bg-white text-black rounded-2xl hover:bg-[#E53935] hover:text-white transition-all shadow-2xl active:scale-95 whitespace-nowrap"
              >
                 <span className="text-[11px] font-black uppercase tracking-widest">Explore All</span>
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </button>
           </div>

           {/* 3. THE CARDS */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              {isLoading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)
              ) : matches.slice(0, 4).map((person, idx) => (
                <motion.div 
                  key={person.id}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-5 md:p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 overflow-hidden relative"
                >
                   <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles size={16} className="text-[#E53935]" />
                   </div>

                   <div className="flex items-center gap-5 relative z-10">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/5 overflow-hidden shadow-2xl shrink-0 border border-white/10 group-hover:rotate-3 transition-transform duration-500">
                         <img src={person.avatar_url || DEFAULT_AVATAR} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                      </div>
                      <div className="text-left space-y-1.5">
                         <h5 className="text-[16px] md:text-[18px] font-black uppercase tracking-tight leading-none group-hover:text-emerald-400 transition-colors line-clamp-1">{person.full_name}</h5>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">{person.compatibility}% Match</span>
                            <div className="h-1 w-1 bg-white/20 rounded-full" />
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{person.role || "Expert"}</span>
                         </div>
                         <div className="flex gap-2 pt-1">
                            {(person.skills?.slice(0, 2) || ["Domain", "Pro"]).map((s: string) => (
                               <span key={s} className="px-2 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase text-white/40 border border-white/5">{s}</span>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="relative z-10 ml-4">
                      <AnimatePresence mode="wait">
                         {requestSent === person.id ? (
                           <motion.div 
                             initial={{ scale: 0, rotate: -90 }} 
                             animate={{ scale: 1, rotate: 0 }} 
                             className="h-12 w-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20"
                           >
                              <CheckCircle2 size={24} strokeWidth={3} />
                           </motion.div>
                         ) : (
                           <motion.button 
                             whileHover={{ scale: 1.1, rotate: 5 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => handleConnect(person.id)}
                             className="h-12 w-12 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-[#E53935] transition-all border border-white/10 group/btn shadow-xl"
                           >
                              <UserPlus size={20} strokeWidth={2.5} />
                           </motion.button>
                         )}
                      </AnimatePresence>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* 4. PREMIUM FOOTER */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="mt-6 p-8 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E53935]/5 blur-[100px] -z-10" />
              
              <div className="h-16 w-16 bg-white/10 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#E53935] to-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <TrendingUp size={30} className="relative z-10" />
              </div>

              <div className="text-center md:text-left space-y-2 flex-1">
                 <p className="text-[20px] font-black text-white uppercase tracking-tight italic">Momentum Multiplier <span className="text-[#E53935]">+85%</span></p>
                 <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest leading-relaxed max-w-xl">
                    High-density discovery active. Your network visibility has reached peak performance for the next 24 hours.
                 </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full md:w-auto h-14 px-10 bg-white/10 border border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95 whitespace-nowrap"
              >
                 Finish
              </button>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
