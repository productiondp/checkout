"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  Filter,
  Zap,
  Star,
  ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BusinessListing } from "@/types/directory";
import { ConnectButton } from "@/components/connection/ConnectButton";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_AVATAR } from "@/utils/constants";
import dynamic from "next/dynamic";
const PostModal = dynamic(() => import("@/components/modals/PostModal"), { ssr: false });

const CATEGORIES: string[] = [
  "Business Owner", "Professional", "Advisor", "Student"
];

export default function DirectoryPage() {
  const [advisors, setAdvisors] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "All">("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadDirectory() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role, bio, skills, city, location, matchScore')
          .limit(30);

        if (error) throw error;

        if (data) {
          const mapped: BusinessListing[] = data.map(p => ({
            id: p.id,
            name: p.full_name || "Anonymous Node",
            logo: p.avatar_url || DEFAULT_AVATAR,
            category: p.role?.split('_').map((s: string) => s.charAt(0) + s.slice(1).toLowerCase()).join(' ') || "Professional",
            description: p.bio || "Professional business node in the regional network.",
            services: p.skills || [],
            location: p.city || p.location || "Regional Hub",
            matchScore: p.matchScore || Math.floor(Math.random() * 15) + 85,
            isVerified: true,
            expertise: p.skills || []
          }));
          setAdvisors(mapped);
        }
      } catch (err) {
        console.error("Directory Sync Failure:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDirectory();
  }, []);

  const filteredBusinesses = advisors.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         biz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || biz.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-6">
        <div className="h-12 w-12 border-4 border-[#292828]/5 border-t-[#E53935] rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#292828]/20">Accessing Global Directory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#292828] pb-40 selection:bg-[#E53935]/10 font-sans relative overflow-hidden">
      {/* TEXTURE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] contrast-150 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* TOP GLOW ACCENT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#E53935]/5 to-transparent blur-[150px] pointer-events-none" />

      {/* MAIN CONTENT TERMINAL */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-20">
         {/* SEARCH & TITLE INTEGRATION */}
         <div className="mb-20 space-y-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
               <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                     <div className="h-px w-12 bg-[#E53935]" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E53935]">Neural Index</p>
                  </div>
                  <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase">Professional <br /><span className="text-slate-200">Directory</span></h1>
               </div>
               <button 
                 onClick={() => setIsCreateModalOpen(true)}
                 className="h-20 px-12 bg-[#292828] text-white rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-4xl active:scale-95 mx-auto md:mx-0"
               >
                  <Plus size={24} /> Register Hub
               </button>
            </div>

            {/* INTEGRATED SEARCH & CATEGORIES */}
            <div className="bg-white/60 backdrop-blur-3xl border border-white/40 rounded-[2.5rem] p-4 shadow-premium flex flex-col lg:flex-row items-center gap-6">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                  <input 
                    type="text" 
                    placeholder="Search regional business nodes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-16 bg-transparent pl-16 pr-6 text-base font-bold text-[#292828] outline-none"
                  />
               </div>
               <div className="h-10 w-px bg-slate-100 hidden lg:block" />
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto px-2">
                  <button 
                    onClick={() => setActiveCategory("All")}
                    className={cn(
                      "h-12 px-8 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0",
                      activeCategory === "All" ? "bg-[#292828] text-white shadow-xl" : "text-slate-400 hover:text-[#292828] hover:bg-slate-50"
                    )}
                  >
                     All
                  </button>
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "h-12 px-8 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0",
                        activeCategory === cat ? "bg-[#292828] text-white shadow-xl" : "text-slate-400 hover:text-[#292828] hover:bg-slate-50"
                      )}
                    >
                       {cat}
                    </button>
                  ))}
               </div>
               <button className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-[#292828] shadow-sm hover:shadow-xl transition-all border border-slate-50 shrink-0">
                  <Filter size={24} />
               </button>
            </div>
         </div>

         {/* ULTIMATE GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredBusinesses.map((biz, i) => (
               <UltimateBusinessCard key={biz.id} business={biz} />
            ))}
         </div>

         {filteredBusinesses.length === 0 && (
            <div className="py-40 text-center animate-in fade-in zoom-in-95 duration-700 bg-white rounded-[4rem] border border-dashed border-slate-200">
               <Zap size={64} className="mx-auto text-slate-100 mb-8" />
               <h3 className="text-2xl font-black text-[#292828] uppercase mb-4 tracking-tight">No professionals found</h3>
               <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.4em] mb-12">Expand your search intelligence or try a different professional category.</p>
               <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="h-16 px-12 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#E53935] transition-all shadow-4xl"
               >
                  Try different filters
               </button>
            </div>
         )}
      </main>

      {isCreateModalOpen && (
        <PostModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
          onPostSuccess={() => {
             setIsCreateModalOpen(false);
             alert("Business mandate created successfully!");
          }}
          initialFormType="Lead"
        />
      )}
    </div>
  );
}

function UltimateBusinessCard({ business }: { business: BusinessListing }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/directory/${business.id}`)}
      className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-premium hover:shadow-4xl transition-all duration-700 group cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
       <div className="flex items-start justify-between mb-12">
          <div className="h-24 w-24 rounded-[2rem] bg-[#292828] flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-2xl relative overflow-hidden shrink-0">
             <img src={business.logo} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt="" />
          </div>
          
          <div className="relative h-20 w-20 flex items-center justify-center">
             <div className="absolute inset-0 bg-[#E53935]/5 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
             <svg className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-50" />
                <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={213.6} strokeDashoffset={213.6 - (213.6 * business.matchScore) / 100} className="text-[#E53935] transition-all duration-[2s] delay-300" />
             </svg>
             <span className="text-sm font-black tabular-nums relative z-10">{business.matchScore}%</span>
          </div>
       </div>

       <div className="flex-1 space-y-8 mb-12">
          <div>
             <h3 className="text-3xl font-black uppercase tracking-tight group-hover:text-[#E53935] transition-colors leading-none mb-3">{business.name}</h3>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-yellow-500">
                   <Star size={12} fill="currentColor" />
                   <span className="text-[10px] font-black uppercase tracking-widest">4.9</span>
                </div>
                <span className="h-1 w-1 bg-slate-200 rounded-full" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{business.category}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400">
             <MapPin size={18} className="text-[#E53935]" />
             <span className="text-[11px] font-black uppercase tracking-tight">{business.location}</span>
          </div>
          
          <p className="text-base font-medium text-slate-500 leading-relaxed italic">
             "{business.description}"
          </p>

          <div className="flex items-center gap-4 pt-4">
             <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={18} />
             </div>
             <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Client Satisfaction <span className="text-emerald-500 font-black">High</span></p>
          </div>
       </div>

       <div className="pt-10 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div className="flex -space-x-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-12 w-12 rounded-2xl bg-slate-100 border-4 border-white shadow-sm overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=biz${i}${business.id}`} alt="" />
               </div>
             ))}
             <div className="h-12 w-12 rounded-2xl bg-slate-50 border-4 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400">
                +12
             </div>
          </div>
        <ConnectButton userId={business.id} userName={business.name} label="Connect Protocols" />
       </div>
    </div>
  );
}
