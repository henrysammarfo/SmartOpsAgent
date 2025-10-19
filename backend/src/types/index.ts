export interface Metric {
  id: string
  name: string
  value: number
  unit: string
  status: "healthy" | "warning" | "critical" | "offline"
  trend: "up" | "down" | "stable"
  timestamp: string
  metadata?: Record<string, any>
}

export interface Alert {
  id: string
  title: string
  message: string
  severity: "info" | "warning" | "error" | "critical"
  timestamp: string
  source: string
  acknowledged: boolean
  metadata?: Record<string, any>
}

export interface Deployment {
  id: string
  name: string
  status: "success" | "failed" | "pending" | "running"
  environment: string
  branch: string
  commit: string
  author: string
  timestamp: string
  duration?: number
  logs?: string[]
}

export interface AWSService {
  id: string
  name: string
  status: "healthy" | "warning" | "critical" | "offline"
  region: string
  instances?: number
  metadata?: Record<string, any>
}

export interface Pipeline {
  id: string
  name: string
  branch: string
  commit: string
  author: string
  status: "success" | "failed" | "pending" | "running"
  stages: PipelineStage[]
  timestamp: string
}

export interface PipelineStage {
  id: string
  name: string
  status: "success" | "failed" | "pending" | "running" | "skipped"
  duration?: number
  logs?: string[]
}

export interface Web3Network {
  id: string
  name: string
  chainId: number
  status: "healthy" | "warning" | "critical" | "offline"
  blockNumber: number
  blockTime: number
  tps: number
  gasPrice: {
    slow: number
    average: number
    fast: number
  }
  gasTrend: "up" | "down" | "stable"
}

export interface SecurityScan {
  id: string
  type: string
  status: "passed" | "failed" | "warning"
  vulnerabilities: number
  timestamp: string
  details?: string[]
}

export interface ActivityItem {
  id: string
  type: "deployment" | "alert" | "incident" | "security" | "system"
  title: string
  description: string
  timestamp: string
  user?: string
}
