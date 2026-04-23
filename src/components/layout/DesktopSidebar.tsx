"use client";

import React, { useState, useEffect } from "react";
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
  ShoppingBag, 
  Zap, 
  TrendingUp,
  BrainCircuit,
  Layout,
  Globe,
  ChevronRight,
  Target,
  Activity,
  ShieldCheck,
  Building2,
  UserPlus
} from "lucide-react";

const NAV_GROUPS = [
  {
    group: "Network Hub",
    items: [
      { label: "Feeds", icon: Home, href: "/home" },
      {label: "Partners", icon: Users, href: "/matches"},
      {label: "Connections", icon: UserPlus, href: "/connections", badge: "2" },
      {label: "Messages", icon: MessageSquare, href: "/chat"},
      {label: "Communities", icon: Globe, href: "/communities"},
    ]
  },
  {
    group: "Explore",
    items: [
      { label: "Checkout Map", icon: Zap, href: "/explore" },
      { label: "Business Events", icon: LayoutGrid, href: "/events" },
      { label: "Business Directory", icon: Building2, href: "/directory" },
      { label: "Advisors", icon: Target, href: "/advisors" },
    ]
  },
  {
    group: "Settings",
    items: [
      { label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
    ]
  }
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] hidden lg:flex flex-col bg-white border-r border-[#292828]/5 h-full sticky top-0 py-10 px-6 overflow-y-auto no-scrollbar selection:bg-[#E53935]/10 z-50">
      
      {/* 1. NAVIGATION GROUPS */}
      <div className="flex-1 space-y-12">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-6">
            <h3 className="px-4 text-[9px] font-black uppercase text-[#292828]/30 tracking-[0.3em] flex items-center justify-between">
              {group.group}
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-4 px-4 h-11 rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive 
                        ? "bg-[#292828] text-white" 
                        : "text-slate-500 hover:text-[#292828] hover:bg-slate-50"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E53935] rounded-r-full" />
                    )}
                    
                    <item.icon 
                      size={18} 
                      className={cn(
                        "transition-all duration-300",
                        isActive ? "text-[#E53935]" : "group-hover:text-[#292828]"
                      )} 
                    />
                    
                    <span className={cn(
                      "text-[12px] font-bold uppercase tracking-tight",
                      isActive ? "text-white" : "text-slate-500"
                    )}>
                      {item.label}
                    </span>
                    
                    {item.badge && (
                      <div className="ml-auto h-5 px-2 rounded-lg bg-[#E53935] text-white text-[9px] font-black flex items-center justify-center shadow-[0_0_15px_rgba(229,57,53,0.3)]">
                        {item.badge}
                      </div>
                    )}

                    {!isActive && (
                      <ChevronRight size={14} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#292828]/20" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. FOOTER: NODE SYNC & IDENTITY */}
      <div className="mt-12 pt-10 border-t border-[#292828]/5">
         <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] relative group cursor-pointer hover:bg-white hover:shadow-3xl transition-all duration-700">
            <div className="flex items-center gap-4 mb-6">
               <div className="h-10 w-10 bg-white shadow-xl rounded-xl flex items-center justify-center text-[#E53935] group-hover:rotate-12 transition-transform">
                  <Activity size={20} />
               </div>
                <div>
                   <p className="text-[11px] font-medium text-[#292828] uppercase leading-none mb-1.5 flex items-center gap-1.5">
                      Verified User <ShieldCheck size={12} className="text-emerald-500" />
                   </p>
                   <p className="text-[10px] font-light text-[#E53935] uppercase leading-none">Rank #12 in City</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-[8px] font-medium text-[#292828]/30 uppercase tracking-[0.2em]">
                   <span>Profile Health</span>
                   <span className="text-[#292828]">98%</span>
                </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
                  <div className="h-full bg-[#292828] rounded-full relative group-hover:bg-[#E53935] transition-all duration-[3s]" style={{ width: "98%" }}>
                     <div className="absolute top-0 bottom-0 right-0 w-1 bg-white/30 animate-pulse" />
                  </div>
               </div>
            </div>
         </div>
         
         <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
               <Zap size={14} className="text-[#292828]/20 hover:text-[#E53935] transition-colors cursor-pointer" />
               <TrendingUp size={14} className="text-[#292828]/20 hover:text-[#292828] transition-colors cursor-pointer" />
               <ShieldCheck size={14} className="text-[#292828]/20 hover:text-emerald-500 transition-colors cursor-pointer" />
            </div>
            <p className="text-[9px] font-bold text-[#292828]/20 uppercase tracking-[0.3em]">Checkout OS v1.0</p>
         </div>
      </div>

    </aside>
  );
}
