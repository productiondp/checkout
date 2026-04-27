"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Briefcase,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Loader2,
  Activity,
  Zap,
  Globe,
  Shield,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "signin" | "signup";
type Role = "Business" | "Professional" | "Student" | "Advisor";

const ROLES: { value: Role; icon: any; desc: string }[] = [
  { value: "Business", icon: Briefcase, desc: "Hire & Scale" },
  { value: "Professional", icon: User, desc: "Work & Solve" },
  { value: "Advisor", icon: ShieldCheck, desc: "Guide & Consult" },
  { value: "Student", icon: Award, desc: "Learn & Grow" },
];

function AuthContent() {
  const router = useRouter();
  const { authState, loading: authLoading, initAuth } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [role, setRole] = useState<Role>("Business");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const supabase = createClient();

  useEffect(() => { setMounted(true); }, []);

  if (authLoading || !mounted) return null;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.fullName || "New Partner", role: role.toUpperCase() } },
        });
        if (signUpError) throw signUpError;
        if (authData.user) {
          await supabase.from("profiles").upsert({
            id: authData.user.id,
            full_name: formData.fullName || "New Partner",
            role: role.toUpperCase(),
            location: "Trivandrum",
          });
        }
        setIsSuccess(true);
        await initAuth();
      } else {
        const { data: { session: currentSession }, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (signInError) throw signInError;
        setIsSuccess(true);
        if (currentSession) {
          await initAuth();
        }
      }
    } catch (err: any) {
      setError(err.message || "Operation failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans selection:bg-[#FF3B30]/10 relative overflow-x-hidden">
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 inset-x-0 h-16 z-50 px-6 lg:px-12 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#FF3B30] rounded-lg flex items-center justify-center shadow-lg shadow-[#FF3B30]/20">
               <Terminal size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black font-outfit uppercase tracking-tighter text-[#1A1A1A]">Check<span className="text-[#FF3B30]">Out</span></span>
         </div>
         <div className="flex items-center gap-6">
            <button 
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
              className="text-[11px] font-black uppercase text-slate-500 hover:text-[#1A1A1A] transition-colors"
            >
              {mode === "signin" ? "Join Network" : "Login"}
            </button>
         </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 pt-16 min-h-screen flex items-center justify-center">
         <div className="max-w-7xl w-full px-6 lg:px-12 py-10 lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* ── LEFT SIDE ── */}
            <div className="space-y-8 text-center lg:text-left">
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-4"
               >
                  <div className="inline-flex items-center gap-3 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[#FF3B30] text-[10px] font-black uppercase mx-auto lg:mx-0">
                     <Sparkles size={12} />
                     Unified Business Network
                  </div>
                  
                  <h1 className="text-6xl sm:text-7xl lg:text-[100px] font-black uppercase leading-[0.8] font-outfit text-[#1A1A1A] tracking-tighter">
                     Connect. <br />
                     <span className="text-[#FF3B30]">Grow.</span> <br />
                     Succeed.
                  </h1>
                  
                  <p className="text-slate-500 font-bold text-xl lg:text-2xl leading-tight max-w-md mx-auto lg:mx-0">
                     The simple way to find people and grow your business together.
                  </p>
               </motion.div>

               <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                  {[
                    { icon: Globe, label: "Network", desc: "Local reach" },
                    { icon: Zap, label: "Match", desc: "Fast sync" },
                    { icon: Shield, label: "Secure", desc: "Verified" },
                    { icon: Activity, label: "Live", desc: "Real-time" }
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group">
                       <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-[#FF3B30]/10 group-hover:text-[#FF3B30] transition-colors">
                          <f.icon size={20} />
                       </div>
                       <div>
                          <p className="text-[11px] font-black uppercase text-[#1A1A1A]">{f.label}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{f.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* ── RIGHT SIDE ── */}
            <div className="w-full flex justify-center lg:justify-end">
               <motion.div
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="w-full max-w-[550px] bg-white border border-slate-100 rounded-lg p-8 lg:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
               >
                  <AnimatePresence mode="wait">
                     {isSuccess ? (
                        <motion.div 
                          key="success"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-12 space-y-8"
                        >
                           <div className="h-20 w-20 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto border border-emerald-100 shadow-xl shadow-emerald-500/10">
                              <CheckCircle2 size={40} className="text-emerald-500" />
                           </div>
                           <div className="space-y-2">
                              <h2 className="text-3xl font-black text-[#1A1A1A] uppercase font-outfit">Ready</h2>
                              <p className="text-slate-400 text-[11px] font-black uppercase animate-pulse">Entering System...</p>
                           </div>
                        </motion.div>
                     ) : (
                        <motion.div 
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-8"
                        >
                           <header className="space-y-2 text-center lg:text-left">
                              <h2 className="text-4xl lg:text-5xl font-black text-[#1A1A1A] uppercase font-outfit tracking-tighter leading-none">
                                 {mode === "signup" ? "Join" : "Login"}
                              </h2>
                              <p className="text-slate-500 text-[11px] font-black uppercase tracking-wider">
                                 {mode === "signup" ? "Create your professional account" : "Welcome back to the grid"}
                              </p>
                           </header>

                           {error && (
                              <div className="p-4 bg-red-50 border border-red-100 text-[#FF3B30] text-[10px] font-black uppercase rounded-lg">
                                 {error}
                              </div>
                           )}

                           <form onSubmit={handleSubmit} className="space-y-6">
                              {mode === "signup" && (
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Select Role</label>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                       {ROLES.map((r) => (
                                          <button
                                             key={r.value}
                                             type="button"
                                             onClick={() => setRole(r.value)}
                                             className={cn(
                                                "flex flex-col gap-2 p-3 rounded-lg border transition-all text-left relative overflow-hidden h-24 justify-center group",
                                                role === r.value
                                                   ? "border-[#FF3B30] bg-[#FF3B30]/5 text-[#FF3B30]"
                                                   : "border-slate-100 bg-slate-50 text-slate-400 hover:bg-white hover:border-slate-200"
                                             )}
                                          >
                                             <r.icon size={18} className={cn("transition-colors", role === r.value ? "text-[#FF3B30]" : "text-slate-300 group-hover:text-slate-500")} />
                                             <p className="text-[12px] font-black uppercase leading-none">{r.value}</p>
                                             {role === r.value && <div className="absolute top-0 right-0 h-1 w-full bg-[#FF3B30]" />}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              <div className="space-y-4">
                                 {mode === "signup" && (
                                    <div className="relative group">
                                       <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF3B30] transition-colors" />
                                       <input
                                          type="text"
                                          name="fullName"
                                          value={formData.fullName}
                                          onChange={handleInput}
                                          placeholder="Full Name"
                                          className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-lg text-[14px] font-bold text-[#1A1A1A] placeholder:text-slate-300 outline-none focus:border-[#FF3B30]/20 focus:bg-white transition-all shadow-sm"
                                          required
                                       />
                                    </div>
                                 )}

                                 <div className="relative group">
                                    <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF3B30] transition-colors" />
                                    <input
                                       autoFocus={mode === "signin"}
                                       type="email"
                                       name="email"
                                       value={formData.email}
                                       onChange={handleInput}
                                       placeholder="Email Address"
                                       className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-lg text-[14px] font-bold text-[#1A1A1A] placeholder:text-slate-300 outline-none focus:border-[#FF3B30]/20 focus:bg-white transition-all shadow-sm"
                                       required
                                    />
                                 </div>

                                 <div className="relative group">
                                    <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF3B30] transition-colors" />
                                    <input
                                       type={showPassword ? "text" : "password"}
                                       name="password"
                                       value={formData.password}
                                       onChange={handleInput}
                                       placeholder="Password"
                                       className="w-full h-14 pl-14 pr-16 bg-slate-50 border border-slate-100 rounded-lg text-[14px] font-bold text-[#1A1A1A] placeholder:text-slate-300 outline-none focus:border-[#FF3B30]/20 focus:bg-white transition-all shadow-sm"
                                       required
                                    />
                                    <button
                                       type="button"
                                       onClick={() => setShowPassword(!showPassword)}
                                       className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#1A1A1A] transition-colors p-2"
                                    >
                                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                 </div>
                              </div>

                              <button
                                 type="submit"
                                 disabled={isLoading}
                                 className="w-full h-16 bg-[#FF3B30] hover:bg-[#D32F2F] text-white font-black text-[15px] uppercase rounded-lg flex items-center justify-center gap-4 transition-all shadow-xl shadow-[#FF3B30]/20 disabled:opacity-50 mt-4 active:scale-95"
                              >
                                 {isLoading ? (
                                   <Loader2 className="animate-spin" size={24} />
                                 ) : (
                                   <>
                                     <span>{mode === "signup" ? "Join Network" : "Login"}</span>
                                     <ArrowRight size={22} />
                                   </>
                                 )}
                              </button>
                           </form>
                           
                           <footer className="text-center pt-8 border-t border-slate-100">
                              <button 
                                onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
                                className="text-[11px] font-black uppercase text-slate-400 hover:text-[#1A1A1A] transition-colors"
                              >
                                {mode === "signin" ? "New to the platform? Join now" : "Already have an account? Login"}
                              </button>
                           </footer>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </motion.div>
            </div>
         </div>
      </main>

      {/* ── FOOTER STATUS ── */}
      <div className="fixed bottom-0 inset-x-0 h-12 px-8 flex items-center justify-between z-50 text-[10px] font-black uppercase text-slate-300 pointer-events-none border-t border-slate-100 bg-white/60 backdrop-blur-md">
         <div className="flex items-center gap-8">
            <span className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Platform Active</span>
         </div>
         <div className="tracking-widest">CHECKOUT_OS_V8.0 // KERALA</div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
