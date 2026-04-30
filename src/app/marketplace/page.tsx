"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Zap, 
  Target, 
  ShieldCheck, 
  X, 
  ChevronRight,
  Briefcase,
  Layers,
  BarChart3,
  Sparkles,
  ArrowRight,
  Clock,
  MessageSquare,
  CheckCircle2,
  Users,
  LayoutGrid,
  List,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TerminalLayout from "@/components/layout/TerminalLayout";
import MeetupPreviewModal from "@/components/modals/MeetupPreviewModal";

type MarketplaceType = "All" | "REQUIREMENT" | "PARTNERSHIP" | "MEETUP" | "PARTNER";

interface MarketplaceItem {
  id: string;
  title: string;
  type: MarketplaceType;
  description: string;
  location: string;
  industry: string;
  focus_area: string;
  experience_level: string;
  signals: string[];
  relevanceScore: number;
  created_at: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    isVerified?: boolean;
    trustScore?: number;
  };
  metadata?: any;
  status?: string;
}

const TYPE_FILTERS: { label: string; value: MarketplaceType }[] = [
  { label: "All", value: "All" },
  { label: "Requirements", value: "REQUIREMENT" },
  { label: "Partners", value: "PARTNERSHIP" },
  { label: "Meetups", value: "MEETUP" },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<MarketplaceType>("All");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedTopOp, setDismissedTopOp] = useState(false);
  
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Smart Filters State
  const [filters, setFilters] = useState({
    industry: "All",
    focus: "All",
    experience: "All",
    location: "Nearby"
  });

  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setIsLoading(true);
      
      try {
        // Fetch posts and listings
        const [postsRes, listingsRes] = await Promise.all([
          supabase.from('posts').select(`*, author:profiles(id, full_name, avatar_url, role, metadata)`).neq('author_id', user.id).order('created_at', { ascending: false }),
          supabase.from('listings').select(`*, author:profiles(id, full_name, avatar_url, role, metadata)`).neq('author_id', user.id).order('created_at', { ascending: false })
        ]);

        const unified: MarketplaceItem[] = [];

        if (postsRes.data) {
          postsRes.data.forEach(p => {
            const type = p.type === 'MEETUP' ? 'MEETUP' : (p.type === 'PARTNERSHIP' ? 'PARTNERSHIP' : 'REQUIREMENT');
            unified.push({
              id: p.id,
              title: p.title,
              type,
              description: p.content,
              location: p.location || "Remote",
              industry: p.metadata?.industry || "Tech",
              focus_area: p.metadata?.focus_area || "General",
              experience_level: p.metadata?.experience_level || "Any",
              signals: p.tier === 1 ? ["Top opportunity", "Best match"] : ["New"],
              relevanceScore: p.actionScore || 0.5,
              created_at: p.created_at,
              author: {
                id: p.author?.id,
                name: p.author?.full_name || "Member",
                avatar: p.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.author?.id}`,
                role: p.author?.role || "Professional",
                isVerified: p.author?.metadata?.subscription_tier !== 'FREE'
              },
              metadata: p.metadata,
              status: 'IDLE'
            });
          });
        }

        if (listingsRes.data) {
          listingsRes.data.forEach(l => {
            unified.push({
              id: l.id,
              title: l.title,
              type: "PARTNER",
              description: l.description,
              location: l.location || "Remote",
              industry: l.metadata?.industry || "Creative",
              focus_area: l.metadata?.focus_area || "Strategy",
              experience_level: l.metadata?.experience_level || "Senior",
              signals: ["High success rate"],
              relevanceScore: 0.7,
              created_at: l.created_at,
              author: {
                id: l.author?.id,
                name: l.author?.full_name || "Partner",
                avatar: l.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${l.author?.id}`,
                role: l.author?.role || "Founder",
                isVerified: l.author?.metadata?.subscription_tier !== 'FREE'
              },
              metadata: l.metadata,
              status: 'IDLE'
            });
          });
        }

        // Auto-sort by Relevance + Match
        setItems(unified.sort((a, b) => b.relevanceScore - a.relevanceScore));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === "All" || item.type === activeType;
      const matchesIndustry = filters.industry === "All" || item.industry === filters.industry;
      const matchesFocus = filters.focus === "All" || item.focus_area === filters.focus;
      
      return matchesSearch && matchesType && matchesIndustry && matchesFocus;
    });
  }, [items, searchQuery, activeType, filters]);

  const topOpportunity = useMemo(() => {
    if (dismissedTopOp) return null;
    return filteredItems.find(item => item.signals.includes("Top opportunity"));
  }, [filteredItems, dismissedTopOp]);

  const otherItems = useMemo(() => {
    return filteredItems.filter(item => item.id !== topOpportunity?.id);
  }, [filteredItems, topOpportunity]);

  return (
    <TerminalLayout
      topbarChildren={
        <div className="flex items-center gap-8 flex-1 max-w-4xl">
          {/* SEARCH */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#E53935] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-[#F5F5F7] border border-black/[0.03] rounded-xl pl-12 pr-4 text-[13px] font-bold text-black outline-none focus:bg-white focus:border-black/[0.08] transition-all"
            />
          </div>

          {/* TYPE CHIPS */}
          <div className="flex items-center gap-2">
            {TYPE_FILTERS.map(f => (
              <button 
                key={f.value}
                onClick={() => setActiveType(f.value)}
                className={cn(
                  "px-4 h-9 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                  activeType === f.value 
                    ? "bg-black text-white border-black" 
                    : "bg-[#F5F5F7] text-black/40 border-transparent hover:border-black/10"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="bg-[#FDFDFF] min-h-screen">
        {/* SECOND ROW: SMART FILTERS & VIEW SWITCHER */}
        <div className="bg-white border-b border-black/[0.03] px-8 py-3 sticky top-[64px] lg:top-[80px] z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                <SmartFilter 
                  icon={Briefcase} 
                  label="Industry" 
                  value={filters.industry} 
                  options={["All", "Tech", "Creative", "Finance", "Healthcare"]}
                  onChange={(val: string) => setFilters(prev => ({ ...prev, industry: val }))}
                  active={activeFilterDropdown === "industry"}
                  onToggle={() => setActiveFilterDropdown(activeFilterDropdown === "industry" ? null : "industry")}
                />
                <SmartFilter 
                  icon={Layers} 
                  label="Focus Area" 
                  value={filters.focus} 
                  options={["All", "General", "Strategy", "Execution", "Design"]}
                  onChange={(val: string) => setFilters(prev => ({ ...prev, focus: val }))}
                  active={activeFilterDropdown === "focus"}
                  onToggle={() => setActiveFilterDropdown(activeFilterDropdown === "focus" ? null : "focus")}
                />
                <SmartFilter 
                  icon={BarChart3} 
                  label="Experience" 
                  value={filters.experience} 
                  options={["All", "Junior", "Senior", "Expert"]}
                  onChange={(val: string) => setFilters(prev => ({ ...prev, experience: val }))}
                  active={activeFilterDropdown === "experience"}
                  onToggle={() => setActiveFilterDropdown(activeFilterDropdown === "experience" ? null : "experience")}
                />
                <SmartFilter 
                  icon={MapPin} 
                  label="Location" 
                  value={filters.location} 
                  options={["Nearby", "Global", "City"]}
                  onChange={(val: string) => setFilters(prev => ({ ...prev, location: val }))}
                  active={activeFilterDropdown === "location"}
                  onToggle={() => setActiveFilterDropdown(activeFilterDropdown === "location" ? null : "location")}
                  isLocation 
                />
             </div>

             <div className="flex items-center gap-1 p-1 bg-[#F5F5F7] rounded-xl border border-black/[0.03]">
                <button 
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                    viewMode === "list" ? "bg-white text-black shadow-sm" : "text-black/20 hover:text-black"
                  )}
                >
                   <List size={16} />
                </button>
                <button 
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                    viewMode === "grid" ? "bg-white text-black shadow-sm" : "text-black/20 hover:text-black"
                  )}
                >
                   <LayoutGrid size={16} />
                </button>
             </div>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto space-y-12">
          
          {/* PRIORITY SECTION */}
          <AnimatePresence>
            {topOpportunity && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E53935] flex items-center gap-2">
                    <Sparkles size={14} className="animate-pulse" /> Top opportunity for you
                  </h3>
                  <button onClick={() => setDismissedTopOp(true)} className="text-[9px] font-bold text-black/20 hover:text-black uppercase">Dismiss</button>
                </div>
                <OpportunityCard item={topOpportunity} isPinned />
              </motion.div>
            )}
          </AnimatePresence>

          {/* LIST FEED */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20">
              {activeType === "All" ? "Ecosystem Feed" : `${activeType} Opportunities`}
            </h3>

            {isLoading ? (
              <div className={cn("space-y-4", viewMode === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 space-y-0")}>
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-black/[0.02] rounded-[2rem] animate-pulse" />)}
              </div>
            ) : otherItems.length > 0 ? (
              <div className={cn(
                "transition-all duration-500",
                viewMode === "list" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              )}>
                {otherItems.map((item, idx) => (
                  <OpportunityCard key={item.id} item={item} index={idx} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="h-16 w-16 bg-[#F5F5F7] rounded-2xl flex items-center justify-center mx-auto text-black/10">
                  <Target size={32} />
                </div>
                <p className="text-[13px] font-bold text-black/40">No results here. Try changing filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
}

function SmartFilter({ icon: Icon, label, value, options, onChange, active, onToggle }: any) {
  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2.5 px-4 h-10 border rounded-xl transition-all group shrink-0",
          active ? "bg-white border-black/[0.1] shadow-sm" : "bg-[#F5F5F7] border-black/[0.03] hover:bg-white hover:border-black/[0.08]"
        )}
      >
        <Icon size={14} className={cn("transition-colors", active ? "text-[#E53935]" : "text-black/20 group-hover:text-[#E53935]")} />
        <span className="text-[10px] font-bold text-black/40 group-hover:text-black">{label}:</span>
        <span className="text-[10px] font-black uppercase text-black">{value}</span>
        <ChevronDown size={12} className={cn("ml-1 transition-transform duration-300 text-black/20", active && "rotate-180")} />
      </button>

      <AnimatePresence>
        {active && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-0 w-48 bg-white border border-black/[0.08] rounded-xl shadow-xl z-[60] overflow-hidden"
          >
            {options.map((opt: string) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); onToggle(); }}
                className={cn(
                  "w-full px-4 h-10 text-left text-[10px] font-black uppercase tracking-widest hover:bg-[#F5F5F7] transition-all",
                  value === opt ? "text-[#E53935]" : "text-black/40"
                )}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OpportunityCard({ item, isPinned, index, viewMode }: { item: MarketplaceItem; isPinned?: boolean; index?: number; viewMode?: "list" | "grid" }) {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [joinStatus, setJoinStatus] = useState<any>('IDLE');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (item.type === 'MEETUP' && authUser) {
      const fetchStatus = async () => {
        const { MeetupService } = await import("@/services/meetup-service");
        const status = await MeetupService.getMeetupStatus(item.id, authUser.id);
        setJoinStatus(status.status);
      };
      fetchStatus();
    }
  }, [item.id, authUser?.id, item.type]);

  const getCTA = () => {
    switch(item.type) {
      case 'REQUIREMENT': return { label: 'Respond', color: 'bg-black text-white hover:bg-[#E53935]' };
      case 'PARTNER': 
      case 'PARTNERSHIP': return { label: 'Start Building', color: 'bg-[#E53935] text-white hover:bg-black' };
      case 'MEETUP': return { label: 'Join Meetup', color: 'bg-indigo-600 text-white hover:bg-black' };
      default: return { label: 'View', color: 'bg-black text-white' };
    }
  };

  const cta = getCTA();

  if (viewMode === "list") {
    return (
      <motion.div 
        initial={!isPinned ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index ? index * 0.05 : 0 }}
        onClick={() => router.push(`/marketplace/${item.id}`)}
        className={cn(
          "bg-white rounded-[2rem] p-8 border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex items-center gap-8 relative overflow-hidden",
          isPinned && "border-[#E53935]/20 shadow-[0_40px_80px_-20px_rgba(229,57,51,0.08)] ring-1 ring-[#E53935]/10"
        )}
      >
        <div className="h-28 w-28 shrink-0 rounded-2xl overflow-hidden border-4 border-[#F5F5F7] shadow-md group-hover:rotate-3 transition-all duration-500">
          <img src={item.author.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className={cn(
              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
              item.type === 'REQUIREMENT' ? "bg-amber-50 text-amber-600 border-amber-100" :
              item.type === 'PARTNER' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
              "bg-indigo-50 text-indigo-600 border-indigo-100"
            )}>
              {item.type}
            </span>
            <div className="flex gap-2">
               {item.signals.slice(0, 2).map(s => (
                 <span key={s} className="text-[9px] font-black text-[#E53935] uppercase tracking-wider flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> {s}
                 </span>
               ))}
            </div>
          </div>
          
          <h3 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit mb-1 group-hover:text-[#E53935] transition-colors line-clamp-1">{item.title}</h3>
          <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-4">{item.author.name} • {item.industry} • {item.location}</p>
          
          <div className="flex items-center gap-6">
            <p className="text-[13px] font-bold text-black/60 line-clamp-1 flex-1">
              {item.description}
            </p>
            <div className="flex items-center gap-4 shrink-0 border-l border-black/[0.03] pl-6">
               <span className="text-[9px] font-black text-black/20 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock size={12} className="text-[#E53935]" /> 2d left
               </span>
               <span className="text-[9px] font-black text-black/20 uppercase tracking-widest flex items-center gap-1.5">
                  <Users size={12} className="text-[#E53935]" /> 3+ joined
               </span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={(e) => { 
               e.stopPropagation(); 
               if (item.type === 'MEETUP') {
                 if (joinStatus === 'JOINED') {
                   // Navigate to chat
                   const supabase = createClient();
                   supabase.from('posts').select('room_id').eq('id', item.id).single().then(({ data }) => {
                     if (data?.room_id) router.push(`/chat?room=${data.room_id}`);
                     else alert("Preparing group chat...");
                   });
                 } else {
                   setIsPreviewOpen(true);
                 }
               } else {
                 router.push(`/chat?user=${item.author.id}`); 
               }
             }}
             className={cn(
               "h-14 px-8 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] shadow-xl transition-all flex items-center justify-center gap-3", 
               item.type === 'MEETUP' && joinStatus === 'JOINED' ? "bg-emerald-600 text-white shadow-emerald-600/20" : cta.color
             )}
           >
              {item.type === 'MEETUP' ? (
                joinStatus === 'JOINED' ? "You're in • Chat open" :
                joinStatus === 'REQUESTED' ? "Awaiting Approval" :
                joinStatus === 'FULL' ? "Meetup Full" : "Join Meetup"
              ) : cta.label}
              <ArrowRight size={16} strokeWidth={3} />
           </motion.button>
        </div>

        <MeetupPreviewModal 
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          meetup={item}
          currentUserId={authUser?.id}
          onJoinSuccess={(status) => setJoinStatus(status)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index ? index * 0.05 : 0 }}
      onClick={() => router.push(`/marketplace/${item.id}`)}
      className="bg-white rounded-[2rem] p-8 border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 border-[#F5F5F7] shadow-md group-hover:scale-105 transition-all duration-500">
          <img src={item.author.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
        </div>
        <div className="flex flex-col items-end gap-2">
           <span className={cn(
             "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
             item.type === 'REQUIREMENT' ? "bg-amber-50 text-amber-600 border-amber-100" :
             item.type === 'PARTNER' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
             "bg-indigo-50 text-indigo-600 border-indigo-100"
           )}>
             {item.type}
           </span>
           <span className="text-[8px] font-black text-black/20 uppercase tracking-widest">{item.location}</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-2 mb-6">
        <h3 className="text-lg font-black text-[#1D1D1F] uppercase font-outfit group-hover:text-[#E53935] transition-colors leading-tight line-clamp-2">{item.title}</h3>
        <p className="text-[9px] font-black text-black/20 uppercase tracking-widest line-clamp-1">{item.author.name} • {item.industry}</p>
        <p className="text-[12px] font-bold text-black/50 line-clamp-2 pt-2 leading-relaxed">{item.description}</p>
      </div>

      <div className="pt-6 border-t border-black/[0.03] flex flex-col gap-4">
         <motion.button 
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={(e) => { 
             e.stopPropagation(); 
             if (item.type === 'MEETUP') {
                if (joinStatus === 'JOINED') {
                   const supabase = createClient();
                   supabase.from('posts').select('room_id').eq('id', item.id).single().then(({ data }) => {
                     if (data?.room_id) router.push(`/chat?room=${data.room_id}`);
                     else alert("Preparing group chat...");
                   });
                } else {
                  setIsPreviewOpen(true);
               }
             } else {
               router.push(`/chat?user=${item.author?.id}`); 
             }
           }}
           className={cn(
              "h-12 w-full rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2", 
              item.type === 'MEETUP' && joinStatus === 'JOINED' ? "bg-emerald-600 text-white" : cta.color
           )}
         >
            {item.type === 'MEETUP' ? (
               joinStatus === 'JOINED' ? "You're in • Chat open" :
               joinStatus === 'REQUESTED' ? "Awaiting Approval" :
               joinStatus === 'FULL' ? "Meetup Full" : "Join Meetup"
            ) : cta.label}
            <ArrowRight size={14} strokeWidth={3} />
         </motion.button>
         <div className="flex items-center justify-between">
            <span className="text-[8px] font-black text-black/10 uppercase tracking-widest flex items-center gap-1">
               <Clock size={10} /> 2 days left
            </span>
            <span className="text-[8px] font-black text-black/10 uppercase tracking-widest flex items-center gap-1">
               <Users size={10} /> 3+ joined
            </span>
         </div>
      </div>
      <MeetupPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        meetup={item}
        currentUserId={authUser?.id}
        onJoinSuccess={(status) => setJoinStatus(status)}
      />
    </motion.div>
  );
}


export const runtime = "edge";
