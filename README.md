# SmartOpsAgent - AI-Powered DevOps Monitoring Platform

[![ADK-TS Hackathon 2025](https://img.shields.io/badge/ADK--TS-Hackathon%202025-blue)](https://hackathon.iq.ai)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> **🏆 ADK-TS Hackathon 2025 Submission**

SmartOpsAgent is an intelligent, multi-tenant DevOps monitoring platform built with **ADK-TS v0.5.0** that provides real-time insights into infrastructure, CI/CD pipelines, and Web3 networks. Using a hierarchical agent architecture, SmartOpsAgent autonomously monitors, analyzes, and provides actionable recommendations for modern development teams.

## 🌟 Key Features

- **🤖 4 Specialized ADK-TS Agents** - Infrastructure, Web3, CI/CD, and Orchestrator agents working in harmony
- **⚡ Real-Time Monitoring** - WebSocket-powered live updates for instant visibility
- **🏢 Multi-Tenant SaaS** - Each user manages their own API integrations securely
- **⛓️ Web3 Integration** - Monitor Ethereum and Polygon networks with live gas price predictions
- **🔔 Smart Alerts** - Automated notifications via Discord and Slack webhooks
- **📊 Predictive Analytics** - AI-powered insights for proactive infrastructure management

## 🎥 Demo

**Live Demo**: [Coming Soon - Deployment in Progress]

**Demo Video**: [Watch on YouTube](YOUR_YOUTUBE_LINK_HERE)

**Demo Credentials**:
- Email: `demo@smartopsagent.com`
- Password: `DemoPass2025!`

## 🏗️ Architecture

SmartOpsAgent uses a **hierarchical multi-agent architecture** powered by ADK-TS:

### 🤖 Agent System
1. **Infrastructure Agent** - Monitors system resources, Vercel deployments, and server health
2. **Web3 Agent** - Tracks Ethereum and Polygon networks, predicts gas prices using AI
3. **CI/CD Agent** - Monitors GitHub Actions workflows and deployment pipelines
4. **Orchestrator Agent** - Coordinates all agents, generates unified reports, and triggers alerts

### 🛠️ Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Node.js, Express, ADK-TS v0.5.0, WebSocket
- **Database**: Supabase (PostgreSQL)
- **Integrations**: GitHub API, Vercel API, Alchemy (Web3), Discord, Slack
- **AI**: OpenAI GPT-4 for predictive analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- API keys for integrations (optional for demo)

### Local Development

\`\`\`bash
# 1. Clone repository
git clone https://github.com/henrysammarfo/SmartOpsAgent.git
cd SmartOpsAgent

# 2. Install dependencies
npm install
cd backend && npm install && cd ..

# 3. Set up environment variables
cp .env.example .env.local
cp backend/.env.example backend/.env
# Edit both files with your API keys (or use provided demo keys)

# 4. Set up Supabase database
# Go to https://supabase.com/dashboard
# Create a new project
# Run scripts/001_create_tables.sql in SQL Editor
# Run scripts/002_add_alerts_table.sql in SQL Editor

# 5. Start backend (Terminal 1)
cd backend
npm start

# 6. Start frontend (Terminal 2)
npm run dev
\`\`\`

Visit **http://localhost:3000** and sign up or use demo credentials above.

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions for Railway + Vercel
- **[Database Schema](scripts/)** - SQL migration scripts for Supabase setup

## 🎯 ADK-TS Implementation Highlights

SmartOpsAgent showcases the power of **ADK-TS v0.5.0** through:

- **createTool() API** - Custom tools for each agent to interact with external APIs
- **Hierarchical Architecture** - Orchestrator coordinates specialized agents
- **Autonomous Decision Making** - Agents analyze metrics and trigger alerts independently
- **Real-time Data Processing** - WebSocket integration for live agent updates
- **Multi-Agent Coordination** - Agents work together to provide unified insights

### Agent Code Structure
```
backend/src/agents/
├── infrastructure-agent.ts  # System & Vercel monitoring
├── web3-agent.ts           # Ethereum & Polygon tracking
├── cicd-agent.ts           # GitHub Actions monitoring
└── orchestrator-agent.ts   # Coordination & reporting
```

## 🏆 Hackathon Submission

**Event**: ADK-TS Hackathon 2025
**Tracks**:
- ✅ Track 2: ADK-TS Agents (Primary)
- ✅ Track 3: Web3 Use Cases (Secondary)

**What Makes This Project Special**:
- Demonstrates real-world application of ADK-TS in DevOps
- Hierarchical multi-agent architecture with coordinated workflows
- Production-ready multi-tenant SaaS platform
- Combines traditional DevOps monitoring with Web3 capabilities
- Real-time autonomous agent decision-making

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

- **GitHub**: [henrysammarfo/SmartOpsAgent](https://github.com/henrysammarfo/SmartOpsAgent)
- **Issues**: [Report bugs or request features](https://github.com/henrysammarfo/SmartOpsAgent/issues)

---

<div align="center">

**Built with ❤️ using ADK-TS by IQ AI**

[⭐ Star this repo](https://github.com/henrysammarfo/SmartOpsAgent) • [🐛 Report Bug](https://github.com/henrysammarfo/SmartOpsAgent/issues) • [💡 Request Feature](https://github.com/henrysammarfo/SmartOpsAgent/issues)

</div>
