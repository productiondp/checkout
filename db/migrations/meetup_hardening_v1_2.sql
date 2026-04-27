-- MEETUP FINAL HARDENING V1.2
-- Advanced Chat Types and Host Controls

-- 1. Add Message Type Enum
DO $$ BEGIN
    CREATE TYPE message_type AS ENUM ('USER', 'SYSTEM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS type message_type DEFAULT 'USER';

-- 2. Add Meetup Status Enum
DO $$ BEGIN
    CREATE TYPE meetup_status AS ENUM ('upcoming', 'live', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS status meetup_status DEFAULT 'upcoming';

-- 3. Add Participant Controls
ALTER TABLE public.meetup_participants ADD COLUMN IF NOT EXISTS is_muted BOOLEAN DEFAULT false;

-- 4. Pinned Messages for Chat Rooms
ALTER TABLE public.chat_rooms ADD COLUMN IF NOT EXISTS pinned_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;

-- 5. RLS UPDATES
-- Ensure system messages are viewable by participants
DROP POLICY IF EXISTS "Users can see messages in rooms they are in" ON public.messages;
CREATE POLICY "Users can see messages in rooms they are in" ON public.messages FOR SELECT
USING (EXISTS (SELECT 1 FROM participants WHERE room_id = messages.room_id AND user_id = auth.uid()));
