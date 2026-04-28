-- COMMUNITY HARDENING V1.0
-- Enables Focused Groups, Private Access, and Advisor Integration

-- 1. Update Communities Table
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'OPEN'; -- OPEN, PRIVATE, ADVISOR_LED
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS membership_rule TEXT DEFAULT 'ANYONE'; -- ANYONE, APPROVAL
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 80;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Add community_id to posts (Scope posts to communities)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE;

-- 3. Indices for performance
CREATE INDEX IF NOT EXISTS idx_communities_type ON public.communities(type);
CREATE INDEX IF NOT EXISTS idx_communities_host ON public.communities(host_id);
CREATE INDEX IF NOT EXISTS idx_posts_community ON public.posts(community_id);

-- 4. RLS for Memberships
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Memberships are viewable by everyone" ON public.memberships;
CREATE POLICY "Memberships are viewable by everyone" ON public.memberships FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can join communities" ON public.memberships;
CREATE POLICY "Users can join communities" ON public.memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can leave communities" ON public.memberships;
CREATE POLICY "Users can leave communities" ON public.memberships FOR DELETE USING (auth.uid() = user_id);
