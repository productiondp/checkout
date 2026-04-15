"use client";

import React from "react";

const RECENT_ACTIVITY = [
  { name: "Cynthia", role: "UI Designer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" },
  { name: "Danny C", role: "Owner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&auto=format&fit=crop" },
];

const CONTACTS = [
  { name: "Morgan", status: "online", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=64&auto=format&fit=crop" },
  { name: "Stanley", status: "offline", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=64&auto=format&fit=crop" },
  { name: "Allen Am", status: "online", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=64&auto=format&fit=crop" },
  { name: "Lucas W", status: "offline", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=64&auto=format&fit=crop" },
  { name: "Danny M", status: "online", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=64&auto=format&fit=crop" },
  { name: "Jason G", status: "offline", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=64&auto=format&fit=crop" },
];

export default function RightSocialRail() {
  const handleClick = (name: string) => {
    alert(`Opening chat with ${name}...`);
  };

  return (
    <aside className="w-[220px] hidden 2xl:block p-8 space-y-10 overflow-y-auto no-scrollbar border-l border-slate-50">
      <div className="space-y-6">
         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-normal">Active Fast</h4>
         <div className="space-y-4">
            {RECENT_ACTIVITY.map(p => (
              <div key={p.name} onClick={() => handleClick(p.name)} className="flex items-center gap-3 cursor-pointer group">
                 <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                 </div>
                 <div className="min-w-0">
                    <p className="text-[12px] font-bold text-slate-900 group-hover:text-[#E53935] truncate">{p.name}</p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-normal">{p.role}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-normal">My Contacts</h4>
            <span className="text-[9px] font-bold text-[#E53935] bg-red-50 px-1.5 py-0.5 rounded">NEW</span>
         </div>
         <div className="space-y-4">
            {CONTACTS.map(f => (
               <div key={f.name} onClick={() => handleClick(f.name)} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 overflow-hidden relative border border-slate-100 shadow-sm">
                     <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                     {f.status === 'online' && (
                       <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                     )}
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 group-hover:text-[#E53935]">{f.name}</span>
               </div>
            ))}
         </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Network Growth</p>
         <div className="flex -space-x-2 justify-center mb-4">
            {[1,2,3,4].map(i => (
               <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-${1510000000000 + i*100}?q=80&w=32&auto=format&fit=crop`} alt="U" />
               </div>
            ))}
         </div>
         <button className="text-[11px] font-bold text-[#E53935] hover:underline">Invite Friends</button>
      </div>
    </aside>
  );
}
