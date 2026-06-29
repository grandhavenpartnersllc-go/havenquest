'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CityMatch, UserProfile } from '../../../types'
import { getDownPaymentMidpoint, getProceedsMidpoint } from '../../../services/matchingService'
import { createClient } from '../../../lib/supabase/client'

const RANK_LABELS = ['⭐ Top pick', 'Runner-up', 'Strong alt']

interface Props {
  matches: CityMatch[]
  profile: UserProfile | null
  initialChecklist: Record<string, boolean>
  initialNotes: string
  onAdvanceToDiscover: () => void
  email?: string
}

function fmtMoney(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

function fmtK(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n.toLocaleString()}`
}

function communityChar(env: number): string {
  if (env <= 3) return 'Urban'
  if (env <= 6) return 'Suburban'
  if (env <= 8) return 'Small Town'
  return 'Rural'
}

export default function MM2Discover({ matches, profile, onAdvanceToDiscover, email }: Props) {
  const [current, setCurrent] = useState(0)
  const [hasSeenAll, setHasSeenAll] = useState(false)
  const [expandedCards, setExpandedCards] = useState<boolean[]>([false, false, false])
  const [advancing, setAdvancing] = useState(false)

  const visibleMatches = matches.slice(0, 3)

  function goTo(idx: number) {
    setCurrent(idx)
    if (idx >= visibleMatches.length - 1) setHasSeenAll(true)
  }

  function toggleExpand(idx: number) {
    setExpandedCards(prev => {
      const next = [...prev]
      next[idx] = !next[idx]
      return next
    })
  }

  function getCityAffordabilityStatus(match: CityMatch): 'comfortable' | 'moderate' | 'stretched' {
    const city = match.location
    const grossMonthlyIncome = (profile?.annualIncome ?? 100000) / 12
    const fp = profile?.financial_picture
    const downMid = fp?.down_payment_available ? getDownPaymentMidpoint(fp.down_payment_available) : 30000
    const procMid = fp?.home_sale_proceeds && fp.is_homeowner ? getProceedsMidpoint(fp.home_sale_proceeds) : 0
    const balance = Math.max(0, city.housing.medianHomePrice - downMid - procMid)
    if (balance === 0) return 'comfortable'
    const monthlyRate = 0.07 / 12
    const payment = Math.round(
      (balance * monthlyRate * Math.pow(1 + monthlyRate, 360)) /
      (Math.pow(1 + monthlyRate, 360) - 1)
    )
    const tax = Math.round((city.housing.medianHomePrice * (city.housing.propertyTaxRate ?? 0.018)) / 12)
    const pct = (payment + tax) / grossMonthlyIncome
    if (pct <= 0.30) return 'comfortable'
    if (pct <= 0.40) return 'moderate'
    return 'stretched'
  }

  async function handleAdvance() {
    setAdvancing(true)
    try {
      if (email) {
        const supabase = createClient()
        await supabase.from('users').update({ current_milemarker: 3 }).eq('email', email.toLowerCase())
      }
    } catch {}
    onAdvanceToDiscover()
  }

  if (visibleMatches.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ fontSize: '14px', color: '#86868b' }}>No city matches found. Please complete your profile to see recommendations.</p>
      </div>
    )
  }

  // Set hasSeenAll on mount if only 1 city
  if (visibleMatches.length === 1 && !hasSeenAll) setHasSeenAll(true)

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: '#C5B783', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Your Matched Communities
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#0A1E3D', marginBottom: '6px' }}>
          Here&apos;s where you belong.
        </h1>
        <p style={{ fontSize: '13px', color: '#86868b', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
          Based on everything you shared, these are the Texas communities where your life genuinely fits. Take your time with each one.
        </p>
      </div>

      {/* Carousel — fade approach (immune to parent overflow-y:auto bleed) */}
      <div style={{ position: 'relative', borderRadius: '12px', width: '100%' }}>
        {visibleMatches.map((match, idx) => {
          const isActive = idx === current
          const city = match.location
          const status = getCityAffordabilityStatus(match)
          const isExpanded = expandedCards[idx]
          const char = communityChar(city.personality.environment)

            const statusLabel = status === 'comfortable' ? 'Comfortable' : status === 'moderate' ? 'Moderate' : 'Stretched'
            const statusStyle = status === 'comfortable'
              ? { background: '#E8F5EE', color: '#1a6b35' }
              : status === 'moderate'
              ? { background: '#FAEEDA', color: '#633806' }
              : { background: '#FCEBEB', color: '#A32D2D' }

            const propTaxMonthly = Math.round(city.housing.medianHomePrice * (city.housing.propertyTaxRate ?? 0.018) / 12)
            const costOfLiving = Math.round(city.housing.monthlyGroceries + city.housing.monthlyUtilities + city.housing.monthlyTransportation)
            const yoy = city.market.priceYOY

          return (
            <div key={city.id} style={{
              position: isActive ? 'relative' : 'absolute',
              top: isActive ? undefined : 0,
              left: isActive ? undefined : 0,
              width: '100%',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.35s ease',
              pointerEvents: isActive ? 'auto' : 'none',
            }}>
              <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>

                  {/* Photo */}
                  <div style={{ height: '180px', position: 'relative', background: '#2D4A6B', overflow: 'hidden' }}>
                    <Image
                      src={city.cityImageUrl ?? `/images/cities/${city.id}.jpg`}
                      alt={city.name}
                      fill
                      className="object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    {/* Gradient */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
                      pointerEvents: 'none',
                    }} />
                    {/* City name */}
                    <p style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                      {city.name}
                    </p>
                    {/* Rank pill */}
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      background: 'rgba(0,0,0,0.45)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '20px', padding: '4px 11px',
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', color: '#fff', textTransform: 'uppercase' }}>
                        {RANK_LABELS[idx]}
                      </span>
                    </div>
                    {/* Match pill */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#C5B783', borderRadius: '20px', padding: '4px 11px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#0A1E3D' }}>
                        {match.matchScore}% match
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '18px 20px' }}>
                    <p style={{ fontSize: '20px', fontWeight: 500, color: '#0A1E3D', marginBottom: '2px' }}>{city.name}</p>
                    <p style={{ fontSize: '11px', color: '#86868b', marginBottom: '12px' }}>
                      {city.metroUsed} metro · {city.county} County · {char}
                    </p>

                    {/* Description */}
                    <p style={{ fontSize: '12px', color: '#3a3a3a', lineHeight: 1.65, marginBottom: '14px' }}>
                      {city.description}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span style={{ background: '#E8F0FE', color: '#1a4a8a', borderRadius: '14px', padding: '4px 10px', fontSize: '10px', fontWeight: 500 }}>
                        {city.market.marketCondition}
                      </span>
                      <span style={{ background: '#E8F5EE', color: '#1a6b35', borderRadius: '14px', padding: '4px 10px', fontSize: '10px', fontWeight: 500 }}>
                        {city.school.teaRating} Schools
                      </span>
                      <span style={{ background: '#FAEEDA', color: '#633806', borderRadius: '14px', padding: '4px 10px', fontSize: '10px', fontWeight: 500 }}>
                        {char}
                      </span>
                    </div>

                    {/* Stats grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
                      {[
                        { label: 'Schools',     value: `${city.school.teaRating} rated` },
                        { label: 'Median home', value: fmtK(city.housing.medianHomePrice) },
                        { label: 'Safety',      value: city.scores.safety >= 7 ? 'Low risk' : city.scores.safety >= 4 ? 'Moderate' : 'Higher risk' },
                      ].map(stat => (
                        <div key={stat.label} style={{ background: '#F5F5F7', borderRadius: '7px', padding: '8px 10px' }}>
                          <p style={{ fontSize: '9px', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>{stat.label}</p>
                          <p style={{ fontSize: '12px', color: '#1d1d1f', fontWeight: 500, margin: 0 }}>{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Budget fit */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: '#F5F5F7', borderRadius: '7px', padding: '9px 12px',
                      marginBottom: '14px',
                    }}>
                      <div>
                        <p style={{ fontSize: '9px', color: '#86868b', margin: '0 0 2px' }}>Budget fit</p>
                        <p style={{ fontSize: '12px', color: '#1d1d1f', fontWeight: 500, margin: 0 }}>
                          Est. {fmtMoney(match.estimatedMonthlyHousing)}/mo
                        </p>
                      </div>
                      <span style={{ ...statusStyle, borderRadius: '12px', padding: '3px 10px', fontSize: '10px', fontWeight: 500 }}>
                        {statusLabel}
                      </span>
                    </div>

                    {/* Expand toggle */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(idx)}
                      style={{
                        width: '100%', border: '0.5px solid #D0CEC8', borderRadius: '8px',
                        padding: '9px', fontSize: '12px', color: '#555',
                        background: '#fff', cursor: 'pointer', textAlign: 'center',
                        fontFamily: 'inherit',
                      }}
                    >
                      {isExpanded ? 'Hide community report ↑' : 'View full community report ↓'}
                    </button>

                    {/* Expanded section */}
                    {isExpanded && (
                      <div style={{ marginTop: '14px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', color: '#86868b', textTransform: 'uppercase', marginBottom: '12px' }}>
                          Full Community Profile
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {[
                            { label: 'Cost of living',  value: `${fmtMoney(costOfLiving)}/mo` },
                            { label: 'Property tax',    value: `${fmtMoney(propTaxMonthly)}/mo` },
                            { label: 'Days on market',  value: `${city.market.daysOnMarket} days` },
                            { label: 'Community type',  value: char },
                            { label: 'Price growth',    value: yoy >= 0 ? `+${yoy.toFixed(1)}% YOY` : `${yoy.toFixed(1)}% YOY` },
                            { label: 'Lifestyle match', value: `${Math.round(match.functionalFitScore * 10)}%` },
                          ].map(stat => (
                            <div key={stat.label} style={{ background: '#F5F5F7', borderRadius: '8px', padding: '10px 12px' }}>
                              <p style={{ fontSize: '9px', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>{stat.label}</p>
                              <p style={{ fontSize: '12px', color: '#1d1d1f', fontWeight: 500, margin: 0 }}>{stat.value}</p>
                            </div>
                          ))}
                        </div>

                        <p style={{
                          fontSize: '12px', color: '#86868b', lineHeight: 1.6,
                          padding: '10px 12px', background: '#FAFAF8',
                          borderRadius: '8px', border: '0.5px solid #E8E6E0',
                          marginTop: '8px',
                        }}>
                          {city.cityNarrative ?? city.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
          )
        })}
      </div>

      {/* Navigation row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          style={{
            border: '0.5px solid #D0CEC8', borderRadius: '7px',
            padding: '7px 16px', fontSize: '12px', color: '#555',
            background: '#fff', cursor: current === 0 ? 'default' : 'pointer',
            opacity: current === 0 ? 0.3 : 1,
            pointerEvents: current === 0 ? 'none' : 'auto',
            fontFamily: 'inherit',
          }}
        >← Back</button>

        {/* Dot indicator */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {visibleMatches.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              style={{
                width: i === current ? '16px' : '6px',
                height: '6px',
                borderRadius: i === current ? '3px' : '50%',
                background: i === current ? '#0A1E3D' : '#D0CEC8',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.25s',
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === visibleMatches.length - 1}
          style={{
            border: '0.5px solid #D0CEC8', borderRadius: '7px',
            padding: '7px 16px', fontSize: '12px', color: '#555',
            background: '#fff', cursor: current === visibleMatches.length - 1 ? 'default' : 'pointer',
            opacity: current === visibleMatches.length - 1 ? 0.3 : 1,
            pointerEvents: current === visibleMatches.length - 1 ? 'none' : 'auto',
            fontFamily: 'inherit',
          }}
        >Next →</button>
      </div>

      {/* CTA */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        {hasSeenAll ? (
          <>
            <button
              type="button"
              onClick={handleAdvance}
              disabled={advancing}
              style={{
                width: '100%', background: '#0A1E3D', color: '#fff',
                border: 'none', borderRadius: '9px', padding: '12px',
                fontSize: '13px', fontWeight: 500, marginTop: '12px',
                cursor: advancing ? 'not-allowed' : 'pointer',
                opacity: advancing ? 0.7 : 1,
                fontFamily: 'inherit',
              }}
            >
              {advancing ? 'Loading…' : 'Continue to Refine →'}
            </button>
            <p style={{ fontSize: '11px', color: '#B0ADA6', marginTop: '8px' }}>
              Review all three communities before continuing
            </p>
          </>
        ) : (
          <p style={{ fontSize: '11px', color: '#B0ADA6' }}>
            Review all three communities before continuing
          </p>
        )}
      </div>

    </div>
  )
}
