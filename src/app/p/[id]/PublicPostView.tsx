"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2, ShieldCheck, Zap, Users, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import UniversalFeedCard from '@/components/ui/UniversalFeedCard';
import { useAuth } from '@/hooks/useAuth';

import Image from 'next/image';

export default function PublicPostView({ post }: { post: any }) {
  const router = useRouter();
  const { state, isAuthResolved } = useAuth();

  useEffect(() => {
    if (isAuthResolved && state.tag === 'authenticated') {
      router.replace(`/home?post=${post.id}`);
    }
  }, [state.tag, isAuthResolved, router, post.id]);

  const handleSignupRedirect = () => {
    router.push('/?mode=signup');
  };

  if (!isAuthResolved || state.tag === 'authenticated') {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center">
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
         >
            <Loader2 size={32} className="text-[#E53935]" />
         </motion.div>
      </div>
    );
  }

   return (
    <div className="min-h-screen bg-[#FBFBFD] font-sans flex flex-col relative overflow-hidden text-[#1D1D1F]">
       {/* High-Fidelity Background Architecture */}
       <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-red-500/10 to-transparent blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-indigo-500/10 to-transparent blur-[140px] rounded-full" />
       </div>

       {/* Premium Navigation */}
       <nav className="h-16 lg:h-20 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-black/[0.03]">
          <Link href="/" className="group flex items-center">
             <Image 
                src="/logo.png" 
                alt="Checkout Logo" 
                width={200} 
                height={50} 
                className="h-10 lg:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
                priority
             />
          </Link>
          <div className="flex items-center gap-6">
             <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-[#86868B]">Join the Elite Network</span>
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignupRedirect}
                className="h-11 lg:h-12 px-6 lg:px-8 bg-[#E53935] hover:bg-[#B71C1C] text-white text-[10px] lg:text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-red-500/20"
             >
                Join Network
             </motion.button>
          </div>
       </nav>

       <main className="flex-1 flex flex-col items-center pt-16 pb-32 px-4 z-10">
          {/* Viral Spotlight Header */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center mb-16 space-y-6 max-w-4xl"
          >
             <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-black/[0.05] shadow-sm">
                <div className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1D1D1F]">Spotlight Experience</span>
             </div>
             
             <h1 className="text-4xl lg:text-7xl font-black text-[#1D1D1F] tracking-tighter leading-[0.9] lg:px-12 font-outfit uppercase">
                Great things happen <br /> when <span className="text-[#E53935]">experts connect.</span>
             </h1>
             
             <p className="text-lg lg:text-xl text-[#86868B] font-medium max-w-2xl mx-auto leading-tight">
                You've been invited to view an exclusive opportunity from the network. <br className="hidden lg:block" /> Secure your spot to respond.
             </p>
          </motion.div>

          {/* The Hero Card Spotlight */}
          <div className="w-full max-w-[740px] relative">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-20 rounded-[40px] p-1.5 bg-gradient-to-b from-white to-[#F5F5F7] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-black/[0.03]"
             >
                <div className="rounded-[36px] overflow-hidden bg-white">
                   <UniversalFeedCard post={post} currentUserId="guest" isPublicPreview={true} />
                </div>
             </motion.div>

             {/* Dynamic CTA Banner below the card */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 bg-white p-8 lg:p-12 rounded-[40px] border border-black/[0.03] shadow-2xl shadow-black/5 w-full text-center relative z-30"
             >
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="text-center md:text-left space-y-2">
                      <h3 className="text-2xl lg:text-3xl font-black text-[#1D1D1F] font-outfit uppercase tracking-tighter">Ready to respond?</h3>
                      <p className="text-[#86868B] font-medium text-[15px] lg:text-[16px] max-w-sm leading-tight">
                         Connect directly with {post.authorName?.split(' ')[0] || 'this member'} and start building.
                      </p>
                   </div>
                   
                   <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignupRedirect}
                      className="h-16 px-12 bg-black hover:bg-zinc-900 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all flex items-center justify-center gap-4 shadow-2xl shadow-black/20 whitespace-nowrap w-full md:w-auto"
                   >
                      Join & Respond <ArrowRight size={18} />
                   </motion.button>
                </div>
             </motion.div>

             {/* Decorative Elements */}
             <div className="absolute -top-12 -right-12 h-32 w-32 bg-[#E53935]/5 blur-3xl rounded-full" />
             <div className="absolute -bottom-12 -left-12 h-32 w-32 bg-indigo-500/5 blur-3xl rounded-full" />
          </div>

          {/* Trust Architecture Section */}
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 w-full max-w-4xl"
          >
             <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-12 w-12 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center text-[#E53935] shadow-sm">
                   <ShieldCheck size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">Verified Pros</span>
             </div>
             <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-12 w-12 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center text-indigo-500 shadow-sm">
                   <Zap size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">Instant Access</span>
             </div>
             <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-12 w-12 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center text-amber-500 shadow-sm">
                   <Users size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">Global Network</span>
             </div>
             <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-12 w-12 rounded-2xl bg-white border border-black/[0.05] flex items-center justify-center text-emerald-500 shadow-sm">
                   <Globe size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">Edge Ready</span>
             </div>
          </motion.div>
       </main>

       {/* Premium Footer */}
       <footer className="py-12 border-t border-black/[0.03] text-center bg-white">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#86868B]">
             © 2026 Checkout Operating System • Built for Commerce
          </p>
       </footer>
    </div>
  );
}
