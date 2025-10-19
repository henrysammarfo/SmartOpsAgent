"use client"

import { Server, Database, HardDrive, Zap, Cloud, Lock, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "./status-indicator"
import type { Status } from "@/lib/types"
import { useState } from "react"
import { AWSServiceModal } from "@/components/modals/aws-service-modal"
import { useToast } from "@/hooks/use-toast"

interface AWSService {
  id: string
  name: string
  icon: typeof Server
  status: Status
  instances?: number
  region: string
  metadata?: Record<string, any>
}

interface AWSServiceGridProps {
  services: AWSService[]
}

const iconMap: Record<string, typeof Server> = {
  EC2: Server,
  RDS: Database,
  S3: HardDrive,
  Lambda: Zap,
  CloudFront: Cloud,
  IAM: Lock,
}

export function AWSServiceGrid({ services }: AWSServiceGridProps) {
  const [selectedService, setSelectedService] = useState<AWSService | null>(null)
  const { toast } = useToast()

  const handleAddService = () => {
    toast({
      title: "Add Service",
      description: "Opening service configuration...",
    })
  }

  const handleConfigureRegions = () => {
    toast({
      title: "Configure Regions",
      description: "Opening region configuration...",
    })
  }

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold">AWS Service Status</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View All Services</DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddService}>Add Service</DropdownMenuItem>
              <DropdownMenuItem onClick={handleConfigureRegions}>Configure Regions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = iconMap[service.name] || Server
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{service.name}</p>
                      <StatusIndicator status={service.status} showLabel={false} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{service.instances || 0} instances</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {service.region}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <AWSServiceModal
        service={selectedService}
        open={!!selectedService}
        onOpenChange={(open) => !open && setSelectedService(null)}
      />
    </>
  )
}
