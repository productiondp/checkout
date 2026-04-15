-- CHECKOUT PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Includes pgvector for AI Match Engine

-- ENABLE PGVECTOR
CREATE EXTENSION IF NOT EXISTS vector;

-- 👤 USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT,
  skills TEXT[],
  industries TEXT[],
  location TEXT,
  intent TEXT[],
  is_premium BOOLEAN DEFAULT false,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📢 OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  skills_required TEXT[],
  industry TEXT,
  location TEXT,
  urgency TEXT CHECK (urgency IN ('high', 'normal')),
  budget TEXT,
  requires_physical_presence BOOLEAN DEFAULT false,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🤝 DEALS TABLE
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  opp_id UUID REFERENCES opportunities(id),
  status TEXT CHECK (status IN ('pending', 'escrow', 'completed', 'disputed')),
  price INT,
  currency TEXT DEFAULT 'INR',
  proposal_data JSONB, -- Stores AI-suggested scope/deliverables
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ⭐ REPUTATION & RATINGS
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user UUID REFERENCES users(id),
  to_user UUID REFERENCES users(id),
  score INT CHECK (score >= 1 AND score <= 5),
  review TEXT,
  deal_id UUID REFERENCES deals(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📈 ANALYTICS LOGS
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  event_type TEXT, -- 'profile_view', 'lead_generated', 'match_view'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
