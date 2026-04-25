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
  ChevronDown,
  Globe,
  Zap,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "signin" | "signup";
type Role = "Business" | "Professional" | "Student" | "Advisor";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as AuthMode) || "signup";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<Role>("Business");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [signupAttempts, setSignupAttempts] = useState(0);
  const [lastSignupTime, setLastSignupTime] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };
  
  const { user: authUser, loading } = useAuth();
  const supabase = createClient();

  if (loading || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ FRONTEND GUARD
    const now = Date.now();
    if (mode === "signup") {
      if (now - lastSignupTime < 10000) {
        setError("Please wait a few seconds before trying again.");
        return;
      }
    }

    if (isLoading) return; // Prevent duplicate submission
    
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName || "New Partner",
              role: role.toUpperCase(),
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

        if (authData.user) {
           await supabase
             .from('profiles')
             .upsert({
               id: authData.user.id,
               full_name: formData.fullName || "New Partner",
               role: role.toUpperCase(),
               city: "Trivandrum",
               location: "Trivandrum"
             });
        }
        
        analytics.track('USER_SIGNUP', authData.user?.id, { role: role.toUpperCase() });
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
      setError(err.message || "Authentication failed. Check your data.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles: { label: Role; icon: any }[] = [
    { label: "Business", icon: Briefcase },
    { label: "Professional", icon: User },
    { label: "Student", icon: Award },
    { label: "Advisor", icon: ShieldCheck },
  ];

  const currentRoleIcon = roles.find(r => r.label === role)?.icon;

  return (
    <div className="h-[100dvh] w-screen flex bg-white font-sans overflow-hidden relative">
      
      {/* HEADER OVERLAY */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-8">
        <Link href="/" className="flex items-center gap-0 group">
           <Image 
             src="/images/logo.png" 
             alt="CheckOut" 
             width={150} 
             height={40} 
             className="h-10 w-auto object-contain"
           />
        </Link>
        <div className="flex items-center gap-8">
           <button 
             onClick={() => setMode("signin")}
             className="text-[10px] font-black uppercase tracking-widest text-[#292828] hover:text-[#E53935] transition-colors"
           >
              Log In
           </button>
           <button 
             onClick={() => setMode("signup")}
             className="h-10 px-6 bg-[#292828] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-lg active:scale-95"
           >
              Sign Up
           </button>
        </div>
      </header>

      {/* LEFT SECTION: BRANDING */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-center px-20 bg-white">
         <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
               src="/images/auth-bg.png" 
               className="w-full h-full object-cover opacity-40 grayscale scale-110" 
               alt="" 
            />
         </div>

         <div className="relative z-10 space-y-12">
            <div className="space-y-0">
               <h1 className="text-[120px] font-black uppercase tracking-tighter leading-[0.8] text-[#292828]">
                  CONNECT<br />
                  PEOPLE.
               </h1>
               <h1 className="text-[120px] font-black uppercase tracking-tighter leading-[0.8] text-[#E53935]">
                  GET<br />
                  LEADS.
               </h1>
            </div>
            <div className="flex items-center gap-4 border-l-2 border-[#E53935] pl-6">
               <p className="text-3xl font-medium italic text-[#292828]/40">
                  Meet real people. Get real business.
               </p>
            </div>
         </div>

         <div className="absolute bottom-12 left-20 z-10 flex items-center gap-12">
            {[
              { label: 'CONNECT', icon: Users },
              { label: 'LEADS', icon: Target },
              { label: 'MEETUPS', icon: Zap }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity cursor-default">
                 <item.icon size={16} />
                 <span className="text-[11px] font-black uppercase tracking-[0.3em]">{item.label}</span>
              </div>
            ))}
         </div>
      </div>

      {/* RIGHT SECTION: AUTH CARD */}
      <div className="flex-1 flex items-center justify-center bg-white lg:bg-transparent relative z-20">
         <div className="w-full max-w-[500px] bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-12 lg:p-16 space-y-10 animate-in fade-in zoom-in-95 duration-700">
            
            <div className="space-y-1">
               <h2 className="text-[44px] font-black uppercase tracking-tight text-[#292828] leading-none">
                  {mode === "signup" ? "Join Now" : "Welcome Back"}
               </h2>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                  {mode === "signup" ? "Find partners and grow" : "Continue your journey"}
               </p>
            </div>

            {isSuccess && mode === "signup" ? (
               <div className="space-y-8 text-center py-10 animate-in fade-in zoom-in-95 duration-700">
                  <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-[#E53935] shadow-lg mb-4">
                     <Mail size={40} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-[32px] font-black text-[#292828] uppercase tracking-tighter leading-none italic">Verify Identity</h3>
                     <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed tracking-[0.1em] px-8">
                        A professional verification link has been dispatched to:
                        <br />
                        <span className="text-[#292828] font-black">{formData.email}</span>
                     </p>
                  </div>
                  <div className="pt-8 flex flex-col gap-4">
                     <button 
                        onClick={() => { setMode("signin"); setIsSuccess(false); }}
                        className="w-full h-16 bg-[#292828] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[#E53935] shadow-xl transition-all"
                     >
                        Continue to Sign In
                     </button>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Check your spam folder if you don't see it.
                     </p>
                  </div>
               </div>
            ) : (
               <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                     <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest animate-in shake duration-500">
                        <AlertCircle size={16} /> {error}
                     </div>
                  )}

                  <div className="space-y-6">
                     {/* Role Selector (Dropdown style from image) */}
                     {mode === "signup" && (
                        <div className="space-y-2 relative">
                           <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">Select Your Role</p>
                           <button
                              type="button"
                              onClick={() => setIsRoleOpen(!isRoleOpen)}
                              className={cn(
                                 "w-full h-16 bg-white border-2 rounded-2xl px-6 flex items-center justify-between transition-all",
                                 isRoleOpen ? "border-blue-500 shadow-lg shadow-blue-500/10" : "border-slate-100"
                              )}
                           >
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-[#E53935]">
                                    {React.createElement(currentRoleIcon)}
                                 </div>
                                 <span className="text-[11px] font-black uppercase tracking-widest text-[#292828]">{role}</span>
                              </div>
                              <ChevronDown size={16} className={cn("text-slate-300 transition-transform duration-300", isRoleOpen && "rotate-180")} />
                           </button>

                           {isRoleOpen && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-3xl shadow-4xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                 {roles.map((r) => (
                                    <button
                                       key={r.label}
                                       type="button"
                                       onClick={() => { setRole(r.label); setIsRoleOpen(false); }}
                                       className={cn(
                                          "w-full h-14 px-6 flex items-center gap-4 hover:bg-slate-50 transition-all",
                                          role === r.label ? "bg-[#292828] text-white" : "text-[#292828]"
                                       )}
                                    >
                                       <r.icon size={16} className={cn(role === r.label ? "text-white" : "text-slate-300")} />
                                       <span className="text-[10px] font-black uppercase tracking-widest">{r.label}</span>
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>
                     )}

                     <div className="space-y-4">
                        {mode === "signup" && (
                           <div className="relative group">
                              <input 
                                 type="text" 
                                 name="fullName"
                                 value={formData.fullName}
                                 onChange={handleInputChange}
                                 placeholder="Full Name" 
                                 className="w-full h-16 bg-slate-50 border-2 border-transparent rounded-2xl px-6 text-[12px] font-bold outline-none focus:bg-white focus:border-slate-200 transition-all"
                                 required
                              />
                           </div>
                        )}
                        <div className="relative group">
                           <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Email Address" 
                              className="w-full h-16 bg-slate-50 border-2 border-transparent rounded-2xl px-6 text-[12px] font-bold outline-none focus:bg-white focus:border-slate-200 transition-all"
                              required
                           />
                        </div>
                        <div className="relative group">
                           <input 
                              type="password" 
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Password" 
                              className="w-full h-16 bg-slate-50 border-2 border-transparent rounded-2xl px-6 text-[12px] font-bold outline-none focus:bg-white focus:border-slate-200 transition-all"
                              required
                           />
                        </div>
                     </div>
                  </div>

                  <button 
                     type="submit"
                     disabled={isLoading || isSuccess}
                     className={cn(
                        "w-full h-20 bg-[#292828] text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-4xl active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-[#E53935]",
                        isLoading && "opacity-50 cursor-wait"
                     )}
                  >
                     {isLoading ? "Processing..." : "Get Started"}
                     {!isLoading && <ArrowRight size={20} />}
                  </button>

                  <div className="text-center pt-4">
                     <button 
                        type="button"
                        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-[#292828] transition-colors"
                     >
                        {mode === "signup" ? "Already have an account?" : "Need an account? Join now"}
                     </button>
                  </div>
               </form>
            )}
         </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-[#292828] font-black uppercase tracking-widest">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
