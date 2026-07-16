'use client'

import { useState } from 'react'
import Slider from '../Slider'
import CardShell, { PILL_CLASS } from '../CardShell'

interface Card6LifestyleOrientationProps {
  initialValue?: number
  onComplete: (lifestyleOrientation: number) => void
  onBack?: () => void
}

export default function Card6LifestyleOrientation({ initialValue, onComplete, onBack }: Card6LifestyleOrientationProps) {
  const [value, setValue] = useState(initialValue ?? 5)

  return (
    <CardShell
      eyebrow="The Feel"
      title="How would you describe your ideal lifestyle?"
      onBack={onBack}
      next={
        <button type="button" onClick={() => onComplete(value)} className={PILL_CLASS}>
          Continue
        </button>
      }
    >
      <div className="py-4">
        <Slider leftLabel="Practical & Comfortable" rightLabel="Upscale & Aspirational" value={value} onChange={setValue} />
      </div>
    </CardShell>
  )
}
