import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useUserSuccess(userId: string | undefined) {
  const [insights, setInsights] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    async function fetchInsights() {
      try {
        // 1. Get user's participation outcomes
        const { data: participations, error: pError } = await supabase
          .from('meetup_participants')
          .select('outcome_type')
          .eq('user_id', userId)
          .not('outcome_type', 'is', null);

        // [SEC] INFRASTRUCTURE GUARD (V16.24)
        if (pError) {
          if (pError.message.includes('not found') || (pError as any).status === 404) {
            console.warn('[INFRA] Meetup participation tracking is currently disabled (Table 404).');
            return;
          }
          throw pError;
        }

        if (!participations) return;

        const newInsights: string[] = [];
        
        const collaborations = (participations || []).filter(p => p.outcome_type === 'COLLABORATION').length;
        if (collaborations > 0) {
          newInsights.push(`You gained ${collaborations} collaboration${collaborations > 1 ? 's' : ''} from meetups`);
        }

        // 2. Get most attended category
        const { data: posts, error: postsError } = await supabase
          .from('meetup_participants')
          .select('posts(domain)')
          .eq('user_id', userId);

        if (!postsError && posts) {
          const domains = posts.map((p: any) => p.posts?.domain).filter(Boolean);
          if (domains.length > 0) {
            const counts: Record<string, number> = {};
            domains.forEach(d => counts[d] = (counts[d] || 0) + 1);
            const topDomain = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            newInsights.push(`You attend more ${topDomain.toLowerCase()} sessions`);
          }
        }

        setInsights(newInsights);
      } catch (err) {
        console.warn('[INSIGHTS] Skipping outcome generation due to connectivity.');
      }
    }

    fetchInsights();
  }, [userId]);

  return insights;
}
