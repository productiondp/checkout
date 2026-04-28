"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/utils/constants";
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
  ArrowRight,
  Menu,
  GraduationCap,
  Users,
  MessageSquare,
  Calendar,
  BarChart3
} from "lucide-react";
import MobileDrawer from "./MobileDrawer";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/contexts/NotificationContext";

export default function FullyActiveGlobalHeader() {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const { unreadMessagesCount, pendingRequestsCount } = useNotifications();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const supabase = createClient();
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // 0. CLICK OUTSIDE HANDLER
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. NOTIFICATIONS INITIAL FETCH
  React.useEffect(() => {
    async function fetchNotifications() {
      if (!authUser) return;
      
      const { data: notes } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (notes) {
        setNotifications(notes);
      }
    }
    fetchNotifications();

    const handleProfileUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [authUser]);

  // 2. REAL-TIME SUBSCRIPTION
  React.useEffect(() => {
    if (!authUser) return;

    const channel = supabase
      .channel(`user_notes_${authUser.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${authUser.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUser]);

  const markAllAsRead = async () => {
    if (!authUser) return;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', authUser.id);
  };

  const getNotificationContent = (n: any) => {
    const actorName = n.actor?.full_name || "Someone";
    if (n.type === 'connection_request') return `${actorName} sent you a connection request`;
    if (n.type === 'connection_accepted') return `${actorName} accepted your request`;
    return n.message || "New activity in your network";
  };

  return (
    <>
      <header className="h-16 lg:h-20 bg-white sticky top-0 z-[100] px-4 lg:px-6 flex items-center justify-between border-b border-[#292828]/10 selection:bg-[#E53935]/10">
        
        {/* 1. BRAND & LOCATION (LEFT) */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden h-10 w-10 flex items-center justify-center text-[#292828] hover:bg-[#292828]/5 rounded-lg transition-all active:scale-95"
          >
            <Menu size={24} />
          </button>

          <Link href="/home" className="shrink-0">
            <Image 
              src="/images/logo.png" 
              alt="Logo" 
              width={150} 
              height={35} 
              priority 
              className="h-10 lg:h-12 w-auto object-contain" 
            />
          </Link>
        </div>

        {/* 2. RIGHT HUB (ACTIVE BUTTONS) */}
        <div className="flex items-center gap-2 lg:gap-3 justify-end flex-1">
          
          {/* RIGHT ALIGNED SEARCH */}
          <div className="hidden md:flex max-w-[280px] w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#292828]/20 group-focus-within:text-[#E53935] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-10 bg-[#292828]/5 border border-[#292828]/10 rounded-lg pl-11 pr-4 text-[13px] font-bold text-[#292828] focus:bg-white focus:border-[#E53935] transition-all outline-none shadow-sm"
            />
          </div>
          
          <div className="relative hidden sm:block" ref={locationRef}>
            <button 
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1.5 px-4 h-9 bg-[#292828]/5 border border-[#292828]/10 rounded-md hover:bg-white hover:shadow-lg transition-all"
            >
              <MapPin size={12} className="text-[#E53935]" />
              <span className="text-[10px] font-bold text-[#292828] uppercase">Trivandrum</span>
              <ChevronDown size={10} className={cn("text-[#292828]/40 transition-transform", isLocationOpen && "rotate-180")} />
            </button>

            {isLocationOpen && (
              <div className="absolute top-[130%] right-0 w-56 bg-white rounded-lg shadow-4xl border border-[#292828]/10 p-3 animate-in fade-in slide-in-from-top-2 z-[200]">
                <p className="px-3 py-2 text-[10px] font-bold text-[#292828]/30 uppercase border-b border-[#292828]/5 mb-2">Choose your city</p>
                {["Kochi", "Bangalore", "Chennai"].map(loc => (
                  <button 
                    key={loc} 
                    onClick={() => setIsLocationOpen(false)}
                    className="w-full text-left p-3 rounded-lg text-[11px] font-bold uppercase text-[#292828] hover:bg-[#292828]/5 hover:text-[#E53935] flex items-center justify-between group transition-all"
                  >
                    {loc}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* NOTIFICATIONS & PROFILE */}
          <div className="flex items-center gap-1 border-r border-[#292828]/10 pr-1 lg:pr-3">
            
            {/* CHAT BUBBLE */}
            <Link 
              href="/chat"
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-lg transition-all relative font-medium text-[#292828] hover:bg-[#292828]/5"
              )}
            >
              <MessageSquare size={18} />
              {unreadMessagesCount > 0 && (
                <div className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 bg-[#E53935] rounded-full ring-2 ring-white flex items-center justify-center text-[8px] font-black text-white">
                  {unreadMessagesCount}
                </div>
              )}
            </Link>

            {/* CONNECTIONS HUB */}
            <Link 
              href="/matches"
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-lg transition-all relative font-medium text-[#292828] hover:bg-[#292828]/5"
              )}
            >
              <Users size={18} />
              {pendingRequestsCount > 0 && (
                <div className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 bg-[#34C759] rounded-full ring-2 ring-white flex items-center justify-center text-[8px] font-black text-white">
                  {pendingRequestsCount}
                </div>
              )}
            </Link>

            {/* NOTIFICATIONS */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                  setIsLocationOpen(false);
                }}
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-lg transition-all relative font-medium text-[#292828]",
                  isNotificationsOpen ? "bg-red-50 text-[#E53935]" : "hover:bg-[#292828]/5 hover:text-[#292828]"
                )}
              >
                <Bell size={18} />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-[#E53935] rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute top-[130%] right-0 md:right-0 w-[300px] md:w-96 bg-white rounded-lg shadow-4xl border border-[#292828]/10 p-6 animate-in fade-in slide-in-from-top-2 z-[200]">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#292828]/5">
                    <h3 className="text-lg font-bold text-[#292828]">Alerts</h3>
                    <button onClick={() => markAllAsRead()} className="text-[11px] font-bold text-[#E53935] uppercase">Clear</button>
                  </div>
                  <div className="space-y-6 max-h-[360px] overflow-y-auto no-scrollbar pr-1">
                    {notifications.map((n, i) => (
                      <div 
                        key={n.id || i} 
                        onClick={() => {
                          if (n.type?.startsWith('connection')) router.push('/matches');
                          else if (n.link) router.push(n.link);
                          setIsNotificationsOpen(false);
                        }}
                        className="flex gap-4 group cursor-pointer hover:bg-[#292828]/5 p-2 -mx-2 rounded-lg transition-all"
                      >
                        <div className={cn(
                          "h-11 w-11 shrink-0 rounded-lg flex items-center justify-center shadow-sm", 
                          n.read ? "bg-slate-50 text-slate-400" : "bg-red-50 text-red-500"
                        )}>
                          <Zap size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <h4 className="text-[13px] font-bold text-[#292828]">
                              {n.type === 'connection_request' ? "New Request" : 
                               n.type === 'connection_accepted' ? "Connection Accepted" : 
                               n.title || "Update"}
                            </h4>
                            <span className="text-[10px] font-bold text-[#292828] capitalize">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[12px] font-medium text-[#292828] leading-tight">
                            {getNotificationContent(n)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="text-center py-10 opacity-20 italic">Nothing here yet</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>
            {!authUser ? (
               <Link 
                 href="/"
                 className="h-10 px-6 bg-[#292828] text-white rounded-[8px] text-[11px] font-black uppercase  flex items-center justify-center hover:bg-[#E53935] transition-all active:scale-95 shadow-xl shadow-black/5"
               >
                 Sign In
               </Link>
            ) : (
              <>
                <button 
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsProfileOpen(prev => !prev);
                    setIsNotificationsOpen(false);
                    setIsLocationOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-1 pr-4 rounded-full transition-all duration-300 border relative z-[101]",
                    isProfileOpen 
                      ? "bg-white border-[#292828]/10 shadow-2xl shadow-black/5 scale-[1.02]" 
                      : "bg-[#292828]/5 border-transparent hover:bg-white hover:border-[#292828]/10 hover:shadow-xl hover:shadow-black/5"
                  )}
                >
                  <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                    <img src={authUser?.avatar_url || DEFAULT_AVATAR} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[11px] font-black text-[#292828] leading-none mb-0.5 uppercase ">
                      {authUser?.full_name?.split(' ')[0] || "User"}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 leading-none uppercase  italic">
                      {authUser?.role || "Member"}
                    </p>
                  </div>
                  <ChevronDown size={14} className={cn("text-[#292828]/30 transition-transform duration-500", isProfileOpen && "rotate-180")} />
                </button>

                {isProfileOpen && (
                  <div className="absolute top-[120%] right-0 w-72 bg-white rounded-[15px] shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-[#292828]/5 p-2 animate-in fade-in slide-in-from-top-4 z-[200]">
                    <div className="px-5 py-5 mb-2 bg-slate-50/50 rounded-[12px] border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="h-10 w-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                            <img src={authUser?.avatar_url || DEFAULT_AVATAR} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div>
                            <p className="text-[14px] font-black text-[#292828] uppercase leading-none mb-1">{authUser?.full_name || "Profile"}</p>
                            <div className="flex items-center gap-1.5">
                               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                               <p className="text-[9px] font-black text-slate-400 uppercase  italic">{authUser?.role || "Verified Profile"}</p>
                            </div>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                         <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
                            <p className="text-[7px] font-black text-slate-300 uppercase leading-none mb-1">Match Score</p>
                            <p className="text-[12px] font-black text-emerald-600 leading-none">98%</p>
                         </div>
                         <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
                            <p className="text-[7px] font-black text-slate-300 uppercase leading-none mb-1">Rank</p>
                            <p className="text-[12px] font-black text-[#292828] leading-none truncate uppercase ">{authUser?.role?.split(' ')[0] || "Alpha"}</p>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      {[
                        { icon: UserIcon, label: "View Profile", href: "/profile" },
                        { icon: MessageSquare, label: "Network Messages", href: "/chat" },
                        { icon: Globe, label: "Global Directory", href: "/matches" },
                        { icon: Calendar, label: "Strategic Events", href: "/matches" },
                        { icon: BarChart3, label: "Network Stats", href: "/admin" },
                        { icon: Settings, label: "System Settings", href: "/settings" },
                      ].map(it => (
                        <Link 
                          key={it.label} 
                          href={it.href} 
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-3.5 p-3 rounded-[10px] text-[12px] font-black uppercase  text-slate-500 hover:bg-[#292828] hover:text-white transition-all group"
                        >
                          <it.icon size={16} className="text-[#292828]/40 group-hover:text-white" />
                          {it.label}
                        </Link>
                      ))}
                      
                      <div className="h-px bg-slate-100 my-2 mx-3" />
                      
                      <button 
                        onClick={async (e) => {
                          e.preventDefault();
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3.5 p-4 rounded-[10px] text-[12px] font-black uppercase  text-red-500 hover:bg-red-50 transition-all text-left"
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </header>
      
      <MobileDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        user={authUser}
      />
    </>
  );
}
