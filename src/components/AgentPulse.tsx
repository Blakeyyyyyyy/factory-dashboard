import { differenceInMinutes } from 'date-fns'
import type { ActivityEntry } from '../lib/types'
import { agentTheme, agentRole } from '../lib/agents'
import { compactAgo } from '../lib/time'

interface Props {
  activityLog: ActivityEntry[]
}

interface AgentSummary {
  name: string
  lastAction: string
  lastSeen: Date
  appSlug: string
}

type Liveness = 'active' | 'recent' | 'idle'

function liveness(lastSeen: Date): Liveness {
  const mins = differenceInMinutes(new Date(), lastSeen)
  if (mins < 5) return 'active'
  if (mins < 60) return 'recent'
  return 'idle'
}

const LIVENESS_META: Record<Liveness, { label: string; dot: string; text: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  recent: { label: 'Recent', dot: 'bg-amber-400', text: 'text-amber-300' },
  idle: { label: 'Idle', dot: 'bg-zinc-600', text: 'text-zinc-500' },
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
    (a, b) => b.lastSeen.getTime() - a.lastSeen.getTime(),
  )

  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
        No agent activity yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {agents.map((agent) => {
        const theme = agentTheme(agent.name)
        const state = liveness(agent.lastSeen)
        const meta = LIVENESS_META[state]
        const pulsing = state === 'active'

        return (
          <div
            key={agent.name}
            className={`flex flex-col gap-2.5 rounded-xl border bg-surface p-3.5 shadow-md shadow-black/20 ${theme.border}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`truncate text-sm font-bold ${theme.text}`}>{agent.name}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                  {agentRole(agent.name)}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  {pulsing && (
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full ${meta.dot} opacity-60`}
                    />
                  )}
                  <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                </span>
                <span className={`text-[10px] font-semibold ${meta.text}`}>{meta.label}</span>
              </div>
            </div>

            <p className="line-clamp-2 min-h-[2rem] text-[11px] leading-snug text-zinc-400">
              {agent.lastAction}
            </p>

            <div className="flex items-center justify-between border-t border-border/70 pt-2">
              <span className="truncate font-mono text-[10px] text-zinc-600">
                {agent.appSlug}
              </span>
              <span className="flex-shrink-0 text-[10px] tabular-nums text-zinc-500">
                {compactAgo(agent.lastSeen)} ago
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
