"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/dashboard/status-indicator"
import { ChartWidget } from "@/components/dashboard/chart-widget"
import { apiClient } from "@/lib/api-client"
import type { Status, ChartDataPoint } from "@/lib/types"
import { Server, RefreshCw, Settings, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AWSServiceModalProps {
  service: {
    id: string
    name: string
    status: Status
    instances: number
    region: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AWSServiceModal({ service, open, onOpenChange }: AWSServiceModalProps) {
  const { toast } = useToast()
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && service) {
      setLoading(true)
      apiClient
        .getInfrastructure()
        .then((data) => {
          // Transform infrastructure data to chart format
          const transformed = Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
            value: Math.random() * 100, // This would come from real metrics
          }))
          setChartData(transformed)
        })
        .catch((error) => console.error("[v0] Failed to fetch service metrics:", error))
        .finally(() => setLoading(false))
    }
  }, [open, service])

  if (!service) return null

  const handleRefresh = () => {
    toast({
      title: "Refreshing Service",
      description: `Fetching latest data for ${service.name}...`,
    })
  }

  const handleConfigure = () => {
    toast({
      title: "Opening Configuration",
      description: `Opening configuration for ${service.name}...`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>{service.name}</span>
                  <StatusIndicator status={service.status} size="sm" />
                </div>
                <p className="text-sm font-normal text-muted-foreground">AWS Service</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Instances</p>
              <p className="mt-1 text-2xl font-bold">{service.instances}</p>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Region</p>
              <Badge variant="outline" className="mt-1">
                {service.region}
              </Badge>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusIndicator status={service.status} size="sm" className="mt-1" />
            </div>
          </div>

          {/* Performance Chart */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Performance (24h)</h3>
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading chart data...</p>
              </div>
            ) : (
              <ChartWidget title="" data={chartData} type="area" color="hsl(var(--chart-1))" showHeader={false} />
            )}
          </div>

          {/* Recent Events */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Recent Events</h3>
            <div className="space-y-2 rounded-lg border border-border/50 p-3">
              <div className="flex items-center justify-between text-sm">
                <span>Instance i-abc123 started</span>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Auto-scaling triggered</span>
                <span className="text-xs text-muted-foreground">5h ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Health check passed</span>
                <span className="text-xs text-muted-foreground">1d ago</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" className="flex-1 bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleConfigure} variant="outline" className="flex-1 bg-transparent">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <ExternalLink className="mr-2 h-4 w-4" />
              View in AWS
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
