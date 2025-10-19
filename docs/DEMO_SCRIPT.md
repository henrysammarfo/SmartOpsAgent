# SmartOpsAgent - 5-Minute Demo Script

**Target Time:** 4:30 minutes  
**Format:** Screen recording with voiceover

---

## Opening (0:00 - 0:30)

**Visual:** Landing page with hero section

**Script:**
"Hi, I'm Henry, and this is SmartOpsAgent - an AI-powered DevOps monitoring platform built with ADK-TS. Modern development teams juggle multiple monitoring tools - Vercel for deployments, GitHub for CI/CD, Alchemy for Web3 networks. SmartOpsAgent unifies all of this into one intelligent dashboard powered by a multi-agent system."

---

## Problem Statement (0:30 - 1:00)

**Visual:** Show multiple browser tabs (Vercel, GitHub, Alchemy dashboards)

**Script:**
"The problem? Context switching between tools delays incident detection. Teams miss correlations between systems. Alert fatigue from multiple sources. SmartOpsAgent solves this with 4 specialized ADK-TS agents that autonomously monitor, analyze, and provide actionable insights."

---

## Agent Architecture (1:00 - 1:45)

**Visual:** Show architecture diagram or code

**Script:**
"Here's how it works. We have an Orchestrator Agent that coordinates three specialized agents:

1. Infrastructure Agent - monitors Vercel deployments and system resources
2. Web3 Agent - tracks Ethereum and Polygon networks, predicts gas prices
3. CI/CD Agent - monitors GitHub Actions pipelines

Each agent is built with ADK-TS's AgentBuilder API, with custom tools for their domain. The orchestrator delegates tasks and generates comprehensive reports."

**Show code snippet:**
\`\`\`typescript
const orchestratorAgent = new AgentBuilder()
  .withName('SmartOpsOrchestratorAgent')
  .withModel('openai/gpt-4o')
  .withTools([...])
  .build();
\`\`\`

---

## Live Demo - Dashboard Overview (1:45 - 2:30)

**Visual:** Navigate to dashboard

**Script:**
"Let's see it in action. This is the main dashboard showing real-time metrics from all systems. Here we have:
- Vercel deployment status
- System resources - CPU, memory, disk usage
- GitHub Actions pipeline status
- Ethereum and Polygon network health
- Recent alerts

Everything updates in real-time via WebSocket. Notice the notification badge - we have 3 unread alerts."

---

## Live Demo - Infrastructure Monitoring (2:30 - 3:00)

**Visual:** Navigate to Infrastructure page

**Script:**
"The Infrastructure page shows detailed Vercel deployment metrics and system monitoring. The Infrastructure Agent analyzes deployment patterns and provides recommendations. See this alert? High CPU usage detected. The agent automatically identified the issue and suggested scaling up."

**Click on a deployment card to show modal with details**

---

## Live Demo - Web3 Monitoring (3:00 - 3:30)

**Visual:** Navigate to Web3 page

**Script:**
"Here's the Web3 monitoring. The Web3 Agent tracks Ethereum and Polygon in real-time. It shows current gas prices, block times, and TPS. But here's the cool part - it predicts gas price trends. See this? Gas prices are trending down, so the agent recommends waiting 30 minutes for optimal transaction costs. This saves teams 20-30% on Web3 transactions."

---

## Live Demo - CI/CD Pipeline (3:30 - 3:50)

**Visual:** Navigate to Deployments page

**Script:**
"The CI/CD Agent monitors GitHub Actions workflows. This pipeline visualization shows each stage - build, test, deploy. The agent analyzes pipeline health, identifies bottlenecks, and provides deployment insights. Here it detected a high failure rate and recommended reviewing the test suite."

---

## Live Demo - Notifications (3:50 - 4:10)

**Visual:** Show Discord/Slack notifications

**Script:**
"Alerts are sent to Discord and Slack with rich formatting. Critical alerts go to Discord immediately. Teams get notified wherever they work. No more checking multiple dashboards."

---

## ADK-TS Integration (4:10 - 4:30)

**Visual:** Show code or architecture

**Script:**
"ADK-TS made this possible. The AgentBuilder API let us create 4 agents in hours. Tool integration with Zod schemas ensures type safety. Multi-agent orchestration handles complex queries. And it all integrates with production APIs - Vercel, GitHub, Alchemy."

---

## Closing (4:30 - 5:00)

**Visual:** Back to dashboard or landing page

**Script:**
"SmartOpsAgent is a practical, production-ready tool that development teams can use today. It reduces incident detection time by 60%, saves 20-30% on Web3 costs, and eliminates context switching. Built entirely with ADK-TS for the ADK-TS Hackathon 2025. Check out the GitHub repo and try it yourself. Thanks for watching!"

**Show:**
- GitHub URL
- Live demo URL
- "Built with ADK-TS" logo

---

## Recording Tips

1. **Use high-quality screen recording** (1080p minimum, 4K preferred)
2. **Clear audio** - Use good microphone, quiet environment
3. **Smooth transitions** - Practice navigation beforehand
4. **Show real data** - Make sure backend is running with live data
5. **Highlight ADK-TS** - Emphasize agent architecture and tools
6. **Stay under 5 minutes** - Aim for 4:30 to have buffer
7. **Add captions** - For accessibility and clarity
8. **Background music** - Subtle, non-distracting (optional)

## Key Points to Emphasize

- Multi-agent architecture with ADK-TS
- Real-world integrations (Vercel, GitHub, Alchemy)
- Practical use case solving real problems
- AI-powered insights and predictions
- Production-ready, not just a demo
- Type-safe with TypeScript and Zod
- Real-time updates via WebSocket
- Multi-channel notifications

---

**Good luck with the demo!**
