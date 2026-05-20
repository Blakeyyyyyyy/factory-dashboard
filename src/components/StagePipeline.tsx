import { STAGES, TOTAL_STAGES, stageProgress } from '../lib/stages'

interface Props {
  currentStage: number
}

export function StagePipeline({ currentStage }: Props) {
  const stage = Math.max(0, Math.min(currentStage, TOTAL_STAGES - 1))
  const isLive = stage >= TOTAL_STAGES - 1
  const progress = stageProgress(stage)
  // Fill the connector track up to the centre of the current node.
  const fillPct = (stage / (TOTAL_STAGES - 1)) * 100

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
          Pipeline
        </span>
        <span className="text-[10px] font-semibold tabular-nums text-muted">
          {isLive ? 'Shipped' : `Stage ${stage} / ${TOTAL_STAGES - 1}`}
          <span className="ml-1.5 text-zinc-500">{progress}%</span>
        </span>
      </div>

      <div className="relative px-1">
        {/* base track */}
        <div className="absolute left-1 right-1 top-[5px] h-[3px] rounded-full bg-surface-2" />
        {/* filled track */}
        <div
          className={`absolute left-1 top-[5px] h-[3px] rounded-full transition-all duration-500 ${
            isLive ? 'bg-emerald-400' : 'bg-accent'
          }`}
          style={{ width: `calc((100% - 0.5rem) * ${fillPct / 100})` }}
        />

        <div className="relative flex justify-between">
          {STAGES.map((s) => {
            const isDone = s.index < stage
            const isCurrent = s.index === stage

            return (
              <div key={s.index} className="flex flex-col items-center" style={{ width: '9%' }}>
                <span className="relative flex h-3 w-3 items-center justify-center">
                  {isCurrent && !isLive && (
                    <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-accent opacity-60" />
                  )}
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full border-2 transition-colors ${
                      isDone
                        ? 'border-accent bg-accent'
                        : isCurrent
                          ? isLive
                            ? 'border-emerald-400 bg-emerald-400'
                            : 'border-accent bg-accent shadow-[0_0_8px_rgba(129,140,248,0.7)]'
                          : 'border-border bg-surface'
                    }`}
                  />
                </span>
                <span
                  className={`mt-1.5 text-center text-[8.5px] font-medium leading-tight transition-colors ${
                    isCurrent
                      ? isLive
                        ? 'text-emerald-300'
                        : 'font-bold text-accent'
                      : isDone
                        ? 'text-zinc-400'
                        : 'text-zinc-600'
                  }`}
                >
                  {s.short}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
