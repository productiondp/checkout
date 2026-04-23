"use client";

import React, { useState } from "react";
import { Send, Check, MessageSquare, Clock, UserPlus, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConnections, ConnectionState } from "@/hooks/useConnections";

interface ConnectButtonProps {
  userId: string;
  userName?: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  label?: string;
}

export function ConnectButton({ userId, userName = "this user", variant = "primary", className, label }: ConnectButtonProps) {
  const { getConnectionState, sendRequest } = useConnections();
  const [showModal, setShowModal] = useState(false);
  const state = getConnectionState(userId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state === "CONNECT") {
      setShowModal(true);
    } else if (state === "CONNECTED" || state === "MESSAGE") {
      // Logic for messaging would go here
      window.location.href = `/chat/${userId}`;
    }
  };

  const getButtonConfig = () => {
    switch (state) {
      case "PENDING":
        return {
          icon: Clock,
          text: "Pending",
          class: "bg-slate-100 text-slate-400 cursor-default",
          disabled: true
        };
      case "CONNECTED":
      case "MESSAGE":
        return {
          icon: MessageSquare,
          text: "Message",
          class: "bg-[#292828] text-white hover:bg-[#E53935]",
          disabled: false
        };
      case "ACCEPT_IGNORE":
        return {
          icon: UserPlus,
          text: "Accept",
          class: "bg-[#E53935] text-white",
          disabled: false
        };
      default:
        return {
          icon: UserPlus,
          text: label || "Connect",
          class: "bg-[#292828] text-white hover:bg-[#E53935]",
          disabled: false
        };
    }
  };

  const config = getButtonConfig();

  return (
    <>
      <button 
        onClick={handleClick}
        disabled={config.disabled}
        className={cn(
          "h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl",
          config.class,
          className
        )}
      >
        <config.icon size={16} />
        {config.text}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-[#292828]/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-4xl animate-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-black uppercase text-[#292828]">Initialize <span className="text-[#E53935]">Connection</span></h2>
                 <button onClick={() => setShowModal(false)} className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center"><X size={20} /></button>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-3xl mb-8 flex items-center gap-4">
                 <Sparkles className="text-[#E53935]" size={20} />
                 <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">
                    Connecting with <span className="text-[#292828]">{userName}</span> requires a formal intent declaration.
                 </p>
              </div>

              <div className="space-y-4">
                 <label className="text-[9px] font-black uppercase text-slate-300 ml-1">Optional Mandate / Message</label>
                 <textarea 
                   rows={4}
                   placeholder="Briefly describe your intent for establishing this connection..."
                   className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all resize-none"
                 />
              </div>

              <div className="mt-10 flex gap-4">
                 <button onClick={() => setShowModal(false)} className="flex-1 h-16 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#292828] transition-all">Cancel</button>
                 <button 
                   onClick={() => {
                     sendRequest(userId);
                     setShowModal(false);
                   }}
                   className="flex-2 h-16 px-12 bg-[#E53935] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[#292828] transition-all flex items-center justify-center gap-3"
                 >
                    Send Request <Send size={16} />
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
