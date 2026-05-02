"use client";

import React from "react";
import { usePathname } from "next/navigation";
import GlobalHeader from "./GlobalHeader";
import MobileNav from "./MobileNav";
import DesktopSidebar from "./DesktopSidebar";
import RightSocialRail from "./RightSocialRail";

import { ConnectionProvider } from "@/hooks/useConnections";

import { analytics } from "@/utils/analytics";
import { insights } from "@/utils/insights_engine";
import { healthMonitor } from "@/utils/health_monitor";
import { optimization } from "@/utils/optimization_engine";
import { decisionMemory } from "@/utils/decision_memory";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
    analytics.track('SESSION_START');
    optimization.run();
    
    // Expose insights engine to window for internal debugging
    if (typeof window !== 'undefined') {
      (window as any).insights = insights;
      (window as any).getReport = async () => {
        const report = await insights.generateReport();
        console.log("%c[CHECKOUT OS INSIGHTS]", "color: #E53935; font-weight: bold; font-size: 14px;");
        console.table(report);
        return report;
      };
      (window as any).getHealthReport = async () => {
        const report = await healthMonitor.getHealthReport();
        console.log("%c[CHECKOUT OS HEALTH]", "color: #E53935; font-weight: bold; font-size: 14px;");
        console.table(report);
        return report;
      };
      (window as any).getDecisionHistory = () => {
        const history = decisionMemory.getHistory();
        const patterns = decisionMemory.getPatterns();
        console.log("%c[CHECKOUT OS MEMORY]", "color: #E53935; font-weight: bold; font-size: 14px;");
        console.log("Strategic Patterns:", patterns);
        console.table(history);
        return history;
      };
      (window as any).setWeights = (weights: any, reason: string, outcome: string, duration?: number) => {
        optimization.setWeights(weights, reason, outcome, duration);
      };
      (window as any).setPriorityMode = (mode: 'normal' | 'growth' | 'precision', reason: string) => {
        optimization.setPriorityMode(mode, reason);
      };
      (window as any).resetToBaseline = () => {
        optimization.resetToBaseline();
      };

      // Service Worker intentionally removed to prevent development caching loops
    }
  }, []);

  React.useEffect(() => {
    if (mounted) {
      analytics.trackScreen(pathname);
    }
  }, [pathname, mounted]);

  const isAuthPage = pathname === "/" || 
                    pathname === "/auth" || 
                    pathname === "/onboarding";

  if (!mounted) {
    return (
      <div className="h-screen-safe w-full max-w-[1920px] mx-auto flex flex-col items-center justify-center bg-[#0A0A0A] selection:bg-[#E53935]/20 shadow-2xl">
         <div className="h-12 w-32 relative animate-pulse mb-4">
            <img 
              src="/images/logo.png" 
              alt="Loading..." 
              className="h-full object-contain opacity-20 brightness-0 invert" 
            />
         </div>
         <div className="animate-pulse text-[9px] font-black text-white/20 uppercase ">
            Initializing CheckOut OS...
         </div>
      </div>
    );
  }

  return (
    <ConnectionProvider>
      <div className="min-h-screen-safe w-full max-w-[1920px] mx-auto selection:bg-[#E53935] selection:text-white shadow-2xl">
        {children}
      </div>
    </ConnectionProvider>
  );
}
