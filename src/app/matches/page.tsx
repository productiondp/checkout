"use client";
export const runtime = 'edge';

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  MessageSquare, 
  Zap,
  CheckCircle2,
  MapPin,
  Loader2,
  MoreHorizontal,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Target,
  Activity,
  Sparkles,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ConnectionService } from "@/services/connection-service";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useConnections } from "@/hooks/useConnections";
import ConnectButton from "@/components/ui/ConnectButton";
import TerminalLayout from "@/components/layout/TerminalLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// --- TYPES ---
type MatchProfile = {
  id: string;
  full_name: string;
  avatar_url: string;
  role: string;
  location: string;
  skills: string[];
  connection_status: 'NONE' | 'PENDING' | 'ACCEPTED';
  updated_at?: string;
  metadata: {
    match_score?: number;
    reasons?: string[];
    checkout_score?: number;
    last_active?: string;
  };
};

export default function MatchesPage() {
  const { user: authUser } = useAuth();
  const { connectionMap, refreshConnections } = useConnections();
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'DISCOVER' | 'REQUESTS' | 'CONNECTED'>('DISCOVER');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All Roles");
  
  const [allProfiles, setAllProfiles] = useState<MatchProfile[]>([]);
  const [stats, setStats] = useState({
    activeCount: 0,
    yourScore: 0,
    dailyGoal: 0,
    partnersCount: 0
  });
  const [confirmAction, setConfirmAction] = useState<{ type: 'REMOVE' | 'BLOCK'; connectionId: string; partnerName: string } | null>(null);

  const initData = async () => {
    if (!authUser) return;
    setIsLoading(true);
    try {
      const { data: profiles } = await supabase.from('profiles').select('*').neq('id', authUser.id);
      const today = new Date();
      today.setHours(0,0,0,0);
      const { count: connectionsToday } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', authUser.id)
        .gte('created_at', today.toISOString());
      const partnersCount = Object.values(connectionMap).filter(s => s === 'ACCEPTED').length;

      if (profiles) {
        const mapped = profiles.map(p => {
          const matchData = calculateProfileMatch(authUser, p);
          return {
            ...p,
            skills: p.skills || [],
            metadata: { 
              ...(p.metadata || {}), 
              match_score: matchData.score, 
              reasons: matchData.reasons,
              last_active: p.updated_at ? `Active ${formatTimeAgo(p.updated_at)}` : 'Recently Active'
            }
          };
        });
        setAllProfiles(mapped);
        const avgScore = mapped.length > 0 ? Math.round(mapped.reduce((acc, p) => acc + (p.metadata.match_score || 0), 0) / mapped.length) : 0;
        setStats({
          activeCount: profiles.length,
          yourScore: authUser.matchScore || avgScore || 85,
          dailyGoal: Math.min(100, Math.round(((connectionsToday || 0) / 5) * 100)),
          partnersCount
        });
      }
    } catch (err) {
      console.error("Data Load Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, [authUser?.id, connectionMap]);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  const calculateProfileMatch = (me: any, other: any) => {
    let score = 55;
    const reasons: string[] = [];
    if (me.role === 'BUSINESS' && other.role === 'PROFESSIONAL') { score += 25; reasons.push("Great business match"); }
    if (me.location === other.location) { score += 15; reasons.push(`Lives in ${me.location}`); }
    const myIntents = me.intents || [];
    const otherSkills = other.skills || [];
    const overlaps = myIntents.filter((s: string) => otherSkills.includes(s));
    if (overlaps.length > 0) { score += (overlaps.length * 8); reasons.push(`${overlaps.length} common goals`); }
    return { score: Math.min(score, 99), reasons };
  };

  const handleAccept = async (connectionId: string) => {
    try {
      await ConnectionService.accept(connectionId);
      await refreshConnections();
    } catch (err) {
      alert("Action failed. Try again.");
    }
  };

  const filteredList = useMemo(() => {
    return allProfiles.filter(p => {
      const matchesSearch = p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.role?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All Roles" || p.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [allProfiles, searchQuery, roleFilter]);

  const discoverList = useMemo(() => 
    filteredList.filter(p => !connectionMap[p.id] || connectionMap[p.id] === 'NONE')
    .sort((a,b) => (b.metadata?.match_score || 0) - (a.metadata?.match_score || 0))
  , [filteredList, connectionMap]);

  const connectedList = useMemo(() => 
    filteredList.filter(p => connectionMap[p.id] === 'ACCEPTED')
  , [filteredList, connectionMap]);

  const [requests, setRequests] = useState<any[]>([]);
  useEffect(() => {
    if (!authUser) return;
    const fetchReqs = async () => {
      const { data } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          sender_id,
          receiver_id,
          sender:profiles!connections_sender_id_fkey (*),
          receiver:profiles!connections_receiver_id_fkey (*)
        `)
        .eq('status', 'PENDING')
        .or(`sender_id.eq.${authUser.id},receiver_id.eq.${authUser.id}`);
      setRequests(data || []);
    };
    fetchReqs();
  }, [authUser?.id, connectionMap]);

  return (
    <ProtectedRoute>
      <TerminalLayout
        topbarChildren={
           <div className="flex items-center gap-6">
              <div className="flex p-1 bg-[#F5F5F7] rounded-[10px] border border-black/[0.03]">
                 {[
                   { id: 'DISCOVER', label: 'Explore', count: discoverList.length },
                   { id: 'REQUESTS', label: 'Requests', count: requests.filter(r => r.receiver_id === authUser?.id).length },
                   { id: 'CONNECTED', label: 'Partners', count: connectedList.length }
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={cn(
                       "px-6 h-9 rounded-[8px] text-[10px] font-black uppercase tracking-widest transition-all relative",
                       activeTab === tab.id ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
                     )}
                   >
                     {tab.label}
                     {tab.id === 'REQUESTS' && tab.count > 0 && (
                       <span className="ml-2 px-1.5 py-0.5 bg-[#E53935] text-white text-[8px] rounded-full">
                         {tab.count}
                       </span>
                     )}
                   </button>
                 ))}
              </div>
           </div>
        }
      >
        <div className="p-8 max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              {[
                 { label: "Active Now", value: stats.activeCount, icon: Activity, color: "text-blue-500" },
                 { label: "Your Score", value: stats.yourScore, icon: Zap, color: "text-amber-500" },
                 { label: "Daily Goal", value: `${stats.dailyGoal}%`, icon: Target, color: "text-[#E53935]" },
                 { label: "Partners", value: stats.partnersCount, icon: ShieldCheck, color: "text-emerald-500" },
              ].map((stat, i) => (
                 <div key={i} className="bg-white border border-black/[0.03] p-5 rounded-[10px] flex items-center justify-between">
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-1">{stat.label}</p>
                       <p className="text-4xl font-black font-outfit">{stat.value}</p>
                    </div>
                    <stat.icon size={24} className={stat.color} />
                 </div>
              ))}
           </div>
  
           {isLoading ? (
              <div className="py-40 flex flex-col items-center gap-8">
                 <div className="relative">
                    <Loader2 className="animate-spin text-[#E53935]" size={48} />
                 </div>
                 <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/20">Loading people...</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <AnimatePresence mode="popLayout">
                 {activeTab === 'DISCOVER' && (
                    discoverList.length > 0 ? (
                       discoverList.map((p, i) => (
                       <PartnerCard key={p.id} partner={p} index={i} setConfirmAction={setConfirmAction} />
                       ))
                    ) : <EmptyState title="All caught up" description="You've seen everyone for now." icon={Sparkles} />
                 )}
  
                 {activeTab === 'REQUESTS' && (
                    <>
                       {requests.filter(r => r.receiver_id === authUser?.id).length > 0 && (
                       <div className="col-span-full space-y-6 mb-12">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20 ml-2">New Requests</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {requests.filter(r => r.receiver_id === authUser?.id).map((req, i) => (
                                <PartnerCard key={req.id} partner={req.sender} index={i} onAction={() => handleAccept(req.id)} actionLabel="Connect" setConfirmAction={setConfirmAction} />
                             ))}
                          </div>
                       </div>
                       )}
                       {requests.filter(r => r.sender_id === authUser?.id).length > 0 && (
                       <div className="col-span-full space-y-6">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20 ml-2">Waiting for response</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                             {requests.filter(r => r.sender_id === authUser?.id).map((req, i) => (
                                <PartnerCard key={req.id} partner={req.receiver} index={i} disabled actionLabel="Waiting" setConfirmAction={setConfirmAction} />
                             ))}
                          </div>
                       </div>
                       )}
                       {requests.length === 0 && (
                       <EmptyState title="No requests" description="Incoming and outgoing requests will appear here." icon={Clock} />
                       )}
                    </>
                 )}
  
                 {activeTab === 'CONNECTED' && (
                    connectedList.length > 0 ? (
                       connectedList.map((p, i) => (
                       <PartnerCard key={p.id} partner={p} index={i} onAction={() => router.push(`/chat?user=${p.id}`)} actionLabel="Chat" variant="connected" setConfirmAction={setConfirmAction} />
                       ))
                    ) : <EmptyState title="No partners yet" description="Start by connecting with people in Explore." icon={Users} />
                 )}
                 </AnimatePresence>
              </div>
           )}
        </div>
  
        <AnimatePresence>
          {confirmAction && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-md bg-white rounded-[10px] p-10 shadow-4xl text-center border border-black/[0.05]">
                <div className={cn("h-20 w-20 rounded-[10px] flex items-center justify-center mx-auto mb-6", confirmAction.type === 'BLOCK' ? "bg-black text-white" : "bg-red-50 text-[#E53935]")}>
                  {confirmAction.type === 'BLOCK' ? <ShieldAlert size={32} /> : <Trash2 size={32} />}
                </div>
                <h3 className="text-2xl font-black text-[#1D1D1F] uppercase leading-none mb-3 font-outfit">{confirmAction.type === 'BLOCK' ? "Block User?" : "Remove Partner?"}</h3>
                <p className="text-black/40 font-bold uppercase text-[10px] tracking-widest mb-8 leading-relaxed">Confirm action for <strong>{confirmAction.partnerName}</strong>.</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmAction(null)} className="flex-1 h-14 bg-[#F5F5F7] rounded-[10px] font-black uppercase text-[10px]">Cancel</button>
                  <button onClick={async () => {
                    if (confirmAction.type === 'BLOCK') await ConnectionService.blockUser(confirmAction.connectionId);
                    else await ConnectionService.removeConnection(confirmAction.connectionId);
                    setConfirmAction(null);
                    window.location.reload();
                  }} className={cn("flex-1 h-14 rounded-[10px] font-black uppercase text-[10px] text-white transition-all", confirmAction.type === 'BLOCK' ? "bg-black" : "bg-[#E53935] shadow-red-500/20")}>Confirm</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </TerminalLayout>
    </ProtectedRoute>
  );
}

function PartnerCard({ partner, index, onAction, actionLabel, disabled, variant, setConfirmAction }: any) {
  const router = useRouter();
  const score = partner.metadata?.match_score || 0;
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group relative bg-white border border-black/[0.03] rounded-[10px] p-6 hover:shadow-xl hover:shadow-black/[0.02] hover:border-black/[0.08] transition-all duration-500 flex flex-col h-full">
      <div className="flex items-start gap-4 mb-8">
        <div onClick={() => router.push(`/profile/${partner.id}`)} className="h-16 w-16 rounded-[10px] overflow-hidden shadow-lg border-2 border-white shrink-0 cursor-pointer relative">
          <img src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.full_name}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
          {variant === 'connected' && <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-[#34C759] text-white rounded-[6px] flex items-center justify-center border-2 border-white"><CheckCircle2 size={12} /></div>}
        </div>
        <div className="min-w-0 pt-1">
          <h4 className="text-[16px] font-black text-[#1D1D1F] truncate uppercase font-outfit mb-0.5">{partner.full_name}</h4>
          <p className="text-[10px] font-black text-[#E53935] uppercase tracking-widest">{partner.role}</p>
          <div className="flex items-center gap-1.5 mt-2 text-black/20"><MapPin size={10} strokeWidth={3} /><span className="text-[9px] font-black uppercase tracking-widest">{partner.metadata?.last_active || "Nearby"}</span></div>
        </div>
      </div>
      <div className="flex-1 space-y-6">
         <div className="flex flex-wrap gap-1.5">{(partner.skills || []).slice(0, 3).map((skill: string) => <span key={skill} className="px-2 py-1 bg-[#F5F5F7] text-black/40 rounded-[6px] text-[8px] font-black uppercase tracking-widest border border-black/[0.02]">{skill}</span>)}</div>
         <div className="p-4 bg-slate-50/50 rounded-[10px] border border-black/[0.02] space-y-3">
            <div className="flex items-center justify-between"><p className="text-[8px] font-black text-black/20 uppercase tracking-widest">Match Score</p><span className="text-4xl font-black text-[#E53935] font-outfit tracking-tighter">{score}%</span></div>
            <div className="space-y-2">{partner.metadata?.reasons?.slice(0, 2).map((reason: string, i: number) => <div key={i} className="flex items-start gap-2 text-[10px] font-bold text-black/60 leading-tight"><div className="h-1 w-1 rounded-full bg-[#E53935] mt-1.5 shrink-0" />{reason}</div>)}</div>
         </div>
      </div>
      <div className="mt-8 pt-6 border-t border-black/[0.03] flex items-center gap-2">
         {onAction ? <button disabled={disabled} onClick={(e) => { e.stopPropagation(); onAction(); }} className={cn("flex-1 h-12 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2", variant === 'connected' ? "bg-black text-white hover:bg-[#E53935]" : disabled ? "bg-black/[0.05] text-black/20 cursor-default shadow-none" : "bg-[#E53935] text-white hover:bg-black shadow-lg shadow-red-500/10")}>{actionLabel}{variant === 'connected' ? <MessageSquare size={14} /> : <Zap size={14} />}</button> : <ConnectButton targetId={partner.id} className="flex-1" />}
         <div className="relative group/menu">
            <button className="h-12 w-12 bg-white border border-black/[0.08] rounded-[10px] flex items-center justify-center text-black/30 hover:text-black transition-all"><MoreHorizontal size={16} /></button>
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-black/[0.08] rounded-[10px] shadow-2xl overflow-hidden opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 p-1">
               <button onClick={async (e) => { e.stopPropagation(); const supabase = createClient(); const { data } = await supabase.from('connections').select('id').or(`and(sender_id.eq.${authUser?.id},receiver_id.eq.${partner.id}),and(sender_id.eq.${partner.id},receiver_id.eq.${authUser?.id})`).maybeSingle(); if (data) setConfirmAction({ type: 'REMOVE', connectionId: data.id, partnerName: partner.full_name }); }} className="w-full h-10 px-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#E53935] hover:bg-red-50 rounded-[6px] transition-all"><Trash2 size={12} /> Remove</button>
               <button onClick={async (e) => { e.stopPropagation(); const supabase = createClient(); const { data } = await supabase.from('connections').select('id').or(`and(sender_id.eq.${authUser?.id},receiver_id.eq.${partner.id}),and(sender_id.eq.${partner.id},receiver_id.eq.${authUser?.id})`).maybeSingle(); if (data) setConfirmAction({ type: 'BLOCK', connectionId: data.id, partnerName: partner.full_name }); }} className="w-full h-10 px-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black hover:bg-slate-50 rounded-[6px] transition-all"><ShieldAlert size={12} /> Block</button>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ title, description, icon: Icon }: any) {
  return (
    <div className="col-span-full py-40 text-center bg-white border border-black/[0.03] rounded-[10px]">
      <div className="h-20 w-20 bg-[#F5F5F7] rounded-[10px] flex items-center justify-center mx-auto mb-6 relative"><Icon size={32} className="text-black/20" /></div>
      <h3 className="text-2xl font-black text-[#1D1D1F] uppercase mb-2 font-outfit">{title}</h3>
      <p className="text-black/40 text-[11px] font-bold uppercase tracking-widest">{description}</p>
    </div>
  );
}


