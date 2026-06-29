'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CityMatch, UserProfile, UserSession, SandboxProfile, DNAScores } from '../../../types'
import FullReport from '../../results/FullReport'
import { DNA_CATEGORIES } from '../../../utils/constants'
import { getAllCities } from '../../../services/locationService'
import { getTopMatches } from '../../../services/matchingService'
import { createClient } from '../../../lib/supabase/client'

const ALL_KEYS = DNA_CATEGORIES.map(c => c.key) as (keyof DNAScores)[]

const RATE_DEFAULT = 6.5
const RATE_MARKET_AVG = 6.53

const METRO_FILTERS = [
  { label: 'All Texas', value: 'State' },
  { label: 'Austin',     value: 'Austin' },
  { label: 'DFW',        value: 'Dallas' },
  { label: 'Houston',    value: 'Houston' },
  { label: 'San Antonio', value: 'San Antonio' },
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
  return 108 // Austin / default
}

function txClimate(metro: string): string {
  if (metro.includes('Houston')) return 'Hot/humid'
  return 'Warm/sunny'
}

function txSafety(score: number): string {
  if (score >= 8) return 'Very low'
  if (score >= 6) return 'Low'
  if (score >= 4) return 'Moderate'
  return 'Higher risk'
}

function parseHomePrice(s: string): number {
  // Parses "$825K" or "$1.2M" to a number
  const clean = s.replace(/[$,]/g, '')
  if (clean.endsWith('M')) return parseFloat(clean) * 1_000_000
  if (clean.endsWith('K')) return parseFloat(clean) * 1_000
  return parseFloat(clean) || 0
}

function schoolGrade(r: string): number {
  const map: Record<string, number> = { 'A+': 13, 'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 'C': 6, 'C-': 5, 'D': 4, 'F': 3 }
  return map[r] ?? 0
}

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

  const commSectionRef = useRef<HTMLDivElement>(null)
  const priorityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const incomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load DB state
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s?.user?.email) return
      const { data } = await supabase
        .from('users')
        .select('sandbox_committed,sandbox_profile,chosen_communities,home_status,exact_home_proceeds,available_funds,annual_income_override,loan_term_preference,origin_city,origin_state')
        .eq('email', s.user.email.toLowerCase())
        .maybeSingle()
      if (!data) return

      if (data.sandbox_committed) { onAdvanceToConnect(); return }

      if (data.home_status === 'selling') setIsSelling(true)

      if (data.sandbox_profile) {
        const sp: SandboxProfile = data.sandbox_profile
        if (sp.mustHaves?.length) setMustHaves(sp.mustHaves)
        if (sp.niceToHaves?.length) setNiceToHaves(sp.niceToHaves)
        if (sp.notPriorities?.length) setNotPriorities(sp.notPriorities)
        if (sp.unassigned !== undefined) setUnassigned(sp.unassigned)
        if (sp.interestRateOverride) setInterestRate(sp.interestRateOverride)
        setSandboxTouched(true)
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
      if (data.origin_city) setOriginCity(data.origin_city)
      if (data.origin_state) setOriginState(data.origin_state)
    }
    load()
  }, [onAdvanceToConnect])

  // Seed from profile
  useEffect(() => {
    if (!profile) return
    if (mustHaves.length === 0 && profile.mustHaves?.length > 0) {
      setMustHaves(profile.mustHaves)
      const used = new Set([...profile.mustHaves, ...(profile.niceToHaves ?? []), ...(profile.notPriorities ?? [])])
      setNiceToHaves(profile.niceToHaves ?? [])
      setNotPriorities(profile.notPriorities ?? [])
      setUnassigned(ALL_KEYS.filter(k => !used.has(k)))
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
    personalityPreference: profile?.personalityPreference ?? { growthProfile: 5, pace: 5, culture: 5, environment: 5, lifestyleOrientation: 5 },
  }

  const activeProfile = (!sandboxTouched && profile) ? profile : sandboxProfile

  const metroCities = selectedMetro === 'State'
    ? getAllCities()
    : getAllCities().filter(c => c.metroUsed.includes(selectedMetro))

  const { topMatches: rankedCities } = getTopMatches(activeProfile, metroCities, 20, 'hard')

  // Affordability — brief formula: full price / (income/12 × 0.28)
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

  // Buying power monthly estimate (first pinned city or $385K reference)
  const refCityData = getAllCities().find(c => c.id === pinnedCities[0])
  const refPrice = refCityData?.housing.medianHomePrice ?? 385000
  const refBalance = Math.max(0, refPrice - totalFunds)
  const refRate = loanTerm === 15 ? Math.max(interestRate - 0.5, 2) : interestRate
  const refMonthly = calcMonthly(refBalance, refRate, loanTerm)

  // Helpers
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

    // Cap Must Have at 3
    if (inNH && direction === 'up' && mustHaves.length >= 3) {
      setMustHaveError(true)
      setTimeout(() => setMustHaveError(false), 3000)
      return
    }

    let newMH = mustHaves.filter(k => k !== key)
    let newNH = niceToHaves.filter(k => k !== key)
    let newNP = notPriorities.filter(k => k !== key)
    let newUA = unassigned.filter(k => k !== key)

    if (inMH && direction === 'down') newNH = [...newNH, key]
    else if (inNH && direction === 'up') newMH = [...newMH, key]
    else if (inNH && direction === 'down') newNP = [...newNP, key]
    else newNH = [...newNH, key] // less/unassigned always goes to nice

    setMustHaves(newMH); setNiceToHaves(newNH); setNotPriorities(newNP); setUnassigned(newUA)
    debounceSavePriorities(newMH, newNH, newNP, newUA)
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

      {/* Two-panel layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: '100vh' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          width: '220px', flexShrink: 0,
          background: '#0A1E3D',
          padding: '20px 16px',
          display: 'flex', flexDirection: 'column', gap: '18px',
          position: 'sticky', top: 0, height: '100vh',
          overflowY: 'auto', alignSelf: 'flex-start',
        }}>
          {/* Label */}
          <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', color: '#C5B783', textTransform: 'uppercase', margin: 0 }}>
            Your Direction
          </p>

          {/* City slots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {[0, 1, 2].map(i => {
              const cityId = pinnedCities[i]
              const match = cityId ? findMatch(cityId) : undefined
              const cityLoc = match?.location ?? (cityId ? getAllCities().find(c => c.id === cityId) : undefined)
              const status = cityLoc ? afStatus(cityLoc.housing.medianHomePrice) : null

              if (cityLoc) {
                return (
                  <div key={cityId} style={{
                    background: 'rgba(197,183,131,0.12)',
                    border: '0.5px solid rgba(197,183,131,0.3)',
                    borderRadius: '8px', padding: '10px 11px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <p style={{ fontSize: '13px', color: '#fff', fontWeight: 500, margin: 0, lineHeight: 1.2 }}>{cityLoc.name}</p>
                      <button type="button" onClick={() => {
                        setSelectedCityId(cityId)
                        commSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }} style={{ fontSize: '10px', color: '#C5B783', cursor: 'pointer', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', textUnderlineOffset: '2px', flexShrink: 0, marginLeft: '6px' }}>
                        Report →
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: afColor(status!), flexShrink: 0 }} />
                      <span style={{ fontSize: '10px', color: afColor(status!) }}>{afLabel(status!)}</span>
                      {match && <span style={{ fontSize: '11px', color: '#C5B783', marginLeft: 'auto' }}>{match.matchScore}%</span>}
                    </div>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: '3px 0 0' }}>{cityLoc.metroUsed}</p>
                  </div>
                )
              }

              return (
                <div key={i} style={{
                  border: '0.5px dashed rgba(255,255,255,0.14)',
                  borderRadius: '8px', padding: '10px 11px',
                }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic', margin: 0 }}>
                    Pin a community →
                  </p>
                </div>
              )
            })}
          </div>

          {/* What matters most */}
          {mustHaves.length > 0 && (
            <div>
              <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 7px' }}>
                What matters most
              </p>
              {mustHaves.slice(0, 3).map((key, i) => {
                const cat = DNA_CATEGORIES.find(c => c.key === key)
                if (!cat) return null
                return (
                  <div key={key} style={{
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: '16px', padding: '5px 10px',
                    fontSize: '11px', color: 'rgba(255,255,255,0.7)',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginBottom: '4px',
                  }}>
                    <span style={{ fontSize: '9px', color: '#C5B783', fontWeight: 700, width: '12px' }}>{i + 1}</span>
                    <span>{cat.icon}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.label}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Sub-section 1 — Buying power */}
          <div style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
            <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 6px' }}>Buying Power</p>
            <p style={{ fontSize: '18px', fontWeight: 500, color: '#fff', margin: '0 0 3px' }}>
              {totalFunds > 0 ? fmtK(totalFunds) : '—'}
            </p>
            {totalFunds > 0 && (
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, margin: 0 }}>
                {isSelling && proceedsNum > 0 ? fmtK(proceedsNum) + ' proceeds' : ''}
                {isSelling && proceedsNum > 0 && savingsNum > 0 ? ' + ' : ''}
                {savingsNum > 0 ? fmtK(savingsNum) + ' savings' : ''}
              </p>
            )}
          </div>

          {/* Sub-section 2 — Monthly estimate + rate slider */}
          <div style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
            <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 6px' }}>Monthly Estimate</p>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#C5B783', margin: '0 0 1px' }}>
              {refMonthly > 0 ? `$${refMonthly.toLocaleString()}/mo` : '—'}
            </p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, margin: '0 0 8px' }}>
              Principal + interest · {loanTerm}yr
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Interest rate</span>
              <span style={{ fontSize: '10px', color: '#C5B783', fontWeight: 500 }}>{interestRate}%</span>
            </div>
            {/* Custom rate slider with green market band */}
            <div style={{ position: 'relative', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', margin: '6px 0' }}>
              <div style={{ position: 'absolute', height: '100%', background: '#34C759', opacity: 0.7, borderRadius: '2px', left: '46.4%', width: '7.1%' }} />
              <input
                type="range" min={3} max={10} step={0.25} value={interestRate}
                onChange={e => { setSandboxTouched(true); setInterestRate(parseFloat(e.target.value)) }}
                style={{ position: 'absolute', top: '-6px', left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '16px' }}
              />
              <div style={{
                position: 'absolute', width: '14px', height: '14px',
                background: '#C5B783', borderRadius: '50%', top: '-5px',
                left: `calc(${(interestRate - 3) / 7 * 100}% - 7px)`,
                pointerEvents: 'none', transition: 'left 0.1s',
              }} />
            </div>
            <p style={{ fontSize: '9px', color: '#34C759', opacity: 0.8, margin: '3px 0 0' }}>● Current market: 6.25%–6.75%</p>
          </div>

          {/* Sub-section 3 — Annual income */}
          <div style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
            <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 6px' }}>Annual Income</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', color: '#fff' }}>
                {incomeDisplay || (profile?.annualIncome ? fmtCurrency(String(profile.annualIncome)) : '—')}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>household</span>
            </div>
          </div>

          {/* Sub-section 4 — Affordability by community */}
          <div>
            <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 6px' }}>Affordability by Community</p>
            {pinnedCities.length === 0 ? (
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', margin: 0 }}>
                Pin communities to see affordability
              </p>
            ) : pinnedCities.map(cityId => {
              const cd = getAllCities().find(c => c.id === cityId)
              if (!cd) return null
              const s = afStatus(cd.housing.medianHomePrice)
              return (
                <div key={cityId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '6px' }}>{cd.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: afColor(s) }} />
                    <span style={{ fontSize: '10px', color: afColor(s) }}>{afLabel(s)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 'auto' }}>
            <button
              type="button" onClick={handleCommit} disabled={committing}
              style={{
                width: '100%', background: '#C5B783', color: '#0A1E3D',
                border: 'none', borderRadius: '8px', padding: '11px',
                fontSize: '12px', fontWeight: 700,
                cursor: committing ? 'not-allowed' : 'pointer',
                opacity: committing ? 0.7 : 1,
              }}
            >
              {committing ? 'Saving…' : 'Schedule a Consultation →'}
            </button>
            {ctaError && (
              <p style={{ fontSize: '10px', color: '#FF6B6B', margin: '6px 0 0', textAlign: 'center', lineHeight: 1.4 }}>
                {ctaError}
              </p>
            )}
            {!ctaError && (
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.18)', textAlign: 'center', margin: '5px 0 0', lineHeight: 1.4 }}>
                Pin at least one community first
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex: 1, background: '#F2F1EE', minWidth: 0 }}>

          {/* SECTION 1 — Communities */}
          <div ref={commSectionRef} style={{ padding: '18px 20px 0', borderBottom: '0.5px solid #D5D0C9' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 3px' }}>Your communities</p>
            <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 10px' }}>
              Rankings update live as you adjust priorities. Pin up to 3 communities. Click any city to preview.
            </p>

            {/* Metro filter */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {METRO_FILTERS.map(f => {
                const active = selectedMetro === f.value
                return (
                  <button key={f.value} type="button" onClick={() => { setSelectedMetro(f.value); setSelectedCityId(null); setShowAllCities(false) }} style={{
                    padding: '4px 11px', borderRadius: '20px', fontSize: '11px',
                    fontWeight: active ? 500 : 400,
                    background: active ? '#0A1E3D' : '#fff',
                    color: active ? '#fff' : '#6B6A65',
                    border: `0.5px solid ${active ? '#0A1E3D' : '#D0CEC8'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>{f.label}</button>
                )
              })}
            </div>

            {/* Master-detail body */}
            {rankedCities.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#86868b', padding: '12px 0' }}>No communities in this metro.</p>
            ) : (() => {
              const effectiveSelectedId = selectedCityId ?? rankedCities[0]?.location.id
              const selectedMatch = rankedCities.find(m => m.location.id === effectiveSelectedId)
              const selectedRankIdx = rankedCities.findIndex(m => m.location.id === effectiveSelectedId)
              const displayedCities = showAllCities ? rankedCities : rankedCities.slice(0, 5)

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

              return (
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                  borderTop: '0.5px solid #E8E6E2',
                }}>
                  {/* City list column */}
                  <div style={{ borderRight: '0.5px solid #E8E6E2', padding: '12px 14px 14px 0', overflowY: 'auto' }}>
                    {displayedCities.map((match, idx) => {
                      const city = match.location
                      const isPinned = pinnedCities.includes(city.id)
                      const isSelected = city.id === effectiveSelectedId
                      const status = afStatus(city.housing.medianHomePrice)
                      const overallIdx = rankedCities.findIndex(m => m.location.id === city.id)

                      let rowBg = '#fff'
                      let rowBorder = 'transparent'
                      if (isPinned) { rowBg = '#FEFDF8'; rowBorder = '#C5B783' }
                      else if (isSelected) { rowBg = '#F0F3F8'; rowBorder = '#0A1E3D' }

                      return (
                        <div
                          key={city.id}
                          onClick={() => setSelectedCityId(city.id)}
                          style={{
                            background: rowBg,
                            border: `0.5px solid ${rowBorder}`,
                            borderRadius: '6px', padding: '7px 8px',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            marginBottom: '2px', cursor: 'pointer',
                          }}
                          onMouseEnter={e => { if (!isSelected && !isPinned) (e.currentTarget as HTMLDivElement).style.borderColor = '#D0CEC8' }}
                          onMouseLeave={e => { if (!isSelected && !isPinned) (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent' }}
                        >
                          <span style={{ fontSize: '9px', color: '#86868b', width: '18px', flexShrink: 0 }}>#{overallIdx + 1}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '11px', color: '#1d1d1f', fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city.name}</p>
                            <p style={{ fontSize: '9px', color: '#86868b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city.metroUsed}</p>
                          </div>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: afColor(status), flexShrink: 0 }} />
                          <span style={{ fontSize: '10px', color: '#C5B783', fontWeight: 500, flexShrink: 0 }}>{match.matchScore}%</span>
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); isPinned ? unpinCity(city.id) : pinCity(city.id) }}
                            disabled={!isPinned && pinnedCities.length >= 3}
                            style={{
                              fontSize: '9px',
                              color: isPinned ? '#C5B783' : '#0076B6',
                              padding: '2px 5px', borderRadius: '8px',
                              border: isPinned ? '0.5px solid rgba(197,183,131,0.4)' : '0.5px solid #C8E0F5',
                              background: isPinned ? 'rgba(197,183,131,0.1)' : '#F0F7FF',
                              cursor: (!isPinned && pinnedCities.length >= 3) ? 'not-allowed' : 'pointer',
                              flexShrink: 0,
                              opacity: !isPinned && pinnedCities.length >= 3 ? 0.38 : 1,
                            }}
                          >
                            {isPinned ? '✓' : 'Pin'}
                          </button>
                        </div>
                      )
                    })}

                    {/* Show more / less toggle */}
                    {rankedCities.length > 5 && (
                      <div
                        onClick={() => setShowAllCities(v => !v)}
                        style={{
                          textAlign: 'center', padding: '6px',
                          fontSize: '10px', color: '#0076B6',
                          cursor: 'pointer',
                          borderTop: '0.5px solid #E8E6E2', marginTop: '4px',
                        }}
                      >
                        {showAllCities ? 'Show less ↑' : `Show more cities ↓`}
                      </div>
                    )}

                    {/* Origin comparison chart */}
                    {(() => {
                      const originData = originCity ? lookupOriginCity(originCity) : null
                      if (!originData) return null
                      const pinnedMatches = pinnedCities.map(id => getAllCities().find(c => c.id === id)).filter(Boolean)
                      const displayOriginCity = originCity || ''

                      const rows: { label: string; originVal: string; txVals: string[]; betterFn?: (tx: string, orig: string, idx: number) => boolean }[] = [
                        {
                          label: 'Median home price',
                          originVal: originData.medianHome,
                          txVals: pinnedMatches.map(c => fmtK(c!.housing.medianHomePrice)),
                          betterFn: (_tx, _orig, idx) => pinnedMatches[idx] ? pinnedMatches[idx]!.housing.medianHomePrice < parseHomePrice(originData.medianHome) : false,
                        },
                        {
                          label: 'School rating',
                          originVal: originData.schoolRating,
                          txVals: pinnedMatches.map(c => c!.school?.teaRating ?? '—'),
                          betterFn: (_tx, _orig, idx) => {
                            const txR = pinnedMatches[idx]?.school?.teaRating ?? ''
                            return schoolGrade(txR) > schoolGrade(originData.schoolRating)
                          },
                        },
                        {
                          label: 'Cost of living',
                          originVal: String(originData.colIndex),
                          txVals: pinnedMatches.map(c => String(txColIndex(c!.metroUsed))),
                          betterFn: (_tx, _orig, idx) => pinnedMatches[idx] ? txColIndex(pinnedMatches[idx]!.metroUsed) < originData.colIndex : false,
                        },
                        {
                          label: 'Safety',
                          originVal: originData.safety,
                          txVals: pinnedMatches.map(c => txSafety(c!.scores.safety)),
                          betterFn: (_tx, _orig, idx) => {
                            const txS = pinnedMatches[idx] ? txSafety(pinnedMatches[idx]!.scores.safety) : ''
                            const origBad = originData.safety === 'Moderate' || originData.safety === 'High crime'
                            return origBad && (txS === 'Very low' || txS === 'Low')
                          },
                        },
                        {
                          label: 'State income tax',
                          originVal: originData.incomeTax,
                          txVals: pinnedMatches.map(() => 'None (TX)'),
                          betterFn: (_tx, _orig) => originData.incomeTax !== 'None (TX)' && originData.incomeTax !== 'None (WA)' && originData.incomeTax !== 'None (TN)' && originData.incomeTax !== 'None (FL)',
                        },
                        {
                          label: 'Climate',
                          originVal: originData.climate,
                          txVals: pinnedMatches.map(c => txClimate(c!.metroUsed)),
                          // No green for climate — subjective
                        },
                        {
                          label: 'Budget fit',
                          originVal: '—',
                          txVals: pinnedMatches.map(c => afLabel(afStatus(c!.housing.medianHomePrice))),
                          // Color handled separately
                        },
                      ]

                      return (
                        <div style={{ borderTop: '0.5px solid #E8E6E2', paddingTop: '14px', marginTop: '8px' }}>
                          <p style={{ fontSize: '12px', fontWeight: 500, color: '#0A1E3D', marginBottom: '4px' }}>
                            How does Texas compare?
                          </p>
                          <p style={{ fontSize: '10px', color: '#86868b', marginBottom: '12px' }}>
                            Your origin city vs. the communities you&apos;re exploring.
                          </p>
                          {pinnedCities.length === 0 ? (
                            <p style={{ fontSize: '10px', color: '#86868b', fontStyle: 'italic' }}>
                              Pin a community above to see how it compares to {displayOriginCity}.
                            </p>
                          ) : (
                            <div style={{ background: '#fff', borderRadius: '8px', padding: '12px', border: '0.5px solid #E0DED8', overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                                <thead>
                                  <tr>
                                    <th style={{ textAlign: 'left', paddingRight: '12px', paddingBottom: '8px', minWidth: '110px' }}></th>
                                    <th style={{ textAlign: 'right', paddingRight: '12px', paddingBottom: '8px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#86868b', whiteSpace: 'nowrap' }}>
                                      {displayOriginCity}
                                      {originState ? `, ${originState}` : ''}
                                    </th>
                                    {pinnedMatches.map(c => (
                                      <th key={c!.id} style={{ textAlign: 'right', paddingBottom: '8px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C5B783', whiteSpace: 'nowrap', paddingLeft: '8px' }}>
                                        {c!.name}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {rows.map((row, ri) => (
                                    <tr key={row.label} style={{ borderTop: '0.5px solid #E8E6E2' }}>
                                      <td style={{ textAlign: 'left', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', fontSize: '11px', color: '#6B6A65', minWidth: '110px' }}>
                                        {row.label}
                                      </td>
                                      <td style={{ textAlign: 'right', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', color: '#6B6A65', whiteSpace: 'nowrap' }}>
                                        {row.originVal}
                                      </td>
                                      {row.txVals.map((val, ci) => {
                                        let color = '#1d1d1f'
                                        let fontWeight: number | string = 400
                                        if (row.label === 'Budget fit') {
                                          if (val === 'Comfortable') { color = '#1a6b35'; fontWeight = 500 }
                                          else if (val === 'Moderate') color = '#F5A623'
                                          else if (val === 'Stretched') color = '#FF3B30'
                                        } else if (row.betterFn?.(val, row.originVal, ci)) {
                                          color = '#1a6b35'; fontWeight = 500
                                        }
                                        return (
                                          <td key={ci} style={{ textAlign: 'right', paddingTop: '6px', paddingBottom: '6px', color, fontWeight, whiteSpace: 'nowrap', paddingLeft: '8px' }}>
                                            {val}
                                          </td>
                                        )
                                      })}
                                      {/* Empty cells for missing pinned cities */}
                                      {Array.from({ length: 3 - row.txVals.length }).map((_, ei) => (
                                        <td key={`empty-${ri}-${ei}`} />
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>

                  {/* City preview pane */}
                  <div style={{ padding: '12px 0 14px 14px', overflowY: 'auto' }}>
                    {selectedMatch ? (() => {
                      const city = selectedMatch.location
                      const isPinned = pinnedCities.includes(city.id)
                      const status = afStatus(city.housing.medianHomePrice)
                      const charLabel = communityCharLabel(city.personality.environment)
                      const statusBadge = status === 'comfortable'
                        ? { bg: '#E8F5EE', color: '#1a6b35' }
                        : status === 'moderate'
                        ? { bg: '#FAEEDA', color: '#633806' }
                        : { bg: '#FCEBEB', color: '#A32D2D' }

                      return (
                        <>
                          {/* Photo */}
                          <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', position: 'relative', marginBottom: '10px', background: '#2D4A6B' }}>
                            <Image
                              src={city.cityImageUrl ?? `/images/cities/${city.id}.jpg`}
                              alt={city.name}
                              fill
                              className="object-cover"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                            <div style={{
                              position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                              pointerEvents: 'none',
                            }} />
                            <p style={{ position: 'absolute', bottom: '7px', left: '9px', fontSize: '9px', color: 'rgba(255,255,255,0.65)', margin: 0, zIndex: 1 }}>
                              {city.name}
                            </p>
                            {/* Rank pill */}
                            <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '14px', padding: '3px 8px' }}>
                              <span style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.06em', color: '#fff', textTransform: 'uppercase' }}>
                                {rankPillLabel(selectedRankIdx)}
                              </span>
                            </div>
                            {/* Match pill */}
                            <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#C5B783', borderRadius: '14px', padding: '3px 8px' }}>
                              <span style={{ fontSize: '9px', fontWeight: 600, color: '#0A1E3D' }}>{selectedMatch.matchScore}%</span>
                            </div>
                          </div>

                          {/* City name + location */}
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#0A1E3D', marginBottom: '1px' }}>{city.name}</p>
                          <p style={{ fontSize: '9px', color: '#86868b', marginBottom: '7px' }}>
                            {city.metroUsed} metro · {city.county} County
                          </p>

                          {/* Description */}
                          <p style={{ fontSize: '10px', color: '#3a3a3a', lineHeight: 1.55, marginBottom: '8px' }}>
                            {city.description}
                          </p>

                          {/* Stats 2×2 */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '8px' }}>
                            {[
                              { label: 'Schools',   value: city.school?.teaRating ? `${city.school.teaRating} rated` : '—' },
                              { label: 'Med home',  value: fmtK(city.housing.medianHomePrice) },
                              { label: 'Safety',    value: city.scores.safety >= 7 ? 'Low risk' : city.scores.safety >= 4 ? 'Moderate' : 'Higher risk' },
                              { label: 'Community', value: charLabel },
                            ].map(stat => (
                              <div key={stat.label} style={{ background: '#F5F5F7', borderRadius: '5px', padding: '5px 7px' }}>
                                <p style={{ fontSize: '8px', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1px' }}>{stat.label}</p>
                                <p style={{ fontSize: '10px', color: '#1d1d1f', fontWeight: 500, margin: 0 }}>{stat.value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Budget fit */}
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: '#F5F5F7', borderRadius: '6px', padding: '6px 8px', marginBottom: '8px',
                          }}>
                            <div>
                              <p style={{ fontSize: '8px', color: '#86868b', margin: '0 0 1px' }}>Budget fit</p>
                              <p style={{ fontSize: '10px', color: '#1d1d1f', fontWeight: 500, margin: 0 }}>
                                Est. ${selectedMatch.estimatedMonthlyHousing.toLocaleString()}/mo
                              </p>
                            </div>
                            <span style={{
                              background: statusBadge.bg, color: statusBadge.color,
                              borderRadius: '12px', padding: '3px 8px', fontSize: '9px', fontWeight: 500,
                            }}>{afLabel(status)}</span>
                          </div>

                          {/* Action buttons */}
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              type="button"
                              onClick={() => isPinned ? unpinCity(city.id) : pinCity(city.id)}
                              disabled={!isPinned && pinnedCities.length >= 3}
                              style={{
                                flex: 1,
                                background: isPinned ? 'rgba(197,183,131,0.15)' : '#0A1E3D',
                                color: isPinned ? '#C5B783' : '#fff',
                                border: isPinned ? '0.5px solid rgba(197,183,131,0.4)' : 'none',
                                borderRadius: '6px', padding: '7px',
                                fontSize: '10px', fontWeight: 500,
                                cursor: (!isPinned && pinnedCities.length >= 3) ? 'not-allowed' : 'pointer',
                                opacity: !isPinned && pinnedCities.length >= 3 ? 0.5 : 1,
                                textAlign: 'center', fontFamily: 'inherit',
                              }}
                            >
                              {isPinned ? 'Pinned ✓' : 'Pin this community'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setReportMatch(selectedMatch)}
                              style={{
                                flex: 1, border: '0.5px solid #D0CEC8', borderRadius: '6px',
                                padding: '7px', fontSize: '10px', color: '#555',
                                background: '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
                              }}
                            >
                              Full report →
                            </button>
                          </div>
                        </>
                      )
                    })() : (
                      <p style={{ fontSize: '11px', color: '#86868b', padding: '12px 0' }}>Select a city to preview.</p>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>

          {/* SECTION 2 — Priorities */}
          <div style={{ padding: '18px 20px', borderBottom: '0.5px solid #D5D0C9' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 3px' }}>Your priorities</p>
            <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 12px' }}>
              Click an item to move it between columns. City rankings update live as you adjust.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {/* Must have */}
              <div style={{ background: '#fff', border: '0.5px solid #E0DED8', borderRadius: '8px', padding: '10px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Must have</p>
                {mustHaveError && (
                  <p style={{ fontSize: '10px', color: '#F5A623', marginBottom: '6px', fontStyle: 'italic', margin: '0 0 6px' }}>
                    Must have is limited to 3. Move one out first.
                  </p>
                )}
                {mustHaves.length === 0 && <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                {mustHaves.map(key => {
                  const cat = DNA_CATEGORIES.find(c => c.key === key)!
                  return (
                    <div key={key} onClick={() => movePriority(key, 'down')}
                      style={{
                        background: '#F5F5F7', borderRadius: '5px', padding: '6px 8px',
                        fontSize: '11px', color: '#1d1d1f', marginBottom: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}>
                      <span>{cat.icon} {cat.label}</span>
                      <span style={{ color: '#0076B6', fontSize: '10px' }}>→</span>
                    </div>
                  )
                })}
              </div>

              {/* Nice to have */}
              <div style={{ background: '#fff', border: '0.5px solid #E0DED8', borderRadius: '8px', padding: '10px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#6B6A65', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nice to have</p>
                {niceToHaves.length === 0 && <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                {niceToHaves.map(key => {
                  const cat = DNA_CATEGORIES.find(c => c.key === key)!
                  return (
                    <div key={key} style={{
                      background: '#F5F5F7', borderRadius: '5px', padding: '5px 6px',
                      fontSize: '11px', color: '#1d1d1f', marginBottom: '4px',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <button type="button" onClick={() => movePriority(key, 'up')}
                        style={{ color: '#0076B6', fontSize: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>
                        ←
                      </button>
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.icon} {cat.label}</span>
                      <button type="button" onClick={() => movePriority(key, 'down')}
                        style={{ color: '#0076B6', fontSize: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>
                        →
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Less important */}
              <div style={{ background: '#fff', border: '0.5px solid #E0DED8', borderRadius: '8px', padding: '10px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#B0ADA6', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Less important</p>
                {lessImportant.length === 0 && <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.22)', fontStyle: 'italic', margin: 0 }}>Empty</p>}
                {lessImportant.map(key => {
                  const cat = DNA_CATEGORIES.find(c => c.key === key)!
                  return (
                    <div key={key}
                      style={{
                        background: '#F5F5F7', borderRadius: '5px', padding: '5px 6px',
                        fontSize: '11px', color: '#1d1d1f', marginBottom: '4px',
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                      <button type="button" onClick={() => movePriority(key, 'up')}
                        style={{ color: '#0076B6', fontSize: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', lineHeight: 1, flexShrink: 0 }}>
                        ←
                      </button>
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.icon} {cat.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* SECTION 3 — Numbers */}
          <div style={{ padding: '18px 20px' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1E3D', margin: '0 0 3px' }}>Your numbers</p>
            <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 16px' }}>
              Adjust to see how your buying power affects each community in real time.
            </p>

            {/* Selling toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#1d1d1f' }}>Selling a home?</span>
              {(['Yes', 'No'] as const).map(v => {
                const active = (v === 'Yes') === isSelling
                return (
                  <button key={v} type="button" onClick={() => { setIsSelling(v === 'Yes'); setSandboxTouched(true) }}
                    style={{
                      padding: '5px 14px', borderRadius: '20px', fontSize: '12px',
                      background: active ? '#0A1E3D' : '#fff',
                      color: active ? '#fff' : '#6B6A65',
                      border: `0.5px solid ${active ? '#0A1E3D' : '#D0CEC8'}`,
                      cursor: 'pointer',
                    }}>{v}</button>
                )
              })}
            </div>

            {/* Proceeds + Savings */}
            <div style={{ display: 'grid', gridTemplateColumns: isSelling ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '12px' }}>
              {isSelling && (
                <div>
                  <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 4px' }}>Expected sale proceeds</p>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '0.5px solid #E0DED8', borderRadius: '7px', overflow: 'hidden' }}>
                    <span style={{ padding: '7px 8px', fontSize: '12px', color: '#86868b', borderRight: '0.5px solid #E0DED8', background: '#FAFAF8', flexShrink: 0 }}>$</span>
                    <input type="text"
                      value={proceeds.replace(/^\$/, '')}
                      onChange={e => { setProceeds(fmtCurrency(e.target.value)); setSandboxTouched(true) }}
                      onBlur={() => persistNumbers({ exact_home_proceeds: proceedsNum || null })}
                      placeholder="340,000"
                      style={{ border: 'none', padding: '7px 9px', fontSize: '13px', color: '#1d1d1f', background: '#fff', outline: 'none', width: '100%', fontFamily: 'inherit' }}
                    />
                  </div>
                  <p style={{ fontSize: '10px', color: '#86868b', margin: '3px 0 0' }}>After paying off your mortgage</p>
                </div>
              )}
              <div>
                <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 4px' }}>
                  {isSelling ? 'Additional savings or funds' : 'Savings or funds available'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '0.5px solid #E0DED8', borderRadius: '7px', overflow: 'hidden' }}>
                  <span style={{ padding: '7px 8px', fontSize: '12px', color: '#86868b', borderRight: '0.5px solid #E0DED8', background: '#FAFAF8', flexShrink: 0 }}>$</span>
                  <input type="text"
                    value={savings.replace(/^\$/, '')}
                    onChange={e => { setSavings(fmtCurrency(e.target.value)); setSandboxTouched(true) }}
                    onBlur={() => persistNumbers({ exact_down_payment: savingsNum || null })}
                    placeholder="75,000"
                    style={{ border: 'none', padding: '7px 9px', fontSize: '13px', color: '#1d1d1f', background: '#fff', outline: 'none', width: '100%', fontFamily: 'inherit' }}
                  />
                </div>
                <p style={{ fontSize: '10px', color: '#86868b', margin: '3px 0 0' }}>Savings, investments, gifts</p>
              </div>
            </div>

            {/* Total bar */}
            <div style={{
              background: '#0A1E3D', borderRadius: '7px', padding: '10px 14px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '16px',
            }}>
              <div>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 2px', letterSpacing: '0.06em' }}>Total available</p>
                {totalFunds > 0 && (
                  <p style={{ fontSize: '10px', color: '#C5B783', margin: 0 }}>
                    {isSelling && proceedsNum > 0 ? fmtK(proceedsNum) : ''}
                    {isSelling && proceedsNum > 0 && savingsNum > 0 ? ' + ' : ''}
                    {savingsNum > 0 ? fmtK(savingsNum) : ''}
                  </p>
                )}
              </div>
              <p style={{ fontSize: '17px', fontWeight: 500, color: '#fff', margin: 0 }}>
                {totalFunds > 0 ? fmtK(totalFunds) : '$0'}
              </p>
            </div>

            {/* Income */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 4px' }}>Annual household income</p>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '0.5px solid #E0DED8', borderRadius: '7px', overflow: 'hidden' }}>
                <span style={{ padding: '7px 8px', fontSize: '12px', color: '#86868b', borderRight: '0.5px solid #E0DED8', background: '#FAFAF8', flexShrink: 0 }}>$</span>
                <input type="text"
                  value={incomeDisplay.replace(/^\$/, '')}
                  onChange={e => {
                    setIncomeDisplay(fmtCurrency(e.target.value))
                    setSandboxTouched(true)
                    const parsed = parseMoney(e.target.value)
                    if (incomeTimerRef.current) clearTimeout(incomeTimerRef.current)
                    incomeTimerRef.current = setTimeout(() => { if (parsed > 0) setIncomeVal(parsed) }, 400)
                  }}
                  onBlur={() => {
                    const parsed = parseMoney(incomeDisplay)
                    if (parsed > 0) {
                      setIncomeVal(parsed)
                      persistNumbers({ annual_income_override: parsed })
                    }
                  }}
                  placeholder="100,000"
                  style={{ border: 'none', padding: '7px 9px', fontSize: '13px', color: '#1d1d1f', background: '#fff', outline: 'none', width: '100%', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* Rate slider */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <p style={{ fontSize: '11px', color: '#86868b', margin: 0 }}>Interest rate</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', background: '#E8F5EE', color: '#1a6b35', padding: '2px 7px', borderRadius: '10px' }}>
                    {RATE_MARKET_AVG}% avg
                  </span>
                  <span style={{ fontSize: '12px', color: '#1d1d1f', fontWeight: 500 }}>{interestRate}%</span>
                </div>
              </div>
              {/* Custom rate slider with green market band */}
            <div style={{ position: 'relative', height: '4px', background: 'rgba(0,0,0,0.12)', borderRadius: '2px', margin: '6px 0' }}>
              <div style={{ position: 'absolute', height: '100%', background: '#34C759', opacity: 0.7, borderRadius: '2px', left: '46.4%', width: '7.1%' }} />
              <input
                type="range" min={3} max={10} step={0.25} value={interestRate}
                onChange={e => { setSandboxTouched(true); setInterestRate(parseFloat(e.target.value)) }}
                style={{ position: 'absolute', top: '-6px', left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '16px' }}
              />
              <div style={{
                position: 'absolute', width: '14px', height: '14px',
                background: '#0A1E3D', borderRadius: '50%', top: '-5px',
                left: `calc(${(interestRate - 3) / 7 * 100}% - 7px)`,
                pointerEvents: 'none', transition: 'left 0.1s',
              }} />
            </div>
            <p style={{ fontSize: '9px', color: '#34C759', opacity: 0.8, margin: '3px 0 0' }}>● Current market: 6.25%–6.75%</p>
            </div>

            {/* Loan term */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {([30, 15] as const).map(term => {
                const active = loanTerm === term
                return (
                  <button key={term} type="button" onClick={() => {
                    setLoanTerm(term); setSandboxTouched(true)
                    persistNumbers({ loan_term_preference: term })
                  }} style={{
                    padding: '6px 16px', borderRadius: '20px', fontSize: '12px',
                    background: active ? '#0A1E3D' : '#fff',
                    color: active ? '#fff' : '#6B6A65',
                    border: `0.5px solid ${active ? '#0A1E3D' : '#D0CEC8'}`,
                    cursor: 'pointer',
                  }}>{term} year</button>
                )
              })}
            </div>

            {/* Monthly estimate */}
            <div style={{
              background: '#EDF2FF', borderRadius: '7px', padding: '10px 14px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '16px',
            }}>
              <div>
                <p style={{ fontSize: '10px', color: '#0076B6', margin: '0 0 1px' }}>Estimated monthly payment</p>
                <p style={{ fontSize: '10px', color: '#86868b', margin: 0 }}>Principal + interest only</p>
              </div>
              <p style={{ fontSize: '17px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>
                {refMonthly > 0 ? `$${refMonthly.toLocaleString()}` : '—'}
              </p>
            </div>

            {/* Affordability per pinned city */}
            <div>
              <p style={{ fontSize: '11px', color: '#86868b', margin: '0 0 8px' }}>Affordability per pinned community</p>
              {pinnedCities.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#B0ADA6', fontStyle: 'italic' }}>Pin communities above to see affordability</p>
              ) : (
                pinnedCities.map(cityId => {
                  const cd = getAllCities().find(c => c.id === cityId)
                  if (!cd) return null
                  const s = afStatus(cd.housing.medianHomePrice)
                  const badge = s === 'comfortable'
                    ? { bg: '#E8F5EE', color: '#1a6b35' }
                    : s === 'moderate'
                    ? { bg: '#FAEEDA', color: '#633806' }
                    : { bg: '#FCEBEB', color: '#A32D2D' }
                  return (
                    <div key={cityId} style={{
                      background: '#fff', border: '0.5px solid #E0DED8',
                      borderRadius: '7px', padding: '8px 10px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginBottom: '5px',
                    }}>
                      <p style={{ fontSize: '12px', color: '#1d1d1f', margin: 0 }}>
                        {cd.name} · {fmtK(cd.housing.medianHomePrice)} median
                      </p>
                      <span style={{
                        ...badge, fontSize: '11px', fontWeight: 500,
                        padding: '3px 9px', borderRadius: '12px', flexShrink: 0,
                      }}>{afLabel(s)}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
