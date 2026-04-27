-- MEETUP FINAL HARDENING V1.3
-- Pinned Messages and Live Activation

-- 1. Add PINNED to message_type
ALTER TYPE public.message_type ADD VALUE IF NOT EXISTS 'PINNED';

-- 2. Add live_at timestamp to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS live_at TIMESTAMPTZ;

-- 3. Function to auto-activate meetups (optional, can be done via cron or manual)
-- For now we focus on the manual trigger via UI
