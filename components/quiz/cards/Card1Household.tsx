'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { NAVY } from '../quizTheme'
import CardShell, { PILL_CLASS } from '../CardShell'

interface Card1HouseholdProps {
  initialValue?: number
  onComplete: (householdSize: number) => void
  onChangeJourney: () => void
}

export default function Card1Household({ initialValue, onComplete, onChangeJourney }: Card1HouseholdProps) {
  const [size, setSize] = useState<number | null>(initialValue ?? null)

  const display = (n: number) => (n >= 8 ? '8+' : String(n))

  return (
    <>
      <CardShell
        eyebrow="Your Household"
        title="Tell us about your household."
        sub="This helps us find communities that fit your family's needs."
        next={
          <button
            type="button"
            disabled={size === null}
            onClick={() => size !== null && onComplete(size)}
            className={PILL_CLASS}
          >
            Continue
          </button>
        }
      >
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Number of people in your household</p>
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => setSize(s => Math.max(1, (s ?? 1) - 1))}
              disabled={size === null}
              className="w-11 h-11 rounded-full border-2 flex items-center justify-center disabled:opacity-30 hq-focus"
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
              className="w-11 h-11 rounded-full border-2 flex items-center justify-center hq-focus"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </CardShell>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onChangeJourney}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors hq-focus"
        >
          ← Change journey type
        </button>
      </div>
    </>
  )
}
