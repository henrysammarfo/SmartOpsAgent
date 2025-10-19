import { Octokit } from "@octokit/rest"
import type { Deployment, Pipeline, PipelineStage } from "../types"

export class GitHubService {
  private octokit: Octokit
  private owner: string
  private repo: string

  constructor(token: string, owner: string, repo?: string) {
    this.octokit = new Octokit({
      auth: token,
    })
    this.owner = owner
    this.repo = repo || "default-repo"
  }

  async getWorkflowRuns(): Promise<Deployment[]> {
    try {
      const { data } = await this.octokit.actions.listWorkflowRunsForRepo({
        owner: this.owner,
        repo: this.repo,
        per_page: 10,
      })

      return data.workflow_runs.map((run) => ({
        id: run.id.toString(),
        name: run.name || "Unnamed Workflow",
        status: this.mapGitHubStatus(run.status, run.conclusion),
        environment: run.head_branch || "unknown",
        branch: run.head_branch || "unknown",
        commit: run.head_sha.substring(0, 7),
        author: run.actor?.login || "unknown",
        timestamp: run.created_at,
        duration: run.updated_at
          ? Math.floor((new Date(run.updated_at).getTime() - new Date(run.created_at).getTime()) / 1000)
          : undefined,
      }))
    } catch (error) {
      console.error("Error fetching GitHub workflow runs:", error)
      return []
    }
  }

  async getLatestPipeline(): Promise<Pipeline | null> {
    try {
      const { data } = await this.octokit.actions.listWorkflowRunsForRepo({
        owner: this.owner,
        repo: this.repo,
        per_page: 1,
      })

      const run = data.workflow_runs[0]
      if (!run) return null

      // Get jobs for this workflow run
      const { data: jobsData } = await this.octokit.actions.listJobsForWorkflowRun({
        owner: this.owner,
        repo: this.repo,
        run_id: run.id,
      })

      const stages: PipelineStage[] = jobsData.jobs.map((job) => ({
        id: job.id.toString(),
        name: job.name,
        status: this.mapGitHubStatus(job.status, job.conclusion),
        duration:
          job.completed_at && job.started_at
            ? Math.floor((new Date(job.completed_at).getTime() - new Date(job.started_at).getTime()) / 1000)
            : undefined,
      }))

      return {
        id: run.id.toString(),
        name: run.name || "Unnamed Pipeline",
        branch: run.head_branch || "unknown",
        commit: run.head_sha.substring(0, 7),
        author: run.actor?.login || "unknown",
        status: this.mapGitHubStatus(run.status, run.conclusion),
        stages,
        timestamp: run.created_at,
      }
    } catch (error) {
      console.error("Error fetching GitHub pipeline:", error)
      return null
    }
  }

  async getWorkflowLogs(runId: string): Promise<string[]> {
    try {
      const { data: jobsData } = await this.octokit.actions.listJobsForWorkflowRun({
        owner: this.owner,
        repo: this.repo,
        run_id: Number.parseInt(runId),
      })

      const logs: string[] = []
      for (const job of jobsData.jobs) {
        logs.push(`Job: ${job.name}`)
        logs.push(`Status: ${job.status}`)
        logs.push(`Conclusion: ${job.conclusion || "N/A"}`)
        logs.push("---")
      }

      return logs
    } catch (error) {
      console.error("Error fetching workflow logs:", error)
      return ["Error fetching logs"]
    }
  }

  private mapGitHubStatus(status: string, conclusion: string | null): "success" | "failed" | "pending" | "running" {
    if (status === "completed") {
      return conclusion === "success" ? "success" : "failed"
    }
    if (status === "in_progress") {
      return "running"
    }
    return "pending"
  }
}
