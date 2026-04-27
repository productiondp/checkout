import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useUserSuccess(userId: string | undefined) {
  const [insights, setInsights] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    async function fetchInsights() {
      // 1. Get user's participation outcomes
      const { data: participations } = await supabase
        .from('meetup_participants')
        .select('outcome_type')
        .eq('user_id', userId)
        .not('outcome_type', 'is', null);

      if (!participations) return;

      const newInsights: string[] = [];
      
      const collaborations = participations.filter(p => p.outcome_type === 'COLLABORATION').length;
      if (collaborations > 0) {
        newInsights.push(`You gained ${collaborations} collaboration${collaborations > 1 ? 's' : ''} from meetups`);
      }

      // 2. Get most attended category (assuming we can join with posts)
      const { data: posts } = await supabase
        .from('meetup_participants')
        .select('posts(domain)')
        .eq('user_id', userId);

      if (posts) {
        const domains = posts.map((p: any) => p.posts?.domain).filter(Boolean);
        if (domains.length > 0) {
          const counts: Record<string, number> = {};
          domains.forEach(d => counts[d] = (counts[d] || 0) + 1);
          const topDomain = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
          newInsights.push(`You attend more ${topDomain.toLowerCase()} sessions`);
        }
      }

      setInsights(newInsights);
    }

    fetchInsights();
  }, [userId]);

  return insights;
}
