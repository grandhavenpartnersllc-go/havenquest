'use client'

import type { MM4Profile } from '../../../../../types'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  errors: Record<string, string>
}

function Field({ label, hint, children }: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', color: 'rgba(10,30,61,0.5)', marginBottom: '7px' }}>
        {label}
      </label>
      {hint && <p style={{ fontSize: '12px', color: 'rgba(10,30,61,0.35)', margin: '-2px 0 8px' }}>{hint}</p>}
      {children}
    </div>
  )
}

export default function Section6Research({ data, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 500, color: '#0A1E3D', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
          Your research so far
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(10,30,61,0.45)', margin: 0, lineHeight: 1.6 }}>
          Help your Market Director understand what you&apos;ve already explored.
        </p>
      </div>

      {/* 50/50 — ruled out + already researched */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field label="Communities you've ruled out" hint="Optional">
          <textarea
            className="mm4-textarea"
            value={data.ruled_out_cities ?? ''}
            onChange={e => onChange({ ruled_out_cities: e.target.value })}
            placeholder="Any cities or neighborhoods you've already crossed off the list?"
            rows={4}
          />
        </Field>
        <Field label="Areas you've already researched" hint="Optional">
          <textarea
            className="mm4-textarea"
            value={data.areas_researched ?? ''}
            onChange={e => onChange({ areas_researched: e.target.value })}
            placeholder="Online searches, in-person visits, Zillow, local Facebook groups, etc."
            rows={4}
          />
        </Field>
      </div>

      {/* Full-width open field */}
      <Field label="Anything else your Market Director should know?" hint="Optional">
        <textarea
          className="mm4-textarea"
          value={data.additional_must_haves ?? ''}
          onChange={e => onChange({ additional_must_haves: e.target.value })}
          placeholder="Open floor — share anything that would help your MD prepare for your consultation."
          rows={4}
        />
      </Field>
    </div>
  )
}
