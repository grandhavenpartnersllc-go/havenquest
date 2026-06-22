'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const GOLD = '#B8912A'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

interface StickyAdvanceBarProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  checkboxLabel: string
  onPrev: () => void
  prevLabel?: string
  onNext: () => void
  nextLabel: string
  // Optional extra gate beyond the checkbox itself (e.g. MM3's financials/cities-locked
  // preconditions) — when true, the checkbox is uncheckable and Next stays disabled
  // regardless of `checked`.
  disabled?: boolean
}

export default function StickyAdvanceBar({
  checked,
  onCheckedChange,
  checkboxLabel,
  onPrev,
  prevLabel = 'Back',
  onNext,
  nextLabel,
  disabled = false,
}: StickyAdvanceBarProps) {
  const canAdvance = checked && !disabled

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 5,
        width: '100%',
        backgroundColor: CARD_BG,
        boxShadow: CARD_SHADOW,
        borderTop: '4px solid var(--accent-gold)',
        marginTop: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '16px 24px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={onPrev}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(10,30,61,0.7)',
            backgroundColor: 'transparent',
            border: '1.5px solid rgba(10,30,61,0.25)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={15} />
          {prevLabel}
        </button>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.4 : 1,
            flex: 1,
            minWidth: '220px',
            justifyContent: 'center',
            transition: 'opacity 0.2s',
          }}
        >
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={e => onCheckedChange(e.target.checked)}
            style={{ accentColor: GOLD, width: '16px', height: '16px', flexShrink: 0 }}
          />
          <span style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.4 }}>
            {checkboxLabel}
          </span>
        </label>

        <button
          type="button"
          disabled={!canAdvance}
          onClick={canAdvance ? onNext : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            backgroundColor: canAdvance ? 'var(--accent-blue)' : '#9A8E82',
            color: '#ffffff',
            opacity: canAdvance ? 1 : 0.5,
            border: 'none',
            cursor: canAdvance ? 'pointer' : 'not-allowed',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
        >
          {nextLabel}
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
