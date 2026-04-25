"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, Zap, Target, Users, Sparkles, 
  ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Eye, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { analytics } from "@/utils/analytics";
import { logger } from "@/utils/logger";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSuccess?: (post: any) => void;
  initialFormType?: PostType;
  editPost?: any;
}

type PostType = "REQUIREMENT" | "PARTNERSHIP" | "MEETUP";

// Sub-components moved outside to prevent re-mounting and focus loss
const SelectionCard = ({ type, label, desc, icon: Icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full p-6 bg-white border border-[#292828]/5 rounded-2xl flex items-center gap-6 hover:border-[#292828]/20 hover:shadow-2xl hover:shadow-black/5 transition-all group"
  >
    <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center text-white shadow-lg", color)}>
       <Icon size={24} />
    </div>
    <div className="text-left flex-1">
       <h3 className="text-lg font-black text-[#292828] uppercase tracking-tight leading-none mb-1 group-hover:text-[#E53935] transition-colors">{label}</h3>
       <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">{desc}</p>
    </div>
    <ArrowRight className="text-slate-200 group-hover:text-[#E53935] transition-colors" size={20} />
  </button>
);

const Input = ({ label, field, placeholder, type = "text", options = [], example, value, onChange }: any) => (
  <div className="space-y-1.5">
     <div className="flex items-center justify-between px-1">
        <label className="text-[8px] font-black uppercase text-slate-300 tracking-widest">{label}</label>
        {example && <span className="text-[7px] font-bold text-slate-200 uppercase">{example}</span>}
     </div>
     <div className="bg-slate-50/50 border border-slate-100 rounded-xl focus-within:bg-white focus-within:border-[#292828]/10 focus-within:ring-4 focus-within:ring-[#292828]/5 transition-all px-5 py-4">
        {type === "textarea" ? (
           <textarea 
             value={value} 
             onChange={e => onChange(field, e.target.value)} 
             placeholder={placeholder}
             className="w-full bg-transparent text-[13px] font-bold outline-none resize-none h-20 text-[#292828] placeholder:text-slate-200"
           />
        ) : type === "select" ? (
           <select 
             value={value} 
             onChange={e => onChange(field, e.target.value)}
             className="w-full bg-transparent text-[13px] font-bold outline-none appearance-none cursor-pointer text-[#292828]"
           >
              {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
           </select>
        ) : (
           <input 
             type={type}
             value={value} 
             onChange={e => onChange(field, e.target.value)} 
             placeholder={placeholder}
             className="w-full bg-transparent text-[13px] font-bold outline-none text-[#292828] placeholder:text-slate-200"
           />
        )}
     </div>
  </div>
);

export default function PostModal({ isOpen, onClose, onPostSuccess, initialFormType, editPost }: PostModalProps) {
  const { user: authUser } = useAuth();
  const [postType, setPostType] = useState<PostType | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [createdPost, setCreatedPost] = useState<any>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [titleWarning, setTitleWarning] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [showDuplicateOverride, setShowDuplicateOverride] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: "",
    content: "",
    context: "PROFESSIONAL",
    budget: "",
    deadline: "",
    urgency: "Medium",
    skills: "",
    partnershipType: "Agency",
    industry: "",
    commitment: "High",
    mode: "Offline",
    location: "Trivandrum",
    dateTime: "",
    price: "Free"
  });

  const previewThrottleRef = useRef<any>(null);
  const chipDebounceRef = useRef<any>(null);
  const performanceWindow = useRef<number[]>([]);
  const consecutiveSpikes = useRef<number>(0);
  const lastThrottleIncrease = useRef<number>(0);
  const lastThrottleStep = useRef<number>(0);
  const stablePerformanceCount = useRef<number>(0);
  const [adaptiveThrottle, setAdaptiveThrottle] = useState(120);

  const supabase = createClient();

  useEffect(() => {
    if (isOpen && initialFormType && !editPost) {
      setPostType(initialFormType);
      setCurrentStep(1); // Skip selection step
    }
  }, [isOpen, initialFormType, editPost]);

  // Performance Monitor with Stability Margin
  useEffect(() => {
    if (isOpen) {
       const checkPerformance = () => {
          const start = performance.now();
          requestAnimationFrame(() => {
             const duration = performance.now() - start;
             performanceWindow.current.push(duration);
             if (performanceWindow.current.length > 10) performanceWindow.current.shift();

             if (duration > 32) {
                consecutiveSpikes.current++;
                stablePerformanceCount.current = 0;
             } else {
                consecutiveSpikes.current = 0;
                // Stability Margin: Require avg duration < 12ms (not just < 16ms) before recovery
                const avg = performanceWindow.current.reduce((a, b) => a + b, 0) / performanceWindow.current.length;
                if (avg < 12) stablePerformanceCount.current++;
                else stablePerformanceCount.current = Math.max(0, stablePerformanceCount.current - 1);
             }

             const avg = performanceWindow.current.reduce((a, b) => a + b, 0) / performanceWindow.current.length;
             const now = Date.now();
             
             if (consecutiveSpikes.current >= 3 || avg > 25) {
                setAdaptiveThrottle(prev => {
                   const next = prev === 120 ? 180 : 250;
                   if (next > prev) lastThrottleIncrease.current = now;
                   return next;
                });
             } else if (stablePerformanceCount.current >= 8) { // Increased cycle requirement for anti-illusion
                const timeSinceLastStep = now - lastThrottleStep.current;
                const timeSinceLastIncrease = now - lastThrottleIncrease.current;

                if (timeSinceLastIncrease > 25000 && timeSinceLastStep > 6500) {
                   setAdaptiveThrottle(prev => {
                      if (prev === 250) { lastThrottleStep.current = now; return 180; }
                      if (prev === 180) { lastThrottleStep.current = now; return 120; }
                      return 120;
                   });
                }
             }
          });
       };
       const interval = setInterval(checkPerformance, 800);
       return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (editPost) {
        setPostType(editPost.type?.toUpperCase() as PostType);
        setCurrentStep(1);
        setFormData({
          title: editPost.title || "",
          content: editPost.content || "",
          budget: editPost.budget || "",
          deadline: editPost.due_date || "",
          urgency: editPost.urgency || "Medium",
          skills: editPost.skills_required?.join(", ") || "",
          partnershipType: editPost.partnershipType || "Agency",
          industry: editPost.industry || "",
          commitment: editPost.commitmentLevel || "High",
          mode: editPost.mode || "Offline",
          location: editPost.location || "Trivandrum",
          dateTime: editPost.dateTime || "",
          price: editPost.payment_type || "Free"
        });
      } else if (initialFormType) {
        setPostType(initialFormType);
        setCurrentStep(1);
      } else {
        setPostType("REQUIREMENT"); 
        setCurrentStep(1); 
        setCreatedPost(null);
        setSelectedTags([]);
        setTitleWarning(null);
        setShowDuplicateOverride(false);
        setFormData({
           title: "",
           content: "",
           context: "PROFESSIONAL",
           budget: "",
           deadline: "",
           urgency: "Medium",
           skills: "",
           partnershipType: "Agency",
           industry: "",
           commitment: "High",
           mode: "Offline",
           location: "Trivandrum",
           dateTime: "",
           price: "Free"
        });
      }
    }
  }, [isOpen, initialFormType, editPost]);

  const updateField = (field: string, value: any) => {
    // Always update form data immediately for fluid typing
    setFormData((prev: any) => ({ ...prev, [field]: value }));

    if (field === 'title' || field === 'content') {
       if (previewThrottleRef.current) return;
       previewThrottleRef.current = setTimeout(() => {
          previewThrottleRef.current = null;
       }, adaptiveThrottle);
    }
    
    if (field === 'title') {
       const raw = value.trim().replace(/\s+/g, ' ');
       const lower = raw.toLowerCase();

       if (raw.length > 0 && raw.length < 10) {
          setTitleWarning("Add 2–3 more words for better replies");
       } else {
          setTitleWarning(null);
       }

       const lastPost = JSON.parse(localStorage.getItem('checkout_last_post') || '{}');
       if (lastPost.title?.toLowerCase() === lower && Date.now() - lastPost.time < 30000) {
          // Cross-Field Relevance Validation
          let relevanceRegex = /(([₹$]|rs\.?)\s*([1-9]\d{1,6}))|(\d{1,2}\s*(hr|min|day|week|mo|yr))/;
          if (postType === 'MEETUP') relevanceRegex = /(\d{1,2}[\/\-]\d{1,2})|(\d{1,2}\s*(am|pm))/;
          
          const hasRelevantNumeric = relevanceRegex.test(formData.content);
          const hasCrossFieldMatch = (postType === 'REQUIREMENT' && formData.budget) || (postType === 'MEETUP' && formData.dateTime);
          const hasNewTag = selectedTags.length > (lastPost.tags?.length || 0);
          
          if (!(hasRelevantNumeric || hasCrossFieldMatch || hasNewTag)) {
             const currentTokens = lower.split(/\s+/).filter(t => t.length > 3);
             const lastTokens = lastPost.title.toLowerCase().split(/\s+/).filter((t: string) => t.length > 3);
             const overlap = currentTokens.filter(t => lastTokens.includes(t)).length;
             const overlapRatio = overlap / Math.max(currentTokens.length, 1);
             
             if (overlapRatio > 0.8) {
               setTitleWarning("Duplicate post detected.");
               setShowDuplicateOverride(true);
             }
          }
       }

       if (raw.length > 5) {
          const suggestions = [];
          if (lower.includes('dev')) suggestions.push('React', 'Node', 'Next.js');
          if (lower.includes('design')) suggestions.push('UI', 'UX', 'Figma');
          if (lower.includes('market') || lower.includes('sale')) suggestions.push('Leads', 'SEO', 'Ads');
          
          const newSuggestions = suggestions.slice(0, 3);
          setSuggestedTags(newSuggestions);

          if (newSuggestions.length > 0 && selectedTags.length === 0) {
             const anchorTag = newSuggestions[0];
             setSelectedTags([anchorTag]);
             setFormData((f: any) => ({ ...f, skills: anchorTag }));
          }
       }
    }
  };

  const toggleTag = (tag: string) => {
    if (chipDebounceRef.current) clearTimeout(chipDebounceRef.current);
    chipDebounceRef.current = setTimeout(() => {
      setSelectedTags(prev => {
        const next = prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag];
        setFormData((f: any) => ({ ...f, skills: next.join(", ") }));
        return next;
      });
    }, adaptiveThrottle + 30);
  };

  const handlePost = async (isOverride = false) => {
    if (!postType || !formData.title || cooldown > 0) return;
    setIsPosting(true);
    
    try {
      const user = authUser;
      if (!user) throw new Error("Unauthorized");

      let cooldownTime = 10;
      if (isOverride) {
         const overrideHistory = JSON.parse(localStorage.getItem('checkout_override_history') || '[]');
         const recentOverrides = overrideHistory.filter((t: number) => Date.now() - t < 300000);
         if (recentOverrides.length >= 3) {
            cooldownTime += 15;
            await logger.track('override_excessive', user.id, { count: recentOverrides.length });
         }
         localStorage.setItem('checkout_override_history', JSON.stringify([...recentOverrides, Date.now()]));
      }

      const lastPostTime = Number(localStorage.getItem('checkout_last_post_time') || 0);
      if (Date.now() - lastPostTime < (cooldownTime * 1000)) {
         setCooldown(cooldownTime);
         const timer = setInterval(() => {
            setCooldown(c => {
               if (c <= 1) { clearInterval(timer); return 0; }
               return c - 1;
            });
         }, 1000);
         throw new Error("Cooldown active");
      }

      const normalizedTitle = formData.title.trim().toLowerCase().replace(/\s+/g, ' ');
      const contentHash = btoa(formData.content.slice(0, 50)); 
      const timeBucket = Math.floor(Date.now() / 300000); 
      const idempotencyKey = `${user.id}:${normalizedTitle}:${contentHash}:${timeBucket}`;

      const postData: any = {
        author_id: user.id,
        type: postType,
        context: formData.context,
        title: formData.title,
        content: formData.content,
        location: formData.location || "Trivandrum",
        match_score: 85 + (formData.content.length >= 20 ? 5 : 0),
        budget: formData.budget,
        due_date: formData.deadline || null,
        skills_required: formData.skills ? formData.skills.split(",").map((s: string) => s.trim()) : null,
        urgency: formData.urgency,
        partnershipType: formData.partnershipType,
        industry: formData.industry,
        commitmentLevel: formData.commitment,
        mode: formData.mode,
        dateTime: formData.dateTime,
        payment_type: formData.price,
        max_slots: 8,
        idempotency_key: idempotencyKey,
        normalized_tokens: normalizedTitle.split(' '),
        metadata: {
           is_override: isOverride,
           trace_id: `tr_${Date.now()}`,
           routing_state: 'NORMAL',
           routing_governance: {
              floor: formData.content.length >= 50 ? 0.95 : 0.9,
              onboarding_window: {
                 active: true,
                 guaranteed_ms: 1200000 // 20m Onboarding Window
              },
              floor_decay: {
                 active: true,
                 pause_on_interaction: {
                    active: true,
                    min_depth: 2,
                    min_interaction_ms: 180000, // 3m Depth requirement
                    pause_cap_ms: 2700000 
                 },
                 accelerated_closure: {
                    active: true,
                    grace_window_ms: 180000 // 3m Success Grace Window
                 }
              },
              cap: 1.3,
              cold_start_injection: {
                 frequency: 5,
                 trust_threshold: 0.8,
                 auto_tuning: 'trend-stable'
              }
           }
        }
      };

      let result;
      if (editPost) {
        result = await supabase.from('posts').update(postData).eq('id', editPost.id).select().single();
      } else {
        if (!isOverride) {
           const { data: existing } = await supabase.from('posts').select('id').eq('idempotency_key', idempotencyKey).single();
           if (existing) {
              await logger.track('duplicate_blocked', user.id, { title: formData.title });
              setShowDuplicateOverride(true);
              throw new Error("Duplicate submission");
           }
        }

        result = await supabase.from('posts').insert([postData]).select().single();
      }

      if (result.error) throw result.error;
      
      localStorage.setItem('checkout_last_post', JSON.stringify({ 
        title: formData.title, 
        content: formData.content, 
        tags: selectedTags,
        time: Date.now() 
      }));
      localStorage.setItem('checkout_last_post_time', String(Date.now()));

      await logger.track('post_created', user.id, { postId: result.data.id, type: postType });
      await logger.traceFlow(user.id, 'created', { postId: result.data.id });

      setCreatedPost(result.data);
      setCurrentStep(3);
      onPostSuccess?.(result.data);
    } catch (err: any) {
      if (err.message === "Cooldown active") return;
      if (err.message === "Duplicate submission") return;
      
      console.error("[PostModal] Submission Error:", err);
      
      const errorCode = err.code || (err.error && err.error.code) || (err.message && err.message.includes('PGRST204') ? 'PGRST204' : null);
      const errorMessage = err.message || (err.error && err.error.message) || "Unknown error";
      
      if (errorCode === "23505") { // Unique Constraint (Idempotency)
         // This means the post already exists from a previous attempt!
         setCurrentStep(3);
         return;
      }

      if (errorCode === "42703" || errorCode === "PGRST204") { // Undefined Column
         alert(`Database Sync Error: ${errorMessage}. Please ensure the V11 SQL fix was applied and the API cache is refreshed.`);
      } else if (errorCode === "22P02") { // Invalid Enum Value
         alert("Database Sync Error: 'REQUIREMENT' type missing in your enum. Please run the SQL fix.");
      } else if (errorCode === "42501") { // RLS Violation
         alert("Access Error: RLS policy is blocking this post. Ensure you are logged in correctly.");
      } else {
         alert(`Post failed (${errorCode || 'Unknown'}): ${errorMessage}. Please check your connection.`);
      }
    } finally {
      setIsPosting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-10 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl bg-white border border-[#292828]/10 rounded-2xl overflow-hidden shadow-4xl flex flex-col h-full max-h-[85vh] animate-in zoom-in-95 duration-500">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              {currentStep > 0 && currentStep < 3 && (
                 <button onClick={() => setCurrentStep(prev => prev - 1)} className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#292828] transition-all">
                    <ArrowLeft size={18} />
                 </button>
              )}
              <div>
                  <h2 className="text-xl font-black text-[#292828] uppercase tracking-tight leading-none mb-1">
                    {currentStep === 0 ? "Identify Strategy" : 
                     currentStep === 1 ? (formData.title ? "Post now. Get replies fast." : "Start Strategy") : 
                     currentStep === 2 ? "Specify Details" : "Success"}
                  </h2>
                 <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {currentStep === 3 ? "Invite matches to start fast" : "Checkout OS • Anti-Illusion Guarded"}
                 </p>
              </div>
           </div>
           <button onClick={onClose} className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#E53935] hover:bg-red-50 transition-all">
              <X size={20} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10">
           {currentStep === 0 ? (
              <div className="space-y-6 max-w-2xl mx-auto py-10">
                 <SelectionCard type="REQUIREMENT" label="Post a Need" desc="Tell people what you need now" icon={Target} color="bg-[#E53935]" onClick={() => { setPostType("REQUIREMENT"); setCurrentStep(1); }} />
                 <SelectionCard type="PARTNERSHIP" label="Find a Partner" desc="Work with someone long-term" icon={Sparkles} color="bg-[#292828]" onClick={() => { setPostType("PARTNERSHIP"); setCurrentStep(1); }} />
                 <SelectionCard type="MEETUP" label="Host a Meetup" desc="Connect with people nearby" icon={Users} color="bg-emerald-600" onClick={() => { setPostType("MEETUP"); setCurrentStep(1); }} />
              </div>
           ) : currentStep === 1 ? (
              <div className="space-y-10 max-w-2xl mx-auto">
                 {/* Live Preview Card */}
                 {formData.title && (
                    <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                       <div className="flex items-center justify-between mb-3">
                          <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Live Preview</p>
                          <div className="flex items-center gap-1">
                             <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[7px] font-black text-emerald-500 uppercase">Drafting</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 pr-4">
                             <h4 className="text-[15px] font-black text-[#292828] uppercase truncate leading-none mb-1">{formData.title || "Strategy Title"}</h4>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">Strategic Intent Initialized</p>
                          </div>
                          <div className="h-8 px-4 bg-[#E53935] rounded-lg flex items-center text-[8px] font-black text-white uppercase shadow-lg shadow-red-500/10">Action</div>
                       </div>
                    </div>
                 )}

                 <div className="space-y-4">
                    <div>
                       <Input 
                          label={postType === 'REQUIREMENT' ? "Strategy Core" : postType === 'PARTNERSHIP' ? "Target Partner" : "Meetup Topic"} 
                          field="title" 
                          placeholder={postType === 'REQUIREMENT' ? "e.g. Senior Product Designer" : postType === 'PARTNERSHIP' ? "e.g. Full-Stack Agency" : "e.g. Founders Coffee"} 
                          example={postType === 'REQUIREMENT' ? "What is the primary need?" : postType === 'PARTNERSHIP' ? "Who is the ideal partner?" : "What is the event purpose?"}
                          value={formData.title}
                          onChange={updateField}
                       />
                       {titleWarning && (
                          <div className="mt-2 flex items-center gap-2 animate-in fade-in duration-300">
                             <AlertCircle size={10} className="text-amber-500" />
                             <p className="text-[8px] font-black text-amber-500 uppercase">{titleWarning}</p>
                             {showDuplicateOverride && (
                                <button 
                                  onClick={() => handlePost(true)}
                                  className="ml-auto text-[8px] font-black text-[#E53935] uppercase underline decoration-2 underline-offset-2"
                                >
                                   Post anyway
                                </button>
                             )}
                          </div>
                       )}
                    </div>
                    
                    {suggestedTags.length > 0 && (
                       <div className="flex flex-wrap gap-1.5 animate-in fade-in duration-300">
                          {suggestedTags.map(tag => (
                             <button 
                                key={tag} 
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                  "h-7 px-3 rounded-lg text-[8px] font-black uppercase transition-all",
                                  selectedTags.includes(tag) 
                                    ? "bg-[#292828] text-white" 
                                    : "bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#292828] hover:border-[#292828]/20"
                                )}
                             >
                                {tag}
                             </button>
                          ))}
                       </div>
                    )}

                    <Input 
                       label="Strategy Context" 
                       field="content" 
                       type="textarea" 
                       placeholder="Elaborate on your strategy to ensure maximum alignment..." 
                       example="Be specific about requirements"
                       value={formData.content}
                       onChange={updateField}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-3 pt-4">
                    <button 
                      onClick={() => formData.title && setCurrentStep(2)}
                      disabled={!formData.title}
                      className="h-12 bg-slate-50 text-[#292828] border border-slate-100 rounded-xl font-black uppercase text-[9px] hover:bg-white hover:border-[#292828]/20 transition-all disabled:opacity-30"
                    >
                       Add Specifications
                    </button>
                    <button 
                      onClick={() => handlePost()}
                      disabled={!formData.title || isPosting || cooldown > 0}
                      className={cn(
                        "h-12 rounded-xl font-black uppercase text-[9px] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-30",
                        cooldown > 0 ? "bg-slate-200 text-slate-400" : "bg-[#292828] text-white hover:bg-[#E53935]"
                      )}
                    >
                       {isPosting ? "Processing..." : cooldown > 0 ? `${cooldown}s` : "Execute Strategy"} 
                       {cooldown === 0 && <ArrowUpRight size={14} />}
                    </button>
                 </div>
                 {cooldown > 0 && (
                    <p className="text-center mt-4 text-[9px] font-bold text-amber-500 uppercase tracking-widest">Posted. Try again in {cooldown}s</p>
                 )}
                 <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-6">Fastest way to get replies</p>
              </div>
           ) : currentStep === 2 ? (
              <div className="space-y-10 max-w-2xl mx-auto">
                 {/* Type Specific Fields */}
                 {postType === "REQUIREMENT" && (
                    <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <Input label="Budget" field="budget" placeholder="e.g. ₹50k" example="Optional" value={formData.budget} onChange={updateField} />
                       <Input label="Urgency" field="urgency" type="select" options={["Low", "Medium", "High"]} value={formData.urgency} onChange={updateField} />
                       <div className="col-span-2">
                          <Input label="Skills Needed" field="skills" placeholder="Design, Sales, Coding" example="Comma separated" value={formData.skills} onChange={updateField} />
                       </div>
                       <Input label="Deadline" field="deadline" type="date" value={formData.deadline} onChange={updateField} />
                    </div>
                 )}

                 {postType === "PARTNERSHIP" && (
                    <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <Input label="Type" field="partnershipType" type="select" options={["Agency", "Vendor", "Co-founder"]} value={formData.partnershipType} onChange={updateField} />
                       <Input label="Industry" field="industry" placeholder="e.g. Fintech, Retail" value={formData.industry} onChange={updateField} />
                       <Input label="Commitment" field="commitment" type="select" options={["Low", "Medium", "High"]} value={formData.commitment} onChange={updateField} />
                    </div>
                 )}

                 {postType === "MEETUP" && (
                    <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <Input label="Mode" field="mode" type="select" options={["Online", "Offline"]} value={formData.mode} onChange={updateField} />
                       <Input label="Price" field="price" type="select" options={["Free", "Paid"]} value={formData.price} onChange={updateField} />
                       <div className="col-span-2">
                          <Input label="Location" field="location" placeholder="City or Link" value={formData.location} onChange={updateField} />
                       </div>
                       <Input label="When" field="dateTime" type="text" placeholder="e.g. Friday 6 PM" value={formData.dateTime} onChange={updateField} />
                    </div>
                 )}

                 <div className="pt-4">
                    <button 
                      onClick={() => handlePost()}
                      disabled={isPosting || cooldown > 0}
                      className={cn(
                        "w-full h-16 rounded-xl font-black uppercase text-[10px] tracking-widest text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4",
                        cooldown > 0 ? "bg-slate-300" : (postType === "MEETUP" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#292828] hover:bg-[#E53935]"),
                        isPosting && "opacity-50 cursor-wait"
                      )}
                    >
                       {isPosting ? "Processing Strategy..." : cooldown > 0 ? `Try again in ${cooldown}s` : "Finalize Strategy"}
                       {!isPosting && cooldown === 0 && <Zap size={18} fill="currentColor" />}
                    </button>
                 </div>
              </div>
           ) : (
              <div className="max-w-md mx-auto text-center py-10 animate-in zoom-in-95 duration-500">
                 <div className="h-20 w-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
                    <CheckCircle2 size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-[#292828] uppercase tracking-tight mb-2">Strategy Live</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Optimizing for high-intent matches</p>
                 
                 <div className="space-y-3">
                    <button onClick={onClose} className="w-full h-14 bg-[#292828] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#E53935] transition-all flex items-center justify-center gap-3 shadow-lg">
                       Invite Partners <Zap size={16} fill="currentColor" />
                    </button>
                    <button onClick={onClose} className="w-full h-12 bg-white text-slate-400 border border-slate-100 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                       Review Post <Eye size={16} />
                    </button>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
