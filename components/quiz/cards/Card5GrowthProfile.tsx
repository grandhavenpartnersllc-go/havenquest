'use client'

import { useState } from 'react'
import Slider from '../Slider'
import { NAVY, BLUE } from '../quizTheme'

interface Card5GrowthProfileProps {
  onComplete: (growthProfile: number) => void
}

export default function Card5GrowthProfile({ onComplete }: Card5GrowthProfileProps) {
  const [value, setValue] = useState(5)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-10" style={{ color: NAVY }}>
        When it comes to your community, where do you land?
      </h1>

      <div className="mb-10">
        <Slider leftLabel="Established & Proven" rightLabel="Up-and-Coming & Growing" value={value} onChange={setValue} />
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
