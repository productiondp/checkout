-- V11 PRODUCTION SCHEMA FIX
-- Run this in the Supabase SQL Editor to resolve "Try again. Check connection" errors.

-- 1. Update post_type Enum
ALTER TYPE post_type ADD VALUE IF NOT EXISTS 'REQUIREMENT';
ALTER TYPE post_type ADD VALUE IF NOT EXISTS 'PARTNERSHIP';

-- 2. Add Missing Columns to public.posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS context TEXT DEFAULT 'PROFESSIONAL';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'Medium';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS "partnershipType" TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS "commitmentLevel" TEXT DEFAULT 'High';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'Offline';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS "dateTime" TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS normalized_tokens TEXT[];

-- 3. Create System Logs table (Required for Observability Dashboard)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Platform Health table
CREATE TABLE IF NOT EXISTS public.platform_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metrics JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'Healthy',
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable RLS and Policies for new tables
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin view all logs" ON public.system_logs;
CREATE POLICY "Admin view all logs" ON public.system_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "System can insert logs" ON public.system_logs;
CREATE POLICY "System can insert logs" ON public.system_logs FOR INSERT WITH CHECK (true);

ALTER TABLE public.platform_health ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone can view health" ON public.platform_health;
CREATE POLICY "Everyone can view health" ON public.platform_health FOR SELECT USING (true);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_posts_idempotency ON public.posts(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_logs_event_type ON public.system_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.system_logs(created_at);
