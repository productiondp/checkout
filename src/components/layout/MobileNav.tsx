"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home, Users, GraduationCap, Search, LayoutGrid } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const menu = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Partners", href: "/match", icon: Users },
    { label: "Experts", href: "/advisors", icon: GraduationCap },
    { label: "Search", href: "/explore", icon: Search },
    { label: "Business Expos", href: "/events", icon: LayoutGrid },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 h-16 bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl flex items-center justify-around lg:hidden z-[999] px-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      {menu.slice(0, 2).map((item) => {
        const active = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex flex-col items-center gap-1 transition-all"
          >
            <item.icon size={22} className={active ? "text-[#E53935]" : "text-slate-400"} strokeWidth={active ? 2.5 : 2} />
          </Link>
        );
      })}

      {/* Primary Action Button (Post/Create) */}
      <button className="h-14 w-14 bg-[#E53935] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all -translate-y-4 border-4 border-white">
        <LayoutGrid size={24} />
      </button>

      {menu.slice(3).map((item) => {
        const active = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex flex-col items-center gap-1 transition-all"
          >
            <item.icon size={22} className={active ? "text-[#E53935]" : "text-slate-400"} strokeWidth={active ? 2.5 : 2} />
          </Link>
        );
      })}
    </div>
  );
}
