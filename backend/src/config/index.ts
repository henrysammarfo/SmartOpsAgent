import dotenv from "dotenv"

dotenv.config()

export const config = {
  port: Number.parseInt(process.env.PORT || "3001", 10),
  wsPort: Number.parseInt(process.env.WS_PORT || "3002", 10),

  supabase: {
    url: process.env.SUPABASE_SUPABASE_URL || "",
    serviceRoleKey: process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY || "",
    anonKey: process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },

  // Vercel Configuration (replaces AWS)
  vercel: {
    token: process.env.VERCEL_TOKEN || "",
    teamId: process.env.VERCEL_TEAM_ID || "",
  },

  // GitHub Configuration (fallback for demo)
  github: {
    token: process.env.GITHUB_TOKEN || "",
    owner: process.env.GITHUB_OWNER || "",
    repo: process.env.GITHUB_REPO || "",
  },

  // Web3 Configuration (fallback for demo)
  web3: {
    ethereumRpc: process.env.ETHEREUM_RPC_URL || "",
    polygonRpc: process.env.POLYGON_RPC_URL || "",
  },

  // AI Configuration
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.AI_MODEL || "gpt-4-turbo-preview",
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || "",
  },

  // Notification Configuration
  notifications: {
    discord: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL || "",
    },
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL || "",
    },
  },

  // Update Intervals (in milliseconds)
  intervals: {
    metrics: 30000, // 30 seconds
    deployments: 60000, // 1 minute
    web3: 15000, // 15 seconds
    security: 300000, // 5 minutes
  },
}
