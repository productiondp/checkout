"use client";

import React, { useState } from "react";
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
 MessageSquare
} from "lucide-react";
import MobileDrawer from "./MobileDrawer";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function FullyActiveGlobalHeader() {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const supabase = createClient();

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
        setUnreadCount(notes.filter(n => !n.is_read).length);
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
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUser]);

  const markAllAsRead = async () => {
    if (!authUser) return;
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', authUser.id);
  };

  return (
    <>
      <header className="h-16 lg:h-20 bg-white sticky top-0 z-[100] px-4 lg:px-6 flex items-center justify-between border-b border-[#292828]/10 selection:bg-[#E53935]/10">
        
        {/* 1. BRAND & LOCATION (LEFT) */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden h-10 w-10 flex items-center justify-center text-[#292828] hover:bg-[#292828]/5 rounded-xl transition-all active:scale-95"
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
              className="w-full h-10 bg-[#292828]/5 border border-[#292828]/10 rounded-xl pl-11 pr-4 text-[13px] font-bold text-[#292828] focus:bg-white focus:border-[#E53935] transition-all outline-none shadow-sm"
            />
          </div>
          
          <div className="relative hidden sm:block">
            <button 
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1.5 px-4 h-9 bg-[#292828]/5 border border-[#292828]/10 rounded-lg hover:bg-white hover:shadow-lg transition-all"
            >
              <MapPin size={12} className="text-[#E53935]" />
              <span className="text-[10px] font-bold text-[#292828] uppercase">Trivandrum</span>
              <ChevronDown size={10} className={cn("text-[#292828]/40 transition-transform", isLocationOpen && "rotate-180")} />
            </button>

            {isLocationOpen && (
              <div className="absolute top-[130%] right-0 w-56 bg-white rounded-2xl shadow-4xl border border-[#292828]/10 p-3 animate-in fade-in slide-in-from-top-2 z-[200]">
                <p className="px-3 py-2 text-[10px] font-bold text-[#292828]/30 uppercase border-b border-[#292828]/5 mb-2">Select Hub</p>
                {["Kochi", "Bangalore", "Chennai"].map(loc => (
                  <button key={loc} className="w-full text-left p-3 rounded-xl text-[11px] font-bold uppercase text-[#292828] hover:bg-[#292828]/5 hover:text-[#E53935] flex items-center justify-between group transition-all">
                    {loc}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link 
            href="/wallet"
            className="hidden lg:flex flex-col items-center justify-center px-4 h-12 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-all group"
          >
             <div className="flex items-center gap-2">
                <Zap size={14} className="text-emerald-600 fill-emerald-600" />
                <span className="text-[11px] font-black text-emerald-700">₹0</span>
             </div>
             <span className="text-[7px] font-bold text-emerald-600/60 uppercase tracking-widest mt-0.5">Your Wallet</span>
          </Link>

          {/* NOTIFICATIONS & PROFILE */}
          <div className="flex items-center gap-1 border-r border-[#292828]/10 pr-1 lg:pr-3">
            
            {/* NOTIFICATIONS */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                  setIsLocationOpen(false);
                  if (!isNotificationsOpen && unreadCount > 0) markAllAsRead();
                }}
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-lg transition-all relative font-medium text-[#292828]",
                  isNotificationsOpen ? "bg-red-50 text-[#E53935]" : "hover:bg-[#292828]/5 hover:text-[#292828]"
                )}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-[#E53935] rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute top-[130%] right-0 md:right-0 w-[300px] md:w-96 bg-white rounded-3xl shadow-4xl border border-[#292828]/10 p-6 animate-in fade-in slide-in-from-top-2 z-[200]">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#292828]/5">
                    <h3 className="text-lg font-bold text-[#292828]">Notifications</h3>
                    <button onClick={() => markAllAsRead()} className="text-[11px] font-bold text-[#E53935] uppercase">Clear All</button>
                  </div>
                  <div className="space-y-6 max-h-[360px] overflow-y-auto no-scrollbar pr-1">
                    {notifications.map((n, i) => (
                      <div 
                        key={n.id || i} 
                        onClick={() => {
                          if (n.link) router.push(n.link);
                          setIsNotificationsOpen(false);
                        }}
                        className="flex gap-4 group cursor-pointer hover:bg-[#292828]/5 p-2 -mx-2 rounded-2xl transition-all"
                      >
                        <div className={cn(
                          "h-11 w-11 shrink-0 rounded-xl flex items-center justify-center shadow-sm", 
                          n.is_read ? "bg-slate-50 text-slate-400" : "bg-red-50 text-red-500"
                        )}>
                          <Zap size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <h4 className="text-[13px] font-bold text-[#292828]">{n.title}</h4>
                            <span className="text-[10px] font-bold text-[#292828] capitalize">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[12px] font-medium text-[#292828] leading-tight">{n.message}</p>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="text-center py-10 opacity-20 italic">No alerts found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PROFILE */}
          <div className="relative">
            <Link 
              href="/profile"
              className="flex items-center gap-1.5 lg:gap-2.5 p-0.5 pr-1 lg:pr-3 bg-[#292828]/5 border border-[#292828]/10 rounded-full hover:bg-white hover:shadow-xl hover:shadow-slate-200/20 transition-all transition-duration-300"
            >
              <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                <img src={authUser?.avatar_url || DEFAULT_AVATAR} className="w-full h-full object-cover" alt="" />
              </div>
              <div 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                  setIsLocationOpen(false);
                }}
                className="flex items-center"
              >
                <ChevronDown size={12} className={cn("text-[#292828]/40 transition-transform duration-500", isProfileOpen && "rotate-180")} />
              </div>
            </Link>

            {isProfileOpen && (
              <div className="absolute top-[130%] right-0 w-64 bg-white rounded-3xl shadow-4xl border border-[#292828]/10 p-3 animate-in fade-in slide-in-from-top-2 z-[200]">
                <div className="px-4 py-4 mb-2 border-b border-[#292828]/5">
                  <p className="text-[14px] font-bold text-[#292828] leading-tight">{authUser?.full_name || "Member"}</p>
                  <p className="text-[11px] font-medium text-[#292828] capitalize">{authUser?.role || "Verified Partner"}</p>
                </div>
                <div className="space-y-0.5">
                  {[
                    { icon: UserIcon, label: "My Profile", href: "/profile" },
                    { icon: Globe, label: "Directory", href: "/matches" },
                    { icon: GraduationCap, label: "Advisors", href: "/advisors" },
                    { icon: Zap, label: "Wallet", href: "/wallet" },
                    { icon: Settings, label: "Settings", href: "/settings" },
                  ].map(it => (
                    <Link key={it.label} href={it.href} className="w-full flex items-center gap-3 p-3 rounded-2xl text-[13px] font-medium text-slate-700 hover:bg-[#292828]/5 hover:text-[#292828] transition-all">
                      <it.icon size={16} className="text-[#292828] group-hover:text-[#E53935]" />
                      {it.label}
                    </Link>
                  ))}
                  <div className="h-px bg-[#292828]/5 my-2 mx-2" />
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const { error } = await supabase.auth.signOut();
                        if (error) throw error;
                        // Hard purge and redirect
                        window.localStorage.clear();
                        window.location.href = "/login";
                      } catch (err) {
                        console.error("Logout Protocol Failure:", err);
                        window.location.href = "/login";
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all text-left"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
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
