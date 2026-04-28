"use client";

import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Users, 
  Zap, 
  ChevronRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Lock,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_COMMUNITIES } from "@/data/communities";
import { Community, CommunityCategory } from "@/types/communities";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";
import TerminalLayout from "@/components/layout/TerminalLayout";

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState<CommunityCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) analytics.trackScreen('COMMUNITIES', user.id);
  }, [user]);

  if (!user) return null;

  const categories: CommunityCategory[] = ["All", "Hiring", "Partnership", "Leads", "Meetup", "Local"];

  const filteredCommunities = MOCK_COMMUNITIES.filter(comm => {
    const matchesSearch = comm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         comm.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || comm.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const featuredCommunities = MOCK_COMMUNITIES.filter(c => c.isFeatured);

  return (
    <TerminalLayout
      topbarChildren={
        <div className="flex items-center gap-6">
           <div className="flex p-1 bg-[#F5F5F7] rounded-[10px] border border-black/[0.03]">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={cn(
                    "px-6 h-9 rounded-[8px] text-[10px] font-black uppercase tracking-widest transition-all relative",
                    activeTab === cat ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
                  )}
                >
                  {cat}
                </button>
              ))}
           </div>
           <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="h-10 px-6 bg-black text-white rounded-[10px] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-lg active:scale-95"
            >
              <Plus size={14} /> Create
            </button>
        </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* SEARCH SECTION */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/10" size={20} />
            <input 
              type="text" 
              placeholder="Search by community name or topic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 bg-white border border-black/[0.03] rounded-[10px] pl-16 pr-6 text-sm font-bold text-[#1D1D1F] focus:border-[#E53935]/20 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="h-16 px-6 bg-white border border-black/[0.03] text-[#1D1D1F] rounded-[10px] flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm shrink-0">
            <Filter size={18} />
          </button>
        </div>

        {/* FEATURED SECTION */}
        <section>
          <div className="flex items-center gap-3 text-[#E53935] mb-8">
            <Sparkles size={20} fill="currentColor" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20">Featured Communities</h2>
          </div>
          
          <div className="flex overflow-x-auto no-scrollbar gap-6 pb-6">
            {featuredCommunities.map((comm) => (
              <div 
                key={comm.id}
                onClick={() => router.push(`/communities/${comm.id}`)}
                className="min-w-[340px] md:min-w-[420px] bg-white rounded-[10px] p-8 border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="h-14 w-14 bg-[#F5F5F7] rounded-[10px] flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#E53935] group-hover:text-white transition-all">
                    <Users size={24} />
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {comm.activity}
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#1D1D1F] mb-4 uppercase font-outfit">{comm.name}</h3>
                <p className="text-[13px] font-bold text-black/40 leading-relaxed mb-8 line-clamp-2 uppercase">{comm.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {comm.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-[#F5F5F7] text-black/20 rounded-[8px] text-[8px] font-black uppercase tracking-widest">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-black/[0.03]">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-black/10" />
                    <span className="text-[11px] font-black text-[#1D1D1F] uppercase">{comm.memberCount.toLocaleString()} Members</span>
                  </div>
                  <button className="h-10 px-6 bg-black text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest group-hover:bg-[#E53935] transition-all">Join</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN LIST */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((comm) => (
              <CommunityCard key={comm.id} community={comm} />
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="py-32 text-center bg-white rounded-[10px] border border-black/[0.03]">
              <div className="h-20 w-20 bg-[#F5F5F7] rounded-[10px] mx-auto flex items-center justify-center text-black/10 mb-8">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-black text-[#1D1D1F] uppercase font-outfit">No Communities Found</h3>
              <p className="text-black/20 text-[11px] font-black uppercase tracking-widest mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>

        {/* DISCOVERY LOGIC - SMART SECTIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-black/[0.03]">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20">Recommended</h2>
              <button className="text-[10px] font-black text-[#E53935] uppercase tracking-widest hover:underline">See All</button>
            </div>
            <div className="space-y-3">
              {MOCK_COMMUNITIES.slice(0, 3).map(comm => (
                <div key={comm.id} className="p-5 bg-white border border-black/[0.03] rounded-[10px] flex items-center justify-between group cursor-pointer hover:border-black/[0.08] hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#F5F5F7] rounded-[10px] flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#E53935] group-hover:text-white transition-all">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black text-[#1D1D1F] uppercase font-outfit">{comm.name}</h4>
                      <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">{comm.category} • {comm.memberCount} Members</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-black/10 group-hover:text-[#E53935] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20">Nearby Locations</h2>
              <button className="text-[10px] font-black text-[#E53935] uppercase tracking-widest hover:underline">See All</button>
            </div>
            <div className="space-y-3">
              {MOCK_COMMUNITIES.slice(3, 6).map(comm => (
                <div key={comm.id} className="p-5 bg-white border border-black/[0.03] rounded-[10px] flex items-center justify-between group cursor-pointer hover:border-black/[0.08] hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#F5F5F7] rounded-[10px] flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#E53935] group-hover:text-white transition-all">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black text-[#1D1D1F] uppercase font-outfit">{comm.name}</h4>
                      <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">{comm.category} • {comm.memberCount} Members</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-black/10 group-hover:text-[#E53935] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {isCreateModalOpen && (
        <CreateCommunityFlow onClose={() => setIsCreateModalOpen(false)} />
      )}
    </TerminalLayout>
  );
}

function CommunityCard({ community }: { community: Community }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/communities/${community.id}`)}
      className="bg-white rounded-[10px] p-8 border border-black/[0.03] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="h-14 w-14 bg-[#F5F5F7] rounded-[10px] flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#E53935] group-hover:text-white transition-all shadow-sm">
          <Users size={24} />
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
          community.activity === "Active" ? "bg-emerald-50 text-emerald-600" :
          community.activity === "Trending" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
        )}>
          {community.activity}
        </div>
      </div>
      <h3 className="text-xl font-black text-[#1D1D1F] mb-4 uppercase font-outfit">{community.name}</h3>
      <p className="text-[13px] font-bold text-black/40 leading-relaxed mb-8 line-clamp-3 uppercase">{community.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-10 mt-auto">
        {community.tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-[#F5F5F7] text-black/20 rounded-[8px] text-[8px] font-black uppercase tracking-widest">{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-black/[0.03]">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-black/10" />
          <span className="text-[11px] font-black text-[#1D1D1F] uppercase">{community.memberCount.toLocaleString()}</span>
        </div>
        <button className="h-10 px-6 bg-white border border-black/[0.08] text-[#1D1D1F] rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Join</button>
      </div>
    </div>
  );
}

function CreateCommunityFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", description: "", category: "Hiring", tags: "", visibility: "Public" });
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 lg:p-10">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl rounded-[10px] shadow-4xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar border border-black/[0.05]">
        <div className="bg-black p-10 text-white relative">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Step {step} of 3</span>
            <button onClick={onClose} className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">×</button>
          </div>
          <h2 className="text-3xl font-black uppercase font-outfit">Create Community</h2>
          <div className="flex gap-2 mt-8">
            {[1, 2, 3].map(s => (
              <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-500", s <= step ? "bg-[#E53935]" : "bg-white/10")} />
            ))}
          </div>
        </div>
        <div className="p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-black/20 ml-2">Community Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Bangalore Founders Network" className="w-full h-16 bg-[#F5F5F7] border border-black/[0.03] rounded-[10px] px-6 text-sm font-bold text-black outline-none focus:bg-white focus:border-[#E53935]/20 transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-black/20 ml-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="What is the primary intent?" className="w-full h-32 bg-[#F5F5F7] border border-black/[0.03] rounded-[10px] p-6 text-sm font-bold text-black outline-none focus:bg-white focus:border-[#E53935]/20 transition-all resize-none" />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-black/20 ml-2">Primary Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Hiring", "Partnership", "Leads", "Meetup"].map(cat => (
                    <button key={cat} onClick={() => setFormData({...formData, category: cat})} className={cn("h-14 rounded-[10px] text-[11px] font-black uppercase tracking-widest transition-all", formData.category === cat ? "bg-black text-white shadow-xl" : "bg-[#F5F5F7] border border-black/[0.03] text-black/40 hover:text-black")}>{cat}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-black/20 ml-2">Tags (Comma separated)</label>
                <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="e.g. Tech, Scaling, B2B" className="w-full h-16 bg-[#F5F5F7] border border-black/[0.03] rounded-[10px] px-6 text-sm font-bold text-black outline-none focus:bg-white focus:border-[#E53935]/20 transition-all" />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-black/20 ml-2">Visibility</label>
                <div className="space-y-4">
                  {["Public", "Private"].map(v => (
                    <div key={v} onClick={() => setFormData({...formData, visibility: v})} className={cn("p-6 rounded-[10px] border-2 transition-all cursor-pointer flex items-center justify-between group", formData.visibility === v ? "border-[#E53935] bg-red-50/10" : "border-black/[0.03] hover:border-black/[0.1]")}>
                      <div className="flex items-center gap-5">
                        <div className={cn("h-12 w-12 rounded-[10px] flex items-center justify-center transition-all", formData.visibility === v ? "bg-[#E53935] text-white" : "bg-[#F5F5F7] text-black/20")}>{v === "Public" ? <Globe size={20} /> : <Lock size={20} />}</div>
                        <div><h4 className="text-[15px] font-black text-black uppercase font-outfit">{v}</h4><p className="text-[10px] font-black text-black/20 uppercase">{v === "Public" ? "Anyone can join instantly" : "Approval required to join"}</p></div>
                      </div>
                      <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all", formData.visibility === v ? "border-[#E53935] bg-[#E53935]" : "border-black/[0.05]")}><div className="h-2 w-2 bg-white rounded-full" /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 mt-12">
            {step > 1 && <button onClick={prevStep} className="h-16 px-10 bg-[#F5F5F7] text-black rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-all">Back</button>}
            <button onClick={step === 3 ? onClose : nextStep} className="flex-1 h-16 bg-black text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-[#E53935] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">{step === 3 ? "Create Community" : "Next Step"} <ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
