"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Heart, 
  Plus, 
  ChevronRight,
  ArrowRight,
  Calendar,
  Zap,
  Target,
  Users,
  Briefcase,
  Activity,
  SlidersHorizontal,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Coffee,
  Heart as HeartIcon,
  ImageIcon,
  X,
  Building,
  MapPin,
  ShieldCheck,
  List,
  LayoutGrid
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
  const [sortBy, setSortBy] = useState<string>("Latest");
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [joinedMeetings, setJoinedMeetings] = useState<number[]>([]);
  const [activeBidPostId, setActiveBidPostId] = useState<number | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingStep, setMatchingStep] = useState(0);

  const handlePost = () => {
    if (!postContent.trim() && !attachment) return;

    const newPostObj = {
      id: posts.length + 1,
      type: selectedPostType,
      author: "Arun Dev",
      authorId: 1,
      time: "Just now",
      content: postContent,
      images: attachment ? [URL.createObjectURL(attachment)] : undefined,
      matchScore: 100,
      avatar: "https://i.pravatar.cc/150?u=user1",
      verified: true,
      likes: 0,
      isLiked: false,
      comments: []
    };

    setPosts([newPostObj, ...posts]);
    setIsPosting(false);
    setPostContent("");
    setAttachment(null);
  };

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

  const startMatching = () => {
    setIsMatching(true);
    setMatchingStep(1);
    setTimeout(() => {
       setMatchingStep(2);
    }, 2400);
  };

  const filteredPosts = useMemo(() => {
    let result = activeTab === "All" ? [...posts] : posts.filter(p => p.type.toLowerCase() === activeTab.toLowerCase());
    if (sortBy === "Top Match") {
       result = result.sort((a,b) => b.matchScore - a.matchScore);
    } else if (sortBy === "Trending") {
       result = result.sort((a,b) => b.likes - a.likes);
    }
    return result;
  }, [activeTab, posts, sortBy]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white lg:bg-[#FDFDFF] font-sans selection:bg-[#E53935]/10 overscroll-none">
      
      <main className="flex-1 w-full lg:max-w-[780px] lg:ml-auto lg:mr-0 min-h-screen border-r border-[#292828]/10 bg-white relative">
         
         <div className="bg-white/95 backdrop-blur-xl border-b border-[#292828]/5 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between gap-4 py-1">
               <div className="flex items-center gap-6 overflow-x-hidden">
                  {/* CATEGORY DROPDOWN */}
                  <div className="flex items-center gap-2 shrink-0">
                     <span className="text-[9px] font-bold text-[#292828]/30 uppercase tracking-widest leading-none">Feed</span>
                     <select 
                       value={activeTab}
                       onChange={(e) => setActiveTab(e.target.value)}
                       className="bg-transparent text-[10px] font-bold uppercase outline-none cursor-pointer text-[#E53935] hover:text-[#292828] transition-colors"
                     >
                        {['All', 'Update', 'Deals', 'Jobs', 'Partners', 'Meets', 'Events'].map(tab => (
                           <option key={tab} value={tab}>{tab}</option>
                        ))}
                     </select>
                  </div>

                  <div className="h-4 w-[1px] bg-[#292828]/10" />

                  {/* SORT DROPDOWN */}
                  <div className="flex items-center gap-2 shrink-0">
                     <span className="text-[9px] font-bold text-[#292828]/30 uppercase tracking-widest leading-none">Sort</span>
                     <select 
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value)}
                       className="bg-transparent text-[10px] font-bold uppercase outline-none cursor-pointer text-[#292828] hover:text-[#E53935] transition-colors"
                     >
                        <option>Latest</option>
                        <option>Trending</option>
                        <option>Matches</option>
                     </select>
                  </div>
                  
                  <div className="h-4 w-[1px] bg-[#292828]/10 hidden sm:block" />

                  {/* VIEW SWITCHER */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                     <span className="text-[9px] font-bold text-[#292828]/30 uppercase tracking-widest leading-none">View</span>
                     <div className="flex items-center gap-3">
                        <button onClick={() => setViewMode("list")} className={cn("text-[10px] font-bold uppercase transition-all", viewMode === "list" ? "text-[#292828]" : "text-[#292828]/30")}>
                           List
                        </button>
                        <button onClick={() => setViewMode("grid")} className={cn("text-[10px] font-bold uppercase transition-all", viewMode === "grid" ? "text-[#292828]" : "text-[#292828]/30")}>
                           Grid
                        </button>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <button className="text-[#292828]/40 hover:text-[#E53935] transition-colors">
                     <SlidersHorizontal size={14} />
                  </button>
               </div>
            </div>

            <div className={cn(
               "bg-[#292828]/5 border border-[#292828]/10/50 rounded-2xl transition-all duration-500 overflow-hidden",
               isPosting ? "p-5" : "h-12 flex items-center gap-4 pl-5 pr-1.5"
            )}>
               {!isPosting ? (
                 <>
                     <Link href="/profile" className="h-7 w-7 rounded-lg overflow-hidden border border-white shadow-sm shrink-0 block hover:scale-105 transition-transform active:scale-95">
                        <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" alt="" />
                     </Link>
                    <button onClick={() => setIsPosting(true)} className="flex-1 text-left text-sm font-bold text-[#292828]/40">Share a business update...</button>
                    <div className="flex items-center gap-1.5">
                       <button onClick={() => setIsPosting(true)} className="h-9 w-9 bg-white text-[#292828] rounded-lg flex items-center justify-center hover:text-[#E53935] transition-all"><ImageIcon size={16} /></button>
                       <button onClick={() => setIsPosting(true)} className="h-9 px-4 bg-[#292828] text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold uppercase shadow-lg active:scale-95 transition-all">Post <Plus size={14} /></button>
                    </div>
                 </>
               ) : (
                <div className="mt-8 p-8 bg-[#292828]/5 rounded-[2.5rem] border-2 border-[#292828]/10 shadow-inner group/composer animate-in fade-in slide-in-from-top-4 duration-500">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#E53935] border border-[#292828]/10 shadow-sm">
                              <Plus size={24} />
                           </div>
                           <div>
                              <h3 className="text-sm font-bold text-[#292828] uppercase leading-none mb-1">New Post</h3>
                              <p className="text-xs font-bold uppercase text-[#292828]">Sharing with {activeTab === "All" ? "Everyone" : activeTab}</p>
                           </div>
                        </div>
                        <button onClick={() => setIsPosting(false)} className="h-8 w-8 rounded-xl flex items-center justify-center text-[#292828] hover:bg-slate-200 transition-all"><Plus className="rotate-45" size={18} /></button>
                     </div>

                     <div className="flex flex-wrap gap-2 mb-8">
                        {['Posts', 'Deals', 'Jobs', 'Partners', 'Meets', 'Events'].map(type => (
                           <button
                              key={type}
                              onClick={() => {
                                setSelectedPostType(type);
                                setPostContent(""); 
                              }}
                              className={cn(
                                "px-5 h-10 rounded-xl text-xs font-bold uppercase transition-all border shadow-sm",
                                selectedPostType === type 
                                   ? "bg-[#292828] text-white border-transparent shadow-xl" 
                                   : "bg-white text-[#292828] border-[#292828]/10 hover:text-[#292828]"
                              )}
                           >
                              {type}
                           </button>
                        ))}
                     </div>

                      {['Deals', 'Jobs', 'Partners', 'Meets', 'Events'].includes(selectedPostType) ? (
                         <div className="space-y-4 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {selectedPostType === 'Deals' && (
                                  <>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Budget</p>
                                        <input type="text" placeholder="How much is the budget?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Deadline</p>
                                        <input type="text" placeholder="When is the deadline?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                  </>
                               )}
                               {selectedPostType === 'Jobs' && (
                                  <>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Role</p>
                                        <input type="text" placeholder="What is the job title?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Location</p>
                                        <input type="text" placeholder="Where is the role located?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                  </>
                               )}
                               {selectedPostType === 'Partners' && (
                                  <>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Goal</p>
                                        <input type="text" placeholder="What is the partnership goal?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Market</p>
                                        <input type="text" placeholder="Which industry sector?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                  </>
                               )}
                               {selectedPostType === 'Meets' && (
                                  <>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Venue</p>
                                        <input type="text" placeholder="Where are we meeting?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Schedule</p>
                                        <input type="text" placeholder="When is the meeting?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                  </>
                               )}
                               {selectedPostType === 'Events' && (
                                  <>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Venue</p>
                                        <input type="text" placeholder="Where is the event?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Capacity</p>
                                        <input type="text" placeholder="How many people can attend?" className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                  </>
                               )}
                            </div>
                            <div className="space-y-1.5">
                               <p className="text-xs font-bold uppercase text-[#292828] ml-1">Detailed Briefing</p>
                               <textarea 
                                 autoFocus
                                 value={postContent}
                                 onChange={(e) => setPostContent(e.target.value)}
                                 placeholder="Elaborate on the details..."
                                 className="w-full bg-white p-6 rounded-[1.5rem] border border-[#292828]/10 text-[15px] font-bold text-[#292828] placeholder:text-[#292828]/20 outline-none resize-none min-h-[120px] shadow-sm focus:border-slate-900 transition-all"
                               />
                            </div>
                         </div>
                      ) : (
                         <textarea 
                           autoFocus
                           value={postContent}
                           onChange={(e) => setPostContent(e.target.value)}
                           placeholder="What's on your mind?"
                           className="w-full bg-white p-6 rounded-[1.5rem] border-2 border-[#292828]/5 text-[15px] font-bold text-[#292828] placeholder:text-[#292828]/20 outline-none resize-none min-h-[140px] shadow-sm focus:border-slate-900 transition-all"
                         />
                      )}

                      <div className="flex items-center justify-between mt-8">
                         <div className="flex gap-2 items-center">
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                            />
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className={cn(
                                "h-12 px-6 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold transition-all uppercase border",
                                attachment 
                                  ? "bg-green-50 border-green-200 text-green-700" 
                                  : "bg-white border-[#292828]/10 text-[#292828] hover:text-[#292828]"
                              )}
                            >
                               <ImageIcon size={18} /> 
                               {attachment ? "Media Attached" : "Attach Media"}
                            </button>
                         </div>
                         <button 
                           onClick={handlePost}
                           className="px-10 h-14 bg-[#E53935] text-white rounded-2xl text-xs font-bold uppercase shadow-xl hover:shadow-[#E53935]/20 active:scale-95 transition-all"
                         >
                            Post Now
                         </button>
                      </div>
                </div>
               )}
            </div>
         </div>

         <div className="px-3 lg:px-4 py-6">
            
            <div className={cn(
               "pb-40 lg:pb-32",
               viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : "space-y-8"
            )}>
               {filteredPosts.map(post => (
                 <div key={post.id} className="group/post relative">
                    {viewMode === "grid" ? (
                      <div className={cn(
                        "bg-white rounded-[2rem] border-2 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(41,40,40,0.12)] flex flex-col h-full overflow-hidden",
                        post.type === 'Deals' ? "border-[#E53935]/10 hover:border-[#E53935]" : "border-[#292828]/5 hover:border-[#292828]"
                      )}>
                        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                           <div className="flex items-center gap-2 group/author">
                              <div className="relative">
                                 <div className="h-8 w-8 rounded-lg overflow-hidden border-2 border-transparent group-hover/author:border-[#292828]/10 transition-all">
                                    <img src={post.avatar} className="w-full h-full object-cover" alt="" />
                                 </div>
                                 <div className={cn(
                                   "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white",
                                   post.id % 3 === 0 ? "bg-green-500" : post.id % 3 === 1 ? "bg-amber-500" : "bg-slate-300"
                                 )} />
                              </div>
                              <span className="text-[10px] font-bold text-[#292828] uppercase group-hover/author:text-[#E53935] transition-colors">{post.author}</span>
                           </div>
                           <div className={cn(
                              "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border",
                              post.type === 'Deals' ? "bg-red-50 text-red-600 border-red-100" : "bg-[#292828]/5 text-[#292828] border-[#292828]/10"
                           )}>
                              {post.type}
                           </div>
                        </div>

                        <div className="px-5 pb-5 flex-1 flex flex-col gap-3">
                           <p className="text-sm font-bold text-slate-700 leading-snug line-clamp-2">
                              {post.content}
                           </p>

                           {post.type === 'Deals' && (
                              <div className="bg-[#292828]/5 p-3 rounded-xl border border-[#292828]/10 mt-auto">
                                 <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-bold text-[#292828] uppercase">Current Bid</span>
                                    <span className="text-[10px] font-bold text-[#E53935]">{post.budget}</span>
                                 </div>
                                 <div className="h-1 w-full bg-slate-200 rounded-full">
                                    <div className="h-full bg-[#E53935] rounded-full" style={{ width: '65%' }} />
                                 </div>
                              </div>
                           )}

                           {post.type === 'Meets' && (
                              <div className="bg-green-50 p-3 rounded-xl border border-green-100 mt-auto flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-green-600" />
                                    <span className="text-[10px] font-bold text-green-700 uppercase">Live Session</span>
                                 </div>
                                 <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                              </div>
                           )}

                           {post.type === 'Events' && (
                              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 mt-auto flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <Building size={14} className="text-indigo-600" />
                                    <span className="text-[10px] font-bold text-indigo-700 uppercase">Business Event</span>
                                 </div>
                              </div>
                           )}

                           {!['Deals', 'Meets', 'Events'].includes(post.type) && post.images && (
                              <div className="h-24 w-full rounded-xl overflow-hidden border border-[#292828]/10 mt-auto">
                                 <img src={post.images[0]} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/post:grayscale-0" alt="" />
                              </div>
                           )}
                        </div>

                        <div className="px-5 pb-5 pt-0 flex items-center justify-between mt-auto">
                           <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleLike(post.id)}
                                className={cn("flex items-center gap-1 transition-all active:scale-125", post.isLiked ? "text-[#E53935]" : "text-slate-400")}
                              >
                                 <HeartIcon size={14} fill={post.isLiked ? "currentColor" : "none"} />
                              </button>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-normal">{post.time}</span>
                           </div>
                           
                           <button 
                              onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }}
                              className="h-8 w-8 bg-[#E53935] text-white rounded-lg flex items-center justify-center transition-all hover:bg-[#292828] shadow-lg active:scale-95 group/connect"
                           >
                              <ArrowUpRight size={14} className="group-hover/connect:translate-x-0.5 group-hover/connect:-translate-y-0.5 transition-transform" />
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border-slate-100 overflow-hidden transition-all duration-500 rounded-[2rem] border shadow-2xl shadow-slate-200/10 hover:border-[#E53935]/10">
                         <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                               <div className="relative">
                                  <div className="block h-11 w-11 rounded-xl overflow-hidden border border-[#292828]/5 shadow-sm hover:scale-105 active:scale-95 transition-all">
                                     <img src={post.avatar} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className={cn(
                                     "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm z-10",
                                     post.id % 3 === 0 ? "bg-green-500" : post.id % 3 === 1 ? "bg-amber-500" : "bg-slate-300"
                                  )} />
                               </div>
                               <div>
                                  <div className="flex items-center gap-3">
                                     <span className="text-[15px] font-bold text-[#292828] leading-tight hover:text-[#E53935] transition-colors">{post.author}</span>
                                     <div className={cn(
                                        "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border",
                                        post.type === 'Deals' ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-500 border-slate-100"
                                     )}>
                                        {post.type}
                                     </div>
                                     {post.verified && <CheckCircle2 size={14} className="text-[#E53935]" />}
                                  </div>
                                  <p className="text-xs font-bold text-slate-400 uppercase mt-0.5 whitespace-nowrap flex items-center gap-2">
                                     {post.time}
                                     <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                     <span className={cn(
                                        "text-[10px]",
                                        post.id % 3 === 0 ? "text-green-600" : post.id % 3 === 1 ? "text-amber-500" : "text-slate-400"
                                     )}>
                                        {post.id % 3 === 0 ? "Active" : post.id % 3 === 1 ? "Away" : "Offline"}
                                     </span>
                                  </p>
                               </div>
                            </div>
                         </div>

                         <div className="px-6 pb-6 space-y-4">
                            <p className="text-base text-slate-700 leading-relaxed font-medium line-clamp-3 group-hover/post:line-clamp-none transition-all">
                               {post.content}
                            </p>

                            {post.type === 'Deals' && (
                               <div className="mt-4 relative group/post">
                                  <div className="absolute -left-1 top-3 bottom-3 w-1.5 bg-red-600 rounded-full z-10" />
                                  <div className="bg-white rounded-2xl border border-[#292828]/10 overflow-hidden shadow-lg shadow-slate-200/50 flex flex-col transition-all hover:shadow-xl">
                                     <div className="bg-[#292828] px-5 py-2.5 flex items-center justify-between">
                                        <div className="flex items-center gap-2"><p className="text-xs font-bold uppercase text-white/50">ID: {post.id}88</p></div>
                                        <div className="flex items-center gap-3">
                                           <span className="text-xs font-bold text-[#E53935] uppercase">12 Bids Active</span>
                                           <span className="text-xs font-bold text-white/30 uppercase">Ends in: 4h</span>
                                        </div>
                                     </div>
                                     <div className="p-6 flex flex-col md:flex-row gap-4 items-start">
                                        <div className="flex-1">
                                           <div className="flex items-center gap-2 mb-1.5 text-[#292828]"><h3 className="text-lg font-bold uppercase leading-tight">{post.title || "Business Opportunity"}</h3><CheckCircle2 size={16} className="text-red-600 ml-2 inline" /></div>
                                           <p className="text-[#292828] text-sm font-medium leading-relaxed">{post.content || "Looking for a partner..."}</p>
                                        </div>
                                        <div className="shrink-0 bg-[#292828]/5 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[120px] border border-[#292828]/10">
                                           <p className="text-xs font-bold text-[#292828] uppercase mb-1">Value</p>
                                           <p className="text-xl font-bold text-[#292828]">{post.budget}</p>
                                        </div>
                                     </div>
                                     <div className="p-4 border-t border-[#292828]/5">
                                        <div className="grid grid-cols-2 gap-2">
                                           <button onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }} className="h-11 bg-[#E53935] text-white rounded-xl text-xs font-bold uppercase hover:bg-[#292828] transition-all">I'm Interested</button>
                                           <button onClick={() => setActiveBidPostId(post.id)} className="h-11 bg-[#292828] text-white rounded-xl text-xs font-bold uppercase hover:bg-black transition-all">Place Bid</button>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            )}

                            {post.type === 'Meets' && (
                               <div className="mt-6 p-4 rounded-3xl bg-white border-2 border-dashed border-green-200 flex items-center justify-between group/action hover:border-green-500 transition-all shadow-sm">
                                  <div className="flex items-center gap-4">
                                     <div className="h-12 w-12 rounded-2xl bg-[#292828] flex items-center justify-center text-white"><Calendar size={22} /></div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div><p className="text-xs font-bold uppercase text-[#292828] leading-none mb-1.5">Venue</p><p className="text-sm font-bold text-[#292828]">Hub Cafe</p></div>
                                        <div><p className="text-xs font-bold uppercase text-[#292828] leading-none mb-1.5">Status</p><p className="text-sm font-bold text-green-600 flex items-center gap-1.5">Live <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" /></p></div>
                                     </div>
                                  </div>
                                   <button 
                                     onClick={() => {
                                       setJoinedMeetings(prev => [...prev, post.id]);
                                       alert(`Meeting Access Secured. ID: MSME-${post.id}-SYNC. Joining link sent to your broadcast hub.`);
                                     }} 
                                     className={cn("h-12 px-8 rounded-2xl text-xs font-bold uppercase transition-all", joinedMeetings.includes(post.id) ? "bg-[#292828] text-white" : "bg-green-600 text-white shadow-lg")}
                                   >
                                      {joinedMeetings.includes(post.id) ? "Booked" : "Join"}
                                   </button>
                               </div>
                            )}
                             {post.type === 'Jobs' && (
                                <div className="mt-4 relative overflow-hidden p-4 rounded-2xl bg-[#292828] text-white flex items-center justify-between group/action shadow-xl">
                                   <div className="absolute top-0 right-0 h-full w-24 bg-red-600/10 blur-3xl opacity-50" />
                                   <div className="flex items-center gap-3 relative z-10">
                                      <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-red-500">
                                         <Briefcase size={20} />
                                      </div>
                                      <div>
                                         <p className="text-xs font-bold uppercase text-white/40 leading-none mb-1">Job Opening</p>
                                         <p className="text-sm font-bold uppercase">Principal Engineer</p>
                                      </div>
                                   </div>
                                   <button className="relative z-10 h-10 px-6 bg-red-600 text-white rounded-xl text-xs font-bold uppercase active:scale-95 transition-all shadow-lg shadow-red-500/20">Apply</button>
                                </div>
                             )}

                             {post.type === 'Partners' && (
                                <div className="mt-6 p-0 rounded-[2rem] bg-white border-2 border-[#292828] flex flex-col overflow-hidden shadow-2xl shadow-[#292828]/5 group/action hover:shadow-[#292828]/10 transition-all">
                                   <div className="bg-[#292828] px-6 py-3 flex items-center justify-between">
                                      <div className="flex items-center gap-2.5">
                                         <Target size={16} className="text-red-500" />
                                         <p className="text-xs font-bold uppercase text-white">Partnership Opportunity</p>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                         <div className="h-1 w-1 bg-red-500 rounded-full animate-ping" />
                                         <span className="text-xs font-bold text-white/40 uppercase">Active Now</span>
                                      </div>
                                   </div>
                                   <div className="p-6">
                                      <div className="flex flex-col md:flex-row items-center gap-6">
                                         <div className="flex -space-x-3 shrink-0">
                                            {[1, 2, 3].map(i => (
                                               <div key={i} className="h-10 w-10 rounded-xl border-2 border-white bg-[#292828]/5 flex items-center justify-center overflow-hidden shadow-sm grayscale hover:grayscale-0 transition-transform hover:scale-110 active:scale-90">
                                                  <img src={`https://i.pravatar.cc/150?u=synergy${i}`} alt="" />
                                               </div>
                                            ))}
                                         </div>
                                         <div className="flex-1 min-w-0 text-center md:text-left">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#292828]/5 border border-[#292828]/10 mb-2">
                                               <p className="text-xs font-bold uppercase text-[#292828]">Details</p>
                                            </div>
                                            <p className="text-sm font-bold text-[#292828] leading-tight line-clamp-2">Scaling Logistics • Joint MSME Venture</p>
                                         </div>
                                         <button 
                                           onClick={() => alert(`Strategic Proposal transmitted for project ID: ${post.id}. Target partners will be notified immediately.`)}
                                           className="shrink-0 w-full md:w-auto h-11 px-8 bg-red-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-[#292828] transition-all shadow-lg active:scale-95"
                                         >
                                            Send Proposal
                                         </button>
                                      </div>
                                   </div>
                                </div>
                             )}

                             {post.type === 'Posts' && (
                                <div className="mt-6 flex items-center gap-3 py-4 border-t border-[#292828]/5 text-[#292828] text-sm font-medium">
                                   <Activity size={16} className="text-red-500" />
                                   Platform Update Active
                                </div>
                             )}

                             {post.type === 'Events' && (
                                <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-start gap-2 shadow-sm">
                                   <div className="flex items-center gap-2">
                                      <Building size={14} className="text-indigo-600" />
                                      <span className="text-[10px] font-bold text-indigo-700 uppercase">Verified Business Event</span>
                                   </div>
                                </div>
                             )}

                            {!['Deals', 'Events'].includes(post.type) && post.images && (
                               <div className="rounded-2xl overflow-hidden border border-[#292828]/10 shadow-lg lg:grayscale transition-all duration-700 group-hover/post:grayscale-0 mt-4">
                                  <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                               </div>
                            )}
                         </div>

                         <div className="px-6 py-4 bg-[#292828]/5/50 border-t border-[#292828]/5 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                               <button onClick={() => handleLike(post.id)} className={cn("flex items-center gap-1.5 group/btn transition-all active:scale-125", post.isLiked ? "text-[#E53935]" : "text-[#292828]")}>
                                  <HeartIcon size={22} fill={post.isLiked ? "currentColor" : "none"} />
                                  <span className="font-bold">{post.likes}</span>
                               </button>
                               <button onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} className="flex items-center gap-2 group/btn transition-all text-[#292828]">
                                  <MessageSquare size={18} /><span className="text-sm font-bold">{post.comments?.length || 0}</span>
                                </button>
                             </div>
                             <button onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }} className="bg-[#E53935] text-white rounded-xl flex items-center transition-all duration-500 hover:bg-[#292828] shadow-lg active:scale-95 group/connect h-10 overflow-hidden w-10 hover:w-[110px]">
                                <div className="h-10 w-10 flex items-center justify-center shrink-0"><ArrowUpRight size={18} className="transition-transform duration-500 group-hover/connect:rotate-45" /></div>
                                <span className="text-[10px] font-bold uppercase whitespace-nowrap opacity-0 group-hover/connect:opacity-100 transition-all duration-500 overflow-hidden ml-0 group-hover/connect:ml-1 pr-4">Connect</span>
                             </button>
                          </div>

                          {activeCommentPostId === post.id && (
                             <div className="px-6 py-6 bg-[#292828]/5/30 border-t border-[#292828]/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                                   {post.comments?.map((comment: any) => (
                                      <div key={comment.id} className="flex gap-4">
                                         <div className="h-8 w-8 bg-[#292828]/10 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-[#292828]">
                                            {comment.user[0]}
                                         </div>
                                         <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                               <p className="text-xs font-bold text-[#292828]">{comment.user}</p>
                                               <p className="text-xs font-bold text-[#292828]">{comment.time}</p>
                                            </div>
                                            <p className="text-sm text-[#292828] font-medium leading-relaxed">{comment.text}</p>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                                <div className="flex items-center gap-3 pt-4">
                                   <div className="h-9 w-9 bg-[#292828]/10 rounded-xl shrink-0 border border-white shadow-sm flex items-center justify-center text-xs font-bold text-[#E53935]">Y</div>
                                   <div className="flex-1 relative">
                                      <input 
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                        placeholder="Write a comment..."
                                        className="w-full h-10 bg-white border border-[#292828]/10 rounded-xl px-4 text-sm font-bold text-[#292828] placeholder:text-[#292828]/40 focus:outline-none focus:border-[#E53935]/20 shadow-inner"
                                      />
                                      <button onClick={() => handleAddComment(post.id)} className="absolute right-1 top-1 h-8 px-3 bg-[#E53935] text-white rounded-lg text-xs font-bold uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-all">Send</button>
                                   </div>
                                </div>
                             </div>
                          )}
                       </div>
                     )}
                  </div>
                ))}
            </div>
         </div>
      </main>

      <aside className="hidden lg:flex flex-col w-[400px] h-screen sticky top-0 bg-slate-50/50 p-6 lg:p-8 gap-10 overflow-y-auto no-scrollbar border-l border-slate-100/50">
         
         <div className="group/hub">
            <div className="cursor-pointer">
               <div className="flex items-center justify-between mb-6 px-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
                     <h4 className="text-xs font-bold text-[#292828] uppercase">Live Map</h4>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-[#292828]/10 rounded-xl shadow-sm">
                     <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                     <span className="text-xs font-bold text-[#292828] uppercase">Active Now</span>
                  </div>
               </div>
               
               <div className="relative h-[320px] bg-[#F1F5F9] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_rgba(41,40,40,0.1)] group transition-all duration-700 ring-4 ring-white cursor-pointer group-hover/hub:ring-[#E53935]/10">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#292828_1px,transparent_1px)] [background-size:15px_15px]" />
                  
                  <svg className="absolute inset-0 w-full h-full text-[#292828]/40 pointer-events-none scale-75 -translate-x-10" viewBox="0 0 400 320" fill="none">
                     <path d="M0,0 L120,0 C130,50 110,150 140,200 C160,250 130,300 120,320 L0,320 Z" fill="currentColor" fillOpacity="0.1" />
                     <path d="M120,0 C130,50 110,150 140,200 C160,250 130,300 120,320" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="5 5" />
                     <path d="M140,40 L400,40 M140,120 L400,120 M140,200 L400,200 M140,280 L400,280" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1" />
                  </svg>

                  <div className="absolute inset-0 z-10 pointer-events-none scale-90">
                     <div className="absolute top-[30%] left-[45%] h-8 w-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl flex items-center justify-center text-blue-600 shadow-xl animate-pulse">
                        <Users size={14} />
                     </div>
                     <div className="absolute top-[60%] left-[75%] h-8 w-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl flex items-center justify-center text-amber-600 shadow-xl animate-pulse [animation-delay:1s]">
                        <Coffee size={14} />
                     </div>
                     <div className="absolute top-[20%] left-[80%] h-10 w-10 bg-[#E53935] border-2 border-white rounded-xl flex items-center justify-center text-white shadow-xl animate-bounce">
                        <Zap size={16} fill="currentColor" />
                     </div>
                  </div>
   
                  <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-white/90 via-white/40 to-transparent z-20">
                     <div className="flex items-end justify-between">
                        <div>
                           <p className="text-3xl font-bold text-[#292828] mb-1 uppercase">Trivandrum</p>
                           <p className="text-xs font-bold text-[#E53935] uppercase">Live City Hub</p>
                        </div>
                        <div className="bg-[#292828] px-4 py-3 rounded-2xl border border-slate-800 text-right shadow-xl">
                           <p className="text-2xl font-bold text-white leading-none mb-1">1.4k</p>
                           <p className="text-[10px] font-bold uppercase text-white/40">Active Nodes</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 🔴 RECOMMENDED PEOPLE (RELOCATED TO BOTTOM OF SIDEBAR) */}
         <div className="relative group/sync overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[#E53935] rounded-[2.5rem] blur-3xl opacity-10 group-hover/sync:opacity-20 transition-opacity" />
            <div className="relative p-8 bg-gradient-to-br from-[#E53935] to-[#B71C1C] rounded-[2.5rem] shadow-2xl overflow-hidden group">
               <TrendingUp size={140} className="absolute -right-10 -bottom-10 text-white/10 group-hover/sync:rotate-12 transition-transform duration-[4s]" />
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xl">
                        <Users size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-white uppercase leading-tight">Recommended People</h3>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-normal">12 New partners found for you</p>
                     </div>
                  </div>
                  <button 
                     onClick={startMatching}
                     className="w-full py-4 bg-white text-[#E53935] rounded-xl font-bold text-[10px] uppercase shadow-xl hover:bg-[#292828] hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                     Connect Now <ArrowRight size={14} />
                  </button>
               </div>
            </div>
         </div>
      </aside>

       {/* PARTNER SYNC ENGINE MODAL */}
       {isMatching && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-10">
            <div className="absolute inset-0 bg-[#292828]/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsMatching(false)} />
            
            <div className="relative w-full max-w-4xl bg-white rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500">
               {matchingStep === 1 ? (
                  <div className="p-20 flex flex-col items-center justify-center text-center">
                     <div className="relative h-40 w-40 mb-12">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-4 border-4 border-[#292828] border-b-transparent rounded-full animate-spin [animation-direction:reverse]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Users size={48} className="text-[#292828] animate-pulse" />
                        </div>
                     </div>
                     <h3 className="text-3xl font-bold text-[#292828] uppercase mb-4 tracking-normal">Scanning Smart Network</h3>
                     <p className="text-slate-400 font-bold uppercase text-[13px] tracking-normal mb-8">AI Matching Hub • MSME Kerala Region</p>
                     
                     <div className="flex gap-2">
                        <div className="h-1.5 w-8 bg-[#E53935] rounded-full animate-pulse" />
                        <div className="h-1.5 w-8 bg-slate-100 rounded-full animate-pulse [animation-delay:0.2s]" />
                        <div className="h-1.5 w-8 bg-slate-100 rounded-full animate-pulse [animation-delay:0.4s]" />
                     </div>
                  </div>
               ) : (
                  <div className="flex flex-col h-full max-h-[90vh]">
                     <div className="bg-[#292828] px-10 py-10 flex items-center justify-between shrink-0">
                        <div>
                           <h3 className="text-3xl font-bold text-white uppercase leading-none mb-2">Network Sync Found</h3>
                           <p className="text-white/40 font-bold text-xs uppercase tracking-normal">12 Strategic MSME matches in your sector</p>
                        </div>
                        <button onClick={() => setIsMatching(false)} className="h-12 w-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all">
                           <X size={24} />
                        </button>
                     </div>
                     
                     <div className="p-10 overflow-y-auto no-scrollbar space-y-6">
                        {[
                          { name: "Global Logistics Ltd", distance: "4.2km", match: "98%", type: "Wholesaler" },
                          { name: "Techno Distribution", distance: "8.1km", match: "94%", type: "Distributor" },
                          { name: "Kerala Agri-Sync", distance: "12km", match: "91%", type: "Partner" },
                          { name: "South Supply Hub", distance: "15km", match: "89%", type: "Vendor" }
                        ].map((partner, i) => (
                           <div key={i} className="group p-6 rounded-[2.5rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-2xl transition-all flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className="h-16 w-16 rounded-2xl bg-[#292828] flex items-center justify-center text-white shadow-lg group-hover:bg-[#E53935] transition-colors">
                                    <Building size={28} />
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-3 mb-1">
                                       <h4 className="text-lg font-bold text-[#292828] uppercase">{partner.name}</h4>
                                       <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-[#292828] uppercase">{partner.type}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5"><MapPin size={12} /> {partner.distance} Away</span>
                                       <span className="text-xs font-bold text-green-600 uppercase flex items-center gap-1.5"><ShieldCheck size={12} /> {partner.match} Match Rate</span>
                                    </div>
                                 </div>
                              </div>
                              <button 
                                onClick={() => {
                                  alert(`Pitch sent to ${partner.name}. They will be notified via the Smart Sync hub.`);
                                  setIsMatching(false);
                                }}
                                className="h-14 px-8 bg-[#E53935] text-white rounded-2xl text-[13px] font-bold uppercase shadow-xl hover:bg-[#292828] transition-all active:scale-95"
                              >
                                Send Pitch
                              </button>
                           </div>
                        ))}
                     </div>
                     
                     <div className="p-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                        <p className="text-xs font-bold text-slate-400 uppercase">View more in global directory</p>
                        <button className="h-12 px-8 bg-[#292828] text-white rounded-xl text-xs font-bold uppercase hover:bg-black transition-all">Explore All</button>
                     </div>
                  </div>
               )}
            </div>
         </div>
       )}

      {/* DEAL ENGINE MODAL */}
      {selectedDeal && (
        <DealEngine 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          deal={selectedDeal} 
        />
      )}
    </div>
  );
}
