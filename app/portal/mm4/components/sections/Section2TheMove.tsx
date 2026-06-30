'use client'

import { useMemo } from 'react'
import type { MM4Profile } from '../../../../../types'
import ConfirmRow from '../ConfirmRow'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
  quizWorkSituation?: string | null
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
              color: selected ? '#FFFFFF' : 'rgba(10,30,61,0.55)',
              backgroundColor: selected ? '#0A1E3D' : 'transparent',
              border: `0.5px solid ${selected ? '#0A1E3D' : 'rgba(10,30,61,0.15)'}`,
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

function mapWorkSituationToLabel(ws: string | null | undefined): string {
  switch (ws) {
    case 'fully_remote': return 'fully remote'
    case 'hybrid': return 'hybrid'
    case 'in_office':
    case 'on_site': return 'in-office'
    case 'self_employed': return 'self-employed'
    case 'retired':
    case 'not_working': return ''
    default: return ''
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

export default function Section2TheMove({ data, onChange, errors, quizWorkSituation }: Props) {
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

  const incomeLabel = mapIncomeToLabel(data.income_range_confirmed)
  const workLabel = mapWorkSituationToLabel(quizWorkSituation)
  const financialConfirmValue = [incomeLabel, workLabel].filter(Boolean).join(' · ')

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

      {financialConfirmValue && (
        <ConfirmRow label="Financial picture" value={financialConfirmValue} />
      )}

      {/* Timing */}
      <div>
        <SectionHeading>Timing</SectionHeading>
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

      {/* Current housing situation */}
      <div>
        <SectionHeading>Current Housing Situation</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Field
            label="What's your current housing situation?"
            required
            error={errors.origin_situation}
            hint="Pre-filled from your HavenQuest profile — update if anything has changed."
          >
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
