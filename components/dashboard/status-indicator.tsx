import { cn } from "@/lib/utils"
import type { Status } from "@/lib/types"

interface StatusIndicatorProps {
  status: Status
  label?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function StatusIndicator({ status, label, showLabel = true, size = "md" }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  const statusConfig = {
    healthy: { color: "bg-success", label: "Healthy" },
    warning: { color: "bg-warning", label: "Warning" },
    critical: { color: "bg-destructive", label: "Critical" },
    offline: { color: "bg-muted-foreground", label: "Offline" },
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-2">
      <div className={cn("rounded-full animate-pulse", sizeClasses[size], config.color)} />
      {showLabel && <span className="text-sm font-medium">{label || config.label}</span>}
    </div>
  )
}
