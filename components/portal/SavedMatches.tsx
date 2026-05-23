'use client'

import { CityMatch } from '../../types'
import { formatCurrency } from '../../utils/formatting'

const GOLD = '#B8912A'
const WARM_DARK = '#1C1814'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

const RANK_LABELS = ['Top Pick', 'Runner-Up', 'Strong Alt']

interface SavedMatchesProps {
  matches: CityMatch[]
}

export default function SavedMatches({ matches }: SavedMatchesProps) {
  if (matches.length === 0) return null

  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {matches.map((match, i) => {
        const score = match.matchScore
        const isPrimary = i === 0

        return (
          <div
            key={match.location.id}
            className="rounded-2xl p-5 flex flex-col relative overflow-hidden"
            style={{
              backgroundColor: isPrimary ? WARM_DARK : CARD_BG,
              boxShadow: isPrimary
                ? `0 2px 4px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)`
                : CARD_SHADOW,
            }}
          >
            {isPrimary && (
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: GOLD }}
              />
            )}

            <div className="flex items-start justify-between mb-3">
              <span
                className="text-[10px] font-bold uppercase"
                style={{
                  color: isPrimary ? GOLD : '#9A8E82',
                  letterSpacing: '0.16em',
                }}
              >
                {RANK_LABELS[i] ?? `#${i + 1}`}
              </span>
              <span
                className="text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: isPrimary ? 'rgba(184,145,42,0.15)' : 'rgba(0,0,0,0.05)',
                  color: isPrimary ? GOLD : '#6B5F54',
                }}
              >
                {score}% match
              </span>
            </div>

            <h3
              className="text-[17px] font-bold tracking-tight mb-0.5"
              style={{ color: isPrimary ? '#EDE7DC' : WARM_DARK }}
            >
              {match.location.name}
            </h3>
            <p
              className="text-xs mb-4"
              style={{ color: isPrimary ? 'rgba(237,231,220,0.4)' : '#9A8E82' }}
            >
              {match.location.county} County, TX
            </p>

            <p
              className="text-xs mb-5 mt-auto"
              style={{ color: isPrimary ? 'rgba(237,231,220,0.5)' : '#9A8E82' }}
            >
              Est. {formatCurrency(match.estimatedMonthlyTotal)}/mo all-in
            </p>

            <a
              href={`#report-${match.location.id}`}
              className="text-xs font-bold transition-opacity flex items-center gap-1"
              style={{ color: isPrimary ? GOLD : '#B8912A' }}
            >
              Jump to full report ↓
            </a>
          </div>
        )
      })}
    </div>
  )
}
