'use client'

import { BLUE } from './quizTheme'

interface QuizProgressProps {
  current: number
  total: number
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <p className="text-xs font-medium text-gray-400 mb-2">
        Card {current} of {total}
      </p>
      <div className="w-full h-1 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: BLUE }}
        />
      </div>
    </div>
  )
}
