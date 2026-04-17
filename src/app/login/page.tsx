"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

type AuthMode = "signin" | "signup";
type Role = "Business" | "Professional" | "Student";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as AuthMode) || "signin";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<Role>("Business");
  
  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.email || !formData.password || (mode === "signup" && !formData.fullName)) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      // Mock API delayed response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`${mode === 'signin' ? 'Signing in' : 'Signing up'} with:`, { ...formData, role });
      
      setIsSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF] text-[#292828] font-sans tracking-tight">
      
      {/* Brand Header */}
      <header className="p-8 lg:p-12 flex justify-between items-center relative z-20">
         <Link href="/">
            <Image src="/images/logo.png" alt="Checkout" width={120} height={40} className="h-10 w-auto" priority />
         </Link>
         <button 
           onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
           className="text-[12px] font-black uppercase tracking-widest text-[#E53935] hover:opacity-70 transition-all flex items-center gap-2"
         >
           {mode === "signin" ? "New here? Join Now" : "Already a member? Sign In"}
           <ArrowRight size={14} />
         </button>
      </header>

      {/* Auth Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 relative z-10">
         
         {/* Background Decoration */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E53935]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

         <div className="w-full max-w-[480px] space-y-10">
            
            {/* Header Content */}
            <div className="space-y-4 text-center">
               <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-[#292828] transition-all">
                  {mode === "signin" ? "Welcome Back." : "Create Account."}
               </h1>
               <p className="text-[#292828] font-bold opacity-70">
                  {mode === "signin" 
                    ? "Access your city's local networking engine." 
                    : "Join your local business node and start building."
                  }
               </p>
            </div>

            {/* Role Switcher (Only for signup) */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#292828] text-center">Define Your Profile</p>
              <div className="flex p-1.5 bg-[#292828]/10 rounded-2xl border border-slate-200/50">
                 {(["Business", "Professional", "Student"] as const).map((r) => (
                    <button
                       key={r}
                       type="button"
                       onClick={() => setRole(r)}
                       className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          role === r ? "bg-white text-[#292828] shadow-xl border border-[#292828]/10" : "text-[#292828] hover:text-[#292828]"
                       }`}
                    >
                       {r === "Business" && <Briefcase size={12} />}
                       {r === "Professional" && <User size={12} />}
                       {r === "Student" && <GraduationCap size={12} />}
                       {r}
                    </button>
                 ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
               {error && (
                 <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                   <AlertCircle size={18} />
                   {error}
                 </div>
               )}

               {isSuccess && (
                 <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                   <CheckCircle2 size={18} />
                   Authentication successful. Redirecting...
                 </div>
               )}

               <div className="space-y-3">
                 {mode === "signup" && (
                   <div className="relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center text-[#292828]/40 group-focus-within:text-[#E53935] transition-colors">
                         <User size={18} />
                      </div>
                      <input 
                         type="text" 
                         name="fullName"
                         value={formData.fullName}
                         onChange={handleInputChange}
                         placeholder="Full Name"
                         className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-[15px] font-bold outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/5 transition-all shadow-sm"
                         required
                      />
                   </div>
                 )}

                 <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center text-[#292828]/40 group-focus-within:text-[#E53935] transition-colors">
                       <Mail size={18} />
                    </div>
                    <input 
                       type="email" 
                       name="email"
                       value={formData.email}
                       onChange={handleInputChange}
                       placeholder="Email Address"
                       className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-[15px] font-bold outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/5 transition-all shadow-sm"
                       required
                    />
                 </div>

                 <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center text-[#292828]/40 group-focus-within:text-[#E53935] transition-colors">
                       <Lock size={18} />
                    </div>
                    <input 
                       type="password" 
                       name="password"
                       value={formData.password}
                       onChange={handleInputChange}
                       placeholder="Password"
                       className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-[15px] font-bold outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/5 transition-all shadow-sm"
                       required
                    />
                 </div>
               </div>

               {mode === "signin" && (
                 <div className="flex justify-end pr-2">
                    <button type="button" className="text-[10px] font-black text-[#E53935] uppercase tracking-widest hover:underline">
                       Forgot Password?
                    </button>
                 </div>
               )}

               {/* CTA Button */}
               <button 
                 type="submit"
                 disabled={isLoading || isSuccess}
                 className={`w-full py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-6 ${
                   isLoading ? "bg-slate-800 text-white cursor-wait" : "bg-[#292828] text-white hover:bg-[#E53935]"
                 }`}
               >
                  {isLoading ? "Processing..." : (mode === "signin" ? "Sign In" : "Join Now")}
                  {!isLoading && <ArrowRight size={18} />}
               </button>
            </form>

            {/* Social Divider */}
            <div className="relative pt-6">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/50"></div>
               </div>
               <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-[#FDFDFF] px-4 text-[#292828]/40">Fast Access via</span>
               </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
               <button className="py-4 border border-slate-200 bg-white shadow-sm rounded-2xl hover:border-[#E53935]/20 transition-all text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className="h-4 w-4" />
                  Google
               </button>
               <button className="py-4 border border-slate-200 bg-white shadow-sm rounded-2xl hover:border-[#E53935]/20 transition-all text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
                  <ShieldCheck size={16} className="text-[#E53935]" />
                  Passkey
               </button>
            </div>

            {/* Footer Note */}
            <p className="text-center text-[10px] font-medium text-[#292828] max-w-[300px] mx-auto leading-relaxed">
              By continuing, you agree to the Checkout <span className="underline cursor-pointer">Service Terms</span> and <span className="underline cursor-pointer">Data Protocol</span>.
            </p>
         </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#292828] flex items-center justify-center text-white">Loading Auth...</div>}>
      <AuthContent />
    </Suspense>
  );
}
