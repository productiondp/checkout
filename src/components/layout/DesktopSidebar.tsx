"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  MessageSquare, 
  Users, 
  MapPin, 
  Search, 
  LayoutGrid, 
  ShoppingBag, 
  Zap, 
  TrendingUp,
  BrainCircuit,
  Layout,
  Globe,
  ChevronRight,
  Target,
  Activity,
  ShieldCheck,
  Building2,
  UserPlus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [connectionCount, setConnectionCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchCount = async () => {
      const { count } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('status', 'PENDING');
      
      setConnectionCount(count || 0);
    };

    fetchCount();

    const channel = supabase
      .channel('sidebar_connections')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'connections' 
      }, fetchCount)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const navGroups = [
    {
      group: "Directory",
      items: [
        { label: "Feed", icon: Home, href: "/home" },
        { label: "Connections", icon: UserPlus, href: "/connections", badge: connectionCount > 0 ? connectionCount.toString() : null },
        { label: "Chat", icon: MessageSquare, href: "/chat" },
        { label: "Communities", icon: Globe, href: "/communities" },
      ]
    },
    {
      group: "Explore",
      items: [
        { label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
        { label: "Advisors", icon: Target, href: "/advisors" },
        { label: "Directory", icon: Building2, href: "/directory" },
        { label: "Map", icon: Zap, href: "/explore" },
        { label: "Events", icon: LayoutGrid, href: "/events" },
      ]
    }
  ];

  return (
    <aside className="w-[260px] hidden lg:flex flex-col bg-white border-r border-[#292828]/5 h-full sticky top-0 py-10 px-6 overflow-y-auto no-scrollbar selection:bg-[#E53935]/10 z-50">
      
      {/* 1. NAVIGATION GROUPS */}
      <div className="flex-1 space-y-12">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-6">
            <h3 className="px-4 text-[9px] font-black uppercase text-[#292828]/30 tracking-[0.3em] flex items-center justify-between">
              {group.group}
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-4 px-4 h-11 rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive 
                        ? "bg-[#292828] text-white" 
                        : "text-slate-500 hover:text-[#292828] hover:bg-slate-50"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E53935] rounded-r-full" />
                    )}
                    
                    <item.icon 
                      size={18} 
                      className={cn(
                        "transition-all duration-300",
                        isActive ? "text-[#E53935]" : "group-hover:text-[#292828]"
                      )} 
                    />
                    
                    <span className={cn(
                      "text-[12px] font-bold uppercase tracking-tight",
                      isActive ? "text-white" : "text-slate-500"
                    )}>
                      {item.label}
                    </span>
                    
                    {item.badge && (
                      <div className="ml-auto h-5 px-2 rounded-lg bg-[#E53935] text-white text-[9px] font-black flex items-center justify-center shadow-[0_0_15px_rgba(229,57,53,0.3)]">
                        {item.badge}
                      </div>
                    )}

                    {!isActive && (
                      <ChevronRight size={14} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#292828]/20" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>


    </aside>
  );
}
