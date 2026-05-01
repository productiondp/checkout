"use client";
import React from "react";
import SectionTerminal from "@/components/shared/SectionTerminal";
import LandingHeader from "@/components/layout/LandingHeader";
import { INSIGHTS_CONTENT } from "@/data/mock-content";

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main className="pt-[80px] lg:pt-[100px]">
        <SectionTerminal content={INSIGHTS_CONTENT} />
      </main>
    </div>
  );
}


