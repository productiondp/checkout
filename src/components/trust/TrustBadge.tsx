import React from 'react';
import { Award, CheckCircle } from 'lucide-react';
import { TrustEngine } from '@/lib/trust-engine';

interface TrustBadgeProps {
  score: number;
  showLabel?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ score, showLabel = true }) => {
  const badge = TrustEngine.getTrustBadge(score);
  
  if (!badge) return null;

  const Icon = badge.icon === 'Award' ? Award : CheckCircle;

  return (
    <div 
      className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
      style={{ 
        backgroundColor: `${badge.color}15`, // 15% opacity
        color: badge.color,
        border: `1px solid ${badge.color}30`
      }}
    >
      <Icon size={12} strokeWidth={3} />
      {showLabel && <span>{badge.label}</span>}
    </div>
  );
};
