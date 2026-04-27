"use client";

import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Users, 
  TrendingUp, 
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
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CommunitiesPage() {
  return (
    <ProtectedRoute>
      <CommunitiesContent />
    </ProtectedRoute>
  );
}

function CommunitiesContent() {
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
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-100 pt-12 pb-10 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#292828]  mb-3">Communities</h1>
            <p className="text-slate-200 font-bold text-base sm:text-lg uppercase ">Join focused spaces that match your goals</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="h-14 px-8 bg-[#292828] text-white rounded-lg flex items-center gap-3 text-xs font-black uppercase  hover:bg-[#E53935] transition-all shadow-xl active:scale-95 shrink-0"
            >
              <Plus size={18} /> Create Community
            </button>
          </div>
        </div>
      </header>

      {/* CONTROLS SECTION */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Search by community name or topic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 bg-white border border-slate-100 rounded-lg pl-16 pr-6 text-sm font-bold text-[#292828] focus:border-[#E53935] outline-none transition-all shadow-sm"
            />
          </div>
          <button className="h-16 px-6 bg-white border border-slate-100 text-[#292828] rounded-lg flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* FEATURED SECTION */}
      <section className="mt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
          <div className="flex items-center gap-3 text-[#E53935]">
            <Sparkles size={20} fill="currentColor" />
            <h2 className="text-xs font-black uppercase ">Featured Communities</h2>
          </div>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-6 px-6 lg:px-10 pb-10 max-w-7xl mx-auto">
          {featuredCommunities.map((comm) => (
            <div 
              key={comm.id}
              onClick={() => router.push(`/communities/${comm.id}`)}
              className="min-w-[300px] sm:min-w-[340px] md:min-w-[420px] bg-white rounded-lg sm:rounded-lg p-6 sm:p-8 border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="h-16 w-16 bg-slate-50 rounded-lg flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all shadow-sm">
                  <Users size={32} />
                </div>
                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase ">
                  {comm.activity}
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#292828] mb-4 group-hover:text-[#E53935] transition-colors">{comm.name}</h3>
              <p className="text-sm font-bold text-slate-200 leading-relaxed mb-8 line-clamp-2">{comm.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {comm.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-300 rounded-lg text-[9px] font-black uppercase">{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-slate-300" />
                  <span className="text-xs font-black text-[#292828]">{comm.memberCount.toLocaleString()} Members</span>
                </div>
                <button className="h-10 px-6 bg-[#292828] text-white rounded-lg text-[10px] font-black uppercase  group-hover:bg-[#E53935] transition-all">Join</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY TABS & MAIN LIST */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 mt-12">
        <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "h-12 px-6 sm:px-8 rounded-lg text-[10px] sm:text-[11px] font-black uppercase  transition-all shrink-0",
                activeTab === cat 
                  ? "bg-[#292828] text-white shadow-xl scale-105" 
                  : "bg-white border border-slate-100 text-slate-200 hover:text-[#292828] hover:border-[#292828]/20 shadow-sm"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCommunities.map((comm) => (
            <CommunityCard key={comm.id} community={comm} />
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="py-32 text-center bg-white rounded-lg border border-slate-50 shadow-sm">
            <div className="h-24 w-24 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-200 mb-8">
              <Globe size={48} />
            </div>
            <h3 className="text-2xl font-black text-[#292828] uppercase ">No Communities Found</h3>
            <p className="text-slate-200 font-bold mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>

      {/* DISCOVERY LOGIC - SMART SECTIONS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-32 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#292828] uppercase ">Recommended for You</h2>
            <button className="text-[10px] font-black text-[#E53935] uppercase  hover:underline">See All</button>
          </div>
          <div className="space-y-4">
            {MOCK_COMMUNITIES.slice(0, 3).map(comm => (
              <div key={comm.id} className="p-6 bg-white border border-slate-100 rounded-lg flex items-center justify-between group cursor-pointer hover:border-[#E53935]/20 hover:shadow-lg transition-all">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 bg-slate-50 rounded-lg flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#292828] group-hover:text-[#E53935] transition-colors">{comm.name}</h4>
                    <p className="text-xs font-bold text-slate-200 uppercase">{comm.category} • {comm.memberCount} Members</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-[#E53935] group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#292828] uppercase ">Near Bangalore</h2>
            <button className="text-[10px] font-black text-[#E53935] uppercase  hover:underline">See All</button>
          </div>
          <div className="space-y-4">
            {MOCK_COMMUNITIES.slice(3, 6).map(comm => (
              <div key={comm.id} className="p-6 bg-white border border-slate-100 rounded-lg flex items-center justify-between group cursor-pointer hover:border-[#E53935]/20 hover:shadow-lg transition-all">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 bg-slate-50 rounded-lg flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#292828] group-hover:text-[#E53935] transition-colors">{comm.name}</h4>
                    <p className="text-xs font-bold text-slate-200 uppercase">{comm.category} • {comm.memberCount} Members</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-[#E53935] group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <CreateCommunityFlow onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}

function CommunityCard({ community }: { community: Community }) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/communities/${community.id}`)}
      className="bg-white rounded-lg p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="h-14 w-14 bg-slate-50 rounded-lg flex items-center justify-center text-[#292828] group-hover:bg-[#E53935] group-hover:text-white transition-all shadow-sm">
          <Users size={24} />
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[9px] font-black uppercase ",
          community.activity === "Active" ? "bg-emerald-50 text-emerald-600" :
          community.activity === "Trending" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
        )}>
          {community.activity}
        </div>
      </div>
      <h3 className="text-2xl font-black text-[#292828] mb-4 group-hover:text-[#E53935] transition-colors">{community.name}</h3>
      <p className="text-sm font-bold text-slate-200 leading-relaxed mb-8 line-clamp-3">{community.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-10 mt-auto">
        {community.tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-300 rounded-lg text-[9px] font-black uppercase">{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-slate-300" />
          <span className="text-xs font-black text-[#292828]">{community.memberCount.toLocaleString()}</span>
        </div>
        <button className="h-11 px-6 bg-white border border-slate-200 text-[#292828] rounded-lg text-[10px] font-black uppercase  hover:bg-[#292828] hover:text-white hover:border-[#292828] transition-all">Join</button>
      </div>
    </div>
  );
}

function CreateCommunityFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Hiring",
    tags: "",
    visibility: "Public"
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-10">
      <div className="absolute inset-0 bg-[#292828]/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-lg sm:rounded-lg shadow-4xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="bg-[#292828] p-6 sm:p-10 text-white relative">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <span className="text-[10px] font-black uppercase  opacity-40">Step {step} of 3</span>
            <button onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">×</button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase ">Create Community</h2>
          <div className="flex gap-2 mt-6 sm:mt-8">
            {[1, 2, 3].map(s => (
              <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-500", s <= step ? "bg-[#E53935]" : "bg-white/10")} />
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-200 ml-2">Community Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Bangalore Founders Network" 
                  className="w-full h-16 bg-slate-50 border border-slate-100 rounded-lg px-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-200 ml-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="What is the primary intent of this community?" 
                  className="w-full h-32 bg-slate-50 border border-slate-100 rounded-lg p-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-200 ml-2">Primary Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Hiring", "Partnership", "Leads", "Meetup"].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setFormData({...formData, category: cat})}
                      className={cn(
                        "h-14 rounded-lg text-[11px] font-black uppercase  transition-all",
                        formData.category === cat ? "bg-[#292828] text-white shadow-xl" : "bg-slate-50 border border-slate-100 text-slate-200 hover:text-[#292828]"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-200 ml-2">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  placeholder="e.g. Tech, Scaling, B2B" 
                  className="w-full h-16 bg-slate-50 border border-slate-100 rounded-lg px-6 text-sm font-bold text-[#292828] outline-none focus:border-[#E53935] transition-all"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-200 ml-2">Visibility</label>
                <div className="space-y-4">
                  <div 
                    onClick={() => setFormData({...formData, visibility: "Public"})}
                    className={cn(
                      "p-6 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between group",
                      formData.visibility === "Public" ? "border-[#E53935] bg-red-50/30" : "border-slate-100 hover:border-[#292828]/20"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center transition-all", formData.visibility === "Public" ? "bg-[#E53935] text-white" : "bg-slate-100 text-[#292828]")}>
                        <Globe size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-[#292828] uppercase ">Public</h4>
                        <p className="text-xs font-bold text-slate-200 uppercase">Anyone can join instantly</p>
                      </div>
                    </div>
                    <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all", formData.visibility === "Public" ? "border-[#E53935] bg-[#E53935]" : "border-slate-200")}>
                      <div className="h-2 w-2 bg-white rounded-full" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setFormData({...formData, visibility: "Private"})}
                    className={cn(
                      "p-6 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between group",
                      formData.visibility === "Private" ? "border-[#E53935] bg-red-50/30" : "border-slate-100 hover:border-[#292828]/20"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center transition-all", formData.visibility === "Private" ? "bg-[#E53935] text-white" : "bg-slate-100 text-[#292828]")}>
                        <Lock size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-[#292828] uppercase ">Private</h4>
                        <p className="text-xs font-bold text-slate-200 uppercase">Approval required to join</p>
                      </div>
                    </div>
                    <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all", formData.visibility === "Private" ? "border-[#E53935] bg-[#E53935]" : "border-slate-200")}>
                      <div className="h-2 w-2 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-12">
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="h-16 px-10 bg-slate-100 text-[#292828] rounded-lg text-xs font-black uppercase  hover:bg-slate-200 transition-all"
              >
                Back
              </button>
            )}
            <button 
              onClick={step === 3 ? onClose : nextStep}
              className="flex-1 h-16 bg-[#292828] text-white rounded-lg text-xs font-black uppercase  hover:bg-[#E53935] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {step === 3 ? "Create Community" : "Next Step"} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
