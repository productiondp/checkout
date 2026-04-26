-- DANGER: DATA DESTRUCTION PROTOCOL
-- This script wipes all user-generated data and system logs.
-- RUN THIS IN THE SUPABASE SQL EDITOR TO CLEAR THE DATABASE.

-- 1. Disable triggers to prevent recursive side-effects
SET session_replication_role = 'replica';

-- 2. Clear all tactical tables
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

-- 3. Reset triggers
SET session_replication_role = 'origin';

-- 4. Note on auth.users:
-- Truncating public.profiles will not remove users from Supabase Auth.
-- To remove all users from auth, run the following:
-- DELETE FROM auth.users;

-- 5. System Log
-- Note: Profiles must exist for this to work if author_id is required, 
-- but we just truncated everything. We skip the log or use a system ID.

-- SUCCESS: DATABASE CLEARED.
