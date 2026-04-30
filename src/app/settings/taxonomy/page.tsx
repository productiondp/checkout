"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Target,
  Briefcase
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { INDUSTRY_DATA, getIndustryById, EXPERIENCE_LEVELS } from "@/utils/industry-data";
import { motion, AnimatePresence } from "framer-motion";

export default function TaxonomySettings() {
  const { user: authUser } = useAuth();
  const [industry, setIndustry] = useState<string>("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [intent, setIntent] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (authUser) {
      setIndustry(authUser.industry || "");
      setFocusAreas(authUser.metadata?.focus_areas || []);
      setIntent(authUser.metadata?.intent || "");
      setExperienceLevel(authUser.metadata?.experience_level || "");
      setSpecializations(authUser.metadata?.specializations || []);
    }
  }, [authUser]);

  const handleSave = async () => {
    if (!industry || focusAreas.length === 0 || !intent || !experienceLevel) {
      setMessage({ type: 'error', text: "Please select industry, focus, experience, and intent." });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          industry,
          metadata: {
            ...authUser?.metadata,
            focus_areas: focusAreas,
            intent: intent,
            experience_level: experienceLevel,
            specializations: specializations
          }
        })
        .eq('id', authUser?.id);

      if (error) throw error;
      setMessage({ type: 'success', text: "Professional identity updated successfully." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "Failed to update profile." });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-40">
      <div className="max-w-[800px] mx-auto px-6 pt-16 lg:pt-24">
        
        <Link href="/settings" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-[#292828]/40 hover:text-[#E53935] transition-all group mb-12">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Settings
        </Link>
        
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-[#292828] uppercase ">Identity Setup</h1>
          <p className="text-[13px] font-bold text-[#666666] mt-2 italic uppercase tracking-wider">V1.80 Precision Qualification System</p>
        </div>

        <div className="space-y-12">
          {/* EXPERIENCE LEVEL */}
          <div className="bg-white rounded-[32px] border border-[#292828]/5 p-10 shadow-premium">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 bg-black text-white rounded-2xl flex items-center justify-center">
                   <Target size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-black text-[#292828] uppercase">Experience Level</h2>
                   <p className="text-[11px] font-bold text-slate-400 uppercase">Qualify your seniority (Step 1)</p>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => setExperienceLevel(level)}
                    className={cn(
                      "h-14 px-4 rounded-2xl flex items-center justify-center transition-all border font-black uppercase text-[10px]",
                      experienceLevel === level 
                        ? "bg-[#292828] text-white border-[#292828] shadow-xl scale-[1.05]" 
                        : "bg-slate-50 text-slate-400 border-transparent hover:border-black/10"
                    )}
                  >
                    {level}
                  </button>
                ))}
             </div>
          </div>
          {/* INDUSTRY SELECTION */}
          <div className="bg-white rounded-[32px] border border-[#292828]/5 p-10 shadow-premium">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center">
                   <Briefcase size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-black text-[#292828] uppercase">Select Industry</h2>
                   <p className="text-[11px] font-bold text-slate-400 uppercase">This defines your primary network hub</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {INDUSTRY_DATA.map(i => (
                  <button
                    key={i.id}
                    onClick={() => { setIndustry(i.id); setFocusAreas([]); }}
                    className={cn(
                      "h-16 px-6 rounded-2xl flex items-center justify-between transition-all border font-bold uppercase text-[12px]",
                      industry === i.id 
                        ? "bg-[#292828] text-white border-[#292828] shadow-2xl scale-[1.02]" 
                        : "bg-slate-50 text-slate-400 border-transparent hover:border-black/10"
                    )}
                  >
                    {i.label}
                    {industry === i.id && <CheckCircle2 size={18} className="text-amber-500" />}
                  </button>
                ))}
             </div>
          </div>

          {/* FOCUS AREAS SELECTION */}
          <AnimatePresence>
            {industry && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-[#292828]/5 p-10 shadow-premium"
              >
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                       <Target size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-[#292828] uppercase">Select Focus Areas</h2>
                       <p className="text-[11px] font-bold text-slate-400 uppercase">Choose up to 2 areas you specialize in</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                   {getIndustryById(industry)?.focusAreas.map(area => (
                     <button
                       key={area}
                       onClick={() => {
                          if (focusAreas.includes(area)) {
                            setFocusAreas(prev => prev.filter(a => a !== area));
                          } else if (focusAreas.length < 3) {
                            setFocusAreas(prev => [...prev, area]);
                          }
                       }}
                       className={cn(
                         "px-6 h-14 rounded-2xl flex items-center gap-3 transition-all border font-bold uppercase text-[11px]",
                         focusAreas.includes(area)
                           ? "bg-[#292828] text-white border-[#292828] shadow-xl"
                           : "bg-slate-50 text-slate-400 border-transparent hover:border-black/10"
                       )}
                     >
                        {area}
                        {focusAreas.includes(area) && <Sparkles size={14} className="text-amber-400" />}
                     </button>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SPECIALIZATION TAGS */}
          <AnimatePresence>
            {focusAreas.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] border border-indigo-600/10 p-10 shadow-premium bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white"
              >
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                       <Sparkles size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-[#292828] uppercase">Specialization</h2>
                       <p className="text-[11px] font-bold text-slate-400 uppercase">Add depth to your focus areas (Optional)</p>
                    </div>
                </div>

                <div className="space-y-6">
                  {focusAreas.map(focus => {
                    const specs = getIndustryById(industry)?.specializations?.[focus];
                    if (!specs) return null;
                    return (
                      <div key={focus} className="space-y-3">
                        <p className="text-[10px] font-black uppercase text-indigo-600/60 ml-2">{focus}</p>
                        <div className="flex flex-wrap gap-2">
                          {specs.map(spec => (
                            <button
                              key={spec}
                              onClick={() => {
                                if (specializations.includes(spec)) {
                                  setSpecializations(prev => prev.filter(s => s !== spec));
                                } else if (specializations.length < focusAreas.length * 2) {
                                  setSpecializations(prev => [...prev, spec]);
                                }
                              }}
                              className={cn(
                                "px-5 h-12 rounded-xl flex items-center transition-all border font-bold uppercase text-[10px]",
                                specializations.includes(spec)
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                                  : "bg-white text-indigo-400 border-indigo-600/10 hover:border-indigo-600/30"
                              )}
                            >
                              {spec}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* INTENT SELECTION */}
          <div className="bg-white rounded-[32px] border border-[#292828]/5 p-10 shadow-premium">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                   <Target size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-black text-[#292828] uppercase">Select Intent</h2>
                   <p className="text-[11px] font-bold text-slate-400 uppercase">What is your primary goal?</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'hire', label: 'Hire Professionals' },
                  { id: 'collaborate', label: 'Collaborate' },
                  { id: 'find_work', label: 'Find Work' }
                ].map(i => (
                  <button
                    key={i.id}
                    onClick={() => setIntent(i.id)}
                    className={cn(
                      "h-16 px-6 rounded-2xl flex items-center justify-between transition-all border font-bold uppercase text-[10px]",
                      intent === i.id 
                        ? "bg-[#292828] text-white border-[#292828] shadow-xl scale-[1.02]" 
                        : "bg-slate-50 text-slate-400 border-transparent hover:border-black/10"
                    )}
                  >
                    {i.label}
                    {intent === i.id && <CheckCircle2 size={16} className="text-emerald-400" />}
                  </button>
                ))}
             </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-6">
            {message && (
              <div className={cn(
                "p-4 rounded-xl text-[12px] font-black uppercase text-center animate-in fade-in slide-in-from-bottom-2",
                message.type === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {message.text}
              </div>
            )}
            
            <button 
              onClick={handleSave}
              disabled={isUpdating || !industry || focusAreas.length === 0}
              className="w-full h-20 bg-[#E53935] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
            >
              {isUpdating ? "Syncing Identity..." : "Save Professional Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export const runtime = "edge";
