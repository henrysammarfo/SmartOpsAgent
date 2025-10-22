import { AgentBuilder, createTool } from "@iqai/adk"
import { z } from "zod"
import { VercelMonitoringService } from "../services/vercel-service"
import { SystemMonitoringService } from "../services/system-monitoring-service"

const vercelService = new VercelMonitoringService()
const systemService = new SystemMonitoringService()

const getVercelDeploymentsTool = createTool({
  name: "get_vercel_deployments",
  description: "Fetch recent Vercel deployments and their status",
  schema: z.object({
    limit: z.number().optional().default(10),
  }),
  fn: async ({ limit }) => {
    const deployments = await vercelService.getDeployments()
    return deployments.slice(0, limit)
  },
})

const getSystemMetricsTool = createTool({
  name: "get_system_metrics",
  description: "Get current system CPU, memory, and disk usage",
  schema: z.object({}),
  fn: async () => {
    return await systemService.getAllMetrics()
  },
})

const analyzeDeploymentHealthTool = createTool({
  name: "analyze_deployment_health",
  description: "Analyze deployment patterns and identify issues",
  schema: z.object({
    timeRange: z.enum(["1h", "24h", "7d"]).optional().default("24h"),
  }),
  fn: async ({ timeRange }) => {
    const deployments = await vercelService.getDeployments()
    const failed = deployments.filter((d: any) => d.state === "ERROR").length
    const total = deployments.length
    const failureRate = (failed / total) * 100

    return {
      totalDeployments: total,
      failedDeployments: failed,
      failureRate: `${failureRate.toFixed(2)}%`,
      recommendation:
        failureRate > 10 ? "High failure rate detected. Review recent changes and logs." : "Deployment health is good.",
    }
  },
})

export const infrastructureAgent = AgentBuilder.create("InfrastructureMonitoringAgent")
  .withDescription("Monitors infrastructure health, deployments, and system resources")
  .withModel("openai/gpt-4o-mini")
  .withTools(getVercelDeploymentsTool, getSystemMetricsTool, analyzeDeploymentHealthTool)
  .build()
