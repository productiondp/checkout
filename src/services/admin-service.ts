import { createClient } from "@/utils/supabase/client";

export const AdminService = {
  async cleanupOrphanedData() {
    const supabase = createClient();
    console.log("[Admin] Starting Full Database Cleanup...");

    // 1. Get all valid profile IDs
    const { data: profiles, error: pError } = await supabase.from('profiles').select('id');
    if (pError) throw pError;
    
    const validIds = new Set(profiles?.map(p => p.id) || []);

    if (validIds.size === 0) return { error: "No profiles found to reference" };

    // 2. Cleanup Connections
    const { data: allConns, error: cError } = await supabase.from('connections').select('id, sender_id, receiver_id');
    if (!cError && allConns) {
      const orphanedConns = allConns.filter(c => !validIds.has(c.sender_id) || !validIds.has(c.receiver_id));
      if (orphanedConns.length > 0) {
        console.log(`[Admin] Removing ${orphanedConns.length} orphaned connections`);
        await supabase.from('connections').delete().in('id', orphanedConns.map(c => c.id));
      }
    }

    // 3. Cleanup Messages
    const { data: allMsgs, error: mError } = await supabase.from('messages').select('id, sender_id, receiver_id');
    if (!mError && allMsgs) {
      const orphanedMsgs = allMsgs.filter(m => !validIds.has(m.sender_id) || !validIds.has(m.receiver_id));
      if (orphanedMsgs.length > 0) {
        console.log(`[Admin] Removing ${orphanedMsgs.length} orphaned messages`);
        await supabase.from('messages').delete().in('id', orphanedMsgs.map(m => m.id));
      }
    }

    // 4. Cleanup Partners (if exists)
    try {
      const { data: allPartners } = await supabase.from('partners').select('id, user_1, user_2');
      if (allPartners) {
        const orphanedPartners = allPartners.filter(p => !validIds.has(p.user_1) || !validIds.has(p.user_2));
        if (orphanedPartners.length > 0) {
          await supabase.from('partners').delete().in('id', orphanedPartners.map(p => p.id));
        }
      }
    } catch (e) {
      console.warn("Partners table cleanup skipped (table may not exist)");
    }

    return { success: true };
  }
};
