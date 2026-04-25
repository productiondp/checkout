"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, X, Zap, ArrowUpRight, User, Building2, Briefcase, Globe, Calendar, Target, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { rankEntities } from "@/lib/match-engine";

export default function UnifiedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const cleanQuery = query.trim();
        
        // 1. Search Profiles
        // Note: Removed match_score as it may not be a database column for profiles
        const { data: profiles, error: pError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role, location, skills')
          .or(`full_name.ilike.*${cleanQuery}*,role.ilike.*${cleanQuery}*`)
          .limit(10);

        if (pError) console.error("Profile search error:", pError);

        // 2. Search Posts
        const { data: posts, error: postError } = await supabase
          .from('posts')
          .select('id, title, type, location, author_id')
          .ilike('title', `%${cleanQuery}%`)
          .limit(10);

        if (postError) console.error("Post search error:", postError);

        const combined = [
          ...(profiles || []).map(p => ({ ...p, type: 'PROFILE', name: p.full_name })),
          ...(posts || []).map(p => ({ ...p, type: 'POST', name: p.title }))
        ];

        // 3. Rank results using the match engine
        if (user && combined.length > 0) {
          try {
            const ranked = rankEntities(user, combined);
            setResults(ranked);
          } catch (e) {
            console.error("Ranking failed:", e);
            setResults(combined);
          }
        } else {
          setResults(combined);
        }
      } catch (err) {
        console.error("Search execution failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, user, supabase]);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 relative z-[100]">
      <div className="relative group">
        <div className="absolute inset-0 bg-[#E53935]/5 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative bg-white border border-slate-100 rounded-[2rem] p-2 flex items-center shadow-premium transition-all duration-500 focus-within:border-[#E53935]/30">
          <div className="flex-1 flex items-center px-6 gap-4">
            <Search className="text-slate-300" size={24} />
            <input 
              type="text" 
              placeholder="Search people or requirements..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-16 bg-transparent text-lg font-bold text-[#292828] outline-none placeholder:text-slate-200"
            />
          </div>
          {(query || isLoading) && (
            <button 
              onClick={() => setQuery("")} 
              className="h-12 w-12 flex items-center justify-center text-slate-300 hover:text-[#E53935] transition-colors"
            >
              {isLoading ? <Zap size={20} className="animate-pulse text-[#E53935]" /> : <X size={20} />}
            </button>
          )}
        </div>
      </div>

      {query.trim().length >= 2 && (results.length > 0 || !isLoading) && (
        <div className="absolute top-full left-6 right-6 mt-4 bg-white border border-slate-100 rounded-[2.5rem] shadow-4xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 max-h-[60vh] overflow-y-auto no-scrollbar z-[110]">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between px-8 bg-slate-50/50">
             <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">
               {isLoading ? "Synchronizing..." : `${results.length} Discoveries Found`}
             </p>
             <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Neural Match Active</span>
                <Zap size={14} className="text-[#E53935]" />
             </div>
          </div>

          <div className="divide-y divide-slate-50">
            {results.map((result: any) => (
              <div 
                key={`${result.type}-${result.id}`}
                onClick={() => {
                  const path = result.type === "PROFILE" ? "/profile" : "/home";
                  router.push(`${path}/${result.id}`);
                  setQuery("");
                }}
                className="p-6 flex items-center gap-6 hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 grayscale group-hover:grayscale-0 transition-all overflow-hidden border border-slate-100">
                  {result.avatar_url ? (
                    <img src={result.avatar_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    result.type === "PROFILE" ? <User size={24} className="text-slate-400" /> : <Target size={24} className="text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-black uppercase tracking-tight truncate text-[#292828]">{result.name}</h4>
                    <span className={cn(
                      "px-2 py-0.5 text-[8px] font-black uppercase rounded-md",
                      result.type === "PROFILE" ? "bg-blue-50 text-blue-500" : "bg-red-50 text-[#E53935]"
                    )}>{result.type}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">
                    {result.role || result.type} • {result.location || "Remote"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                   <p className="text-2xl font-black text-[#E53935] tracking-tighter leading-none">{result.matchScore || 85}%</p>
                   <p className="text-[8px] font-black text-slate-200 uppercase tracking-widest">Match</p>
                </div>
                <ArrowUpRight size={20} className="text-slate-100 group-hover:text-[#E53935] transition-colors ml-4" />
              </div>
            ))}

            {results.length === 0 && !isLoading && (
              <div className="py-20 text-center">
                  <Users size={40} className="mx-auto text-slate-100 mb-4" />
                  <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">No matching entities found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
