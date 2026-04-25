"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  ChevronDown,
  X,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import { calculateMatchScore, rankEntities } from "@/lib/match-engine";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import ConnectionSentinel from "@/components/home/ConnectionSentinel";
import UnifiedSearch from "@/components/search/UnifiedSearch";
import ActivitySentinel from "@/components/home/ActivitySentinel";
import { optimization } from "@/utils/optimization_engine";

const UniversalFeedCard = dynamic(() => import("@/components/ui/UniversalFeedCard"), { ssr: false });
const DealEngine = dynamic(() => import("@/components/modals/DealEngine"), { ssr: false });
const PostModal = dynamic(() => import("@/components/modals/PostModal"), { ssr: false });
const MomentumView = dynamic(() => import("@/components/modals/MomentumView"), { ssr: false });
const Feed = dynamic(() => import("@/components/home/HomeFeed"), { ssr: false });
const ActiveComposer = dynamic(() => import("@/components/home/ActiveComposer"), { ssr: false });

const SMART_FILTERS = [
  { id: 'All', label: 'Everything', icon: LayoutGrid },
  { id: 'REQUIREMENT', label: 'Needs', icon: Target },
  { id: 'PARTNERSHIP', label: 'Partners', icon: Sparkles },
  { id: 'MEETUP', label: 'Meetups', icon: Users },
];

export default function CheckoutHomeFeed() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);
  const [isPostActionLoop, setIsPostActionLoop] = useState<{ active: boolean; postId: string; type: any }>({ 
    active: false, 
    postId: '', 
    type: 'REQUIREMENT' 
  });

  const [postInitialType, setPostInitialType] = useState<any>(null);

  const supabase = createClient();

  const initHome = async () => {
    setIsLoading(true);
    if (!authUser) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: postsData, error: primaryError } = await supabase
        .from('posts')
        .select(`
          id, created_at, type, title, content, location, match_score, 
          budget, due_date, skills_required, urgency,
          partnershipType, industry, commitmentLevel,
          mode, dateTime, payment_type, max_slots, context,
          author_profile:profiles!author_id(id, full_name, avatar_url, role, location, skills, match_score)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (primaryError) throw primaryError;

      const { CheckoutScoreService } = await import("@/lib/checkout-score");

      const mapped = (postsData || []).map(p => {
        const author = p.author_profile;
        const checkoutScore = author?.metadata?.checkout_score || author?.match_score || 50;
        
        return {
          ...p,
          author_id: author?.id,
          user_id: author?.id,
          author: author?.full_name || "Anonymous",
          avatar: author?.avatar_url || DEFAULT_AVATAR,
          time: p.created_at ? new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Just now", 
          rank: author?.role || "Member",
          matchScore: p.match_score || 0,
          badge: CheckoutScoreService.getRank(checkoutScore)
        };
      });

      // INTELLIGENT RANKING (Match Engine V3)
      const ranked = rankEntities(authUser, mapped);
      setPosts(ranked);
    } catch (err: any) {
      console.error("Feed Loading Error:", err);
      alert(`Feed failed to load: ${err.message || 'Unknown error'}. Please refresh.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
       initHome();
       analytics.trackScreen('HOME', authUser?.id);
    }
  }, [authUser]);

  const filteredPosts = useMemo(() => {
    let base = posts;
    if (activeFilter !== 'All') {
      base = posts.filter(p => {
        const type = p.type?.toUpperCase();
        if (activeFilter === 'REQUIREMENT') return type === 'REQUIREMENT' || type === 'LEAD' || type === 'HIRING';
        if (activeFilter === 'PARTNERSHIP') return type === 'PARTNERSHIP' || type === 'PARTNER';
        return type === activeFilter;
      });
    }
    
    // Visibility Limit: Hide extremely low trust users (below 10), but ALWAYS show own posts
    return base.filter(p => p.author_id === authUser?.id || (p.author_profile?.match_score ?? 50) >= 10);
  }, [activeFilter, posts]);

  const handleOpenPosting = async (type: any = null) => {
    if (!authUser) return;
    
    // ANTI-SPAM GUARD: Limit 3 posts per day
    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', authUser.id)
      .gte('created_at', today);
      
    if (count !== null && count >= 10) {
      alert("Daily limit reached. High-trust members get more slots. Keep engaging to grow!");
      return;
    }
    
    setEditPost(null); 
    setPostInitialType(type);
    setIsPosting(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/30 selection:bg-[#E53935]/10 font-sans pb-16">
      
      {/* 2. FEED AREA */}
      <main className="w-[94%] mx-auto max-w-5xl pt-6">
         <div className="grid grid-cols-1 gap-4">
            
            {/* NEW ACTIVE COMPOSER */}
            <ActiveComposer 
               user={authUser} 
               onPost={(type) => handleOpenPosting(type)} 
            />

            {/* REDESIGNED FILTER BAR */}
            <div className="flex items-center justify-end gap-2 mb-4 px-2">
               <div className="relative">
                  <button 
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="h-9 px-4 bg-white border border-[#292828]/5 rounded-lg flex items-center gap-3 text-[10px] font-black uppercase text-[#292828] shadow-sm hover:border-[#292828]/20 transition-all group"
                  >
                     <LayoutGrid size={14} className="text-[#E53935]" />
                     {SMART_FILTERS.find(f => f.id === activeFilter)?.label}
                     <ChevronDown size={12} className={cn("text-slate-300 transition-transform group-hover:text-[#292828]", isFilterDropdownOpen && "rotate-180")} />
                  </button>
                  {isFilterDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#292828]/10 rounded-xl shadow-4xl p-1 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                       {SMART_FILTERS.map(f => (
                         <button 
                           key={f.id}
                           onClick={() => { setActiveFilter(f.id); setIsFilterDropdownOpen(false); }}
                           className={cn(
                             "w-full h-10 px-4 flex items-center gap-3 rounded-lg text-[10px] font-black uppercase transition-all",
                             activeFilter === f.id ? "bg-[#292828] text-white" : "text-slate-400 hover:bg-slate-50 hover:text-[#292828]"
                           )}
                         >
                            <f.icon size={12} />
                            {f.label}
                         </button>
                       ))}
                    </div>
                  )}
               </div>

               <button className="h-9 w-9 bg-white border border-[#292828]/5 rounded-lg flex items-center justify-center text-slate-300 hover:text-[#292828] hover:border-[#292828]/20 shadow-sm transition-all">
                  <Filter size={14} />
               </button>
            </div>

            {/* MOMENTUM SYSTEM */}
            {isPostActionLoop.active && (
              <MomentumView 
                postId={isPostActionLoop.postId}
                type={isPostActionLoop.type}
                onClose={() => setIsPostActionLoop({ active: false, postId: '', type: 'REQUIREMENT' })}
              />
            )}

            <Feed 
               posts={filteredPosts} 
               isLoading={isLoading} 
               currentUserId={authUser?.id}
               onAction={(post) => { setSelectedDeal(post); setIsModalOpen(true); }}
               onEdit={(p) => { setEditPost(p); setIsPosting(true); }}
               onCreate={handleOpenPosting}
               onDelete={async (p) => {
                  if(confirm("Delete this?")) {
                     await supabase.from('posts').delete().eq('id', p.id);
                     initHome();
                  }
               }}
            />
         </div>
      </main>

      {/* HIGH-PERFORMANCE FLOATING ACTION BUTTON */}
      <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-700">
         <button 
           onClick={handleOpenPosting}
           className="h-14 px-8 bg-[#292828] text-white rounded-full flex items-center gap-4 shadow-3xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all ring-1 ring-white/10 backdrop-blur-xl group"
         >
            <div className="h-6 w-6 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#E53935] group-hover:text-white transition-all">
               <Plus size={18} strokeWidth={3} />
            </div>
            <span className="text-[12px] font-black uppercase tracking-tight">Post Now</span>
         </button>
      </div>

      {/* MODALS */}
      {isPosting && (
        <PostModal 
          isOpen={isPosting} 
          onClose={() => setIsPosting(false)} 
          initialFormType={postInitialType}
          onPostSuccess={(newPost) => {
             initHome();
             setIsPosting(false);
             setIsPostActionLoop({ active: true, postId: newPost.id, type: newPost.type });
             analytics.track('ACTION_CREATED', authUser?.id, { type: newPost.type });
          }} 
          editPost={editPost}
        />
      )}
      
      {selectedDeal && (
        <DealEngine isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} deal={selectedDeal} />
      )}
    </div>
  );
}
