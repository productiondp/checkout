"use client";

import React, { useState } from "react";

const STATS = [
  { label: "Connections", value: "1,240", icon: "🤝", desc: "Top 0.5% Networker" },
  { label: "Trust Score", value: "99.9", icon: "🛡️", desc: "Great Reputation" },
  { label: "Projects", value: "48", icon: "🏗️", desc: "Local Business Leader" },
  { label: "Reply Time", value: "< 2m", icon: "⚡", desc: "Super Fast" },
];

const REVIEWS = [
  {
    id: 1,
    author: "Elena Rodriguez",
    role: "Delivery Manager",
    content: "Ahmad is great at building business tools. He is very reliable and fast.",
    score: 5,
    tag: "Faster Work"
  },
  {
    id: 2,
    author: "Marcus Thorne",
    role: "Business Owner",
    content: "He knows how to solve problems quickly. He fixed my business issues in just two days.",
    score: 5,
    tag: "Problem Solver"
  }
];

export default function Profile() {
  const handleConnect = () => {
    alert("Connection request sent to Ahmad Fawaid!");
  };

  const handleStartProject = () => {
    alert("Starting a new project talk with Ahmad...");
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-x-hidden pb-12">
      {/* HERO SECTION */}
      <div className="relative h-[440px] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-slate-900 to-[#E53935]/10"></div>
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-10 flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row items-end gap-10">
            
            {/* Profile Picture */}
            <div className="relative group shrink-0">
              <div className="w-40 h-40 rounded-3xl bg-white p-1 shadow-2xl transition-all">
                <div className="w-full h-full rounded-[1.3rem] overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#E53935] rounded-xl flex items-center justify-center text-xl shadow-xl">
                💎
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 mb-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-[#E53935] text-white text-[10px] font-medium uppercase tracking-normal rounded-full">Top Expert</span>
                <span className="px-3 py-1 bg-white/10 text-white/50 text-[10px] font-medium uppercase tracking-normal rounded-full border border-white/10">Rank #14 in City</span>
              </div>
              <h1 className="text-5xl font-bold text-white leading-none tracking-normal mb-4">
                Ahmad <span className="text-[#E53935]">Fawaid</span>
              </h1>
              <p className="text-lg text-slate-400 font-normal max-w-xl leading-relaxed">
                Helping businesses grow with top-quality tech tools. 
                Focusing on speed and making things work perfectly.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-2">
              <button onClick={handleConnect} className="h-12 px-6 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-normal hover:bg-[#E53935] hover:text-white transition-all shadow-xl">Add Partner</button>
              <button onClick={() => alert("Profile shared")} className="h-12 w-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-xl hover:bg-white/20 transition-all">📤</button>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTION */}
      <div className="max-w-7xl mx-auto px-10 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {STATS.map(stat => (
            <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-50 hover:border-[#E53935]/20 transition-all">
               <div className="flex items-center gap-3 mb-4">
                 <span className="text-xl">{stat.icon}</span>
                 <p className="text-[10px] font-medium text-slate-400 uppercase tracking-normal">{stat.label}</p>
               </div>
               <p className="text-2xl font-bold text-slate-900 tracking-normal mb-1">{stat.value}</p>
               <p className="text-[10px] font-medium text-[#E53935] uppercase tracking-normal">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED INFO */}
      <div className="max-w-7xl mx-auto px-10 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Part */}
        <div className="flex-1 space-y-12">
          <section className="space-y-6">
            <h3 className="text-[11px] font-semibold text-slate-900 uppercase tracking-normal flex items-center gap-3">
              About <span className="text-[#E53935]">Me</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </h3>
            <div className="max-w-none">
              <p className="text-lg font-normal text-slate-600 leading-relaxed">
                In the last 5 years, I have helped 40+ local businesses build better systems. 
                I make sure work is done <span className="text-slate-900 font-semibold uppercase text-xs">perfectly</span> and 
                <span className="text-[#E53935] font-semibold uppercase text-xs pl-1">makes more money for you.</span>
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[11px] font-semibold text-slate-900 uppercase tracking-normal">What Clients <span className="text-[#E53935]">Say</span></h3>
            
            <div className="grid grid-cols-1 gap-6">
               {REVIEWS.map(rev => (
                 <div key={rev.id} className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden shadow-md">
                          <img src={`https://images.unsplash.com/photo-${1500000000000 + rev.id*100}?q=80&w=64&auto=format&fit=crop`} alt="User" />
                       </div>
                       <div>
                          <p className="text-base font-bold text-slate-900 leading-none mb-1">{rev.author}</p>
                          <p className="text-[10px] font-medium text-[#E53935] uppercase tracking-normal">{rev.role}</p>
                       </div>
                    </div>
                    <p className="text-base text-slate-600 font-normal leading-relaxed">
                       "{rev.content}"
                    </p>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Right Part */}
        <div className="lg:w-[320px] space-y-10">
          
          {/* Work Summary */}
          <section className="bg-slate-900 rounded-[2rem] p-8 text-white relative shadow-xl overflow-hidden">
             <div className="relative z-10">
                <h4 className="text-[10px] font-semibold text-[#E53935] uppercase mb-8 leading-none">Work Skills</h4>
                
                <div className="space-y-6">
                   {[
                      { label: "Reliability", value: "100%", color: "bg-green-500" },
                      { label: "Speed", value: "94%", color: "bg-[#E53935]" },
                      { label: "Stability", value: "99.9%", color: "bg-blue-500" },
                   ].map(metric => (
                     <div key={metric.label}>
                        <div className="flex justify-between items-end mb-2">
                           <p className="text-[10px] font-medium text-slate-500 uppercase tracking-normal">{metric.label}</p>
                           <p className="text-sm font-bold">{metric.value}</p>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full">
                           <div className={`h-full ${metric.color} rounded-full`} style={{ width: metric.value }}></div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="text-center">
                      <p className="text-xl font-bold">48</p>
                      <p className="text-[8px] font-medium text-slate-500 uppercase">Jobs</p>
                   </div>
                   <div className="text-center">
                      <p className="text-xl font-bold text-[#E53935]">0</p>
                      <p className="text-[8px] font-medium text-slate-500 uppercase">Issues</p>
                   </div>
                   <div className="text-center">
                      <p className="text-xl font-bold">14</p>
                      <p className="text-[8px] font-medium text-slate-500 uppercase">Rank</p>
                   </div>
                </div>
             </div>
          </section>

          {/* Badges */}
          <section className="space-y-4">
             <h4 className="text-[10px] font-semibold text-slate-900 uppercase">Awards</h4>
             <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Top Rated", icon: "🏆" },
                  { label: "Expert", icon: "💻" },
                  { label: "Always Fast", icon: "⏳" },
                  { label: "Safe Pay", icon: "🛡️" },
                ].map(badge => (
                  <div key={badge.label} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-white hover:shadow-md transition-all">
                    <span className="text-2xl">{badge.icon}</span>
                    <p className="text-[9px] font-medium text-slate-400 uppercase">{badge.label}</p>
                  </div>
                ))}
             </div>
          </section>

          {/* Connect Part */}
          <div className="bg-red-50 rounded-3xl p-6 text-center border border-red-100 shadow-sm">
             <h4 className="text-base font-bold text-[#E53935] uppercase mb-4 leading-none">Work With Me</h4>
             <p className="text-[11px] font-normal text-slate-500 mb-6">I am ready to help with new projects for your business.</p>
             <button onClick={handleStartProject} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-normal shadow-lg transition-all">Start Project</button>
          </div>
        </div>
      </div>
    </div>
  );
}
