"use client";

import React from "react";
import { 
  MessageSquare, 
  Users, 
  Bell, 
  ChevronDown,
  Search,
  Zap,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UnifiedTopbarProps {
  title?: string;
  children?: React.ReactNode;
}

export default function UnifiedTopbar({ children }: UnifiedTopbarProps) {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [isLocationOpen, setIsLocationOpen] = React.useState(false);
  const locationRef = React.useRef<HTMLDivElement>(null);

  // Click outside for location
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-black/[0.05] flex items-center justify-between px-8 sticky top-0 z-[100] backdrop-blur-xl bg-white/80">
      {/* LEFT SIDE: SEARCH + LOCATION + CONTEXTUAL */}
      <div className="flex items-center gap-8 flex-1">
        <Link href="/home" className="shrink-0 lg:hidden">
           <Zap size={24} className="text-[#E53935]" fill="currentColor" />
        </Link>

        {/* GLOBAL SEARCH */}
        <div className="hidden md:flex max-w-sm w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-[#E53935] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search network..." 
            className="w-full h-11 bg-[#F5F5F7] border border-black/[0.03] rounded-xl pl-12 pr-4 text-[13px] font-bold text-black focus:bg-white focus:border-[#E53935]/20 transition-all outline-none"
          />
        </div>

        {/* LOCATION SELECTOR */}
        <div className="relative hidden sm:block" ref={locationRef}>
          <button 
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-2.5 px-4 h-11 bg-[#F5F5F7] border border-black/[0.03] rounded-xl hover:bg-white hover:border-black/[0.08] hover:shadow-xl hover:shadow-black/5 transition-all group"
          >
            <MapPin size={14} className="text-[#E53935]" />
            <span className="text-[10px] font-black text-black uppercase tracking-widest">{authUser?.location || "Trivandrum"}</span>
            <ChevronDown size={14} className={cn("text-black/20 transition-transform duration-300", isLocationOpen && "rotate-180")} />
          </button>

          {isLocationOpen && (
            <div className="absolute top-[120%] left-0 w-64 bg-white rounded-2xl shadow-4xl border border-black/[0.05] p-2 animate-in fade-in slide-in-from-top-2 z-[200]">
              <p className="px-4 py-3 text-[9px] font-black text-black/20 uppercase tracking-widest border-b border-black/[0.03] mb-2">Select Active Region</p>
              {["Kochi", "Bangalore", "Chennai", "Mumbai"].map(loc => (
                <button 
                  key={loc} 
                  onClick={() => setIsLocationOpen(false)}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-[11px] font-black uppercase text-black/40 hover:bg-[#F5F5F7] hover:text-[#E53935] flex items-center justify-between group transition-all"
                >
                  {loc}
                  <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {children && <div className="h-8 w-px bg-black/[0.05] hidden lg:block" />}
        <div className="flex items-center gap-6">
          {children}
        </div>
      </div>

      {/* RIGHT SIDE: ICONS + PROFILE PILL */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/chat" className="h-10 w-10 flex items-center justify-center text-black/40 hover:text-black transition-all">
            <MessageSquare size={22} strokeWidth={1.5} />
          </Link>
          <Link href="/matches" className="h-10 w-10 flex items-center justify-center text-black/40 hover:text-black transition-all">
            <Users size={22} strokeWidth={1.5} />
          </Link>
          <button className="h-10 w-10 flex items-center justify-center text-black/40 hover:text-[#E53935] transition-all relative">
            <Bell size={22} strokeWidth={1.5} />
            <div className="absolute top-2 right-2 h-2 w-2 bg-[#E53935] rounded-full ring-2 ring-white" />
          </button>
        </div>

        <div className="h-8 w-px bg-black/[0.1]" />

        {/* PROFILE PILL */}
        <button 
           onClick={() => router.push(`/profile/${authUser?.id}`)}
           className="flex items-center gap-4 h-14 pl-1.5 pr-6 bg-[#F5F5F7] border border-black/[0.03] rounded-full hover:bg-white hover:border-black/[0.08] hover:shadow-xl hover:shadow-black/5 transition-all group"
        >
           <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-black/5">
              <img src={authUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.full_name}`} className="w-full h-full object-cover" alt="" />
           </div>
           <div className="text-left flex flex-col justify-center hidden sm:flex">
              <p className="text-[14px] font-black uppercase text-black leading-none mb-1 tracking-tight font-outfit">
                {authUser?.full_name?.split(' ')[0] || "USER"}
              </p>
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest leading-none">
                {authUser?.role || "PROFESSIONAL"}
              </p>
           </div>
           <ChevronDown size={18} className="text-black/20 group-hover:text-black transition-colors ml-2 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
