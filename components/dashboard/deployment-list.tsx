"use client"

import { CheckCircle2, XCircle, Clock, Loader2, MoreVertical, GitBranch } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Deployment } from "@/lib/types"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { DeploymentLogsModal } from "@/components/modals/deployment-logs-modal"
import { useToast } from "@/hooks/use-toast"

interface DeploymentListProps {
  deployments: Deployment[]
}

export function DeploymentList({ deployments }: DeploymentListProps) {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  const { toast } = useToast()

  const statusConfig = {
    success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
    pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    running: { icon: Loader2, color: "text-primary", bg: "bg-primary/10" },
  }

  const envColors = {
    production: "bg-destructive/10 text-destructive",
    staging: "bg-warning/10 text-warning",
    preview: "bg-primary/10 text-primary",
  }

  const handleRollback = (deployment: Deployment) => {
    toast({
      title: "Rollback Initiated",
      description: `Rolling back deployment "${deployment.name}"...`,
    })
  }

  const handleRedeploy = (deployment: Deployment) => {
    toast({
      title: "Redeployment Started",
      description: `Redeploying "${deployment.name}"...`,
    })
  }

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold">Recent Deployments</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View All Deployments</DropdownMenuItem>
              <DropdownMenuItem>Filter by Status</DropdownMenuItem>
              <DropdownMenuItem>Deployment Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {deployments.map((deployment) => {
                const config = statusConfig[deployment.status]
                const Icon = config.icon

                return (
                  <div
                    key={deployment.id}
                    className="flex gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                      <Icon
                        className={cn("h-4 w-4", config.color, deployment.status === "running" && "animate-spin")}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{deployment.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn("text-xs", envColors[deployment.environment])}>
                              {deployment.environment}
                            </Badge>
                            <span className="text-xs text-muted-foreground">•</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <GitBranch className="h-3 w-3" />
                              {deployment.branch}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {deployment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{deployment.commit}</span>
                        <span>•</span>
                        <span>{deployment.author}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(deployment.timestamp), { addSuffix: true })}</span>
                        <span>•</span>
                        <span>{deployment.duration}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedDeployment(deployment)}>View Logs</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedDeployment(deployment)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRollback(deployment)}>Rollback</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRedeploy(deployment)}>Redeploy</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <DeploymentLogsModal
        deployment={selectedDeployment}
        open={!!selectedDeployment}
        onOpenChange={(open) => !open && setSelectedDeployment(null)}
      />
    </>
  )
}
