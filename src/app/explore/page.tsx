import React from "react";
import LiveMap from "../../components/explore/LiveMap";

export default function ExplorePage() {
  return (
    <div className="h-[100dvh] w-full relative overflow-hidden">
       {/* Full Screen Live Map Experience */}
       <LiveMap />
    </div>
  );
}
