import type { Campaign } from '../lib/types'

interface Props {
  campaigns: Campaign[]
}

export function BlakeBanner({ campaigns }: Props) {
  const needsBlake = campaigns.filter((c) => c.needs_blake && c.blake_task)

  if (needsBlake.length === 0) return null

  return (
    <div className="bg-warning/10 border-b border-warning/30 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-warning text-sm font-semibold">
            {needsBlake.length === 1
              ? '1 app needs your attention'
              : `${needsBlake.length} apps need your attention`}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {needsBlake.map((c) => (
            <div key={c.slug} className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xs font-medium text-warning bg-warning/20 px-1.5 py-0.5 rounded">
                {c.name}
              </span>
              <span className="text-xs text-warning/90">{c.blake_task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
