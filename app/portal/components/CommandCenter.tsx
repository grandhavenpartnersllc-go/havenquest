'use client'

import { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import { usePortalData } from '../providers/PortalDataProvider'
import { createClient } from '../../../lib/supabase/client'

const MM_NAMES: Record<number, string> = {
  1: 'Welcome', 2: 'Explore', 3: 'Discover', 4: 'Connect',
  5: 'Plan', 6: 'Prepare', 7: 'Match', 8: 'Engage',
  9: 'Transition', 10: 'Home',
}

const NEXT_ACTIONS: Record<number, string> = {
  1: 'Begin your Navigator journey',
  2: 'Explore your matched communities',
  3: 'Select your target community',
  4: 'Complete your family profile',
}

interface TeamData {
  marketDirector: string | null
  selectAgent: string | null
  lender: string | null
}

interface TeamRow {
  market_director_name: string | null
  select_agent_name: string | null
  lender_name: string | null
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function getNextAction(mm: number): string {
  return NEXT_ACTIONS[mm] ?? 'Awaiting Market Director — your team will be in touch'
}

function SkeletonLine({ width, height = 10 }: { width: number | string; height?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: '4px' }}
    />
  )
}

function SkeletonCircle({ size }: { size: number }) {
  return (
    <div
      className="skeleton"
      style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }}
    />
  )
}

export default function CommandCenter() {
  const { currentMM, ready } = usePortalData()
  const [team, setTeam] = useState<TeamData>({ marketDirector: null, selectAgent: null, lender: null })
  const [teamLoading, setTeamLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const percent = Math.round((currentMM / 10) * 100)
  const mmName = MM_NAMES[currentMM] ?? 'Stage'
  const nextAction = getNextAction(currentMM)

  const radius = 22
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (percent / 100) * circumference

  useEffect(() => {
    if (!ready) return

    const load = async (): Promise<void> => {
      const supabase = createClient()
      const { data: { session: supaSession } } = await supabase.auth.getSession()

      if (!supaSession?.user?.email) {
        setTeamLoading(false)
        return
      }

      const email = supaSession.user.email.toLowerCase()

      const { data: teamData, error: teamError } = await supabase
        .from('users')
        .select('market_director_name, select_agent_name, lender_name')
        .eq('email', email)
        .single()

      if (!teamError && teamData) {
        const d = teamData as TeamRow | null
        if (d) {
          setTeam({
            marketDirector: d.market_director_name,
            selectAgent: d.select_agent_name,
            lender: d.lender_name,
          })
        }
      }
      setTeamLoading(false)

      const { count, error: msgError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_email', email)
        .eq('read', false)

      if (!msgError) setUnreadCount(count ?? 0)
    }

    void load()
  }, [ready])

  const teamRows: Array<{ role: string; name: string | null }> = [
    { role: 'Market Director', name: team.marketDirector },
    { role: 'Select Agent',    name: team.selectAgent    },
    { role: 'Lender',          name: team.lender         },
  ]

  return (
    <aside
      style={{
        width: '240px',
        minWidth: '240px',
        height: '100%',
        backgroundColor: 'var(--panel-bg)',
        borderLeft: '0.5px solid var(--panel-border)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Header */}
        <p
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          Command Center
        </p>

        {/* ── Journey Status ── */}
        <div style={{ backgroundColor: 'var(--portal-bg)', borderRadius: '10px', padding: '12px' }}>
          {!ready ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <SkeletonCircle size={8} />
                <SkeletonLine width={52} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SkeletonCircle size={60} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SkeletonLine width={90} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success-color)', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>On track</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r={radius} fill="none" stroke="var(--card-border)" strokeWidth="4" />
                  <circle
                    cx="30" cy="30" r={radius}
                    fill="none"
                    stroke="var(--accent-blue)"
                    strokeWidth="4"
                    strokeDasharray={String(circumference)}
                    strokeDashoffset={String(strokeOffset)}
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                  />
                  <text
                    x="30" y="30"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="var(--text-primary)"
                  >
                    {percent}%
                  </text>
                </svg>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{percent}% complete</span>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
                Current:{' '}
                <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>
                  MM{currentMM} {mmName}
                </span>
              </p>
            </>
          )}
        </div>

        {/* ── Next Action ── */}
        <div style={{ backgroundColor: 'var(--accent-blue-light)', borderRadius: '10px', padding: '12px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-blue)', margin: '0 0 6px' }}>
            Next Action
          </p>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4, margin: '0 0 10px' }}>
            {nextAction}
          </p>
          <button
            type="button"
            style={{
              width: '100%',
              backgroundColor: '#0076B6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 0',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Mark complete
          </button>
        </div>

        {/* ── Upcoming Events ── */}
        <div>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
            Upcoming
          </p>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div style={{ textAlign: 'center', minWidth: '30px' }}>
              <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--accent-blue)', letterSpacing: '0.06em', lineHeight: 1, marginBottom: '2px' }}>JUL</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>15</div>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 2px' }}>Strategy Session</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>with your Market Director</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--card-border)', marginBottom: '10px' }} />

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'center', minWidth: '30px' }}>
              <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--accent-blue)', letterSpacing: '0.06em', lineHeight: 1, marginBottom: '2px' }}>JUL</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>22</div>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 2px' }}>Community Review</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Follow-up call</p>
            </div>
          </div>
        </div>

        {/* ── Your Team ── */}
        <div>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
            Your Team
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {teamLoading ? (
              [0, 1, 2].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SkeletonCircle size={28} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <SkeletonLine width={48} height={8} />
                    <SkeletonLine width={80} height={10} />
                  </div>
                </div>
              ))
            ) : (
              teamRows.map(({ role, name }) => (
                <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {name ? (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0076B6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff' }}>{getInitials(name)}</span>
                    </div>
                  ) : (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--portal-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <UserCircle size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 1px' }}>
                      {role}
                    </p>
                    <p style={{ fontSize: '11px', color: name ? 'var(--text-primary)' : 'var(--text-muted)', margin: 0, fontStyle: name ? 'normal' : 'italic' }}>
                      {name ?? 'Pending assignment'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Messages ── */}
        <div>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
            Messages
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  backgroundColor: unreadCount > 0 ? '#0076B6' : 'var(--portal-bg)',
                  color: unreadCount > 0 ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '20px',
                  border: unreadCount > 0 ? 'none' : '1px solid var(--card-border)',
                  minWidth: '20px',
                  textAlign: 'center',
                }}
              >
                {unreadCount}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {unreadCount === 1 ? 'unread message' : 'unread messages'}
              </span>
            </div>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--accent-blue)', padding: 0 }}>
              View all
            </button>
          </div>
        </div>

      </div>
    </aside>
  )
}
