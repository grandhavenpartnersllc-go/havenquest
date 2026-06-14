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

export default function Section1Identity({ data, onChange, errors }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
          Your Information
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Tell us who's making this move so your Market Director can reach you.
        </p>
      </div>

      {/* Row 1: Primary contact names */}
      <div>
        <MiniLabel>Primary Contact</MiniLabel>
        <div style={col2}>
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

      {/* Row 2: Partner names */}
      <div>
        <MiniLabel>Partner / Spouse (optional)</MiniLabel>
        <div style={col2}>
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

      {/* Rows 3–4: Location */}
      <div>
        <MiniLabel>Current Location</MiniLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px', gap: '12px' }}>
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

      {/* Row 5: Phone / Preferred contact */}
      <div>
        <MiniLabel>Contact</MiniLabel>
        <div style={col2}>
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
        </div>
      </div>

    </div>
  )
}
