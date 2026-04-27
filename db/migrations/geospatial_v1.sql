-- V1.21 GEOSPATIAL DISCOVERY LAYER
-- Adds location awareness to professionals and meetups.

-- 1. PROFILES (ADVISORS)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- 2. POSTS (MEETUPS)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- 3. INDEXING FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(lat, lng);
CREATE INDEX IF NOT EXISTS idx_posts_location ON public.posts(lat, lng);

-- 4. SEED DATA (MOCK LOCATIONS FOR DISCOVERY)
-- Assuming center of Dubai for demo: 25.2048, 55.2708
UPDATE public.profiles 
SET lat = 25.2048 + (random() - 0.5) * 0.1, 
    lng = 55.2708 + (random() - 0.5) * 0.1
WHERE role = 'advisor' OR is_advisor = true;

UPDATE public.posts 
SET lat = 25.2048 + (random() - 0.5) * 0.1, 
    lng = 55.2708 + (random() - 0.5) * 0.1
WHERE type = 'MEETUP';
