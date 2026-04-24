-- PRODUCTION MIGRATION: 20260424_STABILIZE_PROFILES
-- Objective: Stabilize the professional identification ledger by promoting core metadata to first-class columns.

-- 1. ADD CORE COLUMNS
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS services TEXT[],
ADD COLUMN IF NOT EXISTS intent_tags TEXT[],
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS experience_months INTEGER;

-- 2. DATA MIGRATION (Move values from JSONB metadata if they exist)
UPDATE public.profiles
SET 
  onboarding_completed = COALESCE((metadata->>'onboarding_completed')::BOOLEAN, onboarding_completed),
  business_type = COALESCE(metadata->>'business_type', business_type),
  company_name = COALESCE(metadata->>'company_name', company_name),
  experience_years = COALESCE((metadata->>'experience_years')::INTEGER, experience_years),
  experience_months = COALESCE((metadata->>'experience_months')::INTEGER, experience_months),
  intent_tags = COALESCE(ARRAY(SELECT jsonb_array_elements_text(metadata->'intent_tags')), domains, intent_tags),
  services = COALESCE(ARRAY(SELECT jsonb_array_elements_text(metadata->'services')), services);

-- 3. INDEXING FOR DISCOVERY
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
