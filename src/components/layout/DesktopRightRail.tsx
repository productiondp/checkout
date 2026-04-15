"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, Users, ArrowRight } from "lucide-react";

const DesktopRightRail = () => {
  return (
    <div className="hidden xl:flex flex-col w-80 h-screen fixed right-0 top-0 p-8 space-y-8 bg-background-soft">
      {/* AI Stats Card */}
      <div className="card-ai p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-primary" />
          <span className="text-[10px] font-black uppercase  text-text-secondary">AI Profile Strength</span>
        </div>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-black text-text">84</span>
          <span className="text-sm font-black text-primary mb-1">%</span>
        </div>
        <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-[84%] rounded-full"></div>
        </div>
        <p className="text-[10px] text-text-secondary font-medium mt-4 leading-relaxed">
          Update your <span className="text-text font-bold">Offer Tags</span> to increase visibility by 20%.
        </p>
      </div>

      {/* Trending Topics */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase  text-text-secondary flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" />
            Trending Local
          </h3>
        </div>
        <div className="space-y-4">
          {[
            { tag: "#F&BSupply", count: "12 new posts", trend: "+24%" },
            { tag: "#VideoEditing", count: "8 new posts", trend: "+12%" },
            { tag: "#TechHiring", count: "15 new posts", trend: "+45%" },
          ].map((item) => (
            <div key={item.tag} className="group cursor-pointer">
              <p className="text-sm font-black text-text group-hover:text-primary transition-colors">{item.tag}</p>
              <div className="flex justify-between mt-1">
                <p className="text-[10px] text-text-secondary font-medium">{item.count}</p>
                <p className="text-[10px] text-green-600 font-black">{item.trend}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase  text-text-secondary flex items-center gap-2">
            <Users size={14} className="text-primary" />
            Suggested For You
          </h3>
        </div>
        <div className="space-y-5">
          {[
            { name: "Rahul M.", role: "Product Manager", match: "98%" },
            { name: "Anjali P.", role: "Coffee Importer", match: "84%" },
          ].map((user) => (
            <Link href="/profile" key={user.name} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">
                {user.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-text group-hover:text-primary transition-colors leading-none">{user.name}</p>
                <p className="text-[10px] text-text-secondary font-medium mt-1">{user.role}</p>
              </div>
              <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                {user.match}
              </span>
            </Link>
          ))}
        </div>
        <Link href="/match" className="w-full text-[10px] font-black uppercase  text-primary flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-primary/10 shadow-sm hover:bg-primary hover:text-white transition-all">
          View All Matches <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default DesktopRightRail;
