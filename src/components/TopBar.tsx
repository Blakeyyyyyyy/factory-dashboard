import { format } from 'date-fns'
import type { RealtimeStatus } from '../lib/types'

interface Props {
  realtimeStatus: RealtimeStatus
  hasError: boolean
  errorMessage?: string
}

const STATUS_META: Record<RealtimeStatus, { dot: string; label: string; pulse: boolean }> = {
  connected: { dot: 'bg-emerald-400', label: 'Live', pulse: true },
  connecting: { dot: 'bg-amber-400', label: 'Connecting', pulse: true },
  reconnecting: { dot: 'bg-amber-400', label: 'Reconnecting', pulse: true },
  error: { dot: 'bg-rose-400', label: 'Offline', pulse: false },
}

export function TopBar({ realtimeStatus, hasError, errorMessage }: Props) {
  const now = new Date()
  const meta = STATUS_META[realtimeStatus]

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-border bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 ring-1 ring-accent/25">
              <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-[0.2em] text-text">FACTORY</span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-muted">
                Mission Control
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-xs font-medium text-muted sm:block">
              {format(now, 'EEE, MMM d')}
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-2.5 py-1">
              <span className="relative flex h-2 w-2">
                {meta.pulse && (
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full ${meta.dot} opacity-60`}
                  />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${meta.dot}`} />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-text">
                {meta.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {hasError && (
        <div className="border-b border-rose-500/30 bg-rose-500/10 px-4 py-1.5">
          <p className="mx-auto max-w-7xl text-center text-xs font-medium text-rose-300">
            {errorMessage ?? 'Failed to connect to Supabase. Data may be stale.'}
          </p>
        </div>
      )}
    </header>
  )
}
