"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  PlusSquare,
  Users, 
  Calendar, 
  Globe, 
  Layers, 
  UserCircle, 
  ShoppingBag,
  Zap,
  LayoutGrid,
  MapPin,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Feed", icon: LayoutGrid, href: "/home" },
  { label: "Messages", icon: MessageSquare, href: "/chat" },
  { label: "Partners", icon: Users, href: "/match" },
  { label: "Meetups", icon: MapPin, href: "/meetup" },
  { label: "Events", icon: Calendar, href: "/events" },
  { label: "Directory", icon: Globe, href: "/explore" },
  { label: "Community", icon: Layers, href: "/community" },
  { label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
  { label: "Profile", icon: UserCircle, href: "/profile" },
];

const PAGES_YOU_LIKE = [
  { name: "Football FC", color: "bg-green-500", count: 120 },
  { name: "Badminton Club", color: "bg-purple-500" },
  { name: "UI/UX Community", color: "bg-blue-400" },
  { name: "Web Designer", color: "bg-pink-400" },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] hidden lg:flex flex-col border-r border-[#F2F5F7] bg-white h-full relative z-10">
      {/* Search Hub / Action */}
      <div className="p-8 pb-4">
         <button className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-black transition-all">
            <PlusSquare size={18} />
            Create Posting
         </button>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col flex-1 py-4 overflow-y-auto no-scrollbar">
        <div className="px-8 pb-4">
           <h4 className="text-[10px] font-bold text-[#5F6368] uppercase tracking-[0.2em] mb-4">Main Menu</h4>
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn("nav-link", isActive && "active")}
            >
              <item.icon size={20} className={cn("flex-shrink-0", isActive ? "text-primary" : "text-[#5F6368]")} />
              <span className={cn("truncate", isActive ? "text-primary font-bold" : "text-[#5F6368] font-medium")}>{item.label}</span>
            </Link>
          );
        })}

        {/* Separator */}
        <div className="h-px bg-[#F2F5F7] mx-8 my-8" />

        {/* Pages Section */}
        <div className="px-8 space-y-6">
           <h4 className="text-[10px] font-bold text-[#5F6368] uppercase tracking-[0.2em]">Pages You Like</h4>
           <div className="space-y-5 pb-10">
              {PAGES_YOU_LIKE.map((page) => (
                <div key={page.name} className="flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black text-white uppercase shadow-sm", page.color)}>
                        {page.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[14px] font-medium text-[#202124] group-hover:text-primary transition-colors">{page.name}</span>
                   </div>
                   {page.count && (
                     <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">{page.count}</span>
                   )}
                </div>
              ))}
           </div>
        </div>
      </nav>

      {/* Pro Upgrade / Help Section */}
      <div className="p-8 border-t border-[#F2F5F7]">
         <div className="bg-[#E8F0FE] rounded-2xl p-5 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
               <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                  <Zap size={16} className="fill-white" />
               </div>
               <p className="text-[13px] font-bold text-slate-900 mb-1">Go Premium</p>
               <p className="text-[11px] text-[#5F6368] leading-relaxed">Access unlimited business matches.</p>
            </div>
            <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
         </div>
      </div>
    </aside>
  );
}
