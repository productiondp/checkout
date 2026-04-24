"use client";

import React, { useState } from "react";
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
import { MOCK_COMMUNITIES } from "@/data/communities";
const MOCK_POSTS: any[] = [];
const MOCK_MEMBERS: any[] = [];
import { CommunityPost, Member } from "@/types/communities";

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Posts" | "Members" | "About">("Posts");
  const [isJoined, setIsJoined] = useState(false);

  const communityId = params.id as string;
  const community = MOCK_COMMUNITIES.find(c => c.id === communityId) || MOCK_COMMUNITIES[0];
  const posts = MOCK_POSTS.filter(p => p.communityId === communityId);

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
                  <h1 className="text-5xl font-black text-[#292828] tracking-tight">{community.name}</h1>
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
                    <span className="text-xs font-black text-[#292828] uppercase tracking-wider">{community.memberCount.toLocaleString()} High-Authority Nodes</span>
                  </div>
                  <div className="h-4 w-[1px] bg-slate-100 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span className="text-xs font-black text-[#292828] uppercase tracking-wider">{community.activity} Activity</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {community.tags.map(tag => (
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
                {isJoined ? "Authorized Member" : "Join Community"}
                {!isJoined && <Plus size={20} />}
              </button>
              <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
                {community.visibility === "Private" ? "Requires Executive Approval" : "Instant Syndicate Access"}
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
            {activeTab === "Posts" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-xl font-black text-[#292828] uppercase tracking-tight">Structured Intent Feed</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Outcome-driven mandates only</p>
                  </div>
                  <button className="h-12 px-8 bg-[#292828] text-white rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-xl active:scale-95">
                    <Plus size={16} /> Post Intent
                  </button>
                </div>
                
                {posts.map(post => (
                  <IntentPostCard key={post.id} post={post} />
                ))}

                {posts.length === 0 && (
                  <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <Zap size={48} className="mx-auto text-slate-100 mb-6" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No active intents found in this node.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Members" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 mb-10 flex items-center gap-4">
                  <Search size={20} className="text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Search members by name, role or company..." 
                    className="flex-1 bg-transparent outline-none text-sm font-bold text-[#292828]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_MEMBERS.map(member => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "About" && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white p-12 rounded-[3rem] border border-slate-100">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-6">Mission Protocol</h3>
                  <p className="text-2xl font-bold text-[#292828] leading-relaxed italic">
                    "{community.description}"
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#E53935] mb-6">Engagement Rules</h3>
                  <div className="space-y-6">
                    {[
                      "Absolute focus on structured intents (Leads, Hiring, Partners).",
                      "Zero tolerance for generic chat noise or self-promotion.",
                      "All interactions must be high-authority and outcome-driven.",
                      "Privacy and data integrity of fellow nodes is paramount."
                    ].map((rule, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="h-6 w-6 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-black text-[#292828] shrink-0">{i+1}</div>
                        <p className="text-sm font-bold text-slate-500">{rule}</p>
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
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Verified Creator</p>
                      <h4 className="text-sm font-black text-[#292828] uppercase tracking-tight">Executive Node Alpha</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Created Feb 2026</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-10">
            <div className="bg-[#292828] p-10 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
              <Zap size={180} className="absolute -right-16 -bottom-16 text-white/[0.03] group-hover:-rotate-12 transition-transform duration-[5s]" />
              <div className="relative z-10">
                <p className="text-[10px] font-black text-[#E53935] uppercase tracking-widest mb-6">Syndicate Power</p>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-5xl font-black tabular-nums">94%</h3>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Match Score</span>
                    <span className="text-[9px] font-bold text-white/40 uppercase">Global Node Rank</span>
                  </div>
                </div>
                <p className="text-[11px] font-medium text-white/60 uppercase leading-relaxed mb-10">
                  This node has high structural overlap with your expertise and current business intents.
                </p>
                <button className="w-full h-12 bg-[#E53935] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#292828] transition-all">Optimize Sync</button>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#292828]">Trending Mandates</h3>
              <div className="space-y-4">
                {MOCK_POSTS.slice(0, 2).map(post => (
                  <div key={post.id} className="p-6 bg-white border border-slate-100 rounded-3xl group cursor-pointer hover:border-[#E53935]/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-red-50 text-[#E53935] rounded-lg">{post.type}</span>
                      <span className="text-[10px] font-bold text-slate-300">{post.timestamp}</span>
                    </div>
                    <p className="text-sm font-bold text-[#292828] leading-snug line-clamp-2 mb-4">"{post.description}"</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#E53935] group-hover:translate-x-2 transition-transform">
                      View Protocol <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function IntentPostCard({ post }: { post: CommunityPost }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
      {/* MATCH SCORE BADGE */}
      <div className="absolute top-0 right-0 p-8">
        <div className="flex flex-col items-end">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-2">Match</p>
          <p className="text-3xl font-black text-[#292828] tracking-tighter tabular-nums group-hover:text-[#E53935] transition-colors">{post.matchScore}%</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className={cn(
          "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider",
          post.type === "Hiring" ? "bg-blue-50 text-blue-600" :
          post.type === "Leads" ? "bg-emerald-50 text-emerald-600" :
          post.type === "Partnership" ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"
        )}>
          {post.type}
        </span>
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{post.timestamp}</span>
      </div>

      <h3 className="text-2xl font-bold text-[#292828] leading-relaxed mb-10 pr-20">
        "{post.description}"
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-slate-50">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
             <img src={`https://i.pravatar.cc/150?u=${post.author}`} alt="" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Posted By</p>
            <h4 className="text-sm font-black text-[#292828] uppercase tracking-tight">{post.author}</h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-12 px-8 bg-[#292828] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-lg active:scale-95">
            {post.type === "Hiring" ? "Apply" : post.type === "Leads" ? "Claim Lead" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-md border-2 border-white relative shrink-0">
          <img src={member.avatar} className="w-full h-full object-cover" alt="" />
          <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div>
          <h4 className="text-lg font-black text-[#292828] group-hover:text-[#E53935] transition-colors uppercase tracking-tight leading-tight mb-1">{member.name}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
            <Briefcase size={12} /> {member.role} @ {member.company}
          </p>
          <div className="flex items-center gap-2 mt-3">
             <Zap size={12} className="text-emerald-500" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{member.matchScore}% Match</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button className="h-10 w-10 bg-slate-50 text-[#292828] rounded-xl flex items-center justify-center hover:bg-[#292828] hover:text-white transition-all shadow-sm">
          <UserPlus size={18} />
        </button>
        <button className="h-10 w-10 bg-slate-50 text-[#292828] rounded-xl flex items-center justify-center hover:bg-[#E53935] hover:text-white transition-all shadow-sm">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
