"use client";

export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ArrowRight,
  Users, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Plus, 
  Search, 
  Zap, 
  MessageSquare,
  Building,
  Briefcase,
  UserPlus,
  Info,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_AVATAR } from "@/utils/constants";

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Posts" | "Members" | "About">("About");
  const [isJoined, setIsJoined] = useState(false);
  const [community, setCommunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const communityId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    async function fetchCommunity() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', communityId)
        .single();

      if (data) {
        setCommunity({
          ...data,
          memberCount: data.member_count || 0,
          activity: data.activity_status || 'Active'
        });
      }
      setIsLoading(false);
    }
    if (communityId) fetchCommunity();
  }, [communityId]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center gap-6">
      <div className="h-12 w-12 border-4 border-white/5 border-t-[#E53935] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Hub Details...</p>
    </div>
  );

  if (!community) return (
    <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center gap-6">
      <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Hub Not Found</h2>
      <button onClick={() => router.push('/communities')} className="text-[#E53935] text-[10px] font-black uppercase tracking-widest border-b border-[#E53935]">Back to Communities</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* TOP BANNER & INFO */}
      <div className="bg-white border-b border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-16">
          <button 
            onClick={() => router.push('/communities')}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-[#E53935] transition-colors mb-10"
          >
            <ArrowLeft size={14} /> Back to Communities
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="flex items-start gap-8">
              <div className="h-32 w-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-[#292828] shadow-2xl border-4 border-white shrink-0">
                <Users size={56} />
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-5xl font-black text-[#292828] tracking-tight uppercase">{community.name}</h1>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2",
                    community.visibility === "Public" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {community.visibility === "Public" ? <Globe size={14} /> : <Lock size={14} />}
                    {community.visibility}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-300" />
                    <span className="text-xs font-black text-[#292828] uppercase tracking-wider">{community.memberCount.toLocaleString()} Members</span>
                  </div>
                  <div className="h-4 w-[1px] bg-slate-100 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span className="text-xs font-black text-[#292828] uppercase tracking-wider">{community.activity} Activity</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {community.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsJoined(!isJoined)}
                className={cn(
                  "h-16 px-12 rounded-2xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 overflow-hidden relative",
                  isJoined ? "bg-white border-2 border-slate-100 text-slate-400" : "bg-[#292828] text-white hover:bg-[#E53935]"
                )}
              >
                {isJoined ? "Member" : "Join Hub"}
                {!isJoined && <Plus size={20} />}
              </button>
              <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
                {community.visibility === "Private" ? "Requires Neural Approval" : "Instant Neural Access"}
              </p>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-12">
            {(["Posts", "Members", "About"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "h-16 relative text-xs font-black uppercase tracking-[0.3em] transition-all",
                  activeTab === tab ? "text-[#E53935]" : "text-slate-400 hover:text-[#292828]"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E53935] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2">
            {activeTab === "About" && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-6">Mission</h3>
                  <p className="text-2xl font-bold text-[#292828] leading-relaxed italic">
                    "{community.description}"
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-6">Ecosystem Engagement Rules</h3>
                  <div className="space-y-6">
                    {[
                      "Absolute focus on high-authority intent posts.",
                      "Zero tolerance for generic or noise-based interactions.",
                      "All members are verified through the Checkout neural layer.",
                      "Secure deal-flow routing is mandatory."
                    ].map((rule, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="h-6 w-6 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-black text-[#292828] shrink-0">{i+1}</div>
                        <p className="text-sm font-bold text-slate-500 uppercase leading-relaxed">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#292828]">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Verified Hub Creator</p>
                      <h4 className="text-sm font-black text-[#292828] uppercase tracking-tight">Checkout Verified</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === "Posts" || activeTab === "Members") && (
              <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Live {activeTab} synchronization is currently being established...</p>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-10">
            <div className="bg-[#292828] p-10 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
              <Zap size={180} className="absolute -right-16 -bottom-16 text-white/[0.03] group-hover:-rotate-12 transition-transform duration-[5s]" />
              <div className="relative z-10">
                <p className="text-[10px] font-black text-[#E53935] uppercase tracking-widest mb-6">Neural Match Score</p>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-5xl font-black tabular-nums">94%</h3>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Ecosystem Fit</span>
                    <span className="text-[9px] font-bold text-white/40 uppercase">Verified</span>
                  </div>
                </div>
                <button className="w-full h-12 bg-[#E53935] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#292828] transition-all shadow-xl">Connect Now</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
