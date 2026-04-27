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
  ShieldCheck,
  Loader2,
  Activity,
  Terminal
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function LoginContent() {
  const router = useRouter();
  const { authState, loading: authLoading, initAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      const { data: { session: currentSession }, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (signInError) throw signInError;
      if (currentSession) {
        await initAuth();
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FF3B30]/20 relative overflow-hidden">
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 px-6 lg:px-12 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
         <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 bg-[#FF3B30] rounded-lg flex items-center justify-center">
               <Terminal size={24} className="text-white" />
            </div>
            <span className="text-3xl lg:text-4xl font-black font-outfit uppercase tracking-tighter">Check<span className="text-[#FF3B30]">Out</span></span>
         </Link>
         <Link href="/signup" className="text-[10px] font-black uppercase text-slate-300 hover:text-white transition-colors">
            Register
         </Link>
      </nav>

      <div className="flex items-center justify-center min-h-screen p-6 relative z-10 pt-16">
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-[650px] bg-[#0A0A0A] border border-white/10 rounded-lg p-8 shadow-2xl relative overflow-hidden"
         >
            <div className="space-y-8">
               <header className="space-y-2 text-center">
                  <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[#FF3B30] text-[9px] font-black uppercase mx-auto">
                     <ShieldCheck size={12} />
                     Secure Access
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-white uppercase font-outfit leading-tight">SIGN IN</h2>
                  <p className="text-slate-200 text-[11px] font-black uppercase">Welcome back</p>
               </header>

               {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-[#FF3B30] text-[9px] font-black uppercase rounded-lg">
                     {error}
                  </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                     <div className="relative group">
                        <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF3B30] transition-colors" />
                        <input
                           autoFocus
                           type="email"
                           name="email"
                           value={formData.email}
                           onChange={handleInput}
                           placeholder="EMAIL ADDRESS"
                           className="w-full h-12 pl-14 pr-6 bg-white/5 border border-white/5 rounded-lg text-[12px] font-black text-white placeholder:text-slate-600 outline-none focus:border-white/10 transition-all"
                           required
                        />
                     </div>

                     <div className="relative group">
                        <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF3B30] transition-colors" />
                        <input
                           type={showPassword ? "text" : "password"}
                           name="password"
                           value={formData.password}
                           onChange={handleInput}
                           placeholder="PASSWORD"
                           className="w-full h-12 pl-14 pr-14 bg-white/5 border border-white/5 rounded-lg text-[12px] font-black text-white placeholder:text-slate-600 outline-none focus:border-white/10 transition-all"
                           required
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
                        >
                           {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                     </div>
                  </div>

                  <button
                     type="submit"
                     disabled={isLoading}
                     className="w-full h-14 bg-[#FF3B30] hover:bg-[#D32F2F] text-white font-black text-[13px] uppercase rounded-lg flex items-center justify-center gap-4 transition-all shadow-[0_10px_20px_rgba(255,59,48,0.2)] disabled:opacity-50 active:scale-95 mt-2"
                  >
                     {isLoading ? (
                       <Loader2 className="animate-spin" size={20} />
                     ) : (
                       <>
                         <span>SIGN IN</span>
                         <ArrowRight size={18} />
                       </>
                     )}
                  </button>
               </form>
               
               <footer className="text-center pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase">
                     New here? <Link href="/signup" className="text-white hover:text-[#FF3B30] cursor-pointer transition-colors">Join Now</Link>
                  </p>
               </footer>
            </div>
         </motion.div>
      </div>

      {/* ── FOOTER STATUS ── */}
      <div className="fixed bottom-0 inset-x-0 h-10 px-6 flex items-center justify-between z-50 text-[8px] font-black uppercase text-slate-600 pointer-events-none border-t border-white/5 bg-black/40 backdrop-blur-sm">
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SECURE</span>
         </div>
         <div>CHECKOUT v6.6</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
