import os from "os"
import type { AWSService, Metric } from "../types"

export class SystemMonitoringService {
  private history: {
    cpu: number[]
    memory: number[]
    timestamps: number[]
  } = {
    cpu: [],
    memory: [],
    timestamps: [],
  }

  private maxHistoryLength = 60 // Keep last 60 data points

  constructor() {
    // Start collecting metrics every 5 seconds
    setInterval(() => {
      this.collectMetrics()
    }, 5000)
  }

  private getCPUUsage(): number {
    const cpus = os.cpus()
    let totalIdle = 0
    let totalTick = 0

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times]
      }
      totalIdle += cpu.times.idle
    })

    const idle = totalIdle / cpus.length
    const total = totalTick / cpus.length
    const usage = 100 - (100 * idle) / total

    return Math.round(usage * 100) / 100
  }

  private getMemoryUsage(): number {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const usage = (usedMem / totalMem) * 100

    return Math.round(usage * 100) / 100
  }

  private collectMetrics() {
    const cpu = this.getCPUUsage()
    const memory = this.getMemoryUsage()
    const timestamp = Date.now()

    this.history.cpu.push(cpu)
    this.history.memory.push(memory)
    this.history.timestamps.push(timestamp)

    // Keep only last N data points
    if (this.history.cpu.length > this.maxHistoryLength) {
      this.history.cpu.shift()
      this.history.memory.shift()
      this.history.timestamps.shift()
    }
  }

  async getCPUMetrics(): Promise<Metric> {
    const cpuUsage = this.getCPUUsage()
    const status = cpuUsage > 80 ? "critical" : cpuUsage > 60 ? "warning" : "healthy"

    // Calculate trend
    let trend: "up" | "down" | "stable" = "stable"
    if (this.history.cpu.length > 2) {
      const recent = this.history.cpu.slice(-5)
      const avg = recent.reduce((a, b) => a + b, 0) / recent.length
      if (cpuUsage > avg + 5) trend = "up"
      else if (cpuUsage < avg - 5) trend = "down"
    }

    return {
      id: "cpu",
      name: "CPU Usage",
      value: cpuUsage,
      unit: "%",
      status,
      trend,
      timestamp: new Date().toISOString(),
    }
  }

  async getMemoryMetrics(): Promise<Metric> {
    const memoryUsage = this.getMemoryUsage()
    const status = memoryUsage > 85 ? "critical" : memoryUsage > 70 ? "warning" : "healthy"

    let trend: "up" | "down" | "stable" = "stable"
    if (this.history.memory.length > 2) {
      const recent = this.history.memory.slice(-5)
      const avg = recent.reduce((a, b) => a + b, 0) / recent.length
      if (memoryUsage > avg + 5) trend = "up"
      else if (memoryUsage < avg - 5) trend = "down"
    }

    return {
      id: "memory",
      name: "Memory Usage",
      value: memoryUsage,
      unit: "%",
      status,
      trend,
      timestamp: new Date().toISOString(),
    }
  }

  async getDiskMetrics(): Promise<Metric> {
    // Note: Getting disk usage requires platform-specific commands
    // For now, return a placeholder
    return {
      id: "disk",
      name: "Disk Usage",
      value: 45,
      unit: "%",
      status: "healthy",
      trend: "stable",
      timestamp: new Date().toISOString(),
    }
  }

  async getUptimeMetrics(): Promise<Metric> {
    const uptimeSeconds = os.uptime()
    const uptimeHours = Math.floor(uptimeSeconds / 3600)

    return {
      id: "uptime",
      name: "System Uptime",
      value: uptimeHours,
      unit: "hours",
      status: "healthy",
      trend: "up",
      timestamp: new Date().toISOString(),
    }
  }

  async getSystemInfo(): Promise<AWSService[]> {
    const cpuCount = os.cpus().length
    const totalMemGB = Math.round((os.totalmem() / 1024 / 1024 / 1024) * 100) / 100
    const platform = os.platform()
    const arch = os.arch()

    return [
      {
        id: "backend-server",
        name: "Backend Server",
        status: "healthy",
        region: platform,
        instances: 1,
        metadata: {
          cpuCores: cpuCount,
          totalMemory: `${totalMemGB} GB`,
          architecture: arch,
          nodeVersion: process.version,
        },
      },
      {
        id: "database",
        name: "PostgreSQL (Neon)",
        status: "healthy",
        region: "eu-west-2",
        instances: 1,
        metadata: {
          provider: "Neon",
          type: "Serverless Postgres",
        },
      },
    ]
  }

  async getAllMetrics(): Promise<Metric[]> {
    const [cpu, memory, disk, uptime] = await Promise.all([
      this.getCPUMetrics(),
      this.getMemoryMetrics(),
      this.getDiskMetrics(),
      this.getUptimeMetrics(),
    ])

    return [cpu, memory, disk, uptime]
  }

  getMetricHistory() {
    return {
      cpu: this.history.cpu.map((value, index) => ({
        value,
        timestamp: new Date(this.history.timestamps[index]).toISOString(),
      })),
      memory: this.history.memory.map((value, index) => ({
        value,
        timestamp: new Date(this.history.timestamps[index]).toISOString(),
      })),
    }
  }
}
