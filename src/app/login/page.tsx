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
        }
        setIsSuccess(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (signInError) throw signInError;
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-[#FDFDFF] overflow-hidden">

      {/* ── LEFT: BRAND PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[42%] bg-[#292828] relative overflow-hidden p-14">
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        {/* Red glow */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E53935]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#E53935]/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 bg-[#E53935] rounded-xl flex items-center justify-center shadow-lg">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-white text-xl font-black uppercase tracking-tight">Checkout</span>
          </div>
          <p className="text-white/30 text-sm font-medium ml-12">Business OS for Local Commerce</p>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E53935]/20 border border-[#E53935]/30 text-[#E53935] text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={12} />
              Trivandrum's Business Network
            </div>
            <h1 className="text-[56px] xl:text-[68px] font-black text-white leading-none tracking-[-0.04em] uppercase">
              Connect.<br />
              <span className="text-[#E53935]">Grow.</span><br />
              Succeed.
            </h1>
          </div>
          <p className="text-white/50 text-base font-medium leading-relaxed max-w-sm">
            Find business partners, leads, and professional meetups. 
            Real people, real opportunities.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-4 border-t border-white/10">
            {STATS.map((s, i) => (
              <div key={i}>
                <p className="text-white text-xl font-black leading-none">{s.value}</p>
                <p className="text-white/30 text-xs font-medium uppercase tracking-wide mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-8 w-8 rounded-full bg-white/10 border-2 border-[#292828] flex items-center justify-center text-white/50">
                <User size={12} />
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs">Joined by professionals across Kerala</p>
        </div>
      </div>

      {/* ── RIGHT: AUTH FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Subtle top nav for mobile */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 lg:hidden border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-[#E53935] rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-[#292828] text-base font-black uppercase tracking-tight">Checkout</span>
          </div>
        </div>

        <div className="w-full max-w-[440px]">

          {/* ── SUCCESS STATE ── */}
          {isSuccess && mode === "signup" ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="h-20 w-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 size={36} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#292828] uppercase tracking-tight leading-none mb-3">Check Your Email</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  A verification link was sent to<br />
                  <span className="font-bold text-[#292828]">{formData.email}</span>
                </p>
              </div>
              <button
                onClick={() => { setMode("signin"); setIsSuccess(false); }}
                className="w-full h-14 bg-[#292828] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-lg"
              >
                Continue to Sign In
              </button>
              <p className="text-slate-400 text-xs">Check your spam folder if you don't see it.</p>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-[38px] font-black text-[#292828] uppercase leading-none tracking-tight mb-2">
                  {mode === "signup" ? "Get Started" : "Welcome Back"}
                </h2>
                <p className="text-slate-500 text-[15px]">
                  {mode === "signup"
                    ? "Create your account to find partners and grow."
                    : "Sign in to continue to your dashboard."
                  }
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium mb-6 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Role selector (signup only) */}
                {mode === "signup" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">I am a...</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setRole(r.value)}
                          className={cn(
                            "flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all",
                            role === r.value
                              ? "border-[#292828] bg-[#292828] text-white"
                              : "border-slate-100 bg-white text-[#292828] hover:border-slate-300"
                          )}
                        >
                          <r.icon size={16} className={role === r.value ? "text-[#E53935]" : "text-slate-400"} />
                          <div>
                            <p className="text-[13px] font-bold leading-none">{r.value}</p>
                            <p className={cn("text-[10px] mt-0.5", role === r.value ? "text-white/50" : "text-slate-400")}>{r.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Name field (signup) */}
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInput}
                        placeholder="Your full name"
                        className="w-full h-13 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium text-[#292828] placeholder:text-slate-300 outline-none focus:border-[#292828] focus:bg-white transition-all"
                        required
                        style={{ height: "52px" }}
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInput}
                      placeholder="you@company.com"
                      className="w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium text-[#292828] placeholder:text-slate-300 outline-none focus:border-[#292828] focus:bg-white transition-all"
                      required
                      style={{ height: "52px" }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInput}
                      placeholder="Min. 8 characters"
                      className="w-full pl-11 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium text-[#292828] placeholder:text-slate-300 outline-none focus:border-[#292828] focus:bg-white transition-all"
                      required
                      style={{ height: "52px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-14 rounded-2xl font-bold text-[15px] text-white flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]",
                    "bg-[#292828] hover:bg-[#E53935]",
                    isLoading && "opacity-60 cursor-wait"
                  )}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === "signup" ? "Create Account" : "Sign In"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* Switch mode */}
                <p className="text-center text-[14px] text-slate-500">
                  {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(null); }}
                    className="font-bold text-[#292828] hover:text-[#E53935] transition-colors underline underline-offset-2"
                  >
                    {mode === "signup" ? "Sign In" : "Join Now"}
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-slate-200 border-t-[#292828] rounded-full animate-spin" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
