"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  MessageSquare, 
  UserPlus, 
  Search, 
  User
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/hooks/useAuth";

export default function MobileNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadMessagesCount, pendingRequestsCount } = useNotifications();

  const navItems = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Network", icon: UserPlus, href: "/matches", badge: pendingRequestsCount > 0 ? pendingRequestsCount : null },
    { label: "Discover", icon: Search, href: "/discover" },
    { label: "Chat", icon: MessageSquare, href: "/chat", badge: unreadMessagesCount > 0 ? unreadMessagesCount : null },
    { label: "Profile", icon: User, href: `/profile/${user?.id}` },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-black/[0.05] pb-safe z-[100] px-6 h-[72px] flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 relative min-w-[50px] transition-all duration-300",
              isActive ? "text-[#E53935]" : "text-black/30"
            )}
          >
            <div className={cn(
              "h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300",
              isActive ? "bg-[#E53935]/5 scale-110" : "bg-transparent"
            )}>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest leading-none",
              isActive ? "opacity-100" : "opacity-0 scale-90 translate-y-1"
            )}>
              {item.label}
            </span>

            {item.badge && (
              <div className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#E53935] text-white text-[8px] font-black flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                {item.badge}
              </div>
            )}

            {isActive && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E53935] rounded-full shadow-[0_0_8px_#E53935]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
