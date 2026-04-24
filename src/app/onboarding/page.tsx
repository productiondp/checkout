"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Zap, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  X,
  Sparkles,
  Rocket,
  Building,
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Camera,
  ChevronLeft,
  Loader2,
  ChevronDown,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/utils/analytics";

type Role = 'business' | 'msme' | 'freelancer' | 'student';

type OnboardingState = {
  name: string;
  role: Role;
  company_name?: string;
  business_type?: string;
  services: string[];
  skills: string[];
  experience_years: number;
  experience_months: number;
  intent_tags: string[];
  phone?: string;
  avatar_url?: string;
  location?: string;
};

export default function OnboardingPage() {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [onboardingData, setOnboardingData] = useState<OnboardingState>({
    name: user?.full_name || "",
    role: (user?.role?.toLowerCase() as Role) || "business",
    services: [],
    skills: [],
    experience_years: 0,
    experience_months: 0,
    intent_tags: [],
    location: user?.location || "Trivandrum",
    avatar_url: user?.avatar_url || "",
    phone: ""
  });

  useEffect(() => {
    if (user) analytics.trackScreen('ONBOARDING', user.id);
  }, [user]);

  const getProfilePayload = (isFinal = false) => {
    return {
      full_name: onboardingData.name,
      role: onboardingData.role.toUpperCase(),
      avatar_url: onboardingData.avatar_url,
      location: onboardingData.location,
      phone: onboardingData.phone,
      skills: onboardingData.skills,
      intent_tags: onboardingData.intent_tags, // Using intent_tags directly
      domains: onboardingData.intent_tags,    // Backward compatibility
      business_type: onboardingData.business_type,
      company_name: onboardingData.company_name,
      experience_years: onboardingData.experience_years,
      experience_months: onboardingData.experience_months,
      services: onboardingData.services,
      onboarding_completed: isFinal
    };
  };

  const saveProgress = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    
    const { error: saveError } = await supabase
      .from('profiles')
      .update(getProfilePayload())
      .eq('id', user.id);

    if (saveError) {
      console.error("Auto-save error:", saveError);
      // Fallback: try without metadata if it fails
    }
    setIsSaving(false);
  };

  const updateData = (updates: Partial<OnboardingState>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
    setError(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) {
        if (uploadError.message.includes("bucket not found")) {
          setError("CRITICAL: 'avatars' storage bucket not found. Create it in Supabase.");
        } else {
          setError(`Upload Error: ${uploadError.message}`);
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      updateData({ avatar_url: publicUrl });
    } catch (err: any) {
      console.error("Upload error:", err);
      if (!error) setError("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = async () => {
    if (step === 1 && (!onboardingData.name || !onboardingData.role)) {
      setError("Name and Role are required.");
      return;
    }
    if (step === 2 && (onboardingData.role === 'business' || onboardingData.role === 'msme')) {
      if (!onboardingData.company_name || !onboardingData.business_type) {
        setError("Company details are required.");
        return;
      }
    }
    if (step === 3 && onboardingData.intent_tags.length === 0) {
      setError("Select at least one intent.");
      return;
    }

    await saveProgress();
    setStep(prev => prev + 1);
  };

  const completeOnboarding = async () => {
    if (!onboardingData.intent_tags?.length) return;
    
    setIsSubmitting(true);
    const { error: finalError } = await supabase
      .from('profiles')
      .update(getProfilePayload(true))
      .eq('id', user?.id);

    if (!finalError) {
      updateProfile({ 
        full_name: onboardingData.name,
        role: onboardingData.role.toUpperCase() as any,
        avatar_url: onboardingData.avatar_url,
        location: onboardingData.location,
        expertise: onboardingData.skills,
        intents: onboardingData.intent_tags,
        onboarding_completed: true 
      });
      analytics.track('ONBOARDING_COMPLETED', user?.id, { role: onboardingData.role });
      router.push("/home");
    } else {
      console.error("Final sync error:", finalError);
      setError(`Finalize Failed: ${finalError.message}`);
    }
    setIsSubmitting(false);
  };

  const PRESETS = {
    BUSINESS_TYPES: ["Agency", "Manufacturer", "Retail", "Service", "Startup", "Other"],
    SERVICES: ["Web Dev", "Marketing", "Legal", "Design", "Logistics", "Sales"],
    SKILLS: ["React", "Python", "UI/UX", "Copywriting", "SEO", "Project MGMT"],
    INTENTS: ["Hiring", "Finding Clients", "Partnerships", "Networking", "Learning", "Investors"]
  };

  return (
    <div className="min-h-[100dvh] bg-[#292828] flex items-center justify-center p-4 lg:p-10 relative overflow-hidden font-sans selection:bg-[#E53935]/20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#292828] via-[#1a1a1a] to-[#E53935]/5" />
      <div className="absolute top-[-20%] right-[-20%] h-[800px] w-[800px] bg-[#E53935]/5 blur-[200px] rounded-full animate-pulse" />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[3.5rem] lg:rounded-[4.5rem] shadow-4xl overflow-hidden flex flex-col h-full max-h-[95vh] border border-[#292828]/5">
        
        <div className="h-2.5 bg-slate-50 w-full shrink-0 flex gap-1 p-1">
           {[1, 2, 3, 4].map(s => (
             <div key={s} className={cn("h-full flex-1 rounded-full transition-all duration-1000 ease-out", s <= step ? "bg-[#E53935]" : "bg-slate-100")} />
           ))}
        </div>

        <div className="px-12 lg:px-20 pt-16 pb-8 flex items-center justify-between shrink-0">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-[#E53935] animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#292828]/30 italic">Step {step}</span>
              </div>
              <h1 className="text-5xl font-black uppercase tracking-tighter text-[#292828] leading-none">
                 {step === 1 && "Basics"}
                 {step === 2 && "Role"}
                 {step === 3 && "Experience"}
                 {step === 4 && "Final Step"}
              </h1>
           </div>
           {(isSaving || isUploading) && (
             <div className="flex items-center gap-3 px-5 py-2.5 bg-[#292828]/5 rounded-2xl animate-in fade-in zoom-in">
                <Loader2 className="animate-spin text-[#E53935]" size={16} />
                <span className="text-[9px] font-black text-[#292828]/40 uppercase tracking-widest">{isUploading ? "Uploading" : "Auto Saving"}</span>
             </div>
           )}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-12 lg:px-20 py-8">
           <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="space-y-12"
              >
                 {step === 1 && (
                    <div className="space-y-10">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Your Name</p>
                          <input 
                            type="text" 
                            value={onboardingData.name}
                            onChange={e => updateData({ name: e.target.value })}
                            placeholder="FULL NAME"
                            className="w-full h-24 bg-slate-50 border-2 border-slate-100 rounded-[2.25rem] px-12 text-2xl font-black text-[#292828] outline-none focus:border-[#E53935]/20 focus:bg-white transition-all uppercase placeholder:text-slate-200"
                          />
                       </div>
                       
                       <div className="space-y-4">
                          <div className="flex items-center justify-between px-1">
                             <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Your Role</p>
                             <span className="text-[8px] font-bold text-slate-300 uppercase italic">Choose how you primarily operate</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             {(['business', 'msme', 'freelancer', 'student'] as Role[]).map(r => (
                               <button
                                 key={r}
                                 onClick={() => updateData({ role: r })}
                                 className={cn(
                                   "h-28 rounded-[2.25rem] border-2 transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden",
                                   onboardingData.role === r ? "bg-[#292828] border-black text-white shadow-2xl scale-[1.02]" : "bg-white border-slate-100 text-slate-300 hover:border-[#292828]/20"
                                 )}
                               >
                                  {r === 'business' && <Building size={24} />}
                                  {r === 'msme' && <Zap size={24} />}
                                  {r === 'freelancer' && <User size={24} />}
                                  {r === 'student' && <GraduationCap size={24} />}
                                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{r}</span>
                                  {onboardingData.role === r && <div className="absolute top-4 right-6 h-2 w-2 rounded-full bg-[#E53935]" />}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {step === 2 && (
                    <div className="space-y-10">
                       {(onboardingData.role === 'business' || onboardingData.role === 'msme') ? (
                          <>
                             <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Company Name</p>
                                <input 
                                  type="text" 
                                  value={onboardingData.company_name}
                                  onChange={e => updateData({ company_name: e.target.value })}
                                  placeholder="COMPANY NAME"
                                  className="w-full h-24 bg-slate-50 border-2 border-slate-100 rounded-[2.25rem] px-12 text-2xl font-black text-[#292828] outline-none focus:border-[#E53935]/20 uppercase placeholder:text-slate-200"
                                />
                             </div>
                             <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Company Type</p>
                                <div className="flex flex-wrap gap-2.5">
                                   {PRESETS.BUSINESS_TYPES.map(bt => (
                                     <button key={bt} onClick={() => updateData({ business_type: bt })} className={cn("px-7 py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all", onboardingData.business_type === bt ? "bg-[#292828] text-white border-black" : "bg-white text-slate-400 hover:border-[#292828]/10")}>{bt}</button>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Skills</p>
                                <div className="flex flex-wrap gap-3">
                                   {PRESETS.SKILLS.map(s => (
                                     <button key={s} onClick={() => { const current = onboardingData.skills; updateData({ skills: current.includes(s) ? current.filter(x => x !== s) : [...current, s] }); }} className={cn("px-8 py-5 rounded-[1.5rem] border-2 text-[11px] font-black uppercase tracking-widest transition-all", onboardingData.skills.includes(s) ? "bg-[#E53935] text-white border-[#E53935] shadow-xl" : "bg-white text-slate-400 hover:border-[#292828]/10")}>{s}</button>
                                   ))}
                                </div>
                             </div>
                          </>
                       ) : (
                          <div className="space-y-6">
                             <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Skills</p>
                             <div className="flex flex-wrap gap-3">
                                {PRESETS.SKILLS.map(s => (
                                  <button key={s} onClick={() => { const current = onboardingData.skills; updateData({ skills: current.includes(s) ? current.filter(x => x !== s) : [...current, s] }); }} className={cn("px-8 py-5 rounded-[1.5rem] border-2 text-[11px] font-black uppercase tracking-widest transition-all", onboardingData.skills.includes(s) ? "bg-[#E53935] text-white border-[#E53935] shadow-xl" : "bg-white text-slate-400 hover:border-[#292828]/10")}>{s}</button>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                 )}

                 {step === 3 && (
                    <div className="space-y-12">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                             <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Experience (Years)</p>
                             <div className="relative">
                                <select value={onboardingData.experience_years} onChange={e => updateData({ experience_years: parseInt(e.target.value) })} className="w-full h-20 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 text-lg font-black text-[#292828] outline-none appearance-none focus:border-[#E53935]/20">
                                   {[...Array(21)].map((_, i) => <option key={i} value={i}>{i} YEARS</option>)}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                             </div>
                          </div>
                          <div className="space-y-4">
                             <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Months</p>
                             <div className="relative">
                                <select value={onboardingData.experience_months} onChange={e => updateData({ experience_months: parseInt(e.target.value) })} className="w-full h-20 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 text-lg font-black text-[#292828] outline-none appearance-none focus:border-[#E53935]/20">
                                   {[...Array(12)].map((_, i) => <option key={i} value={i}>{i} MONTHS</option>)}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="flex items-center justify-between">
                             <div>
                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Your Goals (MAX 4)</p>
                                <p className="text-[8px] font-bold text-slate-300 uppercase italic mt-1">These help us match you with the right people</p>
                             </div>
                             <span className={cn("text-[10px] font-black", onboardingData.intent_tags.length >= 4 ? "text-[#E53935]" : "text-slate-200")}>{onboardingData.intent_tags.length}/4</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                             {PRESETS.INTENTS.map(intent => (
                               <button key={intent} disabled={!onboardingData.intent_tags.includes(intent) && onboardingData.intent_tags.length >= 4} onClick={() => { const current = onboardingData.intent_tags; updateData({ intent_tags: current.includes(intent) ? current.filter(x => x !== intent) : [...current, intent] }); }} className={cn("h-20 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all", onboardingData.intent_tags.includes(intent) ? "bg-[#292828] text-white border-black shadow-xl" : "bg-white text-slate-400 hover:border-[#292828]/10 disabled:opacity-20")}>{intent}</button>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {step === 4 && (
                    <div className="space-y-12">
                       <div className="flex justify-center">
                          <div className="relative group">
                             <div className="h-44 w-44 rounded-[4rem] overflow-hidden bg-slate-50 border-4 border-white shadow-2xl group-hover:border-[#E53935]/20 transition-all duration-500 ring-8 ring-slate-50/50 relative">
                                {isUploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10"><Loader2 className="animate-spin text-white" size={32} /></div>}
                                <img src={onboardingData.avatar_url || `https://i.pravatar.cc/150?u=${user?.id}`} alt="Photo" className="w-full h-full object-cover" />
                             </div>
                             <button 
                               onClick={() => fileInputRef.current?.click()}
                               disabled={isUploading}
                               className="absolute -bottom-2 -right-2 h-16 w-16 bg-[#292828] text-white rounded-3xl flex items-center justify-center shadow-4xl hover:bg-[#E53935] hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                             >
                                <Camera size={24} />
                             </button>
                             <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="space-y-4">
                             <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Phone Number</p>
                             <div className="relative">
                                <Phone size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-200" />
                                <input type="tel" value={onboardingData.phone} onChange={e => updateData({ phone: e.target.value })} placeholder="+91 9XX XXXXXXX" className="w-full h-20 bg-slate-50 border-2 border-slate-100 rounded-[2rem] pl-20 pr-8 text-lg font-black text-[#292828] outline-none focus:border-[#E53935]/20" />
                             </div>
                          </div>
                          <div className="space-y-4">
                             <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Location</p>
                             <div className="relative">
                                <MapPin size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-[#E53935]" />
                                <input type="text" value={onboardingData.location} onChange={e => updateData({ location: e.target.value })} placeholder="BANGALORE, KA" className="w-full h-20 bg-slate-50 border-2 border-slate-100 rounded-[2rem] pl-20 pr-8 text-lg font-black text-[#292828] outline-none focus:border-[#E53935]/20 uppercase" />
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
              </motion.div>
           </AnimatePresence>
        </div>

        <div className="px-12 lg:px-20 py-12 bg-slate-50/30 border-t border-slate-100 flex items-center gap-6 shrink-0 relative">
           {error && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-8 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl animate-in slide-in-from-bottom-2">{error}</div>}
           {step > 1 && <button onClick={() => setStep(step - 1)} className="h-24 w-24 bg-white border-2 border-slate-100 rounded-[2.25rem] flex items-center justify-center text-[#292828]/20 hover:text-[#292828] hover:border-[#292828]/10 hover:shadow-xl transition-all active:scale-95"><ChevronLeft size={28} /></button>}
           <button onClick={step === 4 ? completeOnboarding : nextStep} disabled={isSubmitting || isUploading} className="flex-1 h-24 bg-[#292828] text-white rounded-[2.5rem] text-sm font-black uppercase tracking-[0.4em] hover:bg-[#E53935] shadow-4xl active:scale-[0.98] transition-all flex items-center justify-center gap-6 group disabled:opacity-50">{isSubmitting ? "Finishing..." : (step === 4 ? "Enter Checkout" : "Continue")}{!isSubmitting && <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform duration-500" />}</button>
        </div>

        <div className="px-12 py-6 border-t border-slate-50 flex items-center justify-between bg-white shrink-0">
           <div className="flex items-center gap-3"><ShieldCheck className="text-emerald-500" size={16} /><span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Secure connection active</span></div>
           <div className="flex items-center gap-1">{[1,2,3,4].map(i => (<div key={i} className={cn("h-1 w-4 rounded-full transition-all", i === step ? "bg-[#E53935] w-8" : "bg-slate-100")} />))}</div>
        </div>
      </div>
    </div>
  );
}
