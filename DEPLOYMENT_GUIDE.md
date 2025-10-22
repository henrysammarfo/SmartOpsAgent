# SmartOpsAgent Deployment Guide

Complete step-by-step guide to deploy SmartOpsAgent Dashboard for hackathon judging.

## Prerequisites

- Node.js 22+ installed locally
- Git installed
- Vercel account (free tier)
- Railway/Render account (free tier) for backend
- Supabase account (free tier)
- API keys from services listed below

---

## Part 1: Local Development Setup

### Step 1: Clone and Install Dependencies

```bash
# Navigate to project
cd SmartOpsAgent

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Configure Frontend Environment

Create `.env.local` in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3002

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wdmeqwveedkxiuzbalfq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWVxd3ZlZWRreGl1emJhbGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODM1MzgsImV4cCI6MjA1MzA1OTUzOH0.CPIyqBuRs61S2aIXGh_q5F5sLDxSvqHSVSy8-a1CG_I
```

### Step 3: Configure Backend Environment

Create `backend/.env`:

```bash
# Server Configuration
PORT=3001
WS_PORT=3002

# Database URL (use your Supabase PostgreSQL connection string)
DATABASE_URL=postgresql://postgres.wdmeqwveedkxiuzbalfq:[YOUR_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# Supabase Configuration
SUPABASE_URL=https://wdmeqwveedkxiuzbalfq.supabase.co
SUPABASE_SERVICE_KEY=[YOUR_SUPABASE_SERVICE_KEY]
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWVxd3ZlZWRreGl1emJhbGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODM1MzgsImV4cCI6MjA1MzA1OTUzOH0.CPIyqBuRs61S2aIXGh_q5F5sLDxSvqHSVSy8-a1CG_I

# OpenAI API Key (for AI agents)
OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]

# AWS Configuration (optional - will show mock data if not configured)
AWS_ENABLED=false
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# Notification Webhooks (optional for demo)
DISCORD_WEBHOOK_URL=
SLACK_WEBHOOK_URL=

# GitHub Configuration (optional for demo - will use mock data if not configured)
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=

# Vercel Configuration (optional for demo)
VERCEL_TOKEN=
VERCEL_TEAM_ID=

# Web3 RPC URLs (uses public Alchemy endpoints if not configured)
ETHEREUM_RPC_URL=
POLYGON_RPC_URL=
```

###  Step 4: Build Backend

```bash
cd backend
npm run build
cd ..
```

### Step 5: Test Locally

Open 3 terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - WebSocket (not needed for basic testing, backend handles it):**
```bash
# WebSocket server starts automatically with backend
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- Sign up with test email
- Login works
- Dashboard loads without errors
- No console errors in browser DevTools

---

## Part 2: Supabase Database Setup

### Step 1: Get Supabase Credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create new one)
3. Go to **Settings** > **API**
4. Copy:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key
5. Go to **Settings** > **Database**
6. Copy the PostgreSQL connection string

### Step 2: Create Demo User

1. Go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Email: `demo@smartopsagent.com`
4. Password: `DemoPass2025!`
5. Click "Create user"
6. **Copy the User UUID** - you'll need this for Step 3

### Step 3: Add Demo User API Keys

1. Go to **SQL Editor**
2. Create a new query
3. Paste the contents of `DEMO_SETUP.sql`
4. Replace `YOUR_DEMO_USER_ID` with the UUID from Step 2
5. Replace placeholders with real API keys:
   - `YOUR_GITHUB_TOKEN` - Get from [github.com/settings/tokens](https://github.com/settings/tokens) with `repo`, `workflow` scopes
   - `YOUR_VERCEL_TOKEN` - Get from [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - `YOUR_ALCHEMY_API_KEY` - Get from [alchemy.com/dashboard](https://alchemy.com/dashboard)
   - `YOUR_DISCORD_WEBHOOK_URL` - Discord Server > Settings > Integrations > Webhooks
   - `YOUR_SLACK_WEBHOOK_URL` - [api.slack.com/apps](https://api.slack.com/apps) > Create app > Incoming Webhooks
6. Run the query

The demo account now has real API integrations configured!

---

## Part 3: Backend Deployment (Railway)

### Step 1: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select `SmartOpsAgent` repository
5. Railway will auto-detect Node.js

### Step 2: Configure Build Settings

1. Click on the service
2. Go to **Settings**
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm run build`
5. Set **Start Command**: `npm start`

### Step 3: Add Environment Variables

Go to **Variables** tab and add all variables from `backend/.env`:

Required variables:
```
PORT=3001
WS_PORT=3002
DATABASE_URL=[Your Supabase PostgreSQL URL]
SUPABASE_URL=https://wdmeqwveedkxiuzbalfq.supabase.co
SUPABASE_SERVICE_KEY=[Your service key]
SUPABASE_ANON_KEY=[Your anon key]
OPENAI_API_KEY=[Your OpenAI key]
```

Optional (for full functionality):
```
GITHUB_TOKEN=[GitHub token]
GITHUB_OWNER=[Your GitHub username]
GITHUB_REPO=[Repo name]
VERCEL_TOKEN=[Vercel token]
VERCEL_TEAM_ID=[Team ID]
DISCORD_WEBHOOK_URL=[Discord webhook]
SLACK_WEBHOOK_URL=[Slack webhook]
```

### Step 4: Deploy and Get URL

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Copy the deployment URL (e.g., `https://smartopsagent-backend.up.railway.app`)
4. **Important**: Note this URL for frontend configuration

---

## Part 4: Frontend Deployment (Vercel)

### Step 1: Update Environment for Production

Update `.env.local` with production URLs:

```bash
# Production API URLs (replace with your Railway URL)
NEXT_PUBLIC_API_URL=https://smartopsagent-backend.up.railway.app/api
NEXT_PUBLIC_WS_URL=wss://smartopsagent-backend.up.railway.app

# Supabase (same as before)
NEXT_PUBLIC_SUPABASE_URL=https://wdmeqwveedkxiuzbalfq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

OR use Vercel Dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import `SmartOpsAgent` from GitHub
4. Vercel auto-detects Next.js
5. Click "Deploy"

### Step 3: Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" > "Environment Variables"
3. Add each variable:
   - `NEXT_PUBLIC_API_URL` = `https://smartopsagent-backend.up.railway.app/api`
   - `NEXT_PUBLIC_WS_URL` = `wss://smartopsagent-backend.up.railway.app`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://wdmeqwveedkxiuzbalfq.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Redeploy after adding variables

### Step 4: Get Deployment URL

Vercel provides a URL like: `https://smart-ops-agent.vercel.app`

---

## Part 5: Update Documentation

### Update DEMO_CREDENTIALS.md

Edit `DEMO_CREDENTIALS.md` and replace placeholders:

- Line 7: Replace with your Vercel deployment URL
- Line 33: Replace with Discord server invite link (if applicable)
- Line 124: Replace with demo video link
- Line 125: Replace with GitHub repository URL
- Line 126: Replace with Discord server link

---

## Part 6: Final Verification Checklist

Test the deployed application:

### 1. Visit Deployment URL

Go to your Vercel URL: `https://smart-ops-agent.vercel.app`

- [ ] Page loads without errors
- [ ] No console errors in browser DevTools
- [ ] Sign up page works
- [ ] Login page works

### 2. Test Demo Account

Login with:
- Email: `demo@smartopsagent.com`
- Password: `DemoPass2025!`

Verify:
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Green "Live" badge appears (WebSocket connected)
- [ ] System metrics update automatically
- [ ] Charts render correctly

### 3. Test Dashboard Pages

Click through all pages:
- [ ] Dashboard page loads with metrics
- [ ] Infrastructure page shows services
- [ ] Deployments page shows GitHub workflows (if configured)
- [ ] Web3 page shows Ethereum/Polygon data
- [ ] Incidents page shows alerts

### 4. Test AI Agents

Click "Ask AI" in top right:
- [ ] Modal opens
- [ ] Try query: "What is the current infrastructure health?"
- [ ] AI agent responds
- [ ] Response shows real data from services

### 5. Test Real-time Updates

- [ ] Leave dashboard open for 1 minute
- [ ] Metrics update automatically
- [ ] Timestamp changes
- [ ] No connection errors

### 6. Test Integration Data

If you configured API keys in Supabase:
- [ ] GitHub workflows appear (real data, not mock)
- [ ] Vercel deployments appear
- [ ] Ethereum gas prices match [etherscan.io](https://etherscan.io/gastracker)
- [ ] Polygon data matches [polygonscan.com](https://polygonscan.com/gastracker)

---

## Part 7: Troubleshooting

### Backend Not Starting

1. Check Railway logs:
   - Railway Dashboard > Select service > Deployments > View logs
2. Common issues:
   - Missing environment variables
   - Invalid DATABASE_URL
   - Port already in use (change PORT variable)

### Frontend Build Fails

1. Check Vercel deployment logs
2. Common issues:
   - Missing NEXT_PUBLIC_ environment variables
   - TypeScript errors (run `npm run build` locally first)
   - Wrong Node version (Vercel uses Node 20 by default)

### API Calls Failing

1. Check browser console for errors
2. Common issues:
   - Wrong NEXT_PUBLIC_API_URL (must end with `/api`)
   - CORS errors (backend should allow all origins in development)
   - Backend not deployed/running

### WebSocket Not Connecting

1. Green "Live" badge not showing
2. Common issues:
   - Wrong NEXT_PUBLIC_WS_URL (should be `wss://` for production)
   - Backend WebSocket server not running
   - Firewall blocking WebSocket connections

### AI Agents Not Working

1. "Failed to process query" error
2. Common issues:
   - Missing OPENAI_API_KEY in backend
   - Invalid OpenAI API key
   - OpenAI API rate limit exceeded

### No Real Data Showing

1. Mock data appears instead of real data
2. Solution:
   - Run DEMO_SETUP.sql in Supabase with real API keys
   - Verify integrations in Supabase: `SELECT * FROM user_integrations WHERE user_id = 'YOUR_USER_ID'`
   - Check backend logs for API errors

---

## Part 8: Production Deployment Checklist

Before sharing with judges:

- [ ] All environment variables configured in Railway and Vercel
- [ ] Demo account created in Supabase with API keys
- [ ] DEMO_CREDENTIALS.md updated with deployment URLs
- [ ] Tested login with demo account
- [ ] Verified all dashboard pages load
- [ ] Confirmed AI agents work
- [ ] Tested real-time updates
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

---

## Part 9: Maintenance

### Updating the Application

1. Make code changes locally
2. Commit to GitHub:
   ```bash
   git add .
   git commit -m "Update message"
   git push origin main
   ```
3. Vercel and Railway auto-deploy from main branch

### Monitoring

- **Railway**: Dashboard > Metrics shows CPU, memory, requests
- **Vercel**: Analytics tab shows page views, performance
- **Supabase**: Database > Logs shows queries and errors

### Costs

All services offer free tiers sufficient for hackathon judging:
- **Vercel**: 100GB bandwidth/month free
- **Railway**: 500 hours/month free ($5 credit)
- **Supabase**: 500MB database, 2GB bandwidth/month free
- **OpenAI**: Pay-per-use (AI agent queries cost ~$0.01 each)

---

## Contact

For deployment issues, check:
- GitHub Issues: [Repository URL]
- Documentation: README.md
- Demo: DEMO_CREDENTIALS.md

**Deployment Status**: Ready for Judging
**Last Updated**: 2025-10-22
