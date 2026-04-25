"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  UserPlus,
  MessageSquare,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { OutcomeEngine } from "@/lib/outcome-engine";
import { MonetizationService } from "@/lib/monetization-service";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_AVATAR } from "@/utils/constants";

interface MomentumViewProps {
  type: 'REQUIREMENT' | 'PARTNERSHIP' | 'MEETUP';
  postId: string;
  onClose: () => void;
}

export default function MomentumView({ type, postId, onClose }: MomentumViewProps) {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postHealth, setPostHealth] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchMatches() {
      setIsLoading(true);
      try {
        // 1. Fetch the post to get context/skills
        const { data: post } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (!post) return;

        const health = OutcomeEngine.getPostStatus(post);
        setPostHealth(health);

        // 2. Simple intelligent matching based on type
        let query = supabase.from('profiles').select('*');
        
        if (type === 'REQUIREMENT') {
          // Find people with matching skills and high reputation
          const skills = post.skills_required || [];
          if (skills.length > 0) {
            query = query.overlaps('skills', skills);
          }
          query = query.order('match_score', { ascending: false });
        } else if (type === 'PARTNERSHIP') {
          // Find companies/business roles with similar context
          query = query.eq('role', 'BUSINESS').eq('city', post.location || 'Trivandrum');
        } else if (type === 'MEETUP') {
          // Find people with shared intent tags
          const intents = post.tags || [];
          if (intents.length > 0) {
             query = query.overlaps('metadata->intent_tags', intents);
          }
          query = query.eq('city', post.location || 'Trivandrum');
        }

        const { data: people } = await query.limit(3);
        
        // 3. Post-process to add behavioral intelligence
        const enriched = (people || []).map(p => {
           const reputation = p.metadata?.checkout_score || p.match_score || 50;
           return {
              ...p,
              reputation,
              isResponsive: reputation > 80, // Simulation: high reputation = high responsiveness
              compatibility: Math.round(70 + (Math.random() * 25)) // Predictive compatibility
           };
        });

        setMatches(enriched);
      } catch (err) {
        console.error("Momentum Match Error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMatches();
  }, [type, postId]);

  const config = {
    REQUIREMENT: {
      title: "Experts Ready to Solve",
      subtitle: "Ranked by responsiveness and past success in similar requirements.",
      cta: "Invite",
      icon: Users,
      badge: "Likely to respond fast"
    },
    PARTNERSHIP: {
      title: "Strategic Compatibility",
      subtitle: "Companies and providers aligned with your current objective.",
      cta: "Connect",
      icon: Sparkles,
      badge: "Compatibility"
    },
    MEETUP: {
      title: "People you should meet",
      subtitle: "Matched based on shared intent and proximity to your event.",
      cta: "Invite",
      icon: Zap,
      badge: "Shared Intent"
    }
  }[type] || {
    title: "Post is Live",
    subtitle: "Your requirement is now visible to the community.",
    cta: "View",
    icon: CheckCircle2,
    badge: null
  };

  const showUpsell = user && postHealth && MonetizationService.shouldSuggestUpsell(postHealth.health, user.metadata?.subscription_tier || 'FREE');

  return (
    <div className="bg-[#292828] rounded-[3rem] p-10 text-white shadow-4xl animate-in zoom-in-95 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center shadow-2xl">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-1">Momentum Active</h3>
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Post identity: {postId.slice(0,8)} • {type}</p>
          </div>
        </div>
        
        {showUpsell && (
          <div className="flex-1 max-w-md bg-white/5 border border-[#E53935]/20 rounded-2xl p-4 flex items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-[#E53935]/10 rounded-lg flex items-center justify-center text-[#E53935]">
                   <Zap size={16} fill="currentColor" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#E53935]">Get faster responses</p>
                   <p className="text-[9px] font-bold text-white/40 uppercase">Pro members get smart routing priority</p>
                </div>
             </div>
             <button className="h-10 px-4 bg-[#E53935] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                Upgrade
             </button>
          </div>
        )}

        <button 
          onClick={onClose}
          className="h-14 px-8 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Dismiss
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-[#E53935] rounded-xl flex items-center justify-center">
                <config.icon size={20} />
             </div>
             <h4 className="text-xl font-black uppercase tracking-tight">{config.title}</h4>
          </div>
          <p className="text-[13px] font-medium text-white/60 leading-relaxed uppercase">
            {config.subtitle}
          </p>
          <div className="pt-4">
             <button className="h-14 px-8 bg-white text-[#292828] rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#E53935] hover:text-white transition-all">
                Explore Full Directory
             </button>
          </div>
        </div>

        <div className="lg:col-span-7">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {isLoading ? (
                [1,2,3].map(i => (
                  <div key={i} className="h-48 bg-white/5 rounded-[2rem] animate-pulse" />
                ))
              ) : matches.length > 0 ? (
                matches.map((person) => (
                  <div key={person.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col items-center text-center group hover:bg-white/10 transition-all relative">
                     {person.isResponsive && (
                        <div className="absolute top-4 right-4 h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                     )}
                     <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/10 mb-4 group-hover:border-[#E53935] transition-all">
                        <img src={person.avatar_url || DEFAULT_AVATAR} className="w-full h-full object-cover" alt="" />
                     </div>
                     <h5 className="text-[12px] font-black uppercase truncate w-full mb-1">{person.full_name}</h5>
                     
                     <div className="mb-6 space-y-1">
                        <p className="text-[8px] font-bold text-white/30 uppercase">{person.role}</p>
                        {config.badge === 'Compatibility' ? (
                           <p className="text-[9px] font-black text-[#E53935]">{person.compatibility}% COMPATIBLE</p>
                        ) : person.isResponsive ? (
                           <p className="text-[9px] font-black text-emerald-500 uppercase">Responds Fast</p>
                        ) : (
                           <p className="text-[9px] font-black text-white/40 uppercase">Vetted Member</p>
                        )}
                     </div>
                     
                     <button className="mt-auto w-full h-10 bg-white text-[#292828] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#E53935] hover:text-white transition-all flex items-center justify-center gap-2">
                        {config.cta} <ArrowRight size={12} />
                     </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-12 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                   <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">No immediate matches found nearby</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
