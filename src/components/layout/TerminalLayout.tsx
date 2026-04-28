"use client";

import React from "react";
import DesktopSidebar from "./DesktopSidebar";
import UnifiedTopbar from "./UnifiedTopbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface TerminalLayoutProps {
  children: React.ReactNode;
  topbarChildren?: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export default function TerminalLayout({ children, topbarChildren, rightSidebar }: TerminalLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white overflow-hidden selection:bg-[#E53935]/10">
        {/* PERSISTENT SIDEBAR */}
        <div className="hidden lg:block h-full shrink-0">
           <DesktopSidebar />
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFD]">
           <UnifiedTopbar>
              {topbarChildren}
           </UnifiedTopbar>
           <div className="flex-1 flex overflow-hidden">
              <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                 {children}
              </main>
              {rightSidebar && (
                 <div className="hidden xl:block h-full">
                    {rightSidebar}
                 </div>
              )}
           </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
