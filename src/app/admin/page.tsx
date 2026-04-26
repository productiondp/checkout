"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Terminal,
  Cpu,
  Fingerprint,
  Globe,
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  Power,
  Users,
  Waves,
  Wifi,
  Satellite,
  Radar as RadarIcon,
  Crosshair,
  BarChart,
  Link as LinkIcon,
  Database,
  Unlink,
  AlertTriangle,
  Zap,
  User,
  Maximize2,
  Scan,
  RefreshCw,
  Search,
  ChevronRight,
  TrendingUp,
  Activity as ActivityIcon,
  ShieldCheck,
  Eye,
  ZapOff,
  Boxes,
  Code,
  Radio,
  MessageSquare,
  Crosshair as TargetIcon,
  Compass,
  Disc,
  Cpu as CpuIcon,
  Network,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// ── MATRIX RAIN COMPONENT ──
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = "0123456789ABCDEF";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FF0000";
      ctx.font = `${fontSize}px 'Share Tech Mono'`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-[0.1] z-0" />;
};

// ── TYPES ──
interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  matchEfficiency: number;
  systemLatency: number;
}

export default function SentinelRedDashboard() {
  const router = useRouter();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isLinked, setIsLinked] = useState(false);
  const [isSecurityLocked, setIsSecurityLocked] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);
  const [dataIngress, setDataIngress] = useState(14022);
  
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    matchEfficiency: 92,
    systemLatency: 142,
  });
  const [events, setEvents] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);
  
  const supabase = createClient();

  const RED = "#FF0000";
  const GREEN = "#00FF41";

  const theme = {
    primary: isSecurityLocked ? RED : GREEN,
    secondary: isSecurityLocked ? RED : GREEN,
    headerRed: RED,
  };

  const handleToggle = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsSecurityLocked(!isSecurityLocked);
      setIsGlitching(false);
    }, 400);
  };

  useEffect(() => {
    const logPool = ["PACKET_INGRESS", "NODE_AUTH", "ENCRYPTION_SYNC", "DB_HANDSHAKE", "UPLINK_READY", "NODE_LOCKED", "RLS_VERIFIED"];
    const interval = setInterval(() => {
      const log = logPool[Math.floor(Math.random() * logPool.length)];
      const newLog = `[${new Date().toLocaleTimeString()}] ${log} -> SUCCESS`;
      setSecurityLogs(prev => [...prev.slice(-40), newLog]);
      setDataIngress(prev => prev + Math.floor(Math.random() * 50));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const { count: uC } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: pC } = await supabase.from('posts').select('*', { count: 'exact', head: true });
      const { data: profs } = await supabase.from('profiles').select('id, full_name').limit(20);
      const { data: evs } = await supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(40);
      const { data: pts } = await supabase.from('posts').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(20);
      
      setMetrics(p => ({ ...p, totalUsers: uC || 0, activeUsers: Math.round((uC || 0) * 0.45), totalPosts: pC || 0 }));
      if (profs) setUsers(profs);
      if (evs) setEvents(evs);
      if (pts) setPosts(pts);
    } catch (e) {}
  };

  useEffect(() => {
    if (!isLinked) return;
    fetchStats();
    const poll = setInterval(fetchStats, 4000); // Faster polling for real-time wipe feedback
    return () => clearInterval(poll);
  }, [isLinked]);

  const initiateSystemLink = async () => {
    if (dashboardRef.current?.requestFullscreen) await dashboardRef.current.requestFullscreen();
    setIsBooting(true);
    const logs = ["IGNITING CORE...", "LINKING NODES...", "ACCESS_GRANTED."];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) { setBootLog(p => [...p, logs[i++]]); }
      else { clearInterval(interval); setTimeout(() => { setIsLinked(true); setIsBooting(false); }, 500); }
    }, 150);
  };

  const getHeadingStyle = (size: string = '14px') => ({
    color: theme.headerRed,
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: "0px",
    textShadow: `0 0 15px ${theme.headerRed}`,
    fontWeight: 900,
    fontSize: size
  });

  if (!isLinked && !isBooting) {
    return (
      <div ref={dashboardRef} className="fixed inset-0 bg-black flex items-center justify-center z-[3000] font-['Share+Tech+Mono'] overflow-hidden">
        <MatrixRain />
        <div className="relative z-10 p-16 border-2 border-red-500/40 bg-black rounded-lg text-center shadow-[0_0_100px_rgba(255,0,0,0.2)]">
           <Unlink size={80} className="text-[#FF0000] mx-auto mb-10 animate-ping" />
           <h1 className="text-6xl uppercase italic mb-10" style={getHeadingStyle('64px')}>ACCESS RESTRICTED</h1>
           <button onClick={initiateSystemLink} className="w-full h-24 bg-[#FF0000]/10 border-2 border-[#FF0000]/60 hover:bg-[#FF0000] text-[#FF0000] hover:text-black transition-all uppercase font-black text-xl">ENTER DASHBOARD</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="fixed inset-0 bg-black overflow-hidden flex flex-col font-['Share+Tech+Mono']" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <MatrixRain />
      
      {/* ── ATMOSPHERICS ── */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,0,0,0.15)_100%)]" />
      <div className="fixed inset-0 pointer-events-none z-[101] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
      
      <AnimatePresence>
        {isGlitching && <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0, 0.8, 0] }} className="fixed inset-0 z-[5000] bg-white mix-blend-overlay pointer-events-none" />}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <header className="h-16 border-b flex items-center justify-between px-10 bg-black/80 relative z-[110] backdrop-blur-xl" style={{ borderColor: `${theme.primary}44` }}>
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
             <div className="h-4 w-4 shadow-[0_0_20px_currentColor] animate-pulse" style={{ backgroundColor: theme.primary }} />
             <h1 className="uppercase italic" style={getHeadingStyle('20px')}>SECURITY DASHBOARD</h1>
          </div>
          <div className="flex gap-12">
             <TopStat label="TRAFFIC" value={dataIngress} color={theme.primary} />
             <TopStat label="TOTAL USERS" value={metrics.totalUsers} color={theme.primary} />
          </div>
        </div>
        <div className="flex items-center gap-8">
           <button onClick={handleToggle} className="flex items-center gap-3 px-6 py-2.5 transition-all duration-700 bg-black/40 hover:bg-white/5 rounded" style={{ color: theme.primary, ...getHeadingStyle('12px') }}>
              <Zap size={14} className={isSecurityLocked ? "" : "animate-bounce"} />
              <span className="uppercase">{isSecurityLocked ? "PROTECTED" : "OVERRIDE ACTIVE"}</span>
           </button>
           <button onClick={() => router.push('/home')} className="h-10 w-10 flex items-center justify-center transition-all hover:bg-white/5 rounded">
              <Power size={18} style={{ color: theme.primary }} />
           </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-px overflow-hidden relative z-10 bg-red-900/5">
         
         {/* LEFT PANEL: DEEP SCAN RADAR */}
         <div className="col-span-3 row-span-6 bg-black/80 border-r flex flex-col relative overflow-hidden" style={{ borderColor: `${theme.primary}22` }}>
            <div className="h-[200px] p-10 border-b" style={{ borderColor: `${theme.primary}22` }}>
               <h3 className="uppercase mb-8" style={getHeadingStyle('13px')}>Live Activity</h3>
               <div className="h-20 flex items-center gap-1 border-b-2 relative overflow-hidden" style={{ borderColor: `${theme.primary}11` }}>
                  {Array.from({ length: 48 }).map((_, i) => (
                    <motion.div key={i} animate={{ height: [`${30+Math.random()*60}%`, `${60+Math.random()*40}%`] }} transition={{ repeat: Infinity, duration: 1+Math.random() }} className="flex-1" style={{ backgroundColor: theme.primary }} />
                  ))}
               </div>
            </div>

            <div className="flex-1 p-10 space-y-8 flex flex-col relative bg-black/40">
               <div className="flex items-center justify-between">
                  <h3 className="uppercase" style={getHeadingStyle('15px')}>Global Scanner</h3>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black animate-pulse" style={{ color: theme.primary }}>
                        {users.length > 0 ? "SYSTEM SCAN ACTIVE" : "SCANNING... NO NODES DETECTED"}
                     </span>
                     <TargetIcon size={14} className={cn("transition-all", users.length > 0 ? "animate-spin-slow" : "opacity-20")} style={{ color: theme.primary }} />
                  </div>
               </div>
               
               <div className="flex-1 flex items-center justify-center relative min-h-[400px]">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute border-[1px] rounded-full transition-all duration-1000" style={{ width: `${(i+1)*12}%`, height: `${(i+1)*12}%`, borderColor: `${theme.primary}${11+(i*11)}` }} />
                  ))}
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full origin-center" style={{ backgroundImage: `conic-gradient(from 0deg, ${theme.primary}aa, transparent)`, clipPath: "polygon(50% 50%, 100% 0, 100% 100%)", filter: "blur(2px)" }} />
                  
                  {users.map((user, idx) => {
                     // Distributed pseudo-random positions
                     const angle = (idx * 137.5) % 360; // Golden angle for even distribution
                     const radius = 15 + (idx % 4) * 10; // Varied scanning rings
                     const x = 50 + radius * Math.cos(angle * Math.PI / 180);
                     const y = 50 + radius * Math.sin(angle * Math.PI / 180);
                     
                     return (
                       <RadarDot 
                         key={user.id} 
                         x={x} 
                         y={y} 
                         label={user.full_name || "Anonymous Node"} 
                         color={theme.primary} 
                         blink={idx % 2 === 0} 
                       />
                     );
                  })}
               </div>
               <DiagMetric label="DIRECTION" value="142.4°" color={theme.primary} />
            </div>
         </div>

         {/* CENTER HUB */}
         <div className="col-span-6 row-span-4 bg-black/20 flex items-center justify-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.08)_0%,transparent_70%)]" />
            <div className="relative h-[650px] w-[650px] flex items-center justify-center">
               <div className="absolute inset-20 bg-red-900/10 blur-[120px] rounded-full" />
               <motion.div animate={{ rotate: 360, y: [-10, 10, -10], scale: [1, 1.02, 1] }} transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }} className="absolute inset-0 border-[1px] rounded-full transition-colors duration-1000" style={{ borderColor: `${theme.primary}44` }} />
               
               <div className="relative z-10 flex flex-col items-center">
                  <motion.div onClick={handleToggle} animate={{ borderColor: theme.primary, boxShadow: `0 0 80px ${theme.primary}22`, y: [-5, 5, -5] }} transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }} className="h-64 w-64 border-2 rounded-full flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-2xl">
                     <motion.div animate={{ color: theme.primary, filter: `drop-shadow(0 0 20px ${theme.primary})` }}>
                        {isSecurityLocked ? <Shield size={120} /> : <Network size={120} className="animate-pulse" />}
                     </motion.div>
                  </motion.div>
                  <div className="mt-14 text-center">
                     <motion.p className="uppercase" style={getHeadingStyle('52px')}>
                        {isSecurityLocked ? "PROTECTED" : "OVERRIDDEN"}
                     </motion.p>
                     <div className="mt-8 flex gap-6 justify-center">
                        <HackerBadge label="PROCESSOR" value="84%" />
                        <HackerBadge label="MEMORY" value="12GB" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT PANEL: NEURAL FEED INGRESS (ONLY POSTS NOW) */}
         <div className="col-span-3 row-span-6 bg-black/80 border-l flex flex-col relative overflow-hidden" style={{ borderColor: `${theme.primary}22` }}>
            <div className="px-10 py-10 border-b flex items-center justify-between bg-black/60" style={{ borderColor: `${theme.primary}11` }}>
               <h3 className="uppercase" style={getHeadingStyle('13px')}>Global Activity Feed</h3>
               <Radio size={16} className="text-emerald-500 animate-bounce" />
            </div>
            <div className="flex-1 relative overflow-hidden bg-black/40">
               <div className="p-8 h-full">
                  <motion.div animate={{ y: ["0%", "-50%"] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} className="flex flex-col gap-10">
                        {[...posts, ...posts].map((post, i) => (
                           <div key={i} className="border-l-4 pl-6 py-6 space-y-5 bg-white/5 rounded-r-lg relative overflow-hidden" style={{ borderColor: `${theme.secondary}88` }}>
                               <div className="flex justify-between items-center text-[11px] font-black">
                                  <span style={{ color: theme.primary }}>USER ID: {post.user_id?.slice(0, 8)}</span>
                                  <span className="text-emerald-500">94% MATCH</span>
                               </div>
                               <p className="text-white/80 text-[14px] leading-relaxed italic font-bold">"{post.description}"</p>
                               <div className="flex items-center gap-4 pt-2">
                                  <div className="text-[9px] font-black uppercase text-white/40">BUDGET: ${post.budget || 'N/A'}</div>
                               </div>
                           </div>
                        ))}
                  </motion.div>
               </div>
            </div>
         </div>

         {/* BOTTOM PANEL: SYSTEM EVENT INGRESS (NOW RUNNING LOGS) */}
         <div className="col-span-6 row-span-2 bg-black border-t border-x flex flex-col" style={{ borderColor: `${theme.primary}22` }}>
            <div className="px-10 py-8 border-b flex items-center justify-between bg-black/60" style={{ borderColor: `${theme.primary}22` }}>
               <h3 className="uppercase" style={getHeadingStyle('14px')}>Live Event Logs</h3>
               <Terminal size={18} style={{ color: theme.primary }} className="animate-pulse" />
            </div>
            <div className="flex-1 overflow-hidden relative bg-black/40">
               <div className="p-10 h-full">
                  <motion.div animate={{ y: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex flex-col gap-4">
                     {[...Array(40)].map((_, i) => {
                        const ev = events.length > 0 ? events[i % events.length] : null;
                        const log = securityLogs[i % securityLogs.length];
                        const isLog = i % 2 === 0 && log;
                        
                        return (
                          <div key={i} className="flex items-center gap-12 text-[14px] border-b border-white/5 pb-2 opacity-80 hover:opacity-100 transition-opacity">
                             <span className="shrink-0 text-white/10 font-black text-[12px]">[{new Date().toLocaleTimeString()}]</span>
                             {isLog ? (
                               <div className="flex-1 truncate uppercase font-black" style={{ color: theme.primary }}>
                                  DATA STREAM :: {log.slice(11)}
                               </div>
                             ) : (
                               <div className="flex-1 truncate uppercase font-black" style={{ color: theme.secondary }}>
                                   {ev ? `EVENT LOG :: ${ev.event_type} :: USER ${ev.user_id?.slice(0, 8)}` : "SYSTEM :: IDLE :: NO RECENT EVENTS"}
                               </div>
                             )}
                             <div className="h-2 w-2 rounded-full animate-ping shadow-[0_0_10px_currentColor]" style={{ backgroundColor: theme.primary }} />
                          </div>
                        );
                     })}
                  </motion.div>
               </div>
            </div>
         </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="h-12 border-t bg-black px-10 flex items-center justify-between shrink-0 relative z-[110]" style={{ borderColor: `${theme.primary}22` }}>
         <div className="flex gap-12 text-[11px] font-black text-white/10 uppercase">
            <span>Active Time: 14:22:04</span>
            <span style={{ color: theme.headerRed }}>SYSTEM ROOT SECURED</span>
         </div>
         <div className="flex items-center gap-3 text-[12px] font-black uppercase animate-pulse" style={{ color: theme.primary }}>
            {isSecurityLocked ? "SYSTEM SECURE" : "OVERRIDE ACTIVE"}
         </div>
      </footer>
    </div>
  );
}

// ── MICRO COMPONENTS ──

function TopStat({ label, value, color }: any) {
  return (
    <div className="flex flex-col items-center">
       <span className="text-[10px] font-black mb-1 opacity-40 uppercase" style={{ color: "#FF0000" }}>{label}</span>
       <span className="text-[26px] font-black tabular-nums transition-colors" style={{ color }}>{value}</span>
    </div>
  );
}

function HackerBadge({ label, value }: any) {
  return (
    <div className="px-6 py-2 border-2 border-red-500/20 bg-black/60 rounded-sm flex items-center gap-4">
       <span className="text-[10px] font-black opacity-30 uppercase text-red-500">{label}</span>
       <span className="text-[16px] font-black text-white">{value}</span>
    </div>
  );
}

function DiagMetric({ label, value, color }: any) {
  return (
    <div className="justify-between flex items-center">
       <p className="text-[10px] font-black opacity-20 uppercase" style={{ color: "#FF0000" }}>{label}</p>
       <p className="text-[15px] font-black uppercase" style={{ color }}>{value}</p>
    </div>
  );
}

function RadarDot({ x, y, label, color, blink }: any) {
  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
       <motion.div 
         animate={blink ? { opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] } : { opacity: 0.8 }} 
         transition={{ duration: 1.5, repeat: Infinity }} 
         className="h-2 w-2 rounded-full shadow-[0_0_15px_currentColor]" 
         style={{ backgroundColor: color }} 
       />
       <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="h-px w-6 mb-1" style={{ backgroundColor: `${color}44` }} />
          <span className="text-[9px] font-black uppercase whitespace-nowrap drop-shadow-lg" style={{ color: color, textShadow: `0 0 10px ${color}66` }}>
             {label}
          </span>
       </div>
    </div>
  );
}
