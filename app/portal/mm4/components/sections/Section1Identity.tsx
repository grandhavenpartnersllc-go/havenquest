'use client'

import type { MM4Profile } from '../../../../../types'
import { formatPhone } from '../../../../../utils/formatters'
import { lookupZipCityState } from '../../../../../utils/zipLookup'
import ConfirmRow from '../ConfirmRow'

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
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {options.map(opt => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            style={{
              padding: '7px 13px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: selected ? 500 : 400,
              color: selected ? '#ffffff' : '#86868b',
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
      <label style={{ display: 'block', fontSize: '12px', color: '#86868b', marginBottom: '6px' }}>
        {label}
        {required && <span style={{ color: '#0076B6', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

async function lookupZip(zip: string, onChange: (updates: Partial<MM4Profile>) => void) {
  const result = await lookupZipCityState(zip)
  if (!result) return
  onChange({
    ...(result.city ? { current_city: result.city } : {}),
    ...(result.state ? { current_state: result.state } : {}),
  })
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '12px',
      fontWeight: 500,
      letterSpacing: '0.05em',
      color: '#86868b',
      textTransform: 'uppercase',
      margin: '24px 0 10px',
    }}>
      {children}
    </p>
  )
}

const col2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }

export default function Section1Identity({ data, onChange, errors }: Props) {
  const originValue = [data.current_city, data.current_state, data.current_zip]
    .filter(Boolean)
    .join(', ')
    .replace(/, (\d{5})$/, ' $1')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#1d1d1f', margin: '0 0 4px' }}>
          Your information
        </h2>
        <p style={{ fontSize: '15px', color: '#86868b', margin: 0, lineHeight: 1.5 }}>
          Tell us who&apos;s making this move so your Market Director can reach you.
        </p>
      </div>

      {/* Confirm rows */}
      {data.primary_first_name && (
        <ConfirmRow
          label="First name"
          value={data.primary_first_name}
          onEdit={v => onChange({ primary_first_name: v })}
        />
      )}
      {originValue && (
        <ConfirmRow
          label="Origin"
          value={originValue}
        />
      )}

      {/* Primary contact */}
      <SectionHeading>Primary Contact</SectionHeading>
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

      {/* Partner names */}
      <SectionHeading>Partner / Spouse (optional)</SectionHeading>
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

      {/* Current location */}
      <SectionHeading>Current Location</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 60px 100px', gap: '10px' }}>
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
        <Field label="St">
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
            onBlur={e => {
              const zip = e.target.value.trim()
              if (/^\d{5}$/.test(zip)) void lookupZip(zip, onChange)
            }}
            placeholder="90210"
            maxLength={5}
            autoComplete="postal-code"
          />
        </Field>
      </div>

      {/* Contact */}
      <SectionHeading>Contact</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: '16px' }}>
        <Field label="Phone number" required error={errors.phone}>
          <input
            className="mm4-input"
            type="tel"
            value={data.phone ?? ''}
            onChange={e => onChange({ phone: formatPhone(e.target.value) })}
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
  )
}
