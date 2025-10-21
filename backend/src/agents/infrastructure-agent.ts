import { AgentBuilder } from "@iqai/adk"
import { z } from "zod"
import { VercelMonitoringService } from "../services/vercel-service"
import { SystemMonitoringService } from "../services/system-monitoring-service"

const vercelService = new VercelMonitoringService()
const systemService = new SystemMonitoringService()

export const infrastructureAgent = AgentBuilder.create("InfrastructureMonitoringAgent")
  .withDescription("Monitors infrastructure health, deployments, and system resources")
  .withModel("openai/gpt-4o-mini")
  .withTools([
    {
      name: "get_vercel_deployments",
      description: "Fetch recent Vercel deployments and their status",
      inputSchema: z.object({
        limit: z.number().optional().default(10),
      }),
      execute: async ({ limit }) => {
        const deployments = await vercelService.getDeployments()
        return deployments.slice(0, limit)
      },
    },
    {
      name: "get_system_metrics",
      description: "Get current system CPU, memory, and disk usage",
      inputSchema: z.object({}),
      execute: async () => {
        return await systemService.getAllMetrics()
      },
    },
    {
      name: "analyze_deployment_health",
      description: "Analyze deployment patterns and identify issues",
      inputSchema: z.object({
        timeRange: z.enum(["1h", "24h", "7d"]).optional().default("24h"),
      }),
      execute: async ({ timeRange }) => {
        const deployments = await vercelService.getDeployments()
        const failed = deployments.filter((d) => d.status === "failed").length
        const total = deployments.length
        const failureRate = (failed / total) * 100

        return {
          totalDeployments: total,
          failedDeployments: failed,
          failureRate: `${failureRate.toFixed(2)}%`,
          recommendation:
            failureRate > 10
              ? "High failure rate detected. Review recent changes and logs."
              : "Deployment health is good.",
        }
      },
    },
  ])
  .build()
