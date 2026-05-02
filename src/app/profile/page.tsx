"use client";
// CHECKOUT BUILD VERSION: V.5 | CHECKPOINT 5 SAFE BACKUP

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
  Sparkles,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { detectBaseTag } from "@/utils/match-engine";
import { INDUSTRY_DATA } from "@/utils/industry-data";
import TerminalLayout from "@/components/layout/TerminalLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
     metadata: {} as any,
     postCount: 0,
     connectionCount: 0,
     solvedCount: 0
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
            metadata: metadata,
            postCount: 0,
            connectionCount: 0,
            solvedCount: 0
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
              type: p.type === "LEAD" ? "Hiring" : p.type === "PARTNER" ? "Partnership" : p.type === "MEETUP" ? "Meetup" : "General",
              priority: "High",
              status: "General"
            })));
            
            setUserData(prev => ({
              ...prev,
              postCount: userPosts.length,
              solvedCount: userPosts.filter(p => p.status === 'SOLVED').length
            }));
          }

          // Load Connections
          const { count: connCount } = await supabase
            .from('connections')
            .select('*', { count: 'exact', head: true })
            .or(`sender_id.eq.${authUser.id},receiver_id.eq.${authUser.id}`)
            .eq('status', 'ACCEPTED');
          
          setUserData(prev => ({ ...prev, connectionCount: connCount || 0 }));
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
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: dataToSave.full_name,
          role: dataToSave.role.toUpperCase(),
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

      setUserData(dataToSave);
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
        type: newDep.type === "Hiring" ? "LEAD" : newDep.type === "Partnership" ? "PARTNER" : "GENERAL",
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser?.id) return;

    setIsSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${authUser.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`; 

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const updatedData = { ...userData, avatar_url: publicUrl };
      setUserData(updatedData);
      await handleSaveProfile(updatedData);
      
    } catch (err) {
      console.error("[AVATAR] Upload Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-[#E53935]" size={48} />
        <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.5em] italic animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <TerminalLayout>
        <div className="min-h-screen bg-[#FDFDFF] font-sans selection:bg-[#E53935]/10">
          {/* HEADER AREA (LOCKED DESIGN) */}
          <div className="bg-[#292828] h-[500px] relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#292828] via-[#1a1a1a] to-[#E53935]/10" />
             <div className="absolute top-[-20%] right-[-10%] h-[800px] w-[800px] bg-[#E53935]/5 blur-[200px] rounded-full animate-pulse" />
             
             <div className="max-w-[1440px] mx-auto px-6 pt-16 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12">
                   {/* IDENTITY */}
                   <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="h-44 w-44 rounded-[4rem] overflow-hidden border-4 border-white/10 p-2 backdrop-blur-xl group-hover:border-[#E53935]/30 transition-all duration-700 shadow-4xl relative">
                         <img 
                           src={userData.avatar_url} 
                           className="w-full h-full object-cover rounded-[3rem]" 
                           alt={userData.full_name} 
                         />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-[3rem] transition-all">
                            <Plus size={24} className="text-white" />
                         </div>
                         {isSaving && <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-[3rem]"><Loader2 className="animate-spin text-white" size={24} /></div>}
                      </div>
                      <div className="absolute -bottom-4 -right-4 h-14 w-14 bg-[#E53935] rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-[#292828]">
                         <Award size={20} />
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                   </div>

                   <div className="text-center md:text-left flex-1">
                      <div className="flex flex-col gap-5 mb-2">
                         <h1 className="text-6xl font-black text-white leading-none tracking-tighter uppercase italic">{userData.full_name}</h1>
                         <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="px-4 py-1.5 bg-[#E53935] rounded-full text-[9px] font-black uppercase text-white shadow-lg">
                               {userData.role}
                            </div>
                            <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-black uppercase text-white">
                               Checkout Rank {userData.checkoutRank}
                            </div>
                            <div className="px-4 py-1.5 border border-white/20 rounded-full text-[9px] font-black uppercase text-white/60">
                               Elite Partner
                            </div>
                         </div>
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/40 text-[11px] font-bold uppercase pt-2">
                         <span className="flex items-center gap-2"> <Building size={14} className="text-[#E53935]" /> {userData.company}</span>
                         <span className="flex items-center gap-2"> <MapPin size={14} className="text-[#E53935]" /> {userData.location}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <button onClick={() => setShowEditModal(true)} className="h-16 px-10 bg-white text-[#292828] rounded-full font-black text-xs uppercase shadow-2xl hover:bg-[#E53935] hover:text-white transition-all transform hover:-translate-y-1">
                        Edit Profile
                      </button>
                      <button onClick={() => setShowSettingsModal(true)} className="h-16 w-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#292828] transition-all overflow-hidden relative group">
                         <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* MAIN CONTENT ARCHITECTURE (LOCKED BENTO) */}
          <div className="max-w-[1440px] mx-auto px-6 -mt-14 relative z-20 pb-40">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* COLUMN 1: SIDEBAR */}
                <div className="lg:col-span-3 space-y-8">
                   
                   {/* Skills */}
                   <div className="bg-white rounded-[1.625rem] p-8 shadow-xl border border-[#292828]/10 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      <h3 className="text-[10px] font-black text-[#292828]/40 uppercase mb-6 flex items-center gap-3">
                         <BrainCircuit size={16} className="text-[#E53935]" /> Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                          {userData.expertise && userData.expertise.length > 0 ? userData.expertise.map(skill => (
                            <span key={skill} className="px-4 py-2 bg-[#292828]/5 border border-[#292828]/10 rounded-xl text-[11px] font-bold text-[#292828] uppercase">{skill}</span>
                          )) : (
                            <p className="text-[11px] font-bold text-slate-300 italic px-2">No skills defined.</p>
                          )}
                      </div>
                   </div>

                   {/* ABOUT & CONTACT BLOCK */}
                   <div className="bg-white rounded-[1.625rem] p-8 shadow-xl border border-[#292828]/10">
                      <h3 className="text-[10px] font-black text-[#292828]/40 uppercase mb-5 flex items-center gap-2">
                         <div className="h-1 w-3 bg-[#E53935] rounded-full" /> About Me
                      </h3>
                      <p className="text-[15px] text-[#292828] font-medium leading-[1.7] mb-8 italic">"{userData.bio}"</p>
                      
                      <div className="pt-8 border-t border-[#292828]/5 space-y-5">
                         {contactInfo.map((info, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                               <div className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all">
                                  <info.icon size={16} />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-[8px] font-black text-[#292828]/40 uppercase leading-none mb-1">{info.label}</p>
                                  <p className={cn("text-[12px] font-bold truncate", info.link ? "text-[#E53935]" : "text-[#292828]")}>{info.value}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* CENTRAL FEED */}
                <div className="lg:col-span-6 space-y-8">
                   <div className="bg-white rounded-[1.625rem] p-10 border border-[#292828]/10 shadow-xl relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                         <div>
                            <h3 className="text-xs font-black uppercase text-[#292828] flex items-center gap-3 italic">
                               <Target size={18} className="text-[#E53935]" /> Current Needs
                            </h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase mt-2 leading-none opacity-60">Broadcasted to Network</p>
                         </div>
                         <button onClick={() => setIsAddingDep(!isAddingDep)} className="h-10 px-6 bg-[#292828] text-white rounded-xl text-[10px] font-black uppercase hover:bg-[#E53935] transition-all flex items-center gap-2 shadow-xl">
                            {isAddingDep ? <X size={14} /> : <Plus size={14} />} {isAddingDep ? "Cancel" : "Add Need"}
                         </button>
                      </div>

                      {isAddingDep && (
                         <div className="mb-8 p-8 bg-slate-50 rounded-3xl border border-[#292828]/5 animate-in fade-in slide-in-from-top-4 shadow-inner">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                               <input type="text" placeholder="What do you need?" value={newDep.title} onChange={(e) => setNewDep({...newDep, title: e.target.value})} className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm font-bold focus:border-[#E53935] outline-none" />
                               <select value={newDep.type} onChange={(e) => setNewDep({...newDep, type: e.target.value})} className="h-12 px-4 rounded-xl border border-slate-200 text-[10px] font-black uppercase outline-none focus:border-[#E53935]">
                                  <option>Hiring</option>
                                  <option>Partnership</option>
                                  <option>Procurement</option>
                                  <option>Investment</option>
                                  <option>Technology</option>
                               </select>
                            </div>
                            <button onClick={addDependency} className="w-full h-14 bg-[#E53935] text-white rounded-xl text-[10px] font-black uppercase hover:bg-[#292828] transition-all shadow-xl">Post Now</button>
                         </div>
                      )}

                      <div className="space-y-4">
                         {dependencyList.length > 0 ? dependencyList.map(dep => (
                            <div key={dep.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-[#E53935]/30 transition-all">
                               <div className="flex items-center gap-5">
                                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#E53935] shadow-sm border border-slate-100 group-hover:bg-[#E53935] group-hover:text-white transition-colors">
                                     {dep.type === "Hiring" && <Briefcase size={20} />}
                                     {dep.type === "Partnership" && <Users size={20} />}
                                     {dep.type === "Investment" && <TrendingUp size={20} />}
                                     {dep.type === "Technology" && <Database size={20} />}
                                     {dep.type === "Procurement" && <ShoppingBag size={20} />}
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-2 mb-1">
                                        <span className="px-1.5 py-0.5 bg-[#292828] text-white text-[7px] font-black uppercase rounded-sm">{dep.type}</span>
                                        <h4 className="text-[14px] font-black text-[#292828] uppercase italic">{dep.title}</h4>
                                     </div>
                                     <div className="flex items-center gap-3">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Active Node</p>
                                        <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                        <p className="text-[9px] font-black text-[#E53935] uppercase">Strategic Priority</p>
                                     </div>
                                  </div>
                               </div>
                               <button onClick={() => removeDependency(dep.id)} className="text-slate-200 hover:text-[#E53935] transition-colors p-2"><X size={16} /></button>
                            </div>
                         )) : (
                            <div className="py-12 text-center">
                               <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest italic">No active needs broadcasted</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* COLUMN 3: PERFORMANCE & WALLET */}
                <div className="lg:col-span-3 space-y-8">
                   {/* WALLET (RESTORED) */}
                   <div className="bg-[#E53935] rounded-[1.625rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute -right-10 -top-10 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                      <div className="relative z-10">
                         <div className="flex items-center justify-between mb-8">
                            <p className="text-[9px] font-black uppercase text-white/50 tracking-widest">Network Wallet</p>
                            <Wallet size={16} className="text-white/40" />
                         </div>
                         <h4 className="text-[10px] font-black uppercase text-white/40 mb-2">Available Credits</h4>
                         <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-4xl font-black tracking-tighter italic">₹84,200</span>
                            <span className="text-[10px] font-black text-white/40">INR</span>
                         </div>
                         <Link href="/wallet" className="w-full h-14 bg-white text-[#292828] rounded-2xl flex items-center justify-center text-[10px] font-black uppercase hover:bg-[#292828] hover:text-white transition-all shadow-xl">
                            Open Dashboard
                         </Link>
                      </div>
                   </div>

                   {/* PERFORMANCE METRICS */}
                   <div className="bg-white rounded-[1.625rem] p-8 shadow-xl border border-[#292828]/10">
                      <h3 className="text-[10px] font-black text-[#292828]/40 uppercase mb-8 flex items-center gap-2">
                         <Activity size={16} className="text-[#E53935]" /> Network Vitals
                      </h3>
                      <div className="space-y-6">
                         {performanceMetrics.map((metric, i) => (
                            <div key={i} className="space-y-3">
                               <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-black text-[#292828] uppercase flex items-center gap-2">
                                     <metric.icon size={12} className="text-[#E53935]" /> {metric.label}
                                  </span>
                                  <span className="text-[10px] font-black text-[#292828]">{metric.value}%</span>
                               </div>
                               <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.value}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className={cn("h-full rounded-full shadow-sm", metric.color)} 
                                  />
                               </div>
                            </div>
                         ))}
                      </div>
                      
                      {/* IMPACT SUB-STATS */}
                      <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                         <div className="text-center">
                            <p className="text-[18px] font-black text-[#292828] italic">{userData.postCount}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase">Posts</p>
                         </div>
                         <div className="text-center">
                            <p className="text-[18px] font-black text-[#292828] italic">{userData.connectionCount}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase">Partnered</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* EDIT MODAL */}
          {showEditModal && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-4xl flex flex-col max-h-[90vh]"
                >
                   <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                      <h2 className="text-3xl font-black text-[#292828] uppercase tracking-tighter italic">Edit Profile</h2>
                      <button onClick={() => setShowEditModal(false)} className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-[#E53935] hover:text-white transition-all"><X size={20} /></button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Full Name</p>
                         <input type="text" value={userData.full_name} onChange={(e) => setUserData({...userData, full_name: e.target.value})} className="w-full h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-[#E53935]" />
                      </div>
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Role</p>
                         <input type="text" value={userData.role} onChange={(e) => setUserData({...userData, role: e.target.value})} className="w-full h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-[#E53935]" />
                      </div>
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Bio</p>
                         <textarea value={userData.bio} onChange={(e) => setUserData({...userData, bio: e.target.value})} className="w-full h-40 p-6 rounded-2xl bg-slate-50 border border-slate-100 font-medium outline-none focus:border-[#E53935] resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Location</p>
                            <input type="text" value={userData.location} onChange={(e) => setUserData({...userData, location: e.target.value})} className="w-full h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-[#E53935]" />
                         </div>
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Company</p>
                            <input type="text" value={userData.company} onChange={(e) => setUserData({...userData, company: e.target.value})} className="w-full h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:border-[#E53935]" />
                         </div>
                      </div>
                   </div>
                   <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                      <button onClick={() => setShowEditModal(false)} className="flex-1 h-16 border-2 border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Cancel</button>
                      <button onClick={() => handleSaveProfile()} disabled={isSaving} className="flex-[2] h-16 bg-[#292828] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E53935] shadow-2xl transition-all disabled:opacity-50">
                         {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                   </div>
                </motion.div>
             </div>
          )}

          {/* SETTINGS MODAL */}
          {showSettingsModal && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-500">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 40 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-4xl flex flex-col border border-[#0A0A0A]/5"
                >
                   <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                      <h2 className="text-2xl font-black text-[#0A0A0A] uppercase italic leading-none mb-2">Settings</h2>
                      <button onClick={() => setShowSettingsModal(false)} className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:bg-[#E53935] hover:text-white transition-all"><X size={16} /></button>
                   </div>
                   <div className="p-8 space-y-4">
                      <button onClick={() => logout()} className="w-full h-16 bg-red-50 text-[#E53935] rounded-3xl border border-red-100 flex items-center justify-between px-8 hover:bg-[#E53935] hover:text-white transition-all group active:scale-95 shadow-xl shadow-red-500/5">
                         <div className="flex items-center gap-4">
                            <LogOut size={20} className="group-hover:translate-x-[-4px] transition-transform" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Sign Out</span>
                         </div>
                      </button>
                   </div>
                </motion.div>
             </div>
          )}
        </div>
      </TerminalLayout>
    </ProtectedRoute>
  );
}
