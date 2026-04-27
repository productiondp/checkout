-- MEETUP HARDENING V1.1
-- Optimized for RSVPs and Group Chats

-- 1. Create meetup_participants table
CREATE TABLE IF NOT EXISTS public.meetup_participants (
  meetup_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'JOINED',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (meetup_id, user_id)
);

-- 2. Add room_id to posts (for group chat association)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES public.chat_rooms(id) ON DELETE SET NULL;

-- 3. RLS for meetup_participants
ALTER TABLE public.meetup_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants are viewable by everyone" ON public.meetup_participants;
CREATE POLICY "Participants are viewable by everyone" ON public.meetup_participants 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join meetups" ON public.meetup_participants;
CREATE POLICY "Users can join meetups" ON public.meetup_participants 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave meetups" ON public.meetup_participants;
CREATE POLICY "Users can leave meetups" ON public.meetup_participants 
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Indices for performance
CREATE INDEX IF NOT EXISTS idx_meetup_participants_meetup_id ON public.meetup_participants(meetup_id);
CREATE INDEX IF NOT EXISTS idx_meetup_participants_user_id ON public.meetup_participants(user_id);
