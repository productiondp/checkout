-- TRUST ENGINE V1
-- Implementing the Trust Engine for Advisor Visibility and Confidence

-- 1. Create votes table for participant validation
CREATE TABLE IF NOT EXISTS public.meetup_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meetup_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(meetup_id, user_id)
);

-- 2. Add advisor_score to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS advisor_score FLOAT DEFAULT 0.0;

-- 3. RLS for votes
ALTER TABLE public.meetup_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Votes are viewable by everyone" ON public.meetup_votes;
CREATE POLICY "Votes are viewable by everyone" ON public.meetup_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Participants can vote" ON public.meetup_votes;
CREATE POLICY "Participants can vote" ON public.meetup_votes FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM meetup_participants 
    WHERE meetup_id = public.meetup_votes.meetup_id AND user_id = auth.uid()
  )
);

-- 4. Add index for performance
CREATE INDEX IF NOT EXISTS idx_meetup_votes_meetup_id ON public.meetup_votes(meetup_id);
CREATE INDEX IF NOT EXISTS idx_profiles_advisor_score ON public.profiles(advisor_score);
