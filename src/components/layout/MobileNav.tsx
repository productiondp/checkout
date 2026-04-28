"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  Search, 
  MessageSquare, 
  User, 
  Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";
import PostModal from "../modals/PostModal";
import { useNotifications } from "@/contexts/NotificationContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { unreadMessagesCount, pendingRequestsCount } = useNotifications();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const menu = [
    { label: "Home Feed", href: "/home", icon: Home },
    { label: "Network Hub", href: "/matches", icon: Users },
    { label: "Discovery Map", href: "/discover", icon: Search },
    { label: "Chat", href: "/chat", icon: MessageSquare },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-[calc(70px+env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-3xl border-t border-[#292828]/10 flex items-start justify-around lg:hidden z-[999] px-2 pt-3 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.04)]">
        {/* 1. LEFT ITEMS */}
        <Link 
          href={menu[0].href}
          className="flex flex-col items-center justify-center w-14 h-14 group"
        >
          <Home size={22} className={cn("transition-all", pathname === menu[0].href ? "text-[#E53935]" : "text-[#292828]")} strokeWidth={pathname === menu[0].href ? 2.5 : 2} />
          <span className={cn("text-[9px] font-bold uppercase mt-1", pathname === menu[0].href ? "text-[#E53935]" : "text-[#292828]")}>Home</span>
        </Link>

        <Link 
          href={menu[1].href}
          className="flex flex-col items-center justify-center w-14 h-14 group relative"
        >
          <div className="relative">
            <div className="relative">
              <Users size={22} className={cn("transition-all", pathname === menu[1].href ? "text-[#E53935]" : "text-[#292828]")} strokeWidth={pathname === menu[1].href ? 2.5 : 2} />
              {pendingRequestsCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 bg-[#34C759] rounded-full ring-2 ring-white flex items-center justify-center text-[8px] font-black text-white">
                  {pendingRequestsCount}
                </div>
              )}
            </div>
          </div>
          <span className={cn("text-[9px] font-bold uppercase mt-1", pathname === menu[1].href ? "text-[#E53935]" : "text-[#292828]")}>Hub</span>
        </Link>

        {/* 2. CENTER ACTION (ADD) */}
        <div className="relative -translate-y-6">
           <button 
             onClick={() => setIsPostModalOpen(true)}
             className="h-16 w-16 bg-[#E53935] rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-500/30 active:scale-90 transition-all border-4 border-white"
           >
             <Plus size={32} />
           </button>
        </div>

        {/* 3. RIGHT ITEMS */}
        <Link 
          href={menu[3].href}
          className="flex flex-col items-center justify-center w-14 h-14 group relative"
        >
          <div className="relative">
             <MessageSquare size={22} className={cn("transition-all", pathname === menu[3].href ? "text-[#E53935]" : "text-[#292828]")} strokeWidth={pathname === menu[3].href ? 2.5 : 2} />
             {unreadMessagesCount > 0 && (
               <div className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 bg-[#E53935] rounded-full ring-2 ring-white flex items-center justify-center text-[8px] font-black text-white">
                 {unreadMessagesCount}
               </div>
             )}
          </div>
          <span className={cn("text-[9px] font-bold uppercase mt-1", pathname === menu[3].href ? "text-[#E53935]" : "text-[#292828]")}>Chat</span>
        </Link>

        <Link 
          href={menu[4].href}
          className="flex flex-col items-center justify-center w-14 h-14 group"
        >
          <User size={22} className={cn("transition-all", pathname === menu[4].href ? "text-[#E53935]" : "text-[#292828]")} strokeWidth={pathname === menu[4].href ? 2.5 : 2} />
          <span className={cn("text-[9px] font-bold uppercase mt-1", pathname === menu[4].href ? "text-[#E53935]" : "text-[#292828]")}>Profile</span>
        </Link>
      </div>

      <PostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    </>
  );
}
