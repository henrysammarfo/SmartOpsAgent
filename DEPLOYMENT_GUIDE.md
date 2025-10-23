# 🚀 SmartOpsAgent - Quick Deployment Guide

**For Hackathon Judges - Complete Setup in 30 Minutes**

---

## ⚡ Quick Start (For Testing Locally RIGHT NOW)

### 1. Create Demo Account in Supabase (5 minutes)

1. Go to [https://supabase.com/dashboard/project/wdmeqwveedkxiuzbalfq/auth/users](https://supabase.com/dashboard/project/wdmeqwveedkxiuzbalfq/auth/users)

2. Click "Add user" → "Create new user"

3. Enter:
   - Email: `demo@smartopsagent.com`
   - Password: `DemoPass2025!`

4. Click "Create user"

5. **IMPORTANT:** Copy the User UUID (it looks like `a1b2c3d4-e5f6-...`)

### 2. Add API Keys to Demo Account (5 minutes)

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/wdmeqwveedkxiuzbalfq/sql/new)

2. Open the file `DEMO_SETUP.sql` (in your project root)

3. Find the line: `'YOUR_DEMO_USER_ID'` (appears 11 times)

4. Replace ALL `'YOUR_DEMO_USER_ID'` with your actual UUID from Step 1.5
   - Example: Replace `'YOUR_DEMO_USER_ID'` with `'a1b2c3d4-e5f6-7890-abcd-123456789abc'`

5. Copy the ENTIRE updated SQL script

6. Paste into Supabase SQL Editor

7. Click "Run" (bottom right)

8. **Verify:** You should see 5 rows in the result:
   ```
   github    | active
   vercel    | active
   alchemy   | active
   discord   | active
   slack     | active
   ```

### 3. Test Locally (2 minutes)

1. Open your browser: `http://localhost:3000`

2. Click "Login"

3. Enter:
   - Email: `demo@smartopsagent.com`
   - Password: `DemoPass2025!`

4. **You should now see the dashboard with LIVE DATA!** ✅
   - GitHub workflows from SmartOpsAgent repo
   - System metrics updating in real-time
   - Web3 data from Ethereum/Polygon
   - Green "Live" badge in top right

---

## 🌐 Production Deployment (For Judges to Access)

### Part 1: Deploy Backend to Railway (10 minutes)

1. **Create Railway Account**
   - Go to [https://railway.app](https://railway.app)
   - Click "Login with GitHub"

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `SmartOpsAgent` repository
   - Railway auto-detects the project

3. **Configure Service**
   - Click on the created service
   - Go to "Settings"
   - Set:
     - **Root Directory**: `backend`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`

4. **Add Environment Variables**
   - Click "Variables" tab
   - Click "Add Variable" and paste ALL these (copy from `backend/.env`):

   ```bash
   PORT=3001
   WS_PORT=3002
   NODE_ENV=production
   SUPABASE_SUPABASE_URL=https://wdmeqwveedkxiuzbalfq.supabase.co
   SUPABASE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWVxd3ZlZWRreGl1emJhbGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg1NjUzMiwiZXhwIjoyMDc2NDMyNTMyfQ.iWdv8YyZZSqISVws2O7JNaeZAu-9ZyfX31rBGZiekfA
   SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWVxd3ZlZWRreGl1emJhbGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTY1MzIsImV4cCI6MjA3NjQzMjUzMn0.kqaV0EoTs8GrU9ky9sEULIRH-8tiwbTd7O6K-Z3j2so
   VERCEL_TOKEN=4slQcSIPl7c8DuCvnhRnapO6
   GITHUB_TOKEN=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
   GITHUB_OWNER=henrysammarfo
   GITHUB_REPO=SmartOpsAgent
   ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/MXRg6nCI-AMjLmMDXUqXUh
   POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/VBXJLqmo9-wWdLYDKLNEXp
   OPENAI_API_KEY=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
   AI_MODEL=gpt-4-turbo-preview
   DATABASE_URL=postgresql://neondb_owner:npg_GmRO9NxBnju8@ep-misty-field-abdu6nc3-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1429478189922652260/VhsWrbu8ZzMaUtWrT1U3Z1I1PHdrBZklJZrG_Por_O9SvM1GxsYmTSk2UUGlh7315YnK
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

6. **Get Your Backend URL**
   - Click "Settings" > "Domains"
   - Copy the URL (e.g., `https://smartopsagent-production-abc123.up.railway.app`)
   - **SAVE THIS URL** - you'll need it for frontend!

### Part 2: Deploy Frontend to Vercel (5 minutes)

1. **Update Environment Variables**

   Edit `.env.local` in your project root:

   ```bash
   # Replace with YOUR Railway backend URL from Part 1, Step 6
   NEXT_PUBLIC_API_URL=https://YOUR_RAILWAY_URL.up.railway.app/api
   NEXT_PUBLIC_WS_URL=wss://YOUR_RAILWAY_URL.up.railway.app

   # Keep these the same
   NEXT_PUBLIC_SUPABASE_URL=https://wdmeqwveedkxiuzbalfq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWVxd3ZlZWRreGl1emJhbGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTY1MzIsImV4cCI6MjA3NjQzMjUzMn0.kqaV0EoTs8GrU9ky9sEULIRH-8tiwbTd7O6K-Z3j2so
   ```

2. **Deploy to Vercel**

   ```bash
   # Install Vercel CLI (if not installed)
   npm install -g vercel

   # Login
   vercel login

   # Deploy to production
   vercel --prod
   ```

3. **Add Environment Variables in Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Click "Settings" > "Environment Variables"
   - Add the 4 variables from `.env.local` above

4. **Get Your Frontend URL**
   - Vercel gives you a URL like: `https://smart-ops-agent.vercel.app`
   - **This is your DEMO LINK for judges!**

---

## ✅ Final Testing Checklist

Visit your Vercel URL and test:

- [ ] Homepage loads
- [ ] Click "Login"
- [ ] Login with `demo@smartopsagent.com` / `DemoPass2025!`
- [ ] Dashboard loads without errors
- [ ] Green "Live" badge shows (top right)
- [ ] System metrics update automatically
- [ ] Charts render correctly
- [ ] Click through all pages: Dashboard, Infrastructure, Deployments, Web3, Incidents
- [ ] Click "Ask AI" and test AI agent
- [ ] No console errors in browser DevTools (F12)

---

## 📝 What to Give Judges

### 1. DEMO_CREDENTIALS.md

Update [DEMO_CREDENTIALS.md](DEMO_CREDENTIALS.md) with:
- Your Vercel deployment URL
- Demo login credentials

### 2. README.md

Create a README.md with:
- Project description
- Features list
- Tech stack (**mention ADK-TS!**)
- How to run locally
- Demo video link
- Live demo link

### 3. Demo Video

Record a 5-minute video showing:
1. Homepage and signup/login
2. Dashboard with live data
3. All 5 pages working
4. AI agents responding to queries
5. Real-time updates
6. **Show the code:** Open `backend/src/agents/` folder and mention ADK-TS integration

---

## 🚨 Troubleshooting

### Backend Not Starting on Railway

- Check logs: Railway Dashboard > Deployments > View Logs
- Common issue: Missing environment variables
- Fix: Go to Variables tab and ensure all vars are added

### Frontend Build Fails on Vercel

- Check deployment logs in Vercel
- Common issue: Missing NEXT_PUBLIC_ environment variables
- Fix: Add all 4 environment variables in Vercel Settings

### "Unauthorized" Error in Dashboard

- Issue: Demo account has no API integrations
- Fix: Run `DEMO_SETUP.sql` in Supabase (see Part 1, Step 2)

### No Live Data Showing

- Issue: API keys not configured properly
- Fix: Verify `DEMO_SETUP.sql` was run successfully
- Check: Go to Supabase > Table Editor > user_integrations
- Should see 5 rows for demo user

### AI Agents Not Working

- Issue: OpenAI API key missing or invalid
- Fix: Check `OPENAI_API_KEY` in Railway environment variables
- Verify: Key starts with `sk-proj-` and is valid

---

## 📊 What Judges Will See

When judges login with the demo account, they'll see:

✅ **Live GitHub Data**
- Real workflows from SmartOpsAgent repository
- Deployment status
- Pipeline health

✅ **Real-time System Metrics**
- CPU, Memory, Disk usage
- Automatically updating every 30 seconds
- Alerts sent to Discord/Slack

✅ **Web3 Network Monitoring**
- Live Ethereum gas prices
- Polygon network status
- Real blockchain data

✅ **AI-Powered Insights**
- 4 specialized ADK-TS agents
- Natural language queries
- Intelligent responses

✅ **Real-time Notifications**
- Discord webhook integration
- Slack webhook integration
- Automatic alerts for high resource usage

---

## 🎯 Hackathon Submission Requirements

Make sure you have:

- [x] **Public GitHub Repo** - `github.com/henrysammarfo/SmartOpsAgent`
- [ ] **Demo Video** - Record and upload (5 mins max)
- [ ] **Live Demo Link** - Your Vercel URL
- [ ] **Clear Use of ADK-TS** - Mentioned in README and shown in video

---

## ⏰ Time Estimates

- **Creating demo account:** 5 minutes
- **Adding API keys:** 5 minutes
- **Deploying backend:** 10 minutes
- **Deploying frontend:** 5 minutes
- **Testing:** 5 minutes
- **Recording video:** 30 minutes

**Total: ~60 minutes to full deployment**

---

## 💡 Pro Tips

1. **Test locally first** before deploying to ensure everything works
2. **Record video locally** using the local version (faster, no network issues)
3. **Keep credentials secure** - Don't commit API keys to GitHub
4. **Monitor Railway logs** during deployment to catch issues early
5. **Test the demo account** yourself before giving to judges

---

## 📞 Need Help?

- Check backend logs in Railway
- Check frontend logs in Vercel
- Check browser console (F12) for frontend errors
- Verify all environment variables are set correctly

---

**Good luck with your submission! 🚀**

Last Updated: October 23, 2025
