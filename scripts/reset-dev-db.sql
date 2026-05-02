-- CheckOut OS: Dev Sandbox Reset Script
-- WARNING: This will delete ALL data in your dev project.
-- Run this in the SQL Editor of your 'checkout-dev' project.

TRUNCATE profiles, posts, connections, messages, notifications, meetups CASCADE;

-- Optional: Re-insert a single system profile if needed
-- INSERT INTO profiles (id, full_name, role, onboarding_completed) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'System', 'SYSTEM', true);
