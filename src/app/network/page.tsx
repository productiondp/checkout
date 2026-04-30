"use client";
export const runtime = 'edge';
import React from "react";
import SectionTerminal from "@/components/shared/SectionTerminal";
import LandingHeader from "@/components/layout/LandingHeader";
import { NETWORK_CONTENT } from "@/data/mock-content";

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main className="pt-[80px] lg:pt-[100px]">
        <SectionTerminal content={NETWORK_CONTENT} />
      </main>
    </div>
  );
}


