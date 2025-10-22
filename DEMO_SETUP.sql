-- Demo Account Setup for Judges
-- Run this SQL in Supabase SQL Editor after creating demo@smartopsagent.com account

-- Step 1: Find the demo user ID (run this first to get the user_id)
-- SELECT id FROM auth.users WHERE email = 'demo@smartopsagent.com';

-- Step 2: Replace 'YOUR_DEMO_USER_ID' below with the actual UUID from Step 1
-- Then run the INSERT statements with real API keys

-- Insert demo user integrations with API keys
INSERT INTO public.user_integrations (user_id, integration_type, credentials, is_active, created_at, updated_at)
VALUES
  (
    'YOUR_DEMO_USER_ID',
    'github',
    jsonb_build_object(
      'token', 'YOUR_GITHUB_TOKEN',
      'org', 'YOUR_GITHUB_ORG_OR_USERNAME'
    ),
    true,
    NOW(),
    NOW()
  ),
  (
    'YOUR_DEMO_USER_ID',
    'vercel',
    jsonb_build_object(
      'token', 'YOUR_VERCEL_TOKEN',
      'teamId', 'YOUR_VERCEL_TEAM_ID'
    ),
    true,
    NOW(),
    NOW()
  ),
  (
    'YOUR_DEMO_USER_ID',
    'alchemy',
    jsonb_build_object(
      'apiKey', 'YOUR_ALCHEMY_API_KEY'
    ),
    true,
    NOW(),
    NOW()
  ),
  (
    'YOUR_DEMO_USER_ID',
    'discord',
    jsonb_build_object(
      'webhookUrl', 'YOUR_DISCORD_WEBHOOK_URL'
    ),
    true,
    NOW(),
    NOW()
  ),
  (
    'YOUR_DEMO_USER_ID',
    'slack',
    jsonb_build_object(
      'webhookUrl', 'YOUR_SLACK_WEBHOOK_URL'
    ),
    true,
    NOW(),
    NOW()
  );

-- Verify the insertions
SELECT
  integration_type,
  is_active,
  created_at
FROM public.user_integrations
WHERE user_id = 'YOUR_DEMO_USER_ID';
