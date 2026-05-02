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
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] font-sans selection:bg-[#E53935]/10 relative overflow-x-hidden">
      <LandingHeader 
         onJoinClick={() => setMode("signup")} 
         onSigninClick={() => setMode("signin")} 
      />

      <main className="pt-[98px] lg:pt-[138px] pb-[78px] overflow-x-hidden">
         <div className="max-w-[1128px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-[47px] lg:gap-[95px]">
            <div className="w-full lg:w-1/2 space-y-8">
               <h1 className="text-5xl lg:text-8xl font-black text-[#1D1D1F] tracking-tighter leading-[0.85] lg:leading-[0.9] font-outfit">
                  <span className="font-extralight opacity-40">Connect.</span><br className="hidden lg:block" /> Grow. <br />
                  <span className="text-[#E53935]">Succeed.</span>
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
                                <div className="space-y-1 relative">
                                   <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">I am a...</label>
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

                                <div className="space-y-1">
                                   <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Full name</label>
                                   <input
                                      type="text"
                                      name="fullName"
                                      value={formData.fullName}
                                      onChange={handleInput}
                                      placeholder="John Doe"
                                      className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#E53935] outline-none transition-all font-bold text-[13px]"
                                      required
                                   />
                                </div>
                             </div>
                          )}

                          <div className="space-y-1">
                             <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Email address</label>
                             <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInput}
                                placeholder="name@company.com"
                                className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#E53935] outline-none transition-all font-bold text-[13px]"
                                required
                             />
                          </div>

                          <div className="space-y-1">
                              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Security key</label>
                              <div className="relative group">
                                 <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInput}
                                    placeholder="••••••••"
                                    className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#E53935] outline-none transition-all font-bold text-[13px] pr-12"
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
                              className="w-full h-16 bg-black text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-black/10 hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 mt-4"
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
        {/* Auth Container */}
        <div className="w-full lg:w-[460px] relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 lg:p-10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-black/[0.03]"
          >
            <div className="mb-10">
              <h2 className="text-2xl lg:text-3xl font-black text-[#1D1D1F] mb-2 tracking-tighter font-outfit uppercase">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm font-medium text-[#86868B]">
                {mode === 'signin' 
                  ? 'Access your global business dashboard.' 
                  : 'Join the most elite business network in your city.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">I am a...</label>
                  <div className="relative group">
                    <button 
                      type="button"
                      onClick={() => setIsRoleOpen(!isRoleOpen)}
                      className="w-full h-14 px-6 bg-[#F5F5F7] border border-transparent rounded-2xl text-[13px] font-black text-[#1D1D1F] flex items-center justify-between focus:bg-white focus:border-[#E53935] transition-all cursor-pointer z-10 relative"
                    >
                      <span className="uppercase tracking-widest">{role || "Select your role"}</span>
                      <ChevronDown size={18} className={cn("text-black/20 transition-transform", isRoleOpen && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {isRoleOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-[115%] left-0 right-0 bg-white border border-black/[0.05] rounded-2xl shadow-4xl z-50 p-2 overflow-hidden"
                        >
                          {ROLES.map(r => (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => { setRole(r.value); setIsRoleOpen(false); }}
                              className={cn(
                                "w-full text-left px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all",
                                role === r.value ? "bg-[#E53935]/5 text-[#E53935]" : "text-black/40 hover:bg-[#F5F5F7] hover:text-black"
                              )}
                            >
                              <r.icon size={18} />
                              {r.value}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">Full Name</label>
                  <input 
                    name="fullName"
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full h-14 px-6 bg-[#F5F5F7] border border-transparent rounded-2xl text-[13px] font-black text-[#1D1D1F] focus:bg-white focus:border-[#E53935] transition-all uppercase tracking-widest"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full h-14 px-6 bg-[#F5F5F7] border border-transparent rounded-2xl text-[13px] font-black text-[#1D1D1F] focus:bg-white focus:border-[#E53935] transition-all uppercase tracking-widest"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">Security Key</label>
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full h-14 px-6 bg-[#F5F5F7] border border-transparent rounded-2xl text-[13px] font-black text-[#1D1D1F] focus:bg-white focus:border-[#E53935] transition-all uppercase tracking-widest"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
                className="w-full h-16 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/10 hover:bg-[#1d1d1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : (mode === 'signin' ? 'Sign In' : 'Join Network')}
              </motion.button>

              <div className="text-center mt-6">
                <button 
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-[10px] font-black uppercase tracking-widest text-[#86868B] hover:text-[#E53935] transition-colors"
                >
                  {mode === 'signin' ? "Don't have an account? Join now" : "Already a member? Sign in"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <section className="bg-white py-24 border-y border-black/[0.03]">
         <div className="max-w-[1128px] mx-auto px-6 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-black text-[#1D1D1F] mb-12 tracking-tighter font-outfit uppercase leading-[0.9]">Find the right people, <br className="lg:hidden" /><span className="text-[#E53935]">Business</span> and Opportunities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 "Engineering", "Business Development", "Finance", "Sales",
                 "Marketing", "Design", "Human Resources", "Operations"
               ].map((topic) => (
                  <button key={topic} className="p-6 bg-[#F5F5F7] border border-black/[0.03] rounded-2xl font-black uppercase text-[11px] tracking-widest text-black/60 hover:bg-white hover:border-black/[0.08] hover:shadow-xl hover:shadow-black/5 transition-all text-left group flex items-center justify-between">
                     {topic}
                     <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all text-[#E53935]" />
                  </button>
               ))}
            </div>
         </div>
      </section>

      <footer className="bg-[#FBFBFD] py-24">
         <div className="max-w-[1128px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-black">General</h4>
                  <ul className="space-y-3 text-[11px] text-[#86868B] font-black uppercase tracking-widest">
                     <li><Link href="/what-is-checkout" className="hover:text-[#E53935] transition-colors">What is Checkout</Link></li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Help Center</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Press</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Blog</li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-black">Browse</h4>
                  <ul className="space-y-3 text-[11px] text-[#86868B] font-black uppercase tracking-widest">
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Learning</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Jobs</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Salary</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Mobile</li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-black">Business</h4>
                  <ul className="space-y-3 text-[11px] text-[#86868B] font-black uppercase tracking-widest">
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Talent</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Marketing</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Sales</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Learning</li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-black">Support</h4>
                  <ul className="space-y-3 text-[11px] text-[#86868B] font-black uppercase tracking-widest">
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Privacy Policy</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">User Agreement</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Cookie Policy</li>
                     <li className="hover:text-[#E53935] transition-colors cursor-pointer">Copyright Policy</li>
                  </ul>
               </div>
            </div>
            <div className="pt-12 border-t border-black/[0.03] flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-[#86868B] font-black uppercase tracking-widest">
               <div className="flex items-center gap-4">
                  <Image src="/logo.png" alt="Logo" width={100} height={25} className="opacity-40 grayscale h-6 w-auto" />
                  <span> 2026 Checkout</span>
               </div>
               <div className="flex gap-8">
                  <span className="hover:text-black transition-colors cursor-pointer">Accessibility</span>
                  <span className="hover:text-black transition-colors cursor-pointer">Community Guidelines</span>
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
