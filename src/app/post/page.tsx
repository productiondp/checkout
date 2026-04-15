"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Brain, Sparkles, Send, Info, Tag, IndianRupee } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function AIPostRequirement() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulated AI Suggestions
  const suggestions = text.length > 20 ? [
    "Suggested Tag: #UI/UX",
    "Estimated Budget: ₹40k - 60k",
    "Clarity Score: 85%"
  ] : [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="px-6 pt-14 pb-6 flex items-center justify-between border-b border-black/[0.02]">
        <Link href="/home" className="p-2 -ml-3 text-text-secondary">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex items-center gap-2">
           <Brain size={18} className="text-primary" />
           <span className="text-[10px] font-black uppercase ">Post AI-Guided</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 px-6 pt-8 overflow-y-auto">
        <div className="mb-8">
           <h2 className="text-3xl font-black text-text  mb-2">What do you need?</h2>
           <p className="text-text-secondary text-sm font-medium">Be specific. AI will handle the matchmaking.</p>
        </div>

        <div className="relative group mb-8">
          <textarea 
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.length > 10) {
                 setIsAnalyzing(true);
                 setTimeout(() => setIsAnalyzing(false), 800);
              }
            }}
            placeholder="e.g., I'm looking for a premium leather goods supplier for my boutique in HSR..."
            className="w-full h-48 bg-background-soft rounded-[32px] p-8 text-lg font-medium outline-none border-2 border-transparent focus:border-primary/10 transition-all resize-none placeholder:text-text-secondary/30"
          />
          {isAnalyzing && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
               <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
               <span className="text-[8px] font-black text-primary uppercase">Analyzing...</span>
            </div>
          )}
        </div>

        {/* AI Suggestions Box */}
        <div className={cn(
          "bg-text rounded-[32px] p-8 text-white transition-all duration-500 overflow-hidden",
          text.length > 10 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 scale-95 h-0 p-0"
        )}>
           <div className="flex items-center gap-2 mb-6">
             <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles size={16} className="text-accent" />
             </div>
             <span className="text-xs font-black uppercase ">AI Assistance</span>
           </div>

           <div className="space-y-4 mb-8">
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/80">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                   {s}
                </div>
              ))}
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-2xl text-[10px] font-black uppercase  transition-colors flex items-center justify-center gap-2">
                 <Tag size={12} /> Add Smart Tags
              </button>
              <button className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-2xl text-[10px] font-black uppercase  transition-colors flex items-center justify-center gap-2">
                 <IndianRupee size={12} /> Set Budget
              </button>
           </div>
        </div>
      </div>

      <div className="p-8 pb-14 bg-white border-t border-black/[0.03]">
        <Button className="w-full py-5 text-xl font-black group shadow-2xl shadow-primary/20">
          Analyze & Post
          <Send size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
