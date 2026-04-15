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
    aiReason: "Matches your need for Tech Help perfectly."
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
    aiReason: "Expert in Marketing which you currently need."
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
    aiReason: "Provides Legal Help for your new project startup."
  },
];

export default function Match() {
  const [activeTab, setActiveTab] = useState<"Professionals" | "Deals">("Professionals");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [myNeed, setMyNeed] = useState("");
  const [isMatching, setIsMatching] = useState(false);

  const matchedPeople = useMemo(() => {
    if (!myNeed) return INITIAL_MATCHES;
    // Simple mock AI matching logic
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
      
      {/* Column 1: AI Needs Terminal */}
      <div className="w-full xl:w-[400px] p-10 border-r border-[#EBEFF1] bg-white flex flex-col h-full overflow-y-auto no-scrollbar">
         <div className="mb-12">
            <div className="flex items-center gap-3 text-primary mb-4">
               <Sparkles size={24} className="fill-current" />
               <span className="text-[12px] font-black uppercase tracking-widest italic">AI Matching</span>
            </div>
            <h2 className="text-3xl font-black uppercase italic leading-tight mb-4">Find Help<br />Based on Needs</h2>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
               Describe what you need right now, and our system will find the best partners for you.
            </p>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-inner">
               <label className="text-[11px] font-black uppercase text-slate-400 block mb-4 tracking-widest">What do you need?</label>
               <textarea 
                 value={myNeed}
                 onChange={(e) => setMyNeed(e.target.value)}
                 placeholder="e.g. I need marketing help for my app" 
                 className="w-full bg-transparent text-[16px] font-bold placeholder:text-slate-300 outline-none resize-none min-h-[120px]"
               />
               <button 
                 onClick={handleAIMatch}
                 className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-black text-[12px] uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
               >
                  {isMatching ? <RefreshCcw size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
                  {isMatching ? "Finding Matches..." : "Match by Needs"}
               </button>
            </div>

            <div className="space-y-4">
               <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Popular Needs</p>
               <div className="flex flex-wrap gap-2">
                  {["Marketing", "Tech Help", "Funding", "Hiring", "Legal Help"].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setMyNeed(tag)}
                      className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm"
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
                  <Lightbulb size={32} className="text-primary mb-6" />
                  <h5 className="text-[20px] font-black leading-tight mb-4 uppercase italic">Your Synergy Score</h5>
                  <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-0">Matches based on needs are 3x more likely to lead to a successful partnership.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Column 2: Results Display */}
      <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
         <div className="flex items-center justify-between mb-10 px-2">
            <div>
               <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Recommended Partners</h4>
               <p className="text-[12px] text-slate-400 font-medium">{matchedPeople.length} people can help with your needs</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center bg-slate-200/50 p-1 rounded-xl">
                  <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>
                    <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>
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
              <div key={person.id} className="bg-white rounded-[2.5rem] border border-[#EBEFF1] p-10 hover:shadow-2xl transition-all duration-500 group relative">
                 <div className="absolute top-10 right-10">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-black text-[11px] border border-primary/10">
                       {person.match}% Synergy
                    </div>
                 </div>

                 <div className="flex items-start gap-6 mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                       <img src={person.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <h3 className="text-[18px] font-black text-slate-900 leading-tight">{person.name}</h3>
                       <p className="text-[11px] font-bold text-primary uppercase tracking-widest mt-1">{person.role}</p>
                       <p className="text-[12px] text-slate-400 font-medium mt-2 flex items-center gap-2">
                          <MapPin size={14} /> {person.loc}
                       </p>
                    </div>
                 </div>

                 <div className="space-y-6 mb-10">
                    <div>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Can help you with</p>
                       <div className="flex flex-wrap gap-2">
                          {person.offers.map(offer => (
                            <span key={offer} className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold border border-green-100">{offer}</span>
                          ))}
                       </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center gap-4">
                       <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                          <Sparkles size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">AI Suggestion</p>
                          <p className="text-[13px] font-bold text-slate-700 leading-tight">{person.aiReason}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button 
                       onClick={() => { setSelectedDeal(person); setIsModalOpen(true); }}
                       className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all"
                    >
                       Connect
                    </button>
                    <button className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-all">
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
