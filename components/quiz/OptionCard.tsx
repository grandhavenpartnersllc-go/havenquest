'use client'

import { Check, LucideIcon } from 'lucide-react'
import { NAVY, GOLD } from './quizTheme'

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
      className="relative flex flex-col items-start p-5 sm:p-6 rounded-2xl border-2 text-left transition-all hover:shadow-md w-full"
      style={{
        borderColor: selected ? NAVY : '#E5E7EB',
        backgroundColor: selected ? NAVY : '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      {Icon && <Icon className="w-6 h-6 mb-2" style={{ color: selected ? '#FFFFFF' : NAVY }} />}
      <h3 className="font-bold tracking-tight mb-1" style={{ color: selected ? '#FFFFFF' : NAVY }}>
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm leading-relaxed" style={{ color: selected ? 'rgba(255,255,255,0.75)' : '#6B7280' }}>
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
