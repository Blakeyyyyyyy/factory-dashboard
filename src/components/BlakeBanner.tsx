import type { Campaign } from '../lib/types'

interface Props {
  campaigns: Campaign[]
}

export function BlakeBanner({ campaigns }: Props) {
  const needsBlake = campaigns.filter((c) => c.needs_blake && c.blake_task)
  if (needsBlake.length === 0) return null

  return (
    <div className="border-b border-amber-500/25 bg-gradient-to-b from-amber-500/[0.12] to-amber-500/[0.04]">
      <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-amber-500/20 ring-1 ring-amber-500/40">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-amber-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-amber-200">
              {needsBlake.length === 1
                ? '1 app is waiting on you'
                : `${needsBlake.length} apps are waiting on you`}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {needsBlake.map((c) => (
                <li key={c.slug} className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-200">
                    {c.name}
                  </span>
                  <span className="text-[13px] leading-snug text-amber-100/90">
                    {c.blake_task}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
