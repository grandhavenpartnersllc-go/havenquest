'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Lock, ChevronDown, ChevronRight } from 'lucide-react'
import { CityMatch, UserProfile, UserSession, SandboxProfile, LifestyleScores } from '../../../types'
import FullReport from '../../results/FullReport'
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
  { label: 'State',        value: 'State' },
  { label: 'Austin',       value: 'Austin' },
  { label: 'DFW',          value: 'Dallas' },
  { label: 'Houston',      value: 'Houston' },
  { label: 'San Antonio',  value: 'San Antonio' },
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

function formatCurrency(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return ''
  const num = parseInt(digits, 10)
  return '$' + num.toLocaleString('en-US')
}

function parseCurrency(formatted: string): number | null {
  const digits = formatted.replace(/[^0-9]/g, '')
  if (!digits) return null
  const num = parseInt(digits, 10)
  return isNaN(num) || num <= 0 ? null : num
}

function parseExactAmount(val: string): number | null {
  return parseCurrency(val)
}

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
  const [downPayment, setDownPayment] = useState<string>(
    profile?.financial_picture?.down_payment_available ?? '$20,000 – $50,000'
  )
  const [proceeds, setProceeds] = useState<string | null>(
    profile?.financial_picture?.home_sale_proceeds ?? null
  )
  // interestRate is stored and displayed but does not affect ranking math.
  // matchingService.ts uses a hardcoded 7.0% rate. Full interest rate integration is Phase 2.
  const [interestRate, setInterestRate] = useState<number>(RATE_DEFAULT)
  const [loanTerm, setLoanTerm] = useState<30 | 15>(30)
  const [exactDownPayment, setExactDownPayment] = useState<string>('')
  const [exactHomeProceeds, setExactHomeProceeds] = useState<string>('')
  const [reportCity, setReportCity] = useState<CityMatch | null>(null)

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

  const [chosenCities, setChosenCities] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState(false)
  const [financialsLocked, setFinancialsLocked] = useState(false)
  const [worksheetDismissed, setWorksheetDismissed] = useState(false)
  const [financialCalcOpen, setFinancialCalcOpen] = useState(true)

  const rankingsRef = useRef<HTMLDivElement>(null)

  const [committed, setCommitted] = useState(false)
  const [committing, setCommitting] = useState(false)
  const [flashBucket, setFlashBucket] = useState<string | null>(null)
  const [draggedCat, setDraggedCat] = useState<keyof LifestyleScores | null>(null)
  const [dragOverBucket, setDragOverBucket] = useState<BucketKey | null>(null)
  const [cityPopup, setCityPopup] = useState<CityMatch | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [selectedCityIndex, setSelectedCityIndex] = useState(initialCityIndex ?? 0)
  const [sandboxTouched, setSandboxTouched] = useState(false)

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
        .select('sandbox_committed, sandbox_profile, chosen_communities')
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
          if (Array.isArray(data?.chosen_communities)) {
            setChosenCities(data.chosen_communities)
          }
        })
    })
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem('mm3_worksheet_dismissed') === 'true') {
      setWorksheetDismissed(true)
    }
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

  const metroCities = (!selectedMetro || selectedMetro === 'State')
    ? getAllCities()
    : getAllCities().filter(city => city.metroUsed.includes(selectedMetro))

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

  const downMid = parseExactAmount(exactDownPayment) ?? getDownPaymentMidpoint(downPayment)
  const procMid = parseExactAmount(exactHomeProceeds) ?? (proceeds ? getProceedsMidpoint(proceeds) : 0)
  const totalFunds = downMid + procMid
  const mortgageBalance = Math.max(0, topCityPrice - totalFunds)

  const months = loanTerm * 12
  const effectiveRate = loanTerm === 15 ? Math.max(interestRate - 0.5, 2.0) : interestRate
  const monthlyRate = effectiveRate / 100 / 12
  const monthlyMortgage = mortgageBalance > 0
    ? Math.round((mortgageBalance * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1))
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

  const annualIncome = profile?.annualIncome ?? 100000
  const priceToIncomeRatio = annualIncome > 0 ? topCityPrice / annualIncome : 0
  const estClosingCosts = Math.round(topCityPrice * 0.025)
  const totalCashToClose = (downMid + procMid) + estClosingCosts

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
    const cityEffectiveRate = loanTerm === 15 ? Math.max(interestRate - 0.5, 2.0) : interestRate
    const cityMonths = loanTerm * 12
    const mRate = cityEffectiveRate / 100 / 12
    const payment = Math.round(
      (balance * mRate * Math.pow(1 + mRate, cityMonths)) /
      (Math.pow(1 + mRate, cityMonths) - 1)
    )
    const tax = Math.round((cityPrice * taxRate) / 12)
    const pct = (payment + tax) / grossMonthlyIncome
    if (pct <= 0.30) return 'comfortable'
    if (pct <= 0.40) return 'moderate'
    return 'stretched'
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

      const email = s.user.email.toLowerCase()
      const { data, error } = await supabase
        .from('users')
        .update({
          current_milemarker: 4,
          sandbox_profile: sandboxData,
          sandbox_committed: true,
          sandbox_committed_at: new Date().toISOString(),
          chosen_communities: chosenCities,
          exact_down_payment: parseExactAmount(exactDownPayment) ?? null,
          exact_home_proceeds: parseExactAmount(exactHomeProceeds) ?? null,
          loan_term_preference: loanTerm,
          financials_locked: financialsLocked,
        })
        .eq('email', email)
        .select('current_milemarker')
      console.log('[MM3→4] current_milemarker write result:', { data, error })
      if (error) throw error
      if (!data || data.length === 0) {
        console.warn('[MM3→4] write affected 0 rows — RLS UPDATE policy missing or JWT email mismatch for', email)
      }

      setCommitted(true)
    } catch (err) {
      console.error('MM3 handleCommit write failed:', err)
    }
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
    const downDisplay = parseCurrency(exactDownPayment)
      ? `$${parseCurrency(exactDownPayment)!.toLocaleString('en-US')}`
      : downPayment
    const proceedsDisplay = parseCurrency(exactHomeProceeds)
      ? `$${parseCurrency(exactHomeProceeds)!.toLocaleString('en-US')}`
      : proceeds

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
            <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
              {chosenCities.length === 1 ? 'Selected community' : 'Selected communities'}
            </p>
            {chosenCities.length > 0 ? chosenCities.map(cityId => {
              const city = getAllCities().find(c => c.id === cityId)
              const match = displayedMatches.find(m => m.location.id === cityId)
              return city ? (
                <div key={cityId} style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {city.name}
                  </span>
                  {match && (
                    <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginLeft: '8px' }}>
                      {match.matchScore}% match
                    </span>
                  )}
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '1px' }}>
                    {city.metroUsed}
                  </p>
                </div>
              ) : null
            }) : (
              <p className="text-sm" style={{ color: WARM_DARK }}>
                {sandboxMatches[0]?.location.name} — {sandboxMatches[0]?.matchScore} points
              </p>
            )}
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
              Down payment: {downDisplay}
              {proceeds && proceeds !== 'None' && ` · Proceeds: ${proceedsDisplay}`}
              {' '}· Rate assumption: {effectiveRate.toFixed(2)}% · {loanTerm}-year
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
              <Lock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Connect (MM4) will unlock when your Market Director initiates contact.
            </p>
          </div>
        </div>

      </div>
    )
  }

  // Interactive priority selector — buckets map to scoring weights:
  // mustHaves = Must Have (3x, cap 4) · niceToHaves = Important (2x, cap 5) ·
  // notPriorities = Nice to Have (1x, no cap) · unassigned = Unassigned (0x, no cap)
  const PRIORITY_BUCKETS: Array<{ key: BucketKey; label: string; items: (keyof LifestyleScores)[]; cap: number | null; pillBg: string; pillColor: string }> = [
    { key: 'mustHaves',     label: 'Must Have',    items: mustHaves,     cap: 4,    pillBg: 'rgba(184,145,42,0.12)', pillColor: GOLD },
    { key: 'niceToHaves',   label: 'Important',    items: niceToHaves,   cap: 5,    pillBg: '#E8F5EE',               pillColor: '#2D7D4E' },
    { key: 'notPriorities', label: 'Nice to Have', items: notPriorities, cap: null, pillBg: 'rgba(26,95,168,0.12)',  pillColor: '#1A5FA8' },
  ]
  const UNASSIGNED_BUCKET: typeof PRIORITY_BUCKETS[number] =
    { key: 'unassigned', label: 'Unassigned', items: unassigned, cap: null, pillBg: 'rgba(107,114,128,0.12)', pillColor: '#6B7280' }

  const bucketSetters: Record<BucketKey, React.Dispatch<React.SetStateAction<(keyof LifestyleScores)[]>>> = {
    mustHaves: setMustHaves,
    niceToHaves: setNiceToHaves,
    notPriorities: setNotPriorities,
    unassigned: setUnassigned,
  }

  function movePriority(key: keyof LifestyleScores, from: BucketKey, to: BucketKey) {
    if (from === to) return
    bucketSetters[from](prev => prev.filter(k => k !== key))
    bucketSetters[to](prev => [...prev, key])
  }

  function flashFull(b: BucketKey) {
    setFlashBucket(b)
    setTimeout(() => setFlashBucket(null), 600)
  }

  function handlePriorityDrop(to: BucketKey) {
    const key = draggedCat
    setDraggedCat(null)
    setDragOverBucket(null)
    if (!key) return
    const from = getBucket(key)
    if (from === to) return
    setSandboxTouched(true)
    if (to === 'mustHaves' && mustHaves.length >= 4) { flashFull('mustHaves'); return }
    if (to === 'niceToHaves' && niceToHaves.length >= 5) { flashFull('niceToHaves'); return }
    movePriority(key, from, to)
  }

  // Click cycles Unassigned → Nice to Have → Important → Must Have → Unassigned,
  // skipping any capped-full bucket per the brief.
  function cyclePriority(key: keyof LifestyleScores) {
    setSandboxTouched(true)
    const from = getBucket(key)
    let to: BucketKey
    if (from === 'unassigned') to = 'notPriorities'
    else if (from === 'notPriorities') to = niceToHaves.length >= 5 ? (mustHaves.length >= 4 ? 'unassigned' : 'mustHaves') : 'niceToHaves'
    else if (from === 'niceToHaves') to = mustHaves.length >= 4 ? 'unassigned' : 'mustHaves'
    else to = 'unassigned'
    movePriority(key, from, to)
  }

  function renderPriorityZone(b: typeof PRIORITY_BUCKETS[number]) {
    const isOver = dragOverBucket === b.key
    const isFlashing = flashBucket === b.key
    return (
      <div key={b.key}>
        <p className="text-[9px] font-bold uppercase mb-1" style={{ color: GOLD, letterSpacing: '0.1em' }}>
          {b.label}{' '}
          <span style={{ color: isFlashing ? '#EF4444' : '#9A8E82' }}>
            {b.items.length}{b.cap ? `/${b.cap}` : ''}
          </span>
        </p>
        <div
          onDragOver={e => { e.preventDefault(); if (dragOverBucket !== b.key) setDragOverBucket(b.key) }}
          onDragLeave={() => setDragOverBucket(prev => (prev === b.key ? null : prev))}
          onDrop={() => handlePriorityDrop(b.key)}
          style={{
            border: isFlashing ? '1px solid #EF4444' : isOver ? '1px solid #C9A84C' : '1px solid #D4C5A9',
            borderRadius: '8px',
            background: isFlashing ? 'rgba(239,68,68,0.06)' : isOver ? 'rgba(201,168,76,0.12)' : '#F9F6F1',
            minHeight: '60px',
            padding: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            alignContent: 'flex-start',
            transition: 'border-color 0.15s, background 0.15s',
          }}
        >
          {b.items.map(k => {
            const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
            const Icon = CATEGORY_ICONS[k]
            return (
              <span
                key={k}
                draggable
                onDragStart={() => setDraggedCat(k)}
                onDragEnd={() => { setDraggedCat(null); setDragOverBucket(null) }}
                onClick={() => cyclePriority(k)}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: b.pillBg, color: b.pillColor, cursor: 'grab', userSelect: 'none' }}
                title="Drag to a bucket or click to cycle"
              >
                <Icon size={10} strokeWidth={2} />
                {cat.label}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>

      {/* Worksheet orientation banner */}
      {!worksheetDismissed && (
        <div style={{
          borderLeft: '4px solid #B8912A',
          background: 'rgba(184,145,42,0.06)',
          borderRadius: '0 8px 8px 0',
          padding: '16px 20px',
          marginBottom: '24px',
          position: 'relative',
        }}>
          <p style={{ fontSize: '10px', fontWeight: 600, color: '#B8912A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Your Discover Worksheet
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: '8px', lineHeight: 1.5 }}>
            This is one of the most important steps in your Navigator journey.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>
            Before your Market Director can guide you effectively, they need
            a clear picture of two things: where you want to be, and what you
            can realistically spend. This worksheet helps you define both.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Take your time. Adjust your priorities. Refine your financial
            picture. Explore the cities that match your life. When you&apos;re
            ready — lock your financials, choose your top communities, and
            commit your direction. Your Market Director receives everything
            you complete here before your first conversation.
          </p>
          <button
            onClick={() => {
              setWorksheetDismissed(true)
              sessionStorage.setItem('mm3_worksheet_dismissed', 'true')
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              fontSize: '12px',
              color: '#B8912A',
              cursor: 'pointer',
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            Got it ✓
          </button>
        </div>
      )}

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
            {displayedMatches.slice(0, 3).map((match, i) => {
              const afStatus = getCityAffordabilityStatus(match)
              const afDotColor = afStatus === 'comfortable' ? '#22C55E'
                : afStatus === 'moderate' ? '#F59E0B' : '#EF4444'
              return (
                <div
                  key={match.location.id}
                  style={{
                    borderRadius: '10px',
                    border: selectedCityIndex === i ? '1.5px solid #B8912A' : '0.5px solid var(--color-border-tertiary)',
                    background: 'var(--color-background-primary)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onClick={() => setSelectedCityIndex(i)}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'var(--color-background-tertiary)' }}>
                    <Image
                      src={`/images/cities/${match.location.id}.jpg`}
                      alt={`${match.location.name}, Texas`}
                      fill
                      className="object-cover"
                      onError={(e) => { const t = e.target as HTMLImageElement; if (!t.src.includes('default-tx')) { t.src = '/images/cities/default-tx.jpg' } }}
                    />
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 500, color: '#B8912A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                          #{i + 1} Match
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '1px' }}>
                          {match.location.name}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                          {match.location.metroUsed}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#B8912A' }}>
                          {match.matchScore}%
                        </span>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: afDotColor }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#9A8E82' }}>
            Use the explorer below to dig deeper into any metro and see how cities rank by your current priorities.
          </p>
        </div>
      )}

      {/* Section 2 — Split Dashboard Panel */}
      <div className="grid grid-cols-2 gap-3 mb-3 items-start">

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

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-xl p-2.5" style={{ backgroundColor: '#F7F6F3' }}>
              <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Price-to-income ratio</p>
              <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
                {priceToIncomeRatio.toFixed(1)}× your income
              </p>
            </div>
            <div className="rounded-xl p-2.5" style={{ backgroundColor: '#F7F6F3' }}>
              <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Est. closing costs</p>
              <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
                ${estClosingCosts.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl p-2.5 col-span-2" style={{ backgroundColor: '#F7F6F3' }}>
              <p className="text-[10px] mb-1" style={{ color: '#9A8E82' }}>Total cash to close</p>
              <p className="text-sm font-bold" style={{ color: WARM_DARK }}>
                ${totalCashToClose.toLocaleString()}
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
              Based on {topCity?.name ?? 'your top city'} · {effectiveRate.toFixed(2)}% rate · {loanTerm}-year
            </p>
          </div>

          {/* Collapsible — Adjust your financial picture */}
          <div style={{ borderTop: '1px solid #F0EDE6', paddingTop: '10px' }}>
            <button
              type="button"
              onClick={() => setFinancialCalcOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <span className="text-[10px] font-bold uppercase"
                    style={{ color: GOLD, letterSpacing: '0.18em' }}>
                Adjust your financial picture
              </span>
              {financialCalcOpen
                ? <ChevronDown size={16} style={{ color: GOLD }} />
                : <ChevronRight size={16} style={{ color: GOLD }} />}
            </button>
            <div style={{
              overflow: 'hidden',
              maxHeight: financialCalcOpen ? '1200px' : '0px',
              opacity: financialCalcOpen ? 1 : 0,
              transition: 'max-height 0.3s ease, opacity 0.2s ease',
            }}>
              <div className="grid grid-cols-1 gap-4" style={{ paddingTop: '12px', opacity: financialsLocked ? 0.6 : 1, pointerEvents: financialsLocked ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
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
                  <div style={{ marginTop: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Or enter exact amount (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $47,500"
                      value={exactDownPayment}
                      onChange={e => { setSandboxTouched(true); setExactDownPayment(formatCurrency(e.target.value)) }}
                      onFocus={e => { e.target.style.border = '1px solid #B8912A' }}
                      onBlur={e => { e.target.style.border = '1px solid rgba(184,145,42,0.4)' }}
                      style={{
                        width: '100%',
                        fontSize: '13px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(184,145,42,0.4)',
                        background: 'rgba(184,145,42,0.04)',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                  </div>
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
                  <div style={{ marginTop: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Or enter exact amount (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $120,000"
                      value={exactHomeProceeds}
                      onChange={e => { setSandboxTouched(true); setExactHomeProceeds(formatCurrency(e.target.value)) }}
                      onFocus={e => { e.target.style.border = '1px solid #B8912A' }}
                      onBlur={e => { e.target.style.border = '1px solid rgba(184,145,42,0.4)' }}
                      style={{
                        width: '100%',
                        fontSize: '13px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(184,145,42,0.4)',
                        background: 'rgba(184,145,42,0.04)',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                  </div>
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

                  {/* Loan term toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Loan term</span>
                    <div style={{ display: 'flex', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '6px', overflow: 'hidden' }}>
                      {([30, 15] as const).map(term => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setLoanTerm(term)}
                          style={{
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: loanTerm === term ? 500 : 400,
                            background: loanTerm === term ? '#B8912A' : 'transparent',
                            color: loanTerm === term ? '#fff' : 'var(--color-text-secondary)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {term}-yr
                        </button>
                      ))}
                    </div>
                  </div>
                  {loanTerm === 15 && (
                    <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                      15-year builds equity faster — higher monthly, less total interest
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lock financials */}
          <div style={{ marginTop: '12px', borderTop: '1px solid #F0EDE6', paddingTop: '10px' }}>
            <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
              Lock your financial picture when you&apos;re ready. Your Market Director will use these numbers to guide your search.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
              {financialsLocked && (
                <button
                  onClick={() => setFinancialsLocked(false)}
                  style={{ fontSize: '11px', color: GOLD, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => setFinancialsLocked(f => !f)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px', padding: '5px 12px', borderRadius: '8px',
                  border: financialsLocked ? '0.5px solid #1D9E75' : '0.5px solid var(--color-border-tertiary)',
                  backgroundColor: financialsLocked ? 'rgba(29,158,117,0.06)' : 'transparent',
                  color: financialsLocked ? '#1D9E75' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <span>{financialsLocked ? '✓' : <Lock size={14} style={{ verticalAlign: 'middle' }} />}</span>
                <span>{financialsLocked ? 'Financials locked' : 'Lock my financials'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Live City Rankings */}
        <div ref={rankingsRef} className="rounded-xl p-4"
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
              if (selectedMetro === 'State') return !sandboxTouched
                ? 'Showing your top matches across all 101 Texas communities.'
                : 'Showing all 101 Texas communities ranked by your current priorities and budget.'
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
          {/* Selection instructions */}
          <div style={{
            background: 'rgba(184,145,42,0.07)',
            border: '1px solid rgba(184,145,42,0.35)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '12px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#7A5A1A', marginBottom: '4px', lineHeight: 1.5 }}>
              Choose up to 3 communities you want to explore.
            </p>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Hit &ldquo;Choose This Community&rdquo; on any city card to select it. Your
              selections tell your Market Director exactly where to focus.
            </p>
          </div>
          <div className="space-y-2">
            {displayedMatches.map((match, i) => (
              <div
                key={match.location.id}
                className="rounded-xl p-3 cursor-pointer transition-all"
                onClick={() => setSelectedCityIndex(i)}
                style={{
                  backgroundColor: (chosenCities.includes(match.location.id) || i === selectedCityIndex) ? '#FBF3E3' : '#F7F6F3',
                  borderLeft: (chosenCities.includes(match.location.id) || i === selectedCityIndex) ? `3px solid ${GOLD}` : '3px solid transparent',
                  outline: (chosenCities.includes(match.location.id) || i === selectedCityIndex) ? '1px solid rgba(184,145,42,0.3)' : 'none',
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
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button
                      onClick={() => setCityPopup(match)}
                      className="text-[10px] font-semibold underline underline-offset-2"
                      style={{ color: GOLD }}
                    >
                      Learn more →
                    </button>
                    <button
                      onClick={() => {
                        const cityId = match.location.id
                        if (chosenCities.includes(cityId)) {
                          setChosenCities(prev => prev.filter(id => id !== cityId))
                        } else if (chosenCities.length < 3) {
                          setChosenCities(prev => [...prev, cityId])
                        }
                      }}
                      className="font-bold transition-all"
                      style={{
                        fontSize: '11px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        backgroundColor: chosenCities.includes(match.location.id) ? '#FBF3E3' : '#C9A84C',
                        color: chosenCities.includes(match.location.id) ? '#8A6D1F' : '#FFFFFF',
                        border: chosenCities.includes(match.location.id) ? '1.5px solid #B8912A' : '1.5px solid #C9A84C',
                        boxShadow: chosenCities.includes(match.location.id) ? 'none' : '0 1px 3px rgba(184,145,42,0.3)',
                        opacity: !chosenCities.includes(match.location.id) && chosenCities.length >= 3 ? 0.4 : 1,
                        cursor: !chosenCities.includes(match.location.id) && chosenCities.length >= 3 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {chosenCities.includes(match.location.id) ? '✓ Selected' : 'Choose This Community'}
                    </button>
                  </div>
                </div>
                {i === selectedCityIndex && (
                  <p className="text-[9px] font-semibold mt-1"
                     style={{ color: GOLD, letterSpacing: '0.06em' }}>
                    ↑ Financial panel showing this city
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* What Shaped Your Rankings — interactive priority selector */}
          <div style={{ borderTop: '1px solid #F0EDE6', marginTop: '16px', paddingTop: '12px' }}>
            <p className="text-[10px] font-bold uppercase mb-2"
               style={{ color: GOLD, letterSpacing: '0.18em' }}>
              What Shaped Your Rankings
            </p>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: '#6B7280' }}>
              These are the priorities you set — and they&apos;re what shaped these
              rankings. Drag or click any category to reassign it. Rankings update instantly.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {PRIORITY_BUCKETS.map(renderPriorityZone)}
            </div>
            {renderPriorityZone(UNASSIGNED_BUCKET)}
          </div>
        </div>

      </div>

      {/* Section 5 — Confirmation + Commit */}
      <div className="mt-8 pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
        <p className="text-sm font-medium mb-2" style={{ color: '#4B5563' }}>
          Found your direction? Lock it in and your Market Director steps in as your copilot.
        </p>
        <p className="text-xs mb-4" style={{ color: '#9A8E82' }}>
          Your original profile is always preserved. This becomes your new starting point —
          not a contract, not a cage.
        </p>

        {/* Confirmation checkbox — appears after at least 1 city chosen */}
        {chosenCities.length > 0 && (
          <div style={{
            marginTop: '2rem',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '0.5px solid rgba(184,145,42,0.3)',
            background: '#FAEEDA',
          }}>
            <p style={{ fontSize: '13px', color: '#633806', marginBottom: '12px', fontWeight: 500 }}>
              Your selected {chosenCities.length === 1 ? 'community' : 'communities'} for your Market Director:
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {chosenCities.map(cityId => {
                const city = getAllCities().find(c => c.id === cityId)
                return city ? (
                  <span key={cityId} style={{
                    background: '#B8912A', color: '#fff',
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                  }}>
                    {city.name}
                  </span>
                ) : null
              })}
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                style={{ marginTop: '2px', accentColor: '#B8912A', width: '16px', height: '16px', flexShrink: 0 }}
              />
              <span style={{ fontSize: '13px', color: '#633806', lineHeight: 1.5 }}>
                I&apos;m ready to connect with a Market Director and take the next step toward my Lone Star Lifestyle.
              </span>
            </label>
          </div>
        )}

        {(() => {
          const canAdvance = chosenCities.length >= 1 && confirmed
          return (
            <>
              <button
                onClick={canAdvance ? handleCommit : undefined}
                disabled={committing}
                className="w-full py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90 mt-4"
                style={{
                  backgroundColor: GOLD,
                  color: '#16120D',
                  opacity: !canAdvance || committing ? 0.4 : 1,
                  cursor: !canAdvance || committing ? 'not-allowed' : 'pointer',
                }}
              >
                {committing ? 'Locking in your plan...' : 'This is my plan — connect me with my Market Director →'}
              </button>
              {!canAdvance && (
                <>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: '8px' }}>
                    {chosenCities.length === 0
                      ? 'Select at least one community from the Live City Rankings to continue.'
                      : 'Check the box above to continue.'}
                  </p>
                  {chosenCities.length === 0 && (
                    <p style={{ textAlign: 'center', marginTop: '4px' }}>
                      <button
                        onClick={() => rankingsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        style={{ color: GOLD, background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                      >
                        ↑ Go to Live City Rankings
                      </button>
                    </p>
                  )}
                </>
              )}
            </>
          )
        })()}
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
                onClick={() => { setReportCity(cityPopup); setCityPopup(null) }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: GOLD, color: '#16120D' }}
              >
                View Full Report →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Report Modal */}
      {reportCity && profile && (
        <div
          onClick={() => setReportCity(null)}
          style={{
            position: 'fixed',
            top: 0, right: 0, bottom: 0, left: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflowY: 'auto',
            padding: '40px 16px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--color-background-primary)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '800px',
              overflow: 'hidden',
              marginBottom: '40px',
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '0.5px solid var(--color-border-tertiary)',
              background: '#16120D',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
              <div>
                <p style={{ fontSize: '10px', color: '#9A8E82', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>
                  Full Report
                </p>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#E8E2D9' }}>
                  {reportCity.location.name}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => window.print()}
                  style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 500, border: '0.5px solid rgba(232,226,217,0.3)', borderRadius: '6px', background: 'transparent', color: '#E8E2D9', cursor: 'pointer' }}
                >
                  Print
                </button>
                <button
                  onClick={() => window.open(`/report/${reportCity.location.id}`, '_blank')}
                  style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 500, border: 'none', borderRadius: '6px', background: '#B8912A', color: '#fff', cursor: 'pointer' }}
                >
                  Download ↓
                </button>
                <button
                  onClick={() => setReportCity(null)}
                  style={{ padding: '6px 10px', fontSize: '18px', border: 'none', background: 'transparent', color: '#9A8E82', cursor: 'pointer', lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <FullReport match={reportCity} profile={profile} />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
