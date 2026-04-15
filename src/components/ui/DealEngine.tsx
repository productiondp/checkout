"use client";

import React from "react";
import { Brain, Sparkles, Clock, CheckCircle2, ChevronRight, X, DollarSign } from "lucide-react";
import Button from "./Button";
import { DealSuggestion } from "@/lib/ai-engine";

interface DealEngineProps {
  suggestion: DealSuggestion;
  onClose: () => void;
  onConfirm: () => void;
}

const DealEngine: React.FC<DealEngineProps> = ({ suggestion, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-text/40 backdrop-blur-sm fade-in">
      <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden slide-up">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-text">AI Deal Architect</h3>
                <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Calculated Agreement</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-background-soft flex items-center justify-center text-text-secondary hover:text-text transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Pricing Suggestion */}
            <div className="bg-background-soft rounded-[32px] p-6 border border-black/[0.01]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-text-secondary flex items-center gap-2">
                  <DollarSign size={12} className="text-primary" />
                  Suggested Budget
                </span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-lg font-black italic">±10% Range</span>
              </div>
              <p className="text-3xl font-black text-text">{suggestion.priceRange}</p>
            </div>

            {/* Scope & Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background-soft rounded-[32px] p-5">
                 <p className="text-[9px] font-black uppercase text-text-secondary mb-3 flex items-center gap-2">
                   <Clock size={12} className="text-primary" />
                   Timeline
                 </p>
                 <p className="font-black text-lg text-text">{suggestion.timeline}</p>
              </div>
              <div className="bg-background-soft rounded-[32px] p-5">
                 <p className="text-[9px] font-black uppercase text-text-secondary mb-3 flex items-center gap-2">
                   <CheckCircle2 size={12} className="text-primary" />
                   Priority
                 </p>
                 <p className="font-black text-lg text-text">High</p>
              </div>
            </div>

            {/* Deliverables */}
            <div>
               <p className="text-[10px] font-black uppercase text-text-secondary mb-4 tracking-widest">Proposed Scope of Work</p>
               <div className="space-y-3">
                 {suggestion.scope.map((item, idx) => (
                   <div key={idx} className="flex items-center gap-3 p-4 bg-background-soft/50 rounded-2xl border border-black/[0.01]">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-bold text-text">{item}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3">
             <Button 
               onClick={onConfirm}
               className="w-full py-5 text-lg shadow-2xl shadow-primary/20 bg-brand-gradient"
             >
               Send Proposal
               <ChevronRight className="ml-2" size={20} />
             </Button>
             <button className="w-full py-4 text-xs font-black uppercase text-text-secondary hover:text-text transition-all">
                Modify Manually
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealEngine;
