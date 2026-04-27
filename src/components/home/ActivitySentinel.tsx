"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Target, Users, X, ArrowRight } from "lucide-react";
import { analytics } from "@/utils/analytics";
import { optimization } from "@/utils/optimization_engine";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

export default function ActivitySentinel() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [promptType, setPromptType] = useState<'post' | 'connect'>('post');

  useEffect(() => {
    // Check for activity after 30 seconds of session start
    const timer = setTimeout(() => {
      if (!user) return;
      const actions = analytics.getSessionEvents();
      const hasMeaningfulAction = analytics.hasAction([
        'FIRST_MANDATE_CREATED',
        'CONNECT_REQUEST_SENT',
        'MESSAGE_INITIATED'
      ]);

      if (!hasMeaningfulAction) {
        // Decide which prompt to show
        const hasPosted = analytics.hasAction(['FIRST_MANDATE_CREATED']);
        setPromptType(hasPosted ? 'connect' : 'post');
        
        // Dynamic Config Integration
        const config = optimization.getConfig();
        if (config.promptConfig.urgencyLevel === 'high') {
           // Maybe increase visibility or change text
        }
        
        setIsVisible(true);
        analytics.track('LOW_ACTIVITY_PROMPT', user.id, { 
          type: hasPosted ? 'connect' : 'post',
          urgency: config.promptConfig.urgencyLevel
        });
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [user]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[40] w-[320px] animate-in slide-in-from-right-10 duration-700">
      <div className="bg-white border-2 border-[#E53935]/10 rounded-lg shadow-4xl overflow-hidden relative group">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#E53935]/5 rounded-full blur-[40px] group-hover:bg-[#E53935]/10 transition-colors" />
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 h-8 w-8 bg-slate-50 text-slate-300 rounded-lg flex items-center justify-center hover:text-[#292828] transition-all"
        >
          <X size={14} />
        </button>

        <div className="p-8">
          <div className="h-12 w-12 bg-[#E53935] rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-500/20 mb-6">
            {promptType === 'post' ? <Target size={24} /> : <Users size={24} />}
          </div>

          <h3 className="text-xl font-black text-[#292828] uppercase  mb-2">
            Accelerate <span className="text-[#E53935]">Growth</span>
          </h3>
          
          <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed mb-8">
            {promptType === 'post' 
              ? optimization.getConfig().promptConfig.onboardingText
              : "Expand your directory. Start connecting with matched professionals in your city."
            }
          </p>

          <div className="space-y-3">
            {promptType === 'post' ? (
              <button 
                onClick={() => {
                  // This should ideally open the PostModal, 
                  // but we'll just track the intent for now
                  window.dispatchEvent(new CustomEvent('open-post-modal'));
                  setIsVisible(false);
                }}
                className="w-full h-14 bg-[#292828] text-white rounded-lg flex items-center justify-center gap-3 font-black text-[10px] uppercase  hover:bg-[#E53935] transition-all group/btn shadow-xl shadow-slate-900/10"
              >
                Create Requirement (Post) <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link 
                href="/matches"
                onClick={() => setIsVisible(false)}
                className="w-full h-14 bg-[#292828] text-white rounded-lg flex items-center justify-center gap-3 font-black text-[10px] uppercase  hover:bg-[#E53935] transition-all group/btn shadow-xl shadow-slate-900/10"
              >
                Explore Matches <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            )}
            
            <button 
              onClick={() => setIsVisible(false)}
              className="w-full h-12 text-[9px] font-black uppercase text-slate-300 hover:text-[#292828] transition-all "
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
