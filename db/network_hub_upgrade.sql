-- NETWORK HUB SYSTEM UPGRADE
-- Implementation of Hyperlocal Partnership Logic
-- Compatible with existing schema (connections, chat_rooms, profiles)

-- 1. PARTNERS TABLE (For bi-directional partnership records)
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    connection_id UUID REFERENCES public.connections(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_1, user_2)
);

-- 2. SECURITY (RLS)
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see own partners" ON public.partners;
CREATE POLICY "Users can see own partners" ON public.partners 
FOR SELECT USING (auth.uid() = user_1 OR auth.uid() = user_2);

-- 3. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_partners_users ON public.partners(user_1, user_2);
CREATE INDEX IF NOT EXISTS idx_connections_receiver_status ON public.connections(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON public.participants(user_id);

-- 4. REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE partners;

-- 5. ATOMIC ACCEPT LOGIC (RPC)
CREATE OR REPLACE FUNCTION public.accept_connection_request(p_connection_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sender_id UUID;
    v_receiver_id UUID;
    v_room_id UUID;
    v_partner_id UUID;
BEGIN
    -- 1. Fetch and Lock connection
    SELECT sender_id, receiver_id INTO v_sender_id, v_receiver_id
    FROM public.connections
    WHERE id = p_connection_id AND status = 'PENDING'
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Request not found or already processed');
    END IF;

    -- 2. Update status
    UPDATE public.connections
    SET status = 'ACCEPTED', updated_at = now()
    WHERE id = p_connection_id;

    -- 3. Create Partnership record (Standardized order for user_1, user_2)
    INSERT INTO public.partners (user_1, user_2, connection_id)
    VALUES (
        LEAST(v_sender_id, v_receiver_id),
        GREATEST(v_sender_id, v_receiver_id),
        p_connection_id
    )
    ON CONFLICT (user_1, user_2) DO NOTHING
    RETURNING id INTO v_partner_id;

    -- 4. Create Chat Room
    INSERT INTO public.chat_rooms (title, is_group)
    VALUES (NULL, false)
    RETURNING id INTO v_room_id;

    -- 5. Add Participants
    INSERT INTO public.participants (room_id, user_id)
    VALUES (v_room_id, v_sender_id), (v_room_id, v_receiver_id);

    -- 6. Link Connection to Room (Optional but helpful for cross-module sync)
    UPDATE public.connections SET metadata = metadata || jsonb_build_object('room_id', v_room_id) WHERE id = p_connection_id;

    RETURN jsonb_build_object(
        'success', true, 
        'connection_id', p_connection_id,
        'partner_id', v_partner_id,
        'room_id', v_room_id
    );
END;
$$;

-- 6. RELOAD
NOTIFY pgrst, 'reload schema';
