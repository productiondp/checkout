import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { ProfileResponseSchema, mapToProfileResponse } from '@/contracts/profile';

import { rateLimit, logSecurityEvent } from '@/utils/security';

/**
 * 🌐 TYPED PROFILE API ROUTE
 * 
 * Provides a RESTful interface for retrieving profile data with strict
 * contract enforcement.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // ⚡ RATE LIMITING (100 requests / min)
  if (!rateLimit(req, 100)) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 🛡️ SERVER-SIDE AUTH GUARD (DEFENSE IN DEPTH)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { path: req.url, ip: req.ip });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  const response = mapToProfileResponse(data);

  // Validate outgoing response
  const validated = ProfileResponseSchema.parse(response);

  return NextResponse.json(validated);
}
