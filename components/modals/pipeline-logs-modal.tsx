"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Download, Play, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

interface PipelineLogsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pipelineId: string
}

export function PipelineLogsModal({ open, onOpenChange, pipelineId }: PipelineLogsModalProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && pipelineId) {
      const fetchLogs = async () => {
        try {
          setLoading(true)
          const logsData = await apiClient.getWorkflowLogs(pipelineId)
          setLogs(logsData)
        } catch (error) {
          console.error("[v0] Error fetching logs:", error)
          toast({
            title: "Error",
            description: "Failed to fetch pipeline logs",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
      fetchLogs()
    }
  }, [open, pipelineId, toast])

  const handleRerun = () => {
    toast({
      title: "Pipeline Restarted",
      description: "The pipeline has been queued for re-execution.",
    })
    onOpenChange(false)
  }

  const handleDownload = () => {
    const blob = new Blob([logs.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pipeline-${pipelineId}-logs.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Logs Downloaded",
      description: "Pipeline logs have been downloaded.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <div className="flex items-center gap-2">
                  <span>Pipeline Logs</span>
                  <Badge variant="outline">ID: {pipelineId}</Badge>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-lg border border-border/50 bg-black/20 p-4">
              <div className="space-y-1 font-mono text-xs">
                {logs.map((log, index) => (
                  <div key={index} className="text-foreground">
                    {log}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex gap-2">
            <Button onClick={handleRerun} variant="outline" className="flex-1 bg-transparent">
              <Play className="mr-2 h-4 w-4" />
              Re-run Pipeline
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1 bg-transparent" disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              Download Logs
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
