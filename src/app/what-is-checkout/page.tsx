"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Users, Globe, Target, TrendingUp } from "lucide-react";
import LandingHeader from "@/components/layout/LandingHeader";
import { cn } from "@/lib/utils";

const Section = ({ title, subtitle, content, image, reverse, icon: Icon }: any) => (
  <section className={cn(
    "py-24 lg:py-40 px-6 max-w-[1128px] mx-auto flex flex-col lg:flex-row items-center gap-20",
    reverse && "lg:flex-row-reverse"
  )}>
    <div className="w-full lg:w-1/2 space-y-8">
      <div className="inline-flex items-center gap-3 text-[#E53935] font-black uppercase tracking-[0.2em] text-[10px]">
        <Icon size={16} /> {title}
      </div>
      <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter leading-none text-gray-900">
        {subtitle}
      </h2>
      <p className="text-lg lg:text-xl font-medium text-gray-400 leading-relaxed max-w-md">
        {content}
      </p>
      <button className="group flex items-center gap-2 text-sm font-bold hover:text-[#E53935] transition-all">
        Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
    <div className="w-full lg:w-1/2">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 bg-white"
      >
        <img src={image} alt={title} className="w-full h-auto object-contain" />
      </motion.div>
    </div>
  </section>
);

export default function WhatIsCheckoutPage() {
  return (
    <div className="min-h-screen bg-white text-[#0F0F12] font-sans selection:bg-[#E53935]/10 overflow-x-hidden">
      <LandingHeader />

      {/* ── HERO ── */}
      <section className="pt-32 lg:pt-52 pb-24 px-6 text-center max-w-[1128px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-[#E53935] rounded-full text-[10px] font-black uppercase tracking-widest">
            <Zap size={12} fill="currentColor" /> The Business OS
          </div>
          <h1 className="text-6xl lg:text-[10rem] font-bold tracking-tighter leading-[0.8] text-gray-900">
            Checkout <br />
            <span className="text-[#E53935]">Defined.</span>
          </h1>
          <p className="text-xl lg:text-3xl font-medium text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A high-fidelity system designed to connect, grow, and empower the local professional ecosystem.
          </p>
          <div className="pt-12">
            <img src="/antigravity-hero.png" alt="Checkout OS" className="w-full h-auto rounded-[4rem] shadow-2xl border border-gray-100" />
          </div>
        </motion.div>
      </section>

      {/* ── PILLARS ── */}
      <Section 
        title="Discover"
        subtitle="What's happening right now."
        content="Real-time feeds of local business trends, startup logs, and community meetups tailored to your role."
        image="/pillar-discover.png"
        icon={Globe}
      />

      <Section 
        title="Network"
        subtitle="Connect with intent."
        content="Direct access to founders, advisors, and mentors. No cold calls, just meaningful professional alignment."
        image="/pillar-network.png"
        icon={Users}
        reverse
      />

      <Section 
        title="Insights"
        subtitle="Learn from the best."
        content="Deep-dive case studies and growth modules shared by founders who have already scaled."
        image="/pillar-insights.png"
        icon={TrendingUp}
      />

      <Section 
        title="Opportunities"
        subtitle="The pulse of action."
        content="Exclusive projects, job roles, and collaboration requests that convert intent into reality."
        image="/pillar-opportunities.png"
        icon={Target}
        reverse
      />

      {/* ── FINAL CTA ── */}
      <section className="py-40 px-6 text-center max-w-4xl mx-auto space-y-12">
        <h3 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-none">
          Ready to <span className="text-[#E53935]">enter the flow?</span>
        </h3>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <button className="h-16 px-12 bg-[#E53935] text-white rounded-full font-bold text-sm tracking-widest hover:bg-[#B71C1C] transition-all shadow-xl">
            Agree & Join
          </button>
          <button className="h-16 px-12 bg-white border border-gray-200 text-gray-900 rounded-full font-bold text-sm tracking-widest hover:bg-gray-50 transition-all">
            Explore More
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-20 px-6 border-t border-gray-50">
        <div className="max-w-[1128px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-[#E53935] rounded-xl flex items-center justify-center text-white font-black">C</div>
              <span className="text-lg font-bold">Checkout OS</span>
           </div>
           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              © 2026 Checkout. Built for professional excellence.
           </p>
        </div>
      </footer>
    </div>
  );
}


