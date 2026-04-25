"use client";

import React from "react";
import { Activity, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import UniversalFeedCard from "@/components/ui/UniversalFeedCard";
import { useRouter } from "next/navigation";

interface HomeFeedProps {
  posts: any[];
  isLoading: boolean;
  currentUserId?: string;
  onAction?: (post: any) => void;
  onEdit?: (post: any) => void;
  onDelete?: (post: any) => void;
  onCreate?: () => void;
}

export default function HomeFeed({ 
  posts, 
  isLoading, 
  currentUserId,
  onAction,
  onEdit,
  onDelete,
  onCreate
}: HomeFeedProps) {
  const router = useRouter();
  
  const [isFabExpanded, setIsFabExpanded] = React.useState(true);
  const [isTyping, setIsTyping] = React.useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current + 10) {
        setIsFabExpanded(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setIsFabExpanded(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const handleFocus = (e: any) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        setIsTyping(true);
      }
    };

    const handleBlur = (e: any) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        setIsTyping(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center animate-pulse">
        <div className="h-10 w-10 bg-slate-100 rounded-xl mx-auto mb-6 flex items-center justify-center text-slate-200">
           <Activity size={24} />
        </div>
        <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">Loading...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 animate-in fade-in duration-700">
        <div className="h-20 w-20 bg-slate-50 rounded-3xl mx-auto mb-8 flex items-center justify-center text-slate-200">
           <Activity size={40} />
        </div>
        <h3 className="text-2xl font-black text-[#292828] uppercase mb-4 tracking-tight">No posts yet. Be the first.</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10 leading-relaxed max-w-sm mx-auto">Post a need or find a partner to get started.</p>
        
        <div className="max-w-md mx-auto px-6">
           {/* Full CTA for Empty Feed */}
           <button 
             onClick={onCreate} 
             className="w-full h-20 bg-[#292828] text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-[#E53935] transition-all shadow-4xl active:scale-95 flex items-center justify-center gap-4 group"
           >
              Post Now <Plus size={24} className="group-hover:rotate-90 transition-transform" />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-4 pb-12">
        {posts.map((post) => {
          if (post.type === 'SYSTEM_PROMPT') {
            return (
              <div key={post.id} className="p-6 bg-[#292828] rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl animate-in zoom-in-95 duration-700">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#E53935] rounded-xl flex items-center justify-center shadow-lg">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-1">{post.title}</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase">{post.content}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onAction?.(post)}
                  className="h-12 px-8 bg-white text-[#292828] rounded-xl text-[10px] font-black uppercase hover:bg-[#E53935] hover:text-white transition-all active:scale-95 shadow-lg"
                >
                  {post.cta || "Boost Now"}
                </button>
              </div>
            );
          }
          return (
            <UniversalFeedCard 
              key={post.id} 
              post={post} 
              currentUserId={currentUserId}
              onAction={() => onAction?.(post)}
              onEdit={() => onEdit?.(post)}
              onDelete={() => onDelete?.(post)}
            />
          );
        })}
      </div>
    </div>
  );
}
