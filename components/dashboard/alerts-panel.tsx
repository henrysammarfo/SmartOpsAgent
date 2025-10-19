"use client"

import { AlertCircle, AlertTriangle, Info, XCircle, MoreVertical, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Alert } from "@/lib/types"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { AlertDetailsModal } from "@/components/modals/alert-details-modal"
import { useToast } from "@/hooks/use-toast"

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const { toast } = useToast()

  const severityConfig = {
    info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
    warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    error: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
    critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  }

  const handleAcknowledge = (alert: Alert) => {
    toast({
      title: "Alert Acknowledged",
      description: `Alert "${alert.title}" has been acknowledged.`,
    })
  }

  const handleCreateIncident = (alert: Alert) => {
    toast({
      title: "Incident Created",
      description: "A new incident has been created from this alert.",
    })
  }

  const handleDismiss = (alert: Alert) => {
    toast({
      title: "Alert Dismissed",
      description: `Alert "${alert.title}" has been dismissed.`,
      variant: "destructive",
    })
  }

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold">Recent Alerts</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View All Alerts</DropdownMenuItem>
              <DropdownMenuItem>Filter by Severity</DropdownMenuItem>
              <DropdownMenuItem>Alert Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {alerts.map((alert) => {
                const config = severityConfig[alert.severity]
                const Icon = config.icon

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/50",
                      alert.acknowledged && "opacity-60",
                    )}
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-none">{alert.title}</p>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAcknowledge(alert)}>
                          <Check className="mr-2 h-4 w-4" />
                          Acknowledge
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedAlert(alert)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCreateIncident(alert)}>Create Incident</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDismiss(alert)}>
                          Dismiss
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <AlertDetailsModal
        alert={selectedAlert}
        open={!!selectedAlert}
        onOpenChange={(open) => !open && setSelectedAlert(null)}
      />
    </>
  )
}
