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
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around lg:hidden z-[999] px-6">
      {menu.map((item) => {
        const active = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all ${active ? "text-[#E53935]" : "text-slate-400"}`}
          >
            <item.icon size={20} className={active ? "text-[#E53935]" : "text-slate-400"} />
            <span className={`text-[10px] font-bold uppercase tracking-normal ${active ? "opacity-100" : "opacity-60"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
