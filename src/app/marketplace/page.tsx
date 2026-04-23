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
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_LISTINGS } from "@/data/marketplace";
import { MarketplaceListing, MarketplaceCategory, ListingSort } from "@/types/marketplace";
import { ConnectButton } from "@/components/connection/ConnectButton";

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
  const router = useRouter();

  const filteredListings = MOCK_LISTINGS.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || listing.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-[#292828] pb-24 selection:bg-[#E53935]/10">
      {/* TOP NAVIGATION */}
      <nav className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-[100] px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-xl font-black tracking-tighter text-[#E53935]">CHECKOUT <span className="text-slate-200 font-light">|</span> MARKETPLACE</h1>
          <div className="hidden lg:flex items-center gap-8">
            {["Dashboard", "Services", "Network", "Insights", "Transactions"].map(item => (
              <button key={item} className={cn("text-[10px] font-black uppercase tracking-widest transition-all", item === "Services" ? "text-[#E53935]" : "text-slate-400 hover:text-[#292828]")}>{item}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="Search..." className="h-10 w-64 bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 text-xs font-bold focus:border-[#E53935] outline-none transition-all" />
          </div>
          <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
            <Bell size={18} className="text-slate-400 hover:text-[#292828] cursor-pointer" />
            <div className="h-8 w-8 rounded-lg bg-slate-200 overflow-hidden shadow-xl border border-slate-100">
              <img src="https://i.pravatar.cc/150?u=alex" alt="" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* MAIN CONTENT AREA */}
          <div className="flex-1">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-5xl font-black tracking-tighter mb-4 uppercase">Service Marketplace</h2>
                <div className="flex flex-wrap items-center gap-4">
                   <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
                      {(["Best Match", "Nearby", "New Listings"] as ListingSort[]).map(sort => (
                        <button 
                          key={sort}
                          onClick={() => setActiveSort(sort)}
                          className={cn(
                            "px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                            activeSort === sort ? "bg-white text-[#292828] shadow-sm" : "text-slate-400 hover:text-[#292828]"
                          )}
                        >
                          {sort}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="h-14 px-8 bg-[#292828] text-white rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-xl active:scale-95 shrink-0"
              >
                <Plus size={18} /> Create Listing
              </button>
            </div>

            {/* LISTINGS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredListings.map(listing => (
                <PremiumListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>

          {/* SIDEBAR: NETWORK ACTIVITIES */}
          <aside className="w-full lg:w-[400px] space-y-10">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-4">
                 <X size={16} className="text-slate-200 cursor-pointer hover:text-[#E53935]" />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-50">
                  <img src="https://i.pravatar.cc/150?u=sarah" alt="" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Expert Profile</p>
                   <h4 className="text-xl font-black uppercase tracking-tight">Sarah Jensen</h4>
                   <p className="text-xs font-bold text-slate-400 uppercase">Full-stack, senior designer</p>
                   <div className="flex items-center gap-1 mt-2 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-black">4.9/5</span>
                      <span className="text-[10px] text-slate-300 ml-1">128 Reviews</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-10 border-t border-slate-50 pt-8">
                 <div>
                    <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-2">Rate</p>
                    <p className="text-lg font-black">$150/hr</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-2">Velocity</p>
                    <p className="text-lg font-black">40h/wk</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-2">Projects</p>
                    <p className="text-lg font-black">3</p>
                 </div>
              </div>

              <div>
                 <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-4">Portfolio Highlights</p>
                 <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                         <img src={`https://picsum.photos/seed/port${i}/200/200`} className="w-full h-full object-cover grayscale opacity-50" alt="" />
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Network Activities</h3>
                  <div className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
               </div>
               <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-5 p-6 bg-white border border-slate-100 rounded-3xl hover:border-[#E53935]/20 transition-all cursor-pointer group shadow-sm">
                       <div className="h-10 w-10 bg-[#E53935]/5 rounded-xl flex items-center justify-center text-[#E53935] shrink-0">
                          <Activity size={18} />
                       </div>
                       <div>
                          <div className="flex items-center justify-between mb-1">
                             <p className="text-[10px] font-black uppercase text-[#292828]">Match alert</p>
                             <span className="text-[9px] font-bold text-slate-300 uppercase">3 hours ago</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 leading-relaxed group-hover:text-slate-600 transition-colors">
                             Updated structural match for <span className="text-[#292828] font-bold">Sarah Jensen</span> in development.
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </aside>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <CreateListingModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}

function PremiumListingCard({ listing }: { listing: MarketplaceListing }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/marketplace/${listing.id}`)}
      className="bg-white rounded-[2.5rem] p-10 border border-slate-100 hover:border-[#E53935]/30 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full shadow-sm hover:shadow-2xl"
    >
       <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-5">
             <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-50 group-hover:border-[#E53935]/50 transition-all duration-700">
                <img src={listing.provider.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
             </div>
             <div>
                <h4 className="text-xl font-black uppercase tracking-tight group-hover:text-[#E53935] transition-colors">{listing.provider.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} />)}
                   </div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">4.9/5 • 128 Reviews</span>
                </div>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">Match Score</p>
             <p className="text-4xl font-black text-[#E53935] tracking-tighter tabular-nums leading-none">98%<br /><span className="text-[10px] tracking-widest opacity-40">MATCH</span></p>
          </div>
       </div>

       <div className="flex-1">
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-tight">{listing.title}</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10 line-clamp-3 italic">
             "{listing.description}"
          </p>
          
          <div className="space-y-3 mb-10">
             <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Key Skills</p>
             <div className="flex flex-wrap gap-2">
                {listing.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase border border-slate-100">{tag}</span>
                ))}
             </div>
          </div>
       </div>

       <div className="grid grid-cols-3 gap-6 mb-10 border-t border-slate-50 pt-8">
          <div>
             <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-2">Rate</p>
             <p className="text-lg font-black">$150/hr</p>
          </div>
          <div>
             <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-2">Velocity</p>
             <p className="text-lg font-black">40h/wk</p>
          </div>
          <div>
             <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-2">Projects</p>
             <p className="text-lg font-black">3</p>
          </div>
       </div>

       <ConnectButton userId={listing.id} userName={listing.provider.name} label="Request Proposal" className="w-full" />
    </div>
  );
}

function CreateListingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "Development",
    description: "",
    tags: "",
    location: ""
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border border-slate-100 shadow-premium animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="bg-[#292828] p-8 sm:p-12 text-white relative border-b border-white/10">
           <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Step {step} of 3</span>
              <button onClick={onClose} className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white">×</button>
           </div>
           <h2 className="text-3xl font-black uppercase tracking-tighter">Create Listing</h2>
           <div className="flex gap-2 mt-8">
              {[1, 2, 3].map(s => (
                <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-500", s <= step ? "bg-[#E53935]" : "bg-white/5")} />
              ))}
           </div>
        </div>

        <div className="p-8 sm:p-12 text-[#292828]">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Listing Title</label>
                 <input 
                   type="text" 
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   placeholder="e.g. Strategic Brand Identity Audit" 
                   className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Category</label>
                 <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.label}
                        onClick={() => setFormData({...formData, category: cat.label})}
                        className={cn(
                          "h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                          formData.category === cat.label ? "bg-[#E53935] text-white shadow-xl" : "bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#292828]"
                        )}
                      >
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
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Description</label>
                 <textarea 
                   rows={4}
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   placeholder="Describe the value proposition and structural impact..." 
                   className="w-full p-8 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all resize-none"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Tags (Comma Separated)</label>
                 <input 
                   type="text" 
                   value={formData.tags}
                   onChange={e => setFormData({...formData, tags: e.target.value})}
                   placeholder="e.g. Scale, Tech, Audit" 
                   className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all"
                 />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Primary Location</label>
                 <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. CBD, Bangalore" 
                      className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all"
                    />
                 </div>
              </div>
              <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl">
                 <div className="flex items-center gap-3 mb-3 text-emerald-600">
                    <ShieldCheck size={20} />
                    <p className="text-[11px] font-black uppercase tracking-widest">Verification Protocol</p>
                 </div>
                 <p className="text-xs font-bold text-emerald-800/60 uppercase leading-relaxed">Your listing will be indexed based on structural match scoring for all regional nodes.</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-12">
             {step > 1 && (
               <button onClick={() => setStep(step - 1)} className="h-16 px-10 bg-slate-50 text-[#292828] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Back</button>
             )}
             <button 
               onClick={() => step === 3 ? onClose() : setStep(step + 1)}
               className="flex-1 h-16 bg-[#292828] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                {step === 3 ? "Publish Listing" : "Next Step"} <ArrowRight size={18} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
