'use client'

import type { MM4Profile } from '../../../../../types'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
}

function PillGroup<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { label: string; value: T }[]
  value: T | undefined
  onSelect: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map(opt => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: selected ? 500 : 400,
              color: selected ? '#ffffff' : 'var(--text-secondary)',
              backgroundColor: selected ? '#0076B6' : 'transparent',
              border: `1.5px solid ${selected ? '#0076B6' : 'var(--card-border)'}`,
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function Field({ label, required, error, children }: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
        {label}
        {required && <span style={{ color: '#0076B6', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

const col2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }

export default function Section2Household({ data, onChange, errors }: Props) {
  const hasChildren = (data.num_children ?? 0) > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
          Your Household
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Help your Market Director understand who's coming along on this move.
        </p>
      </div>

      {/* Best time to reach — full width */}
      <Field label="Best time to reach you">
        <PillGroup
          options={[
            { label: 'Morning', value: 'morning' },
            { label: 'Afternoon', value: 'afternoon' },
            { label: 'Evening', value: 'evening' },
            { label: 'Anytime', value: 'anytime' },
          ]}
          value={data.best_time_to_reach}
          onSelect={v => onChange({ best_time_to_reach: v as MM4Profile['best_time_to_reach'] })}
        />
      </Field>

      {/* Adults / Children */}
      <div style={col2}>
        <Field label="Adults in household" required error={errors.num_adults}>
          <input
            className="mm4-input"
            type="number"
            min={1}
            max={10}
            value={data.num_adults ?? 1}
            onChange={e => onChange({ num_adults: Math.max(1, parseInt(e.target.value) || 1) })}
          />
        </Field>
        <Field label="Children in household">
          <input
            className="mm4-input"
            type="number"
            min={0}
            max={12}
            value={data.num_children ?? 0}
            onChange={e => onChange({ num_children: Math.max(0, parseInt(e.target.value) || 0) })}
          />
        </Field>
      </div>

      {/* Children ages — conditional */}
      {hasChildren && (
        <div style={col2}>
          <Field label="Children's ages">
            <input
              className="mm4-input"
              type="text"
              value={data.children_ages ?? ''}
              onChange={e => onChange({ children_ages: e.target.value })}
              placeholder="e.g. 3, 7, 12"
            />
          </Field>
          <div />
        </div>
      )}

      {/* Pets toggle / Pet details */}
      <div style={col2}>
        <Field label="Pets?">
          <PillGroup
            options={[
              { label: 'No pets', value: 'false' },
              { label: 'Yes, we have pets', value: 'true' },
            ]}
            value={data.has_pets === undefined ? undefined : String(data.has_pets) as 'true' | 'false'}
            onSelect={v => onChange({ has_pets: v === 'true', pet_details: v === 'false' ? '' : data.pet_details })}
          />
        </Field>
        {data.has_pets ? (
          <Field label="Pet details (type, size, number)">
            <input
              className="mm4-input"
              type="text"
              value={data.pet_details ?? ''}
              onChange={e => onChange({ pet_details: e.target.value })}
              placeholder="e.g. Two medium dogs"
            />
          </Field>
        ) : <div />}
      </div>

    </div>
  )
}
