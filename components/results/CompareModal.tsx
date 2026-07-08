'use client'

import React from 'react'
import { CityMatch, UserProfile } from '../../types'
import { DNA_CATEGORIES } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatting'
import { getScoreColor } from '../../utils/scoring'
import { DNA_CATEGORY_ICONS } from '../../utils/categoryIcons'
import { X, AlertTriangle, CheckCircle, Download } from 'lucide-react'

// Phase D — restructured from fixed cityA/cityB props to an array-driven
// layout. Exactly 2 cities are passed today (matching real usage — Pin/
// Compare from Phase C1 always pairs against a single anchor), but every
// section below maps over `cities` and computes "who wins" via bestIndices
// rather than a hardcoded pairwise comparison, so it's structurally ready
// for more than 2 later. Column width (CITY_COL_W) is still a fixed 150px
// tuned for exactly 2 columns — a 3+-city selection UI is deliberately not
// built here (out of scope per the brief); making the columns responsive to
// N would be part of that future work, not this restructuring.
interface CompareModalProps {
  cities: CityMatch[]
  profile: UserProfile
  totalFunds: number
  interestRate: number
  loanTerm: 30 | 15
  originState: string | null
  originCity: string | null
  onClose: () => void
}

// Pairwise only — a "leads on X" narrative doesn't generalize cleanly past 2
// cities, so this (and its render site below) is intentionally gated to
// cities.length === 2.
function getSummary(cityA: CityMatch, cityB: CityMatch, profile: UserProfile): string {
  const primaryKeys = profile.mustHaves.length > 0 ? profile.mustHaves : profile.niceToHaves
  const priorityLabel = profile.mustHaves.length > 0 ? 'must-have' : 'important'

  if (primaryKeys.length === 0) return ''

  const sumA = primaryKeys.reduce((s, k) => s + cityA.location.dna[k], 0)
  const sumB = primaryKeys.reduce((s, k) => s + cityB.location.dna[k], 0)
  const avgDiff = Math.abs(sumA - sumB) / primaryKeys.length

  if (avgDiff < 1) {
    return `Both cities perform similarly on your ${priorityLabel} priorities — the choice likely comes down to cost and personal feel.`
  }

  const winner = sumA > sumB ? cityA : cityB
  const loser = sumA > sumB ? cityB : cityA

  const advantages = primaryKeys
    .filter(k => winner.location.dna[k] > loser.location.dna[k])
    .map(k => {
      const cat = DNA_CATEGORIES.find(c => c.key === k)!
      return `${cat.label} (${winner.location.dna[k]} vs ${loser.location.dna[k]})`
    })

  if (advantages.length === 0) {
    return `${winner.location.name} has a slight overall edge on your ${priorityLabel} priorities.`
  }
  if (advantages.length === 1) {
    return `On your ${priorityLabel} priorities, ${winner.location.name} leads on ${advantages[0]}.`
  }
  const last = advantages[advantages.length - 1]
  const rest = advantages.slice(0, -1)
  return `On your ${priorityLabel} priorities, ${winner.location.name} leads — notably ${rest.join(', ')} and ${last}.`
}

function matchScoreConfig(score: number): { label: string; color: string; bg: string } {
  if (score >= 88) return { label: 'Exceptional Match', color: '#2D7D4E', bg: '#E8F5EE' }
  if (score >= 78) return { label: 'Excellent Match',   color: '#1A6B3C', bg: '#F0FAF4' }
  if (score >= 67) return { label: 'Strong Match',      color: '#B8912A', bg: 'rgba(184,145,42,0.12)' }
  if (score >= 55) return { label: 'Good Match',        color: '#7A6420', bg: 'rgba(184,145,42,0.08)' }
  return                   { label: 'Potential Match',  color: '#6B7280', bg: '#F3F4F6' }
}

// Which index/indices in a row of values is "winning" — lower-is-better for
// cost/time figures, higher-is-better for scores. Ties win together (matches
// the original cityA/cityB behavior, where an exact tie highlighted neither —
// preserved here via strict < / > comparisons against the best value).
function bestIndices(values: number[], lowerIsBetter: boolean): boolean[] {
  if (values.length === 0) return []
  const best = lowerIsBetter ? Math.min(...values) : Math.max(...values)
  const count = values.filter(v => v === best).length
  if (count === values.length) return values.map(() => false) // every column ties — nobody "wins"
  return values.map(v => v === best)
}

// Consistent (N+1)-column layout: label | city 1 | city 2 | ... | city N.
// Used in both the header and every data row so the vertical dividers land
// at exactly the same x-positions from top to bottom.
const CITY_COL_W = 150 // px — wide enough for long city names, tuned for N=2
const DIVIDER_PAD = 12  // px — breathing room on each side of each divider

const COL_LABEL: React.CSSProperties = { flex: '1 1 0', minWidth: 0 }

function cityColStyle(index: number, total: number, borderColor: string): React.CSSProperties {
  const isLast = index === total - 1
  return {
    width: CITY_COL_W,
    flexShrink: 0,
    paddingLeft: index === 0 ? 0 : DIVIDER_PAD,
    paddingRight: isLast ? 0 : DIVIDER_PAD,
    borderRight: isLast ? undefined : `2px solid ${borderColor}`,
    textAlign: 'right',
  }
}

const HEADER_BG = '#60B8FF'
const HDR_TEXT  = 'rgba(8,16,28,0.85)'
const HDR_MUTED = 'rgba(8,16,28,0.5)'
const HDR_DIVIDER = 'rgba(8,16,28,0.22)'
const BODY_DIVIDER = '#D1D5DB'

type DlState = 'idle' | 'loading' | 'done' | 'error'

export default function CompareModal({ cities, profile, totalFunds, interestRate, loanTerm, originState, originCity, onClose }: CompareModalProps) {
  const [dlState, setDlState] = React.useState<DlState>('idle')

  const priorityCats = [
    ...profile.mustHaves.map(k => ({ key: k, tag: 'Must Have', tagColor: '#1A5FA8', tagBg: '#EBF3FB' })),
    ...profile.niceToHaves.map(k => ({ key: k, tag: 'Important', tagColor: '#6B7280', tagBg: '#F7F6F3' })),
  ]

  const summary = cities.length === 2 ? getSummary(cities[0], cities[1], profile) : ''

  async function handleDownload() {
    setDlState('loading')
    try {
      const [{ pdf }, { createComparisonReportDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../../services/pdfService'),
      ])
      const generatedDate = new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
      const doc = createComparisonReportDocument({
        cities, profile, totalFunds, interestRate, loanTerm, originState, originCity, summary, generatedDate,
      })
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `HavenQuest-Comparison-${cities.map(c => c.location.name).join('-vs-')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setDlState('done')
    } catch {
      setDlState('error')
    } finally {
      setTimeout(() => setDlState('idle'), 3000)
    }
  }

  if (cities.length < 2) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '92vh', boxShadow: '0 -4px 40px rgba(0,0,0,0.28)' }}
      >
        {/* ── Hero-blue header ─────────────────────────────── */}
        <div className="px-6 pt-5 pb-5 shrink-0" style={{ backgroundColor: HEADER_BG }}>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'rgba(8,16,28,0.12)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(8,16,28,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(8,16,28,0.12)')}
          >
            <X size={14} style={{ color: HDR_TEXT }} />
          </button>

          {/*
            (N+1)-column grid — same proportions as body rows.
            Col 1 (flex): eyebrow label
            Col 2..N+1 (150 px each): one city per column
          */}
          <div className="flex items-start">
            <div style={COL_LABEL} className="pr-3">
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: HDR_MUTED }}
              >
                City Comparison
              </p>
              <div className="w-8 h-[2px]" style={{ backgroundColor: '#B8912A' }} />
            </div>

            {cities.map((city, i) => {
              const cfg = matchScoreConfig(city.matchScore)
              return (
                <div key={city.location.id} style={cityColStyle(i, cities.length, HDR_DIVIDER)}>
                  <p className="font-bold text-[17px] leading-tight truncate mb-0.5" style={{ color: HDR_TEXT }}>
                    {city.location.name}
                  </p>
                  <p className="text-[11px] mb-3" style={{ color: HDR_MUTED }}>
                    {city.location.county} County, TX
                  </p>
                  <div className="flex justify-end">
                    <div
                      className="inline-flex items-baseline gap-1.5 px-2.5 py-1.5 rounded-lg"
                      style={{ backgroundColor: cfg.bg }}
                    >
                      <span className="text-xl font-bold tabular-nums leading-none" style={{ color: cfg.color }}>
                        {city.matchScore}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color, opacity: 0.8 }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Affordability */}
          <section>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Affordability</p>
            <div>
              {([
                { label: 'Est. monthly housing', get: (c: CityMatch) => c.estimatedMonthlyHousing },
                { label: 'Est. monthly total',   get: (c: CityMatch) => c.estimatedMonthlyTotal },
              ]).map(row => {
                const values = cities.map(row.get)
                const wins = bestIndices(values, true)
                return (
                  <div key={row.label} className="flex items-center py-2.5 border-b border-gray-50">
                    <span className="text-xs text-gray-500 truncate" style={COL_LABEL}>{row.label}</span>
                    {cities.map((city, i) => (
                      <span
                        key={city.location.id}
                        className={`text-xs tabular-nums ${wins[i] ? 'font-bold text-gray-900' : 'text-gray-400'}`}
                        style={cityColStyle(i, cities.length, BODY_DIVIDER)}
                      >
                        {formatCurrency(values[i])}
                      </span>
                    ))}
                  </div>
                )
              })}

              <div className="flex items-center py-2.5 border-b border-gray-50">
                <span className="text-xs text-gray-500" style={COL_LABEL}>Housing burden</span>
                {cities.map((city, i) => (
                  <div key={city.location.id} style={cityColStyle(i, cities.length, BODY_DIVIDER)} className="flex justify-end">
                    {city.affordabilityFlag ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-500">
                        <AlertTriangle size={11} /> &gt;40%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <CheckCircle size={11} /> OK
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Your priorities */}
          {priorityCats.length > 0 && (
            <section>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Your priorities</p>
              <div>
                {priorityCats.map(({ key, tag, tagColor, tagBg }) => {
                  const cat = DNA_CATEGORIES.find(c => c.key === key)!
                  const Icon = DNA_CATEGORY_ICONS[key]
                  const values = cities.map(c => c.location.dna[key])
                  const wins = bestIndices(values, false)
                  return (
                    <div key={key} className="flex items-center py-2.5 border-b border-gray-50">
                      <div className="flex items-center gap-1.5 min-w-0 truncate" style={COL_LABEL}>
                        <Icon size={12} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-600 truncate">{cat.label}</span>
                        <span
                          className="text-[9px] font-bold px-1 py-0.5 rounded shrink-0 hidden sm:inline"
                          style={{ backgroundColor: tagBg, color: tagColor }}
                        >
                          {tag}
                        </span>
                      </div>
                      {cities.map((city, i) => (
                        <span
                          key={city.location.id}
                          className={`text-xs tabular-nums ${wins[i] ? 'font-bold' : 'text-gray-400'}`}
                          style={{ ...cityColStyle(i, cities.length, BODY_DIVIDER), color: wins[i] ? getScoreColor(values[i]) : undefined }}
                        >
                          {values[i]}/10
                        </span>
                      ))}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Market & Schools */}
          <section>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Market & Schools</p>
            <div>
              <div className="flex items-center py-2.5 border-b border-gray-50">
                <span className="text-xs text-gray-500" style={COL_LABEL}>Market</span>
                {cities.map((city, i) => (
                  <span key={city.location.id} className="text-xs text-gray-700" style={cityColStyle(i, cities.length, BODY_DIVIDER)}>
                    {city.location.market.marketCondition.replace(' Market', '')}
                  </span>
                ))}
              </div>

              <div className="flex items-center py-2.5 border-b border-gray-50">
                <span className="text-xs text-gray-500" style={COL_LABEL}>Days on market</span>
                {(() => {
                  const values = cities.map(c => c.location.market.daysOnMarket)
                  const wins = bestIndices(values, true)
                  return cities.map((city, i) => (
                    <span
                      key={city.location.id}
                      className={`text-xs tabular-nums ${wins[i] ? 'font-bold text-gray-900' : 'text-gray-400'}`}
                      style={cityColStyle(i, cities.length, BODY_DIVIDER)}
                    >
                      {values[i]}d
                    </span>
                  ))
                })()}
              </div>

              <div className="flex items-center py-2.5 border-b border-gray-50">
                <span className="text-xs text-gray-500" style={COL_LABEL}>School (TEA)</span>
                {cities.map((city, i) => (
                  <span key={city.location.id} className="text-xs font-semibold text-gray-700" style={cityColStyle(i, cities.length, BODY_DIVIDER)}>
                    {city.location.school.teaRating}
                  </span>
                ))}
              </div>

              <div className="flex items-center py-2.5">
                <span className="text-xs text-gray-500" style={COL_LABEL}>District</span>
                {cities.map((city, i) => (
                  <span key={city.location.id} className="text-xs text-gray-500 truncate" style={cityColStyle(i, cities.length, BODY_DIVIDER)}>
                    {city.location.school.primaryISD}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Summary — pairwise only, see getSummary */}
          {summary && (
            <div className="rounded-xl px-4 py-3.5" style={{ backgroundColor: '#08101C' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Bottom line
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {summary}
              </p>
            </div>
          )}

          {/* Download comparison report */}
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={dlState === 'loading'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50"
              style={{
                borderColor: dlState === 'error' ? '#E05252' : dlState === 'done' ? '#4CAF50' : '#B8912A',
                color: dlState === 'error' ? '#E05252' : dlState === 'done' ? '#4CAF50' : '#B8912A',
                backgroundColor: 'transparent',
              }}
            >
              <Download size={13} />
              {dlState === 'loading' ? 'Generating…' : dlState === 'done' ? 'Downloaded!' : dlState === 'error' ? 'Failed' : 'Download Comparison Report'}
            </button>
          </div>

          <div className="h-2" />
        </div>
      </div>
    </div>
  )
}
