# SmartOpsAgent Dashboard - Setup Guide

## Overview

SmartOpsAgent is a **multi-tenant SaaS platform** where each user creates their own account and adds their own API keys. This guide explains how to set up the platform for deployment.

---

## Quick Start (For Users)

### Step 1: Sign Up
1. Go to https://your-domain.com
2. Click "Get Started"
3. Create an account with email/password
4. Verify your email

### Step 2: Add Your Integrations
After signing up, you'll be guided through onboarding:

1. **GitHub** (Required for CI/CD monitoring)
   - Personal Access Token
   - GitHub Username

2. **Vercel** (Required for deployment monitoring)
   - Vercel API Token

3. **Web3** (Optional)
   - Ethereum RPC URL (from Alchemy/Infura)
   - Polygon RPC URL

4. **Notifications** (Optional)
   - Discord Webhook URL
   - Slack Webhook URL

### Step 3: Start Monitoring
Once integrations are added, your dashboard will show:
- Real-time deployment status
- GitHub Actions workflows
- Web3 network metrics
- System performance

---

## Deployment Guide (For Developers)

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- Vercel account (for frontend)
- Railway/Render account (for backend)

### Step 1: Set Up Supabase

1. Create a new Supabase project
2. Run the SQL migration from `scripts/001_create_tables.sql`
3. Enable Email Auth in Authentication settings
4. Copy your project URL and anon key

### Step 2: Deploy Backend

**Option A: Railway**
1. Connect your GitHub repo
2. Add environment variables:
   \`\`\`
   SUPABASE_SUPABASE_URL=your_supabase_url
   SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   PORT=3001
   \`\`\`
3. Deploy

**Option B: Render**
1. Create new Web Service
2. Connect GitHub repo
3. Add environment variables (same as above)
4. Deploy

### Step 3: Deploy Frontend

1. Go to Vercel
2. Import your GitHub repo
3. Add environment variables:
   \`\`\`
   SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY=your_anon_key
   NEXT_PUBLIC_API_URL=your_backend_url
   NEXT_PUBLIC_WS_URL=your_websocket_url
   \`\`\`
4. Deploy

---

## How It Works

### Multi-Tenant Architecture

1. **User Signs Up** → Account created in Supabase Auth
2. **User Adds Integrations** → API keys stored in `user_integrations` table (encrypted)
3. **Backend Fetches Data** → Uses user-specific credentials from database
4. **User Sees Their Data** → Row Level Security ensures data isolation

### Security

- All API keys are stored encrypted in Supabase
- Row Level Security (RLS) ensures users only see their own data
- JWT tokens authenticate all API requests
- No hardcoded credentials in code

---

## For Hackathon Judges

### Testing the Platform

1. **Sign Up**: Create a test account at the deployed URL
2. **Add Test Integrations**: Use your own API keys
3. **View Dashboard**: See your real data in real-time

### What You'll See

- Your GitHub Actions workflows
- Your Vercel deployments
- Ethereum/Polygon network data
- Real-time WebSocket updates
- Discord/Slack notifications (if configured)

---

## Support

For issues or questions:
- GitHub Issues: [repo-url]
- Email: support@smartopsagent.com

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Required API Keys & Credentials](#required-api-keys--credentials)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Deployment](#deployment)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** v18+ and npm v9+
  - Download: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

- **Git**
  - Download: https://git-scm.com/
  - Verify: `git --version`

- **Docker** (optional, for containerized deployment)
  - Download: https://www.docker.com/
  - Verify: `docker --version`

### Required Accounts

1. **Supabase Account** - For database and authentication
2. **Vercel Account** - For frontend deployment
3. **Railway/Render Account** - For backend deployment
4. **GitHub Account** - For CI/CD pipeline monitoring
5. **Alchemy Account** - For Ethereum/Polygon RPC access
6. **OpenAI Account** - For AI-powered analytics (optional)

---

## Required API Keys & Credentials

### 1. Supabase Credentials

**What you need:**
- Supabase URL
- Supabase Service Role Key

**How to get them:**

1. Go to [Supabase](https://supabase.com/)
2. Sign up for free
3. Create a new project
4. Go to **Settings** → **API**
5. Copy **Supabase URL** and **Service Role Key**

**Save these values:**
\`\`\`
SUPABASE_SUPABASE_URL=your_supabase_url
SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

---

### 2. GitHub Personal Access Token

**What you need:**
- GitHub Personal Access Token (Classic)
- GitHub Username

**How to get them:**

1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name: "SmartOpsAgent Dashboard"
4. Set expiration: **No expiration** (or custom)
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `read:org` (Read org and team membership)
6. Click **Generate token**
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

**Save these values:**
\`\`\`
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=your-github-username
\`\`\`

---

### 3. Vercel API Token

**What you need:**
- Vercel API Token

**How to get it:**

1. Go to [Vercel](https://vercel.com/)
2. Navigate to **Account** → **Settings** → **Tokens**
3. Click **Create Token**
4. Give it a name: "SmartOpsAgent"
5. Set expiration: **No expiration** (or custom)
6. Select scopes:
   - ✅ `projects` (Read and manage projects)
   - ✅ `domain` (Manage domains)
7. Click **Create token**
8. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

**Save this value:**
\`\`\`
VERCEL_API_TOKEN=your_vercel_api_token
\`\`\`

---

### 4. Ethereum & Polygon RPC URLs

**What you need:**
- Ethereum RPC URL
- Polygon RPC URL

**How to get them (using Alchemy - Recommended):**

1. Go to [Alchemy](https://www.alchemy.com/)
2. Sign up for a free account
3. Click **Create App**
4. For Ethereum:
   - Name: "SmartOps Ethereum"
   - Chain: **Ethereum**
   - Network: **Mainnet**
   - Click **Create app**
   - Click **View key** → Copy **HTTPS URL**
5. Repeat for Polygon:
   - Name: "SmartOps Polygon"
   - Chain: **Polygon**
   - Network: **Mainnet**
   - Click **Create app**
   - Click **View key** → Copy **HTTPS URL**

**Alternative Free Options:**
- **Infura**: https://infura.io/
- **QuickNode**: https://www.quicknode.com/
- **Public RPCs** (not recommended for production):
  - Ethereum: `https://eth.llamarpc.com`
  - Polygon: `https://polygon-rpc.com`

**Save these values:**
\`\`\`
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
\`\`\`

---

### 5. Notifications (Optional)

**What you need:**
- Discord Webhook URL
- Slack Webhook URL

**How to get them:**

1. **Discord Webhook URL:**
   - Go to your Discord server
   - Click **Settings** → **Integrations** → **Create Webhook**
   - Copy the URL

2. **Slack Webhook URL:**
   - Go to your Slack workspace
   - Click **Apps** → **Create New App**
   - Navigate to **Incoming Webhooks** → **Activate Incoming Webhooks**
   - Select your channel and copy the URL

**Save these values:**
\`\`\`
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-discord-webhook-id/your-discord-webhook-token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your-slack-webhook-id/your-slack-webhook-token
\`\`\`

---

## Backend Setup

### Step 1: Install Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

This will install:
- Express.js (API server)
- ws (WebSocket server)
- @supabase/supabase-js (Supabase client)
- @octokit/rest (GitHub API)
- ethers (Web3 interactions)
- And more...

### Step 2: Create Environment File

Create `backend/.env` file:

\`\`\`bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_SUPABASE_URL=your_supabase_url
SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=your-github-username

# Web3 RPC URLs
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Notifications (Optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-discord-webhook-id/your-discord-webhook-token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your-slack-webhook-id/your-slack-webhook-token

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:3000

# WebSocket
WS_PORT=3002
\`\`\`

### Step 3: Initialize Database

Run the database migration:

\`\`\`bash
npm run db:migrate
\`\`\`

This creates the necessary tables:
- `user_integrations` - Stores user-specific API keys
- `metrics` - Infrastructure metrics
- `alerts` - Alert history
- `deployments` - Deployment records
- `incidents` - Incident logs
- `security_scans` - Security scan results

### Step 4: Start Backend Server

**Development mode:**
\`\`\`bash
npm run dev
\`\`\`

**Production mode:**
\`\`\`bash
npm run build
npm start
\`\`\`

**Verify backend is running:**
- API Server: http://localhost:3001
- WebSocket Server: ws://localhost:3002
- Health check: http://localhost:3001/health

---

## Frontend Setup

### Step 1: Install Dependencies

\`\`\`bash
# From project root (not backend folder)
npm install
\`\`\`

### Step 2: Create Environment File

Create `.env.local` file in the root:

\`\`\`bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# WebSocket URL
NEXT_PUBLIC_WS_URL=ws://localhost:3002

# Supabase
SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

### Step 3: Start Frontend

\`\`\`bash
npm run dev
\`\`\`

**Verify frontend is running:**
- Open: http://localhost:3000
- You should see the landing page
- Click "Get Started" to access the dashboard

---

## Deployment

### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway

1. Go to [Railway](https://railway.app/)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway will auto-detect the backend
5. Add environment variables:
   - Go to **Variables** tab
   - Add all variables from `backend/.env`
6. Click **Deploy**
7. Copy the **Public URL** (e.g., `https://smartops-backend.up.railway.app`)

#### Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave as is)
5. Add environment variables:
   \`\`\`
   NEXT_PUBLIC_API_URL=https://smartops-backend.up.railway.app
   NEXT_PUBLIC_WS_URL=wss://smartops-backend.up.railway.app
   SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   \`\`\`
6. Click **Deploy**
7. Your dashboard will be live at: `https://your-project.vercel.app`

---

### Option 2: Deploy with Docker

#### Build and Run with Docker Compose

\`\`\`bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

**Services:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- WebSocket: ws://localhost:3002
- PostgreSQL: localhost:5432

---

### Option 3: Deploy to AWS (Production)

#### Backend on AWS ECS

1. Create ECR repository:
\`\`\`bash
aws ecr create-repository --repository-name smartops-backend
\`\`\`

2. Build and push Docker image:
\`\`\`bash
docker build -t smartops-backend ./backend
docker tag smartops-backend:latest YOUR_ECR_URL/smartops-backend:latest
docker push YOUR_ECR_URL/smartops-backend:latest
\`\`\`

3. Create ECS cluster and service (use AWS Console or Terraform)

#### Frontend on Vercel

Follow "Deploy Frontend to Vercel" steps above, but use your AWS backend URL.

---

## Testing & Verification

### 1. Test Backend Health

\`\`\`bash
curl http://localhost:3001/health
\`\`\`

Expected response:
\`\`\`json
{
  "status": "ok",
  "timestamp": "2025-01-18T10:30:00.000Z"
}
\`\`\`

### 2. Test API Endpoints

\`\`\`bash
# Get metrics
curl http://localhost:3001/api/metrics

# Get GitHub services
curl http://localhost:3001/api/github-services

# Get deployments
curl http://localhost:3001/api/deployments

# Get Web3 networks
curl http://localhost:3001/api/web3-networks
\`\`\`

### 3. Test WebSocket Connection

Create a test file `test-ws.js`:

\`\`\`javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', () => {
  console.log('✅ WebSocket connected');
});

ws.on('message', (data) => {
  console.log('📨 Received:', data.toString());
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error);
});
\`\`\`

Run: `node test-ws.js`

### 4. Test Frontend

1. Open http://localhost:3000
2. Click "Get Started"
3. Verify all pages load:
   - ✅ Overview Dashboard
   - ✅ GitHub Actions
   - ✅ Vercel Deployments
   - ✅ Web3 (Ethereum & Polygon data visible)
   - ✅ Incidents
   - ✅ Security
   - ✅ Settings
4. Test interactions:
   - ✅ Click three-dot menus
   - ✅ Open modals
   - ✅ Toggle theme (dark/light)
   - ✅ Check WebSocket status (should show "Connected")

---

## Troubleshooting

### Backend Issues

#### Error: "Supabase credentials not found"

**Solution:**
1. Verify `SUPABASE_SUPABASE_URL` and `SUPABASE_SUPABASE_SERVICE_ROLE_KEY` are set in `.env`
2. Check credentials are valid
3. Ensure Supabase project is running

#### Error: "GitHub API rate limit exceeded"

**Solution:**
1. Verify `GITHUB_TOKEN` is set correctly
2. Check token hasn't expired
3. Ensure token has `repo` and `workflow` scopes

#### Error: "Cannot connect to database"

**Solution:**
1. Verify `SUPABASE_SUPABASE_URL` and `SUPABASE_SUPABASE_SERVICE_ROLE_KEY` are correct
2. Check Supabase database is running
3. Test connection using Supabase client
4. Run migrations: `npm run db:migrate`

#### Error: "Web3 RPC connection failed"

**Solution:**
1. Verify RPC URLs are correct
2. Check Alchemy/Infura API key is valid
3. Test RPC endpoint:
\`\`\`bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  YOUR_RPC_URL
\`\`\`

### Frontend Issues

#### Error: "Failed to fetch data"

**Solution:**
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

#### Error: "WebSocket connection failed"

**Solution:**
1. Verify WebSocket server is running on port 3002
2. Check `NEXT_PUBLIC_WS_URL` in `.env.local`
3. Check browser console for connection errors
4. Try connecting with test script (see Testing section)

#### Error: "No data showing in dashboard"

**Solution:**
1. Open browser DevTools → Network tab
2. Check if API calls are succeeding (200 status)
3. Check browser console for errors
4. Verify backend is returning data: `curl http://localhost:3001/api/metrics`

---

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] Database migrations have been run
- [ ] Backend health check returns 200
- [ ] All API endpoints return data
- [ ] WebSocket connection is stable
- [ ] Frontend loads without errors
- [ ] All pages and modals work correctly
- [ ] Theme toggle works
- [ ] Supabase credentials are configured correctly
- [ ] GitHub token is scoped correctly
- [ ] Database backups are configured
- [ ] Error monitoring is set up (Sentry, LogRocket, etc.)
- [ ] SSL/TLS certificates are configured
- [ ] CORS is configured for production domain
- [ ] Rate limiting is enabled on API endpoints
- [ ] Logs are being collected and monitored

---

## Cost Estimates

### Free Tier (Development)

- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month credit (enough for small backend)
- **Supabase**: Free (1 project, 3GB storage)
- **Alchemy**: Free (300M compute units/month)
- **GitHub**: Free (public repos)

**Total: ~$0-5/month**

### Production (Small Scale)

- **Vercel**: $20/month (Pro plan)
- **Railway**: $20/month (backend + database)
- **Supabase**: $10/month (small project)
- **Alchemy**: $49/month (Growth plan)
- **OpenAI**: $10-50/month (depending on usage)

**Total: ~$109-170/month**

---

## Support & Resources

### Documentation

- **Supabase**: https://supabase.com/docs
- **GitHub API**: https://docs.github.com/en/rest
- **Ethers.js**: https://docs.ethers.org/
- **Next.js**: https://nextjs.org/docs
- **WebSocket**: https://github.com/websockets/ws

### Community

- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community (link in README)
- **Email**: support@smartopsagent.com

---

## Next Steps

1. **Get all API keys** (follow sections above)
2. **Set up backend** (install, configure, run)
3. **Set up frontend** (install, configure, run)
4. **Test locally** (verify everything works)
5. **Deploy to production** (Railway + Vercel)
6. **Monitor and optimize** (check logs, performance)

**Need help?** Check the [INTEGRATION.md](./INTEGRATION.md) file for detailed backend integration instructions and code examples.

---

**Last Updated**: January 2025
**Version**: 1.0.0
