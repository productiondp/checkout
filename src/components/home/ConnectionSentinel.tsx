"use client";

import React, { useState, useEffect } from "react";
import { 
   UserCheck, 
   UserX, 
   Zap, 
   ArrowRight, 
   Building,
   CheckCircle2,
   XCircle,
   User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function ConnectionSentinel() {
   const { user } = useAuth();
   const [requests, setRequests] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const supabase = createClient();

   const fetchRequests = async () => {
      if (!user) return;

      const { data } = await supabase
         .from('connections')
         .select(`
            id,
            created_at,
            sender:profiles!connections_sender_id_fkey (id, full_name, avatar_url, role, location, match_score)
         `)
         .eq('receiver_id', user.id)
         .eq('status', 'PENDING');

      if (data) {
         const flattened = data.map(r => ({
            ...r,
            sender: Array.isArray(r.sender) ? r.sender[0] : r.sender
         }));
         setRequests(flattened);
      }
      setIsLoading(false);
   };

   useEffect(() => {
      fetchRequests();
      // Real-time subscription for new requests
      const channel = supabase
         .channel('new_connections')
         .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'connections' }, fetchRequests)
         .subscribe();
      
      return () => { supabase.removeChannel(channel); };
   }, []);

   const handleAction = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
      const { error } = await supabase
         .from('connections')
         .update({ status })
         .eq('id', id);

      if (!error) {
         setRequests(prev => prev.filter(r => r.id !== id));
         if (status === 'ACCEPTED') {
            window.dispatchEvent(new Event('chat-unlocked'));
         }
      }
   };

   if (isLoading || requests.length === 0) return null;

   return (
      <section className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden p-8 animate-in slide-in-from-right duration-500">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-sm font-black text-[#292828] uppercase tracking-tight">Connection <span className="text-[#E53935]">Requests</span></h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{requests.length} people waiting</p>
            </div>
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#E53935] animate-pulse">
               <Zap size={18} fill="currentColor" />
            </div>
         </div>

         <div className="space-y-4">
            {requests.map((req) => (
               <div key={req.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-[#E53935]/20 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="h-12 w-12 rounded-xl bg-white overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center text-slate-300">
                        {req.sender.avatar_url ? (
                           <img src={req.sender.avatar_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                           <User size={20} />
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-black text-[#292828] uppercase truncate">{req.sender.full_name}</h4>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-bold text-slate-400 uppercase">{req.sender.role}</span>
                           <span className="text-[9px] font-black text-[#E53935]">{req.sender.match_score}% MATCH SCORE</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <button 
                        onClick={() => handleAction(req.id, 'ACCEPTED')}
                        className="flex-1 h-10 bg-[#292828] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                     >
                        <UserCheck size={14} /> Accept
                     </button>
                     <button 
                        onClick={() => handleAction(req.id, 'REJECTED')}
                        className="w-10 h-10 bg-white border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                     >
                        <UserX size={14} />
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}
