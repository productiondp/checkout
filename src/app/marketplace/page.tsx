"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  Zap, 
  Target, 
  Clock, 
  ShieldCheck, 
  X, 
  CheckCircle2,
  MessageCircle,
  Instagram,
  Copy,
  ChevronRight,
  Share2,
  IndianRupee
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { calculateMatchScore } from "@/utils/match-engine";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { shareToWhatsApp, copyToClipboard, generateShareMessage } from "@/utils/share-engine";
import TerminalLayout from "@/components/layout/TerminalLayout";

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
  const { user } = userAuthSafe();

  function userAuthSafe() {
    try { return useAuth(); } catch(e) { return { user: null }; }
  }

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data: connections } = await supabase.from('connections').select('sender_id, receiver_id, status').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      const [listings, posts] = await Promise.all([
        supabase.from('listings').select(`*, author:profiles(id, full_name, avatar_url, role, metadata)`).neq('author_id', user.id).order('created_at', { ascending: false }),
        supabase.from('posts').select(`*, author:profiles(id, full_name, avatar_url, role, metadata)`).neq('author_id', user.id).order('created_at', { ascending: false })
      ]);
      const unified: UnifiedItem[] = [];
      const blockedIds = (connections || []).filter(c => c.status === 'BLOCKED').map(c => c.sender_id === user.id ? c.receiver_id : c.sender_id);
      if (listings.data) {
        listings.data.forEach(item => {
          const author = Array.isArray(item.author) ? item.author[0] : item.author;
          if (blockedIds.includes(author?.id)) return;
          unified.push({ id: item.id, title: item.title, type: "LISTING", description: item.description, location: item.location || "Remote", tags: item.tags || [], created_at: item.created_at, relevanceScore: 0.8, author: { id: author?.id, name: author?.full_name || "Partner", avatar: author?.avatar_url || DEFAULT_AVATAR, role: author?.role || "Professional", isVerified: author?.metadata?.subscription_tier !== 'FREE', isActiveRecently: true } });
        });
      }
      if (posts.data) {
        posts.data.forEach(item => {
          const author = Array.isArray(item.author) ? item.author[0] : item.author;
          if (blockedIds.includes(author?.id)) return;
          unified.push({ id: item.id, title: item.title, type: item.type === 'MEETUP' ? 'MEETUP' : 'REQUIREMENT', description: item.content, location: item.location || "Remote", tags: item.skills_required || [], created_at: item.created_at, budget: item.budget, relevanceScore: 0.9, author: { id: author?.id, name: author?.full_name || "Partner", avatar: author?.avatar_url || DEFAULT_AVATAR, role: author?.role || "Professional", isVerified: author?.metadata?.subscription_tier !== 'FREE', isActiveRecently: true } });
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
    const { ConnectionService } = await import("@/services/connection-service");
    await ConnectionService.ensureConnection(user.id, item.author.id);
    router.push(`/chat?user=${item.author.id}`);
  };

  return (
    <TerminalLayout
      topbarChildren={
         <div className="flex items-center gap-6">
            <div className="flex p-1 bg-[#F5F5F7] rounded-[10px] border border-black/[0.03]">
               {TYPES.map(t => (
                 <button 
                   key={t.label}
                   onClick={() => setActiveType(t.label)}
                   className={cn(
                     "px-6 h-9 rounded-[8px] text-[10px] font-black uppercase tracking-widest transition-all relative",
                     activeType === t.label ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
                   )}
                 >
                   {t.label === 'All' ? 'Everything' : t.label === 'REQUIREMENT' ? 'Needs' : t.label === 'LISTING' ? 'Services' : 'Meetups'}
                 </button>
               ))}
            </div>
         </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* SEARCH SECTION */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-[#E53935] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search marketplace..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 bg-white border border-black/[0.03] rounded-[10px] pl-16 pr-6 text-sm font-bold text-[#1D1D1F] outline-none focus:bg-white focus:border-[#E53935]/20 transition-all shadow-sm" 
          />
        </div>

        {/* ITEMS GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-[#F5F5F7] rounded-[10px] animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <MarketCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
            <div className="h-20 w-20 bg-[#F5F5F7] rounded-[10px] flex items-center justify-center mx-auto text-black/10">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit">Nothing found</h3>
            <p className="text-black/20 text-[11px] font-black uppercase tracking-widest">Try broadening your search or filters.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSelectedItem(null); setShowShare(false); }} className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full lg:w-[500px] bg-white z-[300] shadow-2xl flex flex-col border-l border-black/[0.05]">
              <div className="p-8 border-b border-black/[0.03] flex items-center justify-between shrink-0">
                <span className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", selectedItem.type === 'REQUIREMENT' ? "bg-[#E53935] text-white" : selectedItem.type === 'LISTING' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>{selectedItem.type}</span>
                <button onClick={() => { setSelectedItem(null); setShowShare(false); }} className="h-10 w-10 bg-[#F5F5F7] rounded-full flex items-center justify-center text-black/20 hover:text-black"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter text-[#1D1D1F] leading-[0.9] uppercase font-outfit">{selectedItem.title}</h2>
                  <div className="flex items-center gap-4 text-black/20 font-black uppercase text-[10px] tracking-widest"><div className="flex items-center gap-2"><MapPin size={14} />{selectedItem.location}</div><div className="flex items-center gap-2"><Clock size={14} />{new Date(selectedItem.created_at).toLocaleDateString()}</div></div>
                </div>
                <div className="p-8 bg-[#F5F5F7] rounded-[10px] border border-black/[0.02]"><p className="text-lg text-black/60 leading-relaxed font-bold uppercase italic">"{selectedItem.description}"</p></div>
                {selectedItem.budget && <div className="flex items-center gap-4"><div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-[10px] flex items-center justify-center"><IndianRupee size={24} /></div><div><p className="text-[9px] font-black text-black/20 uppercase tracking-widest">Budget</p><p className="text-2xl font-black text-[#1D1D1F] font-outfit">{selectedItem.budget}</p></div></div>}
                <div className="flex items-center gap-4 p-6 bg-white border border-black/[0.05] rounded-[10px]">
                  <div className="h-12 w-12 rounded-[10px] overflow-hidden shrink-0 border border-black/[0.05]"><img src={selectedItem.author.avatar} className="w-full h-full object-cover grayscale" alt="" /></div>
                  <div className="flex-1"><div className="flex items-center gap-2 mb-0.5"><h4 className="text-[15px] font-black text-[#1D1D1F] uppercase font-outfit">{selectedItem.author.name}</h4>{selectedItem.author.isVerified && <CheckCircle2 size={14} className="text-[#E53935]" />}</div><p className="text-[9px] font-black text-black/20 uppercase tracking-widest">{selectedItem.author.role}</p></div>
                </div>
              </div>
              <div className="p-8 border-t border-black/[0.03] space-y-4 bg-[#FAFAFB]">
                <div className="flex gap-4">
                  <button onClick={() => handleReply(selectedItem)} className="flex-1 h-16 bg-black text-white rounded-[10px] font-black uppercase text-[12px] tracking-widest shadow-xl hover:bg-[#E53935] transition-all flex items-center justify-center gap-3">{selectedItem.type === 'REQUIREMENT' ? 'I can help' : 'Book Now'}<Zap size={18} fill="currentColor" /></button>
                  <button onClick={() => setShowShare(!showShare)} className={cn("h-16 w-16 rounded-[10px] flex items-center justify-center transition-all border", showShare ? "bg-[#E53935] text-white border-[#E53935]" : "bg-white text-black/20 border-black/[0.05] hover:border-black/[0.1]")}><Share2 size={24} /></button>
                </div>
                {showShare && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
                    <button onClick={() => shareToWhatsApp(generateShareMessage(selectedItem.type, selectedItem.title, selectedItem.location), window.location.href)} className="h-14 bg-white border border-black/[0.05] rounded-[10px] flex items-center justify-center gap-2 text-[9px] font-black uppercase hover:bg-emerald-50 transition-all text-[#34C759]"><MessageCircle size={16} /> WhatsApp</button>
                    <button onClick={() => copyToClipboard(window.location.href)} className="h-14 bg-white border border-black/[0.05] rounded-[10px] flex items-center justify-center gap-2 text-[9px] font-black uppercase hover:bg-slate-50 transition-all text-black/40"><Instagram size={16} /> Instagram</button>
                    <button onClick={() => copyToClipboard(window.location.href)} className="h-14 bg-white border border-black/[0.05] rounded-[10px] flex items-center justify-center gap-2 text-[9px] font-black uppercase hover:bg-slate-50 transition-all text-black"><Copy size={16} /> Copy</button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </TerminalLayout>
  );
}

function MarketCard({ item, onClick }: { item: UnifiedItem; onClick: () => void }) {
  return (
    <motion.div layout whileHover={{ y: -4 }} onClick={onClick} className="group bg-white border border-black/[0.03] rounded-[10px] p-8 hover:border-black/[0.08] hover:shadow-2xl transition-all cursor-pointer flex flex-col h-full relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
         <div className={cn("px-2.5 py-1 text-[8px] font-black uppercase rounded-full", item.type === 'REQUIREMENT' ? "bg-[#E53935] text-white" : "bg-[#F5F5F7] text-black/20")}>{item.type}</div>
      </div>
      <div className="flex-1 space-y-6">
        <div className="space-y-3"><h3 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit tracking-tighter group-hover:text-[#E53935] transition-colors line-clamp-2">{item.title}</h3><p className="text-[13px] font-bold text-black/40 line-clamp-2 leading-relaxed uppercase">{item.description}</p></div>
        <div className="flex flex-wrap gap-2"><div className="flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F7] rounded-[8px] text-[8px] font-black text-black/20 uppercase tracking-widest"><MapPin size={10} />{item.location}</div><div className="flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F7] rounded-[8px] text-[8px] font-black text-black/20 uppercase tracking-widest"><Clock size={10} />Active</div></div>
      </div>
      <div className="mt-8 pt-6 border-t border-black/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[10px] overflow-hidden border border-black/[0.05] shrink-0"><img src={item.author.avatar} className="w-full h-full object-cover grayscale" alt="" /></div>
          <div><p className="text-[11px] font-black text-[#1D1D1F] uppercase leading-none mb-1">{item.author.name}</p>{item.author.isVerified && <div className="flex items-center gap-1 text-[8px] font-black text-[#E53935] uppercase"><ShieldCheck size={10} />Verified</div>}</div>
        </div>
        <button className="h-10 px-5 bg-[#F5F5F7] text-black/40 rounded-[10px] text-[10px] font-black uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-all flex items-center gap-2">View <ChevronRight size={14} /></button>
      </div>
    </motion.div>
  );
}
