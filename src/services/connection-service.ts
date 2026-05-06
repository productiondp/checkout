import { createClient } from "@/utils/supabase/client";
import { analytics } from "@/utils/analytics";

export type ConnectionStatus = "none" | "pending" | "accepted";

export const ConnectionService = {
  /**
   *  INSTANT CONNECT
   * Creates a connection with minimal friction.
   */
  async connect(senderId: string, receiverId: string) {
    const supabase = createClient();
    
    // 0. SELF PREVENTION
    if (senderId === receiverId) throw new Error("Cannot connect to self");
    
    // 1. DUPLICATE PREVENTION & AUTO-ACCEPT (Requirement: merge mutual requests)
    const { data: existing } = await supabase
      .from('connections')
      .select('id, status, sender_id')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .maybeSingle();

    if (existing) {
      // If the other person already sent a request, auto-accept it!
      if (existing.status === 'PENDING' && existing.sender_id === receiverId) {
        const conn = await this.accept(existing.id);
        return { success: true, status: 'ACCEPTED' as ConnectionStatus, connectionId: conn.id };
      }
      return { success: true, status: existing.status as ConnectionStatus, connectionId: existing.id };
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

    //  TRIGGER NOTIFICATION
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

  async accept(connectionId: string) {
    const supabase = createClient();
    console.log("[ConnectionService] Accepting connection:", connectionId);

    try {
      // 1. Fetch current connection details
      const { data: connection, error: fetchError } = await supabase
        .from('connections')
        .select('*')
        .eq('id', connectionId)
        .single();

      if (fetchError) throw fetchError;
      if (connection.status === 'ACCEPTED') return connection;

      const { sender_id, receiver_id } = connection;

      // 2. Initialize Chat 2.0 Conversation (Direct Message)
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({ 
          type: 'DM',
          created_by: receiver_id,
          title: 'Direct Chat'
        })
        .select()
        .single();

      if (convError) {
        console.warn("Could not create conversation (Silent Fallback):", convError);
      } else {
        // Add members to the new high-performance schema
        await supabase.from('conversation_members').insert([
          { conversation_id: conv.id, user_id: sender_id },
          { conversation_id: conv.id, user_id: receiver_id }
        ]);
      }

      // 3. Create Partnership (Defensive: table might be missing)
      try {
        await supabase.from('partners').insert({
          user_1: sender_id,
          user_2: receiver_id,
          status: 'ACTIVE',
          connection_id: connectionId
        });
      } catch (pErr) {
        console.warn("Partners table missing or error (Non-blocking):", pErr);
      }

      // 4. Update Connection Status
      const { data: updated, error: updateError } = await supabase
        .from('connections')
        .update({ status: 'ACCEPTED' })
        .eq('id', connectionId)
        .select()
        .single();

      if (updateError) throw updateError;

      // 5. Trigger Notification
      try {
        const { NotificationService } = await import("./notification-service");
        await NotificationService.create({
          user_id: sender_id,
          type: "connection_accepted",
          actor_id: receiver_id,
          reference_id: connectionId
        });
      } catch (nErr) {
        console.warn("Notification trigger failed (Silent):", nErr);
      }

      analytics.track('CONNECTION_ACCEPTED', { connectionId });
      return updated;

    } catch (err) {
      console.error("[ConnectionService] Accept Error:", err);
      throw err;
    }
  },

  /**
   *  REJECT CONNECTION
   */
  async reject(connectionId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('connections')
      .update({ status: 'REJECTED' })
      .eq('id', connectionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   *  CHECK STATUS
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
   *  LIST CONNECTIONS
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
        sender:profiles!sender_id (id, full_name, avatar_url, role, bio),
        receiver:profiles!receiver_id (id, full_name, avatar_url, role, bio)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

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
   *  ENSURE CONNECTION (FOR CHAT)
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
   *  REMOVE CONNECTION
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
   *  BLOCK USER
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
