'use client'

import { useState } from 'react'
import { CityMatch, UserProfile, UserSession } from '../../../types'
import { LIFESTYLE_CATEGORIES } from '../../../utils/constants'
import { formatCurrency } from '../../../utils/formatting'

const WARM_DARK = '#16120D'
const GOLD = '#B8912A'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'
const RANK_LABELS = ['Top Pick', 'Runner-Up', 'Strong Alt']

// TODO: Phase 2 — dynamic narrative generation via Anthropic API
const FALLBACK_NARRATIVE = "This community matched your priorities and financial profile. Your full report in Discover includes detailed lifestyle scores, school data, affordability breakdown, and matched realtors to help you evaluate this city in depth."

const NAVIGATOR_STEPS = [
  { number: 1,  name: 'Welcome',   description: 'This is where it all began. You told us what matters. We got to work.' },
  { number: 2,  name: 'Explore',   description: "Spread out the map. Flip through your matched city reports, explore affordability numbers, school ratings, and market conditions. Dream a little. This is your brochure phase — and there's no rush. Pay attention to what moves you, because in your next step you'll get to dial it all in." },
  { number: 3,  name: 'Discover',  description: "Time to load up the car. You've explored the options — now you're narrowing in. Use the sandbox to move your priorities around, adjust your financial picture, and watch your city matches respond in real time. When the right picture emerges, your Market Director jumps in as your copilot and the journey shifts into gear." },
  { number: 4,  name: 'Connect',   description: "Your personal Market Director is about to step in — and they've already read everything. No \"tell me about yourself.\" Just real guidance from someone genuinely in your corner." },
  { number: 5,  name: 'Plan',      description: "This is where the map gets drawn. You and your Market Director talk it through — city, zone, timeline, budget. You'll hang up with a clear direction and someone who knows exactly how to get you there." },
  { number: 6,  name: 'Prepare',   description: "Before you meet your Select Agent, let's make sure everything's in place. Financing locked. Insurance sorted. Timeline confirmed. You'll walk into that introduction ready — and it'll show." },
  { number: 7,  name: 'Match',     description: 'Your Market Director hand-picks three exceptional Select Agents for your zone. Not a list. Not an algorithm. Three real professionals chosen specifically for you. You pick who feels right.' },
  { number: 8,  name: 'Engage',    description: "The introduction you've been building toward. Your Market Director makes it personal — and your Select Agent already knows your story before you ever speak. This is a different kind of real estate experience." },
  { number: 9,  name: 'Contract',  description: 'You found it. The right home, in the right place. Going under contract is one of the best feelings in the world — and your whole team is right there celebrating with you.' },
  { number: 10, name: 'Home',      description: "You're home. Everything you hoped for when this journey started — it happened. HavenQuest celebrates with you. And when you're ready, your Journey Recap is waiting to tell the whole story." },
]

const MOCK_TABS = [
  { name: 'Welcome',  icon: '🏠', locked: false },
  { name: 'Explore',  icon: '🔍', locked: false },
  { name: 'Discover', icon: '🗺️', locked: false },
  { name: 'Connect',  icon: '🤝', locked: true  },
  { name: 'Plan',     icon: '📋', locked: true  },
  { name: 'Prepare',  icon: '🏘️', locked: true  },
  { name: 'Match',    icon: '🔑', locked: true  },
  { name: 'Engage',   icon: '📝', locked: true  },
  { name: 'Contract', icon: '🗓️', locked: true  },
  { name: 'Home',     icon: '⭐', locked: true  },
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

const ROLE_CONFIG: Record<string, Array<{ label: string; color: string; bg: string }>> = {
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
  'Journey complete':             [{ label: '⭐ Journey complete', color: '#E8E2D9', bg: '#16120D' }],
}

function getBuyerSegment(profile: UserProfile): string {
  const income = profile.annualIncome
  if (income >= 300000) return 'Estate'
  if (income >= 200000) return 'Luxury'
  if (income >= 130000) return 'High'
  if (income >= 80000) return 'Mid-Market'
  return 'Starter'
}

function buildMatchNarrative(profile: UserProfile, matches: CityMatch[]): string {
  const topCity = matches[0]?.location.name ?? 'your top match'
  const segment = getBuyerSegment(profile)
  const mustHaveLabels = profile.mustHaves
    .map(k => LIFESTYLE_CATEGORIES.find(c => c.key === k)?.label ?? k)
    .join(', ')
  const income = profile.annualIncome.toLocaleString()

  const householdMap: Record<string, string> = {
    '1':   'an individual',
    '2':   'a couple',
    '3-4': 'a small family',
    '5+':  'a growing family',
  }
  const household = householdMap[profile.householdSize] ?? 'your household'

  return `Based on your priorities — ${mustHaveLabels} — and a household income of $${income}, we focused on Texas communities that deliver where it matters most to you. Your financial picture places you in the ${segment} buyer segment. As ${household}, ${topCity} emerged as your strongest match across all criteria. The three cities below consistently outperformed the rest of our 101-city database for your specific profile.`
}

function StoryCityCard({ match, rank }: { match: CityMatch; rank: number }) {
  const imageUrl = match.location.cityImageUrl ?? '/images/texas-flag.svg'
  // TODO: Phase 2 — dynamic narrative generation via Anthropic API
  const narrative = match.location.cityNarrative ?? FALLBACK_NARRATIVE

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col sm:flex-row"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}
    >
      {/* Image — left on desktop, top on mobile */}
      <div
        className="sm:w-2/5 h-48 sm:h-auto relative shrink-0"
        style={{ minHeight: '200px' }}
      >
        <img
          src={imageUrl}
          alt={match.location.name}
          className="w-full h-full object-cover"
        />
        {/* Rank badge over image */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
          style={{
            backgroundColor: rank === 0 ? GOLD : 'rgba(0,0,0,0.55)',
            color: rank === 0 ? '#16120D' : '#FFFFFF',
            letterSpacing: '0.12em',
            backdropFilter: 'blur(4px)',
          }}
        >
          {RANK_LABELS[rank]}
        </div>
        {/* Match score badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{
            backgroundColor: 'rgba(0,0,0,0.55)',
            color: '#FFFFFF',
            backdropFilter: 'blur(4px)',
          }}
        >
          {match.matchScore}% match
        </div>
      </div>

      {/* Story content — right on desktop, bottom on mobile */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3
            className="text-[20px] font-bold tracking-tight mb-0.5"
            style={{ color: WARM_DARK }}
          >
            {match.location.name}
          </h3>
          <p className="text-xs font-medium mb-4" style={{ color: '#1A5FA8' }}>
            {match.location.metroUsed} · {match.location.county} County, TX
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
            {narrative}
          </p>
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #F0EDE6' }}>
          <p className="text-xs" style={{ color: '#9A8E82' }}>
            Est. {formatCurrency(match.estimatedMonthlyTotal)}/mo all-in ·{' '}
            <span style={{ color: '#9A8E82' }}>
              Full reports available in Discover
            </span>
          </p>
        </div>
      </div>
    </div>
  )
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

  return (
    <div>

      {/* Section 1 — Welcome */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase mb-3" style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Welcome to Your Navigator Journey
        </p>
        <h2 className="text-[22px] font-bold tracking-tight mb-3" style={{ color: WARM_DARK }}>
          {session.firstName}, your Texas story starts right here.
        </h2>
        {/* Build personalized welcome paragraph */}
        {(() => {
          const topCity = matches[0]?.location.name ?? 'your top match'
          const income = profile.annualIncome
            ? `$${profile.annualIncome.toLocaleString()}`
            : null
          const mustHaveLabels = profile.mustHaves
            .slice(0, 2)
            .map(k => LIFESTYLE_CATEGORIES.find(c => c.key === k)?.label ?? k)
          const householdMap: Record<string, string> = {
            '1': 'just you',
            'just-me': 'just you',
            'couple': 'the two of you',
            'small-family': 'your family',
            'growing-family': 'your growing family',
            'multigenerational': 'your household',
            '2': 'the two of you',
            '3-4': 'your family',
            '5+': 'your household',
          }
          const household = householdMap[profile.householdSize] ?? 'your household'
          const priorityText = mustHaveLabels.length > 0
            ? ` Your Must Haves — ${mustHaveLabels.join(' and ')} — guided everything.`
            : ''

          const parts = [
            `We've been busy.`,
            income
              ? `Based on what you told us about ${household}, a ${income} income, and what matters most to you,`
              : `Based on everything you told us about ${household} and what matters most to you,`,
            `we matched you to the Texas communities where your life fits best.${priorityText}`,
            `Your top match is ${topCity} — and honestly — we're pretty excited about it.`,
            `Below is your personalized summary. When you're ready to go even deeper, your full reports, real numbers, and matched Select Agents are all waiting in Discover.`,
            `Let's go find your home.`,
          ]

          return (
            <p className="text-sm leading-relaxed w-full" style={{ color: '#6B7280' }}>
              {parts.join(' ')}
            </p>
          )
        })()}
      </div>

      {/* Section 2 — Story city cards */}
      <div className="space-y-4 mb-8">
        {matches.slice(0, 3).map((match, i) => (
          <StoryCityCard
            key={match.location.id}
            match={match}
            rank={i}
          />
        ))}
      </div>

      {/* Section 3 — What We Found For You */}
      <div className="rounded-xl p-4 mb-8" style={{ backgroundColor: '#F7F6F3' }}>
        <p className="text-[10px] font-bold uppercase mb-2" style={{ color: GOLD, letterSpacing: '0.16em' }}>
          What We Found For You
        </p>
        <p className="text-sm leading-relaxed text-justify" style={{ color: '#4B5563' }}>
          {buildMatchNarrative(profile, matches)}
        </p>
      </div>

      {/* Section 4 — Mock Portal Orientation */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase mb-3" style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Your Navigator Journey
        </p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
          Your journey unfolds across 10 MileMarkers — from your first city matches all the way to closing day.
          Click each stage below to explore what&apos;s ahead.
        </p>

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
                  <span>{tab.icon}</span>
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
                  <span style={{ fontSize: '9px', opacity: 0.5 }}>🔒</span>
                  <span>{tab.icon}</span>
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
              return (
                <>
                  <div style={{ fontSize: '28px', marginBottom: '8px', lineHeight: 1 }}>{MOCK_TABS[activeTab].icon}</div>
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

      {/* Section 5 — Onboarding acknowledgment */}
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
  )
}
