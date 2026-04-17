"use client";

import React, { useState } from "react";
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
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DUMMY_CHATS } from "@/lib/dummyData";

export default function PremiumMessagesPage() {
  const [selectedChat, setSelectedChat] = useState<any>(DUMMY_CHATS[0]);
  const [message, setMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex h-full bg-white overflow-hidden selection:bg-[#E53935]/10">
      
      {/* 1. THREAD LIST SIDEBAR */}
      <aside className={cn(
        "w-full md:w-[380px] border-r border-slate-100 flex flex-col bg-white transition-all",
        selectedChat && "hidden md:flex"
      )}>
        <div className="p-8 pb-6 bg-white/100 z-10 sticky top-0">
           <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black text-slate-900 leading-none">Chats</h1>
              <button className="h-10 w-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all">
                 <Settings size={18} />
              </button>
           </div>
           
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E53935] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full h-12 bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 text-[13px] font-medium outline-none focus:bg-white focus:border-slate-100 focus:shadow-sm" 
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-1 pb-40 lg:pb-12">
           <div className="px-5 mb-4 mt-2">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Recent Discussions</p>
           </div>
           {DUMMY_CHATS.map((chat) => (
             <button 
               key={chat.id} 
               onClick={() => setSelectedChat(chat)}
               className={cn(
                 "w-full flex items-center gap-4 p-4 rounded-3xl transition-all group",
                 selectedChat?.id === chat.id ? "bg-slate-900 shadow-2xl shadow-slate-900/10" : "hover:bg-slate-50"
               )}
             >
                <div className="relative shrink-0">
                   <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-slate-100 transition-all">
                      <img src={chat.avatar} className="w-full h-full object-cover" alt="" />
                   </div>
                   {chat.online && <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-[3px] border-white shadow-sm" />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                   <div className="flex justify-between items-center mb-1">
                      <h4 className={cn("text-[15px] font-bold truncate", selectedChat?.id === chat.id ? "text-white" : "text-slate-900")}>
                         {chat.name}
                      </h4>
                      <span className={cn("text-[10px] font-bold", selectedChat?.id === chat.id ? "text-white/40" : "text-slate-400")}>
                         {chat.time}
                      </span>
                   </div>
                   <p className={cn("text-[13px] font-medium truncate", selectedChat?.id === chat.id ? "text-white/60" : "text-slate-500")}>
                      {chat.last}
                   </p>
                </div>
             </button>
           ))}
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
            <header className="h-20 lg:h-24 px-6 lg:px-10 flex items-center justify-between bg-white border-b border-slate-50 sticky top-0 z-20">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedChat(null)} className="md:hidden h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900">
                     <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-md">
                        <img src={selectedChat.avatar} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <h2 className="text-[17px] font-black text-slate-900 leading-tight">{selectedChat.name}</h2>
                        <div className="flex items-center gap-2">
                           <span className={cn("h-1.5 w-1.5 rounded-full", selectedChat.online ? "bg-green-500" : "bg-slate-300")} />
                           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{selectedChat.online ? "Online Now" : "Inactive"}</span>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-2">
                  <button className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-[#E53935] hover:text-white transition-all shadow-sm">
                     <Phone size={20} />
                  </button>
                  <button className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-[#E53935] hover:text-white transition-all shadow-sm">
                     <Video size={20} />
                  </button>
                  <button 
                    onClick={() => setShowProfile(!showProfile)}
                    className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                  >
                     <Info size={22} />
                  </button>
               </div>
            </header>

            {/* MESSAGE STREAM */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 bg-[#FDFDFF] no-scrollbar">
               <div className="flex justify-center">
                  <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session Encryption Active</span>
               </div>

               {/* Mock Messages */}
               <div className="space-y-8">
                  <div className="flex flex-col items-start max-w-[80%]">
                     <div className="bg-white border border-slate-100 p-5 rounded-[2rem] rounded-tl-lg shadow-sm">
                        <p className="text-[15px] font-medium text-slate-700 leading-relaxed">Hey Ahmad! I saw your recent post about the MSME logistics collective. Do you have a deck I could review?</p>
                     </div>
                     <span className="text-[10px] font-bold text-slate-300 mt-2 ml-4">10:42 AM</span>
                  </div>

                  <div className="flex flex-col items-end w-full">
                     <div className="bg-[#E53935] p-5 rounded-[2rem] rounded-tr-lg shadow-xl shadow-red-500/10 max-w-[80%]">
                        <p className="text-[15px] font-medium text-white leading-relaxed">Hey {selectedChat.name.split(' ')[0]}! Yes, we just finalized the regional strategy. Attaching the summary PDF here.</p>
                     </div>
                     <div className="flex items-center gap-2 mt-2 mr-4">
                        <span className="text-[10px] font-bold text-slate-300">10:45 AM</span>
                        <CheckCheck size={14} className="text-[#E53935]" />
                     </div>
                  </div>

                  <div className="flex flex-col items-end w-full">
                     <div className="bg-white border border-slate-100 p-4 rounded-[2rem] rounded-tr-lg shadow-sm flex items-center gap-4 max-w-[80%]">
                        <div className="h-12 w-12 bg-red-50 text-[#E53935] rounded-xl flex items-center justify-center shrink-0">
                           <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0 pr-12">
                           <p className="text-[14px] font-bold text-slate-900 truncate">Logistics_Synergy_2026.pdf</p>
                           <p className="text-[11px] font-medium text-slate-400">4.2 MB • PDF Document</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* COMPOSER (BOTTOM) */}
            <div className="p-6 lg:p-8 bg-white border-t border-slate-50 pb-24 lg:pb-8">
               <div className="flex items-center gap-4 bg-slate-50 rounded-[2.5rem] p-2 pl-6 shadow-sm border border-slate-100/50 group focus-within:bg-white focus-within:shadow-xl transition-all">
                  <button className="text-slate-300 hover:text-slate-900 transition-colors">
                     <Plus size={24} />
                  </button>
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-slate-900 py-4"
                  />
                  <div className="flex items-center gap-2 pr-2">
                     <button className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors">
                        <ImageIcon size={20} />
                     </button>
                     <button 
                       className={cn(
                        "h-12 w-12 flex items-center justify-center rounded-full transition-all shadow-lg active:scale-95",
                        message.length > 0 ? "bg-[#E53935] text-white shadow-red-500/20" : "bg-slate-200 text-slate-400 grayscale"
                       )}
                     >
                        <Send size={20} />
                     </button>
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#FDFDFF]">
             <div className="h-24 w-24 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-[#E53935] mb-8 animate-bounce-subtle">
                <MessageSquare size={40} />
             </div>
             <h2 className="text-2xl font-black text-slate-900 leading-tight">Your Communication Hub</h2>
             <p className="text-slate-500 max-w-sm mt-4 font-medium leading-relaxed">Select a conversation to start exploring potential business synergies and contract details.</p>
          </div>
        )}
      </main>

      {/* 3. PROFILE / CONTEXT DRAWER (RIGHT) */}
      {selectedChat && showProfile && (
        <aside className="hidden lg:flex flex-col w-[380px] border-l border-slate-100 bg-white animate-in slide-in-from-right duration-300">
           <div className="p-8 h-full overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-[12px] font-bold text-slate-300 uppercase tracking-widest">Partner Identity</h3>
                 <button onClick={() => setShowProfile(false)} className="h-8 w-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center hover:bg-slate-100">
                    <X size={16} />
                 </button>
              </div>

              <div className="text-center mb-12">
                 <div className="h-32 w-32 mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl mb-6 ring-4 ring-slate-50">
                    <img src={selectedChat.avatar} className="w-full h-full object-cover" alt="" />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">{selectedChat.name}</h2>
                 <p className="text-[11px] font-bold text-[#E53935] uppercase tracking-widest mb-6">Verified Business Founder</p>
                 
                 <div className="flex justify-center gap-3">
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-[#E53935] shadow-lg transition-all">View Profile</button>
                    <button className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-100"><Star size={18} /></button>
                 </div>
              </div>

              <div className="space-y-8">
                 <div>
                    <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-4">Shared Synergy</h4>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                          <p className="text-[18px] font-bold text-slate-900">12</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Documents</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                          <p className="text-[18px] font-bold text-slate-900">4</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Contracts</p>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-4">Shared Files</h4>
                    <div className="space-y-3">
                       {[
                         { icon: FileText, name: "Proposal_Final.pdf", size: "1.2MB" },
                         { icon: ImageIcon, name: "Asset_Photos.zip", size: "145MB" },
                       ].map((f, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 cursor-pointer transition-all">
                            <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-400">
                               <f.icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-[13px] font-bold text-slate-900 truncate">{f.name}</p>
                               <p className="text-[10px] font-bold text-slate-400">{f.size}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </aside>
      )}
    </div>
  );
}
