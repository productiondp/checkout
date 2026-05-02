"use client";

import React from "react";
import { 
  MessageSquare, 
  Users, 
  Bell, 
  ChevronDown,
  Search,
  Zap,
  MapPin,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useNotifications } from "@/contexts/NotificationContext";

interface UnifiedTopbarProps {
  title?: string;
  children?: React.ReactNode;
}

export default function UnifiedTopbar({ children }: UnifiedTopbarProps) {
  const { profile: authUser, logout } = useAuth();
  const { unreadMessagesCount, pendingRequestsCount } = useNotifications();
  const router = useRouter();
  const supabase = createClient();

  const [isLocationOpen, setIsLocationOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);

  const locationRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Notifications Logic
  React.useEffect(() => {
    if (!authUser) return;

    async function fetchNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setNotifications(data);
    }
    fetchNotifications();

    const channel = supabase
      .channel(`topbar_notes_${authUser.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${authUser.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [authUser]);

  const markAllAsRead = async () => {
    if (!authUser) return;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', authUser.id);
  };

  // Click outside handlers
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="h-16 lg:h-20 bg-white border-b border-black/[0.05] flex items-center justify-between px-4 lg:px-8 px-safe sticky top-0 z-[100] backdrop-blur-xl bg-white/80">
      {/* LEFT SIDE: SEARCH + LOCATION + CONTEXTUAL */}
      <div className="flex items-center gap-2 lg:gap-8 flex-1 min-w-0">
        <Link href="/home" className="shrink-0 lg:hidden">
           <Zap size={28} className="text-[#E53935]" fill="currentColor" />
        </Link>

        {/* GLOBAL SEARCH - Now Responsive */}
        <div className={cn(
          "flex-1 max-w-sm relative group transition-all duration-300",
          isSearchOpen ? "flex fixed inset-x-0 top-0 h-16 bg-white z-[210] px-4 items-center animate-in slide-in-from-top" : "hidden lg:flex"
        )}>
          <Search className="absolute left-8 lg:left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#E53935] transition-colors" size={16} />
          <input 
            autoFocus={isSearchOpen}
            type="text" 
            placeholder="Search network..." 
            className="w-full h-11 lg:h-11 bg-[#F5F5F7] border border-black/[0.03] rounded-xl pl-12 pr-4 text-[13px] font-bold text-black focus:bg-white focus:border-[#E53935]/20 transition-all outline-none"
          />
          {isSearchOpen && (
            <button onClick={() => setIsSearchOpen(false)} className="ml-4 text-[10px] font-black text-gray-400">Cancel</button>
          )}
        </div>

        {/* CONTEXTUAL FILTERS - Horizontal Scroll on Mobile */}
        <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar mask-fade-right lg:mask-none py-1">
           <div className="flex items-center justify-end gap-2 lg:gap-3 whitespace-nowrap px-1">
              {children}
           </div>
        </div>

        {/* MOBILE SEARCH TOGGLE */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="h-10 w-10 flex lg:hidden items-center justify-center text-black/40 hover:text-black transition-all"
        >
          <Search size={20} />
        </button>

        {/* LOCATION SELECTOR */}
        <div className="relative block" ref={locationRef}>
          <button 
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-2.5 px-3 lg:px-4 h-11 bg-[#F5F5F7] border border-black/[0.03] rounded-xl hover:bg-white hover:border-black/[0.08] hover:shadow-xl hover:shadow-black/5 transition-all group"
          >
            <MapPin size={14} className="text-[#E53935]" />
            <span className="text-[10px] font-bold text-black tracking-widest hidden md:inline">{authUser?.location || "Trivandrum"}</span>
            <ChevronDown size={14} className={cn("text-black/20 transition-transform duration-300", isLocationOpen && "rotate-180")} />
          </button>

          {isLocationOpen && (
            <div className="absolute top-[120%] left-0 w-64 bg-white rounded-2xl shadow-4xl border border-black/[0.05] p-2 animate-in fade-in slide-in-from-top-2 z-[200]">
              <p className="px-4 py-3 text-[10px] font-bold text-black/20 tracking-widest border-b border-black/[0.03] mb-2">Select active region</p>
              {["Kochi", "Bangalore", "Chennai", "Mumbai"].map(loc => (
                <button 
                  key={loc} 
                  onClick={() => setIsLocationOpen(false)}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-[12px] font-bold text-black/40 hover:bg-[#F5F5F7] hover:text-[#E53935] flex items-center justify-between group transition-all"
                >
                  {loc}
                  <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: ICONS + PROFILE PILL */}
      <div className="flex items-center gap-2 lg:gap-6 shrink-0">
        <div className="flex items-center gap-1 lg:gap-2">
          <Link href="/chat" className="h-10 w-10 flex items-center justify-center text-black/40 hover:text-black transition-all relative hidden sm:flex">
            <MessageSquare size={20} strokeWidth={1.5} />
            {unreadMessagesCount > 0 && (
               <div className="absolute top-2 right-2 h-4 min-w-[16px] px-1 bg-[#E53935] rounded-full flex items-center justify-center text-[8px] font-bold text-white ring-2 ring-white">
                 {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
               </div>
            )}
          </Link>
          <Link href="/matches" className="h-10 w-10 flex items-center justify-center text-black/40 hover:text-black transition-all relative hidden sm:flex">
            <Users size={20} strokeWidth={1.5} />
            {pendingRequestsCount > 0 && (
               <div className="absolute top-2 right-2 h-2 w-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            )}
          </Link>
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "h-10 w-10 flex items-center justify-center transition-all relative",
                isNotificationsOpen ? "text-[#E53935]" : "text-black/40 hover:text-[#E53935]"
              )}
            >
              <Bell size={20} strokeWidth={1.5} />
              {notifications.filter(n => !n.is_read).length > 0 && (
                <div className="absolute top-2 right-2 h-2 w-2 bg-[#E53935] rounded-full ring-2 ring-white" />
              )}
            </button>

            {isNotificationsOpen && (
               <div className="absolute top-[120%] right-[-10px] lg:right-0 w-[calc(100vw-32px)] lg:w-80 bg-white rounded-2xl shadow-4xl border border-black/[0.05] p-4 animate-in fade-in slide-in-from-top-2 z-[200]">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.03]">
                     <h3 className="text-[11px] font-bold tracking-widest text-black">Notifications</h3>
                     <button onClick={markAllAsRead} className="text-[10px] font-bold text-[#E53935]">Clear</button>
                  </div>
                  <div className="space-y-3 max-h-[320px] overflow-y-auto no-scrollbar">
                     {notifications.map((n, i) => (
                        <div key={i} className="flex gap-3 p-2 rounded-xl hover:bg-[#F5F5F7] transition-all cursor-pointer group">
                           <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", n.is_read ? "bg-black/[0.03] text-black/20" : "bg-red-50 text-[#E53935]")}>
                              <Zap size={18} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-bold text-black leading-tight mb-1">{n.message || "New activity in network"}</p>
                              <p className="text-[10px] font-bold text-black/20 tracking-tight">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                           </div>
                        </div>
                     ))}
                     {notifications.length === 0 && (
                        <div className="py-8 text-center text-[10px] font-bold text-black/10 italic">No new alerts</div>
                     )}
                  </div>
               </div>
            )}
          </div>
        </div>

        <div className="h-8 w-px bg-black/[0.1] hidden sm:block" />

        {/* PROFILE PILL */}
        <div className="relative" ref={profileRef}>
           <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={cn(
                "flex items-center gap-3 lg:gap-4 h-10 lg:h-14 pl-1 lg:pl-1.5 pr-1 lg:pr-6 bg-[#F5F5F7] lg:bg-[#F5F5F7] border border-black/[0.03] rounded-full hover:bg-white hover:border-black/[0.08] hover:shadow-xl hover:shadow-black/5 transition-all group shrink-0",
                isProfileOpen && "bg-white border-black/[0.08] shadow-xl"
              )}
           >
              <div className="h-8 w-8 lg:h-11 lg:w-11 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-black/5">
                 <img src={authUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.full_name}`} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="text-left flex flex-col justify-center hidden lg:flex">
                 <p className="text-[14px] font-bold text-black leading-none mb-1 tracking-tight font-outfit">
                   {authUser?.full_name?.split(' ')[0] || "User"}
                 </p>
                 <p className="text-[9px] font-bold text-slate-400 tracking-widest leading-none">
                   {authUser?.role || "Professional"}
                 </p>
              </div>
              <ChevronDown size={16} className={cn("text-black/20 group-hover:text-black transition-all duration-300 ml-1 hidden lg:block", isProfileOpen && "rotate-180")} />
           </button>

           {isProfileOpen && (
              <div className="absolute top-[120%] right-0 w-64 bg-white rounded-2xl shadow-4xl border border-black/[0.05] p-2 animate-in fade-in slide-in-from-top-2 z-[200]">
                 <div className="px-4 py-3 border-b border-black/[0.03] mb-2">
                    <p className="text-[10px] font-bold text-black tracking-widest">{authUser?.full_name}</p>
                    <p className="text-[9px] font-bold text-slate-400 tracking-widest">{authUser?.email}</p>
                 </div>
                 
                 <button 
                    onClick={() => { router.push(`/profile/${authUser?.id}`); setIsProfileOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[12px] font-bold text-black/40 hover:bg-[#F5F5F7] hover:text-black flex items-center gap-3 group transition-all"
                 >
                    <Users size={16} className="text-[#E53935]" />
                    View Profile
                 </button>
                 
                 <button 
                    onClick={() => { router.push('/profile'); setIsProfileOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[12px] font-bold text-black/40 hover:bg-[#F5F5F7] hover:text-black flex items-center gap-3 group transition-all"
                 >
                    <Settings size={16} className="text-[#E53935]" />
                    Settings
                 </button>

                 <div className="h-px bg-black/[0.03] my-2" />
                 
                 <button 
                    onClick={() => { logout(); setIsProfileOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[12px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 group transition-all"
                 >
                    <LogOut size={16} />
                    Sign Out
                 </button>
              </div>
           )}
        </div>
      </div>
    </header>
  );
}
