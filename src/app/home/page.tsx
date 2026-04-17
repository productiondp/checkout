"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  ImageIcon, 
  Plus, 
  ChevronRight,
  ArrowRight,
  Calendar,
  ShoppingBag,
  Zap,
  Target,
  Rocket,
  Users,
  MapPin,
  Clock,
  Briefcase,
  Globe,
  Search,
  LayoutGrid,
  TrendingUp,
  Award,
  Activity,
  SlidersHorizontal,
  DollarSign,
  MoreHorizontal,
  Bookmark,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Coffee
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_POSTS } from "@/lib/dummyData";
import DealEngine from "@/components/modals/DealEngine";

export default function EliteHomeFeed() {
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedPostType, setSelectedPostType] = useState<string>("Update");
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              user: "You",
              text: newComment,
              time: "Just now"
            }
          ]
        };
      }
      return post;
    }));
    setNewComment("");
  };

  const filteredPosts = useMemo(() => {
    if (activeTab === "All") return posts;
    return posts.filter(p => p.type.toLowerCase() === activeTab.toLowerCase());
  }, [activeTab, posts]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white lg:bg-[#FDFDFF] font-sans selection:bg-[#E53935]/10 overscroll-none">
      
      {/* 1. CINEMATIC HOME FEED (CENTER) */}
      <main className="flex-1 w-full lg:max-w-[780px] lg:ml-auto lg:mr-0 min-h-screen border-r border-slate-100 bg-white relative">
         
         {/* TOP NAVIGATION HUB */}
         <div className="bg-white/95 backdrop-blur-xl border-b border-slate-50 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between mb-4">
               <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
                  {(['All', 'Update', 'Opportunities', 'Hiring', 'Partnership', 'Meeting'] as const).map(tab => (
                    <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab)}
                     className={cn(
                       "px-2 py-1.5 text-[11px] font-black uppercase  transition-all shrink-0 relative",
                       activeTab === tab ? "text-[#E53935]" : "text-slate-400 hover:text-slate-900"
                     )}
                    >
                       {tab}
                       {activeTab === tab && <div className="absolute -bottom-1.5 left-2 right-2 h-1 bg-[#E53935] rounded-full shadow-lg shadow-red-500/20" />}
                    </button>
                  ))}
               </div>
                <div className="flex items-center gap-2">
                   <div className="flex bg-slate-100/50 p-1 rounded-xl">
                      <button onClick={() => setViewMode("list")} className={cn("h-7 px-3 rounded-lg text-[10px] font-black uppercase transition-all", viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>List</button>
                      <button onClick={() => setViewMode("grid")} className={cn("h-7 px-3 rounded-lg text-[10px] font-black uppercase transition-all", viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>Grid</button>
                   </div>
                   <button className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                      <SlidersHorizontal size={14} />
                   </button>
                </div>
            </div>

            {/* INTEGRATED POST COMPOSER */}
            <div className={cn(
               "bg-slate-50 border border-slate-100/50 rounded-2xl transition-all duration-500 overflow-hidden",
               isPosting ? "p-5" : "h-12 flex items-center gap-4 pl-5 pr-1.5"
            )}>
               {!isPosting ? (
                 <>
                    <div className="h-7 w-7 rounded-lg overflow-hidden border border-white shadow-sm shrink-0">
                       <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" alt="" />
                    </div>
                    <button onClick={() => setIsPosting(true)} className="flex-1 text-left text-[14px] font-bold text-slate-300">Share a business update...</button>
                    <div className="flex items-center gap-1.5">
                       <button onClick={() => setIsPosting(true)} className="h-9 w-9 bg-white text-slate-400 rounded-lg flex items-center justify-center hover:text-[#E53935] transition-all"><ImageIcon size={16} /></button>
                       <button onClick={() => setIsPosting(true)} className="h-9 px-4 bg-slate-950 text-white rounded-lg flex items-center justify-center gap-2 text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">Post <Plus size={14} /></button>
                    </div>
                 </>
               ) : (
                <div className="mt-8 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-inner group/composer animate-in fade-in slide-in-from-top-4 duration-500">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#E53935] border border-slate-100 shadow-sm">
                              <Plus size={24} />
                           </div>
                           <div>
                              <h3 className="text-sm font-black text-slate-900 uppercase leading-none mb-1">Create Post</h3>
                              <p className="text-[10px] font-black uppercase text-slate-400">Post to {activeTab === "All" ? "Everywhere" : activeTab}</p>
                           </div>
                        </div>
                        <button onClick={() => setIsPosting(false)} className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all"><Plus className="rotate-45" size={18} /></button>
                     </div>

                     {/* Post Category Chips */}
                     <div className="flex flex-wrap gap-2 mb-8">
                        {['Opportunities', 'Hiring', 'Partnership', 'Meeting'].map(type => (
                           <button
                              key={type}
                              onClick={() => {
                                setSelectedPostType(type);
                                const templates: any = {
                                   'Hiring': 'Role: \nPackage: \nLocation: \nRequirements: ',
                                   'Opportunities': 'Budget: \nDeadline: \nOpportunity Detail: ',
                                   'Partnership': 'Collaboration Goal: \nIndustry: \nExpectations: ',
                                   'Meeting': 'Time: \nVenue: \nAgenda: '
                                };
                                setPostContent(templates[type] || "");
                              }}
                              className={cn(
                                "px-5 h-10 rounded-xl text-[10px] font-black uppercase transition-all border",
                                selectedPostType === type 
                                   ? "bg-[#E53935] text-white border-transparent shadow-lg shadow-red-500/20" 
                                   : "bg-white text-slate-400 border-slate-100 hover:text-slate-900"
                              )}
                           >
                              {type}
                           </button>
                        ))}
                     </div>

                     <textarea 
                       autoFocus
                       value={postContent}
                       onChange={(e) => setPostContent(e.target.value)}
                       placeholder="Describe your post..."
                       className="w-full bg-white p-6 rounded-[1.5rem] border border-slate-100 text-[16px] font-bold text-slate-900 placeholder:text-slate-300 outline-none resize-none min-h-[160px] shadow-sm focus:border-[#E53935]/20 transition-all"
                     />

                     <div className="flex items-center justify-between mt-8">
                        <div className="flex gap-2">
                           <button className="h-12 px-6 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black text-slate-500 hover:text-slate-950 transition-all uppercase"><ImageIcon size={18} /> Add Photo</button>
                        </div>
                        <button 
                          onClick={() => { setIsPosting(false); setPostContent(""); }}
                          className="px-10 h-14 bg-slate-950 text-white rounded-2xl text-[12px] font-black uppercase shadow-2xl hover:bg-[#E53935] active:scale-95 transition-all"
                        >
                           Post Now
                        </button>
                     </div>
                </div>
               )}
            </div>
         </div>

         {/* MAIN FEED STREAM */}
         <div className="px-3 lg:px-4 py-6">
            
            <div className={cn(
               "pb-40 lg:pb-32",
               viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6" : "space-y-8"
            )}>
               {filteredPosts.map(post => (
                 <div key={post.id} className="group/post relative">
                    <div className={cn(
                       "bg-white border-[#F2F4F7] overflow-hidden transition-all duration-500",
                       viewMode === "grid" 
                         ? "rounded-[2rem] border-2 shadow-xl hover:shadow-2xl hover:border-[#E53935]/10 h-full flex flex-col" 
                         : "rounded-[2rem] border shadow-2xl shadow-slate-200/10 hover:border-[#E53935]/10"
                    )}>
                       
                       {/* Header: Identity & Context */}
                       <div className={cn(
                          "flex items-center justify-between",
                          viewMode === "grid" ? "px-5 pt-5 pb-3" : "px-6 pt-6 pb-4"
                       )}>
                          <div className="flex items-center gap-2.5">
                             <Link 
                                href={`/profile/${post.authorId}`}
                                className={cn(
                                   "rounded-xl overflow-hidden border border-slate-50 shadow-sm hover:scale-105 active:scale-95 transition-all",
                                   viewMode === "grid" ? "h-8 w-8" : "h-11 w-11"
                                )}
                             >
                                <img src={post.avatar} alt="" className="w-full h-full object-cover" />
                             </Link>
                             <div>
                                <Link 
                                   href={`/profile/${post.authorId}`}
                                   className={cn(
                                      "font-black text-slate-900 leading-tight flex items-center gap-1 hover:text-[#E53935] transition-colors",
                                      viewMode === "grid" ? "text-[12px]" : "text-[15px]"
                                   )}
                                >
                                   {post.author.split(' ')[0]}
                                   {post.verified && <CheckCircle2 size={viewMode === "grid" ? 10 : 14} className="text-[#E53935]" />}
                                </Link>
                                {viewMode !== "grid" && (
                                  <p className="text-[11px] font-bold text-slate-400 uppercase ">
                                     {post.time}
                                  </p>
                                )}
                             </div>
                          </div>
                          
                          <div className={cn(
                             "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase  border",
                             post.type === 'Opportunities' ? "bg-red-50 text-[#E53935] border-red-100" :
                             post.type === 'Hiring' ? "bg-blue-50 text-blue-600 border-blue-100" :
                             "bg-slate-50 text-slate-600 border-slate-100"
                          )}>
                             {post.type === 'Opportunities' ? 'DEAL' : post.type.slice(0, 4).toUpperCase()}
                          </div>
                       </div>

                       {/* Body: Content & Media */}
                       <div className={cn(
                          "space-y-4 flex-1",
                          viewMode === "grid" ? "px-5 pb-4" : "px-6 pb-6"
                       )}>
                          <p className={cn(
                             "text-slate-700 leading-relaxed font-medium line-clamp-3 group-hover/post:line-clamp-none transition-all",
                             viewMode === "grid" ? "text-[13px]" : "text-[16px]"
                          )}>
                             {post.content}
                          </p>

                          {post.budget && viewMode !== "grid" && (
                            <div className="p-1 bg-[#E53935] rounded-3xl flex items-center justify-between pr-8 shadow-xl shadow-red-500/10 group-hover/post:scale-[1.01] transition-transform">
                               <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                                     <Award size={20} />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-black text-white/60 uppercase leading-none mb-1">Project Budget</p>
                                     <p className="text-[18px] font-black text-white">{post.budget}</p>
                                  </div>
                               </div>
                               <button 
                                 onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }}
                                 className="px-6 h-10 bg-white text-[#E53935] rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all"
                               >
                                  See Details
                               </button>
                            </div>
                          )}

                          {post.images && (
                            <div className={cn(
                               "rounded-2xl overflow-hidden border border-slate-100 shadow-lg lg:grayscale transition-all duration-700 group-hover/post:grayscale-0",
                               viewMode === "grid" ? "h-32" : "h-auto"
                            )}>
                               <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                       </div>

                       {/* Footer: Social Actions */}
                       <div className={cn(
                          "bg-slate-50/50 border-t border-slate-50 transition-colors mt-auto",
                          viewMode === "grid" ? "px-4 py-3" : "px-6 py-4"
                       )}>
                          <div className="flex items-center justify-between mb-0">
                             <div className={cn(
                                "flex items-center gap-4",
                                viewMode === "grid" ? "gap-2" : "gap-6"
                             )}>
                                <button 
                                  onClick={() => handleLike(post.id)}
                                  className={cn(
                                    "flex items-center gap-1.5 group/btn transition-all active:scale-125",
                                    post.isLiked ? "text-[#E53935]" : "text-slate-400"
                                  )}
                                >
                                   <div className={cn(
                                      "flex items-center justify-center transition-all",
                                      viewMode === "grid" ? "h-6 w-6" : "h-9 w-9",
                                      post.isLiked ? "text-[#E53935]" : "text-slate-300 group-hover/btn:text-[#E53935]"
                                   )}>
                                      <Heart size={viewMode === "grid" ? 14 : 18} fill={post.isLiked ? "currentColor" : "none"} />
                                   </div>
                                   <span className={cn("font-black", viewMode === "grid" ? "text-[11px]" : "text-[14px]")}>{post.likes}</span>
                                </button>
                                {viewMode !== "grid" && (
                                  <button 
                                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                                    className={cn(
                                      "flex items-center gap-2 group/btn transition-all",
                                      activeCommentPostId === post.id ? "text-slate-900" : "text-slate-400"
                                    )}
                                  >
                                     <div className="h-9 w-9 rounded-xl flex items-center justify-center group-hover/btn:bg-slate-100 transition-all">
                                        <MessageSquare size={18} />
                                     </div>
                                     <span className="text-[14px] font-black">{post.comments?.length || 0}</span>
                                  </button>
                                )}
                             </div>
                             
                             <button 
                               onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }}
                               className={cn(
                                  "bg-slate-950 text-white rounded-xl font-black uppercase flex items-center gap-2 hover:bg-[#E53935] transition-all group/apply shadow-lg shadow-black/5",
                                  viewMode === "grid" ? "px-3 h-8 text-[8px]" : "px-6 h-10 text-[10px]"
                               )}
                             >
                                Connect <ArrowUpRight size={viewMode === "grid" ? 10 : 14} />
                             </button>
                          </div>

                          {/* Expandable Comment Section */}
                          {activeCommentPostId === post.id && (
                             <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                                   {post.comments?.map((comment: any) => (
                                      <div key={comment.id} className="flex gap-4">
                                         <div className="h-8 w-8 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-black text-slate-400">
                                            {comment.user[0]}
                                         </div>
                                         <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                               <p className="text-[12px] font-black text-slate-900">{comment.user}</p>
                                               <p className="text-[10px] font-bold text-slate-400">{comment.time}</p>
                                            </div>
                                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed">{comment.text}</p>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                                
                                <div className="flex items-center gap-3 pt-4">
                                   <div className="h-9 w-9 bg-slate-100 rounded-xl shrink-0 border border-white shadow-sm flex items-center justify-center text-[12px] font-black text-[#E53935]">Y</div>
                                   <div className="flex-1 relative">
                                      <input 
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                        placeholder="Write a comment..."
                                        className="w-full h-10 bg-white border border-slate-100 rounded-xl px-4 text-[13px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#E53935]/20 shadow-inner"
                                      />
                                      <button 
                                        onClick={() => handleAddComment(post.id)}
                                        className="absolute right-1 top-1 h-8 px-3 bg-[#E53935] text-white rounded-lg text-[10px] font-black uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                                      >
                                         Send
                                      </button>
                                   </div>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </main>

      {/* 2. AREA ANALYTICS SIDEBAR (RIGHT) - HYPER PROMINENT REDESIGN */}
      <aside className="hidden lg:flex flex-col w-[400px] h-screen sticky top-0 bg-[#FDFDFF] p-6 lg:p-8 gap-10 overflow-y-auto no-scrollbar">
         
         {/* 1. CINEMATIC LIVE NODE HUB */}
         <div className="group/hub">
            <div className="flex items-center justify-between mb-6 px-1">
               <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Live Map</h4>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-black text-slate-900 uppercase">Active Now</span>
               </div>
            </div>
            
            <div className="relative h-[320px] bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-4xl group transition-all duration-700 ring-4 ring-white">
               {/* Map Background with High-Intensity Filter */}
               <Image 
                 src="/images/trivandrum-map.png" 
                 alt="" 
                 fill 
                 className="object-cover opacity-40 grayscale-0 invert transition-all duration-[10s] group-hover/hub:scale-110 group-hover/hub:opacity-60" 
               />
               
               {/* High-Velocity Pulse Markers */}
               <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Business Node */}
                  <div className="absolute top-[25%] left-[30%] h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-2xl animate-pulse cursor-pointer pointer-events-auto hover:bg-[#E53935] hover:scale-110 transition-all">
                     <Users size={20} />
                  </div>
                  {/* Coffee Node */}
                  <div className="absolute top-[50%] left-[65%] h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-2xl animate-pulse cursor-pointer pointer-events-auto hover:bg-[#E53935] hover:scale-110 transition-all [animation-delay:1s]">
                     <Coffee size={20} />
                  </div>
                  {/* Deal Node (Hyper Pulse) */}
                  <div className="absolute top-[18%] left-[78%] h-14 w-14 bg-[#E53935] border-2 border-white rounded-[1.25rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(229,57,53,0.4)] animate-bounce cursor-pointer pointer-events-auto [animation-duration:2s]">
                     <Zap size={24} fill="currentColor" />
                  </div>
                  {/* Asset Node */}
                  <div className="absolute top-[75%] left-[20%] h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-2xl animate-pulse cursor-pointer pointer-events-auto hover:bg-[#E53935] hover:scale-110 transition-all [animation-delay:1.5s]">
                     <ShoppingBag size={20} />
                  </div>
               </div>

               {/* Map Footer Overlay */}
               <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20">
                  <div className="flex items-end justify-between">
                     <div>
                        <p className="text-3xl font-black text-white mb-1 uppercase ">Trivandrum</p>
                        <p className="text-[10px] font-black text-[#E53935] uppercase ">Main City Area</p>
                     </div>
                     <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-right">
                        <p className="text-2xl font-black text-white leading-none mb-1">1,482</p>
                        <p className="text-[8px] font-black uppercase text-white/40">Users</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. HYPER-PROMINENT PARTNER SYNC (HIGH INTENSITY RED) */}
         <div className="relative group/sync">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E53935] to-[#B71C1C] rounded-[4rem] blur-2xl opacity-20 group-hover/sync:opacity-40 transition-opacity" />
            <div className="relative p-10 bg-gradient-to-br from-[#E53935] to-[#B71C1C] rounded-[3.5rem] shadow-4xl overflow-hidden group hover:scale-[1.03] transition-all duration-700">
               <TrendingUp size={160} className="absolute -right-10 -bottom-10 text-white/10 group-hover/sync:rotate-12 transition-transform duration-[3s]" />
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="h-14 w-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-[1.5rem] flex items-center justify-center text-white">
                        <Users size={28} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-white uppercase leading-none">Find <span className="text-white/40 font-medium not-italic">Partners</span></h3>
                        <p className="text-[10px] font-black text-white/50 uppercase  mt-2">Smart Match Engine</p>
                     </div>
                  </div>
                  
                  <div className="space-y-6 mb-12">
                     <p className="text-white text-[17px] font-bold leading-relaxed">
                        We found <span className="underline decoration-white/30 underline-offset-4 decoration-2">12 business owners</span> near you who match your logistics needs.
                     </p>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full animate-progress-slow" style={{ width: '94%' }} />
                     </div>
                  </div>

                  <button className="w-full py-6 bg-white text-[#E53935] rounded-[2rem] font-black text-[12px] uppercase shadow-2xl hover:bg-slate-900 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-3">
                     Connect Now <ArrowRight size={18} />
                  </button>
               </div>
            </div>
         </div>

         {/* 3. IMMERSIVE ACTIVITY RADAR */}
         <div className="p-10 bg-white border-2 border-slate-50 rounded-[3.5rem] shadow-2xl shadow-slate-200/20 relative overflow-hidden group/radar">
            <div className="flex items-center justify-between mb-10">
               <div className="flex flex-col">
                  <h3 className="text-[11px] font-black text-slate-300 uppercase  mb-1">Activity Radar</h3>
                  <p className="text-[15px] font-black text-slate-950 uppercase group-hover/radar:text-[#E53935] transition-colors">Trending Now</p>
               </div>
               <div className="h-10 px-4 bg-red-50 text-[#E53935] rounded-xl flex items-center gap-2 text-[10px] font-black uppercase">
                  <Activity size={14} className="animate-pulse" /> Peak Cycle
               </div>
            </div>
            
            <div className="space-y-6">
               {[
                 { tag: "#msme_kerala", count: "142 posts", color: "text-blue-500", trend: "+24%", text: "Wholesale Expansion" },
                 { tag: "#technopark_hire", count: "84 leads", color: "text-[#E53935]", trend: "Hot", text: "Senior Ops Required" },
                 { tag: "#logistics_sync", count: "12 tenders", color: "text-green-500", trend: "Active", text: "Route Acquisition" }
               ].map((t, i) => (
                 <div key={i} className="group/item p-5 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <p className={cn("text-[16px] font-black transition-colors mb-1", t.color)}>{t.tag}</p>
                          <p className="text-[12px] font-bold text-slate-950">{t.text}</p>
                       </div>
                       <span className="text-[10px] font-black text-slate-300 uppercase">{t.trend}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-slate-400 uppercase ">{t.count} • 2h avg</p>
                       <ArrowUpRight size={18} className="text-slate-100 group-hover/item:text-[#E53935] group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all" />
                    </div>
                 </div>
               ))}
            </div>

            <button className="w-full mt-10 py-5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-[1.5rem] text-[11px] font-black uppercase transition-all flex items-center justify-center gap-3 border border-transparent hover:border-slate-100">
               Explore Full Radar <ChevronRight size={16} />
            </button>
         </div>
      </aside>

      <DealEngine isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} deal={selectedDeal} />
    </div>
  );
}
