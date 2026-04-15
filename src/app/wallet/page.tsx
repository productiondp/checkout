"use client";

import React from "react";
import { Zap, CreditCard, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";

export default function Wallet() {
  const transactions = [
    { title: "Café Launch Work", date: "Oct 12, 2023", amount: "₹15,000", type: "income", status: "Paid" },
    { title: "D2C Marketing Help", date: "Oct 10, 2023", amount: "₹8,500", type: "income", status: "On Hold" },
    { title: "Pro Membership", date: "Oct 05, 2023", amount: "₹499", type: "expense", status: "Paid" },
  ];

  const handleWithdraw = () => {
    alert("Starting money transfer to your bank account...");
  };

  const handleDeposit = () => {
    alert("Opening secure window to add money...");
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      {/* Wallet Header */}
      <div className="px-8 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-50">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Zap size={20} className="text-[#E53935]" />
              <h2 className="text-[11px] font-medium uppercase tracking-normal text-[#E53935]">Secure Money System</h2>
           </div>
           <h1 className="text-3xl font-bold text-slate-900 leading-tight">My <span className="text-[#E53935]">Wallet</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={handleWithdraw} className="px-6 py-3 bg-[#E53935] text-white rounded-xl font-bold text-xs tracking-normal shadow-lg transition-all">Get Money</button>
           <button onClick={handleDeposit} className="px-6 py-3 border border-slate-900 text-slate-900 rounded-xl font-bold text-xs tracking-normal transition-all hover:bg-slate-900 hover:text-white">Add Money</button>
        </div>
      </div>

      <div className="p-8">
        {/* Balance Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl mb-10 border border-slate-800">
          <div className="relative z-10">
            <p className="text-slate-400 text-[11px] font-medium uppercase tracking-normal mb-3">Total Balance</p>
            <h2 className="text-6xl font-bold mb-10 leading-none tracking-normal">₹23,500<span className="text-[#E53935]">.</span></h2>
            
            <div className="grid grid-cols-2 gap-5 max-w-sm">
               <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] font-medium text-slate-500 uppercase mb-1">Money on Hold</p>
                  <p className="text-xl font-bold">₹8,500</p>
               </div>
               <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] font-medium text-slate-500 uppercase mb-1">Gift Points</p>
                  <p className="text-xl font-bold text-yellow-500">2,440</p>
               </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E53935]/5 blur-[80px] rounded-full" />
          <CreditCard size={120} className="absolute top-10 right-10 text-white/5 -rotate-12" />
        </div>

        {/* Protection Info */}
        <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-10">
           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md text-[#E53935]">
              <ShieldCheck size={24} />
           </div>
           <div>
              <p className="text-[12px] font-bold text-slate-900 mb-0.5">Payment Protection</p>
              <p className="text-[11px] text-slate-500 font-normal">Your money is safe. Payments are only finished after you say the work is good.</p>
           </div>
        </div>

        {/* History Section */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
            <h3 className="text-xs font-semibold text-slate-900 uppercase">Recent Activity</h3>
            <button onClick={() => alert("Full history is coming soon!")} className="text-[11px] font-medium text-slate-400 hover:text-[#E53935] transition-colors">See full list →</button>
          </div>
          
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-[#E53935]/20 hover:shadow-lg transition-all">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tx.type === "income" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  }`}>
                    {tx.type === "income" ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 mb-0.5">{tx.title}</h4>
                    <p className="text-[11px] text-slate-400 font-normal">
                       {tx.date} • <span className={tx.status === "On Hold" ? "text-yellow-600 font-medium" : "text-green-600 font-medium"}>{tx.status}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                   <p className={`font-bold text-base ${tx.type === "income" ? "text-slate-900" : "text-slate-400"}`}>
                     {tx.type === "income" ? "+" : "-"}{tx.amount}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
