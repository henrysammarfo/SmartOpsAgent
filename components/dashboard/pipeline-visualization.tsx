"use client"

import { CheckCircle2, XCircle, Clock, Loader2, MoreVertical, GitBranch, Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { PipelineLogsModal } from "@/components/modals/pipeline-logs-modal"
import { useToast } from "@/hooks/use-toast"

interface PipelineStage {
  id: string
  name: string
  status: "success" | "failed" | "pending" | "running" | "skipped"
  duration?: number
  logs?: string[]
}

interface Pipeline {
  id: string
  name: string
  branch: string
  commit: string
  author: string
  status: "success" | "failed" | "pending" | "running"
  stages: PipelineStage[]
  timestamp: string
}

interface PipelineVisualizationProps {
  pipeline: Pipeline
}

export function PipelineVisualization({ pipeline }: PipelineVisualizationProps) {
  const [showLogsModal, setShowLogsModal] = useState(false)
  const { toast } = useToast()

  const statusConfig = {
    success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/50" },
    failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/50" },
    pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted/10", border: "border-muted/50" },
    running: { icon: Loader2, color: "text-primary", bg: "bg-primary/10", border: "border-primary/50" },
    skipped: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted/10", border: "border-muted/50" },
  }

  const handleRerun = () => {
    toast({
      title: "Pipeline Restarted",
      description: "The pipeline has been queued for re-execution.",
    })
  }

  const handleCancel = () => {
    toast({
      title: "Pipeline Cancelled",
      description: "The pipeline execution has been cancelled.",
      variant: "destructive",
    })
  }

  const handleViewGitHub = () => {
    toast({
      title: "Opening GitHub",
      description: "Opening pipeline on GitHub...",
    })
  }

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">GitHub Actions Pipeline</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="h-3 w-3" />
              <span>{pipeline.branch}</span>
              <span>•</span>
              <span>{pipeline.commit}</span>
              <span>•</span>
              <span>by {pipeline.author}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRerun}>
                <Play className="mr-2 h-4 w-4" />
                Re-run Pipeline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowLogsModal(true)}>View Logs</DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewGitHub}>View on GitHub</DropdownMenuItem>
              <DropdownMenuItem onClick={handleCancel}>Cancel Pipeline</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
              {pipeline.stages.map((stage, index) => {
                const config = statusConfig[stage.status]
                const Icon = config.icon

                return (
                  <div key={stage.id} className="flex items-center gap-2">
                    <div className="flex min-w-[140px] flex-col items-center gap-2">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                          config.bg,
                          config.border,
                        )}
                      >
                        <Icon className={cn("h-5 w-5", config.color, stage.status === "running" && "animate-spin")} />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium">{stage.name}</p>
                        <p className="text-xs text-muted-foreground">{stage.duration ? `${stage.duration}s` : "-"}</p>
                      </div>
                    </div>
                    {index < pipeline.stages.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 w-8 transition-colors",
                          stage.status === "success" ? "bg-success/50" : "bg-border/50",
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg border border-border/50 bg-accent/20 p-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-xs", statusConfig[pipeline.status].color)}>
                  {pipeline.status}
                </Badge>
                <span className="text-sm text-muted-foreground">Pipeline {pipeline.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowLogsModal(true)}>
                View Full Logs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PipelineLogsModal open={showLogsModal} onOpenChange={setShowLogsModal} pipelineId={pipeline.id} />
    </>
  )
}
