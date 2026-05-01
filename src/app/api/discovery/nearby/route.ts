import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";



/**
 * DISCOVERY API (V1.21)
 * 
 * Fetches nearby meetups and advisors based on map bounding box.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minLat = parseFloat(searchParams.get('minLat') || '0');
  const maxLat = parseFloat(searchParams.get('maxLat') || '0');
  const minLng = parseFloat(searchParams.get('minLng') || '0');
  const maxLng = parseFloat(searchParams.get('maxLng') || '0');

  const supabase = createClient();

  try {
    // 1. Fetch Dynamic Content (Meetups, Requirements, Collabs)
    const { data: discoveryItems, error: mErr } = await supabase
      .from('posts')
      .select('id, title, type, participant_count, max_slots, lat, lng, metadata, author_id')
      .in('type', ['MEETUP', 'REQUIREMENT', 'COLLAB'])
      .neq('status', 'completed')
      .gte('lat', minLat)
      .lte('lat', maxLat)
      .gte('lng', minLng)
      .lte('lng', maxLng)
      .limit(50);

    // 2. Fetch Advisors
    const { data: advisors, error: aErr } = await supabase
      .from('profiles')
      .select('id, full_name, name, avatar_url, avatar, advisor_score, lat, lng, role, is_advisor')
      .or('role.eq.advisor,is_advisor.eq.true')
      .gte('lat', minLat)
      .lte('lat', maxLat)
      .gte('lng', minLng)
      .lte('lng', maxLng)
      .limit(20);

    return NextResponse.json({
      items: discoveryItems || [],
      advisors: advisors || []
    });
  } catch (error) {
    console.error("Discovery API Error:", error);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
