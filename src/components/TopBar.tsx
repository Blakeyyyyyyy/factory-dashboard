import { format } from 'date-fns'
import type { RealtimeStatus } from '../lib/types'

interface Props {
  realtimeStatus: RealtimeStatus
  hasError: boolean
  errorMessage?: string
}

const STATUS_DOT: Record<RealtimeStatus, string> = {
  connected: 'bg-success',
  connecting: 'bg-warning animate-pulse',
  reconnecting: 'bg-warning animate-pulse',
  error: 'bg-danger',
}

const STATUS_LABEL: Record<RealtimeStatus, string> = {
  connected: 'Live',
  connecting: 'Connecting',
  reconnecting: 'Reconnecting',
  error: 'Disconnected',
}

export function TopBar({ realtimeStatus, hasError, errorMessage }: Props) {
  const now = new Date()

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-widest text-muted uppercase">Factory</span>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted hidden sm:block">
              {format(now, 'MMM d, yyyy')}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[realtimeStatus]}`} />
              <span className="text-xs text-muted">{STATUS_LABEL[realtimeStatus]}</span>
            </div>
          </div>
        </div>
      </div>

      {hasError && (
        <div className="bg-danger/10 border-b border-danger/30 px-4 py-1.5">
          <p className="text-xs text-danger text-center">
            {errorMessage ?? 'Failed to connect to Supabase. Data may be stale.'}
          </p>
        </div>
      )}
    </div>
  )
}
