'use client'

import { useEffect, useState } from 'react'
import PrioritySelector from '../../form/PrioritySelector'
import MobilePriorityBuckets, { type PriorityBucket } from '../MobilePriorityBuckets'
import { PRIORITY_SELECTABLE_CATEGORIES, MUST_HAVE_MAX, NICE_TO_HAVE_MAX } from '../../../utils/constants'
import { DNA_CATEGORY_ICONS } from '../../../utils/categoryIcons'
import { NAVY, GOLD } from '../quizTheme'
import CardEyebrow from '../CardEyebrow'
import type { DNAScores } from '../../../types'
import type { PriorityWeight } from '../../../types'

// Priority Engine B1: the selectable set is the 5-dim subset (growthPotential/careerAccess
// removed — unbacked stub data). DNA_CATEGORIES stays whole for display elsewhere.
const QUIZ_CATEGORIES = PRIORITY_SELECTABLE_CATEGORIES

export interface Card3Result {
  priorities: Record<string, PriorityWeight>
  mustHaves: (keyof DNAScores)[]
  niceToHaves: (keyof DNAScores)[]
  notPriorities: (keyof DNAScores)[]
  unassignedPriorities: (keyof DNAScores)[]
}

interface Card3PrioritiesProps {
  initialValue?: Card3Result
  onComplete: (result: Card3Result) => void
}

function buildPriorities(
  mustHaves: (keyof DNAScores)[],
  important: (keyof DNAScores)[],
  wouldBeNice: (keyof DNAScores)[]
): Record<string, PriorityWeight> {
  const priorities: Record<string, PriorityWeight> = {}
  QUIZ_CATEGORIES.forEach(({ key }) => {
    if (mustHaves.includes(key)) priorities[key] = { bucket: 'must_have', weight: 3 }
    else if (important.includes(key)) priorities[key] = { bucket: 'important', weight: 2 }
    else if (wouldBeNice.includes(key)) priorities[key] = { bucket: 'would_be_nice', weight: 1 }
    else priorities[key] = { bucket: 'unassigned', weight: 0.5 }
  })
  return priorities
}

export default function Card3Priorities({ initialValue, onComplete }: Card3PrioritiesProps) {
  const [isTouch, setIsTouch] = useState<boolean | null>(null)
  const [bucketOf, setBucketOf] = useState<Record<string, PriorityBucket>>(() => {
    const initial: Record<string, PriorityBucket> = {}
    QUIZ_CATEGORIES.forEach(c => {
      initial[c.key] = initialValue?.mustHaves.includes(c.key)
        ? 'must_have'
        : initialValue?.niceToHaves.includes(c.key)
        ? 'important'
        : 'unassigned'
    })
    return initial
  })

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0)
  }, [])

  const handleDesktopComplete = (
    mustHaves: (keyof DNAScores)[],
    niceToHaves: (keyof DNAScores)[],
    notPriorities: (keyof DNAScores)[]
  ) => {
    const assigned = new Set([...mustHaves, ...niceToHaves, ...notPriorities])
    const unassigned = QUIZ_CATEGORIES.map(c => c.key).filter(k => !assigned.has(k))
    onComplete({
      priorities: buildPriorities(mustHaves, niceToHaves, notPriorities),
      mustHaves,
      niceToHaves,
      notPriorities,
      unassignedPriorities: unassigned,
    })
  }

  const handleMobileContinue = () => {
    const mustHaves = QUIZ_CATEGORIES.filter(c => bucketOf[c.key] === 'must_have').map(c => c.key)
    const niceToHaves = QUIZ_CATEGORIES.filter(c => bucketOf[c.key] === 'important').map(c => c.key)
    const wouldBeNice = QUIZ_CATEGORIES.filter(c => bucketOf[c.key] === 'would_be_nice').map(c => c.key)
    const unassigned = QUIZ_CATEGORIES.filter(c => bucketOf[c.key] === 'unassigned').map(c => c.key)
    onComplete({
      priorities: buildPriorities(mustHaves, niceToHaves, wouldBeNice),
      mustHaves,
      niceToHaves,
      notPriorities: wouldBeNice,
      unassignedPriorities: unassigned,
    })
  }

  const mustHaveCount = Object.values(bucketOf).filter(b => b === 'must_have').length

  if (isTouch === null) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <CardEyebrow>What Matters Most</CardEyebrow>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
        What matters most to you in a community?
      </h1>
      <p className="text-gray-500 mb-8">
        Sort these into what matters most — we&apos;ll build your matches around them.
      </p>

      {isTouch ? (
        <>
          <MobilePriorityBuckets
            categories={QUIZ_CATEGORIES.map(c => ({ key: c.key, label: c.label, icon: DNA_CATEGORY_ICONS[c.key] }))}
            bucketOf={bucketOf}
            onAssign={(key, bucket) => setBucketOf(prev => ({ ...prev, [key]: bucket }))}
            mustHaveMax={MUST_HAVE_MAX}
            importantMax={NICE_TO_HAVE_MAX}
          />
          <button
            type="button"
            disabled={mustHaveCount < 1}
            onClick={handleMobileContinue}
            className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            {mustHaveCount >= 1 ? 'Continue' : 'Select at least 1 Must Have to continue'}
          </button>
        </>
      ) : (
        <PrioritySelector
          categories={QUIZ_CATEGORIES}
          onComplete={handleDesktopComplete}
          initialValue={initialValue ? { mustHaves: initialValue.mustHaves, niceToHaves: initialValue.niceToHaves } : undefined}
        />
      )}
    </div>
  )
}
