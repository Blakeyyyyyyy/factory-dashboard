import type { Campaign, ActivityEntry } from '../lib/types'
import { StatusPill } from './StatusPill'
import { StagePipeline } from './StagePipeline'
import { agentTheme, agentRole } from '../lib/agents'
import { compactAgo } from '../lib/time'

interface Props {
  campaign: Campaign
  recentActivity: ActivityEntry[]
}

function isShipped(campaign: Campaign): boolean {
  return campaign.stage >= 10 || campaign.status === 'done'
}

function displayStatus(campaign: Campaign): string {
  if (campaign.stage >= 10) return 'live'
  if (campaign.status === 'done') return 'live'
  return campaign.status
}

export function CampaignCard({ campaign, recentActivity }: Props) {
  const needsBlake = Boolean(campaign.needs_blake && campaign.blake_task)
  const status = displayStatus(campaign)
  // A shipped app sits at the final pipeline stage regardless of its raw stage int.
  const effectiveStage = isShipped(campaign) ? 10 : campaign.stage
  const agentName = campaign.current_agent
  const agent = agentName ? agentTheme(agentName) : null

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-surface shadow-lg shadow-black/20 transition-colors ${
        needsBlake
          ? 'border-amber-500/40'
          : 'border-border hover:border-zinc-600'
      }`}
    >
      {/* amber accent rail when Blake is needed */}
      {needsBlake && (
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-amber-500" />
      )}

      <div className={`flex flex-1 flex-col gap-4 p-5 ${needsBlake ? 'pl-6' : ''}`}>
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold leading-tight text-text">
              {campaign.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <span className="font-mono text-[11px] text-zinc-500">{campaign.slug}</span>
              <span className="text-zinc-700">•</span>
              <span className="font-medium text-zinc-400">{campaign.stage_name}</span>
            </p>
          </div>
          <StatusPill status={status} />
        </div>

        {/* Blake action callout */}
        {needsBlake && (
          <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 p-3.5">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                Action Required
              </span>
            </div>
            <p className="mt-1.5 text-sm font-medium leading-snug text-amber-100">
              {campaign.blake_task}
            </p>
            {campaign.blake_task_type && (
              <span className="mt-2 inline-block rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300/90">
                {campaign.blake_task_type}
              </span>
            )}
          </div>
        )}

        {/* pipeline */}
        <StagePipeline currentStage={effectiveStage} />

        {/* current agent */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/50 px-3 py-2">
          {agent ? (
            <>
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${agent.dot} opacity-60`}
                />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${agent.dot}`} />
              </span>
              <span className="text-xs text-muted">Working now</span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className={`text-xs font-bold ${agent.text}`}>{agentName}</span>
                <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                  {agentRole(agentName!)}
                </span>
              </span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-zinc-600" />
              <span className="text-xs text-muted">No agent assigned</span>
            </>
          )}
        </div>

        {/* recent activity */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Recent Activity
          </span>
          {recentActivity.length === 0 ? (
            <p className="py-2 text-xs text-zinc-500">No activity logged yet.</p>
          ) : (
            <ul className="mt-1 flex flex-col">
              {recentActivity.slice(0, 3).map((entry) => {
                const theme = agentTheme(entry.agent_name)
                return (
                  <li
                    key={entry.id}
                    className="flex items-start gap-2.5 border-l border-border py-1.5 pl-3"
                  >
                    <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${theme.dot}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-[11px] font-bold ${theme.text}`}>
                          {entry.agent_name}
                        </span>
                        <span className="text-[10px] tabular-nums text-zinc-500">
                          {compactAgo(entry.created_at)} ago
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-zinc-400">
                        {entry.action}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="text-[11px] text-zinc-500">
            Updated{' '}
            <span className="font-medium text-zinc-400">
              {compactAgo(campaign.updated_at)} ago
            </span>
          </span>
          {campaign.phase && (
            <span className="rounded bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
              {campaign.phase}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
