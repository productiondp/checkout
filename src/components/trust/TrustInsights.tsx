import React, { useEffect, useState } from 'react';
import { ShieldCheck, BarChart3, Star, Zap, Clock } from 'lucide-react';
import { TrustEngine } from '@/lib/trust-engine';
import { motion } from 'framer-motion';

interface TrustInsightsProps {
  advisorId: string;
}

export const TrustInsights: React.FC<TrustInsightsProps> = ({ advisorId }) => {
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      const data = await TrustEngine.getAdvisorInsights(advisorId);
      setInsights(data);
      setIsLoading(false);
    }
    fetch();
  }, [advisorId]);

  if (isLoading || !insights) return null;

  return (
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
      {/* Header Stat */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase text-[#292828]">Trust Analysis</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={10} className="text-amber-500 fill-amber-500" />
          <span className="text-[11px] font-black text-[#292828]">{insights.helpfulPercent}% Helpful</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-white border border-slate-100 rounded-xl">
          <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Total Sessions</p>
          <p className="text-[14px] font-black text-[#292828]">{insights.totalSessions}</p>
        </div>
        <div className="p-3 bg-white border border-slate-100 rounded-xl">
          <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Outcomes</p>
          <p className="text-[14px] font-black text-[#292828]">{insights.outcomes}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {insights.tags.map((tag: string) => (
          <div key={tag} className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-1.5">
            <Zap size={10} className="text-emerald-600" />
            <span className="text-[8px] font-black uppercase text-emerald-700">{tag}</span>
          </div>
        ))}
        {insights.lastOutcome !== 'None' && (
          <div className="px-2 py-1 bg-blue-50 border border-blue-100 rounded-full flex items-center gap-1.5">
            <Clock size={10} className="text-blue-600" />
            <span className="text-[8px] font-black uppercase text-blue-700">Last: {insights.lastOutcome.replace('_', ' ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
