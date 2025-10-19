"use client"

import { TrendingUp, TrendingDown, Minus, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Metric } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { MetricDetailsModal } from "@/components/modals/metric-details-modal"
import { useToast } from "@/hooks/use-toast"

interface MetricsCardProps {
  metric: Metric
}

export function MetricsCard({ metric }: MetricsCardProps) {
  const [showModal, setShowModal] = useState(false)
  const { toast } = useToast()

  const TrendIcon = metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Minus

  const statusColors = {
    healthy: "text-success",
    warning: "text-warning",
    critical: "text-destructive",
    offline: "text-muted-foreground",
  }

  const handleSetAlert = () => {
    toast({
      title: "Alert Configured",
      description: `Alert set for ${metric.label}`,
    })
  }

  const handleExportData = () => {
    toast({
      title: "Exporting Data",
      description: `Exporting data for ${metric.label}...`,
    })
  }

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowModal(true)}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSetAlert}>Set Alert</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportData}>Export Data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold">{metric.value}</div>
            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-1",
                metric.change > 0 ? "text-success" : metric.change < 0 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {Math.abs(metric.change)}%
            </Badge>
          </div>
          <p className={cn("mt-2 text-xs font-medium", statusColors[metric.status])}>Status: {metric.status}</p>
        </CardContent>
      </Card>

      <MetricDetailsModal metric={metric} open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
