-- ========================================
-- Demo Account Setup for Judges
-- ========================================
-- This SQL script adds API integrations to the demo account
-- so judges can see LIVE DATA when they login.
--
-- Run this in Supabase SQL Editor AFTER creating demo user
-- ========================================

-- Step 1: Find the demo user ID
-- Go to Supabase Dashboard > Authentication > Users
-- Find: demo@smartopsagent.com
-- Copy the UUID (shown as 'ce174d99-63ed-4812-9461-f326bd66d8e5' in this example)

-- Step 2: Replace 'ce174d99-63ed-4812-9461-f326bd66d8e5' below with actual UUID if different
-- Then run this entire script

-- Delete existing integrations for demo user (if any)
DELETE FROM public.user_integrations
WHERE user_id = 'ce174d99-63ed-4812-9461-f326bd66d8e5';

-- Insert ALL API keys in a single row with REAL values from backend/.env
INSERT INTO public.user_integrations (
  user_id,
  github_token,
  github_username,
  vercel_token,
  ethereum_rpc_url,
  polygon_rpc_url,
  discord_webhook_url,
  slack_webhook_url,
  openai_api_key,
  created_at,
  updated_at
)
VALUES (
  'ce174d99-63ed-4812-9461-f326bd66d8e5',                                           -- user_id (REPLACE WITH YOUR DEMO USER UUID)
  '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',                                       -- github_token (from GITHUB_TOKEN in .env)
  'henrysammarfo',                                                                   -- github_username (from GITHUB_OWNER in .env)
  '4slQcSIPl7c8DuCvnhRnapO6',                                                       -- vercel_token (from VERCEL_TOKEN in .env)
  'https://ethereum.publicnode.com',                                                -- ethereum_rpc_url (FREE public RPC - no auth!)
  'https://polygon-bor-rpc.publicnode.com',                                         -- polygon_rpc_url (FREE public RPC - no auth!)
  'https://discord.com/api/webhooks/1429478189922652260/VhsWrbu8ZzMaUtWrT1U3Z1I1PHdrBZklJZrG_Por_O9SvM1GxsYmTSk2UUGlh7315YnK',  -- discord_webhook_url
  'https://hooks.slack.com/services/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', -- slack_webhook_url
  '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',  -- openai_api_key (from OPENAI_API_KEY in .env)
  NOW(),                                                                             -- created_at
  NOW()                                                                              -- updated_at
);

-- Verify the integration was added
SELECT
  user_id,
  github_username,
  CASE WHEN github_token IS NOT NULL THEN '✓ Configured' ELSE '✗ Missing' END as github,
  CASE WHEN vercel_token IS NOT NULL THEN '✓ Configured' ELSE '✗ Missing' END as vercel,
  CASE WHEN ethereum_rpc_url IS NOT NULL THEN '✓ Configured' ELSE '✗ Missing' END as ethereum,
  CASE WHEN polygon_rpc_url IS NOT NULL THEN '✓ Configured' ELSE '✗ Missing' END as polygon,
  CASE WHEN discord_webhook_url IS NOT NULL THEN '✓ Configured' ELSE '✗ Missing' END as discord,
  CASE WHEN slack_webhook_url IS NOT NULL THEN '✓ Configured' ELSE '✗ Missing' END as slack,
  CASE WHEN openai_api_key IS NOT NULL THEN '✓ Configured' ELSE '✗ Missing' END as openai,
  created_at
FROM public.user_integrations
WHERE user_id = 'ce174d99-63ed-4812-9461-f326bd66d8e5';

-- ========================================
-- Expected Result:
-- You should see 1 row with all integrations marked as "✓ Configured":
-- - github: ✓ Configured
-- - vercel: ✓ Configured
-- - ethereum: ✓ Configured
-- - polygon: ✓ Configured
-- - discord: ✓ Configured
-- - slack: ✓ Configured
-- - openai: ✓ Configured
--
-- If any show "✗ Missing", check the .env file and update the script
-- ========================================
