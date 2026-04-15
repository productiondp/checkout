"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { 
  Home, 
  MessageSquare, 
  Users, 
  MapPin, 
  Calendar, 
  Search, 
  LayoutGrid, 
  GraduationCap, 
  ShoppingBag, 
  Zap, 
  User 
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home Feed", icon: Home, href: "/home" },
  { label: "Messages", icon: MessageSquare, href: "/chat" },
  { label: "Partners", icon: Users, href: "/match" },
  { label: "Meetings", icon: MapPin, href: "/meetup" },
  { label: "Business Expos", icon: LayoutGrid, href: "/events" },
  { label: "Search Places", icon: Search, href: "/explore" },
  { label: "Groups", icon: LayoutGrid, href: "/community" },
  { label: "Talk to Experts", icon: GraduationCap, href: "/advisors" },
  { label: "Buy & Sell", icon: ShoppingBag, href: "/marketplace" },
  { label: "My Wallet", icon: Zap, href: "/wallet" },
  { label: "My Profile", icon: User, href: "/profile" },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] hidden lg:flex flex-col border-r border-slate-50 bg-white h-full relative z-10">
      <nav className="flex flex-col flex-1 py-4 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium transition-all mx-3 rounded-lg border border-transparent ${
                isActive ? "bg-red-50 text-[#E53935] font-semibold" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-[#E53935]" : "text-slate-400"} />
              <span className={`truncate ${isActive ? "text-[#E53935]" : "text-slate-600"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
