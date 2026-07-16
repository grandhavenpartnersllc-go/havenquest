'use client'

import { NAVY, GOLD, LINE, MUTED } from './quizTheme'

interface QuizProgressProps {
  current: number
  total: number
}

// Progress row (Brief 2): sits below the navy header, inside the wrap, right-aligned.
// Label + dots. `total` is the real per-path count from getProgressLabel — never
// hardcoded. Dots: line by default, gold when done, navy at scale(1.25) when current.
export default function QuizProgress({ current, total }: QuizProgressProps) {
  return (
    <div className="w-full flex items-center justify-end gap-[10px] mb-6">
      <span
        style={{
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: MUTED,
        }}
      >
        Step {current} of {total}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        {Array.from({ length: total }).map((_, idx) => {
          const i = idx + 1
          const done = i < current
          const isCurrent = i === current
          return (
            <span
              key={i}
              aria-hidden
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: done ? GOLD : isCurrent ? NAVY : LINE,
                transform: isCurrent ? 'scale(1.25)' : 'scale(1)',
                transition: 'all 0.25s',
                display: 'inline-block',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
