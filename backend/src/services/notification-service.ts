import type { Alert } from "../types"
import { config } from "../config"

interface NotificationChannel {
  type: "websocket" | "email" | "slack" | "discord" | "sms"
  enabled: boolean
  config?: any
}

export class NotificationService {
  private channels: Map<string, NotificationChannel> = new Map()
  private alertThresholds = {
    cpu: 80,
    memory: 80,
    disk: 90,
    gasPrice: 100, // Gwei
  }

  constructor() {
    this.channels.set("websocket", { type: "websocket", enabled: true })

    if (config.notifications.discord.webhookUrl) {
      this.channels.set("discord", { type: "discord", enabled: true })
    }

    if (config.notifications.slack.webhookUrl) {
      this.channels.set("slack", { type: "slack", enabled: true })
    }
  }

  /**
   * Process and route alerts to appropriate channels
   */
  async sendAlert(alert: Alert): Promise<void> {
    console.log(`[NotificationService] Processing alert: ${alert.title}`)

    // Always send to WebSocket (handled by WebSocketService)
    this.logAlert(alert)

    if (this.channels.get("discord")?.enabled) {
      await this.sendDiscord(alert)
    }

    if (this.channels.get("slack")?.enabled) {
      await this.sendSlack(alert)
    }
  }

  /**
   * Check if metric exceeds threshold and create alert
   */
  checkThreshold(metric: string, value: number): Alert | null {
    const threshold = this.alertThresholds[metric as keyof typeof this.alertThresholds]

    if (!threshold || value < threshold) {
      return null
    }

    const severity = value >= threshold * 1.2 ? "critical" : value >= threshold * 1.1 ? "error" : "warning"

    return {
      id: `alert-${Date.now()}`,
      title: `${metric.toUpperCase()} threshold exceeded`,
      message: `${metric} is at ${value.toFixed(1)}% (threshold: ${threshold}%)`,
      severity,
      timestamp: new Date().toISOString(),
      source: "system",
      acknowledged: false,
    }
  }

  /**
   * Create deployment alert
   */
  createDeploymentAlert(deployment: any, status: "success" | "failed"): Alert {
    return {
      id: `deploy-${deployment.id}`,
      title: `Deployment ${status}`,
      message: `Deployment to ${deployment.target} ${status === "success" ? "completed successfully" : "failed"}`,
      severity: status === "success" ? "info" : "error",
      timestamp: new Date().toISOString(),
      source: "deployment",
      acknowledged: false,
    }
  }

  /**
   * Create GitHub Actions alert
   */
  createWorkflowAlert(workflow: any, status: "success" | "failure"): Alert {
    return {
      id: `workflow-${workflow.id}`,
      title: `Workflow ${status}`,
      message: `GitHub Actions workflow "${workflow.name}" ${status === "success" ? "completed" : "failed"}`,
      severity: status === "success" ? "info" : "error",
      timestamp: new Date().toISOString(),
      source: "github",
      acknowledged: false,
    }
  }

  /**
   * Create Web3 gas price alert
   */
  createGasPriceAlert(network: string, gasPrice: number): Alert | null {
    if (gasPrice < this.alertThresholds.gasPrice) {
      return null
    }

    return {
      id: `gas-${network}-${Date.now()}`,
      title: `High gas prices on ${network}`,
      message: `Gas price is ${gasPrice} Gwei (threshold: ${this.alertThresholds.gasPrice} Gwei)`,
      severity: gasPrice >= this.alertThresholds.gasPrice * 2 ? "critical" : "warning",
      timestamp: new Date().toISOString(),
      source: "web3",
      acknowledged: false,
    }
  }

  /**
   * Log alert to console
   */
  private logAlert(alert: Alert): void {
    const emoji = {
      info: "🔵",
      warning: "🟡",
      error: "🟠",
      critical: "🔴",
    }

    console.log(`${emoji[alert.severity]} [${alert.severity.toUpperCase()}] ${alert.title}: ${alert.message}`)
  }

  /**
   * Update alert thresholds
   */
  updateThresholds(thresholds: Partial<typeof this.alertThresholds>): void {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds }
    console.log("[NotificationService] Thresholds updated:", this.alertThresholds)
  }

  /**
   * Get current thresholds
   */
  getThresholds() {
    return this.alertThresholds
  }

  /**
   * Send alert to Discord via webhook
   */
  private async sendDiscord(alert: Alert): Promise<void> {
    try {
      const webhookUrl = config.notifications.discord.webhookUrl
      if (!webhookUrl) return

      const colors = {
        info: 0x3b82f6, // Blue
        warning: 0xf59e0b, // Yellow
        error: 0xef4444, // Red
        critical: 0x991b1b, // Dark Red
      }

      const embed = {
        title: alert.title,
        description: alert.message,
        color: colors[alert.severity],
        fields: [
          {
            name: "Severity",
            value: alert.severity.toUpperCase(),
            inline: true,
          },
          {
            name: "Source",
            value: alert.source,
            inline: true,
          },
          {
            name: "Time",
            value: new Date(alert.timestamp).toLocaleString(),
            inline: true,
          },
        ],
        timestamp: alert.timestamp,
        footer: {
          text: "SmartOpsAgent",
        },
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "SmartOpsAgent",
          embeds: [embed],
        }),
      })

      if (!response.ok) {
        console.error("[NotificationService] Discord webhook failed:", response.statusText)
      } else {
        console.log("[NotificationService] Alert sent to Discord")
      }
    } catch (error) {
      console.error("[NotificationService] Error sending Discord notification:", error)
    }
  }

  /**
   * Send alert to Slack via webhook
   */
  private async sendSlack(alert: Alert): Promise<void> {
    try {
      const webhookUrl = config.notifications.slack.webhookUrl
      if (!webhookUrl) return

      const colors = {
        info: "#3b82f6", // Blue
        warning: "#f59e0b", // Yellow
        error: "#ef4444", // Red
        critical: "#991b1b", // Dark Red
      }

      const emojis = {
        info: ":information_source:",
        warning: ":warning:",
        error: ":x:",
        critical: ":rotating_light:",
      }

      const payload = {
        username: "SmartOpsAgent",
        icon_emoji: ":robot_face:",
        attachments: [
          {
            color: colors[alert.severity],
            title: `${emojis[alert.severity]} ${alert.title}`,
            text: alert.message,
            fields: [
              {
                title: "Severity",
                value: alert.severity.toUpperCase(),
                short: true,
              },
              {
                title: "Source",
                value: alert.source,
                short: true,
              },
            ],
            footer: "SmartOpsAgent",
            ts: Math.floor(new Date(alert.timestamp).getTime() / 1000),
          },
        ],
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error("[NotificationService] Slack webhook failed:", response.statusText)
      } else {
        console.log("[NotificationService] Alert sent to Slack")
      }
    } catch (error) {
      console.error("[NotificationService] Error sending Slack notification:", error)
    }
  }
}

export const notificationService = new NotificationService()
