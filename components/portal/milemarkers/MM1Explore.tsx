'use client'

import React, { useState } from 'react'
import { Home, Search, Map, Handshake, ClipboardList, Building2, Key, FileText, Calendar, Star, Lock } from 'lucide-react'
import { CityMatch, UserProfile, UserSession } from '../../../types'

const WARM_DARK = '#16120D'
const GOLD = '#B8912A'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

const MOCK_TABS: Array<{ name: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; locked: boolean }> = [
  { name: 'Welcome',  Icon: Home,          locked: false },
  { name: 'Explore',  Icon: Search,        locked: false },
  { name: 'Discover', Icon: Map,           locked: false },
  { name: 'Connect',  Icon: Handshake,     locked: true  },
  { name: 'Plan',     Icon: ClipboardList, locked: true  },
  { name: 'Prepare',  Icon: Building2,     locked: true  },
  { name: 'Match',    Icon: Key,           locked: true  },
  { name: 'Engage',   Icon: FileText,      locked: true  },
  { name: 'Contract', Icon: Calendar,      locked: true  },
  { name: 'Home',     Icon: Star,          locked: true  },
]

const TAB_CONTENT = [
  {
    headline: 'Welcome to your Navigator.',
    body: 'This is your private HavenQuest portal — your home base for the entire relocation journey. Everything you do here is saved and waiting for you when you come back. Start by exploring your Texas city matches in the next step.',
    role: 'Your first step',
  },
  {
    headline: 'Discover your top Texas matches.',
    body: 'Answer four quick questions about your income, household, financial picture, and priorities. The HavenQuest intelligence platform scores all 101 Texas communities and surfaces your top matches — the places where your life genuinely fits.',
    role: 'You + the platform',
  },
  {
    headline: 'Refine your direction.',
    body: "Dig deeper into your matches. Adjust your priorities and financial picture in real time and watch how your rankings change. Choose up to 2 communities to highlight. When you're ready, commit your direction and your Market Director steps in.",
    role: 'You + the platform',
  },
  {
    headline: 'Meet your Market Director.',
    body: 'Your personal Market Director reviews your full profile and reaches out within 24 hours. They know your priorities, your budget, and your target communities before the first call. This is where the human guidance begins.',
    role: 'Market Director',
  },
  {
    headline: 'Narrow your communities.',
    body: "Your Market Director helps you refine your shortlist to specific neighborhoods and introduces you to a lender for pre-qualification. By the end of this stage you know exactly where you're headed and what you can spend.",
    role: 'You + Market Director',
  },
  {
    headline: 'Meet your Select Agent.',
    body: "Your Market Director personally introduces you to a vetted HavenQuest Select Agent in your target market. They've already read your profile. Your first conversation picks up where your Market Director left off.",
    role: 'Market Director + Select Agent',
  },
  {
    headline: 'Find your home.',
    body: 'Your Select Agent schedules showings in your target communities. Properties you tour appear in your Property Decision Workspace — with financial comparisons, lifestyle alignment scores, and space for your notes and theirs.',
    role: 'Select Agent + Market Director',
  },
  {
    headline: 'Make your move.',
    body: 'When you find the right home, your Select Agent prepares and submits your offer. Your Market Director keeps your portal checklist current and stays by your side through inspection, appraisal, and option period decisions.',
    role: 'Select Agent + Market Director',
  },
  {
    headline: 'Close with confidence.',
    body: 'Your Market Director coordinates every piece of the closing process — insurance, movers, utilities, school enrollment, change of address. Nothing falls through the cracks. You arrive in Texas prepared and ready.',
    role: 'You + Market Director + Select Agent',
  },
  {
    headline: "You're home in Texas.",
    body: 'Your Market Director delivers your Welcome Home moment and schedules a 30-day check-in to make sure everything is going well. Your Lone Star Lifestyle™ begins here.',
    role: 'Journey complete',
  },
]

const ROLE_CONFIG: Record<string, Array<{ label: React.ReactNode; color: string; bg: string }>> = {
  'Your first step':              [{ label: 'Your first step',   color: '#B8912A', bg: 'rgba(184,145,42,0.15)' }],
  'You + the platform':           [{ label: 'You + the platform', color: '#1D9E75', bg: 'rgba(29,158,117,0.12)' }],
  'Market Director':              [{ label: 'Market Director',    color: '#B8912A', bg: 'rgba(184,145,42,0.15)' }],
  'You + Market Director':        [
    { label: 'You',              color: '#1D9E75', bg: 'rgba(29,158,117,0.12)' },
    { label: 'Market Director',  color: '#B8912A', bg: 'rgba(184,145,42,0.15)' },
  ],
  'Market Director + Select Agent': [
    { label: 'Market Director',  color: '#B8912A', bg: 'rgba(184,145,42,0.15)' },
    { label: 'Select Agent',     color: '#185FA5', bg: 'rgba(24,95,165,0.12)' },
  ],
  'Select Agent + Market Director': [
    { label: 'Select Agent',     color: '#185FA5', bg: 'rgba(24,95,165,0.12)' },
    { label: 'Market Director',  color: '#B8912A', bg: 'rgba(184,145,42,0.15)' },
  ],
  'You + Market Director + Select Agent': [
    { label: 'You',              color: '#1D9E75', bg: 'rgba(29,158,117,0.12)' },
    { label: 'Market Director',  color: '#B8912A', bg: 'rgba(184,145,42,0.15)' },
    { label: 'Select Agent',     color: '#185FA5', bg: 'rgba(24,95,165,0.12)' },
  ],
  'Journey complete':             [{ label: <><Star size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} />Journey complete</>, color: '#E8E2D9', bg: '#16120D' }],
}


interface MM1ExploreProps {
  matches: CityMatch[]
  profile: UserProfile
  session: UserSession
  currentMileMarker: number
  onAdvanceToDiscover: () => void
  onboardingAcknowledged: boolean
  onAcknowledge: () => void
}

export default function MM1Explore({
  matches,
  profile,
  session,
  currentMileMarker,
  onAdvanceToDiscover,
  onboardingAcknowledged,
  onAcknowledge,
}: MM1ExploreProps) {
  const [activeTab, setActiveTab] = useState(0)
  const firstName = session?.firstName || 'there'

  return (
    <div>

      {/* Section 1 — Personal Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#B8912A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Welcome to Your Navigator
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px', lineHeight: 1.3 }}>
          Welcome{firstName !== 'there' ? `, ${firstName}` : ''}. Your Texas journey starts here.
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '600px', marginBottom: '12px' }}>
          This is your private HavenQuest Navigator — your home base for
          the entire relocation journey. Everything you do here is saved
          and waiting for you when you come back.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '600px' }}>
          You&apos;ve taken the first step. Now let us show you what&apos;s ahead —
          and give you a first look at where your life fits in Texas.
        </p>
      </div>

      {/* Section 2 — City Teaser */}
      <div style={{ background: 'var(--color-background-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '2rem', border: '0.5px solid var(--color-border-tertiary)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#B8912A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px' }}>
          Your First Look
        </p>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
          Your preliminary Texas matches
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          Based on what you told us, here&apos;s where your life fits in Texas
          right now. These are your first impressions — what the data is
          telling us at this stage.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {matches.slice(0, 3).map((match, i) => {
            const labels = ['Top Pick', 'Runner-Up', 'Strong Alt']
            return (
              <div key={match.location.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px',
                background: i === 0 ? '#16120D' : 'var(--color-background-primary)',
                borderRadius: '8px',
                border: '0.5px solid var(--color-border-tertiary)',
              }}>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 500, color: i === 0 ? '#B8912A' : 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    {labels[i]}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: i === 0 ? '#E8E2D9' : 'var(--color-text-primary)' }}>
                    {match.location.name}
                  </p>
                  <p style={{ fontSize: '12px', color: i === 0 ? 'rgba(232,226,217,0.5)' : 'var(--color-text-tertiary)' }}>
                    {match.location.metroUsed}
                  </p>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: i === 0 ? '#B8912A' : 'var(--color-text-secondary)' }}>
                  {match.matchScore}%
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ borderLeft: '3px solid #B8912A', borderRadius: '0 6px 6px 0', padding: '10px 12px', background: 'rgba(184,145,42,0.04)' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>These are your starting point — not your final answer.</strong>
            {' '}In MileMarker 3 — Discover — you&apos;ll dial these in. Adjust your
            priorities, refine your financial picture, and choose the communities
            you want to explore with your Market Director. What you see here
            is just the beginning.
          </p>
        </div>
      </div>

      {/* Section 3 — Navigator Journey (Mock Portal) */}
      <div className="mb-8">
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#B8912A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Your Navigator Journey
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Your journey unfolds across 10 MileMarkers — from your first city
            matches all the way to closing day. Click each stage below to
            explore what&apos;s ahead and who&apos;s with you at each step.
          </p>
        </div>

        {/* Mock Portal */}
        <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 28px rgba(0,0,0,0.14)' }}>

          {/* Mock Nav Bar */}
          <div style={{ backgroundColor: '#16120D', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#E8E2D9', letterSpacing: '-0.01em' }}>Haven</span>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#B8912A', letterSpacing: '-0.01em' }}>Quest</span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#B8912A', letterSpacing: '0.2em', textTransform: 'uppercase', marginLeft: '3px' }}>Navigator</span>
          </div>

          {/* Tab Bar */}
          <div style={{ position: 'relative', backgroundColor: '#1C1814', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Phase label — purely decorative, non-interactive */}
          <span style={{ position: 'absolute', top: '3px', left: '50%', transform: 'translateX(-50%)', fontSize: '8px', color: '#6B6560', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 1 }}>
            → Property Decision
          </span>
          <div style={{ display: 'flex', alignItems: 'stretch', overflowX: 'auto' }}>

            {/* MM1–MM5 (unlocked) */}
            {MOCK_TABS.slice(0, 5).map((tab, i) => {
              const isActive = activeTab === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  style={{
                    padding: '10px 11px',
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#B8912A' : '#9A8E82',
                    borderBottom: isActive ? '2px solid #B8912A' : '2px solid transparent',
                    background: 'transparent',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                  }}
                >
                  <tab.Icon size={14} style={{ verticalAlign: 'middle' }} />
                  <span>{tab.name}</span>
                </button>
              )
            })}

            {/* Phase divider — vertical line only, non-interactive */}
            <div style={{ width: '1px', alignSelf: 'stretch', margin: '6px 4px', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />

            {/* MM6–MM10 (locked) */}
            {MOCK_TABS.slice(5).map((tab, i) => {
              const tabIndex = i + 5
              const isActive = activeTab === tabIndex
              return (
                <button
                  key={tabIndex}
                  type="button"
                  onClick={() => setActiveTab(tabIndex)}
                  style={{
                    padding: '10px 11px',
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#B8912A' : '#6B6560',
                    borderBottom: isActive ? '2px solid #B8912A' : '2px solid transparent',
                    background: 'transparent',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                  }}
                >
                  <Lock size={12} style={{ opacity: 0.5, verticalAlign: 'middle' }} />
                  <tab.Icon size={14} style={{ verticalAlign: 'middle' }} />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </div>
          </div>

          {/* Content Area */}
          <div style={{ backgroundColor: CARD_BG, padding: '20px 20px 24px', minHeight: '180px' }}>
            {(() => {
              const tab = TAB_CONTENT[activeTab]
              const pills = ROLE_CONFIG[tab.role] ?? []
              const TabIcon = MOCK_TABS[activeTab].Icon
              return (
                <>
                  <div style={{ marginBottom: '8px' }}><TabIcon size={24} /></div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: WARM_DARK, marginBottom: '10px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                    {tab.headline}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {pills.map((pill, pi) => (
                      <span key={pi} style={{
                        fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                        backgroundColor: pill.bg, color: pill.color,
                      }}>
                        {pill.label}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: 1.65, color: '#4B5563', margin: 0 }}>
                    {tab.body}
                  </p>
                </>
              )
            })()}
          </div>

        </div>
      </div>

      {/* Section 4 — What Makes This Different */}
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#B8912A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
          What Makes HavenQuest Different
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '16px', borderRadius: '10px', border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>Your data is yours</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Everything you share stays private and powers your personal
              experience. Nothing is sold. Nothing is shared without your consent.
            </p>
          </div>
          <div style={{ padding: '16px', borderRadius: '10px', border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>A real person joins you</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              At MileMarker 4, your personal Market Director steps in. They&apos;ve
              already read your profile and are ready to guide you the rest
              of the way.
            </p>
          </div>
          <div style={{ padding: '16px', borderRadius: '10px', border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>Nothing falls through the cracks</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Your Navigator tracks every step — from community discovery to
              closing day. You always know where you are, what&apos;s done, and
              what&apos;s next.
            </p>
          </div>
        </div>
      </div>

      {/* Section 5 — Ready to Begin CTA */}
      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '0.5px solid var(--color-border-tertiary)', marginTop: '1rem' }}>
        <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
          Ready to explore your matches in depth?
        </p>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          MileMarker 2 is where your full city reports and affordability
          breakdown are waiting.
        </p>
        {/* Advance button */}
        <div className="rounded-xl border p-4" style={{ borderColor: '#E5E7EB' }}>
        {!onboardingAcknowledged ? (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 shrink-0"
              onChange={onAcknowledge}
            />
            <div>
              <p className="text-sm font-medium" style={{ color: '#1C1814' }}>
                I&apos;ve reviewed my matches and understand how the HavenQuest Navigator works.
              </p>
              <p className="text-xs mt-1" style={{ color: '#9A8E82' }}>
                Check this to unlock the button below and begin exploring your full reports.
              </p>
            </div>
          </label>
        ) : (
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#2D7D4E' }}
            >
              <span className="text-white text-[10px]">✓</span>
            </div>
            <p className="text-sm font-medium" style={{ color: '#2D7D4E' }}>
              You&apos;re all set. Your full reports are ready in Explore.
            </p>
          </div>
        )}

        {onboardingAcknowledged && (
          <button
            onClick={onAdvanceToDiscover}
            className="w-full mt-4 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: GOLD, color: '#16120D' }}
          >
            Start Exploring →
          </button>
        )}
        </div>
      </div>

    </div>
  )
}
