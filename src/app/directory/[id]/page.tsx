"use client";

export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  Globe, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Target,
  Zap,
  Info,
  Users,
  Briefcase
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { ConnectButton } from "@/components/connection/ConnectButton";

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const businessId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    async function fetchBusiness() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', businessId)
        .single();

      if (data) {
        setBusiness({
          ...data,
          name: data.full_name || "Professional Profile",
          logo: data.avatar_url || DEFAULT_AVATAR,
          category: data.role || "Ecosystem Member",
          location: data.city || data.location || "Kerala Hub",
          description: data.bio || "Member of the professional ecosystem.",
          services: data.skills || ["Consulting", "Strategy"],
          expertise: data.skills || ["Growth", "Scale"],
          matchScore: 94
        });
      }
      setIsLoading(false);
    }
    if (businessId) fetchBusiness();
  }, [businessId]);

  if (isLoading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <div className="h-12 w-12 border-4 border-slate-50 border-t-[#E53935] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Syncing Ecosystem Profile...</p>
    </div>
  );

  if (!business) return (
    <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center gap-6">
      <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Profile Not Found</h2>
      <button onClick={() => router.push('/directory')} className="text-[#E53935] text-[10px] font-black uppercase tracking-widest border-b border-[#E53935]">Back to Directory</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-100 pt-10 pb-20 px-6 lg:px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E53935]/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => router.push('/directory')}
            className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-12 hover:text-[#E53935] transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Directory
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-12 lg:gap-20">
            <div className="h-48 w-48 sm:h-64 sm:w-64 rounded-[3.5rem] overflow-hidden border-[8px] border-slate-50 shadow-4xl shrink-0 bg-white flex items-center justify-center p-4">
               <img src={business.logo} className="w-full h-full object-cover rounded-[2.5rem]" alt="" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <CheckCircle2 size={14} fill="currentColor" className="text-white" /> Verified Member
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-[#292828] uppercase">
                    <Sparkles size={14} className="text-[#E53935]" /> {business.matchScore}% Match
                 </div>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#292828] uppercase tracking-tighter leading-[0.9] mb-8">{business.name}</h1>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                 <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">{business.category}</p>
                 <span className="hidden sm:block h-1 w-1 bg-slate-200 rounded-full" />
                 <div className="flex items-center gap-3 text-[#292828]">
                    <MapPin size={18} className="text-[#E53935]" />
                    <span className="text-lg font-bold uppercase tracking-tight">{business.location}</span>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full sm:w-auto">
               <ConnectButton 
                  userId={business.id} 
                  userName={business.name} 
                  label="Connect" 
                  className="h-20 px-12 !bg-[#292828] !text-white !rounded-[2rem] !font-black !text-xs !uppercase !tracking-[0.2em] !shadow-4xl hover:!bg-[#E53935] transition-all active:scale-95" 
               />
              <button className="h-16 px-12 border-2 border-slate-100 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                 View Node Position <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-20">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-8 flex items-center gap-3">
                 <Info size={18} /> Professional Profile
              </h3>
              <p className="text-2xl lg:text-3xl font-bold text-[#292828] leading-relaxed italic">
                 "{business.description}"
              </p>
            </section>

            <section className="bg-slate-50 rounded-[3.5rem] p-12 lg:p-16 border border-slate-100 shadow-sm">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#292828] mb-10">Structural Gaps & Strengths</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {business.services?.map((service: string, i: number) => (
                    <div key={i} className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-slate-100 group hover:border-[#E53935]/20 transition-all">
                       <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all shrink-0">
                          <Zap size={20} />
                       </div>
                       <p className="text-sm font-black uppercase tracking-tight text-[#292828]">{service}</p>
                    </div>
                  ))}
               </div>
            </section>

            <section>
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-10">Neural Expertise</h3>
               <div className="flex flex-wrap gap-4">
                  {business.expertise?.map((exp: string) => (
                    <div key={exp} className="px-8 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-black uppercase text-[#292828] flex items-center gap-3 shadow-sm">
                       <Target size={16} className="text-[#E53935]" /> {exp}
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-10">
             <div className="bg-[#292828] p-10 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
                <ShieldCheck size={200} className="absolute -right-20 -bottom-20 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[5s]" />
                <div className="relative z-10">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E53935] mb-10">Neural Verification</h3>
                   <div className="space-y-8">
                      <div className="flex items-center gap-5">
                         <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                            <CheckCircle2 size={20} />
                         </div>
                         <div>
                            <p className="text-xs font-black uppercase tracking-tight">Ecosystem Verified</p>
                             <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Profile: Live</p>
                         </div>
                      </div>
                   </div>
                    <button className="w-full mt-12 h-14 bg-white text-[#292828] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] hover:text-white transition-all">Download Portfolio</button>
                </div>
             </div>

             <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                <h3 className="text-[11px] font-black uppercase text-[#292828] tracking-widest mb-8 flex items-center gap-2">
                   <Globe size={16} className="text-[#E53935]" /> Online Visibility
                </h3>
                <div className="space-y-4">
                   <button className="w-full h-14 flex items-center justify-between px-6 bg-slate-50 rounded-2xl group hover:bg-[#292828] hover:text-white transition-all">
                      <span className="text-[11px] font-black uppercase tracking-widest">Verified Website</span>
                      <ArrowUpRight size={16} className="text-slate-300 group-hover:text-white" />
                   </button>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
