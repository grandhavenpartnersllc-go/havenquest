'use client'

import { useState, useEffect } from 'react'
import type { MM4Profile } from '../../../../../types'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
  householdSize?: string | null
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
      <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
        {label}
        {required && <span style={{ color: '#0076B6', marginLeft: '2px' }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '-2px 0 8px' }}>{hint}</p>}
      {children}
      {error && <p style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

const col2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }

export default function Section2Household({ data, onChange, errors, householdSize }: Props) {
  const [adultsDisplay, setAdultsDisplay] = useState(String(data.num_adults ?? 1))
  const [childrenDisplay, setChildrenDisplay] = useState(String(data.num_children ?? 0))

  useEffect(() => {
    setAdultsDisplay(String(data.num_adults ?? 1))
  }, [data.num_adults])

  useEffect(() => {
    setChildrenDisplay(String(data.num_children ?? 0))
  }, [data.num_children])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>
          Your Household
        </h2>
        <p style={{ fontSize: '13px', color: '#4a5568', margin: 0, lineHeight: 1.5 }}>
          Help your Market Director understand who&apos;s coming along on this move.
        </p>
      </div>

      {/* Adults / Children counts only */}
      <div style={col2}>
        <Field
          label="Adults in household"
          required
          error={errors.num_adults}
          hint={householdSize ? `You told us your household size was ${householdSize} when you started — let's get the exact breakdown here.` : undefined}
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
