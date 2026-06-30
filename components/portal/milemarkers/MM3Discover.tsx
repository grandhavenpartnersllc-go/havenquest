'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CityMatch, UserProfile, UserSession, SandboxProfile, DNAScores } from '../../../types'
import FullReport from '../../results/FullReport'
import { DNA_CATEGORIES } from '../../../utils/constants'
import { getAllCities } from '../../../services/locationService'
import { getTopMatches } from '../../../services/matchingService'
import { createClient } from '../../../lib/supabase/client'
import { lookupZipCityState } from '../../../utils/zipLookup'

const ALL_KEYS = DNA_CATEGORIES.map(c => c.key) as (keyof DNAScores)[]

const RATE_DEFAULT = 6.5

const METRO_FILTERS = [
  { label: 'All Texas',    value: 'State' },
  { label: 'Austin',       value: 'Austin' },
  { label: 'DFW',          value: 'Dallas' },
  { label: 'Houston',      value: 'Houston' },
  { label: 'San Antonio',  value: 'San Antonio' },
]

function fmtCurrency(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return ''
  return '$' + parseInt(digits, 10).toLocaleString('en-US')
}

function parseMoney(s: string): number {
  const n = parseInt(s.replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? 0 : n
}

function fmtK(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return n ? `$${n.toLocaleString()}` : '$0'
}

function calcMonthly(principal: number, annualRate: number, termYears: number): number {
  if (principal <= 0) return 0
  const r = annualRate / 100 / 12
  const n = termYears * 12
  if (r === 0) return Math.round(principal / n)
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
}

interface OriginCityData {
  medianHome: string
  schoolRating: string
  colIndex: number
  safety: string
  incomeTax: string
  climate: string
}

const ORIGIN_CITY_DATA: Record<string, OriginCityData> = {
  'Seattle':       { medianHome: '$825K', schoolRating: 'B+', colIndex: 152, safety: 'Moderate',   incomeTax: 'None (WA)',    climate: 'Cool/rainy' },
  'San Francisco': { medianHome: '$1.2M', schoolRating: 'B',  colIndex: 194, safety: 'High crime', incomeTax: '9.3% (CA)',    climate: 'Mild/foggy' },
  'Los Angeles':   { medianHome: '$950K', schoolRating: 'C+', colIndex: 173, safety: 'Moderate',   incomeTax: '9.3% (CA)',    climate: 'Warm/sunny' },
  'Chicago':       { medianHome: '$340K', schoolRating: 'B-', colIndex: 107, safety: 'High crime', incomeTax: '4.95% (IL)',   climate: 'Cold/snowy' },
  'New York':      { medianHome: '$780K', schoolRating: 'B',  colIndex: 187, safety: 'Moderate',   incomeTax: '6.85% (NY)',   climate: 'Cold/humid' },
  'Denver':        { medianHome: '$565K', schoolRating: 'B',  colIndex: 128, safety: 'Moderate',   incomeTax: '4.4% (CO)',    climate: 'Sunny/cold winters' },
  'Atlanta':       { medianHome: '$410K', schoolRating: 'C+', colIndex: 108, safety: 'High crime', incomeTax: '5.75% (GA)',   climate: 'Warm/humid' },
  'Phoenix':       { medianHome: '$420K', schoolRating: 'C+', colIndex: 103, safety: 'Moderate',   incomeTax: '2.5% (AZ)',    climate: 'Hot/dry' },
  'Minneapolis':   { medianHome: '$360K', schoolRating: 'B+', colIndex: 106, safety: 'Moderate',   incomeTax: '9.85% (MN)',   climate: 'Very cold' },
  'Portland':      { medianHome: '$510K', schoolRating: 'B',  colIndex: 129, safety: 'Moderate',   incomeTax: '9.9% (OR)',    climate: 'Cool/rainy' },
  'Nashville':     { medianHome: '$450K', schoolRating: 'B-', colIndex: 112, safety: 'Moderate',   incomeTax: 'None (TN)',    climate: 'Warm/humid' },
  'Miami':         { medianHome: '$620K', schoolRating: 'C+', colIndex: 123, safety: 'Moderate',   incomeTax: 'None (FL)',    climate: 'Hot/humid' },
  'Washington DC': { medianHome: '$680K', schoolRating: 'B',  colIndex: 153, safety: 'Moderate',   incomeTax: '8.5% (DC)',    climate: 'Humid/cold winters' },
  'Boston':        { medianHome: '$780K', schoolRating: 'A-', colIndex: 162, safety: 'Low',        incomeTax: '5% (MA)',      climate: 'Cold/snowy' },
  'San Diego':     { medianHome: '$875K', schoolRating: 'B+', colIndex: 156, safety: 'Low',        incomeTax: '9.3% (CA)',    climate: 'Perfect/mild' },
  'Dallas':        { medianHome: '$380K', schoolRating: 'B',  colIndex: 104, safety: 'Moderate',   incomeTax: 'None (TX)',    climate: 'Warm/sunny' },
  'Houston':       { medianHome: '$310K', schoolRating: 'B-', colIndex: 98,  safety: 'Moderate',   incomeTax: 'None (TX)',    climate: 'Hot/humid' },
  'default':       { medianHome: 'Varies', schoolRating: 'Varies', colIndex: 100, safety: 'Varies', incomeTax: 'Varies',      climate: 'Varies' },
}

function lookupOriginCity(city: string): OriginCityData | null {
  if (!city) return null
  const key = Object.keys(ORIGIN_CITY_DATA).find(k =>
    k !== 'default' && city.toLowerCase().includes(k.toLowerCase())
  )
  return key ? ORIGIN_CITY_DATA[key] : null
}

function txColIndex(metro: string): number {
  if (metro.includes('Houston')) return 98
  if (metro.includes('San Antonio')) return 97
  if (metro.includes('Dallas') || metro.includes('DFW') || metro.includes('Fort Worth')) return 104
  return 108
}

function txSafety(score: number): string {
  if (score >= 8) return 'Very low'
  if (score >= 6) return 'Low'
  if (score >= 4) return 'Moderate'
  return 'Higher risk'
}

function txPropertyTax(metro: string): string {
  if (metro.includes('Houston')) return '2.0%'
  if (metro.includes('San Antonio')) return '2.3%'
  if (metro.includes('Dallas') || metro.includes('DFW') || metro.includes('Fort Worth')) return '2.1%'
  return '1.9%'
}

function txJobMarket(metro: string): string {
  if (metro.includes('Houston') || metro.includes('San Antonio')) return 'Moderate'
  return 'Strong'
}

function txClimateV2(metro: string): string {
  if (metro.includes('Houston')) return 'Humid subtropical'
  if (metro.includes('Dallas') || metro.includes('DFW') || metro.includes('Fort Worth')) return 'Hot & stormy'
  if (metro.includes('San Antonio')) return 'Hot & dry'
  return 'Hot summers'
}

function parseHomePrice(s: string): number {
  const clean = s.replace(/[$,]/g, '')
  if (clean.endsWith('M')) return parseFloat(clean) * 1_000_000
  if (clean.endsWith('K')) return parseFloat(clean) * 1_000
  return parseFloat(clean) || 0
}

function rankPillLabel(idx: number): string {
  if (idx === 0) return '⭐ Top pick'
  if (idx === 1) return 'Runner-up'
  if (idx === 2) return 'Strong alt'
  return `#${idx + 1}`
}

function communityCharLabel(env: number): string {
  if (env <= 3) return 'Urban'
  if (env <= 6) return 'Suburban'
  if (env <= 8) return 'Small Town'
  return 'Rural'
}

const SliderRow = ({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  leftLabel: string
  rightLabel: string
  value: number
  onChange: (v: number) => void
}) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '80px 1fr 80px',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  }}>
    <span style={{ fontSize: '10px', color: '#888', textAlign: 'right', lineHeight: 1.3 }}>
      {leftLabel}
    </span>
    <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#0A1E3D', cursor: 'pointer' }}
      />
    </div>
    <span style={{ fontSize: '10px', color: '#888', textAlign: 'left', lineHeight: 1.3 }}>
      {rightLabel}
    </span>
  </div>
)

interface Props {
  matches: CityMatch[]
  profile: UserProfile | null
  session: UserSession
  onAdvanceToConnect: () => void
  initialMetro?: string
  initialCityIndex?: number
}

export default function MM3Discover({ matches, profile, session, onAdvanceToConnect, initialMetro }: Props) {
  // Financial
  const [isSelling, setIsSelling] = useState(false)
  const [proceeds, setProceeds] = useState('')
  const [savings, setSavings] = useState('')
  const [interestRate, setInterestRate] = useState(RATE_DEFAULT)
  const [loanTerm, setLoanTerm] = useState<30 | 15>(30)
  const [incomeVal, setIncomeVal] = useState(0)
  const [incomeDisplay, setIncomeDisplay] = useState('')

  // Priorities
  const [mustHaves, setMustHaves] = useState<(keyof DNAScores)[]>([])
  const [niceToHaves, setNiceToHaves] = useState<(keyof DNAScores)[]>([])
  const [notPriorities, setNotPriorities] = useState<(keyof DNAScores)[]>([])
  const [unassigned, setUnassigned] = useState<(keyof DNAScores)[]>(ALL_KEYS)

  // Community
  const [pinnedCities, setPinnedCities] = useState<string[]>([])
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null)
  const [showAllCities, setShowAllCities] = useState(false)
  const [selectedMetro, setSelectedMetro] = useState(initialMetro ?? 'State')
  const [sandboxTouched, setSandboxTouched] = useState(false)

  // UI
  const [ctaError, setCtaError] = useState<string | null>(null)
  const [committing, setCommitting] = useState(false)
  const [reportMatch, setReportMatch] = useState<CityMatch | null>(null)
  const [mustHaveError, setMustHaveError] = useState(false)
  const [originCity, setOriginCity] = useState<string | null>(null)
  const [originState, setOriginState] = useState<string | null>(null)

  const priorityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const incomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const personalityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [personalityPreference, setPersonalityPreference] = useState<{
    growthProfile: number
    pace: number
    culture: number
    environment: number
    lifestyleOrientation: number
  }>({
    growthProfile: 5,
    pace: 5,
    culture: 5,
    environment: 5,
    lifestyleOrientation: 5,
  })

  // Suppress unused import warning — session is required by parent contract
  void session

  // Load DB state
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s?.user?.email) return
      const { data } = await supabase
        .from('users')
        .select('sandbox_committed,sandbox_profile,sandbox_committed_at,chosen_communities,home_status,exact_home_proceeds,available_funds,annual_income_override,loan_term_preference,origin_city,origin_state,origin_zip,growth_profile,lifestyle_orientation,environment,pace')
        .eq('email', s.user.email.toLowerCase())
        .maybeSingle()
      if (!data) return
      console.log('[OriginDebug] origin_city:', data.origin_city, 'origin_zip:', data.origin_zip)

      if (data.sandbox_committed) { onAdvanceToConnect(); return }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any
      setPersonalityPreference({
        growthProfile: d.growth_profile ?? 5,
        pace: d.pace ?? 5,
        culture: 5,
        environment: d.environment ?? 5,
        lifestyleOrientation: d.lifestyle_orientation ?? 5,
      })

      if (data.home_status === 'selling') setIsSelling(true)

      if (data.sandbox_profile) {
        const sp: SandboxProfile = data.sandbox_profile
        const SANDBOX_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000
        const sandboxAge = data.sandbox_committed_at
          ? Date.now() - new Date(data.sandbox_committed_at).getTime()
          : Infinity
        const useSandboxPriorities = sandboxAge <= SANDBOX_MAX_AGE_MS
        if (useSandboxPriorities) {
          if (sp.mustHaves?.length) setMustHaves(sp.mustHaves)
          if (sp.niceToHaves?.length) setNiceToHaves(sp.niceToHaves)
          if (sp.notPriorities?.length) setNotPriorities(sp.notPriorities)
          if (sp.unassigned !== undefined) setUnassigned(sp.unassigned)
          setSandboxTouched(true)
        }
        if (sp.interestRateOverride) setInterestRate(sp.interestRateOverride)
      }

      if (data.exact_home_proceeds) setProceeds(fmtCurrency(String(data.exact_home_proceeds)))
      if (data.available_funds) setSavings(fmtCurrency(String(data.available_funds)))

      if (data.annual_income_override) {
        setIncomeVal(data.annual_income_override)
        setIncomeDisplay(fmtCurrency(String(data.annual_income_override)))
      }
      if (data.loan_term_preference === 15 || data.loan_term_preference === 30) {
        setLoanTerm(data.loan_term_preference)
      }
      if (Array.isArray(data.chosen_communities) && data.chosen_communities.length > 0) {
        setPinnedCities(data.chosen_communities)
      }

      // Origin city fallback chain: users.origin_city → sessionStorage → ZIP lookup → write-back to DB
      let resolvedCity: string | null = data.origin_city || (typeof window !== 'undefined' ? sessionStorage.getItem('hq_origin_city') : null) || null
      let resolvedState: string | null = data.origin_state || (typeof window !== 'undefined' ? sessionStorage.getItem('hq_origin_state') : null) || null
      if (!resolvedCity && data.origin_zip) {
        try {
          console.log('[ZipLookup] fetching zip:', data.origin_zip)
          const zipResult = await lookupZipCityState(data.origin_zip)
          console.log('[ZipLookup] result:', zipResult)
          if (zipResult?.city) {
            resolvedCity = zipResult.city
            if (!resolvedState && zipResult.state) resolvedState = zipResult.state
            // Cache in sessionStorage
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('hq_origin_city', zipResult.city)
              if (zipResult.state) sessionStorage.setItem('hq_origin_state', zipResult.state)
            }
            // Write back to DB so this only resolves once
            await supabase.from('users').update({
              origin_city: zipResult.city,
              origin_state: zipResult.state ?? null,
            }).eq('email', s.user.email.toLowerCase())
          }
        } catch (err) {
          console.error('[ZipLookup] failed:', err)
        }
      }
      if (resolvedCity) setOriginCity(resolvedCity)
      if (resolvedState) setOriginState(resolvedState)
    }
    load()
  }, [onAdvanceToConnect])

  // Seed from profile
  useEffect(() => {
    if (!profile) return
    if (mustHaves.length === 0 && niceToHaves.length === 0) {
      if (profile.mustHaves?.length > 0 || profile.niceToHaves?.length > 0 || profile.notPriorities?.length > 0) {
        setMustHaves(profile.mustHaves ?? [])
        const used = new Set([...(profile.mustHaves ?? []), ...(profile.niceToHaves ?? []), ...(profile.notPriorities ?? [])])
        setNiceToHaves(profile.niceToHaves ?? [])
        setNotPriorities(profile.notPriorities ?? [])
        setUnassigned(ALL_KEYS.filter(k => !used.has(k)))
      } else {
        setNiceToHaves(ALL_KEYS)
        setUnassigned([])
      }
    }
    if (!incomeDisplay && profile.annualIncome) {
      setIncomeVal(profile.annualIncome)
      setIncomeDisplay(fmtCurrency(String(profile.annualIncome)))
    }
  }, [profile]) // eslint-disable-line react-hooks/exhaustive-deps

  // Computed
  const proceedsNum = parseMoney(proceeds)
  const savingsNum = parseMoney(savings)
  const totalFunds = (isSelling ? proceedsNum : 0) + savingsNum

  const sandboxProfile: UserProfile = {
    annualIncome: incomeVal || profile?.annualIncome || 100000,
    householdSize: profile?.householdSize ?? '1',
    movingTimeline: profile?.movingTimeline ?? 'exploring',
    mustHaves,
    niceToHaves,
    notPriorities,
    financial_picture: {
      is_homeowner: isSelling,
      home_sale_proceeds: isSelling ? (proceeds || null) : null,
      down_payment_available: savings || '$0',
      purchase_timeline: profile?.financial_picture?.purchase_timeline ?? 'exploring',
    },
    archetype: profile?.archetype,
    personalityPreference,
  }

  const baseProfile = (!sandboxTouched && profile) ? profile : sandboxProfile
  const activeProfile: UserProfile = { ...baseProfile, personalityPreference }

  const metroCities = selectedMetro === 'State'
    ? getAllCities()
    : getAllCities().filter(c => c.metroUsed.includes(selectedMetro))

  const { topMatches: rankedCities } = getTopMatches(activeProfile, metroCities, 20, 'hard')

  function afStatus(medianPrice: number): 'comfortable' | 'moderate' | 'stretched' {
    const income = incomeVal || profile?.annualIncome || 0
    if (income <= 0) return 'stretched'
    const rate = loanTerm === 15 ? Math.max(interestRate - 0.5, 2) : interestRate
    const monthly = calcMonthly(medianPrice, rate, loanTerm)
    const maxMonthly = income / 12 * 0.28
    const ratio = maxMonthly > 0 ? monthly / maxMonthly : 99
    if (ratio < 0.85) return 'comfortable'
    if (ratio <= 1.1) return 'moderate'
    return 'stretched'
  }

  const afColor = (s: 'comfortable' | 'moderate' | 'stretched') =>
    s === 'comfortable' ? '#34C759' : s === 'moderate' ? '#F5A623' : '#FF3B30'

  const afLabel = (s: 'comfortable' | 'moderate' | 'stretched') =>
    s === 'comfortable' ? 'Comfortable' : s === 'moderate' ? 'Moderate' : 'Stretched'

  const refCityData = getAllCities().find(c => c.id === pinnedCities[0])
  const refPrice = refCityData?.housing.medianHomePrice ?? 385000
  const refBalance = Math.max(0, refPrice - totalFunds)
  const refRate = loanTerm === 15 ? Math.max(interestRate - 0.5, 2) : interestRate
  const refMonthly = calcMonthly(refBalance, refRate, loanTerm)

  function findMatch(cityId: string): CityMatch | undefined {
    return rankedCities.find(m => m.location.id === cityId) ?? matches.find(m => m.location.id === cityId)
  }

  async function persistPinned(ids: string[]) {
    try {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s?.user?.email) return
      await supabase.from('users').update({ chosen_communities: ids }).eq('email', s.user.email.toLowerCase())
    } catch {}
  }

  async function persistNumbers(updates: Record<string, unknown>) {
    try {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s?.user?.email) return
      await supabase.from('users').update(updates).eq('email', s.user.email.toLowerCase())
    } catch {}
  }

  function debounceSavePriorities(mh: (keyof DNAScores)[], nh: (keyof DNAScores)[], np: (keyof DNAScores)[], ua: (keyof DNAScores)[]) {
    if (priorityTimerRef.current) clearTimeout(priorityTimerRef.current)
    priorityTimerRef.current = setTimeout(async () => {
      try {
        const supabase = createClient()
        const { data: { session: s } } = await supabase.auth.getSession()
        if (!s?.user?.email) return
        await supabase.from('users').update({
          sandbox_profile: {
            downPaymentOverride: savings || '$0',
            proceedsOverride: isSelling ? (proceeds || null) : null,
            interestRateOverride: interestRate,
            mustHaves: mh, niceToHaves: nh, notPriorities: np, unassigned: ua,
          }
        }).eq('email', s.user.email.toLowerCase())
      } catch {}
    }, 600)
  }

  function movePriority(key: keyof DNAScores, direction: 'up' | 'down') {
    setSandboxTouched(true)
    const inMH = mustHaves.includes(key)
    const inNH = niceToHaves.includes(key)

    if (inNH && direction === 'up' && mustHaves.length >= 3) {
      setMustHaveError(true)
      setTimeout(() => setMustHaveError(false), 3000)
      return
    }

    let newMH = mustHaves.filter(k => k !== key)
    let newNH = niceToHaves.filter(k => k !== key)
    let newNP = notPriorities.filter(k => k !== key)
    const newUA = unassigned.filter(k => k !== key)

    if (inMH && direction === 'down') newNH = [...newNH, key]
    else if (inNH && direction === 'up') newMH = [...newMH, key]
    else if (inNH && direction === 'down') newNP = [...newNP, key]
    else newNH = [...newNH, key]

    setMustHaves(newMH); setNiceToHaves(newNH); setNotPriorities(newNP); setUnassigned(newUA)
    debounceSavePriorities(newMH, newNH, newNP, newUA)
  }

  async function handlePersonalityChange(key: string, value: number) {
    setPersonalityPreference(prev => ({ ...prev, [key]: value }))
    if (personalityDebounceRef.current) clearTimeout(personalityDebounceRef.current)
    personalityDebounceRef.current = setTimeout(async () => {
      try {
        const supabase = createClient()
        const { data: { session: s } } = await supabase.auth.getSession()
        if (!s?.user?.email) return
        const colMap: Record<string, string> = {
          growthProfile: 'growth_profile',
          lifestyleOrientation: 'lifestyle_orientation',
          environment: 'environment',
          pace: 'pace',
        }
        const col = colMap[key]
        if (col) {
          await supabase.from('users').update({ [col]: value }).eq('email', s.user.email.toLowerCase())
        }
      } catch {}
    }, 800)
  }

  async function pinCity(cityId: string) {
    if (pinnedCities.includes(cityId) || pinnedCities.length >= 3) return
    const updated = [...pinnedCities, cityId]
    setPinnedCities(updated)
    setCtaError(null)
    await persistPinned(updated)
  }

  async function unpinCity(cityId: string) {
    const updated = pinnedCities.filter(id => id !== cityId)
    setPinnedCities(updated)
    await persistPinned(updated)
  }

  async function handleCommit() {
    if (pinnedCities.length === 0) {
      setCtaError('Pin at least one community before scheduling your consultation.')
      return
    }
    setCtaError(null)
    setCommitting(true)
    try {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s?.user?.email) return

      const sandboxData: SandboxProfile = {
        downPaymentOverride: savings || '$0',
        proceedsOverride: isSelling ? (proceeds || null) : null,
        interestRateOverride: interestRate,
        mustHaves, niceToHaves, notPriorities, unassigned,
        citiesLocked: true,
      }

      await supabase.from('users').update({
        current_milemarker: 4,
        sandbox_profile: sandboxData,
        sandbox_committed: true,
        sandbox_committed_at: new Date().toISOString(),
        chosen_communities: pinnedCities,
        exact_home_proceeds: isSelling ? (proceedsNum || null) : null,
        exact_down_payment: savingsNum || null,
        loan_term_preference: loanTerm,
        financials_locked: true,
        annual_income_override: incomeVal || null,
      }).eq('email', s.user.email.toLowerCase())

      onAdvanceToConnect()
    } catch (err) {
      console.error('[MM3] commit failed:', err)
      setCtaError('Something went wrong. Please try again.')
    } finally {
      setCommitting(false)
    }
  }

  const lessImportant = [...notPriorities, ...unassigned]

  const effectiveSelectedId = selectedCityId ?? rankedCities[0]?.location.id
  const selectedMatch = rankedCities.find(m => m.location.id === effectiveSelectedId)
  const selectedRankIdx = rankedCities.findIndex(m => m.location.id === effectiveSelectedId)
  const displayedCities = showAllCities ? rankedCities : rankedCities.slice(0, 5)

  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────
  return (
    <>
      {/* Full report modal overlay */}
      {reportMatch && (
        <div
          onClick={() => setReportMatch(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', overflowY: 'auto',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setReportMatch(null)}
                style={{ fontSize: '13px', color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>
            <FullReport match={reportMatch} profile={activeProfile} />
          </div>
        </div>
      )}

      {/* 40/60 dashboard layout */}
      <div style={{ display: 'flex', minHeight: '100%' }}>

        {/* ── NAVY DASHBOARD — 40% ── */}
        <div style={{
          width: '25%', flexShrink: 0,
          background: '#0A1E3D',
          display: 'flex', flexDirection: 'column',
          position: 'sticky', top: 0, height: '100%',
          overflow: 'hidden', alignSelf: 'flex-start',
        }}>
          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* YOUR DIRECTION */}
            <div>
              <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 8px' }}>
                Your direction
              </p>

              {/* 3 pinned city slots */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[0, 1, 2].map(i => {
                  const cityId = pinnedCities[i]
                  const match = cityId ? findMatch(cityId) : undefined
                  const cityLoc = match?.location ?? (cityId ? getAllCities().find(c => c.id === cityId) : undefined)
                  const status = cityLoc ? afStatus(cityLoc.housing.medianHomePrice) : null
                  const isFirst = i === 0

                  if (cityLoc) {
                    return (
                      <div key={cityId} style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: `0.5px solid ${isFirst ? '#C5B783' : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: '8px', padding: '8px 10px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        position: 'relative',
                      }}>
                        <button
                          type="button"
                          onClick={() => unpinCity(cityId)}
                          style={{
                            position: 'absolute', top: '4px', right: '6px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'rgba(255,255,255,0.35)', fontSize: '12px', lineHeight: 1,
                            padding: '2px 3px', fontFamily: 'inherit',
                          }}
                          aria-label={`Unpin ${cityLoc.name}`}
                        >
                          ✕
                        </button>
                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', position: 'relative', flexShrink: 0, background: '#1a3558' }}>
                          <Image
                            src={cityLoc.cityImageUrl ?? `/images/cities/${cityLoc.id}.jpg`}
                            alt={cityLoc.name} fill style={{ objectFit: 'cover' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: '13px', color: '#fff', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {cityLoc.name}
                            </p>
                            {match && (
                              <span style={{ fontSize: '11px', color: '#C5B783', fontWeight: 500, flexShrink: 0, marginLeft: '4px' }}>
                                {match.matchScore}%
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cityLoc.metroUsed}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: afColor(status!), flexShrink: 0 }} />
                            <span style={{ fontSize: '9px', color: afColor(status!) }}>{afLabel(status!)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={i} style={{ border: '0.5px dashed rgba(255,255,255,0.14)', borderRadius: '8px', padding: '10px 12px' }}>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic', margin: 0 }}>
                        + Pin a community →
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* PRIORITIES SUMMARY */}
            {(mustHaves.length > 0 || niceToHaves.length > 0) && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 6px' }}>
                  What matters most
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {mustHaves.slice(0, 3).map(key => {
                    const cat = DNA_CATEGORIES.find(c => c.key === key)
                    if (!cat) return null
                    return (
                      <span key={key} style={{
                        background: 'rgba(197,183,131,0.2)', color: '#C5B783',
                        border: '0.5px solid rgba(197,183,131,0.4)',
                        borderRadius: '12px', padding: '3px 8px', fontSize: '10px',
                      }}>
                        {cat.icon} {cat.label}
                      </span>
                    )
                  })}
                  {niceToHaves.slice(0, 3).map(key => {
                    const cat = DNA_CATEGORIES.find(c => c.key === key)
                    if (!cat) return null
                    return (
                      <span key={key} style={{
                        background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                        border: '0.5px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px', padding: '3px 8px', fontSize: '10px',
                      }}>
                        {cat.icon} {cat.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* BUYING POWER 2×2 GRID */}
            <div>
              <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 8px' }}>
                Buying power
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  {
                    label: 'Est. budget',
                    value: totalFunds > 0 ? fmtK(totalFunds) : '—',
                    sub: isSelling ? 'Proceeds + savings' : 'Available funds',
                    subColor: undefined as string | undefined,
                  },
                  {
                    label: 'Monthly est.',
                    value: refMonthly > 0 ? `$${refMonthly.toLocaleString()}` : '—',
                    sub: `${loanTerm}yr P+I`,
                    subColor: undefined as string | undefined,
                  },
                  {
                    label: 'Annual income',
                    value: incomeDisplay || (profile?.annualIncome ? fmtCurrency(String(profile.annualIncome)) : '—'),
                    sub: 'Household',
                    subColor: undefined as string | undefined,
                  },
                  {
                    label: 'Interest rate',
                    value: `${interestRate}%`,
                    sub: interestRate >= 6.25 && interestRate <= 6.75 ? '● In market band' : 'Market: 6.25–6.75%',
                    subColor: interestRate >= 6.25 && interestRate <= 6.75 ? '#48c78e' : undefined,
                  },
                ].map(cell => (
                  <div key={cell.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '7px 9px' }}>
                    <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', margin: '0 0 3px' }}>{cell.label}</p>
                    <p style={{ fontSize: '15px', fontWeight: 500, color: '#fff', margin: '0 0 2px', lineHeight: 1.1 }}>{cell.value}</p>
                    <p style={{ fontSize: '9px', color: cell.subColor ?? 'rgba(255,255,255,0.4)', margin: 0 }}>{cell.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* COMPARISON CHART */}
            {(() => {
              console.log('[ComparisonChart] pinnedCities:', pinnedCities)
              console.log('[ComparisonChart] originCity resolved to:', originCity)
              console.log('[ComparisonChart] should render:', pinnedCities.length > 0 && !!originCity)

              if (pinnedCities.length === 0 || !originCity) return null

              const originData = lookupOriginCity(originCity)
              if (!originData) {
                console.log('[ComparisonChart] no lookup match for:', originCity)
                return null
              }

              const pinnedMatches = pinnedCities.map(id => getAllCities().find(c => c.id === id)).filter(Boolean)

              const chartRows: {
                label: string
                originVal: string
                txVals: string[]
                better?: (txVal: string, idx: number) => boolean
                alwaysGreen?: boolean
                prefix?: string
              }[] = [
                {
                  label: 'COL Index',
                  originVal: String(originData.colIndex),
                  txVals: pinnedMatches.map(c => String(txColIndex(c!.metroUsed))),
                  better: (txVal) => parseInt(txVal) < originData.colIndex,
                  prefix: '↓',
                },
                {
                  label: 'Median Home',
                  originVal: originData.medianHome,
                  txVals: pinnedMatches.map(c => fmtK(c!.housing.medianHomePrice)),
                  better: (_txVal, idx) => pinnedMatches[idx] ? pinnedMatches[idx]!.housing.medianHomePrice < parseHomePrice(originData.medianHome) : false,
                  prefix: '↓',
                },
                {
                  label: 'Property Tax',
                  originVal: '—',
                  txVals: pinnedMatches.map(c => txPropertyTax(c!.metroUsed)),
                },
                {
                  label: 'State Inc. Tax',
                  originVal: originData.incomeTax,
                  txVals: pinnedMatches.map(() => 'None (TX)'),
                  alwaysGreen: true,
                },
                {
                  label: 'Schools',
                  originVal: originData.schoolRating,
                  txVals: pinnedMatches.map(c => c!.school?.teaRating ?? '—'),
                },
                {
                  label: 'Crime/Safety',
                  originVal: originData.safety,
                  txVals: pinnedMatches.map(c => txSafety(c!.scores.safety)),
                },
                {
                  label: 'Job Market',
                  originVal: '—',
                  txVals: pinnedMatches.map(c => txJobMarket(c!.metroUsed)),
                },
                {
                  label: 'Climate',
                  originVal: originData.climate,
                  txVals: pinnedMatches.map(c => txClimateV2(c!.metroUsed)),
                },
              ]

              return (
                <div>
                  <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Texas vs. {originCity}{originState ? `, ${originState}` : ''}
                  </p>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', padding: '4px 6px', textAlign: 'left', fontWeight: 400 }}></th>
                          <th style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', padding: '4px 6px', textAlign: 'right', fontWeight: 400, whiteSpace: 'nowrap' }}>
                            {originCity}
                          </th>
                          {pinnedMatches.map(c => (
                            <th key={c!.id} style={{ fontSize: '9px', color: '#C5B783', padding: '4px 6px', textAlign: 'right', fontWeight: 500, whiteSpace: 'nowrap' }}>
                              {c!.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chartRows.map(row => (
                          <tr key={row.label} style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', padding: '5px 6px', whiteSpace: 'nowrap' }}>{row.label}</td>
                            <td style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', padding: '5px 6px', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.originVal}</td>
                            {row.txVals.map((val, ci) => {
                              const isBetter = row.alwaysGreen === true || (row.better ? row.better(val, ci) : false)
                              return (
                                <td key={ci} style={{
                                  fontSize: '10px',
                                  color: isBetter ? '#48c78e' : 'rgba(255,255,255,0.7)',
                                  fontWeight: isBetter ? 500 : 400,
                                  padding: '5px 6px',
                                  textAlign: 'right',
                                  whiteSpace: 'nowrap',
                                }}>
                                  {isBetter && row.prefix ? `${row.prefix} ` : ''}{val}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })()}

          </div>{/* end scrollable content */}

          {/* Fixed CTA */}
          <div style={{ flexShrink: 0, padding: '12px 16px 16px', borderTop: '0.5px solid rgba(255,255,255,0.1)', background: '#0A1E3D' }}>
            {ctaError && (
              <p style={{ fontSize: '10px', color: '#FF6B6B', margin: '0 0 6px', textAlign: 'center', lineHeight: 1.4 }}>
                {ctaError}
              </p>
            )}
            <button
              type="button" onClick={handleCommit} disabled={committing}
              style={{
                width: '100%', background: '#C5B783', color: '#0A1E3D',
                border: 'none', borderRadius: '8px', padding: '12px',
                fontWeight: 500, fontSize: '14px',
                cursor: committing ? 'not-allowed' : 'pointer',
                opacity: committing ? 0.7 : 1, fontFamily: 'inherit',
              }}
            >
              {committing ? 'Saving…' : 'Schedule a Consultation →'}
            </button>
            {!ctaError && (
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.18)', textAlign: 'center', margin: '5px 0 0', lineHeight: 1.4 }}>
                Pin at least one community first
              </p>
            )}
          </div>
        </div>

        {/* ── TOOLBOX — 60% ── */}
        <div style={{ flex: 1, background: '#F2F1EE', minWidth: 0, padding: '16px', overflowY: 'auto' }}>

          {/* Communities heading */}
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 2px' }}>Your communities</p>
          <p style={{ fontSize: '10px', color: '#888', margin: '0 0 10px' }}>Click any city to preview. Pin up to 3.</p>

          {/* Communities frame */}
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ display: 'flex', minHeight: '280px', alignItems: 'stretch' }}>

              {/* Left: metro pills + city list (52%) */}
              <div style={{ width: '52%', borderRight: '0.5px solid #E8E6E2', display: 'flex', flexDirection: 'column' }}>
                {/* Metro pills */}
                <div style={{ padding: '10px 12px 8px', display: 'flex', gap: '5px', flexWrap: 'wrap', borderBottom: '0.5px solid #F0EEE9' }}>
                  {METRO_FILTERS.map(f => {
                    const active = selectedMetro === f.value
                    return (
                      <button key={f.value} type="button"
                        onClick={() => { setSelectedMetro(f.value); setSelectedCityId(null); setShowAllCities(false) }}
                        style={{
                          padding: '3px 9px', borderRadius: '20px', fontSize: '10px',
                          fontWeight: active ? 500 : 400,
                          background: active ? '#0A1E3D' : 'transparent',
                          color: active ? '#fff' : '#6B6A65',
                          border: `0.5px solid ${active ? '#0A1E3D' : '#D0CEC8'}`,
                          cursor: 'pointer',
                        }}>{f.label}</button>
                    )
                  })}
                </div>

                {/* City list */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 12px' }}>
                  {rankedCities.length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#86868b', margin: '12px 0' }}>No communities in this metro.</p>
                  ) : (
                    <>
                      {displayedCities.map(match => {
                        const city = match.location
                        const isPinned = pinnedCities.includes(city.id)
                        const isSelected = city.id === effectiveSelectedId
                        const status = afStatus(city.housing.medianHomePrice)
                        const overallIdx = rankedCities.findIndex(m => m.location.id === city.id)

                        let rowBg = 'transparent'
                        let rowBorder = 'transparent'
                        if (isPinned) { rowBg = '#FEFDF8'; rowBorder = '#C5B783' }
                        else if (isSelected) { rowBg = '#F0F3F8'; rowBorder = '#0A1E3D' }

                        return (
                          <div key={city.id} onClick={() => setSelectedCityId(city.id)}
                            style={{
                              background: rowBg, border: `0.5px solid ${rowBorder}`,
                              borderRadius: '6px', padding: '6px 8px',
                              display: 'flex', alignItems: 'center', gap: '6px',
                              marginBottom: '2px', cursor: 'pointer',
                            }}
                            onMouseEnter={e => { if (!isSelected && !isPinned) (e.currentTarget as HTMLDivElement).style.background = '#F5F5F7' }}
                            onMouseLeave={e => { if (!isSelected && !isPinned) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                          >
                            <span style={{ fontSize: '9px', color: '#86868b', width: '18px', flexShrink: 0 }}>#{overallIdx + 1}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: '11px', color: '#1d1d1f', fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city.name}</p>
                              <p style={{ fontSize: '9px', color: '#86868b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city.metroUsed}</p>
                            </div>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: afColor(status), flexShrink: 0 }} />
                            <span style={{ fontSize: '10px', color: '#C5B783', fontWeight: 500, flexShrink: 0 }}>{match.matchScore}%</span>
                            <button type="button"
                              onClick={e => { e.stopPropagation(); isPinned ? unpinCity(city.id) : pinCity(city.id) }}
                              disabled={!isPinned && pinnedCities.length >= 3}
                              style={{
                                fontSize: '9px', color: isPinned ? '#C5B783' : '#0076B6',
                                padding: '2px 5px', borderRadius: '8px',
                                border: isPinned ? '0.5px solid rgba(197,183,131,0.4)' : '0.5px solid #C8E0F5',
                                background: isPinned ? 'rgba(197,183,131,0.1)' : '#F0F7FF',
                                cursor: (!isPinned && pinnedCities.length >= 3) ? 'not-allowed' : 'pointer',
                                flexShrink: 0,
                                opacity: !isPinned && pinnedCities.length >= 3 ? 0.38 : 1,
                              }}>
                              {isPinned ? '✓' : 'Pin'}
                            </button>
                          </div>
                        )
                      })}

                      {rankedCities.length > 5 && (
                        <div onClick={() => setShowAllCities(v => !v)}
                          style={{ textAlign: 'center', padding: '6px', fontSize: '10px', color: '#0076B6', cursor: 'pointer', borderTop: '0.5px solid #E8E6E2', marginTop: '4px' }}>
                          {showAllCities ? 'Show less ↑' : 'Show more ↓'}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Right: preview card — 50/50 square photo + info */}
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                {selectedMatch ? (() => {
                  const city = selectedMatch.location
                  const isPinned = pinnedCities.includes(city.id)
                  const status = afStatus(city.housing.medianHomePrice)
                  const statusBadge = status === 'comfortable'
                    ? { bg: '#E8F5EE', color: '#1a6b35' }
                    : status === 'moderate'
                    ? { bg: '#FAEEDA', color: '#633806' }
                    : { bg: '#FCEBEB', color: '#A32D2D' }

                  return (
                    <div style={{ display: 'flex', height: '100%', minHeight: '220px' }}>
                      {/* Left: square photo (50%) */}
                      <div style={{ width: '50%', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#2D4A6B' }}>
                        <Image
                          src={city.cityImageUrl ?? `/images/cities/${city.id}.jpg`}
                          alt={city.name} fill style={{ objectFit: 'cover' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                        <div style={{ position: 'absolute', bottom: '8px', left: '8px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <span style={{ fontSize: '9px', fontWeight: 500, background: '#C5B783', color: '#0A1E3D', padding: '2px 6px', borderRadius: '4px' }}>
                            {rankPillLabel(selectedRankIdx)}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: '#fff' }}>
                            {selectedMatch.matchScore}%
                          </span>
                        </div>
                      </div>

                      {/* Right: info (50%) */}
                      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }}>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>{city.name}</p>
                          <p style={{ fontSize: '9px', color: '#86868b', margin: '1px 0 0' }}>{city.metroUsed} · {city.county} County</p>
                        </div>

                        <p style={{
                          fontSize: '10px', color: '#3a3a3a', lineHeight: 1.5, margin: 0,
                          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        } as React.CSSProperties}>
                          {city.description}
                        </p>

                        {/* 2×2 stat grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                          {[
                            { label: 'Schools',   value: city.school?.teaRating ? `${city.school.teaRating} rated` : '—' },
                            { label: 'Med home',  value: fmtK(city.housing.medianHomePrice) },
                            { label: 'Safety',    value: city.scores.safety >= 7 ? 'Low risk' : city.scores.safety >= 4 ? 'Moderate' : 'Higher risk' },
                            { label: 'Community', value: communityCharLabel(city.personality.environment) },
                          ].map(stat => (
                            <div key={stat.label} style={{ background: '#F5F4F1', borderRadius: '5px', padding: '4px 6px' }}>
                              <p style={{ fontSize: '8px', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 1px' }}>{stat.label}</p>
                              <p style={{ fontSize: '10px', color: '#1d1d1f', fontWeight: 500, margin: 0 }}>{stat.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Budget fit */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: '#86868b' }}>Budget fit</span>
                          <span style={{ background: statusBadge.bg, color: statusBadge.color, borderRadius: '12px', padding: '2px 8px', fontSize: '9px', fontWeight: 500 }}>
                            {afLabel(status)}
                          </span>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '5px', marginTop: 'auto' }}>
                          <button type="button"
                            onClick={() => isPinned ? unpinCity(city.id) : pinCity(city.id)}
                            disabled={!isPinned && pinnedCities.length >= 3}
                            style={{
                              flex: 1, background: isPinned ? 'rgba(197,183,131,0.15)' : '#0A1E3D',
                              color: isPinned ? '#C5B783' : '#fff',
                              border: isPinned ? '0.5px solid rgba(197,183,131,0.4)' : 'none',
                              borderRadius: '6px', padding: '6px', fontSize: '9px', fontWeight: 500,
                              cursor: (!isPinned && pinnedCities.length >= 3) ? 'not-allowed' : 'pointer',
                              opacity: !isPinned && pinnedCities.length >= 3 ? 0.5 : 1,
                              fontFamily: 'inherit', textAlign: 'center',
                            }}>
                            {isPinned ? 'Pinned ✓' : 'Pin'}
                          </button>
                          <button type="button"
                            onClick={() => setReportMatch(selectedMatch)}
                            style={{
                              flex: 1, border: '0.5px solid #0A1E3D', borderRadius: '6px',
                              padding: '6px', fontSize: '9px', color: '#0A1E3D',
                              background: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                            }}>
                            Full report →
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })() : (
                  <div style={{ padding: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#86868b', margin: 0 }}>Select a city to preview.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lower 2-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'stretch' }}>

            {/* PRIORITIES PANEL */}
            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', padding: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 2px' }}>Your priorities</p>
              <p style={{ fontSize: '10px', color: '#888', margin: '0 0 8px' }}>Click to move between columns</p>

              <p style={{ fontSize: '10px', color: '#6B6A65', margin: '0 0 8px' }}>
                <span style={{ color: mustHaves.length >= 3 ? '#1a6b35' : undefined, fontWeight: mustHaves.length >= 3 ? 500 : undefined }}>
                  {mustHaves.length}/3 Must Haves{mustHaves.length >= 3 ? ' ✓' : ''}
                </span>
                {' · '}{niceToHaves.length} Important{' · '}{lessImportant.length} Nice
              </p>

              {mustHaveError && (
                <p style={{ fontSize: '10px', color: '#F5A623', fontStyle: 'italic', margin: '0 0 6px' }}>
                  Must Have is limited to 3. Move one first.
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', margin: '0 -12px -12px' }}>
                {/* Must Have — warm tint */}
                <div style={{ background: '#FDFAF4', borderRight: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 8px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#8a6f00', textTransform: 'uppercase', margin: '0 0 2px' }}>Must have</p>
                  <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>Up to 3 · 3× weight</p>
                  {mustHaves.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                  {mustHaves.map(key => {
                    const cat = DNA_CATEGORIES.find(c => c.key === key)!
                    return (
                      <div key={key} onClick={() => movePriority(key, 'down')}
                        style={{ background: 'rgba(197,183,131,0.15)', borderRadius: '4px', padding: '4px 6px', marginBottom: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '3px', border: '0.5px solid rgba(197,183,131,0.3)' }}>
                        <span style={{ fontSize: '9px', color: '#5a4a00', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
                        <span style={{ color: '#0076B6', fontSize: '9px', flexShrink: 0 }}>→</span>
                      </div>
                    )
                  })}
                </div>

                {/* Important to Me — neutral */}
                <div style={{ background: '#FAFAFA', borderRight: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 8px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#444', textTransform: 'uppercase', margin: '0 0 2px' }}>Important to me</p>
                  <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>Up to 5 · 2× weight</p>
                  {niceToHaves.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                  {niceToHaves.map(key => {
                    const cat = DNA_CATEGORIES.find(c => c.key === key)!
                    return (
                      <div key={key} style={{ background: '#F0F0F0', borderRadius: '4px', padding: '3px 4px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <button type="button" onClick={() => movePriority(key, 'up')}
                          style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>←</button>
                        <span style={{ flex: 1, fontSize: '9px', color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
                        <button type="button" onClick={() => movePriority(key, 'down')}
                          style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>→</button>
                      </div>
                    )
                  })}
                </div>

                {/* Would Be Nice — lightest */}
                <div style={{ background: '#F7F7F7', padding: '10px 8px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#666', textTransform: 'uppercase', margin: '0 0 2px' }}>Would be nice</p>
                  <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>1× weight</p>
                  {lessImportant.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                  {lessImportant.map(key => {
                    const cat = DNA_CATEGORIES.find(c => c.key === key)!
                    return (
                      <div key={key} style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '4px', padding: '3px 4px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <button type="button" onClick={() => movePriority(key, 'up')}
                          style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>←</button>
                        <span style={{ flex: 1, fontSize: '9px', color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Personality sliders */}
              <div style={{
                borderTop: '0.5px solid rgba(0,0,0,0.08)',
                padding: '12px 12px 4px',
                marginTop: '4px',
              }}>
                <p style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#666',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Your personality
                </p>
                {([
                  { key: 'growthProfile', left: 'Established', right: 'Up-and-Coming' },
                  { key: 'lifestyleOrientation', left: 'Practical', right: 'Upscale & Aspirational' },
                  { key: 'environment', left: 'Urban', right: 'Rural' },
                  { key: 'pace', left: 'Relaxed', right: 'Fast-paced' },
                ] as const).map(({ key, left, right }) => (
                  <SliderRow
                    key={key}
                    leftLabel={left}
                    rightLabel={right}
                    value={personalityPreference[key]}
                    onChange={(v) => handlePersonalityChange(key, v)}
                  />
                ))}
              </div>
            </div>

            {/* NUMBERS PANEL */}
            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', padding: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 2px' }}>Your numbers</p>
              <p style={{ fontSize: '10px', color: '#888', margin: '0 0 10px' }}>Adjust to update buying power live</p>

              {/* Selling toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#1d1d1f' }}>Selling a home?</span>
                {(['Yes', 'No'] as const).map(v => {
                  const active = (v === 'Yes') === isSelling
                  return (
                    <button key={v} type="button" onClick={() => { setIsSelling(v === 'Yes'); setSandboxTouched(true) }}
                      style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', background: active ? '#0A1E3D' : '#fff', color: active ? '#fff' : '#6B6A65', border: `0.5px solid ${active ? '#0A1E3D' : '#D0CEC8'}`, cursor: 'pointer' }}>
                      {v}
                    </button>
                  )
                })}
              </div>

              {/* Proceeds */}
              {isSelling && (
                <div style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '10px', color: '#86868b', margin: '0 0 3px' }}>Expected sale proceeds</p>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '0.5px solid #E0DED8', borderRadius: '7px', overflow: 'hidden' }}>
                    <span style={{ padding: '5px 7px', fontSize: '11px', color: '#86868b', borderRight: '0.5px solid #E0DED8', background: '#FAFAF8', flexShrink: 0 }}>$</span>
                    <input type="text" value={proceeds.replace(/^\$/, '')}
                      onChange={e => { setProceeds(fmtCurrency(e.target.value)); setSandboxTouched(true) }}
                      onBlur={() => persistNumbers({ exact_home_proceeds: proceedsNum || null })}
                      placeholder="340,000"
                      style={{ border: 'none', padding: '5px 8px', fontSize: '12px', color: '#1d1d1f', background: '#fff', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
                  </div>
                </div>
              )}

              {/* Savings */}
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '10px', color: '#86868b', margin: '0 0 3px' }}>{isSelling ? 'Additional savings' : 'Available savings'}</p>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '0.5px solid #E0DED8', borderRadius: '7px', overflow: 'hidden' }}>
                  <span style={{ padding: '5px 7px', fontSize: '11px', color: '#86868b', borderRight: '0.5px solid #E0DED8', background: '#FAFAF8', flexShrink: 0 }}>$</span>
                  <input type="text" value={savings.replace(/^\$/, '')}
                    onChange={e => { setSavings(fmtCurrency(e.target.value)); setSandboxTouched(true) }}
                    onBlur={() => persistNumbers({ exact_down_payment: savingsNum || null })}
                    placeholder="75,000"
                    style={{ border: 'none', padding: '5px 8px', fontSize: '12px', color: '#1d1d1f', background: '#fff', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
                </div>
              </div>

              {/* Annual income */}
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '10px', color: '#86868b', margin: '0 0 3px' }}>Annual household income</p>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '0.5px solid #E0DED8', borderRadius: '7px', overflow: 'hidden' }}>
                  <span style={{ padding: '5px 7px', fontSize: '11px', color: '#86868b', borderRight: '0.5px solid #E0DED8', background: '#FAFAF8', flexShrink: 0 }}>$</span>
                  <input type="text" value={incomeDisplay.replace(/^\$/, '')}
                    onChange={e => {
                      setIncomeDisplay(fmtCurrency(e.target.value)); setSandboxTouched(true)
                      const parsed = parseMoney(e.target.value)
                      if (incomeTimerRef.current) clearTimeout(incomeTimerRef.current)
                      incomeTimerRef.current = setTimeout(() => { if (parsed > 0) setIncomeVal(parsed) }, 400)
                    }}
                    onBlur={() => {
                      const parsed = parseMoney(incomeDisplay)
                      if (parsed > 0) { setIncomeVal(parsed); persistNumbers({ annual_income_override: parsed }) }
                    }}
                    placeholder="100,000"
                    style={{ border: 'none', padding: '5px 8px', fontSize: '12px', color: '#1d1d1f', background: '#fff', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
                </div>
              </div>

              {/* Rate slider */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <p style={{ fontSize: '10px', color: '#86868b', margin: 0 }}>Interest rate</p>
                  <span style={{ fontSize: '11px', color: '#1d1d1f', fontWeight: 500 }}>{interestRate}%</span>
                </div>
                <div style={{ position: 'relative', height: '4px', background: 'rgba(0,0,0,0.12)', borderRadius: '2px', margin: '4px 0' }}>
                  <div style={{ position: 'absolute', height: '100%', background: '#34C759', opacity: 0.7, borderRadius: '2px', left: '46.4%', width: '7.1%' }} />
                  <input type="range" min={3} max={10} step={0.25} value={interestRate}
                    onChange={e => { setSandboxTouched(true); setInterestRate(parseFloat(e.target.value)) }}
                    style={{ position: 'absolute', top: '-6px', left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '16px' }} />
                  <div style={{
                    position: 'absolute', width: '12px', height: '12px',
                    background: '#0A1E3D', borderRadius: '50%', top: '-4px',
                    left: `calc(${(interestRate - 3) / 7 * 100}% - 6px)`,
                    pointerEvents: 'none', transition: 'left 0.1s',
                  }} />
                </div>
                <p style={{ fontSize: '9px', color: '#34C759', opacity: 0.8, margin: '2px 0 0' }}>● Current market: 6.25%–6.75%</p>
              </div>

              {/* Loan term */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                {([30, 15] as const).map(term => {
                  const active = loanTerm === term
                  return (
                    <button key={term} type="button"
                      onClick={() => { setLoanTerm(term); setSandboxTouched(true); persistNumbers({ loan_term_preference: term }) }}
                      style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', background: active ? '#0A1E3D' : '#fff', color: active ? '#fff' : '#6B6A65', border: `0.5px solid ${active ? '#0A1E3D' : '#D0CEC8'}`, cursor: 'pointer' }}>
                      {term} year
                    </button>
                  )
                })}
              </div>

              {/* Monthly estimate */}
              <div style={{ background: '#EDF2FF', borderRadius: '7px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '9px', color: '#0076B6', margin: '0 0 1px' }}>Est. monthly payment</p>
                  <p style={{ fontSize: '9px', color: '#86868b', margin: 0 }}>Principal + interest only</p>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>
                  {refMonthly > 0 ? `$${refMonthly.toLocaleString()}` : '—'}
                </p>
              </div>
            </div>

          </div>{/* end lower 2-col grid */}
        </div>{/* end toolbox */}
      </div>
    </>
  )
}
