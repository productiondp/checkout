"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ChevronLeft, ArrowRight } from "lucide-react";

export default function Auth() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="px-6 pt-8">
        <button 
          onClick={() => step === 1 ? router.push("/") : setStep(1)}
          className="p-2 -ml-2 text-text-secondary hover:text-text transition-all"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="px-8 pt-16 flex-1 fade-in relative z-10">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-text mb-3 ">
            {step === 1 ? "Your phone." : "Check phone."}
          </h2>
          <p className="text-text-secondary text-lg font-medium leading-tight">
            {step === 1 
              ? "We'll send a secure 4-digit code to verify your business." 
              : "We've sent a code to your registered number."}
          </p>
        </div>

        <div className="space-y-8">
          {step === 1 ? (
            <div className="flex gap-3">
              <div className="w-24">
                <div className="bg-background-soft border border-black/[0.02] rounded-2xl h-[64px] flex items-center justify-center font-black text-text shadow-sm">
                  +91
                </div>
              </div>
              <div className="flex-1">
                <input 
                  placeholder="98765 43210" 
                  type="tel" 
                  autoFocus 
                  className="w-full bg-background-soft border border-black/[0.02] rounded-2xl h-[64px] px-6 text-xl font-black focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-text-secondary/30"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-between gap-3">
              {[1, 2, 3, 4].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-16 h-20 text-center text-3xl font-black bg-background-soft rounded-2xl border border-black/[0.02] focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 outline-none transition-all shadow-sm"
                  autoFocus={i === 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 pb-16 relative z-10">
        <Button 
          className="w-full text-xl py-5 shadow-2xl shadow-primary/20 group"
          onClick={() => step === 1 ? setStep(2) : router.push("/home")}
        >
          {step === 1 ? "Send Code" : "Verify & Continue"}
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </Button>
        {step === 2 && (
          <button className="w-full text-center mt-8 text-text-secondary text-xs font-black uppercase  active:text-primary transition-all">
            Resend Code <span className="text-primary">00:24</span>
          </button>
        )}
      </div>
    </div>
  );
}
