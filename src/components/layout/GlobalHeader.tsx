"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ChevronDown } from "lucide-react";

export default function GlobalHeader() {
  return (
    <div className="h-14 lg:h-16 px-4 lg:px-6 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 left-0 right-0 z-[1000] shadow-sm">
      {/* Location & Brand Section */}
      <div className="flex flex-col items-start w-auto lg:w-[240px] flex-shrink-0">
        <div className="lg:hidden flex items-center gap-1 mb-0.5">
           <MapPin size={12} className="text-[#E53935]" />
           <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">Technopark, Trivandrum</span>
           <ChevronDown size={10} className="text-slate-400" />
        </div>
        <Link href="/home" className="flex items-center group">
           <div className="h-8 lg:h-12 w-32 lg:w-56 relative overflow-hidden flex items-center">
              <img src="/images/logo.png" alt="Checkout Logo" className="h-full object-contain group-hover:scale-105 transition-transform" />
           </div>
        </Link>
      </div>
      
      {/* Search Module */}
      <div className="flex-1 max-w-lg hidden md:block px-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for people and businesses..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-6 text-[13px] font-medium text-slate-700 focus:bg-white transition-all outline-none shadow-inner"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer p-1.5 px-3 rounded-xl hover:bg-slate-50 transition-all">
        <div className="text-right hidden sm:block">
           <p className="text-[12px] font-bold text-slate-900 leading-tight">Fawaid Ahmad</p>
           <p className="text-[9px] text-[#E53935] font-medium uppercase tracking-normal">Verified Member</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
           <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=64&auto=format&fit=crop" className="w-full h-full object-cover" alt="User" />
        </div>
      </div>
    </div>
  );
}
