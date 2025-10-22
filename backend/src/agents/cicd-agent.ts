import { AgentBuilder, createTool } from "@iqai/adk"
import { z } from "zod"
import { GitHubService } from "../services/github-service"

const githubService = new GitHubService()

const getWorkflowStatusTool = createTool({
  name: "get_workflow_status",
  description: "Get current status of GitHub Actions workflows",
  schema: z.object({
    limit: z.number().optional().default(10),
  }),
  fn: async ({ limit }) => {
    const workflows = await githubService.getWorkflowRuns()
    return workflows.slice(0, limit)
  },
})

const analyzePipelineHealthTool = createTool({
  name: "analyze_pipeline_health",
  description: "Analyze CI/CD pipeline health and identify bottlenecks",
  schema: z.object({
    timeRange: z.enum(["1h", "24h", "7d"]).optional().default("24h"),
  }),
  fn: async ({ timeRange }) => {
    const workflows = await githubService.getWorkflowRuns()
    const failed = workflows.filter((w) => w.status === "failed").length
    const total = workflows.length
    const avgDuration = workflows.reduce((sum, w) => sum + (w.duration || 0), 0) / total

    return {
      totalRuns: total,
      failedRuns: failed,
      successRate: `${(((total - failed) / total) * 100).toFixed(2)}%`,
      averageDuration: `${Math.round(avgDuration)}s`,
      recommendation:
        failed > total * 0.1
          ? "High failure rate. Review test suite and dependencies."
          : "Pipeline health is good.",
    }
  },
})

const getDeploymentInsightsTool = createTool({
  name: "get_deployment_insights",
  description: "Get insights about deployment frequency and patterns",
  schema: z.object({}),
  fn: async () => {
    const workflows = await githubService.getWorkflowRuns()
    const deployments = workflows.filter((w) => w.name.toLowerCase().includes("deploy"))

    const totalDuration = deployments.reduce((sum, d) => sum + (d.duration || 0), 0)
    const avgDuration = deployments.length > 0 ? totalDuration / deployments.length : 0

    return {
      totalDeployments: deployments.length,
      successfulDeployments: deployments.filter((d) => d.status === "success").length,
      averageDeploymentTime: `${Math.round(avgDuration)}s`,
      lastDeployment: deployments[0]?.timestamp,
    }
  },
})

export const cicdAgent = AgentBuilder.create("CICDMonitoringAgent")
  .withDescription("Monitors GitHub Actions workflows, analyzes pipeline health, and provides deployment insights")
  .withModel("openai/gpt-4o-mini")
  .withTools(getWorkflowStatusTool, analyzePipelineHealthTool, getDeploymentInsightsTool)
  .build()
