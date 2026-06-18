'use client'

import { BLUE, NAVY } from './quizTheme'

interface SliderProps {
  leftLabel: string
  rightLabel: string
  value: number
  onChange: (value: number) => void
}

export default function Slider({ leftLabel, rightLabel, value, onChange }: SliderProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full mb-3"
        style={{ accentColor: BLUE }}
      />
      <div className="flex justify-between text-sm font-medium" style={{ color: NAVY }}>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}
