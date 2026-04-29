"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  MoreHorizontal, 
  Send, 
  ChevronLeft, 
  CheckCheck,
  Check,
  Clock,
  MessageSquare,
  Settings,
  Zap,
  CheckCircle2,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { useAwsChat } from "@/hooks/useAwsChat";
import { motion, AnimatePresence } from "framer-motion";
import { ClarityInput } from "@/components/ui/ClarityInput";
import { formatRelativeTime } from "@/utils/date-utils";

interface AwsChatViewProps {
  userId: string;
}

export function AwsChatView({ userId }: AwsChatViewProps) {
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation, 
    messages, 
    isLoading, 
    loadMessages, 
    sendMessage,
    handleTyping,
    typingUsers,
    isWsConnected,
    hasMore,
    loadMore,
    messageCount
  } = useAwsChat(userId);

  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // 📈 GROWTH: Trigger Connect Prompt after 3 messages
  useEffect(() => {
    if (messageCount >= 3 && !showConnectPrompt && activeConversation?.type === 'direct') {
      setShowConnectPrompt(true);
    }
  }, [messageCount, activeConversation, showConnectPrompt]);

  // Auto-scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.conversationId);
    }
  }, [activeConversation, loadMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;
    
    const text = inputText;
    setInputText("");
    await sendMessage(text);
  };

  const isTyping = Object.values(typingUsers).some(Boolean);

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* 1. CONVERSATION LIST (SIDEBAR) */}
      <aside className={cn(
        "w-full md:w-80 lg:w-[350px] border-r border-black/[0.03] flex flex-col transition-all shrink-0", 
        activeConversation && "hidden md:flex"
      )}>
        <div className="p-8 pb-4">
           <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit">Neural Inbox</h1>
              <div className={cn(
                "h-9 w-9 rounded-[10px] flex items-center justify-center transition-all",
                isWsConnected ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500 animate-pulse"
              )}>
                <Zap size={16} fill="currentColor" />
              </div>
           </div>
           <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#E53935] transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search AWS threads..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full h-10 bg-[#F5F5F7] border border-black/[0.03] rounded-[10px] pl-10 pr-4 text-[12px] font-bold text-[#1D1D1F] outline-none focus:bg-white focus:border-[#E53935]/20 transition-all" 
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
           {conversations
             .filter(c => c.conversationId.toLowerCase().includes(searchQuery.toLowerCase()))
             .map((convo) => {
               const isSelected = activeConversation?.conversationId === convo.conversationId;
               const isUnread = (convo.unreadCount || 0) > 0;
               
               return (
                 <button 
                  key={convo.conversationId} 
                  onClick={() => setActiveConversation(convo)} 
                  className={cn(
                    "w-full flex items-center gap-3.5 p-3.5 rounded-[12px] transition-all group relative", 
                    isSelected ? "bg-black text-white shadow-xl" : "hover:bg-[#F5F5F7]"
                  )}
                >
                    <div className="h-12 w-12 rounded-[10px] overflow-hidden shrink-0 border-2 border-white shadow-sm bg-slate-100">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${convo.conversationId}`} className="w-full h-full object-cover" alt="" />
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className={cn(
                          "text-[13px] uppercase font-outfit truncate", 
                          isSelected ? "text-white font-black" : "text-[#1D1D1F] font-bold"
                        )}>
                          Thread #{convo.conversationId.slice(-4)}
                        </h4>
                        <span className={cn("text-[8px] font-black uppercase", isSelected ? "text-white/40" : "text-black/10")}>
                          {formatRelativeTime(convo.lastMessageAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                          "text-[10px] truncate leading-tight", 
                          isSelected ? "text-white/60 font-bold" : "text-black/30 font-medium"
                        )}>
                          {convo.lastMessage || "Start a secure conversation..."}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {isWsConnected && !isSelected && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                          {isUnread && (
                            <div className="h-4 min-w-[16px] px-1 bg-[#E53935] rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0">
                              {convo.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                 </button>
               );
             })}
           
           {conversations.length === 0 && !isLoading && (
              <div className="py-20 text-center opacity-20 italic text-[10px] font-black uppercase tracking-widest">No Active AWS Streams</div>
           )}
        </div>
      </aside>

      {/* 2. CHAT CONTENT */}
      <main className={cn(
        "flex-1 flex flex-col bg-[#FBFBFD] overflow-hidden relative", 
        !activeConversation && "hidden md:flex"
      )}>
        {activeConversation ? (
          <>
            <header className="h-24 px-8 flex items-center justify-between bg-white border-b border-black/[0.03] shrink-0">
               <div className="flex items-center gap-4">
                  <button onClick={() => setActiveConversation(null)} className="md:hidden h-10 w-10 rounded-[10px] flex items-center justify-center bg-[#F5F5F7]"><ChevronLeft size={18} /></button>
                  <div className="flex items-center gap-4">
                     <div className="h-11 w-11 rounded-[10px] overflow-hidden shadow-sm border border-black/[0.03] bg-slate-100">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeConversation.conversationId}`} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h2 className="text-[15px] font-black text-[#1D1D1F] leading-tight uppercase font-outfit">Thread #{activeConversation.conversationId.slice(-4)}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className={cn("h-1.5 w-1.5 rounded-full", isWsConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                           <span className={cn("text-[9px] font-black uppercase tracking-widest", isWsConnected ? "text-emerald-500" : "text-red-500")}>
                              {isWsConnected ? "AWS Neural Sync" : "Sync Lost - Polling Fallback"}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
               
               <button className="h-10 w-10 flex items-center justify-center rounded-[10px] bg-[#F5F5F7] text-black/40 hover:bg-black hover:text-white transition-all">
                  <MoreHorizontal size={18} />
               </button>
            </header>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-white/50 relative">
               <AnimatePresence>
               {messages.slice().reverse().map((msg) => {
                 const isMe = msg.senderId === userId;
                 
                 return (
                   <motion.div 
                    key={msg.messageId} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex flex-col w-full", isMe ? "items-end" : "items-start")}
                   >
                     <div className={cn(
                       "p-5 rounded-[15px] max-w-[70%] text-[13px] font-bold shadow-sm transition-all", 
                       isMe ? "bg-[#E53935] text-white rounded-tr-[2px]" : "bg-white border border-black/[0.03] text-black/60 rounded-tl-[2px]"
                     )}>
                       {msg.text}
                     </div>
                     <div className="flex items-center gap-2 mt-2 px-1">
                        <span className="text-[9px] font-black uppercase text-black/10">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <div className="flex items-center">
                            {msg.status === 'SENDING' && <Clock size={10} className="text-black/10 animate-spin" />}
                            {msg.status === 'SENT' && <Check size={10} className="text-black/10" />}
                            {msg.status === 'DELIVERED' && <CheckCheck size={10} className="text-black/20" />}
                            {msg.status === 'SEEN' && <CheckCheck size={10} className="text-[#E53935]" />}
                          </div>
                        )}
                     </div>
                   </motion.div>
                 );
               })}
               </AnimatePresence>
               
               {isTyping && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                   <div className="h-8 w-12 bg-white border border-black/[0.03] rounded-full flex items-center justify-center gap-1 shadow-sm">
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 h-1 bg-[#E53935] rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 h-1 bg-[#E53935] rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 h-1 bg-[#E53935] rounded-full" />
                   </div>
                   <span className="text-[9px] font-black uppercase text-black/20 italic">Partner is typing...</span>
                 </motion.div>
               )}

               {/* 📈 GROWTH: CONVERSION PROMPT */}
               {showConnectPrompt && (
                 <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="bg-white border border-black/[0.03] rounded-[20px] p-6 text-center shadow-2xl relative overflow-hidden group"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                    <div className="h-12 w-12 bg-[#E53935]/10 text-[#E53935] rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <h4 className="text-[14px] font-black uppercase font-outfit mb-2 relative z-10">Momentum detected</h4>
                    <p className="text-[10px] font-bold text-black/40 uppercase mb-6 relative z-10 leading-relaxed">You've exchanged several messages. Ready to add them to your neural network?</p>
                    <div className="flex gap-2 relative z-10">
                      <button onClick={() => setShowConnectPrompt(false)} className="flex-1 h-10 bg-[#F5F5F7] rounded-[10px] text-[9px] font-black uppercase">Later</button>
                      <button 
                        onClick={async () => {
                          const { ConnectionService } = await import("@/services/connection-service");
                          const recipientId = activeConversation?.participants.find(p => p !== userId);
                          if (recipientId) await ConnectionService.requestConnection(userId, recipientId);
                          setShowConnectPrompt(false);
                        }}
                        className="flex-1 h-10 bg-black text-white rounded-[10px] text-[9px] font-black uppercase shadow-lg shadow-black/20"
                      >
                        Request Connection
                      </button>
                    </div>
                 </motion.div>
               )}

               <div ref={messageEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="p-6 bg-white border-t border-black/[0.03]">
               <form onSubmit={handleSend} className="flex items-center gap-3 bg-[#F5F5F7] rounded-full p-1.5 pl-6 border border-black/[0.03] focus-within:bg-white focus-within:shadow-xl transition-all">
                  <ClarityInput 
                    value={inputText} 
                    onChange={(e) => {
                      setInputText(e.target.value);
                      handleTyping();
                    }} 
                    placeholder="AWS Stream Secured. Type a message..." 
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()} 
                    className={cn(
                      "h-11 w-11 flex items-center justify-center rounded-full transition-all active:scale-95", 
                      inputText.length > 0 ? "bg-[#E53935] text-white shadow-lg" : "bg-black/5 text-black/10"
                    )}
                  >
                    <Send size={18} />
                  </button>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
             <div className="h-16 w-16 bg-white border border-black/[0.03] rounded-[10px] flex items-center justify-center text-black/20 mb-6">
                <MessageSquare size={24} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest italic">Select an AWS Stream to initialize</p>
          </div>
        )}
      </main>
    </div>
  );
}
