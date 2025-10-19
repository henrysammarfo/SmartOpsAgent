"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  // Form state
  const [githubToken, setGithubToken] = useState("")
  const [githubUsername, setGithubUsername] = useState("")
  const [vercelToken, setVercelToken] = useState("")
  const [ethereumRpc, setEthereumRpc] = useState("")
  const [polygonRpc, setPolygonRpc] = useState("")
  const [discordWebhook, setDiscordWebhook] = useState("")
  const [slackWebhook, setSlackWebhook] = useState("")

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setUserId(user.id)
      }
    }
    checkUser()
  }, [router])

  const handleSaveIntegrations = async () => {
    if (!userId) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("user_integrations").upsert({
        user_id: userId,
        github_token: githubToken || null,
        github_username: githubUsername || null,
        vercel_token: vercelToken || null,
        ethereum_rpc_url: ethereumRpc || null,
        polygon_rpc_url: polygonRpc || null,
        discord_webhook_url: discordWebhook || null,
        slack_webhook_url: slackWebhook || null,
      })

      if (error) throw error

      // Mark onboarding as completed
      await supabase.from("user_profiles").update({ onboarding_completed: true }).eq("id", userId)

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Error saving integrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-2xl">
        <Card className="border-border/40 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Set up your integrations</CardTitle>
            <CardDescription>
              Connect your services to start monitoring. You can skip any and add them later in settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* GitHub */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">GitHub (Required for CI/CD monitoring)</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="githubToken">GitHub Personal Access Token</Label>
                    <Input
                      id="githubToken"
                      type="password"
                      placeholder="ghp_..."
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="githubUsername">GitHub Username</Label>
                    <Input
                      id="githubUsername"
                      type="text"
                      placeholder="your-username"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Vercel */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vercel (Required for deployment monitoring)</h3>
                <div className="grid gap-2">
                  <Label htmlFor="vercelToken">Vercel API Token</Label>
                  <Input
                    id="vercelToken"
                    type="password"
                    placeholder="Your Vercel token"
                    value={vercelToken}
                    onChange={(e) => setVercelToken(e.target.value)}
                  />
                </div>
              </div>

              {/* Web3 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Web3 Networks (Optional)</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ethereumRpc">Ethereum RPC URL</Label>
                    <Input
                      id="ethereumRpc"
                      type="url"
                      placeholder="https://eth-mainnet.g.alchemy.com/v2/..."
                      value={ethereumRpc}
                      onChange={(e) => setEthereumRpc(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="polygonRpc">Polygon RPC URL</Label>
                    <Input
                      id="polygonRpc"
                      type="url"
                      placeholder="https://polygon-mainnet.g.alchemy.com/v2/..."
                      value={polygonRpc}
                      onChange={(e) => setPolygonRpc(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notifications (Optional)</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                    <Input
                      id="discordWebhook"
                      type="url"
                      placeholder="https://discord.com/api/webhooks/..."
                      value={discordWebhook}
                      onChange={(e) => setDiscordWebhook(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                    <Input
                      id="slackWebhook"
                      type="url"
                      placeholder="https://hooks.slack.com/services/..."
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveIntegrations} className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete setup"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
