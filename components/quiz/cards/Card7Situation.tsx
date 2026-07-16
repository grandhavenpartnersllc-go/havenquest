'use client'

import { useState } from 'react'
import ButtonSelectRow from '../ButtonSelectRow'
import { NAVY } from '../quizTheme'
import CardShell, { PILL_CLASS } from '../CardShell'
import type { EntryPath } from '../../../utils/quizFlow'
import type { MoveTimelineValue } from '../../../utils/quizProfileMapping'

const HOME_STATUS_OPTIONS = [
  { value: 'renting', label: 'Renting' },
  { value: 'selling', label: "I own and I'm selling" },
  { value: 'keeping', label: "I own and I'm keeping it" },
  { value: 'other', label: 'Other / Not sure' },
]

const TIMELINE_OPTIONS: { value: MoveTimelineValue; label: string }[] = [
  { value: '0-3months', label: 'Within 3 months' },
  { value: '3-6months', label: '3–6 months' },
  { value: '6-12months', label: '6–12 months' },
  { value: '12plus', label: 'More than a year' },
  { value: 'exploring', label: 'Just exploring for now' },
]

interface Card7SituationProps {
  initialValue?: { homeStatus: string; moveTimeline: MoveTimelineValue }
  path: EntryPath
  onComplete: (homeStatus: string, moveTimeline: MoveTimelineValue) => void
  onBack?: () => void
}

export default function Card7Situation({ initialValue, path, onComplete, onBack }: Card7SituationProps) {
  const [homeStatus, setHomeStatus] = useState<string | null>(initialValue?.homeStatus ?? null)
  const [timeline, setTimeline] = useState<MoveTimelineValue | null>(initialValue?.moveTimeline ?? null)

  return (
    <CardShell
      eyebrow="Where You Are"
      title={path === 'instate' ? 'Your Current Texas Situation' : 'Where are you in your move?'}
      onBack={onBack}
      next={
        <button
          type="button"
          disabled={!homeStatus || !timeline}
          onClick={() => homeStatus && timeline && onComplete(homeStatus, timeline)}
          className={PILL_CLASS}
        >
          Continue
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Current home status</p>
          <ButtonSelectRow options={HOME_STATUS_OPTIONS} selected={homeStatus} onSelect={setHomeStatus} layout="wrap" />
        </div>

        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Move timeline</p>
          <ButtonSelectRow
            options={TIMELINE_OPTIONS}
            selected={timeline}
            onSelect={v => setTimeline(v as MoveTimelineValue)}
            layout="wrap"
          />
        </div>
      </div>
    </CardShell>
  )
}
