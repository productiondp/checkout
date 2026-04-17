"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Plus, MessageSquare, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();

  const menu = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Partners", href: "/match", icon: Users },
    { label: "Search", href: "/explore", icon: Search },
    { label: "Messages", href: "/chat", icon: MessageSquare },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-3xl border-t border-slate-100 flex items-center justify-around lg:hidden z-[999] px-2 pb-safe shadow-[0_-8px_40px_rgba(0,0,0,0.04)]">
      {/* 1. LEFT ITEMS */}
      <Link 
        href={menu[0].href}
        className="flex flex-col items-center justify-center w-14 h-14 group"
      >
        <Home size={22} className={cn("transition-all", pathname === menu[0].href ? "text-[#E53935]" : "text-slate-400")} strokeWidth={pathname === menu[0].href ? 2.5 : 2} />
        <span className={cn("text-[9px] font-bold uppercase mt-1", pathname === menu[0].href ? "text-[#E53935]" : "text-slate-400")}>Home</span>
      </Link>

      <Link 
        href={menu[1].href}
        className="flex flex-col items-center justify-center w-14 h-14 group"
      >
        <Users size={22} className={cn("transition-all", pathname === menu[1].href ? "text-[#E53935]" : "text-slate-400")} strokeWidth={pathname === menu[1].href ? 2.5 : 2} />
        <span className={cn("text-[9px] font-bold uppercase mt-1", pathname === menu[1].href ? "text-[#E53935]" : "text-slate-400")}>Partners</span>
      </Link>

      {/* 2. CENTER ACTION (ADD) */}
      <div className="relative -translate-y-6">
         <Link 
           href="/explore"
           className="h-16 w-16 bg-[#E53935] rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-500/30 active:scale-90 transition-all border-4 border-white"
         >
           <Plus size={32} />
         </Link>
      </div>

      {/* 3. RIGHT ITEMS */}
      <Link 
        href={menu[3].href}
        className="flex flex-col items-center justify-center w-14 h-14 group"
      >
        <div className="relative">
           <MessageSquare size={22} className={cn("transition-all", pathname === menu[3].href ? "text-[#E53935]" : "text-slate-400")} strokeWidth={pathname === menu[3].href ? 2.5 : 2} />
           <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-[#E53935] rounded-full border border-white" />
        </div>
        <span className={cn("text-[9px] font-bold uppercase mt-1", pathname === menu[3].href ? "text-[#E53935]" : "text-slate-400")}>Chats</span>
      </Link>

      <Link 
        href={menu[4].href}
        className="flex flex-col items-center justify-center w-14 h-14 group"
      >
        <User size={22} className={cn("transition-all", pathname === menu[4].href ? "text-[#E53935]" : "text-slate-400")} strokeWidth={pathname === menu[4].href ? 2.5 : 2} />
        <span className={cn("text-[9px] font-bold uppercase mt-1", pathname === menu[4].href ? "text-[#E53935]" : "text-slate-400")}>Me</span>
      </Link>
    </div>
  );
}
