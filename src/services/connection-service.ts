import { createClient } from "@/utils/supabase/client";
import { analytics } from "@/utils/analytics";

export type ConnectionStatus = "none" | "pending" | "accepted";

export const ConnectionService = {
  /**
   * ⚡ INSTANT CONNECT
   * Creates a connection with minimal friction.
   */
  async connect(senderId: string, receiverId: string) {
    const supabase = createClient();
    
    // 1. DUPLICATE PREVENTION (Step 4)
    const { data: existing } = await supabase
      .from('connections')
      .select('id, status')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .maybeSingle();

    if (existing) {
      return { success: true, status: existing.status as ConnectionStatus, id: existing.id };
    }

    // 2. CREATE CONNECTION (STRICT PENDING)
    const { data, error } = await supabase
      .from('connections')
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          status: "PENDING"
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // 📣 TRIGGER NOTIFICATION
    try {
      const { NotificationService } = await import("./notification-service");
      await NotificationService.create({
        user_id: receiverId,
        type: "connection_request",
        actor_id: senderId,
        reference_id: data.id
      });
    } catch (nErr) {
      console.warn("Notification trigger failed (Silent):", nErr);
    }

    return { success: true, status: "PENDING" as ConnectionStatus, connectionId: data.id };
  },

  /**
   * 🔍 CHECK STATUS
   */
  async getStatus(senderId: string, receiverId: string): Promise<ConnectionStatus> {
    const supabase = createClient();
    const { data } = await supabase
      .from('connections')
      .select('status')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .maybeSingle();

    return (data?.status as ConnectionStatus) || "none";
  },

  /**
   * 📋 LIST CONNECTIONS
   */
  async listConnections(userId: string) {
    const supabase = createClient();
    console.log("Fetching connections for:", userId);
    
    const { data, error } = await supabase
      .from('connections')
      .select(`
        id,
        status,
        created_at,
        sender_id,
        receiver_id,
        sender:profiles!connections_sender_id_fkey (id, full_name, avatar_url, role, bio),
        receiver:profiles!connections_receiver_id_fkey (id, full_name, avatar_url, role, bio)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    console.log("Fetch result:", { data, error });

    if (error) throw error;

    return (data || []).map(conn => {
      const isIncoming = conn.receiver_id === userId;
      const partner = conn.sender_id === userId ? conn.receiver : conn.sender;
      
      return {
        id: conn.id,
        status: conn.status,
        partner,
        isIncoming,
        created_at: conn.created_at
      };
    });
  },

  /**
   * ✅ ACCEPT CONNECTION
   */
  async accept(connectionId: string) {
    const supabase = createClient();
    console.log("Accepting connection:", connectionId);

    const { data, error } = await supabase
      .from('connections')
      .update({ status: 'ACCEPTED' })
      .eq('id', connectionId)
      .select()
      .single();

    console.log("Update result:", { data, error });
    if (error) throw error;

    // 📣 TRIGGER NOTIFICATION
    try {
      const { NotificationService } = await import("./notification-service");
      await NotificationService.create({
        user_id: data.sender_id, // Notify the original requester
        type: "connection_accepted",
        actor_id: data.receiver_id, // The current user accepted it
        reference_id: data.id
      });
    } catch (nErr) {
      console.warn("Notification trigger failed (Silent):", nErr);
    }

    return data;
  },

  /**
   * 💬 ENSURE CONNECTION (FOR CHAT)
   * Returns existing or creates a PENDING connection.
   */
  async ensureConnection(userId: string, partnerId: string) {
    const supabase = createClient();
    const { data: existing } = await supabase
      .from('connections')
      .select('id, status')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
      .maybeSingle();

    if (existing) return existing;

    const { data, error } = await supabase
      .from('connections')
      .insert({
        sender_id: userId,
        receiver_id: partnerId,
        status: "PENDING"
      })
      .select('id, status')
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 🗑️ REMOVE CONNECTION
   */
  async removeConnection(connectionId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId);
    
    if (error) throw error;
    return { success: true };
  },

  /**
   * 🚫 BLOCK USER
   */
  async blockUser(connectionId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('connections')
      .update({ status: 'BLOCKED' })
      .eq('id', connectionId);
    
    if (error) throw error;
    return { success: true };
  }
};
