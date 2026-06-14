'use client'

import type { MM4Profile } from '../../../../../types'
import { getAllCities } from '../../../../../services/locationService'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
  chosenCommunities?: string[]
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

const REASONING_KEYS = ['city1_reasoning', 'city2_reasoning', 'city3_reasoning'] as const

export default function Section4TexasDirection({ data, onChange, errors, chosenCommunities }: Props) {
  const allCities = getAllCities()
  const resolvedCities = (chosenCommunities ?? [])
    .slice(0, 3)
    .map(id => allCities.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined)

  const hasCityCards = resolvedCities.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 6px' }}>
          Your Texas Direction
        </h2>
        <p style={{ fontSize: '13px', color: '#4a5568', margin: 0, lineHeight: 1.5 }}>
          Share what you&apos;ve already researched and where you&apos;re leaning — your MD will use this to sharpen your roadmap.
        </p>
      </div>

      {/* Top Choice */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Top Choice
        </p>

        {hasCityCards ? (
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px' }}>
              These are the communities you locked in during Discover. Tell us what draws you to each one.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {resolvedCities.map((city, index) => {
                const key = REASONING_KEYS[index]
                return (
                  <div
                    key={city.id}
                    style={{
                      border: '1px solid var(--card-border)',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: 'var(--card-bg)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#0076B6',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}>
                          #{index + 1}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {city.name}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                        {city.metroUsed}
                      </p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Why does {city.name} appeal to you?
                      </label>
                      <textarea
                        className="mm4-textarea"
                        value={data[key] ?? ''}
                        onChange={e => onChange({ [key]: e.target.value })}
                        placeholder={`What draws you to ${city.name}?`}
                        rows={3}
                        style={{ minHeight: '80px' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
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
      </div>

      {/* Research */}
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Research &amp; Criteria
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field
            label="Cities or communities you've ruled out"
            hint="Optional — helps us understand what you've already discarded and why."
          >
            <textarea
              className="mm4-textarea"
              value={data.ruled_out_cities ?? ''}
              onChange={e => onChange({ ruled_out_cities: e.target.value })}
              placeholder="e.g. Houston — too big; Lubbock — too far from family..."
              rows={2}
            />
          </Field>

          <Field
            label="Areas or neighborhoods you've already researched"
            hint="Online, in-person visits, Zillow searches, etc."
          >
            <textarea
              className="mm4-textarea"
              value={data.areas_researched ?? ''}
              onChange={e => onChange({ areas_researched: e.target.value })}
              placeholder="e.g. Visited Keller in April, toured Southlake neighborhoods online..."
              rows={2}
            />
          </Field>

          <Field
            label="Additional must-haves not covered by your quiz"
            hint="Specific school districts, proximity to highways, community amenities, etc."
          >
            <textarea
              className="mm4-textarea"
              value={data.additional_must_haves ?? ''}
              onChange={e => onChange({ additional_must_haves: e.target.value })}
              placeholder="e.g. Must be in Carroll ISD; within 30 min of DFW airport..."
              rows={2}
            />
          </Field>

          <Field label="Deal breakers">
            <textarea
              className="mm4-textarea"
              value={data.deal_breakers ?? ''}
              onChange={e => onChange({ deal_breakers: e.target.value })}
              placeholder="e.g. No HOA; not in a flood zone; must have walkable retail..."
              rows={2}
            />
          </Field>
        </div>
      </div>
    </div>
  )
}
