"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LandingHeaderProps {
  onJoinClick?: () => void;
  onSigninClick?: () => void;
}

export default function LandingHeader({ onJoinClick, onSigninClick }: LandingHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/what-is-checkout", label: "What is Checkout?" },
    { href: "/discover", label: "Discover" },
    { href: "/network", label: "Network" },
    { href: "/insights", label: "Insights" },
    { href: "/opportunities", label: "Opportunities" },
  ];

  return (
    <>
      <nav className="fixed top-0 inset-x-0 h-[80px] lg:h-[100px] z-[100] px-6 lg:px-12 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-black/[0.03]">
        <Link href="/" className="group flex items-center">
           <Image 
              src="/logo.png" 
              alt="Checkout Logo" 
              width={180} 
              height={45} 
              className="h-8 lg:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
              priority
           />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 text-[#1D1D1F] font-medium text-[14px]">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#E53935] transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="h-4 w-px bg-black/[0.1] mx-2" />
          <div className="flex items-center gap-6">
            <button 
              onClick={onJoinClick || (() => window.location.href = '/?mode=signup')} 
              className="text-[#1D1D1F] hover:text-[#E53935] transition-all font-bold"
            >
              Join now
            </button>
            <button 
              onClick={onSigninClick || (() => window.location.href = '/?mode=signin')} 
              className="px-6 h-10 border border-[#E53935] text-[#E53935] rounded-full hover:bg-[#E53935] hover:text-white transition-all font-bold"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden h-12 w-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900 border border-black/[0.05]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-white lg:hidden"
          >
            <div className="flex flex-col h-full pt-[100px] px-8 pb-12">
               <div className="flex flex-col gap-6 flex-1 overflow-y-auto pt-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="text-3xl font-bold text-gray-900 tracking-tighter hover:text-[#E53935] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
               </div>
              
               <div className="flex flex-col gap-4 pt-12 border-t border-black/[0.05]">
                 <button 
                   onClick={() => {
                     setIsOpen(false);
                     onJoinClick ? onJoinClick() : window.location.href = '/?mode=signup';
                   }}
                   className="w-full h-16 bg-black text-white font-bold tracking-wide text-[14px] rounded-2xl shadow-xl shadow-black/10"
                 >
                   Create Account
                 </button>
                 <button 
                   onClick={() => {
                     setIsOpen(false);
                     onSigninClick ? onSigninClick() : window.location.href = '/?mode=signin';
                   }}
                   className="w-full h-16 bg-gray-50 text-black font-bold tracking-wide text-[14px] rounded-2xl border border-black/[0.05]"
                 >
                   Member Sign In
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
