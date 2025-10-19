# SmartOpsAgent - Complete User Guide

## What is SmartOpsAgent?

SmartOpsAgent is an AI-powered DevOps monitoring dashboard that gives you real-time visibility into your infrastructure, deployments, and blockchain networks. Instead of switching between multiple tools (Vercel, GitHub, Alchemy), you get everything in one intelligent dashboard.

---

## Getting Started (First Time Setup)

### Step 1: Access the Dashboard
1. Open your browser and go to: `https://your-smartops-dashboard.vercel.app`
2. You'll see the landing page with an overview of features
3. Click **"Open Dashboard"** to enter the monitoring interface

### Step 2: Understanding the Layout
When you first enter, you'll see:
- **Left Sidebar**: Navigation menu with 7 sections (collapsible)
- **Top Bar**: System status, notifications, theme toggle, and your profile
- **Main Area**: Real-time metrics and charts
- **Connection Status**: Green dot = Live data, Yellow = Connecting, Red = Offline

### Step 3: Check Your Notifications
1. Look at the **bell icon** in the top-right corner
2. Red badge shows unread alerts
3. Click to see recent notifications
4. Notifications also appear in Discord and Slack channels you configured

---

## Daily Usage

### Overview Dashboard (Home)
**What you see:**
- **4 Key Metrics Cards**: CPU, Memory, Active Deployments, Open Incidents
- **Performance Chart**: Real-time CPU and memory usage over time
- **Recent Alerts Panel**: Latest warnings and errors
- **Activity Feed**: Live stream of system events

**What you can do:**
- Click the **three-dot menu** on any metric card to:
  - View detailed history
  - Set custom thresholds
  - Export data
- Click on any alert to see full details and acknowledge it
- Filter activity feed by time range (Last Hour, 24 Hours, 7 Days)

### Infrastructure Monitoring
**What you see:**
- **System Metrics**: Real-time CPU, memory, disk usage of your backend server
- **Vercel Deployments**: Status of all your Vercel projects
- **Service Grid**: Health status of 6 key services (EC2, RDS, S3, Lambda, CloudFront, IAM)

**What you can do:**
- Click any service card to see detailed metrics
- Three-dot menu options:
  - View logs
  - Restart service (if applicable)
  - Configure alerts
- Set threshold alerts (e.g., notify me when CPU > 80%)

### Deployments (CI/CD Pipeline)
**What you see:**
- **Pipeline Visualization**: Visual workflow showing 6 stages (Checkout → Build → Test → Deploy → Verify → Complete)
- **Deployment List**: Recent deployments with status, duration, and commit info
- **GitHub Actions Status**: Real-time workflow runs

**What you can do:**
- Click **"View Logs"** on any pipeline stage to see detailed output
- Click **"Re-run Pipeline"** to trigger a new deployment
- Click any deployment in the list to see:
  - Full commit details
  - Build logs
  - Deployment URL
  - Performance metrics

### Web3 Monitoring
**What you see:**
- **Ethereum Network Card**: Block number, block time, TPS, gas prices (slow/average/fast)
- **Polygon Network Card**: Same metrics for Polygon
- **Gas Price Trends**: Charts showing gas price movements
- **Network Health**: Real-time status indicators

**What you can do:**
- Monitor gas prices to optimize deployment timing
- Get alerts when gas prices spike above your threshold
- Click network cards to see detailed blockchain metrics
- View historical gas price trends

### Incidents Management
**What you see:**
- **Active Incidents**: Current issues requiring attention
- **Incident History**: Past incidents and resolutions
- **Severity Levels**: Color-coded (Info=Blue, Warning=Yellow, Error=Orange, Critical=Red)

**What you can do:**
- Click any incident to see full details
- **Acknowledge** incidents to mark them as seen
- **Resolve** incidents when fixed
- Add notes and comments to incidents
- Filter by severity level

### Security Scans
**What you see:**
- **Recent Scans**: Latest security scan results
- **Vulnerability Count**: High/Medium/Low severity issues
- **Scan History**: Past scan results and trends

**What you can do:**
- Click any scan to see detailed vulnerability report
- Mark vulnerabilities as fixed
- Schedule automatic scans
- Export security reports

### Settings
**What you can configure:**
- **General**: Dashboard name, timezone, refresh intervals
- **Notifications**: Alert thresholds, notification channels (Discord, Slack)
- **API Configuration**: Add/update API keys for integrations
- **Integrations**: Connect/disconnect services (Vercel, GitHub, Alchemy)

---

## Understanding Notifications

### Where Notifications Appear
1. **In-Dashboard**: Toast popups in bottom-right corner
2. **Notification Badge**: Red number on bell icon
3. **Discord**: Rich embeds with color-coded severity
4. **Slack**: Formatted messages with emoji indicators

### Notification Types
- **🔵 Info**: General updates (deployment started, scan completed)
- **🟡 Warning**: Attention needed (CPU at 75%, gas prices rising)
- **🟠 Error**: Issues detected (deployment failed, test failures)
- **🔴 Critical**: Urgent action required (CPU at 95%, service down)

### Managing Notifications
1. Click the bell icon to see all notifications
2. Click any notification to see full details
3. Click **"Mark as Read"** to clear the badge
4. Click **"Clear All"** to dismiss all notifications

---

## AI Agent Features

SmartOpsAgent uses 4 specialized AI agents powered by ADK-TS:

### 1. Infrastructure Agent
- Monitors system resources and Vercel deployments
- Predicts resource usage trends
- Suggests optimizations (e.g., "Scale up during peak hours")

### 2. Web3 Agent
- Tracks Ethereum and Polygon networks
- Predicts gas price trends
- Recommends optimal deployment times

### 3. CI/CD Agent
- Monitors GitHub Actions workflows
- Analyzes deployment patterns
- Suggests workflow optimizations

### 4. Orchestrator Agent
- Coordinates all agents
- Provides unified insights
- Generates comprehensive reports

**How to use AI agents:**
1. Go to any section (Infrastructure, Web3, Deployments)
2. Click **"Ask AI"** button
3. Type your question (e.g., "Why did my deployment fail?")
4. Get intelligent analysis and recommendations

---

## Tips for Power Users

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + B`: Toggle sidebar
- `Ctrl/Cmd + T`: Toggle theme
- `Esc`: Close modals

### Custom Dashboards
1. Go to Settings → General
2. Click **"Customize Dashboard"**
3. Drag and drop widgets to rearrange
4. Add/remove metrics cards
5. Save your layout

### Exporting Data
1. Click three-dot menu on any chart or metric
2. Select **"Export Data"**
3. Choose format (CSV, JSON, PDF)
4. Download to your computer

### Setting Up Alerts
1. Go to Settings → Notifications
2. Click **"Add Alert Rule"**
3. Configure:
   - Metric to monitor (CPU, Memory, Gas Price, etc.)
   - Threshold value
   - Notification channels (Discord, Slack, Email)
4. Save rule

---

## Troubleshooting

### Dashboard Shows "Offline"
- Check if backend server is running
- Verify `NEXT_PUBLIC_WS_URL` and `NEXT_PUBLIC_API_URL` in environment variables
- Check browser console for connection errors

### No Data Showing
- Verify API keys are configured in Settings → API Configuration
- Check if services are connected in Settings → Integrations
- Refresh the page (Ctrl/Cmd + R)

### Notifications Not Working
- Check Discord/Slack webhook URLs in backend `.env` file
- Verify notification settings in Settings → Notifications
- Test webhooks by clicking **"Send Test Notification"**

### Charts Not Updating
- Check WebSocket connection status (green dot in top bar)
- Verify backend is running and accessible
- Clear browser cache and reload

---

## Best Practices

### Daily Monitoring Routine
1. **Morning**: Check Overview dashboard for overnight incidents
2. **Before Deployments**: Check Web3 gas prices and system resources
3. **After Deployments**: Monitor pipeline status and verify success
4. **Evening**: Review incident history and resolve any open issues

### Alert Configuration
- Set CPU threshold at 80% for warnings, 90% for critical
- Set memory threshold at 85% for warnings, 95% for critical
- Set gas price alerts based on your budget (e.g., alert when > 50 gwei)
- Enable Discord/Slack notifications for critical alerts only

### Performance Optimization
- Use time range filters to reduce data load
- Close unused browser tabs
- Enable dark mode to reduce eye strain
- Set refresh interval to 30 seconds instead of real-time for less critical metrics

---

## Support

### Getting Help
- Check this user guide first
- Review SETUP.md for configuration issues
- Check INTEGRATION.md for backend integration help
- Open GitHub issue for bugs or feature requests

### Community
- Join Discord server for community support
- Follow updates on Twitter/X
- Contribute to GitHub repository

---

## Next Steps

Now that you understand how to use SmartOpsAgent:
1. Explore each section of the dashboard
2. Configure your alert thresholds
3. Set up Discord/Slack notifications
4. Try asking the AI agents questions
5. Customize your dashboard layout

**Happy Monitoring! 🚀**
