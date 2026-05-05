"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";

interface LandingHeaderProps {
  onJoinClick?: () => void;
  onSigninClick?: () => void;
}

export default function LandingHeader({ onJoinClick, onSigninClick }: LandingHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/what-is-checkout", label: "What is Checkout?" },
    { href: "/discover", label: "Discover" },
    { href: "/network", label: "Network" },
    { href: "/insights", label: "Insights" },
    { href: "/opportunities", label: "Opportunities" },
  ];

  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 px-4 lg:px-12 flex items-center justify-between ${
        scrolled 
          ? "h-[60px] lg:h-[80px] bg-white/80 backdrop-blur-2xl border-b border-black/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.03)]" 
          : "h-[80px] lg:h-[110px] bg-transparent"
      }`}
    >
      <Link href="/" className="flex items-center group relative shrink-0">
         <div className="absolute -inset-2 lg:-inset-4 bg-red-500/0 group-hover:bg-red-500/5 rounded-2xl transition-all duration-500 scale-90 group-hover:scale-100" />
         <Image 
            src="/logo.png" 
            alt="Checkout Logo" 
            width={180} 
            height={45} 
            className="h-6 lg:h-9 w-auto object-contain relative z-10 transition-transform group-hover:scale-[1.02]" 
            priority
         />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-10">
        <div className="flex items-center gap-8 text-[#1D1D1F] font-semibold text-[13px] tracking-tight">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="relative py-2 opacity-60 hover:opacity-100 transition-opacity group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#FF3B30] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
        
        <div className="h-5 w-px bg-black/[0.08]" />
        
        <div className="flex items-center gap-5">
          <Link 
            href="/?mode=signup" 
            className="text-[13px] font-black uppercase tracking-widest text-black/40 hover:text-[#FF3B30] transition-colors"
          >
            Join
          </Link>
          <Link 
            href="/?mode=signin" 
            className="group flex items-center gap-2 px-6 h-11 bg-black text-white rounded-full hover:bg-[#FF3B30] transition-all duration-500 shadow-xl shadow-black/10 hover:shadow-[#FF3B30]/20"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.2em] ml-1">Sign in</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Mobile Toggle */}
      <button 
        className={`lg:hidden h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-300 z-[110] relative ${
          isOpen ? "text-gray-900" : "bg-gray-100/50 text-gray-900 border border-black/[0.03]"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Enhanced Mobile Menu */}
      <div className={`fixed inset-0 z-[90] bg-white lg:hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${
        isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      }`}>
        <div className="flex flex-col h-full pt-[100px] pb-8 px-8 overflow-y-auto">
          <div className="flex flex-col gap-4 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mb-2">Navigation</span>
            {navLinks.map((link, i) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`text-3xl sm:text-4xl font-black tracking-tighter transition-all duration-700 ${
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-4 pt-8 border-t border-black/[0.05]">
            <Link 
              href="/?mode=signup"
              className="w-full h-14 bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20"
              onClick={() => setIsOpen(false)}
            >
              Create Account
            </Link>
            <Link 
              href="/?mode=signin"
              className="w-full h-14 bg-gray-50 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-black/[0.05] flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
