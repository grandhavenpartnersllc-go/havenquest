'use client'

import { useState } from 'react'
import OptionCard from '../OptionCard'
import CardShell, { PILL_CLASS } from '../CardShell'
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
  onBack?: () => void
}

export default function Card8WorkLife({ initialValue, onComplete, onBack }: Card8WorkLifeProps) {
  const [selected, setSelected] = useState<string | null>(initialValue ?? null)

  return (
    <CardShell
      eyebrow="Work & Life"
      title="How does work fit into your move?"
      sub="This helps us factor commute and location flexibility into your matches."
      onBack={onBack}
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
      <OptionCard
        icon={HelpCircle}
        title="Not sure yet"
        selected={selected === 'unsure'}
        onClick={() => setSelected('unsure')}
      />
    </CardShell>
  )
}
