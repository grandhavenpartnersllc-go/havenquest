'use client'

import { useState } from 'react'
import { TIMELINE_OPTIONS } from '../../utils/constants'
import { UserProfile } from '../../types'

interface TimelineFormProps {
  defaultValue?: UserProfile['movingTimeline']
  onComplete: (movingTimeline: UserProfile['movingTimeline']) => void
}

export default function TimelineForm({ defaultValue, onComplete }: TimelineFormProps) {
  const [selected, setSelected] = useState<UserProfile['movingTimeline'] | null>(defaultValue ?? null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    onComplete(selected)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <label className="block text-xl font-bold text-gray-900 tracking-tight mb-2">
          When are you thinking about making a move?
        </label>
        <p className="text-sm text-gray-500 mb-5">
          This helps us connect you with realtors at the right time.
        </p>
        <div className="flex flex-col gap-2">
          {TIMELINE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt.value)}
              className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                selected === opt.value
                  ? 'border-accent bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`font-medium ${selected === opt.value ? 'text-accent' : 'text-gray-900'}`}>
                {opt.label}
              </span>
              <span className="text-xs text-gray-400">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!selected}
        className="w-full bg-accent text-white py-4 rounded-xl font-bold text-base hover:bg-[#154d8a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </form>
  )
}
