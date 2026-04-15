"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Plus, 
  Smile, 
  Paperclip, 
  ChevronRight,
  UserCircle,
  ShieldCheck,
  CheckCheck,
  Zap,
  Clock,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_CHATS = [
  { id: 1, name: "Rahul Sethi", role: "UI Designer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100", lastMsg: "Let's review the designs tomorrow.", time: "10:45 AM", online: true, unread: 2 },
  { id: 2, name: "Sana Maryam", role: "Owner @ CafeSync", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100", lastMsg: "The meeting went well!", time: "9:30 AM", online: true, unread: 0 },
  { id: 3, name: "Kiran Raj", role: "Tech Lead", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100", lastMsg: "Server is stable now.", time: "Yesterday", online: false, unread: 0 },
  { id: 4, name: "Meera Nair", role: "Marketing", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=100", lastMsg: "Did you check the ads?", time: "Yesterday", online: true, unread: 5 },
];

const INITIAL_MESSAGES = [
  { id: 1, sender: "them", text: "Hey Ahmad! Are you available for a quick sync?", time: "10:30 AM" },
  { id: 2, sender: "me", text: "Hi! Yes, I just finished the dashboard designs. Sending them over now.", time: "10:32 AM" },
  { id: 3, sender: "them", text: "Great! Let's review the designs tomorrow.", time: "10:45 AM" },
];

export default function Chat() {
  const [activeChat, setActiveChat] = useState(INITIAL_CHATS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputText("");

    // Mock auto-reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: "them",
        text: "Understood. I will check and get back to you.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="flex h-full bg-[#F8FAFB]">
      
      {/* Column 1: Chat List */}
      <div className="w-[380px] border-r border-[#EBEFF1] bg-white flex flex-col h-full">
         <div className="p-8 pb-4">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black uppercase italic">Messages</h2>
               <button className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                  <Plus size={20} />
               </button>
            </div>
            <div className="relative mb-6">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search conversations..." 
                 className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-3.5 text-[14px] outline-none font-medium"
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {INITIAL_CHATS.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={cn(
                  "px-8 py-5 flex items-center gap-4 cursor-pointer transition-all relative border-l-4",
                  activeChat.id === chat.id ? "bg-primary/5 border-primary" : "hover:bg-slate-50 border-transparent"
                )}
              >
                 <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shadow-sm">
                       <img src={chat.avatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                    {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                       <h4 className="text-[15px] font-bold text-slate-900 truncate">{chat.name}</h4>
                       <span className="text-[10px] text-slate-400 font-bold">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <p className="text-[12px] text-slate-500 truncate pr-4">{chat.lastMsg}</p>
                       {chat.unread > 0 && (
                         <span className="bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center">{chat.unread}</span>
                       )}
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Column 2: Message Window */}
      <div className="flex-1 flex flex-col bg-white h-full relative">
         
         {/* Chat Header */}
         <div className="h-24 px-10 border-b border-[#EBEFF1] flex items-center justify-between">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden shadow-sm">
                  <img src={activeChat.avatar} alt="Active" />
               </div>
               <div>
                  <div className="flex items-center gap-2">
                     <h3 className="text-[16px] font-bold text-slate-900">{activeChat.name}</h3>
                     <ShieldCheck size={14} className="text-primary" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{activeChat.role}</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-all"><Phone size={20} /></button>
               <button className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-all"><Video size={20} /></button>
               <button className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-all"><MoreVertical size={20} /></button>
            </div>
         </div>

         {/* Messages Stream */}
         <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth bg-slate-50/30">
            <div className="text-center py-4">
               <span className="text-[11px] font-black uppercase text-slate-300 tracking-[0.2em]">Today</span>
            </div>
            {messages.map(msg => (
              <div key={msg.id} className={cn(
                "flex flex-col max-w-[70%]",
                msg.sender === 'me' ? "ml-auto items-end" : "items-start"
              )}>
                 <div className={cn(
                   "p-5 rounded-[1.5rem] shadow-sm text-[15px] font-medium leading-relaxed",
                   msg.sender === 'me' 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-white text-slate-900 border border-slate-100 rounded-tl-none"
                 )}>
                    {msg.text}
                 </div>
                 <div className="flex items-center gap-2 mt-2 px-1">
                    <span className="text-[10px] text-slate-400 font-bold">{msg.time}</span>
                    {msg.sender === 'me' && <CheckCheck size={12} className="text-primary" />}
                 </div>
              </div>
            ))}
         </div>

         {/* Input Box */}
         <div className="p-8 bg-white border-t border-[#EBEFF1]">
            <div className="bg-[#F8FAFB] rounded-[2rem] p-3 flex items-center gap-4">
               <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-all"><Smile size={22} /></button>
               <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-all"><Paperclip size={22} /></button>
               <input 
                 type="text" 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Type your message..." 
                 className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium px-2"
               />
               <button 
                 onClick={handleSend}
                 disabled={!inputText.trim()}
                 className="w-12 h-12 bg-primary text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
               >
                  <Send size={20} className="translate-x-0.5 -translate-y-0.5 rotate-[-15deg]" />
               </button>
            </div>
         </div>
      </div>

      {/* Column 3: Contact Context */}
      <div className="w-[360px] hidden xl:flex flex-col border-l border-[#EBEFF1] bg-white h-full relative overflow-y-auto no-scrollbar">
         <div className="p-10 text-center">
            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 mx-auto overflow-hidden shadow-xl mb-6 border-4 border-white">
               <img src={activeChat.avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 uppercase italic">{activeChat.name}</h3>
            <p className="text-[12px] font-bold text-primary uppercase tracking-widest">{activeChat.role}</p>
         </div>

         <div className="px-10 space-y-10 pb-20">
            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Response</p>
                  <p className="text-lg font-black text-slate-900">14m</p>
               </div>
               <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Trust Pos.</p>
                  <p className="text-lg font-black text-slate-900">98%</p>
               </div>
            </div>

            <div>
               <h4 className="text-[13px] font-black uppercase tracking-widest text-[#202124] mb-6">Shared Business Units</h4>
               <div className="space-y-4">
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4 group cursor-pointer hover:border-primary transition-all">
                     <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center"><Zap size={20} /></div>
                     <div className="flex-1">
                        <p className="text-[13px] font-bold text-slate-900 leading-tight">Project Delta</p>
                        <p className="text-[10px] text-slate-400 font-medium">Design System</p>
                     </div>
                     <ChevronRight size={16} className="text-slate-300" />
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4 group cursor-pointer hover:border-primary transition-all">
                     <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Clock size={20} /></div>
                     <div className="flex-1">
                        <p className="text-[13px] font-bold text-slate-900 leading-tight">Q4 Roadmap</p>
                        <p className="text-[10px] text-slate-400 font-medium">Strategy PDF</p>
                     </div>
                     <ChevronRight size={16} className="text-slate-300" />
                  </div>
               </div>
            </div>

            <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[12px] uppercase shadow-lg hover:bg-red-500 transition-all">Report / Block</button>
         </div>
      </div>
    </div>
  );
}
