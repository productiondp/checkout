"use client";

import React, { useState, useEffect, Suspense } from "react";
import { 
  Search, 
  MoreHorizontal, 
  Send, 
  ChevronLeft, 
  CheckCheck,
  MessageSquare,
  Trash2,
  ShieldAlert,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { analytics } from "@/utils/analytics";
import { useRequiredUser } from "@/hooks/useAuth";
import { useNotifications } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ConnectionService } from "@/services/connection-service";
import { motion, AnimatePresence } from "framer-motion";
import { ClarityInput } from "@/components/ui/ClarityInput";
import TerminalLayout from "@/components/layout/TerminalLayout";

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <TerminalLayout>
        <Suspense fallback={<div className="flex h-full items-center justify-center p-20 text-[10px] font-black uppercase text-[#292828]/20 animate-pulse">Loading...</div>}>
           <ChatContent />
        </Suspense>
      </TerminalLayout>
    </ProtectedRoute>
  );
}

function ChatContent() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const initialParam = searchParams.get('initial');

  const user = useRequiredUser();
  const supabase = createClient();
  const { refreshCounts, setActiveChatId } = useNotifications();
  const [confirmAction, setConfirmAction] = useState<{ type: 'REMOVE' | 'BLOCK'; connectionId: string; partnerName: string } | null>(null);

  useEffect(() => {
    if (initialParam) setMessage(initialParam);
  }, [initialParam]);

  useEffect(() => {
    if (selectedChat?.id && selectedChat.id !== "temp") setActiveChatId(selectedChat.id);
    else setActiveChatId(null);
    return () => setActiveChatId(null);
  }, [selectedChat, setActiveChatId]);

  useEffect(() => {
    async function initChat() {
      if (!user) return;
      analytics.trackScreen('CHAT', user.id);
      const { data: connections } = await supabase.from('connections').select(`id, status, sender:profiles!connections_sender_id_fkey (*), receiver:profiles!connections_receiver_id_fkey (*)`).or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      let formattedChats = (connections || []).map((conn: any) => {
        const partner = conn.sender.id === user.id ? conn.receiver : conn.sender;
        return { id: conn.id, partnerId: partner.id, name: partner.full_name, avatar: partner.avatar_url || DEFAULT_AVATAR, role: partner.role || "Member", isGroup: false };
      });
      const { data: rooms } = await supabase.from('participants').select(`room:chat_rooms (*)`).eq('user_id', user.id);
      if (rooms) formattedChats = [...formattedChats, ...rooms.filter((r:any)=>r.room?.is_group).map((r:any)=>({ id: r.room.id, name: r.room.name, avatar: null, role: "Group Chat", isGroup: true }))];
      setChats(formattedChats);
      if (userParam) {
        const existing = formattedChats.find(c => c.partnerId === userParam);
        if (existing) setSelectedChat(existing);
        else {
          const { data: p } = await supabase.from('profiles').select('*').eq('id', userParam).single();
          if (p) setSelectedChat({ id: "temp", partnerId: p.id, name: p.full_name, avatar: p.avatar_url || DEFAULT_AVATAR, role: p.role || "Member", isGroup: false });
        }
      }
      setIsLoading(false);
    }
    initChat();
  }, [userParam, user?.id]);

  useEffect(() => {
    if (!selectedChat || selectedChat.id === "temp") { setMessages([]); return; }
    async function load() {
      const q = supabase.from('messages').select('*');
      if (selectedChat.isGroup) q.eq('room_id', selectedChat.id); else q.eq('connection_id', selectedChat.id);
      const { data } = await q.order('created_at', { ascending: true });
      if (data) { setMessages(data); const unreads = data.filter(m=>!m.is_read && m.sender_id !== user.id).map(m=>m.id); if (unreads.length>0) { await supabase.from('messages').update({is_read:true}).in('id', unreads); refreshCounts(); } }
    }
    load();
    const ch = supabase.channel(`chat_${selectedChat.id}`).on('postgres_changes', { event:'INSERT', schema:'public', table:'messages' }, (p:any)=>{
      if (selectedChat.isGroup ? p.new.room_id === selectedChat.id : p.new.connection_id === selectedChat.id) {
        setMessages(prev => [...prev, p.new]);
        if (p.new.sender_id !== user.id) { supabase.from('messages').update({is_read:true}).eq('id', p.new.id).then(()=>refreshCounts()); }
      }
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [selectedChat?.id]);

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !user) return;
    let newMessage: any = { sender_id: user.id, content: message, type: 'USER' };
    if (selectedChat.isGroup) newMessage.room_id = selectedChat.id;
    else {
      let connectionId = selectedChat.id;
      if (connectionId === "temp") { const res = await ConnectionService.ensureConnection(user.id, selectedChat.partnerId); connectionId = res.id; setSelectedChat(prev=>({...prev, id: connectionId})); }
      newMessage.connection_id = connectionId; newMessage.receiver_id = selectedChat.partnerId;
    }
    setMessage(""); setMessages(prev=>[...prev, { ...newMessage, id: Math.random().toString(), created_at: new Date().toISOString() }]);
    await supabase.from('messages').insert([newMessage]);
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <aside className={cn("w-full md:w-80 lg:w-[350px] border-r border-black/[0.03] flex flex-col transition-all shrink-0", selectedChat && "hidden md:flex")}>
        <div className="p-8 pb-4">
           <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit">Messages</h1>
              <button onClick={() => setShowSettings(true)} className="h-9 w-9 bg-[#F5F5F7] rounded-[10px] flex items-center justify-center hover:bg-[#E53935] hover:text-white transition-all"><Settings size={16} /></button>
           </div>
           <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#E53935] transition-colors" size={14} />
              <input type="text" placeholder="Search chats..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 bg-[#F5F5F7] border border-black/[0.03] rounded-[10px] pl-10 pr-4 text-[12px] font-bold text-[#1D1D1F] outline-none focus:bg-white focus:border-[#E53935]/20 transition-all" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
           {chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((chat) => (
             <button key={chat.id} onClick={() => setSelectedChat(chat)} className={cn("w-full flex items-center gap-3.5 p-3.5 rounded-[12px] transition-all group relative", selectedChat?.id === chat.id ? "bg-black text-white shadow-xl" : "hover:bg-[#F5F5F7]")}>
                <div className="h-12 w-12 rounded-[10px] overflow-hidden shrink-0 border-2 border-white shadow-sm"><img src={chat.avatar} className="w-full h-full object-cover" alt="" /></div>
                <div className="flex-1 min-w-0 text-left"><h4 className="text-[13px] font-black truncate uppercase font-outfit mb-0.5">{chat.name}</h4><p className={cn("text-[9px] font-black uppercase tracking-widest truncate", selectedChat?.id === chat.id ? "text-white/40" : "text-black/20")}>{chat.role}</p></div>
                {selectedChat?.id === chat.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E53935] rounded-r-full" />}
             </button>
           ))}
        </div>
      </aside>

      <main className={cn("flex-1 flex flex-col bg-[#FBFBFD] overflow-hidden relative", !selectedChat && "hidden md:flex")}>
        {selectedChat ? (
          <>
            <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-black/[0.03] shrink-0">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedChat(null)} className="md:hidden h-10 w-10 rounded-[10px] flex items-center justify-center bg-[#F5F5F7]"><ChevronLeft size={18} /></button>
                  <div className="flex items-center gap-3"><div className="h-11 w-11 rounded-[10px] overflow-hidden shadow-sm border border-black/[0.03]"><img src={selectedChat.avatar} className="w-full h-full object-cover" alt="" /></div><div><h2 className="text-[15px] font-black text-[#1D1D1F] leading-tight uppercase font-outfit">{selectedChat.name}</h2><span className="text-[9px] font-black text-black/20 uppercase tracking-widest">{selectedChat.role}</span></div></div>
               </div>
               <div className="relative group/chat-menu">
                  <button className="h-10 w-10 flex items-center justify-center rounded-[10px] bg-[#F5F5F7] text-black/40 hover:bg-black hover:text-white transition-all"><MoreHorizontal size={18} /></button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-black/[0.05] rounded-[10px] shadow-2xl overflow-hidden opacity-0 invisible group-hover/chat-menu:opacity-100 group-hover/chat-menu:visible transition-all z-50 p-1">
                     <button onClick={() => setConfirmAction({ type: 'REMOVE', connectionId: selectedChat.id, partnerName: selectedChat.name })} className="w-full h-10 px-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#E53935] hover:bg-red-50 rounded-[6px] transition-all"><Trash2 size={14} /> Remove</button>
                     <button onClick={() => setConfirmAction({ type: 'BLOCK', connectionId: selectedChat.id, partnerName: selectedChat.name })} className="w-full h-10 px-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black hover:bg-slate-50 rounded-[6px] transition-all"><ShieldAlert size={14} /> Block</button>
                  </div>
               </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-white/50">
               {messages.map((msg) => {
                 const isMe = msg.sender_id === user?.id;
                 return (
                   <div key={msg.id} className={cn("flex flex-col w-full", isMe ? "items-end" : "items-start")}>
                     <div className={cn("p-5 rounded-[15px] max-w-[70%] text-[13px] font-bold shadow-sm", isMe ? "bg-[#E53935] text-white rounded-tr-[2px]" : "bg-white border border-black/[0.03] text-black/60 rounded-tl-[2px]")}>{msg.content}</div>
                     <div className={cn("flex items-center gap-2 mt-2 px-1")}><span className="text-[9px] font-black uppercase text-black/10">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{isMe && <CheckCheck size={12} className="text-[#E53935]" />}</div>
                   </div>
                 );
               })}
            </div>
            <div className="p-6 bg-white border-t border-black/[0.03]">
               <form onSubmit={handleSend} className="flex items-center gap-3 bg-[#F5F5F7] rounded-full p-1.5 pl-6 border border-black/[0.03] focus-within:bg-white focus-within:shadow-xl transition-all"><ClarityInput value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." /><button type="submit" disabled={!message.trim()} className={cn("h-11 w-11 flex items-center justify-center rounded-full transition-all active:scale-95", message.length > 0 ? "bg-[#E53935] text-white shadow-lg" : "bg-black/5 text-black/10")}><Send size={18} /></button></form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
             <div className="h-16 w-16 bg-white border border-black/[0.03] rounded-[10px] flex items-center justify-center text-black/20 mb-6"><MessageSquare size={24} /></div>
             <p className="text-[10px] font-black uppercase tracking-widest">Select a thread to continue</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {confirmAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-sm bg-white rounded-[10px] p-10 text-center border border-black/[0.05]">
              <div className={cn("h-16 w-16 rounded-[10px] flex items-center justify-center mx-auto mb-6", confirmAction.type === 'BLOCK' ? "bg-black text-white" : "bg-red-50 text-[#E53935]")}>{confirmAction.type === 'BLOCK' ? <ShieldAlert size={28} /> : <Trash2 size={28} />}</div>
              <h3 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit mb-3">{confirmAction.type === 'BLOCK' ? "Block User?" : "Remove Partner?"}</h3>
              <p className="text-[10px] font-bold text-black/40 uppercase mb-8 leading-relaxed">Confirm action for <strong>{confirmAction.partnerName}</strong>.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmAction(null)} className="flex-1 h-12 bg-[#F5F5F7] rounded-[10px] text-[10px] font-black uppercase">Cancel</button>
                <button onClick={async () => { if (confirmAction.type === 'BLOCK') await ConnectionService.blockUser(confirmAction.connectionId); else await ConnectionService.removeConnection(confirmAction.connectionId); setConfirmAction(null); window.location.reload(); }} className={cn("flex-1 h-12 rounded-[10px] text-[10px] font-black uppercase text-white shadow-lg", confirmAction.type === 'BLOCK' ? "bg-black" : "bg-[#E53935] shadow-red-500/20")}>Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
