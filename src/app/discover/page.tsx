"use client";

import React from "react";
import SectionTerminal from "@/components/shared/SectionTerminal";
import { DISCOVER_CONTENT } from "@/data/mock-content";
import TerminalLayout from "@/components/layout/TerminalLayout";

export default function DiscoverPage() {
  return (
    <TerminalLayout>
      <div className="p-8">
        <SectionTerminal content={DISCOVER_CONTENT} />
      </div>
    </TerminalLayout>
  );
}
