'use client'

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
  { number: 1,  name: 'Explore',   description: 'Review your personalized city matches and understand your Navigator journey.' },
  { number: 2,  name: 'Discover',  description: 'Dive into full city reports, affordability breakdowns, school data, and matched realtors.' },
  { number: 3,  name: 'Decide',    description: 'Fine-tune your priorities in the sandbox and commit your direction when ready.' },
  { number: 4,  name: 'Connect',   description: 'Your personal Ambassador is assigned and reaches out within 24 hours.' },
  { number: 5,  name: 'Plan',      description: 'Strategy session with your Ambassador — city, zone, timeline, and direction confirmed.' },
  { number: 6,  name: 'Prepare',   description: 'Get pre-approval, insurance, and logistics in place before your realtor introduction.' },
  { number: 7,  name: 'Match',     description: 'Your Ambassador hand-selects three vetted realtors for your zone. You choose.' },
  { number: 8,  name: 'Engage',    description: 'Warm personal introduction to your chosen realtor. They already know your story.' },
  { number: 9,  name: 'Contract',  description: 'Under contract — the finish line is in sight. Your team is with you.' },
  { number: 10, name: 'Home',      description: "Closed. You're home. Your Journey Recap is waiting." },
]

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
  return (
    <div>

      {/* Section 1 — Welcome */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase mb-3" style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Welcome to Your Navigator
        </p>
        <h2 className="text-[22px] font-bold tracking-tight mb-3" style={{ color: WARM_DARK }}>
          {session.firstName}, here&apos;s what we found for you.
        </h2>
        <p className="text-sm leading-relaxed w-full text-justify" style={{ color: '#6B7280' }}>
          Based on your income, household, financial picture, and lifestyle priorities,
          HavenQuest has matched you to the Texas communities where your life fits best.
          Below is your personalized summary. When you&apos;re ready to go deeper,
          your full reports are waiting in Discover.
        </p>
      </div>

      {/* Section 2 — Story city cards */}
      <div className="space-y-4 mb-8">
        {matches.map((match, i) => (
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

      {/* Section 4 — Your Navigator Journey */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase mb-4" style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Your Navigator Journey
        </p>
        <div className="space-y-2">
          {NAVIGATOR_STEPS.map(step => (
            <div key={step.number} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: step.number <= currentMileMarker ? GOLD : '#F0EDE6',
                  color: step.number <= currentMileMarker ? '#16120D' : '#9A8E82',
                }}
              >
                {step.number <= currentMileMarker ? '✓' : step.number}
              </div>
              <div className="flex-1 pt-0.5">
                <span className="text-xs font-bold" style={{ color: '#1C1814' }}>
                  {step.name}
                </span>
                <span className="text-xs ml-2" style={{ color: '#9A8E82' }}>
                  — {step.description}
                </span>
              </div>
            </div>
          ))}
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
              You&apos;re all set. Your full reports are ready in Discover.
            </p>
          </div>
        )}

        {onboardingAcknowledged && (
          <button
            onClick={onAdvanceToDiscover}
            className="w-full mt-4 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: GOLD, color: '#16120D' }}
          >
            Explore My Full Reports → Discover
          </button>
        )}
      </div>

    </div>
  )
}
