import { AgentBuilder, createTool } from "@iqai/adk"
import { z } from "zod"
import { infrastructureAgent } from "./infrastructure-agent"
import { web3Agent } from "./web3-agent"
import { cicdAgent } from "./cicd-agent"

const delegateToInfrastructureTool = createTool({
  name: "delegate_to_infrastructure",
  description: "Delegate infrastructure monitoring tasks to the Infrastructure Agent",
  schema: z.object({
    query: z.string(),
  }),
  fn: async ({ query }) => {
    const agent = await infrastructureAgent
    return await agent.runner.ask(query)
  },
})

const delegateToWeb3Tool = createTool({
  name: "delegate_to_web3",
  description: "Delegate Web3 monitoring tasks to the Web3 Agent",
  schema: z.object({
    query: z.string(),
  }),
  fn: async ({ query }) => {
    const agent = await web3Agent
    return await agent.runner.ask(query)
  },
})

const delegateToCicdTool = createTool({
  name: "delegate_to_cicd",
  description: "Delegate CI/CD monitoring tasks to the CICD Agent",
  schema: z.object({
    query: z.string(),
  }),
  fn: async ({ query }) => {
    const agent = await cicdAgent
    return await agent.runner.ask(query)
  },
})

const generateComprehensiveReportTool = createTool({
  name: "generate_comprehensive_report",
  description: "Generate a comprehensive DevOps health report across all systems",
  schema: z.object({}),
  fn: async () => {
    const [infraAgent, web3AgentBuilt, cicdAgentBuilt] = await Promise.all([
      infrastructureAgent,
      web3Agent,
      cicdAgent,
    ])

    const [infraHealth, web3Health, cicdHealth] = await Promise.all([
      infraAgent.runner.ask("Analyze current infrastructure health"),
      web3AgentBuilt.runner.ask("Analyze Web3 network status"),
      cicdAgentBuilt.runner.ask("Analyze CI/CD pipeline health"),
    ])

    return {
      timestamp: new Date().toISOString(),
      infrastructure: infraHealth,
      web3: web3Health,
      cicd: cicdHealth,
      overallStatus: "healthy",
    }
  },
})

export const orchestratorAgent = AgentBuilder.create("SmartOpsOrchestratorAgent")
  .withDescription("Orchestrates multiple specialized agents to provide comprehensive DevOps monitoring and insights")
  .withModel("openai/gpt-4o")
  .withTools(delegateToInfrastructureTool, delegateToWeb3Tool, delegateToCicdTool, generateComprehensiveReportTool)
  .build()
