"use client";

import React, { useState } from "react";
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
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_POSTS = [
  {
    id: 1,
    type: "Hiring",
    author: "Rahul Sethi",
    time: "45m ago",
    content: "We are looking for a Senior UI/UX Designer to join our team. If you have 4+ years of experience in product design, let's talk!",
    budget: "$80k - $120k",
    role: "Senior UI/UX Designer",
    likes: 42,
    comments: 18,
    matchScore: 94,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
  },
  {
    id: 10,
    type: "Meetup",
    author: "Sana Maryam",
    time: "10m ago",
    content: "Hosting a quick coffee sync for architects in Trivandrum today!",
    loc: "Technopark Ph-III",
    meetTime: "5:00 PM Today",
    likes: 5,
    comments: 2,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
  },
  {
    id: 2,
    type: "Update",
    author: "Ahmad Nur F.",
    time: "2h ago",
    content: "CheckOut just reached a new milestone: 100 business connections made this month! Our community is growing every day.",
    likes: 890,
    comments: 45,
    images: ["/images/hero-event.jpg"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
  }
];

export default function Home() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<"Update" | "Hiring" | "Partnership" | "Meetup">("Update");
  const [postData, setPostData] = useState({ content: "", budget: "", role: "", loc: "", time: "", target: "" });

  const handlePost = () => {
    if (!postData.content.trim()) return;
    const newPost = {
      id: Date.now(),
      type: activeTab,
      author: "Ahmad Nur Fawaid",
      time: "Just now",
      content: postData.content,
      budget: postData.budget,
      role: postData.role,
      loc: postData.loc,
      meetTime: postData.time,
      likes: 0,
      comments: 0,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
    };
    setPosts([newPost, ...posts]);
    setPostData({ content: "", budget: "", role: "", loc: "", time: "", target: "" });
  };

  return (
    <div className="flex flex-1 min-h-0 bg-[#F8FAFB]">
      
      {/* Column 2: Dashboard Feed */}
      <div className="flex-1 p-8 border-r border-[#EBEFF1] overflow-y-auto no-scrollbar">
         
         {/* Advanced Composer Terminal */}
         <div className="bg-white rounded-[2rem] border border-[#EBEFF1] mb-10 shadow-xl shadow-slate-200/20 overflow-hidden">
            <div className="flex border-b border-slate-50">
               {(['Update', 'Hiring', 'Partnership', 'Meetup'] as const).map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                     "flex-1 py-4 text-[11px] font-bold uppercase tracking-widest transition-all relative",
                     activeTab === tab ? "text-primary bg-slate-50/50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/30"
                   )}
                 >
                    {activeTab === tab && <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />}
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
                         activeTab === 'Hiring' ? "Describe the role..." : 
                         activeTab === 'Meetup' ? "What's the plan?" : 
                         activeTab === 'Partnership' ? "What are you looking for?" : "Share something with the community..."
                       }
                       className="w-full bg-transparent text-[16px] font-medium placeholder:text-slate-300 outline-none resize-none min-h-[60px]"
                     />

                     {/* Dynamic Fields */}
                     <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        {activeTab === 'Hiring' && (
                          <>
                             <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                                <input 
                                  type="text" 
                                  value={postData.role}
                                  onChange={(e) => setPostData({ ...postData, role: e.target.value })}
                                  placeholder="Role Title" 
                                  className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100" 
                                />
                             </div>
                             <div className="relative">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                                <input 
                                  type="text" 
                                  value={postData.budget}
                                  onChange={(e) => setPostData({ ...postData, budget: e.target.value })}
                                  placeholder="Budget/Salary" 
                                  className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100" 
                                />
                             </div>
                          </>
                        )}
                        {activeTab === 'Meetup' && (
                          <>
                             <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                                <input 
                                  type="text" 
                                  value={postData.loc}
                                  onChange={(e) => setPostData({ ...postData, loc: e.target.value })}
                                  placeholder="Location" 
                                  className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100" 
                                />
                             </div>
                             <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                                <input 
                                  type="text" 
                                  value={postData.time}
                                  onChange={(e) => setPostData({ ...postData, time: e.target.value })}
                                  placeholder="Time / Date" 
                                  className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100" 
                                />
                             </div>
                          </>
                        )}
                        {activeTab === 'Partnership' && (
                           <div className="col-span-2 relative">
                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                              <input 
                                type="text" 
                                value={postData.target}
                                onChange={(e) => setPostData({ ...postData, target: e.target.value })}
                                placeholder="Looking for (e.g. Marketing Agency Partner)" 
                                className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 text-[13px] font-bold outline-none border border-slate-100" 
                              />
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                  <div className="flex gap-4">
                     <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                        <ImageIcon size={20} />
                        <span className="text-[12px] font-bold">Media</span>
                     </button>
                     <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                        <Smile size={20} />
                        <span className="text-[12px] font-bold">Activity</span>
                     </button>
                  </div>
                  <button 
                    onClick={handlePost}
                    disabled={!postData.content.trim()}
                    className="px-8 py-3 bg-primary disabled:opacity-50 text-white rounded-xl font-bold text-[13px] shadow-lg shadow-primary/20 hover:bg-black transition-all uppercase tracking-widest"
                  >
                     Post Update
                  </button>
               </div>
            </div>
         </div>

         {/* Refined Feed */}
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
                               "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                               post.type === 'Hiring' ? "bg-orange-50 text-orange-600" : 
                               post.type === 'Meetup' ? "bg-green-50 text-green-600" : 
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

                    {/* Specialized Data Cards */}
                    {post.type === 'Hiring' && (
                      <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                               <Briefcase size={24} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Salary Profile</p>
                               <p className="text-[15px] font-black text-slate-900">{post.budget}</p>
                            </div>
                         </div>
                         <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[12px] uppercase hover:bg-primary transition-all shadow-lg">Apply Now</button>
                      </div>
                    )}

                    {post.type === 'Meetup' && (
                      <div className="p-6 bg-green-50 rounded-[1.5rem] border border-green-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                               <MapPin size={24} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase text-green-600/60 tracking-widest mb-0.5">{post.loc}</p>
                               <p className="text-[15px] font-black text-green-700">{post.meetTime}</p>
                            </div>
                         </div>
                         <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-[12px] uppercase shadow-lg shadow-green-600/10">I'm Interested</button>
                      </div>
                    )}

                    {post.images && post.images.length > 0 && (
                      <div className="rounded-[1.5rem] overflow-hidden">
                         <img src={post.images[0]} alt="Post" className="w-full h-[400px] object-cover" />
                      </div>
                    )}
                 </div>

                 {/* Engagement */}
                 <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex gap-10">
                       <button className="flex items-center gap-2 group">
                          <Heart size={20} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                          <span className="text-[13px] font-bold text-slate-400 group-hover:text-slate-900">{post.likes}</span>
                       </button>
                       <button className="flex items-center gap-2 group">
                          <MessageSquare size={20} className="text-slate-300 group-hover:text-primary transition-colors" />
                          <span className="text-[13px] font-bold text-slate-400 group-hover:text-slate-900">{post.comments}</span>
                       </button>
                    </div>
                    <button className="flex items-center gap-2 text-primary group">
                       <Rocket size={18} className="translate-y-px transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                       <span className="text-[13px] font-black uppercase tracking-widest">Connect</span>
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Column 3: Network Sidebar */}
      <div className="w-[380px] hidden xl:block p-10 space-y-10 bg-white overflow-y-auto no-scrollbar border-l border-[#EBEFF1]">
         <div className="space-y-8">
            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Network Status</h4>
            <div className="space-y-6">
               {[
                 { name: "Rahul Sethi", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100", status: "Active" },
                 { name: "Sana Maryam", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100", status: "Searching..." }
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
               <button className="w-full py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all">View All Nodes</button>
            </div>
         </div>

         <div className="bg-primary/5 rounded-[2.5rem] p-10 border border-primary/10">
            <Zap size={32} className="text-primary mb-6 animate-pulse" />
            <h5 className="text-2xl font-black text-slate-900 leading-tight mb-4 uppercase italic">Partner<br />Discovery</h5>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-10">We found <span className="text-primary font-bold">12 new matches</span> based on your current project activity.</p>
            <button className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[12px] uppercase shadow-2xl shadow-primary/20 hover:scale-105 transition-all">Explore Matches</button>
         </div>
      </div>
    </div>
  );
}
