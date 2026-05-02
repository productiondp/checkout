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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] overflow-hidden selection:none">
         <div className="relative flex flex-col items-center">
            {/* AMBIENT GLOW */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.1, 0.2, 0.1], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[#E53935] rounded-full blur-[120px] -z-10"
            />
            
            {/* LOGO REVEAL */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-16 w-40 relative mb-12"
            >
               <img 
                 src="/images/logo.png" 
                 alt="Checkout OS" 
                 className="h-full object-contain brightness-0 invert opacity-40" 
               />
               
               {/* SCANNER LINE */}
               <motion.div 
                 animate={{ top: ["0%", "100%", "0%"] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E53935] to-transparent z-20 shadow-[0_0_15px_#E53935]"
               />
            </motion.div>

            {/* PROGRESS SYSTEM */}
            <div className="w-64 space-y-4">
               <div className="flex justify-between items-end">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] font-outfit"
                  >
                    System Boot
                  </motion.div>
                  <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-[9px] font-bold text-[#E53935] uppercase tracking-widest"
                  >
                    Active
                  </motion.div>
               </div>

               <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E53935] to-transparent w-1/2"
                  />
               </div>

               <div className="flex flex-col items-center gap-2">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] animate-pulse"
                  >
                    Initializing CheckOut OS
                  </motion.div>
                  <div className="flex gap-1">
                     {[1, 2, 3].map((i) => (
                       <motion.div
                         key={i}
                         animate={{ opacity: [0.1, 1, 0.1] }}
                         transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                         className="h-1 w-1 bg-[#E53935] rounded-full"
                       />
                     ))}
                  </div>
               </div>
            </div>
         </div>
         
         {/* DECORATIVE ELEMENTS */}
         <div className="absolute bottom-12 left-12 right-12 flex justify-between pointer-events-none">
            <div className="text-[7px] font-bold text-white/5 uppercase tracking-[0.2em] space-y-1">
               <div>Core.Kernel.Init()</div>
               <div>Network.Handshake.Secure()</div>
               <div>Identity.Verify.Wait()</div>
            </div>
            <div className="text-[7px] font-bold text-white/5 uppercase tracking-[0.2em] text-right space-y-1">
               <div>Build 1.4.22-Prod</div>
               <div>V-Sync.Enabled</div>
               <div>Neural.Cache.Warm</div>
            </div>
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
