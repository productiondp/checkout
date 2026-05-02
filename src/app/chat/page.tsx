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
  Settings,
  Play,
  CheckCircle2
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
import { formatRelativeTime } from "@/utils/date-utils";

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
  const [meetupDetails, setMeetupDetails] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [outcomeSubmitted, setOutcomeSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
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
      setIsLoading(true);
      analytics.trackScreen('CHAT', user.id);
      
      const { data: connections } = await supabase.from('connections').select(`id, status, sender:profiles!connections_sender_id_fkey (*), receiver:profiles!connections_receiver_id_fkey (*)`).or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      const { data: rooms } = await supabase.from('participants').select(`room:chat_rooms (*)`).eq('user_id', user.id);
      
      const { data: unreadData } = await supabase
        .from('messages')
        .select('connection_id, room_id')
        .eq('receiver_id', user.id)
        .eq('is_read', false);

      const { data: lastMsgsData } = await supabase
        .from('messages')
        .select('connection_id, room_id, content, created_at')
        .or(`receiver_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      // Process unread counts
      const unreadMap: Record<string, number> = {};
      unreadData?.forEach(m => {
        const id = m.connection_id || m.room_id;
        if (id) unreadMap[id] = (unreadMap[id] || 0) + 1;
      });

      // Process last messages (since they are ordered by created_at DESC, the first one for each ID is the latest)
      const lastMsgMap: Record<string, any> = {};
      lastMsgsData?.forEach(m => {
        const id = m.connection_id || m.room_id;
        if (id && !lastMsgMap[id]) lastMsgMap[id] = m;
      });

      let formattedChats = (connections || []).map((conn: any) => {
        const partner = conn.sender.id === user.id ? conn.receiver : conn.sender;
        const unread = unreadMap[conn.id] || 0;
        const lastMsg = lastMsgMap[conn.id];
        
        return { 
          id: conn.id, 
          partnerId: partner.id, 
          name: partner.full_name, 
          avatar: partner.avatar_url || DEFAULT_AVATAR, 
          role: partner.role || "Member", 
          isGroup: false,
          unread_count: unread,
          last_message: lastMsg?.content || "",
          last_message_time: lastMsg?.created_at || conn.created_at,
          status: conn.status,
          sender_id: conn.sender_id
        };
      });

      if (rooms) {
        const groupChats = rooms.filter((r:any)=>r.room?.is_group).map((r:any) => {
          const unread = unreadMap[r.room.id] || 0;
          const lastMsg = lastMsgMap[r.room.id];
          
          return { 
            id: r.room.id, 
            name: r.room.name, 
            avatar: null, 
            role: "Group Chat", 
            isGroup: true,
            unread_count: unread,
            last_message: lastMsg?.content || "",
            last_message_time: lastMsg?.created_at || r.room.created_at
          };
        });
        formattedChats = [...formattedChats, ...groupChats];
      }
      
      formattedChats.sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());
      setChats(formattedChats);

      if (userParam) {
        const existing = formattedChats.find(c => c.partnerId === userParam);
        if (existing) setSelectedChat(existing);
        else {
          const { data: p } = await supabase.from('profiles').select('*').eq('id', userParam).single();
          if (p) setSelectedChat({ id: "temp", partnerId: p.id, name: p.full_name, avatar: p.avatar_url || DEFAULT_AVATAR, role: p.role || "Member", isGroup: false, unread_count: 0, last_message: "", last_message_time: new Date().toISOString() });
        }
      }
      setIsLoading(false);
    }
    initChat();
  }, [userParam, user?.id]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('global_chat_updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload) => {
        const msg = payload.new;
        if (msg.receiver_id !== user.id && msg.sender_id !== user.id) return;

        setChats(prev => {
          const chatIdx = prev.findIndex(c => c.id === (msg.connection_id || msg.room_id));
          if (chatIdx === -1) return prev;
          
          const chat = prev[chatIdx];
          const isSelected = selectedChat?.id === chat.id;
          
          const updatedChat = {
            ...chat,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: (isSelected || msg.sender_id === user.id) ? 0 : (chat.unread_count + 1)
          };
          
          const otherChats = prev.filter((_, i) => i !== chatIdx);
          return [updatedChat, ...otherChats];
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, selectedChat?.id]);

  useEffect(() => {
    if (!selectedChat || selectedChat.id === "temp") { setMessages([]); return; }
    async function load() {
      const q = supabase.from('messages').select('*');
      if (selectedChat.isGroup) q.eq('room_id', selectedChat.id); else q.eq('connection_id', selectedChat.id);
      const { data } = await q.order('created_at', { ascending: true });
      if (data) { setMessages(data); const unreads = data.filter(m=>!m.is_read && m.sender_id !== user.id).map(m=>m.id); if (unreads.length>0) { await supabase.from('messages').update({is_read:true}).in('id', unreads); refreshCounts(); } }

      // LOAD GROUP DETAILS
      if (selectedChat.isGroup) {
        const { data: post } = await supabase.from('posts').select('*, author:profiles(*)').eq('room_id', selectedChat.id).single();
        if (post) {
          setMeetupDetails(post);
          setIsHost(post.author_id === user.id);
          const { data: pts } = await supabase.from('participants').select('profiles(*)').eq('room_id', selectedChat.id);
          setParticipants(pts?.map(p => p.profiles) || []);
          
          // Check if already submitted outcome
          const { data: participant } = await supabase
            .from('meetup_participants')
            .select('outcome_data')
            .eq('meetup_id', post.id)
            .eq('user_id', user.id)
            .maybeSingle();
          setOutcomeSubmitted(!!participant?.outcome_data);
        }
      } else {
        setMeetupDetails(null);
        setParticipants([]);
        setIsHost(false);
        setOutcomeSubmitted(false);
      }
    }
    load();
    const ch = supabase.channel(`chat_${selectedChat.id}`).on('postgres_changes', { event:'INSERT', schema:'public', table:'messages' }, (p:any)=>{
      if (selectedChat.isGroup ? p.new.room_id === selectedChat.id : p.new.connection_id === selectedChat.id) {
        // Deduplicate: only add if this message isn't already in state (avoids echo from optimistic add)
        setMessages(prev => {
          const exists = prev.some(m => m.id === p.new.id);
          if (exists) return prev;
          return [...prev, p.new];
        });
        if (p.new.sender_id !== user.id) { supabase.from('messages').update({is_read:true}).eq('id', p.new.id).then(()=>refreshCounts()); }
      }
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [selectedChat?.id]);

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !user || isSending) return;
    setIsSending(true);
    const trimmedMessage = message.trim();
    setMessage("");
    
    let newMessage: any = { sender_id: user.id, content: trimmedMessage, type: 'USER' };
    if (selectedChat.isGroup) newMessage.room_id = selectedChat.id;
    else {
      let connectionId = selectedChat.id;
      if (connectionId === "temp") { 
        const res = await ConnectionService.ensureConnection(user.id, selectedChat.partnerId); 
        connectionId = res.id; 
        setSelectedChat((prev: any)=>({...prev, id: connectionId})); 
      }
      newMessage.connection_id = connectionId; 
      newMessage.receiver_id = selectedChat.partnerId;

      // UNLOCK LOGIC: If this is a reply to a pending intent
      if (selectedChat.status === 'PENDING' && selectedChat.sender_id !== user.id) {
        await supabase.from('connections').update({ status: 'ACCEPTED' }).eq('id', connectionId);
        setChats(prev => prev.map(c => c.id === connectionId ? { ...c, status: 'ACCEPTED' } : c));
        setSelectedChat((prev: any) => ({ ...prev, status: 'ACCEPTED' }));
      }
    }
    
    // Optimistically add with a temp ID, the realtime subscription will replace it
    const tempId = `temp_${Date.now()}`;
    setMessages(prev => [...prev, { ...newMessage, id: tempId, created_at: new Date().toISOString() }]);
    
    const { data: inserted } = await supabase.from('messages').insert([newMessage]).select().single();
    
    // Replace the temp message with the real DB message (which has the real ID)
    if (inserted) {
      setMessages(prev => prev.map(m => m.id === tempId ? inserted : m));
    }
    
    setIsSending(false);
  };

  const isPending = selectedChat?.status === 'PENDING';
  const isSender = selectedChat?.sender_id === user?.id;
  const isLocked = isPending && isSender;


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
           {chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((chat) => {
             const isUnread = chat.unread_count > 0;
             const isSelected = selectedChat?.id === chat.id;
             
             return (
               <button 
                key={chat.id} 
                onClick={() => {
                  setSelectedChat(chat);
                  setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread_count: 0 } : c));
                }} 
                className={cn(
                  "w-full flex items-center gap-3.5 p-3.5 rounded-[12px] transition-all group relative", 
                  isSelected ? "bg-black text-white shadow-xl" : isUnread ? "bg-black/[0.02] hover:bg-[#F5F5F7]" : "hover:bg-[#F5F5F7]"
                )}
              >
                  <div className="h-12 w-12 rounded-[10px] overflow-hidden shrink-0 border-2 border-white shadow-sm relative">
                    <img src={chat.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${chat.name}`} className="w-full h-full object-cover" alt="" />
                    {chat.isGroup && <div className="absolute inset-0 bg-black/10 flex items-center justify-center"><Users size={16} className="text-white" /></div>}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className={cn(
                        "text-[13px] uppercase font-outfit truncate", 
                        isSelected ? "text-white font-black" : isUnread ? "text-black font-black" : "text-[#1D1D1F] font-bold"
                      )}>
                        {chat.name}
                      </h4>
                      {chat.last_message_time && (
                        <span className={cn("text-[8px] font-black uppercase", isSelected ? "text-white/40" : "text-black/10")}>
                          {formatRelativeTime(chat.last_message_time)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        "text-[10px] truncate leading-tight", 
                        isSelected ? "text-white/60 font-bold" : isUnread ? "text-black font-black" : "text-black/30 font-medium"
                      )}>
                        {chat.last_message || chat.role}
                      </p>
                      {isUnread && (
                        <div className="h-4 min-w-[16px] px-1 bg-[#E53935] rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0">
                          {chat.unread_count > 99 ? '99+' : chat.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isUnread && !isSelected && <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#E53935] rounded-full shadow-[0_0_8px_rgba(229,57,53,0.4)]" />}
                  {isSelected && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E53935] rounded-r-full" />}
               </button>
             );
           })}
        </div>
      </aside>

      <main className={cn("flex-1 flex flex-col bg-[#FBFBFD] overflow-hidden relative", !selectedChat && "hidden md:flex")}>
        {selectedChat ? (
          <>
            <header className="h-24 px-8 flex items-center justify-between bg-white border-b border-black/[0.03] shrink-0">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedChat(null)} className="md:hidden h-10 w-10 rounded-[10px] flex items-center justify-center bg-[#F5F5F7]"><ChevronLeft size={18} /></button>
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-3">
                        {selectedChat.isGroup ? (
                           participants.slice(0, 3).map((p, i) => (
                              <div key={p.id} className="h-11 w-11 rounded-[10px] overflow-hidden border-2 border-white shadow-sm bg-slate-100">
                                 <img src={p.avatar_url || DEFAULT_AVATAR} className="w-full h-full object-cover" />
                              </div>
                           ))
                        ) : (
                           <div className="h-11 w-11 rounded-[10px] overflow-hidden shadow-sm border border-black/[0.03]">
                              <img src={selectedChat.avatar} className="w-full h-full object-cover" alt="" />
                           </div>
                        )}
                        {selectedChat.isGroup && participants.length > 3 && (
                           <div className="h-11 w-11 rounded-[10px] bg-black text-white flex items-center justify-center text-[10px] font-black border-2 border-white">
                              +{participants.length - 3}
                           </div>
                        )}
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <h2 className="text-[15px] font-black text-[#1D1D1F] leading-tight uppercase font-outfit">{selectedChat.name}</h2>
                           {meetupDetails?.status === 'live' && (
                              <div className="px-2 py-0.5 bg-red-500 text-white rounded-[4px] text-[7px] font-black uppercase animate-pulse">Live</div>
                           )}
                        </div>
                        <span className="text-[9px] font-black text-black/20 uppercase tracking-widest">
                           {selectedChat.isGroup ? `${participants.length} Participants  ${meetupDetails?.industry || 'Networking'}` : selectedChat.role}
                        </span>
                     </div>
                  </div>
               </div>
               
               {selectedChat.isGroup && meetupDetails && (
                  <div className="hidden lg:flex items-center gap-6 border-l border-black/[0.03] pl-6">
                     <div className="text-right">
                        <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">Session Schedule</p>
                        <p className="text-[11px] font-black text-[#1D1D1F] uppercase">{meetupDetails.dateTime?.split(' ')[1] || '6:00 PM'}</p>
                     </div>
                     {meetupDetails.status === 'upcoming' && (
                        <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                           <Clock size={12} className="text-emerald-500" />
                           <span className="text-[10px] font-black text-emerald-600 uppercase">Starts in 01:20:00</span>
                        </div>
                     )}
                  </div>
               )}

               <div className="relative group/chat-menu">
                  <button className="h-10 w-10 flex items-center justify-center rounded-[10px] bg-[#F5F5F7] text-black/40 hover:bg-black hover:text-white transition-all"><MoreHorizontal size={18} /></button>
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-black/[0.05] rounded-[10px] shadow-2xl overflow-hidden opacity-0 invisible group-hover/chat-menu:opacity-100 group-hover/chat-menu:visible transition-all z-50 p-1">
                     {selectedChat.isGroup && isHost && (
                        <>
                           <button onClick={async () => {
                              const { MeetupService } = await import("@/services/meetup-service");
                              await MeetupService.setLive(meetupDetails.id);
                              setMeetupDetails({...meetupDetails, status: 'live'});
                           }} className="w-full h-10 px-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 rounded-[6px] transition-all">
                              <Play size={14} fill="currentColor" /> Start Session
                           </button>
                           <button onClick={async () => {
                              const { MeetupService } = await import("@/services/meetup-service");
                              await MeetupService.updateStatus(meetupDetails.id, 'completed');
                              setMeetupDetails({...meetupDetails, status: 'completed'});
                           }} className="w-full h-10 px-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-[6px] transition-all">
                              <CheckCircle2 size={14} /> Mark Complete
                           </button>
                           <div className="h-px bg-black/[0.03] my-1" />
                        </>
                     )}
                     <button onClick={() => setConfirmAction({ type: 'REMOVE', connectionId: selectedChat.id, partnerName: selectedChat.name })} className="w-full h-10 px-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#E53935] hover:bg-red-50 rounded-[6px] transition-all"><Trash2 size={14} /> {selectedChat.isGroup ? "Leave Meetup" : "Remove"}</button>
                  </div>
               </div>
            </header>
             <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-white/50">
               {messages.map((msg) => {
                 const isMe = msg.sender_id === user?.id;
                 const intent = msg.metadata?.intent;
                 
                 return (
                   <div key={msg.id} className={cn("flex flex-col w-full", isMe ? "items-end" : "items-start")}>
                     {intent && !isMe && (
                       <div className="mb-4 px-4 py-2 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 self-start animate-in slide-in-from-left-4">
                         <Sparkles size={14} /> Intent: {intent}
                       </div>
                     )}
                     <div className={cn("p-5 rounded-[15px] max-w-[70%] text-[13px] font-bold shadow-sm", isMe ? "bg-[#E53935] text-white rounded-tr-[2px]" : "bg-white border border-black/[0.03] text-black/60 rounded-tl-[2px]")}>{msg.content}</div>
                     <div className={cn("flex items-center gap-2 mt-2 px-1")}><span className="text-[9px] font-black uppercase text-black/10">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{isMe && <CheckCheck size={12} className="text-[#E53935]" />}</div>
                   </div>
                 );
               })}
             </div>
             {selectedChat.isGroup && meetupDetails?.status === 'completed' && !outcomeSubmitted && (
                <div className="p-8 bg-white border-t border-black/[0.03] animate-in slide-in-from-bottom-4">
                   <div className="text-center p-10 border-2 border-dashed border-black/[0.03] rounded-3xl">
                      <CheckCircle2 size={32} className="mx-auto mb-4 text-[#34C759]" />
                      <h4 className="text-[12px] font-black uppercase tracking-widest text-[#1D1D1F]">Meetup Completed</h4>
                      <p className="text-[10px] font-bold text-black/20 uppercase mt-2">The session has ended. Thank you for participating.</p>
                   </div>
                </div>
             )}
            <div className="p-6 bg-white border-t border-black/[0.03]">
               {isLocked ? (
                 <div className="h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center gap-3 border border-black/[0.03] text-black/20 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                   <Clock size={16} /> Waiting for reply...
                 </div>
               ) : (
                 <form onSubmit={handleSend} className="flex items-center gap-3 bg-[#F5F5F7] rounded-full p-1.5 pl-6 border border-black/[0.03] focus-within:bg-white focus-within:shadow-xl transition-all">
                   <ClarityInput value={message} onChange={(e) => setMessage(e.target.value)} placeholder={isPending ? "Reply to unlock full chat..." : "Type a message..."} />
                   <button type="submit" disabled={!message.trim()} className={cn("h-11 w-11 flex items-center justify-center rounded-full transition-all active:scale-95", message.length > 0 ? "bg-[#E53935] text-white shadow-lg" : "bg-black/5 text-black/10")}><Send size={18} /></button>
                 </form>
               )}
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


