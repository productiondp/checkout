"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Cpu, 
  Globe,
  Zap
} from "lucide-react";
import AuthModal from "../components/auth/AuthModal";

export default function BalancedGlobalLanding() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "signin" | "signup" }>({
    isOpen: false,
    mode: "signin"
  });

  const openAuth = (mode: "signin" | "signup") => {
    setAuthModal({ isOpen: true, mode });
  };

  return (
    <div className="min-h-screen w-screen bg-[#292828] text-white font-sans overflow-x-hidden overflow-y-auto relative flex flex-col selection:bg-[#E53935]/40 no-scrollbar">
      
      {/* 1. SIMPLE RELATABLE BACKGROUND IMAGE (OPTIMIZED) */}
      <div className="fixed inset-0 z-0 bg-[#292828]">
        <Image 
          src="/images/hero-bg.jpg" 
          alt="Hyper-local Business Environment" 
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover"
        />
        {/* Refined Cinematic Overlay Optimized */}
        <div className="absolute inset-0 bg-[#292828]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* 2. HEADER */}
      <header className="relative z-50 h-20 lg:h-24 flex items-center justify-between px-6 lg:px-20">
         <Image src="/images/logo.png" width={150} height={50} className="h-8 lg:h-12 w-auto brightness-0 invert" alt="Logo" priority />
         <div className="flex items-center gap-4 lg:gap-10">
            <button 
              onClick={() => openAuth("signin")}
              className="text-[9px] lg:text-[10px] font-black uppercase text-white/70 hover:text-[#E53935] transition-colors"
            >
               Login
            </button>
            <button 
              onClick={() => openAuth("signup")}
              className="px-5 lg:px-8 py-2.5 lg:py-3 bg-[#E53935] text-white rounded-full text-[9px] lg:text-[10px] font-black uppercase hover:scale-105 transition-all active:scale-95 shadow-lg shadow-red-500/20"
            >
               Join
            </button>
         </div>
      </header>

      {/* 3. REBALANCED CONTENT (CLEANER, SMALLER FONTS) */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center px-6 lg:px-24 py-12 lg:py-0 gap-12 lg:gap-20">
         
         {/* VALUE DISCOVERY (REBALANCED FONTS) */}
         <div className="lg:col-span-7 space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-left-2 duration-700">
            <div className="inline-flex items-center gap-2 px-4 lg:px-5 py-1.5 rounded-xl bg-[#E53935]/15 border border-[#E53935]/30 text-[#E53935] text-[8px] lg:text-[9px] font-black uppercase">
               <Zap size={10} className="animate-pulse" /> Where Local Meets Opportunity
            </div>
            
            <h1 className="text-4xl lg:text-7xl font-black leading-tight text-white mix-blend-plus-lighter">
              Stop Networking. <br className="hidden sm:block" />
              <span className="text-[#E53935]">Start Building.</span>
            </h1>
            
            <p className="text-lg lg:text-3xl text-white/60 font-bold max-w-2xl leading-snug">
               Checkout is a simple way for entrepreneurs and creators in your city to connect and get things done.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8 pt-4">
               <button 
                 onClick={() => openAuth("signup")}
                 className="group/btn relative w-full sm:w-auto text-left"
               >
                  <div className="absolute inset-0 bg-[#E53935] blur-2xl opacity-10 group-hover/btn:opacity-30 transition-opacity" />
                  <div className="relative w-full sm:px-10 py-5 bg-[#E53935] text-white rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all border-b-4 border-red-800">
                     🚀 Get Started
                  </div>
               </button>

               <Link href="/explore" className="group/btn relative w-full sm:w-auto">
                  <button className="relative w-full sm:px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all border border-white/10 backdrop-blur-sm">
                     🔍 Explore
                  </button>
               </Link>
            </div>

            <div className="pt-4">
               <p className="text-[9px] lg:text-[10px] font-black uppercase text-white/40">Built for builders, not browsers.</p>
            </div>
         </div>

         {/* REFINED VISUAL (NO CONTEST BLOCK) */}
         <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-2 duration-1000">
            
            <div className="relative w-full max-w-sm">
               {/* Why Checkout Wins Differentiator Card */}
               <div className="w-full bg-[#292828]/60 p-8 lg:p-10 rounded-[1.625rem] lg:rounded-[1.95rem] border border-white/10 shadow-3xl hover:border-[#E53935]/30 transition-all duration-700 relative z-20 backdrop-blur-md">
                  <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 lg:mb-8 leading-none uppercase">Why <span className="text-[#E53935]">Checkout?</span></h3>
                  
                  <div className="space-y-4 lg:space-y-6">
                    {[
                      "Real work for real people",
                      "Focus on your city, not the world",
                      "Get things done instantly",
                      "Zero social noise"
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="h-5 w-5 rounded-full bg-[#E53935]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-[#E53935]" />
                        </div>
                        <p className="text-white/70 text-[13px] lg:text-sm font-bold leading-tight uppercase">{point}</p>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Soft Red Ambient Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] bg-[#E53935]/15 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none" />
            </div>

         </div>

      </main>

      {/* 4. FOOTER */}
      <footer className="relative z-50 py-8 lg:h-16 flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 border-t border-white/5 bg-[#292828]/10 backdrop-blur-md gap-6 lg:gap-0">
         <p className="text-[9px] font-black uppercase text-white/30 text-center lg:text-left">© 2026 Checkout Protocol. <span className="text-white/50">Hyper-Local Standard.</span></p>
         <div className="flex gap-8 text-[9px] font-black uppercase text-white/30">
            {["Privacy", "Safety", "Support"].map(it => (
              <span key={it} className="hover:text-white transition-colors cursor-pointer">{it}</span>
            ))}
         </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        initialMode={authModal.mode} 
      />

    </div>
  );
}
