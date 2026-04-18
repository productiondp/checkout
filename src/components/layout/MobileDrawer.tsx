"use client";

import React from "react";
import Link from "next/link";
import { 
  X, 
  Home, 
  Users, 
  Search, 
  ShoppingBag, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Info, 
  LogOut,
  Zap,
  Briefcase,
  Target,
  Globe,
  Award,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const menuItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "People", href: "/match", icon: Users },
    { label: "Find", href: "/explore", icon: Search },
    { label: "Market", href: "/marketplace", icon: ShoppingBag },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Meetups", href: "/meetup", icon: MessageSquare },
    { label: "Experts", href: "/advisors", icon: Award },
    { label: "Communities", href: "/community", icon: Globe },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] lg:hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#292828]/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl animate-in slide-in-from-left duration-500 overflow-y-auto no-scrollbar flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[#292828]/5 flex items-center justify-between bg-white sticky top-0 z-10">
          <img src="/images/logo.png" className="h-8 object-contain" alt="Logo" />
          <button onClick={onClose} className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828]">
            <X size={20} />
          </button>
        </div>

        {/* User Quick Profile */}
        <div className="p-6 bg-[#292828]/5 border-b border-[#292828]/5">
           <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                 <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                 <p className="text-lg font-black text-[#292828] leading-tight">Arun Dev</p>
                 <p className="text-[10px] font-bold text-[#E53935] uppercase">Verified Expert</p>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-2">
              <Link href="/profile" onClick={onClose} className="h-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-black uppercase text-[#292828] border border-[#292828]/10 shadow-sm">Me</Link>
              <Link href="/wallet" onClick={onClose} className="h-10 bg-[#E53935] rounded-xl flex items-center justify-center text-[10px] font-black uppercase text-white shadow-md">Wallet</Link>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 py-2 text-[10px] font-black text-[#292828]/30 uppercase mb-2">Main Menu</p>
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              onClick={onClose}
              className="flex items-center justify-between p-4 rounded-2xl text-[14px] font-bold text-[#292828] hover:bg-[#292828]/5 transition-all group active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#292828]/10 flex items-center justify-center text-[#292828] group-hover:text-[#E53935] shadow-sm transition-colors">
                  <item.icon size={18} />
                </div>
                {item.label}
              </div>
              <ChevronRight size={14} className="text-[#292828]/20 group-hover:text-[#E53935] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#292828]/5 space-y-4">
          <Link href="/settings" onClick={onClose} className="flex items-center gap-4 px-4 py-2 text-sm font-bold text-slate-500 hover:text-[#292828] transition-colors">
            <Settings size={18} /> Settings
          </Link>
          <button className="flex items-center gap-4 px-4 py-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors w-full text-left">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
