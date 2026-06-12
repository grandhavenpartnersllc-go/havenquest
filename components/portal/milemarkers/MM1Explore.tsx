'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Home, Search, Map, Handshake, ClipboardList, Building2, Key, FileText, Calendar, Star, CheckCircle, Circle, PlayCircle } from 'lucide-react'
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
    body: "Dig deeper into your matches. Adjust your priorities and financial picture in real time and watch how your rankings change. Choose up to 3 communities to highlight. When you're ready, commit your direction and your Market Director steps in.",
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
        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '100%', marginBottom: '12px' }}>
          This is your private HavenQuest Navigator — your home base for
          the entire relocation journey. Everything you do here is saved
          and waiting for you when you come back.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '100%' }}>
          You&apos;ve taken the first step. Now let us show you what&apos;s ahead —
          and give you a first look at where your life fits in Texas.
        </p>
      </div>

      {/* Sections reordered: Navigator Journey (order 1) renders before City Teaser (order 2) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Section 3 — City Teaser (renders second) */}
      <div style={{ background: 'var(--color-background-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '2rem', border: '0.5px solid var(--color-border-tertiary)', order: 2 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#B8912A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px' }}>
          Your First Look
        </p>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
          Meet your Texas matches.
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          These communities rose to the top based on everything you told us.
          Take a look — one of these could be where you plant your flag.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {matches.slice(0, 3).map((match, i) => {
            const labels = ['#1 Match', '#2 Match', '#3 Match']
            return (
              <div key={match.location.id} style={{
                borderRadius: '12px',
                border: '0.5px solid var(--color-border-tertiary)',
                background: 'var(--color-background-primary)',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'var(--color-background-tertiary)' }}>
                  <Image
                    src={`/images/cities/${match.location.id}.jpg`}
                    alt={`${match.location.name}, Texas`}
                    fill
                    className="object-cover"
                    onError={(e) => { const t = e.target as HTMLImageElement; if (t.src !== window.location.origin + '/images/cities/default-tx.jpg') { t.src = '/images/cities/default-tx.jpg' } }}
                  />
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 500, color: '#B8912A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {labels[i]}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                    {match.location.name}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
                    {match.location.metroUsed}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Match score</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#B8912A' }}>{match.matchScore}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ borderLeft: '3px solid #B8912A', borderRadius: '0 6px 6px 0', padding: '10px 12px', background: 'rgba(184,145,42,0.04)' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            These are your starting point — and they&apos;re a good one. In
            MileMarker 3, you&apos;ll dial these in with your full financial
            picture and priorities. Your Market Director will take it from there.
          </p>
        </div>
      </div>

      {/* Section 2 — Navigator Journey (Mock Portal, renders first) */}
      <div className="mb-8" style={{ order: 1 }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#B8912A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Your Navigator Journey
          </p>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '12px', lineHeight: 1.3 }}>
            This portal is where you&apos;ll live throughout the entire process.
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '8px' }}>
            From your first city matches all the way to closing day —
            everything happens here. Your progress is saved, your Market
            Director works from this portal, and every step of your
            relocation is tracked in one place.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '4px' }}>
            Your journey unfolds across 10 MileMarkers. Each one has a
            purpose, a set of actions, and a guide.
          </p>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#B8912A', marginBottom: '16px' }}>
            Click any stage below to see what&apos;s included and who&apos;s
            with you at each step. →
          </p>
        </div>

        {/* Mock Portal — Three-Panel Navigator */}
        <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--panel-border)', boxShadow: '0 4px 28px rgba(0,0,0,0.14)' }}>

          {/* Top Command Bar */}
          <div style={{ backgroundColor: 'var(--topbar-bg)', height: '36px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>Haven</span>
            <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-blue)' }}>Quest</span>
            <span style={{ width: '1px', height: '13px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 5px', flexShrink: 0 }} />
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.03em' }}>Navigator Portal</span>
          </div>

          {/* Three-Panel Body */}
          <div style={{ display: 'flex', height: '288px', backgroundColor: 'var(--portal-bg)' }}>

            {/* Journey Rail */}
            <div style={{ width: '128px', flexShrink: 0, backgroundColor: 'var(--panel-bg)', borderRight: '0.5px solid var(--panel-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <p style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', padding: '8px 10px 5px', margin: 0, flexShrink: 0 }}>
                Your Journey
              </p>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {MOCK_TABS.map((tab, i) => {
                  const isActive = activeTab === i
                  const isComplete = i < activeTab
                  const isHome = i === 9
                  const stateIcon = isHome ? (
                    <Home size={10} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                  ) : isComplete ? (
                    <CheckCircle size={10} style={{ color: 'var(--success-color)', flexShrink: 0 }} />
                  ) : isActive ? (
                    <PlayCircle size={10} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                  ) : (
                    <Circle size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  )
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveTab(i)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        width: '100%',
                        paddingTop: '5px',
                        paddingBottom: '5px',
                        paddingRight: '8px',
                        paddingLeft: isActive ? '7px' : '10px',
                        border: 'none',
                        borderLeft: isActive ? '3px solid var(--active-row-border)' : '3px solid transparent',
                        backgroundColor: isActive ? 'var(--active-row-bg)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      {stateIcon}
                      <span style={{
                        fontSize: '9px',
                        fontWeight: isActive ? 600 : isComplete ? 500 : 400,
                        color: isHome ? 'var(--accent-gold)' : isActive ? 'var(--accent-blue)' : isComplete ? 'var(--text-primary)' : 'var(--text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {tab.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Workspace */}
            <div style={{ flex: 1, minWidth: 0, backgroundColor: 'var(--portal-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Workspace header */}
              <div style={{ padding: '8px 12px', borderBottom: '0.5px solid var(--panel-border)', backgroundColor: 'var(--panel-bg)', flexShrink: 0 }}>
                <p style={{ fontSize: '7px', color: 'var(--text-muted)', margin: '0 0 3px', lineHeight: 1 }}>
                  Your journey › <span style={{ color: 'var(--text-secondary)' }}>MM{activeTab + 1} — {MOCK_TABS[activeTab].name}</span>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {MOCK_TABS[activeTab].name}
                  </span>
                  {activeTab < 4 && (
                    <span style={{ fontSize: '7px', fontWeight: 500, color: 'var(--accent-blue)', backgroundColor: 'var(--accent-blue-light)', padding: '2px 6px', borderRadius: '20px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {(['Journey Introduction', 'Community Profile', 'Committed Direction Package', 'Relocation Roadmap'] as const)[activeTab]}
                    </span>
                  )}
                </div>
              </div>
              {/* Workspace content */}
              <div style={{ flex: 1, padding: '10px 12px', overflowY: 'auto' }}>
                {(() => {
                  const entry = TAB_CONTENT[activeTab]
                  const pills = ROLE_CONFIG[entry.role] ?? []
                  return (
                    <>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        {pills.map((pill, pi) => (
                          <span key={pi} style={{ fontSize: '8px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px', backgroundColor: pill.bg, color: pill.color }}>
                            {pill.label}
                          </span>
                        ))}
                      </div>
                      <p style={{ fontSize: '10px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                        {entry.body}
                      </p>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Command Center */}
            <div style={{ width: '128px', flexShrink: 0, backgroundColor: 'var(--panel-bg)', borderLeft: '0.5px solid var(--panel-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <p style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', padding: '8px 10px 5px', margin: 0, flexShrink: 0 }}>
                Command Center
              </p>
              <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

                {/* Journey Status */}
                <div style={{ backgroundColor: 'var(--portal-bg)', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success-color)', flexShrink: 0 }} />
                    <span style={{ fontSize: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>On track</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                    {(() => {
                      const pct = Math.round(((activeTab + 1) / 10) * 100)
                      const r = 14
                      const circ = 2 * Math.PI * r
                      const dash = circ - (pct / 100) * circ
                      return (
                        <svg width="38" height="38" viewBox="0 0 38 38">
                          <circle cx="19" cy="19" r={r} fill="none" stroke="var(--card-border)" strokeWidth="3" />
                          <circle
                            cx="19" cy="19" r={r}
                            fill="none"
                            stroke="var(--accent-blue)"
                            strokeWidth="3"
                            strokeDasharray={String(circ)}
                            strokeDashoffset={String(dash)}
                            strokeLinecap="round"
                            transform="rotate(-90 19 19)"
                          />
                          <text x="19" y="19" textAnchor="middle" dominantBaseline="middle" fontSize={7} fontWeight={700} fill="var(--text-primary)">{pct}%</text>
                        </svg>
                      )
                    })()}
                  </div>
                  <p style={{ fontSize: '7px', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                    <span style={{ color: 'var(--accent-blue)' }}>MM{activeTab + 1} {MOCK_TABS[activeTab].name}</span>
                  </p>
                </div>

                {/* Next Action */}
                <div style={{ backgroundColor: 'var(--accent-blue-light)', borderRadius: '6px', padding: '7px 8px' }}>
                  <p style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent-blue)', margin: '0 0 3px' }}>
                    Next Action
                  </p>
                  <p style={{ fontSize: '8px', color: 'var(--text-primary)', lineHeight: 1.4, margin: 0 }}>
                    {activeTab === 0 ? 'Begin your Navigator journey' :
                     activeTab === 1 ? 'Explore your matched communities' :
                     activeTab === 2 ? 'Select your target community' :
                     activeTab === 3 ? 'Complete your family profile' :
                     'Awaiting your Market Director'}
                  </p>
                </div>

                {/* Your Team */}
                <div>
                  <p style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 5px' }}>
                    Your Team
                  </p>
                  {['Market Director', 'Select Agent', 'Lender'].map(role => (
                    <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--portal-bg)', border: '1px solid var(--card-border)', flexShrink: 0 }} />
                      <span style={{ fontSize: '7px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Pending</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      </div>{/* end flex reorder wrapper */}

      {/* Section 4 — What Makes This Different */}
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#B8912A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
          What Makes HavenQuest Different
        </p>
        <div style={{ background: '#F0EBE1', border: '1px solid #D4C5A9', borderRadius: '12px', padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '16px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.1)', background: '#1C1C1C' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Your data is yours</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Everything you share stays private and powers your personal
              experience. Nothing is sold. Nothing is shared without your consent.
            </p>
          </div>
          <div style={{ padding: '16px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.1)', background: '#1C1C1C' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>A real person joins you</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Once you&apos;ve explored your matches, your personal Market Director
              steps in — already briefed on your profile and ready to guide you
              every step of the way.
            </p>
          </div>
          <div style={{ padding: '16px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.1)', background: '#1C1C1C' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Nothing falls through the cracks</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Your Navigator tracks every step — from community discovery to
              closing day. You always know where you are, what&apos;s done, and
              what&apos;s next.
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Portal ownership statement */}
      <div style={{ background: 'rgba(184,145,42,0.05)', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px', borderLeft: '3px solid #B8912A' }}>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>This is your space.</strong>
          {' '}Come back anytime. Your matches, your financial picture,
          your progress — it&apos;s all here waiting for you. And when your
          Market Director joins you at MileMarker 4, they&apos;ll be working
          from this same portal, seeing exactly what you see.
        </p>
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
