'use client'

import type { MM4Profile } from '../../../../../types'

interface Props {
  data: MM4Profile
  onChange: (updates: Partial<MM4Profile>) => void
  onSubmit: () => Promise<void>
  submitting: boolean
}

export default function Section5Notes({ data, onChange, onSubmit, submitting }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 6px' }}>
          Anything Else?
        </h2>
        <p style={{ fontSize: '13px', color: '#4a5568', margin: 0, lineHeight: 1.5 }}>
          This is your open field. Share anything that didn&apos;t fit the earlier sections — circumstances, concerns,
          context, or anything you want your Market Director to know before your consultation.
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          Notes for your Market Director
        </label>
        <textarea
          className="mm4-textarea"
          style={{ minHeight: '160px' }}
          value={data.special_notes ?? ''}
          onChange={e => onChange({ special_notes: e.target.value })}
          placeholder="Share anything on your mind — competing priorities, nervous about the process, unique circumstances, questions you already have..."
          rows={6}
        />
      </div>

      {/* Submit callout */}
      <div style={{
        backgroundColor: 'rgba(0, 118, 182, 0.06)',
        border: '1px solid rgba(0, 118, 182, 0.2)',
        borderRadius: '10px',
        padding: '16px 20px',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.65, margin: 0 }}>
          When you click <strong>Complete My Profile</strong>, your Market Director will be notified and will reach
          out to schedule your Navigator Activation consultation. You'll also receive a confirmation email with
          next steps.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          style={{
            padding: '12px 32px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: submitting ? 'rgba(255,255,255,0.6)' : '#ffffff',
            backgroundColor: submitting ? '#5BA8D0' : '#0076B6',
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s',
            letterSpacing: '0.01em',
          }}
        >
          {submitting ? 'Submitting…' : 'Complete My Profile →'}
        </button>
      </div>
    </div>
  )
}
