"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Target, 
  MapPin, 
  Sparkles, 
  LayoutGrid, 
  Briefcase, 
  Users, 
  Zap, 
  TrendingUp, 
  ArrowUpRight,
  Maximize2,
  Bookmark,
  ChevronUp,
  Search,
  Filter,
  Plus,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import UniversalFeedCard from "@/components/ui/UniversalFeedCard";
import DealEngine from "@/components/modals/DealEngine";
import PostModal from "@/components/modals/PostModal";
import { calculateMatchScore, optimizeFeedOrder } from "@/lib/ai";
import { Calendar, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import ReviewModal from "@/components/modals/ReviewModal";

const MOCK_CURRENT_USER = {
  role: "Strategy",
  bio: "Expert in scaling brands and regional growth. Founder of scaling nodes.",
  domains: ["Strategy", "Marketing", "FMCG"]
};

const SMART_FILTERS = [
  { id: 'All', label: 'Everything', icon: LayoutGrid },
  { id: 'LEAD', label: 'What People Need', icon: Target },
  { id: 'HIRING', label: 'Jobs', icon: Briefcase },
  { id: 'PARTNER', label: 'Partnerships', icon: Sparkles },
  { id: 'Meetup', label: 'Meetups', icon: Users },
  { id: 'UPDATE', label: 'Latest Updates', icon: Zap },
];

export default function CheckoutHomeFeed() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [formType, setFormType] = useState<"Update" | "Lead" | "Hiring" | "Partner" | "Meetup">("LEAD");
  const [posts, setPosts] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editPost, setEditPost] = useState<any>(null);
  const [isJoinedToSyndicate, setIsJoinedToSyndicate] = useState<boolean>(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const supabase = createClient();

  const fetchPosts = async () => {
    setIsLoading(true);
    
    // 1. Fetch Current User Identity and Embedding
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // 2. Call Neural Match RPC (or fallback to standard fetch)
    const { data: rankedData, error } = await supabase.rpc('match_posts', {
      query_embedding: profile?.embedding || null,
      match_threshold: 0.1, // Show a broader range on home
      match_count: 50
    });

    if (rankedData) {
      // 3. Hydrate with Author Metadata
      const authorIds = [...new Set(rankedData.map((p: any) => p.author_id))];
      const { data: authors } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, match_score')
        .in('id', authorIds);
      
      const authorMap = (authors || []).reduce((acc: any, cur: any) => {
        acc[cur.id] = cur;
        return acc;
      }, {});

      const mappedPosts = rankedData.map((p: any) => ({
        ...p,
        author: authorMap[p.author_id]?.full_name || "Community Partner",
        avatar: authorMap[p.author_id]?.avatar_url || `https://i.pravatar.cc/150?u=${p.author_id}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchScore: Math.round(p.similarity * 100) || authorMap[p.author_id]?.match_score || 85
      }));

      setPosts(mappedPosts);
    } else {
      // Fallback if RPC fails or no embedding
      const { data } = await supabase
        .from('posts')
        .select(`*, author:profiles(full_name, avatar_url, match_score)`)
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(data.map(p => ({
          ...p,
          author: p.author?.full_name || "Partner",
          avatar: p.author?.avatar_url || `https://i.pravatar.cc/150?u=${p.id}`,
          matchScore: p.author?.match_score || 80
        })));
      }
    }
    setIsLoading(false);
  };

  const checkSyndicateStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { count } = await supabase
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    setIsJoinedToSyndicate(count ? count > 0 : false);
  };

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('bookings')
      .select('*, advisor:profiles!bookings_advisor_id_fkey(full_name), client:profiles!bookings_client_id_fkey(full_name)')
      .or(`advisor_id.eq.${user.id},client_id.eq.${user.id}`)
      .order('scheduled_at', { ascending: true })
      .limit(3);
    
    if (data) {
      setBookings(data);
      // Calculate Simulated Revenue (Advisor role only)
      const revenue = data
        .filter((b: any) => b.advisor_id === user.id && b.status !== 'CANCELLED')
        .length * 2500;
      setTotalRevenue(revenue);
    }
  };

  const handleBookingStatus = async (bookingId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);
    
    if (error) {
      alert("Status update failed.");
    } else {
      fetchBookings();
      // Notify Client
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        await supabase.from('notifications').insert([{
           user_id: booking.client_id,
           title: `Session ${status.toLowerCase()}`,
           message: `Your tactical session on ${new Date(booking.scheduled_at).toLocaleDateString()} has been ${status.toLowerCase()}.`,
           type: 'BOOKING',
           link: '/home'
        }]);
      }
    }
  };

  const checkIdentityStatus = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setUser(authUser);
      if (!authUser.email_confirmed_at) {
        setIsVerified(false);
      }
    }
  };

  React.useEffect(() => {
    fetchPosts();
    checkSyndicateStatus();
    fetchBookings();
    checkIdentityStatus();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      alert("Failed to delete post.");
    } else {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleEditPost = (post: any) => {
    setEditPost(post);
    setIsPosting(true);
  };

  const rankedPosts = useMemo(() => {
    // 1. Filter by category
    const filtered = posts.filter(p => {
      if (activeFilter !== 'All' && p.type !== activeFilter) return false;
      return true;
    });

    // 2. Optimized Intelligence (Invisible Logic)
    return optimizeFeedOrder(filtered, MOCK_CURRENT_USER).map(post => ({
      ...post,
      // Inject smarter internal score while keeping dummy structure
      matchScore: Math.round((post.matchScore + calculateMatchScore(MOCK_CURRENT_USER, post)) / 2)
    }));
  }, [activeFilter, posts]);

  const handlePostSuccess = (newPost: any) => {
    setPosts([newPost, ...posts]);
    setIsPosting(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 lg:py-8 space-y-6 selection:bg-[#E53935]/10">
      
      {/* 1. COMPOSER */}
      <section className="bg-white rounded-[24px] p-2 border border-[#292828]/10 shadow-premium group transition-all hover:border-[#292828]/20">
         <div className="flex items-center gap-3 p-3 lg:p-4">
            <div className="h-10 w-10 rounded-xl bg-[#292828] overflow-hidden border border-[#292828]/10 shrink-0 flex items-center justify-center text-white">
               <img src="https://i.pravatar.cc/150?u=me" className="h-full w-full grayscale contrast-125" alt="" />
            </div>
            <button 
              onClick={() => { setFormType("Update"); setIsPosting(true); }}
              className="flex-1 h-12 bg-[#292828]/5 hover:bg-[#292828]/10 text-[#292828]/40 rounded-xl px-5 text-left text-[13px] font-bold uppercase transition-all flex items-center justify-between"
            >
               <span>Share what you need...</span>
               <Zap size={16} className="text-[#292828]" />
            </button>
         </div>
         
         <div className="grid grid-cols-2 lg:grid-cols-5 gap-1 px-1.5 pb-1.5">
            {[
               { id: 'Lead', icon: Target, label: "Post a Need", color: "text-[#292828]" },
               { id: 'Hiring', icon: Briefcase, label: "Hiring", color: "text-[#292828]" },
               { id: 'Partner', icon: Sparkles, label: "Partnership", color: "text-[#292828]" },
               { id: 'Meetup', icon: Users, label: "Meetups", color: "text-[#292828]" },
               { id: 'Update', icon: Zap, label: "Update Now", color: "text-[#292828]" }
            ].map((btn, i) => (
               <button 
                 key={i}
                 onClick={() => {
                   setFormType(btn.id as any);
                   setIsPosting(true);
                 }}
                 className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-[#292828]/5 transition-all group/btn",
                    i === 4 && "col-span-2 lg:col-span-1"
                 )}
               >
                  <btn.icon size={16} className={cn("transition-transform group-hover/btn:scale-110", btn.color)} />
                  <span className="text-[9px] lg:text-[10px] font-bold tracking-tight text-[#292828]/60 group-hover/btn:text-[#292828] text-center">
                     {btn.label}
                  </span>
               </button>
            ))}
         </div>
      </section>

      {/* 2. IDENTITY & ONBOARDING SENTINELS */}
      {!isVerified && (
         <div className="bg-[#E53935] text-white p-8 rounded-[32px] mb-8 shadow-2xl animate-in slide-in-from-top-4 duration-700 flex items-center justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
            <div className="flex items-center gap-6 relative z-10">
               <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Mail size={30} className="animate-bounce-subtle" />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Identity Pending Verification</h3>
                  <p className="text-white/70 font-medium text-sm">Please confirm your email address to unlock full network authority and mandate posting.</p>
               </div>
            </div>
            <div className="flex items-center gap-4 relative z-10">
               <span className="hidden md:block text-[10px] font-black uppercase bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md">Check Tactical Inbox</span>
            </div>
         </div>
      )}

      {!isJoinedToSyndicate && isVerified && (
        <div className="bg-[#292828] p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700">
           {/* Cinematic Backdrop */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#E53935]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <Globe size={18} className="text-[#E53935]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E53935]">Network Activation Required</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight mb-4">
                 Your node is currently <br /> <span className="text-[#E53935]">De-synchronized</span>
              </h2>
              <p className="text-[14px] font-medium text-white/50 mb-8 max-w-md">
                 To unlock sector-specific mandates and regional business capital, you must join a professional Syndicate guild.
              </p>
              <Link 
                href="/communities"
                className="inline-flex items-center gap-3 px-8 h-14 bg-white text-[#292828] rounded-2xl font-black text-xs uppercase hover:bg-[#E53935] hover:text-white transition-all shadow-xl group"
              >
                 Find Your Syndicate <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
           </div>

           {/* Stylized Node Graphics */}
           <div className="absolute right-8 bottom-0 opacity-10 pointer-events-none translate-y-1/4">
              <Users size={180} strokeWidth={1} />
           </div>
        </div>
      )}

      {/* 2. QUICK FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
         {SMART_FILTERS.map(f => (
           <button 
             key={f.id}
             onClick={() => setActiveFilter(f.id)}
             className={cn(
               "flex items-center gap-2 px-5 h-10 rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap border",
               activeFilter === f.id 
                 ? "bg-[#292828] text-white border-[#292828] shadow-lg" 
                 : "bg-white text-[#292828]/40 border-[#292828]/5 hover:border-[#292828]/20"
             )}
           >
             <f.icon size={14} /> {f.label}
           </button>
         ))}
      </div>

      {/* 3. YOUR BEST FEED & SIDEBAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
         <div className="space-y-6">
            {rankedPosts.map(post => (
               <UniversalFeedCard 
               key={post.id}
               post={post}
               isExpanded={expandedId === post.id}
               onExpand={() => setExpandedId(expandedId === post.id ? null : post.id)}
               onAction={() => { setSelectedDeal(post); setIsModalOpen(true); }}
               onEdit={handleEditPost}
               onDelete={handleDeletePost}
               />
            ))}
         </div>

         {/* SIDEBAR WIDGETS */}
         <aside className="hidden lg:block space-y-6">
            <div className="bg-white rounded-[24px] p-6 border border-[#292828]/10 shadow-premium">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-[#292828]/40 mb-6 flex items-center justify-between">
                  Board Schedule <Calendar size={14} />
               </h3>
               
               <div className="space-y-4">
                  {bookings.length > 0 ? bookings.map((b) => (
                    <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-default">
                       <div className="flex items-center justify-between mb-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-tighter text-white",
                            b.status === 'PENDING' ? "bg-amber-500" : b.status === 'CONFIRMED' ? "bg-emerald-600" : "bg-[#292828]"
                          )}>
                             {b.status}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400">{new Date(b.scheduled_at).toLocaleDateString()}</span>
                       </div>
                       <p className="text-[12px] font-bold text-[#292828] mb-1 truncate">
                          {currentUser?.id === b.advisor_id ? `Client: ${b.client?.full_name}` : `Expert: ${b.advisor?.full_name}`}
                       </p>
                       <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 mb-3">
                          <Clock size={10} /> 1 HR Session
                       </div>

                       {/* ADVISOR ACTIONS */}
                       {currentUser?.id === b.advisor_id && b.status === 'PENDING' && (
                         <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 mt-3">
                            <button 
                              onClick={() => handleBookingStatus(b.id, 'CONFIRMED')}
                              className="h-8 bg-emerald-600 text-white rounded-lg text-[8px] font-black uppercase hover:bg-emerald-700 transition-all shadow-sm"
                            >
                               Accept
                            </button>
                            <button 
                              onClick={() => handleBookingStatus(b.id, 'CANCELLED')}
                              className="h-8 bg-white border border-slate-200 text-slate-400 rounded-lg text-[8px] font-black uppercase hover:bg-red-50 hover:text-red-600 transition-all"
                            >
                               Decline
                            </button>
                         </div>
                       )}

                       {/* CLIENT ACTIONS */}
                       {currentUser?.id === b.client_id && b.status === 'CONFIRMED' && (
                          <div className="border-t border-slate-100 pt-3 mt-3">
                             <button 
                               onClick={() => {
                                 setSelectedBookingForReview(b);
                                 setIsReviewModalOpen(true);
                               }}
                               className="w-full h-10 bg-[#292828] text-white rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-[#E53935] transition-all shadow-lg"
                             >
                                Finalize Mandate <CheckCircle2 size={14} />
                             </button>
                          </div>
                       )}
                    </div>
                  )) : (
                    <div className="py-10 text-center opacity-20 italic text-[11px]">No active mandates</div>
                  )}
               </div>

               <Link href="/advisors" className="mt-8 flex items-center justify-center gap-2 w-full h-12 bg-[#292828]/5 rounded-xl text-[9px] font-black uppercase text-[#292828] hover:bg-[#292828] hover:text-white transition-all group">
                  Discover Experts <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

            {/* FINOPS WIDGET */}
            <div className="bg-[#292828] rounded-[24px] p-6 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp size={80} />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Revenue Flow</h3>
               <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">Total Tactical Earnings</span>
                  <div className="text-3xl font-black italic">₹{totalRevenue.toLocaleString()}</div>
               </div>
               <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/40">
                     <span>Active Mandates</span>
                     <span className="text-white">{bookings.filter(b => b.status === 'PENDING').length}</span>
                  </div>
               </div>
            </div>
         </aside>
      </div>

      {/* FLOAT ACTION */}
      <div className="fixed bottom-10 right-10 z-[100] lg:hidden">
         <button 
           onClick={() => { setEditPost(null); setIsPosting(true); }}
           className="h-16 w-16 bg-[#292828] text-white rounded-[20px] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
         >
            <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
         </button>
      </div>

      {/* MODALS */}
      {selectedDeal && (
        <DealEngine isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} deal={selectedDeal} />
      )}
      {isPosting && (
        <PostModal 
          isOpen={isPosting} 
          onClose={() => { setIsPosting(false); setEditPost(null); }} 
          onPostSuccess={() => { fetchPosts(); setIsPosting(false); setEditPost(null); }} 
          initialFormType={formType}
          editPost={editPost}
        />
      )}

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        booking={selectedBookingForReview}
        onSuccess={fetchBookings}
      />
    </div>
  );
}
