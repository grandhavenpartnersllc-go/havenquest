'use client'

import OptionCard from './OptionCard'
import { NAVY } from './quizTheme'
import type { EntryPath } from '../../utils/quizFlow'

const GATEWAY_OPTIONS: { path: EntryPath; title: string; subtitle: string }[] = [
  { path: 'explorer', title: 'New to Texas', subtitle: 'Show me the whole state' },
  { path: 'directed', title: 'I Have a Target Area', subtitle: 'Help me find the right community' },
  { path: 'instate', title: 'Already in Texas', subtitle: 'Looking for my next chapter' },
  { path: 'exploring', title: 'Just Exploring', subtitle: "I'm curious what's out there" },
]

interface GatewayProps {
  selected: EntryPath | null
  onSelect: (path: EntryPath) => void
  onContinue: () => void
}

export default function Gateway({ selected, onSelect, onContinue }: GatewayProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: NAVY }}>
        Let&apos;s start with where you are in your Texas journey.
      </h1>
      <p className="text-gray-500 mb-8">
        We&apos;ll tailor the experience based on how much you&apos;ve already decided.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {GATEWAY_OPTIONS.map(opt => (
          <OptionCard
            key={opt.path}
            title={opt.title}
            subtitle={opt.subtitle}
            selected={selected === opt.path}
            onClick={() => onSelect(opt.path)}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={onContinue}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#0076B6', color: '#FFFFFF' }}
      >
        Continue
      </button>
    </div>
  )
}
