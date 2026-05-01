import { NextResponse } from "next/server";
import { broadcastCleanEvent, shouldBroadcast } from "@/lib/realtime-coordinator";



/**
 * REAL-TIME SYNC API (V1.20)
 * 
 * Entry point for raw database changes (e.g. from webhooks or internal calls).
 * Coordinates and broadcasts clean events to clients.
 */
export async function POST(request: Request) {
  try {
    const { table, old_record, new_record, advisor_id } = await request.json();

    if (!table || !new_record || !advisor_id) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Server-Side Aggregation & Decision
    const eventType = shouldBroadcast(old_record || {}, new_record, table as any);

    if (eventType) {
      // 2. Broadcast Clean Event
      await broadcastCleanEvent(advisor_id, eventType, {
        record_id: new_record.id,
        new_count: new_record.participant_count
      });

      return NextResponse.json({ success: true, event: eventType });
    }

    return NextResponse.json({ success: true, event: "IGNORED" });
  } catch (error) {
    console.error("Sync API Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
