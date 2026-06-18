'use client'

import { useState } from 'react'
import OptionCard from './OptionCard'
import { NAVY } from './quizTheme'

export const METRO_CAPTURE_OPTIONS = [
  'Austin',
  'Dallas–Fort Worth',
  'Houston',
  'San Antonio',
  'Hill Country',
  "I'm not sure yet",
] as const

export type MetroCaptureValue = typeof METRO_CAPTURE_OPTIONS[number]

interface MetroCaptureCardProps {
  onComplete: (metro: MetroCaptureValue) => void
}

export default function MetroCaptureCard({ onComplete }: MetroCaptureCardProps) {
  const [selected, setSelected] = useState<MetroCaptureValue | null>(null)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-8" style={{ color: NAVY }}>
        Which Texas area are you focused on?
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {METRO_CAPTURE_OPTIONS.map(opt => (
          <OptionCard key={opt} title={opt} selected={selected === opt} onClick={() => setSelected(opt)} />
        ))}
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onComplete(selected)}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#0076B6', color: '#FFFFFF' }}
      >
        Continue
      </button>
    </div>
  )
}
