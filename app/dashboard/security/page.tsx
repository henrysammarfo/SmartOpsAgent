"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { MetricsCard } from "@/components/dashboard/metrics-card"
import { FilterBar } from "@/components/dashboard/filter-bar"
import type { Metric } from "@/lib/types"

const securityMetrics: Metric[] = [
  {
    id: "1",
    label: "Vulnerabilities",
    value: 3,
    change: -25,
    trend: "down",
    status: "warning",
  },
  {
    id: "2",
    label: "Security Score",
    value: "A+",
    change: 5,
    trend: "up",
    status: "healthy",
  },
  {
    id: "3",
    label: "Last Scan",
    value: "2h ago",
    change: 0,
    trend: "stable",
    status: "healthy",
  },
  {
    id: "4",
    label: "Compliance",
    value: "98%",
    change: 2,
    trend: "up",
    status: "healthy",
  },
]

export default function SecurityPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security</h1>
            <p className="text-muted-foreground">Monitor security vulnerabilities and compliance status</p>
          </div>
          <FilterBar />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {securityMetrics.map((metric) => (
            <MetricsCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
