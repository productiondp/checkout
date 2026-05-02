"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AuthSubmissionState = 'SECURING' | 'VERIFYING' | 'SYNCING' | 'SUCCESS' | 'FAILED';

interface AuthSubmissionStatusProps {
  state: AuthSubmissionState;
  error?: string | null;
  onRetry: () => void;
}

const STATE_CONFIG = {
  SECURING: {
    label: "Securing Credentials",
    icon: Lock,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    description: "Encrypting your data for transit"
  },
  VERIFYING: {
    label: "Verifying Identity",
    icon: ShieldCheck,
    color: "text-[#E53935]",
    bg: "bg-red-50",
    description: "Connecting to the secure network"
  },
  SYNCING: {
    label: "Syncing Workspace",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-50",
    description: "Building your professional profile"
  },
  SUCCESS: {
    label: "Welcome to the Network",
    icon: UserCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    description: "Your session is verified and live"
  },
  FAILED: {
    label: "Authentication Failed",
    icon: AlertCircle,
    color: "text-[#E53935]",
    bg: "bg-red-50",
    description: "We couldn't verify your credentials"
  }
};

export default function AuthSubmissionStatus({ state, error, onRetry }: AuthSubmissionStatusProps) {
  const config = STATE_CONFIG[state];
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center p-6 text-center overflow-hidden"
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-12">
        
        {/* WHEEL ANIMATION HERO */}
        <div className="relative h-48 w-48 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="relative z-10"
            >
              {/* Outer Glow */}
              <div className={cn(
                "absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse",
                state === 'FAILED' ? "bg-red-500" : state === 'SUCCESS' ? "bg-emerald-500" : "bg-[#E53935]"
              )} />
              
              {/* The Wheel */}
              <div className="relative h-32 w-32 rounded-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)] flex items-center justify-center border border-black/[0.02]">
                {state !== 'SUCCESS' && state !== 'FAILED' && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray="377"
                      initial={{ strokeDashoffset: 377 }}
                      animate={{ 
                        strokeDashoffset: [377, 100, 377],
                        rotate: 360
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className={cn(config.color, "opacity-40")}
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="314"
                      initial={{ strokeDashoffset: 314 }}
                      animate={{ 
                        strokeDashoffset: [314, 200, 314],
                        rotate: -360
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={config.color}
                    />
                  </svg>
                )}
                
                <div className={cn("relative z-20", config.color)}>
                   {state === 'SUCCESS' ? <CheckCircle2 size={48} strokeWidth={3} className="animate-in zoom-in duration-500" /> :
                    state === 'FAILED' ? <AlertCircle size={48} strokeWidth={3} /> :
                    <Icon size={32} strokeWidth={2.5} className="animate-pulse" />}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* TEXT CONTENT */}
        <div className="space-y-4 max-w-xs">
          <motion.h2 
            key={`title-${state}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "text-4xl font-black italic uppercase tracking-tighter leading-[0.8]",
              config.color
            )}
          >
            {config.label}
          </motion.h2>
          <motion.p 
            key={`desc-${state}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[11px] font-black text-black/20 uppercase tracking-[0.2em] leading-relaxed"
          >
            {error || config.description}
          </motion.p>
        </div>

        {/* ACTIONS */}
        <div className="w-full">
          {state === 'FAILED' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="h-16 w-full bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              Try Again
            </motion.button>
          )}
        </div>

      </div>
    </motion.div>
  );
}
