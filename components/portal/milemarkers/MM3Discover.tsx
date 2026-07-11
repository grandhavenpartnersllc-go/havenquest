'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { CityMatch, UserProfile, UserSession, SandboxProfile, DNAScores, NonNegotiablesState } from '../../../types'
import FullReport from '../../results/FullReport'
import { DNA_CATEGORIES } from '../../../utils/constants'
import { getAllCities } from '../../../services/locationService'
import { getTopMatches, getDownPaymentMidpoint, getProceedsMidpoint } from '../../../services/matchingService'
import { createClient } from '../../../lib/supabase/client'
import { lookupZipCityState } from '../../../utils/zipLookup'
import { txColIndex, txSafety, txPropertyTax, txJobMarket, txClimateV2 } from '../../../utils/txComparisonStats'
import CompareModal from '../../results/CompareModal'
import { Lock, LockOpen, SlidersHorizontal, CircleDollarSign, ShieldCheck, MessageCircle } from 'lucide-react'

const ALL_KEYS = DNA_CATEGORIES.map(c => c.key) as (keyof DNAScores)[]

// Brief 4, Checkpoint 1 — read-back dedupe. Resolves internally-inconsistent stored
// priority data (a category recorded under multiple buckets) into exclusive membership,
// precedence mustHaves > niceToHaves > notPriorities > unassigned (the first/highest
// bucket a category appears in wins; it is dropped from all lower ones). Any ALL_KEYS
// category missing from all four falls to unassigned so every category always renders
// somewhere. Pure + read-path only — the write path is untouched; the deduped state
// self-heals the stored row on the next debounced save.
function dedupePriorityBuckets(
  mh: (keyof DNAScores)[],
  nh: (keyof DNAScores)[],
  np: (keyof DNAScores)[],
  ua: (keyof DNAScores)[],
): { mustHaves: (keyof DNAScores)[]; niceToHaves: (keyof DNAScores)[]; notPriorities: (keyof DNAScores)[]; unassigned: (keyof DNAScores)[] } {
  const seen = new Set<keyof DNAScores>()
  const take = (arr: (keyof DNAScores)[]) => {
    const out: (keyof DNAScores)[] = []
    for (const k of arr) {
      if (!ALL_KEYS.includes(k) || seen.has(k)) continue
      seen.add(k)
      out.push(k)
    }
    return out
  }
  const mustHaves = take(mh)
  const niceToHaves = take(nh)
  const notPriorities = take(np)
  const unassigned = take(ua)
  for (const k of ALL_KEYS) if (!seen.has(k)) unassigned.push(k)
  return { mustHaves, niceToHaves, notPriorities, unassigned }
}

const RATE_DEFAULT = 6.5

// Brief 3 — icon rail + summoned drawer shell. The rail replaces the always-open
// ~40% control panel; each launcher summons a single drawer (one open at a time).
// "Non-Negotiables" is kept verbatim as the established, shipped term (not "Limits").
type DrawerKey = 'lifestyle' | 'financials' | 'nonneg' | 'guide'
const RAIL_ITEMS: { k: DrawerKey; label: string; Icon: typeof SlidersHorizontal; group: 'refine' | 'learn' }[] = [
  { k: 'lifestyle',  label: 'Lifestyle',       Icon: SlidersHorizontal, group: 'refine' },
  { k: 'financials', label: 'Money',           Icon: CircleDollarSign,  group: 'refine' },
  { k: 'nonneg',     label: 'Non-Negotiables', Icon: ShieldCheck,       group: 'refine' },
  { k: 'guide',      label: 'Ask Amy',         Icon: MessageCircle,     group: 'learn'  },
]
const DRAWER_META: Record<DrawerKey, { title: string; subtitle: string }> = {
  lifestyle:  { title: 'Lifestyle',       subtitle: 'What matters most in where you land.' },
  financials: { title: 'Money',           subtitle: 'Your real numbers drive every match live.' },
  nonneg:     { title: 'Non-Negotiables', subtitle: 'Hard filters — we only show what clears them.' },
  guide:      { title: 'Ask Amy',         subtitle: 'Texas terms & buying-process basics.' },
}

// Phase E, Brief 1 — Non-Negotiables defaults. Commute time and flood risk were
// dropped from v1 (no real per-city data exists for either, confirmed in Phase 0
// investigation) — do not stub or approximate them.
const DEFAULT_NON_NEGOTIABLES: NonNegotiablesState = {
  hoaStrict: false,
  crimeSafety: false,
  notWalkable: false,
  medicalAccess: false,
  schoolMinGrade: null,
  propertyTaxMaxPct: null,
  anythingElse: '',
}

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

// Declutter pass — replaces the old persistent, dismiss-only "Your Direction"
// banner. Owns its own fade timer (starts fading ~400ms before the parent's
// 4000ms auto-dismiss actually clears rankChangeExplanation) so the trigger
// effect above didn't need any logic changes beyond that one timeout value.
function RankChangeAlert({ message }: { message: string }) {
  const [fading, setFading] = useState(false)
  useEffect(() => {
    setFading(false)
    const t = setTimeout(() => setFading(true), 3600)
    return () => clearTimeout(t)
  }, [message])
  return (
    <div style={{
      position: 'absolute', top: '-10px', right: '8px', maxWidth: '220px', zIndex: 5,
      background: 'rgba(20,30,50,0.97)', border: '0.5px solid rgba(197,183,131,0.4)',
      borderRadius: '6px', padding: '6px 8px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
      opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease',
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: '9px', color: '#C5B783', lineHeight: 1.4 }}>{message}</span>
    </div>
  )
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
  const [proceedsDisplay, setProceedsDisplay] = useState('') // Phase C2 Item 1 — instant display; `proceeds` itself is now debounced
  const [savings, setSavings] = useState('')
  const [savingsDisplay, setSavingsDisplay] = useState('') // Phase C2 Item 1 — instant display; `savings` itself is now debounced
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
  const [removedCities, setRemovedCities] = useState<string[]>([]) // Phase C2 Item 3 — "remove from view", session-local only (see report)
  // Brief 4 C2 — unified focused-city state (replaces selectedCityId + heroTabId). Set by
  // clicking a hero card body OR a community/browse row; drives the focused hero card, the
  // preview + Buying Power reference, and comparison pairing. reportMatch stays the
  // separate "open report" state.
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [showAllCities, setShowAllCities] = useState(false)
  const [selectedMetro, setSelectedMetro] = useState(initialMetro ?? 'Austin')
  const [userHasChangedMetro, setUserHasChangedMetro] = useState(false)
  const [sandboxTouched, setSandboxTouched] = useState(true)
  const [rankChangeExplanation, setRankChangeExplanation] = useState<string | null>(null) // Phase C2 Item 2

  // UI
  const [ctaError, setCtaError] = useState<string | null>(null)
  const [committing, setCommitting] = useState(false)
  const [reportMatch, setReportMatch] = useState<CityMatch | null>(null)
  const [mustHaveError, setMustHaveError] = useState(false)
  const [originCity, setOriginCity] = useState<string | null>(null)
  const [originState, setOriginState] = useState<string | null>(null)

  // Brief 3 — icon rail + summoned drawer. A single openDrawer state drives BOTH the
  // desktop rail and the mobile bottom bar, which structurally guarantees "one drawer
  // open at a time." Replaces the prior desktop activePanel tab switch and the mobile
  // mobileDrawerOpen flag — both were UI-only, no persistence rode on them. null = closed.
  const [openDrawer, setOpenDrawer] = useState<DrawerKey | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [advancedAssumptionsOpen, setAdvancedAssumptionsOpen] = useState(false) // Declutter pass — Interest rate + Loan term moved behind this
  const [nonNegotiables, setNonNegotiables] = useState<NonNegotiablesState>(DEFAULT_NON_NEGOTIABLES)
  const [nonNegotiablesOpen, setNonNegotiablesOpen] = useState(false) // inline accordion, not a modal/drawer — must stay always-visible per Communities' treatment

  // Compare (Phase C1 Item 6, restructured Phase D) — reuses the existing CompareModal/createComparisonReportDocument
  // logic as-is. Pairing is generalized across the 3-slot hero rotation via
  // getComparePartnerId below, available from both the hero tabs and the expanded
  // 5-10 list.
  const [compareCityId, setCompareCityId] = useState<string | null>(null)

  // Lock-to-unlock (layout amendment 3) — UI-only state, NOT persisted to the DB
  // per Craig's explicit scope note. A confirmation signal, not a restriction:
  // locking does not disable editing the section.
  const [lifestyleLocked, setLifestyleLocked] = useState(false)
  const [financialsLocked, setFinancialsLocked] = useState(false)

  const priorityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const incomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const personalityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const proceedsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null) // Phase C2 Item 1
  const savingsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null) // Phase C2 Item 1
  const explanationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null) // Phase C2 Item 2 — auto-dismiss
  const hydratedRef = useRef(false) // Phase C2 Item 2 — suppress false "why changed" fires during initial DB/profile hydration
  const prioritiesFromSandboxRef = useRef(false) // Brief 4 C1 — set true once the sandbox authoritatively hydrates priorities; blocks the quiz seed from refilling an emptied bucket
  const rankSnapshotRef = useRef<{
    topIds: string[]
    income: number
    proceeds: string
    savings: string
    rate: number
    loanTerm: 30 | 15
    removedCount: number
  } | null>(null) // Phase C2 Item 2 — last-seen top-3 + inputs, to detect a genuine reorder
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
          setSandboxTouched(true)
        }
        // Lifestyle-priority buckets (Brief: fix priorities hydration) —
        // hydrated unconditionally, NOT gated behind useSandboxPriorities,
        // extending the identical fix already proven below for Non-Negotiables.
        // sandbox_committed_at is only ever set by the final handleCommit()
        // flow, so for anyone still mid-session (the overwhelming majority of
        // MM3 sandbox edits) sandboxAge evaluates to Infinity and
        // useSandboxPriorities is false — this whole block never ran, silently
        // dropping the user's saved priorities back to defaults on every
        // reload. Each setter keeps its original "does this key have a real
        // saved value" guard (sp.mustHaves?.length, etc.), so a brand-new user
        // with no sandbox_profile — or with these specific keys absent — still
        // falls through to the existing quiz-seed default path untouched.
        // Brief 4, Checkpoint 1 — SANDBOX-AUTHORITATIVE priority hydration. If the user
        // has started sorting (any of the four sandbox arrays non-empty), the sandbox is
        // the single source of truth: hydrate ALL FOUR buckets from it — INCLUDING the
        // empty ones — deduped into exclusive membership, and latch
        // prioritiesFromSandboxRef so the quiz seed (block below) can never repopulate a
        // bucket the user deliberately emptied. The prior per-bucket `if (sp.x?.length)`
        // guards were the defect: they skipped empty sandbox buckets, letting a stale
        // quiz-seed Must Have survive after the user had cleared it. Write path unchanged;
        // this deduped state self-heals the stored row on the next debounced save.
        const spMH = sp.mustHaves ?? []
        const spNH = sp.niceToHaves ?? []
        const spNP = sp.notPriorities ?? []
        const spUA = sp.unassigned ?? []
        if (spMH.length || spNH.length || spNP.length || spUA.length) {
          const d = dedupePriorityBuckets(spMH, spNH, spNP, spUA)
          setMustHaves(d.mustHaves)
          setNiceToHaves(d.niceToHaves)
          setNotPriorities(d.notPriorities)
          setUnassigned(d.unassigned)
          prioritiesFromSandboxRef.current = true
        }
        // Non-Negotiables (Phase E, Brief 1) — hydrated unconditionally, NOT
        // gated behind useSandboxPriorities. Root cause of the confirmed
        // persistence bug: sandbox_committed_at is only ever set by the final
        // handleCommit() flow, so for anyone still mid-session (the overwhelming
        // majority of MM3 sandbox edits) sandboxAge evaluates to Infinity and
        // useSandboxPriorities is false — this whole block never ran, silently
        // dropping nonNegotiables (and, on the same logic, dropped the
        // priorities fields above too for an uncommitted sandbox — now fixed
        // above with the identical pattern).
        // Non-Negotiables has no established 30-day-staleness requirement of its
        // own, so the correct minimal fix is to hydrate it whenever
        // sandbox_profile exists at all, matching interestRateOverride's
        // existing unconditional placement immediately below.
        if (sp.nonNegotiables) setNonNegotiables({ ...DEFAULT_NON_NEGOTIABLES, ...sp.nonNegotiables })
        if (sp.interestRateOverride) setInterestRate(sp.interestRateOverride)
      }

      if (data.exact_home_proceeds) {
        const v = fmtCurrency(String(data.exact_home_proceeds))
        setProceeds(v); setProceedsDisplay(v)
      } else {
        const fp = profile?.financial_picture
        if (fp?.is_homeowner && fp.home_sale_proceeds) {
          const v = fmtCurrency(String(getProceedsMidpoint(fp.home_sale_proceeds)))
          setProceeds(v); setProceedsDisplay(v)
        }
      }

      if (data.available_funds) {
        const v = fmtCurrency(String(data.available_funds))
        setSavings(v); setSavingsDisplay(v)
      } else {
        const fp = profile?.financial_picture
        if (fp?.down_payment_available) {
          const v = fmtCurrency(String(getDownPaymentMidpoint(fp.down_payment_available)))
          setSavings(v); setSavingsDisplay(v)
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
    // Brief 4, Checkpoint 1 — the quiz seed must NOT run once the sandbox has
    // authoritatively hydrated priorities (prioritiesFromSandboxRef); otherwise it could
    // repopulate a bucket the user emptied in their sandbox. New users with no sandbox
    // priority data still seed here exactly as before.
    if (!prioritiesFromSandboxRef.current && mustHaves.length === 0 && niceToHaves.length === 0) {
      if (profile.mustHaves?.length > 0 || profile.niceToHaves?.length > 0 || profile.notPriorities?.length > 0) {
        // profile.unassignedPriorities is the real, quiz-sourced "never touched" set
        // (fix_priorities_and_interim_weighting). Falls back to [] for pre-fix accounts,
        // whose old merged notPriorities data can't be retroactively split. Deduped for
        // exclusive membership + completeness on the same read path as the sandbox case.
        const d = dedupePriorityBuckets(
          profile.mustHaves ?? [],
          profile.niceToHaves ?? [],
          profile.notPriorities ?? [],
          profile.unassignedPriorities ?? [],
        )
        setMustHaves(d.mustHaves)
        setNiceToHaves(d.niceToHaves)
        setNotPriorities(d.notPriorities)
        setUnassigned(d.unassigned)
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

  // Phase C2 Item 2 — gives the async DB-load + profile-seed effects above time to
  // settle before "why did this change" starts comparing snapshots, so hydration
  // itself never gets mistaken for a genuine live edit.
  useEffect(() => {
    const t = setTimeout(() => { hydratedRef.current = true }, 1500)
    return () => clearTimeout(t)
  }, [])

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

  // Phase C2 Item 4 — Exposed Baselines banner. Fixed reference point, computed
  // once from the quiz's own financial_picture (never the live sandbox fields
  // below) — profile is immutable for this component's lifetime, so this never
  // drifts as the user edits their financials.
  const baselineDownPayment = profile?.financial_picture?.down_payment_available
    ? getDownPaymentMidpoint(profile.financial_picture.down_payment_available)
    : 0
  const baselineProceeds = (profile?.financial_picture?.is_homeowner && profile.financial_picture.home_sale_proceeds)
    ? getProceedsMidpoint(profile.financial_picture.home_sale_proceeds)
    : 0
  const baselineBudget = baselineDownPayment + baselineProceeds
  const BASELINE_REF_PRICE = 385000 // same generic fallback used elsewhere before any city is pinned
  const baselineMonthly = calcMonthly(Math.max(0, BASELINE_REF_PRICE - baselineBudget), RATE_DEFAULT, 30)

  // Use saved MM2 results as the ranked city list; fall back to live recompute when:
  // (a) no saved results exist, (b) the selected metro has fewer than 5 saved cities
  // (prevents stale thin results from blocking a full live recompute), or (c) the tab
  // is 'State' (All Texas) — saved matches are always metro-filtered so they can never
  // represent a genuine statewide ranking; always recompute statewide.
  // Phase E, Brief 1 — genuine community-level filters only (HOA strictness and
  // free text are property-level / unstructured, captured as MD-context notes
  // elsewhere, never referenced here). Threshold cutoffs for the 3 simple toggles
  // (crimeSafety/notWalkable/medicalAccess) are an implementation judgment call —
  // mid-scale (score >= 4 of 10) — since the locked design describes them as plain
  // toggles without the user setting their own minimum (unlike school rating and
  // property tax, which are genuine user-set thresholds).
  function passesNonNegotiables(city: ReturnType<typeof getAllCities>[number]): boolean {
    if (nonNegotiables.crimeSafety && city.scores.safety < 4) return false
    if (nonNegotiables.notWalkable && city.scores.walkability < 4) return false
    if (nonNegotiables.medicalAccess && city.scores.healthcare < 4) return false
    if (nonNegotiables.schoolMinGrade) {
      const order = ['A', 'B', 'C', 'D', 'F']
      if (order.indexOf(city.school.teaRating) > order.indexOf(nonNegotiables.schoolMinGrade)) return false
    }
    if (nonNegotiables.propertyTaxMaxPct != null && city.housing.propertyTaxRate > nonNegotiables.propertyTaxMaxPct) return false
    return true
  }

  const rankedCities = useMemo(() => {
    if (selectedMetro !== 'State' && matches && matches.length > 0) {
      const filtered = matches.filter(m => m.location?.metroUsed?.includes(selectedMetro) && !removedCities.includes(m.location.id) && passesNonNegotiables(m.location))
      if (filtered.length >= 5) return filtered
    }
    const metroCities = (selectedMetro === 'State'
      ? getAllCities()
      : getAllCities().filter(c => c.metroUsed.includes(selectedMetro))
    ).filter(c => !removedCities.includes(c.id) && passesNonNegotiables(c))
    return getTopMatches(activeProfile, metroCities, 20).topMatches
  }, [matches, selectedMetro, activeProfile, removedCities, nonNegotiables])

  // Phase C1 Item 7, rescoped per fix_hero_backfill_metro_scope.md — "Your
  // Direction" hero backfill now respects the active metro selection, mirroring
  // rankedCities' own scoping/fallback pattern above exactly (All Texas ->
  // genuine statewide pool, otherwise metro-filtered). This reverses the
  // original "deliberately independent of the currently browsed metro" design:
  // that produced a confirmed, reproducible bug where unpinning a city while
  // browsing one metro could backfill the freed hero slot with a city from a
  // completely different metro (e.g. Boerne/San Antonio surfacing while Austin
  // was active), even though the Communities list never showed it. Deliberately
  // does NOT replicate rankedCities' `matches`-prop fast path — that shortcut
  // exists to reuse MM2's saved rankings for the browsable list specifically,
  // not something the hero backfill pool depended on before this fix either.
  const overallTopResult = useMemo(() => {
    const metroCities = (selectedMetro === 'State'
      ? getAllCities()
      : getAllCities().filter(c => c.metroUsed.includes(selectedMetro))
    ).filter(c => !removedCities.includes(c.id) && passesNonNegotiables(c))
    return getTopMatches(activeProfile, metroCities, 3)
  }, [activeProfile, selectedMetro, removedCities, nonNegotiables])

  // Item 6 — Pin already drives this: pinned cities always take a slot; remaining
  // slots fill with the algorithm's own top matches (reusing otherStrongMatches as
  // a zone-diverse fallback once pins have eaten into the plain top 3), lowest-
  // ranked defaults stepping aside first as more cities get pinned.
  const heroSlots = useMemo(() => {
    const slots: string[] = pinnedCities.slice(0, 3)
    const fillCandidates = [...overallTopResult.topMatches, ...overallTopResult.otherStrongMatches]
    for (const m of fillCandidates) {
      if (slots.length >= 3) break
      if (!slots.includes(m.location.id)) slots.push(m.location.id)
    }
    return slots
  }, [pinnedCities, overallTopResult])

  // Brief 4 C2 — the single focused city. Prefer an explicit selectedKey while it is still
  // a valid ranked city; otherwise fall back to the first hero slot, then the top ranked
  // city. Declared here (after heroSlots/rankedCities, before getComparePartnerId) to avoid
  // any use-before-declaration.
  const effectiveSelectedKey = (selectedKey && rankedCities.some(m => m.location.id === selectedKey))
    ? selectedKey
    : (heroSlots[0] ?? rankedCities[0]?.location.id ?? null)

  // Item 8 — match-quality % on metro pills, shown only while "All Texas" is active.
  const metroTopScores = useMemo(() => {
    if (selectedMetro !== 'State') return {} as Record<string, number>
    const result: Record<string, number> = {}
    METRO_FILTERS.forEach(f => {
      if (f.value === 'State') return
      const metroCities = getAllCities().filter(c => c.metroUsed.includes(f.value) && !removedCities.includes(c.id) && passesNonNegotiables(c))
      const top = metroCities.length > 0 ? getTopMatches(activeProfile, metroCities, 1).topMatches[0] : undefined
      if (top) result[f.value] = top.matchScore
    })
    return result
  }, [selectedMetro, activeProfile, removedCities, nonNegotiables])

  // Phase C2 Item 2 — "why did this ranking change" explanations. Fires only off
  // the debounced financial values (Item 1) and removedCities (Item 3) — never on
  // every keystroke. Only a genuine reorder of the algorithm's own top-3 counts as
  // "meaningful" (per Phase C1's smoothing, most edits now shouldn't reorder at
  // all — firing less often than before is correct, not a bug). Deliberately does
  // not cover priority/personality-driven reorders — out of this brief's scope.
  useEffect(() => {
    const topIds = overallTopResult.topMatches.map(m => m.location.id)
    const prev = rankSnapshotRef.current
    if (prev && hydratedRef.current) {
      const reordered = topIds.length !== prev.topIds.length || topIds.some((id, i) => id !== prev.topIds[i])
      if (reordered) {
        let reason: string | null = null
        if (incomeVal !== prev.income) {
          reason = incomeVal > prev.income ? 'your income increased' : 'your income decreased'
        } else if (proceeds !== prev.proceeds || savings !== prev.savings) {
          const prevBudget = parseMoney(prev.proceeds) + parseMoney(prev.savings)
          const newBudget = parseMoney(proceeds) + parseMoney(savings)
          reason = newBudget > prevBudget ? 'your available budget increased' : 'your available budget decreased'
        } else if (interestRate !== prev.rate) {
          reason = interestRate > prev.rate ? 'interest rates moved up' : 'interest rates moved down'
        } else if (loanTerm !== prev.loanTerm) {
          reason = `you switched to a ${loanTerm}-year loan`
        } else if (removedCities.length > prev.removedCount) {
          reason = 'you removed a community from consideration'
        } else if (removedCities.length < prev.removedCount) {
          reason = 'you restored a previously removed community'
        }
        if (reason) {
          const topCity = overallTopResult.topMatches[0]?.location.name
          setRankChangeExplanation(
            topCity ? `Your rankings updated because ${reason} — ${topCity} is now your top match.` : `Your rankings updated because ${reason}.`
          )
          if (explanationTimerRef.current) clearTimeout(explanationTimerRef.current)
          explanationTimerRef.current = setTimeout(() => setRankChangeExplanation(null), 4000) // Declutter pass — was 8000ms
        }
      }
    }
    rankSnapshotRef.current = { topIds, income: incomeVal, proceeds, savings, rate: interestRate, loanTerm, removedCount: removedCities.length }
  }, [overallTopResult, incomeVal, proceeds, savings, interestRate, loanTerm, removedCities])

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
    return rankedCities.find(m => m.location.id === cityId)
      ?? matches.find(m => m.location.id === cityId)
      ?? overallTopResult.topMatches.find(m => m.location.id === cityId)
      ?? overallTopResult.otherStrongMatches.find(m => m.location.id === cityId)
  }

  // Compare pairing (Phase C1 Item 6) — generalized to the 3-slot hero rotation.
  // Pairs the clicked city against the current hero focal city (a single consistent
  // anchor across the whole page — hero tabs and the expanded 5-10 list share this
  // same function); if the hero city itself is clicked, it pairs against the next
  // hero slot instead. Needs >=2 filled hero slots to have a partner at all.
  function getComparePartnerId(clickedId: string): string | null {
    if (heroSlots.length < 2) return null
    if (clickedId !== effectiveSelectedKey) return effectiveSelectedKey ?? null
    return heroSlots.find(id => id !== clickedId) ?? null
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

  function debounceSavePriorities(mh: (keyof DNAScores)[], nh: (keyof DNAScores)[], np: (keyof DNAScores)[], ua: (keyof DNAScores)[], nn: NonNegotiablesState = nonNegotiables) {
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
            nonNegotiables: nn,
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
    debounceSavePriorities(newMH, newNH, newNP, newUA, nonNegotiables)
  }

  // Phase E, Brief 1 — Non-Negotiables. hoaStrict and anythingElse are captured
  // here too but deliberately never read by passesNonNegotiables above; they're
  // Market-Director-context notes only, per the locked design.
  function updateNonNegotiables(patch: Partial<NonNegotiablesState>) {
    const updated = { ...nonNegotiables, ...patch }
    setNonNegotiables(updated)
    setSandboxTouched(true)
    debounceSavePriorities(mustHaves, niceToHaves, notPriorities, unassigned, updated)
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
    setSelectedKey(null)
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

  // Phase C2 Item 3 — "remove from view". Session-local only for now (see report);
  // a pinned city can't be removed without unpinning first (point 3), enforced by
  // simply not rendering the Remove action while pinned.
  function removeCity(cityId: string) {
    if (pinnedCities.includes(cityId)) return
    setRemovedCities(prev => prev.includes(cityId) ? prev : [...prev, cityId])
    if (selectedKey === cityId) setSelectedKey(null)
    if (compareCityId === cityId) setCompareCityId(null)
  }

  // Brief 4 C2 — clean interaction seams. Checkpoint 3 attaches flag-gated
  // logActivityEvent here (onFocusCity / onPromoteCity = pinCity / onOpenReport);
  // ZERO call sites this checkpoint.
  const focusCity = (id: string) => setSelectedKey(id)
  const openReport = (m: CityMatch) => setReportMatch(m)

  async function handleCommit() {
    if (pinnedCities.length === 0) {
      setCtaError('Pin at least one community before scheduling your consultation.')
      return
    }
    if (!lifestyleLocked || !financialsLocked) {
      setCtaError('Lock your Lifestyle and Financials preferences before scheduling your consultation.')
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
        nonNegotiables,
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

  // Schedule a Consultation gating (layout amendment 3) — genuinely AND, not
  // either/or: needs a pinned community AND both sections locked. Confirmed by
  // Craig. Shared by both the desktop (top-right) and mobile CTA.
  const hasPinnedCity = pinnedCities.length > 0
  const bothLocked = lifestyleLocked && financialsLocked
  const canSchedule = hasPinnedCity && bothLocked
  const scheduleHint = !hasPinnedCity && !bothLocked
    ? 'Pin at least one community and lock your preferences first'
    : !hasPinnedCity
    ? 'Pin at least one community first'
    : !bothLocked
    ? 'Lock your Lifestyle and Financials preferences first'
    : null

  // "Would Be Nice" shows only genuine quiz/sandbox picks — never-touched categories
  // (fix_priorities_and_interim_weighting) are not surfaced anywhere in this panel,
  // per Craig's confirmed display decision.
  const lessImportant = notPriorities

  const selectedMatch = rankedCities.find(m => m.location.id === effectiveSelectedKey)
  const selectedRankIdx = rankedCities.findIndex(m => m.location.id === effectiveSelectedKey)
  const displayedCities = showAllCities ? rankedCities.slice(0, 10) : rankedCities.slice(0, 5)

  // ──────────────────────────────────────────────────────────
  // Brief 3 — the Lifestyle/Financials tab switcher was removed: each panel is now
  // its own rail launcher summoning its own drawer, so the shared tab control is gone.
  // ──────────────────────────────────────────────────────────

  // ──────────────────────────────────────────────────────────
  // Lock-to-unlock toggle (layout amendment 3) — a confirmation signal, not a
  // restriction: toggling locked does not disable the section underneath it,
  // the user can still freely view/edit either way. UI-only, not persisted.
  // ──────────────────────────────────────────────────────────
  const LockToggle = ({ locked, onClick }: { locked: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'inherit', cursor: 'pointer',
        fontSize: '10px', fontWeight: 500, padding: '4px 9px', borderRadius: '12px',
        background: locked ? 'rgba(197,183,131,0.15)' : '#F5F4F1',
        color: locked ? '#8a6f00' : '#86868b',
        border: `0.5px solid ${locked ? 'rgba(197,183,131,0.4)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      {locked ? <Lock size={11} /> : <LockOpen size={11} />}
      {locked ? 'Locked' : 'Lock this in'}
    </button>
  )

  // ──────────────────────────────────────────────────────────
  // Non-Negotiables toggle switch (Phase E, Brief 1) — small reusable control
  // for the 4 plain-boolean items.
  // ──────────────────────────────────────────────────────────
  const NonNegToggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick}
      style={{
        width: '34px', height: '18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
        background: active ? '#0A1E3D' : '#E0DED8', position: 'relative', flexShrink: 0, padding: 0,
        transition: 'background 0.15s',
      }}>
      <span style={{
        position: 'absolute', top: '2px', left: active ? '18px' : '2px',
        width: '14px', height: '14px', borderRadius: '50%', background: '#fff',
        transition: 'left 0.15s',
      }} />
    </button>
  )

  // ──────────────────────────────────────────────────────────
  // Lifestyle content (4-tier priorities + 4 personality sliders) — ported
  // verbatim from the pre-rebuild "Your Lifestyle" panel, plus the new
  // "Not Yet Sorted" 4th column.
  // ──────────────────────────────────────────────────────────
  const lifestyleContent = (
    <div style={{ padding: '12px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 8px' }}>
        <p style={{ fontSize: '10px', color: '#6B6A65', margin: 0 }}>Click to move between columns</p>
        <LockToggle locked={lifestyleLocked} onClick={() => setLifestyleLocked(v => !v)} />
      </div>

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 10px' }}>
        <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>Adjust to update buying power live</p>
        <LockToggle locked={financialsLocked} onClick={() => setFinancialsLocked(v => !v)} />
      </div>

      {/* Phase C2 Item 4 — Exposed Baselines banner. Fixed reference point, never
          updates as fields below are edited (see baselineBudget/baselineMonthly). */}
      {baselineBudget > 0 && (
        <p style={{ fontSize: '9px', color: '#A9A79F', fontStyle: 'italic', margin: '0 0 10px' }}>
          Your original Discovery estimate: {fmtK(baselineBudget)} budget · ~${baselineMonthly.toLocaleString()}/mo
        </p>
      )}

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
            <input type="text" value={proceedsDisplay.replace(/^\$/, '')}
              onChange={e => {
                const formatted = fmtCurrency(e.target.value)
                setProceedsDisplay(formatted); setSandboxTouched(true)
                if (proceedsTimerRef.current) clearTimeout(proceedsTimerRef.current)
                proceedsTimerRef.current = setTimeout(() => setProceeds(formatted), 400)
              }}
              onBlur={() => {
                setProceeds(proceedsDisplay)
                persistNumbers({ exact_home_proceeds: parseMoney(proceedsDisplay) || null })
              }}
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
          <input type="text" value={savingsDisplay.replace(/^\$/, '')}
            onChange={e => {
              const formatted = fmtCurrency(e.target.value)
              setSavingsDisplay(formatted); setSandboxTouched(true)
              if (savingsTimerRef.current) clearTimeout(savingsTimerRef.current)
              savingsTimerRef.current = setTimeout(() => setSavings(formatted), 400)
            }}
            onBlur={() => {
              setSavings(savingsDisplay)
              persistNumbers({ available_funds: parseMoney(savingsDisplay) || null })
            }}
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

      {/* Declutter pass — Interest rate + Loan term moved to Advanced Assumptions;
          only a live summary + trigger stays in the always-visible flow. */}
      <div style={{ marginBottom: '10px' }}>
        <button type="button" onClick={() => setAdvancedAssumptionsOpen(true)}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 10px', borderRadius: '7px', border: '0.5px solid #E0DED8', background: '#FAFAF8',
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          }}>
          <span style={{ fontSize: '10px', color: '#6B6A65' }}>Advanced Assumptions</span>
          <span style={{ fontSize: '10px', color: '#1d1d1f', fontWeight: 500 }}>{interestRate}% · {loanTerm}yr →</span>
        </button>
      </div>

      {/* Monthly estimate */}
      <div style={{ background: '#EDF2FF', borderRadius: '7px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '9px', color: '#0076B6', margin: '0 0 1px' }}>Est. monthly payment</p>
          <p style={{ fontSize: '9px', color: '#86868b', margin: 0 }}>Principal + interest only</p>
        </div>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>
          {refMonthly > 0 ? `${refMonthly.toLocaleString()}` : '—'}
        </p>
      </div>
    </div>
  )

  // ──────────────────────────────────────────────────────────
  // Advanced Assumptions (Declutter pass) — Interest rate + Loan term, moved
  // verbatim out of financialsContent. Rendered inside a centered-card overlay
  // on desktop (styled after CompareModal's pattern, not the component itself)
  // and as a nested stacked sheet inside the already-open Financials drawer on
  // mobile — see the two render sites below.
  // ──────────────────────────────────────────────────────────
  const advancedAssumptionsContent = (
    <div>
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
      <div style={{ display: 'flex', gap: '6px' }}>
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
    </div>
  )

  // ──────────────────────────────────────────────────────────
  // CTA (Schedule a Consultation) — ported verbatim, unchanged.
  // ──────────────────────────────────────────────────────────
  // Persistent top-right CTA (layout amendment 3) — moved out of the bottom of
  // the left column into a sticky block at the top of the Living Ledger
  // (desktop only; mobile's CTA stays in its own fixed bottom bar, untouched in
  // placement, but shares this same canSchedule/scheduleHint gating).
  const ctaBlock = (
    <div style={{ flexShrink: 0, padding: '12px 16px', background: '#fff', borderRadius: '10px', border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: '10px' }}>
      {ctaError && (
        <p style={{ fontSize: '10px', color: '#D9463A', margin: '0 0 6px', textAlign: 'center', lineHeight: 1.4 }}>
          {ctaError}
        </p>
      )}
      <button
        type="button" onClick={handleCommit} disabled={committing || !canSchedule}
        style={{
          width: '100%', background: '#C5B783', color: '#0A1E3D',
          border: 'none', borderRadius: '8px', padding: '12px',
          fontWeight: 500, fontSize: '14px',
          cursor: (committing || !canSchedule) ? 'not-allowed' : 'pointer',
          opacity: (committing || !canSchedule) ? 0.5 : 1, fontFamily: 'inherit',
        }}
      >
        {committing ? 'Saving…' : 'Schedule a Consultation →'}
      </button>
      {!ctaError && scheduleHint && (
        <p style={{ fontSize: '9px', color: 'rgba(0,0,0,0.42)', textAlign: 'center', margin: '5px 0 0', lineHeight: 1.4 }}>
          {scheduleHint}
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
    <div style={{ background: '#0A1E3D', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '10px' }}>
      {/* Brief 4 C2 — "Your Top Matches" hero-3 (replaces the single-focal "Your Direction"
          tab card). Clicking a card body FOCUSES it (selectedKey → drives Buying Power +
          comparison + preview); the report opens only via the deliberate "See summary
          report" link (openReport → FullReport modal). Transitional: still inside the navy
          summary card this checkpoint; step 3 re-parents it into the light matches area. */}
      <div>
        <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Your Top Matches
        </p>

        {heroSlots.length === 0 ? (
          <div style={{ border: '0.5px dashed rgba(197,183,131,0.3)', borderRadius: '8px', padding: '10px 12px' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', margin: 0 }}>
              No matches available yet.
            </p>
          </div>
        ) : (
          <>
            {rankChangeExplanation && (
              <div style={{ marginBottom: '8px' }}><RankChangeAlert message={rankChangeExplanation} /></div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {heroSlots.map((id, i) => {
                const match = findMatch(id)
                const cityLoc = match?.location ?? getAllCities().find(c => c.id === id)
                if (!cityLoc) return null
                const status = afStatus(cityLoc.housing.medianHomePrice)
                const badge = status === 'comfortable'
                  ? { bg: '#E8F5EE', color: '#1a6b35' }
                  : status === 'moderate'
                  ? { bg: '#FAEEDA', color: '#633806' }
                  : { bg: '#FCEBEB', color: '#A32D2D' }
                const isPinnedHero = pinnedCities.includes(cityLoc.id)
                const isFocused = cityLoc.id === effectiveSelectedKey
                const cityBalance = Math.max(0, cityLoc.housing.medianHomePrice - totalFunds)
                const cityRate = loanTerm === 15 ? Math.max(interestRate - 0.5, 2) : interestRate
                const cityMonthly = calcMonthly(cityBalance, cityRate, loanTerm)
                const comparePartner = getComparePartnerId(cityLoc.id)
                return (
                  <div key={id} onClick={() => focusCity(cityLoc.id)}
                    style={{
                      background: '#fff', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                      border: isFocused ? '1.5px solid #C5B783' : '0.5px solid rgba(0,0,0,0.1)',
                      boxShadow: isFocused ? '0 0 0 2px rgba(197,183,131,0.45)' : 'none',
                      display: 'flex', flexDirection: 'column',
                    }}>
                    {/* Photo + rank/pin/compare */}
                    <div style={{ height: '92px', position: 'relative', background: '#2D4A6B', display: 'flex', alignItems: 'flex-end', padding: '8px 10px' }}>
                      <Image
                        src={cityLoc.cityImageUrl ?? `/images/cities/${cityLoc.id}.jpg`}
                        alt={cityLoc.name} fill style={{ objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span style={{ position: 'absolute', top: '7px', left: '8px', fontSize: '9px', fontWeight: 600, color: '#fff', background: 'rgba(10,30,61,0.72)', padding: '2px 7px', borderRadius: '10px' }}>
                        {isPinnedHero ? '★ Pinned' : `Match ${i + 1}`}
                      </span>
                      <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px' }}>
                        {comparePartner && (
                          <button type="button" className="mm3-secondary-action" aria-label="Compare"
                            onClick={e => { e.stopPropagation(); setCompareCityId(cityLoc.id) }}
                            style={{ width: '22px', height: '22px', borderRadius: '7px', border: 'none', background: 'rgba(255,255,255,0.9)', color: '#0A1E3D', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>
                            ⇄
                          </button>
                        )}
                        <button type="button" className="mm3-secondary-action" aria-label={isPinnedHero ? 'Unpin' : 'Pin'}
                          onClick={e => { e.stopPropagation(); isPinnedHero ? unpinCity(cityLoc.id) : pinCity(cityLoc.id) }}
                          disabled={!isPinnedHero && pinnedCities.length >= 3}
                          style={{
                            width: '22px', height: '22px', borderRadius: '7px', border: 'none',
                            background: isPinnedHero ? '#C5B783' : 'rgba(255,255,255,0.9)', color: '#0A1E3D', fontSize: '11px',
                            cursor: (!isPinnedHero && pinnedCities.length >= 3) ? 'not-allowed' : 'pointer',
                            opacity: (!isPinnedHero && pinnedCities.length >= 3) ? 0.5 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
                          }}>
                          {isPinnedHero ? '★' : '☆'}
                        </button>
                      </div>
                      <p style={{ position: 'relative', margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cityLoc.name}
                      </p>
                    </div>
                    {/* Body — match %, fit badge, median + monthly, See summary report */}
                    <div style={{ padding: '9px 10px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A1E3D', lineHeight: 1 }}>
                          {match ? match.matchScore : '—'}<span style={{ fontSize: '9px', fontWeight: 500, color: '#86868b' }}>% match</span>
                        </span>
                        <span style={{ fontSize: '9.5px', fontWeight: 600, padding: '2px 7px', borderRadius: '10px', background: badge.bg, color: badge.color }}>
                          {afLabel(status)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#86868b', marginBottom: '7px' }}>
                        <span>Median <b style={{ color: '#1d1d1f', fontWeight: 600 }}>{fmtK(cityLoc.housing.medianHomePrice)}</b></span>
                        <span>~<b style={{ color: '#1d1d1f', fontWeight: 600 }}>${cityMonthly.toLocaleString()}</b>/mo</span>
                      </div>
                      <button type="button"
                        onClick={e => { e.stopPropagation(); if (match) openReport(match) }}
                        disabled={!match}
                        style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', fontSize: '10px', color: '#0076B6', cursor: match ? 'pointer' : 'default' }}>
                        ▾ See summary report
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
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
              const pct = f.value !== 'State' ? metroTopScores[f.value] : undefined
              return (
                <button key={f.value} type="button"
                  onClick={() => handleMetroChange(f.value)}
                  style={{
                    padding: '3px 9px', borderRadius: '20px', fontSize: '10px',
                    fontWeight: active ? 500 : 400,
                    background: active ? 'rgba(197,183,131,0.18)' : 'transparent',
                    color: active ? '#8a6f00' : '#6B6A65',
                    border: `0.5px solid ${active ? '#C5B783' : '#D0CEC8'}`,
                    cursor: 'pointer',
                  }}>{f.label}{pct != null ? ` · ${pct}%` : ''}</button>
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
                  const isSelected = city.id === effectiveSelectedKey
                  const status = afStatus(city.housing.medianHomePrice)
                  const overallIdx = rankedCities.findIndex(m => m.location.id === city.id)

                  let rowBg = 'transparent'
                  let rowBorder = 'transparent'
                  if (isPinned) { rowBg = '#FEFDF8'; rowBorder = '#C5B783' }
                  else if (isSelected) { rowBg = '#F0F3F8'; rowBorder = '#0A1E3D' }

                  return (
                    <div key={city.id} onClick={() => setSelectedKey(city.id)}
                      style={{
                        background: rowBg, border: `0.5px solid ${rowBorder}`,
                        borderRadius: '6px', padding: '7px 8px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        marginBottom: '6px', cursor: 'pointer',
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
                        className="mm3-secondary-action"
                        onClick={e => { e.stopPropagation(); isPinned ? unpinCity(city.id) : pinCity(city.id) }}
                        disabled={!isPinned && pinnedCities.length >= 3}
                        style={{
                          fontSize: '9px', color: isPinned ? '#C5B783' : '#0076B6',
                          padding: '2px 5px', borderRadius: '8px',
                          border: isPinned ? '0.5px solid rgba(197,183,131,0.4)' : '0.5px solid #C8E0F5',
                          background: isPinned ? 'rgba(197,183,131,0.1)' : '#F0F7FF',
                          cursor: (!isPinned && pinnedCities.length >= 3) ? 'not-allowed' : 'pointer',
                          flexShrink: 0,
                          opacity: isPinned ? 1 : (pinnedCities.length >= 3 ? 0.38 : 0.55),
                        }}>
                        {isPinned ? '✓' : 'Pin'}
                      </button>
                      {getComparePartnerId(city.id) && (
                        <button type="button"
                          className="mm3-secondary-action"
                          onClick={e => { e.stopPropagation(); setCompareCityId(city.id) }}
                          style={{
                            fontSize: '9px', color: '#C5B783', opacity: 0.55,
                            padding: '2px 5px', borderRadius: '8px',
                            border: '0.5px solid rgba(197,183,131,0.35)',
                            background: 'rgba(197,183,131,0.1)',
                            cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
                          }}>
                          Compare
                        </button>
                      )}
                      {!isPinned && (
                        <button type="button"
                          className="mm3-secondary-action"
                          onClick={e => { e.stopPropagation(); removeCity(city.id) }}
                          style={{
                            fontSize: '9px', color: '#9a9a9a', opacity: 0.55,
                            padding: '2px 5px', borderRadius: '8px',
                            border: '0.5px solid rgba(0,0,0,0.12)',
                            background: 'rgba(0,0,0,0.03)',
                            cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
                          }}>
                          Remove
                        </button>
                      )}
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
                {removedCities.length > 0 && (
                  <div style={{ textAlign: 'center', padding: '6px', fontSize: '9px', color: '#9a9a9a' }}>
                    {removedCities.length} removed from view —{' '}
                    <span onClick={() => setRemovedCities([])} style={{ color: '#0076B6', cursor: 'pointer' }}>
                      Restore all
                    </span>
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

  // ──────────────────────────────────────────────────────────
  // Non-Negotiables (Phase E, Brief 1) — inline accordion, collapsed by default.
  // Deliberately NOT a modal/drawer like Advanced Assumptions: this section must
  // stay always-visible-inline, matching Communities' treatment on both desktop
  // (Control Panel) and mobile (main scroll flow) — confirmed in Phase 0.
  // ──────────────────────────────────────────────────────────
  const nonNegItems: { key: 'hoaStrict' | 'crimeSafety' | 'notWalkable' | 'medicalAccess'; label: string; help: string }[] = [
    { key: 'hoaStrict', label: 'Strict HOA', help: "HOA strictness varies house to house within the same city — this won't filter your matches. We'll flag it for your Market Director to factor in when evaluating specific homes." },
    { key: 'crimeSafety', label: 'High crime/safety concern', help: 'Excludes communities with a Higher Risk safety rating.' },
    { key: 'notWalkable', label: 'Not walkable', help: 'Excludes communities with low walkability scores.' },
    { key: 'medicalAccess', label: 'Limited nearby medical care', help: 'Excludes communities with low healthcare-access scores.' },
  ]
  const nonNegSetCount = [
    nonNegotiables.hoaStrict, nonNegotiables.crimeSafety, nonNegotiables.notWalkable, nonNegotiables.medicalAccess,
    nonNegotiables.schoolMinGrade != null, nonNegotiables.propertyTaxMaxPct != null, nonNegotiables.anythingElse.trim().length > 0,
  ].filter(Boolean).length
  const helpIconStyle: React.CSSProperties = {
    fontSize: '9px', color: '#86868b', border: '0.5px solid #D0CEC8', borderRadius: '50%',
    width: '13px', height: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'default', flexShrink: 0,
  }

  const nonNegotiablesSection = (
    <div style={{ padding: '16px 16px 18px', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
      <button type="button" onClick={() => setNonNegotiablesOpen(v => !v)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0A1E3D', margin: 0 }}>Non-Negotiables</p>
        <span style={{ fontSize: '10px', color: '#86868b' }}>
          {nonNegSetCount > 0 ? `${nonNegSetCount} set` : 'None set'} {nonNegotiablesOpen ? '▲' : '▼'}
        </span>
      </button>

      {nonNegotiablesOpen && (
        <div style={{ marginTop: '12px' }}>
          {nonNegItems.map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                <span style={{ fontSize: '11px', color: '#1d1d1f' }}>{item.label}</span>
                <span title={item.help} style={helpIconStyle}>?</span>
              </div>
              <NonNegToggle active={nonNegotiables[item.key]} onClick={() => updateNonNegotiables({ [item.key]: !nonNegotiables[item.key] })} />
            </div>
          ))}

          {/* School rating threshold */}
          <div style={{ padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#1d1d1f' }}>Minimum school rating</span>
              <span title="Excludes communities whose TEA school rating is below your chosen minimum." style={helpIconStyle}>?</span>
            </div>
            <select value={nonNegotiables.schoolMinGrade ?? ''}
              onChange={e => updateNonNegotiables({ schoolMinGrade: (e.target.value || null) as NonNegotiablesState['schoolMinGrade'] })}
              style={{ width: '100%', fontSize: '11px', padding: '4px 6px', borderRadius: '6px', border: '0.5px solid #D0CEC8', fontFamily: 'inherit', background: '#fff' }}>
              <option value="">No minimum</option>
              <option value="A">A or better</option>
              <option value="B">B or better</option>
              <option value="C">C or better</option>
              <option value="D">D or better</option>
            </select>
          </div>

          {/* Property tax threshold */}
          <div style={{ padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#1d1d1f' }}>Maximum property tax rate</span>
              <span title="Excludes communities whose property tax rate is above your chosen maximum." style={helpIconStyle}>?</span>
            </div>
            <select value={nonNegotiables.propertyTaxMaxPct ?? ''}
              onChange={e => updateNonNegotiables({ propertyTaxMaxPct: e.target.value ? parseFloat(e.target.value) : null })}
              style={{ width: '100%', fontSize: '11px', padding: '4px 6px', borderRadius: '6px', border: '0.5px solid #D0CEC8', fontFamily: 'inherit', background: '#fff' }}>
              <option value="">No maximum</option>
              <option value="0.015">Under 1.5%</option>
              <option value="0.02">Under 2.0%</option>
              <option value="0.025">Under 2.5%</option>
            </select>
          </div>

          {/* Anything else — MD-context note only, never touches filtering */}
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '10px', color: '#86868b', margin: '0 0 3px' }}>Anything else? Shared with your Market Director — doesn't affect matching.</p>
            <textarea value={nonNegotiables.anythingElse}
              onChange={e => setNonNegotiables(prev => ({ ...prev, anythingElse: e.target.value }))}
              onBlur={() => debounceSavePriorities(mustHaves, niceToHaves, notPriorities, unassigned, nonNegotiables)}
              rows={2}
              style={{ width: '100%', fontSize: '11px', padding: '6px 8px', borderRadius: '6px', border: '0.5px solid #D0CEC8', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
        </div>
      )}
    </div>
  )

  // Brief 3 — Ask Amy launcher is present per the prototype, but its glossary/Q&A
  // content is deferred to Brief 7. For now the drawer opens this minimal placeholder.
  const askAmyPlaceholder = (
    <div style={{ padding: '20px 22px' }}>
      <p style={{ fontSize: '12.5px', color: '#1d1d1f', lineHeight: 1.6, margin: '0 0 10px' }}>
        <b style={{ color: '#0A1E3D' }}>Amy</b> is your relocation guide. She&rsquo;ll answer Texas
        terms and home-buying-process basics right here.
      </p>
      <p style={{ fontSize: '11px', color: '#86868b', lineHeight: 1.6, margin: 0 }}>
        Coming soon. For anything specific to your move, your Market Director is the person to ask.
      </p>
    </div>
  )

  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────
  return (
    <>
      {/* Declutter pass item 6 — Pin/Compare/Remove read as dimmed/secondary by
          default, full-strength on hover/focus so ranked results dominate the
          visual hierarchy. Inline styles can't express :hover, hence this tag. */}
      <style>{`
        .mm3-secondary-action { transition: opacity 0.15s ease; }
        .mm3-secondary-action:hover, .mm3-secondary-action:focus-visible { opacity: 1 !important; }
      `}</style>

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

      {/* Advanced Assumptions (Declutter pass) — desktop only; mobile nests this
          inside the already-open Financials drawer instead (see below). */}
      {!isMobile && advancedAssumptionsOpen && (
        <div
          onClick={() => setAdvancedAssumptionsOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '380px',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.28)', padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1E3D', margin: 0 }}>Advanced Assumptions</p>
              <button type="button" onClick={() => setAdvancedAssumptionsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#86868b' }}>
                ✕ Close
              </button>
            </div>
            {advancedAssumptionsContent}
          </div>
        </div>
      )}

      {/* Compare (Phase C1 Item 6, restructured Phase D) — pairing logic is
          generalized across the 3-slot hero rotation via getComparePartnerId.
          CompareModal itself takes an array of cities (2 today, N-ready) —
          this call site always passes exactly the 2 currently paired. */}
      {compareCityId && (() => {
        const partnerId = getComparePartnerId(compareCityId)
        const cityA = findMatch(compareCityId)
        const cityB = partnerId ? findMatch(partnerId) : undefined
        if (!cityA || !cityB) return null
        return (
          <CompareModal
            cities={[cityA, cityB]}
            profile={activeProfile}
            totalFunds={totalFunds}
            interestRate={interestRate}
            loanTerm={loanTerm}
            originState={originState}
            originCity={originCity}
            onClose={() => setCompareCityId(null)}
          />
        )
      })()}

      {/* Brief 3 — icon rail + summoned drawer shell (desktop) / bottom-bar + sheet
          (mobile). Replaces the always-open ~40% control panel. The drawer is a flex
          SIBLING of the canvas (push model), never an overlay, so it can never cover the
          results. No-horizontal-scroll is guaranteed structurally two ways: (1) in this
          flex row the child widths always sum to the row width — the rail is a fixed
          132px, the drawer is flex-basis 0↔404px, and the canvas is flex:1 with
          min-width:0, so as the drawer grows the canvas shrinks by the same amount (no
          net horizontal growth); (2) overflow-x:hidden on the row clips any sub-pixel
          transient during the width transition, so nothing can leak into WorkspacePanel's
          implicit overflow-x:auto (CLAUDE.md §5). Because the width can never grow the
          page, the push transition is safe to keep (no fade fallback needed). */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100%', overflowX: 'hidden' }}>

        {/* ── ICON RAIL — desktop only ── */}
        {!isMobile && (
          <nav aria-label="Refine controls" style={{
            width: '132px', flexShrink: 0, background: '#0A1E3D',
            display: 'flex', flexDirection: 'column', padding: '16px 10px',
            position: 'sticky', top: 0, alignSelf: 'stretch',
          }}>
            <p style={{ color: '#7F93AF', fontSize: '9px', letterSpacing: '0.6px', textTransform: 'uppercase', padding: '0 6px 6px', margin: 0 }}>Refine</p>
            {RAIL_ITEMS.filter(i => i.group === 'refine').map(({ k, label, Icon }) => {
              const active = openDrawer === k
              return (
                <button key={k} type="button" onClick={() => setOpenDrawer(active ? null : k)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                    border: 'none', background: active ? '#C5B783' : 'transparent',
                    borderRadius: '10px', color: active ? '#0A1E3D' : '#B8C4D6',
                    padding: '10px', marginBottom: '3px', textAlign: 'left', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '12.5px', fontWeight: 500, lineHeight: 1.15,
                  }}>
                  <Icon size={20} style={{ flexShrink: 0 }} />
                  <span>{label}</span>
                </button>
              )
            })}
            {/* Brief 4 C1 — the Learn group renders directly under Refine. The prior
                marginTop:auto spacer pushed it to the bottom of the rail, which stretches
                to full page-content height (WorkspacePanel scroll model), dropping the Ask
                Amy launcher far below the fold so it never appeared. */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)', margin: '10px 4px 12px' }} />
            <p style={{ color: '#7F93AF', fontSize: '9px', letterSpacing: '0.6px', textTransform: 'uppercase', padding: '0 6px 6px', margin: 0 }}>Learn</p>
            {RAIL_ITEMS.filter(i => i.group === 'learn').map(({ k, label, Icon }) => {
              const active = openDrawer === k
              return (
                <button key={k} type="button" onClick={() => setOpenDrawer(active ? null : k)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                    border: 'none', background: active ? '#C5B783' : 'transparent',
                    borderRadius: '10px', color: active ? '#0A1E3D' : '#B8C4D6',
                    padding: '10px', marginBottom: '3px', textAlign: 'left', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '12.5px', fontWeight: 500, lineHeight: 1.15,
                  }}>
                  <Icon size={20} style={{ flexShrink: 0 }} />
                  <span>{label}</span>
                </button>
              )
            })}
          </nav>
        )}

        {/* ── SUMMONED DRAWER — desktop only; push model (flex sibling, never overlays) ── */}
        {!isMobile && (
          <aside style={{
            flexShrink: 0,
            flexBasis: openDrawer ? '404px' : '0px', width: openDrawer ? '404px' : '0px',
            background: '#fff', overflow: 'hidden',
            borderRight: openDrawer ? '0.5px solid rgba(0,0,0,0.1)' : 'none',
            transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), flex-basis 0.28s cubic-bezier(0.4,0,0.2,1)',
            position: 'sticky', top: 0, alignSelf: 'stretch',
            display: 'flex', flexDirection: 'column',
          }}>
            {openDrawer && (
              <div style={{ width: '404px', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 22px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#0A1E3D' }}>{DRAWER_META[openDrawer].title}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#86868b' }}>{DRAWER_META[openDrawer].subtitle}</p>
                  </div>
                  <button type="button" onClick={() => setOpenDrawer(null)} aria-label="Close"
                    style={{ width: '30px', height: '30px', flexShrink: 0, borderRadius: '8px', border: '0.5px solid rgba(0,0,0,0.1)', background: '#fff', color: '#86868b', fontSize: '15px', lineHeight: 1, cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                  {openDrawer === 'lifestyle' && lifestyleContent}
                  {openDrawer === 'financials' && financialsContent}
                  {openDrawer === 'nonneg' && nonNegotiablesSection}
                  {openDrawer === 'guide' && askAmyPlaceholder}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* ── RESULTS CANVAS (Living Ledger) — full width on mobile ── */}
        <div style={{ flex: 1, background: '#F2F1EE', minWidth: 0, padding: '16px', overflowY: 'auto', paddingBottom: isMobile ? '132px' : '16px' }}>
          {/* Persistent CTA, top-right — desktop only. Sticky within this column's
              own scroll container so it stays visible above Your Direction as the
              Living Ledger's content scrolls, per Craig's "permanently visible,
              not scrolling out of view, not below the fold" requirement. */}
          {!isMobile && (
            <div style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              {ctaBlock}
            </div>
          )}
          {livingLedgerSummaryCard}
          {/* Communities — ported verbatim inline into the results canvas (Brief 3
              resolution #1), mirroring the existing mobile treatment. Lifestyle,
              Financials and Non-Negotiables moved into the rail drawer; Communities
              did NOT get its own drawer. Brief 4 does the real canvas restructure. */}
          {communitiesFrame}
        </div>
      </div>

      {/* ── MOBILE STICKY BOTTOM BAR + SUMMONED SHEET ── */}
      {isMobile && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500, background: '#0A1E3D', borderTop: '0.5px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex' }}>
              {RAIL_ITEMS.map(({ k, label }) => {
                const active = openDrawer === k
                return (
                  <button key={k} type="button"
                    onClick={() => setOpenDrawer(active ? null : k)}
                    style={{
                      flex: 1, padding: '10px 4px', fontSize: '10px', fontWeight: 500, lineHeight: 1.2,
                      background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      color: active ? '#C5B783' : 'rgba(255,255,255,0.55)',
                      borderBottom: active ? '2px solid #C5B783' : '2px solid transparent',
                    }}>
                    {label}
                  </button>
                )
              })}
            </div>
            <div style={{ padding: '10px 16px 14px' }}>
              {ctaError && (
                <p style={{ fontSize: '10px', color: '#FF6B6B', margin: '0 0 6px', textAlign: 'center', lineHeight: 1.4 }}>
                  {ctaError}
                </p>
              )}
              <button
                type="button" onClick={handleCommit} disabled={committing || !canSchedule}
                style={{
                  width: '100%', background: '#C5B783', color: '#0A1E3D',
                  border: 'none', borderRadius: '8px', padding: '12px',
                  fontWeight: 500, fontSize: '14px',
                  cursor: (committing || !canSchedule) ? 'not-allowed' : 'pointer',
                  opacity: (committing || !canSchedule) ? 0.5 : 1, fontFamily: 'inherit',
                }}
              >
                {committing ? 'Saving…' : 'Schedule a Consultation →'}
              </button>
              {!ctaError && scheduleHint && (
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '5px 0 0', lineHeight: 1.4 }}>
                  {scheduleHint}
                </p>
              )}
            </div>
          </div>

          {openDrawer && (
            <div
              onClick={() => { setOpenDrawer(null); setAdvancedAssumptionsOpen(false) }}
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
                    {openDrawer === 'financials' && advancedAssumptionsOpen ? 'Advanced Assumptions' : DRAWER_META[openDrawer].title}
                  </p>
                  <button type="button" onClick={() => { setOpenDrawer(null); setAdvancedAssumptionsOpen(false) }}
                    style={{ fontSize: '13px', color: '#86868b', background: 'none', border: 'none', cursor: 'pointer' }}>
                    ✕ Close
                  </button>
                </div>
                {openDrawer === 'lifestyle' && lifestyleContent}
                {openDrawer === 'financials' && (
                  advancedAssumptionsOpen ? (
                    <div style={{ padding: '12px 16px' }}>
                      <button type="button" onClick={() => setAdvancedAssumptionsOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#0076B6', marginBottom: '10px', padding: 0, fontFamily: 'inherit' }}>
                        ← Back to Financials
                      </button>
                      {advancedAssumptionsContent}
                    </div>
                  ) : financialsContent
                )}
                {openDrawer === 'nonneg' && nonNegotiablesSection}
                {openDrawer === 'guide' && askAmyPlaceholder}
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
