"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  TrendingUp, 
  Zap, 
  MapPin, 
  Briefcase, 
  Code, 
  Palette, 
  Megaphone, 
  Scale, 
  DollarSign, 
  Settings,
  Sparkles,
  ArrowRight,
  Target,
  Users,
  Star,
  Activity,
  Bell,
  Clock,
  ShieldCheck,
  X,
  Info,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { calculateMatchScore } from "@/lib/match-engine";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { analytics } from "@/utils/analytics";

const CATEGORIES: { label: MarketplaceCategory; icon: any }[] = [
  { label: "Design", icon: Palette },
  { label: "Development", icon: Code },
  { label: "Marketing", icon: Megaphone },
  { label: "Finance", icon: DollarSign },
  { label: "Legal", icon: Scale },
  { label: "Consulting", icon: Briefcase },
  { label: "Operations", icon: Settings },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<MarketplaceCategory | "All">("All");
  const [activeSort, setActiveSort] = useState<ListingSort>("Best Match");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { userProfile } = useAuth();

  const fetchListings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        author:profiles(
          id,
          full_name,
          avatar_url,
          role
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped: MarketplaceListing[] = data.map(item => {
        const author = Array.isArray(item.author) ? item.author[0] : item.author;
        const score = userProfile ? calculateMatchScore(userProfile, {
          category: item.category,
          tags: item.tags,
          location: item.location
        }) : 75;

        return {
          id: item.id,
          title: item.title,
          category: item.category as MarketplaceCategory,
          description: item.description,
          location: item.location,
          tags: item.tags || [],
          useCases: [],
          matchScore: score,
          provider: {
            id: author?.id,
            name: author?.full_name || "Profile",
            avatar: author?.avatar_url || DEFAULT_AVATAR,
            role: author?.role || "Professional"
          }
        };
      });
      setListings(mapped);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchListings();
    analytics.trackScreen('MARKETPLACE');
  }, [userProfile]);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || listing.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Smart sections
  const recommended = filteredListings.filter(l => l.matchScore > 90).slice(0, 3);
  const topPerformers = filteredListings.slice(0, 4);

  return (
    <div className="min-h-screen bg-white pb-32">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#292828] py-24 mb-12 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#E53935]/10 opacity-60" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426')] bg-cover bg-center mix-blend-overlay opacity-10 grayscale" />
         
         <div className="w-[94%] mx-auto px-6 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl">
               <div className="flex items-center gap-3 mb-8">
                  <div className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.4em]">Marketplace</span>
               </div>
               <h1 className="text-6xl lg:text-[7rem] font-black text-white uppercase tracking-tighter leading-[0.8] mb-8">
                  Market<br /> <span className="text-[#E53935]">place.</span>
               </h1>
               <p className="text-xl font-medium text-white/50 leading-relaxed italic max-w-xl">
                  Find services and opportunities that match what you need.
               </p>
            </div>
            
            <div className="flex flex-col gap-4">
               <button 
                 onClick={() => setIsCreateModalOpen(true)}
                 className="h-20 px-12 bg-[#E53935] text-white rounded-xl flex items-center justify-center gap-4 text-[12px] font-black uppercase tracking-widest hover:bg-white hover:text-[#292828] transition-all shadow-4xl active:scale-95 group"
               >
                 <Plus size={22} /> Create Listing
               </button>
            </div>
         </div>
      </section>

      <div className="w-[94%] mx-auto px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-16">
          
          {/* SIDEBAR FILTERS & STATS */}
          <aside className="space-y-16">
             {/* CATEGORIES */}
             <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase text-[#292828]/30 tracking-[0.4em] flex items-center gap-3">
                   <Filter size={14} className="text-[#E53935]" /> Categories
                </h3>
                <div className="flex flex-col gap-2">
                   {[{ label: "All" as any, icon: Activity }, ...CATEGORIES].map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => setActiveCategory(cat.label)}
                        className={cn(
                           "flex items-center gap-5 px-6 h-14 rounded-xl transition-all duration-300 group relative overflow-hidden",
                           activeCategory === cat.label 
                             ? "bg-[#292828] text-white shadow-xl" 
                             : "text-slate-500 hover:bg-slate-50 hover:text-[#292828]"
                        )}
                      >
                         <cat.icon size={18} className={cn(activeCategory === cat.label ? "text-[#E53935]" : "group-hover:text-[#292828]")} />
                         <span className="text-[12px] font-bold uppercase tracking-tight">{cat.label}</span>
                         {activeCategory === cat.label && <div className="ml-auto h-2 w-2 rounded-full bg-[#E53935]" />}
                      </button>
                   ))}
                </div>
             </div>

             {/* DISCOVERY LOGIC CARD */}
             <div className="p-10 bg-[#292828] rounded-[2.5rem] relative overflow-hidden group">
                <Target size={120} className="absolute -right-10 -bottom-10 text-white/[0.03]" />
                <h4 className="text-[10px] font-black uppercase text-[#E53935] tracking-widest mb-8 flex items-center gap-2">
                   <Zap size={14} /> Smart Matching
                </h4>
                <div className="space-y-6">
                   {[
                      { label: "Intent-Based", val: "High" },
                      { label: "Expertise Gap", val: "Critical" },
                      { label: "Regional Proximity", val: "Trivandrum" }
                   ].map((it, i) => (
                      <div key={i}>
                         <p className="text-[9px] font-bold text-white/30 uppercase mb-1">{it.label}</p>
                         <p className="text-sm font-black text-white uppercase">{it.val}</p>
                      </div>
                   ))}
                </div>
             </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="space-y-20">
            
            {/* 1. SERVICES YOU NEED (RECOMMENDED) */}
            <section>
               <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Services You Need</h2>
                  <div className="h-px flex-1 mx-10 bg-slate-100 hidden md:block" />
                  <span className="text-[10px] font-black uppercase text-[#E53935] tracking-widest shrink-0">Based on Expertise Gaps</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {recommended.map(listing => (
                    <PremiumListingCard key={listing.id} listing={listing} compact />
                  ))}
               </div>
            </section>

            {/* 2. MAIN SEARCH & GRID */}
            <section className="space-y-12">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 border-y border-slate-100">
                  <div className="relative flex-1 max-w-xl">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                     <input 
                       type="text" 
                       placeholder="Search for services..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full h-16 bg-slate-50 border border-slate-100 rounded-xl pl-16 pr-8 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935]/30 focus:bg-white transition-all uppercase" 
                     />
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Sort by:</span>
                     <select 
                       value={activeSort}
                       onChange={(e) => setActiveSort(e.target.value as ListingSort)}
                       className="h-16 px-8 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-white transition-all shadow-sm"
                     >
                        <option>Best Match</option>
                        <option>Local</option>
                        <option>Newest</option>
                     </select>
                  </div>
               </div>

                {isLoading ? (
                  <div className="py-40 text-center animate-pulse">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Loading Marketplace...</p>
                  </div>
                ) : filteredListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {filteredListings.map(listing => (
                      <PremiumListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="py-40 text-center border border-dashed border-slate-100 rounded-[3rem]">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No listings found</p>
                  </div>
                )}
            </section>

            {/* 3. TOP PERFORMERS (SIDE-BY-SIDE OR CAROUSEL) */}
            <section className="bg-slate-50 rounded-[3rem] p-12 lg:p-16 border border-slate-100">
               <div className="mb-12">
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Top Rated Performers</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top rated professionals</p>
               </div>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {topPerformers.map(listing => (
                    <div key={listing.id} className="text-center group cursor-pointer" onClick={() => router.push(`/marketplace/${listing.id}`)}>
                       <div className="h-24 w-24 mx-auto rounded-full overflow-hidden border-2 border-white shadow-xl mb-6 group-hover:border-[#E53935] transition-all duration-500">
                          <img src={listing.provider.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                       </div>
                       <h4 className="text-sm font-black uppercase tracking-tight">{listing.provider.name}</h4>
                       <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">98% Success rate</p>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <CreateListingModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreated={() => fetchListings()} 
        />
      )}
    </div>
  );
}

function PremiumListingCard({ listing, compact = false }: { listing: MarketplaceListing, compact?: boolean }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/marketplace/${listing.id}`)}
      className={cn(
        "bg-white rounded-[1.5rem] border border-slate-100 hover:border-[#E53935]/20 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full shadow-sm hover:shadow-4xl hover:-translate-y-2 duration-500",
        compact ? "p-8" : "p-10"
      )}
    >
       {/* IDENTITY & SCORE */}
       <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
             <div className={cn(
                "rounded-xl overflow-hidden shadow-xl border border-slate-100 group-hover:border-[#E53935]/30 transition-all duration-700",
                compact ? "h-14 w-14" : "h-20 w-20"
             )}>
                <img src={listing.provider.avatar || DEFAULT_AVATAR} className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700" alt="" />
             </div>
             <div>
                <h4 className={cn("font-black uppercase tracking-tight group-hover:text-[#E53935] transition-colors", compact ? "text-sm" : "text-xl")}>{listing.provider.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <div className="flex items-center text-yellow-500">
                      <Star size={10} fill="currentColor" />
                   </div>
                   <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{listing.matchScore}% MATCH</span>
                </div>
             </div>
          </div>
          {!compact && (
            <div className="bg-[#E53935] px-4 py-2 rounded-lg text-center shadow-lg shadow-[#E53935]/20 group-hover:scale-110 transition-transform">
               <p className="text-xl font-black text-white tracking-tighter leading-none">{listing.matchScore}%</p>
               <p className="text-[7px] font-black text-white/60 tracking-widest uppercase">MATCH</p>
            </div>
          )}
       </div>

       {/* CONTENT */}
       <div className="flex-1">
          <h3 className={cn("font-black uppercase tracking-tighter mb-4 leading-tight group-hover:text-[#292828]", compact ? "text-xl" : "text-3xl")}>{listing.title}</h3>
          <p className={cn("font-medium text-slate-400 leading-relaxed mb-8 line-clamp-3 italic", compact ? "text-[11px]" : "text-[13px]")}>
             "{listing.description}"
          </p>
          
          <div className="space-y-4 mb-8">
             {!compact && (
                <div className="flex items-center gap-3">
                   <div className="h-px flex-1 bg-slate-100" />
                   <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest shrink-0">Specialties</span>
                   <div className="h-px flex-1 bg-slate-100" />
                </div>
             )}
             <div className="flex flex-wrap gap-2">
                {listing.tags.slice(0, compact ? 2 : 3).map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase border border-slate-100 group-hover:bg-[#292828] group-hover:text-white group-hover:border-[#292828] transition-all">{tag}</span>
                ))}
             </div>
          </div>
       </div>

       {/* TRANSACTIONAL DATA */}
       {!compact && (
          <div className="grid grid-cols-2 gap-4 mb-10 border-t border-slate-50 pt-8">
             <div className="p-4 bg-slate-50/50 rounded-xl">
                <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest mb-1">Fee</p>
                <p className="text-lg font-black text-[#292828]">₹15,000<span className="text-[10px] font-bold text-slate-400 ml-1"></span></p>
             </div>
             <div className="p-4 bg-slate-50/50 rounded-xl">
                <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest mb-1">Location</p>
                <p className="text-lg font-black text-[#292828] truncate">{listing.location}</p>
             </div>
          </div>
       )}

       <div className="flex items-center gap-3">
          <ConnectButton userId={listing.provider.id} userName={listing.provider.name} label="Connect" className="flex-1 !h-14 !rounded-xl !text-[10px]" />
          <button className="h-14 w-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 hover:bg-[#292828] hover:text-white transition-all">
             <ChevronRight size={20} />
          </button>
       </div>
    </div>
  );
}

function CreateListingModal({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) {
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Development",
    description: "",
    tags: "",
    location: "",
    price: "₹15,000"
  });

  const { user } = useAuth();
  const supabase = createClient();

  const handlePublish = async () => {
    setIsPublishing(true);
    if (!user) return;

    const { error } = await supabase.from('listings').insert({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()),
      location: formData.location,
      price: formData.price,
      author_id: user.id
    }).select();

    if (!error) {
      onCreated();
      onClose();
    }
    setIsPublishing(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#292828]/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] border border-[#292828]/10 shadow-4xl animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="bg-[#292828] p-10 sm:p-14 text-white relative">
           <div className="flex items-center justify-between mb-10">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Configuration Step {step}/3</span>
              <button onClick={onClose} className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#E53935] transition-all text-white/40 hover:text-white shadow-xl">
                 <X size={20} />
              </button>
           </div>
           <h2 className="text-4xl font-black uppercase tracking-tighter">Create <span className="text-[#E53935]">Listing.</span></h2>
           <div className="flex gap-2 mt-10">
              {[1, 2, 3].map(s => (
                <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-all duration-700", s <= step ? "bg-[#E53935]" : "bg-white/5")} />
              ))}
           </div>
        </div>

        <div className="p-10 sm:p-14 space-y-10">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Listing Title</label>
                 <input 
                   type="text" 
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   placeholder="e.g. Strategic Brand Identity Audit" 
                   className="w-full h-16 bg-slate-50 border border-slate-100 rounded-xl px-8 text-[13px] font-bold text-[#292828] outline-none focus:border-[#E53935]/30 focus:bg-white transition-all uppercase"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Category</label>
                 <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.label}
                        onClick={() => setFormData({...formData, category: cat.label})}
                        className={cn(
                          "h-14 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                          formData.category === cat.label 
                            ? "bg-[#292828] text-white shadow-xl" 
                            : "bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#292828] hover:bg-white"
                        )}
                      >
                         <cat.icon size={14} className={formData.category === cat.label ? "text-[#E53935]" : ""} />
                         {cat.label}
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Description</label>
                 <textarea 
                   rows={5}
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   placeholder="Describe what you offer..." 
                   className="w-full p-8 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-[#292828] outline-none focus:border-[#E53935]/30 focus:bg-white transition-all resize-none italic"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Tags</label>
                 <input 
                   type="text" 
                   value={formData.tags}
                   onChange={e => setFormData({...formData, tags: e.target.value})}
                   placeholder="e.g. Scale, Tech, Audit" 
                   className="w-full h-16 bg-slate-50 border border-slate-100 rounded-xl px-8 text-[13px] font-bold text-[#292828] outline-none focus:border-[#E53935]/30 focus:bg-white transition-all uppercase"
                 />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Location</label>
                 <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#E53935]" size={20} />
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. CBD, Trivandrum" 
                      className="w-full h-16 bg-slate-50 border border-slate-100 rounded-xl pl-16 pr-8 text-[13px] font-bold text-[#292828] outline-none focus:border-[#E53935]/30 focus:bg-white transition-all uppercase"
                    />
                 </div>
              </div>
              <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem]">
                 <div className="flex items-center gap-3 mb-4 text-emerald-600">
                    <ShieldCheck size={20} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Verification</p>
                 </div>
                 <p className="text-[11px] font-bold text-emerald-800/60 uppercase leading-relaxed italic">
                    Your listing will be visible to others in the marketplace.
                 </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-10">
             {step > 1 && (
               <button onClick={() => setStep(step - 1)} className="h-16 px-10 bg-slate-50 text-[#292828] rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Back</button>
             )}
             <button 
               onClick={() => step === 3 ? handlePublish() : setStep(step + 1)}
               disabled={isPublishing}
               className="flex-1 h-20 bg-[#292828] text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest hover:bg-[#E53935] shadow-4xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
                {isPublishing ? <Loader2 className="animate-spin" size={20} /> : (step === 3 ? "Create Listing" : "Next")} <ArrowRight size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
