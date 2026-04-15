import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Onboarding() {
  return (
    <div className="flex flex-col min-h-screen bg-white px-8 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[30%] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[25%] bg-primary-light/5 rounded-full blur-[80px]"></div>

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 fade-in relative z-10">
        <div className="relative">
          <div className="w-28 h-28 bg-brand-gradient rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary/30 mb-6 rotate-12 hover:rotate-0 transition-transform duration-500 cursor-pointer group">
            <span className="text-white text-5xl font-black -rotate-12 group-hover:rotate-0 transition-transform duration-500">C</span>
            <Sparkles className="absolute -top-4 -right-4 text-accent animate-bounce" size={24} />
          </div>
        </div>
        
        <div>
          <h1 className="text-5xl font-black  text-text mb-4 leading-none">
            CHECK<span className="text-primary italic">OUT</span>
          </h1>
          <p className="text-text-secondary text-xl max-w-[280px] font-medium leading-tight">
            The premium network for <span className="text-text font-bold">local commerce.</span>
          </p>
        </div>
      </div>

      <div className="pb-16 flex flex-col gap-6 fade-in relative z-10" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col gap-3">
          <Link href="/auth" className="w-full">
            <Button className="w-full text-xl py-5 shadow-2xl shadow-primary/20 group">
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </Link>
          <p className="text-center text-text-secondary/60 text-xs font-black uppercase ">
            Join 5,000+ top-tier local businesses
          </p>
        </div>
        
        <div className="flex justify-center gap-2">
           {[1,2,3].map(i => (
             <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === 1 ? 'w-8 bg-primary' : 'w-2 bg-black/5'}`}></div>
           ))}
        </div>
      </div>
    </div>
  );
}
