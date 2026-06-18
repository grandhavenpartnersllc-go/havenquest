'use client'

import { useState } from 'react'
import OptionCard from '../OptionCard'
import { NAVY, BLUE } from '../quizTheme'

const OPTIONS = [
  { key: 'town_square', icon: '🏛️', label: 'Historic town square' },
  { key: 'suburban', icon: '🏘️', label: 'Master-planned suburban neighborhood' },
  { key: 'urban', icon: '🌆', label: 'Urban skyline district' },
  { key: 'acreage', icon: '🌿', label: 'Hill Country acreage' },
] as const

export interface PersonalityScores {
  environment: number
  pace: number
  culture: number
}

export const PERSONALITY_MAP: Record<string, PersonalityScores> = {
  town_square: { environment: 4, pace: 3, culture: 8 },
  suburban: { environment: 5, pace: 5, culture: 7 },
  urban: { environment: 1, pace: 10, culture: 4 },
  acreage: { environment: 9, pace: 2, culture: 5 },
}

interface Card4CommunityFeelProps {
  onComplete: (option: string, personality: PersonalityScores) => void
}

export default function Card4CommunityFeel({ onComplete }: Card4CommunityFeelProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
        Which of these feels most like the life you&apos;re looking for?
      </h1>
      <p className="text-gray-500 mb-8">Trust your instincts — there&apos;s no wrong answer.</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.key}
            icon={opt.icon}
            title={opt.label}
            selected={selected === opt.key}
            onClick={() => setSelected(opt.key)}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onComplete(selected, PERSONALITY_MAP[selected])}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: BLUE, color: '#FFFFFF' }}
      >
        Continue
      </button>
    </div>
  )
}
