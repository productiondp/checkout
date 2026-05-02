"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import UniversalFeedCard from '@/components/ui/UniversalFeedCard';
import { useAuth } from '@/hooks/useAuth';

export default function PublicPostView({ post }: { post: any }) {
  const router = useRouter();
  const { state, isAuthResolved } = useAuth();

  useEffect(() => {
    if (isAuthResolved && state.tag === 'authenticated') {
      // User is already a member! Teleport them straight to the active post in the feed.
      router.replace(`/home?post=${post.id}`);
    }
  }, [state.tag, isAuthResolved, router, post.id]);

  const handleSignupRedirect = () => {
    // Redirect to landing page with signup intent
    router.push('/?mode=signup');
  };

  // If we are still resolving their auth state, just show a smooth loading state
  if (!isAuthResolved || state.tag === 'authenticated') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
         <Loader2 size={24} className="text-[#E53935] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
       {/* Minimal Public Header */}
       <header className="h-[80px] border-b border-black/[0.05] flex items-center justify-between px-6 lg:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-2">
             Check<span className="text-[#E53935]">Out</span>
          </Link>
          <button 
             onClick={handleSignupRedirect}
             className="h-10 px-6 bg-[#E53935] hover:bg-[#B71C1C] text-white text-[13px] font-bold rounded-full transition-all"
          >
             Join Network
          </button>
       </header>

       <main className="flex-1 flex flex-col items-center pt-12 pb-24 px-4 sm:px-6 relative">
          {/* Glassmorphic Background Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E53935]/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Value Proposition Header */}
          <div className="text-center mb-10 max-w-2xl mx-auto space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} /> Exclusive Network Opportunity
             </div>
             <h1 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
                Connect and build with the right people.
             </h1>
          </div>

          <div className="w-full max-w-[680px] relative group overflow-hidden rounded-3xl">
             {/* 
                Render the original Feed Card but wrap it in pointer-events-none 
                so it looks perfect but cannot be interacted with natively!
             */}
             <div className="pointer-events-none opacity-90 blur-[0.5px]">
                <UniversalFeedCard post={post} currentUserId="guest" />
             </div>

             {/* Conversion Interceptor Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent flex flex-col items-center justify-center p-8 z-10 pointer-events-auto">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/80 backdrop-blur-[2px]" />
                
                <div className="relative z-20 flex flex-col items-center text-center mt-[150px]">
                   <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Want to view the full details?</h3>
                   <p className="text-sm font-medium text-[#86868B] mb-6 max-w-sm">
                      Join Checkout Business OS to connect directly with {post.authorName?.split(' ')[0] || 'this member'} and unlock full access.
                   </p>
                   <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSignupRedirect}
                      className="h-14 px-8 bg-black hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20"
                   >
                      Sign Up to Connect <ArrowRight size={18} />
                   </motion.button>
                </div>
             </div>
          </div>
       </main>
    </div>
  );
}
