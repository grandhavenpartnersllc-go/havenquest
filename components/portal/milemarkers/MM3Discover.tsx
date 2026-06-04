'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CityMatch, UserProfile, UserSession, SandboxProfile, LifestyleScores } from '../../../types'
import { LIFESTYLE_CATEGORIES } from '../../../utils/constants'
import { CATEGORY_ICONS } from '../../../utils/categoryIcons'
import { getAllCities } from '../../../services/locationService'
import { getTopMatches, getDownPaymentMidpoint, getProceedsMidpoint, calculateMonthlyPayment } from '../../../services/matchingService'
import { createClient } from '../../../lib/supabase/client'

// calculateMonthlyPayment exported for external use; MM3 computes inline with dynamic interestRate
void calculateMonthlyPayment

const WARM_DARK = '#16120D'
const GOLD = '#B8912A'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

const ALL_CATEGORY_KEYS = LIFESTYLE_CATEGORIES.map(c => c.key)

const DOWN_PAYMENT_OPTIONS = [
  'Under $20,000',
  '$20,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000 – $200,000',
  '$200,000 – $500,000',
  '$500,000+',
  "I'm not sure yet",
]

const METRO_OPTIONS = [
  { label: 'Austin',      value: 'Austin' },
  { label: 'DFW',         value: 'Dallas' },
  { label: 'Houston',     value: 'Houston' },
  { label: 'San Antonio', value: 'San Antonio' },
]

// Current market rate data — update quarterly
// Source: Freddie Mac PMMS, May 28, 2026
const RATE_MARKET_LOW = 6.25
const RATE_MARKET_HIGH = 7.00
const RATE_MARKET_AVG = 6.53
const RATE_DATA_DATE = 'May 2026'
const RATE_DEFAULT = 6.75

function getRateZone(rate: number): 'low' | 'market' | 'high' {
  if (rate < RATE_MARKET_LOW) return 'low'
  if (rate <= RATE_MARKET_HIGH) return 'market'
  return 'high'
}

const PROCEEDS_OPTIONS = [
  'Under $50,000',
  '$50,000 – $100,000',
  '$100,000 – $200,000',
  '$200,000 – $350,000',
  '$350,000 – $500,000',
  '$500,000 – $750,000',
  '$750,000+',
  "I'm not sure yet",
]

type BucketKey = 'mustHaves' | 'niceToHaves' | 'notPriorities' | 'unassigned'

interface MM3DiscoverProps {
  matches: CityMatch[]
  profile: UserProfile | null
  session: UserSession
  onAdvanceToConnect: () => void
  initialMetro?: string
  initialCityIndex?: number
}

export default function MM3Discover({ matches, profile, session, initialMetro, initialCityIndex }: MM3DiscoverProps) {
  const router = useRouter()
  const [downPayment, setDownPayment] = useState<string>(
    profile?.financial_picture?.down_payment_available ?? '$20,000 – $50,000'
  )
  const [proceeds, setProceeds] = useState<string | null>(
    profile?.financial_picture?.home_sale_proceeds ?? null
  )
  // interestRate is stored and displayed but does not affect ranking math.
  // matchingService.ts uses a hardcoded 7.0% rate. Full interest rate integration is Phase 2.
  const [interestRate, setInterestRate] = useState<number>(RATE_DEFAULT)

  const [mustHaves, setMustHaves] = useState<(keyof LifestyleScores)[]>(
    profile?.mustHaves ?? []
  )
  const [niceToHaves, setNiceToHaves] = useState<(keyof LifestyleScores)[]>(
    profile?.niceToHaves ?? []
  )
  const [notPriorities, setNotPriorities] = useState<(keyof LifestyleScores)[]>(
    profile?.notPriorities ?? []
  )
  const [unassigned, setUnassigned] = useState<(keyof LifestyleScores)[]>(
    ALL_CATEGORY_KEYS.filter(k =>
      !profile?.mustHaves.includes(k) &&
      !profile?.niceToHaves.includes(k) &&
      !profile?.notPriorities.includes(k)
    )
  )

  const [committed, setCommitted] = useState(false)
  const [committing, setCommitting] = useState(false)
  const [flashBucket, setFlashBucket] = useState<string | null>(null)
  const [cityPopup, setCityPopup] = useState<CityMatch | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [selectedCityIndex, setSelectedCityIndex] = useState(initialCityIndex ?? 0)
  const [sandboxTouched, setSandboxTouched] = useState(false)
  const [preferredCity, setPreferredCity] = useState<string | null>(null)

  const [selectedMetro, setSelectedMetro] = useState<string>('')

  useEffect(() => {
    if (!profile) return
    setMustHaves(profile.mustHaves ?? [])
    setNiceToHaves(profile.niceToHaves ?? [])
    setNotPriorities(profile.notPriorities ?? [])
    setUnassigned(
      ALL_CATEGORY_KEYS.filter(k =>
        !profile.mustHaves.includes(k) &&
        !profile.niceToHaves.includes(k) &&
        !profile.notPriorities.includes(k)
      )
    )
  }, [profile])

  useEffect(() => {
    if (!profile?.financial_picture) return
    setDownPayment(profile.financial_picture.down_payment_available ?? '$20,000 – $50,000')
    setProceeds(profile.financial_picture.home_sale_proceeds ?? null)
  }, [profile])

  useEffect(() => {
    setSelectedCityIndex(0)
  }, [mustHaves, niceToHaves, notPriorities])

  useEffect(() => {
    setSelectedCityIndex(0)
  }, [selectedMetro])

  useEffect(() => {
    if (initialMetro && selectedMetro === '') {
      setSelectedMetro(initialMetro)
    }
  }, [initialMetro, matches])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s?.user?.email) return
      supabase
        .from('users')
        .select('sandbox_committed, sandbox_profile, preferred_city')
        .eq('email', s.user.email.toLowerCase())
        .single()
        .then(({ data }) => {
          if (data?.sandbox_committed && data?.sandbox_profile) {
            const sp: SandboxProfile = data.sandbox_profile
            setDownPayment(sp.downPaymentOverride)
            setProceeds(sp.proceedsOverride)
            setInterestRate(sp.interestRateOverride)
            setMustHaves(sp.mustHaves)
            setNiceToHaves(sp.niceToHaves)
            setNotPriorities(sp.notPriorities)
            setUnassigned(sp.unassigned)
            setCommitted(true)
          }
          if (data?.preferred_city) setPreferredCity(data.preferred_city)
        })
    })
  }, [])

  // Build sandbox profile from current slider/priority state.
  // Rankings are driven by lifestyle priority weights only — financial picture affects
  // affordabilityFlag display per city but does not reorder match scores.
  const sandboxProfile: UserProfile = {
    annualIncome: profile?.annualIncome ?? 100000,
    householdSize: profile?.householdSize ?? '1',
    movingTimeline: profile?.movingTimeline ?? 'exploring',
    mustHaves,
    niceToHaves,
    notPriorities,
    financial_picture: {
      is_homeowner: profile?.financial_picture?.is_homeowner ?? false,
      home_sale_proceeds: proceeds,
      down_payment_available: downPayment,
      purchase_timeline: profile?.financial_picture?.purchase_timeline ?? 'exploring',
    },
  }

  const metroCities = selectedMetro
    ? getAllCities().filter(city => city.metroUsed.includes(selectedMetro))
    : getAllCities()

  const activeProfile: UserProfile = !sandboxTouched && profile
    ? {
        ...profile,
        mustHaves: profile.mustHaves ?? [],
        niceToHaves: profile.niceToHaves ?? [],
        notPriorities: profile.notPriorities ?? [],
        financial_picture: profile.financial_picture ?? sandboxProfile.financial_picture,
      }
    : sandboxProfile

  const sandboxMatches = getTopMatches(activeProfile, metroCities, 5)

  // On first load, show the MM2 saved matches so MM3 opens as a continuation of MM2.
  // The moment the user adjusts any slider, priority, or metro tab, the live sandbox takes over.
  const displayedMatches = (!sandboxTouched && matches.length > 0)
    ? matches
    : sandboxMatches

  // Computed financial outputs — recalculate on every render, client-side
  const topCity = displayedMatches[selectedCityIndex]?.location ?? displayedMatches[0]?.location
  const topCityPrice = topCity?.housing?.medianHomePrice ?? 341800

  const downMid = getDownPaymentMidpoint(downPayment)
  const procMid = proceeds ? getProceedsMidpoint(proceeds) : 0
  const totalFunds = downMid + procMid
  const mortgageBalance = Math.max(0, topCityPrice - totalFunds)

  const monthlyRate = interestRate / 100 / 12
  const numPayments = 360
  const monthlyMortgage = mortgageBalance > 0
    ? Math.round((mortgageBalance * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1))
    : 0

  // propertyTaxRate is stored as a decimal (e.g. 0.0195 = 1.95%) — no /100 needed
  const monthlyPropertyTax = topCity
    ? Math.round((topCityPrice * topCity.housing.propertyTaxRate) / 12)
    : 0

  const totalMonthlyHousing = monthlyMortgage + monthlyPropertyTax

  const grossMonthlyIncome = (profile?.annualIncome ?? 100000) / 12
  const affordabilityPct = grossMonthlyIncome > 0
    ? (totalMonthlyHousing / grossMonthlyIncome) * 100
    : 0

  const affordabilityStatus =
    affordabilityPct <= 30 ? 'comfortable'
    : affordabilityPct <= 40 ? 'moderate'
    : 'stretched'

  function getBucket(key: keyof LifestyleScores): BucketKey {
    if (mustHaves.includes(key)) return 'mustHaves'
    if (niceToHaves.includes(key)) return 'niceToHaves'
    if (notPriorities.includes(key)) return 'notPriorities'
    return 'unassigned'
  }

  function getCityAffordabilityStatus(match: CityMatch): 'comfortable' | 'moderate' | 'stretched' {
    const grossMonthlyIncome = (profile?.annualIncome ?? 100000) / 12
    const cityPrice = match.location.housing.medianHomePrice
    const taxRate = match.location.housing.propertyTaxRate ?? 0.018
    const totalFunds = downMid + procMid
    const balance = Math.max(0, cityPrice - totalFunds)
    if (balance === 0) return 'comfortable'
    const mRate = interestRate / 100 / 12
    const payment = Math.round(
      (balance * mRate * Math.pow(1 + mRate, 360)) /
      (Math.pow(1 + mRate, 360) - 1)
    )
    const tax = Math.round((cityPrice * taxRate) / 12)
    const pct = (payment + tax) / grossMonthlyIncome
    if (pct <= 0.30) return 'comfortable'
    if (pct <= 0.40) return 'moderate'
    return 'stretched'
  }

  async function handleCityChoice(cityId: string) {
    const newChoice = preferredCity === cityId ? null : cityId
    setPreferredCity(newChoice)
    try {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s?.user?.email) return
      await supabase
        .from('users')
        .update({ preferred_city: newChoice })
        .eq('email', s.user.email.toLowerCase())
    } catch {}
  }

  async function handleCommit() {
    setCommitting(true)
    try {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s?.user?.email) return

      const sandboxData: SandboxProfile = {
        downPaymentOverride: downPayment,
        proceedsOverride: proceeds,
        interestRateOverride: interestRate,
        mustHaves,
        niceToHaves,
        notPriorities,
        unassigned,
      }

      await supabase
        .from('users')
        .update({
          sandbox_profile: sandboxData,
          sandbox_committed: true,
          sandbox_committed_at: new Date().toISOString(),
        })
        .eq('email', s.user.email.toLowerCase())

      setCommitted(true)
    } catch {}
    finally { setCommitting(false) }
  }

  async function handleSendEmail() {
    setSendingEmail(true)
    try {
      const res = await fetch('/api/sandbox-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.email,
          firstName: session.firstName,
          topCity: sandboxMatches[0]?.location.name,
          topScore: sandboxMatches[0]?.matchScore,
          mustHaves: mustHaves.map(k => LIFESTYLE_CATEGORIES.find(c => c.key === k)?.label ?? k),
          niceToHaves: niceToHaves.map(k => LIFESTYLE_CATEGORIES.find(c => c.key === k)?.label ?? k),
          downPayment,
          proceeds,
          interestRate,
          monthlyMortgage,
          monthlyPropertyTax,
          totalMonthlyHousing,
          topCities: sandboxMatches.map(m => ({
            name: m.location.name,
            metro: m.location.metroUsed,
            score: m.matchScore,
          })),
        }),
      })
      if (res.ok) setEmailSent(true)
    } catch {}
    finally { setSendingEmail(false) }
  }

  if (committed) {
    return (
      <div>

        {/* Post-commit Section 1 — Confirmation */}
        <div className="mb-4 rounded-xl p-5"
             style={{ backgroundColor: '#F0FAF4', border: '1.5px solid #C6E8D4' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                 style={{ backgroundColor: '#2D7D4E' }}>
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#2D7D4E' }}>
                Your direction is locked in.
              </p>
              <p className="text-xs" style={{ color: '#4B7A5E' }}>
                Your Market Director will be in touch within 24 hours.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#4B7A5E' }}>
            Your plan is saved as your new starting point. Your original profile is preserved
            alongside it — your Market Director will see both. The wheel is still in your hands.
            Now you have a copilot.
          </p>
        </div>

        {/* Post-commit actions */}
        <button
          onClick={() => window.print()}
          className="w-full py-3 rounded-xl font-bold text-sm border mb-3"
          style={{ borderColor: GOLD, color: GOLD, backgroundColor: 'transparent' }}
        >
          Download My Plan Summary
        </button>

        <button
          onClick={handleSendEmail}
          disabled={emailSent || sendingEmail}
          className="w-full py-3 rounded-xl font-bold text-sm mb-6"
          style={{
            backgroundColor: emailSent ? '#F0FAF4' : GOLD,
            color: emailSent ? '#2D7D4E' : '#16120D',
            opacity: sendingEmail ? 0.6 : 1,
          }}
        >
          {emailSent ? '✓ Plan summary sent to your email'
           : sendingEmail ? 'Sending...'
           : 'Email Me My Plan Summary'}
        </button>

        {/* Post-commit Section 2 — Committed Direction Summary */}
        <div className="mb-8 rounded-xl p-5"
             style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
          <p className="text-[10px] font-bold uppercase mb-3"
             style={{ color: GOLD, letterSpacing: '0.18em' }}>
            Your Committed Direction
          </p>

          <div className="mb-4">
            <p className="text-xs font-semibold mb-1" style={{ color: '#9A8E82' }}>TOP MATCH</p>
            <p className="text-lg font-bold" style={{ color: WARM_DARK }}>
              {sandboxMatches[0]?.location.name} — {sandboxMatches[0]?.matchScore} points
            </p>
            <p className="text-xs" style={{ color: '#9A8E82' }}>
              {sandboxMatches[0]?.location.metroUsed}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold mb-1" style={{ color: '#9A8E82' }}>MUST HAVES</p>
            <div className="flex flex-wrap gap-2">
              {mustHaves.map(key => {
                const cat = LIFESTYLE_CATEGORIES.find(c => c.key === key)!
                return (
                  <span key={key}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
                    {cat.icon} {cat.label}
                  </span>
                )
              })}
              {mustHaves.length === 0 && (
                <span className="text-xs italic" style={{ color: '#9A8E82' }}>None set</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#9A8E82' }}>FINANCIAL PICTURE</p>
            <p className="text-sm" style={{ color: '#4B5563' }}>
              Down payment: {downPayment}
              {proceeds && proceeds !== 'None' && ` · Proceeds: ${proceeds}`}
              {' '}· Rate assumption: {interestRate.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Post-commit Section 3 — What Happens Next */}
        <div className="rounded-xl p-5" style={{ backgroundColor: '#F7F6F3' }}>
          <p className="text-[10px] font-bold uppercase mb-3"
             style={{ color: GOLD, letterSpacing: '0.18em' }}>
            What Happens Next
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
            Your Market Director is being assigned. Before they reach out, they&apos;ll read
            everything — your original profile, what you changed in the sandbox, and your
            committed direction. Expect to hear from them within 24 hours.
          </p>
          <div className="rounded-xl p-4"
               style={{ backgroundColor: 'rgba(184,145,42,0.08)', border: `1px solid ${GOLD}33` }}>
            <p className="text-sm font-medium" style={{ color: '#7A5A1A' }}>
              🔒 Connect (MM4) will unlock when your Market Director initiates contact.
            </p>
          </div>
        </div>

      </div>
    )
  }

  const BUCKET_ORDER: BucketKey[] = ['unassigned', 'notPriorities', 'niceToHaves', 'mustHaves']
  const BUCKET_COLORS: Record<BucketKey, string> = {
    unassigned: '#6B7280',
    notPriorities: '#1A5FA8',
    niceToHaves: '#4B7A5E',
    mustHaves: GOLD,
  }

  return (
    <div>

      {/* Section 1 — Header */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase mb-2"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Your Discover Sandbox
        </p>
        <h2 className="text-[20px] font-bold tracking-tight mb-2" style={{ color: WARM_DARK }}>
          Move things around. See what changes.
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
          Your original matches are your starting point — not your final answer.
          Adjust your financial picture and priorities below and watch your city rankings
          respond in real time. When something clicks, commit your direction and
          your Market Director steps in as your copilot.
        </p>
      </div>

      {/* Anchor — Your Global Top Matches */}
      {matches.length > 0 && (
        <div className="mb-6 rounded-xl p-4"
             style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
          <p className="text-[10px] font-bold uppercase mb-0.5"
             style={{ color: GOLD, letterSpacing: '0.18em' }}>
            Your Top Matches
          </p>
          <p className="text-xs mb-3" style={{ color: '#9A8E82' }}>
            From your full assessment of all 101 Texas communities
          </p>
          <div className="space-y-2 mb-3">
            {matches.slice(0, 3).map((match, i) => (
              <div key={match.location.id}
                   className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold w-4 shrink-0"
                        style={{ color: i === 0 ? GOLD : '#9A8E82' }}>
                    #{i + 1}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: WARM_DARK }}>
                    {match.location.name}
                  </span>
                  <span className="text-xs" style={{ color: '#9A8E82' }}>
                    {match.location.metroUsed}
                  </span>
                </div>
                <span className="text-xs font-bold tabular-nums"
                      style={{ color: i === 0 ? GOLD : '#9A8E82' }}>
                  {match.matchScore}%
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#9A8E82' }}>
            Use the explorer below to dig deeper into any metro and see how cities rank by your current priorities.
          </p>
        </div>
      )}

      {/* Section 2 — Split Dashboard Panel */}
      <div className="grid grid-cols-2 gap-3 mb-3">

        {/* LEFT — Financial Summary */}
        <div className="rounded-xl p-4"
             style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase"
               style={{ color: GOLD, letterSpacing: '0.18em' }}>
              Your financial picture
            </p>
            {(topCity?.name || displayedMatches[0]?.location.name) && (
              <p className="text-sm font-semibold mt-0.5" style={{ color: '#B8912A' }}>
                {topCity?.name ?? displayedMatches[0]?.location.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-xl p-2.5" style={{ backgroundColor: '#F7F6F3' }}>
              <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Down payment</p>
              <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
                ${(downMid + procMid).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl p-2.5" style={{ backgroundColor: '#F7F6F3' }}>
              <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Est. mortgage</p>
              <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
                ${monthlyMortgage.toLocaleString()}/mo
              </p>
            </div>
            <div className="rounded-xl p-2.5" style={{ backgroundColor: '#F7F6F3' }}>
              <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Est. property tax</p>
              <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
                ${monthlyPropertyTax.toLocaleString()}/mo
              </p>
            </div>
            <div
              className="rounded-xl p-2.5"
              style={{
                backgroundColor:
                  affordabilityStatus === 'comfortable' ? '#F0FAF4'
                  : affordabilityStatus === 'moderate' ? '#FFFBEB'
                  : '#FEF2F2',
              }}
            >
              <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Total housing</p>
              <p className="text-sm font-bold"
                 style={{
                   color: affordabilityStatus === 'comfortable' ? '#2D7D4E'
                     : affordabilityStatus === 'moderate' ? '#B45309'
                     : '#DC2626',
                 }}>
                ${totalMonthlyHousing.toLocaleString()}/mo
              </p>
            </div>
          </div>

          <div className="mb-3 rounded-lg p-2.5"
               style={{
                 backgroundColor:
                   affordabilityStatus === 'comfortable' ? '#F0FAF4'
                   : affordabilityStatus === 'moderate' ? '#FFFBEB'
                   : '#FEF2F2',
                 border: `1px solid ${
                   affordabilityStatus === 'comfortable' ? '#C6E8D4'
                   : affordabilityStatus === 'moderate' ? '#FDE68A'
                   : '#FECACA'
                 }`,
               }}>
            <p className="text-xs font-semibold"
               style={{
                 color: affordabilityStatus === 'comfortable' ? '#2D7D4E'
                   : affordabilityStatus === 'moderate' ? '#B45309'
                   : '#DC2626',
               }}>
              {affordabilityStatus === 'comfortable'
                ? `✓ Comfortable — ${Math.round(affordabilityPct)}% of monthly income`
                : affordabilityStatus === 'moderate'
                ? `⚠ Moderate — ${Math.round(affordabilityPct)}% of monthly income`
                : `⚠ Stretched — ${Math.round(affordabilityPct)}% of monthly income`}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#9A8E82' }}>
              Based on {topCity?.name ?? 'your top city'} · {interestRate.toFixed(2)}% rate
            </p>
          </div>

          <div style={{ borderTop: '1px solid #F0EDE6', paddingTop: '10px' }}>
            <p className="text-[10px] font-bold uppercase mb-2"
               style={{ color: '#9A8E82', letterSpacing: '0.08em' }}>
              Priority summary
            </p>

            {mustHaves.length > 0 && (
              <div className="mb-2">
                <p className="text-[9px] font-bold uppercase mb-1"
                   style={{ color: GOLD, letterSpacing: '0.1em' }}>
                  Must Have
                </p>
                <div className="flex flex-wrap gap-1">
                  {mustHaves.map(k => {
                    const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
                    const Icon = CATEGORY_ICONS[k]
                    return (
                      <span key={k}
                            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
                        <Icon size={10} strokeWidth={2} />
                        {cat.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {niceToHaves.length > 0 && (
              <div className="mb-2">
                <p className="text-[9px] font-bold uppercase mb-1"
                   style={{ color: '#4B7A5E', letterSpacing: '0.1em' }}>
                  Important
                </p>
                <div className="flex flex-wrap gap-1">
                  {niceToHaves.map(k => {
                    const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
                    const Icon = CATEGORY_ICONS[k]
                    return (
                      <span key={k}
                            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: '#E8F5EE', color: '#2D7D4E' }}>
                        <Icon size={10} strokeWidth={2} />
                        {cat.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {notPriorities.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase mb-1"
                   style={{ color: '#9A8E82', letterSpacing: '0.1em' }}>
                  Nice to Have
                </p>
                <div className="flex flex-wrap gap-1">
                  {notPriorities.map(k => {
                    const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
                    const Icon = CATEGORY_ICONS[k]
                    return (
                      <span key={k}
                            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: '#F7F6F3', color: '#6B7280' }}>
                        <Icon size={10} strokeWidth={2} />
                        {cat.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Live City Rankings */}
        <div className="rounded-xl p-4"
             style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase"
               style={{ color: GOLD, letterSpacing: '0.18em' }}>
              Live city rankings
            </p>
            <div className="flex gap-1">
              {METRO_OPTIONS.map(metro => {
                const isActive = selectedMetro === metro.value
                return (
                  <button
                    key={metro.value}
                    onClick={() => { setSandboxTouched(true); setSelectedMetro(metro.value) }}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-all"
                    style={{
                      backgroundColor: isActive ? GOLD : 'transparent',
                      color: isActive ? '#16120D' : '#9A8E82',
                      border: isActive ? 'none' : '1px solid #E5E7EB',
                    }}
                  >
                    {metro.label}
                  </button>
                )
              })}
            </div>
          </div>
          {/* Metro context line */}
          <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
            {(() => {
              if (!selectedMetro) return 'Select a metro above to explore how your priorities rank cities in each market.'
              const metroLabel = METRO_OPTIONS.find(m => m.value === selectedMetro)?.label
              return !sandboxTouched
                ? `${metroLabel} is your top match. Use the buttons above to see how your priorities and budget rank cities in other Texas metros.`
                : `Showing ${metroLabel} cities ranked by your current priorities and budget.`
            })()}
          </p>
          {/* Affordability legend */}
          <div className="flex items-center gap-3 mb-3">
            {[
              { color: '#22C55E', label: 'Comfortable' },
              { color: '#F59E0B', label: 'Moderate' },
              { color: '#EF4444', label: 'Stretched' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full shrink-0"
                     style={{ backgroundColor: item.color }} />
                <span className="text-[9px] font-medium" style={{ color: '#9A8E82' }}>
                  {item.label}
                </span>
              </div>
            ))}
            <span className="text-[9px]" style={{ color: '#C5BFB8' }}>— based on your income</span>
          </div>
          <div className="space-y-2">
            {displayedMatches.map((match, i) => (
              <div
                key={match.location.id}
                className="rounded-xl p-3 cursor-pointer transition-all"
                onClick={() => setSelectedCityIndex(i)}
                style={{
                  backgroundColor: i === selectedCityIndex ? '#FBF3E3' : '#F7F6F3',
                  borderLeft: i === selectedCityIndex ? `3px solid ${GOLD}` : '3px solid transparent',
                  outline: i === selectedCityIndex ? '1px solid rgba(184,145,42,0.3)' : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold"
                          style={{ color: i === selectedCityIndex ? GOLD : '#9A8E82' }}>
                      #{i + 1}
                    </span>
                    <span className="text-sm font-bold" style={{ color: WARM_DARK }}>
                      {match.location.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden"
                           style={{ backgroundColor: '#E5E7EB' }}>
                        <div className="h-full rounded-full"
                             style={{ width: `${match.matchScore}%`, backgroundColor: GOLD }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: GOLD }}>
                        {match.matchScore}
                      </span>
                    </div>
                    {(() => {
                      const status = getCityAffordabilityStatus(match)
                      const dotColor = status === 'comfortable' ? '#22C55E'
                                     : status === 'moderate' ? '#F59E0B'
                                     : '#EF4444'
                      return (
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: dotColor }}
                          title={status === 'comfortable' ? 'Comfortable — within budget'
                               : status === 'moderate' ? 'Moderate — close to the limit'
                               : 'Stretched — over 40% of income'}
                        />
                      )
                    })()}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px]" style={{ color: '#9A8E82' }}>
                    {match.location.metroUsed}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCityPopup(match)}
                      className="text-[10px] font-semibold underline underline-offset-2"
                      style={{ color: GOLD }}
                    >
                      Learn more →
                    </button>
                    <button
                      onClick={() => handleCityChoice(match.location.id)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all"
                      style={{
                        backgroundColor: preferredCity === match.location.id
                          ? 'rgba(184,145,42,0.15)'
                          : 'transparent',
                        color: preferredCity === match.location.id ? GOLD : '#C5BFB8',
                        border: `1px solid ${preferredCity === match.location.id ? GOLD : '#E5E7EB'}`,
                      }}
                    >
                      {preferredCity === match.location.id ? '✓ My Choice' : 'Choose'}
                    </button>
                  </div>
                </div>
                {preferredCity === match.location.id && (
                  <p className="text-[9px] mt-1 font-medium" style={{ color: GOLD }}>
                    Your Market Director will see this preference.
                  </p>
                )}
                {i === selectedCityIndex && (
                  <p className="text-[9px] font-semibold mt-1"
                     style={{ color: GOLD, letterSpacing: '0.06em' }}>
                    ↑ Financial panel showing this city
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 3 — Financial Adjustments Row */}
      <div className="rounded-xl p-4 mb-6"
           style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
        <p className="text-[10px] font-bold uppercase mb-3"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Adjust your financial picture
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: WARM_DARK }}>
              Down payment
            </label>
            <select
              value={downPayment}
              onChange={e => { setSandboxTouched(true); setDownPayment(e.target.value) }}
              className="w-full rounded-xl border px-3 py-2 text-xs appearance-none"
              style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
            >
              {DOWN_PAYMENT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: WARM_DARK }}>
              Home sale proceeds
            </label>
            <select
              value={proceeds ?? 'None'}
              onChange={e => { setSandboxTouched(true); setProceeds(e.target.value === 'None' ? null : e.target.value) }}
              className="w-full rounded-xl border px-3 py-2 text-xs appearance-none"
              style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
            >
              <option value="None">None</option>
              {PROCEEDS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold" style={{ color: WARM_DARK }}>
                Rate assumption
              </label>
              <span
                className="text-xs font-bold"
                style={{
                  color: getRateZone(interestRate) === 'market' ? '#22C55E'
                       : getRateZone(interestRate) === 'low' ? '#9A8E82'
                       : '#F59E0B',
                }}
              >
                {interestRate.toFixed(2)}%
              </span>
            </div>

            {/* Color-zoned slider track */}
            <div className="relative mt-2 mb-1">
              {/* Background zone track */}
              <div className="w-full h-2 rounded-full overflow-hidden flex"
                   style={{ backgroundColor: '#E5E7EB' }}>
                {/* Low zone — gray */}
                <div style={{ width: `${((RATE_MARKET_LOW - 3) / (10 - 3)) * 100}%`, backgroundColor: '#D1D5DB' }} />
                {/* Market zone — green */}
                <div style={{ width: `${((RATE_MARKET_HIGH - RATE_MARKET_LOW) / (10 - 3)) * 100}%`, backgroundColor: 'rgba(34,197,94,0.3)' }} />
                {/* High zone — amber */}
                <div style={{ flex: 1, backgroundColor: 'rgba(245,158,11,0.2)' }} />
              </div>

              {/* Actual range input overlaid */}
              <input
                type="range"
                min={3.0}
                max={10.0}
                step={0.25}
                value={interestRate}
                onChange={e => { setSandboxTouched(true); setInterestRate(parseFloat(e.target.value)) }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ height: '8px' }}
              />

              {/* Custom thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white pointer-events-none"
                style={{
                  left: `calc(${((interestRate - 3) / (10 - 3)) * 100}% - 8px)`,
                  backgroundColor: getRateZone(interestRate) === 'market' ? '#22C55E'
                                 : getRateZone(interestRate) === 'low' ? '#9CA3AF'
                                 : '#F59E0B',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </div>

            {/* Zone labels */}
            <div className="flex justify-between text-[9px] mb-1">
              <span style={{ color: '#9A8E82' }}>3%</span>
              <span style={{ color: '#22C55E', fontWeight: 600 }}>
                ↑ Current market {RATE_MARKET_LOW}%–{RATE_MARKET_HIGH}%
              </span>
              <span style={{ color: '#9A8E82' }}>10%</span>
            </div>

            {/* Market rate note */}
            <p className="text-[9px] leading-relaxed" style={{ color: '#9A8E82' }}>
              Freddie Mac avg: {RATE_MARKET_AVG}% · {RATE_DATA_DATE} · Updated quarterly
            </p>
          </div>
        </div>
      </div>

      {/* Section 4 — Priority Grid */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase mb-2"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Adjust Your Priorities
        </p>
        <p className="text-xs mb-5" style={{ color: '#9A8E82' }}>
          Click any circle to move a category into that bucket. Rankings update instantly.
          Gold = Must Have · Green = Important · Gray = Nice to Have
        </p>

        {/* Bucket counter bar */}
        <div className="grid mb-6" style={{ gridTemplateColumns: '150px 1fr 1fr 1fr 1fr', gap: '4px' }}>
          <div /> {/* label column spacer */}
          {[
            { key: 'unassigned',   label: 'Unassigned',  count: unassigned.length,   max: null },
            { key: 'notPriorities',label: 'Nice to Have',count: notPriorities.length,max: null },
            { key: 'niceToHaves',  label: 'Important',   count: niceToHaves.length,  max: 5    },
            { key: 'mustHaves',    label: 'Must Have',   count: mustHaves.length,    max: 4    },
          ].map(bucket => {
            const isFull = bucket.max !== null && bucket.count >= bucket.max
            const isFlashing = flashBucket === bucket.key
            return (
              <div
                key={bucket.key}
                className="rounded-xl p-3 text-center transition-all"
                style={{
                  backgroundColor: isFlashing ? '#FEE2E2' : isFull ? '#FEF3C7' : '#F7F6F3',
                  border: isFlashing ? '1.5px solid #EF4444' : isFull ? '1.5px solid #F59E0B' : '1.5px solid transparent',
                  transform: isFlashing ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase mb-1"
                  style={{
                    color: isFlashing ? '#DC2626' : isFull ? '#B45309' : '#9A8E82',
                    letterSpacing: '0.08em',
                  }}
                >
                  {bucket.label}
                </p>
                <p
                  className="text-lg font-bold tabular-nums"
                  style={{ color: isFlashing ? '#DC2626' : isFull ? '#B45309' : WARM_DARK }}
                >
                  {bucket.count}
                  {bucket.max && (
                    <span className="text-xs font-normal" style={{ color: '#9A8E82' }}>
                      /{bucket.max}
                    </span>
                  )}
                </p>
                {isFull && !isFlashing && (
                  <p className="text-[9px] font-semibold mt-0.5" style={{ color: '#B45309' }}>
                    FULL
                  </p>
                )}
                {isFlashing && (
                  <p className="text-[9px] font-semibold mt-0.5" style={{ color: '#DC2626' }}>
                    MAX REACHED
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Column headers */}
        <div className="grid mb-2" style={{ gridTemplateColumns: '150px 1fr 1fr 1fr 1fr', gap: '4px' }}>
          <div />
          {[
            { label: 'Unassigned',   color: '#6B7280' },
            { label: 'Nice to Have', color: '#1A5FA8' },
            { label: 'Important',    color: '#4B7A5E' },
            { label: 'Must Have',    color: GOLD },
          ].map(col => (
            <div key={col.label} style={{ textAlign: 'center' }}>
              <span className="text-[10px] font-bold uppercase"
                    style={{ color: col.color, letterSpacing: '0.08em' }}>
                {col.label}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-3" style={{ borderBottom: '1px solid #F0EDE6' }} />

        {/* Category rows */}
        <div className="space-y-2">
          {LIFESTYLE_CATEGORIES.map(cat => {
            const currentBucket = getBucket(cat.key)

            return (
              <div key={cat.key}
                   className="grid items-center"
                   style={{ gridTemplateColumns: '150px 1fr 1fr 1fr 1fr', gap: '4px' }}>

                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = CATEGORY_ICONS[cat.key]
                    return <Icon size={16} strokeWidth={1.5} style={{ color: WARM_DARK }} />
                  })()}
                  <span className="text-xs font-semibold" style={{ color: WARM_DARK }}>
                    {cat.label}
                  </span>
                </div>

                {BUCKET_ORDER.map(bucket => {
                  const isActive = currentBucket === bucket
                  const isFull = (bucket === 'mustHaves' && mustHaves.length >= 4 && !isActive)
                              || (bucket === 'niceToHaves' && niceToHaves.length >= 5 && !isActive)
                  const isFlashingThis = flashBucket === bucket

                  return (
                    <div
                      key={bucket}
                      className="flex justify-center items-center"
                      style={{ height: '36px' }}
                    >
                      <button
                        onClick={() => {
                          setSandboxTouched(true)
                          if (isActive) return
                          if (bucket === 'mustHaves' && mustHaves.length >= 4) {
                            setFlashBucket('mustHaves')
                            setTimeout(() => setFlashBucket(null), 600)
                            return
                          }
                          if (bucket === 'niceToHaves' && niceToHaves.length >= 5) {
                            setFlashBucket('niceToHaves')
                            setTimeout(() => setFlashBucket(null), 600)
                            return
                          }
                          const setters: Record<BucketKey, React.Dispatch<React.SetStateAction<(keyof LifestyleScores)[]>>> = {
                            mustHaves: setMustHaves,
                            niceToHaves: setNiceToHaves,
                            notPriorities: setNotPriorities,
                            unassigned: setUnassigned,
                          }
                          setters[currentBucket](prev => prev.filter(k => k !== cat.key))
                          setters[bucket](prev => [...prev, cat.key])
                        }}
                        className="transition-all"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          cursor: isActive ? 'default' : isFull ? 'not-allowed' : 'pointer',
                          backgroundColor: isActive
                            ? BUCKET_COLORS[bucket]
                            : isFlashingThis
                            ? '#FEE2E2'
                            : isFull
                            ? 'transparent'
                            : 'rgba(197,191,184,0.15)',
                          border: isActive
                            ? 'none'
                            : `2px dashed ${isFull ? '#FCA5A5' : '#C5BFB8'}`,
                          opacity: isFull ? 0.4 : 1,
                          transform: isFlashingThis ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        {(() => {
                          const Icon = CATEGORY_ICONS[cat.key]
                          return isActive
                            ? <Icon size={14} strokeWidth={2} style={{ color: '#FFFFFF' }} />
                            : <span style={{ fontSize: '12px', color: '#9A8E82', opacity: 0.8 }}>+</span>
                        })()}
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 5 — Commit Button */}
      <div className="mt-8 pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
        <p className="text-sm font-medium mb-2" style={{ color: '#4B5563' }}>
          Found your direction? Lock it in and your Market Director steps in as your copilot.
        </p>
        <p className="text-xs mb-4" style={{ color: '#9A8E82' }}>
          Your original profile is always preserved. This becomes your new starting point —
          not a contract, not a cage.
        </p>
        <button
          onClick={handleCommit}
          disabled={committing}
          className="w-full py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: GOLD, color: '#16120D' }}
        >
          {committing ? 'Locking in your plan...' : 'This is my plan — connect me with my Market Director →'}
        </button>
      </div>

      {/* City Snapshot Popup */}
      {cityPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setCityPopup(null)}
        >
          <div
            className="rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: '#FDFCFA' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg" style={{ color: WARM_DARK }}>
                  {cityPopup.location.name}, {cityPopup.location.state}
                </h3>
                <p className="text-xs" style={{ color: GOLD }}>
                  {cityPopup.location.metroUsed}
                </p>
                <p className="text-xs" style={{ color: '#9A8E82' }}>
                  {cityPopup.location.county} County · {cityPopup.location.tier}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: GOLD }}>
                  {cityPopup.matchScore}
                </p>
                <p className="text-[10px] font-semibold uppercase"
                   style={{ color: '#9A8E82', letterSpacing: '0.1em' }}>
                  match score
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
              {cityPopup.location.description}
            </p>

            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase mb-2"
                 style={{ color: '#9A8E82', letterSpacing: '0.1em' }}>
                Your priority scores
              </p>
              <div className="space-y-1.5">
                {[...mustHaves, ...niceToHaves].slice(0, 6).map(key => {
                  const cat = LIFESTYLE_CATEGORIES.find(c => c.key === key)!
                  const score = cityPopup.location.scores[key]
                  const isMustHave = mustHaves.includes(key)
                  return (
                    <div key={key} className="flex items-center gap-2">
                      {(() => {
                        const Icon = CATEGORY_ICONS[key]
                        return <Icon size={12} strokeWidth={1.5} style={{ color: isMustHave ? GOLD : '#4B7A5E' }} />
                      })()}
                      <span className="text-xs w-24 shrink-0" style={{ color: WARM_DARK }}>
                        {cat.label}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                           style={{ backgroundColor: '#E5E7EB' }}>
                        <div className="h-full rounded-full"
                             style={{
                               width: `${score * 10}%`,
                               backgroundColor: isMustHave ? GOLD : '#4B7A5E',
                             }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right"
                            style={{ color: isMustHave ? GOLD : '#4B7A5E' }}>
                        {score}/10
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl p-3" style={{ backgroundColor: '#F7F6F3' }}>
                <p className="text-[10px] font-bold uppercase mb-1"
                   style={{ color: '#9A8E82', letterSpacing: '0.08em' }}>
                  Schools
                </p>
                <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
                  TEA {cityPopup.location.school.teaRating}
                </p>
                <p className="text-xs" style={{ color: '#9A8E82' }}>
                  {cityPopup.location.school.primaryISD}
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: '#F7F6F3' }}>
                <p className="text-[10px] font-bold uppercase mb-1"
                   style={{ color: '#9A8E82', letterSpacing: '0.08em' }}>
                  Market
                </p>
                <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
                  {cityPopup.location.market.marketCondition}
                </p>
                <p className="text-xs" style={{ color: '#9A8E82' }}>
                  ${cityPopup.location.housing.medianHomePrice.toLocaleString()} median
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCityPopup(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                Close
              </button>
              <button
                onClick={() => router.push(`/report/${cityPopup.location.id}`)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: GOLD, color: '#16120D' }}
              >
                View Full Report →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
