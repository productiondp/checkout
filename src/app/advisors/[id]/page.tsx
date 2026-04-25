"use client";

export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Calendar, 
  Clock,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Award,
  ChevronRight,
  Sparkles,
  Target,
  X,
  Lock,
  CheckCircle2,
  MessageSquare,
  Info
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { ConnectButton } from "@/components/connection/ConnectButton";

export default function AdvisorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [advisor, setAdvisor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const advisorId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    async function fetchAdvisor() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', advisorId)
        .single();

      if (data) {
        setAdvisor({
          ...data,
          name: data.full_name || "Elite Advisor",
          role: data.headline || "Verified Professional",
          industry: data.city || "Kerala Hub",
          avatar: data.avatar_url || DEFAULT_AVATAR,
          matchScore: 94,
          experience: data.experience_years ? `${data.experience_years}+ Years` : "10+ Years",
          expertise: data.skills || data.expertise || ["Strategy", "Growth", "Scale"],
          highlights: ["Neural match priority", "Strategic growth path", "Verified authority"],
          focus: ["Scaling Operations", "Market Expansion"],
          availability: "Available"
        });
      }
      setIsLoading(false);
    }
    if (advisorId) fetchAdvisor();
  }, [advisorId]);

  if (isLoading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <div className="h-12 w-12 border-4 border-slate-50 border-t-[#E53935] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Syncing Advisor Profile...</p>
    </div>
  );

  if (!advisor) return (
    <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center gap-6">
      <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Advisor Not Found</h2>
      <button onClick={() => router.push('/advisors')} className="text-[#E53935] text-[10px] font-black uppercase tracking-widest border-b border-[#E53935]">Back to Advisors</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-100 pt-10 pb-20 px-6 lg:px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E53935]/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => router.push('/advisors')}
            className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-12 hover:text-[#E53935] transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Advisors
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-10 lg:gap-20">
            <div className="h-48 w-48 sm:h-64 sm:w-64 rounded-[3rem] sm:rounded-[4rem] overflow-hidden border-[6px] sm:border-[8px] border-slate-50 shadow-4xl shrink-0 rotate-3 transition-transform hover:rotate-0 duration-700">
               <img src={advisor.avatar} className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0" alt="" />
            </div>

            <div className="flex-1">
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="px-5 py-2 bg-[#E53935] text-white text-[10px] font-black uppercase rounded-xl shadow-2xl tracking-[0.2em] flex items-center gap-2">
                     <ShieldCheck size={14} /> Verified Advisor
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-[#292828] uppercase">
                     <Sparkles size={14} className="text-[#E53935]" /> {advisor.matchScore}% Match
                  </div>
               </div>
               <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#292828] uppercase tracking-tighter leading-[0.85] mb-8">{advisor.name}</h1>
               <p className="text-lg sm:text-xl font-bold text-slate-400 uppercase tracking-widest">{advisor.role} @ {advisor.industry}</p>
            </div>

            <div className="flex flex-col gap-4">
               <ConnectButton 
                 userId={advisor.id} 
                 userName={advisor.name} 
                 label="Connect" 
                 className="h-20 px-12 !rounded-[2rem] text-xs !bg-[#292828] !text-white hover:!bg-[#E53935] shadow-4xl transition-all" 
               />
              <div className="flex items-center justify-center gap-3 text-slate-300">
                 <Clock size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{advisor.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-8 flex items-center gap-3">
                 <BrainCircuit size={18} /> Professional Context
              </h3>
              <p className="text-2xl lg:text-3xl font-bold text-[#292828] leading-relaxed italic">
                 "{advisor.bio || 'Strategic scaling and growth advisory for high-impact ecosystems.'}"
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
               <div>
                  <h4 className="text-[11px] font-black uppercase text-[#292828]/40 tracking-widest mb-8">Expertise</h4>
                  <div className="flex flex-wrap gap-3">
                     {advisor.expertise?.map((tag: string) => (
                       <span key={tag} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase text-[#292828] shadow-sm">{tag}</span>
                     ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-[11px] font-black uppercase text-[#292828]/40 tracking-widest mb-8">Neural Highights</h4>
                  <div className="space-y-4">
                     {advisor.highlights?.map((h: string, i: number) => (
                       <div key={i} className="flex items-center gap-4 text-[#292828] font-bold text-sm">
                          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {h}
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            <section className="bg-[#292828] rounded-[3.5rem] p-12 lg:p-16 text-white relative overflow-hidden group shadow-2xl">
               <Zap size={200} className="absolute -right-20 -bottom-20 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[5s]" />
               <div className="relative z-10">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E53935] mb-10">Strategic Focus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     {advisor.focus?.map((f: string, i: number) => (
                       <div key={i} className="flex items-start gap-5">
                          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                             <Award size={20} className="text-[#E53935]" />
                          </div>
                          <div>
                             <p className="text-lg font-black uppercase tracking-tight leading-tight mb-2">{f}</p>
                             <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Target Area</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-10">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-[11px] font-black uppercase text-[#292828] tracking-widest mb-8 flex items-center gap-2">
                   <TrendingUp size={16} className="text-[#E53935]" /> Matching
                </h3>
                <div className="space-y-8">
                   <div className="flex items-end justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Ecosystem Relevance</p>
                      <p className="text-2xl font-black text-[#292828]">98%</p>
                   </div>
                   <div className="flex items-end justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Neural Fit</p>
                      <p className="text-2xl font-black text-[#292828]">94%</p>
                   </div>
                   <div className="flex items-end justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Response Rate</p>
                      <p className="text-2xl font-black text-emerald-500">100%</p>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                <h3 className="text-[11px] font-black uppercase text-[#292828] tracking-widest mb-8 flex items-center gap-2">
                   <MessageSquare size={16} className="text-[#E53935]" /> Advisory Rules
                </h3>
                <ul className="space-y-4">
                   <li className="text-xs font-bold text-slate-400 uppercase leading-relaxed flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#E53935] mt-1 shrink-0" />
                      Neural verification required for deal-flow.
                   </li>
                   <li className="text-xs font-bold text-slate-400 uppercase leading-relaxed flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#E53935] mt-1 shrink-0" />
                      Zero-noise interaction policy.
                   </li>
                </ul>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
