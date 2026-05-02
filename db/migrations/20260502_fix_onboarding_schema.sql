-- MIGRATION: FIX ONBOARDING SCHEMA
-- Objective: Ensure all tables and columns required by the onboarding flow exist.

-- 1. Create focus_library table
CREATE TABLE IF NOT EXISTS public.focus_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    industry TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(label, industry)
);

-- 2. Add missing columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS base_tag TEXT,
ADD COLUMN IF NOT EXISTS intent_tags TEXT[],
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- 3. Enable RLS for focus_library
ALTER TABLE public.focus_library ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'focus_library' AND policyname = 'Everyone can view focus_library') THEN
        CREATE POLICY "Everyone can view focus_library" ON public.focus_library FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'focus_library' AND policyname = 'Everyone can insert/update focus_library') THEN
        CREATE POLICY "Everyone can insert/update focus_library" ON public.focus_library FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'focus_library' AND policyname = 'Everyone can update focus_library') THEN
        CREATE POLICY "Everyone can update focus_library" ON public.focus_library FOR UPDATE USING (true);
    END IF;
END $$;
