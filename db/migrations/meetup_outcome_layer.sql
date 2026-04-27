-- MEETUP OUTCOME LAYER
-- Measuring value created by meetups

-- 1. Add outcome_data to posts (JSONB for flexibility)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS outcome_data JSONB;

-- 2. Add outcome_type to meetup_participants (to track individual success)
ALTER TABLE public.meetup_participants ADD COLUMN IF NOT EXISTS outcome_type TEXT;
