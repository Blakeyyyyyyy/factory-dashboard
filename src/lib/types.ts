export interface Campaign {
  id: string
  slug: string
  name: string
  status: 'active' | 'done' | 'paused'
  stage: number
  stage_name: string
  needs_blake: boolean
  blake_task: string | null
  blake_task_type: string | null
  current_agent: string | null
  phase: string | null
  phase_note: string | null
  updated_at: string
  created_at: string
}

export interface ActivityEntry {
  id: string
  app_slug: string
  agent_name: string
  action: string
  // Supabase numeric columns arrive as strings over the wire.
  cost_usd: number | string
  created_at: string
}

// Coerce a possibly-string numeric column to a number.
export function asNumber(value: number | string | null | undefined): number {
  if (value == null) return 0
  const n = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

export interface Approval {
  id: string
  app_slug: string
  approval_type: string
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export type RealtimeStatus = 'connecting' | 'connected' | 'reconnecting' | 'error'
