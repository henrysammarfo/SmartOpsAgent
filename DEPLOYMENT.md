# Deployment Guide

This guide covers deploying SmartOpsAgent to production using Railway (backend) and Vercel (frontend).

## Current Deployment Status

**Backend (Railway)**: ✅ Live at https://smartopsagent-production.up.railway.app

**Frontend (Vercel)**: ✅ Live at https://smart-ops-agent.vercel.app

**Demo Account**: demo@smartopsagent.com / DemoPass2025!

## Prerequisites

- GitHub account with SmartOpsAgent repository
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Supabase project set up with database tables

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your SmartOpsAgent repository
5. Railway will detect the backend automatically

### Step 2: Configure Build Settings

1. In Railway project settings, set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

**Note**: Railway will automatically use `npm ci` for production builds, which is faster and more reliable than `npm install`.

### Step 3: Add Environment Variables

In Railway project → Variables tab, add all environment variables from `backend/.env`:

```
PORT=3001
WS_PORT=3002
NODE_ENV=production

# Supabase
SUPABASE_SUPABASE_URL=your_supabase_url
SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Vercel
VERCEL_TOKEN=your_vercel_token

# GitHub
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=SmartOpsAgent

# Web3
ETHEREUM_RPC_URL=https://ethereum.publicnode.com
POLYGON_RPC_URL=https://polygon-bor-rpc.publicnode.com

# AI
OPENAI_API_KEY=your_openai_key
AI_MODEL=gpt-4-turbo-preview

# Database
DATABASE_URL=your_neon_database_url

# Webhooks
DISCORD_WEBHOOK_URL=your_discord_webhook
SLACK_WEBHOOK_URL=your_slack_webhook
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Railway will provide a public URL (e.g., `https://smartopsagent-backend.railway.app`)
4. Copy this URL - you'll need it for the frontend

### Step 5: Verify Backend Deployment

Test the backend API endpoint (requires authentication):
```bash
curl https://smartopsagent-production.up.railway.app/api/metrics
```

Should return: `{"error":"No authorization header"}` (this confirms the backend is running and auth is working)

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your SmartOpsAgent GitHub repository
4. Vercel will auto-detect Next.js configuration

### Step 2: Configure Project Settings

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (leave as root)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
# Backend API URL (Railway - already deployed)
NEXT_PUBLIC_API_URL=https://smartopsagent-production.up.railway.app/api
NEXT_PUBLIC_WS_URL=wss://smartopsagent-production.up.railway.app

# Supabase (Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://wdmeqwveedkxiuzbalfq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWVxd3ZlZWRreGl1emJhbGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTY1MzIsImV4cCI6MjA3NjQzMjUzMn0.kqaV0EoTs8GrU9ky9sEULIRH-8tiwbTd7O6K-Z3j2so
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (1-2 minutes)
3. Vercel will provide a production URL (e.g., `https://smartopsagent.vercel.app`)

### Step 5: Verify Frontend Deployment

1. Visit your Vercel URL
2. Try logging in with demo credentials:
   - Email: `demo@smartopsagent.com`
   - Password: `DemoPass2025!`
3. Verify dashboard loads with live data

## Part 3: Post-Deployment Configuration

### Update CORS Settings

If you encounter CORS errors, update backend CORS configuration:

1. In Railway → Environment Variables, add:
```
FRONTEND_URL=https://your-vercel-url.vercel.app
```

2. Redeploy backend

### Update Webhook URLs

If using Discord/Slack webhooks:

1. Update webhook URLs in Supabase for demo account
2. Run in Supabase SQL Editor:
```sql
UPDATE public.user_integrations
SET
  discord_webhook_url = 'your_new_discord_webhook',
  slack_webhook_url = 'your_new_slack_webhook'
WHERE user_id = 'ce174d99-63ed-4812-9461-f326bd66d8e5';
```

### Custom Domain (Optional)

#### Vercel Frontend:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### Railway Backend:
1. Go to Project Settings → Domains
2. Add custom domain
3. Update frontend environment variable `NEXT_PUBLIC_API_URL`

## Part 4: Monitoring & Maintenance

### Check Backend Logs

Railway Dashboard → Deployments → View Logs

Look for:
- Server startup messages
- API endpoint registrations
- WebSocket connections
- Agent activity

### Check Frontend Logs

Vercel Dashboard → Deployments → Function Logs

Monitor for:
- Build errors
- Runtime errors
- API connection issues

### Database Monitoring

Supabase Dashboard → Database → Query Performance

Watch for:
- Slow queries
- Connection pool usage
- Table sizes

## Troubleshooting

### Backend not connecting to frontend

1. Verify CORS settings in backend
2. Check `NEXT_PUBLIC_API_URL` in Vercel
3. Ensure Railway backend is publicly accessible

### WebSocket connection failing

1. Check `NEXT_PUBLIC_WS_URL` uses `wss://` protocol
2. Verify Railway exposes WebSocket port (3002)
3. Check browser console for connection errors

### Database connection errors

1. Verify `DATABASE_URL` in Railway
2. Check Supabase connection pooler settings
3. Ensure IP allowlist includes Railway IPs (if configured)

### API integrations not working

1. Verify all API keys in Railway environment variables
2. Check Supabase `user_integrations` table has correct keys
3. Test individual API endpoints manually

## Security Checklist

- [ ] All environment variables set in Railway
- [ ] All environment variables set in Vercel
- [ ] No API keys in source code
- [ ] CORS configured correctly
- [ ] Supabase RLS policies enabled
- [ ] Database backups configured
- [ ] SSL/TLS enabled (automatic on Railway/Vercel)
- [ ] Rate limiting enabled (if needed)

## Performance Optimization

### Railway Backend
- Enable auto-scaling if needed
- Monitor memory usage
- Check response times

### Vercel Frontend
- Image optimization enabled (automatic)
- Edge caching configured (automatic)
- Monitor Core Web Vitals

## Cost Estimation

### Railway (Backend)
- Free tier: $5 credit/month
- Estimated cost: $5-10/month for hobby project

### Vercel (Frontend)
- Free tier: Unlimited bandwidth for personal projects
- Estimated cost: $0/month for hackathon/demo

### Supabase (Database)
- Free tier: 500MB database, 50MB file storage
- Estimated cost: $0/month for demo

## Support

For deployment issues:
- Railway: https://railway.app/help
- Vercel: https://vercel.com/help
- Supabase: https://supabase.com/docs

For project issues:
- GitHub: https://github.com/henrysammarfo/SmartOpsAgent/issues
