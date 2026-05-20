// The 11-stage factory pipeline (0-10).

export interface Stage {
  index: number
  name: string
  short: string
}

export const STAGES: Stage[] = [
  { index: 0, name: 'Idea', short: 'Idea' },
  { index: 1, name: 'Validation', short: 'Validate' },
  { index: 2, name: 'Brief', short: 'Brief' },
  { index: 3, name: 'Psychology', short: 'Psych' },
  { index: 4, name: 'Visual Research', short: 'Visual' },
  { index: 5, name: 'UX Spec', short: 'UX Spec' },
  { index: 6, name: 'Build', short: 'Build' },
  { index: 7, name: 'QA', short: 'QA' },
  { index: 8, name: 'Code Review', short: 'Review' },
  { index: 9, name: 'App Store', short: 'Store' },
  { index: 10, name: 'LIVE', short: 'Live' },
]

export const TOTAL_STAGES = STAGES.length

export function stageName(index: number): string {
  return STAGES[index]?.name ?? `Stage ${index}`
}

// Progress as a 0-100 fraction (LIVE = 100).
export function stageProgress(stage: number): number {
  const clamped = Math.max(0, Math.min(stage, TOTAL_STAGES - 1))
  return Math.round((clamped / (TOTAL_STAGES - 1)) * 100)
}
