"use client";

import React from "react";
import { Circle, User } from "lucide-react";

const YOUR_PAGES = [
  { name: "Cynthia", color: "bg-red-200" },
  { name: "Danny C", color: "bg-purple-200" },
];

const FRIENDS = [
  { name: "Morgan", status: "online", seed: "Morgan" },
  { name: "Stanley", seed: "Stanley" },
  { name: "Allen Am", seed: "Allen" },
  { name: "Lucas W", seed: "Lucas" },
  { name: "Danny M", seed: "Danny" },
  { name: "Jason G", seed: "Jason" },
  { name: "Jesus C", seed: "Jesus" },
  { name: "Joshua", seed: "Joshua" },
  { name: "Jimmy M", seed: "Jimmy" },
];

export default function RightSocialRail() {
  return (
    <aside className="w-[240px] hidden 2xl:block p-8 space-y-10 overflow-y-auto no-scrollbar border-l border-[#F2F5F7]">
      {/* Your Pages Section */}
      <div className="space-y-6">
         <h4 className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider">Your Pages</h4>
         <div className="space-y-4">
            {YOUR_PAGES.map(p => (
              <div key={p.name} className="flex items-center gap-3 cursor-pointer group">
                 <div className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-[10px] font-bold text-white`}>{p.name[0]}</div>
                 <span className="text-[13px] font-medium text-[#202124] group-hover:text-primary">{p.name}</span>
              </div>
            ))}
         </div>
      </div>

      {/* Friends Section */}
      <div className="space-y-6">
         <h4 className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider">Friends</h4>
         <div className="space-y-4">
            {FRIENDS.map(f => (
              <div key={f.name} className="flex items-center gap-3 cursor-pointer group">
                 <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.seed}`} alt="Avatar" />
                    {f.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                 </div>
                 <span className="text-[13px] font-medium text-[#202124] group-hover:text-primary">{f.name}</span>
              </div>
            ))}
         </div>
      </div>

      {/* Groups Section */}
      <div className="space-y-6">
         <h4 className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider">Groups</h4>
         <div className="space-y-4">
            {['Web De', 'Topcode', 'Creative'].map(g => (
              <div key={g} className="flex items-center gap-3 cursor-pointer group">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-[#5F6368]">{g[0]}</div>
                 <span className="text-[13px] font-medium text-[#202124] group-hover:text-primary">{g}</span>
              </div>
            ))}
         </div>
      </div>
    </aside>
  );
}
