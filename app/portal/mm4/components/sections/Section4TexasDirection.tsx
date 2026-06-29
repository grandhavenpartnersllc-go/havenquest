'use client'

import type { MM4Profile } from '../../../../../types'
import { getAllCities } from '../../../../../services/locationService'
import ConfirmRow from '../ConfirmRow'

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
      <label style={{ display: 'block', fontSize: '12px', color: '#86868b', marginBottom: '6px' }}>
        {label}
        {required && <span style={{ color: '#0076B6', marginLeft: '2px' }}>*</span>}
      </label>
      <p style={{ fontSize: '12px', color: hint ? '#86868b' : 'transparent', margin: '-2px 0 8px' }}>
        {hint || ' '}
      </p>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px' }}>{error}</p>}
    </div>
  )
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

type TargetConfidence = MM4Profile['target_confidence']

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

const REASONING_KEYS = ['city1_reasoning', 'city2_reasoning', 'city3_reasoning'] as const

export default function Section4TexasDirection({ data, onChange, errors, chosenCommunities, topMatchNames }: Props) {
  const allCities = getAllCities()
  const resolvedCities = (chosenCommunities ?? [])
    .slice(0, 3)
    .map(id => allCities.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined)

  const hasCityCards = resolvedCities.length > 0

  const communityNames = resolvedCities.length > 0
    ? resolvedCities.map(c => c.name)
    : (topMatchNames ?? [])
  const communitiesConfirmValue = communityNames.slice(0, 3).join(', ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#1d1d1f', margin: '0 0 6px' }}>
          Your Texas direction
        </h2>
        <p style={{ fontSize: '15px', color: '#86868b', margin: 0, lineHeight: 1.5 }}>
          Share what you&apos;ve already researched and where you&apos;re leaning — your MD will use this to sharpen your roadmap.
        </p>
      </div>

      {communitiesConfirmValue && (
        <ConfirmRow label="Target communities" value={communitiesConfirmValue} />
      )}

      {/* Top Choice */}
      <div>
        <SectionHeading>Top Choice</SectionHeading>

        {hasCityCards ? (
          <div>
            <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 12px' }}>
              These are the communities you locked in during Refine. Tell us what draws you to each one.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {resolvedCities.map((city, index) => {
                const key = REASONING_KEYS[index]
                return (
                  <div
                    key={city.id}
                    style={{
                      background: '#F5F5F7',
                      borderRadius: '12px',
                      padding: '16px',
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
                        <span style={{ fontSize: '16px', fontWeight: 500, color: '#1d1d1f' }}>
                          {city.name}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#86868b' }}>
                        {city.metroUsed}
                      </p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#86868b', marginBottom: '6px' }}>
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

        <p style={{ fontSize: '12px', color: '#86868b', fontStyle: 'italic', margin: '12px 0 0' }}>
          These selections reflect everything you&apos;ve shared so far — your Market Director may refine them as your conversation goes deeper.
        </p>
      </div>

      {/* Research */}
      <div>
        <SectionHeading>Research &amp; Criteria</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
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
            </div>
            <div style={{ flex: 1 }}>
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

          <Field label="How confident are you in your top choice?">
            <PillGroup
              options={[
                { label: 'Very confident', value: 'very_confident' },
                { label: 'Leaning, but open', value: 'leaning_open' },
                { label: 'Genuinely torn between these', value: 'torn' },
              ]}
              value={data.target_confidence}
              onSelect={v => onChange({ target_confidence: v as TargetConfidence })}
            />
          </Field>
        </div>
      </div>
    </div>
  )
}
