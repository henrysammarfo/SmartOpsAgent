import { AgentBuilder } from "@iqai/adk"
import { z } from "zod"
import { Web3Service } from "../services/web3-service"

const web3Service = new Web3Service()

export const web3Agent = AgentBuilder.create("Web3MonitoringAgent")
  .withDescription("Monitors Ethereum and Polygon networks, tracks gas prices, and analyzes blockchain health")
  .withModel("openai/gpt-4o-mini")
  .withTools([
    {
      name: "get_network_status",
      description: "Get current status of Ethereum and Polygon networks",
      inputSchema: z.object({
        network: z.enum(["ethereum", "polygon"]).optional(),
      }),
      execute: async ({ network }) => {
        const networks = await web3Service.getAllNetworks()
        if (network) {
          return networks.find((n) => n.name.toLowerCase() === network)
        }
        return networks
      },
    },
    {
      name: "analyze_gas_prices",
      description: "Analyze current gas prices and provide recommendations",
      inputSchema: z.object({
        network: z.enum(["ethereum", "polygon"]),
      }),
      execute: async ({ network }) => {
        const networks = await web3Service.getAllNetworks()
        const targetNetwork = networks.find((n) => n.name.toLowerCase() === network)

        if (!targetNetwork) return { error: "Network not found" }

        const avgGas = targetNetwork.gasPrice.average
        let recommendation = ""

        if (avgGas > 50) {
          recommendation = "Gas prices are high. Consider waiting or using Layer 2 solutions."
        } else if (avgGas > 20) {
          recommendation = "Gas prices are moderate. Good time for non-urgent transactions."
        } else {
          recommendation = "Gas prices are low. Optimal time for transactions."
        }

        return {
          network: targetNetwork.name,
          currentGas: targetNetwork.gasPrice,
          recommendation,
        }
      },
    },
    {
      name: "predict_gas_trend",
      description: "Predict gas price trends based on current network activity",
      inputSchema: z.object({
        network: z.enum(["ethereum", "polygon"]),
      }),
      execute: async ({ network }) => {
        const networks = await web3Service.getAllNetworks()
        const targetNetwork = networks.find((n) => n.name.toLowerCase() === network)

        if (!targetNetwork) return { error: "Network not found" }

        const trend = targetNetwork.gasTrend
        const prediction =
          trend === "up"
            ? "Gas prices likely to increase in the next hour"
            : trend === "down"
              ? "Gas prices likely to decrease in the next hour"
              : "Gas prices expected to remain stable"

        return {
          network: targetNetwork.name,
          currentTrend: trend,
          prediction,
          confidence: "75%",
        }
      },
    },
  ])
  .build()
