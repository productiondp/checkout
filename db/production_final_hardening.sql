-- PRODUCTION FINAL HARDENING: Business OS Messaging & Community Protocols
-- Objective: Resolve RLS gaps, enable full realtime sync, and fix notification multi-casting.

-- 1. REALTIME EXPANSION
-- Ensure all interactive tables are in the realtime publication for zero-latency UI.
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.messages, 
    public.connections, 
    public.notifications, 
    public.profiles,
    public.communities,
    public.posts,
    public.participants,
    public.meetup_participants;

-- 2. MESSAGES RLS CONSOLIDATION
-- Optimized to prevent infinite recursion while supporting both 1-on-1 and Group chats.
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
DROP POLICY IF EXISTS "Users can see messages for their connections or rooms" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

-- Consolidated Select: Checks connections OR room participation
CREATE POLICY "messages_read_policy" ON public.messages
FOR SELECT USING (
  auth.uid() = sender_id OR 
  (connection_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.connections WHERE id = connection_id AND (sender_id = auth.uid() OR receiver_id = auth.uid())
  )) OR
  (room_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.participants WHERE room_id = messages.room_id AND user_id = auth.uid()
  ))
);

-- Consolidated Insert: Must be sender AND part of the connection/room
CREATE POLICY "messages_write_policy" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND (
    (connection_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.connections WHERE id = connection_id AND (sender_id = auth.uid() OR receiver_id = auth.uid())
    )) OR
    (room_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.participants WHERE room_id = messages.room_id AND user_id = auth.uid()
    )) OR
    (receiver_id IS NOT NULL) -- Allow initial message to start a connection
  )
);

-- 3. NOTIFICATION MULTI-CASTING FIX
-- Updates the trigger to notify ALL room participants except the sender.
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger AS $$
DECLARE
  v_sender_name TEXT;
BEGIN
  -- 1. Fetch Sender Name
  SELECT full_name INTO v_sender_name FROM public.profiles WHERE id = NEW.sender_id;

  -- 2. Handle 1-on-1 (Connection-based)
  IF NEW.connection_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    SELECT 
      CASE WHEN sender_id = NEW.sender_id THEN receiver_id ELSE sender_id END,
      'New Message',
      COALESCE(v_sender_name, 'Someone') || ' sent you a message.',
      'MESSAGE',
      '/chat?user=' || NEW.sender_id
    FROM public.connections WHERE id = NEW.connection_id;
  
  -- 3. Handle Group Chat (Room-based)
  ELSIF NEW.room_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    SELECT 
      user_id,
      'Group Update',
      COALESCE(v_sender_name, 'Someone') || ' posted in group.',
      'MESSAGE',
      '/chat?room=' || NEW.room_id
    FROM public.participants 
    WHERE room_id = NEW.room_id AND user_id != NEW.sender_id;
    
  -- 4. Fallback (Direct receiver)
  ELSIF NEW.receiver_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (NEW.receiver_id, 'New Message', COALESCE(v_sender_name, 'Someone') || ' sent you a message.', 'MESSAGE', '/chat?user=' || NEW.sender_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. COMMUNITY HOST AUTO-PARTICIPATION
-- Ensures the creator of a community is automatically added to its chat room.
CREATE OR REPLACE FUNCTION public.handle_community_foundation()
RETURNS trigger AS $$
DECLARE
  new_room_id UUID;
BEGIN
  -- Create the room
  INSERT INTO public.chat_rooms (title, is_group)
  VALUES (NEW.name || ' Inner Circle', true)
  RETURNING id INTO new_room_id;
  
  NEW.room_id := new_room_id;
  
  -- Add host to participants
  IF NEW.host_id IS NOT NULL THEN
    INSERT INTO public.participants (room_id, user_id)
    VALUES (new_room_id, NEW.host_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. REFRESH SCHEMA
NOTIFY pgrst, 'reload schema';
