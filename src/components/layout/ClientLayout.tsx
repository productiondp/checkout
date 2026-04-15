"use client";

import React from "react";
import { usePathname } from "next/navigation";
import GlobalHeader from "./GlobalHeader";
import MobileNav from "./MobileNav";
import DesktopSidebar from "./DesktopSidebar";
import RightSocialRail from "./RightSocialRail";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname === "/auth";

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="h-screen w-screen flex flex-col bg-white lg:bg-[#F2F5F7] overflow-hidden selection:bg-[#E53935] selection:text-white font-sans">
      <GlobalHeader />
      
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-shrink-0">
          <DesktopSidebar />
        </div>
        
        <main className="flex-1 flex overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
             <div className="pb-32 lg:pb-0">
               {children}
             </div>
          </div>

          <div className="hidden 3xl:block">
            <RightSocialRail />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
