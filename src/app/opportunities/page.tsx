"use client";

import React from "react";
import SectionTerminal from "@/components/shared/SectionTerminal";
import LandingHeader from "@/components/layout/LandingHeader";
import { OPPORTUNITIES_CONTENT } from "@/data/mock-content";

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main className="pt-[80px] lg:pt-[100px]">
        <SectionTerminal content={OPPORTUNITIES_CONTENT} />
      </main>
    </div>
  );
}
