import { NextResponse } from "next/server";
import { invalidateServerCache } from "@/lib/server-cache";

export const runtime = "edge";

/**
 * CACHE PURGE API (V1.18)
 * 
 * Allows event-driven invalidation of specific cache keys.
 * Security: In a real app, this should be protected by an internal secret.
 */
export async function POST(request: Request) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    invalidateServerCache(key);

    return NextResponse.json({ success: true, purged: key });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}
