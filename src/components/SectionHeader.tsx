import type { ReactNode } from 'react'

interface Props {
  title: string
  count?: number
  live?: boolean
  children?: ReactNode
}

export function SectionHeader({ title, count, live, children }: Props) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <h2 className="text-[13px] font-bold uppercase tracking-widest text-text">{title}</h2>
      {typeof count === 'number' && (
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted">
          {count}
        </span>
      )}
      {live && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      )}
      <span className="ml-auto flex items-center gap-2">{children}</span>
    </div>
  )
}
