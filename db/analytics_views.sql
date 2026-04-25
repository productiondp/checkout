-- CHECKOUT OS ANALYTICS DASHBOARD VIEWS
-- Purpose: Actionable product insights and funnel monitoring

-- 1. DAILY SIGNUPS
CREATE OR REPLACE VIEW daily_signups AS
SELECT 
  date_trunc('day', created_at) AS day,
  count(*) AS count
FROM public.analytics_events
WHERE event_type = 'USER_SIGNUP'
GROUP BY 1
ORDER BY 1 DESC;

-- 2. DAILY VERIFIED
CREATE OR REPLACE VIEW daily_verified AS
SELECT 
  date_trunc('day', created_at) AS day,
  count(*) AS count
FROM public.analytics_events
WHERE event_type = 'USER_VERIFIED'
GROUP BY 1
ORDER BY 1 DESC;

-- 3. DAILY ONBOARDING COMPLETED
CREATE OR REPLACE VIEW daily_onboarding_completed AS
SELECT 
  date_trunc('day', created_at) AS day,
  count(*) AS count
FROM public.analytics_events
WHERE event_type = 'ONBOARDING_COMPLETED'
GROUP BY 1
ORDER BY 1 DESC;

-- 4. DAILY FIRST ACTIONS (Requirements & Connections)
CREATE OR REPLACE VIEW daily_first_actions AS
SELECT 
  date_trunc('day', created_at) AS day,
  count(*) AS action_count,
  count(DISTINCT user_id) AS unique_users
FROM public.analytics_events
WHERE event_type IN ('REQUIREMENT_CREATED', 'CONNECTION_SENT')
GROUP BY 1
ORDER BY 1 DESC;

-- 5. REAL-TIME FUNNEL SNAPSHOT
CREATE OR REPLACE VIEW funnel_snapshot AS
WITH totals AS (
  SELECT
    count(*) FILTER (WHERE event_type = 'USER_SIGNUP') as signups,
    count(*) FILTER (WHERE event_type = 'USER_VERIFIED') as verified,
    count(*) FILTER (WHERE event_type = 'ONBOARDING_COMPLETED') as onboarding,
    count(DISTINCT user_id) FILTER (WHERE event_type IN ('REQUIREMENT_CREATED', 'CONNECTION_SENT')) as active_users
  FROM public.analytics_events
)
SELECT
  signups,
  verified,
  onboarding,
  active_users,
  CASE WHEN signups > 0 THEN (verified::float / signups::float) * 100 ELSE 0 END as verification_rate,
  CASE WHEN verified > 0 THEN (onboarding::float / verified::float) * 100 ELSE 0 END as onboarding_completion_rate,
  CASE WHEN onboarding > 0 THEN (active_users::float / onboarding::float) * 100 ELSE 0 END as first_action_rate
FROM totals;
