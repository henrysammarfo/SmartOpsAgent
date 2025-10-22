"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { MetricsCard } from "@/components/dashboard/metrics-card"
import { ChartWidget } from "@/components/dashboard/chart-widget"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { AWSServiceGrid } from "@/components/dashboard/aws-service-grid"
import { useWebSocket } from "@/hooks/use-websocket"
import { useApiClient } from "@/hooks/use-api-client"
import type { Metric, AWSService } from "@/lib/types"

export default function InfrastructurePage() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [awsServices, setAwsServices] = useState<AWSService[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const apiClient = useApiClient()
  const { subscribe } = useWebSocket({ autoConnect: true })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [metricsData, servicesData] = await Promise.all([
          apiClient.getInfrastructureMetrics(),
          apiClient.getInfrastructureServices(),
        ])

        setMetrics(metricsData)
        setAwsServices(servicesData)

        // Generate chart data
        const now = Date.now()
        const generatedChartData = Array.from({ length: 24 }, (_, i) => ({
          time: new Date(now - (23 - i) * 3600000).toISOString(),
          value: Math.random() * 100,
        }))
        setChartData(generatedChartData)
      } catch (error) {
        console.error("[v0] Error fetching infrastructure data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const unsubscribeMetrics = subscribe("metrics", (data) => {
      setMetrics(data)
    })

    const unsubscribeServices = subscribe("aws-services", (data) => {
      setAwsServices(data)
    })

    return () => {
      unsubscribeMetrics()
      unsubscribeServices()
    }
  }, [subscribe])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading infrastructure data...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Infrastructure</h1>
            <p className="text-muted-foreground">Monitor your cloud infrastructure and resources</p>
          </div>
          <FilterBar />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <MetricsCard key={metric.id} metric={metric} />
          ))}
        </div>

        <AWSServiceGrid services={awsServices} />

        <div className="grid gap-4 md:grid-cols-2">
          <ChartWidget title="CPU Usage Over Time" data={chartData} type="area" color="hsl(var(--chart-1))" />
          <ChartWidget title="Memory Usage Over Time" data={chartData} type="area" color="hsl(var(--chart-2))" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ChartWidget title="Network Traffic" data={chartData} type="line" color="hsl(var(--chart-3))" />
          <ChartWidget title="Disk I/O" data={chartData} type="line" color="hsl(var(--chart-4))" />
        </div>
      </div>
    </MainLayout>
  )
}
