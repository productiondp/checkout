"use client";

import React, { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Tag, 
  ArrowRight, 
  Zap, 
  Target, 
  Plus, 
  CheckCircle2, 
  Filter, 
  LayoutGrid, 
  TrendingUp, 
  BadgeCheck,
  Package,
  Truck,
  Building2,
  ChevronRight,
  MoreHorizontal,
  X,
  Minus,
  ShieldCheck,
  CreditCard,
  Heart,
  MessageCircle,
  Camera,
  UploadCloud,
  MapPin,
  Users,
  ArrowUpRight,
  BarChart3,
  Check,
  Clock,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import PostModal from "@/components/modals/PostModal";

export default function PremiumMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [orderStep, setOrderStep] = useState<"details" | "checkout" | "success">("details");
  const [quantity, setQuantity] = useState(1);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const handlePostSuccess = (newPost: any) => {
    console.log("Post Created from Marketplace:", newPost);
    setIsPosting(false);
  };

  const [items, setItems] = useState<any[]>([]);

  const filteredItems = items.filter(item => 
    (activeCategory === "All" || item.category === activeCategory) &&
    (item.item.toLowerCase().includes(search.toLowerCase())) &&
    (item.image)
  ).sort((a, b) => {
    if (sortBy === "Price (Low)") {
       return parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, ""));
    }
    if (sortBy === "Price (High)") {
       return parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, ""));
    }
    return 0;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white lg:bg-[#FDFDFF] selection:bg-[#E53935]/10 overscroll-none">
      
      <main className="flex-1 min-h-screen lg:border-r border-[#292828]/10 overflow-y-auto no-scrollbar">
         {/* 2. EXPLORATION HUB */}
         <div className="px-6 lg:px-12 py-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
               <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                  {["All", "Industrial", "Logistics", "Tech", "Supply"].map(cat => (
                    <button 
                     key={cat} 
                     onClick={() => setActiveCategory(cat)}
                     className={cn(
                       "px-6 py-3 rounded-xl text-[11px] font-black uppercase transition-all whitespace-nowrap border",
                       activeCategory === cat ? "bg-[#E53935] border-[#E53935] text-white shadow-xl shadow-red-500/20" : "bg-white border-[#292828]/10 text-[#292828] hover:text-[#292828]"
                     )}
                    >
                       {cat}
                    </button>
                  ))}
               </div>

               <div className="flex flex-col md:flex-row gap-4 w-full lg:max-w-2xl">
                  <div className="relative flex-1">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#292828]/40" size={20} />
                     <input 
                       type="text" 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       placeholder="Search for inventory..." 
                       className="w-full h-16 bg-white border border-[#292828]/10 rounded-2xl pl-16 pr-6 text-[15px] font-bold outline-none focus:border-[#E53935]/20 focus:ring-8 focus:ring-red-500/5 shadow-2xl shadow-slate-200/20 transition-all" 
                     />
                  </div>
                  
                  <div className="relative">
                     <button 
                       onClick={() => setIsSortOpen(!isSortOpen)}
                       className="h-16 px-8 bg-white border border-[#292828]/10 rounded-2xl flex items-center gap-4 text-[11px] font-black uppercase text-[#292828] shadow-2xl shadow-slate-200/20 active:scale-95 transition-all"
                     >
                        <span>Sort by: <span className="text-[#E53935] ml-1">{sortBy}</span></span>
                        <ChevronRight className={cn("transition-transform duration-300", isSortOpen ? "rotate-90" : "")} size={14} />
                     </button>

                     {isSortOpen && (
                        <div className="absolute top-full mt-2 left-0 w-[220px] bg-white border border-[#292828]/10 rounded-2xl shadow-[0_40px_1000px_rgba(0,0,0,0.18)] z-[100] p-2 animate-in fade-in slide-in-from-top-4 duration-500 ring-1 ring-[#292828]/5">
                           {["Recommended", "Price (Low)", "Price (High)"].map(s => (
                              <button 
                                 key={s}
                                 onClick={() => { setSortBy(s); setIsSortOpen(false); }}
                                 className={cn(
                                    "w-full px-5 py-3.5 rounded-xl text-left text-[10px] font-black uppercase transition-all flex items-center justify-between group",
                                    sortBy === s ? "bg-[#292828] text-white shadow-xl" : "text-[#292828] hover:bg-[#292828]/5"
                                 )}
                              >
                                 {s}
                                 {sortBy === s && <div className="h-1 w-1 bg-[#E53935] rounded-full" />}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* VIEW TOGGLE */}
                  <div className="flex bg-white border border-[#292828]/10 rounded-2xl p-1.5 shadow-2xl shadow-slate-200/20 ml-auto">
                     <button 
                       onClick={() => setViewMode("grid")}
                       className={cn(
                         "p-3 rounded-xl transition-all",
                         viewMode === "grid" ? "bg-[#292828] text-white" : "text-[#292828] hover:bg-[#292828]/5"
                       )}
                     >
                        <LayoutGrid size={20} />
                     </button>
                     <button 
                       onClick={() => setViewMode("list")}
                       className={cn(
                         "p-3 rounded-xl transition-all",
                         viewMode === "list" ? "bg-[#292828] text-white" : "text-[#292828] hover:bg-[#292828]/5"
                       )}
                     >
                        <MoreHorizontal size={20} />
                     </button>
                  </div>
               </div>
            </div>

            {/* WHOLESALE GRID */}
            {/* PRODUCT DISPLAY */}
            {filteredItems.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-40">
                      {filteredItems.map(item => (
                        <div key={item.id} className="group relative bg-white transition-all duration-500 hover:-translate-y-2">
                           <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 border border-[#292828]/5 shadow-sm transition-all group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] group-hover:border-[#E53935]/10">
                              <img 
                                src={item.image} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                alt={item.item} 
                              />
                              
                              <div className="absolute top-4 left-4 flex flex-col gap-2">
                                 <div className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-[#E53935] shadow-sm border border-slate-100">
                                    {item.category}
                                 </div>
                              </div>

                              <button 
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    setFavorites(prev => prev.includes(item.id) ? prev.filter(favId => favId !== item.id) : [...prev, item.id]);
                                 }}
                                 className={cn(
                                    "absolute top-4 right-4 h-10 w-10 rounded-xl flex items-center justify-center transition-all z-20 shadow-xl",
                                    favorites.includes(item.id) ? "bg-[#E53935] text-white" : "bg-white/95 text-[#292828] hover:bg-[#E53935] hover:text-white"
                                 )}
                              >
                                 <Heart size={18} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                              </button>

                              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                                 <button 
                                    onClick={() => {
                                       setSelectedItem(item);
                                       setOrderStep("details");
                                       setQuantity(parseInt(item.cap) || 1);
                                    }}
                                    className="w-full h-12 bg-[#292828] text-white rounded-xl font-black text-[10px] uppercase shadow-2xl hover:bg-[#E53935] transition-all active:scale-95"
                                 >
                                    Purchase Now
                                 </button>
                              </div>
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>

                           <div className="mt-4 px-1">
                              <div className="flex justify-between items-start mb-1">
                                 <h3 className="line-clamp-1">{item.item}</h3>
                                 <p className="text-2xl font-black text-[#111111]">{item.price}</p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                    <Package size={12} /> Min Order: {item.cap}
                                 </p>
                                 <div className="flex items-center gap-1">
                                    <BadgeCheck size={14} className="text-[#E53935]" />
                                    <span className="text-[9px] font-black text-[#292828] uppercase">Certified</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                ) : (
                   <div className="flex flex-col gap-4 mb-40">
                      {filteredItems.map(item => (
                        <div key={item.id} className="group flex items-center gap-8 bg-white p-6 rounded-[1.5rem] border border-[#292828]/5 hover:border-[#E53935]/20 hover:shadow-xl transition-all">
                           <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                              <img src={item.image} className="w-full h-full object-cover" alt={item.item} />
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                 <span className="px-2 py-0.5 bg-[#E53935]/5 text-[#E53935] text-[8px] font-black uppercase rounded">{item.category}</span>
                                 <h3>{item.item}</h3>
                              </div>
                              <p className="text-xs font-bold text-slate-400 uppercase">Min Order: {item.cap} Units</p>
                           </div>
                           <div className="text-right mr-10">
                              <p className="text-[10px] font-black text-[#292828]/40 uppercase mb-1">Price / Unit</p>
                              <p className="text-3xl font-black text-[#292828]">{item.price}</p>
                           </div>
                           <button 
                               onClick={() => {
                                  setSelectedItem(item);
                                  setOrderStep("details");
                                  setQuantity(parseInt(item.cap) || 1);
                               }}
                               className="h-16 px-10 bg-[#292828] text-white rounded-[1rem] font-black text-[11px] uppercase shadow-2xl hover:bg-[#E53935] transition-all">Order Now</button>
                        </div>
                      ))}
                   </div>
                )}
              </>
            ) : (
               <div className="flex flex-col items-center justify-center py-40 bg-[#292828]/5 rounded-[2.6rem] border-2 border-dashed border-[#292828]/10 italic text-[#292828]/40 mb-40">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p className="text-[14px] font-black uppercase tracking-widest">No Inventory Found</p>
                  <p className="text-[11px] font-medium mt-2">The marketplace is currently waiting for new business listings.</p>
               </div>
            )}
         </div>

         {/* 3. PROMOTION FOOTER */}
         <div className="mt-20 p-12 bg-[#292828] rounded-[2.6rem] text-white relative overflow-hidden group mx-6 lg:mx-12 mb-20">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
               <div className="max-w-xl">
                  <h2 className="mb-6 leading-tight">Sell your <span className="text-[#E53935]">Items</span>.</h2>
                  <p className="text-white/50">Earn money by selling raw materials or equipment you don't use.</p>
               </div>
               <button 
                  onClick={() => setIsSellModalOpen(true)}
                  className="px-12 py-6 bg-[#E53935] text-white rounded-[1.3rem] font-black text-[12px] uppercase shadow-4xl animate-pulse hover:animate-none active:scale-95 transition-all"
               >
                  Start Selling
               </button>
            </div>
            < Zap size={300} className="absolute -right-20 -bottom-20 text-white/[0.03] rotate-12 group-hover:scale-110 transition-transform duration-[4s]" />
         </div>
      </main>

      {/* MARKETPLACE CONTEXT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[380px] xl:w-[420px] h-screen sticky top-0 bg-white p-8 gap-10 overflow-y-auto no-scrollbar selection:bg-[#E53935]/10">
         <div className="flex items-center justify-between">
            <p className="subheading-editorial !text-slate-400">Trade Intelligence</p>
            <button className="h-10 w-10 bg-[#292828]/5 rounded-xl flex items-center justify-center text-[#292828] hover:bg-[#E53935] hover:text-white transition-all">
               <Bell size={18} />
            </button>
         </div>

         {/* 1. ACTIVE ORDERS */}
         <div className="space-y-6">
            <p className="subheading-editorial !text-slate-400">Active Shipments</p>
            <div className="space-y-3">
               {[
                 { item: "Steel Rollers", id: "OR-9912", status: "In Transit", date: "Delivery Tomorrow" },
                 { item: "Control Panels", id: "OR-8841", status: "Processing", date: "ETA: 3 Days" }
               ].map((order, i) => (
                 <div key={i} className="p-5 bg-white border border-[#292828]/10 rounded-3xl hover:border-[#E53935]/30 hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                       <span className="px-3 py-1 bg-[#292828]/5 rounded-lg text-[9px] font-black text-[#292828]/40 uppercase">{order.id}</span>
                       <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                          <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" /> {order.status}
                       </span>
                    </div>
                    <p className="text-base font-black text-[#292828] uppercase mb-1">{order.item}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#E53935] uppercase">
                       <Clock size={12} /> {order.date}
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* 2. PRICE FORECAST */}
         <div className="p-8 bg-[#292828] rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/20 blur-3xl" />
            <BarChart3 size={150} className="absolute -right-10 -bottom-10 text-white/[0.03] group-hover:scale-110 transition-transform duration-[5s]" />
            
            <div className="relative z-10">
               <p className="text-[10px] font-black text-[#E53935] uppercase tracking-widest mb-6">Price Alert: Industrial Steel</p>
               <h3>Market Spike <span className="text-emerald-400">↑ 8%</span></h3>
               <p className="text-[11px] font-medium text-white/50 uppercase leading-relaxed mb-8">
                  Bulk order prices for raw materials are forecasted to rise by 12% in the next quarter. Secure inventory now.
               </p>
               <button className="w-full h-12 bg-[#E53935] text-white rounded-xl text-[10px] font-black uppercase shadow-xl hover:bg-white hover:text-[#E53935] transition-all">Audit Raw Materials</button>
            </div>
         </div>

         {/* 3. SAVED INVENTORY */}
         <div className="space-y-6">
            <p className="subheading-editorial !text-slate-400">Saved for Later</p>
            <div className="grid grid-cols-2 gap-4">
               {/* Saved items will appear here */}
            </div>
         </div>

         {/* 4. SELLER STATS */}
         <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center gap-5">
            <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
               <ShieldCheck size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1.5">Seller Rating</p>
               <p className="text-xl font-black text-[#292828]">4.9 <span className="text-slate-400 text-xs font-bold uppercase ml-1">Elite Merchant</span></p>
            </div>
         </div>
      </aside>


      {/* 4. MARKETPLACE WORKFLOW MODAL */}
      {selectedItem && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-8">
            <div 
               className="absolute inset-0 bg-[#292828]/60 backdrop-blur-xl animate-in fade-in duration-500" 
               onClick={() => setSelectedItem(null)}
            />
            
            <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
               
               {/* LEFT: VISUALS */}
               <div className="lg:w-1/2 bg-slate-100 relative group">
                  <img src={selectedItem.image} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt="" />
                  <button 
                     onClick={() => setSelectedItem(null)}
                     className="absolute top-8 left-8 h-12 w-12 bg-white rounded-full flex items-center justify-center text-[#292828] shadow-2xl hover:bg-[#E53935] hover:text-white transition-all z-20"
                  >
                     <X size={20} />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#292828]/40 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10">
                     <span className="px-4 py-1.5 bg-[#E53935] text-white text-[10px] font-black uppercase rounded-lg shadow-xl mb-4 inline-block">
                        Verfied Inventory
                     </span>
                     <h2 className="text-white leading-none">{selectedItem.item}</h2>
                  </div>
               </div>

               {/* RIGHT: CONFIG & FLOW */}
               <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col">
                  {orderStep === "details" && (
                     <div className="flex-1 animate-in slide-in-from-right-10 duration-500">
                        <div className="flex items-center justify-between mb-12">
                           <div>
                              <p className="text-[10px] font-black text-[#292828]/30 uppercase mb-1">Standard Unit Price</p>
                              <p className="text-4xl font-black text-[#292828]">{selectedItem.price}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-[#292828]/30 uppercase mb-1">Minimum Order</p>
                              <p className="text-xl font-black text-[#E53935]">{selectedItem.cap} Units</p>
                           </div>
                        </div>

                        <div className="space-y-8 mb-12">
                           <div>
                              <label className="text-[10px] font-black text-[#292828] uppercase mb-4 block tracking-widest">Select Quantity</label>
                              <div className="flex items-center gap-6">
                                 <button 
                                    onClick={() => setQuantity(Math.max(parseInt(selectedItem.cap), quantity - 1))}
                                    className="h-14 w-14 border-2 border-[#292828]/10 rounded-2xl flex items-center justify-center text-[#292828] hover:bg-[#292828] hover:text-white transition-all"
                                 >
                                    <Minus size={20} />
                                 </button>
                                 <span className="text-3xl font-black text-[#292828] w-16 text-center">{quantity}</span>
                                 <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="h-14 w-14 border-2 border-[#292828]/10 rounded-2xl flex items-center justify-center text-[#292828] hover:bg-[#292828] hover:text-white transition-all"
                                 >
                                    <Plus size={20} />
                                 </button>
                              </div>
                           </div>

                           <div className="bg-[#292828]/5 rounded-2xl p-6 space-y-4">
                              <div className="flex items-center gap-3 text-[#292828]/60">
                                 <Truck size={18} />
                                 <p className="text-[11px] font-bold uppercase">Pan-India Freight Included</p>
                              </div>
                              <div className="flex items-center gap-3 text-[#292828]/60">
                                 <ShieldCheck size={18} />
                                 <p className="text-[11px] font-bold uppercase">Quality Assurance Certified</p>
                              </div>
                           </div>
                        </div>

                        <button 
                           onClick={() => setOrderStep("checkout")}
                           className="w-full h-20 bg-[#292828] text-white rounded-[1.3rem] flex items-center justify-between px-10 group hover:bg-[#E53935] transition-all"
                        >
                           <span className="text-xs font-black uppercase tracking-widest">Review Final Order</span>
                           <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                     </div>
                  )}

                  {orderStep === "checkout" && (
                     <div className="flex-1 animate-in slide-in-from-right-10 duration-500">
                        <p className="subheading-editorial !text-slate-400 mb-10 border-b border-[#292828]/5 pb-4">Secure Checkout</p>
                        <div className="space-y-6 mb-12">
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Subtotal ({quantity} Units)</span>
                              <span className="text-xl font-black text-[#292828]">₹{(quantity * parseInt(selectedItem.price.replace(/[^0-9]/g, ""))).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Tax & Logistics (18%)</span>
                              <span className="text-xl font-medium text-[#292828]">₹{(quantity * parseInt(selectedItem.price.replace(/[^0-9]/g, "")) * 0.18).toLocaleString()}</span>
                           </div>
                           <div className="h-px bg-[#292828]/10 w-full my-6" />
                           <div className="flex justify-between items-center bg-[#E53935]/5 p-6 rounded-2xl border-2 border-[#E53935]/10">
                              <span className="text-xs font-black text-[#E53935] uppercase tracking-widest">Net Payable</span>
                              <span className="text-3xl font-black text-[#E53935]">₹{(quantity * parseInt(selectedItem.price.replace(/[^0-9]/g, "")) * 1.18).toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                           <button className="h-16 bg-white border-2 border-[#292828]/10 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase text-[#292828] hover:bg-slate-50 transition-all">
                              <CreditCard size={18} /> Card
                           </button>
                           <button className="h-16 bg-white border-2 border-[#E53935] rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase text-[#E53935] shadow-xl shadow-red-500/10">
                              <Zap size={18} fill="currentColor" /> Wallet
                           </button>
                        </div>

                        <div className="flex gap-4">
                           <button 
                              onClick={() => {
                                 // Simulation: Move to Chat
                                 window.location.href = "/chat";
                              }}
                              className="flex-1 h-20 bg-white border-2 border-[#292828] text-[#292828] rounded-[1.3rem] font-black text-xs uppercase tracking-widest hover:bg-[#292828] hover:text-white transition-all flex items-center justify-center gap-3"
                           >
                              <MessageCircle size={20} /> Chat with Seller
                           </button>
                           <button 
                              onClick={() => setOrderStep("success")}
                              className="flex-[1.5] h-20 bg-[#292828] text-white rounded-[1.3rem] font-black text-xs uppercase tracking-widest hover:bg-[#E53935] transition-all shadow-4xl active:scale-95"
                           >
                              Buy Securely Now
                           </button>
                        </div>
                     </div>
                  )}

                  {orderStep === "success" && (
                     <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-90 duration-500">
                        <div className="h-24 w-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-4xl animate-bounce">
                           <CheckCircle2 size={48} />
                        </div>
                        <h3>Order Successful</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-12 max-w-sm">Your secure transaction has been processed. Order ID <span className="text-[#292828] font-bold">#CH-77{Math.floor(Math.random()*900)}</span> is now in fulfillment.</p>
                        <button 
                           onClick={() => setSelectedItem(null)}
                           className="w-full h-16 border-2 border-[#292828] text-[#292828] rounded-xl font-black text-[10px] uppercase hover:bg-[#292828] hover:text-white transition-all"
                        >
                           Return to Marketplace
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}

      {/* 5. SELL YOUR ITEM MODAL (OLX STYLE) */}
      {isSellModalOpen && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div 
               className="absolute inset-0 bg-[#292828]/80 backdrop-blur-md animate-in fade-in duration-500" 
               onClick={() => setIsSellModalOpen(false)}
            />
            
            <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-4xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
               <div className="p-10 border-b border-[#292828]/5 flex items-center justify-between">
                  <h3>Post Your Ad</h3>
                  <button onClick={() => setIsSellModalOpen(false)} className="h-10 w-10 rounded-full bg-[#292828]/5 flex items-center justify-center text-[#292828] hover:bg-[#E53935] hover:text-white transition-all">
                     <X size={20} />
                  </button>
               </div>

               <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                  {/* Photo Upload */}
                  <div className="grid grid-cols-3 gap-4">
                     <div className="aspect-square border-2 border-dashed border-[#292828]/10 rounded-2xl flex flex-col items-center justify-center text-[#292828]/30 hover:border-[#E53935] hover:text-[#E53935] transition-all cursor-pointer group">
                        <Camera size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-black uppercase">Add Photos</span>
                     </div>
                     {[1, 2].map(i => (
                        <div key={i} className="aspect-square bg-[#292828]/5 rounded-2xl border border-[#292828]/5" />
                     ))}
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#292828]/40 uppercase ml-2">Item Title</label>
                        <input type="text" placeholder="e.g. 500kva Industrial Transformer" className="w-full h-14 bg-[#292828]/5 border border-[#292828]/10 rounded-xl px-6 text-sm font-bold focus:border-[#E53935]/20 focus:bg-white transition-all outline-none" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-[#292828]/40 uppercase ml-2">Category</label>
                           <select className="w-full h-14 bg-[#292828]/5 border border-[#292828]/10 rounded-xl px-6 text-sm font-bold appearance-none outline-none">
                              <option>Industrial</option>
                              <option>Logistics</option>
                              <option>Tech</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-[#292828]/40 uppercase ml-2">Asking Price (₹)</label>
                           <input type="text" placeholder="5,00,000" className="w-full h-14 bg-[#292828]/5 border border-[#292828]/10 rounded-xl px-6 text-sm font-bold outline-none" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#292828]/40 uppercase ml-2">Location Hub</label>
                        <div className="relative">
                           <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#E53935]" />
                           <input type="text" placeholder="Trivandrum City Hub" className="w-full h-14 bg-[#292828]/5 border border-[#292828]/10 rounded-xl pl-12 pr-6 text-sm font-bold outline-none" />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-10 bg-[#292828]/5">
                  <button className="w-full h-16 bg-[#292828] text-white rounded-xl font-black text-[11px] uppercase shadow-2xl hover:bg-[#E53935] transition-all flex items-center justify-center gap-3 group">
                     <UploadCloud size={20} className="group-hover:-translate-y-1 transition-transform" />
                     Publish Marketplace Ad
                  </button>
               </div>
            </div>
         </div>
      )}

       {isPosting && (
         <PostModal 
           isOpen={isPosting} 
           onClose={() => setIsPosting(false)} 
           onPostSuccess={handlePostSuccess}
         />
       )}
    </div>
  );
}
