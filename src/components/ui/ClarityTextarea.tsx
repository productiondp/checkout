"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, X, ChevronRight, Check } from "lucide-react";
import { useClarityAssistant } from "@/hooks/useClarityAssistant";
import { ClarityIssue } from "@/services/clarity-service";

interface ClarityTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onRefine?: (newText: string) => void;
  showRefineButton?: boolean;
  type?: string;
}

export const ClarityTextarea = React.forwardRef<HTMLTextAreaElement, ClarityTextareaProps>(({
  className,
  value = "",
  onChange,
  onRefine,
  showRefineButton = true,
  type,
  ...props
}, ref) => {
  const text = value as string;
  const { issues, isAnalyzing, refineText, ignoreIssue } = useClarityAssistant(text, 400, 'POST', type);
  const [activeIssue, setActiveIssue] = useState<ClarityIssue | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<HTMLTextAreaElement>(null);

  // Sync scroll between textarea and highlights
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const backdrop = containerRef.current?.querySelector(".clarity-backdrop");
    if (backdrop) {
      backdrop.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleApplySuggestion = (issue: ClarityIssue, suggestion: string) => {
    const newText = text.substring(0, issue.startIndex) + suggestion + text.substring(issue.endIndex);
    if (onChange) {
      const event = {
        target: { value: newText },
        currentTarget: { value: newText }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(event);
    }
    setActiveIssue(null);
  };

  const handleRefine = async () => {
    const refined = await refineText(text);
    if (onRefine) onRefine(refined);
    else if (onChange) {
      const event = {
        target: { value: refined },
        currentTarget: { value: refined }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(event);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative min-h-[160px] w-full">
        {/* HIGHLIGHT LAYER */}
        <div 
          className={cn(
            "clarity-backdrop absolute inset-0 pointer-events-none p-8 text-2xl font-bold leading-relaxed whitespace-pre-wrap break-words text-transparent overflow-y-auto no-scrollbar",
            className
          )}
          aria-hidden="true"
        >
          {renderTextWithUnderlines(text, issues)}
        </div>

        {/* ACTUAL TEXTAREA */}
        <textarea
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            (internalRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
          }}
          value={value}
          onChange={onChange}
          onScroll={handleScroll}
          className={cn(
            "relative w-full min-h-[160px] bg-[#F5F5F7] border border-black/[0.03] rounded-3xl p-8 text-2xl font-bold leading-relaxed outline-none focus:bg-white focus:border-[#E53935]/20 focus:ring-[12px] focus:ring-[#E53935]/5 transition-all resize-none",
            className
          )}
          {...props}
        />
      </div>

      {/* CLARITY STATUS BAR */}
      <div className="flex items-center justify-between mt-3 px-2">
        <div className="flex items-center gap-3">
          {issues.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {issues.slice(0, 3).map((issue, i) => (
                  <div 
                    key={issue.id}
                    className={cn(
                      "h-2 w-2 rounded-full border border-white",
                      issue.type === 'SPELLING' ? "bg-red-500" : 
                      issue.type === 'INTENT' ? "bg-indigo-500 animate-pulse" : "bg-amber-500"
                    )}
                  />
                ))}
              </div>
              <button 
                onClick={() => setActiveIssue(issues[0])}
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest hover:underline",
                  issues.some(i => i.type === 'INTENT') ? "text-indigo-600" : "text-[#E53935]"
                )}
              >
                {issues.some(i => i.type === 'INTENT') ? "Intent Detected" : `${issues.length} Issue${issues.length > 1 ? 's' : ''} Detected`}
              </button>
            </div>
          ) : text.length > 0 && (
            <div className="flex items-center gap-2 text-emerald-500 opacity-80">
              <Check size={12} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">Clarity Optimal</span>
            </div>
          )}
          {issues.some(i => i.type === 'INTENT') && (
            <span className="text-[9px] font-bold text-indigo-600 animate-pulse uppercase ml-2 tracking-tight">
              Add more detail for better matches
            </span>
          )}
          {isAnalyzing && <div className="h-1 w-8 bg-slate-100 rounded-full overflow-hidden relative"><div className="absolute inset-0 bg-[#E53935] animate-progress-fast" /></div>}
        </div>

        {/* ONLY SHOW REFINE IF ISSUES EXIST */}
        {showRefineButton && issues.length > 0 && text.length > 10 && (
          <button 
            onClick={handleRefine}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#292828] text-white rounded-lg text-[10px] font-black uppercase hover:bg-indigo-600 transition-all shadow-lg active:scale-95 group"
          >
            <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
            {issues.some(i => i.type === 'INTENT') ? "Improve this post" : "Refine Message"}
          </button>
        )}
      </div>

      {/* SUGGESTION TOOLTIP */}
      <AnimatePresence>
        {activeIssue && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-4 w-64 bg-white rounded-2xl shadow-4xl border border-black/[0.05] p-5 z-[100]"
          >
            <div className="flex items-center justify-between mb-4">
               <span className={cn(
                 "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                 activeIssue.type === 'SPELLING' ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"
               )}>
                 {activeIssue.type}
               </span>
               <button onClick={() => setActiveIssue(null)}><X size={14} className="text-slate-300 hover:text-black" /></button>
            </div>
            
            <p className="text-[11px] font-bold text-slate-400 uppercase mb-4 tracking-tight">Suggestions for <span className="text-black">"{activeIssue.text}"</span></p>
            
            <div className="space-y-2">
              {activeIssue.suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleApplySuggestion(activeIssue, s)}
                  className="w-full h-10 px-4 flex items-center justify-between bg-slate-50 rounded-lg group hover:bg-[#292828] hover:text-white transition-all text-xs font-bold"
                >
                   {s}
                   <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
              <button 
                onClick={() => ignoreIssue(activeIssue.id)}
                className="w-full h-10 px-4 text-left text-[10px] font-black uppercase text-slate-300 hover:text-black transition-all"
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

ClarityTextarea.displayName = "ClarityTextarea";

function renderTextWithUnderlines(text: string, issues: ClarityIssue[]) {
  if (issues.length === 0) return text;

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  // Sort issues by start index to process sequentially
  const sortedIssues = [...issues].sort((a, b) => a.startIndex - b.startIndex);

  sortedIssues.forEach((issue, idx) => {
    // Add text before the issue
    if (issue.startIndex > lastIndex) {
      result.push(text.substring(lastIndex, issue.startIndex));
    }

    // Add the underlined text
    result.push(
      <span 
        key={`issue-${idx}`}
        className={cn(
          "border-b-2",
          issue.type === 'SPELLING' ? "border-red-400" : "border-amber-400"
        )}
      >
        {text.substring(issue.startIndex, issue.endIndex)}
      </span>
    );

    lastIndex = issue.endIndex;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result;
}
