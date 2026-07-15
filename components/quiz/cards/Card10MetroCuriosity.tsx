'use client'

import { useState } from 'react'
import OptionCard from '../OptionCard'
import { NAVY, GOLD } from '../quizTheme'
import CardEyebrow from '../CardEyebrow'

const AREAS = ['Dallas–Fort Worth', 'Austin', 'Houston', 'San Antonio'] as const
const NO_PREFERENCE = 'No preference — show me the best match'

interface Card10MetroCuriosityProps {
  initialValue?: string[]
  onComplete: (selectedMetros: string[]) => void
}

export default function Card10MetroCuriosity({ initialValue, onComplete }: Card10MetroCuriosityProps) {
  const [selected, setSelected] = useState<string[]>(initialValue ?? [])
  const [noPreference, setNoPreference] = useState(initialValue !== undefined && initialValue.length === 0)

  const toggleArea = (area: string) => {
    setNoPreference(false)
    setSelected(prev => (prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]))
  }

  const selectNoPreference = () => {
    setNoPreference(true)
    setSelected([])
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <CardEyebrow>Texas Areas</CardEyebrow>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
        Are there any Texas areas you&apos;re already drawn to?
      </h1>
      <p className="text-gray-500 mb-8">Optional — skip if you&apos;re open to anywhere.</p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {AREAS.map(area => (
          <OptionCard key={area} title={area} selected={selected.includes(area)} onClick={() => toggleArea(area)} />
        ))}
      </div>
      <div className="mb-8">
        <OptionCard title={NO_PREFERENCE} selected={noPreference} onClick={selectNoPreference} />
      </div>

      <button
        type="button"
        disabled={selected.length === 0 && !noPreference}
        onClick={() => onComplete(selected)}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mb-3"
        style={{ backgroundColor: GOLD, color: NAVY }}
      >
        Continue
      </button>
      <button
        type="button"
        onClick={() => onComplete([])}
        className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        Skip — show me all of Texas
      </button>
    </div>
  )
}
