"use client";

import React, { useState } from "react";
import { Star, Users, Search, GraduationCap } from "lucide-react";

const ADVISORS = [
  {
    name: "Dr. Sarah Chen",
    role: "Money Growth Expert",
    specialty: "SaaS Business",
    rating: 4.9,
    reviews: 124,
    price: "₹15,000/hr",
    status: "online",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop",
    tags: ["Sales", "IPO", "Growth"]
  },
  {
    name: "Marcus Thorne",
    role: "Ad Expert",
    specialty: "Getting Customers",
    rating: 4.8,
    reviews: 89,
    price: "₹12,000/hr",
    status: "busy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    tags: ["Fans", "Stories", "Search"]
  },
  {
    name: "Elena Rodriguez",
    role: "Work Flow Expert",
    specialty: "Shipping and Delivery",
    rating: 5.0,
    reviews: 56,
    price: "₹18,000/hr",
    status: "online",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    tags: ["Trucks", "Faster Work", "Global"]
  }
];

export default function Advisors() {
  const [search, setSearch] = useState("");

  const handleBook = (name: string) => {
    alert(`Booking a session with ${name}. Our team will contact you.`);
  };

  const handleInvite = (name: string) => {
    alert(`Invite sent to ${name} for a quick meeting.`);
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      {/* Header Section */}
      <div className="p-10 bg-slate-900 text-white relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E53935]/10 blur-[100px] rounded-full" />
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#E53935] rounded-xl flex items-center justify-center text-white shadow-lg">
              <Star size={20} fill="currentColor" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-normal text-[#E53935]">Approved Experts</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 tracking-normal leading-tight uppercase">Specialised <span className="text-[#E53935]">Advisors</span></h2>
          <p className="text-lg text-slate-400 font-normal max-w-2xl leading-relaxed mb-10">
            Talk to real experts to help grow your business. 
            Verified people, real results, private meetings.
          </p>

          <div className="flex flex-wrap gap-4">
             <div className="relative flex-1 max-w-md">
                <input 
                  type="text" 
                  placeholder="Search for help (e.g. Sales, Marketing)..."
                  className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 px-6 text-sm font-medium text-white placeholder:text-slate-500 outline-none focus:bg-white/20 transition-all shadow-inner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <button className="px-6 py-3.5 bg-[#E53935] text-white rounded-xl font-bold text-xs uppercase tracking-normal shadow-lg hover:bg-white hover:text-[#E53935] transition-all">
                Show more options
             </button>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="p-10">
        <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
           <div>
              <h3 className="text-xl font-bold text-slate-900 uppercase">Top <span className="text-[#E53935]">Advisors</span></h3>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-normal mt-1">Ready to chat now</p>
           </div>
           <div className="flex items-center gap-2 text-slate-400">
              <Users size={16} />
              <span className="text-[11px] font-medium uppercase tracking-normal">1,240 people online</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVISORS.map((advisor) => (
            <div key={advisor.name} className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-xl transition-all duration-300">
               <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-xl">
                       <img src={advisor.avatar} alt={advisor.name} className="w-full h-full object-cover" />
                    </div>
                    {advisor.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="text-right">
                     <p className="text-xl font-bold text-slate-900">{advisor.price}</p>
                     <div className="flex items-center justify-end gap-1 text-[#E53935] mt-1">
                        <span className="text-[11px] font-bold tracking-normal">{advisor.rating}</span>
                        <span className="text-[10px] text-slate-400 font-medium ml-1">({advisor.reviews})</span>
                     </div>
                  </div>
               </div>

               <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                     <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#E53935] transition-colors">{advisor.name}</h4>
                  </div>
                  <p className="text-[12px] font-bold text-[#E53935] uppercase tracking-normal mb-2">{advisor.role}</p>
                  <p className="text-sm font-normal text-slate-500 line-clamp-2 leading-relaxed">Expert in <span className="text-slate-900 font-semibold">{advisor.specialty}</span> to help your business grow fast.</p>
               </div>

               <div className="flex flex-wrap gap-2 mb-10">
                  {advisor.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-medium uppercase tracking-normal rounded-lg">#{tag}</span>
                  ))}
               </div>

               <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleBook(advisor.name)}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-normal shadow-lg hover:bg-[#E53935] transition-all"
                  >
                     Book a session
                  </button>
                  <button 
                    onClick={() => handleInvite(advisor.name)}
                    className="w-full py-2.5 border border-slate-100 text-slate-400 rounded-lg font-medium text-[9px] uppercase tracking-normal hover:text-[#E53935] transition-all"
                  >
                     Send a quick invite
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Up Section */}
      <div className="m-10 mt-0 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="max-w-md">
            <h4 className="text-lg font-bold text-slate-900 uppercase mb-1">Become an <span className="text-[#E53935]">Expert</span></h4>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-normal">Share what you know and get paid through the Checkout app.</p>
         </div>
         <button className="px-8 py-3.5 border border-slate-900 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-normal hover:bg-slate-900 hover:text-white transition-all">Apply to help others</button>
      </div>
    </div>
  );
}
