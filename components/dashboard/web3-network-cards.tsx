"use client"

import { TrendingUp, TrendingDown, MoreVertical, Activity, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "./status-indicator"
import type { Status } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Web3NetworkModal } from "@/components/modals/web3-network-modal"
import { useToast } from "@/hooks/use-toast"

interface Web3Network {
  id: string
  name: string
  chainId: number
  status: Status
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

interface Web3NetworkCardsProps {
  networks: Web3Network[]
}

const networkLogos: Record<string, string> = {
  Ethereum: "⟠",
  Polygon: "⬡",
}

export function Web3NetworkCards({ networks }: Web3NetworkCardsProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<Web3Network | null>(null)
  const { toast } = useToast()

  const handleViewContracts = (network: Web3Network) => {
    toast({
      title: "View Contracts",
      description: `Opening contracts for ${network.name}...`,
    })
  }

  const handleConfigureAlerts = (network: Web3Network) => {
    toast({
      title: "Configure Alerts",
      description: `Opening alert configuration for ${network.name}...`,
    })
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {networks.map((network) => (
          <Card key={network.id} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                  {networkLogos[network.name] || "⬢"}
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">{network.name}</CardTitle>
                  <StatusIndicator status={network.status} size="sm" />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedNetwork(network)}>View Explorer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewContracts(network)}>View Contracts</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleConfigureAlerts(network)}>Configure Alerts</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Block Number</p>
                  <p className="text-sm font-medium">{network.blockNumber.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Block Time</p>
                  <p className="text-sm font-medium">{network.blockTime}s</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Transactions/sec</p>
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-primary" />
                    <p className="text-sm font-medium">{network.tps} TPS</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Gas Trend</p>
                  <div className="flex items-center gap-1">
                    {network.gasTrend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-destructive" />
                    ) : network.gasTrend === "down" ? (
                      <TrendingDown className="h-3 w-3 text-success" />
                    ) : (
                      <span className="h-3 w-3 text-warning">-</span>
                    )}
                    <p
                      className={cn(
                        "text-sm font-medium",
                        network.gasTrend === "up"
                          ? "text-destructive"
                          : network.gasTrend === "down"
                            ? "text-success"
                            : "text-warning",
                      )}
                    >
                      {network.gasTrend === "up" ? "Rising" : network.gasTrend === "down" ? "Falling" : "Stable"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Gas Prices (Gwei)</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-border/50 bg-accent/20 p-2 text-center">
                    <p className="text-xs text-muted-foreground">Slow</p>
                    <p className="text-sm font-medium">{network.gasPrice.slow.toFixed(1)}</p>
                  </div>
                  <div className="rounded-lg border border-primary/50 bg-primary/10 p-2 text-center">
                    <p className="text-xs text-muted-foreground">Average</p>
                    <p className="text-sm font-medium text-primary">{network.gasPrice.average.toFixed(1)}</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-accent/20 p-2 text-center">
                    <p className="text-xs text-muted-foreground">Fast</p>
                    <p className="text-sm font-medium">{network.gasPrice.fast.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Web3NetworkModal
        network={selectedNetwork}
        open={!!selectedNetwork}
        onOpenChange={(open) => !open && setSelectedNetwork(null)}
      />
    </>
  )
}
