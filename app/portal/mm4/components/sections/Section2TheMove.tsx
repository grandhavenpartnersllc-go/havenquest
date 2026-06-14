'use client'

import { useMemo } from 'react'
import type { MM4Profile } from '../../../../../types'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
}

type TimelineFlexibility = MM4Profile['timeline_flexibility']
type OriginSituation = MM4Profile['origin_situation']
type PurchaseContingent = MM4Profile['purchase_contingent']

function PillGroup<T extends string>({
  options,
  value,
  onSelect,
  wrap = true,
}: {
  options: { label: string; value: T }[]
  value: T | undefined
  onSelect: (v: T) => void
  wrap?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: wrap ? 'wrap' : 'nowrap' }}>
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

function MiniLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      margin: '0 0 8px',
    }}>
      {children}
    </p>
  )
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const EQUITY_OPTIONS = [
  'Less than $50K',
  '$50K – $100K',
  '$100K – $200K',
  '$200K – $350K',
  '$350K – $500K',
  '$500K – $750K',
  'Over $750K',
  'Not sure yet',
]

export default function Section2TheMove({ data, onChange, errors }: Props) {
  const isSelling = data.origin_situation === 'selling'

  const moveOptions = useMemo(() => {
    const today = new Date()
    const opts: string[] = []
    for (let i = 0; i < 24; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
      opts.push(`${MONTHS[d.getMonth()]} ${d.getFullYear()}`)
    }
    return opts
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          The Move
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
          Help us understand your motivation and timing so we can plan the right path forward.
        </p>
      </div>

      {/* Motivation — Why Texas / Why now side by side */}
      <div>
        <MiniLabel>Motivation</MiniLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field
            label="Why Texas?"
            required
            error={errors.why_texas}
            hint="What's drawing you to Texas specifically?"
          >
            <textarea
              className="mm4-textarea"
              value={data.why_texas ?? ''}
              onChange={e => onChange({ why_texas: e.target.value })}
              placeholder="Lower cost of living, no state income tax, family nearby, lifestyle change..."
              rows={3}
            />
          </Field>
          <Field
            label="Why now?"
            hint="What's making this the right time? (optional)"
          >
            <textarea
              className="mm4-textarea"
              value={data.why_now ?? ''}
              onChange={e => onChange({ why_now: e.target.value })}
              placeholder="Job change, life event, kids leaving home, retiring..."
              rows={3}
            />
          </Field>
        </div>
      </div>

      {/* Timing — Target date / Timeline flexibility side by side */}
      <div>
        <MiniLabel>Timing</MiniLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Target move date">
            <select
              className="mm4-select"
              value={data.target_move_date ?? ''}
              onChange={e => onChange({ target_move_date: e.target.value })}
            >
              <option value="">Select a month</option>
              {moveOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </Field>
          <Field label="How flexible is your timeline?" required error={errors.timeline_flexibility}>
            <PillGroup
              options={[
                { label: 'Hard deadline', value: 'hard_deadline' },
                { label: 'Flexible a few months', value: 'flexible_few_months' },
                { label: 'Very flexible', value: 'very_flexible' },
              ]}
              value={data.timeline_flexibility}
              onSelect={v => onChange({ timeline_flexibility: v as TimelineFlexibility })}
            />
          </Field>
        </div>
      </div>

      {/* Current housing situation */}
      <div>
        <MiniLabel>Current Housing Situation</MiniLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Field label="What's your current housing situation?" required error={errors.origin_situation}>
            <PillGroup
              options={[
                { label: 'Selling my home', value: 'selling' },
                { label: 'Currently renting', value: 'renting' },
                { label: 'Own — not selling', value: 'own_no_sale' },
                { label: 'Other', value: 'other' },
              ]}
              value={data.origin_situation}
              onSelect={v => {
                const updates: Partial<MM4Profile> = { origin_situation: v as OriginSituation }
                if (v !== 'selling') {
                  updates.home_listed = undefined
                  updates.approximate_equity = undefined
                  updates.purchase_contingent = undefined
                }
                onChange(updates)
              }}
            />
          </Field>

          {isSelling && (
            <>
              {/* Have you listed? / Equity side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Have you listed your home?">
                  <PillGroup
                    options={[
                      { label: 'Not yet listed', value: 'false' },
                      { label: 'Listed and active', value: 'true' },
                    ]}
                    value={data.home_listed === undefined ? undefined : String(data.home_listed) as 'true' | 'false'}
                    onSelect={v => onChange({ home_listed: v === 'true' })}
                  />
                </Field>
                <Field label="Approximate equity or expected proceeds">
                  <select
                    className="mm4-select"
                    value={data.approximate_equity ?? ''}
                    onChange={e => onChange({ approximate_equity: e.target.value })}
                  >
                    <option value="">Select a range</option>
                    {EQUITY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Will your Texas purchase be contingent on selling?">
                <PillGroup
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                    { label: 'Possibly', value: 'possibly' },
                    { label: 'Not applicable', value: 'na' },
                  ]}
                  value={data.purchase_contingent}
                  onSelect={v => onChange({ purchase_contingent: v as PurchaseContingent })}
                />
              </Field>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
