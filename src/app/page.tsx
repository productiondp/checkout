"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Cpu, 
  Globe,
  Zap
} from "lucide-react";

export default function BalancedGlobalLanding() {
  return (
    <div className="h-screen w-screen bg-slate-950 text-white font-sans tracking-tight overflow-hidden relative flex flex-col selection:bg-[#E53935]/40">
      
      {/* 1. SIMPLE RELATABLE BACKGROUND IMAGE (OPTIMIZED) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/simple-red-bg.png" 
          alt="Hyper-local Business Environment" 
          fill
          priority
          className="object-cover scale-105 animate-scale-slow"
        />
        {/* Cinematic Red-Tinted Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-[#E53935]/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* 2. HEADER */}
      <header className="relative z-50 h-20 lg:h-24 flex items-center justify-between px-8 lg:px-20">
         <img src="/images/logo.png" className="h-10 lg:h-12 w-auto brightness-0 invert" alt="Logo" />
         <div className="hidden lg:flex items-center gap-10">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-[#E53935] transition-colors">
               Sign In
            </Link>
            <Link href="/home">
               <button className="px-8 py-3 bg-[#E53935] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg shadow-red-500/20">
                  Join Now
               </button>
            </Link>
         </div>
      </header>

      {/* 3. REBALANCED CONTENT (CLEANER, SMALLER FONTS) */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center px-8 lg:px-24 pb-12 gap-20">
         
         {/* VALUE DISCOVERY (REBALANCED FONTS) */}
         <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-5 duration-1000">
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-xl bg-[#E53935]/15 border border-[#E53935]/30 text-[#E53935] text-[9px] font-black uppercase tracking-[0.4em]">
               <Zap size={12} className="animate-pulse" /> Hyper-Local Intelligence
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tighter text-white mix-blend-plus-lighter">
              Local Network. <br />
              <span className="text-[#E53935]">Global Standard.</span>
            </h1>
            
            <p className="text-xl lg:text-3xl text-slate-300 font-bold max-w-3xl leading-snug opacity-90 tracking-tight">
              A hyperlocal business networking and opportunity engine designed to connect entrepreneurs, MSMEs, and aspiring students within a city—enabling real collaborations, hiring, and growth.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 pt-4">
               <Link href="/home" className="group/btn relative w-full sm:w-auto">
                  <div className="absolute inset-0 bg-[#E53935] blur-3xl opacity-20 group-hover/btn:opacity-50 transition-opacity" />
                  <button className="relative w-full sm:px-12 py-5 bg-[#E53935] text-white rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all border-b-4 border-red-800">
                     Get Started
                     <ArrowRight size={22} />
                  </button>
               </Link>
               
               <div className="flex gap-10 border-l border-white/10 pl-10">
                  <div>
                     <p className="text-2xl font-black text-white">1.4M</p>
                     <p className="text-[9px] font-black text-[#E53935] uppercase tracking-widest leading-none mt-1">Active Nodes</p>
                  </div>
                  <div>
                     <p className="text-2xl font-black text-white">842</p>
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">Live Deals</p>
                  </div>
               </div>
            </div>
         </div>

         {/* REFINED VISUAL (NO CONTEST BLOCK) */}
         <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-5 duration-[1500ms]">
            
            <div className="relative w-full max-w-sm">
               {/* Perfect Match Intelligence Card (Only one) */}
               <div className="w-full bg-slate-950/30 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-3xl hover:border-[#E53935]/30 transition-all duration-700 relative z-20">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#E53935] shadow-xl">
                        <Cpu size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Intelligence Sync</p>
                        <p className="text-2xl font-black text-white tracking-tighter">98.4% Precision</p>
                     </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                     <div className="h-full bg-[#E53935] w-[98%] shadow-[0_0_15px_#E53935]" />
                  </div>
                  <p className="text-slate-400 text-[13px] font-bold tracking-tight leading-snug">
                    Algorithm matches you with verified local partners instantly.
                  </p>
               </div>

               {/* Soft Red Ambient Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E53935]/15 rounded-full blur-[120px] pointer-events-none" />
            </div>

         </div>

      </main>

      {/* 4. FOOTER */}
      <footer className="relative z-50 h-16 flex items-center justify-between px-8 lg:px-20 border-t border-white/5 bg-slate-950/10 backdrop-blur-md">
         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">© 2026 Checkout Protocol. <span className="text-slate-800">Hyper-Local Standard.</span></p>
         <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-700">
            {["Privacy", "Safety", "Support"].map(it => (
              <span key={it} className="hover:text-white transition-colors cursor-pointer">{it}</span>
            ))}
         </div>
      </footer>

    </div>
  );
}
