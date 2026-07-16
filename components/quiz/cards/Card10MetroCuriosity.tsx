'use client'

import { useState } from 'react'
import OptionCard from '../OptionCard'
import CardShell, { PILL_CLASS } from '../CardShell'

const AREAS = ['Dallas–Fort Worth', 'Austin', 'Houston', 'San Antonio'] as const
const NO_PREFERENCE = 'No preference — show me the best match'

interface Card10MetroCuriosityProps {
  initialValue?: string[]
  onComplete: (selectedMetros: string[]) => void
  onBack?: () => void
}

export default function Card10MetroCuriosity({ initialValue, onComplete, onBack }: Card10MetroCuriosityProps) {
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
    <>
      <CardShell
        eyebrow="Texas Areas"
        title="Are there any Texas areas you're already drawn to?"
        sub="Optional — skip if you're open to anywhere."
        onBack={onBack}
        next={
          <button
            type="button"
            disabled={selected.length === 0 && !noPreference}
            onClick={() => onComplete(selected)}
            className={PILL_CLASS}
          >
            Continue
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-3 mb-3">
          {AREAS.map(area => (
            <OptionCard key={area} title={area} selected={selected.includes(area)} onClick={() => toggleArea(area)} />
          ))}
        </div>
        <OptionCard title={NO_PREFERENCE} selected={noPreference} onClick={selectNoPreference} />
      </CardShell>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => onComplete([])}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors hq-focus"
        >
          Skip — show me all of Texas
        </button>
      </div>
    </>
  )
}
