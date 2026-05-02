-- FINAL PRODUCTION SYNC: BUSINESS OS INFRASTRUCTURE
-- Objective: Synchronize all structural gaps for the live environment.
-- Idempotent: Can be run multiple times without failure.

-- 1. UPDATE ENUMS
DO $$ BEGIN
    -- Ensure REQUIREMENT exists in post_type
    ALTER TYPE public.post_type ADD VALUE IF NOT EXISTS 'REQUIREMENT';
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 2. HARDEN PROFILES TABLE
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS base_tag TEXT,
ADD COLUMN IF NOT EXISTS intent_tags TEXT[],
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- 3. HARDEN POSTS TABLE
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES public.chat_rooms(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS live_at TIMESTAMPTZ;

-- 4. CREATE ONBOARDING_STATE TRACKER
CREATE TABLE IF NOT EXISTS public.onboarding_state (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    step TEXT DEFAULT 'initial',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CREATE FOCUS_LIBRARY
CREATE TABLE IF NOT EXISTS public.focus_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    industry TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(label, industry)
);

-- 6. CREATE MEETUP_PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.meetup_participants (
  meetup_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'JOINED',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (meetup_id, user_id)
);

-- 7. ENABLE RLS & POLICIES
ALTER TABLE public.onboarding_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetup_participants ENABLE ROW LEVEL SECURITY;

-- 7.1 Onboarding State Policies
DROP POLICY IF EXISTS "Users can manage own onboarding state" ON public.onboarding_state;
CREATE POLICY "Users can manage own onboarding state" ON public.onboarding_state
    FOR ALL USING (auth.uid() = user_id);

-- 7.2 Focus Library Policies
DROP POLICY IF EXISTS "Everyone can view focus_library" ON public.focus_library;
CREATE POLICY "Everyone can view focus_library" ON public.focus_library FOR SELECT USING (true);
DROP POLICY IF EXISTS "Everyone can insert focus_library" ON public.focus_library;
CREATE POLICY "Everyone can insert focus_library" ON public.focus_library FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Everyone can update focus_library" ON public.focus_library;
CREATE POLICY "Everyone can update focus_library" ON public.focus_library FOR UPDATE USING (true);

-- 7.3 Meetup Participants Policies
DROP POLICY IF EXISTS "Participants are viewable by everyone" ON public.meetup_participants;
CREATE POLICY "Participants are viewable by everyone" ON public.meetup_participants FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can join meetups" ON public.meetup_participants;
CREATE POLICY "Users can join meetups" ON public.meetup_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can leave meetups" ON public.meetup_participants;
CREATE POLICY "Users can leave meetups" ON public.meetup_participants FOR DELETE USING (auth.uid() = user_id);

-- 8. PERFORMANCE INDICES
CREATE INDEX IF NOT EXISTS idx_meetup_participants_meetup_id ON public.meetup_participants(meetup_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_state_user_id ON public.onboarding_state(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_room_id ON public.posts(room_id);

-- 9. REALTIME ACTIVATION
ALTER PUBLICATION supabase_realtime ADD TABLE meetup_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE focus_library;
