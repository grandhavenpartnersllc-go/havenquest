'use client'

import { useState } from 'react'
import { METRO_OPTIONS } from '../../utils/constants'

interface ModeSelectorProps {
  onComplete: (metroId: string) => void
}

export default function ModeSelector({ onComplete }: ModeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    onComplete(selected)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <label className="block text-xl font-medium text-gray-900 mb-2">
          Which Texas metro are you moving to?
        </label>
        <p className="text-sm text-gray-500 mb-5">
          We&apos;ll match you to the best neighborhoods within your chosen metro.
        </p>
        <div className="flex flex-col gap-2">
          {METRO_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                selected === opt.id
                  ? 'border-accent bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`font-medium ${selected === opt.id ? 'text-accent' : 'text-gray-900'}`}>
                {opt.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!selected}
        className="w-full bg-accent text-white py-4 rounded-lg font-medium text-base hover:bg-[#154d8a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </form>
  )
}
