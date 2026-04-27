import React, { useState } from 'react';
import { Sparkles, Users, BookOpen, XCircle } from 'lucide-react';
import { TrustEngine, OutcomeType, OUTCOME_SCORES } from '@/lib/trust-engine';
import { motion } from 'framer-motion';

interface OutcomeSelectorProps {
  meetupId: string;
  advisorId: string;
  onProcessed?: () => void;
}

const OPTIONS: { type: OutcomeType; label: string; icon: any; points: number }[] = [
  { type: 'COLLABORATION', label: 'Started Collaboration', icon: Sparkles, points: OUTCOME_SCORES.COLLABORATION },
  { type: 'TALENT_FOUND', label: 'Found Talent', icon: Users, points: OUTCOME_SCORES.TALENT_FOUND },
  { type: 'KNOWLEDGE_GAINED', label: 'Knowledge Gained', icon: BookOpen, points: OUTCOME_SCORES.KNOWLEDGE_GAINED },
  { type: 'NONE', label: 'No Outcome', icon: XCircle, points: OUTCOME_SCORES.NONE },
];

export const OutcomeSelector: React.FC<OutcomeSelectorProps> = ({ meetupId, advisorId, onProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selected, setSelected] = useState<OutcomeType | null>(null);

  const handleSelect = async (outcome: OutcomeType) => {
    setIsProcessing(true);
    setSelected(outcome);
    try {
      await TrustEngine.processMeetupOutcome(meetupId, advisorId, outcome);
      if (onProcessed) onProcessed();
    } catch (err) {
      console.error("Outcome processing failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-black uppercase text-[#292828]">What was the result?</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select the primary outcome of this session</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.type;
          
          return (
            <button
              key={opt.type}
              disabled={isProcessing}
              onClick={() => handleSelect(opt.type)}
              className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                isSelected 
                  ? 'bg-[#292828] border-[#292828] text-white shadow-xl scale-[1.02]' 
                  : 'bg-white border-slate-100 text-[#292828] hover:border-[#E53935]/20 hover:bg-slate-50'
              }`}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/10' : 'bg-slate-50'}`}>
                <Icon size={24} strokeWidth={isSelected ? 3 : 2} />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-black uppercase">{opt.label}</p>
                <p className={`text-[9px] font-bold uppercase mt-0.5 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                  +{opt.points} TRUST POINTS
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
