# SmartOpsAgent Backend Integration Guide

This document provides comprehensive step-by-step instructions for integrating the SmartOpsAgent dashboard with your backend services.

## Table of Contents

1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [WebSocket Integration](#websocket-integration)
4. [REST API Integration](#rest-api-integration)
5. [Data Models](#data-models)
6. [Interactive Features](#interactive-features)
7. [Authentication](#authentication)
8. [Testing](#testing)
9. [Making Everything Live](#making-everything-live)
10. [Complete Backend Setup with ADK-TS Agents](#complete-backend-setup-with-adk-ts-agents)

---

## Overview

The SmartOpsAgent dashboard is a Next.js 14 application that requires:
- **WebSocket server** for real-time data updates
- **REST API** for initial data fetching and mutations
- **Authentication** for user management (optional but recommended)

**Tech Stack:**
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Real-time: WebSocket with auto-reconnection
- Charts: Recharts
- State: React Context + SWR for data fetching

---

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
# WebSocket Connection
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com

# REST API Base URL
NEXT_PUBLIC_API_URL=https://your-api-server.com/api

# Optional: Authentication
NEXT_PUBLIC_AUTH_URL=https://your-auth-server.com
\`\`\`

### Vercel Deployment

Add these environment variables in your Vercel project settings:
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development environments
3. Redeploy the application

---

## WebSocket Integration

### WebSocket Server Requirements

The dashboard uses a custom WebSocket hook (`hooks/use-websocket.ts`) that expects:

**Connection URL:** `process.env.NEXT_PUBLIC_WS_URL`

**Connection Flow:**
1. Client connects on component mount
2. Server sends heartbeat pings every 30 seconds
3. Client responds with pong messages
4. Auto-reconnection with exponential backoff on disconnect

### WebSocket Event Types

The client listens for these event types:

\`\`\`typescript
// Event structure
{
  type: string,
  payload: any
}
\`\`\`

**Supported Event Types:**

#### 1. Metrics Update
\`\`\`typescript
{
  type: 'metrics',
  payload: {
    id: string
    label: string
    value: string | number
    change: number // percentage change
    trend: 'up' | 'down' | 'stable'
    status: 'healthy' | 'warning' | 'critical' | 'offline'
  }[]
}
\`\`\`

#### 2. Alerts Update
\`\`\`typescript
{
  type: 'alerts',
  payload: {
    id: string
    title: string
    message: string
    severity: 'info' | 'warning' | 'error' | 'critical'
    timestamp: string
    acknowledged: boolean
    source: string
  }[]
}
\`\`\`

#### 3. Deployments Update
\`\`\`typescript
{
  type: 'deployments',
  payload: {
    id: string
    name: string
    environment: 'production' | 'staging' | 'preview'
    status: 'pending' | 'running' | 'success' | 'failed'
    branch: string
    commit: string
    author: string
    timestamp: string
    duration: string
  }[]
}
\`\`\`

#### 4. AWS Services Update
\`\`\`typescript
{
  type: 'aws-services',
  payload: {
    id: string
    name: string // 'EC2', 'RDS', 'S3', 'Lambda', 'CloudFront', 'IAM'
    status: 'healthy' | 'warning' | 'critical' | 'offline'
    instances: number
    region: string
  }[]
}
\`\`\`

#### 5. Pipeline Update
\`\`\`typescript
{
  type: 'pipeline',
  payload: {
    id: string
    name: string
    branch: string
    commit: string
    author: string
    status: 'running' | 'success' | 'failed' | 'pending'
    stages: {
      id: string
      name: string
      status: 'pending' | 'running' | 'success' | 'failed'
      duration: string
    }[]
  }
}
\`\`\`

#### 6. Web3 Networks Update
\`\`\`typescript
{
  type: 'web3-networks',
  payload: {
    id: string
    name: string // 'Ethereum Mainnet', 'Polygon'
    logo: string // emoji or icon
    status: 'healthy' | 'warning' | 'critical'
    blockNumber: number
    blockTime: number // in seconds
    tps: number // transactions per second
    gasPrice: {
      slow: number
      average: number
      fast: number
    }
    gasTrend: 'up' | 'down'
  }[]
}
\`\`\`

#### 7. Activity Feed Update
\`\`\`typescript
{
  type: 'activity',
  payload: {
    id: string
    type: 'deployment' | 'alert' | 'security' | 'incident'
    title: string
    description: string
    user?: string
    timestamp: string
    status?: 'healthy' | 'warning' | 'critical' | 'offline'
  }[]
}
\`\`\`

### WebSocket Server Implementation Example (Node.js)

\`\`\`javascript
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
  console.log('Client connected')

  // Send initial data
  ws.send(JSON.stringify({
    type: 'metrics',
    payload: getMetrics()
  }))

  // Heartbeat
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping()
    }
  }, 30000)

  // Listen for pong
  ws.on('pong', () => {
    console.log('Received pong from client')
  })

  // Send updates when data changes
  const updateInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'metrics',
        payload: getMetrics()
      }))
    }
  }, 5000)

  ws.on('close', () => {
    console.log('Client disconnected')
    clearInterval(heartbeat)
    clearInterval(updateInterval)
  })
})
\`\`\`

---

## REST API Integration

### API Endpoints

All endpoints should be prefixed with `process.env.NEXT_PUBLIC_API_URL`

#### 1. Get Metrics
\`\`\`
GET /api/metrics
Query Params: ?timeRange=1h|24h|7d|30d

Response:
{
  metrics: Metric[]
}
\`\`\`

#### 2. Get Deployments
\`\`\`
GET /api/deployments
Query Params: ?environment=production|staging|preview&limit=50

Response:
{
  deployments: Deployment[]
}
\`\`\`

#### 3. Get Incidents
\`\`\`
GET /api/incidents
Query Params: ?status=open|resolved&severity=info|warning|error|critical

Response:
{
  incidents: Alert[]
}
\`\`\`

#### 4. Get Security Scans
\`\`\`
GET /api/security
Query Params: ?status=passed|failed&limit=50

Response:
{
  scans: SecurityScan[]
}
\`\`\`

#### 5. Get Web3 Networks
\`\`\`
GET /api/web3

Response:
{
  networks: Web3Network[]
}
\`\`\`

#### 6. Get AWS Services
\`\`\`
GET /api/aws-services

Response:
{
  services: AWSService[]
}
\`\`\`

#### 7. Get Pipeline Status
\`\`\`
GET /api/pipeline/:id

Response:
{
  pipeline: Pipeline
}
\`\`\`

#### 8. Get Activity Feed
\`\`\`
GET /api/activity
Query Params: ?limit=50

Response:
{
  activities: ActivityItem[]
}
\`\`\`

#### 9. Get Chart Data
\`\`\`
GET /api/charts/:metricId
Query Params: ?timeRange=1h|24h|7d|30d

Response:
{
  data: {
    timestamp: string
    value: number
  }[]
}
\`\`\`

### Mutation Endpoints

#### Acknowledge Alert
\`\`\`
POST /api/alerts/:id/acknowledge

Body:
{
  notes?: string
}

Response:
{
  success: boolean
  alert: Alert
}
\`\`\`

#### Dismiss Alert
\`\`\`
DELETE /api/alerts/:id

Response:
{
  success: boolean
}
\`\`\`

#### Create Incident from Alert
\`\`\`
POST /api/incidents

Body:
{
  alertId: string
  title: string
  description: string
  severity: 'info' | 'warning' | 'error' | 'critical'
}

Response:
{
  success: boolean
  incident: Incident
}
\`\`\`

#### Retry Deployment
\`\`\`
POST /api/deployments/:id/retry

Response:
{
  success: boolean
  deployment: Deployment
}
\`\`\`

#### Rollback Deployment
\`\`\`
POST /api/deployments/:id/rollback

Response:
{
  success: boolean
  deployment: Deployment
}
\`\`\`

#### Get Deployment Logs
\`\`\`
GET /api/deployments/:id/logs

Response:
{
  logs: {
    time: string
    level: 'info' | 'success' | 'error'
    message: string
  }[]
}
\`\`\`

#### Re-run Pipeline
\`\`\`
POST /api/pipeline/:id/rerun

Response:
{
  success: boolean
  pipeline: Pipeline
}
\`\`\`

#### Cancel Pipeline
\`\`\`
POST /api/pipeline/:id/cancel

Response:
{
  success: boolean
}
\`\`\`

#### Get Pipeline Logs
\`\`\`
GET /api/pipeline/:id/logs/:stageId

Response:
{
  logs: {
    time: string
    message: string
  }[]
}
\`\`\`

#### Update Settings
\`\`\`
PUT /api/settings

Body:
{
  notifications: {
    email: boolean
    slack: boolean
    webhook: string
  }
  thresholds: {
    cpu: number
    memory: number
    disk: number
  }
  integrations: {
    github: { enabled: boolean, token?: string }
    aws: { enabled: boolean, accessKey?: string, secretKey?: string }
    slack: { enabled: boolean, webhookUrl?: string }
  }
}

Response:
{
  success: boolean
  settings: Settings
}
\`\`\`

---

## Data Models

All TypeScript interfaces are defined in `lib/types.ts`. Here are the key models:

### Metric
\`\`\`typescript
interface Metric {
  id: string
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  status: 'healthy' | 'warning' | 'critical' | 'offline'
}
\`\`\`

### Alert
\`\`\`typescript
interface Alert {
  id: string
  title: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  timestamp: string
  acknowledged: boolean
  source: string
}
\`\`\`

### Deployment
\`\`\`typescript
interface Deployment {
  id: string
  name: string
  environment: 'production' | 'staging' | 'preview'
  status: 'pending' | 'running' | 'success' | 'failed'
  branch: string
  commit: string
  author: string
  timestamp: string
  duration: string
}
\`\`\`

### ChartDataPoint
\`\`\`typescript
interface ChartDataPoint {
  timestamp: string
  value: number
}
\`\`\`

---

## Interactive Features

### All Clickable Elements and Their Actions

#### 1. Metrics Cards
- **Three-dot menu:**
  - "View Details" → Opens `MetricDetailsModal` with historical chart and statistics
  - "Set Alert" → Shows toast notification (implement alert configuration)
  - "Export Data" → Shows toast notification (implement data export)

#### 2. Alerts Panel
- **Three-dot menu (per alert):**
  - "Acknowledge" → Calls `POST /api/alerts/:id/acknowledge`
  - "View Details" → Opens `AlertDetailsModal` with full alert info and notes
  - "Create Incident" → Calls `POST /api/incidents` with alert data
  - "Dismiss" → Calls `DELETE /api/alerts/:id`

#### 3. Deployment List
- **Three-dot menu (per deployment):**
  - "View Logs" → Opens `DeploymentLogsModal` with full deployment logs
  - "View Details" → Opens `DeploymentLogsModal` with deployment info
  - "Rollback" → Calls `POST /api/deployments/:id/rollback`
  - "Redeploy" → Calls `POST /api/deployments/:id/retry`

#### 4. AWS Service Grid
- **Click on service card** → Opens `AWSServiceModal` with service details and performance chart
- **Three-dot menu (grid header):**
  - "View All Services" → Navigate to full services page
  - "Add Service" → Shows toast (implement service addition)
  - "Configure Regions" → Shows toast (implement region config)

#### 5. Pipeline Visualization
- **Three-dot menu:**
  - "Re-run Pipeline" → Calls `POST /api/pipeline/:id/rerun`
  - "View Logs" → Opens `PipelineLogsModal` with stage-by-stage logs
  - "View on GitHub" → Opens GitHub Actions page
  - "Cancel Pipeline" → Calls `POST /api/pipeline/:id/cancel`
- **"View Full Logs" button** → Opens `PipelineLogsModal`

#### 6. Web3 Network Cards
- **Three-dot menu (per network):**
  - "View Explorer" → Opens `Web3NetworkModal` with detailed network stats
  - "View Contracts" → Shows toast (implement contract viewer)
  - "Configure Alerts" → Shows toast (implement gas price alerts)

#### 7. Chart Widgets
- **Three-dot menu:**
  - "View Full Screen" → Expand chart to full screen
  - "Change Time Range" → Show time range selector
  - "Export Chart" → Export chart as image/CSV
  - "Configure" → Open chart configuration

#### 8. Filter Bar
- **Time range selector** → Updates all charts and data
- **Refresh button** → Refetches all data

#### 9. Top Navigation
- **Theme toggle** → Switches between light/dark mode
- **Notifications bell** → Shows notification dropdown
- **User profile** → Shows user menu with settings/logout

---

## Making Everything Live

### Step 1: Set Up Backend Infrastructure

#### A. WebSocket Server Setup

**Option 1: Node.js with ws**
\`\`\`javascript
// server.js
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

// Store connected clients
const clients = new Set()

wss.on('connection', (ws) => {
  clients.add(ws)
  console.log('Client connected. Total clients:', clients.size)

  // Send initial data
  sendInitialData(ws)

  // Heartbeat
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping()
    }
  }, 30000)

  ws.on('pong', () => {
    console.log('Heartbeat received')
  })

  ws.on('close', () => {
    clients.delete(ws)
    clearInterval(heartbeat)
    console.log('Client disconnected. Total clients:', clients.size)
  })
})

// Broadcast updates to all clients
function broadcast(type, payload) {
  const message = JSON.stringify({ type, payload })
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

// Send updates every 5 seconds
setInterval(() => {
  broadcast('metrics', getMetrics())
  broadcast('alerts', getAlerts())
  broadcast('deployments', getDeployments())
}, 5000)

function sendInitialData(ws) {
  ws.send(JSON.stringify({ type: 'metrics', payload: getMetrics() }))
  ws.send(JSON.stringify({ type: 'alerts', payload: getAlerts() }))
  ws.send(JSON.stringify({ type: 'deployments', payload: getDeployments() }))
  ws.send(JSON.stringify({ type: 'aws-services', payload: getAWSServices() }))
  ws.send(JSON.stringify({ type: 'web3-networks', payload: getWeb3Networks() }))
  ws.send(JSON.stringify({ type: 'activity', payload: getActivity() }))
}
\`\`\`

**Option 2: Python with websockets**
\`\`\`python
import asyncio
import websockets
import json

connected_clients = set()

async def handler(websocket):
    connected_clients.add(websocket)
    print(f"Client connected. Total: {len(connected_clients)}")
    
    try:
        # Send initial data
        await send_initial_data(websocket)
        
        # Keep connection alive
        async for message in websocket:
            # Handle incoming messages if needed
            pass
    finally:
        connected_clients.remove(websocket)
        print(f"Client disconnected. Total: {len(connected_clients)}")

async def send_initial_data(websocket):
    await websocket.send(json.dumps({
        'type': 'metrics',
        'payload': get_metrics()
    }))
    # Send other initial data...

async def broadcast_updates():
    while True:
        await asyncio.sleep(5)
        if connected_clients:
            message = json.dumps({
                'type': 'metrics',
                'payload': get_metrics()
            })
            await asyncio.gather(
                *[client.send(message) for client in connected_clients]
            )

async def main():
    async with websockets.serve(handler, "localhost", 8080):
        await broadcast_updates()

asyncio.run(main())
\`\`\`

#### B. REST API Setup

**Option 1: Node.js with Express**
\`\`\`javascript
// api-server.js
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// GET endpoints
app.get('/api/metrics', (req, res) => {
  const { timeRange } = req.query
  res.json({ metrics: getMetrics(timeRange) })
})

app.get('/api/deployments', (req, res) => {
  const { environment, limit } = req.query
  res.json({ deployments: getDeployments(environment, limit) })
})

app.get('/api/alerts', (req, res) => {
  res.json({ alerts: getAlerts() })
})

app.get('/api/aws-services', (req, res) => {
  res.json({ services: getAWSServices() })
})

app.get('/api/web3', (req, res) => {
  res.json({ networks: getWeb3Networks() })
})

app.get('/api/activity', (req, res) => {
  const { limit } = req.query
  res.json({ activities: getActivity(limit) })
})

// POST endpoints
app.post('/api/alerts/:id/acknowledge', (req, res) => {
  const { id } = req.params
  const { notes } = req.body
  const alert = acknowledgeAlert(id, notes)
  res.json({ success: true, alert })
})

app.delete('/api/alerts/:id', (req, res) => {
  const { id } = req.params
  dismissAlert(id)
  res.json({ success: true })
})

app.post('/api/deployments/:id/retry', (req, res) => {
  const { id } = req.params
  const deployment = retryDeployment(id)
  res.json({ success: true, deployment })
})

app.post('/api/deployments/:id/rollback', (req, res) => {
  const { id } = req.params
  const deployment = rollbackDeployment(id)
  res.json({ success: true, deployment })
})

app.get('/api/deployments/:id/logs', (req, res) => {
  const { id } = req.params
  res.json({ logs: getDeploymentLogs(id) })
})

app.listen(3001, () => {
  console.log('API server running on port 3001')
})
\`\`\`

**Option 2: Python with FastAPI**
\`\`\`python
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/metrics")
async def get_metrics(timeRange: Optional[str] = "24h"):
    return {"metrics": get_metrics_data(timeRange)}

@app.get("/api/deployments")
async def get_deployments(
    environment: Optional[str] = None,
    limit: int = 50
):
    return {"deployments": get_deployments_data(environment, limit)}

@app.post("/api/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str, notes: Optional[str] = None):
    alert = acknowledge_alert_data(alert_id, notes)
    return {"success": True, "alert": alert}

@app.delete("/api/alerts/{alert_id}")
async def dismiss_alert(alert_id: str):
    dismiss_alert_data(alert_id)
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
\`\`\`

### Step 2: Connect Data Sources

#### A. AWS Integration
\`\`\`javascript
const AWS = require('aws-sdk')

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
})

const ec2 = new AWS.EC2()
const rds = new AWS.RDS()
const cloudwatch = new AWS.CloudWatch()

async function getAWSServices() {
  const [ec2Instances, rdsInstances] = await Promise.all([
    ec2.describeInstances().promise(),
    rds.describeDBInstances().promise()
  ])

  return [
    {
      id: '1',
      name: 'EC2',
      status: 'healthy',
      instances: ec2Instances.Reservations.length,
      region: 'us-east-1'
    },
    {
      id: '2',
      name: 'RDS',
      status: 'healthy',
      instances: rdsInstances.DBInstances.length,
      region: 'us-east-1'
    }
  ]
}
\`\`\`

#### B. GitHub Actions Integration
\`\`\`javascript
const { Octokit } = require('@octokit/rest')

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

async function getPipelineStatus(owner, repo) {
  const { data } = await octokit.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    per_page: 1
  })

  const run = data.workflow_runs[0]
  const { data: jobs } = await octokit.actions.listJobsForWorkflowRun({
    owner,
    repo,
    run_id: run.id
  })

  return {
    id: run.id.toString(),
    name: run.name,
    branch: run.head_branch,
    commit: run.head_sha.substring(0, 7),
    author: run.actor.login,
    status: run.status === 'completed' ? run.conclusion : run.status,
    stages: jobs.jobs.map(job => ({
      id: job.id.toString(),
      name: job.name,
      status: job.status === 'completed' ? job.conclusion : job.status,
      duration: calculateDuration(job.started_at, job.completed_at)
    }))
  }
}
\`\`\`

#### C. Web3 Integration
\`\`\`javascript
const { ethers } = require('ethers')

const ethProvider = new ethers.providers.JsonRpcProvider(
  process.env.ETH_RPC_URL
)
const polygonProvider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_RPC_URL
)

async function getWeb3Networks() {
  const [ethBlock, polygonBlock, ethGasPrice, polygonGasPrice] = await Promise.all([
    ethProvider.getBlock('latest'),
    polygonProvider.getBlock('latest'),
    ethProvider.getGasPrice(),
    polygonProvider.getGasPrice()
  ])

  return [
    {
      id: '1',
      name: 'Ethereum Mainnet',
      logo: '⟠',
      status: 'healthy',
      blockNumber: ethBlock.number,
      blockTime: 12,
      tps: 15,
      gasPrice: {
        slow: Math.floor(ethers.utils.formatUnits(ethGasPrice.mul(80).div(100), 'gwei')),
        average: Math.floor(ethers.utils.formatUnits(ethGasPrice, 'gwei')),
        fast: Math.floor(ethers.utils.formatUnits(ethGasPrice.mul(120).div(100), 'gwei'))
      },
      gasTrend: 'down'
    },
    {
      id: '2',
      name: 'Polygon',
      logo: '⬡',
      status: 'healthy',
      blockNumber: polygonBlock.number,
      blockTime: 2,
      tps: 65,
      gasPrice: {
        slow: Math.floor(ethers.utils.formatUnits(polygonGasPrice.mul(80).div(100), 'gwei')),
        average: Math.floor(ethers.utils.formatUnits(polygonGasPrice, 'gwei')),
        fast: Math.floor(ethers.utils.formatUnits(polygonGasPrice.mul(120).div(100), 'gwei'))
      },
      gasTrend: 'up'
    }
  ]
}
\`\`\`

### Step 3: Deploy Backend Services

#### Option 1: Deploy to Vercel (Serverless Functions)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

#### Option 2: Deploy to AWS (EC2 + Load Balancer)
\`\`\`bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone your backend repo
git clone your-backend-repo
cd your-repo/backend

# Install dependencies
npm install

# Install PM2 for process management
npm install -g pm2

# Start services
pm2 start dist/index.js --name smartops-backend

# Save PM2 configuration
pm2 save
pm2 startup
\`\`\`

#### Option 3: Deploy to Docker
\`\`\`dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080 3001

CMD ["node", "server.js"]
\`\`\`

\`\`\`bash
# Build and run
docker build -t smartops-backend .
docker run -d \
  -p 3001:3001 \
  -p 3002:3002 \
  --env-file .env \
  --name smartops-backend \
  smartops-backend

# Or use docker-compose
docker-compose up -d
\`\`\`

### Step 4: Configure Frontend Environment Variables

\`\`\`bash
# In Vercel dashboard or .env.local
NEXT_PUBLIC_WS_URL=wss://your-backend-url.com:3002
NEXT_PUBLIC_API_URL=https://your-backend-url.com:3001/api
\`\`\`

**Important:** 
- For Railway/Render, they provide HTTPS/WSS URLs automatically
- For AWS EC2, you'll need to set up SSL certificates (use Let's Encrypt)
- For Docker, configure a reverse proxy (nginx) for SSL

### Testing the Complete Integration

1. **Start Backend:**
\`\`\`bash
cd backend
npm run dev
\`\`\`

2. **Start Frontend:**
\`\`\`bash
cd ..
npm run dev
\`\`\`

3. **Test WebSocket Connection:**
- Open browser console
- Look for `[v0] WebSocket connected` message
- Status indicator should show "Connected" (green)

4. **Test API Endpoints:**
\`\`\`bash
# Test health check
curl http://localhost:3001/api/health

# Test AWS services
curl http://localhost:3001/api/aws/services

# Test GitHub deployments
curl http://localhost:3001/api/github/deployments

# Test Web3 networks
curl http://localhost:3001/api/web3/networks
\`\`\`

5. **Verify Real-Time Updates:**
- Open dashboard
- Watch metrics update every 30 seconds
- Check that AWS services show real instance counts
- Verify GitHub deployments show actual workflow runs
- Confirm Web3 networks show live block numbers and gas prices

### Troubleshooting Backend Issues

#### WebSocket Not Connecting

**Check:**
1. Backend WebSocket server is running on port 3002
2. `NEXT_PUBLIC_WS_URL` is set correctly
3. Firewall allows WebSocket connections
4. SSL certificate is valid (for wss://)

**Debug:**
\`\`\`bash
# Test WebSocket locally
wscat -c ws://localhost:3002

# Check if port is open
netstat -an | grep 3002
\`\`\`

#### API Returning Empty Data

**Check:**
1. API keys are set correctly in backend `.env`
2. AWS credentials have proper permissions
3. GitHub token has correct scopes
4. Web3 RPC URLs are valid

**Debug:**
\`\`\`bash
# Check backend logs
pm2 logs smartops-backend

# Or if running with npm
npm run dev
# Watch console output
\`\`\`

#### AWS Services Showing Offline

**Possible Issues:**
1. Invalid AWS credentials
2. Missing IAM permissions
3. Wrong AWS region

**Fix:**
\`\`\`bash
# Test AWS credentials
aws sts get-caller-identity

# Verify IAM permissions
aws iam get-user
\`\`\`

#### GitHub Deployments Not Loading

**Possible Issues:**
1. Invalid GitHub token
2. Wrong repository owner/name
3. No workflow runs in repository

**Fix:**
1. Verify token has `repo` and `workflow` scopes
2. Check `GITHUB_OWNER` and `GITHUB_REPO` in `.env`
3. Ensure repository has GitHub Actions workflows

#### Web3 Networks Showing Offline

**Possible Issues:**
1. Invalid RPC URLs
2. Rate limiting on free tier
3. Network connectivity issues

**Fix:**
1. Verify RPC URLs are correct
2. Upgrade to paid Alchemy plan if needed
3. Check network connectivity

### Production Deployment Checklist

Backend:
- [ ] All environment variables set
- [ ] Backend deployed and accessible
- [ ] WebSocket server running on correct port
- [ ] REST API responding to requests
- [ ] SSL certificates installed
- [ ] CORS configured for production domain
- [ ] Rate limiting configured
- [ ] Error logging configured
- [ ] Health check endpoint working

Frontend:
- [ ] `NEXT_PUBLIC_WS_URL` points to production WebSocket
- [ ] `NEXT_PUBLIC_API_URL` points to production API
- [ ] Environment variables set in Vercel
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

Testing:
- [ ] WebSocket connection works
- [ ] All API endpoints return data
- [ ] Real-time updates working
- [ ] All modals open and close
- [ ] All three-dot menus work
- [ ] Theme toggle works
- [ ] All pages load correctly
- [ ] No console errors

### Monitoring and Maintenance

#### Set Up Monitoring

1. **Backend Health Checks:**
\`\`\`bash
# Add to cron job
*/5 * * * * curl https://your-backend-url.com/api/health
\`\`\`

2. **WebSocket Connection Monitoring:**
- Monitor connected clients count
- Track reconnection attempts
- Alert on connection failures

3. **API Performance:**
- Monitor response times
- Track error rates
- Set up alerts for slow endpoints

#### Update Intervals

The backend streams data at these intervals:
- **Metrics:** Every 30 seconds
- **Deployments:** Every 60 seconds
- **Web3 Networks:** Every 15 seconds
- **Security Scans:** Every 5 minutes

To adjust intervals, edit `backend/src/config/index.ts`:
\`\`\`typescript
intervals: {
  metrics: 30000,      // 30 seconds
  deployments: 60000,  // 1 minute
  web3: 15000,         // 15 seconds
  security: 300000,    // 5 minutes
}
\`\`\`

### Cost Optimization

#### AWS
- Use CloudWatch metrics aggregation to reduce API calls
- Cache EC2/RDS instance data for 5 minutes
- Use AWS Cost Explorer to monitor spending

#### GitHub
- GitHub API has rate limits (5000 requests/hour for authenticated)
- Cache workflow runs for 1 minute
- Only fetch latest 10 workflow runs

#### Web3
- Alchemy free tier: 300M compute units/month
- Cache block data for 15 seconds
- Use batch requests when possible

#### Backend Hosting
- **Railway:** Free tier available, $5/month for production
- **Render:** Free tier available, $7/month for production
- **AWS EC2:** t2.micro free tier eligible, ~$10/month for t3.small

### Security Best Practices

1. **Never commit `.env` files**
2. **Use environment variables for all secrets**
3. **Enable CORS only for your frontend domain**
4. **Implement rate limiting on API endpoints**
5. **Use HTTPS/WSS in production**
6. **Rotate API keys regularly**
7. **Monitor for suspicious activity**
8. **Keep dependencies updated**

### Next Steps

1. **Deploy Backend:**
   - Choose hosting provider (Railway recommended)
   - Set environment variables
   - Deploy and test

2. **Update Frontend:**
   - Set `NEXT_PUBLIC_WS_URL` and `NEXT_PUBLIC_API_URL`
   - Deploy to Vercel
   - Test end-to-end

3. **Monitor:**
   - Set up health checks
   - Configure alerts
   - Monitor logs

4. **Optimize:**
   - Adjust update intervals
   - Implement caching
   - Monitor costs

---

## Complete Backend Setup with ADK-TS Agents

### Backend Architecture

The SmartOpsAgent backend is built with:
- **ADK-TS** for AI agent orchestration
- **Express.js** for REST API
- **WebSocket (ws)** for real-time updates
- **AWS SDK v3** for cloud monitoring
- **Octokit** for GitHub Actions integration
- **Ethers.js** for Web3 network monitoring

### Required API Keys and Credentials

Create a `backend/.env` file with the following:

\`\`\`bash
# Server Configuration
PORT=3001
WS_PORT=3002
NODE_ENV=production

# AWS Configuration (Required for Infrastructure Monitoring)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# GitHub Configuration (Required for Deployment Monitoring)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name

# Web3 Configuration (Required for Blockchain Monitoring)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/your-api-key

# AI Configuration (Optional - for predictive analytics)
OPENAI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4-turbo-preview
\`\`\`

### How to Get API Keys

#### 1. AWS Credentials
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create a new IAM user with programmatic access
3. Attach policies: `CloudWatchReadOnlyAccess`, `AmazonEC2ReadOnlyAccess`, `AmazonRDSReadOnlyAccess`, `AmazonS3ReadOnlyAccess`
4. Save the Access Key ID and Secret Access Key

#### 2. GitHub Personal Access Token
1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`, `read:org`
4. Generate and save the token

#### 3. Alchemy API Keys (for Web3)
1. Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Create a new app for Ethereum Mainnet
3. Create another app for Polygon Mainnet
4. Copy the HTTPS URLs for both

#### 4. OpenAI API Key (Optional)
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Save the key securely

### Backend Installation and Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm start
\`\`\`

### Backend File Structure

\`\`\`
backend/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── config/
│   │   └── index.ts            # Configuration management
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── services/
│   │   ├── aws-service.ts      # AWS monitoring service
│   │   ├── github-service.ts   # GitHub Actions service
│   │   ├── web3-service.ts     # Web3 monitoring service
│   │   └── websocket-service.ts # WebSocket server
│   └── api/
│       └── routes.ts           # REST API routes
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── .env.example
\`\`\`

### Deploy Backend to Production

#### Option 1: Railway (Recommended - Easiest)

1. Install Railway CLI:
\`\`\`bash
npm install -g @railway/cli
\`\`\`

2. Login and deploy:
\`\`\`bash
cd backend
railway login
railway init
railway up
\`\`\`

3. Add environment variables in Railway dashboard
4. Get your deployment URL (e.g., `https://your-app.railway.app`)

#### Option 2: Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install && npm run build`
5. Set start command: `cd backend && npm start`
6. Add environment variables
7. Deploy

#### Option 3: AWS EC2

\`\`\`bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone your-repo-url
cd your-repo/backend

# Install dependencies
npm install

# Build
npm run build

# Install PM2
npm install -g pm2

# Start services
pm2 start dist/index.js --name smartops-backend

# Save PM2 configuration
pm2 save
pm2 startup
\`\`\`

#### Option 4: Docker

\`\`\`bash
# Build Docker image
cd backend
docker build -t smartops-backend .

# Run container
docker run -d \
  -p 3001:3001 \
  -p 3002:3002 \
  --env-file .env \
  --name smartops-backend \
  smartops-backend

# Or use docker-compose
docker-compose up -d
\`\`\`

### Update Frontend Environment Variables

After deploying the backend, update your frontend environment variables:

\`\`\`bash
# In Vercel dashboard or .env.local
NEXT_PUBLIC_WS_URL=wss://your-backend-url.com:3002
NEXT_PUBLIC_API_URL=https://your-backend-url.com:3001/api
\`\`\`

**Important:** 
- For Railway/Render, they provide HTTPS/WSS URLs automatically
- For AWS EC2, you'll need to set up SSL certificates (use Let's Encrypt)
- For Docker, configure a reverse proxy (nginx) for SSL

### Testing the Complete Integration

1. **Start Backend:**
\`\`\`bash
cd backend
npm run dev
\`\`\`

2. **Start Frontend:**
\`\`\`bash
cd ..
npm run dev
\`\`\`

3. **Test WebSocket Connection:**
- Open browser console
- Look for `[v0] WebSocket connected` message
- Status indicator should show "Connected" (green)

4. **Test API Endpoints:**
\`\`\`bash
# Test health check
curl http://localhost:3001/api/health

# Test AWS services
curl http://localhost:3001/api/aws/services

# Test GitHub deployments
curl http://localhost:3001/api/github/deployments

# Test Web3 networks
curl http://localhost:3001/api/web3/networks
\`\`\`

5. **Verify Real-Time Updates:**
- Open dashboard
- Watch metrics update every 30 seconds
- Check that AWS services show real instance counts
- Verify GitHub deployments show actual workflow runs
- Confirm Web3 networks show live block numbers and gas prices

### Troubleshooting Backend Issues

#### WebSocket Not Connecting

**Check:**
1. Backend WebSocket server is running on port 3002
2. `NEXT_PUBLIC_WS_URL` is set correctly
3. Firewall allows WebSocket connections
4. SSL certificate is valid (for wss://)

**Debug:**
\`\`\`bash
# Test WebSocket locally
wscat -c ws://localhost:3002

# Check if port is open
netstat -an | grep 3002
\`\`\`

#### API Returning Empty Data

**Check:**
1. API keys are set correctly in backend `.env`
2. AWS credentials have proper permissions
3. GitHub token has correct scopes
4. Web3 RPC URLs are valid

**Debug:**
\`\`\`bash
# Check backend logs
pm2 logs smartops-backend

# Or if running with npm
npm run dev
# Watch console output
\`\`\`

#### AWS Services Showing Offline

**Possible Issues:**
1. Invalid AWS credentials
2. Missing IAM permissions
3. Wrong AWS region

**Fix:**
\`\`\`bash
# Test AWS credentials
aws sts get-caller-identity

# Verify IAM permissions
aws iam get-user
\`\`\`

#### GitHub Deployments Not Loading

**Possible Issues:**
1. Invalid GitHub token
2. Wrong repository owner/name
3. No workflow runs in repository

**Fix:**
1. Verify token has `repo` and `workflow` scopes
2. Check `GITHUB_OWNER` and `GITHUB_REPO` in `.env`
3. Ensure repository has GitHub Actions workflows

#### Web3 Networks Showing Offline

**Possible Issues:**
1. Invalid RPC URLs
2. Rate limiting on free tier
3. Network connectivity issues

**Fix:**
1. Verify RPC URLs are correct
2. Upgrade to paid Alchemy plan if needed
3. Check network connectivity

### Production Deployment Checklist

Backend:
- [ ] All environment variables set
- [ ] Backend deployed and accessible
- [ ] WebSocket server running on correct port
- [ ] REST API responding to requests
- [ ] SSL certificates installed
- [ ] CORS configured for production domain
- [ ] Rate limiting configured
- [ ] Error logging configured
- [ ] Health check endpoint working

Frontend:
- [ ] `NEXT_PUBLIC_WS_URL` points to production WebSocket
- [ ] `NEXT_PUBLIC_API_URL` points to production API
- [ ] Environment variables set in Vercel
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

Testing:
- [ ] WebSocket connection works
- [ ] All API endpoints return data
- [ ] Real-time updates working
- [ ] All modals open and close
- [ ] All three-dot menus work
- [ ] Theme toggle works
- [ ] All pages load correctly
- [ ] No console errors

### Monitoring and Maintenance

#### Set Up Monitoring

1. **Backend Health Checks:**
\`\`\`bash
# Add to cron job
*/5 * * * * curl https://your-backend-url.com/api/health
\`\`\`

2. **WebSocket Connection Monitoring:**
- Monitor connected clients count
- Track reconnection attempts
- Alert on connection failures

3. **API Performance:**
- Monitor response times
- Track error rates
- Set up alerts for slow endpoints

#### Update Intervals

The backend streams data at these intervals:
- **Metrics:** Every 30 seconds
- **Deployments:** Every 60 seconds
- **Web3 Networks:** Every 15 seconds
- **Security Scans:** Every 5 minutes

To adjust intervals, edit `backend/src/config/index.ts`:
\`\`\`typescript
intervals: {
  metrics: 30000,      // 30 seconds
  deployments: 60000,  // 1 minute
  web3: 15000,         // 15 seconds
  security: 300000,    // 5 minutes
}
\`\`\`

### Cost Optimization

#### AWS
- Use CloudWatch metrics aggregation to reduce API calls
- Cache EC2/RDS instance data for 5 minutes
- Use AWS Cost Explorer to monitor spending

#### GitHub
- GitHub API has rate limits (5000 requests/hour for authenticated)
- Cache workflow runs for 1 minute
- Only fetch latest 10 workflow runs

#### Web3
- Alchemy free tier: 300M compute units/month
- Cache block data for 15 seconds
- Use batch requests when possible

#### Backend Hosting
- **Railway:** Free tier available, $5/month for production
- **Render:** Free tier available, $7/month for production
- **AWS EC2:** t2.micro free tier eligible, ~$10/month for t3.small

### Security Best Practices

1. **Never commit `.env` files**
2. **Use environment variables for all secrets**
3. **Enable CORS only for your frontend domain**
4. **Implement rate limiting on API endpoints**
5. **Use HTTPS/WSS in production**
6. **Rotate API keys regularly**
7. **Monitor for suspicious activity**
8. **Keep dependencies updated**

### Next Steps

1. **Deploy Backend:**
   - Choose hosting provider (Railway recommended)
   - Set environment variables
   - Deploy and test

2. **Update Frontend:**
   - Set `NEXT_PUBLIC_WS_URL` and `NEXT_PUBLIC_API_URL`
   - Deploy to Vercel
   - Test end-to-end

3. **Monitor:**
   - Set up health checks
   - Configure alerts
   - Monitor logs

4. **Optimize:**
   - Adjust update intervals
   - Implement caching
   - Monitor costs

---

**Backend Repository:** The complete backend code is in the `backend/` directory

**Support:** For issues, check the Troubleshooting section or review backend logs

**Last Updated:** January 2025
