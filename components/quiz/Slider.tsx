'use client'

import { NAVY } from './quizTheme'

// Range-input track/thumb styling needs vendor pseudo-elements (::-webkit-slider-thumb,
// ::-moz-range-*). Turbopack/Lightning CSS drops those when they live in globals.css, so
// this is injected as a raw <style> that the build pipeline never touches. Brief 2 spec:
// 4px track, gold fill (set inline per value), 24px white thumb with 2px navy border.
const SLIDER_CSS = `
.hq-slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:3px;background:#ecebe6;outline:none}
.hq-slider::-webkit-slider-runnable-track{height:4px;border-radius:3px;background:transparent}
.hq-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;border-radius:50%;background:#fff;border:2px solid #081426;box-shadow:0 2px 6px rgba(8,20,38,.18);cursor:pointer;margin-top:-10px}
.hq-slider::-moz-range-track{height:4px;border-radius:3px;background:#ecebe6}
.hq-slider::-moz-range-progress{height:4px;border-radius:3px;background:#c9a961}
.hq-slider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:#fff;border:2px solid #081426;box-shadow:0 2px 6px rgba(8,20,38,.18);cursor:pointer}
`

interface SliderProps {
  leftLabel: string
  rightLabel: string
  value: number
  onChange: (value: number) => void
}

export default function Slider({ leftLabel, rightLabel, value, onChange }: SliderProps) {
  // gold-filled portion up to the current value (1–10), unfilled #ecebe6 after
  const pct = ((value - 1) / 9) * 100

  return (
    <div className="w-full max-w-md mx-auto">
      <style dangerouslySetInnerHTML={{ __html: SLIDER_CSS }} />
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="hq-slider hq-focus w-full mb-3"
        style={{
          background: `linear-gradient(to right, #C9A961 0%, #C9A961 ${pct}%, #ecebe6 ${pct}%, #ecebe6 100%)`,
        }}
      />
      <div className="flex justify-between text-sm font-medium" style={{ color: NAVY }}>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}
