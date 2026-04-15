"use client";

import React from "react";
import Link from "next/link";

export default function Onboarding() {
  return (
    <div className="flex flex-col min-h-screen bg-white px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[30%] bg-[#E53935]/5 rounded-full blur-[100px]"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 relative z-10">
        <div className="relative mb-4">
           <img src="/images/logo.png" alt="Checkout Logo" className="h-20 w-auto object-contain" />
        </div>
        
        <div>
          <p className="text-slate-500 text-lg max-w-[280px] font-medium leading-tight">
            The premium network for <span className="text-slate-900 font-bold">local businesses.</span>
          </p>
        </div>
      </div>

      <div className="pb-12 flex flex-col gap-6 relative z-10">
        <div className="flex flex-col gap-4">
          <Link href="/home" className="w-full">
            <button className="w-full py-4 bg-[#E53935] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2 group">
              Join Now
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
          <p className="text-center text-slate-400 text-[10px] font-medium uppercase tracking-normal">
            Approved by 5,000+ business owners
          </p>
        </div>
        
        <div className="flex justify-center gap-2">
           {[1,2,3].map(i => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === 1 ? 'w-8 bg-[#E53935]' : 'w-2 bg-slate-100'}`}></div>
           ))}
        </div>
      </div>
    </div>
  );
}
