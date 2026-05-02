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
      className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center"
    >
      <div className="w-full max-w-sm space-y-8">
        
        {/* ICON HERO */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotate: 20 }}
              className={cn(
                "h-24 w-24 mx-auto rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10",
                config.bg,
                config.color
              )}
            >
              {state === 'SUCCESS' ? (
                <Icon size={40} className="animate-in zoom-in duration-500" />
              ) : (
                <Loader2 size={40} className="animate-spin" />
              )}
            </motion.div>
          </AnimatePresence>

          {state === 'SUCCESS' && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-emerald-200 rounded-full blur-3xl -z-10"
            />
          )}
        </div>

        {/* TEXT CONTENT */}
        <div className="space-y-3">
          <motion.h2 
            key={`title-${state}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "text-3xl font-black italic uppercase tracking-tight",
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
            className="text-[12px] font-bold text-slate-400 uppercase tracking-widest"
          >
            {error || config.description}
          </motion.p>
        </div>

        {/* ACTIONS */}
        <div className="pt-8">
          {state === 'FAILED' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="h-16 w-full bg-black text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
            >
              Try Again
            </motion.button>
          )}
        </div>

      </div>
    </motion.div>
  );
}
