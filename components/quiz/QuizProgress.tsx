'use client'

import { NAVY, GOLD, LINE, MUTED } from './quizTheme'

interface QuizProgressProps {
  current: number
  total: number
}

// Step label + a row of dots. Dot count is driven entirely by `total`, which the
// driver computes per entry path via getProgressLabel (5 on the exploring path, 10
// otherwise) — never a hardcoded number. Dot states per the reskin brief: --line by
// default, gold when done, navy at scale(1.25) when current.
export default function QuizProgress({ current, total }: QuizProgressProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: MUTED,
            fontWeight: 600,
          }}
        >
          Step {current} of {total}
        </span>
        <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
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
                  transition: 'all .35s ease',
                  display: 'inline-block',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
