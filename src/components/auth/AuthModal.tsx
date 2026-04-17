"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  X,
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export default function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<Role>("Business");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  // Prevent parent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For development: Skip validation and allow instant access
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/home");
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#292828]/80 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[500px] bg-[#FDFDFF] rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-[#292828]/40 hover:text-[#292828] transition-colors z-30"
        >
          <X size={24} />
        </button>

        {/* Content Container */}
        <div className="p-8 lg:p-10 space-y-6">
          
          {/* Header */}
          <div className="space-y-1 pt-2 text-center">
            <h2 className="text-3xl font-black tracking-tighter text-[#292828]">
              {mode === "signin" ? "Welcome Back." : "Join Network."}
            </h2>
            <p className="text-[#292828] font-bold text-[13px]">
              {mode === "signin" 
                ? "Access your city's local commerce node." 
                : "Enter details to start building locally."
              }
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1.5 bg-[#292828]/10 rounded-2xl border border-slate-200/50">
             {(["Business", "Professional", "Student"] as const).map((r) => (
                <button
                   key={r}
                   onClick={() => setRole(r)}
                   className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      role === r ? "bg-white text-[#292828] shadow-lg" : "text-[#292828] hover:text-[#292828]"
                   }`}
                >
                   {r === "Business" && <Briefcase size={12} />}
                   {r === "Professional" && <User size={12} />}
                   {r === "Student" && <GraduationCap size={12} />}
                   {r}
                </button>
             ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
               {error && (
                 <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[13px] font-bold animate-in fade-in slide-in-from-top-2">
                   <AlertCircle size={16} />
                   {error}
                 </div>
               )}

               {isSuccess && (
                 <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-[13px] font-bold animate-in fade-in slide-in-from-top-2">
                   <CheckCircle2 size={16} />
                   Success. Redirecting...
                 </div>
               )}

               <div className="space-y-2.5">
                 {mode === "signup" && (
                   <div className="relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center text-[#292828]/40 group-focus-within:text-[#E53935] transition-colors">
                         <User size={16} />
                      </div>
                      <input 
                         type="text" 
                         name="fullName"
                         value={formData.fullName}
                         onChange={handleInputChange}
                         placeholder="Full Name"
                         className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 text-[14px] font-bold outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/5 transition-all shadow-sm"
                      />
                   </div>
                 )}

                 <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center text-[#292828]/40 group-focus-within:text-[#E53935] transition-colors">
                       <Mail size={16} />
                    </div>
                    <input 
                       type="email" 
                       name="email"
                       value={formData.email}
                       onChange={handleInputChange}
                       placeholder="Email Address"
                       className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 text-[14px] font-bold outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/5 transition-all shadow-sm"
                    />
                 </div>

                 <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center text-[#292828]/40 group-focus-within:text-[#E53935] transition-colors">
                       <Lock size={16} />
                    </div>
                    <input 
                       type="password" 
                       name="password"
                       value={formData.password}
                       onChange={handleInputChange}
                       placeholder="Password"
                       className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-6 text-[14px] font-bold outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/5 transition-all shadow-sm"
                    />
                 </div>
               </div>

               {/* CTA */}
               <button 
                 type="submit"
                 disabled={isLoading || isSuccess}
                 className={`w-full py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-2 ${
                   isLoading ? "bg-slate-800 text-white cursor-wait" : "bg-[#292828] text-white hover:bg-[#E53935]"
                 }`}
               >
                {isLoading ? "Entering..." : (mode === "signin" ? "Sign In" : "Join Now")}
                  {!isLoading && <ArrowRight size={16} />}
               </button>
          </form>

          {/* Alternative */}
          <div className="pt-4 text-center">
             <button 
               onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
               className="text-[11px] font-black uppercase tracking-widest text-[#292828] hover:text-[#E53935] transition-colors"
             >
               {mode === "signin" ? "New here? Create Account" : "Registered? Sign In Instead"}
             </button>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
             <button className="py-3.5 border border-slate-200 bg-white rounded-xl hover:border-[#E53935]/20 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
                <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className="h-4 w-4" />
                Google Access
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
