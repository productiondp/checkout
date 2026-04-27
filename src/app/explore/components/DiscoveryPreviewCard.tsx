"use client";

import React from "react";
import { 
  Zap, 
  Clock, 
  Users, 
  Compass, 
  Navigation, 
  ArrowRight,
  Clock as ClockIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionService } from "@/services/connection-service";
import { useAuth } from "@/hooks/useAuth";

export type DiscoveryItemType = 'MEETUP' | 'ADVISOR' | 'REQUIREMENT' | 'PARTNER';

export interface DiscoveryItem {
  id: string;
  authorId?: string;
  type: DiscoveryItemType;
  title?: string;
  name?: string;
  lat: number;
  lng: number;
  participantCount?: number;
  maxSlots?: number;
  score?: number;
  avatar?: string;
  time?: string;
  distance?: string;
  role?: string;
  purpose?: string;
  metadata?: any;
}

export type DealStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

interface PreviewProps {
  item: DiscoveryItem;
  isJoined: boolean;
  dealStatus?: DealStatus;
  peakMomentActive?: boolean;
  onJoin: (id: string) => void;
  onConfirmDeal: (id: string) => void;
  onCompleteDeal: (id: string) => void;
  onViewProfile: (type: string, id: string) => void;
}

// 🧠 V1.54 MEETUP PREVIEW (Unified)
export const MeetupPreview = ({ item, isJoined, dealStatus, onJoin, onConfirmDeal, onCompleteDeal }: PreviewProps) => {
  if (isJoined) {
    if (dealStatus === 'IN_PROGRESS') {
      return (
        <div className="flex flex-col gap-3">
          <div className="w-full py-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-emerald-600">Partnership active</span>
          </div>
          <button onClick={() => onCompleteDeal(item.id)} className="w-full h-14 bg-white border border-slate-100 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:bg-black hover:text-white transition-all">
            Mark as completed
          </button>
        </div>
      );
    }
    if (dealStatus === 'COMPLETED') {
      return (
        <div className="w-full py-6 bg-slate-50 rounded-2xl flex flex-col items-center gap-2">
          <div className="text-[10px] font-black uppercase text-slate-400">Partnership Completed</div>
          <p className="text-[8px] font-black text-slate-300 uppercase">Outcome recorded in trust profile</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button className="flex-1 h-16 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600 transition-all">
              <Zap size={18} fill="white" /> Say Hi to Meetup
            </button>
            <button className="h-16 px-6 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-100 transition-all">
              Attendees (12)
            </button>
          </div>
          <div className="flex flex-wrap gap-2 py-2">
            {['Share Idea', 'Ask Details', 'Offer Help'].map(action => (
              <button key={action} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:bg-black hover:text-white transition-all">
                {action}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => onConfirmDeal(item.id)} className="w-full py-4 border-2 border-dashed border-emerald-100 rounded-2xl text-[10px] font-black uppercase text-emerald-600 hover:bg-emerald-50 transition-all flex flex-col items-center gap-1">
          <span className="flex items-center gap-2"><Zap size={12} fill="currentColor" /> Confirm Partnership</span>
          <span className="text-[7px] text-emerald-300">Finalize Scope & Timeline</span>
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => onJoin(item.id)} className="w-full h-16 bg-black text-white rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 shadow-xl hover:bg-zinc-800 transition-all">
      Join Meetup <ArrowRight size={18} className="opacity-40" />
    </button>
  );
};

// 🧠 V1.41 ADVISOR PREVIEW
export const AdvisorPreview = ({ item, onViewProfile }: PreviewProps) => (
  <button onClick={() => onViewProfile('advisors', item.id)} className="w-full h-16 bg-black text-white rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 shadow-xl hover:bg-zinc-800 transition-all">
    View Profile <ArrowRight size={18} className="opacity-40" />
  </button>
);

// 🧠 V1.43 PARTNER PREVIEW - UPGRADED V1.44-V1.53
export const PartnerPreview = ({ item, onViewProfile }: PreviewProps) => {
  const [showHandshake, setShowHandshake] = React.useState(false);
  const [commitmentLevel, setCommitmentLevel] = React.useState<'NONE' | 'EXPLORING' | 'COMMITTED'>('NONE');
  const [executionStep, setExecutionStep] = React.useState<'NONE' | 'DEFINING' | 'STARTED' | 'COMPLETED' | 'LOCKED'>('NONE');
  const [verificationStatus, setVerificationStatus] = React.useState<'PENDING' | 'VERIFIED' | 'UNVERIFIED'>('PENDING');
  const [isRouted, setIsRouted] = React.useState(true);
  const [isAssisted, setIsAssisted] = React.useState(true); // Simulated for demo
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [undoActive, setUndoActive] = React.useState(false);
  const [outcome, setOutcome] = React.useState<'COLLAB' | 'PAID' | 'LEARNED' | null>(null);
  const [firstStep, setFirstStep] = React.useState('');
  const [isStalled, setIsStalled] = React.useState(false);
  
  const { user: currentUser } = useAuth();
  
  if (isDismissed) return null;

  const roles = item.metadata?.target_roles || 'Designers / Developers';

  const handleOneTapConnect = async () => {
     if (!currentUser || !item.authorId) return;
     
     setIsAssisted(false);
     setUndoActive(true);
     
     try {
        await ConnectionService.connect(currentUser.id, item.authorId);
        // We keep the timer for the "Undo" window
        setTimeout(() => {
           setUndoActive(false);
           setCommitmentLevel('EXPLORING');
        }, 3000);
     } catch (err) {
        console.error("One-tap connect failed:", err);
        setIsAssisted(true);
        setUndoActive(false);
     }
  };

  const handleHandshakeAction = (action: string) => {
     setShowHandshake(true);
     setTimeout(() => setCommitmentLevel('EXPLORING'), 300);
  };

  const handleLockOutcome = (type: 'COLLAB' | 'PAID' | 'LEARNED') => {
     setOutcome(type);
     setExecutionStep('LOCKED');
     setTimeout(() => setVerificationStatus('VERIFIED'), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 🧠 ASSISTED EXECUTION BRIDGE (V1.53) */}
      {isAssisted && executionStep === 'NONE' && !undoActive && (
         <div className="p-5 bg-indigo-600 rounded-3xl flex flex-col gap-4 shadow-xl animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between">
               <div className="flex flex-col">
                  <p className="text-[10px] font-black text-white uppercase flex items-center gap-2">
                     <Zap size={14} fill="white" /> Ready to connect?
                  </p>
                  <p className="text-[7px] font-bold text-indigo-200 uppercase tracking-widest">Assistant: Intro & Intent pre-filled</p>
               </div>
               <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Zap size={12} className="text-indigo-200" />
               </div>
            </div>
            <div className="flex gap-2">
               <button onClick={handleOneTapConnect} className="flex-1 h-12 bg-white text-indigo-600 rounded-xl text-[9px] font-black uppercase shadow-lg hover:bg-indigo-50 transition-all">
                  One-tap Connect
               </button>
               <button onClick={() => setIsAssisted(false)} className="px-4 h-12 bg-white/10 text-white rounded-xl text-[9px] font-black uppercase hover:bg-white/20 transition-all">
                  Customize
               </button>
            </div>
         </div>
      )}

      {/* 🧠 UNDO LAYER */}
      {undoActive && (
         <div className="p-4 bg-slate-900 rounded-3xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-[9px] font-black text-white uppercase">Connection Sent Successfully</p>
            <button onClick={() => { setUndoActive(false); setIsAssisted(true); }} className="text-[9px] font-black text-amber-400 uppercase">Undo</button>
         </div>
      )}

      {/* 🧠 OPPORTUNITY ROUTING BADGE (V1.52) */}
      {isRouted && executionStep === 'NONE' && !isAssisted && !undoActive && (
         <div className="p-4 bg-amber-50 border border-amber-100 rounded-3xl flex items-center justify-between shadow-[0_0_20px_rgba(251,191,36,0.1)] animate-in slide-in-from-top-2 duration-700">
            <div className="flex flex-col">
               <p className="text-[9px] font-black text-amber-600 uppercase flex items-center gap-2">
                  <Compass size={12} /> Top Opportunity for You
               </p>
               <p className="text-[7px] font-bold text-amber-400 uppercase italic">Recommended: Worked with similar partners</p>
            </div>
            <button onClick={() => setIsDismissed(true)} className="text-[8px] font-black text-amber-300 uppercase hover:text-amber-600 transition-all">Dismiss</button>
         </div>
      )}

      <div className={cn(
         "p-6 border rounded-[2.5rem] flex flex-col gap-5 relative overflow-hidden transition-all duration-700",
         executionStep === 'LOCKED' ? "bg-slate-900 border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.15)]" : 
         isRouted && executionStep === 'NONE' ? "bg-white border-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.05)]" : "bg-indigo-50 border-indigo-100"
      )}>
        {/* 🧠 INTEGRITY BADGE (V1.50) */}
        {executionStep === 'LOCKED' && (
           <div className={cn(
             "absolute top-0 right-0 px-6 py-2 text-[8px] font-black uppercase rounded-bl-3xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-700 z-10",
             verificationStatus === 'VERIFIED' ? "bg-indigo-600 text-white" : "bg-amber-400 text-slate-900"
           )}>
              {verificationStatus === 'VERIFIED' ? '✓ Verified Partnership' : 'Vested Reputation'}
           </div>
        )}

        {/* 🧠 COMMITMENT & EXECUTION BADGE */}
        {commitmentLevel === 'COMMITTED' && executionStep !== 'LOCKED' && (
           <div className={cn(
             "absolute top-0 right-0 px-6 py-2 text-white text-[8px] font-black uppercase rounded-bl-3xl shadow-xl animate-in fade-in slide-in-from-right-5 duration-500 z-10",
             executionStep === 'COMPLETED' ? "bg-slate-900" :
             isStalled ? "bg-[#E53935]" : "bg-indigo-600"
           )}>
              {executionStep === 'COMPLETED' ? 'Outcome Pending' : 
               isStalled ? 'Action Required' : 
               executionStep === 'STARTED' ? 'Execution Active' : 'Committed Partner'}
           </div>
        )}

        <div className="flex items-center justify-between">
          <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase", executionStep === 'LOCKED' ? "bg-amber-400 text-slate-900" : "bg-indigo-600 text-white")}>
             {executionStep === 'LOCKED' ? 'Legacy Partnership' : 'Long-term Partner'}
          </div>
          <p className={cn("text-[9px] font-black uppercase tracking-widest", executionStep === 'LOCKED' ? "text-amber-200" : "text-indigo-400")}>
            {executionStep === 'LOCKED' ? (verificationStatus === 'VERIFIED' ? "Mutual Verification Complete" : "Compounded Trust") : isStalled ? "Momentum Stalled" : "Looking for committed partner"}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
           <h4 className={cn("text-lg font-black uppercase leading-tight", executionStep === 'LOCKED' ? "text-white" : "text-indigo-900")}>
              {executionStep === 'LOCKED' ? `Success: ${item.title || "Partnership Build"}` : `Goal: ${item.title || "Build serious startup"}`}
           </h4>
           <div className="flex flex-wrap gap-2">
              <div className={cn("px-3 py-1.5 border rounded-xl text-[9px] font-black uppercase flex items-center gap-2", executionStep === 'LOCKED' ? "bg-white/5 border-white/10 text-amber-200" : "bg-white border-indigo-100 text-indigo-500")}>
                <Users size={12} /> {executionStep === 'LOCKED' ? `Partnered with ${item.name || "Builder"}` : `Best for: ${roles}`}
              </div>
           </div>
        </div>

        {/* 🧠 VERIFIED SNAPSHOT (V1.50) */}
        {executionStep === 'LOCKED' ? (
           <div className="py-4 px-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3 animate-in fade-in duration-1000">
              <div className="flex items-center justify-between">
                 <span className={cn("text-[8px] font-black uppercase", verificationStatus === 'VERIFIED' ? "text-indigo-400" : "text-amber-400")}>
                   {verificationStatus === 'VERIFIED' ? "Verified by both partners" : "Outcome Recorded"}
                 </span>
                 <span className="text-[7px] font-bold text-slate-400 uppercase">April 2024</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className={cn("h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-700", verificationStatus === 'VERIFIED' ? "bg-indigo-600" : "bg-amber-400")}>
                    <Zap size={16} fill={verificationStatus === 'VERIFIED' ? "white" : "#0F172A"} className={verificationStatus === 'VERIFIED' ? "text-white" : "text-slate-900"} />
                 </div>
                 <div className="flex flex-col">
                    <p className="text-[10px] font-black text-white uppercase">{outcome === 'COLLAB' ? 'Partnership Success' : outcome === 'PAID' ? 'Professional Engagement' : 'Learning Milestone'}</p>
                    <p className="text-[7px] font-bold text-slate-400 uppercase">Added to Domain Strength: +15%</p>
                 </div>
              </div>
           </div>
        ) : (
           <div className="flex flex-col gap-3">
              {/* 🧠 NETWORK TRUST SIGNAL (V1.51) */}
              <div className="py-3 px-4 bg-indigo-600/5 border border-indigo-100/50 rounded-2xl flex items-center justify-between">
                 <div className="flex flex-col gap-0.5">
                    <p className="text-[8px] font-black text-indigo-600 uppercase flex items-center gap-1.5">
                       <Users size={10} /> Trusted by people you worked with
                    </p>
                    <p className="text-[7px] font-bold text-indigo-300 uppercase italic">Network Propagation Active</p>
                 </div>
                 <div className="flex -space-x-1.5">
                    {[1,2].map(i => <div key={i} className="h-5 w-5 rounded-full border-2 border-indigo-50 bg-indigo-100" />)}
                 </div>
              </div>

              {executionStep === 'STARTED' && (
                 <div className={cn(
                   "py-5 px-6 rounded-3xl border flex flex-col gap-4 animate-in fade-in duration-700",
                   isStalled ? "bg-red-50 border-red-100" : "bg-white border-emerald-100 shadow-sm"
                 )}>
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[7px] font-black text-slate-300 uppercase">Current Task</span>
                          <span className={cn("text-[10px] font-black uppercase", isStalled ? "text-red-600" : "text-emerald-600")}>
                             {firstStep}
                          </span>
                       </div>
                       <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[7px] font-black text-slate-200 uppercase">Last Activity</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase">2h ago</span>
                       </div>
                    </div>
                    {isStalled && (
                       <div className="p-3 bg-red-100/50 rounded-xl border border-red-200 text-center">
                          <p className="text-[8px] font-black text-red-600 uppercase">This needs attention • Any update on this?</p>
                       </div>
                    )}
                    <div className="flex gap-2">
                       <button onClick={() => setExecutionStep('COMPLETED')} className="flex-1 h-10 bg-emerald-500 text-white rounded-xl text-[8px] font-black uppercase hover:bg-emerald-600 transition-all">
                          Mark as done
                       </button>
                       <button onClick={() => setIsStalled(!isStalled)} className="flex-1 h-10 bg-slate-50 text-slate-400 rounded-xl text-[8px] font-black uppercase hover:bg-slate-100 transition-all">
                          {isStalled ? "Restart Momentum" : "Still Working"}
                       </button>
                    </div>
                 </div>
              )}

              {executionStep === 'COMPLETED' && (
                 <div className="py-6 bg-slate-900 rounded-3xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500 border border-amber-400/30">
                    <div className="flex flex-col items-center gap-1 text-center px-6">
                       <Zap size={24} fill="#FCD34D" className="text-amber-300" />
                       <p className="text-[10px] font-black text-white uppercase tracking-widest">Milestone Chain Ended</p>
                       <p className="text-[8px] font-bold text-amber-400 uppercase italic">Verification will be sent to partner</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full px-6">
                       {[
                         { id: 'COLLAB', label: 'Partnership Success' },
                         { id: 'PAID', label: 'Professional Engagement' },
                         { id: 'LEARNED', label: 'Learned & Grew' }
                       ].map(opt => (
                         <button key={opt.id} onClick={() => handleLockOutcome(opt.id as any)} className="w-full py-3 bg-white/10 border border-white/5 rounded-xl text-[8px] font-black text-white uppercase hover:bg-amber-400 hover:text-slate-900 transition-all">
                            {opt.label}
                         </button>
                       ))}
                    </div>
                 </div>
              )}

              {executionStep === 'NONE' && (
                 <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed italic">
                      "Let's build something serious together. Looking for a partner who understands product-led growth."
                    </p>
                    <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">If you're serious about building, this is for you</p>
                 </div>
              )}
           </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {executionStep === 'LOCKED' ? (
           <div className="flex flex-col gap-4">
              <div className={cn(
                 "p-5 rounded-3xl flex items-center justify-between border animate-in slide-in-from-bottom-2 duration-700",
                 verificationStatus === 'VERIFIED' ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100"
              )}>
                 <div className="flex flex-col gap-1">
                    <p className={cn("text-[9px] font-black uppercase", verificationStatus === 'VERIFIED' ? "text-indigo-600" : "text-slate-900")}>
                       {verificationStatus === 'VERIFIED' ? "Mutual Verification Complete" : "Verification Pending"}
                    </p>
                    <p className="text-[7px] font-bold text-slate-400 uppercase">
                       {verificationStatus === 'VERIFIED' ? "Integrity level: Maximum" : "Waiting for partner response"}
                    </p>
                 </div>
                 <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Zap key={i} size={8} fill={verificationStatus === 'VERIFIED' ? "#4F46E5" : "#FCD34D"} className={verificationStatus === 'VERIFIED' ? "text-indigo-600" : "text-amber-400"} />)}
                 </div>
              </div>
              <button onClick={() => onViewProfile('partners', item.id)} className="w-full h-16 bg-slate-200 text-slate-500 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 shadow-sm hover:bg-slate-300 transition-all">
                View Partnership History <ArrowRight size={18} className="opacity-40" />
              </button>
           </div>
        ) : commitmentLevel === 'NONE' ? (
          !showHandshake ? (
            <button onClick={() => setShowHandshake(true)} className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-700 transition-all">
              Start building together <ArrowRight size={18} className="opacity-40" />
            </button>
          ) : (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="p-5 bg-white border-2 border-indigo-100 rounded-3xl flex flex-col gap-4 shadow-xl">
                  <p className="text-[10px] font-black text-indigo-900 uppercase">Start Partner Alignment</p>
                  <div className="flex flex-col gap-2">
                     {['Share what I can contribute', 'Ask about the project', 'Align on goals'].map(opt => (
                       <button key={opt} onClick={() => handleHandshakeAction(opt)} className="h-12 px-4 bg-slate-50 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:bg-black hover:text-white transition-all text-left">
                          {opt}
                       </button>
                     ))}
                  </div>
                  <button onClick={() => setShowHandshake(false)} className="text-[8px] font-black text-slate-300 uppercase text-center mt-1">Skip Handshake</button>
               </div>
            </div>
          )
        ) : commitmentLevel === 'EXPLORING' ? (
           <div className="p-6 bg-white border-2 border-dashed border-indigo-200 rounded-3xl animate-in zoom-in-95 duration-500 flex flex-col items-center gap-4 text-center">
              <div className="flex flex-col gap-1">
                 <p className="text-[11px] font-black text-indigo-900 uppercase">Ready to move forward?</p>
                 <p className="text-[8px] font-bold text-slate-300 uppercase">Signaling commitment increases response quality</p>
              </div>
              <div className="flex gap-2 w-full">
                 <button onClick={() => setCommitmentLevel('COMMITTED')} className="flex-1 h-12 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                    Yes, I'm serious
                 </button>
                 <button onClick={() => onViewProfile('partners', item.id)} className="flex-1 h-12 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase hover:bg-slate-100 transition-all">
                    Let's explore first
                 </button>
              </div>
           </div>
        ) : executionStep === 'NONE' ? (
           <div className="p-5 bg-white border-2 border-indigo-100 rounded-3xl animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col gap-4">
              <p className="text-[10px] font-black text-indigo-900 uppercase">Define your first step</p>
              <div className="flex flex-col gap-3">
                 <div className="flex flex-wrap gap-2">
                    {['Define Scope', 'Set Timeline', 'Assign Task'].map(opt => (
                       <button key={opt} onClick={() => setFirstStep(opt)} className={cn("px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all", firstStep === opt ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400 hover:bg-indigo-50")}>
                          {opt}
                       </button>
                    ))}
                 </div>
                 <input type="text" placeholder="Describe your first action..." value={firstStep} onChange={(e) => setFirstStep(e.target.value)} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-indigo-900 uppercase placeholder:text-slate-200 outline-none focus:border-indigo-300 transition-all" />
                 <button onClick={() => setExecutionStep('STARTED')} disabled={!firstStep} className="w-full h-12 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all disabled:opacity-50">
                    Start Execution
                 </button>
              </div>
           </div>
        ) : (
           <div className="flex flex-col gap-3">
              <button onClick={() => onViewProfile('partners', item.id)} className="w-full h-16 bg-black text-white rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 shadow-xl hover:bg-zinc-800 transition-all">
                Go to partner chat <ArrowRight size={18} className="opacity-40" />
              </button>
              <div className="flex items-center justify-center gap-2">
                 <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
                 <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                    {executionStep === 'COMPLETED' ? "Outcome Pending" : "Momentum Established: First step active"}
                 </p>
              </div>
           </div>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-2">
         <div className="h-1 w-1 bg-indigo-400 rounded-full animate-pulse" />
         <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">
            {executionStep === 'LOCKED' ? (verificationStatus === 'VERIFIED' ? "Mutual Verification Complete" : "Reputation Compounded") : "Compatibility Rank: Top 5% for your role"}
         </p>
      </div>
    </div>
  );
};
