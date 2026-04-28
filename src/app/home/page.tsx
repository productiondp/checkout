"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { rankEntities, SessionContext, NetworkStats } from "@/lib/match-engine";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ConnectionSentinel from "@/components/home/ConnectionSentinel";
import UnifiedSearch from "@/components/search/UnifiedSearch";
import ActivitySentinel from "@/components/home/ActivitySentinel";
import { optimization } from "@/utils/optimization_engine";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import StartHereCard from "@/components/home/StartHereCard";
import { suggestionTelemetry } from "@/utils/suggestion_telemetry";

const UniversalFeedCard = dynamic(() => import("@/components/ui/UniversalFeedCard"), { ssr: false });
const DealEngine = dynamic(() => import("@/components/modals/DealEngine"), { ssr: false });
const PostModal = dynamic(() => import("@/components/modals/PostModal"), { ssr: false });
const MomentumView = dynamic(() => import("@/components/modals/MomentumView"), { ssr: false });
const Feed = dynamic(() => import("@/components/home/HomeFeed"), { ssr: false });
const ActiveComposer = dynamic(() => import("@/components/home/ActiveComposer"), { ssr: false });

const SMART_FILTERS = [
  { id: 'All', label: 'All', icon: LayoutGrid },
  { id: 'REQUIREMENT', label: 'Requirements', icon: Target },
  { id: 'PARTNER', label: 'Partners', icon: Sparkles },
  { id: 'MEETUP', label: 'Meetups', icon: Users },
];

export default function CheckoutHomeFeed() {
  return (
    <ProtectedRoute>
       <HomeContent />
    </ProtectedRoute>
  );
}

function HomeContent() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  
  if (!authUser) return null;
  
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
  
  // 🛡️ STEP 1 & 3: RATE LIMITING & TRUST WEIGHT
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    recent_actions: [],
    interactions: {
      impressions: {},
      clicks: {},
      connects: {},
      replies: {},
      last_interaction_time: Date.now()
    },
    network_stats: {
      category_quality: {
        'REQUIREMENT': 0.85,
        'PARTNER': 0.70,
        'MEETUP': 0.90
      },
      trending_categories: ['MEETUP'],
      peer_group_focus: {
        'REQUIREMENT': 0.1
      },
      unique_users_per_category: {
        'REQUIREMENT': 150,
        'PARTNER': 80,
        'MEETUP': 200
      },
      anomaly_flags: {
        'PARTNER': false // Set to true if spike detected
      }
    },
    user_trust_weight: 1.0 // Default high trust
  });

  const lastActionTime = useRef<number>(0);

  const supabase = createClient();

  const trackAction = (type: 'POST' | 'CONNECT' | 'VIEW' | 'CLICK' | 'REPLY', category?: string) => {
    const cat = category?.toUpperCase() || "UNKNOWN";
    const now = Date.now();

    // 🛡️ RATE LIMITING (Prevent rapid bot clicks)
    if (now - lastActionTime.current < 1000) {
       console.warn("[SECURITY] Action rate-limited.");
       return; 
    }
    lastActionTime.current = now;

    setSessionContext(prev => {
      const newInteractions = { 
        ...prev.interactions,
        last_interaction_time: now 
      };
      
      if (type === 'CLICK') newInteractions.clicks[cat] = (newInteractions.clicks[cat] || 0) + 1;
      if (type === 'CONNECT') newInteractions.connects[cat] = (newInteractions.connects[cat] || 0) + 1;
      if (type === 'REPLY') newInteractions.replies[cat] = (newInteractions.replies[cat] || 0) + 1;
      
      // 🛡️ LOW-QUALITY USER FILTER
      // If user connects frequently but never replies/gets replies, reduce trust
      const totalConnects = Object.values(newInteractions.connects).reduce((a,b)=>a+b, 0);
      const totalReplies = Object.values(newInteractions.replies).reduce((a,b)=>a+b, 0);
      let trustWeight = 1.0;
      if (totalConnects > 5 && totalReplies === 0) {
         trustWeight = 0.5; // Spam mitigation
      }

      return {
        ...prev,
        last_clicked_category: type === 'CLICK' ? cat : prev.last_clicked_category,
        recent_actions: [
          { type, timestamp: now, category: cat },
          ...prev.recent_actions.slice(0, 9)
        ],
        interactions: newInteractions,
        user_trust_weight: trustWeight
      };
    });
  };

  const recordImpressions = (visiblePosts: any[]) => {
    setSessionContext(prev => {
      const newImps = { ...prev.interactions.impressions };
      visiblePosts.forEach(p => {
        const type = p.type?.toUpperCase() || "UNKNOWN";
        newImps[type] = (newImps[type] || 0) + 1;
      });
      return {
        ...prev,
        interactions: { ...prev.interactions, impressions: newImps }
      };
    });
  };

  const initHome = async () => {
    setIsLoading(true);
    try {
      const { data: postsData, error: primaryError } = await supabase
        .from('posts')
        .select(`
          id, created_at, type, title, content, location, match_score, 
          budget, due_date, skills_required, urgency,
          partnershipType, industry, commitmentLevel,
          mode, dateTime, payment_type, max_slots, context,
          author_profile:profiles!author_id(id, full_name, avatar_url, role, location, skills, metadata)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (primaryError) throw primaryError;

      // 🛡️ FETCH CONNECTIONS FOR INSTANT STATUS
      const { data: connections } = await supabase
        .from('connections')
        .select('sender_id, receiver_id, status')
        .or(`sender_id.eq.${authUser.id},receiver_id.eq.${authUser.id}`);

      const mapped = (postsData || [])
        .filter(p => {
          const authorId = p.author_profile?.id || p.author_id;
          const conn = (connections || []).find(c => 
            (c.sender_id === authUser.id && c.receiver_id === authorId) ||
            (c.receiver_id === authUser.id && c.sender_id === authorId)
          );
          return conn?.status !== 'BLOCKED';
        })
        .map(p => {
          const author = p.author_profile;
          const conn = (connections || []).find(c => 
            (c.sender_id === authUser.id && c.receiver_id === author?.id) ||
            (c.receiver_id === authUser.id && c.sender_id === author?.id)
          );

        return {
          ...p,
          author_id: author?.id,
          user_id: author?.id,
          authorName: author?.full_name || "Anonymous",
          avatar: author?.avatar_url || DEFAULT_AVATAR,
          time: p.created_at ? new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Just now", 
          rank: author?.role || "Member",
          matchScore: p.match_score || 0,
          connectionStatus: conn ? conn.status.toLowerCase() : 'none'
        };
      });

      const ranked = rankEntities(authUser, mapped, sessionContext);
      setPosts(ranked);
      recordImpressions(ranked.slice(0, 5));
    } catch (err: any) {
      console.error("Feed Loading Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const registerAction = (type: string) => {
    // Logic for registering actions
  };

  useEffect(() => {
    if (authUser) {
       initHome();
       analytics.trackScreen('HOME', authUser?.id);

       // Check for deep-link actions
       const params = new URLSearchParams(window.location.search);
       const action = params.get('action');
       if (action === 'host_meetup') handleOpenPosting('MEETUP');
       if (action === 'post_requirement') handleOpenPosting('REQUIREMENT');
       
       // Clear params to prevent re-triggering
       if (action) {
         const newUrl = window.location.pathname;
         window.history.replaceState({}, '', newUrl);
       }
    }
  }, [authUser, sessionContext.recent_actions.length]);

  const filteredPosts = useMemo(() => {
    let base = posts;
    if (activeFilter !== 'All') {
      base = posts.filter(p => {
        const type = p.type?.toUpperCase();
        if (activeFilter === 'REQUIREMENT') return type === 'REQUIREMENT' || type === 'LEAD' || type === 'HIRING';
        if (activeFilter === 'PARTNER') return type === 'PARTNER' || type === 'PARTNERSHIP';
        return type === activeFilter;
      });
    }
    return base;
  }, [activeFilter, posts]);

  const handleOpenPosting = async (type: any = null) => {
    if (!authUser) return;
    setEditPost(null); 
    setPostInitialType(type);
    setIsPosting(true);
  };

  const handleReply = async (post: any) => {
    if (!authUser) return;
    try {
      const { ConnectionService } = await import("@/services/connection-service");
      await ConnectionService.ensureConnection(authUser.id, post.author_id);
      router.push(`/chat?user=${post.author_id}&initial=${encodeURIComponent(`Re: ${post.title}`)}`);
    } catch (err) {
      console.error("Reply failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FBFBFD] selection:bg-[#E53935]/10 font-sans pb-16">
      
      <main className="w-[94%] mx-auto max-w-5xl pt-12">
          <div className="grid grid-cols-1 gap-4">
              
              <StartHereCard 
                onAction={() => handleOpenPosting()} 
                onExplore={() => { trackAction('CLICK', 'MATCHES'); router.push('/connections'); }} 
              />

             <ActiveComposer 
               user={authUser} 
               onPost={(type) => handleOpenPosting(type)} 
             />

             <div className="flex items-center justify-end gap-2 mb-4 px-2">
                <div className="relative">
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                     className="h-10 px-5 bg-white border border-black/[0.08] rounded-full flex items-center gap-3 text-[11px] font-bold text-[#1D1D1F] shadow-sm hover:border-black/[0.15] transition-all group"
                   >
                      <LayoutGrid size={14} className="text-[#E53935]" />
                      {SMART_FILTERS.find(f => f.id === activeFilter)?.label}
                      <motion.div
                         animate={{ rotate: isFilterDropdownOpen ? 180 : 0 }}
                         transition={{ duration: 0.3 }}
                      >
                         <ChevronDown size={12} className="text-[#86868B] group-hover:text-[#1D1D1F]" />
                      </motion.div>
                   </motion.button>
                   {isFilterDropdownOpen && (
                     <div className="absolute top-full left-0 mt-2 w-56 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-2xl p-1.5 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                        {SMART_FILTERS.map(f => (
                          <button 
                            key={f.id}
                            onClick={() => { setActiveFilter(f.id); setIsFilterDropdownOpen(false); trackAction('CLICK', f.id); }}
                            className={cn(
                              "w-full h-11 px-4 flex items-center gap-3 rounded-xl text-[11px] font-bold transition-all",
                              activeFilter === f.id ? "bg-[#1D1D1F] text-white" : "text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                            )}
                          >
                             <f.icon size={14} />
                             {f.label}
                          </button>
                        ))}
                     </div>
                   )}
                </div>

                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="h-10 w-10 bg-white border border-black/[0.08] rounded-full flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] hover:border-black/[0.15] shadow-sm transition-all"
                 >
                    <Filter size={14} />
                 </motion.button>
             </div>

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
                onAction={handleReply}
                onEdit={(p) => { setEditPost(p); setIsPosting(true); }}
                onCreate={handleOpenPosting}
                onDelete={async (p) => {
                  const { error } = await supabase
                    .from('posts')
                    .delete()
                    .eq('id', p.id)
                    .eq('author_id', authUser.id);
                  
                  if (error) {
                    alert(error.message);
                    return;
                  }

                  // Update UI instantly
                  setPosts(prev => prev.filter(post => post.id !== p.id));
                }}
             />
          </div>
       </main>

        <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenPosting()}
            className="h-14 px-8 bg-[#1D1D1F] text-white rounded-full flex items-center gap-4 shadow-2xl hover:bg-black transition-all ring-1 ring-white/10 backdrop-blur-xl group"
          >
             <div className="h-6 w-6 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#E53935] group-hover:text-white transition-all">
                <Plus size={18} strokeWidth={3} />
             </div>
             <span className="text-[13px] font-bold">New Post</span>
          </motion.button>
       </div>

       {isPosting && (
         <PostModal 
           isOpen={isPosting} 
           onClose={() => setIsPosting(false)} 
           initialFormType={postInitialType}
           onPostSuccess={(newPost) => {
              trackAction('POST', newPost.type);
              initHome();
              setIsPosting(false);
              setIsPostActionLoop({ active: true, postId: newPost.id, type: newPost.type });
              analytics.track('ACTION_CREATED', authUser?.id, { type: newPost.type });
              
              setTimeout(() => {
                 const el = document.getElementById(`post-${newPost.id}`);
                 if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.style.boxShadow = "0 0 40px -10px rgba(41,40,40,0.1)";
                    el.style.transition = "box-shadow 0.8s ease-out";
                    setTimeout(() => { el.style.boxShadow = "none"; }, 3000);
                 }
              }, 800);
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
