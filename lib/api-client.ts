const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export class APIClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.token = token
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Infrastructure endpoints (Vercel + System monitoring)
  async getInfrastructureServices() {
    return this.fetch("/infrastructure/services")
  }

  async getInfrastructureMetrics() {
    return this.fetch("/infrastructure/metrics")
  }

  async getMetricHistory() {
    return this.fetch("/infrastructure/history")
  }

  // Alias methods for backward compatibility
  async getAWSServices() {
    return this.getInfrastructureServices()
  }

  async getAWSMetrics() {
    return this.getInfrastructureMetrics()
  }

  // GitHub endpoints
  async getDeployments() {
    return this.fetch("/github/deployments")
  }

  async getPipeline() {
    return this.fetch("/github/pipeline")
  }

  async getWorkflowLogs(runId: string) {
    return this.fetch(`/github/logs/${runId}`)
  }

  // Web3 endpoints
  async getWeb3Networks() {
    return this.fetch("/web3/networks")
  }

  async getEthereumMetrics() {
    return this.fetch("/web3/ethereum")
  }

  async getPolygonMetrics() {
    return this.fetch("/web3/polygon")
  }

  // Alerts endpoint
  async getAlerts() {
    return this.fetch("/alerts")
  }

  // Health check
  async healthCheck() {
    return this.fetch("/health")
  }
}

export const apiClient = new APIClient()
