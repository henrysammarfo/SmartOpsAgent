import express from "express"
import cors from "cors"
import { createServer } from "http"
import { config } from "./config"
import routes from "./api/routes"
import agentRoutes from "./api/agent-routes"
import { WebSocketService } from "./services/websocket-service"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api", routes)
app.use("/api", agentRoutes)

// Create HTTP server
const server = createServer(app)

// Start HTTP server
server.listen(config.port, () => {
  console.log(`API server running on port ${config.port}`)
})

// Attach WebSocket to the same HTTP server
const wsService = new WebSocketService(config.port, server)

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing servers...")
  wsService.close()
  process.exit(0)
})
