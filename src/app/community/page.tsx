"use client";

import React, { useState } from "react";
import { MessageSquare, Users, TrendingUp, Sparkles, Plus, MoreHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_GROUPS = [
  { name: "Hospitality Hub", members: "1.2k", active: 42, icon: "🏨", color: "bg-orange-500" },
  { name: "SaaS Builders", members: "840", active: 12, icon: "⚡", color: "bg-blue-500" },
  { name: "Trivandrum Creatives", members: "2.4k", active: 156, icon: "🎨", color: "bg-pink-500" },
];

const INITIAL_POSTS = [
  { author: "Kiran R.", topic: "Best payment gateways for Trivandrum startups?", replies: 24, likes: 12, category: "Fintech" },
  { author: "Sana M.", topic: "Looking for video editing feedback on my latest cafe reel.", replies: 8, likes: 45, category: "Creative" },
];

export default function Community() {
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const toggleGroup = (name: string) => {
    if (joinedGroups.includes(name)) {
      setJoinedGroups(joinedGroups.filter(g => g !== name));
    } else {
      setJoinedGroups([...joinedGroups, name]);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-full">
      <div className="flex-1 p-8 border-r border-[#F1F3F4] max-w-[800px] mx-auto xl:mx-0">
           <div className="flex items-center justify-between px-2 mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Community</h2>
              <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                 <Plus size={20} />
              </button>
           </div>

           <div className="space-y-6">
              {INITIAL_POSTS.map((post, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#F1F3F4] p-6 hover:shadow-sm transition-all group cursor-pointer">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt="Pic" />
                         </div>
                         <div>
                            <p className="text-[14px] font-black text-[#202124]">{post.author}</p>
                            <p className="text-[11px] text-[#5F6368]">{post.category} • 2h ago</p>
                         </div>
                      </div>
                      <MoreHorizontal size={18} className="text-[#5F6368]" />
                   </div>
                   <h3 className="text-[15px] font-bold text-[#202124] leading-relaxed mb-6 group-hover:text-primary transition-colors">
                     {post.topic}
                   </h3>
                   <div className="flex items-center gap-6 text-[#5F6368] text-[12px] font-bold pt-4 border-t border-[#F1F3F4]">
                      <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
                         <MessageSquare size={16} /> {post.replies} Replies
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setLikedPosts(prev => prev.includes(i) ? prev.filter(p => p !== i) : [...prev, i]);
                        }}
                        className={cn(
                          "flex items-center gap-1.5 transition-colors",
                          likedPosts.includes(i) ? "text-primary" : "hover:text-red-500"
                        )}
                      >
                         <Sparkles size={16} fill={likedPosts.includes(i) ? "currentColor" : "none"} /> {likedPosts.includes(i) ? post.likes + 1 : post.likes} Bits
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      <div className="w-full xl:w-[360px] p-8 space-y-8 bg-[#FAFAFA]/50">
           <div className="space-y-6">
              <h4 className="text-[14px] font-bold text-[#202124]">Trending Groups</h4>
              <div className="space-y-4">
                 {INITIAL_GROUPS.map(group => (
                   <div key={group.name} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm transition-transform group-hover:scale-105 text-white", group.color)}>
                            {group.icon}
                         </div>
                         <div>
                            <h5 className="text-[13px] font-bold text-[#202124] leading-tight mb-0.5">{group.name}</h5>
                            <p className="text-[11px] text-[#5F6368] font-medium">{joinedGroups.includes(group.name) ? "You are a member" : `${group.members} Members`}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => toggleGroup(group.name)}
                        className={cn(
                          "px-4 py-1.5 text-[11px] font-bold rounded-full transition-all flex items-center gap-1",
                          joinedGroups.includes(group.name) 
                            ? "bg-green-100 text-green-600 hover:bg-red-50 hover:text-red-500" 
                            : "bg-[#E8F0FE] text-primary hover:bg-primary hover:text-white"
                        )}
                      >
                        {joinedGroups.includes(group.name) ? <><Check size={12} /> Joined</> : "Join"}
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-[#F1F3F4]">
              <div className="flex items-center gap-3 text-primary mb-4">
                 <TrendingUp size={18} />
                 <span className="text-[13px] font-bold">Local Momentum</span>
              </div>
              <p className="text-[12px] text-[#5F6368]">
                 Local communities have seen a <span className="text-green-500 font-bold">12% boost</span> this week.
              </p>
           </div>
        </div>
    </div>
  );
}
