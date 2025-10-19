"use client"

import { Clock, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StatusIndicator } from "./status-indicator"
import type { ActivityItem } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ActivityFeedProps {
  activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Activity Feed</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View All Activity</DropdownMenuItem>
            <DropdownMenuItem>Filter by Type</DropdownMenuItem>
            <DropdownMenuItem>Export Log</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-3">
                {index !== activities.length - 1 && (
                  <div className="absolute left-[11px] top-8 h-full w-px bg-border/50" />
                )}
                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-background bg-card">
                  {activity.status ? (
                    <StatusIndicator status={activity.status} showLabel={false} size="sm" />
                  ) : (
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  {activity.user && <p className="text-xs text-muted-foreground">by {activity.user}</p>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
