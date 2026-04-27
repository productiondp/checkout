"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  MoreHorizontal, 
  Send, 
  Phone, 
  Video, 
  Plus, 
  ChevronLeft, 
  Image as ImageIcon, 
  FileText, 
  Paperclip, 
  CheckCheck,
  Info,
  User,
  Star,
  Settings,
  X,
  MessageSquare,
  Trophy,
  ShieldCheck,
  Zap,
  Target,
  Sparkles,
  BrainCircuit,
  Trash2,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { getChatInsight } from "@/lib/ai";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { analytics } from "@/utils/analytics";
import { useAuth, useRequiredUser } from "@/hooks/useAuth";
import { useNotifications } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ConnectionService } from "@/services/connection-service";
import { motion, AnimatePresence } from "framer-motion";

function ChatContent() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const initialParam = searchParams.get('initial');

  const user = useRequiredUser();
  const supabase = createClient();
  const { refreshCounts, setActiveChatId } = useNotifications();
  const [confirmAction, setConfirmAction] = useState<{ type: 'REMOVE' | 'BLOCK'; connectionId: string; partnerName: string } | null>(null);

  // Initialize message with initialParam if provided
  React.useEffect(() => {
    if (initialParam) {
      setMessage(initialParam);
    }
  }, [initialParam]);

  // 🛡️ SAFE GUARD: Pre-render check
  if (!user) return null;

  // 0. ACTIVE CHAT SYNC (Notification Hardening)
  React.useEffect(() => {
    if (selectedChat?.id && selectedChat.id !== "temp") {
      setActiveChatId(selectedChat.id);
    } else {
      setActiveChatId(null);
    }
    return () => setActiveChatId(null);
  }, [selectedChat, setActiveChatId]);

  // 1. IDENTITY & NETWORK FETCHING
  React.useEffect(() => {
    async function initChat() {
      if (!user) return;
      analytics.trackScreen('CHAT', user.id);

      // A. Fetch Existing Conversations (1-on-1 Connections)
      const { data: connections } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          sender:profiles!connections_sender_id_fkey (id, full_name, avatar_url, role),
          receiver:profiles!connections_receiver_id_fkey (id, full_name, avatar_url, role)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      let formattedChats: any[] = [];
      if (connections) {
        formattedChats = connections.map((conn: any) => {
          const partner = conn.sender.id === user.id ? conn.receiver : conn.sender;
          return {
            id: conn.id,
            partnerId: partner.id,
            name: partner.full_name || "Partner",
            avatar: partner.avatar_url || DEFAULT_AVATAR,
            role: partner.role || "Verified Profile",
            online: true,
            isGroup: false,
            last: "Connected",
            time: "Active"
          };
        });
      }

      // B. Fetch Group Meetups (Rooms)
      const { data: rooms } = await supabase
        .from('participants')
        .select(`
           room_id,
           room:chat_rooms (
             id, 
             name, 
             is_group,
             post:posts (id, title, author_id, status, outcome_data)
           )
        `)
        .eq('user_id', user.id);

      if (rooms) {
        const groupChats = rooms
          .filter((r: any) => r.room?.is_group)
          .map((r: any) => ({
            id: r.room.id,
            roomId: r.room.id,
            name: r.room.name || r.room.post?.title || "Meetup Group",
            avatar: null, // Group icon
            role: "Group Chat",
            isGroup: true,
            isMeetup: !!r.room.post,
            hostId: r.room.post?.author_id,
            meetupId: r.room.post?.id,
            meetupStatus: r.room.post?.status,
            outcome_data: r.room.post?.outcome_data,
            online: true,
            last: "Event Chat",
            time: "Live"
          }));
        formattedChats = [...formattedChats, ...groupChats];
      }

      setChats(formattedChats);

      // C. Handle query params
      const roomParam = searchParams.get('room');
      if (roomParam) {
        const existing = formattedChats.find(c => (c.roomId === roomParam || c.id === roomParam));
        if (existing) setSelectedChat(existing);
      } else if (userParam) {
        const existing = formattedChats.find(c => c.partnerId === userParam);
        if (existing) {
          setSelectedChat(existing);
        } else {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', userParam).single();
          if (profile) {
            setSelectedChat({
              id: "temp",
              partnerId: profile.id,
              name: profile.full_name || "Partner",
              avatar: profile.avatar_url || DEFAULT_AVATAR,
              role: profile.role || "Verified Partner",
              online: true,
              isGroup: false,
              last: "New Conversation",
              time: "Just now"
            });
          }
        }
      }

      // Fetch all users for search
      const { data: allProfiles } = await supabase.from('profiles').select('*').neq('id', user.id).limit(20);
      if (allProfiles) {
        setAllUsers(allProfiles.map(p => ({
          id: p.id,
          partnerId: p.id,
          name: p.full_name || "Partner",
          avatar: p.avatar_url || DEFAULT_AVATAR,
          role: p.role || "Member",
          isGroup: false
        })));
      }

      setIsLoading(false);
    }
    initChat();
  }, [userParam, searchParams.get('room'), user?.id]);

  // 2. MESSAGE LOADING & REALTIME SUBSCRIPTION
  React.useEffect(() => {
    if (!selectedChat || selectedChat.id === "temp") {
      setMessages([]);
      return;
    }

    async function loadMessages() {
      const query = supabase.from('messages').select('*');
      
      if (selectedChat.isGroup) {
        query.eq('room_id', selectedChat.id);
      } else {
        query.eq('connection_id', selectedChat.id);
      }

      const { data } = await query.order('created_at', { ascending: true });
      
      if (data) {
        setMessages(data);
        
        // Mark as Read
        const unreadIds = data.filter(m => !m.is_read && m.sender_id !== user.id).map(m => m.id);
        if (unreadIds.length > 0) {
          await supabase.from('messages').update({ is_read: true }).in('id', unreadIds);
          refreshCounts();
        }
      }
    }
    loadMessages();

    const channel = supabase
      .channel(`chat_${selectedChat.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: selectedChat.isGroup ? `room_id=eq.${selectedChat.id}` : `connection_id=eq.${selectedChat.id}`
      }, async (payload) => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
        
        if (payload.new.sender_id !== user.id) {
           await supabase.from('messages').update({ is_read: true }).eq('id', payload.new.id);
           refreshCounts();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedChat?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !user) return;

    let newMessage: any = {
      sender_id: user.id,
      content: message,
      type: 'USER',
      is_read: false
    };

    if (selectedChat.isGroup) {
      newMessage.room_id = selectedChat.id;
    } else {
      let connectionId = selectedChat.id;
      if (connectionId === "temp") {
        try {
          const result = await ConnectionService.ensureConnection(user.id, selectedChat.partnerId);
          connectionId = result.id;
          setSelectedChat(prev => ({ ...prev, id: connectionId }));
        } catch (err) {
          console.error("Connection failed:", err);
          return;
        }
      }
      newMessage.connection_id = connectionId;
      newMessage.receiver_id = selectedChat.partnerId;
    }

    setMessage("");

    // Optimistic Update
    const tempId = Math.random().toString();
    setMessages(prev => [...prev, { ...newMessage, id: tempId, created_at: new Date().toISOString() }]);

    const { data, error } = await supabase.from('messages').insert([newMessage]).select().single();
    
    if (error) {
      console.error("Message error:", error);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } else {
      setMessages(prev => prev.map(m => m.id === tempId ? data : m));
      analytics.track('MESSAGE_SENT', user.id, { isGroup: selectedChat.isGroup });
    }
  };

  return (
    <div className="flex h-full bg-white overflow-hidden selection:bg-[#E53935]/10">
      
      {/* 1. THREAD LIST SIDEBAR */}
      <aside className={cn(
        "w-full md:w-80 lg:w-[380px] border-r border-slate-100 flex flex-col bg-white transition-all shrink-0",
        selectedChat && "hidden md:flex"
      )}>
        <div className="p-8 pb-6 bg-white z-10 sticky top-0">
           <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black text-[#292828] uppercase ">Chat</h1>
              <button 
                onClick={() => setShowSettings(true)}
                className="h-10 w-10 bg-slate-50 text-[#292828] rounded-lg flex items-center justify-center hover:bg-[#E53935] hover:text-white transition-all shadow-sm"
              >
                 <Settings size={18} />
              </button>
           </div>
           
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E53935] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search people..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-lg pl-12 pr-4 text-[13px] font-bold text-[#292828] outline-none focus:bg-white focus:ring-2 focus:ring-[#E53935]/10 focus:border-[#E53935] transition-all" 
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-1 pb-40 lg:pb-12">
           <div className="px-5 mb-4 mt-2">
              <p className="text-[10px] font-black text-slate-200 uppercase ">Active Chats</p>
           </div>
           {chats.filter(c => 
             c.name.toLowerCase().includes(searchQuery.toLowerCase())
           ).map((chat) => (
             <button 
               key={chat.id} 
               onClick={() => setSelectedChat(chat)}
               className={cn(
                 "w-full flex items-center gap-4 p-4 rounded-lg transition-all group relative",
                 selectedChat?.id === chat.id ? "bg-[#292828] text-white shadow-2xl" : "hover:bg-slate-50"
               )}
             >
                <div className="relative shrink-0">
                   <div className="h-14 w-14 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-slate-200 transition-all">
                      <img src={chat.avatar || DEFAULT_AVATAR} className="w-full h-full object-cover" alt="" />
                   </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                   <div className="flex justify-between items-center mb-1">
                      <h4 className="text-[15px] font-bold truncate  uppercase">
                         {chat.name}
                      </h4>
                   </div>
                   <p className="text-[11px] font-bold opacity-60 truncate uppercase ">
                      {chat.role}
                   </p>
                </div>
                {selectedChat?.id === chat.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#E53935] rounded-r-full" />
                )}
             </button>
           ))}
           {chats.length === 0 && !isLoading && (
              <div className="p-10 text-center opacity-20 italic text-[10px] uppercase font-black ">
                 No active chats
              </div>
           )}
        </div>
      </aside>

      {/* 2. CONVERSATION VIEW (CENTER) */}
      <main className={cn(
        "flex-1 flex flex-col bg-white overflow-hidden relative",
        !selectedChat && "hidden md:flex"
      )}>
        {selectedChat ? (
          <>
            {/* Thread Header */}
            <header className="h-16 lg:h-24 px-4 lg:px-10 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-20">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedChat(null)} className="md:hidden h-10 w-10 rounded-lg flex items-center justify-center text-[#292828]">
                     <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-lg overflow-hidden shadow-md">
                        <img src={selectedChat.avatar} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <h2 className="text-[17px] font-black text-[#292828] leading-tight uppercase">{selectedChat.name}</h2>
                        <span className="text-[11px] font-black text-[#292828] uppercase opacity-40">{selectedChat.role}</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 relative group/chat-menu">
                  <button className="h-12 w-12 flex items-center justify-center rounded-lg bg-slate-50 text-[#292828] hover:bg-[#1D1D1F] hover:text-white transition-all shadow-sm">
                     <MoreHorizontal size={22} />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-black/[0.05] rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover/chat-menu:opacity-100 group-hover/chat-menu:visible transition-all z-50">
                      {selectedChat.isGroup && selectedChat.hostId === user.id && (
                        <>
                           <div className="px-5 py-3 bg-slate-50 border-b border-black/[0.03]">
                              <p className="text-[9px] font-black uppercase text-slate-400">Host Controls</p>
                           </div>
                           <button 
                              onClick={async () => {
                                const { MeetupService } = await import("@/services/meetup-service");
                                await MeetupService.updateStatus(selectedChat.meetupId, 'completed');
                                window.location.reload();
                              }}
                              className="w-full h-12 px-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
                           >
                              <ShieldAlert size={14} className="text-amber-500" /> Lock Chat
                           </button>
                           <button 
                              className="w-full h-12 px-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all border-t border-black/[0.03]"
                           >
                              <Users size={14} /> Manage Participants
                           </button>
                        </>
                      )}
                      
                      {!selectedChat.isGroup && (
                        <>
                           <button 
                              onClick={() => setConfirmAction({ type: 'REMOVE', connectionId: selectedChat.id, partnerName: selectedChat.name })}
                              className="w-full h-12 px-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#E53935] hover:bg-red-50 transition-all"
                           >
                              <Trash2 size={14} /> Remove
                           </button>
                           <button 
                              onClick={() => setConfirmAction({ type: 'BLOCK', connectionId: selectedChat.id, partnerName: selectedChat.name })}
                              className="w-full h-12 px-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all border-t border-black/[0.03]"
                           >
                              <ShieldAlert size={14} /> Block
                           </button>
                        </>
                      )}
                   </div>
                </div>
             </header>

             {/* THREAD HEADER CONTROLS (Meetup Specific) */}
            {selectedChat.isMeetup && (
              <div className="px-4 lg:px-10 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      selectedChat.meetupStatus === 'live' ? "bg-emerald-500 text-white animate-pulse" : 
                      selectedChat.meetupStatus === 'completed' ? "bg-slate-200 text-slate-400" : "bg-black text-white"
                    )}>
                       {selectedChat.meetupStatus}
                    </div>
                    {selectedChat.meetupStatus === 'upcoming' && selectedChat.hostId === user.id && (
                       <button 
                        onClick={async () => {
                           const { MeetupService } = await import("@/services/meetup-service");
                           await MeetupService.setLive(selectedChat.meetupId);
                           window.location.reload();
                        }}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#E53935] text-white rounded-lg text-[10px] font-black uppercase hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                       >
                          <Zap size={12} fill="currentColor" /> Go Live Now
                       </button>
                    )}
                 </div>
              </div>
            )}

             {/* MESSAGE STREAM */}
             <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-6 lg:space-y-8 bg-[#FDFDFF] no-scrollbar">
               <div className="space-y-8">
                  {/* ── JOIN ENTRY CARD (Meetup Summary) ── */}
                  {selectedChat.isMeetup && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-black/[0.02] text-center max-w-lg mx-auto mb-12 relative overflow-hidden"
                    >
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E53935] to-amber-500" />
                       <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#E53935]">
                          <Users size={32} />
                       </div>
                       <h3 className="text-xl font-black text-[#292828] uppercase mb-2">Welcome to {selectedChat.name}</h3>
                       <p className="text-[11px] font-bold text-slate-400 uppercase mb-8">You are now a participant in this meetup.</p>
                       
                       <div className="grid grid-cols-2 gap-4 text-left">
                          <div className="p-4 bg-slate-50 rounded-xl">
                             <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Status</p>
                             <p className="text-[10px] font-black text-[#292828] uppercase">{selectedChat.meetupStatus}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl">
                             <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Role</p>
                             <p className="text-[10px] font-black text-[#292828] uppercase">{selectedChat.hostId === user.id ? 'Host' : 'Partner'}</p>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {messages.map((msg) => {
                    if (msg.type === 'PINNED') {
                      return (
                        <div key={msg.id} className="flex flex-col items-center my-10">
                           <div className="flex items-center gap-2 mb-3 text-amber-500">
                              <Bookmark size={14} fill="currentColor" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Pinned Announcement</span>
                           </div>
                           <div className="p-8 bg-amber-50 border-2 border-amber-200/50 rounded-[2rem] shadow-xl shadow-amber-500/5 max-w-[90%] text-center relative">
                              <div className="absolute -top-3 -right-3 h-10 w-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg">
                                 <Sparkles size={20} />
                              </div>
                              <p className="text-[17px] font-black text-[#292828] leading-relaxed italic">
                                 "{msg.content}"
                              </p>
                           </div>
                        </div>
                      );
                    }

                    if (msg.type === 'SYSTEM') {
                      return (
                        <div key={msg.id} className="flex justify-center my-6">
                           <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-400 tracking-wider">
                              {msg.content}
                           </div>
                        </div>
                      );
                    }

                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={cn("flex flex-col w-full", isMe ? "items-end" : "items-start")}>
                        <div className={cn(
                          "p-5 rounded-[1.3rem] shadow-sm max-w-[80%] leading-relaxed text-[15px] font-bold",
                          isMe ? "bg-[#E53935] text-white rounded-tr-lg shadow-red-500/10" : "bg-white border border-slate-100 text-slate-500 rounded-tl-lg"
                        )}>
                          {msg.content}
                        </div>
                        <div className={cn("flex items-center gap-2 mt-2", isMe ? "mr-4" : "ml-4")}>
                           <span className="text-[10px] font-bold text-slate-200">
                             {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                           {isMe && <CheckCheck size={14} className="text-[#E53935]" />}
                        </div>
                      </div>
                    );
                  })}
                  {messages.length === 0 && (
                    <div className="text-center py-20 opacity-20 italic text-sm">Say hello to {selectedChat.name}</div>
                  )}
               </div>
            </div>

             {/* COMPOSER (BOTTOM) OR OUTCOME LAYER */}
            <div className="p-4 lg:p-8 bg-white border-t border-slate-100 pb-32 lg:pb-8">
                {selectedChat.meetupStatus === 'completed' ? (
                  <div className="space-y-4">
                     {selectedChat.hostId === user.id && !selectedChat.outcome_data ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-8 bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] text-center shadow-xl shadow-emerald-500/5"
                        >
                           <div className="h-16 w-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                              <Trophy size={32} />
                           </div>
                           <h3 className="text-xl font-black text-[#292828] uppercase mb-2">What was the outcome?</h3>
                           <p className="text-[11px] font-bold text-slate-400 uppercase mb-8">Help us measure the value of this meetup.</p>
                           
                           <div className="grid grid-cols-2 gap-3 mb-6">
                              {[
                                { id: 'COLLAB', label: 'Started Collab', icon: Sparkles },
                                { id: 'HIRE', label: 'Found Talent', icon: Briefcase },
                                { id: 'KNOWLEDGE', label: 'Learned Tons', icon: BrainCircuit },
                                { id: 'OTHER', label: 'Networking', icon: Users }
                              ].map(type => (
                                <button 
                                  key={type.id}
                                  onClick={async () => {
                                    const { MeetupService } = await import("@/services/meetup-service");
                                    await MeetupService.submitOutcome(selectedChat.meetupId, { type: type.id, summary: `Successfully completed ${selectedChat.name}` });
                                    window.location.reload();
                                  }}
                                  className="h-14 bg-white border border-emerald-100 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-emerald-500 hover:text-white transition-all group"
                                >
                                   <type.icon size={16} />
                                   <span className="text-[9px] font-black uppercase">{type.label}</span>
                                </button>
                              ))}
                           </div>
                        </motion.div>
                     ) : (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                           <p className="text-[10px] font-black uppercase text-slate-300">
                             {selectedChat.outcome_data 
                               ? `Outcome Captured: ${selectedChat.outcome_data.type}`
                               : "This meetup has ended. Chat is archived."}
                           </p>
                        </div>
                     )}
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 rounded-[1.625rem] p-2 pl-6 shadow-sm border border-slate-100 focus-within:bg-white focus-within:shadow-xl transition-all">
                      <input 
                        type="text" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..." 
                        className="flex-1 bg-transparent border-none outline-none text-[15px] font-bold text-[#292828] py-4"
                      />
                      <button 
                        type="submit"
                        disabled={!message.trim()}
                        className={cn(
                          "h-12 w-12 flex items-center justify-center rounded-full transition-all shadow-lg active:scale-95",
                          message.length > 0 ? "bg-[#E53935] text-white shadow-red-500/20" : "bg-slate-200 text-[#292828] grayscale"
                        )}
                      >
                        <Send size={20} />
                      </button>
                  </form>
                )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#FDFDFF]">
             <div className="h-24 w-24 bg-white rounded-[1.625rem] shadow-2xl flex items-center justify-center text-[#E53935] mb-8 animate-bounce-subtle">
                <MessageSquare size={40} />
             </div>
             <h2 className="text-2xl font-black text-[#292828] uppercase ">Chat</h2>
             <p className="text-slate-200 max-w-sm mt-4 font-bold leading-relaxed uppercase text-[11px] ">Select a person to start messaging.</p>
          </div>
        )}
      </main>

      {/* 🚫 MODERATION CONFIRMATION */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-[2rem] p-10 shadow-4xl text-center"
            >
              <div className={cn(
                "h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-8",
                confirmAction.type === 'BLOCK' ? "bg-black text-white" : "bg-red-50 text-[#E53935]"
              )}>
                {confirmAction.type === 'BLOCK' ? <ShieldAlert size={32} /> : <Trash2 size={32} />}
              </div>
              
              <h3 className="text-2xl font-black text-[#1D1D1F] uppercase italic mb-4">
                {confirmAction.type === 'BLOCK' ? "Block User?" : "Remove Link?"}
              </h3>
              
              <p className="text-[12px] font-bold text-[#86868B] uppercase mb-10 leading-relaxed">
                Confirm {confirmAction.type.toLowerCase()} for <strong>{confirmAction.partnerName}</strong>.
              </p>
              
              <div className="flex gap-4">
                <button onClick={() => setConfirmAction(null)} className="flex-1 h-16 bg-[#F5F5F7] text-[#1D1D1F] rounded-xl font-black uppercase text-[10px]">Cancel</button>
                <button 
                  onClick={async () => {
                    if (confirmAction.type === 'BLOCK') {
                      await ConnectionService.blockUser(confirmAction.connectionId);
                    } else {
                      await ConnectionService.removeConnection(confirmAction.connectionId);
                    }
                    setConfirmAction(null);
                    window.location.reload();
                  }}
                  className={cn(
                    "flex-1 h-16 rounded-xl font-black uppercase text-[10px] text-white shadow-xl",
                    confirmAction.type === 'BLOCK' ? "bg-black" : "bg-[#E53935]"
                  )}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="flex h-full items-center justify-center p-20 text-[10px] font-black uppercase text-[#292828]/20  animate-pulse">Loading...</div>}>
        <ChatContent />
      </Suspense>
    </ProtectedRoute>
  );
}
