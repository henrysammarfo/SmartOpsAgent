import type { AWSService } from "../types"
import { config } from "../config"

interface VercelDeployment {
  uid: string
  name: string
  url: string
  state: string
  created: number
  ready?: number
}

interface VercelProject {
  id: string
  name: string
  framework: string
  updatedAt: number
}

export class VercelMonitoringService {
  private apiUrl = "https://api.vercel.com"
  private token: string
  private enabled: boolean

  constructor(token?: string) {
    this.token = token || config.vercel.token || ""
    this.enabled = !!this.token
  }

  private async fetchVercel(endpoint: string) {
    if (!this.enabled) {
      throw new Error("Vercel token not configured")
    }

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getProjects(): Promise<VercelProject[]> {
    if (!this.enabled) {
      return []
    }

    try {
      const data = (await this.fetchVercel("/v9/projects")) as { projects?: VercelProject[] }
      return data.projects || []
    } catch (error) {
      console.error("Error fetching Vercel projects:", error)
      return []
    }
  }

  async getDeployments(limit = 10): Promise<VercelDeployment[]> {
    if (!this.enabled) {
      return []
    }

    try {
      const data = (await this.fetchVercel(`/v6/deployments?limit=${limit}`)) as {
        deployments?: VercelDeployment[]
      }
      return data.deployments || []
    } catch (error) {
      console.error("Error fetching Vercel deployments:", error)
      return []
    }
  }

  async getDeploymentMetrics(): Promise<AWSService> {
    if (!this.enabled) {
      return {
        id: "vercel-deployments",
        name: "Vercel Deployments",
        status: "offline",
        region: "global",
        instances: 0,
        metadata: {
          note: "Vercel token not configured",
        },
      }
    }

    try {
      const deployments = await this.getDeployments(20)
      const recentDeployments = deployments.filter((d) => Date.now() - d.created < 24 * 60 * 60 * 1000) // Last 24 hours

      const readyDeployments = recentDeployments.filter((d) => d.state === "READY")
      const errorDeployments = recentDeployments.filter((d) => d.state === "ERROR")

      let status: "healthy" | "warning" | "critical" | "offline" = "healthy"
      if (errorDeployments.length > 0) {
        status = errorDeployments.length > 2 ? "critical" : "warning"
      }

      return {
        id: "vercel-deployments",
        name: "Vercel Deployments",
        status,
        region: "global",
        instances: readyDeployments.length,
        metadata: {
          total: recentDeployments.length,
          ready: readyDeployments.length,
          error: errorDeployments.length,
        },
      }
    } catch (error) {
      console.error("Error fetching deployment metrics:", error)
      return {
        id: "vercel-deployments",
        name: "Vercel Deployments",
        status: "offline",
        region: "global",
        instances: 0,
      }
    }
  }

  async getProjectsMetrics(): Promise<AWSService> {
    if (!this.enabled) {
      return {
        id: "vercel-projects",
        name: "Vercel Projects",
        status: "offline",
        region: "global",
        instances: 0,
        metadata: {
          note: "Vercel token not configured",
        },
      }
    }

    try {
      const projects = await this.getProjects()

      return {
        id: "vercel-projects",
        name: "Vercel Projects",
        status: projects.length > 0 ? "healthy" : "warning",
        region: "global",
        instances: projects.length,
        metadata: {
          total: projects.length,
        },
      }
    } catch (error) {
      console.error("Error fetching projects metrics:", error)
      return {
        id: "vercel-projects",
        name: "Vercel Projects",
        status: "offline",
        region: "global",
        instances: 0,
      }
    }
  }

  async getAllServices(): Promise<AWSService[]> {
    const [deployments, projects] = await Promise.all([this.getDeploymentMetrics(), this.getProjectsMetrics()])

    return [deployments, projects]
  }
}
