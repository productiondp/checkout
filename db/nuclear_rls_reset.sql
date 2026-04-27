-- NUCLEAR RLS RESET: CHAT & CONNECTIONS
-- This script will wipe out ALL policies on chat-related tables to stop recursion errors.

-- 1. DISABLE RLS TEMPORARILY TO BREAK RECURSION
ALTER TABLE IF EXISTS public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.connections DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_rooms DISABLE ROW LEVEL SECURITY;

-- 2. DROP EVERY POSSIBLE POLICY BY NAME
-- (Covers all variations found in different versions of the schema)
DO $$ 
DECLARE 
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('messages', 'connections', 'participants', 'chat_participants', 'chat_rooms')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 3. RE-ENABLE RLS WITH CLEAN, NON-RECURSIVE POLICIES
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- SIMPLE, DIRECT POLICIES (NO JOIN QUERIES TO OTHER TABLES IN THE POLICY ITSELF IF POSSIBLE)
-- For connections: Just check the IDs
CREATE POLICY "conn_select" ON public.connections FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "conn_insert" ON public.connections FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "conn_update" ON public.connections FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- For messages: Use a VERY SIMPLE check. 
-- To avoid recursion, we check sender/receiver IDs directly on the message if they exist.
-- If the table has these columns (which we added), it's safer.
CREATE POLICY "msg_select" ON public.messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "msg_insert" ON public.messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "msg_update" ON public.messages FOR UPDATE 
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- 4. REFRESH EVERYTHING
NOTIFY pgrst, 'reload schema';
