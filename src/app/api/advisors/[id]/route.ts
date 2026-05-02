import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { nextSafeCache } from "@/lib/server-cache";



export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    //  V1.17 SERVER-SIDE CACHED FETCH
    const data = await nextSafeCache(
      `advisor:${id}`,
      async () => {
        const supabase = createClient();
        
        const [profileRes, meetupsRes] = await Promise.all([
          supabase.from('profiles')
            .select('id, full_name, name, avatar_url, avatar, advisor_score, professional_role, role, industry, bio, is_advisor, expertise, skills, sessions_count, collaborations_count, helpfulness_rating, last_outcome_preview, marketing_proof, users_helped')
            .eq('id', id)
            .single(),
          supabase.from('posts')
            .select('id, title, type, status, author_id, max_slots, participant_count, metadata, created_at')
            .eq('author_id', id)
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        if (profileRes.error || !profileRes.data) {
          return null;
        }

        const normalizedMeetups = (meetupsRes.data || []).filter((p: any) => 
          p.type?.toUpperCase() === 'MEETUP' && 
          p.status?.toLowerCase() !== 'completed'
        );

        return {
          advisor: profileRes.data,
          meetups: normalizedMeetups
        };
      },
      60 // 60s TTL
    );

    if (!data) {
      return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
