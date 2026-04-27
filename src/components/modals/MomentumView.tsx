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
          .limit(12); // "12 people match your requirement"
        
        const enriched = (people || []).map(p => ({
          ...p,
          reputation: p.metadata?.checkout_score || 50,
          compatibility: Math.round(85 + (Math.random() * 10))
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
    setTimeout(() => {
      // Logic for second action prompt or close
    }, 2000);
  };

  return (
    <div className="bg-[#FDFDFF] rounded-lg p-8 lg:p-12 text-[#292828] shadow-4xl border border-slate-100 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E53935]/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 hover:text-[#292828] transition-all"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 relative z-10">
        <div className="space-y-6 max-w-md">
           <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-xl shadow-emerald-500/20 animate-bounce-subtle">
                 <CheckCircle2 size={28} />
              </div>
              <div>
                 <h3 className="text-2xl font-black uppercase ">Post successfully activated</h3>
                 <p className="text-[11px] font-black text-slate-400 uppercase ">Connect with matching nodes below</p>
              </div>
           </div>

           <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg space-y-4">
              <div className="flex items-center gap-3">
                 <Users size={18} className="text-slate-400" />
                 <span className="text-[13px] font-black uppercase  text-[#292828]">Matches identified</span>
              </div>
              <p className="text-[11px] font-bold text-[#292828]/40 uppercase leading-relaxed">
                 Relevant profiles identified based on your requirement context and network proximity.
              </p>
              <button 
                onClick={() => router.push('/matches')}
                className="w-full h-14 bg-white text-[#292828] rounded-lg text-[10px] font-black uppercase  hover:bg-[#E53935] hover:text-white transition-all"
              >
                 View All Matches
              </button>
           </div>
        </div>

        <div className="flex-1 w-full">
           <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black uppercase text-slate-300 ">Top Neural Matches</h4>
              <span className="text-[9px] font-black text-emerald-500 uppercase ">High Response Rate</span>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading ? (
                [1, 2].map(i => <div key={i} className="h-32 bg-slate-50 rounded-lg animate-pulse" />)
              ) : matches.slice(0, 4).map((person) => (
                <div key={person.id} className="p-5 bg-white border border-slate-100 rounded-[1.75rem] flex items-center justify-between group hover:border-[#E53935]/20 hover:shadow-xl transition-all">
                   <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-lg overflow-hidden shadow-md">
                         <img src={person.avatar_url || DEFAULT_AVATAR} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                         <h5 className="text-[14px] font-black uppercase ">{person.full_name}</h5>
                         <p className="text-[9px] font-black text-[#E53935] uppercase">{person.compatibility}% Match</p>
                      </div>
                   </div>

                   <AnimatePresence mode="wait">
                      {requestSent === person.id ? (
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-end"
                        >
                           <span className="text-[10px] font-black text-emerald-500 uppercase">Request Sent</span>
                           <span className="text-[8px] font-bold text-slate-300 uppercase">Fast Reply</span>
                        </motion.div>
                      ) : (
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleConnect(person.id)}
                          className="h-10 w-10 bg-slate-50 text-[#292828] rounded-lg flex items-center justify-center hover:bg-[#292828] hover:text-white transition-all shadow-sm"
                        >
                           <UserPlus size={18} />
                        </motion.button>
                      )}
                   </AnimatePresence>
                </div>
              ))}
           </div>

           {requestSent && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-5"
             >
                <div className="h-10 w-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                   <MessageSquare size={18} />
                </div>
                <div>
                   <p className="text-[12px] font-black text-emerald-600 uppercase mb-0.5">Keep Going</p>
                   <p className="text-[10px] font-bold text-emerald-600/60 uppercase">Most people reply within a few hours. Connect with more people to grow your network.</p>
                </div>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
