"use client";

import React from "react";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  MessageSquare,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_ADVISORS } from "@/data/advisors";
import { motion } from "framer-motion";

export default function AdvisorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const advisorId = params.id as string;
  
  const [advisor, setAdvisor] = React.useState<any>(null);
  const [meetups, setMeetups] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop";

  React.useEffect(() => {
    if (!advisorId) return;

    let isMounted = true;
    const fetchData = async (forceRefresh = false) => {
      // 1. Check client-side cache first for instant load
      const { sharedCache } = await import("@/utils/shared-cache");
      const cached = sharedCache.getStale<{ advisor: any, meetups: any[] }>(`advisor_${advisorId}`);
      
      if (cached.data && !forceRefresh) {
        setAdvisor(cached.data.advisor);
        setMeetups(cached.data.meetups);
        setLoading(false);
        if (!cached.isStale) return;
      } else {
        setLoading(true);
      }

      try {
        // 2. FETCH FROM SERVER CACHE API (V1.17)
        const response = await fetch(`/api/advisors/${advisorId}`);
        if (!response.ok) throw new Error("API call failed");
        
        const data = await response.json();

        if (!isMounted) return;

        // 3. NORMALIZE & MAP (Reliability Layer)
        const rawAdvisor = data.advisor;
        const normalizedAdvisor = {
          ...rawAdvisor,
          name: rawAdvisor.full_name || rawAdvisor.name || "Advisor",
          avatar: rawAdvisor.avatar_url || rawAdvisor.avatar || FALLBACK_AVATAR,
          score: Number(rawAdvisor.advisor_score) || 0,
          role: rawAdvisor.professional_role || rawAdvisor.role || "Advisor",
          industry: rawAdvisor.industry || "Tech",
          bio: rawAdvisor.bio || "I help startups scale their operations and build high-performance teams."
        };

        const normalizedMeetups = data.meetups || [];

        // 4. UPDATE CLIENT CACHE AND STATE
        sharedCache.set(`advisor_${advisorId}`, { advisor: normalizedAdvisor, meetups: normalizedMeetups });
        setAdvisor(normalizedAdvisor);
        setMeetups(normalizedMeetups);

      } catch (err) {
        console.error("Advisor reliability error:", err);
        if (!cached.data) setError("Failed to load advisor safely");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // 🧠 V1.20 SERVER-COORDINATED REAL-TIME
    let revalidationTimeout: NodeJS.Timeout;
    let lastRefetchTime = 0;

    const debouncedRevalidate = async (force = false) => {
      if (revalidationTimeout) clearTimeout(revalidationTimeout);
      
      revalidationTimeout = setTimeout(async () => {
        if (document.visibilityState !== 'visible') return;
        const now = Date.now();
        if (now - lastRefetchTime < 1000 && !force) return;
        
        lastRefetchTime = now;
        await fetch('/api/cache/purge', { 
          method: 'POST', 
          body: JSON.stringify({ key: `advisor:${advisorId}` }) 
        });
        fetchData(true); 
      }, 500);
    };

    const setupRealtime = async () => {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      // Listen to the CLEAN BROADCAST channel instead of raw DB changes
      const channel = supabase
        .channel(`advisor_events:${advisorId}`)
        .on(
          'broadcast',
          { event: 'sync' },
          (payload) => {
            const { type, record_id, new_count } = payload.payload;
            console.log("Coordinated Event Received:", type);

            // 1. TRUST SERVER EVENT TYPES
            switch (type) {
              case 'ADVISOR_UPDATED':
              case 'TRUST_SCORE_CHANGED':
              case 'MEETUP_UPDATED':
                debouncedRevalidate(true);
                break;
              
              case 'PARTICIPANT_JOINED':
                // 2. OPTIMISTIC LOCAL PATCH
                if (record_id && typeof new_count === 'number') {
                  setMeetups(prev => prev.map(m => m.id === record_id ? { ...m, participant_count: new_count } : m));
                }
                debouncedRevalidate();
                break;
            }
          }
        )
        .subscribe();

      return channel;
    };

    const channelPromise = setupRealtime();

    return () => { 
      isMounted = false; 
      channelPromise.then(channel => channel.unsubscribe());
    };
  }, [advisorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-10">
        <div className="flex flex-col items-center gap-4">
          <Zap className="text-[#E53935] animate-pulse" size={48} />
          <p className="text-xs font-black uppercase text-slate-300">Loading advisor...</p>
        </div>
      </div>
    );
  }

  if (error || !advisor) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-10">
        <div className="flex flex-col items-center gap-6 text-center max-w-xs">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
            <Users size={32} />
          </div>
          <h2 className="text-xl font-black text-[#1D1D1F] uppercase">{error || "Advisor not found"}</h2>
          <button 
            onClick={() => router.push('/advisors')}
            className="h-12 px-8 bg-black text-white rounded-xl text-[11px] font-black uppercase shadow-lg"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-32">
      {/* 1. HERO (IDENTITY) */}
      <header className="bg-white px-6 pt-12 pb-16 lg:px-10 border-b border-slate-50 relative overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-300 font-black uppercase text-[10px] mb-8 hover:text-black transition-all"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-6 mb-8">
            <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-xl shrink-0 bg-slate-100">
               <img src={advisor.avatar} className="w-full h-full object-cover" alt={advisor.name} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-black text-[#1D1D1F] uppercase leading-none">{advisor.name}</h1>
                {(advisor.role?.toLowerCase().includes('advisor') || advisor.is_advisor) && <ShieldCheck size={18} className="text-emerald-500" />}
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{advisor.role} @ {advisor.industry}</p>
            </div>
          </div>

          <p className="text-xl font-bold text-[#1D1D1F] italic mb-10 leading-relaxed">
            "{advisor.bio}"
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="h-16 px-10 bg-[#0A0A0A] text-white rounded-2xl font-black text-sm uppercase shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
              <Zap size={18} fill="currentColor" />
              Join Meetup
            </button>
            <button className="h-16 px-10 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-sm uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
              <MessageSquare size={18} />
              Message
            </button>
          </div>
        </div>
      </header>

      {/* 2. TRUST BLOCK (MOST IMPORTANT) */}
      <section className="px-6 py-12 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-[10px] font-black uppercase text-[#E53935] mb-6 flex items-center gap-2">
            <TrendingUp size={14} /> Trust Signals
          </h3>
          
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-end gap-3 mb-8">
              <span className="text-6xl font-black text-[#1D1D1F] leading-none">
                {advisor.score.toFixed(1)}
              </span>
              <div className="pb-1">
                <p className="text-[10px] font-black uppercase text-amber-500 mb-1">Trust Score</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Sparkles key={i} size={12} className={cn(i <= Math.round(advisor.score) ? "text-amber-400 fill-amber-400" : "text-slate-100")} />
                  ))}
                </div>
              </div>
              <div className="ml-auto mb-1">
                 {advisor.score >= 4.0 ? (
                   <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 animate-pulse">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active this week
                   </div>
                 ) : (
                   <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5">
                      New Advisor
                   </div>
                 )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-xl font-black text-[#1D1D1F] mb-1">{advisor.sessions_count || 0}</p>
                <p className="text-[9px] font-black uppercase text-slate-400">Meetups</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-xl font-black text-[#1D1D1F] mb-1">{advisor.collaborations_count || 0}</p>
                <p className="text-[9px] font-black uppercase text-slate-400">Partners</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-xl font-black text-emerald-500 mb-1">{advisor.helpfulness_rating || 90}%</p>
                <p className="text-[9px] font-black uppercase text-slate-400">Helpful</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENT OUTCOMES (PROOF) */}
      <section className="px-6 py-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-[10px] font-black uppercase text-slate-300 mb-6">Recent Proof</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-5 bg-white border border-slate-50 rounded-2xl">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-[#1D1D1F]">
                {advisor.last_outcome_preview || `Last session: ${advisor.collaborations_count || 3} successful partnerships started`}
              </p>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white border border-slate-50 rounded-2xl">
              <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Zap size={18} className="text-blue-500" />
              </div>
              <p className="text-sm font-bold text-[#1D1D1F]">
                {advisor.marketing_proof || `Helped ${advisor.users_helped || 5} people with growth strategy last month`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UPCOMING MEETUPS */}
      <section className="px-6 py-12 lg:px-10 bg-slate-50/50">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-[10px] font-black uppercase text-[#1D1D1F] mb-8 flex items-center justify-between">
            <span>Upcoming Meetups</span>
            <span className="text-slate-300">{meetups.length} sessions available</span>
          </h3>
          
          <div className="space-y-4">
            {meetups.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-xs font-black uppercase text-slate-300">No upcoming sessions</p>
              </div>
            ) : (
              meetups.map(meetup => (
                <div key={meetup.id} className="group p-6 bg-white border border-slate-100 rounded-3xl hover:border-black transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-lg font-black text-[#1D1D1F] uppercase mb-2 group-hover:text-[#E53935] transition-colors">{meetup.title}</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold uppercase">{meetup.metadata?.timeline || 'Upcoming'}</span>
                      </div>
                      <div className="px-2 py-0.5 bg-[#E53935]/10 text-[#E53935] rounded-full text-[9px] font-black uppercase">
                        {meetup.max_slots - (meetup.participant_count || 0)} seats left
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/meetups/${meetup.id}`)}
                    className="h-12 px-8 bg-black text-white rounded-xl text-[11px] font-black uppercase shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-all"
                  >
                    Join Meetup
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. SKILLS / FOCUS */}
      <section className="px-6 py-12 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-[10px] font-black uppercase text-slate-300 mb-6 italic">Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {(advisor.expertise || advisor.skills || ['Growth', 'Strategy']).map((skill: string) => (
              <span key={skill} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase text-slate-400">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ACTION BAR (STICKY) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-[100] flex items-center justify-center lg:px-10">
        <div className="max-w-3xl w-full">
          <button className="w-full h-16 bg-[#0A0A0A] text-white rounded-2xl font-black text-sm uppercase shadow-2xl shadow-black/20 hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 group">
            <Zap size={20} fill="currentColor" className="group-hover:animate-pulse" />
            Join Next Meetup
            <ArrowRight size={18} className="ml-2 opacity-40 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
