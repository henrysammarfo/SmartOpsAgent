import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch"
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2"
import { RDSClient, DescribeDBInstancesCommand } from "@aws-sdk/client-rds"
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3"
import { LambdaClient, ListFunctionsCommand } from "@aws-sdk/client-lambda"
import { config } from "../config"
import type { AWSService, Metric } from "../types"

export class AWSMonitoringService {
  private cloudwatch: CloudWatchClient | null = null
  private ec2: EC2Client | null = null
  private rds: RDSClient | null = null
  private s3: S3Client | null = null
  private lambda: LambdaClient | null = null
  private enabled: boolean

  constructor() {
    this.enabled = config.aws.enabled && !!config.aws.accessKeyId && !!config.aws.secretAccessKey

    if (this.enabled) {
      const awsConfig = {
        region: config.aws.region,
        credentials: {
          accessKeyId: config.aws.accessKeyId,
          secretAccessKey: config.aws.secretAccessKey,
        },
      }

      this.cloudwatch = new CloudWatchClient(awsConfig)
      this.ec2 = new EC2Client(awsConfig)
      this.rds = new RDSClient(awsConfig)
      this.s3 = new S3Client(awsConfig)
      this.lambda = new LambdaClient(awsConfig)
    }
  }

  private getMockService(id: string, name: string): AWSService {
    return {
      id,
      name,
      status: "healthy",
      region: "mock",
      instances: Math.floor(Math.random() * 10) + 1,
      metadata: {
        note: "AWS not configured - showing mock data",
      },
    }
  }

  async getEC2Metrics(): Promise<AWSService> {
    if (!this.enabled || !this.ec2) {
      return this.getMockService("ec2", "EC2")
    }

    try {
      const command = new DescribeInstancesCommand({})
      const response = await this.ec2.send(command)

      const instances = response.Reservations?.flatMap((r) => r.Instances || []) || []
      const runningInstances = instances.filter((i) => i.State?.Name === "running")

      return {
        id: "ec2",
        name: "EC2",
        status: runningInstances.length > 0 ? "healthy" : "warning",
        region: config.aws.region,
        instances: runningInstances.length,
        metadata: {
          total: instances.length,
          running: runningInstances.length,
        },
      }
    } catch (error) {
      console.error("Error fetching EC2 metrics:", error)
      return {
        id: "ec2",
        name: "EC2",
        status: "offline",
        region: config.aws.region,
        instances: 0,
      }
    }
  }

  async getRDSMetrics(): Promise<AWSService> {
    if (!this.enabled || !this.rds) {
      return this.getMockService("rds", "RDS")
    }

    try {
      const command = new DescribeDBInstancesCommand({})
      const response = await this.rds.send(command)

      const instances = response.DBInstances || []
      const availableInstances = instances.filter((i) => i.DBInstanceStatus === "available")

      return {
        id: "rds",
        name: "RDS",
        status: availableInstances.length > 0 ? "healthy" : "warning",
        region: config.aws.region,
        instances: availableInstances.length,
        metadata: {
          total: instances.length,
          available: availableInstances.length,
        },
      }
    } catch (error) {
      console.error("Error fetching RDS metrics:", error)
      return {
        id: "rds",
        name: "RDS",
        status: "offline",
        region: config.aws.region,
        instances: 0,
      }
    }
  }

  async getS3Metrics(): Promise<AWSService> {
    if (!this.enabled || !this.s3) {
      return this.getMockService("s3", "S3")
    }

    try {
      const command = new ListBucketsCommand({})
      const response = await this.s3.send(command)

      const buckets = response.Buckets || []

      return {
        id: "s3",
        name: "S3",
        status: "healthy",
        region: config.aws.region,
        instances: buckets.length,
        metadata: {
          buckets: buckets.length,
        },
      }
    } catch (error) {
      console.error("Error fetching S3 metrics:", error)
      return {
        id: "s3",
        name: "S3",
        status: "offline",
        region: config.aws.region,
        instances: 0,
      }
    }
  }

  async getLambdaMetrics(): Promise<AWSService> {
    if (!this.enabled || !this.lambda) {
      return this.getMockService("lambda", "Lambda")
    }

    try {
      const command = new ListFunctionsCommand({})
      const response = await this.lambda.send(command)

      const functions = response.Functions || []

      return {
        id: "lambda",
        name: "Lambda",
        status: "healthy",
        region: config.aws.region,
        instances: functions.length,
        metadata: {
          functions: functions.length,
        },
      }
    } catch (error) {
      console.error("Error fetching Lambda metrics:", error)
      return {
        id: "lambda",
        name: "Lambda",
        status: "offline",
        region: config.aws.region,
        instances: 0,
      }
    }
  }

  async getCloudWatchMetrics(): Promise<Metric[]> {
    if (!this.enabled || !this.cloudwatch) {
      return [
        {
          id: "cpu",
          name: "CPU Usage",
          value: Math.random() * 100,
          unit: "%",
          status: "healthy",
          trend: "stable",
          timestamp: new Date().toISOString(),
        },
      ]
    }

    try {
      const endTime = new Date()
      const startTime = new Date(endTime.getTime() - 3600000) // 1 hour ago

      // Get CPU utilization
      const cpuCommand = new GetMetricStatisticsCommand({
        Namespace: "AWS/EC2",
        MetricName: "CPUUtilization",
        StartTime: startTime,
        EndTime: endTime,
        Period: 300,
        Statistics: ["Average"],
      })

      const cpuResponse = await this.cloudwatch.send(cpuCommand)
      const cpuDatapoints = cpuResponse.Datapoints || []
      const latestCpu = cpuDatapoints[cpuDatapoints.length - 1]

      const cpuValue = latestCpu?.Average || 0
      const cpuStatus = cpuValue > 80 ? "critical" : cpuValue > 60 ? "warning" : "healthy"

      return [
        {
          id: "cpu",
          name: "CPU Usage",
          value: cpuValue,
          unit: "%",
          status: cpuStatus,
          trend: "stable",
          timestamp: new Date().toISOString(),
        },
      ]
    } catch (error) {
      console.error("Error fetching CloudWatch metrics:", error)
      return []
    }
  }

  async getAllServices(): Promise<AWSService[]> {
    const [ec2, rds, s3, lambda] = await Promise.all([
      this.getEC2Metrics(),
      this.getRDSMetrics(),
      this.getS3Metrics(),
      this.getLambdaMetrics(),
    ])

    return [ec2, rds, s3, lambda]
  }
}
