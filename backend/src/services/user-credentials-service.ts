import { createClient } from "@supabase/supabase-js"
import { config } from "../config"

interface UserIntegration {
  integration_type: string
  api_key?: string
  api_secret?: string
  webhook_url?: string
  additional_config?: Record<string, any>
}

export class UserCredentialsService {
  private supabase

  constructor() {
    this.supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey)
  }

  async getUserIntegrations(userId: string): Promise<Record<string, UserIntegration>> {
    const { data, error } = await this.supabase
      .from("user_integrations")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching user integrations:", error)
      return {}
    }

    const integrations: Record<string, UserIntegration> = {}
    data?.forEach((integration) => {
      integrations[integration.integration_type] = integration
    })

    return integrations
  }

  async getIntegration(userId: string, integrationType: string): Promise<UserIntegration | null> {
    const { data, error } = await this.supabase
      .from("user_integrations")
      .select("*")
      .eq("user_id", userId)
      .eq("integration_type", integrationType)
      .eq("is_active", true)
      .single()

    if (error) {
      return null
    }

    return data
  }
}
