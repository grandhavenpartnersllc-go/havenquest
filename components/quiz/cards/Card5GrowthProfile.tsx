'use client'

import { useState } from 'react'
import Slider from '../Slider'
import CardShell, { PILL_CLASS } from '../CardShell'

interface Card5GrowthProfileProps {
  initialValue?: number
  onComplete: (growthProfile: number) => void
  onBack?: () => void
}

export default function Card5GrowthProfile({ initialValue, onComplete, onBack }: Card5GrowthProfileProps) {
  const [value, setValue] = useState(initialValue ?? 5)

  return (
    <CardShell
      eyebrow="The Feel"
      title="When it comes to your community, where do you land?"
      onBack={onBack}
      next={
        <button type="button" onClick={() => onComplete(value)} className={PILL_CLASS}>
          Continue
        </button>
      }
    >
      <div className="py-4">
        <Slider leftLabel="Established & Proven" rightLabel="Up-and-Coming & Growing" value={value} onChange={setValue} />
      </div>
    </CardShell>
  )
}
