export type Status = "healthy" | "warning" | "critical" | "offline"
export type Severity = "info" | "warning" | "error" | "critical"
export type DeploymentStatus = "success" | "failed" | "pending" | "running"

export interface Metric {
  id: string
  label: string
  value: string | number
  change: number
  trend: "up" | "down" | "stable"
  status: Status
}

export interface ChartDataPoint {
  timestamp: string
  value: number
  label?: string
}

export interface Alert {
  id: string
  title: string
  message: string
  severity: Severity
  timestamp: string
  source: string
  acknowledged: boolean
}

export interface Deployment {
  id: string
  name: string
  environment: "production" | "staging" | "preview"
  status: DeploymentStatus
  branch: string
  commit: string
  author: string
  timestamp: string
  duration: string
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: Severity
  status: "open" | "investigating" | "resolved"
  timestamp: string
  assignee?: string
  affectedServices: string[]
}

export interface SecurityScan {
  id: string
  type: "vulnerability" | "compliance" | "audit"
  severity: Severity
  title: string
  description: string
  timestamp: string
  status: "open" | "fixed" | "ignored"
}

export interface Web3Network {
  id: string
  name: string
  status: Status
  blockNumber: number
  gasPrice: string
  tps: number
  contracts: number
}

export interface ActivityItem {
  id: string
  type: "deployment" | "alert" | "incident" | "security" | "system"
  title: string
  description: string
  timestamp: string
  user?: string
  status?: Status
}
