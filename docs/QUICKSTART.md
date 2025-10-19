# SmartOpsAgent - Quick Start

## ⚠️ IMPORTANT: Before Downloading ZIP from v0

**COPY `YOUR_API_KEYS.md` to a safe location on your computer!**

This file contains all your actual API keys. You'll need them after cloning from GitHub.

---

## For Users (5 Minutes)

### 1. Sign Up
Go to https://your-domain.com and create an account

### 2. Add Your API Keys
Follow the onboarding wizard to add:
- GitHub token (get from https://github.com/settings/tokens)
- Vercel token (get from https://vercel.com/account/tokens)
- Optional: Ethereum/Polygon RPC URLs, Discord/Slack webhooks

### 3. Start Monitoring
Your dashboard is now live with real data!

---

## For Developers (Local Setup)

### 1. Clone and Install
\`\`\`bash
git clone your-repo
cd smartops-dashboard
npm install
cd backend && npm install && cd ..
\`\`\`

### 2. Set Up Supabase
1. Create Supabase project
2. Run `scripts/001_create_tables.sql`
3. Copy credentials to `.env.local`

### 3. Start Services
\`\`\`bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev
\`\`\`

### 4. Open Dashboard
Go to http://localhost:3000 and sign up!

---

## That's It!

The platform is multi-tenant - each user adds their own API keys and sees only their own data.

---

## What's Working Right Now

✅ **GitHub Integration**
- Repository: henrysammarfo/smartops-dashboard
- Fetching workflow runs and deployment status
- Real-time updates via WebSocket

✅ **Web3 Integration**
- Ethereum mainnet monitoring
- Polygon network monitoring
- Gas prices and block data

✅ **Database**
- Neon PostgreSQL connected
- Storing metrics and alerts

✅ **Real-time Updates**
- WebSocket broadcasting every 30 seconds
- Live metrics on dashboard

❌ **AWS Integration** (Optional - Add Later)
- Currently showing mock data
- Add credentials when you get OTP working

---

## Testing Each Feature

### 1. Test GitHub Integration
\`\`\`bash
curl http://localhost:3001/api/deployments
\`\`\`

Should return your GitHub Actions workflow runs.

### 2. Test Web3 Integration
\`\`\`bash
curl http://localhost:3001/api/web3
\`\`\`

Should return Ethereum and Polygon network data.

### 3. Test Metrics
\`\`\`bash
curl http://localhost:3001/api/metrics
\`\`\`

Should return system metrics.

---

## Common Issues & Fixes

### Issue: Backend won't start
**Fix:** Make sure you're in the `backend` directory and ran `npm install`

### Issue: "Cannot find module"
**Fix:** Delete `node_modules` and run `npm install` again

### Issue: WebSocket not connecting
**Fix:** 
1. Check backend is running on port 3002
2. Check `.env.local` has `NEXT_PUBLIC_WS_URL=ws://localhost:3002`

### Issue: GitHub API rate limit
**Fix:** Your token has 5000 requests/hour. If you hit the limit, wait 1 hour.

---

## Adding AWS Later (When You Get OTP)

When you get AWS credentials:

1. Edit `backend/.env`:
\`\`\`bash
AWS_ENABLED=true
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
\`\`\`

2. Restart backend:
\`\`\`bash
npm run dev
\`\`\`

AWS services will automatically start monitoring!

---

## Next Steps

1. **Deploy Backend** - Use Railway, Render, or Vercel
2. **Deploy Frontend** - Use Vercel (one-click deploy)
3. **Set Production URLs** - Update environment variables
4. **Enable AWS** - When you get credentials

---

## Need Help?

Check the logs:
- Backend logs: Terminal where you ran `npm run dev` in backend folder
- Frontend logs: Browser console (F12)
- WebSocket logs: Look for `[v0]` messages in browser console

---

## Summary

You now have:
- ✅ Backend running with GitHub + Web3 integration
- ✅ Frontend dashboard with real-time updates
- ✅ Database connected
- ✅ WebSocket live updates
- ⏳ AWS (add later when you get credentials)

**Everything is working with REAL data from GitHub and Web3!**
