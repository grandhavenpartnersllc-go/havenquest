'use client'

import { useEffect, useState } from 'react'
import { type LucideIcon } from 'lucide-react'
import { getScoreColor } from '../../utils/scoring'
import { CATEGORY_ICONS } from '../../utils/categoryIcons'
import type { LifestyleScores } from '../../types'

interface ScoreBarProps {
  label: string
  icon: keyof LifestyleScores
  score: number
  highlighted?: boolean
  tooltip?: string
}

export default function ScoreBar({ label, icon, score, highlighted = false, tooltip }: ScoreBarProps) {
  const [width, setWidth] = useState(0)
  const color = getScoreColor(score)
  const Icon: LucideIcon = CATEGORY_ICONS[icon]

  useEffect(() => {
    const t = setTimeout(() => setWidth(score * 10), 150)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
        highlighted ? 'border-2 bg-blue-50' : 'border border-gray-100'
      }`}
      style={highlighted ? { borderColor: '#1A5FA8' } : {}}
    >
      <Icon size={18} strokeWidth={1.5} className="text-blue-600 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-sm font-medium text-gray-900 truncate">{label}</span>
            {tooltip && (
              <span title={tooltip} className="text-gray-400 cursor-help shrink-0 text-xs leading-none">ⓘ</span>
            )}
          </div>
          <span className="text-sm font-medium tabular-nums ml-2 shrink-0" style={{ color }}>
            {score}/10
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${width}%`,
              backgroundColor: color,
              transition: 'width 0.6s ease-out',
            }}
          />
        </div>
      </div>
    </div>
  )
}
