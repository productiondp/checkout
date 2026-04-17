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
  ImageIcon,
  X,
  Building,
  MapPin,
  ShieldCheck,
  Video,
  Plus as PlusIcon
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
  const [activeBidPostId, setActiveBidPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    if (activeTab === "All") return posts;
    return posts.filter(p => p.type.toLowerCase() === activeTab.toLowerCase());
  }, [activeTab, posts]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white lg:bg-[#FDFDFF] font-sans selection:bg-[#E53935]/10 overscroll-none">
      <main className="flex-1 w-full lg:max-w-[780px] lg:ml-auto lg:mr-0 min-h-screen border-r border-[#292828]/10 bg-white relative">
         <div className="bg-white/95 backdrop-blur-xl border-b border-[#292828]/5 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-[#292828]/30 uppercase tracking-widest">Feed</span>
                  <div className="relative">
                     <select
                       value={activeTab}
                       onChange={(e) => setActiveTab(e.target.value)}
                       className="appearance-none bg-white border border-[#292828]/10 text-[11px] font-bold uppercase text-[#292828] rounded-xl px-4 pr-8 h-9 outline-none cursor-pointer shadow-sm hover:border-[#E53935]/30 transition-all focus:border-[#E53935]/40"
                     >
                       {['All', 'Update', 'Opportunities', 'Hiring', 'Partnership', 'Meeting'].map(tab => (
                         <option key={tab} value={tab}>{tab}</option>
                       ))}
                     </select>
                     <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                       <ChevronRight size={10} className="text-[#292828]/40 rotate-90" />
                     </div>
                  </div>
               </div>
                <div className="flex items-center gap-2">
                   <div className="flex bg-[#292828]/5 p-1 rounded-xl border border-[#292828]/5">
                      <button onClick={() => setViewMode("list")} className={cn("h-7 px-3 rounded-lg text-xs font-bold uppercase transition-all", viewMode === "list" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/40 hover:text-[#292828]")}>List</button>
                      <button onClick={() => setViewMode("grid")} className={cn("h-7 px-3 rounded-lg text-xs font-bold uppercase transition-all", viewMode === "grid" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828]/40 hover:text-[#292828]")}>Grid</button>
                   </div>
                   <button className="h-9 w-9 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828] hover:bg-[#292828] hover:text-white transition-all shadow-sm">
                      <SlidersHorizontal size={14} />
                   </button>
                </div>
            </div>

            <div className={cn(
               "bg-[#292828]/5 border border-[#292828]/10 rounded-2xl transition-all duration-500 overflow-hidden",
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
                              <h3 className="text-sm font-bold text-[#292828] uppercase leading-none mb-1">Create Update</h3>
                              <p className="text-xs font-bold uppercase text-[#292828]">Share with everyone</p>
                           </div>
                        </div>
                        <button onClick={() => setIsPosting(false)} className="h-8 w-8 rounded-xl flex items-center justify-center text-[#292828] hover:bg-slate-200 transition-all"><X size={18} /></button>
                     </div>

                     <div className="flex flex-wrap gap-2 mb-8">
                        {['General', 'Opportunities', 'Hiring', 'Partnership', 'Meeting'].map(type => (
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

                      {['Opportunities', 'Hiring', 'Partnership', 'Meeting'].includes(selectedPostType) ? (
                         <div className="space-y-4 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {selectedPostType === 'Opportunities' && (
                                  <>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Budget</p>
                                        <input type="text" placeholder="Specify budget range..." className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Deadline</p>
                                        <input type="text" placeholder="Project timeline..." className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                  </>
                               )}
                               {selectedPostType === 'Hiring' && (
                                  <>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Role</p>
                                        <input type="text" placeholder="Job title..." className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Location</p>
                                        <input type="text" placeholder="City or Remote..." className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                  </>
                               )}
                               {selectedPostType === 'Partnership' && (
                                  <>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Goal</p>
                                        <input type="text" placeholder="Collaboration type..." className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Market</p>
                                        <input type="text" placeholder="Industry sector..." className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                  </>
                               )}
                               {selectedPostType === 'Meeting' && (
                                  <>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Venue</p>
                                        <input type="text" placeholder="Location..." className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                     <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase text-[#292828] ml-1">Schedule</p>
                                        <input type="text" placeholder="Date and Time..." className="w-full bg-white px-5 py-4 rounded-xl border border-[#292828]/10 text-sm font-bold text-[#292828] outline-none focus:border-slate-900 transition-all" />
                                     </div>
                                  </>
                               )}
                            </div>
                            <div className="space-y-1.5">
                               <textarea 
                                 autoFocus
                                 value={postContent}
                                 onChange={(e) => setPostContent(e.target.value)}
                                 placeholder="Tell us more about it..."
                                 className="w-full bg-white p-6 rounded-[1.5rem] border border-[#292828]/10 text-[15px] font-bold text-[#292828] placeholder:text-[#292828]/20 outline-none resize-none min-h-[120px] shadow-sm focus:border-slate-900 transition-all"
                               />
                            </div>
                         </div>
                      ) : (
                         <textarea 
                           autoFocus
                           value={postContent}
                           onChange={(e) => setPostContent(e.target.value)}
                           placeholder="Describe your update..."
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

         <div className="px-3 lg:px-4 py-6">
            <div className={cn(
               "pb-40 lg:pb-32",
               viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6" : "space-y-8"
            )}>
               {filteredPosts.map(post => (
                  <div key={post.id} className="group/post relative">
                    {viewMode === "grid" ? (
                      <div className={cn(
                        "bg-white rounded-[2rem] border-2 transition-all duration-500 flex flex-col h-full overflow-hidden",
                        post.type === 'Opportunities' ? "border-[#E53935]/10 hover:border-[#E53935]" : "border-[#292828]/5 hover:border-[#292828]"
                      )}>
                        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                           <Link href={`/profile/${post.authorId}`} className="flex items-center gap-2 group/author">
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
                           </Link>
                           <div className={cn(
                              "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border",
                              post.type === 'Opportunities' ? "bg-red-50 text-red-600 border-red-100" : "bg-[#292828]/5 text-[#292828] border-[#292828]/10"
                           )}>
                              {post.type}
                           </div>
                        </div>

                        <div className="px-5 pb-5 flex-1 flex flex-col gap-3">
                           <p className="text-sm font-bold text-slate-700 leading-snug line-clamp-2">
                              {post.content}
                           </p>

                           {post.type === 'Opportunities' && (
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

                           {post.type === 'Meeting' && (
                              <div className="bg-green-50 p-3 rounded-xl border border-green-100 mt-auto flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-green-600" />
                                    <span className="text-[10px] font-bold text-green-700 uppercase">Live Session</span>
                                 </div>
                                 <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                              </div>
                           )}

                           {!['Opportunities', 'Meeting'].includes(post.type) && post.images && (
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
                                 <Heart size={14} fill={post.isLiked ? "currentColor" : "none"} />
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
                      <div className="relative group/aurora transition-all duration-700">
                         {/* DYNAMIC AURA GLOW */}
                         <div className={cn(
                           "absolute -inset-2 rounded-[2rem] opacity-0 blur-2xl transition-opacity duration-1000 group-hover/aurora:opacity-20 pointer-events-none",
                           post.type === 'Opportunities' ? "bg-red-500" : post.type === 'Meeting' ? "bg-green-500" : "bg-blue-500"
                         )} />
                         
                         <div className="relative bg-white/70 backdrop-blur-2xl border border-white hover:border-[#292828]/30 overflow-hidden rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-500">
                            {/* BRUTALIST STATUS STRIP */}
                            <div className={cn(
                               "h-1 w-full",
                               post.type === 'Opportunities' ? "bg-[#E53935]" : post.type === 'Meeting' ? "bg-green-500" : "bg-slate-200"
                            )} />

                            <div className={cn(
                               "px-5",
                               post.type === 'Update' ? "pt-3 pb-1" : "pt-4 pb-4"
                            )}>
                               {/* AURORA HEADER */}
                               <div className={cn(
                                 "flex items-center justify-between px-4 pt-4",
                                 post.type === 'Update' ? "mb-2" : "mb-3"
                               )}>
                                  <div className="flex items-center gap-2.5">
                                     <div className="relative group/avatar">
                                        <Link href={`/profile/${post.authorId}`} className="block h-9 w-9 rounded-lg overflow-hidden border border-white shadow-md bg-slate-100 transition-all group-hover/avatar:scale-105">
                                           <img src={post.avatar} alt="" className="w-full h-full object-cover" />
                                        </Link>
                                     </div>
                                     <div>
                                        <Link href={`/profile/${post.authorId}`} className="text-[13px] font-black text-[#292828] uppercase tracking-tight hover:text-[#E53935] transition-colors">{post.author}</Link>
                                        <div className="flex items-center gap-1.5">
                                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{post.type}</span>
                                           <span className="h-0.5 w-0.5 bg-slate-300 rounded-full" />
                                           <span className="text-[8px] font-bold text-[#E53935] uppercase">Online</span>
                                        </div>
                                     </div>
                                  </div>
                               </div>

                               {/* CONTENT STACK */}
                               <div className={post.type === 'Update' ? "space-y-2" : "space-y-4"}>
                                  {post.type !== 'Opportunities' && (
                                     <p className={cn(
                                       "text-[#292828] leading-[1.35] transition-all",
                                       post.type === 'Update' ? "text-sm font-bold text-slate-900" : "text-[15px] font-medium"
                                     )}>
                                        {post.content}
                                     </p>
                                  )}

                                  {post.type === 'Opportunities' && (
                                     <div className="bg-white rounded-xl p-4 text-[#292828] overflow-hidden relative group/opp-card border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                                        <div className="relative z-10 space-y-4">
                                           <div className="flex items-start justify-between">
                                              <div className="flex items-center gap-3">
                                                 <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#E53935] shadow-sm"><Target size={18} /></div>
                                                 <div>
                                                    <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest leading-none mb-1">New Deal</p>
                                                    <h3 className="text-sm font-black uppercase leading-tight">{post.title || "Business Venture"}</h3>
                                                 </div>
                                              </div>
                                              <div className="text-right">
                                                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Budget</p>
                                                 <p className="text-2xl font-black text-[#E53935] leading-none tracking-tighter">{post.budget}</p>
                                              </div>
                                           </div>

                                           <div className="flex items-center justify-between pt-1">
                                              <p className="text-[10px] font-bold text-slate-400 uppercase">Closing Soon</p>
                                              <div className="flex gap-2">
                                                 <button onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }} className="h-9 px-6 bg-slate-50 border border-slate-100 text-[#292828] rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-all">View</button>
                                                 <button onClick={() => setActiveBidPostId(activeBidPostId === post.id ? null : post.id)} className="h-9 px-8 bg-[#E53935] text-white rounded-xl text-[10px] font-black uppercase hover:bg-[#292828] transition-all active:scale-95">Bid Now</button>
                                              </div>
                                           </div>

                                           {activeBidPostId === post.id && (
                                              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 animate-in zoom-in-95 duration-200 mt-2">
                                                 <div className="flex items-center gap-3">
                                                    <input type="number" placeholder="Enter Amount" className="flex-1 h-10 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935]" />
                                                    <button onClick={() => { alert("Bid Confirmed"); setActiveBidPostId(null); }} className="h-10 px-6 bg-[#292828] text-white rounded-xl text-xs font-black uppercase active:scale-95 shadow-md">Confirm</button>
                                                 </div>
                                              </div>
                                           )}
                                        </div>
                                     </div>
                                  )}

                                  {post.type === 'Meeting' && (
                                     <div className="bg-white rounded-xl border border-slate-100 p-3.5 shadow-sm transition-all group/meet-card overflow-hidden relative">
                                        <div className="flex items-start justify-between mb-3">
                                           <div className="flex items-center gap-3">
                                              <div className="h-10 w-10 bg-green-50 border border-green-100/50 rounded-lg flex items-center justify-center text-green-600 shadow-sm"><Video size={18} /></div>
                                              <div>
                                                 <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest leading-none mb-1">Meetup Session</p>
                                                 <h3 className="text-[14px] font-black uppercase text-[#292828] leading-tight">{post.title || "Business Meetup"}</h3>
                                              </div>
                                           </div>
                                           <div className="px-2 py-0.5 bg-green-50 border border-green-100 rounded text-[7px] font-black uppercase text-green-600 flex items-center gap-1">
                                              <span className="h-1 w-1 bg-green-500 rounded-full animate-ping" />
                                              Active
                                           </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                           <div className="flex -space-x-1.5 align-center">
                                              {[1,2,3].map(i => (
                                                 <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} alt="" />
                                                 </div>
                                              ))}
                                              <div className="text-[9px] font-bold text-slate-400 ml-3 self-center uppercase">Join Network</div>
                                           </div>
                                           <button className="h-9 px-8 bg-[#292828] text-white rounded-xl text-[10px] font-black uppercase hover:opacity-90 transition-all active:scale-95 shadow-sm">Join</button>
                                        </div>
                                     </div>
                                  )}

                                  {post.type === 'Hiring' && (
                                     <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-3.5 shadow-sm transition-all group/role-card overflow-hidden relative">
                                        <div className="flex items-center justify-between mb-3">
                                           <div className="flex items-center gap-3">
                                              <div className="h-9 w-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[#292828] shadow-sm"><Briefcase size={16} /></div>
                                              <div>
                                                 <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest leading-none mb-1">Open Role</p>
                                                 <h3 className="text-[14px] font-black uppercase text-[#292828] leading-tight">{post.title || "Senior Partner"}</h3>
                                              </div>
                                           </div>
                                           <div className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[7px] font-black uppercase text-slate-500 tracking-tighter shadow-sm">Executive</div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                           <div className="flex gap-1.5">
                                              {['Strategy', 'Network'].map((tag) => (
                                                 <span key={tag} className="px-2 h-5 bg-white border border-slate-200 rounded text-[8px] font-bold text-[#292828] flex items-center uppercase shadow-sm">{tag}</span>
                                              ))}
                                           </div>
                                           <button className="h-9 px-6 bg-[#292828] text-white rounded-xl text-[10px] font-black uppercase hover:opacity-90 transition-all active:scale-95 shadow-sm">Apply</button>
                                        </div>
                                     </div>
                                  )}

                                  {post.type === 'Partnership' && (
                                     <div className="bg-white rounded-xl border-l-[3px] border-[#E53935] border-y border-r border-slate-100 p-3.5 shadow-sm transition-all group/partner-card relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-3">
                                           <div className="flex items-center gap-3">
                                              <div className="h-9 w-9 bg-red-50 rounded-lg flex items-center justify-center text-[#E53935] shadow-sm"><Users size={18} /></div>
                                              <div>
                                                 <p className="text-[8px] font-bold text-[#E53935] uppercase tracking-widest leading-none mb-0.5">Strategic Alliance</p>
                                                 <h3 className="text-[14px] font-black uppercase text-[#292828] leading-tight">{post.title || "Joint Venture"}</h3>
                                              </div>
                                           </div>
                                           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 rounded text-[7px] font-black uppercase text-[#E53935]">
                                              <span className="h-1 w-1 bg-[#E53935] rounded-full animate-ping" />
                                              Open
                                           </div>
                                        </div>
                                        
                                        <p className="text-[13px] text-[#292828] font-medium leading-relaxed mb-3">
                                           {post.content}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                           <div className="flex -space-x-2">
                                              {[1,2].map(i => (
                                                 <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400 overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="" />
                                                 </div>
                                              ))}
                                              <div className="h-6 w-6 rounded-full border-2 border-white bg-red-50 flex items-center justify-center text-[7px] font-black text-[#E53935]">+5</div>
                                           </div>
                                           <button className="h-9 px-6 bg-[#E53935] text-white rounded-xl text-[10px] font-black uppercase hover:bg-[#292828] transition-all active:scale-95 shadow-sm">Partner</button>
                                        </div>
                                     </div>
                                  )}

                                  {post.images && (
                                     <div className="rounded-xl overflow-hidden shadow-2xl relative group/img-node h-32 md:h-44">
                                        <img src={post.images[0]} alt="" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover/img-node:grayscale-0" />
                                     </div>
                                  )}
                               </div>

                               {/* AURA FOOTER */}
                               <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                  <div className="flex items-center gap-6">
                                     <button onClick={() => handleLike(post.id)} className={cn("flex items-center gap-1.5 transition-all active:scale-125", post.isLiked ? "text-[#E53935]" : "text-slate-300 hover:text-[#292828]")}>
                                        <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
                                        <span className="text-[12px] font-black">{post.likes}</span>
                                     </button>
                                     <button onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} className="flex items-center gap-1.5 transition-all text-slate-300 hover:text-[#292828]">
                                        <MessageSquare size={20} />
                                        <span className="text-[12px] font-black">{post.comments?.length || 0}</span>
                                     </button>
                                  </div>
                                  <button onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }} className="px-5 h-9 bg-white hover:bg-[#292828] hover:text-white text-[#292828] border border-slate-100 rounded-xl flex items-center gap-3 transition-all active:scale-95 shadow-sm group">
                                     <span className="text-[10px] font-black uppercase tracking-widest">Connect</span>
                                     <Plus size={14} className="text-[#E53935] group-hover:rotate-90 transition-transform" />
                                  </button>
                               </div>

                               {activeCommentPostId === post.id && (
                                  <div className="px-4 py-3 bg-black/5 rounded-lg border border-black/5 mt-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                     <div className="space-y-2.5 max-h-[200px] overflow-y-auto no-scrollbar">
                                        {post.comments?.map((comment: any) => (
                                           <div key={comment.id} className="flex gap-2.5">
                                              <div className="h-6 w-6 bg-[#292828]/10 rounded-md shrink-0 flex items-center justify-center text-[9px] font-bold text-[#292828]">
                                                 {comment.user[0]}
                                              </div>
                                              <div className="flex-1">
                                                 <div className="flex items-center justify-between">
                                                    <p className="text-[9px] font-bold text-[#292828]/60">{comment.user}</p>
                                                    <p className="text-[8px] font-bold text-slate-300 uppercase">{comment.time}</p>
                                                 </div>
                                                 <p className="text-[11px] text-[#292828]/80 font-medium leading-tight">{comment.text}</p>
                                              </div>
                                           </div>
                                        ))}
                                     </div>
                                     <div className="flex items-center gap-2 pt-2 border-t border-black/5">
                                        <div className="flex-1 relative">
                                           <input 
                                             type="text"
                                             value={newComment}
                                             onChange={(e) => setNewComment(e.target.value)}
                                             onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                             placeholder="Reply..."
                                             className="w-full h-8 bg-white border border-slate-100 rounded-md px-3 text-[10px] font-bold text-[#292828] placeholder:text-slate-300 focus:outline-none focus:border-[#E53935]/20"
                                           />
                                           <button onClick={() => handleAddComment(post.id)} className="absolute right-0.5 top-0.5 h-7 px-3 bg-[#292828] text-white rounded-md text-[9px] font-bold uppercase active:scale-95 transition-all">Send</button>
                                        </div>
                                     </div>
                                  </div>
                               )}
                            </div>
                         </div>
                      </div>
                    )}
                   </div>
                ))}
            </div>
         </div>
      </main>

      <aside className="hidden lg:flex flex-col w-[400px] h-screen sticky top-0 bg-slate-50/50 p-6 lg:p-8 gap-10 overflow-y-auto no-scrollbar border-l border-slate-100/50">
         <div className="group/hub">
            <Link href="/explore">
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
            </Link>
            
            <div className="relative h-48 w-full rounded-[2.5rem] overflow-hidden bg-[#292828] p-8 group-hover/hub:shadow-2xl transition-all duration-700">
               <div className="absolute top-0 right-0 w-40 h-40 bg-[#E53935]/10 blur-[60px] pointer-events-none animate-pulse" />
               <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                        <Zap size={20} className="text-[#E53935]" />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-white uppercase leading-tight">Smart Match Engine</h3>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-normal">12 Strategic MSME matches identified</p>
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

       {isMatching && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#292828]/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsMatching(false)} />
            <div className="relative w-full max-w-4xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
               {matchingStep === 1 ? (
                  <div className="p-20 flex flex-col items-center justify-center text-center">
                     <div className="relative h-40 w-40 mb-12">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Users size={48} className="text-[#292828] animate-pulse" />
                        </div>
                     </div>
                     <h3 className="text-3xl font-bold text-[#292828] uppercase mb-4 tracking-normal">Scanning Smart Network</h3>
                     <p className="text-slate-400 font-bold uppercase text-[13px] tracking-normal mb-8">AI Matching Hub • MSME Kerala Region</p>
                  </div>
               ) : (
                  <div className="flex flex-col h-full max-h-[90vh]">
                     <div className="bg-[#292828] px-10 py-10 flex items-center justify-between">
                        <div>
                           <h3 className="text-3xl font-bold text-white uppercase mb-2">Network Sync Found</h3>
                           <p className="text-white/40 font-bold text-xs uppercase">12 Strategic MSME matches in your sector</p>
                        </div>
                        <button onClick={() => setIsMatching(false)} className="h-12 w-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all">
                           <X size={24} />
                        </button>
                     </div>
                     <div className="p-10 overflow-y-auto no-scrollbar space-y-6">
                        {[
                          { name: "Global Logistics Ltd", distance: "4.2km", match: "98%", type: "Wholesaler" },
                          { name: "Techno Distribution", distance: "8.1km", match: "94%", type: "Distributor" }
                        ].map((partner, i) => (
                           <div key={i} className="group p-6 rounded-[2.5rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-2xl transition-all flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className="h-16 w-16 rounded-2xl bg-[#292828] flex items-center justify-center text-white shadow-lg group-hover:bg-[#E53935] transition-colors">
                                    <Building size={28} />
                                 </div>
                                 <div>
                                    <h4 className="text-lg font-bold text-[#292828] uppercase">{partner.name}</h4>
                                    <div className="flex items-center gap-4">
                                       <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5"><MapPin size={12} /> {partner.distance} Away</span>
                                       <span className="text-xs font-bold text-green-600 uppercase flex items-center gap-1.5"><ShieldCheck size={12} /> {partner.match} Match Rate</span>
                                    </div>
                                 </div>
                              </div>
                              <button onClick={() => setIsMatching(false)} className="h-14 px-8 bg-[#E53935] text-white rounded-2xl text-[13px] font-bold uppercase shadow-xl hover:bg-[#292828] transition-all">Send Pitch</button>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>
       )}

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
