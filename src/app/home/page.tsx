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
  Globe,
  Navigation,
  Clock, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_POSTS } from "@/lib/dummyData";
import DealEngine from "@/components/modals/DealEngine";
import PostModal from "@/components/modals/PostModal";
const BUSINESS_LEAD_TITLES = [
  "Strategic Partnership",
  "Capital Raise",
  "Service Contract",
  "Vendor Acquisition",
  "Joint Venture",
  "Tech Integration",
  "Logistics Partnership",
  "Marketing Mandate",
  "Other (Custom Title)"
];

const BUSINESS_REQUIREMENTS = [
  "Service Required",
  "Capital Needed",
  "Asset Acquisition",
  "Market Expansion",
  "Tech Development",
  "Distribution Reach",
  "Other"
];

const TASK_TYPES = [
  "Consultation",
  "Implementation",
  "Outsourcing",
  "Advisory",
  "Procurement",
  "Strategic Audit"
];

export default function EliteHomeFeed() {
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedPostType, setSelectedPostType] = useState<string>("Update");
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [joinedMeetings, setJoinedMeetings] = useState<number[]>([]);
  const [activeBidPostId, setActiveBidPostId] = useState<number | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingStep, setMatchingStep] = useState(0);
  const [businessLeadTitle, setBusinessLeadTitle] = useState("Select Title");
  const [customTitle, setCustomTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [budget, setBudget] = useState("");
  const [requirement, setRequirement] = useState("Service Required");
  const [taskType, setTaskType] = useState("Consultation");
  const [isNDAProtected, setIsNDAProtected] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  const handlePost = () => {
    if (!postContent.trim() && !attachment) return;

    const newPostObj = {
      id: posts.length + 1,
      type: selectedPostType,
      title: selectedPostType === 'Business Leads' 
        ? (businessLeadTitle === "Other (Custom Title)" ? customTitle : (businessLeadTitle === "Select Title" ? undefined : businessLeadTitle))
        : undefined,
      budget: selectedPostType === 'Business Leads' ? budget : undefined,
      dueDate: selectedPostType === 'Business Leads' ? dueDate : undefined,
      author: "User",
      authorId: 1,
      time: "Just now",
      content: postContent,
      images: attachment ? [URL.createObjectURL(attachment)] : undefined,
      matchScore: 100,
      avatar: "/placeholder-user.jpg",
      verified: true,
      likes: 0,
      isLiked: false,
      comments: [],
      requirement: selectedPostType === 'Business Leads' ? requirement : undefined,
      taskType: selectedPostType === 'Business Leads' ? taskType : undefined,
      isNDA: isNDAProtected,
      isUrgent: isUrgent
    };

    setPosts([newPostObj, ...posts]);
    setIsPosting(false);
    setPostContent("");
    setAttachment(null);
    setBusinessLeadTitle("Select Title");
    setCustomTitle("");
    setBudget("");
    setDueDate("");
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
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white font-sans overflow-x-hidden">
      
      <main className="flex-1 w-full min-h-screen border-r border-[#292828]/10 bg-white relative">
         
         <div className="bg-white/95 backdrop-blur-xl border-b border-[#292828]/5 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between mb-4">
               <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
                   {(['All', 'Update', 'Business Leads', 'Hiring', 'Partnership', 'Meeting'] as const).map(tab => (
                    <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab)}
                     className={cn(
                       "px-2 py-1.5 text-xs font-bold uppercase transition-all shrink-0 relative",
                       activeTab === tab ? "text-[#E53935]" : "text-[#292828] hover:text-[#292828]"
                     )}
                    >
                       {tab}
                       {activeTab === tab && <div className="absolute -bottom-1.5 left-2 right-2 h-1 bg-[#E53935] rounded-full shadow-lg shadow-red-500/20" />}
                    </button>
                  ))}
               </div>
                <div className="flex items-center gap-2">
                   <div className="flex bg-[#292828]/5 p-1 rounded-xl">
                      <button onClick={() => setViewMode("list")} className={cn("h-7 px-3 rounded-lg text-xs font-bold uppercase transition-all", viewMode === "list" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828] hover:text-[#292828]")}>List</button>
                      <button onClick={() => setViewMode("grid")} className={cn("h-7 px-3 rounded-lg text-xs font-bold uppercase transition-all", viewMode === "grid" ? "bg-white text-[#292828] shadow-sm" : "text-[#292828] hover:text-[#292828]")}>Grid</button>
                   </div>
                   <button className="h-9 w-9 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828] hover:bg-[#292828] hover:text-white transition-all shadow-sm">
                      <SlidersHorizontal size={14} />
                   </button>
                </div>
            </div>
         </div>

         <div className="px-4 lg:px-8 py-6">
            <div className={cn(
                "relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                isPosting ? "mb-12" : "mb-8"
            )}>
                {!isPosting ? (
                  <div className="group/composer relative bg-white border border-[#292828]/10 rounded-[1.43rem] p-2 pr-2.5 flex items-center gap-4 transition-all hover:bg-[#FDFDFF] hover:border-[#292828]/30 hover:shadow-[0_20px_50px_rgba(41,40,40,0.06)] hover:-translate-y-0.5">
                     <div className="h-11 w-11 rounded-[0.845rem] overflow-hidden border-2 border-white shadow-xl shrink-0 ml-1 bg-[#292828]/10 flex items-center justify-center">
                        <Users size={20} className="text-[#292828]/20" />
                     </div>
                     <button 
                        onClick={() => setIsPosting(true)} 
                        className="flex-1 text-left text-[14px] font-black text-[#292828]/30 px-2 uppercase"
                     >
                        Share a business update...
                     </button>
                     <div className="flex items-center gap-2">
                        <button onClick={() => setIsPosting(true)} className="h-11 w-11 text-[#292828]/30 rounded-[0.78rem] flex items-center justify-center hover:text-[#292828] hover:bg-white border border-transparent hover:border-[#292828]/5 transition-all">
                           <ImageIcon size={22} strokeWidth={2.5} />
                        </button>
                        <button onClick={() => setIsPosting(true)} className="h-12 px-8 bg-[#292828] text-white rounded-[0.845rem] flex items-center justify-center gap-2 text-[11px] font-black uppercase shadow-2xl hover:bg-[#E53935] active:scale-95 transition-all">
                           Post <Plus size={18} strokeWidth={4} />
                        </button>
                     </div>
                  </div>
                ) : (
                  <div className="bg-white border border-[#292828]/10 rounded-[1.95rem] p-6 shadow-[0_48px_120px_rgba(0,0,0,0.12)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-[#E53935]" />
                     
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-[#292828] rounded-2xl flex items-center justify-center text-white shadow-2xl">
                              <Zap size={24} strokeWidth={2.5} />
                           </div>
                           <div>
                              <h3 className="text-xl font-black text-[#292828] uppercase leading-none ">{selectedPostType === 'Update' ? 'General Post' : selectedPostType}</h3>
                              <p className="text-[10px] font-bold uppercase text-slate-400  mt-1">Share an update with your network</p>
                           </div>
                        </div>
                        <button onClick={() => setIsPosting(false)} className="h-10 w-10 rounded-xl flex items-center justify-center text-[#292828]/20 hover:text-[#292828] hover:bg-slate-50 transition-all">
                           <X size={24} />
                        </button>
                     </div>

                     <div className="flex flex-wrap gap-2 mb-6">
                        {['General', 'Business Leads', 'Hiring', 'Partnership', 'Meeting'].map(type => (
                           <button
                              key={type}
                              onClick={() => { setSelectedPostType(type); setPostContent(""); }}
                              className={cn(
                                "px-6 h-10 rounded-xl text-[10px] font-black uppercase  transition-all border-2",
                                selectedPostType === type 
                                   ? "bg-[#292828] text-white border-[#292828] shadow-2xl scale-105" 
                                   : "bg-white text-slate-400 border-slate-100 hover:border-[#292828]/20 hover:text-[#292828]"
                              )}
                           >
                              {type}
                           </button>
                        ))}
                     </div>

                     <div className="space-y-4">
                        {selectedPostType === 'Business Leads' && (
                           <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Lead Title</label>
                                    <select 
                                      value={businessLeadTitle}
                                      onChange={(e) => setBusinessLeadTitle(e.target.value)}
                                      className="w-full h-12 bg-slate-50 px-6 rounded-2xl border-2 border-transparent focus:border-[#E53935]/20 text-xs font-bold text-[#292828] outline-none transition-all appearance-none cursor-pointer"
                                    >
                                       <option disabled>Select Title</option>
                                       {BUSINESS_LEAD_TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Requirement</label>
                                    <select 
                                      value={requirement}
                                      onChange={(e) => setRequirement(e.target.value)}
                                      className="w-full h-12 bg-slate-50 px-6 rounded-2xl border-2 border-transparent focus:border-[#E53935]/20 text-xs font-bold text-[#292828] outline-none transition-all appearance-none cursor-pointer"
                                    >
                                       {BUSINESS_REQUIREMENTS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Task Type</label>
                                    <select 
                                      value={taskType}
                                      onChange={(e) => setTaskType(e.target.value)}
                                      className="w-full h-12 bg-slate-50 px-6 rounded-2xl border-2 border-transparent focus:border-[#E53935]/20 text-xs font-bold text-[#292828] outline-none transition-all appearance-none cursor-pointer"
                                    >
                                       {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Budget (USD)</label>
                                    <input 
                                      type="text" 
                                      value={budget}
                                      onChange={(e) => setBudget(e.target.value)}
                                      placeholder="e.g. $10k - $50k" 
                                      className="w-full h-12 bg-slate-50 px-6 rounded-2xl border-2 border-transparent focus:border-[#E53935]/20 text-sm font-bold text-[#292828] outline-none transition-all" 
                                    />
                                 </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                 <div className="flex items-center gap-3">
                                    <label className="text-[10px] font-black uppercase text-[#292828]">Due Date</label>
                                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-10 bg-white border border-slate-200 px-4 rounded-xl text-[10px] font-black uppercase outline-none focus:border-[#E53935]" />
                                 </div>
                                 <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block" />
                                 <div className="flex items-center gap-4">
                                    <button onClick={() => setIsNDAProtected(!isNDAProtected)} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase border", isNDAProtected ? "bg-[#292828] text-white border-[#292828]" : "bg-white text-slate-400 border-slate-200")}>
                                       <ShieldCheck size={14} /> NDA Required
                                    </button>
                                    <button onClick={() => setIsUrgent(!isUrgent)} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase border", isUrgent ? "bg-[#E53935] text-white border-[#E53935]" : "bg-white text-slate-400 border-slate-200")}>
                                       <Zap size={14} /> Urgent
                                    </button>
                                 </div>
                              </div>
                           </div>
                        )}

                        {['Hiring', 'Partnership', 'Meeting'].includes(selectedPostType) && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-2 ">Post Category</label>
                                 <input type="text" placeholder="Specify details..." className="w-full h-12 bg-slate-50 px-6 rounded-2xl border-2 border-transparent focus:border-[#292828]/10 text-sm font-bold text-[#292828] outline-none transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-2 ">Target Budget</label>
                                 <input type="text" placeholder="Enter amount..." className="w-full h-12 bg-slate-50 px-6 rounded-2xl border-2 border-transparent focus:border-[#292828]/10 text-sm font-bold text-[#292828] outline-none transition-all" />
                              </div>
                           </div>
                        )}

                        <div className="relative">
                           <textarea 
                             autoFocus
                             value={postContent}
                             onChange={(e) => setPostContent(e.target.value)}
                             placeholder="What's the latest in your business?"
                             className="w-full bg-slate-50 p-6 rounded-[1.3rem] border-2 border-transparent text-lg font-bold text-[#292828] placeholder:text-slate-200 outline-none resize-none min-h-[160px] transition-all focus:bg-white focus:border-[#292828]/5"
                           />
                           <div className="absolute bottom-6 right-6 flex items-center gap-4">
                              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                              <button 
                                 onClick={() => fileInputRef.current?.click()}
                                 className={cn(
                                   "h-12 w-12 rounded-xl flex items-center justify-center transition-all bg-white shadow-xl border border-slate-100",
                                   attachment ? "text-green-500 scale-110" : "text-slate-300 hover:text-[#292828]"
                                 )}
                              >
                                 <ImageIcon size={20} /> 
                              </button>
                              <button 
                                onClick={handlePost}
                                className="px-10 h-12 bg-[#E53935] text-white rounded-xl text-[10px] font-black uppercase  shadow-[0_20px_40px_rgba(229,57,53,0.3)] hover:bg-[#292828] transition-all active:scale-95"
                              >
                                Post Update
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
            </div>

            <div className={cn(
               "pb-40 lg:pb-32",
               viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6" : "space-y-8"
            )}>
               {filteredPosts.map(post => (
                 <div key={post.id} className="group/post relative">
                    {viewMode === "grid" ? (
                      <div className={cn(
                        "bg-white rounded-[1.3rem] border-2 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(41,40,40,0.12)] flex flex-col h-full overflow-hidden",
                        post.type === 'Business Leads' ? "border-[#E53935]/10 hover:border-[#E53935]" : "border-[#292828]/5 hover:border-[#292828]"
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
                               post.type === 'Business Leads' ? "bg-red-50 text-red-600 border-red-100" : 
                               post.type === 'Meeting' ? "bg-green-50 text-green-600 border-green-100" :
                               post.type === 'Hiring' ? "bg-blue-50 text-blue-600 border-blue-100" :
                               "bg-[#292828]/5 text-[#292828] border-[#292828]/10"
                           )}>
                              {post.type}
                           </div>
                        </div>

                        <div className="px-5 pb-5 flex-1 flex flex-col gap-3">
                           {post.type === 'Update' ? (
                             <div className="bg-slate-50 p-3.5 rounded-xl border-l-4 border-red-500 relative overflow-hidden group/update-flash">
                                <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                                   <div className="h-1 w-1 bg-red-500 rounded-full animate-pulse" />
                                   <span className="text-[7px] font-black text-slate-400 uppercase">Flash Update</span>
                                </div>
                                <p className="text-[12px] font-bold text-[#292828] leading-tight">
                                   {post.content}
                                </p>
                             </div>
                           ) : post.type !== 'Business Leads' && (
                             <p className="text-sm font-bold text-slate-700 leading-snug line-clamp-2">
                                {post.content}
                             </p>
                           )}

                            {post.type === 'Business Leads' && (
                                <div className="space-y-4 flex-1 flex flex-col">
                                   <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                         <h3 className="text-[17px] font-black text-[#292828] uppercase leading-tight group-hover:text-[#E53935] transition-colors line-clamp-1">{post.title || "Project Business Lead"}</h3>
                                         {post.isUrgent && <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse shrink-0" />}
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-1.5 mb-3">
                                         <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[8px] font-black uppercase rounded border border-red-100">{post.requirement}</span>
                                         <span className="px-2 py-0.5 bg-[#292828]/5 text-[#292828] text-[8px] font-black uppercase rounded border border-[#292828]/10">{post.taskType}</span>
                                         {post.isNDA && <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase rounded flex items-center gap-1"><ShieldCheck size={8} /> NDA</span>}
                                      </div>
                                      <p className="text-xs font-bold text-slate-500 leading-relaxed mb-4 line-clamp-2 italic opacity-80">
                                         "{post.content}"
                                      </p>
                                   </div>

                                   <div className="bg-[#292828] p-5 rounded-[1.3rem] border border-[#292828] mt-auto relative overflow-hidden group/deal-node shadow-2xl transition-all hover:scale-[1.02]">
                                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#E53935]/15 blur-[40px] pointer-events-none" />
                                      <div className="relative z-10">
                                         <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-2">
                                               <Target size={12} className="text-[#E53935]" />
                                               <span className="text-[9px] font-black text-white/40 uppercase ">Business Valuation</span>
                                            </div>
                                            <span className="text-[18px] font-black text-white ">{post.budget || "₹TBA"}</span>
                                         </div>
                                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                                            <div className="h-full bg-[#E53935] rounded-full shadow-[0_0_15px_rgba(229,57,53,0.5)]" style={{ width: post.budget ? '100%' : '20%' }} />
                                         </div>
                                         <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 ">
                                               <span className="text-[8px] font-black text-white/20 uppercase ">Strategic Alignment</span>
                                               <div className="flex gap-0.5">
                                                  {[1,2,3].map(i => <div key={i} className={`h-1 w-2 rounded-full ${i <= 2 ? 'bg-[#E53935]' : 'bg-white/10'}`} />)}
                                               </div>
                                            </div>
                                            <p className="text-[8px] font-black text-green-500 uppercase ">Verified Lead</p>
                                         </div>
                                      </div>
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

                           {post.type === 'Expo' && (
                              <div className="relative h-28 w-full rounded-xl overflow-hidden mt-auto border border-[#292828]/10 group/grid-expo">
                                 <img 
                                   src="/expo-summit.png" 
                                   className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/grid-expo:grayscale-0 group-hover/grid-expo:scale-110" 
                                   alt="Expo" 
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                                    <p className="text-[8px] font-black text-white uppercase ">Book Entry</p>
                                 </div>
                              </div>
                           )}

                           {!['Business Leads', 'Meeting'].includes(post.type) && post.images && (
                              <div className="h-24 w-full rounded-xl overflow-hidden border border-[#292828]/10 mt-auto">
                                 <img src={post.images[0]} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/post:grayscale-0" alt="" />
                              </div>
                           )}
                        </div>

                        <div className="px-5 pb-3 pt-0 flex items-center justify-between mt-auto">
                           <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleLike(post.id)}
                                className={cn("flex items-center gap-1 transition-all active:scale-125", post.isLiked ? "text-[#E53935]" : "text-slate-400")}
                              >
                                 <Heart size={14} fill={post.isLiked ? "currentColor" : "none"} />
                              </button>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{post.time}</span>
                           </div>
                           
                           <button 
                              onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }}
                              className="h-7 w-7 bg-[#E53935] text-white rounded-lg flex items-center justify-center transition-all hover:bg-[#292828] shadow-lg active:scale-95 group/connect"
                           >
                              <ArrowUpRight size={12} className="group-hover/connect:translate-x-0.5 group-hover/connect:-translate-y-0.5 transition-transform" />
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border-slate-100 overflow-hidden transition-all duration-500 rounded-[1.625rem] border shadow-2xl shadow-slate-200/10 hover:border-[#E53935]/10 p-1 relative group/list-card">
                         <div className={cn(
                            "absolute top-6 right-6 px-4 py-1.5 rounded-lg text-[12px] font-black uppercase border z-20 transition-all",
                            post.type === 'Business Leads' ? "bg-red-50 text-red-600 border-red-100" : 
                            post.type === 'Meeting' ? "bg-green-50 text-green-600 border-green-100" :
                            post.type === 'Hiring' ? "bg-blue-50 text-blue-600 border-blue-100" :
                            "bg-slate-50 text-slate-500 border-slate-100"
                         )}>
                            {post.type}
                         </div>
                         <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                               <div className="relative">
                                  <Link href={`/profile/${post.authorId}`} className="block h-11 w-11 rounded-xl overflow-hidden border border-[#292828]/5 shadow-sm hover:scale-105 active:scale-95 transition-all">
                                     <img src={post.avatar} alt="" className="w-full h-full object-cover" />
                                  </Link>
                                  <div className={cn(
                                     "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm z-10",
                                     post.id % 3 === 0 ? "bg-green-500" : post.id % 3 === 1 ? "bg-amber-500" : "bg-slate-300"
                                  )} />
                               </div>
                               <div>
                                  <div className="flex items-center gap-3">
                                     <Link href={`/profile/${post.authorId}`} className="text-[15px] font-bold text-[#292828] leading-tight hover:text-[#E53935] transition-colors">{post.author}</Link>
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
                            {post.type === 'Update' ? (
                               <div className="relative bg-slate-50 rounded-xl p-3 border border-slate-100 overflow-hidden group/editorial-update">
                                  <div className="relative z-10 flex gap-3">
                                     <div className="h-8 w-1 bg-red-500 shrink-0" />
                                     <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                           <h4 className="text-[8px] font-black uppercase text-slate-400 ">Business News</h4>
                                           <div className="flex items-center gap-1.5 grayscale opacity-50">
                                              <div className="h-1 w-1 bg-red-500 rounded-full animate-ping" />
                                              <span className="text-[8px] font-black text-[#292828] uppercase">Signal</span>
                                           </div>
                                        </div>
                                        <p className="text-base font-bold text-[#292828] leading-tight mb-2">
                                           "{post.content}"
                                        </p>
                                        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase">
                                           <Globe size={10} /> {post.time} • Public Post
                                        </div>
                                     </div>
                                  </div>
                                </div>
                             ) : !['Business Leads', 'Hiring', 'Partnership', 'Meeting', 'Expo'].includes(post.type) && (
                               <p className="text-base text-slate-700 leading-relaxed font-medium line-clamp-3 group-hover/post:line-clamp-none transition-all">
                                  {post.content}
                               </p>
                             )}

                            {post.type === 'Business Leads' && (
                               <div className="mt-8 relative group/opp-terminal">
                                  <div className="relative bg-[#292828] rounded-[1.95rem] overflow-hidden border border-[#292828] shadow-[0_48px_120px_rgba(0,0,0,0.15)] transition-all duration-700">
                                     <div className="absolute top-0 right-0 w-80 h-80 bg-[#E53935]/10 blur-[100px] pointer-events-none" />
                                     
                                     <div className="px-10 py-4 bg-black/30 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                           <div className="flex gap-2">
                                              <span className="px-3 py-1 bg-[#E53935] text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-red-500/20">{post.requirement || "Business Lead"}</span>
                                              <span className="px-3 py-1 bg-white/5 text-white/40 text-[9px] font-black uppercase rounded-lg border border-white/10">{post.taskType || "System Entry"}</span>
                                           </div>
                                           {post.isNDA && (
                                             <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                                                <ShieldCheck size={10} className="text-[#E53935]" />
                                                <span className="text-[9px] font-black text-white/30 uppercase">NDA</span>
                                             </div>
                                           )}
                                        </div>
                                        <div className="flex items-center gap-1.5 grayscale opacity-50">
                                           <div className={`h-1.5 w-1.5 rounded-full ${post.isUrgent ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                                           <span className="text-[10px] font-black text-white/50 uppercase ">{post.isUrgent ? 'High Urgency' : 'Neutral State'}</span>
                                        </div>
                                     </div>

                                     <div className="px-10 py-10 flex flex-col md:flex-row gap-8 items-center">
                                        <div className="flex-1 space-y-6">
                                           <div className="space-y-3">
                                              <div className="flex items-center gap-3">
                                                 <span className="px-3 py-1 bg-[#E53935] text-white text-[9px] font-black uppercase  rounded-lg">Top-Tier</span>
                                                 <h3 className="text-2xl font-black text-white uppercase  leading-none">{post.title || "Business Lead"}</h3>
                                              </div>
                                              <p className="text-white/70 text-base font-medium leading-relaxed italic line-clamp-2">
                                                 "{post.content || "Interested in scaling our operations via strategic partnership."}"
                                              </p>
                                           </div>
                                           
                                           <div className="flex gap-10 items-end">
                                              <div>
                                                 <p className="text-[9px] font-black text-white/40 uppercase mb-2 flex items-center justify-between">
                                                    <span>Trust Score</span>
                                                    <span className="text-[#E53935] ml-4">92 / 100</span>
                                                 </p>
                                                 <div className="flex gap-1">
                                                    {[1,2,3,4,5,6,7,8].map(i => (
                                                       <div key={i} className={cn("h-1 w-5 rounded-full transition-colors", i <= 6 ? "bg-[#E53935]" : "bg-white/10")} />
                                                    ))}
                                                 </div>
                                              </div>
                                              {post.dueDate && (
                                                 <div className="flex flex-col gap-1.5 ">
                                                    <p className="text-[9px] font-black text-white/40 uppercase leading-none">Decision Date</p>
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                                                       <Calendar size={12} className="text-[#E53935]" />
                                                       <span className="text-[10px] font-black text-white uppercase">{post.dueDate}</span>
                                                    </div>
                                                 </div>
                                              )}
                                           </div>
                                        </div>

                                        <div className="shrink-0 relative group/value sm:mr-6">
                                           <div className="absolute -inset-4 bg-[#E53935]/15 rounded-full blur-2xl animate-pulse" />
                                           <div className="relative w-[13.5rem] py-11 rounded-[1.625rem] border border-white/20 bg-white/5 flex flex-col items-center justify-center p-6 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.4)] transition-transform group-hover/opp-terminal:scale-105">
                                              <p className="text-[10px] font-black text-white/50 uppercase  mb-3">Bid Amount</p>
                                              <p className="text-3xl lg:text-4xl font-black text-white  leading-none">{post.budget}</p>
                                           </div>
                                        </div>
                                     </div>

                                     <div className="grid grid-cols-2">
                                        <button 
                                           onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }}
                                           className="h-16 bg-white/5 hover:bg-white/10 text-white border-t border-r border-white/10 text-xs font-black uppercase  transition-all flex items-center justify-center gap-4"
                                        >
                                           View Project
                                           <ArrowUpRight size={16} className="text-[#E53935]" />
                                        </button>
                                        <button 
                                           onClick={() => setActiveBidPostId(post.id)}
                                           className="h-16 bg-[#E53935] text-white text-xs font-black uppercase  transition-all hover:bg-white hover:text-[#292828] shadow-2xl flex items-center justify-center gap-4"
                                        >
                                           Send Offer
                                           <Zap size={16} />
                                        </button>
                                     </div>
                                  </div>
                               </div>
                            )}

                            {post.type === 'Meeting' && (
                               <div className="mt-6 group/meeting-card relative overflow-hidden rounded-[1.625rem] border border-[#292828]/8 bg-white shadow-[0_8px_40px_rgba(41,40,40,0.06)] hover:shadow-[0_20px_60px_rgba(41,40,40,0.12)] transition-all duration-500 hover:-translate-y-0.5">
                                  {/* Top accent bar */}
                                  <div className="h-1.5 w-full bg-gradient-to-r from-[#E53935] via-[#FF6B35] to-[#E53935]" />
                                  <div className="p-5 sm:p-6 flex flex-col gap-5">
                                     {/* Row 1: Format badge + expand btn */}
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-wrap">
                                           <span className={cn(
                                             "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                             post.meetingType === 'Physical'
                                               ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                               : "bg-blue-50 text-blue-700 border border-blue-100"
                                           )}>
                                             <span className={cn(
                                               "h-1.5 w-1.5 rounded-full",
                                               post.meetingType === 'Physical' ? "bg-emerald-500" : "bg-blue-500 animate-pulse"
                                             )} />
                                             {post.meetingType === 'Physical' ? 'In-Person' : 'Online'}
                                           </span>
                                           {post.category && (
                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#292828]/5 text-[#292828]/60 border border-[#292828]/8">
                                               {post.category}
                                             </span>
                                           )}
                                        </div>
                                        <button
                                          onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }}
                                          className="h-8 w-8 rounded-xl bg-[#292828]/5 hover:bg-[#E53935] hover:text-white text-[#292828]/40 flex items-center justify-center transition-all duration-300 shrink-0"
                                        >
                                          <ArrowUpRight size={14} strokeWidth={2.5} />
                                        </button>
                                     </div>
                                     {/* Row 2: Title + description */}
                                     <div>
                                        <h3 className="text-xl sm:text-2xl font-black text-[#292828] leading-tight tracking-tight group-hover/meeting-card:text-[#E53935] transition-colors duration-300">
                                           {post.topic || "Open Meeting"}
                                        </h3>
                                        {post.content && (
                                          <p className="text-sm text-[#292828]/60 font-medium leading-relaxed mt-1.5 line-clamp-2">
                                             {post.content}
                                          </p>
                                        )}
                                     </div>
                                     {/* Row 3: Date + Time + Location chips */}
                                     <div className="flex flex-wrap gap-2.5">
                                        {post.meetingTime && (
                                          <div className="flex items-center gap-2 bg-[#E53935]/5 border border-[#E53935]/10 rounded-xl px-3 py-2">
                                             <div className="h-8 w-8 bg-[#E53935] rounded-lg flex flex-col items-center justify-center shrink-0 shadow-md">
                                               <span className="text-[7px] font-black uppercase text-white/70 leading-none">{new Date(post.meetingTime).toLocaleString([], { month: 'short' })}</span>
                                               <span className="text-base font-black text-white leading-none">{new Date(post.meetingTime).getDate()}</span>
                                             </div>
                                             <div>
                                               <p className="text-[8px] font-black uppercase text-[#292828]/40 leading-none mb-0.5">Date</p>
                                               <p className="text-xs font-bold text-[#292828] leading-none">{new Date(post.meetingTime).toLocaleString([], { weekday: 'short' })}, {new Date(post.meetingTime).toLocaleString([], { month: 'short' })} {new Date(post.meetingTime).getDate()}</p>
                                             </div>
                                          </div>
                                        )}
                                        {post.meetingTime && (
                                          <div className="flex items-center gap-2 bg-[#292828]/5 border border-[#292828]/8 rounded-xl px-3 py-2">
                                             <div className="h-8 w-8 bg-[#292828] rounded-lg flex items-center justify-center shrink-0">
                                               <Clock size={14} className="text-white" />
                                             </div>
                                             <div>
                                               <p className="text-[8px] font-black uppercase text-[#292828]/40 leading-none mb-0.5">Time</p>
                                               <p className="text-xs font-bold text-[#292828] leading-none">{new Date(post.meetingTime).toLocaleString([], { timeStyle: 'short' })}</p>
                                             </div>
                                          </div>
                                        )}
                                        {post.location && (
                                          <div className="flex items-center gap-2 bg-[#292828]/5 border border-[#292828]/8 rounded-xl px-3 py-2 min-w-0 max-w-full">
                                             <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", post.meetingType === 'Physical' ? "bg-emerald-500" : "bg-blue-500")}>
                                               <MapPin size={14} className="text-white" />
                                             </div>
                                             <div className="min-w-0">
                                               <p className="text-[8px] font-black uppercase text-[#292828]/40 leading-none mb-0.5">{post.meetingType === 'Physical' ? 'Venue' : 'Link'}</p>
                                               <p className="text-xs font-bold text-[#292828] truncate max-w-[200px]">{post.location}</p>
                                             </div>
                                          </div>
                                        )}
                                     </div>
                                     {/* Row 4: Attendees + RSVP */}
                                     <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#292828]/6">
                                        <div className="flex items-center gap-2">
                                           <div className="flex -space-x-2">
                                             {[1,2,3].map(i => (
                                               <div key={i} className="h-7 w-7 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center">
                                                 <User size={12} className="text-[#292828]/20" />
                                               </div>
                                             ))}
                                           </div>
                                           <span className="text-[10px] font-bold text-[#292828]/40 uppercase">{post.likes || 0}+ going</span>
                                        </div>
                                        <button
                                          onClick={() => setJoinedMeetings(prev => prev.includes(post.id) ? prev.filter(id => id !== post.id) : [...prev, post.id])}
                                          className={cn(
                                            "h-10 px-6 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 active:scale-95",
                                            joinedMeetings.includes(post.id)
                                              ? "bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:bg-emerald-600"
                                              : "bg-[#292828] text-white shadow-[0_4px_20px_rgba(41,40,40,0.2)] hover:bg-[#E53935] hover:shadow-[0_4px_20px_rgba(229,57,53,0.3)]"
                                          )}
                                        >
                                          {joinedMeetings.includes(post.id) ? (
                                            <><CheckCircle2 size={13} /> RSVP'd</>
                                          ) : (
                                            <><Calendar size={13} /> RSVP Now</>
                                          )}
                                        </button>
                                     </div>
                                  </div>
                               </div>
                            )}
                             {post.type === 'Hiring' && (
                                <div className="mt-4 relative overflow-hidden p-4 rounded-2xl bg-[#292828] text-white flex items-center justify-between group/action shadow-xl">
                                   <div className="absolute top-0 right-0 h-full w-24 bg-red-600/10 blur-3xl opacity-50" />
                                   <div className="flex items-center gap-3 relative z-10">
                                      <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-red-500">
                                         <Briefcase size={20} />
                                      </div>
                                      <div>
                                         <p className="text-xs font-bold uppercase text-white/40 leading-none mb-1">Job Opening</p>
                                         <p className="text-sm font-bold uppercase mb-2">Principal Engineer</p>
                                         <p className="text-[11px] font-medium text-white/60 leading-relaxed line-clamp-2">
                                            {post.content}
                                         </p>
                                      </div>
                                   </div>
                                   <button className="relative z-10 h-10 px-6 bg-red-600 text-white rounded-xl text-xs font-bold uppercase active:scale-95 transition-all shadow-lg shadow-red-500/20">Apply Now</button>
                                </div>
                             )}

                             {post.type === 'Partnership' && (
                                <div className="mt-6 p-0 rounded-[1.3rem] bg-white border-2 border-[#292828] flex flex-col overflow-hidden shadow-2xl shadow-[#292828]/5 group/action hover:shadow-[#292828]/10 transition-all">
                                   <div className="bg-[#292828] px-6 py-3 flex items-center justify-between">
                                      <div className="flex items-center gap-2.5">
                                         <Target size={16} className="text-red-500" />
                                         <p className="text-xs font-bold uppercase text-white">Partnership Business Lead</p>
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
                                            <p className="text-sm font-bold text-[#292828] leading-tight line-clamp-2">
                                               {post.content}
                                            </p>
                                         </div>
                                         <button 
                                           onClick={() => alert(`Offer transmitted for project ID: ${post.id}. Target partners will be notified immediately.`)}
                                           className="shrink-0 w-full md:w-auto h-11 px-8 bg-red-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-[#292828] transition-all shadow-lg active:scale-95"
                                         >
                                            Send Offer
                                         </button>
                                      </div>
                                   </div>
                                </div>
                             )}

                             {post.type === 'Expo' && (
                                <div className="mt-4 flex flex-col gap-4">
                                   <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-xl group/expo-img">
                                      <img 
                                        src="/expo-summit.png" 
                                        className="w-full h-full object-cover group-hover/expo-img:scale-105 transition-transform duration-700" 
                                        alt="Expo Thumbnail" 
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                                         <div>
                                            <p className="text-[10px] font-black uppercase text-red-500 mb-1">Upcoming Event</p>
                                            <h4 className="text-xl font-black text-white uppercase">Global Trade Summit 2026</h4>
                                         </div>
                                         <button className="h-10 px-6 bg-red-600 text-white rounded-xl text-xs font-black uppercase active:scale-95 transition-all shadow-lg hover:bg-white hover:text-[#292828]">Book Ticket</button>
                                      </div>
                                   </div>
                                   <p className="text-sm font-medium text-slate-600 leading-relaxed px-2">
                                      {post.content}
                                   </p>
                                </div>
                             )}

                             {post.images && (
                               <div className="rounded-2xl overflow-hidden border border-[#292828]/10 shadow-lg lg:grayscale transition-all duration-700 group-hover/post:grayscale-0">
                                  <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                               </div>
                            )}
                         </div>

                         <div className="px-6 py-2.5 bg-[#292828]/5/50 border-t border-[#292828]/5 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                               <button onClick={() => handleLike(post.id)} className={cn("flex items-center gap-1.5 group/btn transition-all active:scale-125", post.isLiked ? "text-[#E53935]" : "text-[#292828]")}>
                                  <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
                                  <span className="font-bold text-sm">{post.likes}</span>
                               </button>
                               <button onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} className="flex items-center gap-2 group/btn transition-all text-[#292828]">
                                  <MessageSquare size={16} /><span className="text-sm font-bold">{post.comments?.length || 0}</span>
                                </button>
                             </div>
                             <button onClick={() => { setSelectedDeal(post); setIsModalOpen(true); }} className="bg-[#E53935] text-white rounded-xl flex items-center transition-all duration-500 hover:bg-[#292828] shadow-lg active:scale-95 group/connect h-8 overflow-hidden w-8 hover:w-[100px]">
                                <div className="h-8 w-8 flex items-center justify-center shrink-0"><ArrowUpRight size={16} className="transition-transform duration-500 group-hover/connect:rotate-45" /></div>
                                <span className="text-[10px] font-bold uppercase whitespace-nowrap opacity-0 group-hover/connect:opacity-100 transition-all duration-500 overflow-hidden ml-0 group-hover/connect:ml-1 pr-3">Connect</span>
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

      <aside className="hidden lg:flex flex-col w-[450px] h-screen sticky top-0 bg-slate-50/50 p-6 lg:p-8 gap-10 overflow-y-auto no-scrollbar border-l border-slate-100/50 shrink-0">
         <div className="group/hub">
            <div onClick={() => setIsMapExpanded(true)}>
               <div className="flex items-center justify-between mb-6 px-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
                     <h4 className="text-xs font-bold text-[#292828] uppercase">Explore Channels</h4>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-[#292828]/10 rounded-xl shadow-sm">
                     <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                     <span className="text-xs font-bold text-[#292828] uppercase">Live City Hub</span>
                  </div>
               </div>
               
               <div className="relative h-[400px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(41,40,40,0.12)] group transition-all duration-700 ring-8 ring-white cursor-pointer hover:ring-[#E53935]/5 group-hover/hub:shadow-2xl">
                  <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#292828_1.2px,transparent_1.2px)] [background-size:24px_24px]" />
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] scale-150 opacity-20 group-hover/hub:scale-[1.6] group-hover/hub:opacity-30 transition-all duration-1000">
                     <svg className="w-[400px] h-[320px] text-[#292828]/60" viewBox="0 0 400 320" fill="none">
                        <path d="M0,0 L120,0 C130,50 110,150 140,200 C160,250 130,300 120,320 L0,320 Z" fill="currentColor" />
                        <path d="M120,0 C130,50 110,150 140,200 C160,250 130,300 120,320" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                     </svg>
                  </div>

                  {/* MINIATURE ACTIVITY NODES */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                     {[1,2,3,4,5,6,7].map(i => (
                        <div 
                           key={i}
                           className="absolute h-1.5 w-1.5 rounded-full animate-ping opacity-60"
                           style={{ 
                              left: `${30 + (i * 13)%50}%`, 
                              top: `${35 + (i * 9)%40}%`,
                              backgroundColor: i % 3 === 0 ? '#10B984' : i % 3 === 1 ? '#3B82F6' : '#E53935',
                              animationDelay: `${i * 0.4}s`
                           }} 
                        />
                     ))}
                     {[1,2,3,4,5,6,7].map(i => (
                        <div 
                           key={i}
                           className="absolute h-1.5 w-1.5 rounded-full shadow-lg"
                           style={{ 
                              left: `${30 + (i * 13)%50}%`, 
                              top: `${35 + (i * 9)%40}%`,
                              backgroundColor: i % 3 === 0 ? '#10B984' : i % 3 === 1 ? '#3B82F6' : '#E53935',
                           }} 
                        />
                     ))}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-white via-white/80 to-transparent z-20">
                     <div className="flex items-end justify-between">
                        <div className="space-y-1">
                           <h2 className="text-4xl font-black text-[#292828] uppercase tracking-tighter">Trivandrum</h2>
                           <p className="text-[10px] font-black text-[#E53935] uppercase tracking-[0.2em]">Network Version 6.0</p>
                        </div>
                        <div className="bg-[#292828] px-5 py-4 rounded-[1.25rem] border border-white/10 text-right shadow-2xl transform group-hover/hub:scale-105 transition-transform">
                           <p className="text-3xl font-black text-white leading-none mb-1">1.4k</p>
                           <p className="text-[9px] font-black uppercase text-white/40">Active Nodes</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="relative group/sync overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[#E53935] rounded-[1.625rem] blur-3xl opacity-10 group-hover/sync:opacity-20 transition-opacity" />
            <div className="relative p-8 bg-gradient-to-br from-[#E53935] to-[#B71C1C] rounded-[1.625rem] shadow-2xl overflow-hidden group">
               <TrendingUp size={140} className="absolute -right-10 -bottom-10 text-white/10 group-hover/sync:rotate-12 transition-transform duration-[4s]" />
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xl">
                        <Users size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-white uppercase leading-tight">Smart Match Engine</h3>
                        <p className="text-white/60 text-[10px] font-bold uppercase">12 Strategic MSME matches identified</p>
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
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-10">
            <div className="absolute inset-0 bg-[#292828]/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsMatching(false)} />
            
            <div className="relative w-full max-w-4xl bg-white rounded-[2.275rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500">
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
                     <h3 className="text-3xl font-bold text-[#292828] uppercase mb-4">Scanning Smart Network</h3>
                     <p className="text-slate-400 font-bold uppercase text-[13px] mb-8">AI Matching Hub • MSME Kerala Region</p>
                  </div>
               ) : (
                  <div className="flex flex-col h-full max-h-[90vh]">
                     <div className="bg-[#292828] px-10 py-10 flex items-center justify-between shrink-0">
                        <div>
                           <h3 className="text-3xl font-bold text-white uppercase leading-none mb-2">Network Sync Found</h3>
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
                           <div key={i} className="group p-6 rounded-[1.625rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-2xl transition-all flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className="h-16 w-16 rounded-2xl bg-[#292828] flex items-center justify-center text-white shadow-lg group-hover:bg-[#E53935] transition-colors">
                                    <Building size={28} />
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-3 mb-1">
                                       <h4 className="text-lg font-bold text-[#292828] uppercase">{partner.name}</h4>
                                       <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-[#292828] uppercase">{partner.type}</span>
                                    </div>
                                 </div>
                              </div>
                              <button className="h-14 px-8 bg-[#E53935] text-white rounded-2xl text-[13px] font-bold uppercase shadow-xl hover:bg-[#292828] transition-all active:scale-95">Send Pitch</button>
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
      {/* CINEMATIC MAP EXPANSION OVERLAY */}
      {isMapExpanded && (
        <div className="fixed inset-0 z-[100] bg-white animate-in zoom-in-95 duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
           <div className="absolute top-8 right-8 z-[110]">
              <button 
                onClick={() => setIsMapExpanded(false)}
                className="h-14 w-14 bg-[#292828] text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-[#E53935] transition-all active:scale-95"
              >
                 <X size={28} />
              </button>
           </div>
           <LiveMap posts={posts} />
        </div>
      )}
    </div>
  );
}
