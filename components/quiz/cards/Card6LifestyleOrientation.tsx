'use client'

import { useState } from 'react'
import Slider from '../Slider'
import { NAVY, BLUE } from '../quizTheme'

interface Card6LifestyleOrientationProps {
  initialValue?: number
  onComplete: (lifestyleOrientation: number) => void
}

export default function Card6LifestyleOrientation({ initialValue, onComplete }: Card6LifestyleOrientationProps) {
  const [value, setValue] = useState(initialValue ?? 5)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-10" style={{ color: NAVY }}>
        How would you describe your ideal lifestyle?
      </h1>

      <div className="mb-10">
        <Slider leftLabel="Practical & Comfortable" rightLabel="Upscale & Aspirational" value={value} onChange={setValue} />
      </div>

      <button
        type="button"
        onClick={() => onComplete(value)}
        className="w-full py-3.5 rounded-xl font-bold text-sm"
        style={{ backgroundColor: BLUE, color: '#FFFFFF' }}
      >
        Continue
      </button>
    </div>
  )
}
