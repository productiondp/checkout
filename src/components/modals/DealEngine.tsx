"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Zap, ShieldCheck, Check, MessageSquare, ArrowRight, Shield, BadgeCheck, Lock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface DealEngineProps {
 isOpen: boolean;
 onClose: () => void;
 deal: any;
}

import { useAuth } from "@/hooks/useAuth";

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
    setStep("TRANSMITTING");
    
    try {
      const supabase = createClient();
      
      if (!user || !deal.author_id) throw new Error("Connection lost. Please login.");

      // 1. Check if room exists between these two users
      const { data: existingRooms } = await supabase
        .from('participants')
        .select('room_id')
        .eq('user_id', user.id);
      
      let targetRoomId = null;

      if (existingRooms && existingRooms.length > 0) {
        const roomIds = existingRooms.map(r => r.room_id);
        const { data: mutualRoom } = await supabase
          .from('participants')
          .select('room_id')
          .in('room_id', roomIds)
          .eq('user_id', deal.author_id)
          .maybeSingle();
        
        if (mutualRoom) targetRoomId = mutualRoom.room_id;
      }

      // 2. Create room if not exists
      if (!targetRoomId) {
        const { data: newRoom, error: roomErr } = await supabase
          .from('chat_rooms')
          .insert([{ title: `Chat with ${deal.author}`, is_group: false }])
          .select()
          .single();
        
        if (roomErr) throw roomErr;
        targetRoomId = newRoom.id;

        // Add both participants
        await supabase.from('participants').insert([
          { room_id: targetRoomId, user_id: user.id },
          { room_id: targetRoomId, user_id: deal.author_id }
        ]);
      }

      // 3. Send initial message
      const { error: msgErr } = await supabase.from('messages').insert([{
        room_id: targetRoomId,
        sender_id: user.id,
        content: proposal
      }]);

      if (msgErr) throw msgErr;

      setStep("SUCCESS");
    } catch (err: any) {
      console.error("Deal Engine Error:", err);
      alert(err.message);
      setStep("PROPOSAL");
    }
  };

 return (
 <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-10 bg-slate-900/40 backdrop-blur-xl">
 <div className="absolute inset-0 animate-in fade-in duration-300" onClick={onClose} />
 
 <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
 
 {/* HEADER */}
 <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 relative z-10 shrink-0">
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 bg-[#E53935] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-[#E53935]/20">
 <Zap size={32} />
 </div>
 <div>
 <h3 className="text-[10px] font-bold text-[#E53935] uppercase mb-1.5">Post Details</h3>
 <div className="flex items-center gap-2 text-slate-400">
 <Lock size={12} />
 <h2 className="text-xl font-bold text-slate-900 uppercase leading-none ">Secure Connection</h2>
 </div>
 </div>
 </div>
 <button onClick={onClose} className="h-12 w-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:text-slate-900 transition-all">
 <X size={24} />
 </button>
 </div>

 {/* BODY */}
 <div className="flex-1 overflow-y-auto no-scrollbar">
 {step === "OVERVIEW" && (
 <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <span className="px-4 py-1.5 bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-bold uppercase rounded-lg ">{deal.type || 'Post'}</span>
 <span className="text-[10px] font-bold text-slate-300 uppercase ">ID: {deal.id}</span>
 </div>
 <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 uppercase leading-none er">{deal.title || "Post Details"}</h1>
 <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
 <p className="text-lg text-slate-600 leading-relaxed font-bold uppercase ">
 "{deal.content}"
 </p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/10 blur-3xl" />
 <p className="text-[10px] font-bold text-white/40 uppercase mb-4 ">Budget</p>
 <p className="text-3xl font-bold text-white mb-2">{deal.budget || 'Contact'}</p>
 <div className="flex items-center gap-2">
 <ShieldCheck size={14} className="text-emerald-400" />
 <span className="text-[9px] font-bold uppercase text-white/40">Verified Need</span>
 </div>
 </div>
 <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-sm">
 <div>
 <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 ">Match Score</p>
 <p className="text-3xl font-bold text-slate-900">{deal.matchScore || 100}%</p>
 </div>
 <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
 <div className="h-full bg-slate-900 rounded-full" style={{ width: `${deal.matchScore || 100}%` }} />
 </div>
 </div>
 </div>

 <div className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
 <div className="h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
 <img src={deal.avatar} className="w-full h-full object-cover grayscale px-1" alt="" />
 </div>
 <div className="flex-1">
 <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 ">Posted By</p>
 <h4 className="text-[18px] font-bold text-slate-900 uppercase leading-none ">{deal.author}</h4>
 </div>
 <div className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
 <BadgeCheck size={28} />
 </div>
 </div>

 <button 
 onClick={() => setStep("PROPOSAL")}
 className="w-full h-24 bg-[#E53935] text-white rounded-[2rem] font-bold text-[15px] uppercase shadow-2xl shadow-[#E53935]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
 >
 I can help <ArrowUpRight size={24} strokeWidth={3} />
 </button>
 </div>
 )}

 {step === "PROPOSAL" && (
 <div className="p-10 space-y-8 animate-in slide-in-from-right-10 duration-500">
 <div className="space-y-4">
 <p className="text-[11px] font-bold text-[#E53935] uppercase ">Help Out</p>
 <h3 className="text-3xl font-bold text-slate-900 uppercase leading-none er">Your Message</h3>
 </div>

 <textarea 
 autoFocus
 value={proposal}
 onChange={(e) => setProposal(e.target.value)}
 placeholder="Tell them how you can help..."
 className="w-full h-72 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 focus:border-[#E53935]/40 text-[18px] font-bold text-slate-900 outline-none resize-none transition-all placeholder:text-slate-200 uppercase "
 />

 <div className="flex items-center gap-3 p-6 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
 <Shield size={20} className="shrink-0" />
 <p className="text-[10px] font-bold uppercase ">Messages are secure. Your privacy is important.</p>
 </div>

 <div className="flex gap-6 pt-4">
 <button 
 onClick={() => setStep("OVERVIEW")}
 className="h-20 px-10 bg-slate-100 text-slate-400 font-bold text-[11px] uppercase hover:text-slate-900 transition-all rounded-[1.5rem] border border-slate-200"
 >
 Back
 </button>
 <button 
 onClick={handleSubmitProposal}
 disabled={!proposal.trim()}
 className="flex-1 h-20 bg-slate-900 text-white rounded-[1.5rem] font-bold text-[12px] uppercase shadow-2xl hover:bg-[#E53935] transition-all disabled:opacity-20 active:scale-95 flex items-center justify-center gap-4"
 >
 Send Message <Zap size={20} fill="currentColor" />
 </button>
 </div>
 </div>
 )}

 {step === "TRANSMITTING" && (
 <div className="p-20 flex flex-col items-center justify-center text-center space-y-12 h-96">
 <div className="relative">
 <div className="h-40 w-40 border-4 border-slate-100 border-t-[#E53935] rounded-full animate-spin shadow-2xl" />
 <Zap size={50} className="absolute inset-0 m-auto text-[#E53935] animate-pulse" fill="currentColor" />
 </div>
 <div className="space-y-4">
 <h3 className="text-3xl font-bold text-slate-900 uppercase">Sending...</h3>
 <p className="text-[11px] font-bold text-slate-400 uppercase ">Connecting you now</p>
 </div>
 </div>
 )}

 {step === "SUCCESS" && (
 <div className="p-10 py-20 flex flex-col items-center text-center animate-in zoom-in-95 duration-700 h-full justify-center">
 <div className="h-32 w-32 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-12 shadow-[0_30px_60px_rgba(16,185,129,0.4)] animate-bounce">
 <Check size={64} strokeWidth={4} />
 </div>
 <div className="space-y-6 mb-16">
 <h2 className="text-5xl font-bold text-slate-900 uppercase leading-none er">Sent!</h2>
 <p className="text-lg text-slate-400 font-bold uppercase max-w-sm mx-auto">
 Your message has been sent to <strong>{deal.author}</strong>. 
 We will notify you when they reply.
 </p>
 </div>
 <button 
 onClick={handleOpenChats} 
 className="w-full h-24 bg-slate-900 text-white rounded-[2rem] font-bold text-lg uppercase shadow-2xl hover:bg-[#E53935] transition-all active:scale-95"
 >
 Open Chat
 </button>
 </div>
 )}
 </div>

 {/* FOOTER */}
 <div className="px-10 py-8 bg-slate-50 border-t border-slate-200 text-center shrink-0">
 <p className="text-[9px] font-bold uppercase text-slate-400 ">Simple • Direct • Secure</p>
 </div>
 </div>
 </div>
 );
}
