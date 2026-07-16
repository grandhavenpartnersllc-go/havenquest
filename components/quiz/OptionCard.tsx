'use client'

import { Check, LucideIcon } from 'lucide-react'
import { NAVY, GOLD, LINE, MUTED, SHADOW } from './quizTheme'

interface OptionCardProps {
  icon?: LucideIcon
  title: string
  subtitle?: string
  selected: boolean
  onClick: () => void
}

export default function OptionCard({ icon: Icon, title, subtitle, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col items-start p-5 sm:p-6 rounded-2xl border-2 text-left transition-all w-full hq-focus"
      style={{
        borderColor: selected ? GOLD : LINE,
        backgroundColor: '#FFFFFF',
        boxShadow: selected ? `0 0 0 3px rgba(201,169,97,0.22), ${SHADOW}` : SHADOW,
      }}
    >
      {Icon && <Icon className="w-6 h-6 mb-2" style={{ color: NAVY }} />}
      <h3 className="font-bold tracking-tight mb-1" style={{ color: NAVY }}>
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
          {subtitle}
        </p>
      )}
      {selected && (
        <span
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: GOLD }}
        >
          <Check size={12} color={NAVY} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}
