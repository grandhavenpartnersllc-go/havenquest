'use client'

import type { MM4Profile } from '../../../../../types'
import { formatPhone } from '../../../../../utils/formatters'
import { lookupZipCityState } from '../../../../../utils/zipLookup'

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

function Field({ label, required, error, children }: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(10,30,61,0.5)', marginBottom: '7px' }}>
        {label}
        {required && <span style={{ color: '#C5B783', marginLeft: '2px' }}>*</span>}
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

const col2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }

// Combined pre-filled summary block: Name (left) + Origin (right) + optional Edit
function SummaryBlock({ name, origin, onEditName }: { name: string; origin: string; onEditName?: () => void }) {
  if (!name && !origin) return null
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
      <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
        {name && (
          <div>
            <p style={{ fontSize: '11px', color: 'rgba(10,30,61,0.4)', margin: '0 0 2px', letterSpacing: '0.6px' }}>Name</p>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>{name}</p>
          </div>
        )}
        {origin && (
          <div>
            <p style={{ fontSize: '11px', color: 'rgba(10,30,61,0.4)', margin: '0 0 2px', letterSpacing: '0.6px' }}>Origin</p>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1E3D', margin: 0 }}>{origin}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Section1Identity({ data, onChange, errors }: Props) {
  const originValue = [data.current_city, data.current_state, data.current_zip]
    .filter(Boolean)
    .join(', ')
    .replace(/, (\d{5})$/, ' $1')

  const showSummary = !!(data.primary_first_name || originValue)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 500, color: '#0A1E3D', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
          Your information
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(10,30,61,0.45)', margin: 0, lineHeight: 1.6 }}>
          Tell us who&apos;s making this move so your Market Director can reach you.
        </p>
      </div>

      {/* Combined pre-filled summary block */}
      {showSummary && (
        <SummaryBlock
          name={data.primary_first_name ?? ''}
          origin={originValue}
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

      {/* Current location — address full width, then City / State+ZIP 50/50 */}
      <SectionHeading>Current Location</SectionHeading>
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

      {/* Contact — Phone + Preferred method 50/50, then Best time full width below */}
      <SectionHeading>Contact</SectionHeading>
      <div style={col2}>
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
      </div>
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
  )
}
