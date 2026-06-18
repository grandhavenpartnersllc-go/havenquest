'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { NAVY, BLUE } from '../quizTheme'

interface Card1HouseholdProps {
  initialValue?: number
  onComplete: (householdSize: number) => void
  onChangeJourney: () => void
}

export default function Card1Household({ initialValue, onComplete, onChangeJourney }: Card1HouseholdProps) {
  const [size, setSize] = useState<number | null>(initialValue ?? null)

  const display = (n: number) => (n >= 8 ? '8+' : String(n))

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
          Tell us about your household.
        </h1>
        <p className="text-gray-500 mb-8">This helps us find communities that fit your family&apos;s needs.</p>

        <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Number of people in your household</p>
        <div className="flex items-center justify-center gap-6 mb-10">
          <button
            type="button"
            onClick={() => setSize(s => Math.max(1, (s ?? 1) - 1))}
            disabled={size === null}
            className="w-11 h-11 rounded-full border-2 flex items-center justify-center disabled:opacity-30"
            style={{ borderColor: NAVY, color: NAVY }}
          >
            <Minus size={18} />
          </button>
          <span className="text-3xl font-bold w-16 text-center" style={{ color: NAVY }}>
            {size === null ? '—' : display(size)}
          </span>
          <button
            type="button"
            onClick={() => setSize(s => Math.min(10, (s ?? 0) + 1))}
            className="w-11 h-11 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: NAVY, color: NAVY }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={size === null}
        onClick={() => size !== null && onComplete(size)}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mb-4"
        style={{ backgroundColor: BLUE, color: '#FFFFFF' }}
      >
        Continue
      </button>

      <button
        type="button"
        onClick={onChangeJourney}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Change journey type
      </button>
    </div>
  )
}
