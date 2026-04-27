-- DANGER: DATA DESTRUCTION & SCHEMA FIX PROTOCOL
-- This script wipes all data and ensures the schema is correct.
-- RUN THIS IN THE SUPABASE SQL EDITOR.

-- 1. FIX SCHEMA (Ensures no "Failed to save" errors)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS intent_tags TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- 2. SETUP STORAGE (Fixes profile picture upload)
-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow users to manage their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Allow public access to the avatars bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');

-- 3. Disable triggers
SET session_replication_role = 'replica';

-- 4. Clear all tactical tables
TRUNCATE TABLE public.analytics_events CASCADE;
TRUNCATE TABLE public.ratings CASCADE;
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.memberships CASCADE;
TRUNCATE TABLE public.communities CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.messages CASCADE;
TRUNCATE TABLE public.participants CASCADE;
TRUNCATE TABLE public.chat_rooms CASCADE;
TRUNCATE TABLE public.posts CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- 5. Reset triggers
SET session_replication_role = 'origin';

-- SUCCESS: DATABASE & STORAGE READY.
