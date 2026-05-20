interface Props {
  status: string
  className?: string
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-accent/20 text-accent border border-accent/30',
  done: 'bg-success/20 text-success border border-success/30',
  live: 'bg-success/20 text-success border border-success/30',
  paused: 'bg-warning/20 text-warning border border-warning/30',
  blocked: 'bg-danger/20 text-danger border border-danger/30',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  done: 'Done',
  live: 'Live',
  paused: 'Paused',
  blocked: 'Blocked',
}

export function StatusPill({ status, className = '' }: Props) {
  const key = status.toLowerCase()
  const styles = STATUS_STYLES[key] ?? 'bg-surface-2 text-muted border border-border'
  const label = STATUS_LABELS[key] ?? status

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${styles} ${className}`}>
      {label}
    </span>
  )
}
