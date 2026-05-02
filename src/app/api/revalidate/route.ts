import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

/**
 * CACHE REVALIDATION WEBHOOK
 * 
 * Allows Supabase or manual triggers to invalidate Next.js cache tags instantly.
 * Security: Requires a secret key to prevent unauthorized cache purging.
 */
export async function POST(req: NextRequest) {
  try {
    const { tag, secret } = await req.json();

    // Verify secret to prevent abuse
    if (secret !== process.env.REVALIDATION_SECRET) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    if (!tag) {
      return new Response(JSON.stringify({ message: 'Tag is required' }), { status: 400 });
    }

    //  Invalidate the specific tag in Next.js Cache
    revalidateTag(tag);

    return new Response(JSON.stringify({ 
      revalidated: true, 
      tag, 
      now: Date.now() 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
