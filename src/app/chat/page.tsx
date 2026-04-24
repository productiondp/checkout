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
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { getChatInsight } from "@/lib/ai";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";


function ChatTerminal() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
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

  const { user } = useAuth();
  const supabase = createClient();

  // 1. IDENTITY & NETWORK FETCHING
  React.useEffect(() => {
    async function initNetwork() {
      if (!user) return;
      analytics.trackScreen('CHAT', user.id);

      // Fetch All Profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .order('full_name', { ascending: true });
      
      if (profiles) {
        const formattedUsers = profiles.map(p => ({
          id: p.id,
          partnerId: p.id,
          name: p.full_name || "Partner",
          avatar: p.avatar_url || DEFAULT_AVATAR,
          role: p.role || "Verified Partner",
          online: true,
          time: "node",
          last: "Initiate secure link"
        }));
        setAllUsers(formattedUsers);

        if (userParam) {
           const target = formattedUsers.find(u => u.partnerId === userParam);
           if (target) setSelectedChat(target);
        }
      }

      // Fetch Existing Conversations
      const { data: connections } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          sender:profiles!connections_sender_id_fkey (id, full_name, avatar_url, role),
          receiver:profiles!connections_receiver_id_fkey (id, full_name, avatar_url, role)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (connections) {
        setChats(connections.map((conn: any) => {
          const partner = conn.sender.id === user.id ? conn.receiver : conn.sender;
          return {
            id: conn.id,
            partnerId: partner.id,
            name: partner.full_name || "Partner",
            avatar: partner.avatar_url || DEFAULT_AVATAR,
            role: partner.role || "Verified Partner",
            online: true,
            last: "Secure node established",
            time: "10:32 AM"
          };
        }));
      }
      setIsLoading(false);
    }
    initNetwork();
  }, [userParam]);

  // 2. MESSAGE LOADING & REALTIME SUBSCRIPTION
  React.useEffect(() => {
    if (!selectedChat || selectedChat.id === "temp") return;

    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('connection_id', selectedChat.id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    }
    loadMessages();

    const channel = supabase
      .channel(`connection_${selectedChat.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `connection_id=eq.${selectedChat.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !currentUser) return;

    // Logic to create connection if "temp"
    // For now, assume connection exists or just list "everyone" for UI testing
    const newMessage = {
      connection_id: selectedChat.id === "temp" ? null : selectedChat.id,
      sender_id: currentUser.id,
      content: message
    };
    setMessage("");

    if (selectedChat.id !== "temp") {
       await supabase.from('messages').insert([newMessage]);
       analytics.track('MESSAGE_INITIATED', currentUser.id, { connectionId: selectedChat.id });
    }
  };

  const filteredNodes = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white overflow-hidden selection:bg-[#E53935]/10">
      
      {/* 1. THREAD LIST SIDEBAR */}
      <aside className={cn(
        "w-full md:w-80 lg:w-[380px] border-r border-slate-100 flex flex-col bg-white transition-all shrink-0",
        selectedChat && "hidden md:flex"
      )}>
        <div className="p-8 pb-6 bg-white z-10 sticky top-0">
           <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black text-[#292828] uppercase tracking-tighter">Messages</h1>
              <button 
                onClick={() => setShowSettings(true)}
                className="h-10 w-10 bg-slate-50 text-[#292828] rounded-xl flex items-center justify-center hover:bg-[#E53935] hover:text-white transition-all shadow-sm"
              >
                 <Settings size={18} />
              </button>
           </div>
           
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E53935] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search everyone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-[13px] font-bold text-[#292828] outline-none focus:bg-white focus:ring-2 focus:ring-[#E53935]/10 focus:border-[#E53935] transition-all" 
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-1 pb-40 lg:pb-12">
           <div className="px-5 mb-4 mt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Connections</p>
           </div>
           {chats.filter(c => 
             c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             c.role.toLowerCase().includes(searchQuery.toLowerCase())
           ).map((chat) => (
             <button 
               key={chat.partnerId} 
               onClick={() => setSelectedChat(chat)}
               className={cn(
                 "w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all group relative",
                 selectedChat?.partnerId === chat.partnerId ? "bg-[#292828] text-white shadow-2xl" : "hover:bg-slate-50"
               )}
             >
                <div className="relative shrink-0">
                   <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-slate-200 transition-all">
                      <img src={chat.avatar || DEFAULT_AVATAR} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 rounded-full border-[3px] border-white shadow-sm" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                   <div className="flex justify-between items-center mb-1">
                      <h4 className="text-[15px] font-bold truncate tracking-tight uppercase">
                         {chat.name}
                      </h4>
                      <span className="text-[9px] font-black opacity-40 uppercase tracking-widest whitespace-nowrap">
                         {chat.time}
                      </span>
                   </div>
                   <p className="text-[11px] font-bold opacity-60 truncate uppercase tracking-tight">
                      {chat.role}
                   </p>
                </div>
                {selectedChat?.partnerId === chat.partnerId && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#E53935] rounded-r-full" />
                )}
             </button>
           ))}
           {chats.length === 0 && !isLoading && (
              <div className="p-10 text-center opacity-20 italic text-[10px] uppercase font-black tracking-widest">
                 No active nodes
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
                  <button onClick={() => setSelectedChat(null)} className="md:hidden h-10 w-10 rounded-xl flex items-center justify-center text-[#292828] hover:text-[#292828]">
                     <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-4">
                     <Link href={`/profile/${selectedChat.partnerId}`} className="h-12 w-12 rounded-2xl overflow-hidden shadow-md block hover:scale-105 transition-transform active:scale-95">
                        <img src={selectedChat.avatar} className="w-full h-full object-cover" alt="" />
                     </Link>
                     <div>
                        <h2 className="text-[17px] font-black text-[#292828] leading-tight uppercase">{selectedChat.name}</h2>
                        <div className="flex items-center gap-2">
                           <span className={cn("h-1.5 w-1.5 rounded-full", selectedChat.online ? "bg-green-500" : "bg-slate-300")} />
                           <span className="text-[11px] font-black text-[#292828] uppercase">{selectedChat.online ? "Online Now" : "Inactive"}</span>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-2">
                  <button className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#292828] hover:bg-[#E53935] hover:text-white transition-all shadow-sm">
                     <Phone size={20} />
                  </button>
                  <button className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#292828] hover:bg-[#E53935] hover:text-white transition-all shadow-sm">
                     <Video size={20} />
                  </button>
                  <button 
                    onClick={() => setShowProfile(!showProfile)}
                    className={cn(
                      "h-12 w-12 items-center justify-center rounded-2xl transition-all shadow-sm",
                      showProfile ? "bg-[#292828] text-white" : "bg-slate-50 text-[#292828] hover:bg-[#292828] hover:text-white"
                    )}
                  >
                     <Info size={22} />
                  </button>
               </div>
            </header>

             {/* MESSAGE STREAM */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-6 lg:space-y-8 bg-[#FDFDFF] no-scrollbar">
               <div className="flex justify-center">
                  <span className="px-4 py-1.5 bg-[#292828] text-white rounded-full text-[10px] font-black uppercase tracking-widest">Secure Connection</span>
               </div>

               {/* Live Message Stream */}
               <div className="space-y-8">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    return (
                      <div key={msg.id} className={cn("flex flex-col w-full", isMe ? "items-end" : "items-start")}>
                        <div className={cn(
                          "p-5 rounded-[1.3rem] shadow-sm max-w-[80%] leading-relaxed text-[15px] font-bold",
                          isMe ? "bg-[#E53935] text-white rounded-tr-lg shadow-red-500/10" : "bg-white border border-slate-100 text-slate-700 rounded-tl-lg"
                        )}>
                          {msg.content}
                        </div>
                        <div className={cn("flex items-center gap-2 mt-2", isMe ? "mr-4" : "ml-4")}>
                           <span className="text-[10px] font-bold text-slate-400">
                             {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                           {isMe && <CheckCheck size={14} className="text-[#E53935]" />}
                        </div>
                      </div>
                    );
                  })}
                  {messages.length === 0 && (
                    <div className="text-center py-20 opacity-20 italic text-sm">Beginning of shared history</div>
                  )}
               </div>
            </div>
            {/* COMPOSER (BOTTOM) */}
            <div className="p-4 lg:p-8 bg-white border-t border-slate-100 pb-32 lg:pb-8">
               {!selectedChat.id || selectedChat.id === "temp" ? (
                  <div className="h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 border-dashed">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-3">
                        Connect to start conversation
                     </p>
                  </div>
               ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 rounded-[1.625rem] p-2 pl-6 shadow-sm border border-slate-100 group focus-within:bg-white focus-within:shadow-xl transition-all">
                     <div className="relative">
                        <button 
                          type="button"
                          onClick={() => setShowAttachMenu(!showAttachMenu)}
                          className={cn(
                            "h-12 w-12 flex items-center justify-center rounded-2xl transition-all",
                            showAttachMenu ? "bg-[#292828] text-white rotate-45" : "text-slate-300 hover:text-[#292828]"
                          )}
                        >
                           <Plus size={24} />
                        </button>

                        {showAttachMenu && (
                          <div className="absolute bottom-[130%] left-0 w-56 bg-white rounded-3xl shadow-4xl border border-slate-100 p-3 animate-in fade-in slide-in-from-top-4 duration-300">
                             {[
                               { icon: ImageIcon, label: "Photos & Videos", color: "text-red-500", bg: "bg-red-50" },
                               { icon: FileText, label: "Documents", color: "text-blue-500", bg: "bg-blue-50" },
                               { icon: User, label: "Share Contact", color: "text-green-500", bg: "bg-green-50" },
                               { icon: Paperclip, label: "Business ID", color: "text-amber-500", bg: "bg-amber-50" },
                             ].map((it, i) => (
                               <button 
                                 key={i} 
                                 type="button"
                                 onClick={() => setShowAttachMenu(false)}
                                 className="w-full flex items-center gap-3 p-3 rounded-2xl text-[13px] font-black text-[#292828] hover:bg-slate-50 transition-all group"
                               >
                                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", it.bg, it.color)}>
                                     <it.icon size={18} />
                                  </div>
                                  {it.label}
                               </button>
                             ))}
                          </div>
                        )}
                     </div>
                     <input 
                       type="text" 
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       placeholder="Type your message..." 
                       className="flex-1 bg-transparent border-none outline-none text-[15px] font-bold text-[#292828] py-4"
                     />
                     <div className="flex items-center gap-2 pr-2">
                        <button type="button" className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-[#292828] transition-colors">
                           <ImageIcon size={20} />
                        </button>
                        <button 
                          type="submit"
                          className={cn(
                           "h-12 w-12 flex items-center justify-center rounded-full transition-all shadow-lg active:scale-95",
                           message.length > 0 ? "bg-[#E53935] text-white shadow-red-500/20" : "bg-slate-200 text-[#292828] grayscale"
                          )}
                        >
                           <Send size={20} />
                        </button>
                     </div>
                  </form>
               )}
            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#FDFDFF]">
             <div className="h-24 w-24 bg-white rounded-[1.625rem] shadow-2xl flex items-center justify-center text-[#E53935] mb-8 animate-bounce-subtle">
                <MessageSquare size={40} />
             </div>
             <h2 className="text-2xl font-black text-[#292828] uppercase tracking-tighter">Secure Messages</h2>
             <p className="text-slate-400 max-w-sm mt-4 font-bold leading-relaxed uppercase text-[11px] tracking-widest">Select a node from the directory to initialize tactical communications.</p>
          </div>
        )}
      </main>

      {/* 3. PROFILE / CONTEXT DRAWER (RIGHT) */}
      {selectedChat && showProfile && (
        <aside className="hidden xl:flex flex-col w-80 lg:w-[380px] border-l border-[#292828]/10 bg-white animate-in slide-in-from-right duration-300 shrink-0">
           <div className="p-8 h-full overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-[11px] font-bold text-[#292828] group-hover:text-white/30 uppercase tracking-widest">Partner Info</h3>
                 <button onClick={() => setShowProfile(false)} className="h-9 w-9 bg-[#292828]/5 text-[#292828] rounded-xl flex items-center justify-center hover:bg-[#292828]/10 transition-colors">
                    <X size={18} />
                 </button>
              </div>

              <div className="text-center mb-10">
                 <div className="relative inline-block mb-6">
                    <Link href={`/profile/${selectedChat.id}`} className="h-32 w-32 mx-auto rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-[#292828]/5 block hover:scale-105 transition-transform active:scale-95">
                       <img src={selectedChat.avatar} className="w-full h-full object-cover" alt="" />
                    </Link>
                    <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#E53935] border border-[#292828]/5">
                       <ShieldCheck size={24} fill="currentColor" fillOpacity={0.1} />
                    </div>
                 </div>
                 
                 <h2 className="text-2xl font-bold text-[#292828] group-hover:text-white leading-tight mb-1 font-outfit uppercase tracking-tight">{selectedChat.name}</h2>
                 <p className="text-[13px] font-bold text-[#E53935] mb-6 uppercase tracking-widest">{selectedChat.role || "Verified Partner"}</p>
                 
                 <div className="flex justify-center gap-2 mb-8">
                    <div className="px-4 py-2 bg-[#292828] text-white rounded-xl flex items-center gap-2 shadow-lg shadow-slate-900/10">
                       <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                       <span className="text-[12px] font-black">{selectedChat.checkoutScore}</span>
                    </div>
                    <div className={cn(
                       "px-4 py-2 rounded-xl flex items-center gap-2 border-2",
                       selectedChat.badge === "Elite" ? "border-red-500/20 bg-red-50 text-red-600" :
                       selectedChat.badge === "Gold" ? "border-amber-500/20 bg-amber-50 text-amber-600" :
                       "border-slate-500/20 bg-slate-50 text-slate-600"
                    )}>
                       <span className="text-[10px] font-black uppercase tracking-wider">{selectedChat.badge}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-3 mb-10">
                    <div className="p-5 bg-[#292828]/5 rounded-[1.5rem] border border-[#292828]/5 text-left group hover:bg-white hover:shadow-xl transition-all cursor-default">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#292828] shadow-sm group-hover:scale-110 transition-transform">
                             <Trophy size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-[#292828] group-hover:text-white/30 uppercase tracking-wider">Rank</p>
                             <p className="text-[15px] font-bold text-[#292828] group-hover:text-white">#{selectedChat.rank?.pos} in {selectedChat.rank?.city}</p>
                             <p className="text-[11px] font-bold text-[#E53935]">{selectedChat.rank?.domain} Expert</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-10">
                 {/* AI Insight Section */}
                 <div className="p-6 bg-[#292828]/5 border border-[#292828]/5 rounded-[2rem] mb-2 overflow-hidden relative group/ai">
                    <div className="absolute top-0 right-0 p-3 opacity-20"><BrainCircuit size={40} className="text-[#292828]" /></div>
                    <h4 className="text-[10px] font-black text-[#292828]/40 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                       <Sparkles size={10} className="text-[#E53935]" /> Expert Tip
                    </h4>
                    <p className="text-[13px] font-bold text-[#292828] leading-tight relative z-10">
                       {getChatInsight({
                         role: currentUser?.profile?.role || "Professional",
                         bio: currentUser?.profile?.bio || "",
                         domains: currentUser?.profile?.skills || []
                       }, selectedChat)}
                     </p>
                  </div>

                 {/* Bio Section */}
                 {selectedChat.bio && (
                    <div>
                       <p className="text-[14px] font-medium text-[#292828]/70 leading-relaxed bg-[#292828]/5 p-5 rounded-2xl italic border-l-4 border-[#292828]">
                          "{selectedChat.bio}"
                       </p>
                    </div>
                 )}

                 {/* Requirements Section */}
                 {selectedChat.requirements && (
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                           <Target size={16} className="text-[#E53935]" />
                           <h4 className="text-[11px] font-black text-[#292828]/30 uppercase tracking-widest">Active Needs</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {selectedChat.requirements.map((req: string, i: number) => (
                              <span key={i} className="px-4 py-2 bg-white border border-[#292828]/10 rounded-xl text-[12px] font-bold text-[#292828] shadow-sm hover:border-[#E53935] hover:text-[#E53935] transition-all cursor-default">
                                 {req}
                              </span>
                           ))}
                        </div>
                    </div>
                 )}

                 {/* Collaboration Stats */}
                 <div>
                    <h4 className="text-[11px] font-black text-[#292828]/30 uppercase tracking-widest mb-6">Activity</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 bg-[#292828]/5 rounded-3xl border border-[#292828]/5 text-center">
                          <p className="text-2xl font-black text-[#292828]">12</p>
                          <p className="text-[10px] font-black text-[#292828]/40 uppercase mt-1">Shared Files</p>
                       </div>
                       <div className="p-5 bg-red-50 rounded-3xl border border-red-500/10 text-center">
                          <p className="text-2xl font-black text-[#E53935]">4</p>
                          <p className="text-[10px] font-black text-red-500/40 uppercase mt-1">Contracts</p>
                       </div>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="pt-6 space-y-3">
                    <Link href={`/profile/${selectedChat.id}`} className="w-full h-14 bg-[#292828] text-white rounded-2xl flex items-center justify-center font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-[#E53935] hover:-translate-y-1 transition-all active:translate-y-0">
                       View Full Profile
                    </Link>
                    <button className="w-full h-14 bg-[#292828]/5 text-[#292828] rounded-2xl flex items-center justify-center font-black text-[11px] uppercase tracking-widest hover:bg-[#292828]/10 transition-all">
                       Flag as High Priority
                    </button>
                 </div>
              </div>
           </div>
        </aside>
      )}
      {/* 4. CHAT SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#292828]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowSettings(false)} />
           <div className="relative w-full max-w-[480px] bg-white rounded-[1.95rem] shadow-4xl overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-8 border-b border-[#292828]/5 flex items-center justify-between">
                 <h3 className="text-xl font-black text-[#292828] uppercase">Chat Settings</h3>
                 <button onClick={() => setShowSettings(false)} className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828]">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-10 space-y-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-bold text-[#292828]/40 uppercase">Privacy & Security</p>
                    <div className="space-y-1">
                       {[
                         { label: "End-to-End Encryption", desc: "Always active for all connections", active: true },
                         { label: "Read Receipts", desc: "Show when you've seen messages", active: true },
                         { label: "Online Status", desc: "Show active status to partners", active: false }
                       ].map((s, i) => (
                         <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#292828]/5 transition-all">
                            <div>
                               <p className="text-[14px] font-bold text-[#292828]">{s.label}</p>
                               <p className="text-[11px] font-medium text-[#292828]/40">{s.desc}</p>
                            </div>
                            <div className={cn("h-6 w-11 rounded-full p-1 transition-colors cursor-pointer", s.active ? "bg-[#E53935]" : "bg-slate-200")}>
                               <div className={cn("h-4 w-4 bg-white rounded-full transition-transform shadow-sm", s.active ? "translate-x-5" : "translate-x-0")} />
                            </div>
                         </div>
                       ))}
                     </div>
                  </div>
                  <div className="pt-4">
                     <button className="w-full h-14 bg-[#292828] text-white rounded-2xl font-black text-[11px] uppercase shadow-xl hover:bg-black transition-all">Save Changes</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

import { useAuth } from "@/hooks/useAuth";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center p-20 text-[10px] font-black uppercase text-[#292828]/20 tracking-widest animate-pulse">Synchronizing Tactical Channels...</div>}>
      <ChatTerminal />
    </Suspense>
  );
}
