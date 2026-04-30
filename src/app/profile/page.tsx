// CHECKOUT BUILD VERSION: V.5 | CHECKPOINT 5 SAFE BACKUP
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Globe, 
  CreditCard, 
  ChevronRight, 
  LogOut, 
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Settings,
  Briefcase,
  Target,
  Zap,
  Activity,
  Award,
  Plus,
  X,
  Users,
  ShoppingBag,
  FileText,
  BarChart3,
  Truck,
  Scale,
  DollarSign,
  Database,
  Megaphone,
  BrainCircuit,
  Wallet,
  Loader2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { detectBaseTag } from "@/utils/match-engine";
import { INDUSTRY_DATA } from "@/utils/industry-data";
import TerminalLayout from "@/components/layout/TerminalLayout";

export default function PremiumProfilePage() {
  const [userData, setUserData] = useState({
     id: "",
     full_name: "User",
     role: "Founder",
     company: "Business Name",
     bio: "Professional profile description goes here.",
     checkoutRank: "--",
     avatar_url: "",
     location: "Trivandrum",
     email: "",
     phone: "",
     website: "",
     expertise: [] as string[],
     intents: [] as string[],
     base_tag: "",
     metadata: {} as any
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [dependencyList, setDependencyList] = useState<any[]>([]);
  const [isAddingDep, setIsAddingDep] = useState(false);
  const [newDep, setNewDep] = useState({ title: "", type: "Hiring" });
  
  const { user: authUser, updateProfile, logout } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contactInfo = useMemo(() => [
    { label: "Email", value: userData.email || "Verification Pending", icon: Mail },
    { label: "Phone", value: userData.phone || "+91 XXXXXXXXXX", icon: Phone },
    { label: "Website", value: userData.website || "No Website", icon: Globe, link: !!userData.website },
  ], [userData.email, userData.phone, userData.website]);

  const performanceMetrics = [
    { label: "Trust Score", value: 98, color: "bg-[#292828]", icon: ShieldCheck },
    { label: "Match Score", value: userData.metadata?.match_score || 84, color: "bg-[#E53935]", icon: Target },
    { label: "Credit Score", value: 92, color: "bg-[#292828]/60", icon: CreditCard },
    { label: "Speed Score", value: 76, color: "bg-[#E53935]/60", icon: Zap },
  ];

  useEffect(() => {
    async function loadProfile() {
      if (!authUser?.id) return;
      setIsLoading(true);
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (error) throw error;

        if (profile) {
          const metadata = profile.metadata || {};
          setUserData({
            id: profile.id,
            full_name: profile.full_name || "User",
            role: profile.role || "Founder",
            company: metadata.company_name || profile.location || "Business Name",
            bio: profile.bio || "Professional profile description goes here.",
            checkoutRank: profile.match_score ? `#${100 - profile.match_score}` : "Elite",
            avatar_url: profile.avatar_url || DEFAULT_AVATAR,
            location: profile.location || "Trivandrum",
            email: profile.email || "",
            phone: profile.phone || "",
            website: profile.website || "",
            expertise: profile.skills || [],
            intents: profile.domains || [],
            base_tag: profile.base_tag || "",
            metadata: metadata
          });

          // Load Needs (Posts)
          const { data: userPosts } = await supabase
            .from('posts')
            .select('*')
            .eq('author_id', authUser.id)
            .order('created_at', { ascending: false });
          
          if (userPosts) {
            setDependencyList(userPosts.map(p => ({
              id: p.id,
              title: p.title,
              type: p.type === "LEAD" ? "Hiring" : p.type === "PARTNERSHIP" ? "Partnership" : p.type === "MEETUP" ? "Meetup" : "General",
              priority: "High",
              status: "General"
            })));
          }
        }
      } catch (err) {
        console.error("[PROFILE] Load Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [authUser?.id, supabase]);

  const handleSaveProfile = async (updatedData?: any) => {
    const dataToSave = updatedData || userData;
    if (!dataToSave.id) return;
    
    // STEP 4: PROFILE BASE TAG UPDATE
    const detectedBaseTag = detectBaseTag(dataToSave.role, dataToSave.expertise);

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: dataToSave.full_name,
          role: dataToSave.role.toUpperCase(),
          base_tag: detectedBaseTag,
          bio: dataToSave.bio,
          location: dataToSave.location,
          avatar_url: dataToSave.avatar_url,
          skills: dataToSave.expertise,
          domains: dataToSave.intents,
          phone: dataToSave.phone,
          website: dataToSave.website,
          metadata: {
            ...userData.metadata,
            company_name: dataToSave.company
          }
        })
        .eq('id', dataToSave.id);

      if (error) throw error;

      setUserData({ ...dataToSave, base_tag: detectedBaseTag });
      updateProfile({
        full_name: dataToSave.full_name,
        role: dataToSave.role,
        avatar_url: dataToSave.avatar_url,
        bio: dataToSave.bio,
        location: dataToSave.location,
        expertise: dataToSave.expertise,
        intents: dataToSave.intents
      });
      setShowEditModal(false);
    } catch (err: any) {
      console.error("[PROFILE] Save Error:", err);
      alert("Failed to save profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addDependency = async () => {
    if (!newDep.title || !authUser?.id) return;
    
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        author_id: authUser.id,
        title: newDep.title,
        type: newDep.type === "Hiring" ? "LEAD" : newDep.type === "Partnership" ? "PARTNERSHIP" : "GENERAL",
        content: `Looking for ${newDep.title}`,
        status: "ACTIVE"
      }])
      .select()
      .single();

    if (!error && data) {
      setDependencyList([
        {
          id: data.id,
          title: data.title,
          type: newDep.type,
          priority: "High",
          status: "General"
        },
        ...dependencyList
      ]);
      setNewDep({ title: "", type: "Hiring" });
      setIsAddingDep(false);
    }
  };

  const removeDependency = async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setDependencyList(dependencyList.filter(d => d.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-[#E53935]" size={48} />
        <p className="text-[10px] font-black uppercase text-white/40  italic animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  return (
    <TerminalLayout>
      <div className="min-h-screen bg-[#FDFDFF] font-sans selection:bg-[#E53935]/10">
      {/* HEADER AREA: PREMIUM GLASSMORPHISM REDESIGN */}
      <div className="bg-[#0A0A0A] h-[320px] relative overflow-hidden flex items-center">
         {/* Animated Background Engine */}
         <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a1a1a] to-[#E53935]/10" />
         <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] bg-[#E53935]/10 blur-[150px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] bg-blue-500/5 blur-[120px] rounded-full" />
         
         {/* Grid Pattern Overlay */}
         <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />

         <div className="max-w-[1440px] mx-auto w-full px-6 relative z-10">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group"
            >
               {/* Shine Animation Overlay */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

               <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                  {/* IDENTITY & AVATAR GLOW */}
                  <div className="relative">
                     <div className="absolute inset-0 bg-[#E53935]/20 blur-2xl rounded-full animate-pulse" />
                     <div className="h-40 w-40 rounded-lg overflow-hidden border-4 border-white/10 p-2 backdrop-blur-xl group-hover:border-[#E53935]/50 transition-all duration-700 shadow-4xl relative">
                        <img 
                          src={userData.avatar_url} 
                          className="w-full h-full object-cover rounded-[1.8rem]" 
                          alt={userData.full_name} 
                        />
                        {isSaving && <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-[1.8rem]"><Loader2 className="animate-spin text-white" size={24} /></div>}
                     </div>
                     <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -bottom-3 -right-3 h-12 w-12 bg-[#E53935] rounded-[8px] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(229,57,51,0.5)] border-4 border-[#0A0A0A]"
                     >
                        <Award size={20} />
                     </motion.div>
                  </div>

                  {/* PROFILE INFO */}
                  <div className="text-center md:text-left flex-1">
                     <div className="flex flex-col gap-4 mb-4">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                           <h1 className="text-5xl md:text-6xl font-black text-white leading-none  uppercase italic">{userData.full_name}</h1>
                           <CheckCircle2 size={24} className="text-[#E53935] fill-[#E53935]/10" />
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                           <div className="px-4 py-1.5 bg-[#E53935] rounded-[8px] text-[10px] font-black uppercase text-white shadow-lg ">
                              {userData.role}
                           </div>
                           <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-[8px] text-[10px] font-black uppercase text-white ">
                              Rank {userData.checkoutRank}
                           </div>
                           <div className={cn(
                             "px-4 py-1.5 rounded-[8px] text-[10px] font-black uppercase  flex items-center gap-2 border shadow-lg transition-all",
                             userData.checkoutScore >= 75 ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" :
                             userData.checkoutScore >= 50 ? "bg-amber-500/20 border-amber-500/50 text-amber-400" :
                             userData.checkoutScore >= 25 ? "bg-[#E53935]/20 border-[#E53935]/50 text-[#E53935]" :
                             "bg-slate-500/20 border-slate-500/50 text-slate-200"
                           )}>
                              <ShieldCheck size={12} />
                              Checkout Score: {userData.checkoutScore}
                           </div>
                           <div className="px-4 py-1.5 border border-white/5 rounded-[8px] text-[10px] font-black uppercase text-white/40 ">
                              Elite Verified
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-wrap justify-center md:justify-start gap-8 text-white/30 text-[12px] font-black uppercase  pt-2">
                        <span className="flex items-center gap-2.5 group/info"> 
                           <Building size={16} className="text-[#E53935] group-hover/info:scale-110 transition-transform" /> 
                           <span className="group-hover/info:text-white transition-colors">{userData.company}</span>
                        </span>
                        <span className="flex items-center gap-2.5 group/info"> 
                           <MapPin size={16} className="text-[#E53935] group-hover/info:scale-110 transition-transform" /> 
                           <span className="group-hover/info:text-white transition-colors">{userData.location}</span>
                        </span>
                     </div>
                  </div>

                  {/* ACTION HUB */}
                  <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setShowEditModal(true)} 
                        className="h-16 px-10 bg-white text-[#0A0A0A] rounded-[8px] font-black text-[11px] uppercase  shadow-2xl hover:bg-[#E53935] hover:text-white transition-all transform hover:-translate-y-1 active:scale-95"
                     >
                       Edit Profile
                     </button>
                     <button 
                        onClick={() => setShowSettingsModal(true)} 
                        className="h-16 w-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-[8px] flex items-center justify-center text-white hover:bg-white hover:text-[#0A0A0A] transition-all overflow-hidden relative group"
                     >
                        <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                     </button>
                  </div>
               </div>
            </motion.div>
         </div>
      </div>

      {/* MAIN CONTENT ARCHITECTURE */}
      <div className="max-w-[1440px] mx-auto px-6 -mt-12 relative z-20 pb-40">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: STRATEGIC SIDEBAR */}
            <div className="lg:col-span-3 space-y-8">
               
               {/* Skills & Expertise (STEP 4: EDITABLE) */}
               <div className="bg-white rounded-[8px] p-8 shadow-2xl border border-[#292828]/5 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-[10px] font-black text-[#292828]/30 uppercase flex items-center gap-3 ">
                        <BrainCircuit size={16} className="text-[#E53935]" /> Your Skills
                     </h3>
                  </div>
                   
                  <div className="mb-6">
                     <select 
                       onChange={(e) => {
                         const s = e.target.value;
                         if (s && s !== "Add expertise...") {
                           const newExpertise = Array.from(new Set([...userData.expertise, s]));
                           setUserData(prev => ({...prev, expertise: newExpertise}));
                           handleSaveProfile({...userData, expertise: newExpertise});
                         }
                       }}
                       className="w-full h-10 bg-slate-50 border border-black/5 rounded-xl px-4 text-[10px] font-black uppercase outline-none focus:border-[#E53935] transition-all cursor-pointer hover:bg-white"
                     >
                       <option>Add expertise...</option>
                       {INDUSTRY_DATA.flatMap(i => i.focusAreas).sort().map(area => (
                         <option key={area} value={area}>{area}</option>
                       ))}
                     </select>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                      {userData.expertise && userData.expertise.length > 0 ? userData.expertise.map(skill => (
                        <span 
                           key={skill} 
                           className="px-4 py-2 bg-[#0A0A0A]/5 border border-[#0A0A0A]/5 rounded-[8px] text-[10px] font-black text-[#0A0A0A] uppercase flex items-center gap-2 group/skill hover:bg-red-50 hover:text-[#E53935] transition-all cursor-default"
                        >
                           {skill}
                           <X 
                              size={10} 
                              className="opacity-0 group-hover/skill:opacity-100 cursor-pointer" 
                              onClick={() => {
                                 const newExpertise = userData.expertise.filter(sk => sk !== skill);
                                 setUserData({...userData, expertise: newExpertise});
                                 handleSaveProfile({...userData, expertise: newExpertise});
                              }}
                           />
                        </span>
                      )) : (
                        <p className="text-[11px] font-bold text-slate-300 italic px-2">No skills defined.</p>
                      )}
                  </div>
                  {userData.base_tag && (
                     <div className="mt-6 pt-6 border-t border-[#0A0A0A]/5">
                        <p className="text-[8px] font-black text-[#0A0A0A]/30 uppercase mb-2">Unified Base Tag</p>
                        <span className="px-3 py-1 bg-[#E53935]/10 text-[#E53935] rounded-full text-[9px] font-black uppercase tracking-widest">{userData.base_tag}</span>
                     </div>
                  )}
               </div>

               {/* ABOUT & CONTACT BLOCK */}
               <div className="bg-white rounded-[8px] p-8 shadow-2xl border border-[#292828]/5">
                  <h3 className="text-[10px] font-black text-[#292828]/30 uppercase mb-6 flex items-center gap-2 ">
                     <div className="h-1 w-4 bg-[#E53935] rounded-full" /> Personal Bio
                  </h3>
                  <p className="text-[14px] text-[#0A0A0A] font-bold leading-relaxed mb-10 italic">"{userData.bio}"</p>
                  
                  <div className="pt-8 border-t border-[#0A0A0A]/5 space-y-6">
                     {contactInfo.map((info, i) => (
                        <div key={i} className="flex items-center gap-5 group/item cursor-pointer">
                           <div className="h-11 w-11 bg-[#0A0A0A]/5 rounded-[8px] flex items-center justify-center text-[#0A0A0A] group-hover/item:bg-[#0A0A0A] group-hover/item:text-white transition-all shadow-sm">
                              <info.icon size={18} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-black text-[#0A0A0A]/30 uppercase leading-none mb-1.5 ">{info.label}</p>
                              <p className={cn("text-[12px] font-black truncate uppercase ", info.link ? "text-[#E53935]" : "text-[#0A0A0A]")}>{info.value}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* CENTRAL BROADCAST FEED */}
            <div className="lg:col-span-6 space-y-8">
               <div className="bg-white rounded-[8px] p-10 border border-[#292828]/5 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#0A0A0A]/5">
                     <div>
                        <h3 className="text-sm font-black uppercase text-[#0A0A0A] flex items-center gap-3  italic">
                           <Target size={20} className="text-[#E53935]" /> My Posts
                        </h3>
                        <p className="text-[9px] font-black text-slate-200 uppercase mt-2 leading-none  opacity-60">Showing to your network</p>
                     </div>
                     <button 
                        onClick={() => setIsAddingDep(!isAddingDep)} 
                        className="h-11 px-8 bg-[#0A0A0A] text-white rounded-[8px] text-[10px] font-black uppercase hover:bg-[#E53935] transition-all flex items-center gap-3 shadow-2xl"
                     >
                        {isAddingDep ? <X size={16} /> : <Plus size={16} />} {isAddingDep ? "Close" : "Post Need"}
                     </button>
                  </div>

                  {isAddingDep && (
                     <div className="mb-10 p-10 bg-slate-50 rounded-[8px] border border-[#0A0A0A]/5 animate-in fade-in slide-in-from-top-4 shadow-inner">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                           <div className="space-y-2">
                              <p className="text-[8px] font-black text-slate-200 uppercase ">Requirement Title</p>
                              <input type="text" placeholder="e.g. Senior Frontend Lead" value={newDep.title} onChange={(e) => setNewDep({...newDep, title: e.target.value})} className="w-full h-14 px-6 rounded-[8px] border border-slate-200 text-sm font-black uppercase  focus:border-[#E53935] outline-none shadow-sm" />
                           </div>
                           <div className="space-y-2">
                              <p className="text-[8px] font-black text-slate-200 uppercase ">Post Category</p>
                              <select value={newDep.type} onChange={(e) => setNewDep({...newDep, type: e.target.value})} className="w-full h-14 px-5 rounded-[8px] border border-slate-200 text-[10px] font-black uppercase  outline-none focus:border-[#E53935] bg-white">
                                 <option>Hiring</option>
                                 <option>Partnership</option>
                                 <option>Procurement</option>
                                 <option>Investment</option>
                                 <option>Technology</option>
                              </select>
                           </div>
                        </div>
                        <button onClick={addDependency} className="w-full h-16 bg-[#E53935] text-white rounded-[8px] text-[11px] font-black uppercase  hover:bg-[#0A0A0A] transition-all shadow-2xl">Post Now</button>
                     </div>
                  )}

                  <div className="space-y-5">
                     {dependencyList.length > 0 ? dependencyList.map(dep => (
                        <div key={dep.id} className="p-8 bg-slate-50/50 border border-[#0A0A0A]/5 rounded-[8px] flex items-center justify-between group hover:bg-white hover:shadow-2xl hover:border-[#E53935]/20 transition-all duration-500">
                           <div className="flex items-center gap-6">
                              <div className="h-14 w-14 bg-white rounded-[8px] flex items-center justify-center text-[#E53935] shadow-lg border border-[#0A0A0A]/5 group-hover:bg-[#E53935] group-hover:text-white transition-all">
                                 {dep.type === "Hiring" && <Briefcase size={22} />}
                                 {dep.type === "Partnership" && <Users size={22} />}
                                 {dep.type === "Investment" && <TrendingUp size={22} />}
                                 {dep.type === "Technology" && <Database size={22} />}
                                 {dep.type === "Procurement" && <ShoppingBag size={22} />}
                              </div>
                              <div>
                                 <div className="flex items-center gap-3 mb-2">
                                    <span className="px-2 py-0.5 bg-[#0A0A0A] text-white text-[8px] font-black uppercase rounded-[4px] ">{dep.type}</span>
                                    <h4 className="text-[16px] font-black text-[#0A0A0A] uppercase italic ">{dep.title}</h4>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <p className="text-[10px] font-black text-slate-200 uppercase  flex items-center gap-1.5">
                                       <Activity size={10} /> Active
                                    </p>
                                    <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                    <p className="text-[10px] font-black text-[#E53935] uppercase ">High Priority</p>
                                 </div>
                              </div>
                           </div>
                           <button onClick={() => removeDependency(dep.id)} className="h-10 w-10 flex items-center justify-center rounded-[8px] text-slate-200 hover:bg-red-50 hover:text-[#E53935] transition-all"><X size={18} /></button>
                        </div>
                     )) : (
                        <div className="py-20 text-center opacity-30">
                           <Sparkles size={40} className="mx-auto mb-4 text-[#0A0A0A]" />
                           <p className="text-[11px] font-black text-[#0A0A0A] uppercase  italic">No active strategic needs</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* COLUMN 3: PERFORMANCE ARCHITECTURE */}
            <div className="lg:col-span-3 space-y-8">

               {/* PERFORMANCE VITALS (STATS) */}
               <div className="bg-white rounded-[8px] p-8 shadow-2xl border border-[#292828]/5 space-y-10">
                  <h3 className="text-[10px] font-black text-[#292828]/30 uppercase flex items-center gap-3 ">
                     <Activity size={18} className="text-[#E53935]" /> My Stats
                  </h3>

                  {/* LARGE SCORE DISPLAY */}
                  <div className="relative p-8 rounded-[8px] border border-[#0A0A0A]/5 bg-slate-50/50 overflow-hidden group">
                     <div className={cn(
                        "absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 rounded-full",
                        userData.checkoutScore >= 75 ? "bg-emerald-500" :
                        userData.checkoutScore >= 50 ? "bg-amber-500" :
                        userData.checkoutScore >= 25 ? "bg-[#E53935]" :
                        "bg-slate-500"
                     )} />
                     <p className="text-[8px] font-black text-[#0A0A0A]/30 uppercase  mb-4">Network Authority Score</p>
                     <div className="flex items-center gap-6">
                        <div className={cn(
                           "h-20 w-20 rounded-full border-[6px] flex items-center justify-center shadow-inner",
                           userData.checkoutScore >= 75 ? "border-emerald-500 text-emerald-600 bg-emerald-50" :
                           userData.checkoutScore >= 50 ? "border-amber-500 text-amber-600 bg-amber-50" :
                           userData.checkoutScore >= 25 ? "border-[#E53935] text-[#E53935] bg-red-50" :
                           "border-slate-300 text-slate-200 bg-slate-100"
                        )}>
                           <span className="text-2xl font-black">{userData.checkoutScore}</span>
                        </div>
                        <div>
                           <p className="text-[14px] font-black text-[#0A0A0A] uppercase  italic mb-1">
                              {userData.checkoutScore >= 75 ? "Elite Partner" :
                               userData.checkoutScore >= 50 ? "Verified Pro" :
                               userData.checkoutScore >= 25 ? "Active Node" :
                               "New Member"}
                           </p>
                           <p className="text-[9px] font-bold text-slate-200 uppercase  leading-tight">
                              Ranked in top 12%<br />of global network
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     {performanceMetrics.map((metric, i) => (
                        <div key={i} className="space-y-4">
                           <div className="flex justify-between items-end">
                              <div>
                                 <span className="text-[9px] font-black text-[#0A0A0A]/40 uppercase  block mb-1">Performance Metric</span>
                                 <span className="text-[11px] font-black text-[#0A0A0A] uppercase flex items-center gap-2.5 italic">
                                    <metric.icon size={14} className="text-[#E53935]" /> {metric.label}
                                 </span>
                              </div>
                              <span className="text-[14px] font-black text-[#0A0A0A]">{metric.value}%</span>
                           </div>
                           <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${metric.value}%` }}
                                 transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                 className={cn("h-full rounded-full shadow-inner relative", metric.color)} 
                              >
                                 <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                              </motion.div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* EDIT MODAL: PREMIUM REDESIGN */}
      {showEditModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-500">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white w-full max-w-3xl rounded-[8px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] border border-[#0A0A0A]/5"
            >
               <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div>
                     <h2 className="text-4xl font-black text-[#0A0A0A] uppercase  italic leading-none mb-2">Edit Profile</h2>
                     <p className="text-[10px] font-black text-slate-200 uppercase ">Update your account details</p>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="h-12 w-12 bg-white border border-slate-100 rounded-[8px] flex items-center justify-center text-slate-300 hover:bg-[#E53935] hover:text-white transition-all shadow-sm"><X size={20} /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                  {/* Basic Identity */}
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-[#0A0A0A] uppercase  flex items-center gap-2">
                           <User size={12} className="text-[#E53935]" /> Full Name
                        </p>
                        <input type="text" value={userData.full_name} onChange={(e) => setUserData({...userData, full_name: e.target.value})} className="w-full h-16 px-6 rounded-[8px] bg-slate-50 border border-slate-100 font-black uppercase  text-sm outline-none focus:border-[#E53935] focus:bg-white transition-all shadow-inner" />
                     </div>
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-[#0A0A0A] uppercase  flex items-center gap-2">
                           <ShieldCheck size={12} className="text-[#E53935]" /> Strategic Role
                        </p>
                        <input type="text" value={userData.role} onChange={(e) => setUserData({...userData, role: e.target.value})} className="w-full h-16 px-6 rounded-[8px] bg-slate-50 border border-slate-100 font-black uppercase  text-sm outline-none focus:border-[#E53935] focus:bg-white transition-all shadow-inner" />
                     </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-[#0A0A0A] uppercase  flex items-center gap-2">
                        <FileText size={12} className="text-[#E53935]" /> Node Bio / Intent
                     </p>
                     <textarea value={userData.bio} onChange={(e) => setUserData({...userData, bio: e.target.value})} className="w-full h-32 p-6 rounded-[8px] bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-[#E53935] focus:bg-white transition-all resize-none shadow-inner" />
                  </div>

                  {/* Location & Company */}
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-[#0A0A0A] uppercase  flex items-center gap-2">
                           <MapPin size={12} className="text-[#E53935]" /> Global Location
                        </p>
                        <input type="text" value={userData.location} onChange={(e) => setUserData({...userData, location: e.target.value})} className="w-full h-16 px-6 rounded-[8px] bg-slate-50 border border-slate-100 font-black uppercase  text-sm outline-none focus:border-[#E53935] focus:bg-white transition-all shadow-inner" />
                     </div>
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-[#0A0A0A] uppercase  flex items-center gap-2">
                           <Building size={12} className="text-[#E53935]" /> Organization Name
                        </p>
                        <input type="text" value={userData.company} onChange={(e) => setUserData({...userData, company: e.target.value})} className="w-full h-16 px-6 rounded-[8px] bg-slate-50 border border-slate-100 font-black uppercase  text-sm outline-none focus:border-[#E53935] focus:bg-white transition-all shadow-inner" />
                     </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-[#0A0A0A] uppercase  flex items-center gap-2">
                           <Phone size={12} className="text-[#E53935]" /> Direct Phone
                        </p>
                        <input type="text" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})} className="w-full h-16 px-6 rounded-[8px] bg-slate-50 border border-slate-100 font-black uppercase  text-sm outline-none focus:border-[#E53935] focus:bg-white transition-all shadow-inner" />
                     </div>
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-[#0A0A0A] uppercase  flex items-center gap-2">
                           <Globe size={12} className="text-[#E53935]" /> External Website
                        </p>
                        <input type="text" value={userData.website} onChange={(e) => setUserData({...userData, website: e.target.value})} className="w-full h-16 px-6 rounded-[8px] bg-slate-50 border border-slate-100 font-black uppercase  text-sm outline-none focus:border-[#E53935] focus:bg-white transition-all shadow-inner" />
                     </div>
                  </div>
               </div>

               <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex gap-5">
                  <button onClick={() => setShowEditModal(false)} className="flex-1 h-16 border border-slate-200 rounded-[8px] font-black text-[11px] uppercase  text-slate-200 hover:bg-white hover:text-[#0A0A0A] transition-all">Discard</button>
                  <button 
                     onClick={() => handleSaveProfile()} 
                     disabled={isSaving} 
                     className="flex-[2] h-16 bg-[#0A0A0A] text-white rounded-[8px] font-black text-[11px] uppercase  hover:bg-[#E53935] shadow-2xl transition-all disabled:opacity-50 active:scale-95 group"
                  >
                     {isSaving ? "Saving..." : <span className="flex items-center justify-center gap-2">Save Changes <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>}
                  </button>
               </div>
            </motion.div>
         </div>
      )}
      {/* SETTINGS MODAL: PREMIUM REDESIGN */}
      {showSettingsModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-500">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col border border-[#0A0A0A]/5"
            >
               <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                  <div>
                     <h2 className="text-2xl font-black text-[#0A0A0A] uppercase italic leading-none mb-2">Settings</h2>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Management Hub</p>
                  </div>
                  <button onClick={() => setShowSettingsModal(false)} className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:bg-[#E53935] hover:text-white transition-all"><X size={16} /></button>
               </div>

               <div className="p-8 space-y-4">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-black/5 flex items-center justify-between group hover:border-[#E53935]/20 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                           <ShieldCheck size={18} className="text-[#E53935]" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest">Privacy & Security</span>
                     </div>
                     <ChevronRight size={16} className="text-black/10 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-black/5 flex items-center justify-between group hover:border-[#E53935]/20 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                           <Bell size={18} className="text-[#E53935]" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest">Notification Preferences</span>
                     </div>
                     <ChevronRight size={16} className="text-black/10 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="h-px bg-black/5 my-4" />

                  <button 
                    onClick={() => logout()}
                    className="w-full h-16 bg-red-50 text-[#E53935] rounded-2xl border border-red-100 flex items-center justify-between px-8 hover:bg-[#E53935] hover:text-white transition-all group active:scale-95 shadow-xl shadow-red-500/5"
                  >
                     <div className="flex items-center gap-4">
                        <LogOut size={20} className="group-hover:translate-x-[-4px] transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Sign Out / Disconnect</span>
                     </div>
                     <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
               </div>

               <div className="p-8 bg-slate-50/50 text-center">
                  <p className="text-[8px] font-black text-black/10 uppercase tracking-[0.4em]">Checkpoint OS V.5.2 • 2026</p>
               </div>
            </motion.div>
         </div>
      )}
    </div>
    </TerminalLayout>
  );
}


export const runtime = "edge";
