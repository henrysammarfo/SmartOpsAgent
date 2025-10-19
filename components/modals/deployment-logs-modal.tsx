"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { apiClient } from "@/lib/api-client"
import type { Deployment } from "@/lib/types"
import { CheckCircle2, XCircle, Clock, Loader2, Download, RefreshCw, GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface DeploymentLogsModalProps {
  deployment: Deployment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface LogEntry {
  time: string
  level: string
  message: string
}

export function DeploymentLogsModal({ deployment, open, onOpenChange }: DeploymentLogsModalProps) {
  const { toast } = useToast()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && deployment) {
      setLoading(true)
      apiClient
        .getDeploymentLogs(deployment.id)
        .then((data) => setLogs(data))
        .catch((error) => {
          console.error("[v0] Failed to fetch deployment logs:", error)
          setLogs([])
        })
        .finally(() => setLoading(false))
    }
  }, [open, deployment])

  if (!deployment) return null

  const statusConfig = {
    success: { icon: CheckCircle2, color: "text-success" },
    failed: { icon: XCircle, color: "text-destructive" },
    pending: { icon: Clock, color: "text-warning" },
    running: { icon: Loader2, color: "text-primary" },
  }

  const config = statusConfig[deployment.status]
  const Icon = config.icon

  const handleRollback = () => {
    toast({
      title: "Rollback Initiated",
      description: `Rolling back deployment "${deployment.name}"...`,
    })
    onOpenChange(false)
  }

  const handleRedeploy = () => {
    toast({
      title: "Redeployment Started",
      description: `Redeploying "${deployment.name}"...`,
    })
    onOpenChange(false)
  }

  const handleDownloadLogs = () => {
    const logsText = logs.map((log) => `[${log.time}] ${log.message}`).join("\n")
    const blob = new Blob([logsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `deployment-${deployment.id}-logs.txt`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Logs Downloaded",
      description: "Deployment logs have been downloaded.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className={cn("h-5 w-5", config.color, deployment.status === "running" && "animate-spin")} />
              <div>
                <div className="flex items-center gap-2">
                  <span>{deployment.name}</span>
                  <Badge variant="outline">{deployment.status}</Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm font-normal text-muted-foreground">
                  <GitBranch className="h-3 w-3" />
                  <span>{deployment.branch}</span>
                  <span>•</span>
                  <span>{deployment.commit}</span>
                  <span>•</span>
                  <span>{deployment.author}</span>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Deployment Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Environment</p>
              <Badge variant="outline" className="mt-1">
                {deployment.environment}
              </Badge>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="mt-1 text-sm font-medium">{deployment.duration}</p>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className={cn("mt-1 text-sm font-medium", config.color)}>{deployment.status}</p>
            </div>
          </div>

          {/* Logs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Deployment Logs</h3>
              <Button variant="ghost" size="sm" onClick={handleDownloadLogs} disabled={logs.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            <ScrollArea className="h-[300px] rounded-lg border border-border/50 bg-black/20 p-4">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">Loading logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No logs available</p>
                </div>
              ) : (
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-muted-foreground">[{log.time}]</span>
                      <span
                        className={cn(
                          log.level === "success" && "text-success",
                          log.level === "error" && "text-destructive",
                          log.level === "info" && "text-foreground",
                        )}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleRedeploy} variant="outline" className="flex-1 bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Redeploy
            </Button>
            <Button onClick={handleRollback} variant="destructive" className="flex-1">
              Rollback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
