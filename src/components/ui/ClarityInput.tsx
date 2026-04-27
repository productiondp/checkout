"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, ChevronRight, Check } from "lucide-react";
import { useClarityAssistant } from "@/hooks/useClarityAssistant";
import { ClarityIssue } from "@/services/clarity-service";

interface ClarityInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onRefine?: (newText: string) => void;
}

export const ClarityInput = React.forwardRef<HTMLInputElement, ClarityInputProps>(({
  className,
  value = "",
  onChange,
  onRefine,
  ...props
}, ref) => {
  const text = value as string;
  const { issues, isAnalyzing, ignoreIssue } = useClarityAssistant(text, 500, 'CHAT'); // Lighter delay + CHAT mode
  const [activeIssue, setActiveIssue] = useState<ClarityIssue | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleApplySuggestion = (issue: ClarityIssue, suggestion: string) => {
    const newText = text.substring(0, issue.startIndex) + suggestion + text.substring(issue.endIndex);
    if (onChange) {
      const event = {
        target: { value: newText },
        currentTarget: { value: newText }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    setActiveIssue(null);
  };

  return (
    <div className="relative flex-1 flex items-center" ref={containerRef}>
      {/* HIGHLIGHT LAYER (Simple underline for single line) */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none flex items-center px-0 text-[15px] font-bold text-transparent whitespace-nowrap overflow-hidden",
          className
        )}
      >
        {renderTextWithUnderlines(text, issues)}
      </div>

      <input
        ref={ref}
        value={value}
        onChange={onChange}
        className={cn(
          "relative w-full bg-transparent border-none outline-none text-[15px] font-bold text-[#292828] py-4",
          className
        )}
        {...props}
      />

      {/* MINI INDICATOR */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {issues.length > 0 && !activeIssue && (
          <button 
            type="button"
            onClick={() => setActiveIssue(issues[0])}
            className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              issues[0].type === 'SPELLING' ? "bg-red-500" : "bg-amber-500"
            )}
          />
        )}
      </div>

      {/* SUGGESTION POPUP (Chat optimized) */}
      <AnimatePresence>
        {activeIssue && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: -5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-black/[0.05] p-3 z-[100]"
          >
            <div className="flex items-center justify-between mb-2">
               <span className="text-[8px] font-black uppercase text-slate-400">Suggestion</span>
               <button type="button" onClick={() => setActiveIssue(null)}><X size={10} /></button>
            </div>
            <div className="space-y-1">
              {activeIssue.suggestions.slice(0, 2).map((s, i) => (
                <button 
                  key={i}
                  type="button"
                  onClick={() => handleApplySuggestion(activeIssue, s)}
                  className="w-full h-8 px-3 flex items-center justify-between bg-slate-50 rounded-lg hover:bg-[#E53935] hover:text-white transition-all text-[11px] font-bold"
                >
                   {s}
                </button>
              ))}
              <button 
                type="button"
                onClick={() => ignoreIssue(activeIssue.id)}
                className="w-full py-1 text-[9px] font-black uppercase text-slate-300 hover:text-black text-center"
              >
                Ignore
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ClarityInput.displayName = "ClarityInput";

function renderTextWithUnderlines(text: string, issues: ClarityIssue[]) {
  if (issues.length === 0) return text;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  const sortedIssues = [...issues].sort((a, b) => a.startIndex - b.startIndex);

  sortedIssues.forEach((issue, idx) => {
    if (issue.startIndex > lastIndex) {
      result.push(text.substring(lastIndex, issue.startIndex));
    }
    result.push(
      <span 
        key={`issue-${idx}`}
        className={cn(
          "border-b-2 leading-[0]",
          issue.type === 'SPELLING' ? "border-red-400" : "border-amber-400"
        )}
      >
        {text.substring(issue.startIndex, issue.endIndex)}
      </span>
    );
    lastIndex = issue.endIndex;
  });
  if (lastIndex < text.length) result.push(text.substring(lastIndex));
  return result;
}
