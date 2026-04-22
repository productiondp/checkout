"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  X, Plus, Zap, Briefcase, Target, Calendar, 
  MapPin, Clock, Users,
  CheckCircle2, Sparkles,
  Search, TrendingUp, ArrowLeft,
  ArrowUpRight,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSuccess?: (post: any) => void;
  initialFormType?: FormType;
  editPost?: any;
}

type FormType = "Update" | "Lead" | "Hiring" | "Partner" | "Meetup";

const DOMAINS = ["FMCG", "Marketing", "Finance", "Operations", "Legal", "Tech", "Food"];
const STAGES = ["Idea", "Early", "Growth", "Scale"];

export default function PostModal({ isOpen, onClose, onPostSuccess, initialFormType, editPost }: PostModalProps) {
  const [formType, setFormType] = useState<FormType>("Lead");
  const [isPosting, setIsPosting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [advisors, setAdvisors] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchAdvisors() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'ADVISOR')
        .limit(4);
      
      if (data) {
        setAdvisors(data.map(adv => ({
          ...adv,
          name: adv.full_name,
          avatar: adv.avatar_url || `https://i.pravatar.cc/150?u=${adv.id}`,
          checkoutScore: adv.match_score || 95,
          checkoutBadge: 'Gold',
          checkoutRank: 'Elite'
        })));
      }
    }
    fetchAdvisors();
  }, []);
      if (editPost) {
        setFormType(editPost.type.charAt(0).toUpperCase() + editPost.type.slice(1).toLowerCase() as FormType);
        setFormData({
          leadTitle: editPost.title || "",
          leadProblem: editPost.content || "",
          leadBudget: editPost.budget || "",
          hiringRole: editPost.title || "",
          hiringTasks: editPost.content || "",
          meetupTitle: editPost.title || "",
          meetupDescription: editPost.content || "",
          updateContent: editPost.content || "",
        });
      } else if (initialFormType) {
        setFormType(initialFormType);
      }
      setCurrentStep(1);
    }
  }, [isOpen, initialFormType, editPost]);

  // Form State
  const [formData, setFormData] = useState<any>({
    leadTitle: "",
    leadProblem: "",
    leadReqType: "Service",
    leadBudget: "",
    leadDeadline: "",
    
    hiringRole: "",
    hiringTasks: "",
    hiringSkills: "",
    hiringExp: "Experienced",
    hiringEngagement: "Full-time",
    hiringDuration: "",
    hiringComp: "",

    partnerType: "Distributor",
    partnerContext: "",
    partnerOffer: "",
    partnerNeed: "",
    partnerTimeline: "Immediate",

    meetupTitle: "",
    meetupDescription: "",
    meetupStuck: "",
    meetupAttempted: "",
    meetupDomain: "Marketing",
    meetupStage: "Growth",
    meetupUrgency: "Soon",
    selectedAdvisor: null,
    meetupPayment: "Free",
    meetupTime: "",
    advisorFee: 0,

    updateContent: "",
    updateNeed: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const checkoutScore = useMemo(() => {
    let score = 50; // Radical starting point
    // Specificity Multipliers
    if (formData.meetupTitle.length > 10) score += 10;
    if (formData.meetupDescription.length > 30) score += 15;
    if (formData.meetupStuck.length > 20) score += 10;
    if (formData.meetupAttempted.length > 20) score += 15;
    
    // Logic for other types
    if (formType === "Lead" && formData.leadTitle.length > 5) score += 10;
    if (formType === "Hiring" && formData.hiringRole.length > 5) score += 10;
    
    return Math.min(100, score);
  }, [formData, formType]);

  const supabase = createClient();

  const handlePost = async () => {
    setIsPosting(true);
    
    try {
      // 1. Get the first profile or create a default one if none exists
      let authorId = editPost?.author_id;

      if (!authorId) {
        let { data: profile } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
        
        if (!profile) {
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert([{ 
              full_name: 'Community Elite', 
              role: 'PROFESSIONAL', 
              location: 'Trivandrum',
              bio: 'Automated founding member profile.'
            }])
            .select()
            .single();
          
          if (profileError) throw profileError;
          profile = newProfile;
        }
        authorId = profile.id;
      }

      const postData = {
        author_id: authorId,
        type: formType.toUpperCase(),
        title: formData.leadTitle || formData.hiringRole || formData.meetupTitle || (formData.updateContent ? formData.updateContent.substring(0, 30) : "Update"),
        content: formData.leadProblem || formData.hiringTasks || formData.meetupDescription || formData.updateContent,
        location: "Trivandrum",
        match_score: checkoutScore,
        budget: formData.leadBudget,
      };

      let result;
      if (editPost) {
        result = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editPost.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      onPostSuccess?.(result.data);
      onClose();
    } catch (err) {
      console.error("Post failed:", err);
      alert("Failed to post. Check console for error details.");
    } finally {
      setIsPosting(false);
    }
  };

  if (!isOpen) return null;

  const input = (label: string, field: string, placeholder: string, type: "text" | "textarea" | "select" | "date" = "text", options: any[] = []) => (
    <div className="group relative">
      <div className={cn(
        "bg-[#292828]/[0.03] border border-[#292828]/5 rounded-[1.25rem] transition-all duration-300 focus-within:bg-white focus-within:border-[#E53935]/30 focus-within:shadow-lg focus-within:shadow-[#E53935]/5",
        type === "textarea" ? "min-h-[120px]" : "h-16"
      )}>
        <div className="px-5 pt-2.5">
           <label className="text-[7px] font-bold uppercase text-[#292828]/30 tracking-widest block mb-0.5">{label}</label>
           {type === "textarea" ? (
             <textarea 
               value={formData[field]} 
               onChange={e => updateField(field, e.target.value)} 
               placeholder={placeholder} 
               className="w-full bg-transparent text-[13px] font-bold outline-none resize-none uppercase text-[#292828] placeholder:opacity-20 h-[80px]" 
             />
           ) : type === "select" ? (
             <div className="relative">
               <select value={formData[field]} onChange={e => updateField(field, e.target.value)} className="w-full bg-transparent text-[13px] font-bold outline-none appearance-none cursor-pointer uppercase text-[#292828]">
                 {options.map(o => <option key={o} value={o} className="bg-white">{o}</option>)}
               </select>
               <ChevronDown className="absolute right-0 top-0 text-[#292828]/20" size={14} />
             </div>
           ) : (
             <input type={type} value={formData[field]} onChange={e => updateField(field, e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-[13px] font-bold outline-none uppercase text-[#292828] placeholder:opacity-20" />
           )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-10 bg-[#292828]/40 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl bg-white border border-[#292828]/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-full max-h-[90vh] animate-in zoom-in-95 duration-500">
        
        {/* HEADER - COMPACT */}
        <div className="px-8 py-5 border-b border-[#292828]/5 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-[#E53935] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#E53935]/10">
                <Plus size={20} strokeWidth={3} />
             </div>
             <div>
                <h2 className="text-[13px] font-bold text-[#292828] uppercase tracking-wider leading-none mb-1">Create a Post</h2>
                <p className="text-[8px] font-bold text-[#292828]/30 uppercase">Add what you need • Local City</p>
             </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 bg-[#292828]/5 rounded-lg flex items-center justify-center text-[#292828]/30 hover:text-[#292828] transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-10 space-y-10">
             
             {/* TYPE SELECTOR - SLIM */}
             <div className="flex items-center gap-1.5 p-1.5 bg-[#292828]/5 rounded-[1.25rem]">
                {[
                  { label: "Update", icon: Zap, id: "Update" },
                  { label: "Lead", icon: Target, id: "Lead" },
                  { label: "Hiring", icon: Briefcase, id: "Hiring" },
                  { label: "Partner", icon: Sparkles, id: "Partner" },
                  { label: "Meetups", icon: Users, id: "Meetup" }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setFormType(item.id as FormType); setCurrentStep(1); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl transition-all font-bold uppercase text-[9px] tracking-widest",
                      formType === item.id 
                        ? ((item.id === "Hiring" || item.id === "Meetup") ? "bg-emerald-600 text-white shadow-md" : "bg-[#292828] text-white shadow-md")
                        : "text-[#292828]/30 hover:bg-[#292828]/5"
                    )}
                  >
                    <item.icon size={14} />
                    <span className="hidden md:block">{item.label}</span>
                  </button>
                ))}
             </div>

             {/* DYNAMIC FORMS */}
             <div className="animate-in slide-in-from-bottom-4 duration-500">
                {formType === "Update" && (
                   <div className="space-y-6">
                      {input("What's happening?", "updateContent", "Status / Need / Availability (Max 3 lines)", "textarea")}
                      {input("Desired Direction", "updateNeed", "What do you want?")}
                   </div>
                )}

                 {formType === "Lead" && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">{input("Exact Requirement", "leadTitle", "Title - One line focus")}</div>
                      <div className="md:col-span-2">{input("Problem / Expected Output", "leadProblem", "Describe what should be solved...", "textarea")}</div>
                      {input("Type", "leadReqType", "", "select", ["Service", "Product", "Freelancer"])}
                      {input("Budget Range", "leadBudget", "₹20K - 40K")}
                      <div className="md:col-span-2">{input("Required Deadline", "leadDeadline", "e.g. 5 days")}</div>
                   </div>
                 )}

                 {formType === "Hiring" && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {input("Role Title", "hiringRole", "e.g. UI/UX Intern")}
                      {input("Experience", "hiringExp", "", "select", ["Student", "Fresher", "Experienced"])}
                      <div className="md:col-span-2">{input("Key Responsibilities", "hiringTasks", "List 2-3 main points...", "textarea")}</div>
                      <div className="md:col-span-2">{input("Top Skills Required", "hiringSkills", "e.g. Figma, React")}</div>
                      {input("Contract Type", "hiringEngagement", "", "select", ["Intern", "Full-time", "Freelance"])}
                      {input("Duration", "hiringDuration", "e.g. 2 Months")}
                      <div className="md:col-span-2">{input("Compensation (Optional)", "hiringComp", "Boosts match score")}</div>
                   </div>
                 )}

                 {formType === "Partner" && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">{input("Partnership Type", "partnerType", "", "select", ["Vendor", "Agency", "Distributor", "Co-founder"])}</div>
                      <div className="md:col-span-2">{input("About Your Context", "partnerContext", "Brief business context (1-2 lines)", "textarea")}</div>
                      {input("We Offer (Value)", "partnerOffer", "What do you bring?", "textarea")}
                      {input("We Need (Expectation)", "partnerNeed", "What do you expect?", "textarea")}
                      <div className="md:col-span-2">{input("Partnership Timeline", "partnerTimeline", "", "select", ["Immediate", "Long-term"])}</div>
                   </div>
                 )}

                {formType === "Meetup" && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-3 gap-1">
                        {[1,2,3].map(s => (
                           <div key={s} className={cn("h-1.5 rounded-full", s <= currentStep ? "bg-emerald-600" : "bg-slate-100")} />
                        ))}
                     </div>
                     
                     {currentStep === 1 && (
                        <div className="space-y-6">
                           <div className="space-y-4">
                              {input("The Problem (Title)", "meetupTitle", "e.g. Sales dropped 40% in Q3", "text")}
                              {input("Current Situation", "meetupDescription", "What is happening right now?", "textarea")}
                              <div className="grid grid-cols-2 gap-4">
                                 {input("Where are you stuck?", "meetupStuck", "Specify the bottleneck...")}
                                 {input("What have you tried?", "meetupAttempted", "e.g. Meta Ads, Cold Calling")}
                              </div>
                           </div>
                           
                           {/* AI CLARITY RADAR */}
                           <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <Sparkles size={16} className="text-emerald-600" />
                                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Problem Clarity Score: {checkoutScore}%</span>
                              </div>
                              {checkoutScore < 70 && (
                                 <span className="text-[8px] font-bold text-emerald-400 uppercase">Pro Tip: Add more detail to attract elite advisors</span>
                              )}
                           </div>

                           <button onClick={() => setCurrentStep(2)} className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-bold uppercase transition-all shadow-lg shadow-emerald-200">Next: Map Context</button>
                        </div>
                     )}

                     {currentStep === 2 && (
                        <div className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {input("Domain", "meetupDomain", "", "select", DOMAINS)}
                              {input("Business Stage", "meetupStage", "", "select", STAGES)}
                              {input("Urgency", "meetupUrgency", "", "select", ["Flexible", "Soon", "Urgent"])}
                           </div>

                           {/* CLUSTERING INDICATOR */}
                           <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center">
                              <p className="text-[10px] font-bold text-[#292828] uppercase mb-1">Clustering Active...</p>
                              <p className="text-[8px] font-bold text-[#292828]/40 uppercase tracking-wider">Pattern Match: 3 People with similar {formData.meetupDomain} problems are active</p>
                           </div>

                           <button onClick={() => setCurrentStep(3)} className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-bold uppercase transition-all shadow-lg shadow-emerald-200">Next: Select Advisor Hub</button>
                        </div>
                     )}

                     {currentStep === 3 && (
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-bold text-[#292828] uppercase tracking-widest">Suggested Advisors</h4>
                              <button className="text-[8px] font-bold text-emerald-600 uppercase border-b border-emerald-600">Explore All Advisors</button>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                             {advisors.map(adv => (
                                 <button 
                                   key={adv.id} 
                                   onClick={() => {
                                      updateField("selectedAdvisor", adv);
                                      updateField("advisorFee", adv.checkoutScore > 90 ? 2000 : 500);
                                   }} 
                                   className={cn(
                                      "p-5 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 text-left relative overflow-hidden", 
                                      formData.selectedAdvisor?.id === adv.id ? "border-emerald-600 bg-emerald-50/50" : "border-slate-100 hover:border-slate-200 bg-slate-50/30"
                                   )}
                                 >
                                    <div className="h-12 w-12 rounded-xl overflow-hidden grayscale">
                                       <img src={adv.avatar} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <p className="text-[12px] font-bold text-[#292828] uppercase leading-none mb-1 truncate">{adv.name}</p>
                                       <div className="flex items-center gap-2">
                                          <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">{adv.checkoutBadge}</p>
                                          <p className="text-[8px] font-bold text-[#292828]/40 uppercase">Rank: {adv.checkoutRank}</p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-[10px] font-bold text-emerald-600">{adv.checkoutScore}%</p>
                                       <p className="text-[7px] font-bold text-[#292828]/30 uppercase">Score</p>
                                    </div>
                                    {formData.selectedAdvisor?.id === adv.id && (
                                       <div className="absolute top-0 right-0 h-4 w-4 bg-emerald-600 flex items-center justify-center">
                                          <CheckCircle2 size={8} className="text-white" />
                                       </div>
                                    )}
                                 </button>
                              ))}
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {input("Preferred Time", "meetupTime", "e.g. Friday 4PM")}
                              {input("Type", "meetupPayment", "", "select", ["Free", "Paid"])}
                              
                              {formData.meetupPayment === "Paid" && (
                                 <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                    <p className="text-[7px] font-bold text-emerald-600 uppercase mb-1">Cost Split (Max 8 Members)</p>
                                    <p className="text-[12px] font-bold text-emerald-700">₹{(formData.advisorFee / 8).toFixed(0)} <span className="text-[8px] opacity-60">/PERSON</span></p>
                                 </div>
                              )}
                           </div>

                           <div className="p-4 bg-[#292828] rounded-2xl text-center">
                              <p className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">System Logic</p>
                              <p className="text-[10px] font-bold text-white uppercase">Meeting cluster activates only after Advisor acceptance</p>
                           </div>
                        </div>
                     )}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* FOOTER - COMPACT */}
        <div className="px-8 py-6 border-t border-[#292828]/5 flex items-center justify-between shrink-0 bg-slate-50/30">
            <div className="flex flex-col">
               <span className="text-[7px] font-bold text-[#292828]/30 uppercase tracking-widest mb-0.5">Post Quality</span>
               <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-[#292828] uppercase">{checkoutScore}% Match Score</span>
               </div>
            </div>
            <button 
              onClick={handlePost}
              disabled={isPosting}
              className="h-14 px-10 bg-[#292828] text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-[#E53935] active:scale-95 transition-all flex items-center gap-3"
            >
               {isPosting ? "Posting..." : "Post Now"} <ArrowUpRight size={16} />
            </button>
        </div>

      </div>
    </div>
  );
}
