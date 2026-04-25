"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Check, 
  X, 
  Search, 
  MessageSquare, 
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Clock,
  UserCheck,
  UserX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConnections } from "@/hooks/useConnections";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"Incoming" | "Sent">("Incoming");
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { acceptRequest: contextAccept, ignoreRequest: contextIgnore } = useConnections();
  const supabase = createClient();

  const fetchRequests = async () => {
    if (!user) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from('connections')
      .select(`
        id,
        created_at,
        status,
        sender:profiles!connections_sender_id_fkey (id, full_name, avatar_url, role, location, match_score),
        receiver:profiles!connections_receiver_id_fkey (id, full_name, avatar_url, role, location, match_score)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (data) {
      const incoming = data.filter(r => r.receiver.id === user.id && r.status === 'PENDING');
      const sent = data.filter(r => r.sender.id === user.id);
      setRequests(activeTab === "Incoming" ? incoming : sent);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests();
    if (user) analytics.trackScreen('CONNECTIONS', user.id);
  }, [user, activeTab]);

  const handleAction = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    const { error } = await supabase
      .from('connections')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setRequests(prev => prev.filter(r => r.id !== id));
      if (status === 'ACCEPTED') {
        contextAccept(id);
        analytics.track('CONNECT_ACCEPTED', user?.id, { partnerId: id });
      } else {
        contextIgnore(id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 py-12 px-6 lg:px-10">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
               <h1 className="text-4xl font-black text-[#292828] tracking-tight mb-2 uppercase">Connections</h1>
               <p className="text-slate-400 font-bold text-sm uppercase tracking-tight">Manage your professional network</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-2xl shrink-0 shadow-sm">
               {["Incoming", "Sent"].map((tab: any) => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                     "px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     activeTab === tab ? "bg-white text-[#292828] shadow-sm" : "text-slate-400 hover:text-[#292828]"
                   )}
                 >
                   {tab}
                 </button>
               ))}
            </div>
         </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto px-6 lg:px-10 mt-12">
         {isLoading ? (
            <div className="py-40 text-center animate-pulse">
               <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">Syncing network ledger...</p>
            </div>
         ) : requests.length > 0 ? (
            <div className="space-y-6">
               {requests.map((req) => {
                 const partner = activeTab === "Incoming" ? req.sender : req.receiver;
                 return (
                   <div key={req.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row gap-8 relative overflow-hidden">
                      <div className="h-20 w-20 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 relative group-hover:scale-105 transition-transform duration-500">
                         <img src={partner.avatar_url || "https://i.pravatar.cc/150"} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between mb-4">
                            <div>
                               <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-[#E53935] transition-colors">{partner.full_name}</h3>
                               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{partner.role}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[8px] font-black text-slate-200 uppercase tracking-widest leading-none mb-1">Match Score</p>
                               <p className="text-2xl font-black text-[#E53935] tracking-tighter">{partner.match_score || 90}%</p>
                            </div>
                         </div>
                         
                         {activeTab === "Incoming" && (
                            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-50">
                               <button 
                                 onClick={() => handleAction(req.id, 'ACCEPTED')}
                                 className="flex-1 h-14 bg-[#292828] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E53935] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                               >
                                  Accept <UserCheck size={16} />
                               </button>
                               <button 
                                 onClick={() => handleAction(req.id, 'REJECTED')}
                                 className="h-14 px-8 border border-slate-100 text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-red-500 hover:border-red-500 transition-all"
                               >
                                  Ignore
                               </button>
                            </div>
                         )}

                         {activeTab === "Sent" && (
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                               <div className="flex items-center gap-2 text-slate-400">
                                  <Clock size={14} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Status: {req.status}</span>
                               </div>
                               <button className="h-10 px-6 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-[#292828] transition-all">Cancel</button>
                            </div>
                         )}
                      </div>
                   </div>
                 );
               })}
            </div>
         ) : (
            <div className="py-40 text-center animate-in fade-in zoom-in-95 duration-700 bg-white rounded-[3rem] border border-dashed border-slate-100">
               <div className="h-20 w-20 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-200 mb-8">
                  {activeTab === "Incoming" ? <ArrowDownLeft size={32} /> : <ArrowUpRight size={32} />}
               </div>
               <h3 className="text-xl font-black text-[#292828] uppercase tracking-tight mb-2">No {activeTab} Requests</h3>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">The network ledger is currently empty.</p>
            </div>
         )}
      </main>
    </div>
  );
}
