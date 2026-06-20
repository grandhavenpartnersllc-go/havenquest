'use client'

import type { MM4Profile } from '../../../../../types'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
  householdSize?: string | null
}

type HouseholdMember = { first_name: string; age: number; relationship: string }

const RELATIONSHIP_OPTIONS = [
  { label: 'Spouse / Partner', value: 'spouse_partner' },
  { label: 'Child', value: 'child' },
  { label: 'Parent', value: 'parent' },
  { label: 'Other', value: 'other' },
]

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
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {options.map(opt => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
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

const col2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }

export default function Section2Household({ data, onChange, errors, householdSize }: Props) {
  const hasChildren = (data.num_children ?? 0) > 0
  const members: HouseholdMember[] = data.household_members ?? []

  function addMember() {
    if (members.length >= 10) return
    onChange({ household_members: [...members, { first_name: '', age: 0, relationship: 'other' }] })
  }

  function removeMember(idx: number) {
    onChange({ household_members: members.filter((_, i) => i !== idx) })
  }

  function updateMember(idx: number, updates: Partial<HouseholdMember>) {
    onChange({
      household_members: members.map((m, i) => i === idx ? { ...m, ...updates } : m),
    })
  }

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

      {/* Adults / Children */}
      <div style={col2}>
        <Field
          label="Adults in household"
          required
          error={errors.num_adults}
          hint={householdSize ? `You told us your household size was ${householdSize} when you started — let's get the exact breakdown here.` : undefined}
        >
          <input
            className="mm4-input"
            type="number"
            min={1}
            max={20}
            value={data.num_adults ?? 1}
            onChange={e => onChange({ num_adults: Math.max(1, parseInt(e.target.value) || 1) })}
          />
        </Field>
        <Field label="Children in household">
          <input
            className="mm4-input"
            type="number"
            min={0}
            max={20}
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

      {/* Household members table */}
      <div>
        <MiniLabel>Household Members</MiniLabel>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.5 }}>
          Tell us a little about everyone making this move — your Market Director will use this to personalize your community search.
        </p>

        {members.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            {members.map((member, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 1fr 32px',
                  gap: '10px',
                  alignItems: 'start',
                  padding: '12px',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--portal-bg)',
                }}
              >
                <Field label="First name">
                  <input
                    className="mm4-input"
                    type="text"
                    value={member.first_name}
                    onChange={e => updateMember(idx, { first_name: e.target.value })}
                    placeholder="First name"
                  />
                </Field>
                <Field label="Age">
                  <input
                    className="mm4-input"
                    type="number"
                    min={0}
                    max={120}
                    value={member.age === 0 ? '' : member.age}
                    onChange={e => updateMember(idx, { age: parseInt(e.target.value) || 0 })}
                    placeholder="Age"
                  />
                </Field>
                <Field label="Relationship">
                  <PillGroup
                    options={RELATIONSHIP_OPTIONS}
                    value={member.relationship as typeof RELATIONSHIP_OPTIONS[number]['value']}
                    onSelect={v => updateMember(idx, { relationship: v })}
                  />
                </Field>
                <div style={{ paddingTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid var(--card-border)',
                      backgroundColor: 'transparent',
                      color: 'var(--text-muted)',
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                    aria-label="Remove member"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {members.length < 10 && (
          <button
            type="button"
            onClick={addMember}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0076B6',
              backgroundColor: 'transparent',
              border: '1.5px dashed #0076B6',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            + Add another person
          </button>
        )}
      </div>

    </div>
  )
}
