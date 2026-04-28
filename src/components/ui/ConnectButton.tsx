"use client";

import React, { useState } from "react";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useConnections } from "@/hooks/useConnections";

interface ConnectButtonProps {
  targetId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ConnectButton({ targetId, className, size = 'md' }: ConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();
  const { getConnectionState, sendRequest } = useConnections();
  
  if (!user || !targetId || user.id === targetId) return null;

  const status = getConnectionState(targetId);

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== 'NONE' || isConnecting) return;

    setIsConnecting(true);
    try {
      await sendRequest(targetId);
    } catch (err) {
      console.error("Connect failed:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const sizeClasses = {
    sm: "h-10 px-4 text-[10px]",
    md: "h-14 px-8 text-[12px]",
    lg: "h-16 px-10 text-[14px]"
  };

  if (status === 'CONNECTED') return (
    <div className={cn(
      sizeClasses[size],
      "rounded-2xl bg-emerald-50 text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2",
      className
    )}>
      <CheckCircle2 size={size === 'sm' ? 14 : 16} /> Partnered
    </div>
  );

  if (status === 'PENDING') return (
    <div className={cn(
      sizeClasses[size],
      "rounded-2xl bg-slate-50 text-slate-400 font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-default",
      className
    )}>
      Sent <UserPlus size={size === 'sm' ? 14 : 16} />
    </div>
  );

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={handleConnect}
      disabled={isConnecting}
      className={cn(
        sizeClasses[size],
        "rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300",
        isConnecting ? "bg-slate-50 text-slate-400" :
        "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white border border-black/[0.05]",
        className
      )}
    >
      {isConnecting ? "Linking..." : "Link Partner"}
      <UserPlus size={size === 'sm' ? 14 : 16} />
    </motion.button>
  );
}
