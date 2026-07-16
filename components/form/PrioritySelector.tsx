'use client'

import { useState, useRef } from 'react'
import { type LucideIcon } from 'lucide-react'
import { DNAScores } from '../../types'
import { DNA_CATEGORIES, PRIORITY_SELECTABLE_CATEGORIES, MUST_HAVE_MAX, NICE_TO_HAVE_MAX } from '../../utils/constants'
import { DNA_CATEGORY_ICONS } from '../../utils/categoryIcons'
import { NAVY } from '../quiz/quizTheme'
import { PILL_CLASS } from '../quiz/CardShell'

const CHIP_BASE = 'bg-[#081426] border border-[#081426] text-white shadow-lg shadow-black/20 hover:bg-[#0d2036] hover:border-[#0d2036] rounded-xl px-4 py-2 cursor-grab active:cursor-grabbing select-none transition-all duration-200 flex items-center gap-2'

type Bucket = 'mustHave' | 'important' | 'wouldBeNice' | 'unassigned'

interface CategoryItem {
  key: keyof DNAScores
  bucket: Bucket
}

interface ChipProps {
  chipKey: keyof DNAScores
  label: string
  isDragging: boolean
  showRemove?: boolean
  onTap: () => void
  onDragStart: () => void
  onDragEnd: () => void
  onRemove?: () => void
}

function Chip({ chipKey, label, isDragging, showRemove, onTap, onDragStart, onDragEnd, onRemove }: ChipProps) {
  const Icon: LucideIcon = DNA_CATEGORY_ICONS[chipKey]
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const dx = Math.abs(e.changedTouches[0].clientX - start.x)
    const dy = Math.abs(e.changedTouches[0].clientY - start.y)
    if (dx < 8 && dy < 8) {
      e.preventDefault()
      onTap()
    }
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'manipulation' }}
      className={`${CHIP_BASE} ${isDragging ? 'opacity-40' : ''}`}
    >
      <Icon size={18} strokeWidth={1.5} className="text-white" stroke="white" />
      <span className="text-sm font-medium">{label}</span>
      {showRemove && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onRemove() }}
          className="ml-1 text-white/50 hover:text-white transition-colors leading-none"
        >
          ×
        </button>
      )}
    </div>
  )
}

interface PrioritySelectorProps {
  onComplete: (
    mustHaves: (keyof DNAScores)[],
    niceToHaves: (keyof DNAScores)[],
    notPriorities: (keyof DNAScores)[]
  ) => void
  categories?: typeof DNA_CATEGORIES
  initialValue?: {
    mustHaves: (keyof DNAScores)[]
    niceToHaves: (keyof DNAScores)[]
  }
}

export default function PrioritySelector({ onComplete, categories = PRIORITY_SELECTABLE_CATEGORIES, initialValue }: PrioritySelectorProps) {
  const [items, setItems] = useState<CategoryItem[]>(
    categories.map(c => ({
      key: c.key,
      bucket: initialValue?.mustHaves.includes(c.key)
        ? 'mustHave'
        : initialValue?.niceToHaves.includes(c.key)
        ? 'important'
        : 'unassigned',
    }))
  )
  const [dragging, setDragging] = useState<keyof DNAScores | null>(null)
  const [activeCard, setActiveCard] = useState<keyof DNAScores | null>(null)
  const [dragOverBucket, setDragOverBucket] = useState<Bucket | null>(null)
  const dragRef = useRef<keyof DNAScores | null>(null)

  const mustHaves = items.filter(i => i.bucket === 'mustHave').map(i => i.key)
  const importants = items.filter(i => i.bucket === 'important').map(i => i.key)
  const wouldBeNices = items.filter(i => i.bucket === 'wouldBeNice').map(i => i.key)
  const unassigned = items.filter(i => i.bucket === 'unassigned').map(i => i.key)

  const canDrop = (bucket: Bucket): boolean => {
    if (bucket === 'mustHave' && mustHaves.length >= MUST_HAVE_MAX) return false
    if (bucket === 'important' && importants.length >= NICE_TO_HAVE_MAX) return false
    return true
  }

  const moveTo = (key: keyof DNAScores, bucket: Bucket) => {
    if (bucket !== 'unassigned' && !canDrop(bucket)) return
    setItems(prev => prev.map(i => i.key === key ? { ...i, bucket } : i))
  }

  const handleDragStart = (key: keyof DNAScores) => {
    setDragging(key)
    dragRef.current = key
  }

  const handleDragEnd = () => {
    setDragging(null)
    setDragOverBucket(null)
    dragRef.current = null
  }

  const handleDrop = (bucket: Bucket) => {
    if (dragRef.current && canDrop(bucket)) {
      moveTo(dragRef.current, bucket)
    }
    setDragging(null)
    dragRef.current = null
    setDragOverBucket(null)
  }

  const handleCardTap = (key: keyof DNAScores) => {
    setActiveCard(prev => prev === key ? null : key)
  }

  const handleBucketAssign = (key: keyof DNAScores, bucket: Bucket) => {
    moveTo(key, bucket)
    setActiveCard(null)
  }

  const getCat = (key: keyof DNAScores) =>
    categories.find(c => c.key === key)!

  const canSubmit = mustHaves.length >= 1

  const handleSubmit = () => {
    if (!canSubmit) return
    onComplete(mustHaves, importants, wouldBeNices)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-4">Rank your priorities</h2>

        <p style={{ fontSize: '15px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>
          This is where your results get personal.
        </p>
        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, marginBottom: '8px' }}>
          Assign only what matters to you. Must Haves carry 3× weight, Important to Me carries 2×, Would Be Nice carries 1×. Anything you leave unassigned still carries some weight.
        </p>

        <p className="text-sm text-gray-500">
          Drag or tap to assign. Must Have: up to {MUST_HAVE_MAX}. Important to Me: up to {NICE_TO_HAVE_MAX}. Unassigned categories carry less weight, but still count.
        </p>
      </div>

      {/* Counter */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
        <span className={mustHaves.length >= 1 ? 'text-green-600 font-medium' : ''}>
          {mustHaves.length}/{MUST_HAVE_MAX} Must Haves{mustHaves.length >= 1 ? ' ✓' : ''}
        </span>
        <span className="text-gray-300">·</span>
        <span className={importants.length >= 1 ? 'text-gray-700 font-medium' : ''}>
          {importants.length}/{NICE_TO_HAVE_MAX} Important
        </span>
        <span className="text-gray-300">·</span>
        <span className={wouldBeNices.length >= 1 ? 'text-gray-600 font-medium' : ''}>
          {wouldBeNices.length} Would Be Nice
        </span>
      </div>

      {/* Bucket zones */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        {([
          {
            bucket: 'mustHave' as Bucket,
            keys: mustHaves,
            label: 'Must Have',
            sublabel: `Up to ${MUST_HAVE_MAX} · 3× weight`,
            max: MUST_HAVE_MAX as number | null,
            color: 'text-[#081426]',
          },
          {
            bucket: 'important' as Bucket,
            keys: importants,
            label: 'Important to Me',
            sublabel: `Up to ${NICE_TO_HAVE_MAX} · 2× weight`,
            max: NICE_TO_HAVE_MAX as number | null,
            color: 'text-gray-700',
          },
          {
            bucket: 'wouldBeNice' as Bucket,
            keys: wouldBeNices,
            label: 'Would Be Nice',
            sublabel: '1× weight',
            max: null,
            color: 'text-gray-500',
          },
        ]).map(({ bucket, keys, label, sublabel, max, color }) => (
          <div
            key={bucket}
            className={`flex-1 min-h-[120px] rounded-xl border-2 border-dashed p-3 transition-all ${
              dragOverBucket === bucket && canDrop(bucket)
                ? 'border-[#C9A961] bg-[#FAF6EC]'
                : dragOverBucket === bucket && !canDrop(bucket)
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
            onDragOver={e => { e.preventDefault(); setDragOverBucket(bucket) }}
            onDragLeave={() => setDragOverBucket(null)}
            onDrop={() => handleDrop(bucket)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wide ${color}`}>{label}</span>
              <span className="text-xs text-gray-400">
                {max !== null ? `${keys.length}/${max}${!canDrop(bucket) ? ' full' : ''}` : `${keys.length}`}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{sublabel}</p>
            <div className="flex flex-wrap gap-2">
              {keys.map(key => (
                <Chip
                  key={key}
                  chipKey={key}
                  label={getCat(key).label}
                  isDragging={dragging === key}
                  showRemove
                  onTap={() => handleCardTap(key)}
                  onDragStart={() => handleDragStart(key)}
                  onDragEnd={handleDragEnd}
                  onRemove={() => moveTo(key, 'unassigned')}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned pool */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Unassigned — carries less weight, but still counts
        </p>
        <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-2 min-h-[60px]">
          {unassigned.map(key => {
            const isActive = activeCard === key
            return (
              <div key={key} className="relative">
                <Chip
                  chipKey={key}
                  label={getCat(key).label}
                  isDragging={dragging === key}
                  onTap={() => handleCardTap(key)}
                  onDragStart={() => handleDragStart(key)}
                  onDragEnd={handleDragEnd}
                />
                {isActive && (
                  <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-col gap-1 min-w-[180px]">
                    <button
                      onClick={() => handleBucketAssign(key, 'mustHave')}
                      disabled={!canDrop('mustHave')}
                      className="text-left px-3 py-1.5 rounded text-sm text-[#081426] font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Must Have {mustHaves.length}/{MUST_HAVE_MAX}
                    </button>
                    <button
                      onClick={() => handleBucketAssign(key, 'important')}
                      disabled={!canDrop('important')}
                      className="text-left px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Important to Me {importants.length}/{NICE_TO_HAVE_MAX}
                    </button>
                    <button
                      onClick={() => handleBucketAssign(key, 'wouldBeNice')}
                      className="text-left px-3 py-1.5 rounded text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Would Be Nice
                    </button>
                  </div>
                )}
              </div>
            )
          })}
          {unassigned.length === 0 && (
            <p className="text-xs text-gray-400 py-2">All categories assigned</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={!canSubmit} className={PILL_CLASS}>
          {canSubmit ? 'Find My Matches →' : 'Select at least 1 Must Have to continue'}
        </button>
      </div>
    </div>
  )
}
