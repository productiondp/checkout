"use client";

export const runtime = 'edge';

import React, { useState } from "react";
import { 
  ArrowLeft, 
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
  Clock,
  ArrowRight
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_COMMUNITIES } from "@/data/communities";
const MOCK_POSTS: any[] = [];
const MOCK_MEMBERS: any[] = [];
import { CommunityPost, Member } from "@/types/communities";
import TerminalLayout from "@/components/layout/TerminalLayout";

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Posts" | "Members" | "About">("Posts");
  const [isJoined, setIsJoined] = useState(false);

  const communityId = params.id as string;
  const community = MOCK_COMMUNITIES.find(c => c.id === communityId) || MOCK_COMMUNITIES[0];
  const posts = MOCK_POSTS.filter(p => p.communityId === communityId);

  return (
    <TerminalLayout
      topbarChildren={
         <div className="flex items-center gap-6">
            <button 
               onClick={() => router.push('/communities')}
               className="h-10 px-4 bg-[#F5F5F7] text-black/40 rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-black transition-all"
            >
               <ArrowLeft size={14} /> Back
            </button>
            <div className="flex p-1 bg-[#F5F5F7] rounded-[10px] border border-black/[0.03]">
               {(["Posts", "Members", "About"] as const).map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                     "px-6 h-9 rounded-[8px] text-[10px] font-black uppercase tracking-widest transition-all relative",
                     activeTab === tab ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
                   )}
                 >
                   {tab}
                 </button>
               ))}
            </div>
         </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* HERO SECTION */}
        <div className="bg-white rounded-[20px] p-10 border border-black/[0.03] shadow-sm relative overflow-hidden">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
              <div className="flex items-start gap-8">
                 <div className="h-24 w-24 bg-black rounded-[10px] flex items-center justify-center text-white shadow-2xl shrink-0">
                    <Users size={32} />
                 </div>
                 <div className="pt-2">
                    <div className="flex items-center gap-4 mb-3">
                       <h1 className="text-3xl font-black text-[#1D1D1F] uppercase font-outfit leading-none">{community.name}</h1>
                       <div className={cn(
                         "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2",
                         community.visibility === "Public" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                       )}>
                         {community.visibility === "Public" ? <Globe size={12} /> : <Lock size={12} />}
                         {community.visibility}
                       </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                       <div className="flex items-center gap-2 text-black/20 uppercase text-[10px] font-black tracking-widest">
                          <Users size={14} />
                          <span>{community.memberCount.toLocaleString()} Members</span>
                       </div>
                       <div className="flex items-center gap-2 text-emerald-500 uppercase text-[10px] font-black tracking-widest">
                          <TrendingUp size={14} />
                          <span>{community.activity} Activity</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                 <button 
                   onClick={() => setIsJoined(!isJoined)}
                   className={cn(
                     "h-14 px-8 rounded-[10px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                     isJoined ? "bg-[#F5F5F7] text-black/20" : "bg-black text-white hover:bg-[#E53935] shadow-xl"
                   )}
                 >
                   {isJoined ? "Member" : "Join Community"}
                   {!isJoined && <Plus size={16} />}
                 </button>
                 <p className="text-[8px] font-black text-black/10 text-center uppercase tracking-[0.2em]">
                    {community.visibility === "Private" ? "Approval Required" : "Instant Access"}
                 </p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "Posts" && (
              <>
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20">Discussion Feed</h2>
                   <button className="h-10 px-6 bg-black text-white rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all">
                      <Plus size={14} /> Add Post
                   </button>
                </div>
                
                {posts.map(post => (
                  <IntentPostCard key={post.id} post={post} />
                ))}

                {posts.length === 0 && (
                  <div className="py-24 text-center bg-white rounded-[10px] border border-black/[0.03]">
                    <Zap size={48} className="mx-auto text-black/5 mb-6" />
                    <p className="text-black/20 text-[10px] font-black uppercase tracking-widest">No active posts yet.</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "Members" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[10px] border border-black/[0.03] mb-6 flex items-center gap-4">
                  <Search size={20} className="text-black/10" />
                  <input type="text" placeholder="Search members..." className="flex-1 bg-transparent outline-none text-sm font-bold text-black" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_MEMBERS.map(member => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "About" && (
              <div className="space-y-12 bg-white p-12 rounded-[10px] border border-black/[0.03]">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#E53935] mb-6">Mission</h3>
                  <p className="text-2xl font-black text-black uppercase font-outfit leading-relaxed italic">"{community.description}"</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#E53935] mb-6">Engagement Rules</h3>
                  <div className="space-y-6">
                    {[
                      "Absolute focus on relevant posts (Leads, Hiring, Partners).",
                      "Zero tolerance for generic chat noise or self-promotion.",
                      "All interactions must be high-authority and outcome-driven."
                    ].map((rule, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="h-6 w-6 bg-[#F5F5F7] rounded-[6px] flex items-center justify-center text-[10px] font-black text-black shrink-0">{i+1}</div>
                        <p className="text-[12px] font-bold text-black/40 uppercase leading-relaxed">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-10">
            <div className="bg-black p-10 rounded-[20px] text-white relative overflow-hidden group shadow-2xl">
              <Zap size={180} className="absolute -right-16 -bottom-16 text-white/[0.03] group-hover:-rotate-12 transition-transform duration-[5s]" />
              <div className="relative z-10">
                <p className="text-[9px] font-black text-[#E53935] uppercase tracking-widest mb-6">Match Score</p>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-5xl font-black font-outfit">94%</h3>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-emerald-400">Match Score</span>
                    <span className="text-[8px] font-bold text-white/40 uppercase">Elite Level</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-white/40 uppercase leading-relaxed mb-10">This community has high structural overlap with your current business goals.</p>
                <button className="w-full h-12 bg-[#E53935] rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-red-500/20">Connect</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </TerminalLayout>
  );
}

function IntentPostCard({ post }: { post: CommunityPost }) {
  return (
    <div className="bg-white p-8 rounded-[10px] border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 flex flex-col items-end">
        <p className="text-[9px] font-black text-black/10 uppercase mb-1">Match</p>
        <p className="text-3xl font-black text-black font-outfit group-hover:text-[#E53935] transition-colors">{post.matchScore}%</p>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <span className={cn("px-4 py-1.5 rounded-[8px] text-[9px] font-black uppercase tracking-widest", post.type === "Hiring" ? "bg-blue-50 text-blue-600" : post.type === "Leads" ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600")}>{post.type}</span>
        <span className="text-[9px] font-black text-black/10 uppercase tracking-widest">{post.timestamp}</span>
      </div>
      <h3 className="text-xl font-black text-black leading-relaxed mb-10 pr-20 uppercase font-outfit italic">"{post.description}"</h3>
      <div className="flex items-center justify-between pt-8 border-t border-black/[0.03]">
        <div className="flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-[#F5F5F7] border-2 border-white shadow-sm overflow-hidden"><img src={`https://i.pravatar.cc/150?u=${post.author}`} alt="" /></div><div><p className="text-[8px] font-black text-black/10 uppercase mb-1">Posted By</p><h4 className="text-[12px] font-black text-black uppercase">{post.author}</h4></div></div>
        <button className="h-12 px-8 bg-black text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-lg">{post.type === "Hiring" ? "Apply" : "Connect"}</button>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="bg-white p-6 rounded-[10px] border border-black/[0.03] shadow-sm hover:shadow-xl transition-all group flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="h-14 w-14 rounded-[10px] overflow-hidden shadow-md border-2 border-white relative shrink-0"><img src={member.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" /><div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full" /></div>
        <div><h4 className="text-[14px] font-black text-black uppercase font-outfit leading-tight mb-1">{member.name}</h4><p className="text-[9px] font-black text-black/20 uppercase tracking-widest flex items-center gap-2"><Briefcase size={12} /> {member.role}</p></div>
      </div>
      <button className="h-10 w-10 bg-[#F5F5F7] text-black/20 rounded-[8px] flex items-center justify-center hover:bg-black hover:text-white transition-all"><UserPlus size={18} /></button>
    </div>
  );
}
