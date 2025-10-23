# 🚀 Post-Demo Deployment Guide

**After recording your demo video**, follow this guide to deploy SmartOpsAgent to production.

---

## ⏱️ Time Required: ~20 minutes

---

## 🎯 Step 1: Deploy Backend to Railway (10 mins)

### 1.1 Create Railway Account
- Go to: https://railway.app
- Sign up with GitHub
- Click "New Project" → "Deploy from GitHub repo"

### 1.2 Select Repository
- Authorize Railway to access your GitHub
- Select `SmartOpsAgent` repository
- Railway will auto-detect it's a Node.js project

### 1.3 Configure Environment Variables
Click "Variables" and add these (copy from `backend/.env`):

```bash
# Server
PORT=3001
WS_PORT=3002
NODE_ENV=production

# Supabase
SUPABASE_SUPABASE_URL=https://wdmeqwveedkxiuzbalfq.supabase.co
SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Vercel
VERCEL_TOKEN=4slQcSIPl7c8DuCvnhRnapO6

# GitHub
GITHUB_TOKEN=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
GITHUB_OWNER=henrysammarfo
GITHUB_REPO=SmartOpsAgent

# Web3 (FREE public RPCs - no auth needed!)
ETHEREUM_RPC_URL=https://ethereum.publicnode.com
POLYGON_RPC_URL=https://polygon-bor-rpc.publicnode.com

# AI
OPENAI_API_KEY=your_openai_key_here
AI_MODEL=gpt-4-turbo-preview

# Webhooks
DISCORD_WEBHOOK_URL=your_discord_webhook
SLACK_WEBHOOK_URL=your_slack_webhook
```

### 1.4 Configure Build Settings
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### 1.5 Deploy
- Click "Deploy"
- Wait 3-5 minutes
- Copy the Railway URL (e.g., `https://smartopsagent-production.up.railway.app`)

---

## 🌐 Step 2: Deploy Frontend to Vercel (10 mins)

### 2.1 Create Vercel Account
- Go to: https://vercel.com
- Sign up with GitHub
- Click "Add New..." → "Project"

### 2.2 Import Repository
- Select `SmartOpsAgent` repository
- Click "Import"

### 2.3 Configure Project
**Framework Preset**: Next.js
**Root Directory**: `./` (leave as root)

### 2.4 Add Environment Variables
Click "Environment Variables" and add:

```bash
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app/api
NEXT_PUBLIC_WS_URL=wss://your-railway-url.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://wdmeqwveedkxiuzbalfq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ IMPORTANT**: Replace `your-railway-url.railway.app` with your actual Railway URL from Step 1.5!

### 2.5 Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Copy your Vercel URL (e.g., `https://smartopsagent.vercel.app`)

---

## ✅ Step 3: Test Production Deployment

### 3.1 Test Frontend
1. Open your Vercel URL
2. Login with: `demo@smartopsagent.com` / `DemoPass2025!`
3. Verify live data loads

### 3.2 Test Backend
Open in browser: `https://your-railway-url.railway.app/health`
Should return: `{"status":"ok"}`

---

## 📝 Step 4: Update README with Live URLs

Edit `README.md` and update:

```markdown
## 🎥 Demo

**Live Demo**: https://your-vercel-url.vercel.app

**Demo Video**: https://youtube.com/watch?v=YOUR_VIDEO_ID

**Demo Credentials**:
- Email: `demo@smartopsagent.com`
- Password: `DemoPass2025!`
```

---

## 🔄 Step 5: Push to GitHub

```bash
# Add all changes
git add .

# Commit
git commit -m "docs: update README with deployment URLs

- Add live demo URL
- Add demo video link
- Update documentation
- Production ready

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin main
```

---

## 🎉 Step 6: Update Hackathon Submission

Go back to your hackathon submission form and update:

1. **Project website**: Your Vercel URL
2. **Demo video**: Your YouTube link
3. **Submit!**

---

## 🐛 Troubleshooting

### Frontend shows "API Error"
- Check `NEXT_PUBLIC_API_URL` has `/api` suffix
- Verify Railway backend is running (check Railway dashboard)

### Backend won't start
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure `PORT=3001` is set

### Database connection fails
- Verify Supabase credentials are correct
- Check Supabase project is running
- Ensure IP restrictions allow Railway IPs

---

## 📊 Success Checklist

- [ ] Railway backend deployed and running
- [ ] Vercel frontend deployed and accessible
- [ ] Demo login works with live data
- [ ] README updated with URLs
- [ ] Changes pushed to GitHub
- [ ] Hackathon form updated
- [ ] Submitted before deadline!

---

**🎯 You're ready for the hackathon! Good luck!** 🚀
