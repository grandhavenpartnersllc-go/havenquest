'use client'

import { CheckCircle, CalendarDays } from 'lucide-react'
import type { MM4Profile } from '../../../../types'

const BOOKINGS_URL =
  'https://calendly.com/craig-asbach-havenquest/havenquest-consulation'

interface Props {
  data: MM4Profile
  email: string
}

export default function MM4Confirmation({ data, email }: Props) {
  const name = data.primary_first_name ? `, ${data.primary_first_name}` : ''

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '420px',
      padding: '48px 32px',
      textAlign: 'center',
      gap: '24px',
    }}>
      {/* Check icon */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        border: '2px solid rgba(46, 125, 50, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CheckCircle size={36} style={{ color: '#2e7d32' }} />
      </div>

      {/* Heading */}
      <div style={{ maxWidth: '480px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
          Your profile is complete{name}.
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          Your Market Director has been notified and will reach out within one business day to
          schedule your Navigator Activation consultation.
        </p>
      </div>

      {/* Book button */}
      <a
        href={BOOKINGS_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '13px 28px',
          borderRadius: '8px',
          backgroundColor: '#0A1E3D',
          color: '#C5B783',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: '0.01em',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
      >
        <CalendarDays size={16} />
        Book My Consultation
      </a>

      {/* Details */}
      <div style={{
        maxWidth: '420px',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '10px',
        padding: '16px 20px',
        textAlign: 'left',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 8px' }}>
          A confirmation has been sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          MM5 — <em>Your Texas Plan</em> — will unlock after your Market Director activates it
          following your consultation.
        </p>
      </div>
    </div>
  )
}
