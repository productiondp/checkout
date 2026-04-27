"use client";

import { useState, useEffect, useCallback } from 'react';
import { ClarityService, ClarityIssue } from '@/services/clarity-service';

/**
 * USE CLARITY ASSISTANT
 * Debounced hook for real-time text analysis.
 */
export function useClarityAssistant(text: string, delay: number = 400, mode: 'POST' | 'CHAT' = 'POST', type?: string) {
  const [issues, setIssues] = useState<ClarityIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!text || text.trim().length === 0) {
      setIssues([]);
      return;
    }

    setIsAnalyzing(true);
    const handler = setTimeout(async () => {
      try {
        const detectedIssues = await ClarityService.analyze(text, mode, type);
        setIssues(detectedIssues);
      } catch (err) {
        console.error("Clarity analysis failed:", err);
      } finally {
        setIsAnalyzing(false);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [text, delay, mode, type]);

  const refineText = useCallback(async (currentText: string) => {
    return await ClarityService.refine(currentText, type);
  }, [type]);

  const ignoreIssue = (id: string) => {
    setIssues(prev => prev.filter(issue => issue.id !== id));
  };

  return {
    issues,
    isAnalyzing,
    refineText,
    ignoreIssue
  };
}
