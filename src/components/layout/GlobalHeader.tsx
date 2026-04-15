"use client";

import React from "react";
import Link from "next/link";
import { Search, UserCircle, UserPlus } from "lucide-react";

export default function GlobalHeader() {
  return (
    <div className="h-20 px-8 flex items-center justify-between border-b border-[#F2F5F7]">
      {/* Brand Section */}
      <div className="flex items-center w-[260px]">
        <Link href="/home" className="flex items-center">
           <img src="/logo.png" alt="CheckOut" className="h-10 object-contain" />
        </Link>
      </div>
      
      {/* Search Module */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search"
            className="search-pill placeholder:text-[#5F6368]"
          />
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-[#5F6368]" size={18} />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex-shrink-0 flex items-center gap-4 cursor-pointer hover:bg-[#F2FBFF] p-2 px-4 rounded-2xl transition-all border border-transparent hover:border-blue-100">
        <div className="text-right hidden sm:block">
           <p className="text-[13px] font-bold text-[#202124] leading-tight mb-0.5">Ahmad Nur Fawaid</p>
           <p className="text-[11px] text-[#5F6368] font-medium tracking-wide">@fawait</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shadow-sm border border-slate-200">
           <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
