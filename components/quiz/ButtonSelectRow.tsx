'use client'

import { NAVY } from './quizTheme'

interface Option {
  value: string
  label: string
}

interface ButtonSelectRowProps {
  options: Option[]
  selected: string | null
  onSelect: (value: string) => void
  layout?: 'wrap' | 'stack'
}

export default function ButtonSelectRow({ options, selected, onSelect, layout = 'wrap' }: ButtonSelectRowProps) {
  return (
    <div className={layout === 'stack' ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'}>
      {options.map(opt => {
        const isSelected = selected === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`text-sm font-medium rounded-xl border-2 px-4 py-2.5 transition-all ${
              layout === 'stack' ? 'text-left w-full' : ''
            }`}
            style={{
              borderColor: isSelected ? NAVY : '#E5E7EB',
              backgroundColor: isSelected ? NAVY : '#FFFFFF',
              color: isSelected ? '#FFFFFF' : NAVY,
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
