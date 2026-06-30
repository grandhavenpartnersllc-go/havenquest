'use client'

import { useMemo } from 'react'
import type { MM4Profile } from '../../../../../types'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
  quizWorkSituation?: string | null
}

type TimelineFlexibility = MM4Profile['timeline_flexibility']

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
              color: selected ? '#FFFFFF' : 'rgba(10,30,61,0.55)',
              backgroundColor: selected ? '#0A1E3D' : 'transparent',
              border: `0.5px solid ${selected ? '#0A1E3D' : 'rgba(10,30,61,0.15)'}`,
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
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
      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(10,30,61,0.5)', marginBottom: '7px' }}>
        {label}
        {required && <span style={{ color: '#C5B783', marginLeft: '2px' }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: '12px', color: 'rgba(10,30,61,0.35)', margin: '-2px 0 8px' }}>{hint}</p>}
      {children}
      {error && <p style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '1.5px',
      color: 'rgba(197,183,131,0.9)',
      textTransform: 'uppercase',
      margin: '0 0 16px',
    }}>
      {children}
    </p>
  )
}

function PreFilledBlock({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div style={{
      background: 'rgba(197,183,131,0.12)',
      border: '0.5px solid rgba(197,183,131,0.4)',
      borderRadius: '12px',
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '4px',
    }}>
      <div>
        <p style={{ fontSize: '11px', color: 'rgba(10,30,61,0.4)', margin: '0 0 2px', letterSpacing: '0.6px' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>{value}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          style={{ fontSize: '12px', fontWeight: 500, color: '#0A1E3D', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0, flexShrink: 0, marginLeft: '12px', fontFamily: 'inherit' }}
        >
          Edit
        </button>
      )}
    </div>
  )
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function originSituationLabel(s: MM4Profile['origin_situation']): string {
  switch (s) {
    case 'selling': return 'Selling my home'
    case 'renting': return 'Currently renting'
    case 'own_no_sale': return 'Own — not selling'
    case 'other': return 'Other'
    default: return 'Not specified'
  }
}

function mapIncomeToLabel(income: string | null | undefined): string {
  switch (income) {
    case 'under_50k': return 'Under $50K'
    case '50_75k': return '$50K–$75K'
    case '75_100k': return '$75K–$100K'
    case '100_150k': return '$100K–$150K'
    case '150_200k': return '$150K–$200K'
    case '200_300k': return '$200K–$300K'
    case '300k_plus': return '$300K+'
    default: return income ?? ''
  }
}

export default function Section2TheMove({ data, onChange, errors }: Props) {
  const moveOptions = useMemo(() => {
    const today = new Date()
    const opts: string[] = []
    for (let i = 0; i < 24; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
      opts.push(`${MONTHS[d.getMonth()]} ${d.getFullYear()}`)
    }
    return opts
  }, [])

  // Housing situation summary (pre-filled, read-only)
  const housingSummaryParts: string[] = []
  if (data.origin_situation) housingSummaryParts.push(originSituationLabel(data.origin_situation))
  if (data.origin_situation === 'selling') {
    if (data.home_listed === true) housingSummaryParts.push('Listed and active')
    else if (data.home_listed === false) housingSummaryParts.push('Not yet listed')
    if (data.approximate_equity) housingSummaryParts.push(`Est. equity ${data.approximate_equity}`)
    if (data.purchase_contingent) {
      const contingentMap: Record<string, string> = { yes: 'Contingent: Yes', no: 'Contingent: No', possibly: 'Contingent: Possibly', na: '' }
      const label = contingentMap[data.purchase_contingent]
      if (label) housingSummaryParts.push(label)
    }
  }
  const housingSummary = housingSummaryParts.join(' · ') || 'Not specified'

  const incomeLabel = mapIncomeToLabel(data.income_range_confirmed) || data.income_range_confirmed || 'Not specified'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 500, color: '#0A1E3D', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
          The move
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(10,30,61,0.45)', margin: 0, lineHeight: 1.6 }}>
          Help us understand your motivation and timing so we can plan the right path forward.
        </p>
      </div>

      {/* Household income — pre-filled summary with Edit */}
      <PreFilledBlock
        label="Household income"
        value={incomeLabel}
        onEdit={() => {/* navigated inline — user edits on Step 4 */}}
      />

      {/* Housing situation — pre-filled summary */}
      <PreFilledBlock
        label="Housing situation"
        value={housingSummary}
      />

      {/* Timing — 50/50 grid, top-aligned */}
      <div>
        <SectionHeading>Timing</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>
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
          <Field
            label="How flexible is your timeline?"
            required
            error={errors.timeline_flexibility}
            hint="Pre-filled from your HavenQuest profile — update if anything has changed."
          >
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
    </div>
  )
}
