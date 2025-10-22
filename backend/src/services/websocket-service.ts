import WebSocket from "ws"
import { VercelMonitoringService } from "./vercel-service"
import { SystemMonitoringService } from "./system-monitoring-service"
import { GitHubService } from "./github-service"
import { Web3Service } from "./web3-service"
import { NotificationService } from "./notification-service"
import { config } from "../config"
import type { Alert } from "../types"

export class WebSocketService {
  private wss: WebSocket.Server
  private vercelService: VercelMonitoringService
  private systemService: SystemMonitoringService
  private githubService: GitHubService
  private web3Service: Web3Service
  private notificationService: NotificationService
  private intervals: NodeJS.Timeout[] = []

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port })
    this.vercelService = new VercelMonitoringService()
    this.systemService = new SystemMonitoringService()
    this.githubService = new GitHubService()
    this.web3Service = new Web3Service()
    this.notificationService = new NotificationService()

    this.setupWebSocket()
    this.startDataStreaming()
  }

  private createAlert(
    title: string,
    message: string,
    severity: "info" | "warning" | "error" | "critical",
    source: string,
  ): Alert {
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      severity,
      timestamp: new Date().toISOString(),
      source,
      acknowledged: false,
    }
  }

  private setupWebSocket() {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("Client connected")

      this.sendInitialData(ws)

      ws.on("message", (message: string) => {
        try {
          const data = JSON.parse(message.toString())
          if (data.type === "ping") {
            ws.send(JSON.stringify({ type: "pong" }))
          }
        } catch (error) {
          console.error("Error parsing message:", error)
        }
      })

      ws.on("close", () => {
        console.log("Client disconnected")
      })

      ws.on("error", (error) => {
        console.error("WebSocket error:", error)
      })
    })

    console.log(`WebSocket server running on port ${config.wsPort}`)
  }

  private async sendInitialData(ws: WebSocket) {
    try {
      const [vercelServices, systemInfo, metrics, deployments, pipeline, web3Networks] = await Promise.all([
        this.vercelService.getAllServices(),
        this.systemService.getSystemInfo(),
        this.systemService.getAllMetrics(),
        this.githubService.getWorkflowRuns(),
        this.githubService.getLatestPipeline(),
        this.web3Service.getAllNetworks(),
      ])

      ws.send(JSON.stringify({ type: "infrastructure-services", payload: [...vercelServices, ...systemInfo] }))
      ws.send(JSON.stringify({ type: "metrics", payload: metrics }))
      ws.send(JSON.stringify({ type: "deployments", payload: deployments }))
      ws.send(JSON.stringify({ type: "pipeline", payload: pipeline }))
      ws.send(JSON.stringify({ type: "web3-networks", payload: web3Networks }))
    } catch (error) {
      console.error("Error sending initial data:", error)
    }
  }

  private startDataStreaming() {
    const infraInterval = setInterval(async () => {
      try {
        const [vercelServices, systemInfo, metrics] = await Promise.all([
          this.vercelService.getAllServices(),
          this.systemService.getSystemInfo(),
          this.systemService.getAllMetrics(),
        ])
        this.broadcast({ type: "infrastructure-services", payload: [...vercelServices, ...systemInfo] })
        this.broadcast({ type: "metrics", payload: metrics })

        for (const metric of metrics) {
          if (metric.name === "CPU Usage" && metric.value > 80) {
            await this.notificationService.sendAlert(
              this.createAlert(
                "High CPU Usage Detected",
                `CPU usage is at ${metric.value}%`,
                "critical",
                "system-monitoring",
              ),
            )
          }
          if (metric.name === "Memory Usage" && metric.value > 85) {
            await this.notificationService.sendAlert(
              this.createAlert(
                "High Memory Usage Detected",
                `Memory usage is at ${metric.value}%`,
                "warning",
                "system-monitoring",
              ),
            )
          }
        }
      } catch (error) {
        console.error("Error streaming infrastructure data:", error)
      }
    }, config.intervals.metrics)

    const githubInterval = setInterval(async () => {
      try {
        const [deployments, pipeline] = await Promise.all([
          this.githubService.getWorkflowRuns(),
          this.githubService.getLatestPipeline(),
        ])
        this.broadcast({ type: "deployments", payload: deployments })
        this.broadcast({ type: "pipeline", payload: pipeline })

        const failedDeployments = deployments.filter((d) => d.status === "failed")
        for (const deployment of failedDeployments) {
          await this.notificationService.sendAlert(
            this.createAlert(
              "Deployment Failed",
              `Deployment ${deployment.id} failed on branch ${deployment.branch}`,
              "error",
              "github-actions",
            ),
          )
        }
      } catch (error) {
        console.error("Error streaming GitHub data:", error)
      }
    }, config.intervals.deployments)

    const web3Interval = setInterval(async () => {
      try {
        const networks = await this.web3Service.getAllNetworks()
        this.broadcast({ type: "web3-networks", payload: networks })

        for (const network of networks) {
          if (network.gasPrice.fast > 100) {
            await this.notificationService.sendAlert(
              this.createAlert(
                `High Gas Price on ${network.name}`,
                `Fast gas price is ${network.gasPrice.fast} Gwei`,
                "warning",
                "web3-monitoring",
              ),
            )
          }
        }
      } catch (error) {
        console.error("Error streaming Web3 data:", error)
      }
    }, config.intervals.web3)

    this.intervals.push(infraInterval, githubInterval, web3Interval)
  }

  private broadcast(data: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data))
      }
    })
  }

  public close() {
    this.intervals.forEach((interval) => clearInterval(interval))
    this.wss.close()
  }
}
