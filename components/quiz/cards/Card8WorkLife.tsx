'use client'

import { useState } from 'react'
import OptionCard from '../OptionCard'
import { NAVY, BLUE } from '../quizTheme'
import { Laptop, Shuffle, Building2, Sunrise, HelpCircle } from 'lucide-react'

const OPTIONS = [
  { value: 'remote', icon: Laptop, label: "Fully remote — I can work from anywhere" },
  { value: 'hybrid', icon: Shuffle, label: "Hybrid — I'm in the office a few days a week" },
  { value: 'commuter', icon: Building2, label: 'I need daily access to a major employment center' },
  { value: 'retiring', icon: Sunrise, label: 'Retiring or semi-retired' },
] as const

interface Card8WorkLifeProps {
  initialValue?: string
  onComplete: (workSituation: string) => void
}

export default function Card8WorkLife({ initialValue, onComplete }: Card8WorkLifeProps) {
  const [selected, setSelected] = useState<string | null>(initialValue ?? null)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
        How does work fit into your move?
      </h1>
      <p className="text-gray-500 mb-8">
        This helps us factor commute and location flexibility into your matches.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            title={opt.label}
            selected={selected === opt.value}
            onClick={() => setSelected(opt.value)}
          />
        ))}
      </div>
      <div className="mb-8">
        <OptionCard
          icon={HelpCircle}
          title="Not sure yet"
          selected={selected === 'unsure'}
          onClick={() => setSelected('unsure')}
        />
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onComplete(selected)}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: BLUE, color: '#FFFFFF' }}
      >
        Continue
      </button>
    </div>
  )
}
