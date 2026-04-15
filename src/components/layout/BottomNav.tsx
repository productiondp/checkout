"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, Sparkles, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Matches", icon: Sparkles, href: "/match" },
    { label: "Directory", icon: Search, href: "/explore" },
    { label: "Wallet", icon: Wallet, href: "/wallet" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E4E6EB] sm:max-w-md sm:mx-auto lg:hidden">
      <nav className="h-16 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all group relative",
                isActive ? "text-primary" : "text-[#65676B] hover:bg-[#F2F2F2] rounded-xl"
              )}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                   <div className="absolute -bottom-2 lg:bottom-auto lg:top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-primary rounded-t-full"></div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
