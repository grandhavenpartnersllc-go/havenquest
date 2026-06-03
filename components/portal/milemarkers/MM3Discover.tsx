'use client'

import { useState, useEffect } from 'react'
import { CityMatch, UserProfile, UserSession, SandboxProfile, LifestyleScores } from '../../../types'
import { LIFESTYLE_CATEGORIES } from '../../../utils/constants'
import { getAllCities } from '../../../services/locationService'
import { getTopMatches } from '../../../services/matchingService'
import { createClient } from '../../../lib/supabase/client'

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

export default function MM3Discover({ profile }: MM3DiscoverProps) {
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

  function moveCategory(key: keyof LifestyleScores, from: BucketKey, to: BucketKey) {
    const bucketSetters: Record<BucketKey, React.Dispatch<React.SetStateAction<(keyof LifestyleScores)[]>>> = {
      mustHaves: setMustHaves,
      niceToHaves: setNiceToHaves,
      notPriorities: setNotPriorities,
      unassigned: setUnassigned,
    }
    if (to === 'mustHaves' && mustHaves.length >= 4) return
    if (to === 'niceToHaves' && niceToHaves.length >= 5) return
    bucketSetters[from](prev => prev.filter(k => k !== key))
    bucketSetters[to](prev => [...prev, key])
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

  if (committed) {
    return (
      <div>

        {/* Post-commit Section 1 — Confirmation */}
        <div className="mb-8 rounded-xl p-5"
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

      {/* Section 2 — Live City Rankings */}
      <div className="mb-8 rounded-xl p-4" style={{ backgroundColor: '#F7F6F3' }}>
        <p className="text-[10px] font-bold uppercase mb-3"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Your Current Rankings
        </p>
        <div className="space-y-2">
          {sandboxMatches.map((match, i) => (
            <div key={match.location.id} className="flex items-center gap-3">
              <span className="text-xs font-bold w-5 text-right shrink-0"
                    style={{ color: '#9A8E82' }}>
                {i + 1}
              </span>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: WARM_DARK }}>
                  {match.location.name}
                </span>
                <span className="text-xs" style={{ color: '#9A8E82' }}>
                  {match.location.metroUsed}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-20 h-1.5 rounded-full overflow-hidden"
                     style={{ backgroundColor: '#E5E7EB' }}>
                  <div className="h-full rounded-full"
                       style={{ width: `${match.matchScore}%`, backgroundColor: GOLD }} />
                </div>
                <span className="text-xs font-bold tabular-nums w-8 text-right"
                      style={{ color: GOLD }}>
                  {match.matchScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — Financial Sliders */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase mb-4"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Adjust Your Financial Picture
        </p>

        {/* Down payment */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1" style={{ color: WARM_DARK }}>
            Down payment available
          </label>
          <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
            Including additional savings, gifts, or other sources
          </p>
          <select
            value={downPayment}
            onChange={e => setDownPayment(e.target.value)}
            className="w-full rounded-xl border px-4 py-2.5 text-sm appearance-none"
            style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
          >
            {DOWN_PAYMENT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Home sale proceeds */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1" style={{ color: WARM_DARK }}>
            Estimated home sale proceeds
          </label>
          <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
            Leave as &ldquo;None&rdquo; if you&apos;re not selling a home
          </p>
          <select
            value={proceeds ?? 'None'}
            onChange={e => setProceeds(e.target.value === 'None' ? null : e.target.value)}
            className="w-full rounded-xl border px-4 py-2.5 text-sm appearance-none"
            style={{ borderColor: '#E5E7EB', color: WARM_DARK }}
          >
            <option value="None">None</option>
            {PROCEEDS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Interest rate */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold" style={{ color: WARM_DARK }}>
              Interest rate assumption
            </label>
            <span className="text-sm font-bold" style={{ color: GOLD }}>
              {interestRate.toFixed(2)}%
            </span>
          </div>
          <p className="text-xs mb-2" style={{ color: '#9A8E82' }}>
            Default is 7.0% — adjust to model different scenarios
          </p>
          <input
            type="range"
            min={3.0}
            max={10.0}
            step={0.25}
            value={interestRate}
            onChange={e => setInterestRate(parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: '#9A8E82' }}>
            <span>3.00%</span>
            <span>10.00%</span>
          </div>
        </div>
      </div>

      {/* Section 4 — Priority Buckets */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase mb-2"
           style={{ color: GOLD, letterSpacing: '0.18em' }}>
          Adjust Your Priorities
        </p>
        <p className="text-xs mb-4" style={{ color: '#9A8E82' }}>
          Move categories between buckets and watch your city rankings update instantly.
          Must Have counts 3×. Important to Me counts 2×. Would Be Nice counts 1×.
        </p>

        {([
          { key: 'mustHaves',    label: 'Must Have',    max: 4,    current: mustHaves,    color: '#B8912A' },
          { key: 'niceToHaves',  label: 'Important',    max: 5,    current: niceToHaves,  color: '#4B7A5E' },
          { key: 'notPriorities',label: 'Nice to Have', max: null, current: notPriorities,color: '#6B7280' },
          { key: 'unassigned',   label: 'Unassigned',   max: null, current: unassigned,   color: '#9A8E82' },
        ] as { key: BucketKey; label: string; max: number | null; current: (keyof LifestyleScores)[]; color: string }[]).map(bucket => (
          <div key={bucket.key} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold" style={{ color: bucket.color }}>
                {bucket.label}{bucket.max && ` (max ${bucket.max})`}
              </span>
              <span className="text-xs" style={{ color: '#9A8E82' }}>
                {bucket.current.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2 min-h-10 p-2 rounded-xl"
                 style={{ backgroundColor: '#F7F6F3', border: '1.5px dashed #E5E7EB' }}>
              {bucket.current.map(key => {
                const cat = LIFESTYLE_CATEGORIES.find(c => c.key === key)!
                return (
                  <div key={key}
                       className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                       style={{ backgroundColor: 'white', border: `1px solid ${bucket.color}44`, color: WARM_DARK }}>
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <div className="flex gap-0.5 ml-1">
                      {bucket.key !== 'mustHaves' && (
                        <button
                          onClick={() => moveCategory(key, bucket.key, 'mustHaves')}
                          disabled={mustHaves.length >= 4}
                          className="text-[10px] px-1 rounded hover:bg-gray-100 disabled:opacity-30"
                          title="Move to Must Have"
                        >↑M</button>
                      )}
                      {bucket.key !== 'unassigned' && (
                        <button
                          onClick={() => moveCategory(key, bucket.key, 'unassigned')}
                          className="text-[10px] px-1 rounded hover:bg-gray-100"
                          title="Move to Unassigned"
                        >✕</button>
                      )}
                    </div>
                  </div>
                )
              })}
              {bucket.current.length === 0 && (
                <span className="text-xs italic" style={{ color: '#C5BFB8' }}>
                  {bucket.key === 'unassigned' ? 'No unassigned categories' : 'Drop categories here'}
                </span>
              )}
            </div>
          </div>
        ))}
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

    </div>
  )
}
