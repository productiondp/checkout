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
  Search, 
  LayoutGrid, 
  GraduationCap, 
  ShoppingBag, 
  Zap, 
  TrendingUp,
  Target
} from "lucide-react";

const NAV_GROUPS = [
  {
    group: "Network Hub",
    items: [
      { label: "Home Feed", icon: Home, href: "/home" },
      { label: "Messages", icon: MessageSquare, href: "/chat", badge: "2" },
      { label: "Partners", icon: Users, href: "/match" },
      { label: "Meetings", icon: MapPin, href: "/meetup" },
    ]
  },
  {
    group: "Discovery",
    items: [
      { label: "Business Expos", icon: LayoutGrid, href: "/events" },
      { label: "Checkout Map", icon: Search, href: "/explore" },
      { label: "Groups", icon: Users, href: "/community" },
      { label: "Business Advisors", icon: GraduationCap, href: "/advisors" },
    ]
  },
  {
    group: "Private",
    items: [
      { label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
      { label: "My Wallet", icon: Zap, href: "/wallet" },
    ]
  }
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 hidden lg:flex flex-col bg-white border-r border-[#292828]/10 h-full sticky top-0 p-6 overflow-y-auto no-scrollbar selection:bg-[#E53935]/10">
      
      <div className="flex-1 space-y-10">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="px-4 text-[10px] font-black uppercase text-[#292828]/30 tracking-[0.1em]">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-4 px-4 h-12 rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive 
                        ? "bg-[#292828]/5 text-[#E53935] shadow-sm" 
                        : "text-[#292828]/60 hover:text-[#292828] hover:bg-[#292828]/5"
                    )}
                  >
                    <item.icon 
                      size={20} 
                      className={cn(
                        "transition-all duration-500",
                        isActive ? "text-[#E53935]" : "group-hover:text-[#292828]"
                      )} 
                    />
                    <span className={cn(
                       "text-[13px] font-bold uppercase tracking-tight",
                       isActive ? "text-[#E53935]" : ""
                    )}>{item.label}</span>
                    
                    {item.badge && (
                      <span className="ml-auto h-5 px-2 rounded-md bg-[#E53935] text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E53935] rounded-r-full shadow-[0_0_15px_rgba(229,57,53,0.4)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ELITE STATUS HUB */}
      <div className="mt-auto pt-10">
         <div className="bg-[#292828]/5 border border-[#292828]/10 rounded-2xl p-5 relative group cursor-pointer hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all overflow-hidden border-[#292828]/10">
            <div className="absolute -bottom-4 -right-4 text-[#292828] opacity-5 rotate-12 group-hover:opacity-10 transition-opacity">
               <TrendingUp size={100} />
            </div>
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
               <div className="h-10 w-10 bg-[#292828] rounded-xl flex items-center justify-center text-white shadow-xl group-hover:bg-[#E53935] transition-colors">
                  <Target size={20} />
               </div>
               <div>
                  <p className="text-[11px] font-black text-[#292828] uppercase leading-none mb-1">Elite Level</p>
                  <p className="text-[9px] font-bold text-[#292828]/40 uppercase">Global Verified Hub</p>
               </div>
            </div>

            <div className="space-y-3 relative z-10">
               <div className="flex justify-between text-[9px] font-black text-[#292828]/30 uppercase">
                  <span>32 Credits Left</span>
                  <span className="text-[#292828]">80%</span>
               </div>
               <div className="h-1.5 w-full bg-[#292828]/10 rounded-full overflow-hidden border border-[#292828]/5">
                  <div className="h-full bg-[#E53935] rounded-full shadow-[0_0_10px_rgba(229,57,53,0.3)]" style={{ width: "80%" }} />
               </div>
            </div>
         </div>
      </div>

    </aside>
  );
}
