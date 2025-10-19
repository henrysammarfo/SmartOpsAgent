"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartWidget } from "@/components/dashboard/chart-widget"
import { apiClient } from "@/lib/api-client"
import type { Metric, ChartDataPoint } from "@/lib/types"
import { TrendingUp, TrendingDown, Minus, Download, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricDetailsModalProps {
  metric: Metric | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MetricDetailsModal({ metric, open, onOpenChange }: MetricDetailsModalProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && metric) {
      setLoading(true)
      apiClient
        .getMetrics()
        .then((data) => {
          // Transform metrics data to chart format
          const transformed = data.map((m, i) => ({
            timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
            value: Number.parseFloat(m.value) || 0,
          }))
          setChartData(transformed)
        })
        .catch((error) => console.error("[v0] Failed to fetch metric history:", error))
        .finally(() => setLoading(false))
    }
  }, [open, metric])

  if (!metric) return null

  const TrendIcon = metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Minus

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{metric.label} Details</span>
            <Badge
              variant="outline"
              className={cn(
                metric.status === "healthy" && "text-success",
                metric.status === "warning" && "text-warning",
                metric.status === "critical" && "text-destructive",
              )}
            >
              {metric.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Value */}
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-accent/20 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-3xl font-bold">{metric.value}</p>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-1",
                metric.change > 0 ? "text-success" : metric.change < 0 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <TrendIcon className="h-4 w-4" />
              {Math.abs(metric.change)}%
            </Badge>
          </div>

          {/* Historical Chart */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Historical Data (24h)</h3>
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading chart data...</p>
              </div>
            ) : (
              <ChartWidget title="" data={chartData} type="area" color="hsl(var(--chart-1))" showHeader={false} />
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-lg font-semibold">
                {chartData.length > 0
                  ? (chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(1)
                  : "N/A"}
              </p>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Peak</p>
              <p className="text-lg font-semibold">
                {chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)).toFixed(1) : "N/A"}
              </p>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Low</p>
              <p className="text-lg font-semibold">
                {chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)).toFixed(1) : "N/A"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Bell className="mr-2 h-4 w-4" />
              Set Alert
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
