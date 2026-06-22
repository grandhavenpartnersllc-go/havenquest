'use client'

import { useEffect, useState } from 'react'
import OptionCard from './OptionCard'
import { NAVY } from './quizTheme'
import type { EntryPath } from '../../utils/quizFlow'

type Origin = 'new' | 'instate'
type Progress = 'directed' | 'exploring'

const ORIGIN_OPTIONS: { value: Origin; title: string; subtitle: string }[] = [
  { value: 'new', title: 'New to Texas', subtitle: "I'm moving from out of state" },
  { value: 'instate', title: 'Already in Texas', subtitle: "I'm looking for my next chapter" },
]

const PROGRESS_OPTIONS: { value: Progress; title: string; subtitle: string }[] = [
  { value: 'directed', title: 'I Have a Target Area', subtitle: 'Help me find the right community' },
  { value: 'exploring', title: 'Just Exploring', subtitle: "I'm curious what's out there" },
]

// Entry path mapping (unchanged from the flat 2x2 gateway):
// new + directed -> directed | new + exploring -> explorer
// instate + directed -> directed | instate + exploring -> instate
function computeEntryPath(origin: Origin, progress: Progress): EntryPath {
  if (progress === 'directed') return 'directed'
  return origin === 'new' ? 'explorer' : 'instate'
}

interface GatewayProps {
  selected: EntryPath | null
  onSelect: (path: EntryPath) => void
  onContinue: () => void
}

export default function Gateway({ onSelect, onContinue }: GatewayProps) {
  const [origin, setOrigin] = useState<Origin | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [stage2Animate, setStage2Animate] = useState(false)
  const [continueAnimate, setContinueAnimate] = useState(false)

  useEffect(() => {
    if (origin) {
      const t = setTimeout(() => setStage2Animate(true), 20)
      return () => clearTimeout(t)
    }
    setStage2Animate(false)
  }, [origin])

  useEffect(() => {
    if (origin && progress) {
      onSelect(computeEntryPath(origin, progress))
      const t = setTimeout(() => setContinueAnimate(true), 20)
      return () => clearTimeout(t)
    }
    setContinueAnimate(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, progress])

  // Mirrors PROGRESS_KEY ('hq_quiz_progress') from app/begin/page.tsx — cleared
  // on every gateway selection, same as the original flat-gateway fix, so a
  // stale resume snapshot from an earlier abandoned attempt can never survive
  // into a fresh choice here (the two-stage flow only calls the parent's
  // onSelect, where PROGRESS_KEY used to be cleared, once both stages are set).
  function clearStaleProgress() {
    sessionStorage.removeItem('hq_quiz_progress')
  }

  function handleOriginSelect(value: Origin) {
    clearStaleProgress()
    if (origin !== value) setProgress(null)
    setOrigin(value)
  }

  function handleProgressSelect(value: Progress) {
    clearStaleProgress()
    setProgress(value)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
        Let&apos;s start with where you are in your Texas journey.
      </h1>
      <p className="text-gray-500 mb-8">
        We&apos;ll tailor the experience based on how much you&apos;ve already decided.
      </p>

      <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Where are you coming from?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {ORIGIN_OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            title={opt.title}
            subtitle={opt.subtitle}
            selected={origin === opt.value}
            onClick={() => handleOriginSelect(opt.value)}
          />
        ))}
      </div>

      {origin && (
        <div
          style={{
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            opacity: stage2Animate ? 1 : 0,
            transform: stage2Animate ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>How far along are you?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {PROGRESS_OPTIONS.map(opt => (
              <OptionCard
                key={opt.value}
                title={opt.title}
                subtitle={opt.subtitle}
                selected={progress === opt.value}
                onClick={() => handleProgressSelect(opt.value)}
              />
            ))}
          </div>
        </div>
      )}

      {origin && progress && (
        <button
          type="button"
          onClick={onContinue}
          style={{
            backgroundColor: '#0076B6',
            color: '#FFFFFF',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            opacity: continueAnimate ? 1 : 0,
            transform: continueAnimate ? 'translateY(0)' : 'translateY(8px)',
          }}
          className="w-full py-3.5 rounded-xl font-bold text-sm"
        >
          Continue
        </button>
      )}
    </div>
  )
}
