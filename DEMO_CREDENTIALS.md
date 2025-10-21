# SmartOpsAgent - Demo Credentials for Judges

## Quick Start for Judges (5 Minutes)

### Access the Live Demo

**Deployment URL**: [Your Vercel URL Here]

**Demo Account**:
- **Email**: `demo@smartopsagent.com`
- **Password**: `DemoPass2025!`

---

## How to Test (Step by Step)

### 1. Login (30 seconds)
1. Go to the deployment URL
2. Click **"Sign In"**
3. Enter demo credentials above
4. You'll be redirected to the dashboard

### 2. View Live Data (1 minute)
- **Dashboard**: See real-time system metrics (CPU, Memory, Disk)
- **Deployments**: View live GitHub Actions workflows
- **Web3**: See live Ethereum & Polygon gas prices
- **Infrastructure**: Monitor Vercel deployments

### 3. Test Real-Time Updates (1 minute)
- Look for **green "Live" badge** in top-right
- Watch metrics update automatically (every 30 seconds)
- Check notification bell icon for alerts
- Join Discord channel to see live notifications: [Discord Invite Link]

### 4. Test AI Agents (2 minutes)

**Try these queries:**

1. **Infrastructure Agent**:
   - Go to Infrastructure page
   - Click "Ask AI" button
   - Ask: *"What's my current system status?"*
   - Expect: Intelligent summary of CPU, memory, and deployment health

2. **Web3 Agent**:
   - Go to Web3 page
   - Click "Ask AI" button
   - Ask: *"Should I deploy my smart contract now based on gas prices?"*
   - Expect: Recommendation based on current Ethereum gas prices

3. **CI/CD Agent**:
   - Go to Deployments page
   - Click "Ask AI" button
   - Ask: *"What's the status of my latest deployment?"*
   - Expect: Analysis of recent GitHub Actions workflow

4. **Orchestrator**:
   - Go to Dashboard
   - Click "Ask AI" button
   - Ask: *"Give me a complete system overview"*
   - Expect: Comprehensive report from all 4 specialized agents

### 5. Verify Real Data (30 seconds)
- Check that Ethereum/Polygon data matches Etherscan
- Verify GitHub workflows match actual repo activity
- Confirm system metrics are realistic (not mock data)

---

## What Makes This Project Special?

### ✅ Track 2: ADK-TS Integration
- **4 Specialized AI Agents**: Infrastructure, Web3, CI/CD, Orchestrator
- **Hierarchical Orchestration**: Main agent coordinates specialized agents
- **Custom Tools**: Real API integrations as agent tools
- **Context-Aware**: Agents use real-time data to provide intelligent insights

### ✅ Track 3: Web3 Use Case
- **Real Ethereum & Polygon Monitoring**: Live block numbers, TPS, gas prices
- **Gas Price Optimization**: AI suggests optimal deployment timing
- **Practical Value**: Helps developers save on transaction costs
- **Real-Time Updates**: WebSocket streaming for instant gas price changes

### ✅ Technical Excellence
- **Multi-Tenant SaaS**: Each user has isolated data with Supabase RLS
- **Real API Integrations**: Vercel, GitHub, Alchemy, Discord, Slack
- **WebSocket Real-Time**: Live data streaming every 15-60 seconds
- **Production-Ready**: Full authentication, error handling, responsive design

---

## Evaluation Quick Reference

### **ADK-TS Integration** (30 points)
- ✅ All 4 agents implemented ([backend/src/agents/](backend/src/agents/))
- ✅ Proper AgentBuilder usage with `@iqai/adk`
- ✅ Custom tools with Zod validation
- ✅ Agent orchestration and memory management

### **Web3 Use Case** (30 points)
- ✅ Live Ethereum & Polygon data via Alchemy
- ✅ Gas price tracking with AI insights
- ✅ Real-time WebSocket updates
- ✅ Practical developer use case

### **Technical Implementation** (20 points)
- ✅ TypeScript throughout
- ✅ Clean code architecture
- ✅ Real API integrations (no mock data)
- ✅ Responsive design, error handling

### **Practical Value** (20 points)
- ✅ Solves real DevOps pain (unified monitoring)
- ✅ Saves time (one dashboard vs. multiple tools)
- ✅ Saves money (gas optimization)
- ✅ Production-ready

---

## Support & Questions

- **Documentation**: See [docs/JUDGES_GUIDE.md](docs/JUDGES_GUIDE.md) for detailed evaluation criteria
- **Setup Guide**: See [docs/SETUP.md](docs/SETUP.md) to run locally
- **Demo Video**: [Link to 5-minute demo video]
- **GitHub Repo**: [Your GitHub URL]
- **Discord Notifications**: [Discord server invite link]

---

## Expected Test Results

When you test the demo account, you should see:

✅ **Dashboard loads in < 3 seconds**
✅ **Green "Live" badge showing WebSocket connection**
✅ **Real Ethereum gas prices matching Etherscan**
✅ **GitHub workflows from actual repository**
✅ **System metrics updating automatically**
✅ **AI agents providing intelligent, context-aware responses**
✅ **Notifications in Discord channel**
✅ **No errors or mock data warnings**

---

**Happy Testing! 🚀**
