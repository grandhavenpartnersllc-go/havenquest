'use client'

import { useState } from 'react'
import PhotoOptionCard from '../PhotoOptionCard'
import { NAVY, GOLD } from '../quizTheme'
import CardEyebrow from '../CardEyebrow'

const OPTIONS = [
  { key: 'town_square', label: 'Established / Town Square', image: '/images/quiz/town-square.jpg' },
  { key: 'suburban', label: 'Master-planned suburban neighborhood', image: '/images/quiz/suburban.jpg' },
  { key: 'urban', label: 'Urban skyline district', image: '/images/quiz/urban-skyline.jpg' },
  { key: 'acreage', label: 'Hill Country acreage', image: '/images/quiz/hill-country.jpg' },
  { key: 'lake_coastal', label: 'Lake or coastal living', image: '/images/quiz/lake-coastal.JPG' },
  { key: 'small_town', label: 'Quaint small-town living', image: '/images/quiz/small-town.JPG' },
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
  lake_coastal: { environment: 7, pace: 3, culture: 6 },
  small_town: { environment: 6, pace: 2, culture: 8 },
}

interface Card4CommunityFeelProps {
  initialValue?: string
  onComplete: (option: string, personality: PersonalityScores) => void
}

export default function Card4CommunityFeel({ initialValue, onComplete }: Card4CommunityFeelProps) {
  const [selected, setSelected] = useState<string | null>(initialValue ?? null)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <CardEyebrow>The Kind of Place</CardEyebrow>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
        Which of these feels most like the life you&apos;re looking for?
      </h1>
      <p className="text-gray-500 mb-8">Trust your instincts — there&apos;s no wrong answer.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {OPTIONS.map(opt => (
          <PhotoOptionCard
            key={opt.key}
            imageUrl={opt.image}
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
        style={{ backgroundColor: GOLD, color: NAVY }}
      >
        Continue
      </button>
    </div>
  )
}
