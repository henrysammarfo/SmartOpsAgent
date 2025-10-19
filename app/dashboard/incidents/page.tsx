"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { apiClient } from "@/lib/api-client"
import type { Alert } from "@/lib/types"

export default function IncidentsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await apiClient.getAlerts()
        setAlerts(data)
      } catch (error) {
        console.error("[v0] Failed to fetch alerts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
            <p className="text-muted-foreground">Track and manage system incidents and alerts</p>
          </div>
          <FilterBar />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Loading alerts...</p>
          </div>
        ) : (
          <AlertsPanel alerts={alerts} />
        )}
      </div>
    </MainLayout>
  )
}
