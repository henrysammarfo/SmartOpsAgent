"use client"

import Link from "next/link"
import { ArrowRight, Terminal, GitBranch, Shield, Network, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Theme Toggle - Top Right */}
      <div className="absolute right-6 top-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="glass-card"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="container relative mx-auto px-4 pt-32 pb-20">
        <div className="mx-auto max-w-5xl">
          {/* Main Heading */}
          <div className="mb-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Real-time DevOps Intelligence
            </div>
            <h1 className="text-balance text-6xl font-bold tracking-tight lg:text-7xl">
              SmartOps
              <span className="text-primary">Agent</span>
            </h1>
            <p className="max-w-2xl text-pretty text-xl text-muted-foreground leading-relaxed">
              Monitor infrastructure, track deployments, and secure your systems. Built for teams that ship fast and
              need visibility across cloud, CI/CD, and Web3.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/auth/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base glass-card bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          {/* Live Metrics Preview */}
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            <div className="glass-card rounded-xl border border-border/50 p-6">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Uptime
              </div>
              <div className="text-3xl font-bold">99.98%</div>
              <div className="mt-1 text-xs text-success">+0.02% this week</div>
            </div>
            <div className="glass-card rounded-xl border border-border/50 p-6">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Active Deployments
              </div>
              <div className="text-3xl font-bold">47</div>
              <div className="mt-1 text-xs text-muted-foreground">12 in last hour</div>
            </div>
            <div className="glass-card rounded-xl border border-border/50 p-6">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                Security Score
              </div>
              <div className="text-3xl font-bold">A+</div>
              <div className="mt-1 text-xs text-success">All checks passed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">Everything you need to monitor production</h2>
            <p className="text-lg text-muted-foreground">Real-time insights across your entire infrastructure stack</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Infrastructure Monitoring */}
            <div className="glass-card group rounded-2xl border border-border/50 p-8 transition-all hover:border-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Infrastructure Monitoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track AWS services, server metrics, and resource utilization in real-time. Get instant alerts when
                thresholds are breached.
              </p>
            </div>

            {/* CI/CD Pipeline Tracking */}
            <div className="glass-card group rounded-2xl border border-border/50 p-8 transition-all hover:border-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">CI/CD Pipeline Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize GitHub Actions workflows, track deployment status, and identify bottlenecks in your release
                pipeline.
              </p>
            </div>

            {/* Security & Compliance */}
            <div className="glass-card group rounded-2xl border border-border/50 p-8 transition-all hover:border-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Security & Compliance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automated vulnerability scanning, compliance tracking, and security posture monitoring across all
                environments.
              </p>
            </div>

            {/* Web3 Network Monitoring */}
            <div className="glass-card group rounded-2xl border border-border/50 p-8 transition-all hover:border-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Web3 Network Monitoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor Ethereum and Polygon networks, track gas prices, block times, and network health metrics in
                real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="glass-card mx-auto max-w-4xl rounded-3xl border border-border/50 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Start monitoring in minutes</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Connect your infrastructure and get instant visibility into your entire stack
          </p>
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/auth/sign-up">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
