import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { TrustEngine } from '@/lib/trust-engine';
import { motion, AnimatePresence } from 'framer-motion';

interface MeetupFeedbackProps {
  meetupId: string;
  userId: string;
  onVoted?: () => void;
}

export const MeetupFeedback: React.FC<MeetupFeedbackProps> = ({ meetupId, userId, onVoted }) => {
  const [voted, setVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (helpful: boolean) => {
    setIsSubmitting(true);
    try {
      await TrustEngine.submitVote(meetupId, userId, helpful);
      setVoted(true);
      if (onVoted) onVoted();
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
      <AnimatePresence mode="wait">
        {!voted ? (
          <motion.div 
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-[11px] font-black uppercase text-slate-400">Was this session helpful?</p>
            <div className="flex gap-4">
              <button 
                disabled={isSubmitting}
                onClick={() => handleVote(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-emerald-100 rounded-xl text-emerald-600 text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
              >
                <ThumbsUp size={14} />
                Yes
              </button>
              <button 
                disabled={isSubmitting}
                onClick={() => handleVote(false)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-rose-100 rounded-xl text-rose-600 text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              >
                <ThumbsDown size={14} />
                No
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="thanks"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-2"
          >
            <p className="text-[10px] font-black uppercase text-emerald-500">Thank you for your feedback!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
