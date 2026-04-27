"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  MessageSquare, 
  UserPlus, 
  Zap,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Clock,
  CheckCircle2,
  MapPin,
  Award,
  Loader2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ConnectionService } from "@/services/connection-service";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
type MatchProfile = {
  id: string;
  full_name: string;
  avatar_url: string;
  role: string;
  location: string;
  skills: string[];
  connection_status: 'NONE' | 'PENDING' | 'ACCEPTED';
  metadata: {
    match_score?: number;
    reasons?: string[];
    checkout_score?: number;
  };
};

export default function ConnectionsPage() {
  return (
    <ProtectedRoute>
      <ConnectionsContent />
    </ProtectedRoute>
  );
}

function ConnectionsContent() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'DISCOVER' | 'REQUESTS' | 'CONNECTED'>('DISCOVER');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data state
  const [discoverList, setDiscoverList] = useState<MatchProfile[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [connectedList, setConnectedList] = useState<MatchProfile[]>([]);

  const initConnections = async () => {
    if (!authUser) return;
    setIsLoading(true);
    try {
      // 1. Fetch all profiles (except me) and all my connections
      const [profilesRes, connectionsRes] = await Promise.all([
        supabase.from('profiles').select('*').neq('id', authUser.id),
        supabase.from('connections').select('*').or(`sender_id.eq.${authUser.id},receiver_id.eq.${authUser.id}`)
      ]);

      if (profilesRes.data) {
        const connections = connectionsRes.data || [];
        const allProfiles = profilesRes.data;

        // 2. Map profiles with connection status and match score
        const mapped = allProfiles.map(p => {
          const conn = connections.find(c => c.sender_id === p.id || c.receiver_id === p.id);
          let status: 'NONE' | 'PENDING' | 'ACCEPTED' = 'NONE';
          if (conn) {
            status = conn.status === 'ACCEPTED' ? 'ACCEPTED' : 'PENDING';
          }
          const matchData = calculateProfileMatch(authUser, p);
          return {
            ...p,
            skills: p.skills || [],
            connection_status: status,
            metadata: { 
              ...(p.metadata || {}), 
              match_score: matchData.score, 
              reasons: matchData.reasons 
            }
          };
        });

        // 3. Segment data
        setDiscoverList(mapped.filter(p => p.connection_status === 'NONE').sort((a,b) => (b.metadata?.match_score || 0) - (a.metadata?.match_score || 0)));
        setConnectedList(mapped.filter(p => p.connection_status === 'ACCEPTED'));
        
        setIncomingRequests(connections.filter(c => c.receiver_id === authUser.id && c.status === 'PENDING').map(c => ({
          ...c,
          partner: allProfiles.find(p => p.id === c.sender_id)
        })));
        
        setSentRequests(connections.filter(c => c.sender_id === authUser.id && c.status === 'PENDING').map(c => ({
          ...c,
          partner: allProfiles.find(p => p.id === c.receiver_id)
        })));
      }
    } catch (err) {
      console.error("Connection Logic Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initConnections();
  }, [authUser?.id]);

  const calculateProfileMatch = (me: any, other: any) => {
    let score = 50;
    const reasons: string[] = [];
    if (me.role === 'BUSINESS' && other.role === 'PROFESSIONAL') { score += 20; reasons.push("Strategic Partnership Synergy"); }
    if (me.location === other.location) { score += 15; reasons.push(`Regional Proximity (${me.location})`); }
    const myIntents = me.intents || [];
    const otherSkills = other.skills || [];
    const overlaps = myIntents.filter((s: string) => otherSkills.includes(s));
    if (overlaps.length > 0) { score += (overlaps.length * 10); reasons.push(`${overlaps.length} Overlapping Goals`); }
    return { score: Math.min(score, 99), reasons };
  };

  const handleConnect = async (targetId: string) => {
    if (!authUser) return;
    try {
      await ConnectionService.connect(authUser.id, targetId);
      initConnections(); // Refresh
      setActiveTab('REQUESTS');
    } catch (err) {
      alert("Action failed. Try again.");
    }
  };

  const handleAccept = async (connectionId: string) => {
    try {
      await ConnectionService.accept(connectionId);
      initConnections(); // Refresh
      setActiveTab('CONNECTED');
    } catch (err) {
      alert("Action failed. Try again.");
    }
  };

  const searchFilter = (p: MatchProfile) => 
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.role?.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="min-h-screen bg-[#FBFBFD] pb-32">
      {/* 1. CINEMATIC HEADER */}
      <div className="bg-[#1D1D1F] text-white pt-24 pb-20 px-6 lg:px-10 relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E53935]/10 rounded-full blur-[120px] -mr-64 -mt-64" />
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                     <Users size={14} className="text-[#E53935]" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Hub</span>
                  </div>
                  <h1 className="text-6xl font-black uppercase tracking-tighter italic">Connections.</h1>
                  <p className="text-xl font-bold text-white/30 max-w-md">Discover partners and manage your relationships in one place.</p>
               </div>

               <div className="flex p-2 bg-white/5 rounded-[2.5rem] border border-white/10 w-fit">
                  {[
                    { id: 'DISCOVER', label: 'Discover', count: discoverList.length },
                    { id: 'REQUESTS', label: 'Requests', count: incomingRequests.length },
                    { id: 'CONNECTED', label: 'Connected', count: connectedList.length }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "h-14 px-8 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all relative",
                        activeTab === tab.id ? "bg-[#E53935] text-white shadow-xl shadow-[#E53935]/20" : "text-white/40 hover:text-white"
                      )}
                    >
                      {tab.label}
                      {tab.id === 'REQUESTS' && tab.count > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-white text-[#E53935] text-[10px] rounded-full flex items-center justify-center border-2 border-[#1D1D1F]">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 mt-12">
        {/* 2. SEARCH & CONTROLS */}
        <div className="relative mb-16 group">
           <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#E53935] transition-colors" size={24} />
           <input 
             type="text" 
             placeholder="Search people..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full h-20 bg-white border border-black/[0.05] rounded-[2rem] pl-20 pr-8 text-[16px] font-bold text-[#1D1D1F] placeholder:text-black/20 focus:border-[#E53935]/20 outline-none transition-all shadow-sm"
           />
        </div>

        {/* 3. GRID CONTENT */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center gap-6">
             <Loader2 className="animate-spin text-[#E53935]" size={40} />
             <p className="text-[11px] font-black uppercase tracking-widest text-black/20">Syncing Network...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {activeTab === 'DISCOVER' && (
                discoverList.filter(searchFilter).length > 0 ? (
                  discoverList.filter(searchFilter).map((p, i) => (
                    <PartnerCard key={p.id} partner={p} index={i} onAction={() => handleConnect(p.id)} actionLabel="Connect" />
                  ))
                ) : <EmptyState title="No new matches" description="You've seen everyone for now." icon={Sparkles} />
              )}

              {activeTab === 'REQUESTS' && (
                <>
                  {incomingRequests.length > 0 && (
                    <div className="col-span-full space-y-6 mb-12">
                       <h3 className="text-[12px] font-black uppercase tracking-widest text-black/20 ml-4">Incoming Requests</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {incomingRequests.map((req, i) => (
                            <PartnerCard key={req.id} partner={req.partner} index={i} onAction={() => handleAccept(req.id)} actionLabel="Accept Link" />
                          ))}
                       </div>
                    </div>
                  )}
                  {sentRequests.length > 0 && (
                    <div className="col-span-full space-y-6">
                       <h3 className="text-[12px] font-black uppercase tracking-widest text-black/20 ml-4">Sent Requests</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
                          {sentRequests.map((req, i) => (
                            <PartnerCard key={req.id} partner={req.partner} index={i} onAction={() => {}} actionLabel="Requested" disabled />
                          ))}
                       </div>
                    </div>
                  )}
                  {incomingRequests.length === 0 && sentRequests.length === 0 && (
                    <EmptyState title="No requests" description="Incoming and outgoing requests will appear here." icon={Clock} />
                  )}
                </>
              )}

              {activeTab === 'CONNECTED' && (
                connectedList.filter(searchFilter).length > 0 ? (
                  connectedList.filter(searchFilter).map((p, i) => (
                    <PartnerCard key={p.id} partner={p} index={i} onAction={() => router.push(`/chat?user=${p.id}`)} actionLabel="Chat" variant="connected" />
                  ))
                ) : <EmptyState title="No connections" description="Start by connecting with people in Discover." icon={Users} />
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

function PartnerCard({ partner, index, onAction, actionLabel, disabled, variant }: any) {
  const router = useRouter();
  const score = partner.metadata?.match_score || 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-white border border-black/[0.05] rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-black/[0.05] transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      <div className="flex items-start gap-5 mb-8">
        <div 
          onClick={() => router.push(`/profile/${partner.id}`)}
          className="h-20 w-20 rounded-3xl overflow-hidden shadow-lg border-2 border-white shrink-0 cursor-pointer relative"
        >
          <img src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.full_name}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
          {variant === 'connected' && (
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-xl">
               <CheckCircle2 size={12} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <h4 className="text-[17px] font-black text-[#1D1D1F] truncate uppercase italic">{partner.full_name}</h4>
          </div>
          <p className="text-[11px] font-black text-[#E53935] uppercase tracking-widest">{partner.role}</p>
          <div className="flex items-center gap-1.5 mt-2 text-black/20">
             <MapPin size={10} strokeWidth={3} />
             <span className="text-[10px] font-black uppercase tracking-widest">{partner.location || "Remote"}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6">
         <div className="flex flex-wrap gap-2">
            {(partner.skills || []).slice(0, 3).map((skill: string) => (
               <span key={skill} className="px-3 py-1.5 bg-black/[0.02] border border-black/[0.03] text-black/40 rounded-lg text-[9px] font-black uppercase tracking-widest">{skill}</span>
            ))}
         </div>
         
         <div className="p-5 bg-black/[0.02] rounded-2xl border border-black/[0.02]">
            <p className="text-[9px] font-black text-black/20 uppercase tracking-widest mb-3 flex items-center justify-between">
               Synergy 
               <span className="text-[#E53935]">{score}%</span>
            </p>
            <div className="space-y-2">
               {partner.metadata?.reasons?.slice(0, 2).map((reason: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] font-bold text-black/60 leading-tight">
                     <div className="h-1 w-1 rounded-full bg-[#E53935] mt-1.5 shrink-0" />
                     {reason}
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="mt-8 pt-6 border-t border-black/[0.03] flex items-center gap-3">
         <button 
           disabled={disabled}
           onClick={(e) => { e.stopPropagation(); onAction(); }}
           className={cn(
             "flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
             variant === 'connected' ? "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white" :
             disabled ? "bg-black/[0.05] text-black/20 cursor-default" :
             "bg-[#1D1D1F] text-white hover:bg-black shadow-xl shadow-black/10"
           )}
         >
           {actionLabel}
           {variant === 'connected' && <MessageSquare size={16} />}
           {actionLabel === 'Connect' && <UserPlus size={16} />}
         </button>
         
         <button 
           onClick={() => router.push(`/profile/${partner.id}`)}
           className="h-14 w-14 bg-white border border-black/[0.08] rounded-2xl flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] transition-all"
         >
           <Zap size={18} />
         </button>
      </div>
    </motion.div>
  );
}

function EmptyState({ title, description, icon: Icon }: any) {
  return (
    <div className="col-span-full py-32 text-center bg-white border border-black/[0.05] rounded-[3rem] shadow-sm">
      <div className="h-20 w-20 bg-[#F5F5F7] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
        <Icon size={32} className="text-[#86868B]" />
      </div>
      <h3 className="text-2xl font-black text-[#1D1D1F] uppercase italic mb-2">{title}</h3>
      <p className="text-[#86868B] font-medium">{description}</p>
    </div>
  );
}
