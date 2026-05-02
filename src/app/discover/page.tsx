"use client";
import React from "react";
import TerminalLayout from "@/components/layout/TerminalLayout";
import CheckoutMap from "@/components/explore/CheckoutMap";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DiscoverPage() {
  return (
    <ProtectedRoute>
      <TerminalLayout hideSidebar={true}>
        <div className="w-full h-screen overflow-hidden">
          <CheckoutMap />
        </div>
      </TerminalLayout>
    </ProtectedRoute>
  );
}
