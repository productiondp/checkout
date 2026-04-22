// CHECKOUT BUILD VERSION: V.5 | CHECKPOINT 5 SAFE BACKUP
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
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
  Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PremiumProfilePage() {
  const performanceMetrics = [
    { label: "Trust Score", value: 98, color: "bg-green-500", icon: ShieldCheck },
    { label: "Match Score", value: 84, color: "bg-[#E53935]", icon: Target },
    { label: "Credit Score", value: 92, color: "bg-blue-600", icon: CreditCard },
    { label: "Speed Score", value: 76, color: "bg-violet-600", icon: Zap },
  ];

  const contactInfo = [
    { label: "Email", value: "ahmad@zenithtech.com", icon: Mail },
    { label: "Phone", value: "+91 9XX XXXXXXX", icon: Phone },
    { label: "Website", value: "zenithtech.io", icon: Globe, link: true },
  ];

  const roleDefaults = {
    "SEO": [],
    "IT": [],
    "Sales": [],
    "Doctor": [],
    "Advocate": [],
    "Business": [],
    "Student": [],
    "CEO": []
  };

  const [userData, setUserData] = useState({
     id: "",
     name: "User",
     role: "Founder",
     company: "Business Name",
     bio: "Professional profile description goes here.",
     checkoutRank: "--",
     avatar_url: "",
     location: "Trivandrum",
     email: "",
     phone: "",
     website: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      // For MVP, we fetch the first profile or create one if empty
      let { data: profile, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      
      if (!profile) {
        const { data: newProfile } = await supabase.from('profiles').insert([{
           full_name: 'Community Elite',
           role: 'FOUNDER',
           location: 'Trivandrum',
           bio: 'Managing partner and strategic node.'
        }]).select().single();
        profile = newProfile;
      }

      if (profile) {
        setUserData({
          id: profile.id,
          name: profile.full_name || "User",
          role: profile.role || "Founder",
          company: profile.location || "Business Name",
          bio: profile.bio || "Professional profile description goes here.",
          checkoutRank: profile.match_score ? `#${100 - profile.match_score}` : "Elite",
          avatar_url: profile.avatar_url || `https://i.pravatar.cc/150?u=${profile.id}`,
          location: profile.location || "Trivandrum",
          email: profile.email || "ahmad@zenithtech.com",
          phone: profile.phone || "+91 9XX XXXXXXX",
          website: profile.website || "zenithtech.io"
        });
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!userData.id) {
       alert("Profile ID not found. Please refresh and try again.");
       return;
    }
    
    setIsSaving(true);
    
    // Map UI roles to standard System Roles that the DB constraint likely expects
    const systemRole = ["FOUNDER", "ADVISOR"].includes(userData.role.toUpperCase()) 
      ? userData.role.toUpperCase() 
      : "PROFESSIONAL";

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: userData.name,
        role: systemRole, // Send valid system role to satisfy DB constraint
        bio: userData.bio,
        location: userData.location,
        avatar_url: userData.avatar_url,
      })
      .eq('id', userData.id);

    if (error) {
      console.error("Save Error:", error);
      alert("Failed to save profile: " + error.message);
    } else {
      setShowEditModal(false);
    }
    setIsSaving(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload to Supabase Storage. 
    // For now, we'll use a FileReader to show it locally and set it as a placeholder.
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserData(prev => ({ ...prev, avatar_url: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const [dependencyList, setDependencyList] = useState(
    roleDefaults["SEO"]
  );

  const [isAddingDep, setIsAddingDep] = useState(false);
  const [newDep, setNewDep] = useState({ title: "", type: "Hiring", priority: "High", node: "General" });

  const addDependency = () => {
    if (!newDep.title.trim()) return;
    setDependencyList(prev => [{ id: Date.now(), ...newDep, priority: "High", node: "General" }, ...prev]);
    setNewDep({ title: "", type: "Hiring", priority: "High", node: "General" });
    setIsAddingDep(false);
  };

  const removeDependency = (id: number) => {
    setDependencyList(dependencyList.filter(d => d.id !== id));
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#E53935]/10 overscroll-none pb-40">
      
      {/* EXECUTIVE HEADER */}
      <div className="relative h-[360px] w-full overflow-hidden bg-[#292828] shadow-2xl">
         {/* Premium Backdrop */}
         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#E53935]/20 opacity-80" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale" />
         
         {/* Identity Container */}
         <div className="max-w-[1240px] mx-auto px-6 h-full flex flex-col justify-center relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
               {/* Cinematic Avatar Hub */}
               <div className="relative shrink-0 group cursor-pointer" onClick={handleAvatarClick}>
                  <div className="h-52 w-52 rounded-full bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-2xl p-2 shadow-4xl relative z-10 border border-white/20 ring-4 ring-white/10 ring-offset-8 ring-offset-[#292828] flex items-center justify-center overflow-hidden">
                     {userData.avatar_url ? (
                        <img src={userData.avatar_url} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" alt="" />
                     ) : (
                        <User size={80} className="text-white/20" />
                     )}
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={32} className="text-white" />
                     </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                  <div className="absolute top-4 right-4 h-10 w-10 bg-white border-2 border-[#E53935] rounded-full flex items-center justify-center text-[#E53935] shadow-2xl z-20 animate-bounce-slow">
                     <Award size={20} />
                  </div>
               </div>

               <div className="text-center md:text-left flex-1">
                  <div className="flex flex-col gap-5 mb-2">
                     <h1 className="text-6xl font-black text-white leading-none -">{userData.name}</h1>
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
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="h-16 px-10 bg-white text-[#292828] rounded-full font-black text-xs uppercase shadow-2xl hover:bg-[#E53935] hover:text-white transition-all transform hover:-translate-y-1"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setShowSettingsModal(true)}
                    className="h-16 w-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#292828] transition-all overflow-hidden relative group"
                  >
                     <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* MAIN CONTENT ARCHITECTURE */}
      <div className="max-w-[1440px] mx-auto px-6 -mt-14 relative z-20 pb-40">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: IDENTITY & DOCK (LEFT 3/12) */}
            <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
               
               {/* ABOUT CARD */}
               <div className="bg-white rounded-[1.625rem] p-8 shadow-xl border border-[#292828]/10 hover:shadow-2xl transition-shadow">
                  <h3 className="text-[10px] font-black text-[#292828]/40 uppercase mb-5 flex items-center gap-2">
                     <div className="h-1 w-3 bg-[#E53935] rounded-full" />
                     About Me
                  </h3>
                  <p className="text-[15px] text-[#292828] font-medium leading-[1.7]">
                     {userData.bio}
                  </p>
                  
                  <div className="mt-8 pt-8 border-t border-[#292828]/5 space-y-5">
                     {contactInfo.map((info, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer">
                           <div className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all">
                              <info.icon size={16} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-black text-[#292828]/40 uppercase leading-none mb-1">{info.label}</p>
                              <p className={cn(
                                 "text-[12px] font-bold truncate",
                                 info.link ? "text-[#E53935]" : "text-[#292828]"
                              )}>{info.value}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* QUICK ACTIONS DOCK */}
               <div className="bg-[#292828] rounded-[1.625rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                     <Plus size={120} strokeWidth={1} />
                  </div>
                  <div className="relative z-10">
                     <h3 className="text-[10px] font-black uppercase text-white/40 mb-6 leading-none">Quick Actions</h3>
                     <div className="space-y-3">
                        <button onClick={() => setIsAddingDep(true)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group/btn">
                           <span className="text-[11px] font-bold text-[#E53935]">Post a Need</span>
                           <Plus size={14} className="text-[#E53935] group-hover/btn:rotate-90 transition-transform" />
                        </button>
                        <Link href="/wallet" className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group/btn">
                           <span className="text-[11px] font-bold">My Wallet</span>
                           <ChevronRight size={14} className="text-white/20 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full mt-6 py-4 bg-[#E53935] rounded-xl font-black text-[10px] uppercase shadow-2xl hover:bg-white hover:text-[#E53935] transition-all">
                           Log Out
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* COLUMN 2: COMMAND FEED (CENTER 6/12) */}
            <div className="lg:col-span-6 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
               
               {/* NEEDS LIST (PRIMARY ACTION) */}
               <div className="bg-white rounded-[1.625rem] p-10 border border-[#292828]/10 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="text-xs font-black uppercase text-[#292828] flex items-center gap-3">
                           <Target size={18} className="text-[#E53935]" /> Current Needs
                        </h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase mt-2 leading-none opacity-60">Broadcasting to your network</p>
                     </div>
                     <button 
                       onClick={() => setIsAddingDep(!isAddingDep)}
                       className="h-10 px-6 bg-[#292828] text-white rounded-xl text-[10px] font-black uppercase hover:bg-[#E53935] transition-all flex items-center gap-2 shadow-xl"
                     >
                        {isAddingDep ? <X size={14} /> : <Plus size={14} />} {isAddingDep ? "Cancel" : "Add Need"}
                     </button>
                  </div>

                  {isAddingDep && (
                     <div className="mb-8 p-8 bg-slate-50 rounded-3xl border border-[#292828]/5 animate-in fade-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                           <input 
                              type="text" 
                              placeholder="What do you need?" 
                              value={newDep.title}
                              onChange={(e) => setNewDep({...newDep, title: e.target.value})}
                              className="w-full h-12 px-5 rounded-xl border border-slate-200 text-sm font-bold focus:border-[#E53935] outline-none transition-colors"
                           />
                           <select 
                              value={newDep.type}
                              onChange={(e) => setNewDep({...newDep, type: e.target.value})}
                              className="h-12 px-4 rounded-xl border border-slate-200 text-[10px] font-black uppercase outline-none focus:border-[#E53935]"
                           >
                              <option>Hiring</option>
                              <option>Partnership</option>
                              <option>Procurement</option>
                              <option>Investment</option>
                              <option>Technology</option>
                           </select>
                        </div>
                        <button 
                           onClick={addDependency}
                           className="w-full h-14 bg-[#E53935] text-white rounded-xl text-[10px] font-black uppercase hover:bg-[#292828] transition-all shadow-xl shadow-red-500/10"
                        >
                           Post Now
                        </button>
                     </div>
                  )}

                  <div className="space-y-4">
                     {dependencyList.map(dep => (
                        <div key={dep.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-[#E53935]/30 hover:bg-white transition-all cursor-default">
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
                                    <h4 className="text-[14px] font-black text-[#292828]">{dep.title}</h4>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">{dep.node} Node</p>
                                    <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                    <p className="text-[9px] font-black text-[#E53935] uppercase">{dep.priority} Priority</p>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[8px] font-black uppercase border border-green-100 hidden sm:flex items-center gap-1">
                                 <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse" /> Active
                              </div>
                              <button onClick={() => removeDependency(dep.id)} className="text-slate-200 hover:text-[#E53935] transition-colors p-2"><X size={16} /></button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* RECENT HISTORY TIMELINE */}
               <div className="bg-white rounded-[1.625rem] p-10 border border-[#292828]/10 shadow-xl">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xs font-black uppercase text-[#292828] flex items-center gap-3">
                        <Activity size={18} className="text-[#E53935]" /> My History
                     </h3>
                     <Link href="/history" className="text-[8px] font-black text-slate-400 uppercase hover:text-[#E53935] transition-colors opacity-60">Full Archive</Link>
                  </div>
                  <div className="space-y-8">
                     {[
                        { title: "Partnered with Kerala Logistics", time: "2 hours ago", node: "Logistics" },
                        { title: "Security Verification Complete", time: "1 day ago", node: "Trust" },
                        { title: "Profile Authority Boosted", time: "3 days ago", node: "System" },
                     ].map((item, i) => (
                        <div key={i} className="flex gap-6 relative group">
                           {i !== 2 && <div className="absolute left-1.5 top-8 bottom-[-24px] w-0.5 bg-slate-100" />}
                           <div className="h-3 w-3 rounded-full bg-[#E53935] shadow-[0_0_10px_rgba(229,57,53,0.3)] mt-1.5 ring-4 ring-white relative z-10" />
                           <div className="flex-1">
                              <p className="text-[14px] font-black text-[#292828] leading-tight group-hover:text-[#E53935] transition-colors">{item.title}</p>
                              <div className="flex items-center gap-3 mt-2">
                                 <span className="text-[9px] font-black text-slate-400 uppercase">{item.time}</span>
                                 <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                 <span className="text-[9px] font-black text-[#E53935]/60 uppercase">{item.node}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>

            {/* COLUMN 3: PERFORMANCE & GROWTH (RIGHT 3/12) */}
            <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
               
               {/* PERFORMANCE STATS */}
               <div className="space-y-4">
                  {performanceMetrics.map((met, i) => (
                     <div key={i} className="bg-white p-6 rounded-[1.3rem] border border-[#292828]/10 shadow-lg group hover:bg-[#292828] transition-all duration-500 cursor-default">
                        <div className="flex items-center justify-between mb-4">
                           <div className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#E53935] group-hover:bg-white/10 transition-all">
                              <met.icon size={18} />
                           </div>
                           <span className="text-xl font-black text-[#292828] group-hover:text-white transition-colors">{met.value}%</span>
                        </div>
                        <p className="text-[9px] font-black text-[#292828]/40 uppercase group-hover:text-white/40 transition-colors">{met.label}</p>
                        <div className="h-1 w-full bg-[#292828]/5 group-hover:bg-white/10 rounded-full mt-3 overflow-hidden transition-colors">
                           <div className={cn("h-full rounded-full transition-all duration-1000", met.color)} style={{ width: `${met.value}%` }} />
                        </div>
                     </div>
                  ))}
               </div>

               {/* LEVEL UP PROGRESS */}
               <div className="bg-white rounded-[1.625rem] p-8 shadow-xl border border-[#292828]/10">
                  <h3 className="text-[10px] font-black text-[#292828] uppercase mb-6 flex items-center gap-2 leading-none">
                     <TrendingUp size={16} className="text-[#E53935]" /> My Progress
                  </h3>
                  <div className="space-y-5">
                     {[
                        { label: "Completion", val: "42/50", progress: 84 },
                        { label: "Matches", val: "12/15", progress: 75 },
                        { label: "Velocity", val: "Elite", progress: 95 },
                     ].map((param, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
                              <span>{param.label}</span>
                              <span className="text-[#292828]">{param.val}</span>
                           </div>
                           <div className="h-1 w-full bg-[#292828]/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#E53935] rounded-full transition-all duration-1000" style={{ width: `${param.progress}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>
                  <button className="w-full mt-8 py-4 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase text-[#292828] hover:bg-[#E53935] hover:text-white transition-all shadow-sm">
                     View All Milestones
                  </button>
               </div>

               {/* FOOTNOTE ACHIEVEMENTS */}
               <div className="bg-[#E53935] rounded-[1.625rem] p-8 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                  <div className="absolute -right-4 -bottom-4 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                     <Award size={120} />
                  </div>
                  <p className="text-[9px] font-black uppercase text-white/60 mb-1">Merit Rank</p>
                  <h4 className="text-xl font-black uppercase leading-tight mb-4">Elite Tier Achievement</h4>
                  <p className="text-[11px] font-medium text-white/80 leading-[1.6]">You are performing in the top 12% of professional partners in this region.</p>
               </div>

            </div>

         </div>
      </div>

      {/* MODALS */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xl bg-white rounded-[1.95rem] p-12 shadow-4xl animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-2xl font-black text-[#292828] uppercase">Edit <span className="text-[#E53935]">Profile</span></h2>
                 <button onClick={() => setShowEditModal(false)} className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#292828] hover:bg-[#E53935] hover:text-white transition-all"><X size={20} /></button>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Full Name</label>
                    <input 
                      type="text" 
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all"
                    />
                 </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Professional Title</label>
                        <select 
                          value={userData.role}
                          onChange={(e) => {
                             const newRole = e.target.value;
                             setUserData({...userData, role: newRole});
                             if (roleDefaults[newRole as keyof typeof roleDefaults]) {
                               setDependencyList(roleDefaults[newRole as keyof typeof roleDefaults]);
                             }
                          }}
                          className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#292828] outline-none focus:border-[#E53935] appearance-none"
                        >
                           <option>SEO</option>
                           <option>IT</option>
                           <option>Sales</option>
                           <option>Doctor</option>
                           <option>Advocate</option>
                           <option>Business</option>
                           <option>Student</option>
                           <option>CEO</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Company</label>
                        <input 
                          type="text" 
                          value={userData.company}
                          onChange={(e) => setUserData({...userData, company: e.target.value})}
                          className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#292828] outline-none focus:border-[#E53935]"
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Checkout Rank</label>
                        <input 
                          type="text" 
                          placeholder="#01"
                          value={userData.checkoutRank}
                          onChange={(e) => setUserData({...userData, checkoutRank: e.target.value})}
                          className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#292828] outline-none focus:border-[#E53935]"
                        />
                     </div>
                     <div className="flex items-end pb-1">
                        <p className="text-[9px] font-medium text-slate-400 italic">Changing your title will reset your Needs list to role defaults.</p>
                     </div>
                  </div>
                 <div>
                  <div>
                     <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Avatar URL (Optional)</label>
                     <input 
                       type="text" 
                       value={userData.avatar_url}
                       onChange={(e) => setUserData({...userData, avatar_url: e.target.value})}
                       placeholder="https://..."
                       className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#292828] outline-none focus:border-[#E53935]"
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Executive Bio</label>
                     <textarea 
                       rows={4}
                       value={userData.bio}
                       onChange={(e) => setUserData({...userData, bio: e.target.value})}
                       className="w-full p-5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-[#292828] outline-none focus:border-[#E53935] transition-all"
                     />
                  </div>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full h-16 bg-[#E53935] text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-[#292828] transition-all disabled:opacity-50"
                  >
                     {isSaving ? "Saving..." : "Save Profile"}
                  </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xl bg-white rounded-[1.95rem] p-12 shadow-4xl animate-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-2xl font-black text-[#292828] uppercase">Account <span className="text-[#E53935]">Settings</span></h2>
                 <button onClick={() => setShowSettingsModal(false)} className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#292828] hover:bg-[#E53935] hover:text-white transition-all"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                 {[
                   { label: "Alert Settings", desc: "Choose how you get notified" },
                   { label: "Privacy Mode", desc: "Manage who can see your profile" },
                   { label: "Security", desc: "Change password and protect account" },
                   { label: "Billing", desc: "Manage your payments and plan" },
                 ].map((opt, i) => (
                    <button key={i} className="w-full p-6 bg-slate-50 hover:bg-[#292828]/5 rounded-2xl border border-slate-100 transition-all flex items-center justify-between group">
                       <div className="text-left">
                          <p className="text-sm font-black text-[#292828]">{opt.label}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{opt.desc}</p>
                       </div>
                       <ChevronRight size={18} className="text-slate-300 group-hover:text-[#E53935] group-hover:translate-x-1 transition-all" />
                    </button>
                 ))}
                 <button className="w-full mt-6 h-16 border-2 border-[#E53935]/10 text-[#E53935] rounded-2xl font-black text-xs uppercase hover:bg-red-50 transition-all">
                    Deactivate Profile
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
