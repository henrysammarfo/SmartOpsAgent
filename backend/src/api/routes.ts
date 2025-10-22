import { Router } from "express"
import { createClient } from "@supabase/supabase-js"
import { VercelMonitoringService } from "../services/vercel-service"
import { SystemMonitoringService } from "../services/system-monitoring-service"
import { GitHubService } from "../services/github-service"
import { Web3Service } from "../services/web3-service"
import type { AWSService } from "../types"

const router = Router()

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_URL || "",
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY || "",
)

// Middleware to verify user authentication
const authenticateUser = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header" })
  }

  const token = authHeader.replace("Bearer ", "")
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: "Invalid token" })
  }

  req.userId = user.id
  next()
}

// Helper to get user integrations
async function getUserIntegrations(userId: string) {
  const { data, error } = await supabase.from("user_integrations").select("*").eq("user_id", userId).single()

  if (error || !data) {
    return null
  }

  return data
}

// Health check (public)
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// All other routes require authentication
router.use(authenticateUser)

// Infrastructure endpoints
router.get("/infrastructure/services", async (req: any, res) => {
  try {
    const integrations = await getUserIntegrations(req.userId)
    if (!integrations) {
      return res.status(404).json({ error: "No integrations configured" })
    }

    const systemService = new SystemMonitoringService()
    const systemInfo = await systemService.getSystemInfo()

    // If user has Vercel token, fetch Vercel services
    let vercelServices: AWSService[] = []
    if (integrations.vercel_token) {
      const vercelService = new VercelMonitoringService(integrations.vercel_token)
      vercelServices = await vercelService.getAllServices()
    }

    res.json([...vercelServices, ...systemInfo])
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch infrastructure services" })
  }
})

router.get("/infrastructure/metrics", async (req: any, res) => {
  try {
    const integrations = await getUserIntegrations(req.userId)
    if (!integrations) {
      return res.status(404).json({ error: "No integrations configured" })
    }

    const systemService = new SystemMonitoringService()
    const metrics = await systemService.getAllMetrics()
    res.json(metrics)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch system metrics" })
  }
})

router.get("/infrastructure/history", async (req: any, res) => {
  try {
    const integrations = await getUserIntegrations(req.userId)
    if (!integrations) {
      return res.status(404).json({ error: "No integrations configured" })
    }

    const systemService = new SystemMonitoringService()
    const history = systemService.getMetricHistory()
    res.json(history)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metric history" })
  }
})

// GitHub endpoints
router.get("/github/deployments", async (req: any, res) => {
  try {
    const integrations = await getUserIntegrations(req.userId)
    if (!integrations?.github_token) {
      return res.status(404).json({ error: "GitHub integration not configured" })
    }

    const githubService = new GitHubService(integrations.github_token, integrations.github_username || "")
    const deployments = await githubService.getWorkflowRuns()
    res.json(deployments)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deployments" })
  }
})

router.get("/github/pipeline", async (req: any, res) => {
  try {
    const integrations = await getUserIntegrations(req.userId)
    if (!integrations?.github_token) {
      return res.status(404).json({ error: "GitHub integration not configured" })
    }

    const githubService = new GitHubService(integrations.github_token, integrations.github_username || "")
    const pipeline = await githubService.getLatestPipeline()
    res.json(pipeline)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pipeline" })
  }
})

router.get("/github/logs/:runId", async (req: any, res) => {
  try {
    const integrations = await getUserIntegrations(req.userId)
    if (!integrations?.github_token) {
      return res.status(404).json({ error: "GitHub integration not configured" })
    }

    const githubService = new GitHubService(integrations.github_token, integrations.github_username || "")
    const logs = await githubService.getWorkflowLogs(req.params.runId)
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" })
  }
})

// Web3 endpoints
router.get("/web3/networks", async (req: any, res) => {
  try {
    const integrations = await getUserIntegrations(req.userId)
    if (!integrations?.ethereum_rpc_url && !integrations?.polygon_rpc_url) {
      return res.status(404).json({ error: "Web3 integration not configured" })
    }

    const web3Service = new Web3Service(integrations.ethereum_rpc_url, integrations.polygon_rpc_url)
    const networks = await web3Service.getAllNetworks()
    res.json(networks)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Web3 networks" })
  }
})

router.get("/web3/ethereum", async (req: any, res) => {
  try {
    const integrations = await getUserIntegrations(req.userId)
    if (!integrations?.ethereum_rpc_url) {
      return res.status(404).json({ error: "Ethereum integration not configured" })
    }

    const web3Service = new Web3Service(integrations.ethereum_rpc_url, integrations.polygon_rpc_url)
    const ethereum = await web3Service.getEthereumMetrics()
    res.json(ethereum)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Ethereum metrics" })
  }
})

router.get("/web3/polygon", async (req: any, res) => {
  try {
    const integrations = await getUserIntegrations(req.userId)
    if (!integrations?.polygon_rpc_url) {
      return res.status(404).json({ error: "Polygon integration not configured" })
    }

    const web3Service = new Web3Service(integrations.ethereum_rpc_url, integrations.polygon_rpc_url)
    const polygon = await web3Service.getPolygonMetrics()
    res.json(polygon)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Polygon metrics" })
  }
})

// Alerts endpoint to fetch user alerts from database
router.get("/alerts", async (req: any, res) => {
  try {
    const { data, error } = await supabase
      .from("user_alerts")
      .select("*")
      .eq("user_id", req.userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      return res.status(500).json({ error: "Failed to fetch alerts" })
    }

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts" })
  }
})

export default router
