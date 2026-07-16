'use client'

import { useState } from 'react'
import PhotoOptionCard from '../PhotoOptionCard'
import CardShell, { PILL_CLASS } from '../CardShell'

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
  onBack?: () => void
}

export default function Card4CommunityFeel({ initialValue, onComplete, onBack }: Card4CommunityFeelProps) {
  const [selected, setSelected] = useState<string | null>(initialValue ?? null)

  return (
    <CardShell
      eyebrow="The Kind of Place"
      title="Which of these feels most like the life you're looking for?"
      sub="Trust your instincts — there's no wrong answer."
      panel={false}
      onBack={onBack}
      next={
        <button
          type="button"
          disabled={!selected}
          onClick={() => selected && onComplete(selected, PERSONALITY_MAP[selected])}
          className={PILL_CLASS}
        >
          Continue
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
    </CardShell>
  )
}
