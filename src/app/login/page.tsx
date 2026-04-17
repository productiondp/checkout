"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Mail, Lock, User, Briefcase, GraduationCap } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<"Business" | "Professional" | "Student">("Business");

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF] text-slate-950 font-sans tracking-tight">
      
      {/* Brand Header */}
      <div className="p-8 lg:p-12 flex justify-between items-center">
         <Link href="/">
            <img src="/images/logo.png" alt="Checkout" className="h-10 w-auto" />
         </Link>
         <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">
           New here? <Link href="/home" className="text-[#E53935] ml-2">Join Network</Link>
         </p>
      </div>

      {/* Main Login Hub */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
         <div className="w-full max-w-[460px] space-y-10">
            
            <div className="space-y-4">
               <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 text-center">
                  Welcome Back.
               </h1>
               <p className="text-center text-slate-500 font-bold">
                  Sign in to your business account.
               </p>
            </div>

            {/* Role Switcher */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl">
               {(["Business", "Professional", "Student"] as const).map((r) => (
                  <button
                     key={r}
                     onClick={() => setRole(r)}
                     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                        role === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                     }`}
                  >
                     {r === "Business" && <Briefcase size={14} />}
                     {r === "Professional" && <User size={14} />}
                     {r === "Student" && <GraduationCap size={14} />}
                     {r}
                  </button>
               ))}
            </div>

            {/* Input Form */}
            <div className="space-y-4">
               <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-[#E53935] transition-colors">
                     <Mail size={18} />
                  </div>
                  <input 
                     type="email" 
                     placeholder="Email Address"
                     className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-[15px] font-bold outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/5 transition-all"
                  />
               </div>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-[#E53935] transition-colors">
                     <Lock size={18} />
                  </div>
                  <input 
                     type="password" 
                     placeholder="Password"
                     className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-[15px] font-bold outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/5 transition-all"
                  />
               </div>
               <div className="flex justify-end">
                  <button className="text-[11px] font-black text-[#E53935] uppercase tracking-widest hover:underline">
                     Forgot Password?
                  </button>
               </div>
            </div>

            {/* CTA Button */}
            <Link href="/home">
               <button className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:bg-[#E53935] transition-all active:scale-95 flex items-center justify-center gap-3 mt-4">
                  Sign In
                  <ArrowRight size={18} />
               </button>
            </Link>

            {/* Social Divider */}
            <div className="relative pt-6">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
               </div>
               <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-[#FDFDFF] px-4 text-slate-300">Or continue with</span>
               </div>
            </div>

            {/* Social Placeholder */}
            <div className="grid grid-cols-2 gap-4">
               <button className="py-4 border border-slate-200 rounded-2xl hover:bg-white transition-all text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className="h-4 w-4" />
                  Google
               </button>
               <button className="py-4 border border-slate-200 rounded-2xl hover:bg-white transition-all text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" className="h-4 w-4" />
                  Facebook
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
