"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  X, Zap, Target, Users, Sparkles, 
  ArrowRight, CheckCircle2, Activity,
  MapPin, Calendar, IndianRupee, Tag as TagIcon,
  Plus, Check, Clock, Briefcase, Globe,
  AlertCircle, ChevronRight, ChevronLeft, Info
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

const TYPE_CONFIG = {
  REQUIREMENT: {
    label: "Requirement",
    icon: Target,
    color: "bg-[#1D1D1F]",
    shadow: "shadow-black/10",
    steps: 6,
    cta: "Post Requirement"
  },
  PARTNER: {
    label: "Partner",
    icon: Sparkles,
    color: "bg-[#34C759]",
    shadow: "shadow-emerald-500/20",
    steps: 7,
    cta: "Post Partner Opportunity"
  },
  MEETUP: {
    label: "Meetup",
    icon: Users,
    color: "bg-[#E53935]",
    shadow: "shadow-red-600/20",
    steps: 6,
    cta: "Host Meetup"
  }
};

export default function PostModal({ isOpen, onClose, onPostSuccess, editPost, initialFormType = 'REQUIREMENT' }: PostModalProps) {
  const { user: authUser } = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // CORE STATE
  const [type, setType] = useState<'REQUIREMENT' | 'PARTNER' | 'MEETUP'>(
    typeof initialFormType === 'string' && ['REQUIREMENT', 'PARTNER', 'MEETUP'].includes(initialFormType) 
      ? initialFormType 
      : 'REQUIREMENT'
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [content, setContent] = useState("");
  const [industry, setIndustry] = useState<string>("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  
  // AUX STATE
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [commitment, setCommitment] = useState<string>("Active");
  const [stage, setStage] = useState<string>("Idea");
  const [timeline, setTimeline] = useState<string>("Flexible");
  const [budget, setBudget] = useState<string>("Open");
  const [budgetType, setBudgetType] = useState<string>("Fixed");
  const [location, setLocation] = useState<string>("Remote");
  const [meetupCapacity, setMeetupCapacity] = useState<string>("10");
  const [meetupPrice, setMeetupPrice] = useState<string>("Free");
  const [meetupFormat, setMeetupFormat] = useState<string>("In-person");
  const [meetupTime, setMeetupTime] = useState<string>("1 hour");
  const [meetupDate, setMeetupDate] = useState<string>("");
  
  const [suggestion, setSuggestion] = useState<{ industry: string, focus: string } | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // RESET LOGIC
  useEffect(() => {
    if (isOpen) {
      if (editPost) {
        setContent(editPost.content || "");
        setType(editPost.type);
        setIndustry(editPost.industry || "");
        setFocusAreas(editPost.skills_required || []);
        // ... (more edit restore if needed)
      } else {
        // Only reset if not editing
        setContent("");
        setIndustry("");
        setFocusAreas([]);
        setCurrentStep(1);
      }
    }
  }, [isOpen, editPost, initialFormType]);

  // AUTO-DETECTION
  useEffect(() => {
    if (content.length > 20 && !industry) {
      const detected = detectTaxonomy(content);
      if (detected) setSuggestion(detected);
    } else {
      setSuggestion(null);
    }
  }, [content, industry]);

  const handlePost = async () => {
    if (!authUser?.id) return;
    if (!content.trim() || !industry || focusAreas.length === 0) {
      setError("Please complete all required fields");
      return;
    }

    setIsPosting(true);
    setError(null);
    const supabase = createClient();
    const idempotencyKey = `${authUser.id}-${Date.now()}`;
    
    const payload = {
      author_id: authUser.id,
      industry,
      type,
      title: content.split('\n')[0].substring(0, 60) || "New Post",
      content,
      location: type === 'MEETUP' ? meetupFormat : location,
      budget: type === 'REQUIREMENT' ? (budget === 'Open' ? 'Open' : `${budget} (${budgetType})`) : (type === 'MEETUP' ? meetupPrice : null),
      due_date: timeline === "ASAP" ? new Date().toISOString() : null,
      skills_required: focusAreas,
      partnershipType: type === 'PARTNER' ? focusAreas[0] : null,
      commitmentLevel: type === 'PARTNER' ? commitment.toUpperCase() : null,
      max_slots: type === 'MEETUP' ? parseInt(meetupCapacity) || 10 : 1,
      payment_type: type === 'MEETUP' ? meetupPrice : 'Free',
      context: idempotencyKey,
      dateTime: type === 'MEETUP' ? `${meetupDate} ${meetupTime}` : null,
      metadata: {
        focus_areas: focusAreas,
        experience_level: experienceLevel,
        specializations: specializations,
        stage: stage.toLowerCase(),
        commitment: commitment,
        duration: type === 'MEETUP' ? meetupTime : null
      }
    };

    try {
      const { data, error: postErr } = editPost 
        ? await supabase.from('posts').update(payload).eq('id', editPost.id).select().single()
        : await supabase.from('posts').insert([payload]).select().single();

      if (postErr) throw postErr;
      
      onPostSuccess?.(data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const config = TYPE_CONFIG[type];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-2xl" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
        className="relative w-full max-w-xl bg-white rounded-t-[2.5rem] sm:rounded-[3rem] p-8 lg:p-10 shadow-2xl overflow-hidden flex flex-col gap-6 max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* HEADER & SELECTOR */}
        <div className="flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all", config.color, config.shadow)}>
                 <config.icon size={20} />
              </div>
              <h2 className="text-2xl font-black italic tracking-tight text-[#1D1D1F] uppercase">{config.label}</h2>
           </div>
           <button onClick={onClose} className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
             <X size={20} />
           </button>
        </div>

        {currentStep === 1 && (
           <div className="flex gap-2 p-1 bg-slate-50 border border-black/[0.03] rounded-3xl shrink-0">
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => { setType(key as any); setCurrentStep(1); }}
                  className={cn(
                    "flex-1 h-12 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase transition-all",
                    type === key ? "bg-white text-black shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <cfg.icon size={14} />
                  {cfg.label}
                </button>
              ))}
           </div>
        )}

        {/* PROGRESS */}
        <div className="space-y-4 shrink-0">
           <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Step {currentStep} of {config.steps}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{config.label} Flow</span>
           </div>
           <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / config.steps) * 100}%` }}
                className={cn("h-full transition-all duration-500", config.color)}
              />
           </div>
        </div>

        {/* STEPS CONTENT */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
             <motion.div
               key={`${type}-${currentStep}`}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
             >
                {/* STEP 1: WHAT IS THIS ABOUT? (COMMON) */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                     <h3 className="text-3xl font-black tracking-tight leading-tight">
                        {type === 'REQUIREMENT' ? "What do you need help with?" : 
                         type === 'PARTNER' ? "What are you trying to build?" : 
                         "What is this meetup about?"}
                     </h3>
                     <div className="relative">
                        <ClarityTextarea
                          ref={inputRef}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder={
                            type === 'REQUIREMENT' ? "E.g. Need a designer for my food delivery app..." : 
                            type === 'PARTNER' ? "E.g. Building a fintech startup for local merchants..." : 
                            "E.g. Startup networking and coffee in Kochi..."
                          }
                          type={type}
                          className="min-h-[180px] text-lg font-medium p-8 bg-slate-50/50 border-black/[0.03] focus:bg-white rounded-[2rem]"
                        />
                        <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur border border-black/[0.05] rounded-full text-[10px] font-bold text-slate-400">
                           <Info size={12} />
                           {type === 'REQUIREMENT' ? "Be clear about the task" : 
                            type === 'PARTNER' ? "Keep it simple and real" : 
                            "Tell people why they should join"}
                        </div>
                     </div>

                     {suggestion && !industry && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-4 p-5 bg-slate-50 border border-black/[0.05] rounded-3xl cursor-pointer hover:bg-slate-100 transition-all group"
                          onClick={() => { setIndustry(suggestion.industry); setFocusAreas([suggestion.focus]); setCurrentStep(2); setSuggestion(null); }}
                        >
                           <div className={cn("h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", config.color.replace('bg-', 'text-'))}>
                              <Sparkles size={18} />
                           </div>
                           <div className="flex-1">
                              <p className="text-[10px] font-black uppercase text-slate-400">Suggested Category</p>
                              <p className="text-[13px] font-black text-slate-900">{getIndustryById(suggestion.industry)?.label} • {suggestion.focus}</p>
                           </div>
                           <ChevronRight size={16} className="text-slate-300" />
                        </motion.div>
                     )}
                  </div>
                )}

                {/* STEP 2: CATEGORY (COMMON) */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                     <h3 className="text-3xl font-black tracking-tight leading-tight">Pick a Category</h3>
                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-2">
                           {INDUSTRY_DATA.slice(0, 8).map(i => (
                             <button
                               key={i.id}
                               onClick={() => { setIndustry(i.id); setFocusAreas([]); }}
                               className={cn(
                                 "h-14 rounded-2xl text-[10px] font-black uppercase transition-all border",
                                 industry === i.id ? "bg-black text-white border-black shadow-xl" : "bg-white text-slate-400 border-black/[0.05] hover:border-black/[0.15]"
                               )}
                             >{i.label}</button>
                           ))}
                           <button className="h-14 rounded-2xl text-[10px] font-black uppercase bg-slate-50 text-slate-400 border border-dashed border-black/[0.1]">More Industries...</button>
                        </div>

                        <AnimatePresence>
                          {industry && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                               <label className="text-[10px] font-black text-slate-300 uppercase ml-2">Focus Areas (Select 1-3)</label>
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
                                        focusAreas.includes(area) ? cn(config.color, "text-white border-transparent") : "bg-white text-slate-400 border-black/[0.05]"
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

                {/* STEP 3: DETAILS (BRANCHED) */}
                {currentStep === 3 && (
                   <div className="space-y-8">
                      {type === 'MEETUP' ? (
                        <>
                          <h3 className="text-3xl font-black tracking-tight leading-tight">When & Where?</h3>
                          <div className="grid grid-cols-1 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-300 uppercase ml-2">Date</label>
                                <input type="date" value={meetupDate} onChange={(e) => setMeetupDate(e.target.value)} className="w-full h-16 bg-slate-50 rounded-2xl px-6 font-bold outline-none border border-black/[0.05]" />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-300 uppercase ml-2">Start Time</label>
                                   <input type="time" value={meetupTime} onChange={(e) => setMeetupTime(e.target.value)} className="w-full h-16 bg-slate-50 rounded-2xl px-6 font-bold outline-none border border-black/[0.05]" />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-300 uppercase ml-2">Format</label>
                                   <div className="flex h-16 bg-slate-50 rounded-2xl p-1 border border-black/[0.05]">
                                      {['In-person', 'Online'].map(f => (
                                        <button key={f} onClick={() => setMeetupFormat(f)} className={cn("flex-1 rounded-xl text-[10px] font-black uppercase transition-all", meetupFormat === f ? "bg-white shadow-sm" : "text-slate-400")}>{f}</button>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-3xl font-black tracking-tight leading-tight">
                             {type === 'REQUIREMENT' ? "What exactly needs to be done?" : "Who are you looking for?"}
                          </h3>
                          <div className="space-y-6">
                             {type === 'PARTNER' && (
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-300 uppercase ml-2">Experience Level</label>
                                   <div className="flex gap-2">
                                      {EXPERIENCE_LEVELS.map(level => (
                                        <button key={level} onClick={() => setExperienceLevel(level)} className={cn("flex-1 h-14 rounded-xl text-[10px] font-black uppercase transition-all border", experienceLevel === level ? "bg-black text-white" : "bg-white text-slate-400 border-black/[0.05]")}>{level}</button>
                                      ))}
                                   </div>
                                </div>
                             )}
                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-300 uppercase ml-2">Key Skills / Focus</label>
                                <div className="flex flex-wrap gap-2">
                                   {focusAreas.map(f => (
                                      <div key={f} className="px-4 py-2 bg-slate-50 border border-black/[0.05] rounded-xl text-[10px] font-black uppercase text-slate-500">{f}</div>
                                   ))}
                                </div>
                             </div>
                             <p className="text-xs text-slate-400 italic">"Be specific to attract the right person. Explain like you're telling a friend."</p>
                          </div>
                        </>
                      )}
                   </div>
                )}

                {/* STEP 4: PEOPLE/TIME (BRANCHED) */}
                {currentStep === 4 && (
                   <div className="space-y-8">
                      {type === 'REQUIREMENT' ? (
                         <>
                           <h3 className="text-3xl font-black tracking-tight leading-tight">When do you need it?</h3>
                           <div className="grid grid-cols-1 gap-4">
                              {['ASAP', 'Within 7 Days', 'Flexible'].map(t => (
                                 <button key={t} onClick={() => setTimeline(t)} className={cn("h-20 px-8 rounded-2xl flex items-center justify-between transition-all border", timeline === t ? "bg-black text-white shadow-xl" : "bg-white text-slate-400 border-black/[0.05]")}>
                                    <span className="text-[14px] font-black uppercase tracking-widest">{t}</span>
                                    {timeline === t && <CheckCircle2 size={24} />}
                                 </button>
                              ))}
                           </div>
                         </>
                      ) : type === 'PARTNER' ? (
                         <>
                           <h3 className="text-3xl font-black tracking-tight leading-tight">How serious is this?</h3>
                           <div className="grid grid-cols-1 gap-4">
                              {['Casual (Exploring)', 'Active (Working)', 'Serious (Long-term)'].map(c => (
                                 <button key={c} onClick={() => setCommitment(c.split(' ')[0])} className={cn("h-20 px-8 rounded-2xl flex items-center justify-between transition-all border", commitment === c.split(' ')[0] ? cn(config.color, "text-white shadow-xl border-transparent") : "bg-white text-slate-400 border-black/[0.05]")}>
                                    <span className="text-[14px] font-black uppercase tracking-widest">{c}</span>
                                    {commitment === c.split(' ')[0] && <CheckCircle2 size={24} />}
                                 </button>
                              ))}
                           </div>
                         </>
                      ) : (
                         <>
                           <h3 className="text-3xl font-black tracking-tight leading-tight">Meetup Details</h3>
                           <div className="space-y-4">
                              <ClarityTextarea 
                                 value={content.split('\n').slice(1).join('\n')}
                                 onChange={(e) => setContent(content.split('\n')[0] + '\n' + e.target.value)}
                                 placeholder="What will happen? Who should join?"
                                 className="min-h-[150px] p-6 text-sm"
                              />
                           </div>
                         </>
                      )}
                   </div>
                )}

                {/* STEP 5: COST/CAPACITY (BRANCHED) */}
                {currentStep === 5 && (
                   <div className="space-y-8">
                      {type === 'MEETUP' ? (
                        <>
                           <h3 className="text-3xl font-black tracking-tight leading-tight">Capacity</h3>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-300 uppercase ml-2">Total Seats</label>
                                 <input type="number" value={meetupCapacity} onChange={(e) => setMeetupCapacity(e.target.value)} className="w-full h-16 bg-slate-50 rounded-2xl px-6 font-bold outline-none border border-black/[0.05]" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-300 uppercase ml-2">Cost to join</label>
                                 <input type="text" value={meetupPrice} onChange={(e) => setMeetupPrice(e.target.value)} placeholder="E.g. Free or Rs. 100" className="w-full h-16 bg-slate-50 rounded-2xl px-6 font-bold outline-none border border-black/[0.05]" />
                              </div>
                           </div>
                        </>
                      ) : type === 'PARTNER' ? (
                        <>
                           <h3 className="text-3xl font-black tracking-tight leading-tight">Project Stage</h3>
                           <div className="grid grid-cols-1 gap-4">
                              {['Idea', 'MVP Built', 'Growth / Active'].map(s => (
                                 <button key={s} onClick={() => setStage(s.split(' ')[0])} className={cn("h-20 px-8 rounded-2xl flex items-center justify-between transition-all border", stage === s.split(' ')[0] ? cn(config.color, "text-white shadow-xl border-transparent") : "bg-white text-slate-400 border-black/[0.05]")}>
                                    <span className="text-[14px] font-black uppercase tracking-widest">{s}</span>
                                    {stage === s.split(' ')[0] && <CheckCircle2 size={24} />}
                                 </button>
                              ))}
                           </div>
                        </>
                      ) : (
                        <>
                           <h3 className="text-3xl font-black tracking-tight leading-tight">What is your budget?</h3>
                           <div className="space-y-6">
                              <div className="flex h-16 bg-slate-50 rounded-2xl p-1 border border-black/[0.05]">
                                 {['Fixed', 'Hourly', 'Free / Collab'].map(b => (
                                    <button key={b} onClick={() => setBudgetType(b)} className={cn("flex-1 rounded-xl text-[10px] font-black uppercase transition-all", budgetType === b ? "bg-white shadow-sm" : "text-slate-400")}>{b}</button>
                                 ))}
                              </div>
                              <div className="relative">
                                 <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="E.g. 5000 or 100/hr" className="w-full h-20 bg-slate-50 rounded-3xl px-14 font-black text-xl outline-none border border-black/[0.05] focus:bg-white transition-all" />
                                 <IndianRupee size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                              </div>
                              <p className="text-xs text-slate-400 italic">"Clear budget = better responses. You can change this later."</p>
                           </div>
                        </>
                      )}
                   </div>
                )}

                {/* STEP 6: EXPECTATIONS (PARTNER ONLY) */}
                {type === 'PARTNER' && currentStep === 6 && (
                   <div className="space-y-8">
                      <h3 className="text-3xl font-black tracking-tight leading-tight">Time & Expectations</h3>
                      <div className="space-y-6">
                         <div className="grid grid-cols-1 gap-4">
                            {['Part-time', 'Full-time'].map(w => (
                               <button key={w} onClick={() => setWorkType(w)} className={cn("h-20 px-8 rounded-2xl flex items-center justify-between transition-all border", workType === w ? "bg-black text-white" : "bg-white text-slate-400 border-black/[0.05]")}>
                                  <span className="text-[14px] font-black uppercase tracking-widest">{w}</span>
                                  {workType === w && <CheckCircle2 size={24} />}
                               </button>
                            ))}
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-300 uppercase ml-2">Weekly Hours (Optional)</label>
                            <input type="text" placeholder="E.g. 10-15 hours" className="w-full h-16 bg-slate-50 rounded-2xl px-6 font-bold outline-none border border-black/[0.05]" />
                         </div>
                      </div>
                   </div>
                )}

                {/* FINAL STEP: REVIEW (COMMON) */}
                {currentStep === config.steps && (
                   <div className="space-y-8">
                      <h3 className="text-3xl font-black tracking-tight leading-tight">Review & Post</h3>
                      <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-black/[0.03] space-y-6">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-slate-300">Description</p>
                            <p className="text-lg font-bold text-slate-800 leading-tight italic line-clamp-3">"{content.split('\n')[0]}"</p>
                         </div>
                         <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase text-slate-300">Category</p>
                               <p className="text-[12px] font-black uppercase">{getIndustryById(industry)?.label || 'General'}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase text-slate-300">Focus</p>
                               <p className="text-[12px] font-black uppercase truncate">{focusAreas[0] || 'N/A'}</p>
                            </div>
                            {type !== 'MEETUP' ? (
                               <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase text-slate-300">{type === 'REQUIREMENT' ? 'Budget' : 'Commitment'}</p>
                                  <p className="text-[12px] font-black uppercase">{type === 'REQUIREMENT' ? budget : commitment}</p>
                               </div>
                            ) : (
                               <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase text-slate-300">Location</p>
                                  <p className="text-[12px] font-black uppercase">{meetupFormat}</p>
                               </div>
                            )}
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase text-slate-300">Timeline</p>
                               <p className="text-[12px] font-black uppercase">{type === 'MEETUP' ? meetupDate || 'Soon' : timeline}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* NAVIGATION */}
                <div className="pt-4 flex flex-col gap-4">
                   {error && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                        <AlertCircle className="text-[#E53935]" size={16} />
                        <p className="text-[10px] font-black uppercase text-[#E53935]">{error}</p>
                     </motion.div>
                   )}

                   <div className="flex gap-3">
                      {currentStep > 1 && (
                        <button 
                          onClick={() => setCurrentStep(prev => prev - 1)}
                          className="h-20 px-8 bg-white border border-black/[0.05] text-slate-400 rounded-[2rem] flex items-center justify-center hover:bg-slate-50 transition-all"
                        >
                           <ChevronLeft size={24} />
                        </button>
                      )}
                      
                      {currentStep < config.steps ? (
                        <button 
                          onClick={() => {
                            if (currentStep === 1 && !content.trim()) { setError("Tell us what this is about first"); return; }
                            if (currentStep === 2 && !industry) { setError("Please pick a category"); return; }
                            setError(null);
                            setCurrentStep(prev => prev + 1);
                          }}
                          className={cn("flex-1 h-20 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4", config.color)}
                        >
                           Next
                           <ArrowRight size={20} />
                        </button>
                      ) : (
                        <button 
                          onClick={handlePost}
                          disabled={isPosting}
                          className={cn("flex-1 h-20 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4 group", config.color)}
                        >
                           {isPosting ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
                           {config.cta}
                        </button>
                      )}
                   </div>
                </div>
             </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
