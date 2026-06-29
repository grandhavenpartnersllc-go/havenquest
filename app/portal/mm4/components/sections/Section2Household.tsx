'use client'

import { useState, useEffect } from 'react'
import type { MM4Profile } from '../../../../../types'
import ConfirmRow from '../ConfirmRow'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
  householdSize?: string | null
  movingTimeline?: string | null
}

function Field({ label, required, error, hint, children }: {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', color: '#86868b', marginBottom: '6px' }}>
        {label}
        {required && <span style={{ color: '#0076B6', marginLeft: '2px' }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: '12px', color: '#86868b', margin: '-2px 0 8px' }}>{hint}</p>}
      {children}
      {error && <p style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

const col2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }

function mapTimelineToLabel(t: string | null | undefined): string {
  if (!t) return ''
  if (t.startsWith('0-3') || t === 'asap') return 'ready to move within 3 months'
  if (t.startsWith('3-6')) return 'moving within 6 months'
  if (t.startsWith('6-12')) return 'moving within the year'
  if (t.startsWith('12') || t === 'exploring') return 'exploring options'
  return ''
}

export default function Section2Household({ data, onChange, errors, householdSize, movingTimeline }: Props) {
  const [adultsDisplay, setAdultsDisplay] = useState(String(data.num_adults ?? 1))
  const [childrenDisplay, setChildrenDisplay] = useState(String(data.num_children ?? 0))

  useEffect(() => {
    setAdultsDisplay(String(data.num_adults ?? 1))
  }, [data.num_adults])

  useEffect(() => {
    setChildrenDisplay(String(data.num_children ?? 0))
  }, [data.num_children])

  const timelineLabel = mapTimelineToLabel(movingTimeline)
  const adultsCount = data.num_adults ?? 1
  const householdConfirmValue = timelineLabel
    ? `${adultsCount} adult${adultsCount !== 1 ? 's' : ''} · ${timelineLabel}`
    : `${adultsCount} adult${adultsCount !== 1 ? 's' : ''}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#1d1d1f', margin: '0 0 4px' }}>
          Your household
        </h2>
        <p style={{ fontSize: '15px', color: '#86868b', margin: 0, lineHeight: 1.5 }}>
          Help your Market Director understand who&apos;s coming along on this move.
        </p>
      </div>

      <ConfirmRow label="Household" value={householdConfirmValue} />

      {/* Adults / Children counts */}
      <div style={col2}>
        <Field
          label="Adults in household"
          required
          error={errors.num_adults}
          hint={householdSize ? `You told us your household size was ${householdSize} — let's get the exact breakdown.` : undefined}
        >
          <input
            className="mm4-input"
            type="text"
            inputMode="numeric"
            value={adultsDisplay}
            onChange={e => {
              setAdultsDisplay(e.target.value)
              const parsed = parseInt(e.target.value)
              if (!isNaN(parsed)) onChange({ num_adults: Math.max(1, parsed) })
            }}
            onBlur={() => {
              const parsed = parseInt(adultsDisplay)
              const valid = isNaN(parsed) ? 1 : Math.max(1, parsed)
              setAdultsDisplay(String(valid))
              onChange({ num_adults: valid })
            }}
          />
        </Field>
        <Field label="Children in household">
          <input
            className="mm4-input"
            type="text"
            inputMode="numeric"
            value={childrenDisplay}
            onChange={e => {
              setChildrenDisplay(e.target.value)
              const parsed = parseInt(e.target.value)
              if (!isNaN(parsed)) onChange({ num_children: Math.max(0, parsed) })
            }}
            onBlur={() => {
              const parsed = parseInt(childrenDisplay)
              const valid = isNaN(parsed) ? 0 : Math.max(0, parsed)
              setChildrenDisplay(String(valid))
              onChange({ num_children: valid })
            }}
          />
        </Field>
      </div>

    </div>
  )
}
