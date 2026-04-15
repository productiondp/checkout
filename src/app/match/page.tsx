"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap,
  LayoutGrid,
  List,
  ChevronDown,
  BrainCircuit,
  RefreshCcw,
  Search,
  MessageSquare,
  MessageCircle,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import DealEngine from "@/components/modals/DealEngine";

const INITIAL_MATCHES = [
  { 
    id: 1, 
    name: "Kiran Raj", 
    role: "Software Architect", 
    loc: "Trivandrum", 
    match: 98, 
    needs: ["Marketing", "Funding"],
    offers: ["Tech Help", "Developer Team"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop", 
    type: "Professional",
    aiReason: "Perfect match for your Tech Help needs."
  },
  { 
    id: 2, 
    name: "Sana Maryam", 
    role: "Business Strategist", 
    loc: "Bangalore", 
    match: 94, 
    needs: ["Tech Help", "Hiring"],
    offers: ["Marketing", "Strategy"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop", 
    type: "Professional",
    aiReason: "Good at Marketing which you need now."
  },
  { 
    id: 3, 
    name: "Alex Johnson", 
    role: "Legal Consultant", 
    loc: "Remote", 
    match: 82, 
    needs: ["Social Networking"],
    offers: ["Legal Help", "Contract Review"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop", 
    type: "Professional",
    aiReason: "Provides legal help for your new project."
  },
];

export default function Match() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [myNeed, setMyNeed] = useState("");
  const [isMatching, setIsMatching] = useState(false);

  const matchedPeople = useMemo(() => {
    if (!myNeed) return INITIAL_MATCHES;
    return INITIAL_MATCHES.filter(m => 
      m.offers.some(offer => offer.toLowerCase().includes(myNeed.toLowerCase())) ||
      m.role.toLowerCase().includes(myNeed.toLowerCase())
    );
  }, [myNeed]);

  const handleAIMatch = () => {
    setIsMatching(true);
    setTimeout(() => setIsMatching(false), 1500);
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-full bg-[#F8FAFB]">
      
      {/* Sidebar Area */}
      <div className="w-full xl:w-[400px] p-10 border-r border-[#EBEFF1] bg-white flex flex-col h-full overflow-y-auto no-scrollbar">
         <div className="mb-12">
            <div className="flex items-center gap-3 text-[#E53935] mb-4">
               <Sparkles size={24} className="fill-current" />
               <span className="text-[12px] font-bold uppercase tracking-normal">Networking</span>
            </div>
            <h2 className="text-3xl font-bold uppercase leading-tight mb-4 tracking-normal">Search For<br />What You Need</h2>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
               Type what you need, and we'll find people to help you.
            </p>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-inner">
               <label className="text-[11px] font-bold uppercase text-slate-400 block mb-4 tracking-normal">What help do you need?</label>
               <textarea 
                 value={myNeed}
                 onChange={(e) => setMyNeed(e.target.value)}
                 placeholder="E.g. I need marketing help for my shop" 
                 className="w-full bg-transparent text-[16px] font-bold placeholder:text-slate-300 outline-none resize-none min-h-[120px]"
               />
               <button 
                 onClick={handleAIMatch}
                 className="w-full mt-6 py-4 bg-[#E53935] text-white rounded-xl font-bold text-[12px] uppercase shadow-lg shadow-red-500/10 hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
               >
                  {isMatching ? <RefreshCcw size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
                  {isMatching ? "Finding Matches..." : "Find Best Partners"}
               </button>
            </div>

            <div className="space-y-4">
               <p className="text-[11px] font-bold uppercase text-slate-400 tracking-normal">Common Needs</p>
               <div className="flex flex-wrap gap-2">
                  {["Marketing", "Tech Help", "Money", "Hiring", "Legal"].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setMyNeed(tag)}
                      className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 hover:border-[#E53935] hover:text-[#E53935] transition-all shadow-sm"
                    >
                      {tag}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="mt-auto pt-10">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <Lightbulb size={32} className="text-[#E53935] mb-6" />
                  <h5 className="text-[20px] font-bold leading-tight mb-4 uppercase">How it works</h5>
                  <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-0">We look at what you need and find the best people in our network to help you grow.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Main Results Section */}
      <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
         <div className="flex items-center justify-between mb-10 px-2">
            <div>
               <h4 className="text-[14px] font-bold text-slate-900 uppercase tracking-normal">Suggested Partners</h4>
               <p className="text-[12px] text-slate-400 font-medium">{matchedPeople.length} people can help you right now</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center bg-slate-200/50 p-1 rounded-xl">
                  <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white text-[#E53935] shadow-sm" : "text-slate-400")}>
                    <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white text-[#E53935] shadow-sm" : "text-slate-400")}>
                    <List size={18} />
                  </button>
               </div>
            </div>
         </div>

         <div className={cn(
           "gap-8 pb-32",
           viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2" : "flex flex-col"
         )}>
            {matchedPeople.map(person => (
              <div key={person.id} className="bg-white rounded-[2rem] border border-[#EBEFF1] p-8 hover:shadow-xl transition-all duration-500 group relative">
                  <div className="flex items-start gap-6 mb-8">
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm">
                        <img src={person.avatar} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h3 className="text-[20px] font-bold text-slate-900 leading-tight tracking-normal">{person.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                           <p className="text-[11px] font-bold text-[#E53935] uppercase tracking-normal">{person.role}</p>
                           <span className="w-1 h-1 rounded-full bg-slate-300" />
                           <div className="px-2 py-0.5 bg-red-50 rounded-md">
                              <p className="text-[10px] font-bold text-[#E53935] uppercase tracking-normal">{person.match}% Match</p>
                           </div>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium mt-3 flex items-center gap-1.5 ">
                           <MapPin size={14} className="text-slate-300" /> {person.loc}
                        </p>
                     </div>
                  </div>

                 <div className="space-y-6 mb-10">
                    <div>
                       <p className="text-[10px] font-bold uppercase text-slate-400 tracking-normal mb-3">Skills for you</p>
                       <div className="flex flex-wrap gap-2">
                          {person.offers.map(offer => (
                            <span key={offer} className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold border border-green-100">{offer}</span>
                          ))}
                       </div>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                       <div className="w-10 h-10 bg-red-50 text-[#E53935] rounded-xl flex items-center justify-center shrink-0">
                          <Sparkles size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Why we picked them</p>
                          <p className="text-[13px] font-bold text-slate-700 leading-tight">{person.aiReason}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button 
                       onClick={() => { setSelectedDeal(person); setIsModalOpen(true); }}
                       className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-normal shadow-lg transition-all hover:bg-[#E53935]"
                    >
                       Connect
                    </button>
                    <button onClick={() => alert(`Starting a chat with ${person.name}...`)} className="w-14 h-14 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-[#E53935] transition-all">
                       <MessageCircle size={24} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <DealEngine 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        deal={selectedDeal}
      />
    </div>
  );
}
