'use client'

import type { ReactNode } from 'react'
import { NAVY, MUTED } from './quizTheme'
import CardEyebrow from './CardEyebrow'

// Discovery Intake template primitive (Brief 2). Wraps a card's question content in
// the shared frame: headline block (eyebrow / h1 / sub) -> optional white panel ->
// footer row (helper slot | Back + Next).
//
// The progress row is NOT here — it stays driver-rendered (QuizProgress) so there is
// exactly one per screen.
//
// CTA contract (Brief 2 Addendum, #6): the card's OWN advance button is passed in as
// `next` and placed in the footer as-is. It keeps its handler and disabled logic; the
// card applies the `hq-pill hq-focus` classes to it. The template never owns validation.
export const PILL_CLASS = 'hq-pill hq-focus'

interface CardShellProps {
  eyebrow: string
  title: string
  sub?: string
  /** false only for cards whose question is a full-bleed PhotoOptionCard grid (Card 2 photo path, Card 4). */
  panel?: boolean
  /** relocated helper text — rendered only when a card already had one (Card 9). Otherwise empty. */
  helper?: ReactNode
  /** relocated Back. Omitted -> the slot renders nothing (Card 1, MetroCaptureCard). */
  onBack?: () => void
  backLabel?: string
  /** the card's own advance button, already carrying its onClick/disabled and the pill classes. */
  next: ReactNode
  children: ReactNode
}

export default function CardShell({
  eyebrow,
  title,
  sub,
  panel = true,
  helper,
  onBack,
  backLabel = '← Back',
  next,
  children,
}: CardShellProps) {
  return (
    <div>
      <div style={{ margin: '2px 4px 14px' }}>
        <CardEyebrow>{eyebrow}</CardEyebrow>
        <h1
          style={{
            fontSize: 'clamp(22px, 2.8vw, 30px)',
            lineHeight: 1.15,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            margin: '0 0 7px',
            color: NAVY,
          }}
        >
          {title}
        </h1>
        {sub && (
          <p style={{ fontSize: '14px', fontWeight: 400, maxWidth: '640px', margin: 0, color: MUTED }}>
            {sub}
          </p>
        )}
      </div>

      {panel ? <div className="hq-panel">{children}</div> : children}

      <div className="hq-foot">
        <p className="hq-foot__helper">{helper}</p>
        <div className="hq-actions">
          {onBack && (
            <button type="button" className="hq-back hq-focus" onClick={onBack}>
              {backLabel}
            </button>
          )}
          {next}
        </div>
      </div>
    </div>
  )
}
