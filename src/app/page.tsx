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
    <div className="min-h-screen bg-white text-[#000000E6] font-sans selection:bg-[#E53935]/10 relative overflow-x-hidden">
      <LandingHeader 
         onJoinClick={() => setMode("signup")} 
         onSigninClick={() => setMode("signin")} 
      />

      <main className="pt-[98px] lg:pt-[138px] pb-[78px] overflow-x-hidden">
         <div className="max-w-[1128px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-[47px] lg:gap-[95px]">
            <div className="w-full lg:w-1/2 space-y-8">
               <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 tracking-tighter leading-[0.95]">
                  <span className="font-extralight text-[0.8em] opacity-80">Connect.</span> Grow. <br />
                  <span className="text-[#E53935] relative">
                     Succeed.
                     <span className="absolute -bottom-2 left-0 w-24 h-1 bg-[#E53935] rounded-full opacity-20 blur-[2px]" />
                  </span>
               </h1>

               <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 max-w-[400px]"
                    >
                       <form onSubmit={handleSubmit} className="space-y-4">
                          {mode === "signup" && (
                             <>
                                <div className="space-y-1 relative">
                                   <label className="text-sm font-semibold text-gray-600">I am a...</label>
                                   <div className="relative">
                                      <button 
                                        type="button"
                                        onClick={() => setIsRoleOpen(!isRoleOpen)}
                                        className="w-full h-12 px-10 border border-gray-400 rounded hover:border-black focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] outline-none transition-all bg-white font-bold text-[13px] flex items-center justify-between group"
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
                                               className="absolute top-[110%] inset-x-0 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] py-2 overflow-hidden"
                                            >
                                               {ROLES.map(r => (
                                                  <button
                                                     key={r.value}
                                                     type="button"
                                                     onClick={() => { setRole(r.value); setIsRoleOpen(false); }}
                                                     className={cn(
                                                        "w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left",
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
                                   <label className="text-sm font-semibold text-gray-600">Full name</label>
                                   <input
                                      type="text"
                                      name="fullName"
                                      value={formData.fullName}
                                      onChange={handleInput}
                                      className="w-full h-12 px-3 border border-gray-400 rounded hover:border-black focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] outline-none transition-all"
                                      required
                                   />
                                </div>
                             </>
                          )}

                          <div className="space-y-1">
                             <label className="text-sm font-semibold text-gray-600">Email</label>
                             <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInput}
                                className="w-full h-12 px-3 border border-gray-400 rounded hover:border-black focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] outline-none transition-all"
                                required
                             />
                          </div>

                          <div className="space-y-1">
                              <label className="text-sm font-semibold text-gray-600">Password</label>
                              <div className="relative group">
                                 <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInput}
                                    className="w-full h-12 px-3 border border-gray-400 rounded hover:border-black focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] outline-none transition-all pr-12"
                                    required
                                 />
                                 <button 
                                   type="button" 
                                   onClick={() => setShowPassword(!showPassword)}
                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E53935] transition-all p-1"
                                 >
                                    {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                                 </button>
                              </div>
                           </div>

                          {error && <p className="text-red-600 text-sm">{error}</p>}

                           <button
                              type="submit"
                              disabled={isLoading}
                              className="w-full h-12 bg-[#E53935] hover:bg-[#B71C1C] text-white font-bold rounded-full transition-all flex items-center justify-center relative overflow-hidden"
                           >
                              {mode === "signup" ? "Agree & join" : "Sign in"}
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

      <section className="bg-gray-100 py-[63px]">
         <div className="max-w-[1128px] mx-auto px-6">
            <h2 className="text-3xl font-light mb-8">Find the right people, Business and Opportunities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 "Engineering", "Business Development", "Finance", "Sales",
                 "Marketing", "Design", "Human Resources", "Operations"
               ].map((topic) => (
                  <button key={topic} className="p-4 bg-white border border-gray-200 rounded font-bold hover:shadow-md transition-all text-left">
                     {topic}
                  </button>
               ))}
            </div>
         </div>
      </section>

      <footer className="bg-white py-[47px]">
         <div className="max-w-[1128px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
               <div className="space-y-4">
                  <h4 className="font-bold text-sm">General</h4>
                  <ul className="space-y-2 text-xs text-gray-500 font-bold">
                     <li><Link href="/what-is-checkout">What is Checkout</Link></li>
                     <li>Help Center</li>
                     <li>Press</li>
                     <li>Blog</li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-bold text-sm">Browse</h4>
                  <ul className="space-y-2 text-xs text-gray-500 font-bold">
                     <li>Learning</li>
                     <li>Jobs</li>
                     <li>Salary</li>
                     <li>Mobile</li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-bold text-sm">Business</h4>
                  <ul className="space-y-2 text-xs text-gray-500 font-bold">
                     <li>Talent</li>
                     <li>Marketing</li>
                     <li>Sales</li>
                     <li>Learning</li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-bold text-sm">Support</h4>
                  <ul className="space-y-2 text-xs text-gray-500 font-bold">
                     <li>Privacy Policy</li>
                     <li>User Agreement</li>
                     <li>Cookie Policy</li>
                     <li>Copyright Policy</li>
                  </ul>
               </div>
            </div>
            <div className="pt-8 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-bold">
               <span>CheckOut  2026</span>
               <div className="flex gap-4">
                  <span>Accessibility</span>
                  <span>Community Guidelines</span>
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
