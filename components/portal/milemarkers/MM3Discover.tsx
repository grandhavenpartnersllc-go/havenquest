'use client'

import { useState, useEffect } from 'react'
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
}

export default function MM3Discover({ profile, session }: MM3DiscoverProps) {
  const [downPayment, setDownPayment] = useState<string>(
    profile?.financial_picture?.down_payment_available ?? '$20,000 – $50,000'
  )
  const [proceeds, setProceeds] = useState<string | null>(
    profile?.financial_picture?.home_sale_proceeds ?? null
  )
  // interestRate is stored and displayed but does not affect ranking math.
  // matchingService.ts uses a hardcoded 7.0% rate. Full interest rate integration is Phase 2.
  const [interestRate, setInterestRate] = useState<number>(7.0)

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
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s?.user?.email) return
      supabase
        .from('users')
        .select('sandbox_committed, sandbox_profile')
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

  const sandboxMatches = getTopMatches(sandboxProfile, getAllCities(), 5)

  // Computed financial outputs — recalculate on every render, client-side
  const topCity = sandboxMatches[0]?.location
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
    unassigned: '#E5E7EB',
    notPriorities: '#9CA3AF',
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

      {/* Section 2 — Split Dashboard Panel */}
      <div className="grid grid-cols-2 gap-3 mb-3">

        {/* LEFT — Financial Summary */}
        <div className="rounded-xl p-4"
             style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
          <p className="text-[10px] font-bold uppercase mb-3"
             style={{ color: GOLD, letterSpacing: '0.18em' }}>
            Your financial picture
          </p>

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
              <div className="flex flex-wrap gap-1 mb-1">
                {mustHaves.map(k => {
                  const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
                  return (
                    <span key={k} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: 'rgba(184,145,42,0.12)', color: GOLD }}>
                      {cat.icon} {cat.label}
                    </span>
                  )
                })}
              </div>
            )}
            {niceToHaves.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {niceToHaves.map(k => {
                  const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
                  return (
                    <span key={k} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: '#E8F5EE', color: '#2D7D4E' }}>
                      {cat.icon} {cat.label}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Live City Rankings */}
        <div className="rounded-xl p-4"
             style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}>
          <p className="text-[10px] font-bold uppercase mb-3"
             style={{ color: GOLD, letterSpacing: '0.18em' }}>
            Live city rankings
          </p>
          <div className="space-y-2">
            {sandboxMatches.map((match, i) => (
              <div
                key={match.location.id}
                className="rounded-xl p-3"
                style={{
                  backgroundColor: '#F7F6F3',
                  borderLeft: i === 0 ? `3px solid ${GOLD}` : '3px solid transparent',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold"
                          style={{ color: i === 0 ? GOLD : '#9A8E82' }}>
                      #{i + 1}
                    </span>
                    <span className="text-sm font-bold" style={{ color: WARM_DARK }}>
                      {match.location.name}
                    </span>
                  </div>
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
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px]" style={{ color: '#9A8E82' }}>
                    {match.location.metroUsed}
                  </p>
                  <button
                    onClick={() => setCityPopup(match)}
                    className="text-[10px] font-semibold underline underline-offset-2"
                    style={{ color: GOLD }}
                  >
                    Learn more →
                  </button>
                </div>
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
              onChange={e => setDownPayment(e.target.value)}
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
              onChange={e => setProceeds(e.target.value === 'None' ? null : e.target.value)}
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
              <span className="text-xs font-bold" style={{ color: GOLD }}>
                {interestRate.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min={3.0}
              max={10.0}
              step={0.25}
              value={interestRate}
              onChange={e => setInterestRate(parseFloat(e.target.value))}
              className="w-full accent-amber-600 mt-2"
            />
            <div className="flex justify-between text-[10px] mt-0.5" style={{ color: '#9A8E82' }}>
              <span>3%</span>
              <span>10%</span>
            </div>
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
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { key: 'mustHaves',    label: 'Must Have',   count: mustHaves.length,    max: 4    },
            { key: 'niceToHaves',  label: 'Important',   count: niceToHaves.length,  max: 5    },
            { key: 'notPriorities',label: 'Nice to Have',count: notPriorities.length,max: null },
            { key: 'unassigned',   label: 'Unassigned',  count: unassigned.length,   max: null },
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
            { label: 'Unassigned',   color: '#C5BFB8' },
            { label: 'Nice to Have', color: '#9A8E82' },
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
                            : <span style={{ fontSize: '12px', color: '#C5BFB8', opacity: 0.6 }}>+</span>
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
                      <span className="text-xs w-4">{cat.icon}</span>
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
                onClick={() => setCityPopup(null)}
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
