'use client'

import type { MM4Profile } from '../../../../../types'
import ConfirmRow from '../ConfirmRow'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
  quizWorkSituation?: string | null
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

function mapWorkSituationToLabel(ws: string | null | undefined): string {
  switch (ws) {
    case 'fully_remote': return 'Fully remote'
    case 'hybrid': return 'Hybrid'
    case 'in_office':
    case 'on_site': return 'In-office'
    case 'self_employed': return 'Self-employed'
    default: return ''
  }
}

function mapWorkSituationToArrangement(ws: string | null | undefined): WorkArrangement | undefined {
  switch (ws) {
    case 'fully_remote': return 'fully_remote'
    case 'hybrid': return 'hybrid'
    case 'in_office':
    case 'on_site': return 'in_person'
    default: return undefined
  }
}

const isEmployed = (status: EmploymentStatus | undefined) =>
  status === 'employed_w2' || status === 'self_employed' || status === 'employer_relocation'

export default function Section3Employment({ data, onChange, errors, quizWorkSituation }: Props) {
  const showRelocation = data.employment_status === 'employer_relocation'
  const showWorkArrangement = isEmployed(data.employment_status)

  const quizWorkLabel = mapWorkSituationToLabel(quizWorkSituation)
  const quizWorkArrangement = mapWorkSituationToArrangement(quizWorkSituation)
  const showWorkArrangementAsConfirm = showWorkArrangement && !!quizWorkLabel

  // income field removed — shown as pre-filled block on Step 3 (The Move)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 500, color: '#0A1E3D', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
          Employment &amp; finances
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(10,30,61,0.45)', margin: 0, lineHeight: 1.6 }}>
          This helps your Market Director understand your budget ceiling and workplace flexibility.
        </p>
      </div>

      {/* Employment */}
      <div>
        <SectionHeading>Employment</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: showWorkArrangementAsConfirm ? '1fr 1fr' : '1fr', gap: '16px' }}>
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

          {showWorkArrangementAsConfirm ? (
            <div>
              <ConfirmRow
                label="Work arrangement"
                value={quizWorkLabel}
                onEdit={() => {
                  onChange({ work_arrangement: quizWorkArrangement })
                }}
              />
            </div>
          ) : showWorkArrangement ? (
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
          ) : null}
        </div>
      </div>

      {/* Relocation package */}
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

    </div>
  )
}
