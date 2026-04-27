-- EMERGENCY FIX: RLS RECURSION CLEANUP
-- Run this in the Supabase SQL Editor to stop the "infinite recursion" error.

-- 1. DROP ALL OLD POLICIES (Cleans up the room/participant logic conflicts)
DROP POLICY IF EXISTS "Users can see messages in rooms they are in" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to rooms they are in" ON public.messages;
DROP POLICY IF EXISTS "Users can see rooms they are in" ON public.chat_rooms;
DROP POLICY IF EXISTS "Users can see own connections" ON public.connections;
DROP POLICY IF EXISTS "Users can create connections" ON public.connections;
DROP POLICY IF EXISTS "Users can update own connections" ON public.connections;
DROP POLICY IF EXISTS "Users can see messages for their connections" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their connections" ON public.messages;

-- 2. HARDEN CONNECTIONS RLS (Deterministic)
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "connections_select_policy" ON public.connections 
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "connections_insert_policy" ON public.connections 
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "connections_update_policy" ON public.connections 
FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 3. HARDEN MESSAGES RLS (Deterministic)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Select Policy: Optimized for Connection ID
CREATE POLICY "messages_select_policy" ON public.messages 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.connections c
        WHERE c.id = connection_id 
        AND (c.sender_id = auth.uid() OR c.receiver_id = auth.uid())
    )
);

-- Insert Policy: Optimized for Connection ID
CREATE POLICY "messages_insert_policy" ON public.messages 
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.connections c
        WHERE c.id = connection_id 
        AND (c.sender_id = auth.uid() OR c.receiver_id = auth.uid())
    )
);

-- 4. RE-SYNC SCHEMA CACHE
-- This helps Supabase recognize the new columns immediately
NOTIFY pgrst, 'reload schema';
