"use client";

import React from "react";
import { Zap, ArrowUpRight, ArrowDownLeft, TrendingUp, History, ShieldCheck, DollarSign, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF]">
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12">
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* MAIN BALANCE CARD */}
            <div className="lg:col-span-2 bg-[#E53935] rounded-[3.5rem] p-12 lg:p-16 text-white shadow-3xl shadow-red-500/30 flex flex-col justify-between relative overflow-hidden group">
               <div className="absolute -right-20 -top-20 h-80 w-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
               <div className="relative z-10 w-full">
                  <div className="flex items-center justify-between mb-16">
                     <p className="text-[14px] font-bold uppercase tracking-widest text-white/60">Checkout Business Wallet</p>
                     <ShieldCheck size={32} className="text-white/40" />
                  </div>
                  <div>
                     <p className="text-[14px] font-bold uppercase text-white/50 mb-4">Total Liquidity Available</p>
                     <h1 className="text-6xl font-black mb-12 tracking-tighter">₹8,42,500.00</h1>
                  </div>
                  <div className="flex items-center gap-6">
                     <button className="flex-1 h-14 bg-white text-slate-950 rounded-2xl font-bold text-[12px] uppercase shadow-2xl hover:scale-105 transition-all">Add Credits</button>
                     <button className="flex-1 h-14 bg-slate-950 border border-white/10 text-white rounded-2xl font-bold text-[12px] uppercase hover:bg-white hover:text-slate-900 transition-all">Withdraw</button>
                  </div>
               </div>
            </div>

            {/* QUICK STATS */}
            <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col justify-between">
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500"><TrendingUp size={24} /></div>
                     <div>
                        <p className="text-[12px] font-bold text-slate-400 capitalize mb-1">Weekly Profit</p>
                        <p className="text-[20px] font-black text-slate-900">+ ₹12,400</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#E53935]"><ArrowDownLeft size={24} /></div>
                     <div>
                        <p className="text-[12px] font-bold text-slate-400 capitalize mb-1">Expenses</p>
                        <p className="text-[20px] font-black text-slate-900">- ₹4,200</p>
                     </div>
                  </div>
               </div>
               <button className="w-full h-14 bg-slate-50 text-slate-400 rounded-2xl text-[12px] font-bold uppercase border border-slate-100 hover:text-slate-900">View Detailed Analytics</button>
            </div>
         </div>

         <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm overflow-hidden pb-20">
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-950 text-white rounded-xl flex items-center justify-center"><History size={20} /></div>
                  <h3 className="text-[22px] font-black text-slate-900">Recent Ledger</h3>
               </div>
               <button className="text-[12px] font-bold text-[#E53935] uppercase underline underline-offset-4">Download Statements</button>
            </div>

            <div className="space-y-6">
               {[
                 { title: "Wholesale Order #924", type: "Credit", amount: "₹42,000", date: "Today, 2:40 PM" },
                 { title: "Partner Fee - Rahul Sethi", type: "Debit", amount: "₹1,500", date: "Yesterday, 10:30 AM" },
                 { title: "Logistics Payment", type: "Debit", amount: "₹8,400", date: "15 Apr 2026" },
               ].map((tx, i) => (
                 <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-6">
                       <div className={cn(
                         "h-12 w-12 rounded-xl flex items-center justify-center",
                         tx.type === "Credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                       )}>
                          {tx.type === "Credit" ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                       </div>
                       <div>
                          <h4 className="text-[15px] font-bold text-slate-900 mb-1">{tx.title}</h4>
                          <p className="text-[11px] font-bold text-slate-400 uppercase">{tx.date}</p>
                       </div>
                    </div>
                    <p className={cn(
                      "text-[18px] font-black",
                      tx.type === "Credit" ? "text-green-600" : "text-slate-900"
                    )}>{tx.type === "Credit" ? "+" : "-"}{tx.amount}</p>
                 </div>
               ))}
            </div>
         </div>
      </main>
    </div>
  );
}
