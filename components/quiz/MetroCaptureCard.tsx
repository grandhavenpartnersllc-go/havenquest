'use client'

import { useState } from 'react'
import OptionCard from './OptionCard'
import CardShell, { PILL_CLASS } from './CardShell'

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
    <CardShell
      title="Which Texas area are you focused on?"
      next={
        <button
          type="button"
          disabled={!selected}
          onClick={() => selected && onComplete(selected)}
          className={PILL_CLASS}
        >
          Continue
        </button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {METRO_CAPTURE_OPTIONS.map(opt => (
          <OptionCard key={opt} title={opt} selected={selected === opt} onClick={() => setSelected(opt)} />
        ))}
      </div>
    </CardShell>
  )
}
