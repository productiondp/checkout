"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  User,
  Briefcase,
  Award,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

type Role = "Business" | "Professional" | "Student" | "Advisor";

const ROLES: { value: Role; icon: any; desc: string }[] = [
  { value: "Business", icon: Briefcase, desc: "MSME & ENTERPRISES" },
  { value: "Professional", icon: User, desc: "FREELANCERS & EXPERTS" },
  { value: "Advisor", icon: ShieldCheck, desc: "MENTORS & CONSULTANTS" },
  { value: "Student", icon: Award, desc: "EMERGING TALENT" },
];

function SignupContent() {
  const router = useRouter();
  const { initAuth } = useAuth();
  const [role, setRole] = useState<Role>("Business");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createClient();

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
    } catch (err: any) {
      setError(err.message || "Signup failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#E53935]/20 flex items-center justify-center p-8">
      <nav className="fixed top-0 inset-x-0 h-24 bg-black/40 backdrop-blur-2xl z-50 px-8 lg:px-16 flex items-center justify-between border-b border-white/5">
         <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="text-2xl font-black font-outfit">Check<span className="text-[#E53935]">O</span>ut</span>
         </Link>
         <Link href="/login" className="px-6 py-3 rounded-full bg-white/5 text-[10px] font-black uppercase text-slate-200 hover:text-white transition-all border border-white/5">
            Login
         </Link>
      </nav>

      <div className="w-full max-w-[460px] bg-[#0A0A0A] border border-white/10 rounded-lg p-12 shadow-2xl relative overflow-hidden mt-20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#E53935]/5 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
         
         <AnimatePresence mode="wait">
            {isSuccess ? (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center py-10"
               >
                  <div className="h-24 w-24 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                     <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase mb-4 font-outfit">Success</h2>
                  <p className="text-slate-300 text-[10px] font-black uppercase animate-pulse">Welcome to the network...</p>
               </motion.div>
            ) : (
               <motion.div 
                 key="form"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="space-y-12 relative z-10"
               >
                  <header className="space-y-2">
                     <h2 className="text-3xl lg:text-5xl font-black text-white uppercase font-outfit">JOIN NOW</h2>
                     <p className="text-slate-200 text-[11px] font-black uppercase">CREATE YOUR PROFILE</p>
                  </header>

                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-200 uppercase ml-2">IDENTITY ROLE</label>
                        <div className="grid grid-cols-2 gap-4">
                           {ROLES.map((r) => (
                              <button
                                 key={r.value}
                                 type="button"
                                 onClick={() => setRole(r.value)}
                                 className={cn(
                                    "flex flex-col gap-4 p-6 rounded-lg border transition-all text-left h-32 justify-center group relative",
                                    role === r.value
                                       ? "border-[#E53935] bg-[#E53935]/5 text-white"
                                       : "border-white/5 bg-white/5 text-slate-300 hover:border-white/10"
                                 )}
                              >
                                 <r.icon size={20} className={role === r.value ? "text-[#E53935]" : "text-slate-500"} />
                                 <div>
                                    <p className="text-[12px] font-black uppercase mb-0.5">{r.value}</p>
                                    <p className="text-[8px] font-bold uppercase opacity-40">{r.desc}</p>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="relative group">
                           <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#E53935] transition-colors" />
                           <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInput}
                              placeholder="FULL NAME"
                              className="w-full h-20 pl-16 pr-8 bg-white/5 border border-white/5 rounded-lg text-[13px] font-black text-white placeholder:text-slate-600 outline-none focus:border-white/10 transition-all"
                              required
                           />
                        </div>

                        <div className="relative group">
                           <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#E53935] transition-colors" />
                           <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInput}
                              placeholder="EMAIL ADDRESS"
                              className="w-full h-20 pl-16 pr-8 bg-white/5 border border-white/5 rounded-lg text-[13px] font-black text-white placeholder:text-slate-600 outline-none focus:border-white/10 transition-all"
                              required
                           />
                        </div>

                        <div className="relative group">
                           <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#E53935] transition-colors" />
                           <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInput}
                              placeholder="PASSWORD"
                              className="w-full h-20 pl-16 pr-16 bg-white/5 border border-white/5 rounded-lg text-[13px] font-black text-white placeholder:text-slate-600 outline-none focus:border-white/10 transition-all"
                              required
                           />
                           <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
                           >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                           </button>
                        </div>
                     </div>

                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-24 rounded-[1.75rem] font-black text-[15px] text-white bg-[#E53935] hover:bg-[#D32F2F] uppercase flex items-center justify-center gap-5 transition-all shadow-[0_20px_60px_rgba(229,57,53,0.3)] disabled:opacity-50 mt-4 active:scale-95"
                     >
                        {isLoading ? (
                          <div className="h-6 w-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>START NOW</span>
                            <ArrowRight size={24} />
                          </>
                        )}
                     </button>
                  </form>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}
