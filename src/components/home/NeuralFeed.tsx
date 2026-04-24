"use client";

import React from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import UniversalFeedCard from "@/components/ui/UniversalFeedCard";

interface NeuralFeedProps {
  posts: any[];
  isLoading: boolean;
  currentUserId?: string;
  onAction?: (post: any) => void;
  onEdit?: (post: any) => void;
  onDelete?: (post: any) => void;
}

export default function NeuralFeed({ 
  posts, 
  isLoading, 
  currentUserId,
  onAction,
  onEdit,
  onDelete
}: NeuralFeedProps) {
  
  if (isLoading) {
    return (
      <div className="py-20 text-center animate-pulse">
        <div className="h-10 w-10 bg-slate-100 rounded-xl mx-auto mb-6 flex items-center justify-center text-slate-200">
           <Activity size={24} />
        </div>
        <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">Optimizing Neural Alignment...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
        <div className="h-20 w-20 bg-slate-50 rounded-3xl mx-auto mb-8 flex items-center justify-center text-slate-200">
           <Activity size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase mb-4 tracking-tight">No mandates yet in your network</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10 leading-relaxed max-w-sm mx-auto">Be the first to establish a node. Create your first mandate to activate your network and trigger neural matching.</p>
        
        <div className="max-w-md mx-auto grid grid-cols-1 gap-3 px-6">
           <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="h-16 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-2xl active:scale-95">Create your first mandate</button>
           <button onClick={() => window.location.href = '/matches'} className="h-14 bg-slate-50 text-[#292828] border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Explore relevant people</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#E53935] rounded-xl flex items-center justify-center text-white shadow-2xl">
               <Activity size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black uppercase tracking-tight">Neural <span className="text-slate-400">Feed</span></h2>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ranked by structural alignment</p>
            </div>
         </div>
      </div>

      <div className="space-y-8 pb-32">
        {posts.map((post) => (
          <UniversalFeedCard 
            key={post.id} 
            post={post} 
            currentUserId={currentUserId}
            onAction={() => onAction?.(post)}
            onEdit={() => onEdit?.(post)}
            onDelete={() => onDelete?.(post)}
          />
        ))}
      </div>
    </div>
  );
}
