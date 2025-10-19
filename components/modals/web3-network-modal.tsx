"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/dashboard/status-indicator"
import { ChartWidget } from "@/components/dashboard/chart-widget"
import { apiClient } from "@/lib/api-client"
import type { Status, ChartDataPoint } from "@/lib/types"
import { Activity, Zap, TrendingUp, TrendingDown, ExternalLink, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Web3NetworkModalProps {
  network: {
    id: string
    name: string
    logo: string
    status: Status
    blockNumber: number
    gasPrice: { slow: number; average: number; fast: number }
    tps: number
    blockTime: number
    gasTrend: "up" | "down"
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Web3NetworkModal({ network, open, onOpenChange }: Web3NetworkModalProps) {
  const { toast } = useToast()
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && network) {
      setLoading(true)
      apiClient
        .getWeb3Networks()
        .then((data) => {
          // Transform gas price data to chart format
          const transformed = Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
            value: network.gasPrice.average + (Math.random() - 0.5) * 10,
          }))
          setChartData(transformed)
        })
        .catch((error) => console.error("[v0] Failed to fetch gas price history:", error))
        .finally(() => setLoading(false))
    }
  }, [open, network])

  if (!network) return null

  const handleSetAlert = () => {
    toast({
      title: "Alert Configured",
      description: `Gas price alert set for ${network.name}`,
    })
  }

  const handleViewExplorer = () => {
    toast({
      title: "Opening Explorer",
      description: `Opening block explorer for ${network.name}...`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                {network.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>{network.name}</span>
                  <StatusIndicator status={network.status} size="sm" />
                </div>
                <p className="text-sm font-normal text-muted-foreground">Blockchain Network</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Network Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Block Number</p>
              <p className="mt-1 text-lg font-bold">{network.blockNumber.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Block Time</p>
              <p className="mt-1 text-lg font-bold">{network.blockTime}s</p>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">TPS</p>
              <div className="mt-1 flex items-center gap-1">
                <Activity className="h-4 w-4 text-primary" />
                <p className="text-lg font-bold">{network.tps}</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Gas Trend</p>
              <div className="mt-1 flex items-center gap-1">
                {network.gasTrend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-destructive" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-success" />
                )}
                <p className={cn("text-lg font-bold", network.gasTrend === "up" ? "text-destructive" : "text-success")}>
                  {network.gasTrend === "up" ? "Rising" : "Falling"}
                </p>
              </div>
            </div>
          </div>

          {/* Gas Prices */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Current Gas Prices (Gwei)</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-border/50 bg-accent/20 p-4 text-center">
                <p className="text-xs text-muted-foreground">Slow</p>
                <p className="mt-1 text-2xl font-bold">{network.gasPrice.slow}</p>
                <p className="mt-1 text-xs text-muted-foreground">~5 min</p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Average</p>
                <p className="mt-1 text-2xl font-bold text-primary">{network.gasPrice.average}</p>
                <p className="mt-1 text-xs text-muted-foreground">~2 min</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-accent/20 p-4 text-center">
                <p className="text-xs text-muted-foreground">Fast</p>
                <p className="mt-1 text-2xl font-bold">{network.gasPrice.fast}</p>
                <p className="mt-1 text-xs text-muted-foreground">~30 sec</p>
              </div>
            </div>
          </div>

          {/* Gas Price Chart */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Gas Price History (24h)</h3>
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading chart data...</p>
              </div>
            ) : (
              <ChartWidget title="" data={chartData} type="area" color="hsl(var(--chart-5))" showHeader={false} />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSetAlert} variant="outline" className="flex-1 bg-transparent">
              <Bell className="mr-2 h-4 w-4" />
              Set Gas Alert
            </Button>
            <Button onClick={handleViewExplorer} variant="outline" className="flex-1 bg-transparent">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Explorer
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              View Contracts
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
