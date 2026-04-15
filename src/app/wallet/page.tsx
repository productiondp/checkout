"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { CreditCard, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap, TrendingUp, Wallet as WalletIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Wallet() {
  const transactions = [
    { title: "Café Launch Project", date: "Oct 12, 2023", amount: "₹15,000", type: "income", status: "Completed" },
    { title: "D2C Brand Marketing", date: "Oct 10, 2023", amount: "₹8,500", type: "income", status: "Escrow" },
    { title: "Pro Subscription", date: "Oct 05, 2023", amount: "₹499", type: "expense", status: "Completed" },
  ];

  return (
    <div className="fade-in bg-white min-h-screen">
      <Header title="My Wallet" />

      <div className="px-6 py-8">
        {/* Balance Card */}
        <div className="bg-text rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl mb-10">
          <div className="relative z-10">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Available Balance</p>
            <h2 className="text-5xl font-black mb-10 leading-none tracking-tight">₹23,500</h2>
            
            <div className="flex gap-3">
              <Button className="flex-1 bg-primary text-white border-none py-4 text-xs font-black uppercase">Withdraw</Button>
              <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 py-4 text-xs font-black uppercase">Add Funds</Button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
          <WalletIcon className="absolute top-8 right-8 text-white/10" size={60} />
        </div>

        {/* Security / Escrow Info */}
        <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-3xl border border-blue-100 mb-10">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-blue-600" size={24} />
           </div>
           <div>
              <p className="text-xs font-black text-text uppercase leading-none mb-1">Secure Escrow Active</p>
              <p className="text-[10px] text-text-secondary font-medium uppercase">All payments held safely until work is approved.</p>
           </div>
        </div>

        {/* Transactions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-black uppercase text-text-secondary">Recent Transactions</h3>
            <button className="text-[10px] font-black text-primary uppercase">See All</button>
          </div>
          
          <div className="space-y-4">
            {transactions.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-background-soft rounded-[28px] border border-black/[0.01] group cursor-pointer hover:bg-white hover:shadow-premium transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    tx.type === "income" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  )}>
                    {tx.type === "income" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-text leading-tight">{tx.title}</h4>
                    <p className="text-[10px] text-text-secondary font-bold uppercase">{tx.date} • <span className={cn(
                      tx.status === "Escrow" ? "text-blue-500" : "text-text-secondary"
                    )}>{tx.status}</span></p>
                  </div>
                </div>
                <div className="text-right">
                   <p className={cn(
                     "font-black text-sm",
                     tx.type === "income" ? "text-green-600" : "text-text"
                   )}>
                     {tx.type === "income" ? "+" : "-"}{tx.amount}
                   </p>
                   <ChevronRight size={14} className="text-text-secondary inline ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
