"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { DeploymentList } from "@/components/dashboard/deployment-list"
import { ChartWidget } from "@/components/dashboard/chart-widget"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { PipelineVisualization } from "@/components/dashboard/pipeline-visualization"
import { useWebSocket } from "@/hooks/use-websocket"
import { useApiClient } from "@/hooks/use-api-client"
import type { Deployment, Pipeline } from "@/lib/types"

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [pipeline, setPipeline] = useState<Pipeline | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const apiClient = useApiClient()
  const { subscribe } = useWebSocket({ autoConnect: true })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [deploymentsData, pipelineData] = await Promise.all([apiClient.getDeployments(), apiClient.getPipeline()])

        setDeployments(deploymentsData)
        setPipeline(pipelineData)

        // Generate chart data
        const now = Date.now()
        const generatedChartData = Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(now - (23 - i) * 3600000).toISOString(),
          value: Math.random() * 100,
        }))
        setChartData(generatedChartData)
      } catch (error) {
        console.error("[v0] Error fetching deployment data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const unsubscribeDeployments = subscribe("deployments", (data) => {
      setDeployments(data)
    })

    const unsubscribePipeline = subscribe("pipeline", (data) => {
      setPipeline(data)
    })

    return () => {
      unsubscribeDeployments()
      unsubscribePipeline()
    }
  }, [subscribe])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading deployment data...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
            <p className="text-muted-foreground">Track your CI/CD pipeline and deployment history</p>
          </div>
          <FilterBar />
        </div>

        {pipeline && <PipelineVisualization pipeline={pipeline} />}

        <div className="grid gap-4 md:grid-cols-2">
          <ChartWidget title="Deployment Frequency" data={chartData} type="area" color="hsl(var(--chart-1))" />
          <ChartWidget title="Deployment Duration" data={chartData} type="line" color="hsl(var(--chart-2))" />
        </div>

        <DeploymentList deployments={deployments} />
      </div>
    </MainLayout>
  )
}
