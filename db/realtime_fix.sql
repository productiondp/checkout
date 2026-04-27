-- ENABLE REALTIME FOR CONNECTIONS
-- This ensures the pending_requests_count updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS connections;

-- ENSURE COLUMNS EXIST
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS receiver_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.connections ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
