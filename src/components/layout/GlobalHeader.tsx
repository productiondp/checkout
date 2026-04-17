"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Bell, 
  Globe, 
  User as UserIcon, 
  ChevronDown, 
  LogOut, 
  Settings, 
  Zap, 
  Command,
  MapPin,
  CheckCircle2,
  Heart,
  Briefcase,
  ExternalLink,
  Plus,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FullyActiveGlobalHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    <header className="h-14 lg:h-16 bg-white sticky top-0 z-[100] px-4 lg:px-6 flex items-center justify-between border-b border-slate-100 selection:bg-[#E53935]/10">
      
      {/* 1. BRAND & LOCATION (LEFT) */}
      <div className="flex items-center gap-2 lg:gap-4">
        <Link href="/home" className="shrink-0">
           <Image 
             src="/images/logo.png" 
             alt="Logo" 
             width={140} 
             height={32} 
             priority 
             className="object-contain" 
           />
        </Link>
        
        {/* SIMPLE LOCATION SWITCHER */}
        <div className="relative border-l border-slate-100 pl-4 lg:pl-6 ml-0 lg:ml-1 hidden sm:block">
           <button 
             onClick={() => setIsLocationOpen(!isLocationOpen)}
             className="flex items-center gap-1.5 group hover:bg-slate-50 px-2 py-1.5 rounded-xl transition-all"
           >
              <MapPin size={12} className="text-[#E53935]" />
              <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase">Trivandrum</span>
              <ChevronDown size={10} className={cn("text-slate-300 transition-transform", isLocationOpen && "rotate-180")} />
           </button>

           {isLocationOpen && (
             <div className="absolute top-[130%] left-0 lg:left-6 w-56 bg-white rounded-2xl shadow-4xl border border-slate-100 p-3 animate-in fade-in slide-in-from-top-2">
                <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-50 mb-2">Change City</p>
                {["Kochi", "Bangalore", "Chennai"].map(loc => (
                  <button key={loc} className="w-full text-left p-3 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-[#E53935] flex items-center justify-between group transition-all">
                     {loc}
                     <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* 2. RIGHT HUB (ACTIVE BUTTONS) */}
      <div className="flex items-center gap-2 lg:gap-3 flex-1 justify-end">
         
         {/* SEARCH - HIDDEN ON MOBILE HEADER */}
         <div className="hidden md:flex items-center w-full max-w-[280px] relative group h-9">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-full bg-slate-50 border border-slate-100 rounded-lg pl-8 pr-3 text-[12px] font-medium text-slate-900 focus:bg-white focus:border-slate-200 transition-all outline-none"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E53935] transition-colors" />
         </div>

         {/* NOTIFICATIONS & PROFILE */}
         <div className="flex items-center gap-1 border-r border-slate-100 pr-1 lg:pr-3">
            
            {/* NOTIFICATIONS */}
            <div className="relative">
               <button 
                 onClick={() => {
                   setIsNotificationsOpen(!isNotificationsOpen);
                   setIsProfileOpen(false);
                   setIsLocationOpen(false);
                 }}
                 className={cn(
                   "h-9 w-9 flex items-center justify-center rounded-lg transition-all relative font-medium text-slate-500",
                   isNotificationsOpen ? "bg-red-50 text-[#E53935]" : "hover:bg-slate-50 hover:text-slate-950"
                 )}
               >
                  <Bell size={18} />
                  <div className="absolute top-2 right-2 h-1 w-1 bg-[#E53935] rounded-full ring-2 ring-white" />
               </button>

               {isNotificationsOpen && (
                 <div className="absolute top-[130%] right-0 md:right-0 w-[300px] md:w-96 bg-white rounded-3xl shadow-4xl border border-slate-100 p-6 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                       <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                       <button className="text-[11px] font-bold text-[#E53935] uppercase">Clear All</button>
                    </div>
                    <div className="space-y-6 max-h-[360px] overflow-y-auto no-scrollbar pr-1">
                       {[
                         { icon: Heart, color: "text-red-500", bg: "bg-red-50", label: "New Message", desc: "Rahul Sethi liked your partnership request.", time: "2m" },
                         { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50", label: "Account", desc: "Your business profile is verified.", time: "1h" },
                       ].map((n, i) => (
                         <div key={i} className="flex gap-4 group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-2xl transition-all">
                            <div className={cn("h-11 w-11 shrink-0 rounded-xl flex items-center justify-center shadow-sm", n.bg, n.color)}>
                               <n.icon size={20} />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-center mb-0.5">
                                  <h4 className="text-[13px] font-bold text-slate-900">{n.label}</h4>
                                  <span className="text-[10px] font-bold text-slate-400 capitalize">{n.time} ago</span>
                               </div>
                               <p className="text-[12px] font-medium text-slate-500 leading-tight">{n.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
         </div>

         {/* PROFILE */}
         <div className="relative">
            <button 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
                setIsLocationOpen(false);
              }}
              className="flex items-center gap-1.5 lg:gap-2.5 p-0.5 pr-1 lg:pr-3 bg-slate-50 border border-slate-100 rounded-full hover:bg-white hover:shadow-xl hover:shadow-slate-200/20 transition-all transition-duration-300"
            >
               <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                  <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" alt="" />
               </div>
               <ChevronDown size={12} className={cn("text-slate-300 transition-transform duration-500", isProfileOpen && "rotate-180")} />
            </button>

            {isProfileOpen && (
              <div className="absolute top-[130%] right-0 w-64 bg-white rounded-3xl shadow-4xl border border-slate-100 p-3 animate-in fade-in slide-in-from-top-2">
                 <div className="px-4 py-4 mb-2 border-b border-slate-50">
                    <p className="text-[14px] font-bold text-slate-900 leading-tight">Ahmad Fawaid</p>
                    <p className="text-[11px] font-medium text-slate-400 capitalize">Verified Profile</p>
                 </div>
                 <div className="space-y-0.5">
                    {[
                      { icon: UserIcon, label: "My Profile", href: "/profile" },
                      { icon: Zap, label: "Business Activity", href: "#" },
                      { icon: Settings, label: "Settings", href: "#" },
                    ].map(it => (
                      <Link key={it.label} href={it.href} className="w-full flex items-center gap-3 p-3 rounded-2xl text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all">
                         <it.icon size={16} className="text-slate-400 group-hover:text-[#E53935]" />
                         {it.label}
                      </Link>
                    ))}
                    <div className="h-px bg-slate-50 my-2 mx-2" />
                    <button className="w-full flex items-center gap-3 p-3 rounded-2xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all">
                       <LogOut size={16} /> Logout
                    </button>
                 </div>
              </div>
            )}
         </div>

      </div>
    </header>
  );
}
