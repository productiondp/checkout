"use client";

import React, { useState, useMemo } from "react";
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
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import UniversalFeedCard from "@/components/ui/UniversalFeedCard";
import DealEngine from "@/components/modals/DealEngine";
import PostModal from "@/components/modals/PostModal";
import { calculateMatchScore, optimizeFeedOrder } from "@/lib/ai";

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

  const supabase = createClient();

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('posts')
      .select(`*, author:profiles(full_name, avatar_url)`)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      const mappedPosts = data.map(p => ({
        ...p,
        author: p.author?.full_name || "Anonymous",
        avatar: p.author?.avatar_url || `https://i.pravatar.cc/150?u=${p.id}`,
        time: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchScore: p.match_score || 0
      }));
      setPosts(mappedPosts);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchPosts();
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

      {/* 3. YOUR BEST FEED */}
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

    </div>
  );
}
