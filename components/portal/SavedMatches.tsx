'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CityMatch, UserProfile } from '../../types'
import { DNA_CATEGORIES } from '../../utils/constants'
import { getScoreColor } from '../../utils/scoring'
import { DNA_CATEGORY_ICONS } from '../../utils/categoryIcons'
import { formatCurrency } from '../../utils/formatting'
import { ChevronDown, ChevronUp } from 'lucide-react'
import CompareModal from '../results/CompareModal'

const GOLD = '#B8912A'
const WARM_DARK = '#1C1814'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'
const RANK_LABELS = ['Top Pick', 'Runner-Up', 'Strong Alt']

function getTradeoffStatement(match: CityMatch, profile: UserProfile): string {
  const { location } = match

  const toScored = (key: string) => {
    const k = key as keyof typeof location.dna
    return {
      score: location.dna[k],
      label: DNA_CATEGORIES.find(c => c.key === k)?.label ?? key,
    }
  }

  for (const { keys, weightLabel, groupLabel } of [
    { keys: profile.mustHaves, weightLabel: 'must-have', groupLabel: 'must-haves' },
    { keys: profile.niceToHaves, weightLabel: 'important priority', groupLabel: 'important priorities' },
    { keys: profile.notPriorities, weightLabel: 'lower priority', groupLabel: 'lower priorities' },
  ]) {
    if (keys.length === 0) continue
    const scored = keys.map(k => toScored(k)).sort((a, b) => a.score - b.score)
    const worst = scored[0]

    if (worst.score < 5) {
      return `${worst.label} is a ${weightLabel} for you and scores ${worst.score}/10 in ${location.name} — a real tradeoff worth weighing.`
    }
    if (worst.score < 7) {
      return `${worst.label} is a ${weightLabel} for you and scores ${worst.score}/10 here — decent, but not a standout strength of ${location.name}.`
    }
    return `All your ${groupLabel} score well in ${location.name}. ${worst.label} is the lowest at ${worst.score}/10.`
  }

  return `${location.name} aligns with your stated priorities.`
}

interface MatchCardProps {
  match: CityMatch
  rank: number
  profile: UserProfile
  compareSelected: boolean
  onCompare: () => void
}

function MatchCard({ match, rank, profile, compareSelected, onCompare }: MatchCardProps) {
  const [whyOpen, setWhyOpen] = useState(false)
  const isPrimary = rank === 0

  const priorityGroups = [
    { label: 'Must Have', keys: profile.mustHaves },
    { label: 'Important', keys: profile.niceToHaves },
    { label: 'Not Priority', keys: profile.notPriorities },
  ].filter(g => g.keys.length > 0)

  const t = isPrimary
    ? {
        rankLabel: GOLD,
        scorePillBg: 'rgba(184,145,42,0.15)',
        scorePillText: GOLD,
        cityName: '#EDE7DC',
        metro: GOLD,
        county: 'rgba(237,231,220,0.4)',
        cost: 'rgba(237,231,220,0.5)',
        divider: 'rgba(255,255,255,0.08)',
        toggleText: 'rgba(237,231,220,0.45)',
        toggleHover: 'rgba(237,231,220,0.75)',
        groupLabel: 'rgba(237,231,220,0.4)',
        tagBg: 'rgba(255,255,255,0.07)',
        tagText: 'rgba(237,231,220,0.45)',
        icon: 'rgba(237,231,220,0.35)',
        catLabel: 'rgba(237,231,220,0.75)',
        barTrack: 'rgba(255,255,255,0.1)',
        tradeoffBg: 'rgba(255,255,255,0.06)',
        tradeoffText: 'rgba(237,231,220,0.5)',
        chipUnselBorder: 'rgba(184,145,42,0.4)',
        chipUnselText: GOLD,
        chipUnselBg: 'transparent',
      }
    : {
        rankLabel: '#9A8E82',
        scorePillBg: 'rgba(0,0,0,0.05)',
        scorePillText: '#6B5F54',
        cityName: WARM_DARK,
        metro: '#1A5FA8',
        county: '#9A8E82',
        cost: '#9A8E82',
        divider: '#F0EDE6',
        toggleText: '#9CA3AF',
        toggleHover: '#6B7280',
        groupLabel: '#9CA3AF',
        tagBg: '#F3F4F6',
        tagText: '#9CA3AF',
        icon: '#9CA3AF',
        catLabel: '#4B5563',
        barTrack: '#E5E7EB',
        tradeoffBg: '#F7F6F3',
        tradeoffText: '#6B7280',
        chipUnselBorder: '#E5E7EB',
        chipUnselText: '#9CA3AF',
        chipUnselBg: 'transparent',
      }

  return (
    <div
      className="rounded-2xl flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: isPrimary ? WARM_DARK : CARD_BG,
        boxShadow: isPrimary
          ? '0 2px 4px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
          : CARD_SHADOW,
      }}
    >
      {isPrimary && (
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: GOLD }} />
      )}

      {/* City image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-background-tertiary)' }}>
        <Image
          src={`/images/cities/${match.location.id}.jpg`}
          alt={`${match.location.name}, Texas`}
          fill
          className="object-cover"
          onError={(e) => { const t = e.target as HTMLImageElement; if (t.src !== window.location.origin + '/images/cities/default-tx.jpg') { t.src = '/images/cities/default-tx.jpg' } }}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-[10px] font-bold uppercase"
          style={{ color: t.rankLabel, letterSpacing: '0.16em' }}
        >
          {RANK_LABELS[rank] ?? `#${rank + 1}`}
        </span>
        <span
          className="text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full"
          style={{ backgroundColor: t.scorePillBg, color: t.scorePillText }}
        >
          {match.matchScore}% match
        </span>
      </div>

      <h3 className="text-[17px] font-bold tracking-tight mb-0.5" style={{ color: t.cityName }}>
        {match.location.name}
      </h3>
      <p className="text-xs mb-0.5 font-medium" style={{ color: t.metro }}>
        {match.location.metroUsed}
      </p>
      <p className="text-xs mb-4" style={{ color: t.county }}>
        {match.location.county} County, TX
      </p>

      <p className="text-xs mt-auto" style={{ color: t.cost }}>
        Est. {formatCurrency(match.estimatedMonthlyTotal)}/mo all-in
      </p>

      {/* Why this score? */}
      <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${t.divider}` }}>
        <button
          onClick={() => setWhyOpen(o => !o)}
          className="flex items-center gap-1.5 text-xs font-medium w-full text-left transition-colors"
          style={{ color: t.toggleText }}
          onMouseEnter={e => (e.currentTarget.style.color = t.toggleHover)}
          onMouseLeave={e => (e.currentTarget.style.color = t.toggleText)}
        >
          {whyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          Why this score?
        </button>

        {whyOpen && (
          <div className="mt-3 space-y-3.5">
            {priorityGroups.map(group => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: t.groupLabel }}
                  >
                    {group.label}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {group.keys.map(key => {
                    const cat = DNA_CATEGORIES.find(c => c.key === key)!
                    const Icon = DNA_CATEGORY_ICONS[key]
                    const score = match.location.dna[key]
                    const color = getScoreColor(score)
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <Icon size={12} strokeWidth={1.5} style={{ color: t.icon, flexShrink: 0 }} />
                        <span className="text-xs flex-1 truncate" style={{ color: t.catLabel }}>
                          {cat.label}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div
                            className="w-12 h-1 rounded-full overflow-hidden"
                            style={{ backgroundColor: t.barTrack }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${score * 10}%`, backgroundColor: color }}
                            />
                          </div>
                          <span
                            className="text-xs font-bold tabular-nums w-7 text-right"
                            style={{ color }}
                          >
                            {score}/10
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: t.tradeoffBg }}>
              <p className="text-xs leading-relaxed" style={{ color: t.tradeoffText }}>
                {getTradeoffStatement(match, profile)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer: compare chip */}
      <div
        className="flex items-center justify-end mt-3 pt-3"
        style={{ borderTop: `1px solid ${t.divider}` }}
      >
        <button
          onClick={onCompare}
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors"
          style={
            compareSelected
              ? { backgroundColor: GOLD, color: WARM_DARK, borderColor: GOLD }
              : { backgroundColor: t.chipUnselBg, color: t.chipUnselText, borderColor: t.chipUnselBorder }
          }
        >
          {compareSelected ? '✓ Selected' : '+ Compare'}
        </button>
      </div>

      </div>{/* end p-5 wrapper */}
    </div>
  )
}

interface SavedMatchesProps {
  matches: CityMatch[]
  profile: UserProfile
}

export default function SavedMatches({ matches, profile }: SavedMatchesProps) {
  const [compareIds, setCompareIds] = useState<string[]>([])
  const showCompare = compareIds.length === 2

  const toggleCompare = (cityId: string) => {
    setCompareIds(prev =>
      prev.includes(cityId)
        ? prev.filter(id => id !== cityId)
        : prev.length < 2 ? [...prev, cityId] : prev
    )
  }

  const cityA = matches.find(m => m.location.id === compareIds[0])
  const cityB = matches.find(m => m.location.id === compareIds[1])

  if (matches.length === 0) return null

  return (
    <>
      {compareIds.length === 1 && (
        <p className="text-xs text-center mb-3" style={{ color: '#9A8E82' }}>
          Select one more city to compare
        </p>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        {matches.slice(0, 3).map((match, i) => (
          <MatchCard
            key={match.location.id}
            match={match}
            rank={i}
            profile={profile}
            compareSelected={compareIds.includes(match.location.id)}
            onCompare={() => toggleCompare(match.location.id)}
          />
        ))}
      </div>

      {showCompare && cityA && cityB && (
        <CompareModal
          cities={[cityA, cityB]}
          profile={profile}
          totalFunds={0}
          interestRate={6.5}
          loanTerm={30}
          originState={null}
          originCity={null}
          onClose={() => setCompareIds([])}
        />
      )}
    </>
  )
}
