import { format, isToday } from 'date-fns'
import { asNumber, type ActivityEntry } from '../lib/types'
import { agentTheme, slugTheme } from '../lib/agents'

interface Props {
  entries: ActivityEntry[]
}

function timestamp(iso: string): string {
  const d = new Date(iso)
  return isToday(d) ? format(d, 'HH:mm:ss') : format(d, 'MMM d HH:mm')
}

export function LiveFeed({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted">Waiting for activity…</div>
    )
  }

  return (
    <ul className="flex flex-col">
      {entries.map((entry, i) => {
        const theme = agentTheme(entry.agent_name)
        const cost = asNumber(entry.cost_usd)
        return (
          <li
            key={entry.id}
            className={`flex items-start gap-3 border-b border-border/50 px-4 py-2.5 last:border-b-0 transition-colors hover:bg-surface-2/40 ${
              i === 0 ? 'animate-slide-in' : ''
            }`}
          >
            <span className="mt-0.5 flex-shrink-0 font-mono text-[10px] tabular-nums text-zinc-600">
              {timestamp(entry.created_at)}
            </span>
            <span
              className={`flex-shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${slugTheme(
                entry.app_slug,
              )}`}
            >
              {entry.app_slug}
            </span>
            <span className="flex flex-shrink-0 items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
              <span className={`text-[11px] font-bold ${theme.text}`}>
                {entry.agent_name}
              </span>
            </span>
            <p className="min-w-0 flex-1 text-[12px] leading-snug text-zinc-300">
              {entry.action}
            </p>
            {cost > 0 && (
              <span className="flex-shrink-0 font-mono text-[10px] tabular-nums text-zinc-500">
                ${cost.toFixed(2)}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
