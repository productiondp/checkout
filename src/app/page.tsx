"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Zap,
  Target,
  Users,
  ChevronDown,
  Eye,
  EyeOff,
  Briefcase,
  User,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type Role = "BUSINESS" | "PROFESSIONAL" | "STUDENT" | "ADVISOR";

export default function Page() {
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [role, setRole] = useState<Role>("BUSINESS");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isRolePeekActive, setIsRolePeekActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupAttempts, setSignupAttempts] = useState(0);
  const [lastSignupTime, setLastSignupTime] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });

  const { user: authUser, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  // Routing is managed exclusively by useAuth sentinel in AuthGate

  // Role Dropdown Peek Animation
  useEffect(() => {
    if (authMode === "signup") {
      setIsRolePeekActive(true);
      const timer = setTimeout(() => setIsRolePeekActive(false), 800);
      return () => clearTimeout(timer);
    }
  }, [authMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ FRONTEND GUARD
    const now = Date.now();
    if (authMode === "signup") {
      if (now - lastSignupTime < 10000) {
        setError("Please wait a few seconds before trying again.");
        return;
      }
    }

    if (isLoading) return; // Prevent duplicate submission
    
    setIsLoading(true);
    setError(null);
    
    const supabase = createClient();

    try {
      if (authMode === "signup") {
        if (!formData.fullName) throw new Error("Full name is required.");
        
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: role,
            },
          },
        });
        
        if (signUpError) {
          if (signUpError.status === 429 || signUpError.message.includes("rate limit")) {
            throw new Error("Too many attempts. Please wait a moment and try again.");
          }
          throw signUpError;
        }

        setSignupAttempts(prev => prev + 1);
        setLastSignupTime(now);

        // MANUAL PROFILE CREATION (Reliable Fix)
        if (authData.user) {
           await supabase
             .from('profiles')
             .upsert({
               id: authData.user.id,
               full_name: formData.fullName,
               role: role,
               city: "Trivandrum",
               location: "Trivandrum"
             });
        }
        
        analytics.track('USER_SIGNUP', authData.user?.id, { role: role });
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
        // useAuth will handle redirect via useEffect/subscription
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check your data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-white text-[#292828] font-inter overflow-hidden relative flex flex-col selection:bg-[#E53935]/10">
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
         <img 
            src="/images/concept_bg.png" 
            className="w-full h-full object-cover opacity-[0.8] grayscale" 
            alt="Business Network" 
         />
         <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
         <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/40 to-white/10" />
      </div>

      {/* TOP NAV */}
      <nav 
        onMouseEnter={() => setIsNavVisible(true)}
        onMouseLeave={() => setIsNavVisible(false)}
        className={cn(
          "fixed top-0 inset-x-0 z-[100] h-20 transition-all duration-500 flex items-center",
          isNavVisible ? "bg-white/80 backdrop-blur-2xl border-b border-black/5" : "bg-transparent"
        )}
      >
         <div className="max-w-7xl mx-auto w-full px-6 lg:px-20 flex items-center justify-between">
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
            
            <div className="flex items-center gap-6">
               <button 
                 onClick={() => setAuthMode("signin")} 
                 className="hidden sm:block text-[11px] font-black uppercase text-[#292828] hover:text-[#E53935] transition-colors"
               >
                 Log In
               </button>
               <button 
                 onClick={() => setAuthMode("signup")} 
                 className="h-12 px-10 bg-[#292828] text-white rounded-xl text-[12px] font-black uppercase hover:bg-black active:scale-95 transition-all shadow-xl shadow-slate-900/10"
               >
                 Sign Up
               </button>
            </div>
         </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="relative flex-1 z-10 flex items-center overflow-y-auto no-scrollbar lg:overflow-hidden">
         <div className="max-w-7xl mx-auto w-full px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center py-20 lg:py-0">
            
            {/* LEFT SIDE SCREEN */}
            <div className="lg:col-span-6 space-y-12 relative hidden lg:block">
               <div className="absolute -left-12 top-0 w-[1px] h-[120px] bg-gradient-to-b from-[#E53935] to-transparent" />

               <div className="space-y-8">
                  <h1 className="text-6xl sm:text-7xl lg:text-[6.5rem] font-black uppercase tracking-tighter leading-[0.85] text-[#292828] font-outfit">
                    CONNECT PEOPLE. <br /> 
                    <span className="text-[#E53935]">GET LEADS.</span>
                  </h1>
                  
                  <p className="text-xl sm:text-2xl font-medium text-slate-400 max-w-xl italic border-l-2 border-[#E53935]/30 pl-8">
                     Meet real people. Get real business.
                  </p>
               </div>

               {/* Bottom Icons */}
               <div className="flex gap-12 pt-10">
                  {[
                    { label: "Directory", key: "DIRECTORY", icon: Users },
                    { label: "Requirements", key: "REQUIREMENTS", icon: Target },
                    { label: "Events", key: "EVENTS", icon: Zap }
                  ].map((it, i) => (
                    <div key={i} className="flex flex-col items-start gap-4 group relative md:flex-row md:items-center">
                       <div className="text-[10px] font-black uppercase text-slate-300 group-hover:text-[#E53935] transition-colors flex items-center gap-3 cursor-default">
                          <it.icon size={14} className="opacity-40 group-hover:opacity-100" />
                          {it.key}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* RIGHT SIDE (FORM CARD) */}
            <div className="lg:col-span-6 flex flex-col items-center">
               <div className="w-full max-w-[500px] bg-white p-8 sm:p-12 lg:p-14 rounded-[3rem] lg:rounded-[4rem] shadow-[0_40px_80px_rgba(15,23,42,0.08)] border border-slate-100 relative">
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#E53935]/30 to-transparent" />
                  
                  <div className="relative z-10 space-y-10">
                     <div className="space-y-2">
                        <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none text-[#292828] font-outfit">
                          {authMode === "signup" ? "Join Now" : "Welcome Back"}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-300 uppercase">Find profiles and grow</p>
                     </div>

                     <form onSubmit={handleAuth} className="space-y-6">
                        {error && (
                           <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[12px] font-bold">
                              <AlertCircle size={16} /> {error}
                           </div>
                        )}
                        {isSuccess && (
                           <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-[12px] font-bold">
                              <CheckCircle2 size={16} /> Done! Redirecting...
                           </div>
                        )}

                        <AnimatePresence mode="wait">
                          {authMode === "signup" && (
                             <motion.div
                              key="signup-fields"
                              initial={{ opacity: 0, opacity: 0 }}
                              animate={{ opacity: 1, opacity: 1 }}
                              exit={{ opacity: 0, opacity: 0 }}
                              className="space-y-4"
                             >
                                {/* CUSTOM DROPDOWN ROLE SELECTOR */}
                                <div className="relative mb-6">
                                   <p className="text-[10px] font-black uppercase text-slate-300 mb-2 leading-none">Select your role</p>
                                   <div className="relative flex flex-col">
                                      <button
                                         type="button"
                                         onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                         className="w-full h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] px-8 flex items-center justify-between hover:border-[#292828]/20 transition-all group"
                                      >
                                         <div className="flex items-center gap-4 text-[#292828]">
                                            {(() => {
                                               const ActiveIcon = [
                                                  { id: "BUSINESS", icon: Briefcase },
                                                  { id: "PROFESSIONAL", icon: User },
                                                  { id: "STUDENT", icon: GraduationCap },
                                                  { id: "ADVISOR", icon: ShieldCheck }
                                               ].find(r => r.id === role)?.icon || Briefcase;
                                               return <ActiveIcon size={18} className="text-[#E53935]" />;
                                            })()}
                                            <span className="text-[13px] font-black uppercase">{role}</span>
                                         </div>
                                         <motion.div
                                            animate={{ rotate: isRoleDropdownOpen ? 180 : 0 }}
                                            className="text-slate-300"
                                         >
                                            <ChevronDown size={18} />
                                         </motion.div>
                                      </button>

                                      <AnimatePresence shadow-2xl>
                                         {(isRoleDropdownOpen || isRolePeekActive) && (
                                            <motion.div
                                               initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                               animate={{ opacity: 1, y: 0, scale: 1 }}
                                               exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                               transition={{ duration: 0.2, ease: "easeOut" }}
                                               className="absolute top-[105%] inset-x-0 bg-white border-2 border-slate-100 rounded-[1.5rem] shadow-2xl z-[200] overflow-hidden p-2"
                                            >
                                               {[
                                                  { id: "BUSINESS", label: "Business", icon: Briefcase },
                                                  { id: "PROFESSIONAL", label: "Professional", icon: User },
                                                  { id: "STUDENT", label: "Student", icon: GraduationCap },
                                                  { id: "ADVISOR", label: "Advisor", icon: ShieldCheck }
                                               ].map((r) => (
                                                  <button
                                                     key={r.id}
                                                     type="button"
                                                     onClick={() => {
                                                        setRole(r.id as Role);
                                                        setIsRoleDropdownOpen(false);
                                                     }}
                                                     className={cn(
                                                        "w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left group",
                                                        role === r.id 
                                                           ? "bg-[#292828] text-white" 
                                                           : "hover:bg-slate-50 text-[#292828]/60 hover:text-[#292828]"
                                                     )}
                                                  >
                                                     <r.icon size={16} className={role === r.id ? "text-[#E53935]" : "group-hover:text-[#E53935]"} />
                                                     <span className="text-[12px] font-black uppercase">{r.label}</span>
                                                  </button>
                                               ))}
                                            </motion.div>
                                         )}
                                      </AnimatePresence>
                                   </div>
                                </div>

                                <input 
                                  type="text" 
                                  name="fullName"
                                  value={formData.fullName}
                                  onChange={handleInputChange}
                                  placeholder="Full Name" 
                                  className="w-full h-16 bg-slate-50 border border-slate-200/60 rounded-[1.5rem] px-8 text-black outline-none focus:bg-white focus:border-[#E53935]/30 focus:shadow-sm transition-all font-medium placeholder:text-slate-300" 
                                  required 
                                />
                             </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="space-y-4">
                           <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email Address" 
                            className="w-full h-16 bg-slate-50 border border-slate-200/60 rounded-[1.5rem] px-8 text-black outline-none focus:bg-white focus:border-[#E53935]/30 focus:shadow-sm transition-all font-medium placeholder:text-slate-300" 
                            required 
                           />
                           <div className="relative group">
                              <input 
                               type={showPassword ? "text" : "password"} 
                               name="password"
                               value={formData.password}
                               onChange={handleInputChange}
                               placeholder="Password" 
                               className="w-full h-16 bg-slate-50 border border-slate-200/60 rounded-[1.5rem] px-8 text-black outline-none focus:bg-white focus:border-[#E53935]/30 focus:shadow-sm transition-all font-medium placeholder:text-slate-300" 
                               required 
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#292828] transition-colors"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                           </div>
                        </div>

                        <button 
                          type="submit" 
                          disabled={isLoading || isSuccess}
                          className="w-full h-20 rounded-[2rem] font-black text-white bg-[#292828] uppercase flex items-center justify-center gap-6 mt-8 transition-all hover:bg-black active:scale-[0.98] shadow-2xl shadow-slate-900/20"
                        >
                           {isLoading ? "Loading..." : "Get Started"} <ArrowRight size={22} />
                        </button>
                     </form>

                     <button 
                      onClick={() => setAuthMode(authMode === "signup" ? "signin" : "signup")} 
                      className="text-[10px] font-black uppercase text-slate-300 w-full text-center hover:text-[#E53935] transition-colors"
                     >
                        {authMode === "signup" ? "Already have an account?" : "Need an account? Join"}
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </main>

      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-40 hidden lg:block">
         <p className="text-[10px] font-black uppercase text-slate-200">Made for local business</p>
      </footer>

    </div>
  );
}
