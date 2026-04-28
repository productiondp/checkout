"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Menu, X } from "lucide-react";
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
      <nav className="fixed top-0 inset-x-0 h-[calc(60px+env(safe-area-inset-top))] lg:h-[80px] z-50 px-6 lg:px-[10%] pt-[env(safe-area-inset-top)] flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 lg:h-10 w-8 lg:w-10 bg-[#E53935] rounded flex items-center justify-center">
            <Terminal size={22} className="text-white" />
          </div>
          <span className="text-xl lg:text-2xl font-bold text-[#E53935]">CheckOut</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10 text-gray-500 font-bold text-[13px] tracking-tight">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-black transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="h-6 w-px bg-gray-100 mx-2" />
          <div className="flex items-center gap-4">
            <button 
              onClick={onJoinClick || (() => window.location.href = '/?mode=signup')} 
              className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-full transition-all"
            >
              Join now
            </button>
            <button 
              onClick={onSigninClick || (() => window.location.href = '/?mode=signin')} 
              className="px-6 py-2 border border-[#E53935] text-[#E53935] font-bold rounded-full hover:bg-red-50 transition-all"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-[80px] px-6 lg:hidden"
          >
            <div className="flex flex-col gap-6 pt-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-2xl font-bold text-gray-900 border-b border-gray-50 pb-4"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex flex-col gap-4 pt-10">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onJoinClick ? onJoinClick() : window.location.href = '/?mode=signup';
                  }}
                  className="w-full h-14 bg-gray-900 text-white font-bold rounded-xl"
                >
                  Join now
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onSigninClick ? onSigninClick() : window.location.href = '/?mode=signin';
                  }}
                  className="w-full h-14 border-2 border-[#E53935] text-[#E53935] font-bold rounded-xl"
                >
                  Sign in
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
