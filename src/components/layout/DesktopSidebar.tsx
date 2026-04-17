"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
  User,
  Settings,
  Bell,
  ChevronRight,
  TrendingUp,
  Award,
  Circle,
  Rocket
} from "lucide-react";

const NAV_GROUPS = [
  {
    group: "Network Hub",
    items: [
      { label: "Home Feed", icon: Home, href: "/home", color: "#E53935" },
      { label: "Messages", icon: MessageSquare, href: "/chat", badge: "2" },
      { label: "Partners", icon: Users, href: "/match" },
      { label: "Meetings", icon: MapPin, href: "/meetup" },
    ]
  },
  {
    group: "Discovery",
    items: [
      { label: "Business Expos", icon: LayoutGrid, href: "/events" },
      { label: "Search Places", icon: Search, href: "/explore" },
      { label: "Groups", icon: Users, href: "/community" },
      { label: "Talk to Experts", icon: GraduationCap, href: "/advisors" },
    ]
  },
  {
    group: "Private",
    items: [
      { label: "Buy & Sell", icon: ShoppingBag, href: "/marketplace" },
      { label: "My Wallet", icon: Zap, href: "/wallet" },
      { label: "My Profile", icon: User, href: "/profile" },
    ]
  }
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] hidden lg:flex flex-col border-r border-slate-100 bg-white h-screen sticky top-0 px-4 py-8 overflow-y-auto no-scrollbar selection:bg-[#E53935]/10">
      
      {/* NAVIGATION SECTIONS */}
      <div className="flex-1 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            <h4 className="px-6 text-[11px] font-semibold uppercase  text-slate-400">
              {group.group}
            </h4>
            <nav className="space-y-1 text-slate-600">
              {group.items.map((item) => {
                if (item.label === "My Profile") return null;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-5 py-2 rounded-xl transition-all duration-300",
                      isActive 
                        ? "bg-[#E53935]/5 text-[#E53935]" 
                        : "hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={cn(
                        "transition-transform",
                        isActive ? "text-[#E53935]" : "text-slate-400 group-hover:text-slate-600"
                      )}>
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className={cn(
                        "text-[14px] font-normal ",
                        isActive ? "text-[#E53935] font-semibold" : ""
                      )}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* FOOTER WIDGET */}
      <div className="mt-12 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
         <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#E53935] shadow-sm">
               <TrendingUp size={18} />
            </div>
            <div>
               <p className="text-[12px] font-bold text-slate-900">Elite Level</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase">32 Credits Left</p>
            </div>
         </div>
         <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-[#E53935] rounded-full" />
         </div>
      </div>
    </aside>
  );
}
