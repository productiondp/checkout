import { createClient } from "@/utils/supabase/client";

export class MeetupService {
  /**
   * Joins a meetup: creates participant record and adds to group chat
   */
  static async joinMeetup(meetupId: string, userId: string) {
    const supabase = createClient();

    // 1. Get meetup details
    const { data: meetup, error: fetchError } = await supabase
      .from('posts')
      .select('room_id, max_slots, author_id, title, status')
      .eq('id', meetupId)
      .single();

    if (fetchError || !meetup) throw new Error("Meetup not found");
    if (meetup.status === 'completed') throw new Error("MEETUP_COMPLETED");

    // 2. Check capacity
    const { count, error: countError } = await supabase
      .from('meetup_participants')
      .select('*', { count: 'exact', head: true })
      .eq('meetup_id', meetupId);

    if (countError) throw countError;
    if (count !== null && count >= (meetup.max_slots || 1)) {
      throw new Error("MEETUP_FULL");
    }

    // 3. Create participant record
    const { error: joinError } = await supabase
      .from('meetup_participants')
      .insert({ meetup_id: meetupId, user_id: userId, status: 'JOINED' });

    if (joinError) throw joinError;

    // 4. Add to group chat and send system message
    if (meetup.room_id) {
      await supabase
        .from('participants')
        .upsert({ room_id: meetup.room_id, user_id: userId });

      // Send System Message
      const { data: userProfile } = await supabase.from('profiles').select('full_name').eq('id', userId).single();
      await supabase.from('messages').insert({
        room_id: meetup.room_id,
        sender_id: userId,
        content: `${userProfile?.full_name || 'A new partner'} has joined the meetup.`,
        type: 'SYSTEM'
      });
    }

    return { roomId: meetup.room_id };
  }

  /**
   * Submits outcome data for a meetup
   */
  static async submitOutcome(meetupId: string, data: { type: string; summary?: string; next_action?: string }) {
    const supabase = createClient();
    return await supabase
      .from('posts')
      .update({ 
        outcome_data: data 
      })
      .eq('id', meetupId);
  }

  /**
   * Updates meetup status (Host only)
   */
  static async updateStatus(meetupId: string, status: 'upcoming' | 'live' | 'completed') {
    const supabase = createClient();
    const res = await supabase
      .from('posts')
      .update({ status })
      .eq('id', meetupId);

    if (status === 'completed') {
      // Send System Message about outcome
      const { data: meetup } = await supabase.from('posts').select('room_id').eq('id', meetupId).single();
      if (meetup?.room_id) {
        await supabase.from('messages').insert({
          room_id: meetup.room_id,
          content: "This meetup has ended. How was your experience?",
          type: 'SYSTEM'
        });
      }
    }
    return res;
  }

  /**
   * Removes a participant (Host only)
   */
  static async removeParticipant(meetupId: string, userId: string, roomId?: string) {
    const supabase = createClient();
    await supabase.from('meetup_participants').delete().eq('meetup_id', meetupId).eq('user_id', userId);
    if (roomId) {
      await supabase.from('participants').delete().eq('room_id', roomId).eq('user_id', userId);
    }
  }

  /**
   * Mutes a participant
   */
  static async muteParticipant(meetupId: string, userId: string, isMuted: boolean) {
    const supabase = createClient();
    return await supabase
      .from('meetup_participants')
      .update({ is_muted: isMuted })
      .eq('meetup_id', meetupId)
      .eq('user_id', userId);
  }

  /**
   * Activates meetup (Go Live)
   */
  static async setLive(meetupId: string) {
    const supabase = createClient();
    return await supabase
      .from('posts')
      .update({ 
        status: 'live',
        live_at: new Date().toISOString()
      })
      .eq('id', meetupId);
  }

  /**
   * Pins a message in the room
   */
  static async pinMessage(roomId: string, messageId: string | null) {
    const supabase = createClient();
    
    // 1. Update the room's pinned_message_id
    await supabase
      .from('chat_rooms')
      .update({ pinned_message_id: messageId })
      .eq('id', roomId);

    // 2. Optionally change the message type to PINNED for visual distinction in history
    if (messageId) {
      await supabase.from('messages').update({ type: 'PINNED' }).eq('id', messageId);
    }
  }

  /**
   * Checks if user has already joined and gets current seat status
   */
  static async getMeetupStatus(meetupId: string, userId: string) {
    const supabase = createClient();
    
    // 1. Get participant record
    const { data: participation } = await supabase
      .from('meetup_participants')
      .select('status')
      .eq('meetup_id', meetupId)
      .eq('user_id', userId)
      .maybeSingle();

    // 2. Get counts and max slots
    const { data: meetup } = await supabase
      .from('posts')
      .select('max_slots')
      .eq('id', meetupId)
      .single();

    const { count } = await supabase
      .from('meetup_participants')
      .select('*', { count: 'exact', head: true })
      .eq('meetup_id', meetupId);

    const isJoined = !!participation;
    const isFull = count !== null && count >= (meetup?.max_slots || 1);

    return {
      isJoined,
      isFull,
      count: count || 0,
      maxSlots: meetup?.max_slots || 0,
      status: isJoined ? 'JOINED' : (isFull ? 'FULL' : 'IDLE')
    };
  }

  /**
   * Creates a group thread for a meetup (usually called by host)
   */
  static async createGroupThread(meetupId: string, hostId: string, title: string) {
    const supabase = createClient();

    // 1. Create chat room
    const { data: room, error: roomError } = await supabase
      .from('chat_rooms')
      .insert({ title: `Meetup: ${title}`, is_group: true })
      .select()
      .single();

    if (roomError) throw roomError;

    // 2. Add host as participant
    await supabase
      .from('participants')
      .insert({ room_id: room.id, user_id: hostId });

    // 3. Link room to post
    await supabase
      .from('posts')
      .update({ room_id: room.id })
      .eq('id', meetupId);

    return room.id;
  }
}
