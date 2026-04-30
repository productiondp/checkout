"use client";

import React from "react";
import TerminalLayout from "@/components/layout/TerminalLayout";
import CheckoutMap from "@/components/explore/CheckoutMap";

export default function DiscoverPage() {
  return (
    <TerminalLayout hideSidebar={true}>
      <div className="w-full h-screen overflow-hidden">
        <CheckoutMap />
      </div>
    </TerminalLayout>
  );
}


export const runtime = "edge";
