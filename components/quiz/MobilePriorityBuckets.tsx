'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { NAVY, BLUE } from './quizTheme'

export type PriorityBucket = 'must_have' | 'important' | 'would_be_nice' | 'unassigned'

interface CategoryDef {
  key: string
  label: string
  icon: LucideIcon
}

interface MobilePriorityBucketsProps {
  categories: CategoryDef[]
  bucketOf: Record<string, PriorityBucket>
  onAssign: (key: string, bucket: PriorityBucket) => void
  mustHaveMax: number
  importantMax: number
}

export default function MobilePriorityBuckets({
  categories,
  bucketOf,
  onAssign,
  mustHaveMax,
  importantMax,
}: MobilePriorityBucketsProps) {
  const [sheetKey, setSheetKey] = useState<string | null>(null)

  const mustHaveCount = categories.filter(c => bucketOf[c.key] === 'must_have').length
  const importantCount = categories.filter(c => bucketOf[c.key] === 'important').length
  const niceCount = categories.filter(c => bucketOf[c.key] === 'would_be_nice').length

  const bucketLabel = (b: PriorityBucket) =>
    b === 'must_have' ? 'Must Have' : b === 'important' ? 'Important' : b === 'would_be_nice' ? 'Would Be Nice' : ''

  const sheetCategory = categories.find(c => c.key === sheetKey) ?? null

  return (
    <div className="w-full">
      {/* Bucket counters */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="rounded-xl border-2 px-2 py-2.5 text-center" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-xs font-semibold" style={{ color: NAVY }}>Must Have</p>
          <p className="text-sm font-bold" style={{ color: BLUE }}>{mustHaveCount}/{mustHaveMax}</p>
        </div>
        <div className="rounded-xl border-2 px-2 py-2.5 text-center" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-xs font-semibold" style={{ color: NAVY }}>Important</p>
          <p className="text-sm font-bold" style={{ color: BLUE }}>{importantCount}/{importantMax}</p>
        </div>
        <div className="rounded-xl border-2 px-2 py-2.5 text-center" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-xs font-semibold" style={{ color: NAVY }}>Would Be Nice</p>
          <p className="text-sm font-bold" style={{ color: BLUE }}>{niceCount}</p>
        </div>
      </div>

      {/* Scrollable category list */}
      <div className="flex flex-col gap-2 mb-2">
        {categories.map(({ key, label, icon: Icon }) => {
          const bucket = bucketOf[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSheetKey(key)}
              className="flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all"
              style={{ borderColor: bucket !== 'unassigned' ? NAVY : '#E5E7EB' }}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} strokeWidth={1.5} style={{ color: NAVY }} />
                <span className="text-sm font-medium" style={{ color: NAVY }}>{label}</span>
              </span>
              {bucket !== 'unassigned' && (
                <span className="text-xs font-semibold" style={{ color: BLUE }}>{bucketLabel(bucket)}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom sheet */}
      {sheetCategory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setSheetKey(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-md bg-white rounded-t-2xl p-5 pb-8"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-sm font-bold mb-4" style={{ color: NAVY }}>{sheetCategory.label}</p>
            {(['must_have', 'important', 'would_be_nice'] as PriorityBucket[]).map(b => {
              const disabled =
                (b === 'must_have' && mustHaveCount >= mustHaveMax && bucketOf[sheetCategory.key] !== 'must_have') ||
                (b === 'important' && importantCount >= importantMax && bucketOf[sheetCategory.key] !== 'important')
              return (
                <button
                  key={b}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onAssign(sheetCategory.key, b)
                    setSheetKey(null)
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl mb-2 text-sm font-medium transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: bucketOf[sheetCategory.key] === b ? NAVY : '#F3F4F6',
                    color: bucketOf[sheetCategory.key] === b ? '#FFFFFF' : NAVY,
                  }}
                >
                  {bucketLabel(b)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
