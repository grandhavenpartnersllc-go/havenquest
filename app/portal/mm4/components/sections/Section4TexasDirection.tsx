'use client'

import type { MM4Profile } from '../../../../../types'
import { getAllCities } from '../../../../../services/locationService'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
  chosenCommunities?: string[]
  topMatchNames?: string[]
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
      {hint && <p style={{ fontSize: '12px', color: 'rgba(10,30,61,0.4)', margin: '-2px 0 8px' }}>{hint}</p>}
      {children}
      {error && <p style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

const REASONING_KEYS = ['city1_reasoning', 'city2_reasoning', 'city3_reasoning'] as const

export default function Section4TexasDirection({ data, onChange, errors, chosenCommunities, topMatchNames }: Props) {
  const allCities = getAllCities()
  const resolvedCities = (chosenCommunities ?? [])
    .slice(0, 3)
    .map(id => allCities.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined)

  const hasCityCards = resolvedCities.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 500, color: '#0A1E3D', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
          Your Texas direction
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(10,30,61,0.45)', margin: 0, lineHeight: 1.6 }}>
          Share what you&apos;ve already researched and where you&apos;re leaning — your MD will use this to sharpen your roadmap.
        </p>
      </div>

      {/* City cards — 25/75 horizontal layout */}
      {hasCityCards ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(10,30,61,0.45)', margin: '0 0 4px' }}>
            These are the communities you locked in during Refine. Tell us what draws you to each one.
          </p>
          {resolvedCities.map((city, index) => {
            const key = REASONING_KEYS[index]
            return (
              <div
                key={city.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  border: '0.5px solid rgba(10,30,61,0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  alignItems: 'stretch',
                }}
              >
                {/* Left 25% — city image */}
                <div style={{ width: '25%', flexShrink: 0 }}>
                  <img
                    src={city.cityImageUrl ?? '/images/texas-flag.svg'}
                    alt={city.name}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                  />
                </div>
                {/* Right 75% — name, metro, textarea */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(197,183,131,0.9)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        #{index + 1}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#0A1E3D' }}>
                        {city.name}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(10,30,61,0.4)' }}>
                      {city.metroUsed}
                    </p>
                  </div>
                  <textarea
                    className="mm4-textarea"
                    value={data[key] ?? ''}
                    onChange={e => onChange({ [key]: e.target.value })}
                    placeholder={`Share what appeals to you about ${city.name}...`}
                    rows={2}
                    style={{ minHeight: '64px', flex: 1 }}
                  />
                </div>
              </div>
            )
          })}
          <p style={{ fontSize: '12px', color: 'rgba(10,30,61,0.35)', fontStyle: 'italic', margin: '4px 0 0' }}>
            These selections reflect everything you&apos;ve shared so far — your Market Director may refine them as your conversation goes deeper.
          </p>
        </div>
      ) : (
        <Field
          label="Confirmed target city / community"
          required
          error={errors.confirmed_target_city}
          hint="Pre-filled from your top match — update if you've shifted focus."
        >
          <input
            className="mm4-input"
            type="text"
            value={data.confirmed_target_city ?? ''}
            onChange={e => onChange({ confirmed_target_city: e.target.value })}
            placeholder="e.g. Southlake, Frisco, The Woodlands"
          />
        </Field>
      )}

      {/* Confidence */}
      <Field label="How confident are you in your top choice?">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {([
            { label: 'Very confident', value: 'very_confident' },
            { label: 'Leaning, but open', value: 'leaning_open' },
            { label: 'Genuinely torn between these', value: 'torn' },
          ] as { label: string; value: MM4Profile['target_confidence'] }[]).map(opt => {
            const selected = data.target_confidence === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ target_confidence: opt.value })}
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
      </Field>
    </div>
  )
}
