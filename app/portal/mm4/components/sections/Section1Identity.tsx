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
  error,
}: {
  options: { label: string; value: T }[]
  value: T | undefined
  onSelect: (v: T) => void
  error?: string
}) {
  return (
    <>
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
      {error && <p style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px' }}>{error}</p>}
    </>
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

export default function Section1Identity({ data, onChange, errors }: Props) {
  const hasChildren = (data.num_children ?? 0) > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Identity &amp; Household
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Tell us who's making this move so your Market Director can personalize your roadmap.
        </p>
      </div>

      {/* Primary contact */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Primary Contact
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="First name" required error={errors.primary_first_name}>
            <input
              className="mm4-input"
              type="text"
              value={data.primary_first_name ?? ''}
              onChange={e => onChange({ primary_first_name: e.target.value })}
              placeholder="First"
              autoComplete="given-name"
            />
          </Field>
          <Field label="Last name" required error={errors.primary_last_name}>
            <input
              className="mm4-input"
              type="text"
              value={data.primary_last_name ?? ''}
              onChange={e => onChange({ primary_last_name: e.target.value })}
              placeholder="Last"
              autoComplete="family-name"
            />
          </Field>
        </div>
      </div>

      {/* Partner */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Partner / Spouse <span style={{ fontWeight: 400, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 'normal' }}>(if applicable)</span>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="First name">
            <input
              className="mm4-input"
              type="text"
              value={data.partner_first_name ?? ''}
              onChange={e => onChange({ partner_first_name: e.target.value })}
              placeholder="First"
            />
          </Field>
          <Field label="Last name">
            <input
              className="mm4-input"
              type="text"
              value={data.partner_last_name ?? ''}
              onChange={e => onChange({ partner_last_name: e.target.value })}
              placeholder="Last"
            />
          </Field>
        </div>
      </div>

      {/* Current address */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Current Location
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="Street address">
            <input
              className="mm4-input"
              type="text"
              value={data.current_address ?? ''}
              onChange={e => onChange({ current_address: e.target.value })}
              placeholder="123 Main Street"
              autoComplete="street-address"
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
            <Field label="City">
              <input
                className="mm4-input"
                type="text"
                value={data.current_city ?? ''}
                onChange={e => onChange({ current_city: e.target.value })}
                placeholder="City"
                autoComplete="address-level2"
              />
            </Field>
            <Field label="State">
              <input
                className="mm4-input"
                type="text"
                value={data.current_state ?? ''}
                onChange={e => onChange({ current_state: e.target.value })}
                placeholder="CA"
                maxLength={2}
                autoComplete="address-level1"
              />
            </Field>
            <Field label="ZIP">
              <input
                className="mm4-input"
                type="text"
                value={data.current_zip ?? ''}
                onChange={e => onChange({ current_zip: e.target.value })}
                placeholder="90210"
                maxLength={5}
                autoComplete="postal-code"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Contact preferences */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Contact Preferences
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="Phone number" required error={errors.phone}>
            <input
              className="mm4-input"
              type="tel"
              value={data.phone ?? ''}
              onChange={e => onChange({ phone: e.target.value })}
              placeholder="(555) 000-0000"
              autoComplete="tel"
            />
          </Field>
          <Field label="Preferred contact method" required error={errors.preferred_contact}>
            <PillGroup
              options={[
                { label: 'Phone call', value: 'phone' },
                { label: 'Text', value: 'text' },
                { label: 'Email', value: 'email' },
              ]}
              value={data.preferred_contact}
              onSelect={v => onChange({ preferred_contact: v as MM4Profile['preferred_contact'] })}
            />
          </Field>
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
        </div>
      </div>

      {/* Household composition */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Household
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

          {hasChildren && (
            <Field label="Children's ages">
              <input
                className="mm4-input"
                type="text"
                value={data.children_ages ?? ''}
                onChange={e => onChange({ children_ages: e.target.value })}
                placeholder="e.g. 3, 7, 12"
              />
            </Field>
          )}

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

          {data.has_pets && (
            <Field label="Pet details (type, size, number)">
              <input
                className="mm4-input"
                type="text"
                value={data.pet_details ?? ''}
                onChange={e => onChange({ pet_details: e.target.value })}
                placeholder="e.g. Two medium dogs"
              />
            </Field>
          )}
        </div>
      </div>
    </div>
  )
}
