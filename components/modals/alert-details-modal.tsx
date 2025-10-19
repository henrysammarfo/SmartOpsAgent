"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Alert } from "@/lib/types"
import { AlertCircle, AlertTriangle, Info, XCircle, Check, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface AlertDetailsModalProps {
  alert: Alert | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlertDetailsModal({ alert, open, onOpenChange }: AlertDetailsModalProps) {
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  if (!alert) return null

  const severityConfig = {
    info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
    warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    error: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
    critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  }

  const config = severityConfig[alert.severity]
  const Icon = config.icon

  const handleAcknowledge = () => {
    toast({
      title: "Alert Acknowledged",
      description: `Alert "${alert.title}" has been acknowledged.`,
    })
    onOpenChange(false)
  }

  const handleDismiss = () => {
    toast({
      title: "Alert Dismissed",
      description: `Alert "${alert.title}" has been dismissed.`,
      variant: "destructive",
    })
    onOpenChange(false)
  }

  const handleCreateIncident = () => {
    toast({
      title: "Incident Created",
      description: "A new incident has been created from this alert.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bg)}>
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>{alert.title}</span>
                <Badge variant="outline">{alert.severity}</Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Info */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Message</Label>
              <p className="mt-1 text-sm">{alert.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Source</Label>
                <p className="mt-1 text-sm font-medium">{alert.source}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Time</Label>
                <p className="mt-1 text-sm font-medium">
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Badge variant="outline" className="mt-1">
                {alert.acknowledged ? "Acknowledged" : "Active"}
              </Badge>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Add Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or comments about this alert..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!alert.acknowledged && (
              <Button onClick={handleAcknowledge} className="flex-1">
                <Check className="mr-2 h-4 w-4" />
                Acknowledge
              </Button>
            )}
            <Button onClick={handleCreateIncident} variant="outline" className="flex-1 bg-transparent">
              <FileText className="mr-2 h-4 w-4" />
              Create Incident
            </Button>
            <Button onClick={handleDismiss} variant="destructive" className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
