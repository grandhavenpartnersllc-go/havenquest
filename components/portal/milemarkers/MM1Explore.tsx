'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { UserSession } from '../../../types'

const GOLD = '#B8912A'
const BLUE = '#0076B6'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

const MILEMARKERS = [
  { mm: 1,  name: 'Welcome',  what: "You're here — get oriented" },
  { mm: 2,  name: 'Discover', what: 'Review your matched Texas communities' },
  { mm: 3,  name: 'Refine',   what: 'Commit to your target city' },
  { mm: 4,  name: 'Connect',  what: 'Meet your Market Director' },
  { mm: 5,  name: 'Plan',     what: 'Build your relocation strategy' },
  { mm: 6,  name: 'Prepare',  what: 'Get financially and logistically ready' },
  { mm: 7,  name: 'Match',    what: 'Meet your HavenQuest Select Agent' },
  { mm: 8,  name: 'Engage',   what: 'Start your home search' },
  { mm: 9,  name: 'Transition', what: 'Go under contract' },
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
  const [showFullJourney, setShowFullJourney] = useState(false)
  const isRevisiting = currentMileMarker > 1
  const currentStage = MILEMARKERS.find(m => m.mm === currentMileMarker) ?? MILEMARKERS[0]

  return (
    <div>

      {/* Section 1 — WELCOME TO YOUR NAVIGATOR */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Welcome to Your Navigator
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
            Welcome{firstName !== 'there' ? `, ${firstName}` : ''}. Your Texas journey starts here.
          </h1>
          {isRevisiting && (
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--panel-border)',
              padding: '4px 10px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              ✓ You&apos;ve already completed this step
            </span>
          )}
        </div>
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

        {/* Compact stepper — 5 per row, always 2 rows for 10 items */}
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px' }}>
          {MILEMARKERS.map(({ mm }, i) => {
            const isComplete = mm < currentMileMarker
            const isActive = mm === currentMileMarker
            const isRowEnd = i % 5 === 4
            const isLast = i === MILEMARKERS.length - 1
            return (
              <div
                key={mm}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: '0 0 20%',
                  paddingBottom: '14px',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: isComplete || isActive ? BLUE : 'var(--card-bg)',
                  border: `2px solid ${isComplete || isActive ? BLUE : 'var(--card-border)'}`,
                  boxShadow: isActive ? '0 0 0 4px rgba(0,118,182,0.18)' : 'none',
                  color: isComplete || isActive ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}>
                  {isComplete ? '✓' : mm}
                </div>
                {!isLast && !isRowEnd && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: isComplete ? BLUE : 'var(--card-border)',
                    marginLeft: '6px',
                    marginRight: '6px',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Current stage callout */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {currentStage.mm} · {currentStage.name}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            — {currentStage.what}
          </span>
        </div>

        {/* See full journey — collapsed by default */}
        <button
          type="button"
          onClick={() => setShowFullJourney(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginBottom: showFullJourney ? '12px' : 0 }}
        >
          <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>
            See full journey
          </span>
          {showFullJourney
            ? <ChevronDown size={14} style={{ color: GOLD }} />
            : <ChevronRight size={14} style={{ color: GOLD }} />}
        </button>

        <div style={{
          overflow: 'hidden',
          maxHeight: showFullJourney ? '1000px' : '0px',
          opacity: showFullJourney ? 1 : 0,
          transition: 'max-height 0.3s ease, opacity 0.2s ease',
        }}>
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
      </div>

      {/* Section 3 — WHAT'S WAITING FOR YOU */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
          What's Waiting for You
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          Your city matches are ready in your next step — Discover. They were built from everything you told us — your income, your household, your priorities. Take your time reviewing them. There&apos;s no rush.
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          When you&apos;re ready, click{' '}
          <Link href="/portal/mm2" style={{ color: '#0076B6', fontWeight: 600, textDecoration: 'none' }}>
            Discover
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
                  I&apos;ve read through the Navigator overview and I&apos;m ready to explore my Texas communities.
                </p>
                <p style={{ fontSize: '12px', color: '#9A8E82', margin: 0 }}>
                  Check this to continue to Discover — MileMarker 2 — where your city matches are waiting.
                </p>
              </div>
            </label>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2D7D4E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#ffffff', fontSize: '10px' }}>✓</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#2D7D4E', margin: 0 }}>
                You&apos;re all set. Your full reports are ready in Discover.
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
              Start Discovering →
            </button>
          )}
        </div>
      </div>

      {/* Sticky CTA bar — keeps the acknowledge/advance action visible without scrolling */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        marginLeft: '-24px',
        marginRight: '-24px',
        marginBottom: '-24px',
        zIndex: 5,
      }}>
        <div style={{
          backgroundColor: CARD_BG,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          boxShadow: CARD_SHADOW,
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          {!onboardingAcknowledged ? (
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                onChange={onAcknowledge}
                style={{ flexShrink: 0 }}
              />
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#1C1814' }}>
                Ready to see your matches?
              </span>
            </label>
          ) : (
            <>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#2D7D4E' }}>
                ✓ You&apos;re all set
              </span>
              <button
                onClick={onAdvanceToDiscover}
                style={{
                  padding: '8px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: GOLD,
                  color: '#16120D',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Start Discovering →
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  )
}
