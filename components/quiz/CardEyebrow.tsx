'use client'

import type { ReactNode } from 'react'
import { GOLD } from './quizTheme'

// Small gold uppercase label above each card's h1 — the "eyebrow" tier of the reskin's
// eyebrow / h1 / sub type hierarchy. Themed per card; the numeric "Step X of Y" lives
// in QuizProgress above it.
export default function CardEyebrow({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <p
      style={{
        fontSize: '11px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: GOLD,
        fontWeight: 600,
        margin: '0 0 12px',
        textAlign: center ? 'center' : 'left',
      }}
    >
      {children}
    </p>
  )
}
