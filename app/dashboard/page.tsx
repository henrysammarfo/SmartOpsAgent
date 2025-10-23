"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { MetricsCard } from "@/components/dashboard/metrics-card"
import { ChartWidget } from "@/components/dashboard/chart-widget"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { DeploymentList } from "@/components/dashboard/deployment-list"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { useWebSocket } from "@/hooks/use-websocket"
import { useApiClient } from "@/hooks/use-api-client"
import type { Metric, Alert, ActivityItem, Deployment } from "@/lib/types"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const apiClient = useApiClient()
  const { subscribe } = useWebSocket({ autoConnect: true })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [metricsData, deploymentsData, metricHistory] = await Promise.all([
          apiClient.getInfrastructureMetrics(),
          apiClient.getDeployments(),
          apiClient.getMetricHistory(),
        ])

        setMetrics(metricsData)
        setDeployments(deploymentsData.slice(0, 5))

        // Use REAL metric history data from API
        setChartData(metricHistory || [])
      } catch (error) {
        console.error("[v0] Error fetching dashboard data:", error)
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

    const unsubscribeAlerts = subscribe("alerts", (data) => {
      setAlerts(data)
    })

    const unsubscribeActivity = subscribe("activity", (data) => {
      setActivity(data)
    })

    const unsubscribeDeployments = subscribe("deployments", (data) => {
      setDeployments(data.slice(0, 5))
    })

    return () => {
      unsubscribeMetrics()
      unsubscribeAlerts()
      unsubscribeActivity()
      unsubscribeDeployments()
    }
  }, [subscribe])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring and insights for your infrastructure</p>
          </div>
          <FilterBar />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <MetricsCard key={metric.id} metric={metric} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ChartWidget title="Request Volume" data={chartData} type="area" color="hsl(var(--chart-1))" />
          <ChartWidget title="Response Time" data={chartData} type="line" color="hsl(var(--chart-2))" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AlertsPanel alerts={alerts} />
          <ActivityFeed activities={activity} />
        </div>

        <DeploymentList deployments={deployments} />
      </div>
    </MainLayout>
  )
}
