"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { MetricsCard } from "@/components/dashboard/metrics-card"
import { ChartWidget } from "@/components/dashboard/chart-widget"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { Web3NetworkCards } from "@/components/dashboard/web3-network-cards"
import { useWebSocket } from "@/hooks/use-websocket"
import { useApiClient } from "@/hooks/use-api-client"
import type { Web3Network } from "@/lib/types"

export default function Web3Page() {
  const [networks, setNetworks] = useState<Web3Network[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const apiClient = useApiClient()
  const { subscribe } = useWebSocket({ autoConnect: true })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const networksData = await apiClient.getWeb3Networks()
        setNetworks(networksData)

        // Generate chart data
        const now = Date.now()
        const generatedChartData = Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(now - (23 - i) * 3600000).toISOString(),
          value: Math.random() * 100,
        }))
        setChartData(generatedChartData)
      } catch (error) {
        console.error("[v0] Error fetching Web3 data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const unsubscribe = subscribe("web3-networks", (data) => {
      setNetworks(data)
    })

    return () => unsubscribe()
  }, [subscribe])

  const metrics =
    networks.length > 0
      ? [
          {
            id: "1",
            label: "Active Networks",
            value: networks.length,
            change: 0,
            trend: "stable" as const,
            status: "healthy" as const,
          },
          {
            id: "2",
            label: "Avg Gas Price",
            value: `${Math.round(networks.reduce((acc, n) => acc + n.gasPrice.average, 0) / networks.length)} Gwei`,
            change: -5.2,
            trend: "down" as const,
            status: "healthy" as const,
          },
          {
            id: "3",
            label: "Total TPS",
            value: Math.round(networks.reduce((acc, n) => acc + n.tps, 0)),
            change: 8.3,
            trend: "up" as const,
            status: "healthy" as const,
          },
          {
            id: "4",
            label: "Latest Block",
            value: Math.max(...networks.map((n) => n.blockNumber)),
            change: 0,
            trend: "stable" as const,
            status: "healthy" as const,
          },
        ]
      : []

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading Web3 data...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Web3 Networks</h1>
            <p className="text-muted-foreground">Monitor blockchain networks and smart contracts</p>
          </div>
          <FilterBar />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricsCard key={metric.id} metric={metric} />
          ))}
        </div>

        <Web3NetworkCards networks={networks} />

        <div className="grid gap-4 md:grid-cols-2">
          <ChartWidget title="Gas Price Trends" data={chartData} type="area" color="hsl(var(--chart-5))" />
          <ChartWidget title="Transaction Volume" data={chartData} type="line" color="hsl(var(--chart-1))" />
        </div>
      </div>
    </MainLayout>
  )
}
