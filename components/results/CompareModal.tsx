'use client'

import React from 'react'
import { CityMatch, UserProfile } from '../../types'
import { LIFESTYLE_CATEGORIES } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatting'
import { getScoreColor } from '../../utils/scoring'
import { CATEGORY_ICONS } from '../../utils/categoryIcons'
import { X, AlertTriangle, CheckCircle, Download } from 'lucide-react'

interface CompareModalProps {
  cityA: CityMatch
  cityB: CityMatch
  profile: UserProfile
  onClose: () => void
}

function getSummary(cityA: CityMatch, cityB: CityMatch, profile: UserProfile): string {
  const primaryKeys = profile.mustHaves.length > 0 ? profile.mustHaves : profile.niceToHaves
  const priorityLabel = profile.mustHaves.length > 0 ? 'must-have' : 'important'

  if (primaryKeys.length === 0) return ''

  const sumA = primaryKeys.reduce((s, k) => s + cityA.location.scores[k], 0)
  const sumB = primaryKeys.reduce((s, k) => s + cityB.location.scores[k], 0)
  const avgDiff = Math.abs(sumA - sumB) / primaryKeys.length

  if (avgDiff < 1) {
    return `Both cities perform similarly on your ${priorityLabel} priorities — the choice likely comes down to cost and personal feel.`
  }

  const winner = sumA > sumB ? cityA : cityB
  const loser = sumA > sumB ? cityB : cityA

  const advantages = primaryKeys
    .filter(k => winner.location.scores[k] > loser.location.scores[k])
    .map(k => {
      const cat = LIFESTYLE_CATEGORIES.find(c => c.key === k)!
      return `${cat.label} (${winner.location.scores[k]} vs ${loser.location.scores[k]})`
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

// Consistent 3-column layout: label | city A | city B
// Used in both the header and every data row so the vertical divider
// lands at exactly the same x-position from top to bottom.
const CITY_COL_W = 150 // px — wide enough for long city names
const DIVIDER_PAD = 12  // px — breathing room on each side of the divider

const COL_LABEL: React.CSSProperties = { flex: '1 1 0', minWidth: 0 }

// City A: right-aligned values, right-border = the divider
const COL_A: React.CSSProperties = {
  width: CITY_COL_W,
  flexShrink: 0,
  paddingRight: DIVIDER_PAD,
  borderRight: '2px solid #D1D5DB',
  textAlign: 'right',
}

// City B: right-aligned values, left-padded after the divider
const COL_B: React.CSSProperties = {
  width: CITY_COL_W,
  flexShrink: 0,
  paddingLeft: DIVIDER_PAD,
  textAlign: 'right',
}

// Same widths for the header, different divider colour (dark-on-blue)
const HDR_A: React.CSSProperties = {
  ...COL_A,
  borderRight: '2px solid rgba(8,16,28,0.22)',
}
const HDR_B: React.CSSProperties = {
  ...COL_B,
}

const HEADER_BG = '#60B8FF'
const HDR_TEXT  = 'rgba(8,16,28,0.85)'
const HDR_MUTED = 'rgba(8,16,28,0.5)'

type DlState = 'idle' | 'loading' | 'done' | 'error'

export default function CompareModal({ cityA, cityB, profile, onClose }: CompareModalProps) {
  const [dlState, setDlState] = React.useState<DlState>('idle')

  const priorityCats = [
    ...profile.mustHaves.map(k => ({ key: k, tag: 'Must Have', tagColor: '#1A5FA8', tagBg: '#EBF3FB' })),
    ...profile.niceToHaves.map(k => ({ key: k, tag: 'Important', tagColor: '#6B7280', tagBg: '#F7F6F3' })),
  ]

  const summary = getSummary(cityA, cityB, profile)
  const cfgA = matchScoreConfig(cityA.matchScore)
  const cfgB = matchScoreConfig(cityB.matchScore)

  async function handleDownload() {
    setDlState('loading')
    try {
      const [{ pdf }, { createCompareDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../../services/pdfService'),
      ])
      const generatedDate = new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
      const doc = createCompareDocument({ cityA, cityB, profile, summary, generatedDate })
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `HavenQuest-${cityA.location.name}-vs-${cityB.location.name}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setDlState('done')
    } catch {
      setDlState('error')
    } finally {
      setTimeout(() => setDlState('idle'), 3000)
    }
  }

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
            3-column grid — same proportions as body rows.
            Col 1 (flex): eyebrow label
            Col 2 (150 px): city A — left-aligned, right-border divider
            Col 3 (150 px): city B — right-aligned
          */}
          <div className="flex items-start">
            {/* Col 1: label */}
            <div style={COL_LABEL} className="pr-3">
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: HDR_MUTED }}
              >
                City Comparison
              </p>
              <div className="w-8 h-[2px]" style={{ backgroundColor: '#B8912A' }} />
            </div>

            {/* Col 2: city A */}
            <div style={HDR_A}>
              <p className="font-bold text-[17px] leading-tight truncate mb-0.5" style={{ color: HDR_TEXT }}>
                {cityA.location.name}
              </p>
              <p className="text-[11px] mb-3" style={{ color: HDR_MUTED }}>
                {cityA.location.county} County, TX
              </p>
              <div className="flex justify-end">
                <div
                  className="inline-flex items-baseline gap-1.5 px-2.5 py-1.5 rounded-lg"
                  style={{ backgroundColor: cfgA.bg }}
                >
                  <span className="text-xl font-bold tabular-nums leading-none" style={{ color: cfgA.color }}>
                    {cityA.matchScore}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfgA.color, opacity: 0.8 }}>
                    {cfgA.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Col 3: city B — right-aligned */}
            <div style={HDR_B}>
              <p className="font-bold text-[17px] leading-tight truncate mb-0.5" style={{ color: HDR_TEXT }}>
                {cityB.location.name}
              </p>
              <p className="text-[11px] mb-3" style={{ color: HDR_MUTED }}>
                {cityB.location.county} County, TX
              </p>
              <div className="flex justify-end">
                <div
                  className="inline-flex items-baseline gap-1.5 px-2.5 py-1.5 rounded-lg"
                  style={{ backgroundColor: cfgB.bg }}
                >
                  <span className="text-xl font-bold tabular-nums leading-none" style={{ color: cfgB.color }}>
                    {cityB.matchScore}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfgB.color, opacity: 0.8 }}>
                    {cfgB.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Affordability */}
          <section>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Affordability</p>
            <div>
              {[
                { label: 'Est. monthly housing', a: cityA.estimatedMonthlyHousing, b: cityB.estimatedMonthlyHousing, fmt: formatCurrency },
                { label: 'Est. monthly total',   a: cityA.estimatedMonthlyTotal,   b: cityB.estimatedMonthlyTotal,   fmt: formatCurrency },
              ].map(row => {
                const aWins = row.a < row.b
                const bWins = row.b < row.a
                return (
                  <div key={row.label} className="flex items-center py-2.5 border-b border-gray-50">
                    <span className="text-xs text-gray-500 truncate" style={COL_LABEL}>{row.label}</span>
                    <span
                      className={`text-xs tabular-nums ${aWins ? 'font-bold text-gray-900' : 'text-gray-400'}`}
                      style={COL_A}
                    >
                      {row.fmt(row.a)}
                    </span>
                    <span
                      className={`text-xs tabular-nums ${bWins ? 'font-bold text-gray-900' : 'text-gray-400'}`}
                      style={COL_B}
                    >
                      {row.fmt(row.b)}
                    </span>
                  </div>
                )
              })}

              <div className="flex items-center py-2.5 border-b border-gray-50">
                <span className="text-xs text-gray-500" style={COL_LABEL}>Housing burden</span>
                {([cityA, cityB] as const).map((city, i) => (
                  <div key={city.location.id} style={i === 0 ? COL_A : COL_B} className="flex justify-end">
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
                  const cat = LIFESTYLE_CATEGORIES.find(c => c.key === key)!
                  const Icon = CATEGORY_ICONS[key]
                  const scoreA = cityA.location.scores[key]
                  const scoreB = cityB.location.scores[key]
                  const aWins = scoreA > scoreB
                  const bWins = scoreB > scoreA
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
                      <span
                        className={`text-xs tabular-nums ${aWins ? 'font-bold' : 'text-gray-400'}`}
                        style={{ ...COL_A, color: aWins ? getScoreColor(scoreA) : undefined }}
                      >
                        {scoreA}/10
                      </span>
                      <span
                        className={`text-xs tabular-nums ${bWins ? 'font-bold' : 'text-gray-400'}`}
                        style={{ ...COL_B, color: bWins ? getScoreColor(scoreB) : undefined }}
                      >
                        {scoreB}/10
                      </span>
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
                <span className="text-xs text-gray-700" style={COL_A}>
                  {cityA.location.market.marketCondition.replace(' Market', '')}
                </span>
                <span className="text-xs text-gray-700" style={COL_B}>
                  {cityB.location.market.marketCondition.replace(' Market', '')}
                </span>
              </div>

              <div className="flex items-center py-2.5 border-b border-gray-50">
                <span className="text-xs text-gray-500" style={COL_LABEL}>Days on market</span>
                {([cityA, cityB] as const).map((city, i) => {
                  const dom = city.location.market.daysOnMarket
                  const other = (i === 0 ? cityB : cityA).location.market.daysOnMarket
                  const wins = dom < other
                  return (
                    <span
                      key={city.location.id}
                      className={`text-xs tabular-nums ${wins ? 'font-bold text-gray-900' : 'text-gray-400'}`}
                      style={i === 0 ? COL_A : COL_B}
                    >
                      {dom}d
                    </span>
                  )
                })}
              </div>

              <div className="flex items-center py-2.5 border-b border-gray-50">
                <span className="text-xs text-gray-500" style={COL_LABEL}>School (TEA)</span>
                <span className="text-xs font-semibold text-gray-700" style={COL_A}>
                  {cityA.location.school.teaRating}
                </span>
                <span className="text-xs font-semibold text-gray-700" style={COL_B}>
                  {cityB.location.school.teaRating}
                </span>
              </div>

              <div className="flex items-center py-2.5">
                <span className="text-xs text-gray-500" style={COL_LABEL}>District</span>
                <span className="text-xs text-gray-500 truncate" style={COL_A}>
                  {cityA.location.school.primaryISD}
                </span>
                <span className="text-xs text-gray-500 truncate" style={COL_B}>
                  {cityB.location.school.primaryISD}
                </span>
              </div>
            </div>
          </section>

          {/* Summary */}
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

          {/* Download comparison PDF */}
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
              {dlState === 'loading' ? 'Generating…' : dlState === 'done' ? 'Downloaded!' : dlState === 'error' ? 'Failed' : 'Download Comparison PDF'}
            </button>
          </div>

          <div className="h-2" />
        </div>
      </div>
    </div>
  )
}
