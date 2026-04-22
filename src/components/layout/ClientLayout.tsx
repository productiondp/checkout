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
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname === "/" || pathname === "/auth";

  if (!mounted) {
    const isDarkTarget = pathname === "/";
    return (
      <div className={`h-[100dvh] w-screen flex items-center justify-center ${isDarkTarget ? 'bg-[#292828]' : 'bg-white'}`}>
         <div className="h-12 w-32 relative animate-pulse">
            <img src="/images/logo.png" alt="Loading..." className={`h-full object-contain ${isDarkTarget ? 'opacity-20 brightness-0 invert' : 'opacity-20'}`} />
         </div>
      </div>
    );
  }

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-white lg:bg-[#F2F5F7] overflow-hidden selection:bg-[#E53935] selection:text-white font-sans antialiased overscroll-none">
      <GlobalHeader />
      
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-shrink-0">
          <DesktopSidebar />
        </div>
        
        <main className="flex-1 flex overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-32 lg:pb-0">
             {children}
          </div>

          {pathname === "/home" && (
            <div className="hidden xl:block">
              <RightSocialRail />
            </div>
          )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
