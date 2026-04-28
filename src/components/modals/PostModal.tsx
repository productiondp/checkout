"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  X, Zap, Target, Users, Sparkles, 
  ArrowRight, CheckCircle2, Activity,
  MapPin, Calendar, IndianRupee, Tag as TagIcon,
  Plus, Check, Clock, Briefcase, Globe,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { analytics } from "@/utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { detectBaseTag } from "@/utils/match-engine";
import { ClarityTextarea } from "@/components/ui/ClarityTextarea";
import { INDUSTRY_DATA, getIndustryById, detectTaxonomy, EXPERIENCE_LEVELS } from "@/utils/industry-data";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSuccess?: (post: any) => void;
  editPost?: any;
  initialFormType?: 'REQUIREMENT' | 'PARTNER' | 'MEETUP';
}

const AI_ENHANCEMENTS: Record<string, string[]> = {
  "video": ["Instagram Reels", "YouTube Shorts", "Corporate Video", "Video Editing"],
  "design": ["Logo Design", "Brand Identity", "UI/UX", "Social Graphics"],
  "website": ["Landing Page", "E-commerce", "Portfolio", "Responsive"],
  "marketing": ["Lead Generation", "SEO", "Ad Strategy", "Copywriting"],
  "sales": ["Inside Sales", "Direct Outreach", "Strategy", "Closing"],
  "legal": ["Contract Drafting", "Consultation", "Compliance", "IP"],
  "meetup": ["Q&A Session", "Workshop", "Networking", "Masterclass"]
};

const SUGGESTION_CHIPS = [
  { label: "🚀 Startup", tag: "Startup" },
  { label: "🎨 Design", tag: "Design" },
  { label: "📢 Marketing", tag: "Marketing" },
  { label: "💻 Tech", tag: "Tech" },
  { label: "📊 Strategy", tag: "Strategy" }
];

export default function PostModal({ isOpen, onClose, onPostSuccess, editPost, initialFormType = 'REQUIREMENT' }: PostModalProps) {
  const { user: authUser } = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [industry, setIndustry] = useState<string>("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [intent, setIntent] = useState<string>("");
  const [commitment, setCommitment] = useState<string>("Active");
  const [stage, setStage] = useState<string>("Idea");
  const [timeline, setTimeline] = useState<string>("Flexible");
  const [budget, setBudget] = useState<string>("Open");
  const [workType, setWorkType] = useState<string>("One-time");
  const [location, setLocation] = useState<string>("Remote");
  const [meetupCapacity, setMeetupCapacity] = useState<string>("5");
  const [meetupPrice, setMeetupPrice] = useState<string>("Free");
  const [meetupFormat, setMeetupFormat] = useState<string>("In-person");
  const [meetupTime, setMeetupTime] = useState<string>("1 hour");
  const [suggestion, setSuggestion] = useState<{ industry: string, focus: string } | null>(null);
  const [type, setType] = useState<'REQUIREMENT' | 'PARTNER' | 'MEETUP'>(
    typeof initialFormType === 'string' && ['REQUIREMENT', 'PARTNER', 'MEETUP'].includes(initialFormType) 
      ? initialFormType 
      : 'REQUIREMENT'
  );
  
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Draft Auto-Save (Step 11)
  useEffect(() => {
    if (isOpen && !editPost && content) {
      const draft = { content, industry, focusAreas, experienceLevel, specializations, intent, commitment, stage, type };
      localStorage.setItem('checkout_post_draft', JSON.stringify(draft));
    }
  }, [content, industry, focusAreas, experienceLevel, specializations, intent, commitment, stage, type, isOpen, editPost]);

  // Load Draft
  useEffect(() => {
    if (isOpen && !editPost) {
      const saved = localStorage.getItem('checkout_post_draft');
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          if (Date.now() - (draft.timestamp || 0) < 3600000) { // 1hr expiry
             // Potentially restore, but usually we start fresh unless user confirms
          }
        } catch (e) {}
      }
    }
  }, [isOpen, editPost]);

  // Reset & Auto-focus
  useEffect(() => {
    if (isOpen) {
      if (editPost) {
        setContent(editPost.content || "");
        setType(editPost.type);
        setIndustry(editPost.industry || "");
        setFocusAreas(editPost.metadata?.focus_areas || []);
        setSelectedTags(editPost.skills_required || []);
        setTimeline(editPost.due_date ? "Fixed" : "Flexible");
        setBudget(editPost.budget || "Open");
        setWorkType(editPost.metadata?.duration || "One-time");
        setLocation(editPost.location || "Remote");
      } else {
        setContent("");
        setType(
          typeof initialFormType === 'string' && ['REQUIREMENT', 'PARTNER', 'MEETUP'].includes(initialFormType) 
            ? initialFormType 
            : 'REQUIREMENT'
        );
        setIndustry("");
        setFocusAreas([]);
        setSelectedTags([]);
        setTimeline("Flexible");
        setBudget("Open");
        setWorkType("One-time");
        setLocation("Remote");
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, editPost, initialFormType]);

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

  useEffect(() => {
    if (content.length > 20 && !industry) {
      const detected = detectTaxonomy(content);
      if (detected) setSuggestion(detected);
    } else {
      setSuggestion(null);
    }
  }, [content, industry]);

  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(typeof window !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePost = async () => {
    // 🛡️ STEP 3: NETWORK CHECK
    if (isOffline) {
      setError("No internet connection. Please check your network.");
      return;
    }

    if (!authUser?.id) {
      alert("You must be logged in to post.");
      return;
    }

    if (!content.trim() || !industry || focusAreas.length === 0) {
      setError("Please complete all required fields");
      return;
    }

    setIsPosting(true);
    setError(null);
    setRetryCount(0);

    // 🛡️ STEP 1: IDEMPOTENCY KEY
    const idempotencyKey = `${authUser.id}-${Date.now()}`;
    
    const title = content.split('\n')[0].substring(0, 60) || "New Post";
    const finalBaseTag = detectBaseTag(content, selectedTags);

    const payload = {
      author_id: authUser.id,
      industry: industry,
      base_tag: finalBaseTag,
      type: type,
      title: title,
      content: content,
      location: type === 'MEETUP' ? meetupFormat : location,
      budget: type === 'MEETUP' ? meetupPrice : budget,
      due_date: timeline === "ASAP" ? new Date().toISOString().split('T')[0] : null,
      skills_required: focusAreas,
      partnershipType: type === 'PARTNER' ? focusAreas[0] : null,
      commitmentLevel: type === 'PARTNER' ? commitment.toUpperCase() : null,
      max_slots: type === 'MEETUP' ? parseInt(meetupCapacity) || 5 : 1,
      payment_type: type === 'MEETUP' ? meetupPrice : 'Free',
      // Idempotency support
      context: idempotencyKey, 
      metadata: {
        idempotency_key: idempotencyKey,
        duration: type === 'MEETUP' ? meetupTime : workType,
        timeline: timeline,
        quality_score: qualityScore,
        focus_areas: focusAreas,
        intent: intent,
        commitment: commitment,
        stage: stage.toLowerCase(),
        experience_level: experienceLevel,
        specializations: specializations,
        retry_attempts: 0
      }
    };

    const attemptSubmit = async (attempt: number): Promise<any> => {
      const supabase = createClient();
      
      // 🛡️ STEP 6: TIMEOUT GUARD (8s)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        if (attempt > 0) setRetryCount(attempt);

        const res = editPost 
          ? await supabase.from('posts').update(payload).eq('id', editPost.id).select().single()
          : await supabase.from('posts').insert([payload]).select().single();

        clearTimeout(timeoutId);

        if (res.error) throw res.error;
        return res.data;
      } catch (err: any) {
        clearTimeout(timeoutId);
        
        // 🛡️ STEP 2: RETRY LOGIC (Max 2 retries)
        if (attempt < 2 && (err.name === 'AbortError' || !navigator.onLine || err.status >= 500)) {
          const delay = attempt === 0 ? 500 : 1500;
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptSubmit(attempt + 1);
        }
        throw err;
      }
    };

    try {
      console.log("🚀 Hardened Submission Start:", idempotencyKey);
      const data = await attemptSubmit(0);

      // 🛡️ STEP 8: SAFE SUCCESS
      onPostSuccess?.(data);
      analytics.track('POST_CREATED', authUser.id, { 
        type, 
        retries: retryCount,
        success: true 
      });
      
      setContent("");
      setIndustry("");
      setFocusAreas([]);
      setCurrentStep(1);
      onClose();
    } catch (err: any) {
      // 🛡️ STEP 5 & 7: FAILURE STATE & ANALYTICS
      console.error("❌ FINAL FAILURE:", err);
      const reason = err.name === 'AbortError' ? "Request timed out" : err.message;
      setError(`Couldn't post. ${reason}. Tap to retry.`);
      
      analytics.track('POST_FAILED', authUser.id, { 
        type, 
        reason,
        retries: retryCount 
      });
    } finally {
      setIsPosting(false);
      setRetryCount(0);
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
        {/* TYPE SELECTOR */}
        <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-3xl shrink-0">
           {[
             { id: 'REQUIREMENT', label: 'Requirement', icon: Target },
             { id: 'PARTNER', label: 'Partner', icon: Sparkles },
             { id: 'MEETUP', label: 'Meetup', icon: Users },
           ].map(t => (
             <button
               key={t.id}
               onClick={() => setType(t.id as any)}
               className={cn(
                 "flex-1 h-12 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase transition-all",
                 type === t.id ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-black"
               )}
             >
               <t.icon size={16} />
               {t.label}
             </button>
           ))}
        </div>

        {/* HEADER */}
        <header className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
             <div className={cn(
               "h-10 w-10 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all",
               type === 'MEETUP' ? "bg-[#E53935] shadow-red-600/20" : 
               type === 'PARTNER' ? "bg-indigo-600 shadow-indigo-600/20" : "bg-amber-500 shadow-amber-500/20"
             )}>
                {type === 'MEETUP' ? <Users size={20} /> : 
                 type === 'PARTNER' ? <Sparkles size={20} /> : <Target size={20} />}
             </div>
             <h2 className="text-2xl font-black italic tracking-tight text-[#1D1D1F] uppercase">
                {type === 'MEETUP' ? "Host Meetup" : 
                 type === 'PARTNER' ? "Find Partner" : "New Requirement"}
             </h2>
          </div>
          <button onClick={onClose} className="h-10 w-10 bg-[#F5F5F7] rounded-full flex items-center justify-center text-[#86868B] hover:bg-[#E8E8ED] transition-all">
            <X size={20} />
          </button>
        </header>

        {/* WIZARD PROGRESS BAR (V2.0) */}
        {type === 'PARTNER' && (
          <div className="mb-10 space-y-4">
             <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/20">Step {currentStep} of 7</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Partner Opportunity</span>
             </div>
             <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-black/[0.02]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 7) * 100}%` }}
                  className="h-full bg-indigo-600"
                />
             </div>
          </div>
        )}

        {/* CONTENT BRANCH (V2.0) */}
        <AnimatePresence mode="wait">
          {type === 'PARTNER' ? (
            <motion.div 
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* STEP 1: HERO INPUT */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-black tracking-tight leading-tight">What do you want to build?</h3>
                  <div className="relative">
                    <ClarityTextarea
                      ref={inputRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="E.g. Building a fintech app for local merchants in Kerala. Need someone to handle the backend..."
                      type={type}
                      className="min-h-[200px] text-lg font-medium p-8 bg-slate-50/50 border-black/[0.03] focus:bg-white focus:border-indigo-600/20"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: INDUSTRY & FOCUS */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-black tracking-tight leading-tight">Industry & Focus</h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-black/30 uppercase ml-2">Primary Industry</label>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {INDUSTRY_DATA.map(i => (
                            <button
                              key={i.id}
                              onClick={() => { setIndustry(i.id); setFocusAreas([]); }}
                              className={cn(
                                "h-14 rounded-xl text-[10px] font-black uppercase transition-all border",
                                industry === i.id ? "bg-indigo-600 text-white border-indigo-600 shadow-xl" : "bg-white text-slate-400 border-black/[0.05] hover:border-indigo-600/20"
                              )}
                            >{i.label}</button>
                          ))}
                       </div>
                    </div>

                    <AnimatePresence>
                      {industry && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                           <label className="text-[10px] font-black text-black/30 uppercase ml-2">Focus Areas (Max 3)</label>
                           <div className="flex flex-wrap gap-2">
                              {getIndustryById(industry)?.focusAreas.map(area => (
                                <button
                                  key={area}
                                  onClick={() => {
                                    if (focusAreas.includes(area)) setFocusAreas(prev => prev.filter(a => a !== area));
                                    else if (focusAreas.length < 3) setFocusAreas(prev => [...prev, area]);
                                  }}
                                  className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border",
                                    focusAreas.includes(area) ? "bg-black text-white" : "bg-white text-slate-400 border-black/[0.05]"
                                  )}
                                >{area}</button>
                              ))}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* STEP 3: PARTNER REQUIREMENT */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-black tracking-tight leading-tight">Who are you looking for?</h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-black/30 uppercase ml-2">Experience Level Needed</label>
                       <div className="flex gap-2">
                          {EXPERIENCE_LEVELS.map(level => (
                            <button
                              key={level}
                              onClick={() => setExperienceLevel(level)}
                              className={cn(
                                "flex-1 h-14 rounded-xl text-[10px] font-black uppercase transition-all border",
                                experienceLevel === level ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border-black/[0.05]"
                              )}
                            >{level}</button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-black/30 uppercase ml-2">Specializations</label>
                       <div className="flex flex-wrap gap-2">
                          {focusAreas.length > 0 ? focusAreas.map(focus => {
                             const specs = getIndustryById(industry)?.specializations?.[focus];
                             if (!specs) return null;
                             return specs.map(spec => (
                               <button
                                 key={spec}
                                 onClick={() => {
                                   if (specializations.includes(spec)) setSpecializations(prev => prev.filter(s => s !== spec));
                                   else if (specializations.length < 4) setSpecializations(prev => [...prev, spec]);
                                 }}
                                 className={cn(
                                   "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border",
                                   specializations.includes(spec) ? "bg-indigo-600 text-white" : "bg-white text-indigo-400 border-indigo-600/10"
                                 )}
                               >{spec}</button>
                             ));
                          }) : <p className="text-xs text-black/20 italic">Select focus areas in the previous step.</p>}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: COMMITMENT */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-black tracking-tight leading-tight">How serious is this?</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['Casual', 'Active', 'Serious'].map(c => (
                      <button
                        key={c}
                        onClick={() => setCommitment(c)}
                        className={cn(
                          "h-20 rounded-2xl px-8 flex items-center justify-between transition-all border",
                          commitment === c ? "bg-indigo-600 border-indigo-600 text-white shadow-xl" : "bg-white text-slate-400 border-black/[0.05] hover:bg-slate-50"
                        )}
                      >
                         <span className="text-[14px] font-black uppercase tracking-widest">{c}</span>
                         {commitment === c && <CheckCircle2 size={24} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: PROJECT STAGE */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-black tracking-tight leading-tight">Current Project Stage</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['Idea', 'MVP', 'Growth'].map(s => (
                      <button
                        key={s}
                        onClick={() => setStage(s)}
                        className={cn(
                          "h-20 rounded-2xl px-8 flex items-center justify-between transition-all border",
                          stage === s ? "bg-indigo-600 border-indigo-600 text-white shadow-xl" : "bg-white text-slate-400 border-black/[0.05] hover:bg-slate-50"
                        )}
                      >
                         <span className="text-[14px] font-black uppercase tracking-widest">{s}</span>
                         {stage === s && <CheckCircle2 size={24} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: TIME & EXPECTATIONS */}
              {currentStep === 6 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-black tracking-tight leading-tight">Time & Expectations</h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-black/30 uppercase ml-2">Timeline</label>
                       <div className="flex gap-2">
                          {['ASAP', 'Flexible'].map(t => (
                            <button
                              key={t}
                              onClick={() => setTimeline(t)}
                              className={cn(
                                "flex-1 h-16 rounded-xl text-[10px] font-black uppercase transition-all border",
                                timeline === t ? "bg-black text-white" : "bg-white text-slate-400 border-black/[0.05]"
                              )}
                            >{t}</button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-black/30 uppercase ml-2">Work Type</label>
                       <div className="flex gap-2">
                          {['One-time', 'Ongoing'].map(w => (
                            <button
                              key={w}
                              onClick={() => setWorkType(w)}
                              className={cn(
                                "flex-1 h-16 rounded-xl text-[10px] font-black uppercase transition-all border",
                                workType === w ? "bg-black text-white" : "bg-white text-slate-400 border-black/[0.05]"
                              )}
                            >{w === 'One-time' ? 'Once' : 'Ongoing'}</button>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: REVIEW */}
              {currentStep === 7 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-black tracking-tight leading-tight">Review Opportunity</h3>
                  <div className="space-y-4">
                     <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-black/[0.03] space-y-6">
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase text-black/20">The Project</p>
                           <p className="text-lg font-bold text-black/80 leading-relaxed italic line-clamp-3">"{content}"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-black/20">Industry</p>
                              <p className="text-[12px] font-black uppercase">{getIndustryById(industry)?.label || 'General'}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-black/20">Focus</p>
                              <p className="text-[12px] font-black uppercase">{focusAreas.join(', ')}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-black/20">Commitment</p>
                              <p className="text-[12px] font-black uppercase">{commitment}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-black/20">Stage</p>
                              <p className="text-[12px] font-black uppercase">{stage}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {/* WIZARD NAVIGATION */}
              <div className="pt-8 flex flex-col gap-4">
                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                     <AlertCircle className="text-[#E53935]" size={16} />
                     <p className="text-[10px] font-black uppercase text-[#E53935]">{error}</p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                   {currentStep > 1 && (
                     <button 
                       onClick={() => setCurrentStep(prev => prev - 1)}
                       className="h-20 px-10 bg-white border border-black/[0.05] text-slate-400 rounded-[2rem] text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                     >Back</button>
                   )}
                   
                   {currentStep < 7 ? (
                     <button 
                       onClick={() => {
                         if (currentStep === 1 && !content.trim()) { setError("Please describe what you want to build"); return; }
                         if (currentStep === 2 && !industry) { setError("Please select an industry"); return; }
                         if (currentStep === 3 && !experienceLevel) { setError("Please select experience level"); return; }
                         setError(null);
                         setCurrentStep(prev => prev + 1);
                       }}
                       className="flex-1 h-20 bg-indigo-600 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-4"
                     >
                        Next Step
                        <ArrowRight size={20} />
                     </button>
                   ) : (
                     <button 
                       onClick={handlePost}
                       disabled={isPosting}
                       className="flex-1 h-20 bg-indigo-600 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-4 group"
                     >
                        {isPosting ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
                        Post Partner Opportunity
                     </button>
                   )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* LEGACY VIEW FOR REQUIREMENT/MEETUP */}
              <div className="relative">
                <ClarityTextarea
                  ref={inputRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={type === 'MEETUP' ? "Describe your meetup... what will people learn?" : "What do you need help with?"}
                  type={type}
                  className={cn(
                    "min-h-[180px] text-[16px] font-medium leading-relaxed p-8 rounded-[2rem] bg-slate-50 border-black/[0.03] transition-all",
                    type === 'MEETUP' && "focus:ring-red-500/5 focus:border-red-500/20",
                    type === 'PARTNER' && "focus:ring-indigo-600/5 focus:border-indigo-600/20"
                  )}
                />
              </div>
              
              {/* Reuse Step 2 logic here or keep compact */}
              <div className="space-y-6">
                 {/* ... (Keep legacy fields for other types) ... */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-black/30 uppercase ml-2">Industry (Required)</label>
                       <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full h-14 bg-slate-50 border border-black/[0.05] rounded-2xl px-6 text-[12px] font-bold uppercase outline-none">
                          <option value="">Select Industry</option>
                          {INDUSTRY_DATA.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-black/30 uppercase ml-2">Focus Areas</label>
                       <div className="flex flex-wrap gap-2">
                          {getIndustryById(industry)?.focusAreas.map(area => (
                            <button key={area} onClick={() => focusAreas.includes(area) ? setFocusAreas(prev => prev.filter(a => a !== area)) : setFocusAreas(prev => [...prev, area])} className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase border", focusAreas.includes(area) ? "bg-black text-white" : "bg-white text-black/40 border-black/[0.05]")}>{area}</button>
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 <button 
                  onClick={handlePost}
                  disabled={isPosting || !content.trim()}
                  className={cn(
                     "w-full h-20 rounded-[2rem] text-[14px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-20",
                     type === 'MEETUP' ? "bg-[#E53935] hover:bg-red-700 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"
                  )}
                 >
                    {isPosting ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
                    Post {type}
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
