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
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConnections } from "@/hooks/useConnections";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"Incoming" | "Sent">("Incoming");
  const { acceptRequest, ignoreRequest: ignoreReq } = useConnections();
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchIncoming = async () => {
    if (!user) return;
    setIsLoading(true);

    const { data } = await supabase
      .from('connections')
      .select(`
        id,
        created_at,
        message,
        sender:profiles!connections_sender_id_fkey (id, full_name, avatar_url, role, match_score)
      `)
      .eq('receiver_id', user.id)
      .eq('status', 'PENDING');

    if (data) {
      const mapped = data.map(r => ({
        id: r.id,
        name: r.sender?.full_name || "Anonymous",
        role: r.sender?.role || "Member",
        match: r.sender?.match_score || 50,
        message: r.message || "Hi! I'd like to connect with you.",
        avatar: r.sender?.avatar_url || "https://ui-avatars.com/api/?name=" + (r.sender?.full_name || "A"),
        senderId: r.sender?.id
      }));
      setIncomingRequests(mapped);
    }
    setIsLoading(false);
  };

  const handleAccept = async (reqId: string, senderId: string) => {
    const { error } = await supabase
      .from('connections')
      .update({ status: 'ACCEPTED' })
      .eq('id', reqId);

    if (!error) {
      setIncomingRequests(prev => prev.filter(r => r.id !== reqId));
      acceptRequest(senderId);
      analytics.track('CONNECT_ACCEPTED', user?.id, { partnerId: senderId });
    }
  };

  const handleIgnore = async (reqId: string) => {
    const { error } = await supabase
      .from('connections')
      .update({ status: 'REJECTED' })
      .eq('id', reqId);

    if (!error) {
      setIncomingRequests(prev => prev.filter(r => r.id !== reqId));
      ignoreReq(reqId);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIncoming();
      analytics.trackScreen('CONNECTIONS', user.id);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 py-12 px-6 lg:px-10">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
               <h1 className="text-4xl font-black text-[#292828] tracking-tight mb-2 uppercase">Connections</h1>
               <p className="text-slate-400 font-bold text-sm uppercase tracking-tight">Manage your network</p>
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
         {activeTab === "Incoming" ? (
           <div className="space-y-6">
              {incomingRequests.map((req) => (
                <div key={req.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row gap-8">
                   <div className="h-20 w-20 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      <img src={req.avatar} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                         <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">{req.name}</h3>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{req.role}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[8px] font-black text-slate-200 uppercase tracking-widest leading-none mb-1">Match Score</p>
                            <p className="text-2xl font-black text-[#E53935] tracking-tighter">{req.match}%</p>
                         </div>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl mb-8 border-l-4 border-[#E53935]">
                         <p className="text-sm font-medium text-slate-500 italic leading-relaxed">"{req.message}"</p>
                      </div>
                      <div className="flex gap-4">
                         <button onClick={() => handleAccept(req.id, req.senderId)} className="flex-1 h-14 bg-[#292828] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E53935] transition-all flex items-center justify-center gap-3">
                            Accept <Check size={16} />
                         </button>
                         <button onClick={() => handleIgnore(req.id)} className="h-14 px-8 border border-slate-100 text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-[#292828] transition-all">
                            Ignore
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
         ) : (
           <div className="py-40 text-center animate-in fade-in zoom-in-95 duration-700">
              <ArrowUpRight size={48} className="mx-auto text-slate-100 mb-6" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No requests sent yet.</p>
           </div>
         )}
      </main>
    </div>
  );
}
