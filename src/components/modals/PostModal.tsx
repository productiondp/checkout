"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  X, Zap, Target, Users, Sparkles, 
  ArrowRight, CheckCircle2, Activity,
  MapPin, Calendar, IndianRupee, Tag as TagIcon,
  Plus, Check, Clock, Briefcase, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { analytics } from "@/utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { detectBaseTag } from "@/utils/match-engine";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSuccess?: (post: any) => void;
  editPost?: any;
}

const AI_ENHANCEMENTS: Record<string, string[]> = {
  "video": ["Instagram Reels", "YouTube Shorts", "Corporate Video", "Video Editing"],
  "design": ["Logo Design", "Brand Identity", "UI/UX", "Social Graphics"],
  "website": ["Landing Page", "E-commerce", "Portfolio", "Responsive"],
  "marketing": ["Lead Generation", "SEO", "Ad Strategy", "Copywriting"],
  "sales": ["Inside Sales", "Direct Outreach", "Strategy", "Closing"],
  "legal": ["Contract Drafting", "Consultation", "Compliance", "IP"]
};

const SUGGESTION_CHIPS = [
  { label: "🎬 Video", tag: "Video" },
  { label: "🎨 Design", tag: "Design" },
  { label: "📢 Marketing", tag: "Marketing" },
  { label: "💻 Tech", tag: "Tech" },
  { label: "⚖️ Legal", tag: "Legal" },
  { label: "📊 Strategy", tag: "Strategy" }
];

export default function PostModal({ isOpen, onClose, onPostSuccess, editPost }: PostModalProps) {
  const { user: authUser } = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Optional Details
  const [timeline, setTimeline] = useState<string>("Flexible");
  const [budget, setBudget] = useState<string>("Open");
  const [workType, setWorkType] = useState<string>("One-time");
  const [location, setLocation] = useState<string>("Remote");

  // Reset & Auto-focus
  useEffect(() => {
    if (isOpen) {
      if (editPost) {
        setContent(editPost.content || "");
        setSelectedTags(editPost.skills_required || []);
        setTimeline(editPost.due_date ? "Fixed" : "Flexible");
        setBudget(editPost.budget || "Open");
        setWorkType(editPost.metadata?.duration || "One-time");
        setLocation(editPost.location || "Remote");
      } else {
        setContent("");
        setSelectedTags([]);
        setTimeline("Flexible");
        setBudget("Open");
        setWorkType("One-time");
        setLocation("Remote");
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, editPost]);

  // LIVE DETECTION
  const currentBaseTag = useMemo(() => detectBaseTag(content, selectedTags), [content, selectedTags]);
  
  const isShort = content.length > 0 && content.length < 30;
  const isGeneral = currentBaseTag === 'general';
  const qualityScore = (content.length > 50 ? 1 : 0) + (isGeneral ? 0 : 1) + (selectedTags.length > 0 ? 1 : 0);
  const qualityLabel = qualityScore >= 2 ? "Good post" : "Needs detail";

  const detectedChips = useMemo(() => {
    const text = content.toLowerCase();
    return SUGGESTION_CHIPS.filter(chip => 
      text.includes(chip.label.toLowerCase().split(' ')[1]) || 
      text.includes(chip.tag.toLowerCase())
    );
  }, [content]);

  const enhancements = useMemo(() => {
    const text = content.toLowerCase();
    for (const [key, list] of Object.entries(AI_ENHANCEMENTS)) {
      if (text.includes(key)) return list.filter(e => !content.toLowerCase().includes(e.toLowerCase()));
    }
    return [];
  }, [content]);

  const handlePost = async () => {
    if (!content.trim() || isPosting || !authUser?.id) return;

    setIsPosting(true);

    try {
      const supabase = createClient();
      const title = content.split('\n')[0].substring(0, 60) || "New Requirement";
      // ALWAYS Recalculate at submit for strict indexing
      const finalBaseTag = detectBaseTag(content, selectedTags);

      const payload = {
        author_id: authUser.id,
        industry: authUser.industry,
        base_tag: finalBaseTag,
        type: "REQUIREMENT",
        title: title,
        content: content,
        location: location,
        budget: budget,
        due_date: timeline === "ASAP" ? new Date().toISOString().split('T')[0] : null,
        skills_required: selectedTags.length > 0 ? selectedTags : ["General"],
        metadata: {
          duration: workType,
          timeline: timeline,
          base_tag_detected: finalBaseTag,
          posted_at: new Date().toISOString(),
          quality_score: qualityScore
        }
      };

      const res = editPost 
        ? await supabase.from('posts').update(payload).eq('id', editPost.id).select().single()
        : await supabase.from('posts').insert(payload).select().single();

      if (res.error) throw res.error;

      onPostSuccess?.(res.data);
      onClose();
      analytics.track('POST_CREATED', authUser.id, { base_tag: finalBaseTag });
    } catch (err: any) {
      console.error("POST ERROR:", err);
      alert("Could not post. Try again.");
    } finally {
      setIsPosting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-2xl" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.98 }}
        className="relative w-full max-w-xl bg-white rounded-t-[2.5rem] sm:rounded-[3rem] p-8 lg:p-10 shadow-2xl overflow-hidden flex flex-col gap-6 max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* HEADER */}
        <header className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-[#E53935] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#E53935]/20">
                <Target size={20} />
             </div>
             <h2 className="text-2xl font-black italic tracking-tight text-[#1D1D1F] uppercase">New Requirement</h2>
          </div>
          <button onClick={onClose} className="h-10 w-10 bg-[#F5F5F7] rounded-full flex items-center justify-center text-[#86868B] hover:bg-[#E8E8ED] transition-all">
            <X size={20} />
          </button>
        </header>

        {/* STEP 1: HERO INPUT */}
        <div className="space-y-3">
          <div className="relative group">
             <textarea 
              ref={inputRef}
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you need?"
              className={cn(
                "w-full bg-[#F5F5F7] border border-black/[0.03] rounded-3xl p-8 text-2xl font-bold text-[#1D1D1F] placeholder:text-[#86868B]/30 outline-none focus:bg-white focus:border-[#E53935]/20 focus:ring-[12px] focus:ring-[#E53935]/5 transition-all min-h-[160px] resize-none",
                isShort && "focus:ring-amber-500/5 focus:border-amber-500/20"
              )}
             />
             <div className="absolute bottom-6 right-8 flex items-center gap-2">
                <span className={cn(
                   "text-[10px] font-black uppercase tracking-widest",
                   content.length > 0 ? (isShort ? "text-amber-500" : "text-[#E53935]") : "text-black/10"
                )}>
                   {content.length} / 280
                </span>
             </div>
          </div>
          
          <AnimatePresence>
            {isShort && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-bold text-amber-600 px-4 flex items-center gap-2"
              >
                <Activity size={14} />
                Add a bit more detail for better matches
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* STEP 2: LIVE SMART DETECTION */}
        <AnimatePresence>
          {content.length > 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Suggestion Chips */}
              <div className="space-y-4">
                 {isGeneral && (
                    <p className="text-[10px] font-black uppercase text-[#E53935] px-1 tracking-[0.2em] animate-pulse">
                       Select a focus for faster matching
                    </p>
                 )}
                 <div className="flex flex-wrap gap-2">
                    {detectedChips.map(chip => (
                       <button 
                         key={chip.tag}
                         onClick={() => setSelectedTags(prev => prev.includes(chip.tag) ? prev.filter(t => t !== chip.tag) : [...prev, chip.tag])}
                         className={cn(
                           "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                           selectedTags.includes(chip.tag)
                             ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-lg"
                             : "bg-white text-[#1D1D1F]/40 border-black/[0.05] hover:border-black/20"
                         )}
                       >
                          {chip.label}
                       </button>
                    ))}
                    
                    {/* Enhancements */}
                    {enhancements.map(e => (
                       <button 
                         key={e}
                         onClick={() => setContent(prev => prev.trim() + " " + e)}
                         className="px-5 py-2.5 bg-[#E53935]/5 border border-[#E53935]/10 text-[#E53935] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935]/10 transition-all"
                       >
                          + {e}
                       </button>
                    ))}
                 </div>
              </div>

              {/* STEP 3: SMART OPTIONAL DETAILS */}
              <div className="space-y-6 pt-4 border-t border-black/[0.03]">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20">Optional Details</p>
                 
                 <div className="grid grid-cols-2 gap-3">
                    {/* Timeline */}
                    <div className="bg-white border border-black/[0.05] p-2 rounded-[2rem] flex items-center gap-1">
                       {["ASAP", "Flexible"].map(t => (
                          <button 
                            key={t}
                            onClick={() => setTimeline(t)}
                            className={cn(
                               "flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase transition-all",
                               timeline === t ? "bg-[#1D1D1F] text-white shadow-xl" : "text-[#86868B] hover:text-[#1D1D1F]"
                            )}
                          >
                             {t}
                          </button>
                       ))}
                    </div>

                    {/* Budget */}
                    <div className="bg-white border border-black/[0.05] p-2 rounded-[2rem] flex items-center gap-1">
                       {["Fixed", "Open"].map(b => (
                          <button 
                            key={b}
                            onClick={() => setBudget(b)}
                            className={cn(
                               "flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase transition-all",
                               budget === b ? "bg-[#1D1D1F] text-white shadow-xl" : "text-[#86868B] hover:text-[#1D1D1F]"
                            )}
                          >
                             {b}
                          </button>
                       ))}
                    </div>

                    {/* Location */}
                    <div className="bg-white border border-black/[0.05] p-2 rounded-[2rem] flex items-center gap-1">
                       {["Remote", "Local"].map(l => (
                          <button 
                            key={l}
                            onClick={() => setLocation(l)}
                            className={cn(
                               "flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase transition-all",
                               location === l ? "bg-[#1D1D1F] text-white shadow-xl" : "text-[#86868B] hover:text-[#1D1D1F]"
                            )}
                          >
                             {l}
                          </button>
                       ))}
                    </div>

                    {/* Work Type */}
                    <div className="bg-white border border-black/[0.05] p-2 rounded-[2rem] flex items-center gap-1">
                       {["One-time", "Ongoing"].map(w => (
                          <button 
                            key={w}
                            onClick={() => setWorkType(w)}
                            className={cn(
                               "flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase transition-all",
                               workType === w ? "bg-[#1D1D1F] text-white shadow-xl" : "text-[#86868B] hover:text-[#1D1D1F]"
                            )}
                          >
                             {w === "One-time" ? "Once" : "Ongoing"}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* STEP 6: PREVIEW */}
              <div className={cn(
                "p-6 border rounded-[2rem] transition-colors duration-500",
                qualityScore >= 2 ? "bg-emerald-50/50 border-emerald-100/50" : "bg-slate-50 border-slate-100"
              )}>
                 <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                       {qualityScore >= 2 ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Activity size={14} className="text-slate-400" />}
                       <p className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         qualityScore >= 2 ? "text-emerald-600" : "text-slate-400"
                       )}>{qualityLabel}</p>
                    </div>
                    <span className="text-[9px] font-black uppercase text-black/10 tracking-widest">{currentBaseTag}</span>
                 </div>
                 <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                       <div className={cn("h-1.5 w-1.5 rounded-full", qualityScore >= 2 ? "bg-emerald-500" : "bg-slate-300")} />
                       <p className={cn("text-[13px] font-bold line-clamp-1", qualityScore >= 2 ? "text-emerald-900" : "text-slate-600")}>{content}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-40">
                       <Clock size={12} />
                       <span className="text-[11px] font-bold uppercase">{timeline}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-40">
                       <MapPin size={12} />
                       <span className="text-[11px] font-bold uppercase">{location}</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 7: POST ACTION */}
        <div className="pt-2">
           <button 
            onClick={handlePost}
            disabled={isPosting || !content.trim()}
            className="w-full h-20 bg-[#1D1D1F] hover:bg-black text-white rounded-[2rem] text-[14px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-20 disabled:grayscale group"
           >
              {isPosting ? (
                <>
                  <Activity className="animate-spin" size={20} />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <span>Post Requirement</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
           </button>
        </div>
      </motion.div>
    </div>
  );
}
