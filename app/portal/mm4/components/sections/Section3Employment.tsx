'use client'

import type { MM4Profile } from '../../../../../types'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
}

type EmploymentStatus = MM4Profile['employment_status']
type WorkArrangement = MM4Profile['work_arrangement']

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

const isEmployed = (status: EmploymentStatus | undefined) =>
  status === 'employed_w2' || status === 'self_employed' || status === 'employer_relocation'

export default function Section3Employment({ data, onChange, errors }: Props) {
  const showRelocation = data.employment_status === 'employer_relocation'
  const showWorkArrangement = isEmployed(data.employment_status)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Employment &amp; Finances
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          This helps your Market Director understand your budget ceiling and workplace flexibility.
        </p>
      </div>

      {/* Employment */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Employment
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="Employment status" required error={errors.employment_status}>
            <PillGroup
              options={[
                { label: 'Employed (W-2)', value: 'employed_w2' },
                { label: 'Self-employed', value: 'self_employed' },
                { label: 'Retired', value: 'retired' },
                { label: 'Employer relocation', value: 'employer_relocation' },
                { label: 'Other', value: 'other' },
              ]}
              value={data.employment_status}
              onSelect={v => {
                const updates: Partial<MM4Profile> = { employment_status: v as EmploymentStatus }
                if (!isEmployed(v as EmploymentStatus)) {
                  updates.work_arrangement = 'na'
                  updates.relocation_package = undefined
                }
                onChange(updates)
              }}
            />
          </Field>

          {showRelocation && (
            <Field
              label="Employer relocation package?"
              hint="This may affect your budget and timeline planning."
            >
              <PillGroup
                options={[
                  { label: 'Yes, included', value: 'true' },
                  { label: 'No / Not sure', value: 'false' },
                ]}
                value={data.relocation_package === undefined ? undefined : String(data.relocation_package) as 'true' | 'false'}
                onSelect={v => onChange({ relocation_package: v === 'true' })}
              />
            </Field>
          )}

          {showWorkArrangement && (
            <Field label="Work arrangement" required error={errors.work_arrangement}>
              <PillGroup
                options={[
                  { label: 'Fully remote', value: 'fully_remote' },
                  { label: 'Hybrid', value: 'hybrid' },
                  { label: 'In-person', value: 'in_person' },
                ]}
                value={data.work_arrangement === 'na' ? undefined : data.work_arrangement}
                onSelect={v => onChange({ work_arrangement: v as WorkArrangement })}
              />
            </Field>
          )}
        </div>
      </div>

      {/* Financial context */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Financial Context
        </p>
        <Field
          label="Annual household income"
          hint="Pre-filled from your HavenQuest profile — update if anything has changed."
        >
          <input
            className="mm4-input"
            type="text"
            value={data.income_range_confirmed ?? ''}
            onChange={e => onChange({ income_range_confirmed: e.target.value })}
            placeholder="e.g. $125,000"
          />
        </Field>
      </div>
    </div>
  )
}
