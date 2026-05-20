import { formatDistanceToNow } from 'date-fns'
import type { Campaign, ActivityEntry } from '../lib/types'
import { StatusPill } from './StatusPill'
import { StagePipeline } from './StagePipeline'

interface Props {
  campaign: Campaign
  recentActivity: ActivityEntry[]
}

const AGENT_COLORS: Record<string, string> = {
  oscar: 'text-purple-400',
  opus: 'text-purple-400',
  orchestrator: 'text-accent',
  sheldon: 'text-accent',
  blake: 'text-warning',
  codex: 'text-blue-400',
  qa: 'text-success',
  sonnet: 'text-pink-400',
  haiku: 'text-teal-400',
}

function agentColor(name: string): string {
  const key = name.toLowerCase()
  for (const [prefix, color] of Object.entries(AGENT_COLORS)) {
    if (key.includes(prefix)) return color
  }
  return 'text-muted'
}

function getDisplayStatus(campaign: Campaign): string {
  if (campaign.stage === 10) return 'live'
  return campaign.status
}

export function CampaignCard({ campaign, recentActivity }: Props) {
  const displayStatus = getDisplayStatus(campaign)
  const needsBlake = campaign.needs_blake && campaign.blake_task

  return (
    <div
      className={`bg-surface rounded-lg border overflow-hidden flex flex-col ${
        needsBlake ? 'border-warning/50' : 'border-border'
      }`}
    >
      {needsBlake && <div className="h-0.5 bg-warning w-full" />}

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-text leading-tight truncate">
              {campaign.name}
            </h3>
            <p className="text-xs text-muted mt-0.5">{campaign.stage_name}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {needsBlake && (
              <span className="text-[10px] font-bold tracking-wide text-warning bg-warning/15 border border-warning/30 px-1.5 py-0.5 rounded">
                YOUR TURN
              </span>
            )}
            <StatusPill status={displayStatus} />
          </div>
        </div>

        <StagePipeline currentStage={campaign.stage} />

        {campaign.current_agent && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse flex-shrink-0" />
            <span className="text-xs text-muted">
              Agent:{' '}
              <span className={`font-medium ${agentColor(campaign.current_agent)}`}>
                {campaign.current_agent}
              </span>
            </span>
          </div>
        )}

        {recentActivity.length > 0 && (
          <div className="flex flex-col gap-1.5 border-t border-border pt-3">
            {recentActivity.slice(0, 3).map((entry) => (
              <div key={entry.id} className="flex items-start gap-2">
                <span className="text-[10px] text-muted/60 whitespace-nowrap mt-0.5 flex-shrink-0">
                  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: false })} ago
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-semibold ${agentColor(entry.agent_name)}`}>
                    {entry.agent_name}
                  </span>
                  <p className="text-[11px] text-muted leading-tight line-clamp-2 mt-0.5">
                    {entry.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-1">
          <span className="text-[10px] text-muted/60">
            Updated {formatDistanceToNow(new Date(campaign.updated_at), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  )
}
