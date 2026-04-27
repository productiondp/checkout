"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Zap, ShieldCheck, Check, MessageSquare, ArrowRight, Shield, BadgeCheck, Lock, ArrowUpRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { analytics } from "@/utils/analytics";

interface DealEngineProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
}

export default function DealEngine({ isOpen, onClose, deal }: DealEngineProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"OVERVIEW" | "PROPOSAL" | "TRANSMITTING" | "SUCCESS">("OVERVIEW");
  const [proposal, setProposal] = useState("");

  if (!isOpen || !deal) return null;

  const handleOpenChats = () => {
    onClose();
    router.push("/chat");
  };

  const handleSubmitProposal = async () => {
    if (user?.id === deal.author_id) {
      alert("You cannot connect to your own post.");
      return;
    }

    // Track Dynamic Synergy (Highest Weight)
    if (user?.base_tag && deal?.base_tag) {
       analytics.trackInteraction(user.base_tag, deal.base_tag, 'REPLY');
    }

    setStep("TRANSMITTING");
    
    try {
      const supabase = createClient();
      
      // 1. Get definitive Auth ID (Avoids any profile sync latency issues)
      const authUser = user;
      if (!authUser) throw new Error("Authentication required. Please refresh.");

      // Support both naming conventions (author.id, author_id vs user_id)
      const recipientId = deal.author?.id || deal.author_id || deal.user_id;
      if (!recipientId) throw new Error("Recipient ID not found for this post.");
      
      if (authUser.id === recipientId) {
        throw new Error("You cannot connect to your own post.");
      }

      // 2. Check for existing connection
      const { data: existing } = await supabase
        .from('connections')
        .select('id')
        .or(`and(sender_id.eq.${authUser.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${authUser.id})`)
        .maybeSingle();

      let targetId = existing?.id;
      
      if (!targetId) {
        // 3. Perform the EXACT insert from matches/page.tsx
        const { data, error: insertErr } = await supabase
          .from('connections')
          .insert({
            sender_id: authUser.id,
            receiver_id: recipientId,
            status: 'PENDING'
          })
          .select()
          .single();

        if (insertErr) {
           throw new Error(`Security Policy: ${insertErr.message}`);
        }
        targetId = data?.id;
      }

      // 4. Send separate message only if connection is established
      if (targetId) {
        try {
          await supabase.from('messages').insert({
            connection_id: targetId,
            sender_id: authUser.id,
            content: proposal || `Hi ${deal.author}, I saw your post: ${deal.title}`
          });
        } catch (e) {
          console.warn("Message sync skipped");
        }
      }

      analytics.track('CONNECTION_SENT', authUser.id, { receiverId: recipientId, postId: deal.id });
      setStep("SUCCESS");
    } catch (err: any) {
      console.error("Deal Engine Critical Error:", {
        message: err.message,
        userId: user?.id,
        recipientId: deal?.author_id || deal?.user_id
      });
      alert(err.message);
      setStep("PROPOSAL");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-10 bg-black/40 backdrop-blur-xl">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white border border-black/[0.05] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="px-10 py-8 border-b border-black/[0.03] flex items-center justify-between bg-white relative z-10 shrink-0">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-[#E53935] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-[#E53935]/20">
              <Zap size={32} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-[12px] font-bold text-[#E53935] uppercase tracking-wider mb-1">Post Details</h3>
              <div className="flex items-center gap-2 text-[#1D1D1F]">
                <Lock size={14} className="text-[#86868B]" />
                <h2 className="text-xl font-bold tracking-tight uppercase">Secure Connection</h2>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="h-12 w-12 bg-[#F5F5F7] text-[#86868B] rounded-full flex items-center justify-center hover:bg-[#E8E8ED] transition-all">
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {step === "OVERVIEW" && (
            <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-4 py-1.5 bg-[#F5F5F7] text-[#86868B] border border-black/[0.03] text-[10px] font-bold uppercase rounded-full">{deal.type || 'Post'}</span>
                  <span className="text-[10px] font-bold text-[#86868B]/40 uppercase tracking-widest">#{deal.id?.slice(0, 8)}</span>
                </div>
                <h1 className="text-3xl font-bold text-[#1D1D1F] uppercase leading-[0.9] tracking-tighter">{deal.title || "Post Details"}</h1>
                <div className="p-8 bg-[#F5F5F7] rounded-xl border border-black/[0.03]">
                  <p className="text-lg text-[#1D1D1F]/70 leading-relaxed font-bold uppercase italic">
                    "{deal.content}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-xl bg-[#1D1D1F] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/10 blur-3xl" />
                  <p className="text-[10px] font-bold text-white/40 uppercase mb-4 tracking-widest">Budget</p>
                  <p className="text-3xl font-bold text-white mb-2">{deal.budget || 'Contact'}</p>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#34C759]" />
                    <span className="text-[10px] font-bold uppercase text-white/40">Verified Need</span>
                  </div>
                </div>
                <div className="p-8 rounded-xl bg-[#F5F5F7] border border-black/[0.03] flex flex-col justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-[#86868B] uppercase mb-4 tracking-widest">Match Score</p>
                    <p className={cn(
                      "text-3xl font-bold",
                      (deal.matchScore || 100) >= 75 ? "text-[#34C759]" :
                      (deal.matchScore || 100) >= 50 ? "text-[#FF9500]" : "text-[#E53935]"
                    )}>{deal.matchScore || 100}%</p>
                  </div>
                  <div className="h-1.5 w-full bg-black/[0.05] rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        (deal.matchScore || 100) >= 75 ? "bg-[#34C759]" :
                        (deal.matchScore || 100) >= 50 ? "bg-[#FF9500]" : "bg-[#E53935]"
                      )} 
                      style={{ width: `${deal.matchScore || 100}%` }} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 p-8 bg-[#F5F5F7] rounded-xl border border-black/[0.03]">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border border-black/[0.05] shrink-0">
                  <img src={deal.avatar} className="w-full h-full object-cover grayscale" alt="" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1 tracking-widest">Posted By</p>
                  <h4 className="text-[18px] font-bold text-[#1D1D1F] uppercase leading-none">{deal.author}</h4>
                </div>
                <div className="h-12 w-12 bg-white border border-black/[0.03] rounded-2xl flex items-center justify-center text-[#34C759] shadow-sm">
                  <BadgeCheck size={28} />
                </div>
              </div>

              <button 
                onClick={() => setStep("PROPOSAL")}
                className="w-full h-24 bg-[#E53935] text-white rounded-2xl font-bold text-[18px] uppercase shadow-2xl shadow-[#E53935]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4"
              >
                I can help <ArrowUpRight size={24} strokeWidth={3} />
              </button>
            </div>
          )}

          {step === "PROPOSAL" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="space-y-4">
                <p className="text-[12px] font-bold text-[#E53935] uppercase tracking-widest">Help Out</p>
                <h3 className="text-3xl font-bold text-[#1D1D1F] uppercase leading-none tracking-tighter">Your Message</h3>
              </div>

              <textarea 
                autoFocus
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                placeholder="Tell them how you can help..."
                className="w-full h-64 bg-[#F5F5F7] p-8 rounded-xl border border-black/[0.03] focus:bg-white focus:border-[#E53935]/20 focus:ring-4 focus:ring-[#E53935]/5 text-[18px] font-bold text-[#1D1D1F] outline-none resize-none transition-all placeholder:text-[#86868B]/30 uppercase"
              />

              <div className="flex items-center gap-3 p-6 bg-[#34C759]/5 text-[#34C759] rounded-xl border border-[#34C759]/10">
                <Shield size={20} className="shrink-0" />
                <p className="text-[11px] font-bold uppercase tracking-wide">Messages are encrypted and secure.</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setStep("OVERVIEW")}
                  className="h-20 px-10 bg-[#F5F5F7] text-[#86868B] font-bold text-[13px] uppercase hover:text-[#1D1D1F] transition-all rounded-2xl border border-black/[0.03]"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmitProposal}
                  disabled={!proposal.trim()}
                  className="flex-1 h-20 bg-[#1D1D1F] text-white rounded-2xl font-bold text-[14px] uppercase shadow-2xl hover:bg-black transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center gap-4"
                >
                  Send Message <Zap size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          )}

          {step === "TRANSMITTING" && (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-12 h-[500px]">
              <div className="relative">
                <div className="h-44 w-44 border-4 border-[#F5F5F7] border-t-[#E53935] rounded-full animate-spin shadow-2xl" />
                <Zap size={60} className="absolute inset-0 m-auto text-[#E53935] animate-pulse" fill="currentColor" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-bold text-[#1D1D1F] uppercase tracking-tighter">Sending...</h3>
                <p className="text-[12px] font-bold text-[#86868B] uppercase tracking-widest">Connecting you now</p>
              </div>
            </div>
          )}

          {step === "SUCCESS" && (
            <div className="p-10 py-20 flex flex-col items-center text-center animate-in zoom-in-95 duration-700 h-full justify-center">
              <div className="h-32 w-32 bg-[#34C759] text-white rounded-2xl flex items-center justify-center mb-12 shadow-[0_30px_60px_rgba(52,199,89,0.3)] animate-bounce">
                <Check size={64} strokeWidth={4} />
              </div>
              <div className="space-y-6 mb-16">
                <h2 className="text-5xl font-bold text-[#1D1D1F] uppercase leading-none tracking-tighter">Sent!</h2>
                <p className="text-lg text-[#86868B] font-bold uppercase max-w-sm mx-auto leading-relaxed">
                  Your message has been sent to <strong>{deal.author}</strong>. 
                </p>
              </div>
              <button 
                onClick={handleOpenChats} 
                className="w-full h-24 bg-[#1D1D1F] text-white rounded-2xl font-bold text-lg uppercase shadow-2xl hover:bg-black transition-all active:scale-95"
              >
                Open Chat
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-10 py-8 bg-[#F5F5F7] border-t border-black/[0.03] text-center shrink-0">
          <p className="text-[10px] font-bold uppercase text-[#86868B] tracking-widest">Simple • Direct • Secure</p>
        </div>
      </div>
    </div>
  );
}
