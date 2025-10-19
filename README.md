# SmartOpsAgent - AI-Powered DevOps Monitoring Platform

**ADK-TS Hackathon 2025 Submission**

SmartOpsAgent is an intelligent, multi-tenant DevOps monitoring platform built with ADK-TS that provides real-time insights into infrastructure, CI/CD pipelines, and Web3 networks. Using a hierarchical agent architecture, SmartOpsAgent autonomously monitors, analyzes, and provides actionable recommendations for modern development teams.

## ⚠️ Setup Note

If you're setting up from the v0 workspace, **copy `YOUR_API_KEYS.md` before downloading the ZIP**. This file contains your API keys needed for local development.

## Features

- **Multi-Agent Architecture** - 4 specialized ADK-TS agents (Infrastructure, Web3, CI/CD, Orchestrator)
- **Real-Time Monitoring** - WebSocket-powered live updates
- **Multi-Tenant SaaS** - Each user manages their own integrations
- **Web3 Integration** - Ethereum and Polygon network monitoring
- **AI-Powered Insights** - Predictive analytics and recommendations
- **Multi-Channel Notifications** - Discord and Slack webhooks

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier)
- API keys for integrations (GitHub, Vercel, Alchemy)

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/henrysammarfo/smartops-agent.git
cd smartops-agent

# Install dependencies
npm install
cd backend && npm install && cd ..

# Set up environment variables
cp .env.example .env.local
cp backend/.env.example backend/.env
# Edit both files with your API keys

# Run database migrations
# Execute scripts/001_create_tables.sql in Supabase SQL editor

# Start backend
cd backend && npm run dev

# Start frontend (in new terminal)
npm run dev
\`\`\`

Visit http://localhost:3000 to access the dashboard.

## Documentation

- **[Setup Guide](docs/SETUP.md)** - Comprehensive setup instructions
- **[Quick Start](docs/QUICKSTART.md)** - Get running in 5 minutes
- **[User Guide](docs/USER_GUIDE.md)** - How to use the platform
- **[Integration Guide](docs/INTEGRATION.md)** - Backend integration details
- **[Hackathon Submission](docs/HACKATHON_SUBMISSION.md)** - Submission details
- **[Demo Script](docs/DEMO_SCRIPT.md)** - 5-minute presentation guide

## Architecture

### Frontend
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS v4
- Real-time WebSocket client
- Supabase authentication

### Backend
- Node.js + Express
- ADK-TS agents
- WebSocket server
- Multi-tenant architecture
- Supabase database

### Integrations
- Vercel API (deployments)
- GitHub Actions API (CI/CD)
- Alchemy (Ethereum/Polygon)
- Discord/Slack webhooks
- Supabase (auth + database)

## ADK-TS Implementation

SmartOpsAgent uses 4 specialized agents:

1. **Infrastructure Agent** - Monitors Vercel deployments and system resources
2. **Web3 Agent** - Tracks Ethereum and Polygon networks, predicts gas prices
3. **CI/CD Agent** - Monitors GitHub Actions workflows
4. **Orchestrator Agent** - Coordinates all agents and generates reports

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- ADK-TS
- Supabase
- Tailwind CSS v4
- Recharts
- WebSocket
- Express.js

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- GitHub Issues: [Report bugs](https://github.com/henrysammarfo/smartops-agent/issues)
- Documentation: [docs/](docs/)

## Hackathon

Built for ADK-TS Hackathon 2025
- Track 2: ADK-TS Agents
- Track 3: Web3 Use Cases

---

**Built with ADK-TS by IQ AI**
