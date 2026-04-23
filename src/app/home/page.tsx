"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Globe,
  BrainCircuit,
  Award,
  Shield,
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  User,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import { calculateMatchScore } from "@/lib/match_engine";
import ConnectionSentinel from "@/components/home/ConnectionSentinel";

const UniversalFeedCard = dynamic(() => import("@/components/ui/UniversalFeedCard"), { ssr: false });
const DealEngine = dynamic(() => import("@/components/modals/DealEngine"), { ssr: false });
const PostModal = dynamic(() => import("@/components/modals/PostModal"), { ssr: false });
const ReviewModal = dynamic(() => import("@/components/modals/ReviewModal"), { ssr: false });

const SMART_FILTERS = [
  { id: 'All', label: 'Everything', icon: LayoutGrid },
  { id: 'LEAD', label: 'Leads', icon: Target },
  { id: 'HIRING', label: 'Jobs', icon: Briefcase },
  { id: 'PARTNER', label: 'Partnerships', icon: Sparkles },
  { id: 'Meetup', label: 'Meetups', icon: Users },
];

export default function CheckoutHomeFeed() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [formType, setFormType] = useState<"Update" | "Lead" | "Hiring" | "Partner" | "Meetup">("Lead");
  const [posts, setPosts] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editPost, setEditPost] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const supabase = createClient();



  const initTerminal = async () => {
    setIsLoading(true);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      setIsLoading(false);
      return;
    }

    // Parallel Fetch: Profile + Posts
    const [profileRes, postsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', authUser.id).single(),
      supabase.from('posts').select(`*, author:profiles(id, full_name, avatar_url, match_score, role, location, skills)`).order('created_at', { ascending: false })
    ]);

    if (profileRes.data) {
       setUser(profileRes.data);
       if (postsRes.data) {
          processPosts(postsRes.data, profileRes.data);
       }
    }
    setIsVerified(!!authUser.email_confirmed_at);
    setIsLoading(false);
  };

  const processPosts = (data: any[], profile: any) => {
    const mapped = data.map(p => {
      const author = Array.isArray(p.author) ? p.author[0] : p.author;
      const matchResult = calculateMatchScore(
        {
          role: profile?.role || "PROFESSIONAL",
          industry: profile?.location || "Tech",
          expertise_tags: profile?.skills || [],
          intent_tags: profile?.metadata?.intents || [],
          experience_years: 5,
          location: profile?.location || "Trivandrum"
        },
        {
          type: p.type,
          required_expertise: p.skills_required || [],
          target_intent: p.metadata?.target_intent || p.type,
          location: p.location || author?.location || "Trivandrum",
          author_role: String(author?.role || "PROFESSIONAL")
        }
      );

      const mappedPost = {
        ...p,
        user_id: author?.id,
        user_name: String(author?.full_name || "Partner"),
        user_avatar: author?.avatar_url,
        user_role: String(author?.role || "Pro"),
        location: String(p.location || author?.location || "Trivandrum"),
        match_score: matchResult.score,
        matchReasons: matchResult.reasons
      };
      delete (mappedPost as any).author;
      return mappedPost;
    });
    setPosts(mapped.sort((a, b) => b.match_score - a.match_score));
  };

  useEffect(() => {
    initTerminal();
  }, []);

  const rankedPosts = useMemo(() => {
    return posts.filter(p => activeFilter === 'All' || p.type.toUpperCase() === activeFilter.toUpperCase());
  }, [activeFilter, posts]);

  const handleEdit = (post: any) => {
    setEditPost(post);
    setFormType(post.type.charAt(0).toUpperCase() + post.type.slice(1).toLowerCase() as any);
    setIsPosting(true);
  };

  const handleDelete = async (post: any) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    if (post.user_id !== user?.id && post.author_id !== user?.id) {
       alert("Action denied: You are not the owner of this feed item.");
       return;
    }

    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (error) {
       alert("Failed to delete: " + error.message);
    } else {
       initTerminal();
    }
  };

  return (
    <div className="w-full max-w-none mx-auto px-6 py-8 selection:bg-[#E53935]/10">
      
      {/* MAIN FEED (Now filling entire center horizon) */}
      <div className="max-w-4xl space-y-10">
         {/* COMPOSER */}
         <section className="bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] group transition-all hover:border-slate-200">
            <div className="flex items-center gap-3 p-4">
               <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <User size={20} className="text-[#292828]/20" />
                  )}
               </div>
               <button 
                 onClick={() => { setEditPost(null); setFormType("Lead"); setIsPosting(true); }}
                 className="flex-1 h-12 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl px-5 text-left text-[11px] font-bold uppercase transition-all flex items-center justify-between"
               >
                  <span>What are you looking for today?</span>
                  <Zap size={16} className="text-[#E53935]" />
               </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 px-1.5 pb-1.5">
               {[
                  { id: 'Lead', icon: Target, label: "Post a Need" },
                  { id: 'Hiring', icon: Briefcase, label: "Hiring" },
                  { id: 'Partner', icon: Sparkles, label: "Partnership" },
                  { id: 'Meetup', icon: Users, label: "Meetup" }
               ].map((btn) => (
                  <button 
                    key={btn.id}
                    onClick={() => { setEditPost(null); setFormType(btn.id as any); setIsPosting(true); }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-slate-50 transition-all group/btn"
                  >
                     <btn.icon size={16} className="text-slate-400 group-hover/btn:text-[#E53935] transition-colors" />
                     <span className="text-[10px] font-bold text-slate-400 group-hover/btn:text-slate-900 uppercase">
                        {btn.label}
                     </span>
                  </button>
               ))}
            </div>
         </section>

         {/* FILTERS - PREMIUM DROPDOWN */}
         <div className="relative group/filters">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={cn(
                 "flex items-center justify-between px-5 h-10 w-fit gap-4 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap border-2",
                 "bg-white text-slate-400 border-slate-100 hover:border-slate-300 shadow-sm"
              )}
            >
               <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = SMART_FILTERS.find(f => f.id === activeFilter)?.icon || LayoutGrid;
                    return <Icon size={14} />;
                  })()}
                  <span>Filter: {SMART_FILTERS.find(f => f.id === activeFilter)?.label || "Everything"}</span>
               </div>
               <ChevronDown size={14} className={cn("transition-transform duration-300", isFilterDropdownOpen && "rotate-180")} />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-40 animate-in slide-in-from-top-4 duration-500">
                 <div className="p-2 grid grid-cols-1 gap-1">
                    {SMART_FILTERS.map(f => (
                       <button 
                         key={f.id}
                         onClick={() => { setActiveFilter(f.id); setIsFilterDropdownOpen(false); }}
                         className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl transition-all text-left",
                            activeFilter === f.id ? "bg-[#292828] text-white shadow-xl" : "hover:bg-slate-50 text-slate-500"
                         )}
                       >
                          <f.icon size={16} />
                          <span className="text-[11px] font-black uppercase tracking-tight">{f.label}</span>
                       </button>
                    ))}
                 </div>
              </div>
            )}
         </div>

         {/* FEED */}
         <div className="space-y-6 pb-20">
            {rankedPosts.map(post => (
               <UniversalFeedCard 
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                  onAction={() => { setSelectedDeal(post); setIsModalOpen(true); }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
               />
            ))}
         </div>
      </div>

      {/* RIGHT: SIDEBAR (4 COLS) */}
      <aside className="lg:col-span-3 space-y-6 hidden lg:block">
         <ConnectionSentinel />
         

      </aside>

      {/* MODALS */}
      {isPosting && (
        <PostModal 
          isOpen={isPosting} 
          onClose={() => setIsPosting(false)} 
          onPostSuccess={() => { initTerminal(); setIsPosting(false); }} 
          initialFormType={formType}
          editPost={editPost}
        />
      )}
      {selectedDeal && (
        <DealEngine isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} deal={selectedDeal} />
      )}
    </div>
  );
}
