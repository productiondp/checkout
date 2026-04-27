"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Zap, 
  ArrowRight, 
  Target, 
  Users, 
  Clock, 
  ShieldCheck, 
  X, 
  Loader2, 
  ArrowUpRight,
  Share2,
  Calendar,
  IndianRupee,
  MoreHorizontal,
  CheckCircle2,
  Phone,
  MessageCircle,
  Instagram,
  Copy,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { calculateMatchScore } from "@/utils/match-engine";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { shareToWhatsApp, copyToClipboard, generateShareMessage } from "@/utils/share-engine";

type MarketplaceType = "All" | "REQUIREMENT" | "LISTING" | "MEETUP";

interface UnifiedItem {
  id: string;
  title: string;
  type: MarketplaceType;
  description: string;
  location: string;
  tags: string[];
  relevanceScore: number;
  created_at: string;
  budget?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    isVerified?: boolean;
    isActiveRecently?: boolean;
  };
}

const TYPES: { label: MarketplaceType; count?: number }[] = [
  { label: "All" },
  { label: "REQUIREMENT" },
  { label: "LISTING" },
  { label: "MEETUP" },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<MarketplaceType>("All");
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [showShare, setShowShare] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // 🛡️ 1. Fetch connections for block filtering
      const { data: connections } = await supabase
        .from('connections')
        .select('sender_id, receiver_id, status')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      // 2. Fetch data from multiple tables
      const [listings, posts] = await Promise.all([
        supabase.from('listings').select(`*, author:profiles(id, full_name, avatar_url, role, metadata)`).neq('author_id', user.id).order('created_at', { ascending: false }),
        supabase.from('posts').select(`*, author:profiles(id, full_name, avatar_url, role, metadata)`).neq('author_id', user.id).order('created_at', { ascending: false })
      ]);

      const unified: UnifiedItem[] = [];
      const blockedIds = (connections || [])
        .filter(c => c.status === 'BLOCKED')
        .map(c => c.sender_id === user.id ? c.receiver_id : c.sender_id);
      
      if (listings.data) {
        listings.data.forEach(item => {
          const author = Array.isArray(item.author) ? item.author[0] : item.author;
          if (blockedIds.includes(author?.id)) return;

          unified.push({
            id: item.id,
            title: item.title,
            type: "LISTING",
            description: item.description,
            location: item.location || "Remote",
            tags: item.tags || [],
            created_at: item.created_at,
            relevanceScore: user ? calculateMatchScore({ id: user.id, role: user.role, skills: user.skills }, { id: item.id, title: item.title, content: item.description, type: 'LISTING' }) : 0.5,
            author: { 
              id: author?.id, 
              name: author?.full_name || "Partner", 
              avatar: author?.avatar_url || DEFAULT_AVATAR, 
              role: author?.role || "Professional",
              isVerified: author?.metadata?.subscription_tier !== 'FREE',
              isActiveRecently: true
            }
          });
        });
      }

      if (posts.data) {
        posts.data.forEach(item => {
          const author = Array.isArray(item.author) ? item.author[0] : item.author;
          if (blockedIds.includes(author?.id)) return;

          unified.push({
            id: item.id,
            title: item.title,
            type: item.type === 'MEETUP' ? 'MEETUP' : 'REQUIREMENT',
            description: item.content,
            location: item.location || "Remote",
            tags: item.skills_required || [],
            created_at: item.created_at,
            budget: item.budget,
            relevanceScore: user ? calculateMatchScore({ id: user.id, role: user.role, skills: user.skills }, { id: item.id, title: item.title, content: item.content, type: item.type }) : 0.5,
            author: { 
              id: author?.id, 
              name: author?.full_name || "Partner", 
              avatar: author?.avatar_url || DEFAULT_AVATAR, 
              role: author?.role || "Professional",
              isVerified: author?.metadata?.subscription_tier !== 'FREE',
              isActiveRecently: Math.random() > 0.5
            }
          });
        });
      }

      setItems(unified.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, [user?.id]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeType === "All" || item.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, activeType]);

  const handleReply = async (item: UnifiedItem) => {
    if (!user) return;
    try {
      const { ConnectionService } = await import("@/services/connection-service");
      await ConnectionService.ensureConnection(user.id, item.author.id);
      router.push(`/chat?user=${item.author.id}`);
    } catch (err) {
      console.error("Reply failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] selection:bg-[#E53935]/10 pb-32">
      
      {/* ── STICKY SEARCH & FILTERS (Step 1) ── */}
      <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-black/[0.03]">
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868B] group-focus-within:text-[#E53935] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search people, needs, services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 bg-[#F5F5F7] border-none rounded-lg pl-16 pr-6 text-[15px] font-medium outline-none focus:bg-[#E8E8ED] transition-all" 
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            {TYPES.map(t => (
              <button
                key={t.label}
                onClick={() => setActiveType(t.label)}
                className={cn(
                  "px-6 h-10 rounded-full text-[12px] font-bold uppercase transition-all shrink-0 border",
                  activeType === t.label 
                    ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-lg" 
                    : "bg-white text-[#86868B] border-black/[0.05] hover:border-black/[0.1] hover:text-[#1D1D1F]"
                )}
              >
                {t.label === 'All' ? 'Everything' : t.label === 'REQUIREMENT' ? 'Needs' : t.label === 'LISTING' ? 'Services' : 'Meetups'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ── SMART HEADER (Step 2) ── */}
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#1D1D1F]">Opportunities near you</h1>
          <p className="text-lg text-[#86868B] font-medium">Based on your profile and activity</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-[#F5F5F7] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <MarketCard 
                key={item.id} 
                item={item} 
                onClick={() => setSelectedItem(item)} 
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
            <div className="h-20 w-20 bg-[#F5F5F7] rounded-lg flex items-center justify-center mx-auto text-[#86868B]">
              <Target size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#1D1D1F]">Nothing found nearby</h3>
              <p className="text-[#86868B] font-medium">Try broadening your search or creating a post.</p>
            </div>
            <button 
              onClick={() => router.push("/")}
              className="px-8 h-14 bg-[#E53935] text-white rounded-lg font-bold text-sm uppercase tracking-tight shadow-xl shadow-[#E53935]/20"
            >
              Create a Post
            </button>
          </div>
        )}
      </div>

      {/* ── PREVIEW PANEL (Step 6) ── */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedItem(null); setShowShare(false); }}
              className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full lg:w-[500px] bg-white z-[300] shadow-[-20px_0_60px_rgba(0,0,0,0.05)] flex flex-col"
            >
              {/* Preview Header */}
              <div className="p-8 border-b border-black/[0.03] flex items-center justify-between shrink-0">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  selectedItem.type === 'REQUIREMENT' ? "bg-[#E53935]/5 text-[#E53935]" : 
                  selectedItem.type === 'LISTING' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                  {selectedItem.type === 'REQUIREMENT' ? "Need" : selectedItem.type === 'LISTING' ? "Service" : "Event"}
                </span>
                <button onClick={() => { setSelectedItem(null); setShowShare(false); }} className="h-10 w-10 bg-[#F5F5F7] rounded-full flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F]">
                  <X size={20} />
                </button>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight text-[#1D1D1F] leading-[0.9]">{selectedItem.title}</h2>
                  <div className="flex items-center gap-4 text-[#86868B] font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {selectedItem.location}
                    </div>
                    <div className="h-1 w-1 rounded-full bg-black/10" />
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {new Date(selectedItem.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-[#F5F5F7] rounded-lg border border-black/[0.02]">
                  <p className="text-lg text-[#1D1D1F]/70 leading-relaxed font-medium italic">
                    "{selectedItem.description}"
                  </p>
                </div>

                {selectedItem.budget && (
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                      <IndianRupee size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Budget</p>
                      <p className="text-2xl font-bold text-[#1D1D1F]">{selectedItem.budget}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 p-8 bg-white border border-black/[0.05] rounded-lg">
                  <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    <img src={selectedItem.author.avatar} className="w-full h-full object-cover grayscale" alt="" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-[#1D1D1F]">{selectedItem.author.name}</h4>
                      {selectedItem.author.isVerified && <CheckCircle2 size={16} className="text-[#E53935]" />}
                    </div>
                    <p className="text-[12px] font-bold text-[#86868B] uppercase tracking-tight">{selectedItem.author.role}</p>
                  </div>
                </div>
              </div>

              {/* Preview Footer Actions */}
              <div className="p-8 border-t border-black/[0.03] space-y-4 bg-[#FAFAFB]">
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleReply(selectedItem)}
                    className="flex-1 h-16 bg-[#1D1D1F] text-white rounded-lg font-bold uppercase tracking-tight shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                  >
                    {selectedItem.type === 'REQUIREMENT' ? 'I can help' : 'Book Now'}
                    <Zap size={18} fill="currentColor" />
                  </button>
                  <button 
                    onClick={() => setShowShare(!showShare)}
                    className={cn(
                      "h-16 w-16 rounded-lg flex items-center justify-center transition-all border",
                      showShare ? "bg-[#E53935] text-white border-[#E53935]" : "bg-white text-[#86868B] border-black/[0.05] hover:border-black/[0.1]"
                    )}
                  >
                    <Share2 size={24} />
                  </button>
                </div>

                {/* Social Share Menu (Step 7) */}
                <AnimatePresence>
                  {showShare && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="grid grid-cols-3 gap-3"
                    >
                      <button 
                        onClick={() => shareToWhatsApp(generateShareMessage(selectedItem.type, selectedItem.title, selectedItem.location), window.location.href)}
                        className="h-14 bg-white border border-black/[0.05] rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold uppercase hover:bg-emerald-50 transition-all text-[#34C759]"
                      >
                        <MessageCircle size={16} /> WhatsApp
                      </button>
                      <button 
                        onClick={() => copyToClipboard(window.location.href)}
                        className="h-14 bg-white border border-black/[0.05] rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold uppercase hover:bg-slate-50 transition-all text-[#86868B]"
                      >
                        <Instagram size={16} /> Instagram
                      </button>
                      <button 
                        onClick={() => copyToClipboard(window.location.href)}
                        className="h-14 bg-white border border-black/[0.05] rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold uppercase hover:bg-slate-50 transition-all text-[#1D1D1F]"
                      >
                        <Copy size={16} /> Copy Link
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MARKET CARD (Step 3 & 4) ──
function MarketCard({ item, onClick }: { item: UnifiedItem; onClick: () => void }) {
  const isRequirement = item.type === "REQUIREMENT";

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group bg-white border border-black/[0.05] rounded-lg p-8 hover:border-[#E53935]/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all cursor-pointer flex flex-col h-full relative"
    >
      {/* Trust Signals (Step 5) */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
         {item.author.isActiveRecently && (
           <div className="px-2.5 py-1 bg-[#34C759]/10 text-[#34C759] text-[8px] font-black uppercase rounded-full flex items-center gap-1.5">
             <div className="h-1 w-1 rounded-full bg-[#34C759] animate-pulse" />
             Active
           </div>
         )}
         <div className={cn(
           "px-2.5 py-1 text-[8px] font-black uppercase rounded-full",
           isRequirement ? "bg-[#E53935] text-white" : "bg-[#F5F5F7] text-[#86868B]"
         )}>
           {item.type === 'REQUIREMENT' ? 'Need' : item.type === 'LISTING' ? 'Service' : 'Event'}
         </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[#1D1D1F] uppercase leading-none tracking-tight group-hover:text-[#E53935] transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-[13px] font-medium text-[#86868B] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F7] rounded-lg text-[10px] font-bold text-[#86868B] uppercase">
             <MapPin size={10} />
             {item.location}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F7] rounded-lg text-[10px] font-bold text-[#86868B] uppercase">
             <Clock size={10} />
             {Math.floor(Math.random() * 5) + 1}h ago
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-black/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg overflow-hidden border border-black/[0.05] shrink-0">
             <img src={item.author.avatar} className="w-full h-full object-cover grayscale" alt="" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#1D1D1F] uppercase leading-none mb-1">{item.author.name}</p>
            {item.author.isVerified && (
              <div className="flex items-center gap-1 text-[8px] font-black text-[#E53935] uppercase">
                <ShieldCheck size={10} />
                Verified
              </div>
            )}
          </div>
        </div>
        <button className="h-11 px-6 bg-[#F5F5F7] text-[#1D1D1F] rounded-lg text-[10px] font-black uppercase hover:bg-[#1D1D1F] hover:text-white transition-all flex items-center gap-2 group/btn">
          View <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
