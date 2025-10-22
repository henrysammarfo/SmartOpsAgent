import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { apiClient } from "@/lib/api-client"

export function useApiClient() {
  useEffect(() => {
    const setAuthToken = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.access_token) {
        apiClient.setAuthToken(session.access_token)
      }
    }

    setAuthToken()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        apiClient.setAuthToken(session.access_token)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return apiClient
}
