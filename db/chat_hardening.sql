-- HARDENING MIGRATION: CHAT & CONNECTIONS
-- Run this to fix "Disappearing messages" and "Sync" issues.

-- 1. CONNECTIONS TABLE (Single Source of Truth)
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(sender_id, receiver_id)
);

-- 2. MESSAGES TABLE (Hardening)
-- Ensure all required columns exist for the new connection-based chat
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS connection_id UUID REFERENCES public.connections(id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- 3. ENABLE REALTIME
-- Clear old publication and recreate for safety (avoiding IF NOT EXISTS syntax errors)
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.messages, 
    public.connections, 
    public.notifications, 
    public.profiles;

-- 4. RLS HARDENING
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see own connections" ON public.connections;
CREATE POLICY "Users can see own connections" ON public.connections FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can create connections" ON public.connections;
CREATE POLICY "Users can create connections" ON public.connections FOR INSERT
WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update own connections" ON public.connections;
CREATE POLICY "Users can update own connections" ON public.connections FOR UPDATE
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Messages RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see messages for their connections" ON public.messages;
CREATE POLICY "Users can see messages for their connections" ON public.messages FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.connections 
    WHERE id = messages.connection_id 
    AND (sender_id = auth.uid() OR receiver_id = auth.uid())
));

DROP POLICY IF EXISTS "Users can send messages to their connections" ON public.messages;
CREATE POLICY "Users can send messages to their connections" ON public.messages FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.connections 
    WHERE id = messages.connection_id 
    AND (sender_id = auth.uid() OR receiver_id = auth.uid())
));

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_messages_connection ON public.messages(connection_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connections_sender ON public.connections(sender_id);
-- 6. TRIGGER HARDENING (Notifications)
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger AS $$
DECLARE
  v_recipient_id UUID;
  v_sender_name TEXT;
BEGIN
  -- 1. Identify Recipient from Connection (Step 5/6)
  SELECT 
    CASE WHEN sender_id = NEW.sender_id THEN receiver_id ELSE sender_id END
  INTO v_recipient_id
  FROM public.connections
  WHERE id = NEW.connection_id;

  -- 2. Fetch Sender Name for Notification
  SELECT full_name INTO v_sender_name FROM public.profiles WHERE id = NEW.sender_id;

  -- 3. Atomic Notification Insert
  IF v_recipient_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      v_recipient_id,
      'New Message',
      COALESCE(v_sender_name, 'Someone') || ' sent you a message.',
      'MESSAGE',
      '/chat?user=' || NEW.sender_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_message();
