import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from './lib/supabase'
import { asNumber, type Campaign, type ActivityEntry, type RealtimeStatus } from './lib/types'
import { TopBar } from './components/TopBar'
import { BlakeBanner } from './components/BlakeBanner'
import { CampaignCard } from './components/CampaignCard'
import { AgentPulse } from './components/AgentPulse'
import { LiveFeed } from './components/LiveFeed'
import { SectionHeader } from './components/SectionHeader'

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
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
        (payload) => {
          const newEntry = payload.new as ActivityEntry
          setActivityLog((prev) => {
            if (prev.some((e) => e.id === newEntry.id)) return prev
            return [newEntry, ...prev].slice(0, FEED_LIMIT)
          })
        },
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
    return activityLog
      .filter((e) => e.app_slug === slug)
      .slice(0, ACTIVITY_PER_CAMPAIGN)
  }

  const { activeCampaigns, shippedCampaigns } = useMemo(() => {
    const active: Campaign[] = []
    const shipped: Campaign[] = []
    for (const c of campaigns) {
      if (c.stage >= 10 || c.status === 'done') shipped.push(c)
      else active.push(c)
    }
    return { activeCampaigns: active, shippedCampaigns: shipped }
  }, [campaigns])

  const todaySpend = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return activityLog
      .filter((e) => new Date(e.created_at) >= start)
      .reduce((sum, e) => sum + asNumber(e.cost_usd), 0)
  }, [activityLog])

  return (
    <div className="min-h-screen bg-bg">
      <TopBar
        realtimeStatus={realtimeStatus}
        hasError={!!fetchError}
        errorMessage={fetchError ?? undefined}
      />

      <div className="pt-14">
        <BlakeBanner campaigns={campaigns} />

        <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6">
          {/* Active Builds */}
          <section>
            <SectionHeader title="Active Builds" count={loading ? undefined : activeCampaigns.length}>
              {!loading && todaySpend > 0 && (
                <span className="rounded-full border border-border bg-surface-2/60 px-2.5 py-0.5 text-[11px] font-medium text-muted">
                  ${todaySpend.toFixed(2)} today
                </span>
              )}
            </SectionHeader>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-xl border border-border bg-surface"
                  />
                ))}
              </div>
            ) : activeCampaigns.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
                No active builds. Every app has shipped.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {activeCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    recentActivity={getRecentActivity(campaign.slug)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Shipped */}
          {!loading && shippedCampaigns.length > 0 && (
            <section>
              <SectionHeader title="Shipped" count={shippedCampaigns.length} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {shippedCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    recentActivity={getRecentActivity(campaign.slug)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Agent Pulse */}
          <section>
            <SectionHeader title="Agent Pulse" />
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl border border-border bg-surface"
                  />
                ))}
              </div>
            ) : (
              <AgentPulse activityLog={activityLog} />
            )}
          </section>

          {/* Live Feed */}
          <section className="pb-8">
            <SectionHeader title="Live Feed" live={realtimeStatus === 'connected'} />
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-lg shadow-black/20">
              {loading ? (
                <div className="flex flex-col gap-3 p-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-5 animate-pulse rounded bg-surface-2" />
                  ))}
                </div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto">
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
