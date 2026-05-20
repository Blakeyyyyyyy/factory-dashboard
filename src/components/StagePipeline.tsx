const STAGES = [
  'Idea',
  'Validation',
  'Brief',
  'Psychology',
  'Visual Research',
  'UX Spec',
  'Build',
  'QA',
  'Code Review',
  'App Store',
  'LIVE',
]

interface Props {
  currentStage: number
}

export function StagePipeline({ currentStage }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-max gap-0">
        {STAGES.map((stage, i) => {
          const isDone = i < currentStage
          const isCurrent = i === currentStage

          return (
            <div key={stage} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                    isDone
                      ? 'bg-accent'
                      : isCurrent
                      ? 'bg-accent ring-2 ring-accent/40'
                      : 'bg-surface-2'
                  }`}
                />
                <span
                  className={`text-[9px] leading-none text-center max-w-[52px] ${
                    isCurrent ? 'text-accent font-semibold' : isDone ? 'text-muted' : 'text-border'
                  }`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {stage}
                </span>
              </div>

              {i < STAGES.length - 1 && (
                <div
                  className={`w-4 h-px mb-3 flex-shrink-0 ${
                    i < currentStage ? 'bg-accent/50' : 'bg-border'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
