'use client'

import { useEffect, useState } from 'react'
import PriorityTrackControl from '../../shared/PriorityTrackControl'
import HelpPopup from '../../shared/HelpPopup'
import { buildPriorityHelpBody } from '../../shared/priorityHelpBody'
import MobilePriorityBuckets, { type PriorityBucket } from '../MobilePriorityBuckets'
import { PRIORITY_SELECTABLE_CATEGORIES, MUST_HAVE_MAX, NICE_TO_HAVE_MAX } from '../../../utils/constants'
import { DNA_CATEGORY_ICONS } from '../../../utils/categoryIcons'
import CardShell, { PILL_CLASS } from '../CardShell'
import type { DNAScores } from '../../../types'
import type { PriorityWeight } from '../../../types'

// Priority Engine B1: the selectable set is the 5-dim subset (growthPotential/careerAccess
// removed — unbacked stub data). DNA_CATEGORIES stays whole for display elsewhere.
const QUIZ_CATEGORIES = PRIORITY_SELECTABLE_CATEGORIES

// The shared control speaks tier indices (0..3); Card 3 stores PriorityBucket names.
const BUCKET_TO_TIER: Record<PriorityBucket, number> = { must_have: 0, important: 1, would_be_nice: 2, unassigned: 3 }
const TIER_TO_BUCKET: PriorityBucket[] = ['must_have', 'important', 'would_be_nice', 'unassigned']

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
  onBack?: () => void
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

export default function Card3Priorities({ initialValue, onComplete, onBack }: Card3PrioritiesProps) {
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
    <CardShell
      eyebrow="What Matters Most"
      title="What matters most to you in a community?"
      sub="Sort these into what matters most — we'll build your matches around them."
      onBack={onBack}
    >
      {isTouch ? (
        <>
          <MobilePriorityBuckets
            categories={QUIZ_CATEGORIES.map(c => ({ key: c.key, label: c.label, icon: DNA_CATEGORY_ICONS[c.key] }))}
            bucketOf={bucketOf}
            onAssign={(key, bucket) => setBucketOf(prev => ({ ...prev, [key]: bucket }))}
            mustHaveMax={MUST_HAVE_MAX}
            importantMax={NICE_TO_HAVE_MAX}
          />
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={mustHaveCount < 1}
              onClick={handleMobileContinue}
              className={PILL_CLASS}
            >
              {mustHaveCount >= 1 ? 'Continue' : 'Select at least 1 Top priority to continue'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
              Drag each dot — or tap a band — to set how much it matters.
            </p>
            <HelpPopup title="How this works" body={buildPriorityHelpBody(true)} />
          </div>
          <PriorityTrackControl
            items={QUIZ_CATEGORIES.map(c => ({ key: c.key, label: c.label, Icon: DNA_CATEGORY_ICONS[c.key], whatItIs: c.whatItIs, howItCounts: c.howItCounts }))}
            tierOf={Object.fromEntries(QUIZ_CATEGORIES.map(c => [c.key, BUCKET_TO_TIER[bucketOf[c.key] ?? 'unassigned']]))}
            caps={[MUST_HAVE_MAX, NICE_TO_HAVE_MAX, Infinity, Infinity]}
            tierLabels={['Top priority', 'Really matters', 'Nice to have', 'Not yet sorted']}
            onAssign={(key, t) => setBucketOf(prev => ({ ...prev, [key]: TIER_TO_BUCKET[t] }))}
          />
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={mustHaveCount < 1}
              onClick={handleMobileContinue}
              className={PILL_CLASS}
            >
              {mustHaveCount >= 1 ? 'Find My Matches →' : 'Select at least 1 Top priority to continue'}
            </button>
          </div>
        </>
      )}
    </CardShell>
  )
}
