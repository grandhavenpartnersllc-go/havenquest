'use client'

import Link from 'next/link'
import type { UserSession } from '../../../types'

const GOLD = '#B8912A'

const MILEMARKERS = [
  { mm: 1,  name: 'Welcome',  what: "You're here — get oriented" },
  { mm: 2,  name: 'Explore',  what: 'Review your matched Texas communities' },
  { mm: 3,  name: 'Decide',   what: 'Commit to your target city' },
  { mm: 4,  name: 'Connect',  what: 'Meet your Market Director' },
  { mm: 5,  name: 'Plan',     what: 'Build your relocation strategy' },
  { mm: 6,  name: 'Prepare',  what: 'Get financially and logistically ready' },
  { mm: 7,  name: 'Match',    what: 'Meet your HavenQuest Select Agent' },
  { mm: 8,  name: 'Engage',   what: 'Start your home search' },
  { mm: 9,  name: 'Contract', what: 'Go under contract' },
  { mm: 10, name: 'Home',     what: 'Close and celebrate' },
]

interface MM1ExploreProps {
  session: UserSession
  currentMileMarker: number
  onboardingAcknowledged: boolean
  onAcknowledge: () => void
  onAdvanceToDiscover: () => void
}

export default function MM1Explore({
  session,
  currentMileMarker,
  onboardingAcknowledged,
  onAcknowledge,
  onAdvanceToDiscover,
}: MM1ExploreProps) {
  const firstName = session?.firstName || 'there'

  return (
    <div>

      {/* Section 1 — WELCOME TO YOUR NAVIGATOR */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Welcome to Your Navigator
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.3 }}>
          Welcome{firstName !== 'there' ? `, ${firstName}` : ''}. Your Texas journey starts here.
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          This is your private HavenQuest Navigator — your home base for the entire relocation process. Everything you do here is saved, your progress is tracked, and your team works alongside you from right here.
        </p>
      </div>

      {/* Section 2 — HOW YOUR JOURNEY WORKS */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
          How Your Journey Works
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
          Your journey unfolds across 10 MileMarkers. Each one has a clear purpose, a set of actions, and the right people in place to help you move forward.
        </p>

        <div style={{ border: '1px solid var(--panel-border)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--panel-bg)' }}>
          {MILEMARKERS.map(({ mm, name, what }, i) => {
            const isActive = mm === currentMileMarker
            const isComplete = mm < currentMileMarker
            const isLast = i === MILEMARKERS.length - 1
            return (
              <div
                key={mm}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  backgroundColor: isActive ? 'rgba(184,145,42,0.06)' : 'transparent',
                  borderBottom: isLast ? 'none' : '1px solid var(--panel-border)',
                  borderLeft: isActive ? `3px solid ${GOLD}` : '3px solid transparent',
                  opacity: isComplete ? 0.5 : 1,
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? GOLD : isComplete ? '#6B7280' : 'var(--panel-border)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isActive || isComplete ? '#ffffff' : 'var(--text-secondary)',
                }}>
                  {mm}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                    {name}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    {what}
                  </p>
                </div>
                {isActive && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: GOLD,
                    backgroundColor: 'rgba(184,145,42,0.12)',
                    padding: '3px 9px',
                    borderRadius: '20px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}>
                    You are here
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 3 — WHAT'S WAITING FOR YOU */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
          What's Waiting for You
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          Your city matches are ready in MM2. They were built from everything you told us — your income, your household, your priorities. Take your time reviewing them. There&apos;s no rush.
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          When you&apos;re ready, click{' '}
          <Link href="/portal/mm2" style={{ color: '#0076B6', fontWeight: 600, textDecoration: 'none' }}>
            Explore
          </Link>
          {' '}in the left nav to see where your life fits in Texas. →
        </p>
      </div>

      {/* CTA — Ready to Begin */}
      <div style={{ padding: '2rem 0', borderTop: '1px solid var(--panel-border)', marginTop: '1rem', textAlign: 'center' }}>
        <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Ready to explore your matches in depth?
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          MileMarker 2 is where your full city reports and affordability breakdown are waiting.
        </p>
        <div style={{ border: '1px solid var(--panel-border)', borderRadius: '12px', padding: '16px', textAlign: 'left' }}>
          {!onboardingAcknowledged ? (
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={{ marginTop: '2px', flexShrink: 0 }}
                onChange={onAcknowledge}
              />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#1C1814', margin: '0 0 4px' }}>
                  I&apos;ve reviewed my matches and understand how the HavenQuest Navigator works.
                </p>
                <p style={{ fontSize: '12px', color: '#9A8E82', margin: 0 }}>
                  Check this to unlock the button below and begin exploring your full reports.
                </p>
              </div>
            </label>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2D7D4E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#ffffff', fontSize: '10px' }}>✓</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#2D7D4E', margin: 0 }}>
                You&apos;re all set. Your full reports are ready in Explore.
              </p>
            </div>
          )}
          {onboardingAcknowledged && (
            <button
              onClick={onAdvanceToDiscover}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: GOLD,
                color: '#16120D',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Start Exploring →
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
