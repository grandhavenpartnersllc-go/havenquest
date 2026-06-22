'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, PlayCircle } from 'lucide-react'
import type { UserSession } from '../../../types'

const GOLD = '#B8912A'
const BLUE = '#0076B6'

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

const WHY_THIS_MATTERS: Record<number, string> = {
  2: 'Reviewing your matched communities helps us understand which Texas cities truly fit your household, budget, and priorities — so every step after this is built on the right foundation.',
  3: 'Committing to a target city gives your Market Director the clarity they need to guide you toward the right neighborhoods, schools, and price range.',
  4: 'Meeting your Market Director kicks off the part of this journey where a real person — not just a portal — is working on your behalf.',
  5: 'Building your relocation strategy now means fewer surprises later, from timing your move to budgeting for it.',
  6: 'Getting financially and logistically ready protects you from the rushed decisions that cause most relocation regret.',
  7: 'Meeting your Select Agent connects you with someone who knows your target city block by block.',
  8: 'Starting your home search with everything else already in place means you can move quickly when the right home shows up.',
  9: 'Going under contract is the step where your preparation pays off — every prior MileMarker exists to make this moment smooth.',
  10: 'Closing is the finish line. Everything before this was built to get you here with confidence.',
}

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
  onAcknowledge,
  onAdvanceToDiscover,
}: MM1ExploreProps) {
  const firstName = session?.firstName || 'there'
  const [showFullJourney, setShowFullJourney] = useState(false)
  const isRevisiting = currentMileMarker > 1
  const currentStage = MILEMARKERS.find(m => m.mm === currentMileMarker) ?? MILEMARKERS[0]
  const nextStage = isRevisiting ? currentStage : MILEMARKERS[1]
  const whyMatters = WHY_THIS_MATTERS[nextStage.mm] ?? `${nextStage.what} — every MileMarker builds on the one before it.`

  function handleBeginJourney() {
    onAcknowledge()
    onAdvanceToDiscover()
  }

  return (
    <div>

      {/* Hero — conditional on first-time vs. returning visitor */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
          {isRevisiting ? 'Welcome Back' : 'Welcome to Your Navigator'}
        </p>

        {isRevisiting ? (
          <>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', lineHeight: 1.3 }}>
              Welcome back, {firstName}.
            </h1>
            <div style={{ border: `1.5px solid ${BLUE}`, borderRadius: '14px', padding: '20px', backgroundColor: 'var(--accent-blue-light)', marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: BLUE, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                Your Next Step
              </p>
              <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                {currentStage.name} — {currentStage.what}
              </p>
            </div>
            <Link
              href={`/portal/mm${currentMileMarker}`}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: GOLD,
                color: '#16120D',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Continue Your Journey →
            </Link>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', lineHeight: 1.3 }}>
              Welcome{firstName !== 'there' ? `, ${firstName}` : ''}. Your Texas journey starts here.
            </h1>

            {/* Welcome video placeholder — structured as if a real embed will replace it */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: '14px',
              backgroundColor: '#0A1E3D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              overflow: 'hidden',
            }}>
              <PlayCircle size={56} style={{ color: 'rgba(255,255,255,0.85)' }} />
            </div>

            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
              This is your private HavenQuest Navigator — your home base for the entire relocation process. Your journey unfolds across 10 MileMarkers, each with a clear purpose and the right people in place to help you move forward. Everything you do here is saved, and your team works alongside you from right here.
            </p>

            <button
              type="button"
              onClick={handleBeginJourney}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: GOLD,
                color: '#16120D',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Begin Your Journey →
            </button>
          </>
        )}
      </div>

      {/* Why This Matters */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
          Why This Matters
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          {whyMatters}
        </p>
      </div>

      {/* Journey Confidence */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
          Journey Confidence
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          You&apos;re on track. Your relocation journey is progressing normally — take it one MileMarker at a time.
        </p>
      </div>

      {/* Your Team — reassurance, not a populated MD profile */}
      <div style={{ marginBottom: '2rem', border: '1px solid var(--panel-border)', borderRadius: '12px', padding: '16px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Your Team
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          As your journey progresses, you&apos;ll be connected with trusted professionals who will help guide your relocation, including a Market Director, lender, and local real estate expert.
        </p>
      </div>

      {/* Full 10-step journey — collapsed by default, not a progress tracker */}
      <div style={{ marginBottom: '1rem' }}>
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

    </div>
  )
}
