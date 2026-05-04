"use client";
import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LandingHeader from "@/components/layout/LandingHeader";
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
  Terminal,
  Search,
  Users,
  PlayCircle,
  BookOpen,
  ChevronRight,
  X,
  Lock as LockIcon,
  ShieldCheck as ShieldIcon
} from "lucide-react";
import AuthSubmissionStatus, { AuthSubmissionState } from "@/components/auth/AuthSubmissionStatus";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth, useAuthGuard } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "signin" | "signup";
type Role = "Business" | "Professional" | "Student" | "Advisor";

const ROLES: { value: Role; icon: any; desc: string }[] = [
  { value: "Business", icon: Briefcase, desc: "Hire and grow" },
  { value: "Professional", icon: User, desc: "Work and help" },
  { value: "Advisor", icon: ShieldCheck, desc: "Give advice" },
  { value: "Student", icon: Award, desc: "Learn and grow" },
];

function AuthContent() {
  const { state, isAuthResolved, login, signup } = useAuth();

  //  DECENTRALIZED GUEST GUARD
  useAuthGuard('unauthenticated');
  
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>((searchParams.get("mode") as AuthMode) || "signup");
  const [role, setRole] = useState<Role>("Business");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [submissionState, setSubmissionState] = useState<AuthSubmissionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => { setMounted(true); }, []);

  //  ROLE DROP-DOWN FLASH ANIMATION 
  useEffect(() => {
    if (mode === "signup" && mounted) {
      setIsRoleOpen(true);
      const timer = setTimeout(() => setIsRoleOpen(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [mode, mounted]);

  //  STRATEGIC PRELOADER (V1.0)
  // Preload the feed in the background to ensure 'Zero-Latency' transition to dashboard
  useEffect(() => {
    if (mounted) {
      fetch('/api/public-feed').catch(() => {});
    }
  }, [mounted]);

  // Re-warm cache when verification starts
  useEffect(() => {
    if (submissionState === 'VERIFYING') {
      fetch('/api/public-feed').catch(() => {});
    }
  }, [submissionState]);

  if (!mounted) return null;


  // ── Friendly error mapper ────────────────────────────────────────────────
  const friendlyAuthError = (err: any): string => {
    const msg = (err?.message || "").toLowerCase();
    const code = err?.code || "";

    if (msg.includes("invalid login credentials") || msg.includes("invalid credentials") || msg.includes("invalid email or password") || code === "invalid_credentials")
      return "Email or password is incorrect. Please try again.";
    if (msg.includes("email not confirmed") || msg.includes("confirm your email") || code === "email_not_confirmed")
      return "Please verify your email address before signing in.";
    if (msg.includes("user not found") || msg.includes("does not exist"))
      return "No account found with this email address.";
    if (msg.includes("password should be at least") || msg.includes("password is too short"))
      return "Password must be at least 6 characters.";
    if (msg.includes("email address is invalid") || msg.includes("unable to validate email"))
      return "Please enter a valid email address.";
    if (msg.includes("too many requests") || msg.includes("rate limit") || code === "over_request_rate_limit")
      return "Too many attempts. Please wait a moment and try again.";
    if (msg.includes("network") || msg.includes("fetch") || msg.includes("failed to fetch"))
      return "Connection failed. Please check your internet and try again.";
    if (msg.includes("boot_timeout") || msg.includes("timed out") || msg.includes("timeout"))
      return "Request timed out. Please try again.";
    if (msg.includes("signup is disabled"))
      return "New sign-ups are currently unavailable. Please try later.";
    
    // Log unknown errors for debugging
    console.error("[AUTH] Unmapped Error:", err);
    return msg || "Something went wrong. Please try again.";
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ── Client-side validation ───────────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "signup" && formData.fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    //  SUBMISSION WATCHDOG (5s)
    const watchdog = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setSubmissionState('FAILED');
        setError("Authentication is taking longer than expected. Please check your connection.");
      }
    }, 5000);

    try {
      // Only show verifying overlay if it takes > 300ms
      const overlayTimer = setTimeout(() => {
        if (!isSuccess) setSubmissionState('VERIFYING');
      }, 300);

      if (mode === "signup") {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.fullName || "New Member", role: role.toUpperCase() } },
        });
        if (signUpError) throw signUpError;
        
        if (authData.user) {
          await supabase.from("profiles").upsert({
            id: authData.user.id,
            full_name: formData.fullName || "New Member",
            role: role.toUpperCase(),
            location: "Trivandrum",
          });
        }

        // AUTO-SIGNIN Fallback
        if (!authData.session) {
           await login(formData.email, formData.password);
        }
      } else {
        await login(formData.email, formData.password);
      }

      // Clear overlay and allow useAuth to redirect
      setTimeout(() => setSubmissionState(null), 500);

    } catch (err: any) {
      const isAlreadyRegistered = err.message?.toLowerCase().includes("already registered");
      
      if (isAlreadyRegistered) {
        setSubmissionState(null); // Clear overlay
        try {
          await login(formData.email, formData.password);
          return; 
        } catch (loginErr) {
          // Fallback to error display if login fails
        }
      }

      console.error("[AUTH] Nuclear Failure:", err);
      clearTimeout(watchdog);
      setSubmissionState('FAILED');
      setError(friendlyAuthError(err));
    } finally {
      setIsLoading(false);
      // Removed the closure-captured safety reset that was wiping out the FAILED state!
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#E53935]/10 relative overflow-x-hidden">
      <LandingHeader 
         onJoinClick={() => setMode("signup")} 
         onSigninClick={() => setMode("signin")} 
      />

      <main className="pt-[98px] lg:pt-[138px] pb-[78px] overflow-x-hidden">
         <div className="max-w-[1128px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-[47px] lg:gap-[95px]">
            <div className="w-full lg:w-1/2 space-y-8">
               <h1 className="text-5xl lg:text-7xl tracking-tighter leading-[0.85] lg:leading-[0.85] mb-8">
                  <span className="font-thin text-black/60 uppercase">Connect. Grow.</span> <br />
                  <span className="font-bold text-[#E53935] uppercase">Succeed.</span>
               </h1>

               {mounted && (
                 <AnimatePresence mode="wait">
                    {!isAuthResolved ? (
                      <motion.div
                        key="verifying"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="w-full max-w-[400px] py-10 flex flex-col items-center gap-8 text-center"
                      >
                        {/* Icon */}
                        <div className="relative h-28 w-28 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-[#E53935] rounded-full blur-2xl"
                          />
                          <div className="relative h-20 w-20 rounded-[1.5rem] bg-red-50 border border-red-100 flex items-center justify-center shadow-lg shadow-red-100">
                            <svg className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] animate-[spin_4s_linear_infinite]">
                              <circle cx="50%" cy="50%" r="48%" stroke="#E53935" strokeWidth="1" fill="none" strokeDasharray="4 8" opacity="0.3" />
                            </svg>
                            <ShieldCheck size={30} className="text-[#E53935] relative z-10" strokeWidth={2} />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <motion.h2
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-[28px] font-black uppercase tracking-tighter leading-none italic text-[#E53935] font-outfit"
                          >
                            Verifying Identity
                          </motion.h2>
                          <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">
                            Connecting to the secure network
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.15, 1, 0.15] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                              className="h-1.5 w-1.5 bg-[#E53935] rounded-full"
                            />
                          ))}
                        </div>
                      </motion.div>

                    ) : submissionState ? (
                      /* ── INLINE SUBMISSION STATUS ─────────────────────────────── */
                      <motion.div
                        key="submitting"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="w-full max-w-[400px] py-10 flex flex-col items-center gap-8 text-center"
                      >
                        {/* Icon */}
                        <div className="relative h-28 w-28 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.25, 0.1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className={`absolute inset-0 rounded-full blur-2xl ${submissionState === 'FAILED' ? 'bg-red-500' : 'bg-[#E53935]'}`}
                          />
                          <div className="relative h-20 w-20 rounded-[1.5rem] bg-red-50 border border-red-100 flex items-center justify-center shadow-lg shadow-red-100">
                            {submissionState === 'FAILED' ? (
                              <motion.div animate={{ x: [-1, 1, -1] }} transition={{ repeat: 3, duration: 0.08 }}>
                                <X size={30} className="text-[#E53935]" strokeWidth={2.5} />
                              </motion.div>
                            ) : (
                              <>
                                <svg className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] animate-[spin_4s_linear_infinite]">
                                  <circle cx="50%" cy="50%" r="48%" stroke="#E53935" strokeWidth="1" fill="none" strokeDasharray="4 8" opacity="0.3" />
                                </svg>
                                <ShieldCheck size={30} className="text-[#E53935] relative z-10 animate-pulse" strokeWidth={2} />
                              </>
                            )}
                          </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-3">
                          <h2 className="text-[28px] font-black uppercase tracking-tighter leading-none italic text-[#E53935] font-outfit">
                            {submissionState === 'FAILED' ? (mode === 'signup' ? 'Setup Failed' : 'Login Failed') : 'Verifying Identity'}
                          </h2>
                          <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">
                            {submissionState === 'FAILED' ? 'Review the details below and try again' : 'Connecting to the secure network'}
                          </p>
                          {error && (
                            <div className="bg-red-50 border border-red-100 text-[#E53935] px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider inline-block">
                              {error}
                            </div>
                          )}
                        </div>

                        {/* Action */}
                        {submissionState === 'FAILED' ? (
                          <button
                            onClick={() => { setSubmissionState(null); setError(null); }}
                            className="h-12 px-8 bg-[#1A1A1A] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all"
                          >
                            Try Again
                          </button>
                        ) : (
                          <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ opacity: [0.15, 1, 0.15] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                className="h-1.5 w-1.5 bg-[#E53935] rounded-full"
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>

                    ) : !isSuccess ? (
                      <motion.div 
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 w-full max-w-[400px]"
                      >
                         <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === "signup" && (
                               <div className="space-y-4">
                                  <div className="space-y-1.5 relative">
                                     <label className="text-[12px] font-bold text-gray-900 ml-1">I am a...</label>
                                     <div className="relative">
                                        <button 
                                          type="button"
                                          onClick={() => setIsRoleOpen(!isRoleOpen)}
                                          className="w-full h-14 px-6 border border-gray-200 rounded-2xl hover:border-black focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] outline-none transition-all bg-white font-bold text-[13px] flex items-center justify-between group"
                                        >
                                           <div className="flex items-center gap-3">
                                              <div className="text-[#E53935]">
                                                 {(() => {
                                                    const activeRole = ROLES.find(r => r.value === role);
                                                    const Icon = activeRole?.icon || User;
                                                    return <Icon size={18} />;
                                                 })()}
                                              </div>
                                              <span>{role}</span>
                                           </div>
                                           <ChevronRight size={16} className={cn("transition-transform", isRoleOpen ? "-rotate-90" : "rotate-90")} />
                                        </button>

                                        <AnimatePresence>
                                           {isRoleOpen && (
                                              <motion.div 
                                                 initial={{ opacity: 0, y: -10 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 exit={{ opacity: 0, y: -10 }}
                                                 className="absolute top-[115%] inset-x-0 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] py-2 overflow-hidden"
                                              >
                                                 {ROLES.map(r => (
                                                    <button
                                                       key={r.value}
                                                       type="button"
                                                       onClick={() => { setRole(r.value); setIsRoleOpen(false); }}
                                                       className={cn(
                                                          "w-full px-5 py-3.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left",
                                                          role === r.value ? "bg-red-50 text-[#E53935]" : "text-gray-700"
                                                       )}
                                                    >
                                                       <r.icon size={18} className={role === r.value ? "text-[#E53935]" : "text-gray-400"} />
                                                       <div className="flex flex-col">
                                                          <span className="text-[13px] font-bold">{r.value}</span>
                                                          <span className="text-[10px] opacity-60 font-medium">{r.desc}</span>
                                                       </div>
                                                    </button>
                                                 ))}
                                              </motion.div>
                                           )}
                                        </AnimatePresence>
                                     </div>
                                  </div>

                                  <div className="space-y-1.5">
                                     <label className="text-[12px] font-bold text-gray-900 ml-1">Full name</label>
                                     <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInput}
                                        placeholder="John Doe"
                                        className="w-full h-12 px-5 bg-white border border-gray-300 rounded-lg focus:border-[#E53935] outline-none transition-all font-medium text-[14px]"
                                        required
                                     />
                                  </div>
                               </div>
                            )}

                            <div className="space-y-1.5">
                               <label className="text-[12px] font-bold text-gray-900 ml-1">Email</label>
                               <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInput}
                                  placeholder="name@company.com"
                                  className="w-full h-12 px-5 bg-white border border-gray-300 rounded-lg focus:border-[#E53935] outline-none transition-all font-medium text-[14px]"
                                  required
                               />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-gray-900 ml-1">Password</label>
                                <div className="relative group">
                                   <input
                                      type={showPassword ? "text" : "password"}
                                      name="password"
                                      value={formData.password}
                                      onChange={handleInput}
                                      placeholder="••••••"
                                      className="w-full h-12 px-5 bg-white border border-gray-300 rounded-lg focus:border-[#E53935] outline-none transition-all font-medium text-[14px] pr-12"
                                      required
                                   />
                                   <button 
                                     type="button" 
                                     onClick={() => setShowPassword(!showPassword)}
                                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E53935] transition-all p-1"
                                   >
                                      {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                                   </button>
                                </div>
                             </div>

                            {error && <p className="text-red-600 text-xs font-bold px-1">{error}</p>}

                             <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-[#E53935] text-white font-bold rounded-xl shadow-lg hover:bg-[#D32F2F] transition-all flex items-center justify-center gap-3 mt-6"
                             >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : (mode === "signup" ? "Agree & join" : "Sign in")}
                             </button>
                          </form>

                       </motion.div>
                    ) : (
                      <div className="py-10 space-y-4">
                         <CheckCircle2 size={48} className="text-[#E53935]" />
                         <h2 className="text-2xl font-bold">Welcome!</h2>
                         <p className="text-gray-500">Going to your dashboard...</p>
                      </div>
                    )}
                 </AnimatePresence>
               )}
            </div>

            <div className="hidden lg:block w-1/2">
               <img 
                 src="/antigravity-hero.png" 
                 alt="Professional Networking" 
                 className="w-full h-auto"
               />
            </div>
         </div>
      </main>

      <section className="bg-[#FFFFFF] border-t border-black/[0.04] py-16 lg:py-24">
         <div className="max-w-[1128px] mx-auto px-6">
            <div className="mb-10">
               <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E53935] mb-3">Discover the Network</p>
               <h2 className="text-3xl lg:text-4xl font-bold text-[#1D1D1F] tracking-tighter">Find the right people,<br className="hidden lg:block" /> businesses and opportunities.</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
               {[
                 { label: "Engineering", icon: "⚙️" },
                 { label: "Business Dev", icon: "📈" },
                 { label: "Finance", icon: "💰" },
                 { label: "Sales", icon: "🤝" },
                 { label: "Marketing", icon: "📣" },
                 { label: "Design", icon: "🎨" },
                 { label: "Human Resources", icon: "👥" },
                 { label: "Operations", icon: "🏗️" }
               ].map((topic) => (
                  <button key={topic.label} className="p-5 bg-[#FBFBFD] border border-black/[0.05] rounded-2xl font-black text-[12px] uppercase tracking-widest text-[#1D1D1F]/60 hover:bg-white hover:border-[#E53935]/20 hover:text-[#E53935] hover:shadow-lg hover:shadow-black/5 transition-all text-left flex items-center gap-3 group">
                     <span className="text-xl group-hover:scale-110 transition-transform">{topic.icon}</span>
                     {topic.label}
                  </button>
               ))}
            </div>
         </div>
      </section>

      <footer className="bg-[#FBFBFD] border-t border-black/[0.05] py-14">
         <div className="max-w-[1128px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F]">General</h4>
                  <ul className="space-y-3 text-[11px] text-[#86868B] font-bold uppercase tracking-wider">
                     <li><Link href="/what-is-checkout" className="hover:text-[#E53935] transition-colors">What is Checkout</Link></li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Help Center</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Press</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Blog</li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F]">Browse</h4>
                  <ul className="space-y-3 text-[11px] text-[#86868B] font-bold uppercase tracking-wider">
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Learning</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Jobs</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Salary</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Mobile</li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F]">Business</h4>
                  <ul className="space-y-3 text-[11px] text-[#86868B] font-bold uppercase tracking-wider">
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Talent</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Marketing</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Sales</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Learning</li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F]">Support</h4>
                  <ul className="space-y-3 text-[11px] text-[#86868B] font-bold uppercase tracking-wider">
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Privacy Policy</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">User Agreement</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Cookie Policy</li>
                     <li className="cursor-pointer hover:text-[#E53935] transition-colors">Copyright Policy</li>
                  </ul>
               </div>
            </div>
            <div className="pt-8 border-t border-black/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-[#86868B] font-black uppercase tracking-widest">
               <span>© Checkout 2026 · All Rights Reserved</span>
               <div className="flex gap-6">
                  <span className="cursor-pointer hover:text-[#E53935] transition-colors">Accessibility</span>
                  <span className="cursor-pointer hover:text-[#E53935] transition-colors">Community Guidelines</span>
               </div>
            </div>
         </div>
      </footer>
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
