"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import GlobalHeader from "@/components/layout/GlobalHeader";
import RightSocialRail from "@/components/layout/RightSocialRail";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname === "/auth";

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
        <GlobalHeader />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Column 1: Navigation */}
          <DesktopSidebar />
          
          {/* Main Content View (Rest of columns inside page) */}
          <main className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
               {children}
            </div>

            {/* Column 4: Social Utility (Global) */}
            <RightSocialRail />
          </main>
        </div>
      </div>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
