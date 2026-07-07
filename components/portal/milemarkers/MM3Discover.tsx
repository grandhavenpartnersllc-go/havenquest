'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { CityMatch, UserProfile, UserSession, SandboxProfile, DNAScores } from '../../../types'
import FullReport from '../../results/FullReport'
import { DNA_CATEGORIES } from '../../../utils/constants'
import { getAllCities } from '../../../services/locationService'
import { getTopMatches, getDownPaymentMidpoint, getProceedsMidpoint } from '../../../services/matchingService'
import { createClient } from '../../../lib/supabase/client'
import { lookupZipCityState } from '../../../utils/zipLookup'
import CompareModal from '../../results/CompareModal'

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

// 4-tier priority chain used by the Adaptive Control Panel's Lifestyle section
// (Round 7 locked design — a genuine, visible "Not Yet Sorted" 4th group, not
// collapsed/secondary). Order matters: this is the up/down chain movePriority
// walks between.
type Tier = 'mustHave' | 'important' | 'wouldBeNice' | 'unassigned'
const TIER_ORDER: Tier[] = ['mustHave', 'important', 'wouldBeNice', 'unassigned']

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
  const [selectedMetro, setSelectedMetro] = useState(initialMetro ?? 'Austin')
  const [userHasChangedMetro, setUserHasChangedMetro] = useState(false)
  const [sandboxTouched, setSandboxTouched] = useState(true)

  // UI
  const [ctaError, setCtaError] = useState<string | null>(null)
  const [committing, setCommitting] = useState(false)
  const [reportMatch, setReportMatch] = useState<CityMatch | null>(null)
  const [mustHaveError, setMustHaveError] = useState(false)
  const [originCity, setOriginCity] = useState<string | null>(null)
  const [originState, setOriginState] = useState<string | null>(null)

  // Adaptive Control Panel (Phase B) — accordion between Lifestyle/Financials,
  // and mobile sticky-drawer state. Lifestyle expanded by default on first load.
  const [activePanel, setActivePanel] = useState<'lifestyle' | 'financials'>('lifestyle')
  const [isMobile, setIsMobile] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // Pinned-card Compare (placeholder wiring) — reuses the existing CompareModal/
  // createCompareDocument logic as-is. Pairs the clicked pinned card against
  // pinned slot #1 (or slot #2, if #1 itself was clicked); needs >=2 pinned
  // cities to have a partner.
  const [compareCityId, setCompareCityId] = useState<string | null>(null)

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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Load DB state
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s?.user?.email) return
      const { data } = await supabase
        .from('users')
        .select('sandbox_committed,sandbox_profile,sandbox_committed_at,chosen_communities,home_status,exact_home_proceeds,available_funds,annual_income_override,loan_term_preference,origin_city,origin_state,origin_zip,growth_profile,lifestyle_orientation,environment,pace,culture')
        .eq('email', s.user.email.toLowerCase())
        .maybeSingle()
      if (!data) return

      if (data.sandbox_committed) { onAdvanceToConnect(); return }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any
      setPersonalityPreference({
        growthProfile: d.growth_profile ?? 5,
        pace: d.pace ?? 5,
        culture: d.culture ?? 5,
        environment: d.environment ?? 5,
        lifestyleOrientation: d.lifestyle_orientation ?? 5,
      })

      // Sandbox override takes priority when present (home_status is only ever
      // written once a user edits these fields inside MM3 itself — Brief: fix_mm3_
      // financial_hydration). Falls back to the quiz's real financial_picture for
      // first-time visitors, who never have a sandbox override yet.
      if (data.home_status === 'selling') {
        setIsSelling(true)
      } else if (!data.home_status && profile?.financial_picture?.is_homeowner) {
        setIsSelling(true)
      }

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

      if (data.exact_home_proceeds) {
        setProceeds(fmtCurrency(String(data.exact_home_proceeds)))
      } else {
        const fp = profile?.financial_picture
        if (fp?.is_homeowner && fp.home_sale_proceeds) {
          setProceeds(fmtCurrency(String(getProceedsMidpoint(fp.home_sale_proceeds))))
        }
      }

      if (data.available_funds) {
        setSavings(fmtCurrency(String(data.available_funds)))
      } else {
        const fp = profile?.financial_picture
        if (fp?.down_payment_available) {
          setSavings(fmtCurrency(String(getDownPaymentMidpoint(fp.down_payment_available))))
        }
      }

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
    // profile is stable by mount time (parent gates rendering on `ready`); intentionally
    // run once, same as the rest of this effect's existing dependency list.
  }, [onAdvanceToConnect]) // eslint-disable-line react-hooks/exhaustive-deps

  // Seed from profile
  useEffect(() => {
    if (!profile) return
    if (mustHaves.length === 0 && niceToHaves.length === 0) {
      if (profile.mustHaves?.length > 0 || profile.niceToHaves?.length > 0 || profile.notPriorities?.length > 0) {
        setMustHaves(profile.mustHaves ?? [])
        setNiceToHaves(profile.niceToHaves ?? [])
        setNotPriorities(profile.notPriorities ?? [])
        // profile.unassignedPriorities is the real, quiz-sourced "never touched" set
        // (fix_priorities_and_interim_weighting). Falls back to [] for pre-fix accounts,
        // whose old merged notPriorities data can't be retroactively split.
        setUnassigned(profile.unassignedPriorities ?? [])
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

  // Sync metro when correct initialMetro loads (race condition fix)
  useEffect(() => {
    if (!userHasChangedMetro && initialMetro) {
      setSelectedMetro(initialMetro)
    }
  }, [initialMetro]) // eslint-disable-line react-hooks/exhaustive-deps

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
    unassignedPriorities: unassigned,
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

  // Use saved MM2 results as the ranked city list; fall back to live recompute when:
  // (a) no saved results exist, (b) the selected metro has fewer than 5 saved cities
  // (prevents stale thin results from blocking a full live recompute), or (c) the tab
  // is 'State' (All Texas) — saved matches are always metro-filtered so they can never
  // represent a genuine statewide ranking; always recompute statewide.
  const rankedCities = useMemo(() => {
    if (selectedMetro !== 'State' && matches && matches.length > 0) {
      const filtered = matches.filter(m => m.location?.metroUsed?.includes(selectedMetro))
      if (filtered.length >= 5) return filtered
    }
    const metroCities = selectedMetro === 'State'
      ? getAllCities()
      : getAllCities().filter(c => c.metroUsed.includes(selectedMetro))
    return getTopMatches(activeProfile, metroCities, 20).topMatches
  }, [matches, selectedMetro, activeProfile])

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

  // Pinned-card Compare pairing (interim placeholder, per Craig): clicking Compare
  // on pinned slot #1 pairs it against slot #2; clicking it on slot #2 or #3 pairs
  // against slot #1. Requires >=2 pinned cities to have a partner at all.
  function getComparePartnerId(clickedId: string): string | null {
    if (pinnedCities.length < 2) return null
    if (clickedId === pinnedCities[0]) return pinnedCities[1] ?? null
    return pinnedCities[0]
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

  // Generalized to a 4-tier chain (Must Have ↔ Important ↔ Would Be Nice ↔ Not Yet
  // Sorted) so the previously-invisible `unassigned` bucket is reachable from the UI.
  // Behavior for the 3 pre-existing tiers is unchanged: Must Have 'down' → Important,
  // Important 'up' → Must Have (gated at 3), Important 'down' → Would Be Nice,
  // Would Be Nice 'up' → Important — only the new Would Be Nice ↔ Not Yet Sorted
  // hop is new.
  function currentTier(key: keyof DNAScores): Tier {
    if (mustHaves.includes(key)) return 'mustHave'
    if (niceToHaves.includes(key)) return 'important'
    if (notPriorities.includes(key)) return 'wouldBeNice'
    return 'unassigned'
  }

  function movePriority(key: keyof DNAScores, direction: 'up' | 'down') {
    setSandboxTouched(true)
    const idx = TIER_ORDER.indexOf(currentTier(key))
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= TIER_ORDER.length) return
    const targetTier = TIER_ORDER[targetIdx]

    if (targetTier === 'mustHave' && mustHaves.length >= 3) {
      setMustHaveError(true)
      setTimeout(() => setMustHaveError(false), 3000)
      return
    }

    let newMH = mustHaves.filter(k => k !== key)
    let newNH = niceToHaves.filter(k => k !== key)
    let newNP = notPriorities.filter(k => k !== key)
    let newUA = unassigned.filter(k => k !== key)

    if (targetTier === 'mustHave') newMH = [...newMH, key]
    else if (targetTier === 'important') newNH = [...newNH, key]
    else if (targetTier === 'wouldBeNice') newNP = [...newNP, key]
    else newUA = [...newUA, key]

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

  function handleMetroChange(metro: string) {
    setUserHasChangedMetro(true)
    setSelectedMetro(metro)
    setSelectedCityId(null)
    setShowAllCities(false)
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

      // exact_down_payment does not exist on users (confirmed via information_schema —
      // migration 20260604_users_exact_financials.sql never actually landed it, only
      // exact_home_proceeds from that same statement did). available_funds is the real
      // column MM3's load effect already reads this value from. financials_locked also
      // does not exist and has no migration or any read-site anywhere in the codebase —
      // removed outright rather than remapped. Postgres rejects this whole UPDATE
      // atomically when any referenced column is invalid, so either bad column silently
      // failed the entire commit while onAdvanceToConnect() fired regardless.
      const { error } = await supabase.from('users').update({
        current_milemarker: 4,
        sandbox_profile: sandboxData,
        sandbox_committed: true,
        sandbox_committed_at: new Date().toISOString(),
        chosen_communities: pinnedCities,
        exact_home_proceeds: isSelling ? (proceedsNum || null) : null,
        available_funds: savingsNum || null,
        loan_term_preference: loanTerm,
        annual_income_override: incomeVal || null,
      }).eq('email', s.user.email.toLowerCase())

      if (error) {
        console.error('[MM3] commit update failed:', error)
        setCtaError('Something went wrong saving your plan — please try again.')
        return
      }

      onAdvanceToConnect()
    } catch (err) {
      console.error('[MM3] commit failed:', err)
      setCtaError('Something went wrong. Please try again.')
    } finally {
      setCommitting(false)
    }
  }

  // "Would Be Nice" shows only genuine quiz/sandbox picks — never-touched categories
  // (fix_priorities_and_interim_weighting) are not surfaced anywhere in this panel,
  // per Craig's confirmed display decision.
  const lessImportant = notPriorities

  const effectiveSelectedId = selectedCityId ?? rankedCities[0]?.location.id
  const selectedMatch = rankedCities.find(m => m.location.id === effectiveSelectedId)
  const selectedRankIdx = rankedCities.findIndex(m => m.location.id === effectiveSelectedId)
  const displayedCities = showAllCities ? rankedCities.slice(0, 10) : rankedCities.slice(0, 5)

  // ──────────────────────────────────────────────────────────
  // Tab switcher for Lifestyle/Financials (layout amendment 2 — replaces the
  // prior vertical accordion pattern for these two sections; Communities is no
  // longer part of this component at all, it's now a static, always-visible
  // section, see below). Same mutual-exclusivity behavior as before, driven by
  // the same shared activePanel state — just switched via side-by-side tabs.
  // ──────────────────────────────────────────────────────────
  const TabButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '50%', textAlign: 'center', fontFamily: 'inherit', cursor: 'pointer',
        padding: '14px 8px', fontSize: '13px', fontWeight: 600,
        background: active ? '#F5F4F1' : '#fff',
        color: active ? '#0A1E3D' : '#86868b',
        borderWidth: '0', borderBottomWidth: '2px', borderStyle: 'solid',
        borderBottomColor: active ? '#C5B783' : 'transparent',
      }}
    >
      {label}
    </button>
  )

  // ──────────────────────────────────────────────────────────
  // Lifestyle content (4-tier priorities + 4 personality sliders) — ported
  // verbatim from the pre-rebuild "Your Lifestyle" panel, plus the new
  // "Not Yet Sorted" 4th column.
  // ──────────────────────────────────────────────────────────
  const lifestyleContent = (
    <div style={{ padding: '12px 16px' }}>
      <p style={{ fontSize: '10px', color: '#6B6A65', margin: '0 0 8px' }}>Click to move between columns</p>

      <p style={{ fontSize: '10px', color: '#6B6A65', margin: '0 0 8px' }}>
        <span style={{ color: mustHaves.length >= 3 ? '#1a6b35' : undefined, fontWeight: mustHaves.length >= 3 ? 500 : undefined }}>
          {mustHaves.length}/3 Must Haves{mustHaves.length >= 3 ? ' ✓' : ''}
        </span>
        {' · '}{niceToHaves.length} Important{' · '}{lessImportant.length} Nice{' · '}{unassigned.length} Not Yet Sorted
      </p>

      {mustHaveError && (
        <p style={{ fontSize: '10px', color: '#F5A623', fontStyle: 'italic', margin: '0 0 6px' }}>
          Must Have is limited to 3. Move one first.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0', margin: '0 -16px 0' }}>
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
        <div style={{ background: '#F7F7F7', borderRight: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 8px' }}>
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
                <button type="button" onClick={() => movePriority(key, 'down')}
                  style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>→</button>
              </div>
            )
          })}
        </div>

        {/* Not Yet Sorted — new 4th group (Phase B), unassigned_priorities bucket */}
        <div style={{ background: '#F1F1F0', padding: '10px 8px' }}>
          <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#888', textTransform: 'uppercase', margin: '0 0 2px' }}>Not yet sorted</p>
          <p style={{ fontSize: '8px', color: '#aaa', margin: '0 0 8px' }}>1× weight</p>
          {unassigned.length === 0 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
          {unassigned.map(key => {
            const cat = DNA_CATEGORIES.find(c => c.key === key)!
            return (
              <div key={key} style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '4px', padding: '3px 4px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <button type="button" onClick={() => movePriority(key, 'up')}
                  style={{ color: '#0076B6', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 1px', lineHeight: 1, flexShrink: 0 }}>←</button>
                <span style={{ flex: 1, fontSize: '9px', color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.icon} {cat.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Personality sliders */}
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '12px 0 4px', marginTop: '10px' }}>
        <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: '#666', textTransform: 'uppercase', marginBottom: '10px' }}>
          Your Personality
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
  )

  // ──────────────────────────────────────────────────────────
  // Financials content — ported verbatim from the pre-rebuild "Your Financials" panel.
  // ──────────────────────────────────────────────────────────
  const financialsContent = (
    <div style={{ padding: '12px 16px' }}>
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
            onBlur={() => persistNumbers({ available_funds: savingsNum || null })}
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
  )

  // ──────────────────────────────────────────────────────────
  // CTA (Schedule a Consultation) — ported verbatim, unchanged.
  // ──────────────────────────────────────────────────────────
  const ctaBlock = (
    <div style={{ flexShrink: 0, padding: '12px 16px 16px', borderTop: '0.5px solid rgba(0,0,0,0.08)', background: '#fff' }}>
      {ctaError && (
        <p style={{ fontSize: '10px', color: '#D9463A', margin: '0 0 6px', textAlign: 'center', lineHeight: 1.4 }}>
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
        <p style={{ fontSize: '9px', color: 'rgba(0,0,0,0.32)', textAlign: 'center', margin: '5px 0 0', lineHeight: 1.4 }}>
          Pin at least one community first
        </p>
      )}
    </div>
  )

  // ──────────────────────────────────────────────────────────
  // Living Ledger — Your Direction / What Matters Most / Buying Power / Comparison
  // chart, ported verbatim into a self-contained navy card (was previously the
  // entire left column's background; now just this card's background, so every
  // child's existing color choice stays correct unchanged).
  // ──────────────────────────────────────────────────────────
  const livingLedgerSummaryCard = (
    <div style={{ background: '#0A1E3D', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '10px' }}>
      {/* YOUR DIRECTION */}
      <div>
        <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Your Direction
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
                      {pinnedCities.length >= 2 && (
                        <button
                          type="button"
                          onClick={() => setCompareCityId(cityId)}
                          style={{
                            marginLeft: 'auto', fontSize: '9px', color: '#C5B783',
                            background: 'rgba(197,183,131,0.12)', border: '0.5px solid rgba(197,183,131,0.35)',
                            borderRadius: '8px', padding: '1px 6px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                          }}
                        >
                          Compare
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div key={i} style={{ border: '0.5px dashed rgba(197,183,131,0.3)', borderRadius: '8px', padding: '10px 12px' }}>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', margin: 0 }}>
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
            What Matters Most
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
          Your Buying Power
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

      {/* COMPARISON CHART — always visible; origin column shows placeholders if city unknown */}
      {(() => {
        const originLabel = originCity ?? 'Your Origin'
        const originData = originCity ? lookupOriginCity(originCity) : null

        const col0 = pinnedCities[0] ? (getAllCities().find(c => c.id === pinnedCities[0]) ?? null) : null
        const col1 = pinnedCities[1] ? (getAllCities().find(c => c.id === pinnedCities[1]) ?? null) : null
        const col2 = pinnedCities[2] ? (getAllCities().find(c => c.id === pinnedCities[2]) ?? null) : null
        const pinnedCols = [col0, col1, col2]

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
            originVal: originData ? String(originData.colIndex) : '—',
            txVals: pinnedCols.map(c => c ? String(txColIndex(c.metroUsed)) : '—'),
            better: (txVal) => !!originData && txVal !== '—' && parseInt(txVal) < originData.colIndex,
            prefix: '↓',
          },
          {
            label: 'Median Home',
            originVal: originData?.medianHome ?? '—',
            txVals: pinnedCols.map(c => c ? fmtK(c.housing.medianHomePrice) : '—'),
            better: (_txVal, idx) => !!originData && !!pinnedCols[idx] && pinnedCols[idx]!.housing.medianHomePrice < parseHomePrice(originData.medianHome),
            prefix: '↓',
          },
          {
            label: 'Property Tax',
            originVal: '—',
            txVals: pinnedCols.map(c => c ? txPropertyTax(c.metroUsed) : '—'),
          },
          {
            label: 'State Inc. Tax',
            originVal: originData?.incomeTax ?? '—',
            txVals: pinnedCols.map(c => c ? 'None (TX)' : '—'),
            alwaysGreen: true,
          },
          {
            label: 'Schools',
            originVal: originData?.schoolRating ?? '—',
            txVals: pinnedCols.map(c => c ? (c.school?.teaRating ?? '—') : '—'),
          },
          {
            label: 'Crime/Safety',
            originVal: originData?.safety ?? '—',
            txVals: pinnedCols.map(c => c ? txSafety(c.scores.safety) : '—'),
          },
          {
            label: 'Job Market',
            originVal: '—',
            txVals: pinnedCols.map(c => c ? txJobMarket(c.metroUsed) : '—'),
          },
          {
            label: 'Climate',
            originVal: originData?.climate ?? '—',
            txVals: pinnedCols.map(c => c ? txClimateV2(c.metroUsed) : '—'),
          },
        ]

        return (
          <div>
            <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Texas vs. {originLabel}{originData && originState ? `, ${originState}` : ''}
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', padding: '4px 6px', textAlign: 'left', fontWeight: 400 }}></th>
                    <th style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', padding: '4px 6px', textAlign: 'right', fontWeight: 400, whiteSpace: 'nowrap' }}>
                      {originLabel}
                    </th>
                    {pinnedCols.map((c, i) => (
                      <th key={i} style={{ fontSize: '9px', color: c ? '#C5B783' : 'rgba(255,255,255,0.2)', padding: '4px 6px', textAlign: 'right', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {c ? c.name : 'Pin a city'}
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
                        const isEmpty = val === '—' && !pinnedCols[ci]
                        const isBetter = !isEmpty && (row.alwaysGreen === true || (row.better ? row.better(val, ci) : false))
                        return (
                          <td key={ci} style={{
                            fontSize: '10px',
                            color: isEmpty ? 'rgba(255,255,255,0.2)' : isBetter ? '#48c78e' : 'rgba(255,255,255,0.7)',
                            fontWeight: isBetter ? 500 : 400,
                            padding: '5px 6px',
                            textAlign: 'right',
                            whiteSpace: 'nowrap',
                          }}>
                            {isBetter && row.prefix && !isEmpty ? `${row.prefix} ` : ''}{val}
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
    </div>
  )

  // ──────────────────────────────────────────────────────────
  // Communities frame — metro pills + city list + preview card, ported verbatim
  // (Lifestyle/Financials panels that used to hang off this frame have moved to
  // the Adaptive Control Panel, so this frame is simpler than it was pre-rebuild).
  // ──────────────────────────────────────────────────────────
  const communitiesFrame = (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ padding: '12px 12px 0' }}>
        <p style={{ fontSize: '10px', color: '#888', margin: '0 0 10px' }}>Click any city to preview. Pin up to 3.</p>
      </div>
      <div style={{ display: 'flex', minHeight: '280px', alignItems: 'stretch', borderTop: '0.5px solid #F0EEE9' }}>

        {/* Left: metro pills + city list (52%) */}
        <div style={{ width: '52%', borderRight: '0.5px solid #E8E6E2', display: 'flex', flexDirection: 'column' }}>
          {/* Metro pills */}
          <div style={{ padding: '10px 12px 8px', display: 'flex', gap: '5px', flexWrap: 'wrap', borderBottom: '0.5px solid #F0EEE9' }}>
            {METRO_FILTERS.map(f => {
              const active = selectedMetro === f.value
              return (
                <button key={f.value} type="button"
                  onClick={() => handleMetroChange(f.value)}
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

                {rankedCities.length > 5 && !showAllCities && (
                  <div onClick={() => setShowAllCities(true)}
                    style={{ textAlign: 'center', padding: '6px', fontSize: '10px', color: '#0076B6', cursor: 'pointer', borderTop: '0.5px solid #E8E6E2', marginTop: '4px' }}>
                    Show more ↓
                  </div>
                )}
                {showAllCities && (
                  <div onClick={() => setShowAllCities(false)}
                    style={{ textAlign: 'center', padding: '6px', fontSize: '10px', color: '#0076B6', cursor: 'pointer', borderTop: '0.5px solid #E8E6E2', marginTop: '4px' }}>
                    Show less ↑
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: preview card (48%) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Top: 16:9 photo, full width */}
                <div style={{ width: '100%', aspectRatio: '16 / 9', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#2D4A6B' }}>
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

                {/* Below: info, stacked full width */}
                <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
  )

  const controlPanelAccordion = (
    <>
      {/* Communities — static, always-visible, no collapse (matches mobile's
          existing permanently-visible base-layer treatment; desktop no longer
          diverges from it). */}
      <div style={{ padding: '16px 16px 12px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0A1E3D', margin: '0 0 10px' }}>Your Communities</p>
        {communitiesFrame}
      </div>

      {/* Lifestyle/Financials — tab switcher (layout amendment 2), same
          mutual-exclusivity as the prior accordion, same shared activePanel state. */}
      <div style={{ display: 'flex', borderTop: '0.5px solid rgba(0,0,0,0.08)', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <TabButton label="Your Lifestyle" active={activePanel === 'lifestyle'} onClick={() => setActivePanel('lifestyle')} />
        <TabButton label="Your Financials" active={activePanel === 'financials'} onClick={() => setActivePanel('financials')} />
      </div>
      <div>
        {activePanel === 'lifestyle' ? lifestyleContent : financialsContent}
      </div>
    </>
  )

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

      {/* Pinned-card Compare (placeholder wiring) — reuses the existing CompareModal
          as-is; interim only, not the full Phase D comparison-report build. */}
      {compareCityId && (() => {
        const partnerId = getComparePartnerId(compareCityId)
        const cityA = findMatch(compareCityId)
        const cityB = partnerId ? findMatch(partnerId) : undefined
        if (!cityA || !cityB) return null
        return (
          <CompareModal
            cityA={cityA}
            cityB={cityB}
            profile={activeProfile}
            onClose={() => setCompareCityId(null)}
          />
        )
      })()}

      {/* Two-zone layout: Adaptive Control Panel (40%) / Living Ledger (60%) */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100%' }}>

        {/* ── ADAPTIVE CONTROL PANEL — 40% (desktop only) ── */}
        {!isMobile && (
          <div style={{
            width: '40%', flexShrink: 0,
            background: '#fff',
            display: 'flex', flexDirection: 'column',
            position: 'sticky', top: 0, alignSelf: 'stretch',
            overflow: 'hidden',
            borderRight: '0.5px solid rgba(0,0,0,0.08)',
          }}>
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {controlPanelAccordion}
            </div>
            {ctaBlock}
          </div>
        )}

        {/* ── LIVING LEDGER — 60% (full width on mobile) ── */}
        <div style={{ flex: 1, background: '#F2F1EE', minWidth: 0, padding: '16px', overflowY: 'auto', paddingBottom: isMobile ? '132px' : '16px' }}>
          {livingLedgerSummaryCard}
          {/* On desktop, Communities moved into the Control Panel accordion above.
              On mobile there is no Control Panel — communities must stay the
              permanently-visible base layer per Phase B's mobile spec, so it
              renders here instead when isMobile. */}
          {isMobile && communitiesFrame}
        </div>
      </div>

      {/* ── MOBILE STICKY BOTTOM BAR + DRAWER ── */}
      {isMobile && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500, background: '#0A1E3D', borderTop: '0.5px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex' }}>
              {(['lifestyle', 'financials'] as const).map(panel => (
                <button key={panel} type="button"
                  onClick={() => { setActivePanel(panel); setMobileDrawerOpen(true) }}
                  style={{
                    flex: 1, padding: '10px', fontSize: '12px', fontWeight: 500,
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    color: activePanel === panel ? '#C5B783' : 'rgba(255,255,255,0.55)',
                    borderBottom: activePanel === panel ? '2px solid #C5B783' : '2px solid transparent',
                  }}>
                  {panel === 'lifestyle' ? 'Your Lifestyle' : 'Your Financials'}
                </button>
              ))}
            </div>
            <div style={{ padding: '10px 16px 14px' }}>
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
            </div>
          </div>

          {mobileDrawerOpen && (
            <div
              onClick={() => setMobileDrawerOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                zIndex: 600, display: 'flex', alignItems: 'flex-end',
              }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  background: '#fff', width: '100%', maxHeight: '75vh', overflowY: 'auto',
                  borderRadius: '16px 16px 0 0',
                  animation: 'mm3-drawer-up 0.25s ease-out',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 0' }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>
                    {activePanel === 'lifestyle' ? 'Your Lifestyle' : 'Your Financials'}
                  </p>
                  <button type="button" onClick={() => setMobileDrawerOpen(false)}
                    style={{ fontSize: '13px', color: '#86868b', background: 'none', border: 'none', cursor: 'pointer' }}>
                    ✕ Close
                  </button>
                </div>
                {activePanel === 'lifestyle' ? lifestyleContent : financialsContent}
              </div>
              <style>{`
                @keyframes mm3-drawer-up {
                  from { transform: translateY(100%); opacity: 0.6; }
                  to { transform: translateY(0); opacity: 1; }
                }
              `}</style>
            </div>
          )}
        </>
      )}
    </>
  )
}
