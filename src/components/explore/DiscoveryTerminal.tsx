"use client";

import React, { useState, useEffect } from "react";
import { 
   Search, 
   Filter, 
   Sparkles, 
   Target, 
   Zap, 
   MapPin, 
   UserPlus, 
   ArrowRight,
   X,
   Building,
   Users,
   User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { calculateMatchScore } from "@/lib/match_engine";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function PartnerDiscovery() {
   const { user: authUser } = useAuth();
   const [searchQuery, setSearchQuery] = useState("");
   const [activeIntent, setActiveIntent] = useState<string | null>(null);
   const [results, setResults] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const supabase = createClient();

   const performSearch = async () => {
      if (!authUser) return;
      setIsLoading(true);
      let query = supabase.from('profiles').select('*');

      if (searchQuery) {
         query = query.or(`full_name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%`);
      }

      const { data } = await query.limit(20);

      if (data && authUser) {
         const ranked = data
            .filter(p => p.id !== authUser.id)
            .map(p => {
               const match = calculateMatchScore(
                  {
                     role: authUser.role,
                     industry: authUser.location,
                     expertise_tags: authUser.skills || [],
                     intent_tags: authUser.intents || [],
                     experience_years: 5,
                     location: authUser.location
                  },
                  {
                     type: p.role,
                     required_expertise: p.skills || [],
                     target_intent: p.role,
                     location: p.location,
                     author_role: p.role
                  }
               );
               return { ...p, matchScore: match.score, reasons: match.reasons };
            })
            .sort((a, b) => b.matchScore - a.matchScore);
         
         setResults(ranked);
      }
      setIsLoading(false);
   };

   useEffect(() => {
      const timer = setTimeout(() => {
         if (searchQuery || activeIntent) performSearch();
      }, 300);
      return () => clearTimeout(timer);
   }, [searchQuery, activeIntent]);

   return (
      <div className="w-full flex-1 overflow-hidden flex flex-col pointer-events-auto">
         {/* HEADER */}
         <div className="bg-white rounded-lg shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="p-8 pb-4">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-[#292828] uppercase ">Directory <span className="text-[#E53935]">Discovery</span></h2>
                  <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                     <Search size={16} />
                  </div>
               </div>

               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E53935] transition-colors" size={18} />
                  <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search by name, role, or industry..." 
                     className="w-full h-14 bg-slate-50 border-none rounded-lg pl-12 pr-4 text-[13px] font-bold outline-none focus:bg-white focus:ring-1 focus:ring-[#E53935]/10" 
                  />
               </div>
            </div>

            {/* INTENT CHIPS */}
            <div className="px-8 flex gap-2 overflow-x-auto no-scrollbar pb-6 mt-2">
               {["Requirement", "Collaboration", "Hiring", "Events"].map(intent => (
                  <button 
                     key={intent}
                     onClick={() => setActiveIntent(activeIntent === intent ? null : intent)}
                     className={cn(
                        "px-4 h-10 rounded-lg text-[10px] font-black uppercase whitespace-nowrap transition-all border",
                        activeIntent === intent ? "bg-[#292828] text-white border-[#292828]" : "bg-white text-slate-400 border-slate-100"
                     )}
                  >
                     {intent}
                  </button>
               ))}
            </div>

            {/* RESULTS */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-4 pb-8">
               {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-300">
                     <div className="h-4 w-4 border-2 border-slate-200 border-t-[#E53935] rounded-full animate-spin" />
                     <p className="text-[10px] font-black uppercase ">Searching directory...</p>
                  </div>
               ) : results.length > 0 ? (
                  results.map((profile) => (
                     <div key={profile.id} className="p-6 bg-white border border-slate-100 rounded-lg hover:border-[#E53935] hover:shadow-2xl hover:shadow-red-500/5 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center text-slate-300">
                                 {profile.avatar_url ? (
                                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                                 ) : (
                                    <User size={18} />
                                 )}
                              </div>
                              <div>
                                 <h4 className="text-[13px] font-black text-[#292828] uppercase">{profile.full_name}</h4>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase ">{profile.role}</p>
                              </div>
                           </div>
                           <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1 text-[#E53935]">
                                 <Zap size={12} fill="currentColor" />
                                 <span className="text-[11px] font-black">{profile.matchScore}%</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase mb-4">
                           <span className="flex items-center gap-1.5"><Building size={12} /> {profile.location}</span>
                           <span className="flex items-center gap-1.5"><Target size={12} /> {profile.reasons?.[0] || "Strategic Alignment"}</span>
                        </div>

                        <button 
                           onClick={() => router.push(`/profile/${profile.id}`)}
                           className="w-full h-12 bg-[#292828] text-white rounded-lg text-[10px] font-black uppercase  flex items-center justify-center gap-2 group-hover:bg-[#E53935] transition-all"
                        >
                           View Profile <ArrowRight size={14} />
                        </button>
                     </div>
                  ))
               ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                     <div className="h-12 w-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-200 mb-4">
                        <Sparkles size={24} />
                     </div>
                     <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">No matches found for your current search.</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
