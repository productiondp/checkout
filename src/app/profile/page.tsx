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
  Megaphone,
  BrainCircuit
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
     website: "",
     skills: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (!profile) {
        // Fallback
        const { data: newProfile } = await supabase.from('profiles').insert([{
           id: user.id,
           full_name: user.user_metadata?.full_name || 'Community Elite',
           role: user.user_metadata?.role || 'PROFESSIONAL',
           location: 'Trivandrum',
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
          website: profile.website || "zenithtech.io",
          skills: profile.skills || []
        });
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async (updatedData?: any) => {
    const dataToSave = updatedData || userData;
    if (!dataToSave.id) {
       alert("Profile ID not found. Please refresh and try again.");
       return;
    }
    
    setIsSaving(true);
    
    const systemRole = ["ADVISOR", "STUDENT", "BUSINESS"].includes(dataToSave.role.toUpperCase()) 
      ? dataToSave.role.toUpperCase() 
      : "PROFESSIONAL";

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: dataToSave.name,
        role: systemRole,
        bio: dataToSave.bio,
        location: dataToSave.location,
        avatar_url: dataToSave.avatar_url,
        skills: dataToSave.skills
      })
      .eq('id', dataToSave.id);

    if (error) {
      console.error("Save Error:", error);
      alert("Failed to save profile: " + error.message);
    } else {
      setUserData(dataToSave);
      setShowEditModal(false);
      // Optional: Refresh the window to sync GlobalHeader immediately
      window.dispatchEvent(new Event('profile-updated'));
    }
    setIsSaving(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const b64 = event.target?.result as string;
      const nextState = { ...userData, avatar_url: b64 };
      setUserData(nextState);
      // Immediate persistence for avatar
      await handleSaveProfile(nextState);
    };
    reader.readAsDataURL(file);
  };

  const [dependencyList, setDependencyList] = useState(roleDefaults["SEO"]);
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
         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#E53935]/20 opacity-80" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale" />
         
         <div className="max-w-[1240px] mx-auto px-6 h-full flex flex-col justify-center relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
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
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
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

      {/* MAIN CONTENT ARCHITECTURE */}
      <div className="max-w-[1440px] mx-auto px-6 -mt-14 relative z-20 pb-40">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: SIDEBAR */}
            <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
               
               {/* STRATEGIC INTERESTS (Neural Input) */}
               <div className="bg-white rounded-[1.625rem] p-8 shadow-xl border border-[#292828]/10 mb-8 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-[10px] font-black text-[#292828]/40 uppercase mb-6 flex items-center gap-3">
                     <BrainCircuit size={16} className="text-[#E53935]" /> Strategic Nodes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {userData.skills && userData.skills.length > 0 ? userData.skills.map(skill => (
                       <span key={skill} className="px-4 py-2 bg-[#292828]/5 border border-[#292828]/10 rounded-xl text-[11px] font-bold text-[#292828] uppercase">{skill}</span>
                     )) : (
                       <p className="text-[11px] font-bold text-slate-300 italic px-2">No nodes defined. Update profile to activate matching.</p>
                     )}
                  </div>
                  <button onClick={() => setShowEditModal(true)} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-[#E53935] transition-all">
                    Update Market Nodes
                  </button>
               </div>

               <div className="bg-white rounded-[1.625rem] p-8 shadow-xl border border-[#292828]/10">
                  <h3 className="text-[10px] font-black text-[#292828]/40 uppercase mb-5 flex items-center gap-2">
                     <div className="h-1 w-3 bg-[#E53935] rounded-full" /> About Me
                  </h3>
                  <p className="text-[15px] text-[#292828] font-medium leading-[1.7]">{userData.bio}</p>
                  <div className="mt-8 pt-8 border-t border-[#292828]/5 space-y-5">
                     {contactInfo.map((info, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer">
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

            {/* COLUMN 2: COMMAND FEED */}
            <div className="lg:col-span-6 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
               <div className="bg-white rounded-[1.625rem] p-10 border border-[#292828]/10 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="text-xs font-black uppercase text-[#292828] flex items-center gap-3"><Target size={18} className="text-[#E53935]" /> Current Needs</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase mt-2 leading-none opacity-60">Broadcasting leads to your network</p>
                     </div>
                     <button onClick={() => setIsAddingDep(!isAddingDep)} className="h-10 px-6 bg-[#292828] text-white rounded-xl text-[10px] font-black uppercase hover:bg-[#E53935] transition-all flex items-center gap-2 shadow-xl">
                        {isAddingDep ? <X size={14} /> : <Plus size={14} />} {isAddingDep ? "Cancel" : "Add Need"}
                     </button>
                  </div>

                  {isAddingDep && (
                     <div className="mb-8 p-8 bg-slate-50 rounded-3xl border border-[#292828]/5 animate-in fade-in slide-in-from-top-4">
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
                     {dependencyList.map(dep => (
                        <div key={dep.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-[#E53935]/30 transition-all cursor-default">
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
                           <button onClick={() => removeDependency(dep.id)} className="text-slate-200 hover:text-[#E53935] transition-colors p-2"><X size={16} /></button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* COLUMN 3: PERFORMANCE */}
            <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
               <div className="space-y-4">
                  {performanceMetrics.map((met, i) => (
                     <div key={i} className="bg-white p-6 rounded-[1.3rem] border border-[#292828]/10 shadow-lg group hover:bg-[#292828] transition-all duration-500 cursor-default">
                        <div className="flex items-center justify-between mb-4">
                           <div className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#E53935] group-hover:bg-white/10 transition-all"><met.icon size={18} /></div>
                           <span className="text-xl font-black text-[#292828] group-hover:text-white transition-colors">{met.value}%</span>
                        </div>
                        <p className="text-[9px] font-black text-[#292828]/40 uppercase group-hover:text-white/40 transition-colors">{met.label}</p>
                        <div className="h-1 w-full bg-[#292828]/5 group-hover:bg-white/10 rounded-full mt-3 overflow-hidden">
                           <div className={cn("h-full rounded-full transition-all duration-1000", met.color)} style={{ width: `${met.value}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-white rounded-[1.95rem] p-12 shadow-4xl animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-2xl font-black text-[#292828] uppercase">Edit <span className="text-[#E53935]">Profile</span></h2>
                 <button onClick={() => setShowEditModal(false)} className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center"><X size={20} /></button>
              </div>
              <div className="space-y-8">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Full Name</label>
                    <input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#292828] outline-none focus:border-[#E53935]" />
                 </div>
                 
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block">Strategic Alignment (Neural Interests)</label>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[
                        "Capital & Investment", "Marketing & Growth", "Technology & AI", 
                        "Logistics & Supply", "Real Estate & Infra", "Legal & Compliance", 
                        "Human Resources", "Strategic Sales"
                      ].map(interest => (
                        <button
                          key={interest}
                          onClick={() => {
                            const current = userData.skills;
                            if (current.includes(interest)) {
                              setUserData({...userData, skills: current.filter(s => s !== interest)});
                            } else {
                              setUserData({...userData, skills: [...current, interest]});
                            }
                          }}
                          className={cn(
                            "px-4 py-3 rounded-xl border text-[10px] font-black uppercase transition-all flex items-center justify-between group",
                            userData.skills.includes(interest) 
                              ? "bg-[#292828] text-white border-[#292828]" 
                              : "bg-slate-50 text-slate-400 border-slate-200 hover:border-[#E53935]"
                          )}
                        >
                          {interest}
                          {userData.skills.includes(interest) ? <CheckCircle2 size={12} className="text-[#E53935]" /> : <Plus size={12} className="opacity-40" />}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 bg-red-50 text-[#E53935] rounded-xl border border-red-100 italic text-[10px] font-bold uppercase">
                       Selecting these nodes will mathematically re-rank your Neural Match feed instantly.
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Executive Bio</label>
                    <textarea rows={4} value={userData.bio} onChange={(e) => setUserData({...userData, bio: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-[#292828] outline-none focus:border-[#E53935]" />
                 </div>
                 
                 <button onClick={handleSaveProfile} disabled={isSaving} className="w-full h-16 bg-[#E53935] text-white rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-[#292828] transition-all">
                    {isSaving ? "Synchronizing..." : "Save & Sync Neural Profile"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
