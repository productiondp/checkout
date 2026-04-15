"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark, 
  Image as ImageIcon, 
  MoreHorizontal, 
  Plus, 
  Smile, 
  Paperclip, 
  ChevronRight,
  Calendar,
  ShoppingBag,
  Zap,
  Target,
  Rocket,
  PlusSquare,
  Users,
  MapPin,
  Clock,
  Briefcase,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import DealEngine from "@/components/modals/DealEngine";

interface Post {
  id: number;
  type: string;
  author: string;
  time: string;
  content: string;
  budget?: string;
  role?: string;
  loc?: string;
  meetTime?: string;
  likes: number;
  comments: number;
  matchScore: number;
  avatar: string;
  images?: string[];
  target?: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    type: "Hiring",
    author: "Rahul Sethi",
    time: "45m ago",
    content: "We are looking for a Senior UI/UX Designer to join our team. If you have 4+ years of experience in product design, let's talk!",
    budget: "₹80k - ₹1.2L",
    role: "Senior UI/UX Designer",
    likes: 42,
    comments: 18,
    matchScore: 94,
    images: [],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
  },
  {
    id: 10,
    type: "Meeting",
    author: "Sana Maryam",
    time: "10m ago",
    content: "Hosting a quick coffee meeting for architects in Trivandrum today!",
    loc: "Technopark Ph-III",
    meetTime: "5:00 PM Today",
    likes: 5,
    comments: 2,
    matchScore: 0,
    images: [],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
  },
  {
    id: 2,
    type: "Update",
    author: "Ahmad Nur F.",
    time: "2h ago",
    content: "Checkout just reached a new milestone: 100 business connections made this month! Our network is growing every day.",
    likes: 890,
    comments: 45,
    matchScore: 0,
    images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
  }
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<"Update" | "Hiring" | "Partnership" | "Meeting">("Update");
  const [postData, setPostData] = useState({ content: "", budget: "", role: "", loc: "", time: "", target: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);

  const handlePost = () => {
    if (!postData.content.trim()) return;
    const newPost = {
      id: Date.now(),
      type: activeTab,
      author: "Ahmad Fawaid",
      time: "Just now",
      content: postData.content,
      budget: postData.budget,
      role: postData.role,
      loc: postData.loc,
      meetTime: postData.time,
      likes: 0,
      comments: 0,
      matchScore: 0,
      images: [],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
    };
    setPosts([newPost, ...posts]);
    setPostData({ content: "", budget: "", role: "", loc: "", time: "", target: "" });
    alert("Post shared with the network!");
  };

  return (
    <div className="max-w-[700px] mx-auto min-h-screen">
      {/* Mobile-Only Stories Rail */}
      <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar px-5 py-6 border-b border-slate-50 bg-white">
        {[
          { name: "You", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop", add: true },
          { name: "Events", img: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=100&auto=format&fit=crop" },
          { name: "Invest", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=100&auto=format&fit=crop" },
          { name: "Legal", img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=100&auto=format&fit=crop" },
          { name: "Tech", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=100&auto=format&fit=crop" },
        ].map((story, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className={`w-16 h-16 rounded-full p-1 border-2 ${i === 0 ? 'border-red-500' : 'border-slate-100'}`}>
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <img src={story.img} className="w-full h-full object-cover" alt={story.name} />
                {story.add && (
                  <div className="absolute bottom-0 right-0 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Plus size={10} className="text-white" />
                  </div>
                )}
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{story.name}</span>
          </div>
        ))}
      </div>

      {/* Hyper-Local Category Grid (Mobile Only) */}
      <div className="lg:hidden p-5 pt-2 grid grid-cols-4 gap-4">
        {[
          { label: "Our Apps", icon: Rocket, color: "bg-red-50 text-red-500" },
          { label: "Places", icon: MapPin, color: "bg-blue-50 text-blue-500" },
          { label: "Experts", icon: Target, color: "bg-orange-50 text-orange-500" },
          { label: "Groups", icon: Users, color: "bg-pink-50 text-pink-500" },
          { label: "Liquidation", icon: ShoppingBag, color: "bg-green-50 text-green-500" },
          { label: "Events", icon: Calendar, color: "bg-indigo-50 text-indigo-500" },
          { label: "Logistics", icon: Globe, color: "bg-slate-50 text-slate-500" },
          { label: "Flash Deals", icon: Zap, color: "bg-amber-50 text-amber-500" },
        ].map((cat, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-all", cat.color)}>
              <cat.icon size={22} />
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter text-center">{cat.label}</span>
          </div>
        ))}
      </div>

      <div className="p-4 lg:p-10 space-y-6">
        {/* Live Now Nearby Section (Mobile Only) */}
        <div className="lg:hidden bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative group">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Now Nearby</span>
              </div>
              <h4 className="text-lg font-bold mb-1">Mobile Expo @ Phase 1</h4>
              <p className="text-[11px] text-slate-400 font-medium mb-4">32 Businesses are exhibiting right now. Join them!</p>
              <button className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-normal active:scale-95 transition-all">Check In</button>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>

         {/* Share Something Section */}
         <div className="bg-white rounded-[2rem] border border-[#EBEFF1] mb-10 shadow-xl shadow-slate-200/20 overflow-hidden">
            <div className="flex border-b border-slate-50 overflow-x-auto no-scrollbar">
               {(['Update', 'Hiring', 'Partnership', 'Meeting'] as const).map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                     "flex-1 py-4 px-6 text-[11px] font-bold uppercase tracking-normal transition-all relative cursor-pointer whitespace-nowrap",
                     activeTab === tab ? "text-[#E53935] bg-slate-50/50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/30"
                   )}
                 >
                    {activeTab === tab && <div className="absolute top-0 left-0 right-0 h-1 bg-[#E53935]" />}
                    {tab}
                 </button>
               ))}
            </div>

            <div className="p-8">
               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                     <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="Self" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-4">
                     <textarea 
                       value={postData.content}
                       onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                       placeholder={
                         activeTab === 'Hiring' ? "Who are you looking for?" : 
                         activeTab === 'Meeting' ? "What's the plan for the meeting?" : 
                         activeTab === 'Partnership' ? "What kind of partner do you need?" : "Share an update with everyone..."
                       }
                       className="w-full bg-transparent text-[16px] font-medium placeholder:text-slate-300 outline-none resize-none min-h-[60px]"
                     />

                     {/* Extra Fields */}
                     <div className="grid grid-cols-2 gap-4">
                        {activeTab === 'Hiring' && (
                          <>
                             <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E53935]" size={16} />
                                <input 
                                  type="text" 
                                  value={postData.role}
                                  onChange={(e) => setPostData({ ...postData, role: e.target.value })}
                                  placeholder="Job Title" 
                                  className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100 placeholder:font-medium" 
                                />
                             </div>
                             <div className="relative">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E53935]" size={16} />
                                <input 
                                  type="text" 
                                  value={postData.budget}
                                  onChange={(e) => setPostData({ ...postData, budget: e.target.value })}
                                  placeholder="Pay / Salary" 
                                  className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100 placeholder:font-medium" 
                                />
                             </div>
                          </>
                        )}
                        {activeTab === 'Meeting' && (
                          <>
                             <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E53935]" size={16} />
                                <input 
                                  type="text" 
                                  value={postData.loc}
                                  onChange={(e) => setPostData({ ...postData, loc: e.target.value })}
                                  placeholder="Area / Location" 
                                  className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100 placeholder:font-medium" 
                                />
                             </div>
                             <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E53935]" size={16} />
                                <input 
                                  type="text" 
                                  value={postData.time}
                                  onChange={(e) => setPostData({ ...postData, time: e.target.value })}
                                  placeholder="Time and Date" 
                                  className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100 placeholder:font-medium" 
                                />
                             </div>
                          </>
                        )}
                        {activeTab === 'Partnership' && (
                           <div className="col-span-2 relative">
                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E53935]" size={16} />
                              <input 
                                type="text" 
                                value={postData.target}
                                onChange={(e) => setPostData({ ...postData, target: e.target.value })}
                                placeholder="E.g. Distribution Partner, Shop Owner..." 
                                className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100 placeholder:font-medium" 
                              />
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                  <div className="flex gap-4">
                     <button onClick={() => alert("Upload feature coming soon")} className="flex items-center gap-2 text-slate-400 hover:text-[#E53935] transition-colors">
                        <ImageIcon size={20} />
                        <span className="text-[12px] font-bold">Photos</span>
                     </button>
                  </div>
                  <button 
                    onClick={handlePost}
                    disabled={!postData.content.trim()}
                    className="px-8 py-3 bg-[#E53935] disabled:opacity-50 text-white rounded-xl font-bold text-[13px] shadow-lg shadow-red-500/20 hover:bg-slate-900 transition-all uppercase tracking-normal"
                  >
                     {activeTab === 'Update' ? 'Share Now' : 
                      activeTab === 'Hiring' ? 'Post Job' : 
                      activeTab === 'Meeting' ? 'Start Meeting' : 'Find Partner'}
                  </button>
               </div>
            </div>
         </div>

         {/* Feed Posts */}
         <div className="space-y-8 pb-32">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-[2rem] border border-[#EBEFF1] shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden">
                 {/* Post Header */}
                 <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden shadow-sm">
                          <img src={post.avatar} alt="Author" className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                             <h4 className="text-[16px] font-bold text-slate-900">{post.author}</h4>
                             <span className={cn(
                               "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-normal",
                               post.type === 'Hiring' ? "bg-orange-50 text-orange-600" : 
                               post.type === 'Meeting' ? "bg-green-50 text-green-600" : 
                               post.type === 'Partnership' ? "bg-purple-50 text-purple-600" : 
                               "bg-blue-50 text-blue-600"
                             )}>
                               {post.type}
                             </span>
                          </div>
                          <p className="text-[12px] text-slate-400 font-medium mt-0.5">{post.time}</p>
                       </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-600">
                       <MoreHorizontal size={20} />
                    </button>
                 </div>

                 <div className="px-8 pb-8">
                    <p className="text-[16px] text-slate-800 leading-relaxed mb-6 font-medium">
                       {post.content}
                    </p>

                    {/* Post Cards */}
                    {post.type === 'Hiring' && (
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                               <Briefcase size={24} />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Pay Details</p>
                               <p className="text-[15px] font-bold text-slate-900">{post.budget}</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => alert(`Applying for role at ${post.author}...`)}
                           className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[12px] uppercase hover:bg-[#E53935] transition-all shadow-lg"
                         >
                            Apply Now
                         </button>
                      </div>
                    )}

                    {post.type === 'Meeting' && (
                      <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                               <MapPin size={24} />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold uppercase text-green-600/60 mb-0.5">
                                 {post.loc}
                               </p>
                               <p className="text-[15px] font-bold text-green-700">{post.meetTime}</p>
                            </div>
                         </div>
                         <button 
                           onClick={(e) => {
                             const btn = e.currentTarget;
                             btn.innerHTML = "Joining...";
                             setTimeout(() => { btn.innerHTML = "You're Going"; btn.classList.replace("bg-green-600", "bg-slate-100"); btn.classList.replace("text-white", "text-slate-400"); }, 1000);
                           }}
                           className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-[12px] uppercase shadow-lg shadow-green-600/10 transition-all"
                         >
                            Go to Meeting
                         </button>
                      </div>
                    )}

                    {post.images && post.images.length > 0 && (
                      <div className="rounded-2xl overflow-hidden mt-4">
                         <img src={post.images[0]} alt="Post content" className="w-full max-h-[400px] object-cover" />
                      </div>
                    )}
                 </div>

                 {/* Engagement */}
                 <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex gap-10">
                       <button onClick={() => alert("Post liked!")} className="flex items-center gap-2 group">
                          <Heart size={20} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                          <span className="text-[13px] font-bold text-slate-400 group-hover:text-slate-900">{post.likes}</span>
                       </button>
                       <button onClick={() => alert("Comments section coming soon")} className="flex items-center gap-2 group">
                          <MessageSquare size={20} className="text-slate-300 group-hover:text-[#E53935] transition-colors" />
                          <span className="text-[13px] font-bold text-slate-400 group-hover:text-slate-900">{post.comments}</span>
                       </button>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedDeal({
                          name: post.author,
                          role: post.role || (post.type === 'Hiring' ? 'Manager' : 'Business Partner'),
                          match: post.matchScore || 0,
                          avatar: post.avatar
                        });
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-2 text-[#E53935] group"
                    >
                       <Rocket size={18} className="translate-y-px transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                       <span className="text-[13px] font-bold uppercase">Connect Now</span>
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <DealEngine 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        deal={selectedDeal}
      />

      {/* Network Sidebar */}
      <div className="w-[380px] hidden xl:block p-10 space-y-10 bg-white overflow-y-auto no-scrollbar border-l border-[#EBEFF1]">
         <div className="space-y-8">
            <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-normal">People You May Know</h4>
            <div className="space-y-6">
               {[
                 { name: "Rahul Sethi", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100", status: "Business Owner" },
                 { name: "Sana Maryam", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100", status: "Looking for partners" }
               ].map(user => (
                 <div key={user.name} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shadow-sm">
                       <img src={user.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                       <p className="text-[14px] font-bold text-slate-900 leading-tight">{user.name}</p>
                       <p className="text-[11px] text-slate-400 font-medium">{user.status}</p>
                    </div>
                 </div>
               ))}
               <button 
                 onClick={() => alert("Opening Member Directory...")}
                 className="w-full py-4 bg-slate-50 text-slate-400 text-[11px] font-bold uppercase tracking-normal rounded-2xl hover:bg-slate-900 hover:text-white transition-all"
               >
                  See all members
               </button>
            </div>
         </div>

         <div className="bg-[#E53935]/5 rounded-[2.5rem] p-10 border border-[#E53935]/10">
            <Zap size={32} className="text-[#E53935] mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Daily Feed</h2>
            <p className="text-[13px] text-slate-500 font-medium mt-1">
              Activity near 
              <Link href="/explore" className="text-[#E53935] font-bold hover:underline ml-1">
                Technopark Area
              </Link>
            </p>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-10 mt-4">We found <span className="text-[#E53935] font-bold">12 new partners</span> based on your current work.</p>
            <Link href="/match" className="block w-full text-center py-5 bg-[#E53935] text-white rounded-2xl font-bold text-[12px] uppercase shadow-lg shadow-red-500/20 hover:scale-105 transition-all">
               View My Matches
            </Link>
         </div>
      </div>
    </div>
  );
}
