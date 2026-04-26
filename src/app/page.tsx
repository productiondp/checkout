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
  Users,
  Award,
  Globe,
  Zap,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/utils/analytics";

type AuthMode = "signin" | "signup";
type Role = "Business" | "Professional" | "Student" | "Advisor";

const ROLES: { value: Role; icon: any; desc: string }[] = [
  { value: "Business", icon: Briefcase, desc: "MSME & Enterprises" },
  { value: "Professional", icon: User, desc: "Freelancers & Experts" },
  { value: "Student", icon: Award, desc: "Emerging Talent" },
  { value: "Advisor", icon: ShieldCheck, desc: "Mentors & Consultants" },
];

const STATS = [
  { value: "2,400+", label: "Members" },
  { value: "12K+", label: "Connections" },
  { value: "₹3.2Cr", label: "Deals Closed" },
];

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as AuthMode) || "signup";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<Role>("Business");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastSignupTime, setLastSignupTime] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  const { user: authUser, loading } = useAuth();
  const supabase = createClient();

  if (loading || !mounted) return null;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (mode === "signup" && now - lastSignupTime < 10000) {
      setError("Please wait a moment before trying again.");
      return;
    }
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
        if (signUpError) {
          if (signUpError.status === 429 || signUpError.message.includes("rate limit")) {
            throw new Error("Too many attempts. Please wait and try again.");
          }
          throw signUpError;
        }
        setLastSignupTime(now);
        if (authData.user) {
          await supabase.from("profiles").upsert({
            id: authData.user.id,
            full_name: formData.fullName || "New Partner",
            role: role.toUpperCase(),
            city: "Trivandrum",
            location: "Trivandrum",
          });
          analytics.track('USER_SIGNUP', authData.user.id, { role: role });
        }
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/home");
        }, 1500);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (signInError) throw signInError;
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/home");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
      
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/brain/e20a6442-6882-42f8-8557-d6bc2590b1b6/premium_business_background_1777208492794.png"
          alt="Network Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* ── TOP LOGO ── */}
      <div className="absolute top-10 left-10 z-20">
        <Link href="/" className="flex items-center gap-4 group">
          <Image 
            src="/images/logo.png" 
            alt="Checkout" 
            width={200} 
            height={50} 
            priority
            className="h-12 lg:h-14 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="relative z-10 w-full max-w-7xl px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* LEFT: BRANDING (Hidden on small screens) */}
        <div className="hidden lg:block space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#E53935] text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} /> Trivandrum's Business OS
            </div>
            <h1 className="text-7xl xl:text-8xl font-black text-white leading-none tracking-[-0.04em] uppercase font-outfit">
              Connect.<br />
              <span className="text-[#E53935]">Grow.</span><br />
              Succeed.
            </h1>
            <p className="text-white/40 text-lg font-medium leading-relaxed max-w-md">
              The premier business directory and networking hub for real professionals in Kerala.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-10 pt-8 border-t border-white/10"
          >
            {STATS.map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="text-white text-3xl font-black leading-none font-outfit">{s.value}</p>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.15em]">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: AUTH CARD */}
        <div className="flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[480px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 lg:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#E53935]/10 blur-[60px] rounded-full" />
            
            {isSuccess ? (
              <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="h-24 w-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={44} className="text-emerald-500" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-none font-outfit">Welcome</h2>
                  <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Redirecting to network...</p>
                </div>
              </div>
            ) : (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="space-y-10"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <h2 className="text-[42px] font-black text-white uppercase leading-none tracking-tight font-outfit">
                    {mode === "signup" ? "Join Now" : "Sign In"}
                  </h2>
                  <p className="text-white/30 text-sm font-medium uppercase tracking-widest">
                    {mode === "signup" ? "Create your professional node" : "Access your business terminal"}
                  </p>
                </motion.div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#E53935] text-xs font-black uppercase tracking-widest"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === "signup" && (
                    <motion.div variants={itemVariants} className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Identity Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        {ROLES.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setRole(r.value)}
                            className={cn(
                              "flex flex-col gap-3 p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group",
                              role === r.value
                                ? "border-[#E53935] bg-[#E53935]/10 text-white"
                                : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20"
                            )}
                          >
                            <r.icon size={18} className={role === r.value ? "text-[#E53935]" : "text-white/20"} />
                            <div>
                              <p className="text-[13px] font-black uppercase leading-none">{r.value}</p>
                              <p className={cn("text-[9px] mt-1 font-bold uppercase tracking-wide", role === r.value ? "text-white/60" : "text-white/20")}>{r.desc}</p>
                            </div>
                            {role === r.value && (
                              <motion.div layoutId="role-bg" className="absolute inset-0 bg-[#E53935]/5 pointer-events-none" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    {mode === "signup" && (
                      <motion.div variants={itemVariants} className="relative">
                        <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInput}
                          placeholder="FULL NAME"
                          className="w-full h-16 pl-14 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-[13px] font-black text-white placeholder:text-white/10 outline-none focus:border-[#E53935]/40 focus:bg-white/[0.05] transition-all tracking-widest"
                          required
                        />
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="relative">
                      <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInput}
                        placeholder="EMAIL ADDRESS"
                        className="w-full h-16 pl-14 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-[13px] font-black text-white placeholder:text-white/10 outline-none focus:border-[#E53935]/40 focus:bg-white/[0.05] transition-all tracking-widest"
                        required
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="relative">
                      <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInput}
                        placeholder="PASSWORD"
                        className="w-full h-16 pl-14 pr-14 bg-white/[0.03] border border-white/5 rounded-2xl text-[13px] font-black text-white placeholder:text-white/10 outline-none focus:border-[#E53935]/40 focus:bg-white/[0.05] transition-all tracking-widest"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </motion.div>
                  </div>

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(229,57,53,0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-20 rounded-[1.75rem] font-black text-[14px] text-white bg-[#E53935] uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-[0_10px_30px_rgba(229,57,53,0.3)]"
                  >
                    {isLoading ? (
                      <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === "signup" ? "Initialize Node" : "Authenticate"}
                        <ArrowRight size={22} strokeWidth={3} />
                      </>
                    )}
                  </motion.button>

                  <motion.div variants={itemVariants} className="text-center">
                    <button
                      type="button"
                      onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(null); }}
                      className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-[#E53935] transition-colors"
                    >
                      {mode === "signup" ? "Already Registered? Sign In" : "New Partner? Join Network"}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* ── FOOTER ── */}
      <div className="absolute bottom-10 inset-x-0 flex justify-center z-10 pointer-events-none">
        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">System Secure :: Trivandrum Grid</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-white/5 border-t-[#E53935] rounded-full animate-spin" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
