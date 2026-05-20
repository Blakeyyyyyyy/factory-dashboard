import { formatDistanceToNow, differenceInMinutes } from 'date-fns'
import type { ActivityEntry } from '../lib/types'

interface Props {
  activityLog: ActivityEntry[]
}

interface AgentSummary {
  name: string
  lastAction: string
  lastSeen: Date
  appSlug: string
}

const AGENT_COLORS: Record<string, string> = {
  oscar: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  opus: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  orchestrator: 'text-accent border-accent/30 bg-accent/10',
  sheldon: 'text-accent border-accent/30 bg-accent/10',
  blake: 'text-warning border-warning/30 bg-warning/10',
  codex: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  qa: 'text-success border-success/30 bg-success/10',
  sonnet: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  haiku: 'text-teal-400 border-teal-400/30 bg-teal-400/10',
}

function agentStyle(name: string): string {
  const key = name.toLowerCase()
  for (const [prefix, style] of Object.entries(AGENT_COLORS)) {
    if (key.includes(prefix)) return style
  }
  return 'text-muted border-border bg-surface-2'
}

function statusDot(lastSeen: Date): string {
  const mins = differenceInMinutes(new Date(), lastSeen)
  if (mins < 5) return 'bg-success'
  if (mins < 30) return 'bg-warning'
  return 'bg-muted'
}

export function AgentPulse({ activityLog }: Props) {
  const agentMap = new Map<string, AgentSummary>()

  for (const entry of activityLog) {
    if (!agentMap.has(entry.agent_name)) {
      agentMap.set(entry.agent_name, {
        name: entry.agent_name,
        lastAction: entry.action,
        lastSeen: new Date(entry.created_at),
        appSlug: entry.app_slug,
      })
    }
  }

  const agents = Array.from(agentMap.values()).sort(
    (a, b) => b.lastSeen.getTime() - a.lastSeen.getTime()
  )

  if (agents.length === 0) {
    return (
      <div className="text-sm text-muted py-4 text-center">No agent activity yet.</div>
    )
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {agents.map((agent) => {
        const dot = statusDot(agent.lastSeen)
        const style = agentStyle(agent.name)

        return (
          <div
            key={agent.name}
            className={`flex-shrink-0 w-48 rounded-lg border p-3 flex flex-col gap-2 ${style}`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
              <span className="text-xs font-semibold truncate">{agent.name}</span>
            </div>
            <p className="text-[11px] text-muted leading-tight line-clamp-1">{agent.lastAction}</p>
            <span className="text-[10px] text-muted/60">
              {formatDistanceToNow(agent.lastSeen, { addSuffix: true })}
            </span>
          </div>
        )
      })}
    </div>
  )
}
