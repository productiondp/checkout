"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  Target, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Command,
  Sparkles,
  Search,
  Globe,
  Award,
  Users,
  Calendar,
  Zap,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";
type Role = "Business" | "Professional" | "Student" | "Advisor";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as AuthMode) || "signin";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<Role>("Business");
  
  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mock API delayed response
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setTimeout(() => router.push("/home"), 1000);
    } catch (err) {
      setError("Authentication failure. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const VISUAL_CARDS = [
     { label: "Networking", icon: Users, desc: "Connect with regional experts." },
     { label: "Business Leads", icon: Target, desc: "Direct mandates & alliance opportunities." },
     { label: "Meetups", icon: Calendar, desc: "High-density local business events." }
  ];

  return (
    <div className="flex h-screen w-screen bg-[#FDFDFF] text-[#292828] font-sans overflow-hidden">
      
      {/* LEFT COLUMN: VISUAL BRAND HUB */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] relative flex-col justify-between p-16 overflow-hidden">
         {/* Background Orbs */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E53935]/[0.05] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
         <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px]" />
         
         {/* Brand Logo */}
         <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3">
               <div className="h-10 w-10 bg-[#E53935] rounded-xl flex items-center justify-center text-white shadow-2xl shadow-red-500/20">
                  <Command size={22} strokeWidth={3} />
               </div>
               <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Checkout</h1>
            </Link>
         </div>

         {/* Content Nodes */}
         <div className="relative z-10 space-y-12">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                  <Sparkles size={12} className="text-[#E53935]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified Local Link Standard</span>
               </div>
               <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white">
                  Join the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">Elite Hub.</span>
               </h2>
               <p className="text-xl font-medium text-white/30 max-w-lg leading-relaxed">
                  Authorize your presence in the most authoritative regional business node. Networking, Leads, and Meetings simplified.
               </p>
            </div>

            <div className="space-y-4">
               {VISUAL_CARDS.map((card, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-3xl group hover:bg-white/10 transition-all duration-500">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#E53935] group-hover:bg-[#E53935]/5 transition-all">
                       <card.icon size={24} />
                    </div>
                    <div>
                       <h4 className="text-xl font-black uppercase tracking-tight text-white/80">{card.label}</h4>
                       <p className="text-sm font-bold text-white/20 uppercase tracking-widest">{card.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Footer Sync */}
         <div className="relative z-10 flex items-center gap-10">
            <div className="flex items-center gap-3">
               <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Mumbai Node Active</span>
            </div>
            <div className="h-1 w-1 bg-white/10 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">v.8.0.01 Production</span>
         </div>
      </div>

      {/* RIGHT COLUMN: AUTH TERMINAL */}
      <div className="flex-1 flex flex-col justify-between p-10 lg:p-20 relative overflow-y-auto no-scrollbar">
         
         {/* Mobile Brand Link */}
         <div className="lg:hidden mb-12">
            <Link href="/" className="flex items-center gap-3">
               <div className="h-10 w-10 bg-[#E53935] rounded-xl flex items-center justify-center text-white">
                  <Command size={22} strokeWidth={3} />
               </div>
               <h1 className="text-2xl font-black uppercase tracking-tighter">Checkout</h1>
            </Link>
         </div>

         <div className="max-w-md mx-auto w-full space-y-12 my-auto">
            
            {/* Header Content */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">
                     {mode === "signin" ? "Login" : "Join"}
                  </h2>
                  <button 
                    onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                    className="text-[11px] font-black uppercase text-[#E53935] underline underline-offset-8"
                  >
                     {mode === "signin" ? "Need an Account?" : "Have an Account?"}
                  </button>
               </div>
               <p className="text-lg font-bold text-[#292828]/40 uppercase tracking-tight leading-tight">
                  {mode === "signin" 
                    ? "Welcome back to the regional hub." 
                    : "Become a verified node in your city network."
                  }
               </p>
            </div>

            {/* Role Discovery (Only for Join) */}
            <div className={cn("space-y-4 transition-all duration-500", mode === "signup" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 h-0 overflow-hidden")}>
               <p className="text-[10px] font-black uppercase text-[#292828]/20 tracking-[0.5em]">Initialization Perspective</p>
               <div className="grid grid-cols-2 gap-3">
                  {(["Business", "Professional", "Student", "Advisor"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={cn(
                        "flex flex-col items-start p-6 rounded-3xl border-2 transition-all text-left group",
                        role === r 
                          ? "bg-[#292828] border-black text-white shadow-2xl" 
                          : "bg-white border-slate-100 text-[#292828] hover:border-[#292828]/20"
                      )}
                    >
                       <div className={cn(
                         "h-10 w-10 mb-4 rounded-xl flex items-center justify-center transition-all",
                         role === r ? "bg-white/10 text-white" : "bg-slate-50 text-slate-300 group-hover:text-[#E53935]"
                       )}>
                          {r === "Business" && <Briefcase size={18} />}
                          {r === "Professional" && <User size={18} />}
                          {r === "Student" && <Award size={18} />}
                          {r === "Advisor" && <ShieldCheck size={18} />}
                       </div>
                       <span className="text-[11px] font-black uppercase tracking-widest">{r}</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
               {error && (
                 <div className="p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600 text-sm font-bold animate-pulse">
                    <AlertCircle size={20} /> {error}
                 </div>
               )}

               {isSuccess && (
                 <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4 text-emerald-600 text-sm font-bold">
                    <CheckCircle2 size={20} /> Success. Authorizing node access...
                 </div>
               )}

               <div className="space-y-4">
                  {mode === "signup" && (
                    <div className="relative group">
                       <input 
                         type="text" 
                         name="fullName"
                         value={formData.fullName}
                         onChange={handleInputChange}
                         placeholder="FULL NAME"
                         className="w-full h-20 bg-white border-2 border-slate-100 rounded-[2rem] px-10 text-[14px] font-black uppercase tracking-widest outline-none focus:border-[#292828] transition-all"
                         required
                       />
                       <User size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#292828] transition-colors" />
                    </div>
                  )}

                  <div className="relative group">
                     <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="EMAIL ADDRESS"
                        className="w-full h-20 bg-white border-2 border-slate-100 rounded-[2rem] px-10 text-[14px] font-black uppercase tracking-widest outline-none focus:border-[#292828] transition-all"
                        required
                     />
                     <Mail size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#292828] transition-colors" />
                  </div>

                  <div className="relative group">
                     <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="SECURITY KEY"
                        className="w-full h-20 bg-white border-2 border-slate-100 rounded-[2rem] px-10 text-[14px] font-black uppercase tracking-widest outline-none focus:border-[#292828] transition-all font-mono"
                        required
                     />
                     <Lock size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#292828] transition-colors" />
                  </div>
               </div>

               {mode === "signin" && (
                 <div className="flex justify-end px-2">
                    <button type="button" className="text-[10px] font-black text-[#292828]/30 uppercase tracking-widest hover:text-[#E53935]">Forgot Credentials?</button>
                 </div>
               )}

               <button 
                 type="submit"
                 disabled={isLoading || isSuccess}
                 className={cn(
                   "w-full h-20 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] shadow-4xl active:scale-95 transition-all flex items-center justify-center gap-5 mt-8",
                   isLoading ? "bg-slate-100 text-slate-400" : "bg-[#292828] text-white hover:bg-[#E53935]"
                 )}
               >
                  {isLoading ? "Synchronizing..." : (mode === "signin" ? "Authorize" : "Initialize")}
                  {!isLoading && <ArrowRight size={20} />}
               </button>
            </form>

            {/* Social Hub */}
            <div className="space-y-6">
               <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.4em] text-[#292828]/20">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <span className="relative bg-[#FDFDFF] px-8">Identity Sync</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <button className="h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest hover:border-[#292828]/20 transition-all">
                     <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="" className="h-5 w-5" />
                     Google
                  </button>
                  <button className="h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest hover:border-[#292828]/20 transition-all">
                     <Fingerprint size={18} className="text-[#E53935]" />
                     Passkey
                  </button>
               </div>
            </div>
         </div>

         {/* Final Footer Label */}
         <div className="text-center mt-12 pb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#292828]/20">Local Link Standard Terminal © 2026</p>
         </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-widest">Initialising Terminal...</div>}>
      <AuthContent />
    </Suspense>
  );
}
