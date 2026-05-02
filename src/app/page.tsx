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

  if (!mounted) return null;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
      // Removed the closure-captured safety reset that was wiping out the FAILED state!
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] font-sans selection:bg-[#E53935]/10 relative overflow-x-hidden">
      <LandingHeader 
         onJoinClick={() => setMode("signup")} 
         onSigninClick={() => setMode("signin")} 
      />

      <main className="pt-[98px] lg:pt-[138px] pb-[78px] overflow-x-hidden">
         <div className="max-w-[1128px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-[47px] lg:gap-[95px]">
            <div className="w-full lg:w-1/2 space-y-8">
               <h1 className="text-5xl lg:text-7xl tracking-tighter leading-[0.85] lg:leading-[0.85] mb-8">
                  <span className="font-thin text-gray-600">Connect. Grow.</span> <br />
                  <span className="font-bold text-[#E53935]">Succeed.</span>
               </h1>

               <AnimatePresence mode="wait">
                  {!isSuccess ? (
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

                        <AnimatePresence>
                           {submissionState && (
                              <AuthSubmissionStatus 
                                 state={submissionState} 
                                 error={error}
                                 onRetry={() => {
                                    setSubmissionState(null);
                                    setError(null);
                                 }}
                              />
                           )}
                        </AnimatePresence>
                     </motion.div>
                  ) : (
                    <div className="py-10 space-y-4">
                       <CheckCircle2 size={48} className="text-[#E53935]" />
                       <h2 className="text-2xl font-bold">Welcome!</h2>
                       <p className="text-gray-500">Going to your dashboard...</p>
                    </div>
                  )}
               </AnimatePresence>
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

      <section className="bg-white border-t border-black/[0.04] py-16 lg:py-24">
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
