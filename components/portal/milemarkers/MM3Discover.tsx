'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { CityMatch, UserProfile, UserSession, SandboxProfile, DNAScores, NonNegotiablesState, ArchetypeKey } from '../../../types'
import FullReport from '../../results/FullReport'
import { DNA_CATEGORIES, PRIORITY_SELECTABLE_CATEGORIES } from '../../../utils/constants'
import { getAllCities } from '../../../services/locationService'
import { getTopMatches, getDownPaymentMidpoint, getProceedsMidpoint } from '../../../services/matchingService'
import PriorityTrackControl from '../../shared/PriorityTrackControl'
import { createClient } from '../../../lib/supabase/client'
import { lookupZipCityState } from '../../../utils/zipLookup'
import { txColIndex, txSafety, txPropertyTax, txJobMarket, txClimateV2 } from '../../../utils/txComparisonStats'
import CompareModal from '../../results/CompareModal'
import AmyPanel from '../amy/AmyPanel'
import { SlidersHorizontal, CircleDollarSign, ShieldCheck, MessageCircle, GraduationCap, Users, Briefcase, Mountain, TrendingUp, UtensilsCrossed, Gem, Pencil, Lock } from 'lucide-react'

const ALL_KEYS = DNA_CATEGORIES.map(c => c.key) as (keyof DNAScores)[]
// Priority Engine B1 — the user-selectable subset (growthPotential/careerAccess removed).
// ALL_KEYS is kept for read-back dedupe + completeness so legacy career/growth placements
// hydrate and still resolve; SELECTABLE_KEYS drives what the Lifestyle drawer offers.
const SELECTABLE_KEYS = PRIORITY_SELECTABLE_CATEGORIES.map(c => c.key) as (keyof DNAScores)[]

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

// Brief 6 C2 — read-only archetype display. Labels follow the discovery quiz's own reason
// framing (ARCHETYPE_MAP in Card2MovingReason); each "why" reflects ONLY what
// services/archetypeService.ts actually does per archetype (categoryAdjustments + the
// data-vs-feel blend). Blend-only archetypes read as balanced — no invented tilt, no
// commute/work-flexibility or affordability claims. Read-only: never written back.
const ARCHETYPE_DISPLAY: Record<ArchetypeKey, { label: string; why: string; explanation: string }> = {
  family: {
    label: 'Raising a family',
    why: 'We weight school quality and family life more heavily and lean on community data over personal feel.',
    explanation: "Because you're relocating for your family, we lean on hard community data more than personal feel (about 70/30) — communities with strong schools and family life rise to the top, while nightlife and dining count a bit less. Your priority tiers below fine-tune it from here.",
  },
  firsttime: {
    label: 'Buying our first home',
    why: 'A data-forward profile that eases off luxury-lifestyle factors.',
    explanation: 'As a first-time purchase, your matches stay data-forward and ease off luxury-lifestyle factors, so practical, well-rounded communities surface first. (Affordability is handled by your budget in the Money drawer, not by this setting.) Your priority tiers below fine-tune it from here.',
  },
  executive: {
    label: 'Career-driven move',
    why: 'A near-even balance of community data and personal feel, with no single category pushed ahead.',
    explanation: 'A career-driven move keeps things balanced — community data and personal feel weigh nearly evenly (about 55/45), with no single category pushed ahead. From here, your priority tiers below steer the results.',
  },
  luxury: {
    label: 'Higher-end lifestyle',
    why: 'An even split between community data and personal feel, with no single category emphasized.',
    explanation: 'For a higher-end move, community data and personal feel split evenly (50/50), with no single category emphasized up front. From here, your priority tiers below shape the results.',
  },
  retiree: {
    label: 'Our next chapter',
    why: 'We weight outdoor access more, ease off schools and growth-focused areas, and lean a little more on personal feel.',
    explanation: 'For your next chapter, we lean a little more on personal feel (about 45/55), weight outdoor access higher, and ease off schools and fast-growth areas. Your priority tiers below fine-tune it from here.',
  },
  youngpro: {
    label: 'Freedom & flexibility',
    why: 'We weight career access and dining & entertainment more and ease off school-focused factors.',
    explanation: 'Because this move is about freedom and flexibility, we weight career access and dining & entertainment higher and ease off school-focused factors, keeping data and feel fairly balanced (about 60/40). Your priority tiers below fine-tune it from here.',
  },
  general: {
    label: 'Exploring our options',
    why: 'A balanced profile with nothing pushed ahead until your priorities below tell us more.',
    explanation: 'With a general move, nothing is pushed ahead yet — your matches start balanced and take their shape from the priority tiers below. Adjust them to tell us what matters most.',
  },
}

// Brief 3 — icon rail + summoned drawer shell. The rail replaces the always-open
// ~40% control panel; each launcher summons a single drawer (one open at a time).
// "Limits" is the shipped user-facing term (as of July 12, 2026); the internal nonNeg /
// nonNegotiables naming and the persisted `nonNegotiables` sandbox_profile key are kept
// unchanged for stability — renaming those would corrupt matching/persistence.
type DrawerKey = 'lifestyle' | 'financials' | 'nonneg' | 'guide'
const RAIL_ITEMS: { k: DrawerKey; label: string; Icon: typeof SlidersHorizontal; group: 'refine' | 'learn' }[] = [
  { k: 'lifestyle',  label: 'Lifestyle',       Icon: SlidersHorizontal, group: 'refine' },
  { k: 'financials', label: 'Money',           Icon: CircleDollarSign,  group: 'refine' },
  { k: 'nonneg',     label: 'Limits',          Icon: ShieldCheck,       group: 'refine' },
  { k: 'guide',      label: 'Ask Amy',         Icon: MessageCircle,     group: 'learn'  },
]
const DRAWER_META: Record<DrawerKey, { title: string; subtitle: string }> = {
  lifestyle:  { title: 'Lifestyle',       subtitle: 'What matters most in where you land.' },
  financials: { title: 'Money',           subtitle: 'Your real numbers drive every match live.' },
  nonneg:     { title: 'Limits', subtitle: 'Hard filters — we only show what clears them.' },
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

// MM3 header restructure — Version A generic metro-% hover (shown only under All Texas,
// where the pills carry the top-1-city match score). Version B (per-metro reasoning) stays
// PARKED. metroTopScores is the top-scoring city per metro, i.e. the strongest match there.
const METRO_MATCH_HOVER = 'Your strongest match in this metro. Shown across Texas so you can see where your best options are — pick a metro to explore it.'

// Brief 7B — per-city hero-photo gradient palette (prototype PALETTE), cycled by card index
// (i % length). Renders as linear-gradient(150deg, c1, c2) behind the city <Image>; shows when
// the image is absent/errors, replacing the old flat navy fallback. Presentation only.
const CARD_GRADIENTS: [string, string][] = [
  ['#3a6ea5', '#1f3d63'], ['#4a7c59', '#274332'], ['#7a5a7d', '#452845'], ['#8a6a4a', '#4f3a28'],
  ['#356b8a', '#1d3d50'], ['#5c7a56', '#33472f'], ['#6a6a8a', '#3a3a52'], ['#7d5a6a', '#45303a'],
  ['#3f7d5a', '#234433'], ['#4a6a95', '#293c56'],
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

// Drawer-polish — personality slider restyled to the prototype .slrow layout:
// a "Left ↔ Right" line above (with optional desktop-only hover-def via the CP-money
// .mm3-help CSS) + end labels below. value/onChange preserved byte-for-byte.
const SliderRow = ({
  leftLabel,
  rightLabel,
  value,
  onChange,
  def,
}: {
  leftLabel: string
  rightLabel: string
  value: number
  onChange: (v: number) => void
  def?: string
}) => (
  <div style={{ margin: '14px 0' }}>
    <div style={{ fontSize: '12px', fontWeight: 500, color: '#1c2430', marginBottom: '4px' }}>
      {def
        ? <span className="mm3-help">{leftLabel} ↔ {rightLabel}<span className="mm3-help-tip">{def}</span></span>
        : <>{leftLabel} ↔ {rightLabel}</>}
    </div>
    <input
      type="range"
      min={1}
      max={10}
      step={1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: '#0076B6', cursor: 'pointer' }}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#b3b0a6', marginTop: '1px' }}>
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
    </div>
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

// 4-tier priority chain used by the Lifestyle drawer (a genuine, visible "Not Yet
// Sorted" 4th group, not collapsed/secondary). Order matters: highest priority first —
// the track-and-ball's one-hop overflow walks this order (see PriorityTrackControl).
type Tier = 'mustHave' | 'important' | 'wouldBeNice' | 'unassigned'
const TIER_ORDER: Tier[] = ['mustHave', 'important', 'wouldBeNice', 'unassigned']
// Track-and-ball priority caps (Brief C CP4): Top priority 3, Really matters 3, the bottom
// two uncapped. A ball dropped into a full capped tier redirects ONE tier down (then blocks
// if that tier is also full); the target header flashes. Caps enforce on ADD, never on LOAD.
const PRIORITY_CAPS: number[] = [3, 3, Infinity, Infinity]
// Brief 3 — the per-tier `weight` labels ('3×'/'2×'/'1×') were removed: they DISPLAYED
// multipliers the engine doesn't apply (real TIER_MULTIPLIERS are 1.5/1.25/1.0). Tier
// headers now show the name only; the soft "counts for more when you mark it a priority"
// hover copy carries the meaning without a contradicting number. Engine values untouched.
const PRIORITY_TIERS: { label: string }[] = [
  { label: 'Top priority' },
  { label: 'Really matters' },
  { label: 'Nice to have' },
  { label: 'Not yet sorted' },
]
// Track-and-ball polish — per-category icons from the same Lucide set as the left rail
// (SlidersHorizontal / CircleDollarSign / ShieldCheck / MessageCircle). Rendered with no
// explicit color so they inherit currentColor — reading at their label's ink, matching the
// rail's icon = adjacent-label-color pattern. DNA_CATEGORIES (shared) is left untouched.
const PRIORITY_ICONS: Record<keyof DNAScores, typeof GraduationCap> = {
  schoolQuality: GraduationCap,
  familyLifestyle: Users,
  careerAccess: Briefcase,
  outdoorLifestyle: Mountain,
  growthPotential: TrendingUp,
  diningEntertainment: UtensilsCrossed,
  luxuryLifestyle: Gem,
}

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
  // Track-and-ball priority state (flashTier / dragBall) now lives inside PriorityTrackControl.
  const [originCity, setOriginCity] = useState<string | null>(null)
  const [originState, setOriginState] = useState<string | null>(null)

  // Brief 3 — icon rail + summoned drawer. A single openDrawer state drives BOTH the
  // desktop rail and the mobile bottom bar, which structurally guarantees "one drawer
  // open at a time." Replaces the prior desktop activePanel tab switch and the mobile
  // mobileDrawerOpen flag — both were UI-only, no persistence rode on them. null = closed.
  const [openDrawer, setOpenDrawer] = useState<DrawerKey | null>(null)
  // Ask Amy (Part 1) — Amy reuses the single openDrawer state (so it stays mutually exclusive
  // with the three Refine drawers) but renders as a dedicated RIGHT-side panel after the canvas.
  // The shared LEFT drawer must therefore NOT open for 'guide'.
  const leftDrawerOpen = openDrawer !== null && openDrawer !== 'guide'
  const amyDrawerOpen = openDrawer === 'guide'
  const [isMobile, setIsMobile] = useState(false)
  const [advancedAssumptionsOpen, setAdvancedAssumptionsOpen] = useState(false) // Declutter pass — Interest rate + Loan term moved behind this
  const [nonNegotiables, setNonNegotiables] = useState<NonNegotiablesState>(DEFAULT_NON_NEGOTIABLES)

  // Compare (Phase C1 Item 6, restructured Phase D) — reuses the existing CompareModal/createComparisonReportDocument
  // logic as-is. Pairing is generalized across the 3-slot hero rotation via
  // getComparePartnerId below, available from both the hero tabs and the expanded
  // 5-10 list.
  const [compareCityId, setCompareCityId] = useState<string | null>(null)

  // Brief 6 C1 — Consultation confirm-gate. Replaces the old pin+lock gate
  // (lifestyleLocked/financialsLocked). `confirmed` is the single gate that unlocks
  // Advance; `summaryOpen` drives the review modal; `reconfirmNudge` is the one-time
  // "your choices changed — reconfirm" hint after an edit invalidates a confirmation.
  const [confirmed, setConfirmed] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [reconfirmNudge, setReconfirmNudge] = useState(false)

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
        // No stored priority data → seed the 5 selectable dims to Important. The two
        // unselectable dims are intentionally left out of every bucket so they fall to the
        // 'unassigned' default (1.0 base weight), never the boosted Important tier.
        setNiceToHaves(SELECTABLE_KEYS)
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
    // CP4 — amortize the balance after the family's funds (proceeds + savings), matching
    // the hero card's cityBalance and pdfService. Previously fed the full median price as
    // principal, so the badge ignored the down payment. Display only; scorer untouched.
    const balance = Math.max(0, medianPrice - totalFunds)
    const monthly = calcMonthly(balance, rate, loanTerm)
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

  // Brief 4 C2 — Buying Power now references the FOCUSED city (effectiveSelectedKey),
  // not pinnedCities[0], so "Monthly est." tracks the hero card the user is focused on.
  const refCityData = getAllCities().find(c => c.id === effectiveSelectedKey)
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

  // Brief C CP1 — the track-and-ball control now lives in <PriorityTrackControl>. It computes
  // caps/overflow and emits the final tier; this handler applies it to the SAME bucket state and
  // persists via the SAME debounceSavePriorities -> sandbox_profile path (byte-for-byte the
  // retired setPriorityTier mutation). setSandboxTouched fires on every commit, as before.
  function handlePriorityAssign(keyStr: string, target: number) {
    const key = keyStr as keyof DNAScores
    setSandboxTouched(true)
    const curIdx = TIER_ORDER.indexOf(currentTier(key))
    if (target === curIdx) return
    const newMH = mustHaves.filter(k => k !== key)
    const newNH = niceToHaves.filter(k => k !== key)
    const newNP = notPriorities.filter(k => k !== key)
    const newUA = unassigned.filter(k => k !== key)
    const targetTier = TIER_ORDER[target]
    if (targetTier === 'mustHave') newMH.push(key)
    else if (targetTier === 'important') newNH.push(key)
    else if (targetTier === 'wouldBeNice') newNP.push(key)
    else newUA.push(key)
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

  // Brief 6 C1 — the confirm-gate replaces the old pin+lock gate. Only a pinned city
  // is needed to open the confirm summary; `confirmed` (set in the modal) is what
  // unlocks Advance.
  const hasPinnedCity = pinnedCities.length > 0

  // Brief 6 C2 — resolve the user's archetype for read-only display. Defensive: a missing
  // or unknown key falls back to `general` — never crashes, never shows a raw key.
  const rawArchetype = profile?.archetype
  const archetypeKey: ArchetypeKey = rawArchetype && (rawArchetype in ARCHETYPE_DISPLAY)
    ? (rawArchetype as ArchetypeKey)
    : 'general'
  const archetypeInfo = ARCHETYPE_DISPLAY[archetypeKey]

  // Honesty guard — any edit to a summary input after confirming silently un-confirms
  // and re-grays Advance, so the reviewed summary always matches the screen. Self-
  // guarded: confirming changes only `confirmed`/`summaryOpen` (not these deps), so it
  // never clears itself; on mount `confirmed` is false, so initial hydration is a no-op.
  useEffect(() => {
    if (confirmed) { setConfirmed(false); setReconfirmNudge(true) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mustHaves, niceToHaves, notPriorities, unassigned, nonNegotiables, proceeds, savings, incomeVal, interestRate, loanTerm, isSelling, pinnedCities, personalityPreference])

  // Brief 4 C2 — ranks 4–10 for the browse expander (rankedCities minus the hero-3 set).
  // The old selectedMatch/selectedRankIdx/displayedCities (community preview + 1–10 list)
  // are removed with that UI; the hero-3 + browse read rankedCities directly.
  const browseCities = rankedCities.filter(m => !heroSlots.includes(m.location.id)).slice(0, 7)

  // ──────────────────────────────────────────────────────────
  // Brief 3 — the Lifestyle/Financials tab switcher was removed: each panel is now
  // its own rail launcher summoning its own drawer, so the shared tab control is gone.
  // ──────────────────────────────────────────────────────────

  // ──────────────────────────────────────────────────────────
  // Brief 6 C1 — LockToggle removed; the old lock gate is replaced by the confirm gate.

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
      {/* Brief 6 C2 — read-only archetype line ("Why are you moving?"). Display only. */}
      <div style={{ background: 'linear-gradient(180deg,#FBFAF6,#fff)', border: '0.5px solid #E8E6E2', borderRadius: '10px', padding: '10px 12px', margin: '0 0 12px' }}>
        <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#86868b', margin: 0 }}>Why are you moving?</p>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0A1E3D', margin: '2px 0 4px' }}>{archetypeInfo.label}</p>
        <p style={{ fontSize: '11px', color: '#6B6A65', lineHeight: 1.5, margin: 0 }}>{archetypeInfo.why}</p>
        <p style={{ fontSize: '11px', color: '#6B6A65', lineHeight: 1.55, margin: '6px 0 0' }}>{archetypeInfo.explanation}</p>
      </div>

      <p style={{ fontSize: '10px', color: '#6a7180', margin: '0 0 10px', lineHeight: 1.5 }}>
        Drag each dot — or tap a band — to set how much it matters.
      </p>

      <PriorityTrackControl
        items={SELECTABLE_KEYS.map(key => {
          const c = DNA_CATEGORIES.find(x => x.key === key)!
          return { key, label: c.label, Icon: PRIORITY_ICONS[key], whatItIs: c.whatItIs, howItCounts: c.howItCounts }
        })}
        tierOf={Object.fromEntries(SELECTABLE_KEYS.map(k => [k, TIER_ORDER.indexOf(currentTier(k))]))}
        caps={PRIORITY_CAPS}
        tierLabels={PRIORITY_TIERS.map(t => t.label)}
        onAssign={handlePriorityAssign}
        isMobile={isMobile}
      />

      <div style={{ fontSize: '11px', color: '#6a7180', background: '#F2F1EE', borderRadius: '8px', padding: '9px 11px', marginTop: '12px', lineHeight: 1.5 }}>
        Higher tiers count for more in your match — Top priority counts most, then Really matters.
      </div>

      {/* Personality sliders */}
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '12px 0 4px', marginTop: '10px' }}>
        <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: '#666', textTransform: 'uppercase', marginBottom: '10px' }}>
          Your Personality
        </p>
        {([
          { key: 'growthProfile', left: 'Established', right: 'Up-and-Coming', def: 'Settled, established neighborhoods versus newer, fast-growing areas still coming into their own.' },
          { key: 'lifestyleOrientation', left: 'Practical', right: 'Upscale & Aspirational', def: 'Down-to-earth, value-minded communities versus more polished, higher-end surroundings.' },
          { key: 'environment', left: 'Urban', right: 'Rural', def: 'Walkable city density versus quiet, spread-out country.' },
          { key: 'pace', left: 'Relaxed', right: 'Fast-paced', def: 'A laid-back everyday tempo versus a busy, high-energy one.' },
        ] as const).map(({ key, left, right, def }) => (
          <SliderRow
            key={key}
            leftLabel={left}
            rightLabel={right}
            value={personalityPreference[key]}
            onChange={(v) => handlePersonalityChange(key, v)}
            def={isMobile ? undefined : def}
          />
        ))}
      </div>
    </div>
  )

  // ──────────────────────────────────────────────────────────
  // Brief 5 CP-money — hover-definition label (desktop only, per Craig). On mobile it
  // renders plain text (no tooltip). Presentation-only; no state that affects saved values.
  // ──────────────────────────────────────────────────────────
  const HelpLabel = ({ text, def }: { text: string; def?: string }) => {
    if (isMobile || !def) return <>{text}</>
    return <span className="mm3-help">{text}<span className="mm3-help-tip">{def}</span></span>
  }

  // ──────────────────────────────────────────────────────────
  // Financials content (Money drawer) — Brief 5 CP-money restyle (UI/skin only; every
  // handler, debounce, onBlur and persist path preserved byte-for-byte).
  // ──────────────────────────────────────────────────────────
  const financialsContent = (
    <div style={{ padding: '14px 18px' }}>
      {/* Baseline banner — restyled to the prototype .baseline pill */}
      {baselineBudget > 0 && (
        <div style={{ fontSize: '11px', color: '#6a7180', background: '#F2F1EE', borderRadius: '7px', padding: '8px 11px', marginBottom: '14px', lineHeight: 1.5 }}>
          Your original Discovery estimate: {fmtK(baselineBudget)} budget · ~${baselineMonthly.toLocaleString()}/mo. Edits here recalibrate every match.
        </div>
      )}

      {/* Selling a home? — .nn row + toggle switch (reuses NonNegToggle; same isSelling boolean) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #E5E3DC', marginBottom: '4px' }}>
        <div style={{ fontSize: '12.5px', color: '#1c2430' }}>
          Selling a home?
          <span style={{ display: 'block', color: '#6a7180', fontSize: '10.5px', marginTop: '1px' }}>Adds your expected proceeds to your down payment</span>
        </div>
        <NonNegToggle active={isSelling} onClick={() => { setIsSelling(!isSelling); setSandboxTouched(true) }} />
      </div>

      {/* Proceeds — .field */}
      {isSelling && (
        <div style={{ margin: '14px 0' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '5px', color: '#1c2430' }}>
            <HelpLabel text="Expected home-sale proceeds" def="What you expect to walk away with after selling and paying off your current home; added to your down payment." />
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dcdad2', borderRadius: '9px', background: '#fff', padding: '0 12px', height: '42px' }}>
            <span style={{ color: '#6a7180', fontSize: '14px' }}>$</span>
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
              style={{ border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '15px', width: '100%', padding: '0 4px', color: '#1c2430', background: 'transparent' }} />
          </div>
        </div>
      )}

      {/* Savings — .field */}
      <div style={{ margin: '14px 0' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '5px', color: '#1c2430' }}>
          <HelpLabel text={isSelling ? 'Other savings / cash' : 'Savings toward down payment'} def="Savings you'll put toward the purchase — a bigger down payment means a smaller loan and lower monthly payment." />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dcdad2', borderRadius: '9px', background: '#fff', padding: '0 12px', height: '42px' }}>
          <span style={{ color: '#6a7180', fontSize: '14px' }}>$</span>
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
            style={{ border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '15px', width: '100%', padding: '0 4px', color: '#1c2430', background: 'transparent' }} />
        </div>
      </div>

      {/* Annual income — .field */}
      <div style={{ margin: '14px 0' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '5px', color: '#1c2430' }}>
          <HelpLabel text="Annual household income" def="Your total pre-tax household income; it drives every affordability figure." />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dcdad2', borderRadius: '9px', background: '#fff', padding: '0 12px', height: '42px' }}>
          <span style={{ color: '#6a7180', fontSize: '14px' }}>$</span>
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
            style={{ border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '15px', width: '100%', padding: '0 4px', color: '#1c2430', background: 'transparent' }} />
        </div>
      </div>

      {/* Advanced Assumptions trigger — KEPT (preserves advancedAssumptionsOpen wiring), restyled */}
      <div style={{ margin: '16px 0 12px' }}>
        <button type="button" onClick={() => setAdvancedAssumptionsOpen(true)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '9px', border: '1px solid #dcdad2', background: '#F2F1EE', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
          <span style={{ fontSize: '11px', color: '#6a7180' }}>Advanced assumptions</span>
          <span style={{ fontSize: '11px', color: '#1c2430', fontWeight: 500 }}>{interestRate}% · {loanTerm}yr →</span>
        </button>
      </div>

      {/* Monthly estimate readout — restyled */}
      <div style={{ background: 'rgba(0,118,182,0.07)', border: '1px solid rgba(0,118,182,0.18)', borderRadius: '9px', padding: '10px 13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '10px', color: '#0076B6', margin: '0 0 1px', fontWeight: 500 }}>Est. monthly payment</p>
          <p style={{ fontSize: '10px', color: '#6a7180', margin: 0 }}>Principal &amp; interest only</p>
        </div>
        <p style={{ fontSize: '17px', fontWeight: 600, color: '#0A1E3D', margin: 0 }}>
          {refMonthly > 0 ? `$${refMonthly.toLocaleString()}` : '—'}
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
      {/* Interest rate — .slrow skin + hover-def (handler preserved) */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <b style={{ fontSize: '12px', fontWeight: 500, color: '#1c2430' }}>
            <HelpLabel text="Interest rate" def="The annual mortgage rate used to estimate your payment — a working assumption you can adjust." />
          </b>
          <span style={{ fontSize: '12px', color: '#6a7180' }}>{interestRate}%</span>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#b3b0a6', marginTop: '2px' }}>
          <span>3%</span><span>10%</span>
        </div>
        <p style={{ fontSize: '9px', color: '#2f8f5b', margin: '4px 0 0' }}>● Current market: 6.25%–6.75%</p>
      </div>

      {/* Loan term — hover-def + pills (handler preserved) */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#1c2430', marginBottom: '6px' }}>
          <HelpLabel text="Loan term" def="How long you pay the mortgage; 30 years lowers the monthly payment, 15 raises it but saves interest." />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {([30, 15] as const).map(term => {
            const active = loanTerm === term
            return (
              <button key={term} type="button"
                onClick={() => { setLoanTerm(term); setSandboxTouched(true); persistNumbers({ loan_term_preference: term }) }}
                style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '11px', background: active ? '#0A1E3D' : '#fff', color: active ? '#fff' : '#6B6A65', border: `0.5px solid ${active ? '#0A1E3D' : '#D0CEC8'}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                {term} year
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ──────────────────────────────────────────────────────────
  // MM3 header restructure — the header band replaces the old sticky navy ctaBlock.
  // LEFT: intro line + "Your Relocation Profile" (relocated out of matchesArea) + the
  // region tabs (moved up, metro-% + Version A hover under All Texas). RIGHT (desktop):
  // the two STACKED gated CTAs — "Review and confirm your profile" (active) opens the
  // existing Brief 6 C1 review modal, which sets `confirmed`; "Schedule your consultation"
  // stays LOCKED until `confirmed`. Same gate state (`confirmed`/`summaryOpen`/hasPinnedCity),
  // same handlers (setSummaryOpen / handleCommit), same edit-invalidation guard — no new
  // persistence. Mobile keeps its two controls in the bottom bar; here it shows just the
  // intro + relocation profile + tabs.
  // ──────────────────────────────────────────────────────────
  const headerBand = (
    <div style={{ marginBottom: '12px', ...(isMobile ? {} : { paddingBottom: '12px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }) }}>
      {/* Brief 7B — CTA strip: its OWN row, right-aligned, ABOVE the metro row (desktop only;
          mobile uses the fixed bottom bar). Vertically stacked over the metro pills, so the CTAs
          never share a row with / wrap under the pills at any width. The intro heading was removed
          (Brief 7B Item A). Gate logic/handlers unchanged — only placement + styling. */}
      {!isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', marginBottom: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'stretch' }}>
            {/* Review — navy fill / gold text, card-like hover; opens the existing review/profile modal */}
            <button type="button" className="mm3-review-cta" onClick={() => { setReconfirmNudge(false); setSummaryOpen(true) }} disabled={!hasPinnedCity}
              title="Lock in your priorities, budget, and matches. Confirming unlocks scheduling your consultation."
              style={{
                background: '#0A1E3D', color: '#C5B783', border: '1.5px solid #0A1E3D',
                borderRadius: '8px', padding: '7px 13px', fontWeight: 600, fontSize: '12.5px',
                cursor: hasPinnedCity ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap',
                opacity: 1,
              }}>
              {confirmed ? '✓ Profile confirmed' : 'Review and confirm your profile'}
            </button>
            {/* Schedule — greyed + lock while gated; GOLD fill once confirmed. Gate logic unchanged. */}
            <button type="button" onClick={handleCommit} disabled={committing || !confirmed}
              title={confirmed ? 'Schedule your consultation with your Market Director.' : 'Confirm your profile to unlock'}
              style={{
                background: confirmed ? '#C5B783' : '#e9e6df', color: confirmed ? '#0A1E3D' : '#a7a299',
                border: 'none', borderRadius: '8px', padding: '7px 13px', fontWeight: 600, fontSize: '12.5px',
                cursor: (committing || !confirmed) ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap',
              }}>
              {!confirmed && <Lock size={12} style={{ flexShrink: 0 }} />}
              {committing ? 'Saving…' : (confirmed ? 'Schedule your consultation →' : 'Schedule your consultation')}
            </button>
          </div>
          {ctaError && (
            <p style={{ fontSize: '10px', color: '#c0392b', margin: 0, textAlign: 'right', lineHeight: 1.4 }}>{ctaError}</p>
          )}
          {!ctaError && !hasPinnedCity && (
            <p style={{ fontSize: '9px', color: '#a4a097', textAlign: 'right', margin: 0, lineHeight: 1.4 }}>
              Pin at least one community to confirm your choices.
            </p>
          )}
          {!ctaError && hasPinnedCity && reconfirmNudge && !confirmed && (
            <p style={{ fontSize: '9px', color: '#a48f4e', textAlign: 'right', margin: 0, lineHeight: 1.4 }}>
              Your choices changed — reconfirm before scheduling.
            </p>
          )}
        </div>
      )}

      {/* Metro row — Brief 7B: bolder pills; active = navy fill/white; metro-% in its own gold span
          (#C5B783 on white, #d3c493 on the navy active pill). The "% only shows when All Texas is
          active" logic is unchanged. */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {METRO_FILTERS.map(f => {
          const active = selectedMetro === f.value
          const pct = f.value !== 'State' ? metroTopScores[f.value] : undefined
          return (
            <button key={f.value} type="button"
              onClick={() => handleMetroChange(f.value)}
              title={pct != null ? METRO_MATCH_HOVER : undefined}
              style={{
                padding: '9px 17px', borderRadius: '20px', fontSize: '13.5px', fontWeight: 600,
                background: active ? '#0A1E3D' : '#fff',
                color: active ? '#fff' : '#1d1d1f',
                border: `0.5px solid ${active ? '#0A1E3D' : 'rgba(0,0,0,0.12)'}`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              {f.label}{pct != null ? <span style={{ color: active ? '#d3c493' : '#C5B783', fontWeight: 600 }}> {pct}% match</span> : ''}
            </button>
          )
        })}
      </div>
    </div>
  )

  // ──────────────────────────────────────────────────────────
  // Living Ledger — Your Direction / What Matters Most / Buying Power / Comparison
  // chart, ported verbatim into a self-contained navy card (was previously the
  // entire left column's background; now just this card's background, so every
  // child's existing color choice stays correct unchanged).
  // ──────────────────────────────────────────────────────────
  const livingLedgerSummaryCard = (
    // MM3 Brief 5 — finzone surface restyle: the single navy card became a transparent grid
    // wrapper; each zone is now its own WHITE card on the stone canvas (prototype .finpanel /
    // .cmpx tokens: #fff, 1px #dcdad2, 16px radius). All text flipped light-on-navy → navy/ink/
    // muted on white; section headers navy; pinned-city names keep a gold-d accent. Grid,
    // comparison position, figures/math, and fonts (Poppins) all untouched.
    <div style={{ marginBottom: '10px' }}>
      {/* MM3 Brief 2 — two-zone financial shell (prototype .finzone, ~60/40). LEFT: buying
          power (dominant); RIGHT: the origin comparison relocated here always-visible (was a
          collapsed accordion under the financials). Collapses to one column below 1080px via
          the .mm3-finzone media rule. Buying-power figures are the already-live-safe set only —
          no gated per-city breakdown / gauge / rate-sensitivity added. */}
      <div className="mm3-finzone">
        {/* LEFT ZONE — Your Buying Power (2×2). Brief 5 — white card on stone; header navy. */}
        <div style={{ background: '#fff', border: '1px solid #dcdad2', borderRadius: '16px', padding: '18px 20px' }}>
          <p style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: '#0A1E3D', textTransform: 'uppercase', margin: '0 0 8px' }}>
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
              subColor: interestRate >= 6.25 && interestRate <= 6.75 ? '#2f8f5b' : undefined,
            },
          ].map(cell => (
            <div key={cell.label} style={{ background: '#F5F4F1', borderRadius: '6px', padding: '7px 9px' }}>
              <p style={{ fontSize: '9px', color: '#6a7180', margin: '0 0 3px' }}>{cell.label}</p>
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 2px', lineHeight: 1.1 }}>{cell.value}</p>
              <p style={{ fontSize: '9px', color: cell.subColor ?? '#6a7180', margin: 0 }}>{cell.sub}</p>
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
          <div style={{ background: '#fff', border: '1px solid #dcdad2', borderRadius: '16px', padding: '18px 20px' }}>
            {/* RIGHT ZONE — origin comparison, always-visible (Brief 2). Brief 5 — white card on
                stone; navy header with a bottom divider (prototype .cmpx-h). Table markup unchanged;
                keeps its own overflowX:auto so any narrow-column overflow scrolls inside this zone. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #dcdad2', padding: '0 0 10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', color: '#0A1E3D', textTransform: 'uppercase' }}>
                How Texas compares to {originLabel}{originData && originState ? `, ${originState}` : ''}
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ fontSize: '9px', color: '#6a7180', padding: '4px 6px', textAlign: 'left', fontWeight: 400 }}></th>
                    <th style={{ fontSize: '9px', color: '#6a7180', padding: '4px 6px', textAlign: 'right', fontWeight: 400, whiteSpace: 'nowrap' }}>
                      {originLabel}
                    </th>
                    {pinnedCols.map((c, i) => (
                      <th key={i} style={{ fontSize: '9px', color: c ? '#a48f4e' : '#b3b0a6', padding: '4px 6px', textAlign: 'right', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {c ? c.name : 'Pin a city'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chartRows.map(row => (
                    <tr key={row.label} style={{ borderTop: '0.5px solid #E5E3DC' }}>
                      <td style={{ fontSize: '9px', color: '#6a7180', padding: '5px 6px', whiteSpace: 'nowrap' }}>{row.label}</td>
                      <td style={{ fontSize: '10px', color: '#1c2430', padding: '5px 6px', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.originVal}</td>
                      {row.txVals.map((val, ci) => {
                        const isEmpty = val === '—' && !pinnedCols[ci]
                        const isBetter = !isEmpty && (row.alwaysGreen === true || (row.better ? row.better(val, ci) : false))
                        return (
                          <td key={ci} style={{
                            fontSize: '10px',
                            color: isEmpty ? '#b3b0a6' : isBetter ? '#2f8f5b' : '#1c2430',
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
    </div>
  )

  // ──────────────────────────────────────────────────────────
  // Communities frame — metro pills + city list + preview card, ported verbatim
  // (Lifestyle/Financials panels that used to hang off this frame have moved to
  // the Adaptive Control Panel, so this frame is simpler than it was pre-rebuild).
  // ──────────────────────────────────────────────────────────
  // Brief 4 C2 — matches area: metro pills (re-parented from the removed communitiesFrame)
  // + the "Your Top Matches" hero-3 + a ranks 4-10 browse expander. Replaces the old
  // communitiesFrame (1-10 list + preview card). Buying Power + comparison stay in the navy
  // summary card (Brief 5). No save/persistence handler changed.
  const matchesArea = (
    <div style={{ marginBottom: '10px' }}>
      {/* Heading — region tabs + "Your Relocation Profile" moved up into the header band */}
      <p style={{ fontSize: '21px', fontWeight: 600, color: '#0A1E3D', margin: '0 0 4px' }}>Your Top Matches</p>
      <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 10px' }}>Click a card to see how it fits your money.</p>

      {/* Hero-3 — card body click FOCUSES (focusCity -> selectedKey, drives Buying Power +
          comparison); the report opens only via the deliberate "See summary report" link. */}
      {heroSlots.length === 0 ? (
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '16px' }}>
          <p style={{ fontSize: '12px', color: '#86868b', margin: 0 }}>No matches available yet.</p>
        </div>
      ) : (
        <>
          {rankChangeExplanation && (
            <div style={{ marginBottom: '10px' }}><RankChangeAlert message={rankChangeExplanation} /></div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
            {heroSlots.map((id, i) => {
              const match = findMatch(id)
              const cityLoc = match?.location ?? getAllCities().find(c => c.id === id)
              if (!cityLoc) return null
              const status = afStatus(cityLoc.housing.medianHomePrice)
              const badge = status === 'comfortable'
                ? { bg: 'rgba(47,143,91,0.13)', color: '#2f8f5b' }
                : status === 'moderate'
                ? { bg: 'rgba(185,130,43,0.14)', color: '#b9822b' }
                : { bg: 'rgba(181,72,47,0.13)', color: '#b5482f' }
              const isPinnedHero = pinnedCities.includes(cityLoc.id)
              const isFocused = cityLoc.id === effectiveSelectedKey
              const cityBalance = Math.max(0, cityLoc.housing.medianHomePrice - totalFunds)
              const cityRate = loanTerm === 15 ? Math.max(interestRate - 0.5, 2) : interestRate
              const cityMonthly = calcMonthly(cityBalance, cityRate, loanTerm)
              const comparePartner = getComparePartnerId(cityLoc.id)
              return (
                <div key={id} onClick={() => focusCity(cityLoc.id)}
                  className={`mm3-hero-card${isFocused ? ' sel' : ''}`}
                  style={{
                    background: '#fff', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
                    border: isFocused ? '1.5px solid #C5B783' : '0.5px solid rgba(0,0,0,0.1)',
                    boxShadow: isFocused ? '0 0 0 2px #C5B783, 0 8px 22px rgba(197,183,131,0.45)' : 'none',
                    display: 'flex', flexDirection: 'column',
                  }}>
                  {/* Photo + rank/pin/compare */}
                  <div style={{ height: '112px', position: 'relative', background: `linear-gradient(150deg, ${CARD_GRADIENTS[i % CARD_GRADIENTS.length][0]}, ${CARD_GRADIENTS[i % CARD_GRADIENTS.length][1]})`, display: 'flex', alignItems: 'flex-end', padding: '8px 10px' }}>
                    <Image
                      src={cityLoc.cityImageUrl ?? `/images/cities/${cityLoc.id}.jpg`}
                      alt={cityLoc.name} fill style={{ objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    <span style={{ position: 'absolute', top: '7px', left: '8px', fontSize: '10px', fontWeight: 600, color: '#fff', background: 'rgba(10,30,61,0.72)', padding: '3px 8px', borderRadius: '20px' }}>
                      {isPinnedHero ? '★ Pinned' : `Match ${i + 1}`}
                    </span>
                    <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px' }}>
                      {comparePartner && (
                        <button type="button" className="mm3-secondary-action" aria-label="Compare"
                          onClick={e => { e.stopPropagation(); setCompareCityId(cityLoc.id) }}
                          style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.9)', color: '#0A1E3D', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>
                          ⇄
                        </button>
                      )}
                      <button type="button" className="mm3-secondary-action" aria-label={isPinnedHero ? 'Unpin' : 'Pin'}
                        onClick={e => { e.stopPropagation(); isPinnedHero ? unpinCity(cityLoc.id) : pinCity(cityLoc.id) }}
                        disabled={!isPinnedHero && pinnedCities.length >= 3}
                        style={{
                          width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                          background: isPinnedHero ? '#C5B783' : 'rgba(255,255,255,0.9)', color: '#0A1E3D', fontSize: '13px',
                          cursor: (!isPinnedHero && pinnedCities.length >= 3) ? 'not-allowed' : 'pointer',
                          opacity: (!isPinnedHero && pinnedCities.length >= 3) ? 0.5 : 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
                        }}>
                        {isPinnedHero ? '★' : '☆'}
                      </button>
                    </div>
                    <p style={{ position: 'relative', margin: 0, fontSize: '16px', fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cityLoc.name}
                    </p>
                  </div>
                  {/* Body — match %, fit badge, median + monthly, See summary report */}
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '19px', fontWeight: 700, color: '#0A1E3D', lineHeight: 1 }}>
                        {match ? match.matchScore : '—'}<span style={{ fontSize: '11px', fontWeight: 500, color: '#86868b' }}>% match</span>
                      </span>
                      <span style={{ fontSize: '10.5px', fontWeight: 600, padding: '2px 7px', borderRadius: '10px', background: badge.bg, color: badge.color }}>
                        {afLabel(status)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#86868b', marginBottom: '7px' }}>
                      <span>Median <b style={{ color: '#1d1d1f', fontWeight: 600 }}>${cityLoc.housing.medianHomePrice.toLocaleString()}</b></span>
                      <span>~<b style={{ color: '#1d1d1f', fontWeight: 600 }}>${cityMonthly.toLocaleString()}</b>/mo</span>
                    </div>
                    <button type="button" className="mm3-report-link"
                      onClick={e => { e.stopPropagation(); if (match) openReport(match) }}
                      disabled={!match}
                      style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', fontSize: '10.5px', fontWeight: 500, color: '#0076B6', cursor: match ? 'pointer' : 'default' }}>
                      ▾ See summary report
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Split band (relocated) — "What Matters Most" (chips + Edit priorities) at ~3/4 left,
          the ranks 4-10 trigger at ~1/4 right; the ranks list expands FULL-WIDTH below the band.
          Reuses the existing chip derivation and browse rows verbatim; the only new behavior is
          the pencil's setOpenDrawer('lifestyle') (opens the Lifestyle drawer at the top —
          scroll-to-priorities deferred to the mobile-polish pass). */}
      <div style={{ marginTop: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (browseCities.length > 0 ? '3fr 1fr' : '1fr'), gap: '10px' }}>
          {/* Left ~3/4 — What Matters Most (chips + Edit priorities pencil) */}
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', color: '#6a7180', textTransform: 'uppercase', margin: 0 }}>What Matters Most</p>
              <button type="button" onClick={() => setOpenDrawer('lifestyle')} className="mm3-secondary-action" aria-label="Edit priorities"
                style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: '7px', padding: '4px 9px', fontSize: '11px', fontWeight: 500, color: '#0076B6', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                <Pencil size={12} style={{ flexShrink: 0 }} />{!isMobile && 'Edit priorities'}
              </button>
            </div>
            {(mustHaves.length > 0 || niceToHaves.length > 0) ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {mustHaves.slice(0, 3).map(key => {
                  const cat = DNA_CATEGORIES.find(c => c.key === key)
                  if (!cat) return null
                  const Icon = PRIORITY_ICONS[key]
                  return (
                    <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(197,183,131,0.18)', color: '#8a6f00', border: '0.5px solid rgba(197,183,131,0.4)', borderRadius: '12px', padding: '3px 9px', fontSize: '11px' }}>
                      <Icon size={11} style={{ flexShrink: 0 }} />{cat.label}
                    </span>
                  )
                })}
                {niceToHaves.slice(0, 3).map(key => {
                  const cat = DNA_CATEGORIES.find(c => c.key === key)
                  if (!cat) return null
                  const Icon = PRIORITY_ICONS[key]
                  return (
                    <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#F2F1EE', color: '#1c2430', border: '0.5px solid #dcdad2', borderRadius: '12px', padding: '3px 9px', fontSize: '11px' }}>
                      <Icon size={11} style={{ flexShrink: 0 }} />{cat.label}
                    </span>
                  )
                })}
              </div>
            ) : (
              <p style={{ fontSize: '11px', color: '#86868b', margin: 0 }}>No priorities set yet — tap Edit priorities to set them.</p>
            )}
          </div>

          {/* Right ~1/4 — ranks 4-10 trigger */}
          {browseCities.length > 0 && (
            <button type="button" onClick={() => setShowAllCities(v => !v)}
              style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '12px 14px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A1E3D' }}>See your other ranked cities</span>
                <span style={{ display: 'block', fontSize: '11px', color: '#86868b', marginTop: '1px' }}>the next {browseCities.length} — ranks 4–{3 + browseCities.length}</span>
              </span>
              <span style={{ fontSize: '13px', color: '#C5B783', flexShrink: 0, transform: showAllCities ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }}>▸</span>
            </button>
          )}
        </div>

        {/* Full-width expanded ranks 4-10 list — sibling below the band (browse rows verbatim) */}
        {showAllCities && browseCities.length > 0 && (
          <div style={{ marginTop: '10px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            <p style={{ fontSize: '11px', color: '#86868b', padding: '10px 16px 2px', margin: 0 }}>Tap any to focus it; pin one to pull it into your Top Matches.</p>
              {browseCities.map(match => {
                const city = match.location
                const isPinned = pinnedCities.includes(city.id)
                const isFocused = city.id === effectiveSelectedKey
                const status = afStatus(city.housing.medianHomePrice)
                const rank = rankedCities.findIndex(m => m.location.id === city.id) + 1
                const cityBalance = Math.max(0, city.housing.medianHomePrice - totalFunds)
                const cityRate = loanTerm === 15 ? Math.max(interestRate - 0.5, 2) : interestRate
                const cityMonthly = calcMonthly(cityBalance, cityRate, loanTerm)
                return (
                  <div key={city.id} onClick={() => focusCity(city.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px',
                      borderTop: '0.5px solid #F0EEE9', cursor: 'pointer',
                      background: isFocused ? '#F0F3F8' : isPinned ? '#FEFDF8' : 'transparent',
                    }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#86868b', width: '22px', flexShrink: 0 }}>#{rank}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city.name}</p>
                      <p style={{ fontSize: '11px', color: '#86868b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city.metroUsed}</p>
                    </div>
                    <span style={{ fontSize: '12px', color: '#86868b', whiteSpace: 'nowrap', flexShrink: 0 }}>~${cityMonthly.toLocaleString()}/mo</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A1E3D', flexShrink: 0 }}>{match.matchScore}%</span>
                    <button type="button" className="mm3-secondary-action"
                      onClick={e => { e.stopPropagation(); isPinned ? unpinCity(city.id) : pinCity(city.id) }}
                      disabled={!isPinned && pinnedCities.length >= 3}
                      style={{
                        fontSize: '10px', color: isPinned ? '#0A1E3D' : '#0076B6', flexShrink: 0,
                        padding: '3px 8px', borderRadius: '8px',
                        border: isPinned ? '0.5px solid rgba(197,183,131,0.5)' : '0.5px solid #C8E0F5',
                        background: isPinned ? '#C5B783' : '#F0F7FF',
                        cursor: (!isPinned && pinnedCities.length >= 3) ? 'not-allowed' : 'pointer',
                        opacity: isPinned ? 1 : (pinnedCities.length >= 3 ? 0.4 : 1),
                        fontFamily: 'inherit',
                      }}>
                      {isPinned ? '★ Pinned' : 'Pin'}
                    </button>
                    {getComparePartnerId(city.id) && (
                      <button type="button" className="mm3-secondary-action"
                        onClick={e => { e.stopPropagation(); setCompareCityId(city.id) }}
                        style={{ fontSize: '10px', color: '#0A1E3D', flexShrink: 0, padding: '3px 8px', borderRadius: '8px', border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Compare
                      </button>
                    )}
                    <button type="button" className="mm3-secondary-action"
                      onClick={e => { e.stopPropagation(); removeCity(city.id) }}
                      style={{ fontSize: '10px', color: '#9a9a9a', flexShrink: 0, padding: '3px 8px', borderRadius: '8px', border: '0.5px solid rgba(0,0,0,0.12)', background: 'rgba(0,0,0,0.03)', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Remove
                    </button>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Removed-from-view restore (preserved from the old communities list) */}
      {removedCities.length > 0 && (
        <div style={{ textAlign: 'center', padding: '8px', fontSize: '10px', color: '#9a9a9a' }}>
          {removedCities.length} removed from view —{' '}
          <span onClick={() => setRemovedCities([])} style={{ color: '#0076B6', cursor: 'pointer' }}>Restore all</span>
        </div>
      )}
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
    { key: 'crimeSafety', label: 'High crime / safety concerns', help: 'Excludes communities with a Higher Risk safety rating.' },
    { key: 'notWalkable', label: 'Poor Walkability', help: 'Excludes communities with low walkability scores.' },
    { key: 'medicalAccess', label: 'Limited nearby medical care', help: 'Excludes communities with low healthcare-access scores.' },
  ]
  // Revision — per-section active counts for the split Limits drawer (display only; the
  // "Anything else" MD note is deliberately not counted in either section).
  const ruleOutSetCount = [
    nonNegotiables.hoaStrict, nonNegotiables.crimeSafety, nonNegotiables.notWalkable, nonNegotiables.medicalAccess,
  ].filter(Boolean).length
  const minStandardsSetCount = [
    nonNegotiables.schoolMinGrade != null, nonNegotiables.propertyTaxMaxPct != null,
  ].filter(Boolean).length
  const helpIconStyle: React.CSSProperties = {
    fontSize: '9px', color: '#86868b', border: '0.5px solid #D0CEC8', borderRadius: '50%',
    width: '13px', height: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'default', flexShrink: 0,
  }

  const nonNegotiablesSection = (
    <div style={{ padding: '14px 18px' }}>
      {/* Drawer-polish — always-expanded (prototype has no collapse); restyled to .nn rows.
          Handlers (updateNonNegotiables / setNonNegotiables / debounceSavePriorities) unchanged. */}
      {/* Section 1 — Rule Out (dealbreaker toggles) */}
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0A1E3D', margin: '0 0 2px' }}>
        Rule Out{ruleOutSetCount > 0 && <span style={{ fontWeight: 400, color: '#6a7180' }}> · {ruleOutSetCount} set</span>}
      </p>
      <p style={{ fontSize: '11px', color: '#6a7180', margin: '0 0 8px', lineHeight: 1.5 }}>Turn on any dealbreaker — we&rsquo;ll hide communities that have it.</p>

      {nonNegItems.map(item => (
        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #E5E3DC', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <span style={{ fontSize: '12.5px', color: '#1c2430' }}>{item.label}</span>
            <span title={item.help} style={helpIconStyle}>?</span>
          </div>
          <NonNegToggle active={nonNegotiables[item.key]} onClick={() => updateNonNegotiables({ [item.key]: !nonNegotiables[item.key] })} />
        </div>
      ))}

      {/* Section 2 — Minimum Standards (threshold dropdowns) */}
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0A1E3D', margin: '18px 0 2px' }}>
        Minimum Standards{minStandardsSetCount > 0 && <span style={{ fontWeight: 400, color: '#6a7180' }}> · {minStandardsSetCount} set</span>}
      </p>
      <p style={{ fontSize: '11px', color: '#6a7180', margin: '0 0 8px', lineHeight: 1.5 }}>Set the bars a community has to meet.</p>

      {/* School rating threshold — .nn + .thresh */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #E5E3DC', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <span style={{ fontSize: '12.5px', color: '#1c2430' }}>Minimum school rating</span>
          <span title="Excludes communities whose TEA school rating is below your chosen minimum." style={helpIconStyle}>?</span>
        </div>
        <select value={nonNegotiables.schoolMinGrade ?? ''}
          onChange={e => updateNonNegotiables({ schoolMinGrade: (e.target.value || null) as NonNegotiablesState['schoolMinGrade'] })}
          style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '7px', border: '1px solid #dcdad2', fontFamily: 'inherit', background: '#fff', color: '#1c2430', flexShrink: 0 }}>
          <option value="">No minimum</option>
          <option value="A">A or better</option>
          <option value="B">B or better</option>
          <option value="C">C or better</option>
          <option value="D">D or better</option>
        </select>
      </div>

      {/* Property tax threshold — .nn + .thresh */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #E5E3DC', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <span style={{ fontSize: '12.5px', color: '#1c2430' }}>Maximum property tax rate</span>
          <span title="Excludes communities whose property tax rate is above your chosen maximum." style={helpIconStyle}>?</span>
        </div>
        <select value={nonNegotiables.propertyTaxMaxPct ?? ''}
          onChange={e => updateNonNegotiables({ propertyTaxMaxPct: e.target.value ? parseFloat(e.target.value) : null })}
          style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '7px', border: '1px solid #dcdad2', fontFamily: 'inherit', background: '#fff', color: '#1c2430', flexShrink: 0 }}>
          <option value="">No maximum</option>
          <option value="0.015">Under 1.5%</option>
          <option value="0.02">Under 2.0%</option>
          <option value="0.025">Under 2.5%</option>
        </select>
      </div>

      {/* Anything else — MD-context note only (.mdnote), never touches filtering */}
      <div style={{ marginTop: '12px' }}>
        <p style={{ fontSize: '11px', color: '#0076B6', fontStyle: 'italic', margin: '0 0 4px' }}>Anything else? Shared with your Market Director — doesn&rsquo;t affect matching.</p>
        <textarea value={nonNegotiables.anythingElse}
          onChange={e => setNonNegotiables(prev => ({ ...prev, anythingElse: e.target.value }))}
          onBlur={() => debounceSavePriorities(mustHaves, niceToHaves, notPriorities, unassigned, nonNegotiables)}
          rows={2}
          style={{ width: '100%', fontSize: '12px', padding: '7px 9px', borderRadius: '7px', border: '1px solid #dcdad2', fontFamily: 'inherit', resize: 'vertical', color: '#1c2430' }} />
      </div>
    </div>
  )

  // Brief 3 — Ask Amy launcher is present per the prototype. Part 1 (Ask Amy shell) replaces
  // the old inline placeholder with the self-contained <AmyPanel> (right-side panel / mobile
  // sheet). Curated Q&A + glossary + MD handoff + logging land in Part 2.

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
        .mm3-help { position: relative; border-bottom: 1px dotted #a9a69c; cursor: help; }
        .mm3-help-tip { position: absolute; left: 0; top: calc(100% + 7px); width: 220px; background: #0A1E3D; color: #fff; font-size: 11px; font-weight: 400; line-height: 1.5; padding: 9px 11px; border-radius: 9px; box-shadow: 0 8px 20px rgba(10,30,61,0.28); opacity: 0; visibility: hidden; transform: translateY(-3px); transition: opacity 0.15s, transform 0.15s; z-index: 40; pointer-events: none; }
        .mm3-help:hover .mm3-help-tip { opacity: 1; visibility: visible; transform: none; }
        .mm3-finzone { display: grid; grid-template-columns: 1.55fr 1fr; gap: 16px; align-items: start; }
        @media (max-width: 1080px) { .mm3-finzone { grid-template-columns: 1fr; } }
        /* Brief 7B — Review CTA card-like response (navy fill, gold text) */
        .mm3-review-cta { transition: background 0.18s, box-shadow 0.18s, transform 0.12s; }
        .mm3-review-cta:not(:disabled):hover { background: #0d284f !important; box-shadow: 0 4px 14px rgba(10,30,61,0.28); transform: translateY(-1px); }
        .mm3-review-cta:not(:disabled):active { transform: translateY(0) scale(0.985); }
        /* Brief 7B — hero card hover (border + shadow, NO lift); selected cards keep their gold ring */
        .mm3-hero-card { transition: border-color 0.16s, box-shadow 0.16s; }
        .mm3-hero-card:not(.sel):hover { border-color: #c3c0b6 !important; box-shadow: 0 4px 14px rgba(10,30,61,0.09) !important; }
        /* Brief 7B — "See summary report" underline on hover */
        .mm3-report-link:not(:disabled):hover { text-decoration: underline; }
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

      {/* Brief 6 C1 — "Confirm your choices" review summary. Honest framing: this is what
          the Market Director reviews at the consultation; nothing is sent or emailed here. */}
      {summaryOpen && (() => {
        const labelsFor = (keys: (keyof DNAScores)[]): string[] =>
          keys.map(k => DNA_CATEGORIES.find(c => c.key === k)?.label).filter((l): l is string => Boolean(l))
        const mustLabels = labelsFor(mustHaves)
        const impLabels = labelsFor(niceToHaves)
        const niceLabels = labelsFor(notPriorities)
        const moneyRows: [string, string][] = [
          ['Household income', incomeDisplay || (incomeVal ? fmtCurrency(String(incomeVal)) : '—')],
          ['Toward down payment', totalFunds > 0 ? `${fmtK(totalFunds)}${isSelling ? ' (incl. home-sale proceeds)' : ''}` : '—'],
          ['Rate · term (assumed)', `${interestRate}% · ${loanTerm} yr`],
          ['Est. monthly', refMonthly > 0 ? `$${refMonthly.toLocaleString()}/mo` : '—'],
        ]
        const perRows: [string, number][] = [
          ['Established ↔ Up-and-coming', personalityPreference.growthProfile],
          ['Practical ↔ Upscale', personalityPreference.lifestyleOrientation],
          ['Urban ↔ Rural', personalityPreference.environment],
          ['Relaxed ↔ Fast-paced', personalityPreference.pace],
        ]
        const nnActive: string[] = []
        if (nonNegotiables.crimeSafety) nnActive.push('Safe communities')
        if (nonNegotiables.notWalkable) nnActive.push('Walkable')
        if (nonNegotiables.medicalAccess) nnActive.push('Near medical care')
        if (nonNegotiables.schoolMinGrade) nnActive.push(`Schools ${nonNegotiables.schoolMinGrade}+`)
        if (nonNegotiables.propertyTaxMaxPct) nnActive.push(`Property tax ≤ ${(nonNegotiables.propertyTaxMaxPct * 100).toFixed(1)}%`)
        if (nonNegotiables.hoaStrict) nnActive.push('No strict HOA (MD note)')
        const secH: React.CSSProperties = { margin: '0 0 9px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#a48f4e' }
        const chip: React.CSSProperties = { background: '#EFEEE9', border: '1px solid #dcdad2', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', color: '#1c2430' }
        return (
          <div onClick={() => setSummaryOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(10,30,61,0.58)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflowY: 'auto' }}>
            <div onClick={e => e.stopPropagation()}
              style={{ background: '#fff', width: '100%', maxWidth: '620px', maxHeight: '88vh', overflowY: 'auto', borderRadius: '16px', boxShadow: '0 30px 80px rgba(10,30,61,0.4)' }}>
              <div style={{ background: 'linear-gradient(120deg,#0A1E3D,#0d284f)', color: '#fff', padding: '20px 24px' }}>
                <h2 style={{ margin: '0 0 4px', fontSize: '19px', fontWeight: 600 }}>Review your relocation summary</h2>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#c7d2e2', lineHeight: 1.5 }}>
                  This is what your Market Director will review with you at your consultation. Take a look, then confirm.
                </p>
              </div>
              <div style={{ padding: '20px 24px' }}>
                {/* MM3 Brief 1 (B1-blend) — archetype "why you're moving" line folded in from the
                    removed read-only profile popup; reuses secH + archetypeInfo (no rebuild). */}
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={secH}>Why you&rsquo;re moving</h4>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1E3D', margin: '0 0 3px' }}>{archetypeInfo.label}</p>
                  <p style={{ fontSize: '12px', color: '#6a7180', lineHeight: 1.5, margin: 0 }}>{archetypeInfo.why}</p>
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={secH}>Your top matches</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {heroSlots.map((id, i) => {
                      const m = findMatch(id)
                      const loc = m?.location ?? getAllCities().find(c => c.id === id)
                      if (!loc) return null
                      const st = afStatus(loc.housing.medianHomePrice)
                      return (
                        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F5F4F1', borderRadius: '10px', padding: '9px 12px', fontSize: '13px', gap: '10px' }}>
                          <span><b style={{ color: '#0A1E3D' }}>{loc.name}</b> · {loc.metroUsed} <span style={{ color: '#6a7180' }}>({pinnedCities.includes(loc.id) ? 'pinned' : `match ${i + 1}`})</span></span>
                          <span style={{ color: '#0A1E3D', fontWeight: 600, whiteSpace: 'nowrap' }}>{m ? `${m.matchScore}% · ` : ''}{afLabel(st)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={secH}>Your money picture</h4>
                  {moneyRows.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #E5E3DC' }}>
                      <span style={{ color: '#6a7180' }}>{k}</span>
                      <span style={{ color: '#1c2430', fontWeight: 500, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={secH}>What matters most</h4>
                  {([['Top priority', mustLabels], ['Really matters', impLabels], ['Nice to have', niceLabels]] as [string, string[]][]).map(([tier, labels]) => (
                    <div key={tier} style={{ marginBottom: '8px' }}>
                      <p style={{ fontSize: '11px', color: '#6a7180', margin: '0 0 4px' }}>{tier}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {labels.length ? labels.map(l => <span key={l} style={chip}>{l}</span>) : <span style={{ ...chip, color: '#6a7180' }}>none set</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 0 }}>
                  <h4 style={secH}>Feel &amp; limits</h4>
                  <div style={{ marginBottom: '10px' }}>
                    {perRows.map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', fontSize: '12.5px', padding: '3px 0' }}>
                        <span style={{ color: '#6a7180' }}>{label}</span>
                        <span style={{ color: '#1c2430', fontWeight: 500 }}>{val}/10</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '11px', color: '#6a7180', margin: '0 0 4px' }}>Limits</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {nnActive.length ? nnActive.map(n => <span key={n} style={chip}>{n}</span>) : <span style={{ ...chip, color: '#6a7180' }}>none set</span>}
                  </div>
                  <p style={{ fontSize: '11px', color: '#6a7180', margin: 0 }}>
                    Compared against <b style={{ color: '#1c2430' }}>{originCity ?? 'your origin'}</b> — the full side-by-side is on the page.
                  </p>
                </div>
              </div>
              <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid #dcdad2', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <button type="button" onClick={() => setSummaryOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#6a7180', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Keep editing</button>
                <button type="button" onClick={() => { setConfirmed(true); setReconfirmNudge(false); setSummaryOpen(false) }}
                  style={{ background: '#C5B783', color: '#0A1E3D', border: 'none', borderRadius: '10px', padding: '11px 20px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Confirm &amp; continue →</button>
              </div>
            </div>
          </div>
        )
      })()}

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
      <div style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: isMobile ? 'column' : 'row', minHeight: '100%', overflowX: 'hidden' }}>

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

        {/* ── SUMMONED DRAWER (Refine) — desktop only; push model (flex sibling, never overlays).
             Opens for lifestyle/financials/nonneg only; 'guide' (Ask Amy) has its own right-side
             panel after the canvas, so this left drawer stays closed for it (leftDrawerOpen). ── */}
        {!isMobile && (
          <aside style={{
            flexShrink: 0,
            flexBasis: leftDrawerOpen ? '404px' : '0px', width: leftDrawerOpen ? '404px' : '0px',
            background: '#fff', overflow: 'hidden',
            borderRight: leftDrawerOpen ? '0.5px solid rgba(0,0,0,0.1)' : 'none',
            transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), flex-basis 0.28s cubic-bezier(0.4,0,0.2,1)',
            position: 'sticky', top: 0, alignSelf: 'stretch',
            display: 'flex', flexDirection: 'column',
          }}>
            {openDrawer && openDrawer !== 'guide' && (
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
                </div>
              </div>
            )}
          </aside>
        )}

        {/* ── RESULTS CANVAS (Living Ledger) — full width on mobile ── */}
        <div style={{ flex: 1, background: '#F2F1EE', minWidth: 0, padding: '16px', overflowY: 'auto', paddingBottom: isMobile ? '132px' : '16px' }}>
          {/* MM3 Brief 1 — centered content wrapper (prototype .cwrap). The #F2F1EE canvas keeps
              flex-filling edge-to-edge; this inner wrapper caps the content at ~1240px and centers
              it, so wide/ultra-wide desktops get balanced margins instead of an edge-to-edge stretch.
              max-width only caps (never forces width), so with a drawer open the canvas narrows and
              the content simply re-centers/fills the remaining space — no overflow, no h-scroll. */}
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {/* MM3 header restructure — the header band (intro + region tabs + relocation
              profile + stacked gated CTAs) replaces the old sticky navy ctaBlock. Desktop:
              sticky at the top of this scroll column (opaque canvas bg so content scrolls
              cleanly under it), keeping the CTAs permanently visible per Craig's "not
              scrolling out of view" requirement. Mobile: renders inline above the matches;
              its two CTAs live in the fixed bottom bar instead. */}
          {!isMobile ? (
            <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#F2F1EE' }}>
              {headerBand}
            </div>
          ) : (
            headerBand
          )}
          {/* Brief 4 C2 — matches area (Your Top Matches hero-3 + browse expander) on top,
              then the financial summary card below (Buying Power + comparison stay per Brief 5;
              the hero-3 was lifted out of it into here). */}
          {matchesArea}
          {livingLedgerSummaryCard}
          </div>
        </div>

        {/* ── ASK AMY PANEL — desktop only; dedicated RIGHT-side push panel (Part 1 shell).
             Reuses openDrawer==='guide' (amyDrawerOpen) for mutual exclusivity with the Refine
             drawers, but renders AFTER the canvas so it slides in from the right and pushes the
             match field toward center. Same invariant as the left drawer: the canvas (flex:1,
             min-width:0) shrinks by exactly this panel's width and the row's overflowX:hidden
             clips any transient, so the panel can never cause horizontal page scroll. */}
        {!isMobile && (
          <aside aria-label="Ask Amy" style={{
            flexShrink: 0,
            flexBasis: amyDrawerOpen ? '404px' : '0px', width: amyDrawerOpen ? '404px' : '0px',
            background: '#fff', overflow: 'hidden',
            borderLeft: amyDrawerOpen ? '0.5px solid rgba(0,0,0,0.1)' : 'none',
            transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), flex-basis 0.28s cubic-bezier(0.4,0,0.2,1)',
            position: 'sticky', top: 0, alignSelf: 'stretch',
            display: 'flex', flexDirection: 'column',
          }}>
            {amyDrawerOpen && (
              <div style={{ width: '404px', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <AmyPanel onClose={() => setOpenDrawer(null)} />
              </div>
            )}
          </aside>
        )}
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
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => { setReconfirmNudge(false); setSummaryOpen(true) }} disabled={!hasPinnedCity}
                  style={{
                    flex: 1, background: confirmed ? 'rgba(197,183,131,0.18)' : 'transparent',
                    color: hasPinnedCity ? '#C5B783' : 'rgba(197,183,131,0.4)',
                    border: `1px solid ${hasPinnedCity ? '#C5B783' : 'rgba(197,183,131,0.3)'}`,
                    borderRadius: '8px', padding: '11px', fontWeight: 600, fontSize: '12px',
                    cursor: hasPinnedCity ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                  }}>
                  {confirmed ? '✓ Confirmed' : 'Review & confirm'}
                </button>
                <button type="button" onClick={handleCommit} disabled={committing || !confirmed}
                  style={{
                    flex: 1, background: confirmed ? '#C5B783' : '#2a3d5c', color: confirmed ? '#0A1E3D' : '#8194ad',
                    border: 'none', borderRadius: '8px', padding: '11px', fontWeight: 600, fontSize: '12px',
                    cursor: (committing || !confirmed) ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  }}>
                  {!confirmed && <Lock size={11} style={{ flexShrink: 0 }} />}
                  {committing ? 'Saving…' : (confirmed ? 'Schedule →' : 'Schedule')}
                </button>
              </div>
              {!ctaError && !hasPinnedCity && (
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '5px 0 0', lineHeight: 1.4 }}>
                  Pin a community to confirm.
                </p>
              )}
              {!ctaError && hasPinnedCity && reconfirmNudge && !confirmed && (
                <p style={{ fontSize: '9px', color: '#C5B783', textAlign: 'center', margin: '5px 0 0', lineHeight: 1.4 }}>
                  Choices changed — reconfirm.
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
                {/* Ask Amy brings its own avatar header (AmyPanel); the shared sheet header is
                    suppressed for 'guide' so Amy reads as her own space, not a Refine drawer. */}
                {openDrawer !== 'guide' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 0' }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>
                      {openDrawer === 'financials' && advancedAssumptionsOpen ? 'Advanced Assumptions' : DRAWER_META[openDrawer].title}
                    </p>
                    <button type="button" onClick={() => { setOpenDrawer(null); setAdvancedAssumptionsOpen(false) }}
                      style={{ fontSize: '13px', color: '#86868b', background: 'none', border: 'none', cursor: 'pointer' }}>
                      ✕ Close
                    </button>
                  </div>
                )}
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
                {openDrawer === 'guide' && <AmyPanel onClose={() => { setOpenDrawer(null); setAdvancedAssumptionsOpen(false) }} />}
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
