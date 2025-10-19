import { AgentBuilder } from "@pontus-devoteam/adk"
import { z } from "zod"
import { infrastructureAgent } from "./infrastructure-agent"
import { web3Agent } from "./web3-agent"
import { cicdAgent } from "./cicd-agent"

export const orchestratorAgent = new AgentBuilder()
  .withName("SmartOpsOrchestratorAgent")
  .withDescription("Orchestrates multiple specialized agents to provide comprehensive DevOps monitoring and insights")
  .withModel("openai/gpt-4o")
  .withTools([
    {
      name: "delegate_to_infrastructure",
      description: "Delegate infrastructure monitoring tasks to the Infrastructure Agent",
      inputSchema: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => {
        return await infrastructureAgent.run(query)
      },
    },
    {
      name: "delegate_to_web3",
      description: "Delegate Web3 monitoring tasks to the Web3 Agent",
      inputSchema: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => {
        return await web3Agent.run(query)
      },
    },
    {
      name: "delegate_to_cicd",
      description: "Delegate CI/CD monitoring tasks to the CICD Agent",
      inputSchema: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => {
        return await cicdAgent.run(query)
      },
    },
    {
      name: "generate_comprehensive_report",
      description: "Generate a comprehensive DevOps health report across all systems",
      inputSchema: z.object({}),
      execute: async () => {
        const [infraHealth, web3Health, cicdHealth] = await Promise.all([
          infrastructureAgent.run("Analyze current infrastructure health"),
          web3Agent.run("Analyze Web3 network status"),
          cicdAgent.run("Analyze CI/CD pipeline health"),
        ])

        return {
          timestamp: new Date().toISOString(),
          infrastructure: infraHealth,
          web3: web3Health,
          cicd: cicdHealth,
          overallStatus: "healthy",
        }
      },
    },
  ])
  .build()
