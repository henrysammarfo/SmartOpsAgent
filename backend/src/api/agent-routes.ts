import { Router } from "express"
import { orchestratorAgent } from "../agents/orchestrator-agent"
import { infrastructureAgent } from "../agents/infrastructure-agent"
import { web3Agent } from "../agents/web3-agent"
import { cicdAgent } from "../agents/cicd-agent"

const router = Router()

// Orchestrator endpoint - handles complex queries
router.post("/agent/query", async (req, res) => {
  try {
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ error: "Query is required" })
    }

    const agent = await orchestratorAgent
    const response = await agent.runner.ask(query)
    res.json({ response })
  } catch (error) {
    console.error("Agent query error:", error)
    res.status(500).json({ error: "Failed to process query" })
  }
})

// Specialized agent endpoints
router.post("/agent/infrastructure", async (req, res) => {
  try {
    const { query } = req.body
    const agent = await infrastructureAgent
    const response = await agent.runner.ask(query || "Get current infrastructure status")
    res.json({ response })
  } catch (error) {
    console.error("Infrastructure agent error:", error)
    res.status(500).json({ error: "Failed to query infrastructure agent" })
  }
})

router.post("/agent/web3", async (req, res) => {
  try {
    const { query } = req.body
    const agent = await web3Agent
    const response = await agent.runner.ask(query || "Get current Web3 network status")
    res.json({ response })
  } catch (error) {
    console.error("Web3 agent error:", error)
    res.status(500).json({ error: "Failed to query Web3 agent" })
  }
})

router.post("/agent/cicd", async (req, res) => {
  try {
    const { query } = req.body
    const agent = await cicdAgent
    const response = await agent.runner.ask(query || "Get current CI/CD pipeline status")
    res.json({ response })
  } catch (error) {
    console.error("CICD agent error:", error)
    res.status(500).json({ error: "Failed to query CICD agent" })
  }
})

export default router
