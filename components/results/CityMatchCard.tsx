'use client'

import { CityMatch } from '../../types'
import Image from 'next/image'
import MarketBadge from '../shared/MarketBadge'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CityMatchCardProps {
  match: CityMatch
  rank: number
  blurred?: boolean
}

function getScoreLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 88) return { label: 'Exceptional Match', color: '#2D7D4E', bg: '#E8F5EE' }
  if (score >= 78) return { label: 'Excellent Match',   color: '#1A6B3C', bg: '#F0FAF4' }
  if (score >= 67) return { label: 'Strong Match',      color: '#B8912A', bg: 'rgba(184,145,42,0.12)' }
  if (score >= 55) return { label: 'Good Match',        color: '#7A6420', bg: 'rgba(184,145,42,0.08)' }
  return                   { label: 'Potential Match',  color: '#6B7280', bg: '#F3F4F6' }
}

export default function CityMatchCard({ match, rank, blurred = false }: CityMatchCardProps) {
  const { location, matchScore, affordabilityFlag } = match

  const scoreConfig = getScoreLabel(matchScore)

  return (
    <div
      className={`card-match bg-white rounded-2xl border border-gray-100 overflow-hidden relative ${blurred ? 'blur-results' : ''}`}
    >
      {/* Score-colored top strip */}
      <div className="h-[3px]" style={{ backgroundColor: scoreConfig.color }} />

      {/* City image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-background-tertiary)' }}>
        <Image
          src={`/images/cities/${location.id}.jpg`}
          alt={`${location.name}, Texas`}
          fill
          className="object-cover"
          onError={(e) => { e.currentTarget.src = '/images/cities/placeholder.jpg' }}
        />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-gray-300 tracking-widest">#{rank}</span>
              <h3 className="font-bold text-gray-900 text-[17px] tracking-tight leading-snug">
                {location.name}
              </h3>
            </div>
            <p className="text-xs text-accent font-medium mt-0.5">{location.metroUsed}</p>
            <p className="text-xs text-gray-400 mt-0">{location.county} County, TX</p>
          </div>

          {/* Score pill */}
          <div className="rounded-xl px-3 py-2 text-center shrink-0 ml-3" style={{ backgroundColor: scoreConfig.bg }}>
            <div className="text-2xl font-bold tabular-nums leading-none" style={{ color: scoreConfig.color }}>
              {matchScore}
            </div>
            <div className="text-[9px] font-bold mt-0.5 uppercase tracking-wider" style={{ color: scoreConfig.color, opacity: 0.7 }}>
              {scoreConfig.label}
            </div>
          </div>
        </div>

        {/* Match bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${matchScore}%`, backgroundColor: scoreConfig.color }}
          />
        </div>

        {/* Market badge */}
        <div className="flex flex-wrap items-start gap-2 mb-3">
          <MarketBadge condition={location.market.marketCondition} />
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          {location.strengths[0]}
        </p>

        {affordabilityFlag && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 mb-3">
            <AlertTriangle size={13} className="text-orange-500 shrink-0" />
            <p className="text-xs text-orange-700">Housing may exceed 40% of monthly income</p>
          </div>
        )}

        <Link
          href={`/report/${location.id}`}
          className="flex items-center justify-between text-xs font-bold text-accent hover:text-[#154d8a] transition-colors group pt-3 border-t border-gray-100 mt-1"
        >
          <span>View full report</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
