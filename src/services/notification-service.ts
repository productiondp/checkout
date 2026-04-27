import { createClient } from "@/utils/supabase/client";

export type NotificationType = "connection_request" | "connection_accepted";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  actor_id: string;
  reference_id: string;
  read: boolean;
  created_at: string;
  actor?: {
    full_name: string;
    avatar_url: string;
  };
}

export const NotificationService = {
  /**
   * 📣 CREATE NOTIFICATION
   */
  async create(payload: {
    user_id: string;
    type: NotificationType;
    actor_id: string;
    reference_id: string;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...payload,
        read: false
      })
      .select()
      .single();

    if (error) {
      console.error("Notification Creation Error:", error);
      return null;
    }
    return data;
  },

  /**
   * 📋 LIST NOTIFICATIONS
   */
  async list(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:profiles!notifications_actor_id_fkey (full_name, avatar_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Fetch Notifications Error:", error);
      return [];
    }
    return data as Notification[];
  },

  /**
   * ✅ MARK AS READ
   */
  async markAsRead(userId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) console.error("Mark Read Error:", error);
  },

  /**
   * 📡 SUBSCRIBE
   */
  subscribe(userId: string, callback: (notification: Notification) => void) {
    const supabase = createClient();
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          // Fetch the full actor data for the new notification
          const { data: actor } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.actor_id)
            .single();
          
          callback({ ...payload.new, actor } as Notification);
        }
      )
      .subscribe();
  }
};
