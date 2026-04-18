"use client";

import React, { useState } from "react";
import { X, ImageIcon, Plus, Send, Zap, Briefcase, Target, Calendar, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostModal({ isOpen, onClose }: PostModalProps) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("Update");
  const [isPosting, setIsPosting] = useState(false);

  if (!isOpen) return null;

  const handlePost = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      onClose();
      setContent("");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white rounded-t-[1.625rem] sm:rounded-[1.625rem] overflow-hidden shadow-4xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-[#292828]/5 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-[#E53935]/10 rounded-xl flex items-center justify-center text-[#E53935]">
                <Plus size={20} />
             </div>
             <h2 className="text-xl font-black text-[#292828] uppercase">New <span className="text-[#E53935]">Post</span></h2>
          </div>
          <button onClick={onClose} className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828] hover:bg-[#292828]/10 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-8">
          <div className="flex flex-wrap gap-2">
            {["Update", "Deal", "Job", "Partner", "Meet", "Event"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "px-4 h-10 rounded-xl text-[10px] font-black uppercase transition-all border",
                  type === t ? "bg-[#292828] border-[#292828] text-white shadow-xl" : "bg-white border-[#292828]/10 text-[#292828]"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Share a business ${type.toLowerCase()}...`}
            className="w-full bg-[#292828]/5 p-6 rounded-[0.975rem] border-2 border-transparent text-base font-bold text-[#292828] placeholder:text-[#292828]/20 outline-none resize-none min-h-[160px] focus:border-[#E53935]/20 focus:bg-white transition-all"
          />

          <div className="grid grid-cols-2 gap-4">
             <button className="h-16 bg-white border border-[#292828]/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase text-[#292828] hover:bg-slate-50 transition-all shadow-sm">
                <ImageIcon size={18} className="text-[#E53935]" /> Add Photo
             </button>
             <button className="h-16 bg-white border border-[#292828]/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase text-[#292828] hover:bg-slate-50 transition-all shadow-sm">
                <Zap size={18} className="text-amber-500" /> Boost Post
             </button>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-[#292828]/5 lg:pb-6 pb-10">
          <button
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="w-full h-16 bg-[#E53935] text-white rounded-2xl font-black text-xs uppercase shadow-2xl shadow-red-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isPosting ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18} /> Post Now</>}
          </button>
        </div>
      </div>
    </div>
  );
}
