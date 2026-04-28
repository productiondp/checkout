"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageContent } from "@/data/mock-content";
import { ArrowRight, Plus, ExternalLink, MessageCircle, UserPlus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionTerminalProps {
  content: PageContent;
}

export default function SectionTerminal({ content }: SectionTerminalProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">{content.title}</h1>
        <p className="text-gray-500 font-medium">{content.subtitle}</p>
      </header>

      <div className="space-y-12 pb-20">
        {content.sections.map((section, idx) => (
          <section key={section.title} className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#E53935] px-1">
              {section.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2 }}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#E53935] hover:shadow-[0_8px_30px_rgb(229,57,53,0.08)] transition-all duration-300"
                >
                  <div className="flex flex-col h-full justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                          {item.type}
                        </span>
                        {item.subtitle === "Live" && (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#E53935] animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E53935]" />
                            Live Now
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-[15px] font-bold leading-snug text-gray-900 group-hover:text-[#E53935] transition-colors">
                          {item.title}
                        </h3>
                        {item.subtitle && item.subtitle !== "Live" && (
                          <p className="text-xs text-gray-500 font-medium mt-1">{item.subtitle}</p>
                        )}
                      </div>

                      {item.meta && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.meta.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-50 text-[10px] font-bold text-gray-400 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 hover:bg-[#E53935] text-gray-600 hover:text-white rounded-xl text-[12px] font-black transition-all duration-300 group/btn">
                       {getActionIcon(item.actionText)}
                       {item.actionText}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function getActionIcon(text: string) {
  const t = text.toLowerCase();
  if (t.includes('read') || t.includes('view')) return <ExternalLink size={14} />;
  if (t.includes('join') || t.includes('apply')) return <Zap size={14} className="fill-current" />;
  if (t.includes('connect')) return <UserPlus size={14} />;
  if (t.includes('collaborate')) return <Plus size={14} />;
  if (t.includes('ask') || t.includes('message')) return <MessageCircle size={14} />;
  return <ArrowRight size={14} />;
}
