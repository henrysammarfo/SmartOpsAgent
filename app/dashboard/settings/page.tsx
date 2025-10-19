"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  // Integration states
  const [githubToken, setGithubToken] = useState("")
  const [githubUsername, setGithubUsername] = useState("")
  const [vercelToken, setVercelToken] = useState("")
  const [ethereumRpc, setEthereumRpc] = useState("")
  const [polygonRpc, setPolygonRpc] = useState("")
  const [discordWebhook, setDiscordWebhook] = useState("")
  const [slackWebhook, setSlackWebhook] = useState("")

  useEffect(() => {
    loadUserIntegrations()
  }, [])

  const loadUserIntegrations = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    setUserId(user.id)

    const { data, error } = await supabase.from("user_integrations").select("*").eq("user_id", user.id).single()

    if (data) {
      setGithubToken(data.github_token || "")
      setGithubUsername(data.github_username || "")
      setVercelToken(data.vercel_token || "")
      setEthereumRpc(data.ethereum_rpc_url || "")
      setPolygonRpc(data.polygon_rpc_url || "")
      setDiscordWebhook(data.discord_webhook_url || "")
      setSlackWebhook(data.slack_webhook_url || "")
    }

    setIsLoading(false)
  }

  const handleSaveIntegrations = async () => {
    if (!userId) return

    setIsSaving(true)
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

      toast({
        title: "Success",
        description: "Integrations updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integrations",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your integrations and preferences</p>
        </div>

        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>GitHub Integration</CardTitle>
                <CardDescription>Connect your GitHub account for CI/CD monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github-token">Personal Access Token</Label>
                  <Input
                    id="github-token"
                    type="password"
                    placeholder="ghp_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github-username">GitHub Username</Label>
                  <Input
                    id="github-username"
                    placeholder="your-username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Vercel Integration</CardTitle>
                <CardDescription>Monitor your Vercel deployments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vercel-token">Vercel API Token</Label>
                  <Input
                    id="vercel-token"
                    type="password"
                    placeholder="Your Vercel token"
                    value={vercelToken}
                    onChange={(e) => setVercelToken(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Web3 Networks</CardTitle>
                <CardDescription>Monitor Ethereum and Polygon networks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ethereum-rpc">Ethereum RPC URL</Label>
                  <Input
                    id="ethereum-rpc"
                    type="url"
                    placeholder="https://eth-mainnet.g.alchemy.com/v2/..."
                    value={ethereumRpc}
                    onChange={(e) => setEthereumRpc(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="polygon-rpc">Polygon RPC URL</Label>
                  <Input
                    id="polygon-rpc"
                    type="url"
                    placeholder="https://polygon-mainnet.g.alchemy.com/v2/..."
                    value={polygonRpc}
                    onChange={(e) => setPolygonRpc(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveIntegrations} disabled={isSaving} className="w-full">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Integrations
            </Button>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configure where you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discord-webhook">Discord Webhook URL</Label>
                  <Input
                    id="discord-webhook"
                    type="url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveIntegrations} disabled={isSaving} className="w-full">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
