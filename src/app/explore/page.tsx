"use client";

import React, { useState } from "react";
import CheckoutMap from "../../components/explore/CheckoutMap";
import MapListView from "../../components/explore/MapListView";
import MapControls from "../../components/explore/MapControls";
import FilterPanel from "../../components/explore/FilterPanel";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-[#FDFDFF]">
       {/* 1. TOP BAR CONTROLS */}
       <div className="absolute top-0 left-0 right-0 z-[100] pointer-events-none">
          <MapControls 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
       </div>

       {/* 2. MAIN CONTENT LAYER */}
       <div className="h-full w-full">
          {viewMode === "map" ? (
            <CheckoutMap searchQuery={searchQuery} />
          ) : (
            <MapListView searchQuery={searchQuery} />
          )}
       </div>

       {/* 3. FILTER PANEL OVERLAY */}
       {isFilterOpen && (
         <FilterPanel onClose={() => setIsFilterOpen(false)} />
       )}
    </div>
  );
}
