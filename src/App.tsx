import { useEffect, useRef, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Campaign, ActivityEntry, RealtimeStatus } from './lib/types'
import { TopBar } from './components/TopBar'
import { BlakeBanner } from './components/BlakeBanner'
import { CampaignCard } from './components/CampaignCard'
import { AgentPulse } from './components/AgentPulse'
import { LiveFeed } from './components/LiveFeed'

const FEED_LIMIT = 50
const ACTIVITY_PER_CAMPAIGN = 3

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([])
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>('connecting')
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  async function fetchCampaigns() {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      setFetchError(`Campaigns: ${error.message}`)
      return
    }
    setCampaigns(data ?? [])
  }

  async function fetchActivity() {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(FEED_LIMIT)

    if (error) {
      setFetchError(`Activity: ${error.message}`)
      return
    }
    setActivityLog(data ?? [])
  }

  useEffect(() => {
    async function init() {
      setLoading(true)
      await Promise.all([fetchCampaigns(), fetchActivity()])
      setLoading(false)
    }

    init()

    const channel = supabase
      .channel('factory-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'campaigns' },
        () => {
          fetchCampaigns()
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
        (payload) => {
          const newEntry = payload.new as ActivityEntry
          setActivityLog((prev) => {
            const updated = [newEntry, ...prev]
            return updated.slice(0, FEED_LIMIT)
          })
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected')
          setFetchError(null)
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setRealtimeStatus('error')
          setFetchError('Realtime connection failed. Data may be stale.')
        } else if (status === 'CLOSED') {
          setRealtimeStatus('reconnecting')
        }
      })

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [])

  function getRecentActivity(slug: string): ActivityEntry[] {
    return activityLog.filter((e) => e.app_slug === slug).slice(0, ACTIVITY_PER_CAMPAIGN)
  }

  const activeCampaigns = campaigns.filter((c) => c.status !== 'done' || c.stage >= 9)

  return (
    <div className="min-h-screen bg-bg">
      <TopBar
        realtimeStatus={realtimeStatus}
        hasError={!!fetchError}
        errorMessage={fetchError ?? undefined}
      />

      <div className="pt-12">
        <BlakeBanner campaigns={campaigns} />

        <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
                Active Builds
              </h2>
              {!loading && (
                <span className="text-xs font-medium bg-surface-2 text-muted px-2 py-0.5 rounded-full">
                  {activeCampaigns.length}
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-surface rounded-lg border border-border h-64 animate-pulse" />
                ))}
              </div>
            ) : activeCampaigns.length === 0 ? (
              <div className="bg-surface border border-border rounded-lg p-8 text-center text-sm text-muted">
                No active campaigns. Start a new build to see it here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    recentActivity={getRecentActivity(campaign.slug)}
                  />
                ))}
              </div>
            )}

            {!loading && campaigns.filter((c) => c.status === 'done' && c.stage < 9).length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                  Completed
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {campaigns
                    .filter((c) => c.status === 'done' && c.stage < 9)
                    .map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        recentActivity={getRecentActivity(campaign.slug)}
                      />
                    ))}
                </div>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Agents</h2>
            </div>
            {loading ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-48 h-24 bg-surface rounded-lg border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <AgentPulse activityLog={activityLog} />
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
                Live Feed
              </h2>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  realtimeStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-muted'
                }`}
              />
            </div>

            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              {loading ? (
                <div className="p-4 flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-5 bg-surface-2 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="px-3 py-1 max-h-[480px] overflow-y-auto">
                  <LiveFeed entries={activityLog} />
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
