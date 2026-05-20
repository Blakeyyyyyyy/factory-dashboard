import { format } from 'date-fns'
import type { ActivityEntry } from '../lib/types'

interface Props {
  entries: ActivityEntry[]
}

const AGENT_COLORS: Record<string, string> = {
  oscar: 'text-purple-400',
  opus: 'text-purple-400',
  orchestrator: 'text-accent',
  sheldon: 'text-accent',
  blake: 'text-warning',
  codex: 'text-blue-400',
  qa: 'text-success',
  sonnet: 'text-pink-400',
  haiku: 'text-teal-400',
}

function agentColor(name: string): string {
  const key = name.toLowerCase()
  for (const [prefix, color] of Object.entries(AGENT_COLORS)) {
    if (key.includes(prefix)) return color
  }
  return 'text-muted'
}

const SLUG_COLORS = [
  'bg-accent/20 text-accent',
  'bg-pink-400/20 text-pink-400',
  'bg-teal-400/20 text-teal-400',
  'bg-orange-400/20 text-orange-400',
  'bg-blue-400/20 text-blue-400',
]

const slugColorCache = new Map<string, string>()
let slugColorIndex = 0

function slugColor(slug: string): string {
  if (!slugColorCache.has(slug)) {
    slugColorCache.set(slug, SLUG_COLORS[slugColorIndex % SLUG_COLORS.length])
    slugColorIndex++
  }
  return slugColorCache.get(slug)!
}

export function LiveFeed({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-sm text-muted py-8 text-center">
        Waiting for activity...
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-border/50">
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className={`flex items-start gap-3 py-2.5 px-1 ${i === 0 ? 'animate-slide-in' : ''}`}
        >
          <span className="text-[10px] text-muted/60 whitespace-nowrap mt-0.5 font-mono flex-shrink-0">
            {format(new Date(entry.created_at), 'HH:mm:ss')}
          </span>

          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${slugColor(entry.app_slug)}`}
          >
            {entry.app_slug}
          </span>

          <span className={`text-[11px] font-semibold flex-shrink-0 ${agentColor(entry.agent_name)}`}>
            {entry.agent_name}
          </span>

          <p className="text-[11px] text-muted leading-tight flex-1 min-w-0">{entry.action}</p>
        </div>
      ))}
    </div>
  )
}
