interface Props {
  status: string
  className?: string
}

interface PillStyle {
  classes: string
  label: string
  dot: string
}

const STATUS_STYLES: Record<string, PillStyle> = {
  active: {
    classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    label: 'Building',
    dot: 'bg-indigo-400',
  },
  live: {
    classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    label: 'Live',
    dot: 'bg-emerald-400',
  },
  done: {
    classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    label: 'Done',
    dot: 'bg-emerald-400',
  },
  paused: {
    classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    label: 'Paused',
    dot: 'bg-amber-400',
  },
  blocked: {
    classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    label: 'Blocked',
    dot: 'bg-rose-400',
  },
}

const FALLBACK: PillStyle = {
  classes: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
  label: 'Unknown',
  dot: 'bg-zinc-400',
}

export function StatusPill({ status, className = '' }: Props) {
  const key = status.toLowerCase()
  const style = STATUS_STYLES[key] ?? { ...FALLBACK, label: status }
  const live = key === 'live'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${style.classes} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {live && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${style.dot} opacity-60`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${style.dot}`} />
      </span>
      {style.label}
    </span>
  )
}
